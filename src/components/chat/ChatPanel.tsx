import React, { useEffect, useRef } from 'react';
import { Wand2, X, AlertTriangle, Activity, Hexagon, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MessageBubble from './MessageBubble';
import ToolCallCard from './ToolCallCard';
import ChatInput from './ChatInput';
import PhaseIndicator from './PhaseIndicator';
import ThinkingPhase from './ThinkingPhase';
import type { Message } from '../../services/api';
import type { PhaseProgress, ThinkingStep } from '../../hooks/useChat';

interface ToolActivity {
  id: string;
  tool: string;
  status: 'running' | 'done';
  query?: string;
  url?: string;
  sources?: Array<{ url: string; title: string; domain: string; snippet: string; score: number }>;
  error?: string;
}

interface ChatPanelProps {
  messages: Message[];
  sources: Array<{ domain: string; url: string }>;
  isStreaming: boolean;
  streamingContent: string;
  activeTools: ToolActivity[];
  currentModel: string;
  error: string | null;
  analysisPhase: 'idle' | 'brainstorm' | 'analyzing' | 'complete';
  phaseProgress: PhaseProgress;
  thinkingSteps: ThinkingStep[];
  onSendMessage: (content: string, opts?: { webSearchEnabled?: boolean; attachmentIds?: string[] }) => void;
  onStartAnalysis: () => void;
  onStopStreaming: () => void;
  onSetModel: (model: string) => void;
  onClose: () => void;
  onUploadFile: (file: File) => Promise<{ id: string } | null>;
}

export default function ChatPanel({
  messages, sources, isStreaming, streamingContent, activeTools, currentModel, error,
  analysisPhase, phaseProgress, thinkingSteps,
  onSendMessage, onStartAnalysis, onStopStreaming, onSetModel, onClose, onUploadFile,
}: ChatPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll only if already near bottom
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      if (isNearBottom) {
        scrollRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages, streamingContent, activeTools, thinkingSteps]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-[var(--dash-chat-bg)] rounded-2xl border border-neutral-200/60 dark:border-neutral-700/40 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-neutral-100 dark:border-neutral-700/50 bg-[var(--dash-chat-bg)] flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ef4d23]/20 to-[#ff7a55]/20 flex items-center justify-center">
            <Hexagon size={14} className="text-[#ef4d23] fill-current" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight">Convix Intelligence</h3>
            <p className="text-[11px] text-neutral-400 font-medium truncate">
              {isStreaming ? (
                <span className="text-[#ef4d23] animate-pulse">Analyzing...</span>
              ) : (
                `${currentModel}`
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isStreaming && (
            <button 
              onClick={onStopStreaming} 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg transition-colors"
            >
              <Square size={10} className="fill-current" />
              Stop Analysis
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Messages — scrollable area */}
      <div ref={scrollRef} data-lenis-prevent="true" className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scroll-smooth relative custom-scrollbar">
        {messages.length === 0 && !isStreaming && (
          <div className="h-full flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3">
                <Wand2 size={20} className="text-neutral-300 dark:text-neutral-600" />
              </div>
              <p className="text-sm font-medium text-neutral-400 dark:text-neutral-500">Start your conversation</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <div key={msg.id}>
            <MessageBubble message={msg} />
            
            {/* Show Analysis Prompt Button after 3 messages in brainstorm mode */}
            {analysisPhase === 'brainstorm' && index === messages.length - 1 && messages.length >= 3 && !isStreaming && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto ml-7 px-5 py-4 my-4 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center shrink-0">
                    <Activity size={18} className="text-[#ef4d23]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Ready for Deep Analysis?</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">I have enough context. Shall we start scanning 120+ market sources?</p>
                  </div>
                </div>
                <button
                  onClick={() => onStartAnalysis()}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#ef4d23] hover:bg-[#d9441f] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all"
                >
                  Start Validation
                </button>
              </motion.div>
            )}
          </div>
        ))}

        {/* Tool calls inline */}
        {activeTools.map((tool) => (
          <div key={tool.id} className="px-5 py-2">
            <div className="max-w-3xl mx-auto ml-7">
              <ToolCallCard activity={tool} />
            </div>
          </div>
        ))}

        {/* Streaming content */}
        {isStreaming && streamingContent && (
          <MessageBubble
            message={{ id: 'streaming', role: 'assistant', content: streamingContent, metadata: {}, created_at: new Date().toISOString() }}
            isStreaming
          />
        )}

        {/* Thinking Phase */}
        {thinkingSteps.length > 0 && (
          <ThinkingPhase
            steps={thinkingSteps}
            isComplete={thinkingSteps.every(s => s.status === 'done')}
          />
        )}

        {/* Thinking indicator */}
        {isStreaming && !streamingContent && activeTools.length === 0 && thinkingSteps.length === 0 && (
          <div className="py-4 bg-[var(--dash-chat-assist-bg)] px-5">
            <div className="max-w-3xl mx-auto ml-7">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">Convix is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Phase Indicator — BELOW the messages/results */}
        <AnimatePresence>
          {analysisPhase === 'analyzing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-5 pt-4 pb-6"
            >
              <div className="max-w-3xl mx-auto ml-7">
                <PhaseIndicator progress={phaseProgress} sources={sources} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="px-5 py-3">
              <div className="max-w-3xl mx-auto ml-7">
                <div className="flex items-start gap-2.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
                  <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[13px]">Something went wrong</p>
                    <p className="text-[12px] text-red-600 dark:text-red-400 mt-0.5">{error}</p>
                    <p className="text-[11px] text-red-400 dark:text-red-500 mt-1">Check your API keys in .env or try again.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <ChatInput
        onSend={onSendMessage}
        onStop={onStopStreaming}
        isStreaming={isStreaming}
        currentModel={currentModel}
        onModelChange={onSetModel}
        onUploadFile={onUploadFile}
      />
    </div>
  );
}
