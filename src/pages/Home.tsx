import React, { useState } from 'react';
import CinematicHero from '../components/CinematicHero';
import DashboardPreview from '../components/DashboardPreview';
import InsightsHub, { type Article, type Video } from '../components/InsightsHub';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, TrendingUp, ShieldCheck, Crosshair, BarChart2, Star, XCircle, CheckCircle2, AlertOctagon, HelpCircle, Layers, ArrowUpRight, Cpu, Zap, Search, Eye, AlertTriangle, Database, RefreshCw, Sparkles } from 'lucide-react';

const homeVideos: Video[] = [
  {
    id: "home-vid-1",
    title: "Why Startups Succeed (The Single Biggest Factor)",
    description: "Bill Gross (founder of Idealab) analyzes data across 200 companies and reveals the single most critical factor for startup success.",
    videoUrl: "https://www.youtube-nocookie.com/embed/bNpx7gpSqbY",
    duration: "06:40",
    coverGradient: "from-orange-500/20 to-red-600/20"
  },
  {
    id: "home-vid-2",
    title: "How to Evaluate Startup Ideas",
    description: "Y Combinator partner Kevin Hale teaches you how to evaluate a startup concept as a hypothesis about fast growth, identifying core unfair advantages.",
    videoUrl: "https://www.youtube-nocookie.com/embed/R9ItLv0842Q",
    duration: "18:24",
    coverGradient: "from-blue-600/20 to-indigo-700/20"
  }
];

const homeArticles: Article[] = [
  {
    id: "home-art-1",
    title: "The Art of the Pivot: Separating Healthy Friction From Structural Gaps",
    category: "Strategy",
    readTime: "6 min",
    excerpt: "Building is hard, but building the wrong thing is fatal. Learn how to diagnose user engagement friction and decide when to pivot your product core.",
    author: "Arief Fajar",
    date: "May 18, 2026",
    coverGradient: "from-blue-600 to-indigo-700",
    content: [
      { type: "paragraph", text: "Every founder experiences friction. You launch, and the initial reaction is quiet. Users sign up, but they don't return. The temptation is to work harder—to build more features, increase marketing spend, or push harder in sales. But often, the friction isn't operational; it's structural." },
      { type: "heading", text: "Diagnosing Structural Friction" },
      { type: "paragraph", text: "There is a fundamental difference between healthy early-stage friction (users needing onboarding help) and structural gaps (the product simply isn't needed). If your primary retention curve drops to zero after 30 days, regardless of user education, you are solving a non-existent problem." },
      { type: "quote", text: "The cold truth is that most startups do not fail from poor engineering; they fail from a lack of market discovery." },
      { type: "paragraph", text: "To identify real gaps, look at user behavior in isolation. Are they trying to solve the problem using hacky workarounds? If they are writing custom scripts or using Excel spreadsheets to bridge the gap, the demand is real. If they just ignore the problem entirely, you are pushing water uphill." },
      { type: "heading", text: "The Pivot Decision Framework" },
      { type: "paragraph", text: "When you choose to pivot, do not pivot in a vacuum. Evaluate your coordinates using these parameters:" },
      { type: "list", text: [
        "Founder-Market Fit: Does the new direction match your deep unfair advantages?",
        "Regulatory Velocity: Will the pivot introduce heavy compliance walls?",
        "Monetization Realism: Are customers willing to pay for this alternative solution out of their existing budgets?"
      ] },
      { type: "paragraph", text: "By using analytical tracking tools like Convix, you can test these hypothetical pivot scenarios against real competitive signals before writing a single line of new code." }
    ]
  },
  {
    id: "home-art-2",
    title: "Regulatory Blind Spots: The Silent Killer of Promising Ideas",
    category: "Risk Mapping",
    readTime: "8 min",
    excerpt: "Many brilliant ideas die not from lack of demand, but from complex regulatory traps. Discover how to identify and bypass hidden compliance minefields.",
    author: "Arief Fajar",
    date: "May 19, 2026",
    coverGradient: "from-red-500 to-amber-600",
    content: [
      { type: "paragraph", text: "It happens all the time: a team builds a flawless web application that solves a major painful problem, gets initial sign-ups, and suddenly receives a cease-and-desist letter or realizes they cannot clear compliance requirements without a massive funding round." },
      { type: "heading", text: "Why Compliance Trumps Code" },
      { type: "paragraph", text: "In fields like fintech, healthtech, and AI safety, regulatory frameworks are evolving faster than ever. If your product architecture is built on a foundation that violates emerging data residency rules or medical device classifications, your entire technology stack becomes an expensive liability." },
      { type: "quote", text: "Security and compliance are not post-launch add-ons; they are primary architectural constraints." },
      { type: "paragraph", text: "Take the example of AI-powered diagnostic tools. If your model processes patient data, you are immediately subject to HIPAA or GDPR constraints. If it makes active recommendations, it might fall under medical device acts. Bypassing these assessments early in the brainstorming phase is a multi-million dollar mistake." },
      { type: "heading", text: "How to Stress-Test Risk Early" },
      { type: "paragraph", text: "Before committing resources, map out the regulatory dependencies. Ask these critical questions:" },
      { type: "list", text: [
        "Where does the primary user data reside and who is responsible for its processing?",
        "Are there dominant incumbent players who use lobbying and regulatory compliance as defensive moats?",
        "What are the minimum security standards required to close an enterprise contract in this sector?"
      ] },
      { type: "paragraph", text: "Using structured risk-indexing systems lets you flag these obstacles during the validation phase, helping you design compliance safeguards into your MVP from day one." }
    ]
  }
];

