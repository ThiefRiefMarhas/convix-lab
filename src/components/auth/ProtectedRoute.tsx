import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, openAuthModal, isAuthModalOpen } = useAuth();
  const navigate = useNavigate();
  const openedRef = useRef(false);
  const modalWasOpenedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal();
      openedRef.current = true;
    }
  }, [user, loading, openAuthModal]);

  // Track if the modal was opened during this component lifecycle
  useEffect(() => {
    if (isAuthModalOpen) {
      modalWasOpenedRef.current = true;
    }
  }, [isAuthModalOpen]);

  useEffect(() => {
    // If the modal was opened, but is now closed, and the user is still not logged in,
    // automatically redirect them back to the home/landing page so they don't get stuck on a black screen.
    // By checking modalWasOpenedRef, we ensure we only redirect on transition from OPEN to CLOSED,
    // avoiding instant redirect on the first render before the modal state becomes true.
    if (modalWasOpenedRef.current && !isAuthModalOpen && !user && !loading) {
      navigate('/');
    }
  }, [isAuthModalOpen, user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a]">
        <Loader2 className="w-10 h-10 text-[#ef4d23] animate-spin mb-4" />
        <p className="text-white/50 font-medium text-sm">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    // Show a premium dashboard initialization background while loading/prompting
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a]">
        <div className="w-14 h-14 rounded-2xl bg-[#ef4d23]/10 border border-[#ef4d23]/20 flex items-center justify-center mb-6">
          <span className="text-[#ef4d23] font-bold text-2xl animate-pulse">C</span>
        </div>
        <p className="text-white/40 font-medium text-sm">Sign in to access the dashboard</p>
      </div>
    );
  }

  return <>{children}</>;
}

