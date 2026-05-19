import { motion } from 'motion/react';

export default function UseCasesSection() {
  return (
    <section className="cinematic-section" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6" style={{ color: 'var(--fg)' }}>
            Built for <span className="font-serif italic">serious builders</span>.
          </h2>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>
            Whether you are a startup founder looking for product-market fit, an agency owner pitching a new service, or a creator monetizing an audience, Convix provides the strategic clarity you need.
          </p>
          <ul className="space-y-4">
            {['Founders & Builders', 'Agency Owners', 'Creators & Innovators', 'Product Teams', 'Students & Researchers'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 font-medium" style={{ color: 'var(--fg)' }}>
                <div className="w-6 h-6 rounded-full bg-[#ef4d23]/10 flex items-center justify-center text-[#ef4d23] text-[12px]">
                  ✓
                </div>
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex-1 w-full relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#ef4d23]/10 to-transparent blur-3xl" />
          <div className="relative bg-[#0b0f1a] rounded-2xl p-8 border border-white/10 shadow-2xl text-white">
            <p className="font-mono text-sm text-[#ef4d23] mb-4">{"// ANALYSIS RESULT"}</p>
            <p className="text-lg leading-relaxed opacity-90">
              "This idea is too generic. The market is saturated with basic AI wrappers. However, if you pivot to focus strictly on the legal-tech niche, there is a <span className="text-[#ef4d23] font-semibold">REAL GAP</span> with strong monetization potential."
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
