import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface VideoEmbedProps {
  title: string;
  videoUrl: string;
  description?: string;
}

export default function VideoEmbed({ title, videoUrl, description }: VideoEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="text-2xl md:text-4xl font-medium tracking-tight text-center mb-4"
            style={{ color: 'var(--fg)' }}
          >
            {title}
          </h2>
          {description && (
            <p className="text-center mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--fg-secondary)', fontSize: 'clamp(14px, 2.5vw, 16px)' }}>
              {description}
            </p>
          )}

          {/* data-lenis-prevent stops Lenis from intercepting scroll inside iframe */}
          <div
            data-lenis-prevent
            className="relative overflow-hidden rounded-3xl border"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' }}
          >
            {isVisible ? (
              <iframe
                className="aspect-video w-full block"
                src={videoUrl}
                title={title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="aspect-video w-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
                <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center" style={{ borderColor: 'var(--border-strong)' }}>
                  <div className="w-0 h-0 border-l-[14px] border-t-[8px] border-b-[8px] border-t-transparent border-b-transparent ml-1" style={{ borderLeftColor: 'var(--fg-muted)' }} />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
