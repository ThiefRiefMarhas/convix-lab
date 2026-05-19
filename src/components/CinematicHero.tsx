import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { type ReactNode, type MouseEvent } from 'react';
import { useAuth } from '../context/AuthContext';

interface CinematicHeroProps {
  videoSrc: string;
  headline: ReactNode;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  children?: ReactNode;
}

export default function CinematicHero({
  videoSrc,
  headline,
  subheadline,
  ctaText,
  ctaLink = '/app',
  ctaSecondaryText,
  ctaSecondaryLink,
  children,
}: CinematicHeroProps) {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  const handleCTA = (e: MouseEvent) => {
    e.preventDefault();
    if (user) navigate(ctaLink);
    else openAuthModal();
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-hidden" style={{ backgroundColor: '#0b0f1a' }}>
        {/* Video */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video autoPlay muted loop playsInline preload="metadata" className="w-full h-full object-cover">
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-[1]" />

        {/* Content — pt-[140px] ensures it always sits safely below navbar and doesn't get pushed up by flexbox */}
        <div className="relative z-10 flex flex-col items-center justify-start min-h-[100dvh] px-4 sm:px-6 pt-[140px] sm:pt-[180px] pb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(36px, 8vw, 72px)', lineHeight: 1.05, fontWeight: 500, letterSpacing: '-0.02em' }}
            className="max-w-4xl text-white"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(14px, 3vw, 17px)' }}
            className="mt-5 sm:mt-6 text-white/60 font-medium max-w-xl leading-relaxed"
          >
            {subheadline}
          </motion.p>

          {(ctaText || ctaSecondaryText) && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4"
            >
              {ctaText && (
                <button onClick={handleCTA}
                  className="inline-flex items-center gap-3 bg-[#ef4d23] text-white rounded-full pl-6 pr-2 py-2.5 text-[14px] font-semibold hover:bg-[#d9441f] transition-all shadow-lg group">
                  {ctaText}
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ChevronRight size={16} />
                  </div>
                </button>
              )}
              {ctaSecondaryText && ctaSecondaryLink && (
                <button onClick={() => navigate(ctaSecondaryLink)}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white text-[14px] font-medium transition-colors border border-white/15 rounded-full px-6 py-2.5 hover:border-white/30">
                  {ctaSecondaryText}
                </button>
              )}
            </motion.div>
          )}

          {children}
        </div>
    </div>
  );
}
