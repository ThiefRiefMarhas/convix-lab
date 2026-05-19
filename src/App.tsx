import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AuthModal from './components/auth/AuthModal';
import Lenis from 'lenis';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    (window as any).lenis = lenis;
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitializing(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimatePresence mode="wait">
          {isInitializing && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-6 gap-6 bg-[#0b0f1a]"
            >
              <Loader2 className="w-10 h-10 text-[#ef4d23] animate-spin" />
              <div className="text-center">
                <h1 className="text-lg font-bold tracking-tight text-white/90 mb-1">Convix Idea Lab</h1>
                <p className="text-sm font-medium text-white/40">Initializing strategic engines...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {!isInitializing && (
          <>
            <AppRoutes />
            <AuthModal />
          </>
        )}
      </AuthProvider>
    </ThemeProvider>
  );
}
