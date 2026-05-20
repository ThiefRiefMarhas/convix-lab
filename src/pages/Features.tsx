import CinematicHero from '../components/CinematicHero';
import InsightsHub, { type Article, type Video } from '../components/InsightsHub';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Activity, Target, Shield, Zap, BarChart3, Users, TrendingUp, Search, Brain, FileText, Mic, Image, MessageSquare, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const featuresVideos: Video[] = [
  {
    id: "features-vid-1",
    title: "Operationalizing Strategy in the Age of Co-Pilots",
    description: "Reid Hoffman explains how AI-native tools shift early startup cycles from purely manual research to strategic orchestration and high-fidelity testing.",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQ7ZvO5DpIw",
    duration: "15:30",
    coverGradient: "from-purple-600/20 to-indigo-700/20"
  },
  {
    id: "features-vid-2",
    title: "How to Measure What Matters",
    description: "YC partners outline the core metrics that indicate genuine organic growth, retention, and strategic fit for early products.",
    videoUrl: "https://www.youtube-nocookie.com/embed/Th8JoIan4dg",
    duration: "11:45",
    coverGradient: "from-amber-500/20 to-orange-600/20"
  }
];

const featuresArticles: Article[] = [
  {
    id: "features-art-1",
    title: "Under the Hood: How Convix Calculates Market Opportunity Scores",
    category: "Data Science",
    readTime: "10 min",
    excerpt: "An architectural deep dive into the vector math, embedding distance metrics, and multi-layered trend indices that compute our objective opportunity verdict.",
    author: "Arief Fajar",
    date: "May 17, 2026",
    coverGradient: "from-emerald-600 to-teal-700",
    content: [
      { type: "paragraph", text: "At the core of the Convix analysis pipeline lies the Market Opportunity Score (MOS)—a mathematically rigorous, multi-factored index engineered to calculate the commercial viability of early-stage software concepts. Rather than relying on simple pattern-matching or subjective generative AI heuristics, Convix executes three highly structured processing passes across high-dimensional vector spaces, public financial filings, and real-time search velocity databases." },
      { type: "heading", text: "Vector Cosine Similarity & Cluster Analysis" },
      { type: "paragraph", text: "The initial pass maps the user's detailed product description into a 1536-dimensional semantic space using advanced text-embedding models. This creates a dense coordinate vector representing the idea's functional profile. Convix then executes a series of fast K-Nearest Neighbors (KNN) searches inside our Supabase Pgvector database, which indexes over 1.2 million active startup profiles, patent applications, and commercial landing pages. By calculating the Cosine Similarity—where CosSim(A, B) = (A ⋅ B) / (||A|| ||B||)—the system establishes the exact distance between the proposed concept and the nearest operational solutions." },
      { type: "quote", text: "Market opportunity is inversely proportional to semantic cluster density. True strategic wedges exist only where coordinate distance maps to sparse vectors." },
      { type: "paragraph", text: "If the Cosine Similarity indicates heavy alignment (CosSim > 0.85) with existing systems, the opportunity score is penalized. However, semantic novelty alone is insufficient; the system must verify whether the identified void represents genuine demand or a 'barren landscape' where no customer willingness to pay exists." },
      { type: "heading", text: "Integrating Live Search Velocity & Trend Weights" },
      { type: "paragraph", text: "The second pass pulls real-time search indicators, parsing interest growth metrics over 30, 90, and 365-day intervals. This data is fed into a custom moving average equation, capturing whether the topic is entering a hyper-growth phase or stabilizing. The final Market Opportunity Score is calculated via a normalized, weighted equation:" },
      { type: "list", text: [
        "Semantic Novelty (40%): Calculated as 1 minus the maximum Cosine Similarity value.",
        "Trend Velocity (30%): Calculated as the standardized Z-score of query growth curves.",
        "Regulatory Friction Score (30%): Determined by mapping entity classes against compliance databases."
      ] },
      { type: "paragraph", text: "The composite index is then scaled between 0 and 100, providing founders with a clear, mathematically sound benchmark to justify their seed-stage allocation strategies." }
    ]
  },
  {
    id: "features-art-2",
    title: "Decoding Competitor Density: Beyond Simple Keyword Searches",
    category: "Competitive Intel",
    readTime: "9 min",
    excerpt: "Why standard keyword matching fails to detect indirect market alternatives, and how semantic embeddings map structural competitors using the Herfindahl-Hirschman Index (HHI).",
    author: "Arief Fajar",
    date: "May 18, 2026",
    coverGradient: "from-purple-600 to-indigo-700",
    content: [
      { type: "paragraph", text: "When conducting early-stage competitive research, many founders fall into the 'Google Search Trap.' They enter three or four direct keyword combinations, notice the absence of an identical product name, and declare they have a blue ocean runway. This shallow analysis is highly dangerous. Keyword searches only detect active companies that utilize identical marketing jargon; they fail to map structural alternatives and indirect substitutes that command the user's budget." },
      { type: "heading", text: "The Trap of Syntactic Matching" },
      { type: "paragraph", text: "Competitor density is a function of problem-space overlap, not term-space overlap. If you are building a collaborative project manager for high-growth hardware teams, your core competitors are not merely 'hardware project managers.' Your true competitors are physical whiteboard grids, custom spreadsheets, legacy JIRA instances, and asynchronous Slack chains. These alternatives represent entrenched customer habits and must be accounted for in your cost of customer acquisition (CAC) modeling." },
      { type: "quote", text: "A competitor is any alternative process that consumes a portion of your target user's limited operational budget." },
      { type: "paragraph", text: "To model this, Convix implements a semantic classification parser. Instead of checking for literal word matches, our system extracts functional entity relationships (e.g., 'tracks inventory,' 'schedules dispatch') and calculates their occurrence across heterogeneous business verticals. This enables the engine to detect when a market is heavily contested by adjacent tools that can easily extend their feature set to absorb your niche." },
      { type: "heading", text: "The Herfindahl-Hirschman Concentration Index" },
      { type: "paragraph", text: "To determine true market lock-in, the competitive intelligence module calculates the Herfindahl-Hirschman Index (HHI) for your vertical. HHI is calculated by summing the squares of the market shares of all industry participants. A highly concentrated market (HHI > 2500) indicates that dominant platforms command strong distribution moats, meaning your go-to-market strategy must rely on a hyper-focused semantic wedge rather than horizontal competition." }
    ]
  }
];

