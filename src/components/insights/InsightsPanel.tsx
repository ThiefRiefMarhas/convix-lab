import { useState, useEffect } from 'react';
import { Loader2, Lightbulb, TrendingUp, AlertTriangle, RefreshCw, Zap } from 'lucide-react';
import api from '../../services/api';

interface InsightsData {
  verdict: 'green' | 'yellow' | 'red';
  viability_score: number;
  key_metrics: {
    tam?: string;
    cagr?: string;
    [key: string]: string | undefined;
  };
  tags: string[];
  market_size: string;
  competitor_count: number;
  difficulty: 'low' | 'medium' | 'high';
  ai_summary: string;
}

interface InsightsPanelProps {
  conversationId: string;
}

export function InsightsPanel({ conversationId }: InsightsPanelProps) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, [conversationId]);

  const fetchInsights = async () => {
    try {
      const response = await api.get(`/insights/${conversationId}`);
      setData(response.data);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError('Failed to load insights');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await api.post('/insights/generate', { conversationId });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate insights');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-neutral-400 dark:text-white/50">
        <Loader2 className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-center border border-neutral-200/60 dark:border-white/5 rounded-xl bg-neutral-50 dark:bg-white/5">
        <Lightbulb className="w-8 h-8 text-[#ef4d23]/50 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">Executive Insights</h3>
        <p className="text-xs text-neutral-500 dark:text-white/50 mb-4">
          Generate high-level strategic insights based on the analysis.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg text-sm font-medium hover:bg-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {generating ? 'Extracting...' : 'Extract Insights'}
        </button>
      </div>
    );
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'green': return 'text-green-700 dark:text-green-400 bg-green-50/70 dark:bg-green-400/10 border-green-200 dark:border-green-400/20';
      case 'yellow': return 'text-yellow-700 dark:text-yellow-400 bg-yellow-50/70 dark:bg-yellow-400/10 border-yellow-200 dark:border-yellow-400/20';
      case 'red': return 'text-red-700 dark:text-red-400 bg-red-50/70 dark:bg-red-400/10 border-red-200 dark:border-red-400/20';
      default: return 'text-neutral-700 dark:text-white/70 bg-neutral-50 dark:bg-white/10 border-neutral-200 dark:border-white/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          Strategic Insights
        </h3>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="p-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-md hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-500 dark:text-white/50 transition-colors"
          title="Regenerate"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Viability Score & Verdict */}
      <div className={`p-4 rounded-xl border flex items-center justify-between ${getVerdictColor(data.verdict)}`}>
        <div>
          <div className="text-xs font-semibold uppercase opacity-70 mb-1">Overall Viability</div>
          <div className="font-bold capitalize">{data.verdict === 'green' ? 'High Potential' : data.verdict === 'yellow' ? 'Moderate Risk' : 'High Risk'}</div>
        </div>
        <div className="text-3xl font-black tracking-tighter">
          {data.viability_score}
        </div>
      </div>

      <p className="text-sm text-neutral-600 dark:text-white/80 leading-relaxed bg-neutral-50 dark:bg-white/5 p-4 rounded-xl border border-neutral-200/60 dark:border-white/5">
        "{data.ai_summary}"
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 rounded-xl p-3">
          <div className="text-xs text-neutral-500 dark:text-white/50 mb-1 flex items-center gap-1"><TrendingUp className="w-3 h-3"/> Market Size</div>
          <div className="font-semibold text-sm text-neutral-800 dark:text-white truncate">{data.key_metrics.tam || data.market_size || 'N/A'}</div>
        </div>
        <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 rounded-xl p-3">
          <div className="text-xs text-neutral-500 dark:text-white/50 mb-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Difficulty</div>
          <div className="font-semibold text-sm text-neutral-800 dark:text-white capitalize">{data.difficulty}</div>
        </div>
        <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 rounded-xl p-3 col-span-2 flex items-center justify-between">
          <div className="text-xs text-neutral-500 dark:text-white/50">Competitors Identified</div>
          <div className="font-bold text-neutral-800 dark:text-white bg-neutral-200 dark:bg-white/10 px-2 py-0.5 rounded text-sm">{data.competitor_count}</div>
        </div>
      </div>

      {/* Tags */}
      {data.tags && data.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {data.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-xs font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

