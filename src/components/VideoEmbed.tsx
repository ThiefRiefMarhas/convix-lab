import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

interface VideoEmbedProps {
  title: string;
  videoUrl: string;
  description?: string;
}

export default function VideoEmbed({ title, videoUrl, description }: VideoEmbedProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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

  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return match[2];
    }
    const matchFallback = url.match(/\/embed\/([^?]+)/);
    return matchFallback ? matchFallback[1] : '';
  };

  const videoId = getYouTubeId(videoUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-4xl mx-auto px-4">
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
            className="relative overflow-hidden rounded-3xl border aspect-video w-full"
            style={{ borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)', backgroundColor: '#000' }}
          >
            {isPlaying ? (
              <iframe
                className="w-full h-full absolute inset-0 block border-0"
                src={`${videoUrl}${videoUrl.includes('?') ? '&' : '?'}autoplay=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isVisible && thumbnailUrl ? (
              <div 
                className="relative w-full h-full cursor-pointer group flex flex-col justify-end p-6"
                onClick={() => setIsPlaying(true)}
              >
                {/* YouTube Thumbnail */}
                <img 
                  src={thumbnailUrl} 
                  alt={title}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Bottom gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent z-10" />

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#ef4d23] group-hover:border-[#ef4d23] group-hover:shadow-[0_0_20px_rgba(239,77,35,0.45)] transition-all duration-300 shadow-lg">
                    <Play size={22} className="text-white fill-white ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
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

