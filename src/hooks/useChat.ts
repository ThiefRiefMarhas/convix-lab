import { useState, useEffect, useCallback, useRef } from 'react';
import {
  streamChat,
  getConversation,
  Message,
  ResearchSource,
  ChatStreamEvent,
  UploadResult,
  uploadFile,
} from '../services/api';

interface ToolActivity {
  id: string;
  tool: string;
  status: 'running' | 'done';
  query?: string;
  url?: string;
  sources?: Array<{ url: string; title: string; domain: string; snippet: string; score: number }>;
  error?: string;
}

export interface PhaseProgress {
  phase: number;
  phaseName: string;
  status: 'idle' | 'starting' | 'searching' | 'scraping' | 'summarizing' | 'complete';
  sourcesFound: number;
  totalQueries: number;
  completedQueries: number;
}

export interface ThinkingStep {
  question: string;
  status: 'thinking' | 'done';
}

export function useChat(initialConversationId?: string | null) {
  const [conversationId, setConversationId] = useState<string | null>(initialConversationId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<ResearchSource[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [activeTools, setActiveTools] = useState<ToolActivity[]>([]);
  const [currentModel, setCurrentModel] = useState('Convix Fast');
  const [error, setError] = useState<string | null>(null);
  const [conversationTitle, setConversationTitle] = useState<string | null>(null);

  // Analysis State
  const [analysisPhase, setAnalysisPhase] = useState<'idle' | 'brainstorm' | 'analyzing' | 'complete'>('idle');
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress>({
    phase: 1, phaseName: 'Competitor Analysis', status: 'idle', sourcesFound: 0, totalQueries: 0, completedQueries: 0
  });
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);

  const abortRef = useRef<AbortController | null>(null);
  const streamingRef = useRef(false);

  // Load existing conversation
  useEffect(() => {
    if (conversationId && !streamingRef.current) {
      loadConversation(conversationId);
    }
  }, [conversationId]);

  const loadConversation = useCallback(async (id: string) => {
    const data = await getConversation(id);
    if (data) {
      setMessages(data.messages);
      setSources(data.sources);
      setConversationTitle(data.conversation.title);
      setCurrentModel(data.conversation.model);
      
      // If it has many sources, it's likely completed analysis
      if (data.sources.length > 10) {
        setAnalysisPhase('complete');
      }
    }
  }, []);

  const sendMessage = useCallback(async (
    content: string,
    options?: {
      webSearchEnabled?: boolean;
      attachmentIds?: string[];
      analysisMode?: boolean;
    }
  ) => {
    setError(null);
    setIsStreaming(true);
    setStreamingContent('');
    setActiveTools([]);
    setThinkingSteps([]);
    streamingRef.current = true;

    if (options?.analysisMode) {
      setAnalysisPhase('analyzing');
      setPhaseProgress({ phase: 1, phaseName: 'Starting Analysis', status: 'starting', sourcesFound: 0, totalQueries: 0, completedQueries: 0 });
    } else if (analysisPhase === 'idle') {
      setAnalysisPhase('brainstorm');
    }

    // Optimistic: add user message if content exists
    if (content) {
      const userMsg: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        metadata: options?.attachmentIds ? { attachments: options.attachmentIds } : {},
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMsg]);
    }

    let currentConvoId = conversationId;

    try {
      const stream = streamChat({
        conversationId: currentConvoId || undefined,
        message: content,
        model: options?.analysisMode ? 'Convix Pro' : currentModel, // Analysis uses Pro
        webSearchEnabled: options?.webSearchEnabled,
        attachmentIds: options?.attachmentIds,
        analysisMode: options?.analysisMode,
      });

      let fullContent = '';

      for await (const event of stream) {
        if (!streamingRef.current) break;

        switch (event.type) {
          case 'conversation_created':
            currentConvoId = event.data.conversationId;
            setConversationId(currentConvoId);
            break;

          case 'token':
            fullContent += event.data.content;
            setStreamingContent(fullContent);
            break;
            
          case 'thinking_step':
            setThinkingSteps(prev => [
              ...prev.map(s => ({ ...s, status: 'done' as const })),
              { question: event.data.question, status: 'thinking' as const },
            ]);
            break;

          case 'thinking_complete':
            setThinkingSteps(prev => prev.map(s => ({ ...s, status: 'done' as const })));
            break;

          case 'phase_start':
            setAnalysisPhase('analyzing');
            if (event.data.phase === 1) {
              setSources([]);
            }
            setCurrentPhase(event.data.phase);
            setPhaseProgress(prev => ({ ...prev, phase: event.data.phase, phaseName: event.data.phaseName, status: 'starting' }));
            break;
            
          case 'phase_progress':
            setPhaseProgress(event.data);
            break;
            
          case 'source_found':
            setSources(prev => [...prev, {
              id: `src-${Date.now()}-${Math.random()}`,
              url: event.data.url,
              title: event.data.title,
              domain: event.data.domain,
              snippet: event.data.snippet,
              relevance_score: 0.8,
              source_type: event.data.phase === 3 ? 'community' : 'tavily',
              search_query: `Phase ${event.data.phase}`,
              created_at: new Date().toISOString(),
            }]);
            break;
            
          case 'phase_complete':
            setPhaseProgress(prev => ({ ...prev, status: 'complete' }));
            break;
            
          case 'analysis_complete':
            setAnalysisPhase('complete');
            break;

          case 'tool_start': {
            const toolId = `tool-${Date.now()}-${Math.random()}`;
            setActiveTools(prev => [...prev, {
              id: toolId,
              tool: event.data.tool,
              status: 'running',
              query: event.data.query,
              url: event.data.url,
            }]);
            break;
          }

          case 'tool_result': {
            setActiveTools(prev => prev.map(t =>
              t.status === 'running' && t.tool === event.data.tool
                ? { ...t, status: 'done' as const, sources: event.data.sources, error: event.data.error }
                : t
            ));

            // Add sources from tool results
            if (event.data.sources) {
              const newSources: ResearchSource[] = event.data.sources.map((s: any, i: number) => ({
                id: `src-${Date.now()}-${i}`,
                url: s.url,
                title: s.title,
                domain: s.domain,
                snippet: s.snippet,
                relevance_score: s.score,
                source_type: 'tavily',
                search_query: event.data.query,
                created_at: new Date().toISOString(),
              }));
              setSources(prev => [...prev, ...newSources]);
            }
            // Single scrape result
            if (event.data.tool === 'scrape_website' && event.data.url && !event.data.error) {
              setSources(prev => [...prev, {
                id: `src-${Date.now()}`,
                url: event.data.url,
                title: event.data.title || null,
                domain: event.data.domain || null,
                snippet: event.data.snippet || null,
                relevance_score: null,
                source_type: 'scrape',
                search_query: null,
                created_at: new Date().toISOString(),
              }]);
            }
            break;
          }

          case 'title_generated':
            setConversationTitle(event.data.title);
            break;

          case 'done':
            if (event.data.conversationId) {
              setConversationId(event.data.conversationId);
            }
            break;

          case 'error':
            setError(event.data.message);
            break;
        }
      }

      // Add assistant message after stream ends
      if (fullContent) {
        const assistantMsg: Message = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: fullContent,
          metadata: { model: options?.analysisMode ? 'Convix Pro' : currentModel },
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      setAnalysisPhase('idle');
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
      setActiveTools([]);
      streamingRef.current = false;
    }
  }, [conversationId, currentModel]);

  const startAnalysis = useCallback((ideaSummary?: string) => {
    // If we have an idea summary, pass it. Otherwise, pass the last user message or empty.
    let idea = ideaSummary;
    if (!idea && messages.length > 0) {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      if (lastUserMsg) idea = lastUserMsg.content;
    }
    
    sendMessage(idea || '', { analysisMode: true });
  }, [messages, sendMessage]);

  const stopStreaming = useCallback(() => {
    streamingRef.current = false;
    setIsStreaming(false);
    setAnalysisPhase(prev => prev === 'analyzing' ? 'idle' : prev);
  }, []);

  const resetChat = useCallback(() => {
    setConversationId(null);
    setMessages([]);
    setSources([]);
    setStreamingContent('');
    setActiveTools([]);
    setError(null);
    setConversationTitle(null);
  }, []);

  const handleFileUpload = useCallback(async (file: File): Promise<UploadResult | null> => {
    return uploadFile(file, conversationId || undefined);
  }, [conversationId]);

  return {
    conversationId,
    setConversationId,
    messages,
    sources,
    isStreaming,
    streamingContent,
    activeTools,
    currentModel,
    setModel: setCurrentModel,
    error,
    conversationTitle,
    analysisPhase,
    currentPhase,
    phaseProgress,
    thinkingSteps,
    startAnalysis,
    sendMessage,
    stopStreaming,
    resetChat,
    loadConversation,
    uploadFile: handleFileUpload,
  };
}
