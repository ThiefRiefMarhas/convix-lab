import { Router, Response } from 'express';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rate-limiter.js';
import { supabaseAdmin, incrementUsage, getUserUsage, getUserProfile } from '../services/supabase-admin.js';
import { createStreamingCompletion, createCompletion, ChatMessage } from '../services/openrouter.js';
import { searchWeb, extractDomain } from '../services/tavily.js';
import { scrapeUrl } from '../services/scraper.js';
import { BRAINSTORM_PROMPT, SYSTEM_PROMPT, getTitlePrompt } from '../prompts/system.js';
import { processContent, processSearchResults, estimateTokens } from '../services/content-pipeline.js';
import { buildContextMessages, formatToolResultsForContext, getRemainingBudget } from '../services/context-builder.js';
import { runAnalysisPipeline, generateFinalReport, detectIndonesian } from '../services/analysis-pipeline.js';

const router = Router();

/**
 * POST /api/chat — Streaming chat endpoint.
 *
 * Supports two modes:
 * 1. Brainstorm (default): Normal chat with fast model.
 * 2. Analysis: Triggers the 4-phase research pipeline.
 */
router.post('/', requireAuth, rateLimiter, async (req: AuthenticatedRequest, res: Response) => {
  const { conversationId, message, model = 'Convix Fast', webSearchEnabled = false, attachmentIds = [], analysisMode = false, locale, indonesiaFocus } = req.body;
  const userId = req.user!.userId;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  // Helps mobile proxies/browsers stream SSE without buffering
  res.setHeader('Content-Encoding', 'identity');
  if (typeof res.flushHeaders === 'function') {
    res.flushHeaders();
  }

  // Prevent connection timeouts on mobile/LAN by disabling socket timeout and keeping it alive
  req.socket.setTimeout(0);
  req.socket.setKeepAlive(true, 1000);

  // Send a heartbeat comment every 15 seconds to keep proxies & mobile carriers from dropping the connection
  const heartbeatInterval = setInterval(() => {
    if (!res.writableEnded) {
      res.write(': keep-alive\n\n');
      if (typeof (res as any).flush === 'function') {
        (res as any).flush();
      }
    }
  }, 15000);

  const cleanUp = () => {
    clearInterval(heartbeatInterval);
  };
  res.on('finish', cleanUp);
  res.on('close', cleanUp);
  res.on('error', cleanUp);

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    if (typeof (res as any).flush === 'function') {
      (res as any).flush();
    }
  };

  try {
    // 1. Check conversation limits (rate limits are handled by middleware)
    const profile = await getUserProfile(userId);
    const usage = await getUserUsage(userId);

    if (usage && profile && usage.conversations_total >= profile.max_conversations && !conversationId) {
      sendEvent('error', { message: `Batas maksimum ${profile.max_conversations} percakapan aktif tercapai. Silakan hapus beberapa percakapan lama Anda di sidebar sebelah kiri untuk membuat percakapan baru sekarang.` });
      res.end();
      return;
    }

    // 2. Create or get conversation
    let convoId = conversationId;
    let isNewConvo = false;

    if (!convoId) {
      const { data: convo, error } = await supabaseAdmin
        .from('conversations')
        .insert({ user_id: userId, model, title: null })
        .select('id')
        .single();

      if (error || !convo) {
        sendEvent('error', { message: 'Failed to create conversation.' });
        res.end();
        return;
      }
      convoId = convo.id;
      isNewConvo = true;
      await incrementUsage(userId, 'conversations_total');
      sendEvent('conversation_created', { conversationId: convoId });
    }

    // 3. Save user message
    if (message) {
      const userMetadata: any = {};
      if (attachmentIds.length > 0) userMetadata.attachments = attachmentIds;

      await supabaseAdmin.from('messages').insert({
        conversation_id: convoId,
        user_id: userId,
        role: 'user',
        content: message,
        metadata: userMetadata,
      });
      await incrementUsage(userId, 'messages_today');
    }

    // Load history to give pipeline or context full context
    const { data: history } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', convoId)
      .order('created_at', { ascending: true });

    const userPromptCount = (history || []).filter(m => m.role === 'user').length;
    const shouldForceAnalysis = userPromptCount >= 3;

    // --- ANALYSIS MODE ---
    if (analysisMode || shouldForceAnalysis) {
      await incrementUsage(userId, 'analyses_today');
      const conversationHistory = (history || [])

        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');

      // Extract original idea from the first user message
      let firstUserMsg = (history || []).find(m => m.role === 'user')?.content || message || 'My startup idea';

      // Load PDF/File contents if attached
      if (attachmentIds.length > 0) {
        const { data: files } = await supabaseAdmin
          .from('file_uploads')
          .select('file_name, extracted_text')
          .in('id', attachmentIds);
        if (files && files.length > 0) {
          const fileContextsText = files.map((f: any) =>
            `[Attached File: ${f.file_name}]\n${(f.extracted_text || '(No text)').substring(0, 5000)}`
          ).join('\n\n');
          firstUserMsg = `${firstUserMsg}\n\n--- ADDITIONAL PDF/DOCUMENT CONTEXT ---\n${fileContextsText}`;
        }
      }

      // Run the 4-phase pipeline
      const phaseResults = await runAnalysisPipeline({
        ideaSummary: firstUserMsg,
        conversationHistory,
        conversationId: convoId,
        userId,
        sendEvent
      });

      // Generate the final investment memo report
      const fullReport = await generateFinalReport(
        firstUserMsg,
        phaseResults,
        sendEvent,
        { forceIndonesian: locale === 'id' || indonesiaFocus === true }
      );

      // Save assistant message
      await supabaseAdmin.from('messages').insert({
        conversation_id: convoId,
        user_id: userId,
        role: 'assistant',
        content: fullReport,
        metadata: { model: 'Convix Pro', isAnalysisReport: true },
      });

      sendEvent('done', { conversationId: convoId });
      res.end();
      return;
    }

    // --- BRAINSTORM MODE (Default) ---

    // 4. Load conversation history
    const historyMessages = (history || []).slice(-50);

    // 5. Build context with token budget
    let fileContexts: string[] = [];
    if (attachmentIds.length > 0) {
      const { data: files } = await supabaseAdmin
        .from('file_uploads')
        .select('file_name, extracted_text')
        .in('id', attachmentIds);
      if (files) {
        fileContexts = files.map((f: any) =>
          `[File: ${f.file_name}]\n${(f.extracted_text || '(No text)').substring(0, 3000)}`
        );
      }
    }

    const forceIndonesian = locale === 'id' || indonesiaFocus === true;
    const isIndonesianConvo = forceIndonesian || (history || []).some(m => m.role === 'user' && detectIndonesian(m.content)) || detectIndonesian(message || '');
    const systemPromptLanguage = isIndonesianConvo
      ? BRAINSTORM_PROMPT + "\n\nCRITICAL: You MUST speak, reply, and converse exclusively in INDONESIAN language. Never reply in English."
      : BRAINSTORM_PROMPT + "\n\nCRITICAL: You MUST speak, reply, and converse exclusively in ENGLISH language.";

    const contextMessages = buildContextMessages({
      systemPrompt: systemPromptLanguage,
      conversationHistory: (historyMessages || []).filter(m => m.role === 'user' || m.role === 'assistant'),
      fileContexts,
    });

    // 6. Stream with tool handling
    let fullAssistantContent = '';
    let toolCallsProcessed = 0;
    const maxToolRounds = 3;
    let totalToolTokens = 0;

    const processStream = async (msgs: ChatMessage[]): Promise<void> => {
      // Check if we still have tool budget
      const budget = getRemainingBudget({
        systemPromptTokens: estimateTokens(SYSTEM_PROMPT),
        historyTokens: (historyMessages || []).reduce((sum, m) => sum + estimateTokens(m.content), 0),
        fileTokens: fileContexts.reduce((sum, f) => sum + estimateTokens(f), 0),
        toolTokens: totalToolTokens,
      });

      const stream = createStreamingCompletion(msgs, model, budget.canAddTools);

      for await (const chunk of stream) {
        switch (chunk.type) {
          case 'token':
            fullAssistantContent += chunk.data.content;
            sendEvent('token', { content: chunk.data.content });
            break;

          case 'done':
            if (chunk.data.toolCalls && chunk.data.finishReason === 'tool_calls' && toolCallsProcessed < maxToolRounds) {
              toolCallsProcessed++;

              const assistantMsg: ChatMessage = {
                role: 'assistant',
                content: chunk.data.content || '',
                tool_calls: chunk.data.toolCalls,
              };
              msgs.push(assistantMsg);

              for (const tc of chunk.data.toolCalls) {
                let toolArgs: any;
                try { toolArgs = JSON.parse(tc.function.arguments); } catch { toolArgs = {}; }

                sendEvent('tool_start', { tool: tc.function.name, ...toolArgs });
                let toolResult = '';

                if (tc.function.name === 'tavily_search') {
                  const searchResult = await searchWeb(toolArgs.query, toolArgs.search_type);
                  await incrementUsage(userId, 'searches_today');

                  // Process through content pipeline (summarize + cache)
                  const processedResults = await processSearchResults(
                    searchResult.results.map(r => ({
                      url: r.url,
                      title: r.title,
                      content: r.content,
                      domain: extractDomain(r.url),
                    }))
                  );

                  // Save sources with summaries
                  for (const pr of processedResults) {
                    await supabaseAdmin.from('research_sources').insert({
                      conversation_id: convoId,
                      user_id: userId,
                      url: pr.url,
                      title: pr.title,
                      domain: pr.domain,
                      snippet: pr.rawContent.substring(0, 300),
                      summary: pr.summary,
                      token_count: pr.summaryTokens,
                      full_content: pr.rawContent.substring(0, 5000),
                      relevance_score: null,
                      source_type: 'tavily',
                      search_query: toolArgs.query,
                    });
                  }

                  sendEvent('tool_result', {
                    tool: 'tavily_search',
                    query: toolArgs.query,
                    sources: processedResults.map(pr => ({
                      url: pr.url,
                      title: pr.title,
                      domain: pr.domain,
                      snippet: pr.summary.substring(0, 200),
                      score: 0,
                      fromCache: pr.fromCache,
                    })),
                  });

                  // Build tool result using SUMMARIES (not raw content!) — token efficient
                  const summaryContext = formatToolResultsForContext(
                    processedResults.map(pr => ({
                      content: pr.summary,
                      source: `${pr.title} (${pr.url})`,
                      relevanceScore: 0.8,
                    })),
                    budget.toolBudget
                  );

                  toolResult = searchResult.answer
                    ? `Search for "${toolArgs.query}":\n\nSummary: ${searchResult.answer}\n\nDetailed sources:\n${summaryContext}`
                    : `Search for "${toolArgs.query}":\n\n${summaryContext}`;

                  totalToolTokens += estimateTokens(toolResult);

                } else if (tc.function.name === 'scrape_website') {
                  const scrapeResult = await scrapeUrl(toolArgs.url);

                  if (scrapeResult.success) {
                    await supabaseAdmin.from('research_sources').insert({
                      conversation_id: convoId,
                      user_id: userId,
                      url: toolArgs.url,
                      title: scrapeResult.title,
                      domain: scrapeResult.domain,
                      snippet: scrapeResult.description || scrapeResult.summary.substring(0, 300),
                      summary: scrapeResult.summary,
                      token_count: scrapeResult.summaryTokens,
                      full_content: scrapeResult.content.substring(0, 5000),
                      relevance_score: null,
                      source_type: 'scrape',
                      search_query: toolArgs.focus || null,
                    });

                    sendEvent('tool_result', {
                      tool: 'scrape_website',
                      url: toolArgs.url,
                      title: scrapeResult.title,
                      domain: scrapeResult.domain,
                      snippet: scrapeResult.summary.substring(0, 200),
                      fromCache: scrapeResult.fromCache,
                    });

                    // Use SUMMARY for LLM context, not raw content
                    toolResult = `Content from ${toolArgs.url}:\nTitle: ${scrapeResult.title}\nSummary: ${scrapeResult.summary}`;
                    totalToolTokens += estimateTokens(toolResult);
                  } else {
                    toolResult = `Failed to scrape ${toolArgs.url}: ${scrapeResult.error}`;
                    sendEvent('tool_result', { tool: 'scrape_website', url: toolArgs.url, error: scrapeResult.error });
                  }
                }

                msgs.push({ role: 'tool', content: toolResult, tool_call_id: tc.id });
              }

              fullAssistantContent = '';
              await processStream(msgs);
              return;
            }
            break;

          case 'error':
            sendEvent('error', chunk.data);
            break;
        }
      }
    };

    await processStream(contextMessages);

    // 7. Save assistant message
    if (fullAssistantContent) {
      await supabaseAdmin.from('messages').insert({
        conversation_id: convoId,
        user_id: userId,
        role: 'assistant',
        content: fullAssistantContent,
        metadata: { model, tools_used: toolCallsProcessed, tool_tokens: totalToolTokens },
      });
    }

    // 8. Generate title
    if (isNewConvo && message) {
      try {
        const title = await createCompletion([{ role: 'user', content: getTitlePrompt(message) }]);
        await supabaseAdmin.from('conversations').update({ title: title.substring(0, 100) }).eq('id', convoId);
        sendEvent('title_generated', { conversationId: convoId, title: title.substring(0, 100) });
      } catch { /* non-critical */ }
    }

    sendEvent('done', { conversationId: convoId, toolTokensUsed: totalToolTokens });
    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    sendEvent('error', { message: error.message || 'Internal server error' });
    res.end();
  }
});

export default router;
