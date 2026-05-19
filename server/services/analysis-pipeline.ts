/**
 * Analysis Pipeline — 4-Phase Orchestrator
 *
 * Runs 4 sequential phases of web research, each with multiple
 * parallel searches. Streams progress events to the client via SSE.
 *
 * Phase 1: Competitor Analysis    (~40 sources)
 * Phase 2: Market Gap Analysis    (~40 sources)
 * Phase 3: Community Signals      (~30 sources)
 * Phase 4: Strategic Synthesis    (~20 sources)
 */

import { searchWeb, extractDomain } from './tavily.js';
import { scrapeUrl } from './scraper.js';
import { processSearchResults, estimateTokens } from './content-pipeline.js';
import { createCompletion, ChatMessage } from './openrouter.js';
import { supabaseAdmin, incrementUsage } from './supabase-admin.js';
import { getPhaseSearchQueries, PHASE_NAMES, ANALYSIS_PROMPT } from '../prompts/system.js';
import { formatToolResultsForContext } from './context-builder.js';

export interface PhaseResult {
  phase: number;
  name: string;
  sources: Array<{
    url: string;
    title: string;
    domain: string;
    snippet: string;
    summary: string;
    fromCache: boolean;
  }>;
  phaseSummary: string;
}

// Utility for timeout
const withTimeout = <T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<T>(resolve => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    timeout
  ]);
};

/**
 * Dynamically detects if the given text is in Indonesian language.
 */
export function detectIndonesian(text: string): boolean {
  if (!text) return false;
  const indonesianWords = [
    'saya', 'aku', 'ada', 'yang', 'ingin', 'buat', 'adalah', 'itu', 'kopi', 'susu',
    'di', 'untuk', 'dan', 'dengan', 'startup', 'bagaimana', 'apa', 'bisa', 'kamu',
    'kita', 'ya', 'ga', 'tidak', 'dari', 'ke', 'ini', 'itu', 'mereka'
  ];
  const words = text.toLowerCase().split(/[^a-zA-Z]+/);
  return words.some(w => indonesianWords.includes(w));
}

export interface AnalysisProgress {
  phase: number;
  phaseName: string;
  status: 'starting' | 'searching' | 'scraping' | 'summarizing' | 'complete';
  sourcesFound: number;
  totalQueries: number;
  completedQueries: number;
}

type SendEventFn = (event: string, data: any) => void;

/**
 * Run the full 4-phase analysis pipeline.
 */
