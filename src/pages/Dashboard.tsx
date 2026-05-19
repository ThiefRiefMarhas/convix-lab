import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Plus, Menu, X, Wand2, Lightbulb, ArrowRight, Settings, Sparkles, MessageSquare, Trash2, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen, Layers, Sun, Moon, Paperclip, Mic, ChevronDown, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import ChatPanel from '../components/chat/ChatPanel';
import ResearchCanvas from '../components/chat/ResearchCanvas';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../hooks/useConversations';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" className="w-6 h-6 sm:w-7 sm:h-7 shrink-0" fill="none">
    <circle cx="16" cy="16" r="3.5" fill="#ef4d23" />
    <circle cx="26" cy="16" r="3.5" fill="#ef4d23" />
    <circle cx="23.07" cy="23.07" r="3.5" fill="#ef4d23" />
    <circle cx="16" cy="26" r="3.5" fill="#ef4d23" />
    <circle cx="8.93" cy="23.07" r="3.5" fill="#ef4d23" />
    <circle cx="6" cy="16" r="3.5" fill="#ef4d23" />
    <circle cx="8.93" cy="8.93" r="3.5" fill="#ef4d23" />
    <circle cx="16" cy="6" r="3.5" fill="#ef4d23" />
    <circle cx="23.07" cy="8.93" r="3.5" fill="#ef4d23" />
  </svg>
);

const MODELS = [
  { id: 'Convix Pro', name: 'Convix Pro', desc: 'Best for complex validation' },
  { id: 'Convix Fast', name: 'Convix Fast', desc: 'Quick idea scanning' },
  { id: 'Convix Creative', name: 'Convix Creative', desc: 'For brainstorming & branding' },
];

