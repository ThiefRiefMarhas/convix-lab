import React from 'react';
import { Search, CheckCircle, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface ToolActivity {
  id: string;
  tool: string;
  status: 'running' | 'done';
  query?: string;
  url?: string;
  sources?: Array<{ url: string; title: string; domain: string; snippet: string; score: number }>;
  error?: string;
}

export default function ToolCallCard({ activity }: { activity: ToolActivity }) {
  const isSearch = activity.tool === 'tavily_search';
  const isRunning = activity.status === 'running';

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
      <div className={`rounded-xl px-4 py-3 max-w-[85%] border ${
        isRunning ? 'bg-blue-50/50 border-blue-100' : activity.error ? 'bg-red-50/50 border-red-100' : 'bg-emerald-50/50 border-emerald-100'
      }`}>
        <div className="flex items-center gap-2.5">
          {isRunning ? (
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <Search size={12} className="text-blue-600 animate-pulse" />
            </div>
          ) : activity.error ? (
            <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle size={12} className="text-red-600" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle size={12} className="text-emerald-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-neutral-700">
              {isSearch ? 'Web Search' : 'Website Analysis'}
              {isRunning && <span className="text-blue-500 ml-1">in progress...</span>}
              {!isRunning && !activity.error && activity.sources && (
                <span className="text-emerald-600 ml-1">· {activity.sources.length} sources</span>
              )}
            </p>
            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
              <Globe size={10} className="inline mr-1" />
              {isSearch ? `"${activity.query}"` : activity.url}
            </p>
          </div>
        </div>
        {!isRunning && activity.sources && activity.sources.length > 0 && (
          <div className="mt-2 space-y-1 pl-8">
            {activity.sources.slice(0, 3).map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                className="block text-[11px] text-blue-600 hover:text-blue-800 truncate transition-colors">
                {s.title || s.domain}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
