import dotenv from 'dotenv';

dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

// Model mapping from UI names to OpenRouter IDs with Fallbacks
export const MODEL_MAP: Record<string, { models: string[]; temperature: number; maxTokens: number }> = {
  'Convix Pro': {
    // Paling high: Claude Opus fallback ke Gemini 3.1 Pro
    models: ['anthropic/claude-opus-4.6', 'google/gemini-3.1-pro-preview'],
    temperature: 0.7,
    maxTokens: 8192,
  },
  'Convix Fast': {
    // Paling kecil: Gemini Flash fallback ke Claude Haiku
    models: ['google/gemini-2.5-flash', 'anthropic/claude-haiku-4.5'],
    temperature: 0.5,
    maxTokens: 4096,
  },
  'Convix Creative': {
    // Model biasa: Gemini Pro fallback ke Claude Sonnet
    models: ['google/gemini-2.5-pro', 'anthropic/claude-sonnet-4.6'],
    temperature: 0.8,
    maxTokens: 4096,
  },
};

// Tool definitions for function calling
export const TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'tavily_search',
      description:
        'Search the web for real-time market data, competitors, trends, and validation signals. Use this when you need current information about a market, industry, or competitor landscape to validate a startup idea.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query for market research',
          },
          search_type: {
            type: 'string',
            enum: ['market_research', 'competitor_analysis', 'trend_validation'],
            description: 'The type of search to perform',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'scrape_website',
      description:
        'Extract detailed content from a specific website URL. Use this when you need to deeply analyze a competitor product page, a market report, or any specific webpage content.',
      parameters: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'The URL to scrape and analyze',
          },
          focus: {
            type: 'string',
            description: 'What aspect to focus on when analyzing the content',
          },
        },
        required: ['url'],
      },
    },
  },
];

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  tool_calls?: Array<{
    id: string;
    type: 'function';
    function: { name: string; arguments: string };
  }>;
}

export interface StreamChunk {
  type: 'token' | 'tool_start' | 'tool_result' | 'done' | 'error';
  data: any;
}

/**
 * Create a streaming chat completion via OpenRouter.
 * Returns an async generator of parsed SSE chunks.
 */
