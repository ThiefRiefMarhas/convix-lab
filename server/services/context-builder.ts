/**
 * Context Builder — Smart Token Budget Management
 *
 * Problem: If AI searches 5 URLs, each with 5000 chars, that's 25k chars (~6k tokens)
 * per search. With multiple searches, we blow through the context window.
 *
 * Solution: Token budgeting system that:
 * 1. Allocates a fixed budget per conversation turn
 * 2. Uses SUMMARIES instead of raw content (90% savings)
 * 3. Prioritizes most relevant content based on recency and score
 * 4. Truncates when approaching budget limits
 *
 * Budget allocation per turn:
 *   Total budget: 30,000 tokens
 *   ├── System prompt: ~800 tokens (fixed)
 *   ├── Conversation history: up to 8,000 tokens (recent messages)
 *   ├── File context: up to 3,000 tokens (attached PDFs)
 *   ├── Tool results: up to 6,000 tokens (search + scrape summaries)
 *   └── Response space: ~12,000 tokens (for AI output)
 */

import { estimateTokens } from './content-pipeline.js';
import type { ChatMessage } from './openrouter.js';

// Token budget constants
const BUDGET = {
  TOTAL: 30000,
  SYSTEM_PROMPT: 1000,
  CONVERSATION_HISTORY: 8000,
  FILE_CONTEXT: 3000,
  TOOL_RESULTS: 6000,
  RESPONSE_RESERVE: 12000,
} as const;

interface ConversationMessage {
  role: string;
  content: string;
  metadata?: any;
}

interface ToolResult {
  content: string;
  source: string;
  relevanceScore?: number;
}

/**
 * Build an optimized messages array for the LLM, respecting token budget.
 */
export function buildContextMessages(params: {
  systemPrompt: string;
  conversationHistory: ConversationMessage[];
  fileContexts?: string[];
  toolResults?: ToolResult[];
}): ChatMessage[] {
  const messages: ChatMessage[] = [];

  // 1. System prompt (always included, fixed cost)
  messages.push({ role: 'system', content: params.systemPrompt });
  let usedTokens = estimateTokens(params.systemPrompt);

  // 2. File context (if any)
  if (params.fileContexts && params.fileContexts.length > 0) {
    const fileContent = truncateToTokenBudget(
      params.fileContexts.join('\n\n---\n\n'),
      BUDGET.FILE_CONTEXT
    );
    if (fileContent) {
      messages.push({
        role: 'system',
        content: `User has uploaded files for context:\n\n${fileContent}`,
      });
      usedTokens += estimateTokens(fileContent);
    }
  }

  // 3. Conversation history (keep recent, trim old)
  const historyMessages = trimConversationHistory(
    params.conversationHistory,
    BUDGET.CONVERSATION_HISTORY
  );
  for (const msg of historyMessages) {
    messages.push({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    });
    usedTokens += estimateTokens(msg.content);
  }

  return messages;
}

/**
 * Format tool results into a concise context string, respecting budget.
 * Prioritizes results by relevance score.
 */
export function formatToolResultsForContext(
  toolResults: ToolResult[],
  budgetTokens: number = BUDGET.TOOL_RESULTS
): string {
  if (toolResults.length === 0) return '';

  // Sort by relevance score (highest first)
  const sorted = [...toolResults].sort(
    (a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)
  );

  let result = '';
  let tokenCount = 0;

  for (const tr of sorted) {
    const entry = `[Source: ${tr.source}]\n${tr.content}\n\n`;
    const entryTokens = estimateTokens(entry);

    if (tokenCount + entryTokens > budgetTokens) {
      // Try to fit a truncated version
      const remaining = budgetTokens - tokenCount;
      if (remaining > 100) {
        result += truncateToTokenBudget(entry, remaining);
      }
      break;
    }

    result += entry;
    tokenCount += entryTokens;
  }

  return result;
}

/**
 * Trim conversation history to fit within token budget.
 * Strategy: Keep the FIRST message (user's original idea) and LAST N messages.
 */
function trimConversationHistory(
  messages: ConversationMessage[],
  budgetTokens: number
): ConversationMessage[] {
  if (messages.length === 0) return [];

  // Always keep the first user message (the original idea)
  const firstMsg = messages[0];
  const restMessages = messages.slice(1);

  let budget = budgetTokens - estimateTokens(firstMsg.content);
  const result: ConversationMessage[] = [firstMsg];

  // Add messages from the end (most recent first)
  const recentMessages: ConversationMessage[] = [];
  for (let i = restMessages.length - 1; i >= 0; i--) {
    const msg = restMessages[i];
    const tokens = estimateTokens(msg.content);

    if (budget - tokens < 0) break;

    budget -= tokens;
    recentMessages.unshift(msg);
  }

  result.push(...recentMessages);
  return result;
}

/**
 * Truncate text to fit within a token budget.
 */
function truncateToTokenBudget(text: string, maxTokens: number): string {
  const estimated = estimateTokens(text);
  if (estimated <= maxTokens) return text;

  // Approximate char count for budget
  const maxChars = maxTokens * 4; // 4 chars per token
  return text.substring(0, maxChars) + '\n...(truncated)';
}

/**
 * Calculate remaining token budget for a conversation turn.
 */
export function getRemainingBudget(params: {
  systemPromptTokens: number;
  historyTokens: number;
  fileTokens: number;
  toolTokens: number;
}): { responseTokens: number; canAddTools: boolean; toolBudget: number } {
  const used = params.systemPromptTokens + params.historyTokens + params.fileTokens + params.toolTokens;
  const responseTokens = Math.max(1000, BUDGET.TOTAL - used);
  const toolBudget = Math.max(0, BUDGET.TOOL_RESULTS - params.toolTokens);

  return {
    responseTokens,
    canAddTools: toolBudget > 500,
    toolBudget,
  };
}
