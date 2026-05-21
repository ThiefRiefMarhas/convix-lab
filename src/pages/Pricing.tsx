import CinematicHero from '../components/CinematicHero';
import InsightsHub, { type Article, type Video } from '../components/InsightsHub';
import Footer from '../components/Footer';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';

const pricingVideos: Video[] = [
  {
    id: "pricing-vid-1",
    title: "SaaS Pricing Strategy (Y Combinator)",
    description: "Y Combinator partners explain how early-stage SaaS startups should think about value metrics, pricing tiers, and capturing value.",
    videoUrl: "https://www.youtube-nocookie.com/embed/wz1E7E5b8vE",
    duration: "19:50",
    coverGradient: "from-emerald-600/20 to-teal-700/20"
  },
  {
    id: "pricing-vid-2",
    title: "How to Plan and Launch Your MVP",
    description: "A comprehensive guide on building a lean Minimum Viable Product, focusing only on the core feature sets that drive value.",
    videoUrl: "https://www.youtube-nocookie.com/embed/1hHMwLxN6EM",
    duration: "16:15",
    coverGradient: "from-indigo-600/20 to-violet-700/20"
  }
];

const pricingArticles: Article[] = [
  {
    id: "pricing-art-1",
    title: "Calculating the ROI of Validation: Why $49 Saves $49,000",
    category: "Unit Economics",
    readTime: "7 min",
    excerpt: "A mathematical breakdown of early hypothesis testing. Understand the catastrophic financial drag of developing unvalidated software compared to immediate automated stress-testing.",
    author: "Arief Fajar",
    date: "May 20, 2026",
    coverGradient: "from-emerald-500 to-teal-600",
    content: [
      { type: "paragraph", text: "In software development, there is a recurring illusion: the fastest way to validate an idea is to build it. Founders commit code, hire freelancers, lease infrastructure, and register corporations under the impression that physical execution is the only true litmus test. This approach is not only slow; it is mathematically inefficient." },
      { type: "heading", text: "The Cost of Blind Construction" },
      { type: "paragraph", text: "Let's model the baseline costs of a typical 'simple' product build. Designing assets, building database schemas, establishing authentication, and implementing basic payments takes an average of 150 developer hours. Even at modest rates, this translates to $15,000 to $25,000 in immediate capital. If the core value proposition has a critical structural gap—which 72% of early-stage ideas do—the entire investment is lost." },
      { type: "quote", text: "The most expensive code in the world is the code written to build a product that nobody wants." },
      { type: "paragraph", text: "Compare this with automated strategic stress-testing. By spending a nominal amount ($49 for Pro validation) on an objective, database-grounded engine, you immediately identify competitive saturation, unit economics failure points, and regulatory risks before writing a single line of code. The Return on Investment (ROI) is not just positive—it is orders of magnitude high." },
      { type: "heading", text: "Valuing Developer Opportunity Cost" },
      { type: "paragraph", text: "Beyond capital, the primary constraint of any builder is time. Every three months spent coding a dead-end idea is three months not spent exploring a highly viable, high-margin market gap. Validation is not an expense; it is a cheap insurance policy for your most scarce resource: your focus." }
    ]
  },
  {
    id: "pricing-art-2",
    title: "The Unit Economics Stress Test: Can Your Idea Actually Make Money?",
    category: "Financial Modeling",
    readTime: "9 min",
    excerpt: "Why premium margins are the only path to long-term startup survival and how to model SaaS vs hybrid monetization engines.",
    author: "Arief Fajar",
    date: "May 20, 2026",
    coverGradient: "from-cyan-600 to-blue-800",
    content: [
      { type: "paragraph", text: "Many startup failures are attributed to 'poor marketing' or 'lack of product-market fit.' But under closer inspection, the root cause is often simpler and more lethal: the unit economics never made sense. If your Customer Acquisition Cost (CAC) is $80, and your Lifetime Value (LTV) is $60, no amount of growth hacking or brand awareness will save your company." },
      { type: "heading", text: "The Premium Margin Mandate" },
      { type: "paragraph", text: "Modern startups must operate under a premium margin mandate. In highly competitive digital landscapes, advertising costs fluctuate and platform algorithms change. A low-margin product offers zero margin for error. If a single customer support ticket or database surge consumes your monthly gross profit, the business is fundamentally unstable." },
      { type: "quote", text: "If your business model requires millions of users to reach profitability, you are not building a startup; you are buying a ticket to a lottery." },
      { type: "paragraph", text: "To avoid this trap, founders must model their monetization mechanisms early. SaaS (Software-as-a-Service) is highly attractive due to recurring revenue, but hybrid engines—combining base subscriptions with usage-based or pay-as-you-go metrics—often align incentives much better with the actual value delivered." },
      { type: "heading", text: "Stress-Testing Your Pricing Logic" },
      { type: "paragraph", text: "When evaluating your startup idea in Convix, the monetization feasibility module stress-tests your proposed model against actual benchmarks in your vertical. It calculates your required transaction volumes, estimated CAC bounds, and break-even points, providing you with a sober assessment of whether your business can sustain itself without venture capital life support." }
    ]
  }
];

