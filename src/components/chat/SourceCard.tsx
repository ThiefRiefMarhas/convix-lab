import React from 'react';
import { ExternalLink, Globe } from 'lucide-react';
import { motion } from 'motion/react';

interface SourceCardProps {
  source: {
    id: string;
    url: string;
    title: string | null;
    domain: string | null;
    snippet: string | null;
    relevance_score: number | null;
    source_type: string;
    search_query: string | null;
  };
  index: number;
}

export default function SourceCard({ source, index }: SourceCardProps) {
  return (
    <motion.a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="block bg-white border border-neutral-200/60 rounded-xl p-3.5 hover:border-[#ef4d23]/40 hover:shadow-md transition-all duration-200 group cursor-pointer"
    >
      {/* Domain */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Globe size={11} className="text-neutral-400" />
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide truncate max-w-[140px]">
            {source.domain || 'unknown'}
          </span>
        </div>
        <ExternalLink size={11} className="text-neutral-300 group-hover:text-[#ef4d23] transition-colors" />
      </div>

      {/* Title */}
      <h4 className="text-[13px] font-semibold text-neutral-800 leading-snug line-clamp-2 group-hover:text-[#ef4d23] transition-colors mb-1.5">
        {source.title || source.url}
      </h4>

      {/* Snippet */}
      {source.snippet && (
        <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
          {source.snippet}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-2 mt-2.5">
        {source.relevance_score != null && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
            source.relevance_score > 0.8
              ? 'bg-emerald-50 text-emerald-600'
              : source.relevance_score > 0.5
                ? 'bg-amber-50 text-amber-600'
                : 'bg-neutral-100 text-neutral-500'
          }`}>
            {Math.round(source.relevance_score * 100)}% match
          </span>
        )}
        <span className="text-[10px] text-neutral-300 capitalize">
          {source.source_type === 'tavily' ? 'search' : 'scraped'}
        </span>
      </div>
    </motion.a>
  );
}
