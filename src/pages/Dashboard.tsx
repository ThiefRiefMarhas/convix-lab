import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLocale } from '../context/LocaleContext';
import type { Locale } from '../i18n/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Plus, Menu, X, Wand2, Lightbulb, ArrowRight, Settings, Sparkles, MessageSquare, Trash2, PanelRightClose, PanelRightOpen, PanelLeftClose, PanelLeftOpen, Layers, Sun, Moon, Paperclip, Mic, MicOff, ChevronDown, FileText, BarChart3, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import ChatPanel from '../components/chat/ChatPanel';
import ResearchCanvas from '../components/chat/ResearchCanvas';
import { useChat } from '../hooks/useChat';
import { useConversations } from '../hooks/useConversations';
import { apiFetch } from '../services/api';
import { ExportModal } from '../components/chat/ExportModal';
import { SWOTPanel } from '../components/chat/SWOTPanel';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel';
import { InsightsPanel } from '../components/insights/InsightsPanel';

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
  { 
    title: "B2B Marketplace", 
    desc: "Sewa alat berat konstruksi (excavator, crane) antar kontraktor lokal di Indonesia.", 
    prompt: "Saya ingin membangun B2B Marketplace penyewaan alat berat konstruksi (seperti excavator, crane, forklift) antar kontraktor lokal di Indonesia. Pengguna utama adalah kontraktor kecil yang butuh alat murah dan cepat, serta pemilik alat berat yang ingin memonetisasi mesin nganggur mereka.",
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=400&h=300", 
    icon: <Sparkles size={16} className="text-white" /> 
  },
  { 
    title: "AI Consumer App", 
    desc: "Aplikasi mobile AI penerjemah tangisan bayi real-time & panduan tindakan orang tua baru.", 
    prompt: "Saya ingin mengembangkan aplikasi mobile berbasis AI consumer yang bisa menerjemahkan tangisan bayi secara real-time. Aplikasi mendeteksi apakah bayi menangis karena lapar, mengantuk, popok basah, atau kolik, serta memberikan rekomendasi tindakan medis terpercaya bagi orang tua baru.",
    img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400&h=300", 
    icon: <Lightbulb size={16} className="text-white" /> 
  },
  { 
    title: "Hyper-Local Social", 
    desc: "Jaringan sosial lokal khusus pemilik anjing untuk playdate, rekomendasi vet & park.", 
    prompt: "Saya ingin membuat jaringan sosial hyper-local khusus pemilik anjing untuk mengatur jadwal bermain (playdate) bersama anjing sekitar, berbagi informasi dokter hewan (vet) terdekat, serta merekomendasikan dog park. Target pasar awal adalah pemilik hewan peliharaan di kota-kota besar Indonesia.",
    img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=400&h=300", 
    icon: <MessageSquare size={16} className="text-white" /> 
  },
  { 
    title: "Niche E-Commerce", 
    desc: "Layanan berlangganan bulanan (subscription box) tanaman hias indoor langka & eksotis.", 
    prompt: "Saya ingin meluncurkan bisnis e-commerce berlangganan bulanan (niche subscription box) tanaman hias indoor langka dan eksotis. Setiap bulan pelanggan menerima paket berisi satu tanaman langka impor, pot keramik estetis, media tanam premium, dan panduan perawatan cerdas berbasis sensor AI.",
    img: "https://images.unsplash.com/photo-1459156212016-c812468e2115?auto=format&fit=crop&q=80&w=400&h=300", 
    icon: <Wand2 size={16} className="text-white" /> 
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, strings, indonesiaFocus, setIndonesiaFocus } = useLocale();
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
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(55);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'chat' | 'analytics'>('chat');
  const [rightPanelTab, setRightPanelTab] = useState<'canvas' | 'swot' | 'insights'>('canvas');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Synchronization refs to prevent URL vs local state race conditions
  const prevUrlConvoIdRef = useRef<string | null>(null);
  const prevChatConvoIdRef = useRef<string | null>(null);

  // Close user menu when clicking outside (handles PC click & mobile tap)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const chat = useChat(urlConvoId);
  const convos = useConversations();

  const handleSplitterPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    const container = splitContainerRef.current;
    if (!container) return;

    const startX = e.clientX;
    const initialWidth = chatWidth;
    const containerWidth = container.getBoundingClientRect().width;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = Math.max(25, Math.min(75, initialWidth + deltaPercent));
      setChatWidth(newWidth);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Sync URL and conversation state reactively (with bulletproof race condition guards)
  useEffect(() => {
    const prevUrlConvo = prevUrlConvoIdRef.current;
    const prevChatConvo = prevChatConvoIdRef.current;

    // Save current values for next execution
    prevUrlConvoIdRef.current = urlConvoId;
    prevChatConvoIdRef.current = chat.conversationId;

    if (urlConvoId) {
      if (chat.conversationId !== urlConvoId) {
        chat.setConversationId(urlConvoId);
      }
      setViewState('chat');
      setActiveView('chat');
    } else {
      if (chat.conversationId) {
        const isNewlyCreated = !prevChatConvo && chat.conversationId;
        const isUrlCleared = prevUrlConvo && !urlConvoId;

        if (isNewlyCreated && !isUrlCleared) {
          // Sync newly generated conversation ID to URL
          setSearchParams({ c: chat.conversationId }, { replace: true });
          setViewState('chat');
          setActiveView('chat');
        } else {
          // The user explicitly cleared the URL or clicked "Kecerdasan Baru"
          chat.resetChat();
          setViewState('input');
          setActiveView('chat');
        }
      } else {
        // Both URL and local states are null
        setViewState('input');
        setActiveView('chat');
      }
    }
  }, [urlConvoId, chat.conversationId, setSearchParams]);

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
    chat.sendMessage(prompt, { 
      webSearchEnabled: isAgentMode, 
      analysisMode: isAgentMode, // Hitting enter triggers deep analysis if Agent Mode is toggled ON!
      attachments: attachedFiles,
      attachmentIds: attachedFiles.map(f => f.id) 
    });
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

  const toggleVoice = async () => {
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsTranscribing(true);
      setTranscriptionError(null);
    } else {
      try {
        console.log('[Dashboard STT] Requesting microphone access...');
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          alert(strings.micAccessError);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        let mediaRecorder: MediaRecorder;
        let mimeTypeUsed = 'audio/webm';
        
        try {
          mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
          mimeTypeUsed = 'audio/webm';
        } catch (e) {
          try {
            mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/mp4' });
            mimeTypeUsed = 'audio/mp4';
          } catch (e2) {
            mediaRecorder = new MediaRecorder(stream);
            mimeTypeUsed = mediaRecorder.mimeType || 'audio/webm';
          }
        }

        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeUsed });
          stream.getTracks().forEach(track => track.stop());

          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Data = (reader.result as string).split(',')[1];
            if (!base64Data) {
              setIsTranscribing(false);
              setIsListening(false);
              return;
            }

            const format = mimeTypeUsed.includes('mp4') ? 'mp4' : (mimeTypeUsed.includes('ogg') ? 'ogg' : 'webm');

            // 10-second timeout implementation
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            try {
              const res = await apiFetch('/api/transcribe', {
                method: 'POST',
                body: JSON.stringify({ audioData: base64Data, format }),
                signal: controller.signal
              });
              clearTimeout(timeoutId);

              if (res.ok) {
                const data = await res.json();
                if (data.text) {
                  setPrompt(prev => prev ? `${prev} ${data.text}` : data.text);
                }
                setIsListening(false);
              } else {
                const errText = await res.text();
                console.error('[Dashboard STT] Transcription failed:', errText);
                setTranscriptionError('Gagal mentranskripsi audio. Silakan coba lagi.');
              }
            } catch (err: any) {
              clearTimeout(timeoutId);
              console.error('[Dashboard STT] Error contacting transcribe API:', err);
              if (err.name === 'AbortError') {
                setTranscriptionError('Waktu proses habis (maksimal 10 detik). Pastikan koneksi internet stabil.');
              } else {
                setTranscriptionError('Koneksi terputus atau gagal memproses suara.');
              }
            } finally {
              setIsTranscribing(false);
            }
          };
        };

        mediaRecorder.start();
        setTranscriptionError(null);
        setIsTranscribing(false);
        setIsListening(true);
      } catch (err) {
        console.error('[Dashboard STT] Error starting media recorder:', err);
        alert('Gagal mengakses mikrofon. Pastikan Anda telah memberikan izin mikrofon di browser.');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleNewChat = () => {
    setSearchParams({}, { replace: true });
    chat.resetChat();
    setViewState('input');
    setPrompt('');
    setIsChatOpen(true);
    setIsCanvasOpen(true);
    setChatWidth(55);
    setActiveView('chat');
  };

  const handleSelectConvo = (id: string) => {
    setSearchParams({ c: id }, { replace: true });
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
            <button onClick={() => { handleNewChat(); setActiveView('chat'); }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#ef4d23] to-[#ff7a55] hover:opacity-95 text-white w-full px-4 py-3.5 rounded-2xl transition-all font-semibold text-sm mb-3 shadow-lg shadow-[#ef4d23]/30 hover:shadow-xl hover:shadow-[#ef4d23]/40 group border border-[#ef4d23]/10">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>{strings.newIntelligence}</span>
            </button>
            
            <button onClick={() => setActiveView('analytics')}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl transition-colors font-medium text-sm mb-8 ${activeView === 'analytics' ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' : 'text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}>
              <BarChart3 size={18} className={activeView === 'analytics' ? 'text-[#ef4d23]' : ''} />
              <span>{strings.analytics}</span>
            </button>

            {/* Conversation History */}
            <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar min-h-0">
              {convos.isLoading ? (
                <div className="space-y-2">
                  {[1,2,3].map(i => (<div key={i} className="h-10 bg-neutral-100 rounded-xl animate-pulse" />))}
                </div>
              ) : (
                <>
                  {renderGroup(strings.today, convos.grouped.today, chat.conversationId, handleSelectConvo, handleDeleteConvo)}
                  {renderGroup(strings.yesterday, convos.grouped.yesterday, chat.conversationId, handleSelectConvo, handleDeleteConvo)}
                  {renderGroup(strings.previous7days, convos.grouped.previous7Days, chat.conversationId, handleSelectConvo, handleDeleteConvo)}
                  {renderGroup(strings.older, convos.grouped.older, chat.conversationId, handleSelectConvo, handleDeleteConvo)}

                  {convos.conversations.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-xs text-neutral-400 font-medium">{strings.noConvosYet}</p>
                      <p className="text-[11px] text-neutral-300 mt-1">{strings.startByValidating}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* User Panel */}
          <div 
            ref={userMenuRef}
            className="p-3 mx-5 mb-5 mt-auto bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200/60 dark:border-neutral-700/40 rounded-2xl shadow-sm relative group shrink-0"
          >
            <div className={`absolute bottom-[calc(100%+8px)] left-0 w-full transition-all duration-200 translate-y-2 z-50 ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'}`}>
              <div className="bg-[var(--dash-sidebar)] border border-neutral-200 dark:border-neutral-700 shadow-xl rounded-2xl p-2 flex flex-col gap-1">
                <button onClick={(e) => { e.stopPropagation(); toggleTheme(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
                  {theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-neutral-500" />}
                  {theme === 'dark' ? strings.lightMode : strings.darkMode}
                </button>
                <button onClick={(e) => { e.stopPropagation(); setIsSettingsModalOpen(true); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors">
                  <Settings size={16} className="text-neutral-500" /> {strings.settings}
                </button>
                <div className="h-px bg-neutral-100 dark:bg-neutral-700 my-1" />
                <button onClick={(e) => { e.stopPropagation(); handleSignOut(); setIsUserMenuOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-sm font-medium text-red-600 transition-colors">
                  <LogOut size={16} className="text-red-500" /> {strings.signOut}
                </button>
              </div>
            </div>
            <div 
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="flex items-center gap-3 p-2 rounded-xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
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
            {activeView === 'analytics' && (
              <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full w-full">
                <AnalyticsPanel />
              </motion.div>
            )}
            
            {activeView === 'chat' && viewState === 'input' && (
              <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="w-full h-full flex flex-col items-center md:justify-center max-w-4xl mx-auto px-4 overflow-y-auto pt-6 md:pt-0 pb-24 md:pb-0 custom-scrollbar">

                <div className="text-center w-full mb-8 md:mb-10 md:mt-[-40px] mt-4 shrink-0">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                    {locale === 'id' ? (
                      <>
                        Validasi <span className="font-serif italic text-[#ef4d23]">ide</span> sebelum<br className="hidden md:block" /> pasar memutuskan.
                      </>
                    ) : (
                      <>
                        Validate <span className="font-serif italic text-[#ef4d23]">ideas</span> before<br className="hidden md:block" /> the market decides.
                      </>
                    )}
                  </h1>
                </div>

                <div className="w-full relative">
                  <div className={`relative bg-[var(--dash-sidebar)] border rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group ${isAgentMode ? 'border-[#ef4d23]/40 focus-within:border-[#ef4d23]' : 'border-neutral-200 dark:border-neutral-700 focus-within:border-neutral-300 dark:focus-within:border-neutral-600'}`}>
                    {/* Attached files */}
                    {(attachedFiles.length > 0 || isUploading) && (
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
                        {isUploading && (
                          <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/40 dark:border-orange-900/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-orange-600 dark:text-orange-400">
                            <svg className="animate-spin h-3 w-3 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="animate-pulse">{strings.uploadingPdf}</span>
                          </div>
                        )}
                      </div>
                    )}
                    {/* Wrapped Textarea with its own clean inline relative layout */}
                    <div className="relative w-full">
                      {isListening && (
                        <div className="absolute inset-0 bg-transparent flex flex-col items-center justify-center gap-3 z-10 pt-8 pb-20 px-6">
                          {transcriptionError ? (
                            <div className="flex flex-col items-center gap-3 text-center pointer-events-auto">
                              <span className="text-red-500 font-semibold text-sm">{transcriptionError}</span>
                              <button
                                onClick={() => {
                                  setTranscriptionError(null);
                                  setIsListening(false);
                                }}
                                className="px-4 py-2 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold rounded-lg transition-all active:scale-95"
                              >
                                {strings.close}
                              </button>
                            </div>
                          ) : isTranscribing ? (
                            <div className="flex flex-col items-center gap-3 text-center">
                              <svg className="animate-spin h-7 w-7 text-[#ef4d23]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span className="text-[14px] font-bold text-neutral-800 dark:text-neutral-200 animate-pulse tracking-wide block">{strings.transcribing}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-end justify-center gap-1.5 h-10 pointer-events-none">
                                <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-4" style={{ animationDelay: '0.1s', animationDuration: '0.5s' }} />
                                <span className="w-1.5 bg-[#ef4d23] rounded-full animate-bounce h-8" style={{ animationDelay: '0.2s', animationDuration: '0.6s' }} />
                                <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-3" style={{ animationDelay: '0.3s', animationDuration: '0.4s' }} />
                                <span className="w-1.5 bg-[#ef4d23] rounded-full animate-bounce h-10" style={{ animationDelay: '0.4s', animationDuration: '0.7s' }} />
                                <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-6" style={{ animationDelay: '0.5s', animationDuration: '0.5s' }} />
                                <span className="w-1.5 bg-[#ef4d23] rounded-full animate-bounce h-8" style={{ animationDelay: '0.6s', animationDuration: '0.6s' }} />
                                <span className="w-1 bg-[#ef4d23] rounded-full animate-bounce h-4" style={{ animationDelay: '0.7s', animationDuration: '0.5s' }} />
                              </div>
                              <div className="text-center pointer-events-none">
                                <span className="text-[14px] font-bold text-neutral-800 dark:text-neutral-200 animate-pulse tracking-wide block">{strings.listening}</span>
                                <span className="text-[11px] text-neutral-400 mt-0.5 block">{strings.micHint}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                      
                      <textarea
                        value={isListening ? '' : prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isListening}
                        maxLength={10000}
                        data-lenis-prevent="true"
                        placeholder={isListening ? '' : (isAgentMode ? strings.agentBrainstormPlaceholder : strings.describeIdeaPlaceholder)}
                        className={`w-full min-h-[160px] max-h-[400px] overflow-y-auto custom-scrollbar bg-transparent px-6 ${(attachedFiles.length > 0 || isUploading) ? 'pt-16' : 'pt-6'} pb-20 text-[17px] text-neutral-900 dark:text-neutral-100 focus:outline-none resize-none rounded-3xl placeholder:text-neutral-400 dark:placeholder:text-neutral-500 disabled:opacity-30`}
                      />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-white dark:bg-[var(--dash-chat-bg)] pt-2 rounded-b-2xl z-30">
                      <div className="flex items-center gap-1 pl-2">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.webp" className="hidden" multiple />
                        <button disabled={isUploading} onClick={() => fileInputRef.current?.click()} className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50" title="Attach file">
                          <Paperclip size={18} />
                        </button>
                        <button
                          onClick={toggleVoice}
                          className={`p-2 rounded-lg transition-all ${
                            isListening
                              ? 'bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-200 dark:border-red-800 animate-pulse'
                              : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                          }`}
                          title={isListening ? 'Stop listening' : 'Voice input'}
                        >
                          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
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
                        <button key={i} onClick={() => {
                          setPrompt(tmpl.prompt);
                          setIsAgentMode(true);
                        }}
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
            {activeView === 'chat' && viewState === 'chat' && (
              <motion.div 
                ref={splitContainerRef}
                key="chat" 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col lg:flex-row h-full gap-3 overflow-hidden p-1 pb-3 min-h-0 min-w-0 relative"
              >
                {/* Side tabs to slide back panels when hidden */}
                {!isChatOpen && (
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-24 bg-[var(--dash-sidebar)] border border-neutral-200/60 dark:border-neutral-700/40 rounded-r-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#ef4d23] hover:text-[#ff7a55] flex flex-col items-center justify-center gap-2 shadow-lg transition-all"
                    title="Open Chat"
                  >
                    <Plus size={18} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider [writing-mode:vertical-lr]">Chat</span>
                  </button>
                )}

                {!isCanvasOpen && isChatOpen && (
                  <button
                    onClick={() => setIsCanvasOpen(true)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-24 bg-[var(--dash-sidebar)] border border-neutral-200/60 dark:border-neutral-700/40 rounded-l-2xl hover:bg-neutral-50 dark:hover:bg-neutral-800 text-[#ef4d23] hover:text-[#ff7a55] flex flex-col items-center justify-center gap-2 shadow-lg transition-all"
                    title="Show Canvas"
                  >
                    <PanelRightOpen size={18} className="animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider [writing-mode:vertical-lr] rotate-180">Sources</span>
                  </button>
                )}

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
                <AnimatePresence>
                  {isChatOpen && (
                    <motion.div
                      key="chat-panel"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: isCanvasOpen ? `${chatWidth}%` : '100%', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{ width: isCanvasOpen ? `${chatWidth}%` : '100%' }}
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
                        onClose={() => setIsChatOpen(false)}
                        onUploadFile={chat.uploadFile}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Vertical Resizable Splitter (Desktop) */}
                {isChatOpen && isCanvasOpen && (
                  <div
                    onPointerDown={handleSplitterPointerDown}
                    className="hidden lg:flex w-2.5 hover:w-3.5 h-full self-stretch items-center justify-center cursor-col-resize group/splitter transition-all relative z-30 shrink-0"
                  >
                    {/* Splitter center line */}
                    <div className="w-[2px] h-16 bg-neutral-200 dark:bg-neutral-800 group-hover/splitter:bg-[#ef4d23] group-hover/splitter:h-full transition-all rounded-full" />
                    
                    {/* Embedded Toggle Button */}
                    <button
                      onPointerDown={(e) => e.stopPropagation()} // Prevent drag start when clicking the button
                      onClick={() => setIsCanvasOpen(false)}
                      className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/splitter:opacity-100 focus:opacity-100 flex items-center justify-center w-6 h-10 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-500 hover:text-[#ef4d23] transition-all shadow-md cursor-pointer z-40"
                      title="Hide Canvas"
                    >
                      <PanelRightClose size={12} />
                    </button>
                  </div>
                )}

                {/* Right: Research Canvas */}
                <AnimatePresence>
                  {isCanvasOpen && (
                    <motion.div
                      key="canvas"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: isChatOpen ? `${100 - chatWidth}%` : '100%', opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className={`min-w-0 min-h-0 h-full ${mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'} flex-col overflow-hidden relative`}
                      data-lenis-prevent="true"
                    >
                      <div className="flex-1 flex flex-col min-h-0 bg-[var(--dash-canvas-bg)] rounded-2xl border border-neutral-200/60 dark:border-neutral-700/40 shadow-sm overflow-hidden relative" data-lenis-prevent="true">
                        {/* Right Panel Tabs */}
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-100 dark:border-neutral-700/50 bg-[var(--dash-chat-bg)]">
                          {(['canvas', 'swot', 'insights'] as const).map(tab => (
                            <button
                              key={tab}
                              onClick={() => setRightPanelTab(tab)}
                              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                                rightPanelTab === tab 
                                  ? 'bg-[#ef4d23]/10 text-[#ef4d23]' 
                                  : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                              }`}
                            >
                              {tab}
                            </button>
                          ))}
                          
                          {/* Export Button */}
                          <div className="ml-auto">
                            <button 
                              onClick={() => setIsExportOpen(true)}
                              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                            >
                              <Download size={14} /> Export
                            </button>
                          </div>
                        </div>

                        {/* Right Panel Content */}
                        <div className="flex-1 overflow-hidden relative">
                          {rightPanelTab === 'canvas' && (
                            <ResearchCanvas 
                              key={chat.conversationId || 'new-chat'} 
                              sources={chat.sources} 
                              isStreaming={chat.isStreaming} 
                              ideaTitle={chat.conversationTitle || undefined} 
                            />
                          )}
                          {rightPanelTab === 'swot' && chat.conversationId && (
                            <div className="h-full overflow-y-auto p-6 custom-scrollbar" data-lenis-prevent="true">
                              <SWOTPanel conversationId={chat.conversationId} />
                            </div>
                          )}
                          {rightPanelTab === 'insights' && chat.conversationId && (
                            <div className="h-full overflow-y-auto p-6 custom-scrollbar" data-lenis-prevent="true">
                              <InsightsPanel conversationId={chat.conversationId} />
                            </div>
                          )}
                          {(rightPanelTab === 'swot' || rightPanelTab === 'insights') && !chat.conversationId && (
                            <div className="h-full flex items-center justify-center p-8 text-neutral-400 text-sm">
                              {strings.startConvoToView.replace('{tab}', rightPanelTab)}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Export Modal */}
      {isExportOpen && chat.conversationId && (
        <ExportModal 
          conversationId={chat.conversationId} 
          onClose={() => setIsExportOpen(false)} 
        />
      )}

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSettingsModalOpen(false)} className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-[var(--dash-sidebar)] rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden z-10">
              <div className="flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-700">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{strings.settings}</h2>
                <button onClick={() => setIsSettingsModalOpen(false)} className="text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">{strings.profile}</label>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ef4d23] to-[#ff7a55] flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">{user?.email || 'User'}</p>
                      <p className="text-sm text-neutral-500">{strings.betaPlan}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">{strings.theme}</label>
                  <button onClick={toggleTheme} className="flex items-center gap-3 w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                    {theme === 'dark' ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-neutral-500" />}
                    {theme === 'dark' ? strings.switchLight : strings.switchDark}
                  </button>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider mb-2">{strings.language}</label>
                  <p className="text-xs text-neutral-400 mb-2">{strings.languageDesc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {(['id', 'en'] as Locale[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLocale(lang)}
                        className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                          locale === lang
                            ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-[#ef4d23]'
                            : 'bg-neutral-100 dark:bg-neutral-800 border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        }`}
                      >
                        {lang === 'id' ? strings.indonesian : strings.english}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="pr-4">
                      <label className="block text-[13px] font-bold text-neutral-500 uppercase tracking-wider">{strings.indonesiaFocus}</label>
                      <p className="text-xs text-neutral-400 mt-1">{strings.indonesiaFocusDesc}</p>
                    </div>
                    <button
                      onClick={() => setIndonesiaFocus(!indonesiaFocus)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none ${
                        indonesiaFocus ? 'bg-[#ef4d23]' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          indonesiaFocus ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
                <button onClick={() => setIsSettingsModalOpen(false)} className="px-5 py-2.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">{strings.done}</button>
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