const standardTransition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] };

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group cursor-pointer">
        <span className="text-[16px] font-semibold pr-4" style={{ color: 'var(--fg)' }}>{q}</span>
        <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--fg-muted)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 'auto', opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            transition={standardTransition}
            className="overflow-hidden"
          >
            <p className="pb-5 leading-relaxed text-[15px]" style={{ color: 'var(--fg-secondary)' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [hours, setHours] = useState(150);
  const navigate = useNavigate();

  const handleCTA = () => { 
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4d23', '#ffffff', '#ff7a55']
    });

    setTimeout(() => {
      navigate('/subscription-success');
    }, 800);
  };

  return (
    <>
      <CinematicHero
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4"
        headline={<>Built for <span className="font-serif italic font-normal">serious</span><br />builders.</>}
        subheadline="Strategic AI intelligence priced for builders who are serious about validating before they commit."
      />

      {/* ===== PRICING CARDS ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={standardTransition}
            className="flex justify-center mb-12"
          >
            <div className="rounded-full p-1 flex gap-1" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <button onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer ${!isYearly ? 'bg-[#ef4d23] text-white shadow-md' : ''}`}
                style={isYearly ? { color: 'var(--fg-secondary)' } : {}}>Monthly</button>
              <button onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-[14px] font-semibold transition-all cursor-pointer ${isYearly ? 'bg-[#ef4d23] text-white shadow-md' : ''}`}
                style={!isYearly ? { color: 'var(--fg-secondary)' } : {}}>Yearly <span className="text-[11px] opacity-70">Save 20%</span></button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ ...standardTransition, delay: 0.05 }}
              className="glass-panel rounded-3xl p-8 hover-depth"
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Starter</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--fg-muted)' }}>For solo founders testing the waters.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>$0</span>
                <span style={{ color: 'var(--fg-muted)' }}> / month</span>
              </div>
              <button onClick={handleCTA} className="w-full font-semibold rounded-full py-3 mb-8 transition-colors border cursor-pointer hover:bg-white/5" style={{ color: 'var(--fg)', borderColor: 'var(--border-strong)' }}>
                Get Started Free
              </button>
              <ul className="space-y-4">
                {['5 Idea Validations / mo', 'Basic SWOT Output', 'Text Prompt Input Only', 'Standard AI Model', 'Community Support'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px]" style={{ color: 'var(--fg-secondary)' }}>
                    <Check size={16} className="text-[#ef4d23] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Pro — Recommended */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ ...standardTransition, delay: 0.15 }}
              className="rounded-3xl p-8 border-2 border-[#ef4d23]/30 shadow-xl relative overflow-hidden hover-depth" style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
              <div className="absolute top-0 right-0 bg-[#ef4d23] text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">RECOMMENDED</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Pro Builder</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--fg-secondary)' }}>For serial founders and agencies.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>${isYearly ? '39' : '49'}</span>
                <span style={{ color: 'var(--fg-muted)' }}> / month</span>
              </div>
              <button onClick={handleCTA} className="w-full bg-[#ef4d23] text-white font-semibold rounded-full py-3 mb-8 hover:bg-[#d9441f] transition-colors cursor-pointer shadow-lg shadow-[#ef4d23]/20">
                Upgrade to Pro
              </button>
              <ul className="space-y-4">
                {['Unlimited Validations', 'Full 8-Module Analysis', 'PDF, Image, Voice Input', 'Premium AI (Gemini Pro)', 'Priority Support', 'Export to PDF'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px]" style={{ color: 'var(--fg-secondary)' }}>
                    <Check size={16} className="text-[#ef4d23] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Team */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ ...standardTransition, delay: 0.25 }}
              className="glass-panel rounded-3xl p-8 hover-depth"
            >
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Team</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--fg-muted)' }}>For product teams and accelerators.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>${isYearly ? '99' : '129'}</span>
                <span style={{ color: 'var(--fg-muted)' }}> / month</span>
              </div>
              <button onClick={handleCTA} className="w-full font-semibold rounded-full py-3 mb-8 transition-colors border cursor-pointer hover:bg-white/5" style={{ color: 'var(--fg)', borderColor: 'var(--border-strong)' }}>
                Contact Sales
              </button>
              <ul className="space-y-4">
                {['Everything in Pro', 'Up to 10 team members', 'Shared workspace', 'API Access', 'Custom AI training', 'Dedicated account manager'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px]" style={{ color: 'var(--fg-secondary)' }}>
                    <Check size={16} className="text-[#ef4d23] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== THE COST OF BLIND CONSTRUCTION CALCULATOR ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={standardTransition}
            className="text-center mb-16"
          >
            <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
              Validation Economics
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
              The Cost of <span className="font-serif italic text-[#ef4d23]">Blind Construction</span> Calculator
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
              Quantify the real financial risk and opportunity cost of building without prior validation signals. Drag the slider to set your estimated MVP development time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Slider Panel (Left) */}
            <div className="lg:col-span-7 p-8 rounded-3xl border border-white/[0.04] bg-white/[0.01] hover:border-white/[0.08] transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>Estimated Development Time</span>
                <span className="text-xl font-bold font-mono text-[#ef4d23] tabular-nums">{hours} Hours</span>
              </div>
              
              <input 
                type="range" 
                min="50" 
                max="500" 
                value={hours} 
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-white/10 appearance-none cursor-pointer accent-[#ef4d23] focus:outline-none"
              />
              
              <div className="flex justify-between text-[11px] font-mono text-neutral-400 mt-3">
                <span>50 Hrs (Quick Prototype)</span>
                <span>500 Hrs (Complex MVP)</span>
              </div>

              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <p className="text-xs leading-relaxed text-[var(--fg-secondary)]">
                  * Calculated based on standard vocational software lab engineering indices (average $60/hour standard B2B contracting rates or direct opportunity resource allocation).
                </p>
              </div>
            </div>

            {/* Results Panel (Right) */}
            <div className="lg:col-span-5 p-8 rounded-3xl border border-[#ef4d23]/25 bg-gradient-to-b from-[#ef4d23]/[0.02] to-neutral-50/50 dark:to-[#0f1017]/30 shadow-lg shadow-[#ef4d23]/5">
              <div className="text-[10px] font-mono font-bold text-[#ef4d23] uppercase tracking-wider mb-6 pb-2 border-b border-[#ef4d23]/10">ECONOMIC VERDICT</div>
              
              <div className="space-y-6">
                <div>
                  <span className="text-xs text-[var(--fg-muted)] block mb-1">Capital Risked (Blind Build)</span>
                  <span className="text-2xl font-extrabold font-mono text-red-500 tabular-nums">
                    ${(hours * 60).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-[var(--fg-muted)] block mb-1">Time Lost (Opportunity Cost)</span>
                  <span className="text-2xl font-extrabold font-mono text-orange-400 tabular-nums">
                    {(hours / 130).toFixed(1)} Months
                  </span>
                </div>

                <div className="pt-4 border-t border-white/[0.04]">
                  <span className="text-xs text-[#ef4d23] font-semibold block mb-1">Preserved Capital (via Convix Pro)</span>
                  <span className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">
                    ${(hours * 60 - 49).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ — unique to Pricing ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={standardTransition}
            className="text-3xl md:text-5xl font-medium tracking-tight text-center mb-12" 
            style={{ color: 'var(--fg)' }}
          >
            Frequently asked <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>questions</span>
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={standardTransition}
          >
            <FAQItem q="What exactly does Convix analyze?" a="Convix runs 8 strategic modules on every idea: Market Opportunity Score, Validation Confidence, Strategic Risk Index, Brand Positioning Strength, Competitor Density, Monetization Feasibility, Founder-Market Alignment, and Real Gap Detection. Each produces a scored output with specific recommendations." />
            <FAQItem q="Is the AI honest or does it just validate everything?" a="Brutally honest. Convix is designed to tell you what you need to hear — not what you want to hear. If your market is saturated, we'll say so. If your idea lacks differentiation, you'll know before wasting 6 months building it." />
            <FAQItem q="What input formats does Convix support?" a="Text prompts, PDF uploads (pitch decks, business plans), image/screenshot uploads, voice input via microphone, and conversational AI chat. All formats feed into the same analysis engine." />
            <FAQItem q="How is this different from ChatGPT or Claude?" a="Generic AI chatbots give opinions. Convix gives structured strategic analysis with scored metrics, competitive intelligence, and actionable recommendations. It's a purpose-built validation engine, not a conversation tool." />
            <FAQItem q="Can I cancel anytime?" a="Yes. No contracts, no lock-in. Cancel your subscription anytime from your dashboard. Your analysis history remains accessible." />
            <FAQItem q="Is there an API for integration?" a="API access is available on the Team plan. Connect Convix's analysis engine to your existing product workflows, accelerator programs, or internal tools." />
          </motion.div>
        </div>
      </section>

      <InsightsHub
        sectionTitle="Validation Economics & Strategic Case Studies"
        sectionSubtitle="Analyze startup ROI, unit economics risks, and operational stress-testing."
        articles={pricingArticles}
        videos={pricingVideos}
      />
      <Footer />
    </>
  );
}
