import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Features from './pages/Features';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Force native scroll reset immediately (synchronous, reliable)
    window.scrollTo(0, 0);
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true, force: true });
      // Double rAF ensures DOM has fully settled before re-enabling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          lenis.start();
        });
      });
    }
  }, [pathname]);
  return null;
}

export default function AppRoutes() {
  const location = useLocation();
  const showNavbar = !location.pathname.startsWith('/app');

  return (
    <>
      <ScrollToTop />
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/about" element={<About />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/subscription-success" element={<SubscriptionSuccess />} />
        <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}

