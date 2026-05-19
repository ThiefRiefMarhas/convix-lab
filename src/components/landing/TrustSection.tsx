import { Link } from "react-router-dom";
import { motion } from 'motion/react';

export default function TrustSection() {
  return (
    <section className="cinematic-section bg-[#0b0f1a] text-white text-center">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-medium tracking-tight mb-8"
        >
          Ready to validate your <span className="font-serif italic text-[#ef4d23]">next big idea</span>?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-neutral-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Join innovators, founders, and creators who use Convix Idea Lab to cut through the noise and find real market opportunities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/app" className="bg-[#ef4d23] text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-[#d9441f] transition-all w-full sm:w-auto">
            Validate Idea
          </Link>
          <Link to="/contact" className="bg-white/10 text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-white/20 transition-all w-full sm:w-auto">
            Contact Sales
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
