import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, ArrowRight, X, User, Calendar } from 'lucide-react';

export interface ArticleBlock {
  type: 'paragraph' | 'heading' | 'quote' | 'list';
  text: string | string[];
}

export interface Article {
  id: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: ArticleBlock[];
  author: string;
  date: string;
  coverGradient: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  coverGradient: string;
}

interface InsightsHubProps {
  sectionTitle: string | React.ReactNode;
  sectionSubtitle: string;
  articles: Article[];
  videos: Video[];
}

export default function InsightsHub({ sectionTitle, sectionSubtitle, articles, videos }: InsightsHubProps) {
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (activeArticle) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('scroll-locked');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('scroll-locked');
    }
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('scroll-locked');
    };
  }, [activeArticle]);

  // Track modal reading progress
  const handleModalScroll = () => {
    if (!modalContentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = modalContentRef.current;
    const totalHeight = scrollHeight - clientHeight;
    if (totalHeight <= 0) {
      setScrollProgress(0);
    } else {
      setScrollProgress((scrollTop / totalHeight) * 100);
    }
  };

  const renderVideoCard = (video: Video, index: number) => {
    return (
      <div 
        className="relative w-full h-full min-h-[320px] rounded-2xl overflow-hidden group/vid cursor-pointer flex flex-col justify-end p-6 border border-white/[0.06] bg-[#0c0e14] transition-all duration-300 hover:border-white/[0.15] hover:shadow-[0_12px_40px_rgba(0,0,0,0.55)]" 
      >
        {/* Ambient colorful glow in the background */}
        <div className={`absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-br ${video.coverGradient} opacity-25 blur-3xl group-hover/vid:opacity-40 transition-opacity duration-500`} />
        <div className={`absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-gradient-to-tr ${video.coverGradient} opacity-10 blur-3xl group-hover/vid:opacity-20 transition-opacity duration-500`} />

        {/* Ambient bottom-up dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        {/* Technical dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

        {/* Technical HUD Corner Brackets */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/10 pointer-events-none group-hover/vid:border-white/30 transition-colors duration-300" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/10 pointer-events-none group-hover/vid:border-white/30 transition-colors duration-300" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/10 pointer-events-none group-hover/vid:border-white/30 transition-colors duration-300" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/10 pointer-events-none group-hover/vid:border-white/30 transition-colors duration-300" />

        {/* Elegant Background Index Number in serif */}
        <div className="absolute top-4 right-14 text-4xl font-serif italic text-white/[0.03] select-none pointer-events-none font-light">
          0{index + 1}
        </div>

        {/* Pulsing Status Tag */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 font-mono text-[9px] font-bold tracking-wider text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          STREAM_READY
        </div>

        {/* Duration Tag */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 font-mono text-[9px] font-semibold text-neutral-300">
          <Clock size={10} className="w-2.5 h-2.5 text-neutral-400" />
          {video.duration}
        </div>

        {/* Play Button Icon */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-13 h-13 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover/vid:scale-105 group-hover/vid:bg-[#ef4d23] group-hover/vid:border-[#ef4d23] group-hover/vid:shadow-[0_0_20px_rgba(239,77,35,0.45)] transition-all duration-300 shadow-lg">
            <Play size={18} className="text-white fill-white ml-0.5" />
          </div>
        </div>

        {/* Card Metadata Details */}
        <div className="relative z-20">
          <span className="text-[9px] font-mono font-bold text-orange-400 uppercase tracking-widest block mb-1">
            CINEMATIC SEMINAR
          </span>
          <h3 className="text-base md:text-lg font-bold tracking-tight text-white mb-1.5 leading-snug group-hover/vid:text-orange-200 transition-colors duration-300">
            {video.title}
          </h3>
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-normal opacity-90 max-w-xl">
            {video.description}
          </p>
        </div>
      </div>
    );
  };

  const renderArticleCard = (art: Article, index: number) => {
    return (
      <div 
        onClick={() => setActiveArticle(art)}
        className="relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl border cursor-pointer group hover:scale-[1.01] hover:shadow-lg transition-all duration-300 select-none overflow-hidden h-full w-full" 
        style={{ 
          backgroundColor: 'var(--bg-card)', 
          borderColor: 'var(--border)', 
          boxShadow: 'var(--shadow-sm)' 
        }}
      >
        {/* Glow hover background effect */}
        <div className={`absolute -right-24 -top-24 w-48 h-48 rounded-full bg-gradient-to-br ${art.coverGradient} opacity-0 group-hover:opacity-[0.04] blur-3xl transition-opacity duration-500`} />

        {/* Technical HUD Corner Brackets */}
        <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-neutral-400/10 pointer-events-none group-hover:border-[#ef4d23]/30 transition-colors duration-300" />
        <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-neutral-400/10 pointer-events-none group-hover:border-[#ef4d23]/30 transition-colors duration-300" />
        <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-neutral-400/10 pointer-events-none group-hover:border-[#ef4d23]/30 transition-colors duration-300" />
        <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-neutral-400/10 pointer-events-none group-hover:border-[#ef4d23]/30 transition-colors duration-300" />

        {/* Elegant Background Index Number in serif */}
        <div className="absolute top-4 right-10 text-4xl font-serif italic text-neutral-400/5 dark:text-white/5 select-none pointer-events-none font-light">
          0{index + 1}
        </div>

        {/* Top meta tags */}
        <div className="flex-1 flex flex-col justify-start">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono font-bold text-[#ef4d23] bg-[#ef4d23]/[0.06] px-2.5 py-1 rounded-md border border-[#ef4d23]/10 uppercase tracking-wider">
              {art.category}
            </span>
            <span className="text-[10px] font-mono text-[var(--fg-muted)] flex items-center gap-1">
              <Clock size={10} className="w-2.5 h-2.5" />
              {art.readTime.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold tracking-tight mb-2.5 leading-snug group-hover:text-[#ef4d23] transition-colors duration-300" style={{ color: 'var(--fg)' }}>
            {art.title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-[12.5px] leading-relaxed mb-6 font-normal line-clamp-3" style={{ color: 'var(--fg-secondary)' }}>
            {art.excerpt}
          </p>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dashed mt-auto" style={{ borderColor: 'var(--border-strong)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-6.5 h-6.5 rounded-lg bg-gradient-to-tr from-[#ef4d23] to-orange-400 flex items-center justify-center text-white font-mono font-bold text-xs shadow-sm">
              {art.author[0]}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-bold leading-none mb-0.5" style={{ color: 'var(--fg)' }}>{art.author}</span>
              <span className="text-[9px] font-mono leading-none" style={{ color: 'var(--fg-muted)' }}>{art.date}</span>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#ef4d23] uppercase tracking-wider group-hover:translate-x-1 transition-transform duration-300">
            Read Essay <ArrowRight size={11} className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className="cinematic-section relative overflow-hidden py-20 sm:py-28" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Background Visual Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-neutral-400/20" />
        <div className="absolute top-0 left-2/4 w-[1px] h-full bg-neutral-400/20" />
        <div className="absolute top-0 left-3/4 w-[1px] h-full bg-neutral-400/20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
            CONVIX ACADEMY
          </span>
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
            {sectionTitle}
          </h2>
          <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
            {sectionSubtitle}
          </p>
        </div>

        {/* Elegant Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Row 1, Col 1: Video 0 */}
          {videos[0] && (
            <motion.div 
              className="lg:col-span-7 h-full flex flex-col justify-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {activeVideoId === videos[0].id ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', backgroundColor: '#000' }}>
                  <iframe
                    className="w-full h-full absolute inset-0 block border-0"
                    src={`${videos[0].videoUrl}?autoplay=1`}
                    title={videos[0].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveVideoId(null); }}
                    className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/10"
                  >
                    <X size={14} className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full" onClick={() => setActiveVideoId(videos[0].id)}>
                  {renderVideoCard(videos[0], 0)}
                </div>
              )}
            </motion.div>
          )}

          {/* Row 1, Col 2: Article 0 */}
          {articles[0] && (
            <motion.div 
              className="lg:col-span-5 h-full flex"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {renderArticleCard(articles[0], 0)}
            </motion.div>
          )}

          {/* Row 2, Col 1: Article 1 */}
          {articles[1] && (
            <motion.div 
              className="lg:col-span-5 h-full flex"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {renderArticleCard(articles[1], 1)}
            </motion.div>
          )}

          {/* Row 2, Col 2: Video 1 */}
          {videos[1] && (
            <motion.div 
              className="lg:col-span-7 h-full flex flex-col justify-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {activeVideoId === videos[1].id ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', backgroundColor: '#000' }}>
                  <iframe
                    className="w-full h-full absolute inset-0 block border-0"
                    src={`${videos[1].videoUrl}?autoplay=1`}
                    title={videos[1].title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setActiveVideoId(null); }}
                    className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/60 text-white hover:bg-black border border-white/10"
                  >
                    <X size={14} className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full" onClick={() => setActiveVideoId(videos[1].id)}>
                  {renderVideoCard(videos[1], 1)}
                </div>
              )}
            </motion.div>
          )}

        </div>
      </div>

      {/* MODERN OVERLAY READER DRAWER: Classic dropcap serif layout */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            
            {/* Dark heavy blur overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-[#07090f]/75 backdrop-blur-md cursor-pointer"
              onClick={() => setActiveArticle(null)}
            />

            {/* Premium Slide-out Article Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 220 }}
              className="relative w-full max-w-3xl h-full shadow-2xl flex flex-col z-10"
              style={{ backgroundColor: 'var(--bg-elevated)', borderLeft: '1px solid var(--border-strong)' }}
            >
              
              {/* Dynamic reading scrolling progress bar */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-neutral-200 dark:bg-neutral-800 z-30">
                <div
                  className="h-full bg-[#ef4d23] transition-all duration-75 shadow-[0_0_8px_rgba(239,77,35,0.6)]"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>

              {/* Reader panel header */}
              <div className="px-6 sm:px-10 py-6 border-b flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono font-bold text-[#ef4d23] bg-[#ef4d23]/8 px-3 py-1.5 rounded-full border border-[#ef4d23]/15 uppercase tracking-wider">
                    {activeArticle.category}
                  </span>
                  <span className="text-xs font-mono" style={{ color: 'var(--fg-muted)' }}>• ESTIMATED {activeArticle.readTime.toUpperCase()} READ</span>
                </div>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="w-10 h-10 rounded-full bg-[var(--bg-surface)] hover:bg-[var(--border-strong)] flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-sm animate-none"
                  style={{ color: 'var(--fg-secondary)', border: '1px solid var(--border)' }}
                >
                  <X size={18} className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Reader panel body content (Scrollable) */}
              <div
                ref={modalContentRef}
                onScroll={handleModalScroll}
                className="flex-grow overflow-y-auto px-6 sm:px-12 py-10 sm:py-16 custom-scrollbar scroll-smooth"
                data-lenis-prevent="true"
              >
                <article className="max-w-2xl mx-auto">
                  
                  {/* Category breadcrumb */}
                  <span className="text-xs font-mono font-bold text-[#ef4d23] uppercase tracking-widest block mb-3">CONVIX EDITORIAL / {activeArticle.category.toUpperCase()}</span>
                  
                  {/* Classic serif title */}
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-8 leading-[1.15] font-serif" style={{ color: 'var(--fg)' }}>
                    {activeArticle.title}
                  </h1>

                  {/* Fully structured technical author card */}
                  <div className="flex items-center justify-between gap-4 mb-10 pb-6 border-b" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#ef4d23] to-orange-400 flex items-center justify-center text-white font-mono font-bold text-sm shadow-md">
                        {activeArticle.author[0]}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold" style={{ color: 'var(--fg)' }}>{activeArticle.author}</p>
                        <p className="text-[11.5px] font-mono" style={{ color: 'var(--fg-muted)' }}>Convix Engineering Research</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col font-mono text-[11px]" style={{ color: 'var(--fg-muted)' }}>
                      <span className="font-bold flex items-center gap-1 justify-end"><User size={10} className="w-2.5 h-2.5" /> Editorial Board</span>
                      <span className="flex items-center gap-1 justify-end mt-0.5"><Calendar size={10} className="w-2.5 h-2.5" /> {activeArticle.date}</span>
                    </div>
                  </div>

                  {/* Structured Content Rendering with dropcap editorial layout */}
                  <div className="space-y-6 text-base sm:text-lg leading-[1.8] text-[var(--fg-secondary)] font-normal font-sans">
                    {activeArticle.content.map((block, bIdx) => {
                      switch (block.type) {
                        case 'paragraph':
                          // Render drop-cap for the very first paragraph
                          if (bIdx === 0) {
                            return (
                              <p key={bIdx} className="first-letter:text-6xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#ef4d23] first-letter:font-serif first-letter:leading-none text-[15px] sm:text-[17px] leading-[1.85] text-[var(--fg-secondary)] clear-both">
                                {block.text}
                              </p>
                            );
                          }
                          return (
                            <p key={bIdx} className="text-[15px] sm:text-[17px] leading-[1.85] text-[var(--fg-secondary)]">
                              {block.text}
                            </p>
                          );
                        case 'heading':
                          return (
                            <h3 key={bIdx} className="text-xl sm:text-2xl font-bold tracking-tight mt-10 mb-4 text-[var(--fg)] font-serif border-l-4 border-[#ef4d23]/40 pl-4 py-0.5">
                              {block.text}
                            </h3>
                          );
                        case 'quote':
                          return (
                            <blockquote key={bIdx} className="border-l-4 border-[#ef4d23] pl-6 italic my-8 text-[var(--fg-secondary)] bg-[#ef4d23]/[0.02] p-5 rounded-r-2xl border-l-[5px] text-[15.5px] leading-relaxed sm:text-[16.5px]">
                              "{block.text}"
                            </blockquote>
                          );
                        case 'list':
                          return (
                            <ul key={bIdx} className="list-disc pl-6 mb-8 space-y-3.5 text-[var(--fg-secondary)] text-[14.5px] sm:text-[15.5px] font-mono">
                              {Array.isArray(block.text) && block.text.map((item, lIdx) => (
                                <li key={lIdx} className="leading-[1.7]"><span className="text-[var(--fg)]">{item}</span></li>
                              ))}
                            </ul>
                          );
                        default:
                          return null;
                      }
                    })}
                  </div>
                </article>
              </div>

              {/* Reader panel footer */}
              <div className="px-6 sm:px-10 py-6 border-t flex items-center justify-between shrink-0" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
                <span className="text-[10px] font-mono text-[var(--fg-muted)]">SYSTEM ID: CONVIX-{activeArticle.id.toUpperCase()}</span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="bg-[#ef4d23] hover:bg-[#d9441f] text-white text-xs font-mono font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#ef4d23]/10 cursor-pointer"
                >
                  Terminate Session
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
