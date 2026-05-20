import CinematicHero from '../components/CinematicHero';
import DashboardPreview from '../components/DashboardPreview';
import InsightsHub, { type Article, type Video } from '../components/InsightsHub';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, TrendingUp, ShieldCheck, Crosshair, BarChart2, Star } from 'lucide-react';

const homeVideos: Video[] = [
  {
    id: "home-vid-1",
    title: "AI Will Not Replace Founders. Weak Strategy Will.",
    description: "Y Combinator partners explain how AI tools accelerate operations, but why founder intuition and strategy remain the ultimate bottle-neck.",
    videoUrl: "https://www.youtube-nocookie.com/embed/TANaRNMbYgk",
    duration: "12:15",
    coverGradient: "from-orange-500/20 to-red-600/20"
  },
  {
    id: "home-vid-2",
    title: "How to Build Startups That Matter",
    description: "A deep-dive masterclass on discovering real human needs, validating product assumptions, and mapping critical initial paths.",
    videoUrl: "https://www.youtube-nocookie.com/embed/jn9mHzXJIV0",
    duration: "18:40",
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

export default function Home() {
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
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
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 sm:mt-14 w-full max-w-[900px]"
        >
          <DashboardPreview />
        </motion.div>
      </CinematicHero>

      {/* ===== BRAND MARQUEE ===== */}
      <section className="bg-[#0b0f1a] pt-12 pb-4 overflow-hidden border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Powered by & Integrated with</p>
        </div>
        <div className="relative w-full flex overflow-hidden mask-edges">
          <div className="flex animate-marquee whitespace-nowrap items-center w-max">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-12 sm:gap-20 px-6 sm:px-10">
                {['Google', 'Google Cloud', 'Google AI Studio', 'gdev.id', 'Tavily', 'Gemini', 'Cloud Run'].map((brand, j) => (
                  <div key={`${i}-${j}`} className="flex items-center gap-12 sm:gap-20">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-white/50 hover:text-white/80 transition-colors cursor-default">
                      {brand}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST NUMBERS ===== */}
      <section className="bg-[#0b0f1a] text-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px border border-white/[0.06] rounded-2xl overflow-hidden">
            {[
              { value: '2,400+', label: 'Ideas Validated' },
              { value: '87%', label: 'Gap Detection Rate' },
              { value: '<12s', label: 'Avg. Analysis Time' },
              { value: '340+', label: 'Active Founders' },
            ].map((s, i) => (
              <div key={i} className="py-8 px-6 text-center bg-white/[0.02]">
                <div className="text-3xl md:text-4xl font-bold text-[#ef4d23] mb-1 tabular-nums">{s.value}</div>
                <div className="text-white/40 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
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
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                className="glass-panel rounded-2xl p-6 flex-1 hover-depth">
                <ShieldCheck size={22} className="text-[#ef4d23] mb-4" />
                <h3 className="font-semibold mb-2" style={{ color: 'var(--fg)' }}>Risk Assessment Engine</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
                  Surfaces regulatory, competitive, and timing blind spots before they become expensive mistakes.
                </p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
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
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
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
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
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
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
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
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
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
      <section className="cinematic-section bg-[#0b0f1a] text-white text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
            Ready to validate your <span className="font-serif italic text-[#ef4d23]">next big idea</span>?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-neutral-400 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Stop guessing. Start building with strategic clarity. Join 340+ founders who validate before they commit.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={handleCTA} className="bg-[#ef4d23] text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-[#d9441f] transition-all flex items-center gap-2">
              Start Validating <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/pricing')} className="bg-white/10 text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-white/20 transition-all">
              View Pricing
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  );
}
