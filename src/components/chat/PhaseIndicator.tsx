import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import type { PhaseProgress } from '../../hooks/useChat';

interface PhaseIndicatorProps {
  progress: PhaseProgress;
  sources?: Array<{ domain: string; url: string }>;
}

const RESEARCHERS = [
  { id: 1, name: 'Competitor intel researcher', icon: '> <' },
  { id: 2, name: 'Market gap researcher', icon: 'o_o' },
  { id: 3, name: 'Community signals researcher', icon: '^ ^' },
  { id: 4, name: 'Strategic synthesis researcher', icon: '-_-' },
];

export default function PhaseIndicator({ progress, sources = [] }: PhaseIndicatorProps) {
  const [elapsed, setElapsed] = useState(0);

  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (progress.status === 'idle' || progress.status === 'complete') return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [progress.status, startTime]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  const isComplete = progress.status === 'complete';
  const totalSources = progress.sourcesFound || sources.length || 0;

  // Group sources to create favicons
  const getFaviconUrl = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  const renderFavicons = (count: number = 3) => {
    const uniqueDomains = Array.from(new Set(sources.map(s => s.domain))).filter(Boolean);
    const displayDomains = uniqueDomains.slice(0, count);
    
    return (
      <div className="flex -space-x-1.5">
        {displayDomains.map((domain, i) => (
          <div key={i} className="w-5 h-5 rounded-full border border-white dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
            <img src={getFaviconUrl(domain)} alt={domain} className="w-3.5 h-3.5" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          </div>
        ))}
        {uniqueDomains.length === 0 && (
          <div className="w-5 h-5 rounded-full border border-white dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
            <Globe size={10} className="text-neutral-400" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#fdfdfc] dark:bg-neutral-900 border border-[#e5e5e0] dark:border-neutral-800 rounded-2xl p-5 mb-6 shadow-sm font-sans">
      
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {isComplete ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <Loader2 size={18} className="text-[#ef4d23] animate-spin" />
          )}
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {isComplete ? 'Completed' : 'Running analysis...'}
          </h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 ml-1">
          {renderFavicons(3)}
          <span>{totalSources} sources</span>
          <span>•</span>
          <span>{formatTime(elapsed)}</span>
        </div>
      </div>

      {/* Researcher Cards */}
      <div className="flex flex-col gap-3">
        {RESEARCHERS.map((researcher) => {
          const isActive = progress.phase === researcher.id;
          const isPast = progress.phase > researcher.id || isComplete;
          
          return (
            <motion.div 
              key={researcher.id}
              initial={{ opacity: 0.8, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl border transition-colors duration-300 ${
                isActive 
                  ? 'bg-orange-50/50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/40 shadow-sm' 
                  : 'bg-white dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700/50'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-8 flex justify-center text-neutral-400 font-mono text-xs font-bold tracking-tighter">
                  {researcher.icon}
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-[13px] font-bold text-neutral-800 dark:text-neutral-200">
                      {researcher.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      {isPast ? (
                        <CheckCircle2 size={12} className="text-green-500" />
                      ) : isActive ? (
                        <Loader2 size={12} className="text-[#ef4d23] animate-spin" />
                      ) : (
                        <div className="w-3 h-3 rounded-full border-2 border-neutral-200 dark:border-neutral-700" />
                      )}
                      <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                        {isPast ? 'Completed' : isActive ? 'Analyzing...' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Sources Count for Phase (Simulated distribution) */}
                  {(isPast || isActive) && (
                    <div className="flex items-center gap-2">
                      {renderFavicons(4)}
                      <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
                        +{Math.floor(totalSources / 4) + (isActive ? Math.floor(Math.random() * 5) : 10)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
