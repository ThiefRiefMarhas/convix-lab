import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Mail, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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

const navCols = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', to: '/features' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Dashboard', to: '/app' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', to: '/features' },
      { label: 'Privacy Policy', to: '/about' },
      { label: 'Terms of Service', to: '/about' },
    ],
  },
];

export default function Footer() {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const handleCTA = () => { if (user) navigate('/app'); else openAuthModal(); };

  return (
    <footer style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      {/* ── Pre-footer CTA strip ─────────────────────────────────── */}
      <div className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#ef4d23] mb-3">Ready to build with clarity?</p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight" style={{ color: 'var(--fg)' }}>
              Stop guessing.<br />
              <span className="font-serif italic font-normal" style={{ color: 'var(--fg-secondary)' }}>Start validating.</span>
            </h2>
          </div>
          <button
            onClick={handleCTA}
            className="inline-flex items-center gap-3 bg-[#ef4d23] text-white font-semibold rounded-full pl-6 pr-2 py-2.5 text-[15px] hover:bg-[#d9441f] transition-all group shrink-0"
          >
            Get Started Free
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowUpRight size={16} />
            </div>
          </button>
        </div>
      </div>

      {/* ── Main footer grid ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand col — spans 2 */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <Logo />
              <span className="font-bold tracking-tight text-[17px]" style={{ color: 'var(--fg)' }}>Convix Idea Lab</span>
            </Link>
            <p className="text-[14px] leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--fg-muted)' }}>
              Strategic AI built for founders who decide with data, not gut feeling. Validate faster. Build smarter.
            </p>
            <div className="flex gap-1">
              <a href="https://instagram.com/arief.fajr" target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl transition-all hover:bg-[#ef4d23]/10 hover:text-[#ef4d23]"
                style={{ color: 'var(--fg-muted)' }}>
                <Instagram size={17} />
              </a>
              <a href="https://www.linkedin.com/in/arief-fajar-a76855390" target="_blank" rel="noopener noreferrer"
                className="p-2.5 rounded-xl transition-all hover:bg-[#ef4d23]/10 hover:text-[#ef4d23]"
                style={{ color: 'var(--fg-muted)' }}>
                <Linkedin size={17} />
              </a>
              <a href="mailto:arieffajarmarhas@gmail.com"
                className="p-2.5 rounded-xl transition-all hover:bg-[#ef4d23]/10 hover:text-[#ef4d23]"
                style={{ color: 'var(--fg-muted)' }}>
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Nav cols */}
          {navCols.map((col) => (
            <div key={col.heading}>
              <h4 className="text-[11px] font-semibold uppercase tracking-widest mb-5" style={{ color: 'var(--fg-muted)' }}>
                {col.heading}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[14px] transition-colors hover:text-[#ef4d23]"
                      style={{ color: 'var(--fg-secondary)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom bar ─────────────────────────────────────────── */}
        <div className="border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-3" style={{ borderColor: 'var(--border)' }}>
          <p className="text-[13px]" style={{ color: 'var(--fg-muted)' }}>
            © 2026 Convix Software · Built by{' '}
            <a href="https://www.linkedin.com/in/arief-fajar-a76855390" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#ef4d23] transition-colors underline underline-offset-2">
              Arief Fajar
            </a>
          </p>
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[12px] ml-1" style={{ color: 'var(--fg-muted)' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
