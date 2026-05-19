import CinematicHero from '../components/CinematicHero';
import VideoEmbed from '../components/VideoEmbed';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail, MapPin } from 'lucide-react';

export default function About() {
  return (
    <>
      {/* ===== HERO ===== */}
      <CinematicHero
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4"
        headline={<>We believe founders<br />deserve strategic <span className="font-serif italic font-normal">clarity</span>.</>}
        subheadline="Convix exists because too many talented people fail from lack of strategy, not lack of effort."
      />

      {/* ===== THE MISSION — editorial large text ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
              <span className="text-[13px] font-semibold tracking-tight" style={{ color: 'var(--fg-secondary)' }}>Our Story</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-medium tracking-tight leading-relaxed mb-8" style={{ color: 'var(--fg)' }}>
              "Every great company starts with a <span className="font-serif italic text-[#ef4d23]">validated insight</span>, not just an idea. We built Convix because the world doesn't need more startups — it needs more startups that <span className="font-serif italic">should exist</span>."
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
              Our AI doesn't celebrate your ideas. It interrogates them. It finds real market gaps, identifies genuine risks, and gives you the unfiltered truth before you invest months building something the market doesn't need.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FOUNDER PROFILE — unique to About ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-12 items-center">
            {/* Founder Avatar */}
            <div className="shrink-0">
              <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-[#ef4d23]/20 to-[#0b0f1a]/20 flex items-center justify-center border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                <img src="/image/arief.webp" alt="Arief Fajar" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            </div>
            {/* Bio */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold tracking-tight mb-1" style={{ color: 'var(--fg)' }}>Arief Fajar</h3>
              <p className="text-[#ef4d23] font-semibold text-sm mb-4">Founder & Builder — Convix Software</p>
              <p className="text-lg leading-relaxed mb-6" style={{ color: 'var(--fg-secondary)' }}>
                Software developer, product thinker, and strategic builder based in Margahayu. Building AI tools that help founders make better decisions faster. Currently studying at SMK Marhas while shipping production software.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://instagram.com/arief.fajr" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover-depth"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--fg-secondary)', border: '1px solid var(--border)' }}>
                  <Instagram size={16} /> @arief.fajr
                </a>
                <a href="https://www.linkedin.com/in/arief-fajar-a76855390" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover-depth"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--fg-secondary)', border: '1px solid var(--border)' }}>
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href="mailto:arieffajarmarhas@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors hover-depth"
                  style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--fg-secondary)', border: '1px solid var(--border)' }}>
                  <Mail size={16} /> Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== CORE VALUES — unique to About ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-center mb-16" style={{ color: 'var(--fg)' }}>
            What we <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>stand for</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Radical Honesty', desc: 'We tell founders what they need to hear, not what they want to hear. "Your market is saturated" saves more money than false validation.', accent: '#ef4d23' },
              { title: 'Data Over Hype', desc: 'Every analysis is grounded in market signals, competitive data, and trend analysis. No generic motivational output — only actionable intelligence.', accent: '#3b82f6' },
              { title: 'Builder-First Design', desc: 'Convix is built by a builder, for builders. The interface respects your time. Fast inputs, blunt outputs, zero bloat.', accent: '#10b981' },
            ].map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-panel rounded-2xl p-8 hover-depth relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: v.accent }} />
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--fg)' }}>{v.title}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE — unique to About ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl md:text-5xl font-medium tracking-tight text-center mb-16" style={{ color: 'var(--fg)' }}>
            The <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>journey</span>
          </motion.h2>

          <div className="space-y-8">
            {[
              { date: 'March 2026', title: 'Concept Born', desc: 'Arief identifies the gap: founders wasting months on ideas that AI could validate in seconds.' },
              { date: 'April 2026', title: 'First Prototype', desc: 'Initial validation engine built with Gemini Pro. First 50 beta testers confirm the need.' },
              { date: 'May 2026', title: 'Public Launch', desc: 'Convix Idea Lab goes live. 8 strategic analysis modules, multi-format input, real-time verdicts.' },
              { date: 'Next', title: 'Scale & Integrate', desc: 'API access, team collaboration, and integration with startup ecosystems across Southeast Asia.' },
            ].map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex gap-6">
                <div className="shrink-0 w-28 text-right">
                  <span className="text-[13px] font-mono font-semibold text-[#ef4d23]">{t.date}</span>
                </div>
                <div className="relative pt-1">
                  <div className="w-3 h-3 rounded-full bg-[#ef4d23] absolute -left-1.5 top-1.5" />
                  {i < 3 && <div className="absolute left-0 top-5 w-px h-full" style={{ backgroundColor: 'var(--border-strong)' }} />}
                </div>
                <div className="pb-6 pl-4">
                  <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--fg)' }}>{t.title}</h3>
                  <p className="leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <VideoEmbed
        title={`"Building the Next Generation of Strategic Companies."`}
        videoUrl="https://www.youtube-nocookie.com/embed/CBYhVcO4WgI"
        description="Andrew Ng on how AI-native companies will reshape industries through strategic innovation."
      />
      <Footer />
    </>
  );
}