const faqs = [
  { q: "How is Convix different from just using ChatGPT?", a: "ChatGPT generates content. Convix makes strategic decisions. We run structured analysis modules — market gap scoring, competitor density mapping, risk indexing — that are purpose-built for idea validation. ChatGPT will hype your idea. Convix will challenge it." },
  { q: "Is my idea data safe and private?", a: "Completely. Every analysis is private to your account and is never used to train models or shared with third parties. Your idea stays yours." },
  { q: "How accurate is the market gap detection?", a: "Our models cross-reference real-time market signals, funding databases, and competitive landscape data. Our gap detection has an 87% accuracy rate validated against 2,400+ real ideas analyzed by the platform." },
  { q: "Can I use Convix for ideas in any industry?", a: "Yes. Convix has been used for B2B SaaS, consumer apps, marketplaces, hardware startups, creator tools, and more. The intelligence modules are industry-agnostic." },
  { q: "What happens after I get my validation report?", a: "You receive a structured strategic brief with a market verdict, risk breakdown, monetization pathway suggestions, and a differentiation scorecard. From there, the AI can generate pivot strategies or positioning recommendations on demand." },
];

export default function Features() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ===== HERO ===== */}
      <CinematicHero
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
        headline={<>Built for <span className="font-serif italic font-normal">strategic</span><br />execution.</>}
        subheadline="Eight AI-powered intelligence modules that transform raw ideas into validated strategies with surgical precision."
        ctaText="Try It Free"
      />

      {/* ===== BENTO GRID — 8 Strategic Intelligence Modules ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">Intelligence modules</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              The <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>engine</span> behind<br />every decision.
            </h2>
          </motion.div>

          {/* ─── Bento Row 1: Big featured + 2 small ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Featured: Market Opportunity Score */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="md:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden hover-depth">
              <div className="absolute -right-10 -top-10 w-56 h-56 bg-[#ef4d23]/6 rounded-full blur-3xl pointer-events-none" />
              <Target size={24} className="text-[#ef4d23] mb-5" />
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Market Opportunity Score</h3>
              <p className="text-[14px] leading-relaxed mb-6 max-w-sm" style={{ color: 'var(--fg-secondary)' }}>
                Quantify untapped demand and niche viability with real-time market signals and trend data.
              </p>
              {/* Live score widget */}
              <div className="flex items-end gap-6">
                <div>
                  <span className="text-6xl font-bold tabular-nums" style={{ color: 'var(--fg)' }}>87.4</span>
                  <span className="text-lg ml-2" style={{ color: 'var(--fg-muted)' }}>/100</span>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex justify-between text-[11px] mb-1.5" style={{ color: 'var(--fg-muted)' }}>
                    <span>Low</span><span>High</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                    <div className="h-full w-[87.4%] rounded-full bg-gradient-to-r from-[#ef4d23] via-amber-400 to-emerald-500" />
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    REAL GAP DETECTED
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Validation Confidence */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 hover-depth flex flex-col justify-between">
              <div>
                <Shield size={22} className="text-[#ef4d23] mb-4" />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Validation Confidence</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  AI certainty level on your idea's market fit — from "speculative" to "high conviction."
                </p>
              </div>
              {/* Radial percentage display */}
              <div className="mt-6 flex items-center gap-4">
                <div className="relative w-16 h-16">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ef4d23" strokeWidth="3"
                      strokeDasharray={`${87} 100`} strokeLinecap="round" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color: 'var(--fg)' }}>87%</span>
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>High Conviction</p>
                  <p className="text-[11px]" style={{ color: 'var(--fg-muted)' }}>Strong market evidence</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ─── Bento Row 2: 3 equal cards ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Strategic Risk Index */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <Activity size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Strategic Risk Index</h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--fg-secondary)' }}>
                Regulatory, competitive, timing, and execution risks — all scored 0–100.
              </p>
              <div className="space-y-2.5">
                {[['Regulatory', 22], ['Competitive', 45], ['Timing', 18], ['Execution', 31]].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[11px] w-20 shrink-0" style={{ color: 'var(--fg-muted)' }}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-full rounded-full" style={{ width: `${val}%`, backgroundColor: (val as number) > 40 ? '#f59e0b' : '#10b981' }} />
                    </div>
                    <span className="text-[11px] font-semibold w-6 text-right" style={{ color: 'var(--fg)' }}>{val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Brand Positioning */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <BarChart3 size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Brand Positioning</h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--fg-secondary)' }}>
                How differentiated your value proposition truly is against existing market players.
              </p>
              <div className="space-y-2.5">
                {[['Uniqueness', 92], ['Clarity', 84], ['Recall', 77]].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-[11px] w-16 shrink-0" style={{ color: 'var(--fg-muted)' }}>{label}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                      <div className="h-full rounded-full bg-[#ef4d23]" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-[11px] font-semibold w-8 text-right" style={{ color: 'var(--fg)' }}>{val}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Competitor Density */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <Users size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Competitor Density</h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--fg-secondary)' }}>
                Real-time competitive landscape: funded players, market share, and vulnerability gaps.
              </p>
              {/* Dot grid visualization */}
              <div className="grid grid-cols-6 gap-1.5 mb-3">
                {Array.from({ length: 24 }).map((_, idx) => (
                  <div key={idx} className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: idx < 3 ? '#ef4d23' : idx < 7 ? 'var(--border-strong)' : 'var(--border)' }} />
                ))}
              </div>
              <p className="text-[11px]" style={{ color: 'var(--fg-muted)' }}>
                <span className="font-semibold text-[#ef4d23]">3 funded players</span> · Low density · Gap window open
              </p>
            </motion.div>
          </div>

          {/* ─── Bento Row 3: wide card + small ─── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Monetization Feasibility */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <TrendingUp size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Monetization Feasibility</h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--fg-secondary)' }}>
                Revenue potential scoring with business model suggestions: SaaS, marketplace, or hybrid.
              </p>
              <div className="space-y-2">
                {[['SaaS', '91%', true], ['Marketplace', '74%', false], ['Hybrid', '68%', false]].map(([model, score, best]) => (
                  <div key={model as string} className="flex items-center gap-3 py-1.5 px-3 rounded-lg" style={{ backgroundColor: (best as boolean) ? 'rgba(239,77,35,0.06)' : 'transparent' }}>
                    <span className="text-[12px] font-medium flex-1" style={{ color: 'var(--fg-secondary)' }}>{model}</span>
                    {(best as boolean) && <span className="text-[9px] font-bold text-[#ef4d23] uppercase tracking-wider">Best fit</span>}
                    <span className="text-[13px] font-bold" style={{ color: 'var(--fg)' }}>{score}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Founder-Market Fit + Real Gap Detection — stacked */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <Zap size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Founder-Market Fit</h3>
              <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--fg-secondary)' }}>
                Your unique alignment to execute on this specific idea based on skills and domain expertise.
              </p>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Alignment Score</span>
                  <span className="text-emerald-500 font-bold text-sm">Strong ↑</span>
                </div>
                <div className="text-3xl font-bold mt-2 tabular-nums" style={{ color: 'var(--fg)' }}>94%</div>
              </div>
            </motion.div>

            {/* Real Gap Detection — featured binary verdict */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl p-6 hover-depth relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none rounded-2xl" />
              <Search size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Real Gap Detection</h3>
              <p className="text-[13px] leading-relaxed mb-6" style={{ color: 'var(--fg-secondary)' }}>
                The binary verdict: genuine untapped opportunity or oversaturated noise. No gray areas.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl p-3 text-center border border-emerald-500/30 bg-emerald-500/5">
                  <div className="text-2xl font-bold text-emerald-500 mb-1">✓</div>
                  <div className="text-[11px] font-semibold text-emerald-500">REAL GAP</div>
                </div>
                <div className="rounded-xl p-3 text-center border" style={{ borderColor: 'var(--border)' }}>
                  <div className="text-2xl font-bold mb-1" style={{ color: 'var(--fg-muted)' }}>✗</div>
                  <div className="text-[11px] font-semibold" style={{ color: 'var(--fg-muted)' }}>SATURATED</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== MULTI-INPUT — asymmetric editorial layout ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">Any format, one engine</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              Every input format. <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>One engine.</span>
            </h2>
          </motion.div>

          {/* Row 1: Text Prompt — full-width hero card with live terminal visual */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-panel rounded-2xl p-8 mb-4 flex flex-col lg:flex-row items-start lg:items-center gap-8 hover-depth relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-72 h-72 bg-[#ef4d23]/5 rounded-full blur-3xl pointer-events-none" />
            {/* Left: copy */}
            <div className="flex-1 shrink-0 lg:max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-[#ef4d23]/10 flex items-center justify-center mb-5">
                <MessageSquare size={24} className="text-[#ef4d23]" />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--fg)' }}>Text Prompt</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                The fastest path to clarity. Describe your idea in plain language — as rough or detailed as you like. Convix handles the rest.
              </p>
            </div>
            {/* Right: terminal mockup */}
            <div className="flex-1 w-full">
              <div className="bg-[#0b0f1a] rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/[0.06]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
                  <span className="ml-4 text-white/20 text-[11px] font-mono">convix / validate</span>
                </div>
                <div className="p-5 font-mono text-[12px] space-y-1.5">
                  <p className="text-white/30">{'>'} What's your idea?</p>
                  <p className="text-white/70">An AI tool that validates startup ideas before founders invest time building them — using real market data, not vibes.</p>
                  <p className="text-white/30 mt-3">{'>'} Analyzing...</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(d => <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />)}
                    </div>
                    <span className="text-[#ef4d23] text-[11px]">Cross-referencing 340K market signals</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Row 2: PDF (wide) + Voice (narrow) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* PDF Upload — 2/3 width, horizontal layout */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="md:col-span-2 glass-panel rounded-2xl p-6 flex gap-6 hover-depth">
              <div className="w-12 h-12 rounded-xl bg-[#ef4d23]/10 flex items-center justify-center shrink-0 mt-1">
                <FileText size={22} className="text-[#ef4d23]" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>PDF Upload</h3>
                <p className="text-[13px] leading-relaxed mb-4" style={{ color: 'var(--fg-secondary)' }}>
                  Drop a full pitch deck, business plan, or research doc. Convix extracts the hypothesis and validates it module by module.
                </p>
                {/* File upload mock */}
                <div className="border-2 border-dashed rounded-xl px-4 py-3 flex items-center gap-3" style={{ borderColor: 'var(--border-strong)' }}>
                  <FileText size={16} className="text-[#ef4d23] shrink-0" />
                  <span className="text-[12px] font-medium" style={{ color: 'var(--fg-secondary)' }}>pitch-deck-v3.pdf</span>
                  <span className="ml-auto text-[11px] font-semibold text-emerald-500">✓ Uploaded</span>
                </div>
              </div>
            </motion.div>

            {/* Voice Input — 1/3 width, tall card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass-panel rounded-2xl p-6 hover-depth flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-[#ef4d23]/10 flex items-center justify-center mb-4">
                <Mic size={22} className="text-[#ef4d23]" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Voice Input</h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--fg-secondary)' }}>
                Record a voice memo or think out loud. Convix transcribes and validates in real time.
              </p>
              {/* Waveform mock */}
              <div className="mt-auto flex items-center gap-1 h-8">
                {[3, 7, 12, 5, 9, 14, 6, 10, 4, 8, 13, 5, 7, 11, 4].map((h, i) => (
                  <div key={i} className="flex-1 rounded-full bg-[#ef4d23]" style={{ height: `${h * 4}%`, opacity: 0.4 + (h / 14) * 0.6 }} />
                ))}
              </div>
              <p className="text-[11px] mt-2 text-center font-medium text-[#ef4d23]">● Recording…</p>
            </motion.div>
          </div>

          {/* Row 3: Screenshot (narrow) + AI Chat (wide) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Screenshot */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <div className="w-12 h-12 rounded-xl bg-[#ef4d23]/10 flex items-center justify-center mb-4">
                <Image size={22} className="text-[#ef4d23]" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Screenshot</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                Share a competitor's landing page, app UI, or any screenshot. Convix reads the context and benchmarks your positioning against it.
              </p>
            </motion.div>

            {/* AI Chat — 2/3 width, with chat bubble mockup */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="md:col-span-2 glass-panel rounded-2xl p-6 hover-depth">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#ef4d23]/10 flex items-center justify-center">
                  <Brain size={22} className="text-[#ef4d23]" />
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--fg)' }}>AI Chat</h3>
                  <p className="text-[12px]" style={{ color: 'var(--fg-muted)' }}>Conversational strategic deep-dive</p>
                </div>
              </div>
              {/* Chat bubbles */}
              <div className="space-y-3">
                <div className="flex justify-end">
                  <div className="bg-[#ef4d23] text-white text-[12px] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-xs">
                    What's the biggest risk in my idea?
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="text-[12px] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-sm" style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--fg-secondary)' }}>
                    The main risk is competitive timing — three VC-backed players entered in Q1. Here's how to position around them…
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== COMPARISON TABLE ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">Why Convix</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              Convix vs. <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>guessing</span>
            </h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="glass-panel rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-strong)' }}>
                  <th className="p-5 font-semibold" style={{ color: 'var(--fg)' }}>Capability</th>
                  <th className="p-5 font-semibold text-center text-[#ef4d23]">Convix</th>
                  <th className="p-5 font-semibold text-center" style={{ color: 'var(--fg-muted)' }}>Generic AI</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Market gap analysis', '✓', '✗'],
                  ['Competitive intelligence', '✓', '✗'],
                  ['Risk assessment scoring', '✓', '✗'],
                  ['Monetization feasibility', '✓', '~'],
                  ['Multi-format input', '✓', '~'],
                  ['Strategic (not hype) output', '✓', '✗'],
                  ['Founder-market fit analysis', '✓', '✗'],
                ].map(([cap, convix, generic], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--fg-secondary)' }}>{cap}</td>
                    <td className="p-4 text-center text-emerald-500 font-bold">{convix}</td>
                    <td className="p-4 text-center font-bold" style={{ color: 'var(--fg-muted)' }}>{generic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">FAQ</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              Questions, <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>answered</span>.
            </h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="glass-panel rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left gap-4 cursor-pointer"
                >
                  <span className="font-semibold text-[15px]" style={{ color: 'var(--fg)' }}>{faq.q}</span>
                  <ChevronDown size={18} className="shrink-0 transition-transform duration-300" style={{ color: 'var(--fg-muted)', transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-[14px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* ===== INSIGHTS & MEDIA HUB ===== */}
      <InsightsHub
        sectionTitle={<>Deep Dives, <span className="font-serif italic font-normal text-[var(--fg-secondary)]">Calculations</span> & Algorithms</>}
        sectionSubtitle="Under the hood tutorials, metrics architectures, and masterclasses designed to quantify startup viability."
        articles={featuresArticles}
        videos={featuresVideos}
      />
      <Footer />
    </>
  );
}
