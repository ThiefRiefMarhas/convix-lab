import { ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Logo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" className="w-7 h-7 sm:w-8 sm:h-8" fill="none">
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
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('scroll-locked');
      (window as any).lenis?.stop();
    } else {
      document.body.classList.remove('scroll-locked');
      (window as any).lenis?.start();
    }
    return () => {
      document.body.classList.remove('scroll-locked');
      (window as any).lenis?.start();
    };
  }, [isOpen]);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const handleCTA = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) navigate('/app');
    else openAuthModal();
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  const isNoHeroPage = ['/subscription-success', '/privacy', '/terms'].includes(location.pathname);
  const isNavbarScrolled = scrolled || isNoHeroPage;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-3 sm:pt-4 px-3 sm:px-4 pointer-events-none transition-all duration-500">
      <div
        className="w-full flex items-center justify-between relative pointer-events-auto transition-all duration-500 rounded-full pl-4 sm:pl-6 pr-2 py-2 max-w-[840px]"
        style={{
          background: isNavbarScrolled
            ? (theme === 'dark' ? 'rgba(24, 26, 37, 0.92)' : 'rgba(255, 255, 255, 0.92)')
            : 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: isNavbarScrolled
            ? (theme === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)')
            : '1px solid rgba(255,255,255,0.12)',
          boxShadow: isNavbarScrolled ? '0 4px 30px rgba(0,0,0,0.1)' : '0 4px 20px rgba(0,0,0,0.2)',
        }}
      >
        <Link to="/" className="flex items-center gap-2 shrink-0 z-10">
          <Logo />
          <span
            className="font-bold tracking-tight text-[16px] sm:text-[17px] transition-colors duration-300 whitespace-nowrap"
            style={{ color: isNavbarScrolled ? (theme === 'dark' ? '#f5f5f5' : '#171717') : '#ffffff' }}
          >
            Convix Idea Lab
          </span>
        </Link>
 
        {/* Absolute centering ensures perfect alignment regardless of left/right widths */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center justify-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const color = isNavbarScrolled
              ? (isActive ? (theme === 'dark' ? '#f5f5f5' : '#171717') : (theme === 'dark' ? '#a3a3a3' : '#737373'))
              : (isActive ? '#ffffff' : 'rgba(255,255,255,0.6)');
            return (
              <Link key={link.name} to={link.path}
                className="text-[14px] font-medium flex items-center gap-1.5 transition-colors duration-300 hover:opacity-100"
                style={{ color }}
              >
                {isActive && <span className="w-[4px] h-[4px] rounded-full bg-[#ef4d23]" />}
                {link.name}
              </Link>
            );
          })}
        </div>
 
        <div className="flex items-center justify-end gap-2 shrink-0 z-10">
          <button onClick={toggleTheme}
            className="p-2.5 rounded-full transition-colors duration-300"
            style={{ color: isNavbarScrolled ? (theme === 'dark' ? '#a3a3a3' : '#737373') : 'rgba(255,255,255,0.6)' }}
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'light' ? (
                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun size={18} /></motion.div>
              ) : (
                <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon size={18} /></motion.div>
              )}
            </AnimatePresence>
          </button>
 
          <button onClick={handleCTA}
            className="hidden md:flex bg-[#ef4d23] text-white rounded-full pl-4 pr-1 py-1 items-center gap-2 text-[14px] font-semibold hover:bg-[#d9441f] transition-all group whitespace-nowrap"
          >
            <span>Build Smarter</span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors shrink-0">
              <ChevronRight size={16} />
            </div>
          </button>
 
          <button className="md:hidden p-2 transition-colors duration-300"
            style={{ color: isNavbarScrolled ? (theme === 'dark' ? '#f5f5f5' : '#171717') : '#ffffff' }}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-full left-0 right-0 mt-3 rounded-2xl p-5 flex flex-col gap-3 z-50 md:hidden max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar"
              data-lenis-prevent
              style={{
                background: theme === 'dark' ? 'rgba(24,26,37,0.96)' : 'rgba(255,255,255,0.96)',
                backdropFilter: 'blur(24px)',
                border: theme === 'dark' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              }}
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path}
                    className="flex items-center px-4 py-2.5 text-[15px] font-medium rounded-xl transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    style={{ color: location.pathname === link.path ? '#ef4d23' : (theme === 'dark' ? '#a3a3a3' : '#737373') }}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-1" />
              <button
                onClick={handleCTA}
                className="w-full bg-[#ef4d23] text-white rounded-xl py-3 flex items-center justify-center gap-2 text-[14px] font-bold hover:bg-[#d9441f] transition-all shadow-sm"
              >
                <span>Build Smarter</span>
                <ChevronRight size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