const templates = [
  { title: "B2B Marketplace", desc: "A platform for renting out heavy construction equipment between local contractors.", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=300", icon: <Sparkles size={16} className="text-white" /> },
  { title: "AI Consumer App", desc: "An AI-powered mobile app that translates baby cries to determine what they need.", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400&h=300", icon: <Lightbulb size={16} className="text-white" /> },
  { title: "Hyper-Local Social", desc: "A location-based social network exclusively for dog owners to organize playdates.", img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=300", icon: <MessageSquare size={16} className="text-white" /> },
  { title: "Niche E-Commerce", desc: "A premium subscription box that delivers rare, exotic indoor plants every month.", img: "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&q=80&w=400&h=300", icon: <Wand2 size={16} className="text-white" /> },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlConvoId = searchParams.get('c');

  const [prompt, setPrompt] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [viewState, setViewState] = useState<'input' | 'chat'>('input');
  const [isAgentMode, setIsAgentMode] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCanvasOpen, setIsCanvasOpen] = useState(true);
  const [mobileTab, setMobileTab] = useState<'chat' | 'canvas'>('chat');
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ id: string; name: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const chat = useChat(urlConvoId);
  const convos = useConversations();

  // Sync URL when conversation changes
  useEffect(() => {
    if (chat.conversationId && chat.conversationId !== urlConvoId) {
      setSearchParams({ c: chat.conversationId }, { replace: true });
      if (viewState === 'input') setViewState('chat');
    } else if (!chat.conversationId && urlConvoId) {
      setSearchParams({}, { replace: true });
      setViewState('input');
    }
  }, [chat.conversationId, urlConvoId, setSearchParams, viewState]);

  // Initial load check
  useEffect(() => {
    if (urlConvoId && viewState === 'input') {
      setViewState('chat');
    }
  }, [urlConvoId]);

  // Auto-close sidebar on mobile
  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const handleSignOut = async () => { await logout(); navigate('/'); };

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // Auto-collapse sidebar
    setIsSidebarOpen(false);
    setViewState('chat');
    chat.sendMessage(prompt, { webSearchEnabled: isAgentMode, attachmentIds: attachedFiles.map(f => f.id) });
    setPrompt('');
    setAttachedFiles([]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files) as File[]) {
        const result = await chat.uploadFile(file);
        if (result) {
          setAttachedFiles(prev => [...prev, { id: result.id, name: file.name }]);
        }
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleNewChat = () => {
    chat.resetChat();
    setViewState('input');
    setPrompt('');
  };

  const handleSelectConvo = (id: string) => {
    chat.setConversationId(id);
    chat.loadConversation(id);
    setViewState('chat');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteConvo = async (id: string) => {
    await convos.deleteConversation(id);
    if (chat.conversationId === id) handleNewChat();
  };

  // Refresh convos when a title is generated
  useEffect(() => {
    if (chat.conversationTitle) convos.refresh();
  }, [chat.conversationTitle]);

  return (
    <div className="flex h-screen bg-[var(--dash-bg)] font-sans overflow-hidden selection:bg-[#ef4d23]/20 selection:text-[#ef4d23] p-3 gap-3 transition-colors duration-500 min-h-0">

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)} className="md:hidden absolute inset-0 bg-black/20 z-40" />
        )}
      </AnimatePresence>

      {/* ─── Sidebar ─── */}
      <motion.aside
        initial={{ width: isSidebarOpen ? 280 : 0 }}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
        className="h-full overflow-hidden shrink-0 z-50 absolute md:relative rounded-3xl"
      >
        <div className="w-[280px] h-full bg-[var(--dash-sidebar)] flex flex-col text-neutral-800 dark:text-neutral-200 shadow-sm border border-neutral-200/50 dark:border-neutral-700/50 rounded-3xl">
          <div className="p-6 flex flex-col h-full relative min-h-0">
            <button onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-800 transition-colors md:hidden">
              <X size={20} />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 cursor-pointer group" onClick={() => { handleNewChat(); navigate('/'); }}>
              <Logo />
              <span className="font-bold tracking-tight text-neutral-900 dark:text-neutral-100 text-[19px]">Convix Lab</span>
            </div>

            {/* New Chat */}
            <button onClick={handleNewChat}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ef4d23] to-[#ff7a55] hover:opacity-95 text-white w-full px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm mb-8 shadow-lg shadow-[#ef4d23]/30 hover:shadow-xl hover:shadow-[#ef4d23]/40 group border border-[#ef4d23]/10">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>New Intelligence</span>
            </button>

            {/* Conversation History */}
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar min-h-0">
              {convos.isLoading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => (<div key={i} className="h-10 bg-neutral-100 rounded-xl animate-pulse" />))}
                </div>
              ) : (
                <>
                  {renderGroup('Today', convos.grouped.today, chat.conversationId, handleSelectConvo, handleDeleteConvo)}
                  {renderGroup('Yesterday', convos.grouped.yesterday, chat.conversationId, handleSelectConvo, handleDeleteConvo)}
                  {renderGroup('Previous 7 Days', convos.grouped.previous7Days, chat.conversationId, handleSelectConvo, handleDeleteConvo)}
                  {renderGroup('Older', convos.grouped.older, chat.conversationId, handleSelectConvo, handleDeleteConvo)}

                  {convos.conversations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs text-neutral-400 font-medium">No conversations yet</p>
                      <p className="text-[11px] text-neutral-300 mt-1">Start by validating an idea above</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Panel */}
          <div className="p-3 mx-5 mb-5 mt-auto bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/40 rounded-2xl shadow-sm relative group shrink-0">
            <div className="absolute bottom-[calc(100%+8px)] left-0 w-full opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
              <div className="bg-[var(--dash-sidebar)] border border-neutral-200 dark:border-neutral-700 shadow-xl rounded-2xl p-2 flex flex-col gap-1">
                <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
                  {theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-neutral-500" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button onClick={() => setIsSettingsModalOpen(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
                  <Settings size={16} className="text-neutral-500" /> Settings
                </button>
                <div className="h-px bg-neutral-100 dark:bg-neutral-700 my-1" />
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium text-red-600 transition-colors">
                  <LogOut size={16} className="text-red-500" /> Sign Out
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ef4d23] to-[#ff7a55] flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-200 truncate leading-tight">
                  {user?.email || 'Guest User'}
                </span>
                <span className="text-[10px] text-[#ef4d23] font-bold tracking-wide">PRO BETA</span>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* ─── Main Content ─── */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden min-h-0">
        {/* Top bar */}
        <div className="w-full p-3 flex items-center sticky top-0 z-30 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 rounded-xl hover:bg-white/80 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 transition-colors">
            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
          </button>
          {viewState === 'chat' && chat.conversationTitle && (
            <span className="ml-3 text-sm font-semibold text-neutral-600 truncate">{chat.conversationTitle}</span>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {/* ─── Input View ─── */}
            {viewState === 'input' && (
                <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="w-full h-full flex flex-col items-center md:justify-center max-w-4xl mx-auto px-4 overflow-y-auto pt-6 md:pt-0 pb-24 md:pb-0 custom-scrollbar">

                <div className="text-center w-full mb-8 md:mb-10 md:mt-[-40px] mt-4 shrink-0">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                    Validate <span className="font-serif italic text-[#ef4d23]">ideas</span> before<br className="hidden md:block" /> the market decides.
                  </h1>
                </div>

                <div className="w-full relative">
                  <div className={`relative bg-[var(--dash-sidebar)] border rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group ${isAgentMode ? 'border-[#ef4d23]/40 focus-within:border-[#ef4d23]' : 'border-neutral-200 dark:border-neutral-700 focus-within:border-neutral-300 dark:focus-within:border-neutral-600'}`}>
                    {/* Attached files */}
                    {attachedFiles.length > 0 && (
                      <div className="absolute top-4 left-6 right-6 flex flex-wrap gap-2 z-10">
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
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                      maxLength={10000}
                      data-lenis-prevent="true"
                      placeholder={isAgentMode ? "Let's brainstorm! What industry or problem are you exploring?" : "Describe your idea... e.g. A marketplace for artisanal, upcycled furniture..."}
                      className={`w-full min-h-[160px] max-h-[400px] overflow-y-auto custom-scrollbar bg-transparent px-6 ${attachedFiles.length > 0 ? 'pt-16' : 'pt-6'} pb-20 text-[17px] text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none rounded-3xl placeholder:text-neutral-400 dark:placeholder:text-neutral-500`}
                    />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white dark:bg-[var(--dash-chat-bg)] pt-2 rounded-b-2xl">
                      <div className="flex items-center gap-1 pl-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" multiple />
                        <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50" title="Attach file">
                          <Paperclip size={18} />
                        </button>
                        <button className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors" title="Voice input (coming soon)">
                          <Mic size={18} />
                        </button>
                        
                        {/* Model Selector */}
                        <div className="relative ml-1 sm:ml-2">
                          <button
                            onClick={() => setIsModelOpen(!isModelOpen)}
                            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          >
                            <Sparkles size={13} className="text-[#ef4d23]" />
                            <span className="hidden sm:inline">{chat.currentModel}</span>
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
                                    onClick={() => { chat.setModel(m.id); setIsModelOpen(false); }}
                                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                                      chat.currentModel === m.id ? 'bg-orange-50 dark:bg-orange-950/30' : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className={`w-3 h-3 rounded-full ${chat.currentModel === m.id ? 'bg-[#ef4d23]' : 'border-2 border-neutral-300 dark:border-neutral-600'}`}>
                                        {chat.currentModel === m.id && <div className="w-1 h-1 bg-white rounded-full m-auto mt-[3px]" />}
                                      </div>
                                      <div>
                                        <h4 className={`text-xs font-bold ${chat.currentModel === m.id ? 'text-[#ef4d23]' : 'text-neutral-800 dark:text-neutral-200'}`}>{m.name}</h4>
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
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400 font-medium hidden sm:block">{prompt.length}/10000</span>
                        <button onClick={handleSubmit} disabled={!prompt.trim()}
                          className={`p-3 rounded-full transition-all duration-300 flex items-center justify-center shadow-sm transform ${
                            prompt.trim()
                              ? 'bg-gradient-to-r from-[#ef4d23] to-[#ff7a55] text-white hover:shadow-md hover:-translate-y-0.5'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed shadow-none'
                          }`}>
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Agent mode toggle */}
                  <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
                    <button onClick={() => setIsAgentMode(!isAgentMode)}
                      className={`flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 border ${
                        isAgentMode 
                        ? 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50 text-[#ef4d23] shadow-sm' 
                        : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}>
                      <Wand2 size={16} className={isAgentMode ? 'text-[#ef4d23]' : 'text-neutral-400 dark:text-neutral-500'} />
                      <span>Agent Mode: Web Search</span>
                      <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isAgentMode ? 'bg-[#ef4d23]' : 'bg-neutral-300'}`}>
                        <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${isAgentMode ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </button>
                    <p className="text-[12px] text-neutral-400 text-right w-full sm:w-auto">Convix AI can make mistakes. Verify important market data.</p>
                  </div>

                  {/* Templates */}
                  <div className="mt-8 px-2 w-full">
                    <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 mb-4 px-1">
                      <Lightbulb size={16} className="text-[#ef4d23]" />
                      <span className="text-[13px] font-semibold uppercase tracking-wider">Start with a template</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      {templates.map((tmpl, i) => (
                        <button key={i} onClick={() => setPrompt(tmpl.desc)}
                          className="relative text-left border border-neutral-200/50 hover:border-[#ef4d23]/50 hover:shadow-lg transition-all duration-300 rounded-2xl group flex flex-col overflow-hidden aspect-[4/3]">
                          <img src={tmpl.img} alt={tmpl.title} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                          <div className="relative h-full flex flex-col justify-end p-4 z-10">
                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3 group-hover:bg-[#ef4d23] transition-colors duration-300">{tmpl.icon}</div>
                            <span className="text-[14px] font-bold text-white mb-1.5 leading-tight">{tmpl.title}</span>
                            <span className="text-[11px] text-white/70 leading-relaxed line-clamp-2">{tmpl.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Chat View (Split Screen) ─── */}
            {viewState === 'chat' && (
              <motion.div key="chat" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col lg:flex-row h-full gap-3 overflow-hidden p-1 pb-3 min-h-0 min-w-0">

                {/* Mobile tab switcher */}
                <div className="flex lg:hidden gap-1 bg-[var(--dash-sidebar)] rounded-xl p-1 border border-neutral-200/60 dark:border-neutral-700/40 shrink-0">
                  <button onClick={() => setMobileTab('chat')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      mobileTab === 'chat' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}>
                    <MessageSquare size={13} /> Chat
                  </button>
                  <button onClick={() => setMobileTab('canvas')}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      mobileTab === 'canvas' ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-50'
                    }`}>
                    <Layers size={13} /> Sources {chat.sources.length > 0 && <span className="bg-[#ef4d23] text-white text-[10px] px-1.5 rounded-full">{chat.sources.length}</span>}
                  </button>
                </div>

                {/* Left: Chat Panel */}
                <motion.div
                  initial={false}
                  animate={{ flex: isCanvasOpen ? 0.55 : 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`min-w-0 min-h-0 h-full ${mobileTab === 'chat' ? 'flex' : 'hidden lg:flex'} flex-col overflow-hidden`}
                >
                  <ChatPanel
                    messages={chat.messages}
                    sources={chat.sources}
                    isStreaming={chat.isStreaming}
                    streamingContent={chat.streamingContent}
                    activeTools={chat.activeTools}
                    currentModel={chat.currentModel}
                    error={chat.error}
                    analysisPhase={chat.analysisPhase}
                    phaseProgress={chat.phaseProgress}
                    thinkingSteps={chat.thinkingSteps}
                    onSendMessage={chat.sendMessage}
                    onStartAnalysis={chat.startAnalysis}
                    onStopStreaming={chat.stopStreaming}
                    onSetModel={chat.setModel}
                    onClose={handleNewChat}
                    onUploadFile={chat.uploadFile}
                  />
                </motion.div>

                {/* Canvas toggle button (desktop) */}
                <button onClick={() => setIsCanvasOpen(!isCanvasOpen)}
                  className="hidden lg:flex items-center justify-center w-6 h-12 self-center bg-[var(--dash-sidebar)] border border-neutral-200/60 dark:border-neutral-700/40 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors shadow-sm shrink-0"
                  title={isCanvasOpen ? 'Hide canvas' : 'Show canvas'}>
                  {isCanvasOpen ? <PanelRightClose size={14} /> : <PanelRightOpen size={14} />}
                </button>

                {/* Right: Research Canvas */}
                <AnimatePresence>
                  {isCanvasOpen && (
                    <motion.div
                      key="canvas"
                      initial={{ flex: 0, opacity: 0 }}
                      animate={{ flex: 0.45, opacity: 1 }}
                      exit={{ flex: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className={`min-w-0 min-h-0 h-full ${mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'} flex-col overflow-hidden relative`}>
                      <ResearchCanvas sources={chat.sources} isStreaming={chat.isStreaming} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[var(--dash-sidebar)] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10">
              <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-700">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Settings</h2>
                <button onClick={() => setIsSettingsModalOpen(false)} className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Profile</label>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ef4d23] to-[#ff7a55] flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{user?.email || 'User'}</p>
                      <p className="text-sm text-neutral-500">Beta Plan</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Theme</label>
                  <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                    {theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-neutral-500" />}
                    {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  </button>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
                <button onClick={() => setIsSettingsModalOpen(false)} className="px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">Done</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Helper: Render conversation group ─── */
function renderGroup(
  label: string,
  items: Array<{ id: string; title: string | null; created_at: string }>,
  activeId: string | null,
  onSelect: (id: string) => void,
  onDelete: (id: string) => void,
) {
  if (items.length === 0) return null;

  return (
    <div className="mb-5">
      <h3 className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-3 px-1">{label}</h3>
      <ul className="space-y-1">
        {items.map((c) => {
          const isActive = c.id === activeId;
          return (
            <li key={c.id} className="group relative">
              <button onClick={() => onSelect(c.id)}
                className={`w-full flex items-center px-4 py-3 rounded-xl text-sm text-left transition-all overflow-hidden ${
                  isActive ? 'bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/30 text-neutral-900 dark:text-neutral-100 shadow-sm' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}>
                {isActive && <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-[#ef4d23] rounded-r-full" />}
                <span className={`truncate ${isActive ? 'font-semibold text-[#ef4d23]' : 'font-medium'}`}>
                  {c.title || 'Untitled conversation'}
                </span>
              </button>
              {/* Delete on hover */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(c.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-neutral-300 dark:text-neutral-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={13} />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