export async function runAnalysisPipeline(params: {
  ideaSummary: string;
  conversationHistory: string;
  conversationId: string;
  userId: string;
  sendEvent: SendEventFn;
}): Promise<PhaseResult[]> {
  const { ideaSummary, conversationHistory, conversationId, userId, sendEvent } = params;
  const allResults: PhaseResult[] = [];

  // ─── THINKING PHASE ───
  // AI asks itself strategic questions before diving into research
  const isIndonesian = detectIndonesian(ideaSummary);
  try {
    const thinkingPrompt = `You are a strategic analyst about to research a startup idea based on this conversation:
    
    "${conversationHistory.substring(0, 2000)}"

    Summary of the idea: "${ideaSummary}"
    
    Before starting research, list 6 critical questions you need to answer for market validation. Format as a JSON array of strings.
    Example: ["What is the current market size?","Who are the top 3 competitors?"]
    Return ONLY the JSON array, nothing else.${isIndonesian ? '\n\nCRITICAL: You MUST write the JSON questions in Indonesian language.' : ''}`;

    const thinkingResponse = await createCompletion(
      [{ role: 'user', content: thinkingPrompt }],
      'Convix Fast',
      300
    );

    try {
      const questions = JSON.parse(thinkingResponse);
      if (Array.isArray(questions)) {
        for (const q of questions.slice(0, 8)) {
          sendEvent('thinking_step', { question: q });
          await new Promise(r => setTimeout(r, 600)); // pacing
        }
      }
    } catch {
      // Fallback thinking questions
      const fallback = isIndonesian ? [
        `Apa solusi yang sudah ada untuk "${ideaSummary}"?`,
        `Siapa target pelanggan dan masalah apa yang diselesaikan?`,
        `Berapa perkiraan ukuran pasar (TAM/SAM/SOM)?`,
        `Apakah ada hambatan regulasi atau hukum untuk masuk?`,
        `Teknologi atau infrastruktur apa yang dibutuhkan?`,
        `Apakah waktunya tepat — apakah pasar ini sedang tumbuh atau jenuh?`,
      ] : [
        `What are the existing solutions for "${ideaSummary}"?`,
        `Who is the target customer and what pain point does this solve?`,
        `What is the estimated market size (TAM/SAM/SOM)?`,
        `Are there regulatory or legal barriers to entry?`,
        `What technology or infrastructure is required?`,
        `Is the timing right — is this market growing or saturating?`,
      ];
      for (const q of fallback) {
        sendEvent('thinking_step', { question: q });
        await new Promise(r => setTimeout(r, 500));
      }
    }
    sendEvent('thinking_complete', {});
  } catch {
    sendEvent('thinking_complete', {});
  }

  for (let phase = 1; phase <= 4; phase++) {
    const phaseName = PHASE_NAMES[phase];
    sendEvent('phase_start', { phase, phaseName, totalPhases: 4 });

    const queries = getPhaseSearchQueries(ideaSummary, phase);
    const allSources: PhaseResult['sources'] = [];
    const batchSize = 3;

    // Run searches in batches of 3
    for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);

      sendEvent('phase_progress', {
        phase,
        phaseName,
        status: 'searching',
        sourcesFound: allSources.length,
        totalQueries: queries.length,
        completedQueries: i,
      } as AnalysisProgress);

      const batchResults = await Promise.all(
        batch.map(async (query) => {
          try {
            // 25 seconds max for the entire search AND content processing step
            return await withTimeout(
              (async () => {
                const searchResult = await searchWeb(query, 'market_research');
                if (!searchResult.results.length) return [];
                await incrementUsage(userId, 'searches_today');

                const processed = await processSearchResults(
                  searchResult.results.map(r => ({
                    url: r.url,
                    title: r.title,
                    content: r.content,
                    domain: extractDomain(r.url),
                  }))
                );

                // Save to database
                for (const pr of processed) {
                  await supabaseAdmin.from('research_sources').insert({
                    conversation_id: conversationId,
                    user_id: userId,
                    url: pr.url,
                    title: pr.title,
                    domain: pr.domain,
                    snippet: pr.rawContent.substring(0, 300),
                    summary: pr.summary,
                    token_count: pr.summaryTokens,
                    full_content: pr.rawContent.substring(0, 5000),
                    source_type: phase === 3 ? 'community' : 'tavily',
                    search_query: `[Phase ${phase}] ${query}`,
                  });
                }

                // Send individual source events for canvas
                for (const pr of processed) {
                  sendEvent('source_found', {
                    phase,
                    url: pr.url,
                    title: pr.title,
                    domain: pr.domain,
                    snippet: pr.summary.substring(0, 150),
                    fromCache: pr.fromCache,
                  });
                }

                return processed.map(pr => ({
                  url: pr.url,
                  title: pr.title,
                  domain: pr.domain,
                  snippet: pr.rawContent.substring(0, 200),
                  summary: pr.summary,
                  fromCache: pr.fromCache,
                }));
              })(),
              25000,
              []
            );
          } catch (err) {
            console.error(`[Pipeline] Search or processing failed for "${query}":`, err);
            return [];
          }
        })
      );

      allSources.push(...batchResults.flat());
    }

    // Scrape top 3 most relevant sources per phase for deeper data
    sendEvent('phase_progress', {
      phase, phaseName, status: 'scraping',
      sourcesFound: allSources.length,
      totalQueries: queries.length,
      completedQueries: queries.length,
    } as AnalysisProgress);

    const topUrls = allSources.slice(0, 3);
    for (const src of topUrls) {
      try {
        // 10 seconds max per scrape
        const scrapeResult = await withTimeout(
          scrapeUrl(src.url),
          10000,
          {
            url: src.url,
            title: '',
            description: '',
            content: '',
            summary: '',
            summaryTokens: 0,
            headings: [],
            domain: '',
            success: false,
            fromCache: false,
            error: 'Scrape failed or timed out'
          }
        );
        if (scrapeResult.success && !scrapeResult.fromCache) {
          src.summary = scrapeResult.summary;
        }
      } catch { /* non-critical */ }
    }

    // Generate phase summary
    sendEvent('phase_progress', {
      phase, phaseName, status: 'summarizing',
      sourcesFound: allSources.length,
      totalQueries: queries.length,
      completedQueries: queries.length,
    } as AnalysisProgress);

    let phaseSummary = '';
    try {
      const summaryContext = formatToolResultsForContext(
        allSources.slice(0, 15).map(s => ({
          content: s.summary,
          source: `${s.title} (${s.url})`,
          relevanceScore: 0.8,
        })),
        4000
      );

      phaseSummary = await withTimeout(
        createCompletion([
          { role: 'system', content: `You are a market research analyst. Summarize the following ${phaseName} data into key findings. Be concise (max 200 words). Use bullet points.` },
          { role: 'user', content: `Research data for "${ideaSummary}" — ${phaseName}:\n\n${summaryContext}` },
        ], 'Convix Fast', 500),
        25000,
        `Found ${allSources.length} sources for ${phaseName}.`
      );
    } catch {
      phaseSummary = `Found ${allSources.length} sources for ${phaseName}.`;
    }

    const result: PhaseResult = {
      phase,
      name: phaseName,
      sources: allSources,
      phaseSummary,
    };
    allResults.push(result);

    sendEvent('phase_complete', {
      phase,
      phaseName,
      sourcesFound: allSources.length,
      summary: phaseSummary,
    });
  }

  sendEvent('analysis_complete', {
    totalSources: allResults.reduce((sum, r) => sum + r.sources.length, 0),
    phases: allResults.map(r => ({ phase: r.phase, name: r.name, sources: r.sources.length })),
  });

  return allResults;
}

