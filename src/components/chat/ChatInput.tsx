import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Paperclip, Globe, Sparkles, ChevronDown, Square, FileText, X, Mic, MicOff } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

const MODELS = [
  { id: 'Convix Pro', name: 'Convix Pro', desc: 'Best for complex validation' },
  { id: 'Convix Fast', name: 'Convix Fast', desc: 'Quick idea scanning' },
  { id: 'Convix Creative', name: 'Convix Creative', desc: 'For brainstorming & branding' },
];

interface ChatInputProps {
  onSend: (content: string, opts?: { webSearchEnabled?: boolean; attachmentIds?: string[] }) => void;
  onStop: () => void;
  isStreaming: boolean;
  currentModel: string;
  onModelChange: (model: string) => void;
  onUploadFile: (file: File) => Promise<{ id: string } | null>;
}

export default function ChatInput({ onSend, onStop, isStreaming, currentModel, onModelChange, onUploadFile }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [webSearch, setWebSearch] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  }, [input]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID'; // Default to Indonesian, auto-detects

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => {
          // Replace from last recognition point
          const base = prev.replace(/\[listening...\]$/, '').trim();
          return base ? `${base} ${transcript}` : transcript;
        });
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = () => {
    if ((!input.trim() && attachedFiles.length === 0) || isStreaming) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    onSend(input, {
      webSearchEnabled: webSearch,
      attachmentIds: attachedFiles.map(f => f.id),
    });
    setInput('');
    setAttachedFiles([]);
    setWebSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const result = await onUploadFile(file as File);
        if (result) {
          setAttachedFiles(prev => [...prev, { id: result.id, name: (file as File).name }]);
        }
      }
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const hasVoice = !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  return (
    <div className="p-3 bg-[var(--dash-chat-bg)] shrink-0">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-2.5 shadow-sm">
      {/* Attached files */}
      {attachedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {attachedFiles.map(f => (
            <div key={f.id} className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <FileText size={12} className="text-neutral-500" />
              <span className="truncate max-w-[140px]">{f.name}</span>
              <button onClick={() => removeFile(f.id)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="relative flex items-end gap-2 px-1">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            maxLength={10000}
            placeholder={isStreaming ? 'AI is responding...' : 'Reply to analysis...'}
            rows={1}
            className="w-full bg-transparent border-0 px-3 py-2 pr-12 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-0 resize-none disabled:opacity-50 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />

          {/* Voice input active wave overlay */}
          {isListening && (
            <div className="absolute inset-0 bg-white/95 dark:bg-neutral-950/95 flex items-center justify-between px-3 py-1 rounded-xl z-20 border border-red-500/20 shadow-inner">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 h-6">
                  <span className="w-1 bg-[#ef4d23] rounded-full animate-pulse h-3" />
                  <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-5" style={{ animationDelay: '0.1s', animationDuration: '0.6s' }} />
                  <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-2" style={{ animationDelay: '0.2s', animationDuration: '0.5s' }} />
                  <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-6" style={{ animationDelay: '0.3s', animationDuration: '0.7s' }} />
                  <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-4" style={{ animationDelay: '0.4s', animationDuration: '0.6s' }} />
                </div>
                <span className="text-[12px] font-bold text-[#ef4d23] tracking-wide animate-pulse">Mendengarkan suara Anda...</span>
              </div>
              <button
                onClick={toggleVoice}
                className="px-2.5 py-1 bg-[#ef4d23] hover:bg-[#d9441f] text-white rounded-lg text-[10px] font-bold uppercase transition-all shadow-sm"
              >
                Selesai
              </button>
            </div>
          )}
        </div>

        {/* Send / Stop button */}
        {isStreaming ? (
          <button
            onClick={onStop}
            className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center shrink-0 w-9 h-9"
          >
            <Square size={14} className="fill-current" />
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() && attachedFiles.length === 0}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all w-9 h-9 ${
              input.trim() || attachedFiles.length > 0
                ? 'bg-[#ef4d23] text-white shadow-md hover:shadow-lg hover:bg-[#d9441f]'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <ArrowUp size={18} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Tool bar */}
      <div className="flex items-center justify-between mt-2 px-1">
        <div className="flex items-center gap-1">
          {/* File upload */}
          <input ref={fileRef} type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" multiple />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={isStreaming || isUploading}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-40"
            title="Attach file"
          >
            <Paperclip size={16} />
          </button>

          {/* Voice input */}
          {hasVoice && (
            <button
              onClick={toggleVoice}
              disabled={isStreaming}
              className={`p-2 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-800 animate-pulse'
                  : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}

          {/* Web search toggle */}
          <button
            onClick={() => setWebSearch(!webSearch)}
            disabled={isStreaming}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              webSearch
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
            title="Search the web"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">{webSearch ? 'Search ON' : 'Search'}</span>
          </button>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setIsModelOpen(!isModelOpen)}
              disabled={isStreaming}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Sparkles size={13} className="text-[#ef4d23]" />
              <span className="hidden sm:inline">{currentModel}</span>
              <ChevronDown size={12} />
            </button>

            <AnimatePresence>
              {isModelOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded-xl shadow-lg overflow-hidden p-1.5 z-50"
                >
                  {MODELS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => { onModelChange(m.id); setIsModelOpen(false); }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                        currentModel === m.id ? 'bg-orange-50 dark:bg-orange-950/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${currentModel === m.id ? 'bg-[#ef4d23]' : 'border-2 border-neutral-300 dark:border-neutral-600'}`}>
                          {currentModel === m.id && <div className="w-1 h-1 bg-white rounded-full m-auto mt-[3px]" />}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${currentModel === m.id ? 'text-[#ef4d23]' : 'text-neutral-800 dark:text-neutral-200'}`}>{m.name}</h4>
                          <p className="text-[10px] text-neutral-400 mt-0.5">{m.desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <span className="text-[11px] text-neutral-300 dark:text-neutral-600 font-medium">
          {input.length}/10000
        </span>
      </div>
      </div>
    </div>
  );
}