export async function* createStreamingCompletion(
  messages: ChatMessage[],
  modelName: string = 'Convix Fast',
  includeTools: boolean = true
): AsyncGenerator<StreamChunk> {
  const modelConfig = MODEL_MAP[modelName] || MODEL_MAP['Convix Fast'];

  const body: any = {
    models: modelConfig.models,
    messages,
    temperature: modelConfig.temperature,
    max_tokens: modelConfig.maxTokens,
    stream: true,
  };

  if (includeTools) {
    body.tools = TOOLS;
    body.tool_choice = 'auto';
  }

  // Pre-flight check
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
    yield { type: 'error', data: { message: 'OpenRouter API key not configured. Add your key to .env file (OPENROUTER_API_KEY).' } };
    return;
  }

  console.log(`[OpenRouter] Calling models: ${modelConfig.models.join(' -> ')} (${modelName})`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000); // 180s timeout for long reports

  let response: Response;
  try {
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://convix.app',
        'X-Title': 'Convix Idea Lab',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      yield { type: 'error', data: { message: 'Request timed out. Please try again.' } };
    } else {
      yield { type: 'error', data: { message: 'Network error connecting to AI service.' } };
    }
    return;
  }

  if (!response.ok) {
    const errText = await response.text();
    let userMessage = `AI service error (${response.status})`;
    try {
      const errJson = JSON.parse(errText);
      const errMsg = errJson?.error?.message || errJson?.message || '';
      if (errMsg.includes('not a valid model')) {
        userMessage = `Model "${modelConfig.models[0]}" is not available on OpenRouter. Try a different model or check openrouter.ai/models for valid IDs.`;
      } else if (response.status === 401) {
        userMessage = 'Invalid OpenRouter API key. Check your OPENROUTER_API_KEY in .env.';
      } else if (response.status === 429) {
        userMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (response.status === 402) {
        userMessage = 'Insufficient credits on OpenRouter. Add credits at openrouter.ai/credits.';
      } else {
        userMessage = errMsg || userMessage;
      }
    } catch { /* use default message */ }
    console.error(`[OpenRouter] Error ${response.status}:`, errText);
    yield { type: 'error', data: { message: userMessage } };
    return;
  }

  if (!response.body) {
    yield { type: 'error', data: { message: 'No response body from OpenRouter' } };
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let toolCalls: Array<{ id: string; type: string; function: { name: string; arguments: string } }> = [];

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          yield {
            type: 'done',
            data: { content: fullContent, toolCalls: toolCalls.length > 0 ? toolCalls : undefined },
          };
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          const finishReason = parsed.choices?.[0]?.finish_reason;

          if (!delta) continue;

          // Handle content tokens
          if (delta.content) {
            fullContent += delta.content;
            yield { type: 'token', data: { content: delta.content } };
          }

          // Handle tool calls
          if (delta.tool_calls) {
            for (const tc of delta.tool_calls) {
              const idx = tc.index ?? 0;
              if (!toolCalls[idx]) {
                toolCalls[idx] = { id: tc.id || '', type: 'function', function: { name: '', arguments: '' } };
              }
              if (tc.id) toolCalls[idx].id = tc.id;
              if (tc.function?.name) toolCalls[idx].function.name += tc.function.name;
              if (tc.function?.arguments) toolCalls[idx].function.arguments += tc.function.arguments;
            }
          }

          // If finish_reason is tool_calls, yield the accumulated tool calls
          if (finishReason === 'tool_calls' || finishReason === 'stop') {
            if (toolCalls.length > 0 && finishReason === 'tool_calls') {
              yield {
                type: 'done',
                data: { content: fullContent, toolCalls, finishReason: 'tool_calls' },
              };
              return;
            }
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    }

    // End of stream without [DONE]
    yield {
      type: 'done',
      data: { content: fullContent, toolCalls: toolCalls.length > 0 ? toolCalls : undefined },
    };
  } finally {
    reader.releaseLock();
  }
}

/**
 * Non-streaming completion for quick tasks or structured outputs.
 */
export async function createCompletion(
  messages: ChatMessage[],
  modelName: string = 'Convix Fast',
  maxTokens?: number,
  temperature?: number,
  timeoutMs: number = 90000,
  throwOnError: boolean = false
): Promise<string> {
  const modelConfig = MODEL_MAP[modelName] || MODEL_MAP['Convix Fast'];

  // Pre-flight check
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === 'YOUR_OPENROUTER_API_KEY_HERE') {
    const errorMsg = 'OpenRouter API key not configured. Add your key to .env file (OPENROUTER_API_KEY).';
    console.error(`[OpenRouter createCompletion] ${errorMsg}`);
    if (throwOnError) {
      throw new Error(errorMsg);
    }
    return 'New Conversation';
  }

  console.log(`[OpenRouter createCompletion] Calling models: ${modelConfig.models.join(' -> ')} (timeout: ${timeoutMs}ms)`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;
  try {
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://convix.app',
        'X-Title': 'Convix Idea Lab',
      },
      body: JSON.stringify({
        models: modelConfig.models,
        messages,
        temperature: temperature !== undefined ? temperature : 0.3,
        max_tokens: maxTokens || 100,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = `AI service error (${response.status})`;
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson?.error?.message || errJson?.message || errMsg;
      } catch { /* ignore */ }
      
      console.error(`[OpenRouter createCompletion] Error ${response.status}:`, errText);
      if (throwOnError) {
        throw new Error(errMsg);
      }
      return 'New Conversation';
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) {
      if (throwOnError) {
        throw new Error('AI returned an empty response.');
      }
      return 'New Conversation';
    }
    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error('[OpenRouter createCompletion] Exception:', error.message || error);
    if (throwOnError) {
      throw error;
    }
    return 'New Conversation';
  }
}
