import { motion, AnimatePresence } from 'motion/react';
import { X, Github, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect, useCallback } from 'react';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, loginWithGoogle, loginWithGithub, loginWithEmail } = useAuth();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [mode, setMode] = useState<'main' | 'email'>('main');
  const [isSignUp, setIsSignUp] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Body scroll lock
  useEffect(() => {
    if (isAuthModalOpen) {
      document.body.classList.add('scroll-locked');
      setMode('main');
      setEmail('');
      setFullName('');
      setIsSignUp(false);
      setSuccessMsg('');
      setErrorMsg('');
    } else {
      document.body.classList.remove('scroll-locked');
    }
    return () => document.body.classList.remove('scroll-locked');
  }, [isAuthModalOpen]);

  // Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') closeAuthModal();
  }, [closeAuthModal]);

  useEffect(() => {
    if (isAuthModalOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, handleKeyDown]);

  const handleLogin = async (provider: 'google' | 'github') => {
    setIsLoading(provider);
    try {
      if (provider === 'google') await loginWithGoogle();
      if (provider === 'github') await loginWithGithub();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading('email');
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const { error } = await loginWithEmail(email, isSignUp ? fullName : undefined);
      if (error) throw error;
      setSuccessMsg('Check your email for the magic link!');
      setEmail('');
      setFullName('');
    } catch (err: any) {
      console.error('Email login error:', err);
      setErrorMsg(err.message || 'An error occurred while sending the magic link.');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center">
          {/* Full-screen backdrop (reduced blur for cleaner look) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            onClick={closeAuthModal}
          >
            {/* Dark overlay with minimal blur */}
            <div className="absolute inset-0 bg-[#0b0f1a]/70 backdrop-blur-[4px]" />
            {/* Ambient glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#ef4d23]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
          </motion.div>

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[420px] mx-4 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="rounded-[24px] overflow-hidden border border-white/[0.08] shadow-2xl"
              style={{ background: 'linear-gradient(180deg, rgba(24,26,37,0.98) 0%, rgba(11,15,26,0.99) 100%)' }}>

              {/* Close button */}
              <button onClick={closeAuthModal}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 text-white/40 hover:text-white/90 hover:bg-white/10 transition-all z-20 cursor-pointer">
                <X size={18} />
              </button>

              <div className="p-8 sm:p-10">
                {/* Logo */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 mb-8"
                >
                  <div className="flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 32 32" className="w-8 h-8" fill="none">
                      <circle cx="16" cy="16" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="26" cy="16" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="23.071067811865476" cy="23.071067811865476" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="16" cy="26" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="8.928932188134524" cy="23.071067811865476" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="6" cy="16" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="8.928932188134523" cy="8.928932188134524" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="15.999999999999998" cy="6" r="3.5" fill="#ef4d23"></circle>
                      <circle cx="23.071067811865476" cy="8.928932188134523" r="3.5" fill="#ef4d23"></circle>
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Convix Idea Lab</h2>
                  </div>
                </motion.div>

                {/* Headline */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-2xl font-bold text-white tracking-tight leading-tight mb-2">
                    {isSignUp ? 'Create your account' : 'Welcome back'}
                  </h3>
                  <p className="text-white/40 text-[14px] leading-relaxed mb-8">
                    {isSignUp 
                      ? 'Sign up to start validating your startup ideas with AI.' 
                      : 'Sign in to access your dashboard and past analyses.'}
                  </p>
                </motion.div>

                {/* Auth Buttons */}
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  {/* Google */}
                  <button onClick={() => handleLogin('google')} disabled={!!isLoading}
                    className="w-full flex items-center gap-4 bg-white text-[#0b0f1a] font-semibold py-3.5 px-5 rounded-xl hover:bg-white/90 transition-all disabled:opacity-50 group cursor-pointer">
                    {isLoading === 'google' ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    )}
                    <span className="flex-1 text-left">Continue with Google</span>
                  </button>

                  {/* GitHub */}
                  <button onClick={() => handleLogin('github')} disabled={!!isLoading}
                    className="w-full flex items-center gap-4 bg-white/[0.04] border border-white/[0.08] text-white font-semibold py-3.5 px-5 rounded-xl hover:bg-white/[0.08] transition-all disabled:opacity-50 group cursor-pointer">
                    {isLoading === 'github' ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Github size={20} />
                    )}
                    <span className="flex-1 text-left">Continue with GitHub</span>
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-4 py-3">
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span className="text-white/20 text-[11px] font-medium uppercase tracking-wider">or</span>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                  </div>

                  {mode === 'main' ? (
                    <button onClick={() => setMode('email')}
                      className="w-full flex items-center gap-4 bg-white/[0.02] border border-transparent text-white/50 font-medium py-3.5 px-5 rounded-xl hover:bg-white/[0.04] hover:text-white/80 transition-all cursor-pointer">
                      <Sparkles size={18} />
                      <span className="flex-1 text-left text-[14px]">Continue with Email</span>
                    </button>
                  ) : (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: 0.3 }}>
                      <form onSubmit={handleEmailSubmit} className="space-y-3">
                        {isSignUp && (
                          <input type="text" placeholder="Full Name"
                            value={fullName} onChange={e => setFullName(e.target.value)}
                            required={isSignUp}
                            className="w-full bg-white/[0.04] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#ef4d23]/40 transition-colors placeholder:text-white/20"
                          />
                        )}
                        <div className="flex gap-2">
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                            required
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] text-white rounded-xl px-4 py-3 text-[14px] outline-none focus:border-[#ef4d23]/40 transition-colors placeholder:text-white/20"
                            autoFocus={!isSignUp} />
                          <button type="submit" disabled={isLoading === 'email'}
                            className="bg-[#ef4d23] text-white font-semibold px-5 rounded-xl hover:bg-[#d9441f] transition-colors text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px]">
                            {isLoading === 'email' ? <Loader2 size={16} className="animate-spin" /> : 'Send Link'}
                          </button>
                        </div>
                        
                        {/* Status Messages */}
                        {errorMsg && (
                          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] px-3 py-2 rounded-lg">
                            {errorMsg}
                          </div>
                        )}
                        {successMsg ? (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[12px] px-3 py-2 rounded-lg">
                            {successMsg}
                          </div>
                        ) : (
                          <p className="text-white/20 text-[12px] ml-1">We'll send a magic link to your email.</p>
                        )}
                      </form>
                    </motion.div>
                  )}
                </motion.div>

                {/* Footer Toggle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-6 border-t border-white/[0.06] text-center"
                >
                  <p className="text-[13px] text-white/40">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-white hover:text-[#ef4d23] font-medium transition-colors cursor-pointer">
                      {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
