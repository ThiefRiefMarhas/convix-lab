/**
 * Content Processing Pipeline
 * 
 * Handles: summarization, caching, token counting, and content deduplication.
 * This is the "brain" layer between raw web data and the AI model.
 * 
 * Flow:
 *   Raw content → Check cache → Summarize (if new) → Store with token count → Return summary
 *
 * This saves 80-90% of tokens by:
 * 1. Summarizing long web pages into concise context
 * 2. Caching results so we never summarize the same URL twice
 * 3. Tracking token counts for budget management
 */

import { supabaseAdmin } from './supabase-admin.js';
import { createCompletion, ChatMessage } from './openrouter.js';

// ─── Token Estimation ─────────────────────────────────────

/**
 * Rough token count estimation (1 token ≈ 4 chars for English, 2 chars for CJK).
 * This avoids needing a tokenizer library.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Rough heuristic: avg 4 chars per token for English
  return Math.ceil(text.length / 4);
}

// ─── Content Cache ────────────────────────────────────────

interface CachedContent {
  title: string;
  summary: string;
  summaryTokens: number;
  rawContent: string;
  domain: string;
  fromCache: boolean;
}

/**
 * Check if we already have this URL/query cached.
 * Returns cached summary if found and not expired.
 */
export async function getCachedContent(cacheType: 'url' | 'search_query', cacheKey: string): Promise<CachedContent | null> {
  const { data, error } = await supabaseAdmin
    .from('content_cache')
    .select('title, summary, summary_tokens, raw_content, domain')
    .eq('cache_type', cacheType)
    .eq('cache_key', cacheKey)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data || !data.summary) return null;

  // Increment hit count
  await supabaseAdmin
    .from('content_cache')
    .update({ hit_count: (data as any).hit_count + 1 || 1 })
    .eq('cache_type', cacheType)
    .eq('cache_key', cacheKey);

  return {
    title: data.title || '',
    summary: data.summary,
    summaryTokens: data.summary_tokens || estimateTokens(data.summary),
    rawContent: data.raw_content || '',
    domain: data.domain || '',
    fromCache: true,
  };
}

/**
 * Store content in cache with its AI-generated summary.
 */
export async function cacheContent(params: {
  cacheType: 'url' | 'search_query';
  cacheKey: string;
  title: string;
  rawContent: string;
  summary: string;
  domain?: string;
  contentType?: string;
}): Promise<void> {
  const summaryTokens = estimateTokens(params.summary);
  const wordCount = params.rawContent.split(/\s+/).length;

  await supabaseAdmin
    .from('content_cache')
    .upsert({
      cache_type: params.cacheType,
      cache_key: params.cacheKey,
      title: params.title,
      raw_content: params.rawContent.substring(0, 50000), // Cap raw storage at 50k chars
      summary: params.summary,
      summary_tokens: summaryTokens,
      domain: params.domain || '',
      content_type: params.contentType || 'webpage',
      word_count: wordCount,
      fetched_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    }, { onConflict: 'cache_type,cache_key' });
}

// ─── Content Summarization ────────────────────────────────

/**
 * Summarize a long piece of content into a concise format for LLM context.
 * Uses the cheapest/fastest model to save tokens.
 * 
 * Input: ~5000 chars of raw content
 * Output: ~500 chars summary (saves ~90% tokens)
 */
export async function summarizeContent(content: string, contentType: string = 'webpage'): Promise<string> {
  if (!content || content.length < 200) return content; // Too short to summarize

  // Truncate input to prevent excessive token use on summarization itself
  const truncated = content.substring(0, 6000);

  const prompt = contentType === 'search_results'
    ? `Summarize these search results into a concise market intelligence brief. Focus on: key competitors, market size signals, trends, and gaps. Be factual and data-driven. Max 200 words.\n\nSearch results:\n${truncated}`
    : `Summarize this webpage content into a concise intelligence brief for startup market research. Focus on: what the company/product does, their target market, pricing signals, unique features, and competitive positioning. Be factual. Max 150 words.\n\nContent:\n${truncated}`;

  try {
    const summary = await createCompletion(
      [{ role: 'user', content: prompt }],
      'Convix Fast' // Use fastest/cheapest model for summarization
    );
    return summary;
  } catch (error) {
    console.error('Summarization failed:', error);
    // Fallback: return truncated content
    return content.substring(0, 500) + '...';
  }
}

// ─── Full Pipeline ────────────────────────────────────────

/**
 * Process web content through the full pipeline:
 * 1. Check cache
 * 2. If miss: summarize → cache → return
 * 3. If hit: return cached summary
 */
export async function processContent(params: {
  cacheType: 'url' | 'search_query';
  cacheKey: string;
  title: string;
  rawContent: string;
  domain?: string;
  contentType?: string;
}): Promise<CachedContent> {
  // 1. Check cache
  const cached = await getCachedContent(params.cacheType, params.cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${params.cacheType}: ${params.cacheKey.substring(0, 60)}`);
    return cached;
  }

  console.log(`[Cache MISS] ${params.cacheType}: ${params.cacheKey.substring(0, 60)}`);

  // 2. Summarize
  const summary = await summarizeContent(params.rawContent, params.contentType);

  // 3. Cache
  await cacheContent({
    ...params,
    summary,
  });

  return {
    title: params.title,
    summary,
    summaryTokens: estimateTokens(summary),
    rawContent: params.rawContent,
    domain: params.domain || '',
    fromCache: false,
  };
}

/**
 * Process multiple search results through the pipeline.
 * Batches cache lookups for efficiency.
 */
export async function processSearchResults(results: Array<{
  url: string;
  title: string;
  content: string;
  domain: string;
}>): Promise<Array<CachedContent & { url: string }>> {
  const processed: Array<CachedContent & { url: string }> = [];

  // Process in parallel (max 3 concurrent to avoid rate limits)
  const batchSize = 3;
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (r) => {
        const result = await processContent({
          cacheType: 'url',
          cacheKey: r.url,
          title: r.title,
          rawContent: r.content,
          domain: r.domain,
          contentType: 'webpage',
        });
        return { ...result, url: r.url };
      })
    );
    processed.push(...batchResults);
  }

  return processed;
}
