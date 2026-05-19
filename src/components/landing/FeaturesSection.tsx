import { motion } from 'motion/react';

export default function FeaturesSection() {
  return (
    <section className="cinematic-section" style={{ backgroundColor: 'var(--bg-card)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6" style={{ color: 'var(--fg)' }}>
            AI validation that <span className="font-serif italic" style={{ color: 'var(--fg-secondary)' }}>actually works</span>.
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--fg-secondary)' }}>
            Stop building in the dark. Convix analyzes your ideas, finds real market gaps, and provides actionable insights based on data, not hype.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-reveal">
          {[
            {
              title: "Market Gap Analysis",
              desc: "Upload your concept and we'll tell you if it's over-saturated or a hidden gem."
            },
            {
              title: "Risk Assessment",
              desc: "Get blunt feedback on potential pitfalls before you write a single line of code."
            },
            {
              title: "Competitor Intelligence",
              desc: "Discover who is already doing it, and how you can differentiate your product."
            }
          ].map((feature, i) => (
            <div key={i} className="glass-panel rounded-2xl p-8 hover-depth">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 shadow-sm text-[#ef4d23] font-bold" style={{ backgroundColor: 'var(--bg-card)' }}>
                {i + 1}
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--fg)' }}>{feature.title}</h3>
              <p className="leading-relaxed" style={{ color: 'var(--fg-secondary)' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
