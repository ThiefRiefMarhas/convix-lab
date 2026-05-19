import { TrendingUp, Activity, Shield, Target, Zap } from 'lucide-react';
import Gauge from './Gauge';

/**
 * DashboardPreview — ALWAYS uses dark glass styling regardless of theme.
 * This creates the "strategic AI operating layer" aesthetic.
 */
export default function DashboardPreview() {
  return (
    <div className="px-3 sm:px-4" id="dashboard-tray-wrapper">
      <div className="rounded-3xl p-4 sm:p-6 w-full max-w-[880px] mx-auto glass-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1 — Market Opportunity Score */}
          <div className="rounded-2xl p-5 flex flex-col gap-4 bg-white/[0.04] border border-white/[0.06]" id="card-market">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#ef4d23] font-semibold flex items-center gap-1.5">
                <Target size={14} />
                Market Opportunity
              </span>
              <span className="font-medium text-white/40">Live Score</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[28px] font-semibold tracking-tight text-white">87.4</span>
                <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                  <TrendingUp size={12} />
                  REAL GAP
                </span>
              </div>
              <p className="text-[11px] mt-1 uppercase tracking-wider font-semibold text-white/30">Strategic confidence high</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center -mt-2">
              <span className="text-[11px] mb-2 font-medium text-white/50">Validation Confidence</span>
              <Gauge value={87} showLabels min="Low" max="High" />
            </div>
            <div className="rounded-full p-1 flex mt-2 bg-white/[0.04]">
              <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-full text-white/50">Opportunity</button>
              <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-full bg-white/[0.08] text-white/90">Risk Index</button>
            </div>
          </div>

          {/* Card 2 — Strategic Analysis */}
          <div className="rounded-2xl p-5 flex flex-col gap-3 bg-white/[0.04] border border-white/[0.06]" id="card-analysis">
            <div className="flex items-center gap-1.5 text-[13px] text-[#ef4d23] font-semibold mb-1">
              <Activity size={14} />
              Strategic Metrics
            </div>
            <div className="space-y-3">
              {[
                { label: 'Brand Positioning', value: '92%', },
                { label: 'Competitor Density', value: 'Low', },
                { label: 'Monetization Feasibility', value: '78%', },
                { label: 'Founder-Market Fit', value: 'Strong', },
              ].map((metric, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-white/[0.06]">
                  <span className="text-[13px] font-medium text-white/50">{metric.label}</span>
                  <span className="text-[13px] font-semibold flex items-center gap-1 text-white/90">
                    {metric.value}
                    <TrendingUp size={12} className="text-emerald-400" />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3 — Risk Index */}
          <div className="rounded-2xl p-5 flex flex-col gap-4 bg-white/[0.04] border border-white/[0.06]" id="card-risk">
            <div className="flex justify-between items-center text-[13px]">
              <span className="text-[#ef4d23] font-semibold flex items-center gap-1.5">
                <Shield size={14} />
                Risk Assessment
              </span>
              <span className="font-medium text-white/40">Real-time</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[28px] font-semibold tracking-tight text-white">24</span>
                <span className="flex items-center gap-1 bg-amber-500/15 text-amber-400 rounded-full px-2 py-0.5 text-[11px] font-semibold">
                  <Zap size={12} />
                  MODERATE
                </span>
              </div>
              <p className="text-[11px] mt-1 uppercase tracking-wider font-semibold text-white/30">Proceed with strategy</p>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center -mt-2">
              <Gauge value={24} color="#f59e0b" />
            </div>
            <div className="rounded-full p-1 flex mt-2 bg-white/[0.04]">
              <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-full bg-white/[0.08] text-white/90">Risk Score</button>
              <button className="flex-1 text-[11px] font-semibold py-1.5 rounded-full text-white/50">Gap Detection</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