/**
 * Generate the final analysis report from all phase results.
 */
export async function generateFinalReport(
  ideaSummary: string,
  phaseResults: PhaseResult[],
  sendEvent: SendEventFn,
): Promise<string> {
  const phaseContext = phaseResults.map(r =>
    `## ${r.name} (${r.sources.length} sources)\n${r.phaseSummary}`
  ).join('\n\n');

  const totalSources = phaseResults.reduce((s, r) => s + r.sources.length, 0);

  const isIndonesian = detectIndonesian(ideaSummary);
  const messages: ChatMessage[] = [
    { 
      role: 'system', 
      content: ANALYSIS_PROMPT + (isIndonesian ? '\n\nCRITICAL: You MUST write the entire final report and all headings in INDONESIAN language. Never output in English.' : '') 
    },
    {
      role: 'user',
      content: `I need a comprehensive market validation analysis for this idea: "${ideaSummary}"

Here is the research data from ${totalSources} sources across 4 phases:

${phaseContext}

Please deliver the full analysis report using the template format.`,
    },
  ];

  // Stream the final report token by token
  const { createStreamingCompletion } = await import('./openrouter.js');
  const stream = createStreamingCompletion(messages, 'Convix Pro', false);
  let fullReport = '';

  for await (const chunk of stream) {
    if (chunk.type === 'token') {
      fullReport += chunk.data.content;
      sendEvent('token', { content: chunk.data.content });
    } else if (chunk.type === 'error') {
      sendEvent('error', chunk.data);
    }
  }

  return fullReport;
}
