import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';
import { ReactNode, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, openAuthModal } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      openAuthModal();
    }
  }, [user, loading, openAuthModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a]">
        <Loader2 className="w-10 h-10 text-[#ef4d23] animate-spin mb-4" />
        <p className="text-white/50 font-medium text-sm">Verifying session...</p>
      </div>
    );
  }

  if (!user) {
    // Don't navigate away — just show a placeholder while the auth modal is open
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f1a]">
        <div className="w-14 h-14 rounded-2xl bg-[#ef4d23]/10 border border-[#ef4d23]/20 flex items-center justify-center mb-6">
          <span className="text-[#ef4d23] font-bold text-2xl">C</span>
        </div>
        <p className="text-white/40 font-medium text-sm">Sign in to access the dashboard</p>
      </div>
    );
  }

  return <>{children}</>;
}
