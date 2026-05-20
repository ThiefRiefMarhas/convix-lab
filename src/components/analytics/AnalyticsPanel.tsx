import { useState, useEffect } from 'react';
import { Activity, Target, Zap, Globe, MessageSquare, Loader2, PieChart } from 'lucide-react';
import api from '../../services/api';

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

interface AnalyticsData {
  usage: {
    messages_today: number;
    searches_today: number;
    conversations_total: number;
  };
  totals: {
    conversations: number;
    sources: number;
    analyzedIdeas: number;
  };
  topDomains: { domain: string; count: number }[];
  topTags: { tag: string; count: number }[];
  viability: {
    averageScore: number;
    distribution: {
      green: number;
      yellow: number;
      red: number;
    };
  };
}

export function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics');
      setData(response.data);
    } catch (err) {
      setError('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500 dark:text-white/50">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center text-red-500 dark:text-red-400">
        <p>{error || 'No data available'}</p>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, subtext }: any) => (
    <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-white/5 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-neutral-600 dark:text-white/70">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-neutral-500 dark:text-white/60 font-medium">{label}</span>
      </div>
      <div className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">{value}</div>
      {subtext && <div className="text-xs text-neutral-400 dark:text-white/40 mt-2">{subtext}</div>}
    </div>
  );

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar bg-neutral-50 dark:bg-[#0a0a0a]">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-3">
          <Logo />
          Dashboard Analytics
        </h2>
        <p className="text-neutral-500 dark:text-white/60 text-sm">Overview of your research activity and idea viability.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Activity} 
          label="Searches Today" 
          value={data.usage.searches_today} 
          subtext="Queries run across the web"
        />
        <StatCard 
          icon={MessageSquare} 
          label="Messages Today" 
          value={data.usage.messages_today} 
          subtext="AI interactions"
        />
        <StatCard 
          icon={Target} 
          label="Ideas Analyzed" 
          value={data.totals.analyzedIdeas} 
          subtext="Full deep-dives completed"
        />
        <StatCard 
          icon={Zap} 
          label="Avg Viability" 
          value={`${data.viability.averageScore}/100`} 
          subtext="Across all analyzed ideas"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viability Distribution */}
        <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-neutral-400 dark:text-white/50" />
            Viability Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-neutral-600 dark:text-white/60">High Potential</div>
              <div className="flex-1 h-3 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full" 
                  style={{ width: `${(data.viability.distribution.green / Math.max(1, data.totals.analyzedIdeas)) * 100}%` }}
                />
              </div>
              <div className="w-8 text-right font-medium text-neutral-900 dark:text-white">{data.viability.distribution.green}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-neutral-600 dark:text-white/60">Moderate</div>
              <div className="flex-1 h-3 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ width: `${(data.viability.distribution.yellow / Math.max(1, data.totals.analyzedIdeas)) * 100}%` }}
                />
              </div>
              <div className="w-8 text-right font-medium text-neutral-900 dark:text-white">{data.viability.distribution.yellow}</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-neutral-600 dark:text-white/60">Risky</div>
              <div className="flex-1 h-3 bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full" 
                  style={{ width: `${(data.viability.distribution.red / Math.max(1, data.totals.analyzedIdeas)) * 100}%` }}
                />
              </div>
              <div className="w-8 text-right font-medium text-neutral-900 dark:text-white">{data.viability.distribution.red}</div>
            </div>
          </div>
        </div>

        {/* Top Domains */}
        <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-neutral-400 dark:text-white/50" />
            Top Research Sources
          </h3>
          <div className="space-y-3">
            {data.topDomains.length > 0 ? data.topDomains.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-white/5 border border-neutral-100 dark:border-white/5">
                <span className="text-sm font-medium text-neutral-800 dark:text-white/80">{d.domain}</span>
                <span className="text-xs bg-neutral-200 dark:bg-white/10 px-2 py-1 rounded text-neutral-600 dark:text-white/60">{d.count} sources</span>
              </div>
            )) : (
              <p className="text-sm text-neutral-400 dark:text-white/40">No sources collected yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
