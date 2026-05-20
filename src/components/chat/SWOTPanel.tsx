import { useState, useEffect } from 'react';
import { Loader2, Plus, Edit2, Check, RefreshCw, Zap } from 'lucide-react';
import api from '../../services/api';

interface SWOTItem {
  text: string;
  score: number;
  evidence: string;
}

interface SWOTData {
  strengths: SWOTItem[];
  weaknesses: SWOTItem[];
  opportunities: SWOTItem[];
  threats: SWOTItem[];
  overall_score: number;
  ai_summary: string;
}

interface SWOTPanelProps {
  conversationId: string;
}

export function SWOTPanel({ conversationId }: SWOTPanelProps) {
  const [data, setData] = useState<SWOTData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSWOT();
  }, [conversationId]);

  const fetchSWOT = async () => {
    try {
      const response = await api.get(`/swot/${conversationId}`);
      setData(response.data);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        setError('Failed to load SWOT analysis');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const response = await api.post('/swot/generate', { conversationId });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate SWOT');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 text-white/50">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center border border-neutral-200/60 dark:border-white/10 rounded-xl bg-neutral-50 dark:bg-white/5">
        <Zap className="w-12 h-12 text-[#ef4d23]/50 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">No SWOT Analysis</h3>
        <p className="text-sm text-neutral-500 dark:text-white/60 mb-6 max-w-md mx-auto">
          Generate an AI-driven SWOT analysis based on the latest research report.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-3 bg-primary/20 text-primary border border-primary/30 rounded-lg font-medium hover:bg-primary/30 transition-all flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
        >
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {generating ? 'Analyzing...' : 'Generate SWOT'}
        </button>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    );
  }

  const renderSection = (title: string, items: SWOTItem[], colorText: string, colorBg: string) => (
    <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200/60 dark:border-white/10 rounded-xl p-5">
      <h4 className={`text-lg font-bold mb-4 ${colorText}`}>{title}</h4>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="text-sm flex items-start gap-3">
            <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colorBg} ${colorText}`}>
              {item.score}
            </span>
            <div>
              <p className="font-medium text-neutral-800 dark:text-white/90">{item.text}</p>
              <p className="text-xs text-neutral-500 dark:text-white/40 mt-1">{item.evidence}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            SWOT Analysis 
            <span className="px-2 py-1 bg-neutral-200/50 dark:bg-white/10 text-neutral-700 dark:text-white/80 rounded-md text-xs">Score: {data.overall_score}/10</span>
          </h3>
          <p className="text-sm text-neutral-500 dark:text-white/60 mt-1">{data.ai_summary}</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="p-2 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-200 dark:hover:bg-white/10 text-neutral-600 dark:text-white/70 transition-colors"
          title="Regenerate SWOT"
        >
          <RefreshCw className={`w-5 h-5 ${generating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSection('Strengths', data.strengths, 'text-green-600 dark:text-green-400', 'bg-green-50 dark:bg-green-500/10')}
        {renderSection('Weaknesses', data.weaknesses, 'text-red-600 dark:text-red-400', 'bg-red-50 dark:bg-red-500/10')}
        {renderSection('Opportunities', data.opportunities, 'text-blue-600 dark:text-blue-400', 'bg-blue-50 dark:bg-blue-500/10')}
        {renderSection('Threats', data.threats, 'text-orange-600 dark:text-orange-400', 'bg-orange-50 dark:bg-orange-500/10')}
      </div>
    </div>
  );
}
