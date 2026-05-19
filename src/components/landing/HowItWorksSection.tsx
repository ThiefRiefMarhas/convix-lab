import { motion } from 'motion/react';

export default function HowItWorksSection() {
  return (
    <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-medium tracking-tight mb-16 text-center"
          style={{ color: 'var(--fg)' }}
        >
          How <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>Convix</span> works
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 stagger-reveal">
          {[
            { step: '01', title: 'Input', desc: 'Type your idea, upload a pitch deck, or use voice input.' },
            { step: '02', title: 'Analysis', desc: 'Our AI cross-references your concept with live market data.' },
            { step: '03', title: 'Verdict', desc: 'Receive a blunt, realistic assessment of your idea.' },
            { step: '04', title: 'Execution', desc: 'Get actionable steps to pivot or scale.' },
          ].map((item, i) => (
            <div key={i} className="relative">
              {i < 3 && <div className="hidden md:block absolute top-6 left-[60%] w-full h-[1px]" style={{ backgroundColor: 'var(--border-strong)' }} />}
              <div className="text-[#ef4d23] font-mono text-xl mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--fg)' }}>{item.title}</h3>
              <p className="leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
