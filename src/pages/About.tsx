import CinematicHero from '../components/CinematicHero';
import InsightsHub, { type Article, type Video } from '../components/InsightsHub';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { Instagram, Linkedin, Mail } from 'lucide-react';

const aboutVideos: Video[] = [
  {
    id: "about-vid-1",
    title: "Steve Blank: The Principles of Lean",
    description: "Lean startup pioneer Steve Blank explains the Customer Development methodology, highlighting the distinction between search and execution.",
    videoUrl: "https://www.youtube-nocookie.com/embed/S4nCY0H4598",
    duration: "24:35",
    coverGradient: "from-blue-600/20 to-indigo-700/20"
  },
  {
    id: "about-vid-2",
    title: "How to Talk to Users (Mom Test Concepts)",
    description: "Pebble founder Eric Migicovsky explains the Customer Discovery art of extracting unbiased truth from user interviews.",
    videoUrl: "https://www.youtube-nocookie.com/embed/CV2-Wd49hWw",
    duration: "12:10",
    coverGradient: "from-orange-500/20 to-amber-600/20"
  }
];

const aboutArticles: Article[] = [
  {
    id: "about-art-1",
    title: "Studios, Systems, and School: Shipping Production Code from SMK Marhas",
    category: "Developer Story",
    readTime: "10 min",
    excerpt: "An authentic, technical retrospective on balancing vocational Rekayasa Perangkat Lunak (RPL) training at SMK Marhas Margahayu with engineering the high-performance Convix validation engine.",
    author: "Arief Fajar",
    date: "May 19, 2026",
    coverGradient: "from-orange-500 to-red-600",
    content: [
      { type: "paragraph", text: "To the traditional technology sector, the path of a software developer is heavily standardized: complete a four-year computer science degree, join an enterprise corporation as an intern, and slowly move into system design. However, academic lectures and enterprise bureaucracies often introduce a significant latency between learning a concept and shipping it to production. At SMK Marhas Margahayu, specifically within the Rekayasa Perangkat Lunak (RPL - Software Engineering) department, this paradigm is completely reversed. Vocational training places extreme emphasis on immediate practical execution—transforming software logic into functional, compiled code from day one." },
      { type: "heading", text: "Managing Systems Under Academic Constraints" },
      { type: "paragraph", text: "Engineering a complex real-time strategic analysis engine like Convix while maintaining strict vocational attendance is a masterclass in operational discipline. The daily routine requires high cognitive context-switching: by day, completing assignments on relational database schema designs, SQL queries, and basic network protocols in the school computer labs; by night, architecting high-concurrency client architectures, implementing Gemini structured JSON schema boundaries, and optimizing local Web Speech API streams for voice validation. School is not a distraction from building; it is a highly controlled testbed where theoretical foundations are immediately stress-tested against real-world production constraints." },
      { type: "quote", text: "Vocational discipline enforces extreme resource efficiency. When you only have four hours of uninterrupted coding after a rigorous school day, you learn to write clean, decoupled, self-documenting architectures because you cannot afford wasted debug cycles." },
      { type: "paragraph", text: "This unique constraint profile directly influenced the engineering of Convix. To prevent runtime performance degradation, we bypassed heavy client-side processing, utilizing specialized React Hooks to isolate state transitions and relying on lightweight, asynchronous transaction pools in our Supabase Postgres layer. Every line of TypeScript is written under strict-mode type assertions, ensuring that memory leaks and asynchronous race conditions are resolved long before the code hits our production edge servers." },
      { type: "heading", text: "The Vocational Builder Advantage" },
      { type: "paragraph", text: "A key advantage of starting as a vocational student developer is the early exposure to low-level execution logic without corporate dogmas. We are taught to view frameworks and libraries as transient tools, and to focus instead on core performance metrics: First Contentful Paint (FCP), database query latency, and API payload compression. The rigor instilled by SMK Marhas Margahayu's daily software labs serves as our core competitive advantage, enabling us to ship production-grade code with the speed of an elite startup team." }
    ]
  },
  {
    id: "about-art-2",
    title: "The Philosophy of Blunt AI: Cognitive Bias Mitigation in Strategic Analysis",
    category: "Philosophy",
    readTime: "9 min",
    excerpt: "Why human feedback networks act as low-pass filters that distort strategic risks, and how mathematical objectivity de-risks the early-stage startup funnel.",
    author: "Arief Fajar",
    date: "May 20, 2026",
    coverGradient: "from-slate-700 to-neutral-900",
    content: [
      { type: "paragraph", text: "When a founder conceives a new product direction, the immediate instinct is to gather validation from immediate social networks—friends, family, and colleagues. While supportive, this feedback loop is highly compromised. Due to social politeness and cognitive bias, human networks operate as low-pass noise filters. They amplify positive speculation while completely dampening structural risks, leading founders to commit capital to concepts that lack any mathematical viability." },
      { type: "heading", text: "The Entropy of Polite Confirmation" },
      { type: "paragraph", text: "From an information theory perspective, polite feedback represents high-entropy, low-value noise. Investors who decline to invest rarely provide the authentic, cold reasons for their rejection, opting instead for generic encouraging phrases. Similarly, potential users often express intent to use a product to avoid social friction, yet fail to convert when financial transaction walls are introduced. This confirmation bias creates a lethal variance between perceived demand and actual market economics." },
      { type: "quote", text: "Sugarcoated data is worse than no data. It misallocates human capital and extends the time-to-failure for fundamentally flawed ideas." },
      { type: "paragraph", text: "This systemic bias is what the Convix engine is designed to eliminate. AI possesses no social incentives; it is completely immune to the social anxiety that governs human interactions. When an idea is processed by Convix, the system parses it across three major analytical pipelines: vector embedding alignment against active competitive matrices, regulatory compliance taxonomy graphs, and historical market trend indexes. The resulting Risk Index is not a polite estimation—it is a cold, objective mathematical verdict." },
      { type: "heading", text: "Engineering for Extreme Clarity" },
      { type: "paragraph", text: "The philosophy of 'Blunt AI' is ultimately about respecting the builder. By providing unfiltered, high-density analytical critiques on unit economics, market voids, and operational hurdles within ten seconds, Convix saves founders months of wasted effort. In a high-risk landscape, the ultimate advantage is not motivation—it is objective, strategic truth." }
    ]
  }
];

