import { tavily } from '@tavily/core';
import dotenv from 'dotenv';

dotenv.config();

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || '';

let tvly: ReturnType<typeof tavily> | null = null;

function getClient() {
  if (!tvly && TAVILY_API_KEY) {
    tvly = tavily({ apiKey: TAVILY_API_KEY });
  }
  return tvly;
}

export interface TavilyResult {
  url: string;
  title: string;
  content: string;
  score: number;
  publishedDate?: string;
}

export interface TavilySearchResponse {
  answer?: string;
  results: TavilyResult[];
  query: string;
}

/**
 * Search the web via Tavily for market research
 */
export async function searchWeb(query: string, searchType?: string): Promise<TavilySearchResponse> {
  const client = getClient();

  if (!client) {
    console.warn('Tavily API key not configured. Returning empty results.');
    return { results: [], query };
  }

  try {
    const response = await client.search(query, {
      searchDepth: 'advanced',
      maxResults: 5,
      includeAnswer: true,
    });

    const results: TavilyResult[] = (response.results || []).map((r: any) => ({
      url: r.url || '',
      title: r.title || '',
      content: r.content || '',
      score: r.score || 0,
      publishedDate: r.publishedDate,
    }));

    return {
      answer: (response as any).answer || undefined,
      results,
      query,
    };
  } catch (error) {
    console.error('Tavily search error:', error);
    return { results: [], query };
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}
