import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionSuccess() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 selection:bg-[#ef4d23]/20 selection:text-[#ef4d23]" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-xl w-full rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        {/* Fun decorative background elements */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-[#ef4d23]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="mx-auto w-20 h-20 bg-orange-50/10 rounded-full flex items-center justify-center mb-6 shadow-inner" style={{ border: '1px solid var(--border)' }}>
            <Heart size={36} className="text-[#ef4d23]" fill="#ef4d23" />
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold mb-4 tracking-tight" style={{ color: 'var(--fg)' }}>
            Whoa! You're <span className="font-serif italic text-[#ef4d23]">awesome.</span>
          </h1>

          <p className="text-[15px] md:text-[16px] leading-relaxed mb-8" style={{ color: 'var(--fg-secondary)' }}>
            Mohon maaf kami sedang dalam proses beta atau proses awal, jadi kami tidak menyediakan subscription terlebih dahulu. Tapi <strong>terima kasih karena sudah berminat untuk membeli!</strong>
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="mb-8">
              <label className="block text-sm font-medium mb-3 text-left" style={{ color: 'var(--fg)' }}>
                Cantumkan email Anda di bawah untuk mendapatkan pesan dari kami apabila subscription sudah tersedia:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anda@email.com"
                  className="flex-1 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-[#ef4d23] focus:ring-2 focus:ring-[#ef4d23]/20 transition-all text-[15px]"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
                />
                <button 
                  type="submit"
                  className="bg-[#ef4d23] hover:bg-[#d9441f] text-white px-6 py-3.5 rounded-2xl font-semibold transition-all shadow-md shadow-[#ef4d23]/20 flex items-center justify-center gap-2 shrink-0"
                >
                  Kirim <Sparkles size={16} />
                </button>
              </div>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-6 mb-8 flex flex-col items-center gap-2"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', color: '#22c55e' }}
            >
              <span className="text-2xl">🎉</span>
              <p className="font-medium">Email berhasil disimpan! Kami akan menghubungi Anda segera.</p>
            </motion.div>
          )}

          <button 
            onClick={() => navigate('/')}
            className="text-sm font-medium transition-colors flex items-center gap-1 mx-auto hover:opacity-80"
            style={{ color: 'var(--fg-muted)' }}
          >
            <ArrowRight size={16} className="rotate-180" /> Kembali ke Beranda
          </button>
        </div>
      </motion.div>
    </div>
  );
}
