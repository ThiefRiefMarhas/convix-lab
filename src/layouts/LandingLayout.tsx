import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-[#ededed] selection:bg-[#ef4d23]/20 selection:text-[#ef4d23] font-sans flex flex-col">
      {/* Navbar wrapper to give it padding and make it float at the top */}
      <div className="w-full p-3 sm:p-4">
        <Navbar />
      </div>
      
      {/* Page Content */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-neutral-100 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#ef4d23] flex items-center justify-center text-white font-bold text-xs">C</div>
            <span className="font-bold tracking-tight text-neutral-900">Convix Software</span>
          </div>
          <p className="text-neutral-400 text-sm">© 2026 Convix Software. All rights reserved.</p>
          <div className="flex gap-6 text-[13px] font-medium text-neutral-500">
            <a href="#" className="hover:text-neutral-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Terms</a>
            <a href="#" className="hover:text-neutral-900 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
