import axios from 'axios';
import * as cheerio from 'cheerio';
import { getCachedContent, processContent } from './content-pipeline.js';

export interface ScrapeResult {
  url: string;
  title: string;
  description: string;
  content: string;       // Raw content
  summary: string;       // AI-summarized content (for LLM context)
  summaryTokens: number; // Token count of summary
  headings: string[];
  domain: string;
  success: boolean;
  fromCache: boolean;
  error?: string;
}

/**
 * Scrape a web page with caching and summarization pipeline.
 * 
 * Flow:
 * 1. Check cache → if hit, return cached summary (zero network call)
 * 2. If miss → fetch HTML → extract with Cheerio → summarize → cache → return
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const domain = extractDomain(url);

  // 1. Check cache first
  const cached = await getCachedContent('url', url);
  if (cached) {
    return {
      url,
      title: cached.title,
      description: '',
      content: cached.rawContent,
      summary: cached.summary,
      summaryTokens: cached.summaryTokens,
      headings: [],
      domain: cached.domain || domain,
      success: true,
      fromCache: true,
    };
  }

  // 2. Cache miss — fetch and scrape
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ConvixBot/1.0; +https://convix.app)',
        Accept: 'text/html,application/xhtml+xml',
      },
      maxRedirects: 3,
    });

    const $ = cheerio.load(html);

    // Remove noise elements
    $('script, style, nav, footer, header, iframe, noscript, svg, .ad, .advertisement, .sidebar').remove();

    const title = $('title').text().trim() || $('h1').first().text().trim() || '';
    const description =
      $('meta[name="description"]').attr('content')?.trim() ||
      $('meta[property="og:description"]').attr('content')?.trim() ||
      '';

    // Extract headings
    const headings: string[] = [];
    $('h1, h2, h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length < 200) headings.push(text);
    });

    // Extract main content — try semantic elements first
    let content = '';
    const contentSelectors = ['article', 'main', '[role="main"]', '.post-content', '.article-body', '.entry-content', '.content'];
    for (const selector of contentSelectors) {
      const el = $(selector);
      if (el.length) {
        content = el.text().trim();
        break;
      }
    }

    // Fallback: body text
    if (!content) content = $('body').text().trim();

    // Clean whitespace
    content = content.replace(/\s+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();

    // Cap raw content at 8000 chars
    if (content.length > 8000) content = content.substring(0, 8000) + '...';

    // 3. Process through pipeline (summarize + cache)
    const processed = await processContent({
      cacheType: 'url',
      cacheKey: url,
      title,
      rawContent: content,
      domain,
      contentType: 'webpage',
    });

    return {
      url,
      title,
      description,
      content,
      summary: processed.summary,
      summaryTokens: processed.summaryTokens,
      headings: headings.slice(0, 10),
      domain,
      success: true,
      fromCache: false,
    };
  } catch (error: any) {
    return {
      url,
      title: '',
      description: '',
      content: '',
      summary: '',
      summaryTokens: 0,
      headings: [],
      domain,
      success: false,
      fromCache: false,
      error: error.message || 'Failed to scrape URL',
    };
  }
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}
