import CinematicHero from '../components/CinematicHero';
import VideoEmbed from '../components/VideoEmbed';
import Footer from '../components/Footer';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: 'var(--border)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-5 text-left group">
        <span className="text-[16px] font-semibold pr-4" style={{ color: 'var(--fg)' }}>{q}</span>
        <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} style={{ color: 'var(--fg-muted)' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            className="overflow-hidden">
            <p className="pb-5 leading-relaxed text-[15px]" style={{ color: 'var(--fg-secondary)' }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();
  const { user, openAuthModal } = useAuth();
  const handleCTA = () => { 
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ef4d23', '#ffffff', '#ff7a55']
    });

    // Navigate to success page after a short delay so they see the confetti
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
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex justify-center mb-12">
            <div className="rounded-full p-1 flex gap-1" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <button onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-[14px] font-semibold transition-all ${!isYearly ? 'bg-[#ef4d23] text-white shadow-md' : ''}`}
                style={isYearly ? { color: 'var(--fg-secondary)' } : {}}>Monthly</button>
              <button onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-[14px] font-semibold transition-all ${isYearly ? 'bg-[#ef4d23] text-white shadow-md' : ''}`}
                style={!isYearly ? { color: 'var(--fg-secondary)' } : {}}>Yearly <span className="text-[11px] opacity-70">Save 20%</span></button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
              className="glass-panel rounded-3xl p-8 hover-depth">
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Starter</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--fg-muted)' }}>For solo founders testing the waters.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>$0</span>
                <span style={{ color: 'var(--fg-muted)' }}> / month</span>
              </div>
              <button onClick={handleCTA} className="w-full font-semibold rounded-full py-3 mb-8 transition-colors border" style={{ color: 'var(--fg)', borderColor: 'var(--border-strong)' }}>
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
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}
              className="bg-[#0b0f1a] rounded-3xl p-8 border border-white/10 shadow-xl text-white relative overflow-hidden hover-depth">
              <div className="absolute top-0 right-0 bg-[#ef4d23] text-white text-xs font-bold px-4 py-1.5 rounded-bl-2xl">RECOMMENDED</div>
              <h3 className="text-xl font-semibold mb-2">Pro Builder</h3>
              <p className="text-neutral-400 text-sm mb-6">For serial founders and agencies.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">${isYearly ? '39' : '49'}</span>
                <span className="text-neutral-400"> / month</span>
              </div>
              <button onClick={handleCTA} className="w-full bg-[#ef4d23] text-white font-semibold rounded-full py-3 mb-8 hover:bg-[#d9441f] transition-colors">
                Upgrade to Pro
              </button>
              <ul className="space-y-4">
                {['Unlimited Validations', 'Full 8-Module Analysis', 'PDF, Image, Voice Input', 'Premium AI (Gemini Pro)', 'Priority Support', 'Export to PDF'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-[14px] text-neutral-300">
                    <Check size={16} className="text-[#ef4d23] shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Team */}
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}
              className="glass-panel rounded-3xl p-8 hover-depth">
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>Team</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--fg-muted)' }}>For product teams and accelerators.</p>
              <div className="mb-8">
                <span className="text-4xl font-bold" style={{ color: 'var(--fg)' }}>${isYearly ? '99' : '129'}</span>
                <span style={{ color: 'var(--fg-muted)' }}> / month</span>
              </div>
              <button onClick={handleCTA} className="w-full font-semibold rounded-full py-3 mb-8 transition-colors border" style={{ color: 'var(--fg)', borderColor: 'var(--border-strong)' }}>
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

      {/* ===== FAQ — unique to Pricing ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-center mb-12" style={{ color: 'var(--fg)' }}>
            Frequently asked <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>questions</span>
          </motion.h2>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <FAQItem q="What exactly does Convix analyze?" a="Convix runs 8 strategic modules on every idea: Market Opportunity Score, Validation Confidence, Strategic Risk Index, Brand Positioning Strength, Competitor Density, Monetization Feasibility, Founder-Market Alignment, and Real Gap Detection. Each produces a scored output with specific recommendations." />
            <FAQItem q="Is the AI honest or does it just validate everything?" a="Brutally honest. Convix is designed to tell you what you need to hear — not what you want to hear. If your market is saturated, we'll say so. If your idea lacks differentiation, you'll know before wasting 6 months building it." />
            <FAQItem q="What input formats does Convix support?" a="Text prompts, PDF uploads (pitch decks, business plans), image/screenshot uploads, voice input via microphone, and conversational AI chat. All formats feed into the same analysis engine." />
            <FAQItem q="How is this different from ChatGPT or Claude?" a="Generic AI chatbots give opinions. Convix gives structured strategic analysis with scored metrics, competitive intelligence, and actionable recommendations. It's a purpose-built validation engine, not a conversation tool." />
            <FAQItem q="Can I cancel anytime?" a="Yes. No contracts, no lock-in. Cancel your subscription anytime from your dashboard. Your analysis history remains accessible." />
            <FAQItem q="Is there an API for integration?" a="API access is available on the Team plan. Connect Convix's analysis engine to your existing product workflows, accelerator programs, or internal tools." />
          </motion.div>
        </div>
      </section>

      <VideoEmbed
        title={`"Serious Builders Need Serious Systems."`}
        videoUrl="https://www.youtube-nocookie.com/embed/Th8JoIan4dg"
        description="How the best startup founders evaluate and filter ideas with strategic rigor."
      />
      <Footer />
    </>
  );
}