const standardTransition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] };

export default function Home() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const [activeScenario, setActiveScenario] = useState<'saturated' | 'viable'>('saturated');
  const handleCTA = () => { if (user) navigate('/app'); else openAuthModal(); };

  return (
    <>
      {/* ===== HERO ===== */}
      <CinematicHero
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
        headline={<>Validate <span className="font-serif italic font-normal text-white/90">ideas</span> before<br />the market decides.</>}
        subheadline="AI-powered strategic intelligence that finds real market gaps, assesses genuine risks, and tells you the truth before you invest months building."
        ctaText="Start Validating"
        ctaLink="/app"
        ctaSecondaryText="Explore Features"
        ctaSecondaryLink="/features"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...standardTransition, delay: 0.5 }}
          className="mt-10 sm:mt-14 w-full max-w-[900px]"
        >
          <DashboardPreview />
        </motion.div>
      </CinematicHero>

      {/* ===== BRAND MARQUEE ===== */}
      <section className="pt-12 pb-4 overflow-hidden border-b" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: 'var(--fg-muted)' }}>Powered by & Integrated with</p>
        </div>
        <div className="relative w-full flex overflow-hidden mask-edges">
          <div className="flex animate-marquee whitespace-nowrap items-center w-max">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 sm:gap-20 px-6 sm:px-10">
                {['Google', 'Google Cloud', 'Google AI Studio', 'gdev.id', 'Tavily', 'Gemini', 'Cloud Run'].map((brand, j) => (
                  <div key={`${i}-${j}`} className="flex items-center gap-12 sm:gap-20">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight transition-colors cursor-default" style={{ color: 'var(--fg-muted)' }}>
                      {brand}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--border-strong)' }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST NUMBERS ===== */}
      <section className="py-16 px-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={standardTransition}
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            {[
              { value: '2,400+', label: 'Ideas Validated' },
              { value: '87%', label: 'Gap Detection Rate' },
              { value: '<12s', label: 'Avg. Analysis Time' },
              { value: '340+', label: 'Active Founders' },
            ].map((s, i) => (
              <div key={i} className="py-8 px-6 text-center" style={{ backgroundColor: 'var(--bg-card)' }}>
                <div className="text-3xl md:text-4xl font-bold text-[#ef4d23] mb-1 tabular-nums">{s.value}</div>
                <div className="text-sm font-medium" style={{ color: 'var(--fg-muted)' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION: THE STARTUP PARADOX (BEFORE vs AFTER) ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden border-t border-b border-white/[0.04]" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Decorative Grid Overlay (Non-Bento) */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />
        <div className="absolute -left-64 top-1/4 w-[500px] h-[500px] bg-red-500/[0.02] dark:bg-red-500/[0.01] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-64 bottom-1/4 w-[500px] h-[500px] bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
            <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
              The Hard Reality of Building
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
              Most startups fail from a lack of <span className="font-serif italic text-[#ef4d23]">market validation</span>, not poor engineering.
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
              We build because it is satisfying. But building the wrong thing is fatal. Compare the standard execution cycle with the Convix validation model.
            </p>
          </div>

          {/* Comparative Column Layout (No Bento Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {/* The Old Way Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={standardTransition}
              className="flex flex-col p-8 sm:p-10 rounded-3xl border border-red-500/10 bg-red-500/[0.01] hover:bg-red-500/[0.02] transition-colors relative"
            >
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shrink-0">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>The Blind Building Loop</h3>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Typical startup execution model</p>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                {[
                  {
                    title: "Building in a dark room",
                    desc: "You spend 6 months writing code, designing interfaces, and refining features based purely on intuition, without testing with real buyers."
                  },
                  {
                    title: "Hidden competitor saturation",
                    desc: "You discover late that three funded startups launched a similar product two years ago and already hold the primary distribution channels."
                  },
                  {
                    title: "Blind compliance roadblocks",
                    desc: "You hit regulatory velocity constraints, data residency issues, or third-party API walls only after launching the product."
                  },
                  {
                    title: "The Silent Launch",
                    desc: "You launch to absolute silence. Capital is depleted, team energy is spent, and you're forced to pivot with zero runway left."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <XCircle size={18} className="text-red-500/70 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--fg)' }}>{item.title}</h4>
                      <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-red-500/10 text-center font-mono text-xs text-red-500/70">
                Outcome: Lost Runway & Opportunity Cost
              </div>
            </motion.div>

            {/* The Convix Way Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...standardTransition, delay: 0.15 }}
              className="flex flex-col p-8 sm:p-10 rounded-3xl border border-emerald-500/25 bg-gradient-to-b from-emerald-500/[0.01] to-emerald-500/[0.03] hover:from-emerald-500/[0.02] hover:to-emerald-500/[0.05] transition-all relative shadow-lg shadow-emerald-500/5"
            >
              {/* Pulsing dot at top right */}
              <span className="absolute top-4 right-4 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>

              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: 'var(--fg)' }}>The Convix Validation Loop</h3>
                  <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>High-conviction intelligence pipeline</p>
                </div>
              </div>

              <div className="space-y-6 flex-grow">
                {[
                  {
                    title: "Live 12-second deep scan",
                    desc: "Before writing a line of code, cross-reference your idea against active markets, search engines, forums, and database signals."
                  },
                  {
                    title: "Early market gap detection",
                    desc: "Directly expose the exact angles of competitor weaknesses and find the specific unmet customer demand (the pure 'Market Gap')."
                  },
                  {
                    title: "Proactive threat & risk mapping",
                    desc: "Instantly stress-test your architecture against regulatory restrictions, platform dependencies, and compliance limits."
                  },
                  {
                    title: "Precision execution roadmap",
                    desc: "Begin development with verified business models, custom pricing schemes, and clear, dynamic TAM estimations."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--fg)' }}>{item.title}</h4>
                      <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-emerald-500/10 text-center font-mono text-xs text-emerald-500 font-semibold">
                Outcome: Absolute Clarity & Unfair Market Speed
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: INTERACTIVE PIVOT SANDBOX ===== */}
      <section className="py-24 sm:py-32 relative overflow-hidden border-b border-white/[0.04]" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(239,77,35,0.01)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-55" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ef4d23]/[0.015] dark:bg-[#ef4d23]/[0.005] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
              Interactive Scenario Lab
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
              Watch Convix pivot <span className="font-serif italic text-[#ef4d23]">generic traps</span> into defensible business models.
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
              Click between the two scenarios below to see how the engine analyzes an idea and generates a high-conviction pivot map.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl shadow-sm">
              <button
                onClick={() => setActiveScenario('saturated')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeScenario === 'saturated'
                    ? 'bg-[#ef4d23] text-white shadow-md shadow-[#ef4d23]/25'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <AlertTriangle size={16} />
                <span>The Saturated Trap (General AI)</span>
              </button>
              <button
                onClick={() => setActiveScenario('viable')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeScenario === 'viable'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>The Market Gap (B2B Niche)</span>
              </button>
            </div>
          </div>

          {/* Interactive display board */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Box (Input + Verdict) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-[#0c0e14]/50 relative overflow-hidden backdrop-blur-sm">
              <div className="absolute left-0 top-0 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-40 bg-gradient-to-br from-[#ef4d23]/20 to-transparent" />
              
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200/60 dark:border-white/5 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ef4d23] animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-neutral-400">STAGE_1: INPUT_IDEA</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-neutral-300 dark:text-neutral-600">INPUT_V1</span>
                </div>

                {/* Original concept input card */}
                <div className="p-4 rounded-xl border bg-white dark:bg-white/[0.02] border-neutral-200/60 dark:border-white/5 mb-6">
                  <h4 className="text-xs font-mono text-[#ef4d23] font-bold mb-1.5 uppercase tracking-wide">
                    {activeScenario === 'saturated' ? 'Idea Title: general pdf summary app' : 'Idea Title: heavy machine marketplace'}
                  </h4>
                  <p className="text-sm font-semibold leading-relaxed mb-3" style={{ color: 'var(--fg)' }}>
                    {activeScenario === 'saturated' ? 'AI-Powered PDF Summarizer' : 'Indonesian Heavy Equipment Rental Platform'}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                    {activeScenario === 'saturated' 
                      ? '"An app where users upload a PDF document and an AI summarizes it, highlights key text, and lets them ask questions about the document."'
                      : '"A localized B2B rental platform for excavator, crane, and forklift owners in Indonesia to rent out idle machinery directly to local small construction contractors with digital secure escrow."'}
                  </p>
                </div>
              </div>

              {/* Real-time Verdict */}
              <div className="pt-6 border-t border-neutral-200/60 dark:border-white/5 mt-auto">
                <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-wider mb-4">Convix Lab Live Verdict</div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-bold tracking-tight uppercase ${activeScenario === 'saturated' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {activeScenario === 'saturated' ? 'HIGHLY SATURATED' : 'HIGH VALUE GAP'}
                      </span>
                      <span className={`w-2.5 h-2.5 rounded-full ${activeScenario === 'saturated' ? 'bg-red-500' : 'bg-emerald-500'} animate-pulse`} />
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                      {activeScenario === 'saturated' ? 'Market Density: Saturated space' : 'Market Density: High blue-ocean potential'}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 text-right">
                    <span className={`text-3xl font-extrabold tracking-tight tabular-nums ${activeScenario === 'saturated' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {activeScenario === 'saturated' ? '34' : '88'}
                    </span>
                    <span className="text-xs text-neutral-400 font-mono">/100</span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-neutral-200 dark:bg-white/5 rounded-full overflow-hidden mt-3 mb-2">
                  <div className={`h-full transition-all duration-700 ${activeScenario === 'saturated' ? 'bg-red-500' : 'bg-emerald-500'}`} 
                       style={{ width: activeScenario === 'saturated' ? '34%' : '88%' }} />
                </div>
              </div>
            </div>

            {/* Right Box (Pivot Blueprint) */}
            <div className="lg:col-span-7 flex flex-col p-6 sm:p-8 rounded-3xl border border-[#ef4d23]/20 bg-gradient-to-b from-[#ef4d23]/[0.02] to-neutral-50/50 dark:to-[#0f1017]/30 relative overflow-hidden shadow-lg shadow-[#ef4d23]/5">
              <div className="absolute right-0 bottom-0 w-36 h-36 rounded-full blur-2xl pointer-events-none opacity-30 bg-[#ef4d23]/10" />

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#ef4d23]/10 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#ef4d23]" />
                  <span className="text-[10px] font-mono font-bold text-[#ef4d23]">STAGE_2: CONVIX_PIVOT_ENGINE</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#ef4d23] bg-[#ef4d23]/10 px-2 py-0.5 rounded-md border border-[#ef4d23]/20">AUTO_PIVOT_ENABLED</span>
              </div>

              {/* Dynamic Strategy Cards */}
              <div className="space-y-5 flex-grow">
                {activeScenario === 'saturated' ? (
                  <>
                    <div className="p-4 rounded-xl border bg-white dark:bg-white/[0.01] border-neutral-200/50 dark:border-white/5 hover:border-[#ef4d23]/30 transition-all duration-300">
                      <div className="flex items-center gap-2 text-red-500 mb-2">
                        <AlertTriangle size={15} />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">The Primary Trap</h4>
                      </div>
                      <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                        Over 400+ active SaaS products already summarize PDF documents. Platform giants like Adobe Acrobat and web browsers (Edge/Safari) have built-in summarizers. Custom customer acquisition costs will exceed lifetime value by <span className="text-red-500 font-semibold font-mono">3.2x</span>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border bg-[#ef4d23]/[0.01] border-[#ef4d23]/15 hover:border-[#ef4d23]/30 transition-all duration-300">
                      <div className="flex items-center gap-2 text-[#ef4d23] mb-2">
                        <RefreshCw size={15} className="text-[#ef4d23]" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">The High-Viability Pivot Direction</h4>
                      </div>
                      <p className="text-xs sm:text-[13px] leading-relaxed mb-2" style={{ color: 'var(--fg-secondary)' }}>
                        Pivot away from generic PDFs. Narrow target scope down to <span className="text-[#ef4d23] font-semibold">Indonesian Hyper-Local Construction Permitting Documents</span>.
                      </p>
                      <ul className="space-y-1.5 text-xs font-semibold pl-4 list-disc" style={{ color: 'var(--fg)' }}>
                        <li>AMDAL & PBG Regulatory parsing mapping.</li>
                        <li>Automated local government checklist validator.</li>
                        <li>High defensibility through deep local compliance integrations.</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-xl border bg-white dark:bg-white/[0.01] border-neutral-200/50 dark:border-white/5 hover:border-emerald-600/30 transition-all duration-300">
                      <div className="flex items-center gap-2 text-emerald-500 mb-2">
                        <Star size={15} />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Why the Gap is Massive</h4>
                      </div>
                      <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                        Heavy machinery rental in Indonesia is highly fragmented. Contractors lose weeks searching WhatsApp groups and negotiating trust boundaries. Integrating digital surveyor reviews and automated escrow contracts creates an immediate <span className="text-emerald-500 font-semibold font-mono">92% trust efficiency index</span>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border bg-emerald-600/[0.01] border-emerald-600/15 hover:border-emerald-600/30 transition-all duration-300">
                      <div className="flex items-center gap-2 text-emerald-500 mb-2">
                        <TrendingUp size={15} />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider">Strategic Roadmap & Moats</h4>
                      </div>
                      <p className="text-xs sm:text-[13px] leading-relaxed mb-2" style={{ color: 'var(--fg-secondary)' }}>
                        Focus initial launch strictly on East Java road construction contractors to secure liquidity before scaling nationwide.
                      </p>
                      <ul className="space-y-1.5 text-xs font-semibold pl-4 list-disc" style={{ color: 'var(--fg)' }}>
                        <li>Exclusive tie-ins with regional construction insurance providers.</li>
                        <li>Machine tracking integration for active working hours auditing.</li>
                        <li>Transactional marketplace fee structure (3-5% transaction take-rate).</li>
                      </ul>
                    </div>
                  </>
                )}
              </div>

              {/* Economic Uplift Summary */}
              <div className="mt-8 pt-6 border-t border-neutral-200/60 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[#ef4d23]" />
                  <span className="text-xs font-bold font-mono tracking-wide" style={{ color: 'var(--fg)' }}>
                    {activeScenario === 'saturated' ? 'Pivot Viability Uplift: +50% Gain' : 'Strategy Viability Rating: Elite'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
                  <span>Viability Score Adjusted:</span>
                  <span className={`font-mono text-sm px-2.5 py-0.5 rounded-md border ${
                    activeScenario === 'saturated' 
                      ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' 
                      : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                  }`}>
                    {activeScenario === 'saturated' ? '84/100' : '94/100'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: THE THREE DIMENSIONS OF VALIDATION (ZIGZAG LAYOUT) ===== */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
            <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
              Strategic Framework
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
              How Convix dissects your startup idea
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
              Convix is not just a chat bubble. It is an analytical engine that measures your concept across three fundamental vectors.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-32">
            {/* Dimension 1: Market Scarcity (Text Left, Card Right) */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={standardTransition}
                className="lg:w-1/2"
              >
                <div className="font-serif italic text-6xl lg:text-7xl text-[#ef4d23]/15 mb-3 font-light select-none">01</div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#ef4d23] uppercase block mb-3">Dimension One: Market Scarcity</span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight" style={{ color: 'var(--fg)' }}>
                  Is your business model actually scarce, or just another drop in the ocean?
                </h3>
                <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--fg-secondary)' }}>
                  Most founders believe their idea has no competitors. Convix scans global index feeds, SaaS indices, and open-web signals to find active projects. It measures the density of direct alternatives and calculates a **Market Gap Score** to tell you if the opportunity is genuine.
                </p>
                <ul className="space-y-3 font-mono text-[12.5px]" style={{ color: 'var(--fg-secondary)' }}>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" /> Scans real-time search trends & index directories.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" /> Isolates saturated spaces to find adjacent blue-ocean niches.
                  </li>
                </ul>
              </motion.div>
              
              {/* Visual Card 1 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={standardTransition}
                className="lg:w-1/2 w-full flex justify-center"
              >
                <div className="w-full max-w-[450px] p-6 rounded-2xl border bg-[#0c0e14] border-white/5 shadow-xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-[#ef4d23]/5 blur-2xl group-hover:bg-[#ef4d23]/10 transition-colors pointer-events-none" />
                  
                  {/* Mock UI header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-mono text-neutral-400">ANALYSIS_VERDICT</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#ef4d23] bg-[#ef4d23]/10 px-2 py-0.5 rounded-md border border-[#ef4d23]/20">HIGH CONVICTION</span>
                  </div>

                  {/* Scarcity Meter */}
                  <div className="text-center py-6">
                    <div className="text-[10px] font-mono text-neutral-400 mb-2 uppercase tracking-wider">Calculated Market Scarcity</div>
                    <div className="text-5xl font-extrabold text-white tracking-tight tabular-nums mb-3 flex items-baseline justify-center">
                      89.2 <span className="text-sm font-normal text-neutral-500 ml-1">/ 100</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/[0.08] text-emerald-400 rounded-full border border-emerald-500/20 text-xs font-semibold">
                      Excellent Opportunity Window
                    </div>
                  </div>

                  {/* Meter visual bar */}
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-emerald-500" style={{ width: '89.2%' }} />
                  </div>

                  <div className="text-[11.5px] font-mono text-neutral-400 leading-relaxed bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
                    <span className="text-emerald-400 font-bold">Signal:</span> Active market demand detected on community forums (Reddit/HN) with 0 dominant software alternatives found. 
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dimension 2: Threat Vector (Card Left, Text Right) */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={standardTransition}
                className="lg:w-1/2"
              >
                <div className="font-serif italic text-6xl lg:text-7xl text-[#ef4d23]/15 mb-3 font-light select-none">02</div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#ef4d23] uppercase block mb-3">Dimension Two: Threat Mapping</span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight" style={{ color: 'var(--fg)' }}>
                  Anticipate the silent killers: regulatory, platform & scale blocks.
                </h3>
                <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--fg-secondary)' }}>
                  A brilliant app can easily die from a compliance trap or a sudden API change from a platform gatekeeper (Apple, Google, OpenAI). Convix stress-tests your conceptual stack against evolving global regulations, platform dependencies, and distribution friction.
                </p>
                <ul className="space-y-3 font-mono text-[12.5px]" style={{ color: 'var(--fg-secondary)' }}>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" /> Identifies direct regulatory vulnerabilities.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" /> Surfaces single-point dependency vulnerabilities on giant APIs.
                  </li>
                </ul>
              </motion.div>
              
              {/* Visual Card 2 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={standardTransition}
                className="lg:w-1/2 w-full flex justify-center"
              >
                <div className="w-full max-w-[450px] p-6 rounded-2xl border bg-[#0c0e14] border-white/5 shadow-xl relative overflow-hidden group">
                  <div className="absolute left-0 top-0 w-32 h-32 rounded-full bg-red-500/5 blur-2xl group-hover:bg-red-500/10 transition-colors pointer-events-none" />

                  {/* Mock UI header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <span className="text-[11px] font-mono text-neutral-400">THREAT_VECTOR_SCAN</span>
                    </div>
                    <span className="text-[9px] font-mono text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md border border-red-400/20">THREATS DETECTED</span>
                  </div>

                  {/* Threat lists */}
                  <div className="space-y-3">
                    {[
                      { name: "Platform Dependency Risk", val: "High", color: "text-red-400 border-red-500/20 bg-red-500/5" },
                      { name: "Regulatory Compliance Wall", val: "Medium", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" },
                      { name: "First-Mover Saturation", val: "Very Low", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01]">
                        <span className="text-xs font-mono text-neutral-300">{item.name}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${item.color}`}>{item.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 text-[11.5px] font-mono text-neutral-400 leading-relaxed bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
                    <span className="text-red-400 font-bold">Risk Warning:</span> App heavily depends on a single OpenAI API endpoint. Model must plan for local fallback infrastructure inside its tech roadmap.
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Dimension 3: Monetization Realism (Text Left, Card Right) */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={standardTransition}
                className="lg:w-1/2"
              >
                <div className="font-serif italic text-6xl lg:text-7xl text-[#ef4d23]/15 mb-3 font-light select-none">03</div>
                <span className="text-[11px] font-mono font-bold tracking-widest text-[#ef4d23] uppercase block mb-3">Dimension Three: Business Realism</span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 leading-tight" style={{ color: 'var(--fg)' }}>
                  A great idea is only a hobby unless people are willing to pay.
                </h3>
                <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--fg-secondary)' }}>
                  Convix parses market transaction data, competitor pricings, and B2B software purchasing power to calculate the most viable monetization model. It provides custom estimations for TAM (Total Addressable Market) and validates whether your concept can achieve healthy unit economics.
                </p>
                <ul className="space-y-3 font-mono text-[12.5px]" style={{ color: 'var(--fg-secondary)' }}>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" /> Models SaaS, Transactional, and Marketplace scenarios.
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" /> Evaluates dynamic buyer pricing power in target countries.
                  </li>
                </ul>
              </motion.div>
              
              {/* Visual Card 3 */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={standardTransition}
                className="lg:w-1/2 w-full flex justify-center"
              >
                <div className="w-full max-w-[450px] p-6 rounded-2xl border bg-[#0c0e14] border-white/5 shadow-xl relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-32 h-32 rounded-full bg-[#ef4d23]/5 blur-2xl group-hover:bg-[#ef4d23]/10 transition-colors pointer-events-none" />

                  {/* Mock UI header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <span className="text-[11px] font-mono text-neutral-400">REVENUE_SCENARIOS</span>
                    </div>
                    <span className="text-[9px] font-mono text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-md border border-blue-400/20">TAM STRESS TEST</span>
                  </div>

                  {/* Economic metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-white/[0.01] rounded-lg border border-white/5">
                      <div className="text-[9px] font-mono text-neutral-500 uppercase">Estimated TAM</div>
                      <div className="text-xl font-bold text-white mt-1">$45.8M</div>
                    </div>
                    <div className="p-3 bg-white/[0.01] rounded-lg border border-white/5">
                      <div className="text-[9px] font-mono text-neutral-500 uppercase">Pricing Tier</div>
                      <div className="text-xl font-bold text-white mt-1">$49 - $199</div>
                    </div>
                  </div>

                  {/* Economic assessment */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                      <span>Monetization Model Match</span>
                      <span className="text-[#ef4d23] font-bold">94% SaaS Match</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#ef4d23]" style={{ width: '94%' }} />
                    </div>
                  </div>

                  <div className="text-[11.5px] font-mono text-neutral-400 leading-relaxed bg-white/[0.02] p-3.5 rounded-lg border border-white/5">
                    <span className="text-blue-400 font-bold">Verdict:</span> B2B Subscription model is highly recommended. High willing-to-pay signals from operations managers who suffer from legal manual paperwork.
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CORE CAPABILITIES — Asymmetric editorial layout ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">What Convix does</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              Not another <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>AI chatbot</span>.
            </h2>
          </motion.div>

          {/* Row 1: Big featured card left + 2 stacked small cards right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            {/* Featured big card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="lg:col-span-2 glass-panel rounded-2xl p-8 relative overflow-hidden hover-depth group">
              {/* Background decoration */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-[#ef4d23]/5 rounded-full blur-3xl pointer-events-none" />
              <Crosshair size={28} className="text-[#ef4d23] mb-6" />
              <h3 className="text-2xl font-semibold mb-3" style={{ color: 'var(--fg)' }}>Market Gap Detection</h3>
              <p className="text-[15px] leading-relaxed mb-8 max-w-md" style={{ color: 'var(--fg-secondary)' }}>
                Binary verdict on your idea's viability. Real gap or saturated noise — no maybes, no sugarcoating.
              </p>
              {/* Mini UI mockup */}
              <div className="rounded-xl p-5 border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--fg-muted)' }}>Market Gap Score</span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">REAL GAP</span>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-bold tabular-nums" style={{ color: 'var(--fg)' }}>87.4</span>
                  <span className="text-sm pb-2" style={{ color: 'var(--fg-muted)' }}>/ 100</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                  <div className="h-full rounded-full bg-gradient-to-r from-[#ef4d23] to-emerald-500 transition-all" style={{ width: '87.4%' }} />
                </div>
              </div>
            </motion.div>

            {/* Right column — 2 small cards */}
            <div className="flex flex-col gap-4">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: 0.1 }}
                className="glass-panel rounded-2xl p-6 flex-1 hover-depth">
                <ShieldCheck size={22} className="text-[#ef4d23] mb-4" />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Risk Assessment Engine</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  Surfaces regulatory, competitive, and timing blind spots before they become expensive mistakes.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: 0.2 }}
                className="glass-panel rounded-2xl p-6 flex-1 hover-depth">
                <BarChart2 size={22} className="text-[#ef4d23] mb-4" />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Brand Positioning Analysis</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  How differentiated is your value prop? Scored against real competitive landscape data.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Row 2: 3 equal cards with inline visual accents */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: 0.1 }}
              className="glass-panel rounded-2xl p-6 hover-depth">
              <TrendingUp size={22} className="text-[#ef4d23] mb-4" />
              <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Monetization Feasibility</h3>
              <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'var(--fg-secondary)' }}>
                Revenue potential scoring with concrete business model suggestions.
              </p>
              <div className="space-y-2">
                {[['SaaS', '91%'], ['Marketplace', '74%'], ['Hybrid', '68%']].map(([model, score]) => (
                  <div key={model} className="flex items-center justify-between">
                    <span className="text-[12px]" style={{ color: 'var(--fg-muted)' }}>{model}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                        <div className="h-full rounded-full bg-[#ef4d23]" style={{ width: score }} />
                      </div>
                      <span className="text-[11px] font-semibold" style={{ color: 'var(--fg)' }}>{score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* AI Terminal card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: 0.2 }}
              className="glass-panel rounded-2xl p-6 hover-depth md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">Live AI Output Sample</p>
              <div className="bg-[#0b0f1a] rounded-xl p-5 text-white font-mono text-[12px] sm:text-sm leading-relaxed space-y-2.5">
                <p><span className="text-white/30">// </span><span className="text-white/50">CONVIX ANALYSIS — AI SaaS for Legal Tech</span></p>
                <p><span className="text-emerald-400">Market Gap:</span> <span className="text-white/70">REAL — 78% of legal firms still use manual document review.</span></p>
                <p><span className="text-amber-400">Risk:</span> <span className="text-white/70">MODERATE — Regulatory compliance in 12+ jurisdictions.</span></p>
                <p><span className="text-blue-400">Competitors:</span> <span className="text-white/70">LOW density — only 3 funded players, none dominant.</span></p>
                <p><span className="text-[#ef4d23]">Verdict:</span> <span className="text-white/70">"Build this. First-mover advantage is real."</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS — timeline rail ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">Process</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              Four steps to <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>clarity</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-px" style={{ backgroundColor: 'var(--border-strong)' }} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {[
                { step: '01', title: 'Describe', desc: 'Type your idea, upload a PDF, share a screenshot, or use voice input.' },
                { step: '02', title: 'Analyze', desc: 'AI cross-references your concept against market data, competitors, and trend signals in real time.' },
                { step: '03', title: 'Verdict', desc: '"This gap is real" or "Too generic" — a blunt, data-backed assessment.' },
                { step: '04', title: 'Execute', desc: 'Actionable pivot strategies, positioning recs, and monetization pathways.' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: i * 0.1 }}
                  className="relative pt-10 md:pt-12">
                  <div className="absolute top-0 left-0 w-12 h-12 rounded-full flex items-center justify-center text-[#ef4d23] font-mono font-bold text-sm border-2 border-[#ef4d23] bg-[var(--bg-card)]"
                    style={{ background: 'var(--bg-card)' }}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 mt-4" style={{ color: 'var(--fg)' }}>{item.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION: DEEP TECH ARCHITECTURE (UNDER THE HOOD) ===== */}
      <section className="py-24 sm:py-32 relative overflow-hidden border-t border-b border-white/[0.04]" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.015)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-40" />
        <div className="absolute left-10 top-10 w-96 h-96 bg-[#ef4d23]/[0.01] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-10 bottom-10 w-96 h-96 bg-[#ef4d23]/[0.01] rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
              System Architecture
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
              How we validate your idea in <span className="font-serif italic text-[#ef4d23]">real-time</span>.
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
              Convix doesn't spit out generic ChatGPT scripts. It orchestrates a multi-step semantic synthesis pipeline to build real strategic intelligence.
            </p>
          </div>

          {/* Architectural timeline / pipeline steps */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch relative">
            
            {/* Stage 1 */}
            <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-neutral-50/30 dark:bg-white/[0.01] hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors relative">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ef4d23] mb-6 border border-orange-500/20">
                  <Database size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>1. Multi-Input Ingestion</h3>
                <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  Submit concepts via dynamic voice transcription, complex PDF market briefs, or text prompts. The ingestion gate formats inputs into normalized semantic blocks.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-200/40 dark:border-white/5 text-[10px] font-mono font-bold text-neutral-400">
                TRANSCRIPTION / PDF PARSER
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-neutral-50/30 dark:bg-white/[0.01] hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors relative">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ef4d23] mb-6 border border-orange-500/20">
                  <Search size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>2. Real-Time Deep Crawl</h3>
                <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  Our scraper queries search engines via Tavily API and parses competitor metrics to map active projects, direct SaaS alternatives, and forum posts.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-200/40 dark:border-white/5 text-[10px] font-mono font-bold text-neutral-400">
                TAVILY CRAWL / COMPETITOR INDEX
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-neutral-50/30 dark:bg-white/[0.01] hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors relative">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ef4d23] mb-6 border border-orange-500/20">
                  <Cpu size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>3. Gemini Strategy Agent</h3>
                <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  A specialized Gemini Pro intelligence agent processes search data against professional venture capital frameworks to pinpoint risks and calculate density.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-200/40 dark:border-white/5 text-[10px] font-mono font-bold text-neutral-400">
                GEMINI PRO / STRATEGY FRAMEWORK
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex flex-col justify-between p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800 bg-neutral-50/30 dark:bg-white/[0.01] hover:bg-neutral-50/50 dark:hover:bg-white/[0.02] transition-colors relative">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-[#ef4d23] mb-6 border border-orange-500/20">
                  <Eye size={20} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--fg)' }}>4. Structured Synthesis</h3>
                <p className="text-xs sm:text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  Normalizes predictions into actionable dashboards: a clean SWOT matrix, competitive landscape, TAM pricing graphs, and an interactive pivot strategy canvas.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-neutral-200/40 dark:border-white/5 text-[10px] font-mono font-bold text-neutral-400">
                SWOT / RESEARCH CANVAS OUTPUT
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-4">What founders say</p>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight" style={{ color: 'var(--fg)' }}>
              Built for founders who <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>move fast</span>.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "Convix saved me 6 months of building the wrong product. The risk index flagged a regulatory wall I had completely missed.",
                name: "Dimas Pratama",
                role: "Founder, LegalEase",
                stars: 5,
              },
              {
                quote: "The market gap detection is genuinely brutal — in the best way. It told me my idea was saturated in 8 seconds. Pivoted immediately. Now we're profitable.",
                name: "Sarah Chen",
                role: "CEO, NutriFlow",
                stars: 5,
                featured: true,
              },
              {
                quote: "Every investor meeting I've had, I walk in with a Convix brief. The confidence it gives you when you have data instead of gut feeling is unmatched.",
                name: "Kevin O.",
                role: "Co-Founder, Stackr",
                stars: 5,
              },
              {
                quote: "I used to spend weeks on manual competitor research. Convix does it in under a minute and surfaces insights I would have never found myself.",
                name: "Priya Mehta",
                role: "Product Lead, Vesture",
                stars: 5,
              },
              {
                quote: "The founder-market fit score was the wake-up call I needed. It showed me I was chasing the wrong idea for my skillset. That honesty is rare.",
                name: "Marcus T.",
                role: "Indie Hacker",
                stars: 5,
              },
              {
                quote: "Worth every cent. The monetization feasibility module alone is more useful than 3 hours of GPT-4 prompting.",
                name: "Amara Jide",
                role: "Startup Consultant",
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: i * 0.06 }}
                className={`glass-panel rounded-2xl p-6 flex flex-col gap-4 hover-depth ${t.featured ? 'ring-1 ring-[#ef4d23]/30 bg-[#ef4d23]/[0.03]' : ''}`}>
                {t.featured && (
                  <span className="self-start text-[11px] font-semibold uppercase tracking-wider text-[#ef4d23] bg-[#ef4d23]/10 rounded-full px-3 py-1">
                    Featured Review
                  </span>
                )}
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={13} className="text-[#ef4d23] fill-[#ef4d23]" />
                  ))}
                </div>
                <p className="text-[14px] leading-relaxed flex-1" style={{ color: 'var(--fg-secondary)' }}>
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
                  <div className="w-8 h-8 rounded-full bg-[#ef4d23]/15 flex items-center justify-center text-[#ef4d23] font-bold text-sm shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold" style={{ color: 'var(--fg)' }}>{t.name}</p>
                    <p className="text-[11px]" style={{ color: 'var(--fg-muted)' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INSIGHTS & MEDIA HUB ===== */}
      <InsightsHub
        sectionTitle={<>Insights, <span className="font-serif italic font-normal text-[var(--fg-secondary)]">Masterclasses</span> & Playbooks</>}
        sectionSubtitle="Deep research, tactical validation frameworks, and curated masterclasses designed to build high-conviction startups."
        articles={homeArticles}
        videos={homeVideos}
      />

      {/* ===== FINAL CTA ===== */}
      <section className="cinematic-section text-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={standardTransition}
            className="text-3xl md:text-5xl font-medium tracking-tight mb-6" style={{ color: 'var(--fg)' }}>
            Ready to validate your <span className="font-serif italic text-[#ef4d23]">next big idea</span>?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: 0.1 }}
            className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
            Stop guessing. Start building with strategic clarity. Join 340+ founders who validate before they commit.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ ...standardTransition, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleCTA} className="bg-[#ef4d23] text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-[#d9441f] transition-all flex items-center gap-2">
              Start Validating <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/pricing')} className="rounded-full px-8 py-3 text-sm font-semibold transition-all" style={{ backgroundColor: 'var(--glass-bg)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
              View Pricing
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