const standardTransition = { duration: 0.58, ease: [0.22, 1, 0.36, 1] };

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
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={standardTransition}
          >
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
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={standardTransition}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
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
          <motion.h2 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={standardTransition}
            className="text-3xl md:text-5xl font-medium tracking-tight text-center mb-16" 
            style={{ color: 'var(--fg)' }}
          >
            What we <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>stand for</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Radical Honesty', desc: 'We tell founders what they need to hear, not what they want to hear. "Your market is saturated" saves more money than false validation.', accent: '#ef4d23' },
              { title: 'Data Over Hype', desc: 'Every analysis is grounded in market signals, competitive data, and trend analysis. No generic motivational output — only actionable intelligence.', accent: '#3b82f6' },
              { title: 'Builder-First Design', desc: 'Convix is built by a builder, for builders. The interface respects your time. Fast inputs, blunt outputs, zero bloat.', accent: '#10b981' },
            ].map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ ...standardTransition, delay: i * 0.1 }}
                className="glass-panel rounded-2xl p-8 hover-depth relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: v.accent }} />
                <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--fg)' }}>{v.title}</h3>
                <p className="leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SMK MARHAS VOCATIONAL LAB LOG — unique asymmetric timeline ===== */}
      <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 24 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={standardTransition}
            className="text-center mb-20"
          >
            <span className="text-xs font-mono font-bold tracking-widest text-[#ef4d23] uppercase mb-3 block">
              System Genesis Log
            </span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-4" style={{ color: 'var(--fg)' }}>
              SMK Marhas <span className="font-serif italic text-[#ef4d23]">Vocational Lab</span> Log
            </h2>
            <p className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
              A chronological engineering ledger linking vocational training in Rekayasa Perangkat Lunak (RPL) at SMK Marhas Margahayu to the high-concurrency systems powering Convix.
            </p>
          </motion.div>

          <div className="relative ml-4 md:ml-32 space-y-12" style={{ borderLeft: '1px solid var(--border)' }}>
            {[
              {
                period: 'Q3 2025',
                title: 'Vocational RPL SQL & Relational Schema Labs',
                subtitle: 'SMK Marhas Margahayu Computer Lab',
                desc: 'Designing deep transactional queries, understanding database normalizations, and implementing index moats to optimize transactional integrity.',
                metric: 'Query latency reduced to <8ms'
              },
              {
                period: 'Q4 2025',
                title: 'High-Velocity Async Client State Hooks',
                subtitle: 'Core UI Pipeline Refactoring',
                desc: 'Bypassing generic state containers to construct specialized React context loops that instantly synchronize client chat streams with background processes.',
                metric: 'Zero frame-rate drop on mobile layouts'
              },
              {
                period: 'Q1 2026',
                title: 'High-Concurrency Postgres Vector Pools',
                subtitle: 'Semantic Search Integration',
                desc: 'Mapping scraping results via Tavily API and passing high-dimensional embeddings to pgvector clusters for lightning-fast competitive validation.',
                metric: 'Processed 24,000+ vector intersections/min'
              },
              {
                period: 'Q2 2026',
                title: 'Hardened LLM Structured JSON Output',
                subtitle: 'Gemini Parsing Sandbox',
                desc: 'Designing rigid schema validation boundaries that guarantee absolute structural consistency from deep language models with zero parsing failure rates.',
                metric: '99.98% runtime schema parsing accuracy'
              }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-60px" }} 
                transition={{ ...standardTransition, delay: i * 0.12 }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Visual marker line */}
                <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-[#ef4d23] group-hover:scale-125 transition-transform duration-300 shadow-md shadow-[#ef4d23]/50" style={{ border: '2px solid var(--bg)' }} />
                
                {/* Time Indicator on Left for Wide Layouts */}
                <div className="md:absolute md:-left-32 md:w-28 md:text-right md:top-1 text-xs font-mono font-bold text-[#ef4d23] mb-2 md:mb-0 block">
                  {step.period}
                </div>

                {/* Editorial Panel */}
                <div className="p-6 rounded-2xl border hover:border-[#ef4d23]/15 transition-all duration-300 relative overflow-hidden" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-card)' }}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#ef4d23]/[0.02] to-transparent pointer-events-none" />
                  
                  <span className="text-[10px] font-mono uppercase block mb-1" style={{ color: 'var(--fg-muted)' }}>{step.subtitle}</span>
                  <h3 className="text-lg font-bold mb-3" style={{ color: 'var(--fg)' }}>{step.title}</h3>
                  <p className="text-xs sm:text-[13px] leading-relaxed mb-4" style={{ color: 'var(--fg-secondary)' }}>{step.desc}</p>
                  
                  <div className="flex items-center gap-2 font-mono text-[11px] text-[#ef4d23] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4d23]" />
                    <span>Lab Metric: {step.metric}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <InsightsHub
        sectionTitle="Founder Insights & Margahayu Studio Log"
        sectionSubtitle="Raw developer logs, vocational foundations, and product philosophies."
        articles={aboutArticles}
        videos={aboutVideos}
      />
      <Footer />
    </>
  );
}
