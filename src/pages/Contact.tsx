import CinematicHero from '../components/CinematicHero';
import InsightsHub, { type Article, type Video } from '../components/InsightsHub';
import Footer from '../components/Footer';
import { motion } from 'motion/react';
import { useState, useEffect, useRef, type RefObject, type FormEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

const contactVideos: Video[] = [
  {
    id: "contact-vid-1",
    title: "Connecting Builders & Shapers Beyond Trends",
    description: "A conversation with next-generation builders who skip the marketing buzzwords to build highly practical, useful products that solve immediate human needs.",
    videoUrl: "https://www.youtube-nocookie.com/embed/jn9mHzXJIV0",
    duration: "15:30",
    coverGradient: "from-purple-600/20 to-pink-700/20"
  },
  {
    id: "contact-vid-2",
    title: "How to Build a Venture Studio",
    description: "Venture studio partners discuss model viability, validation pipelines, and funding mechanisms for rapid product scaling.",
    videoUrl: "https://www.youtube-nocookie.com/embed/CBYhVcO4WgI",
    duration: "13:10",
    coverGradient: "from-blue-600/20 to-indigo-700/20"
  }
];

const contactArticles: Article[] = [
  {
    id: "contact-art-1",
    title: "Enterprise Idea Validation: Accelerating Corporate Innovation & Scale",
    category: "Enterprise Scale",
    readTime: "8 min",
    excerpt: "How venture studios, accelerators, and enterprise innovation pipelines integrate rapid hypothesis stress-testing to avoid multimillion-dollar development failures.",
    author: "Arief Fajar",
    date: "May 20, 2026",
    coverGradient: "from-blue-600 to-indigo-700",
    content: [
      { type: "paragraph", text: "In enterprise environments, innovation is often slow, not because of a lack of talent or capital, but because of system complexity. A new product initiative must cross multiple departments: legal, marketing, engineering, and finance. By the time an idea is approved, millions have been spent on corporate alignment before a single user is interviewed." },
      { type: "heading", text: "The Enterprise Inertia Problem" },
      { type: "paragraph", text: "Enterprise inertia is incredibly costly. According to research, over 80% of internal enterprise products fail to gain traction after launch. The problem is that the validation process is internally focused (asking stakeholders what they want) instead of externally focused (evaluating market saturation, regulatory barriers, and customer willingness to pay)." },
      { type: "quote", text: "Corporate alignment is not market validation. Getting stakeholder sign-off does not mean you have a customer." },
      { type: "paragraph", text: "By deploying Convix at the enterprise scale, companies can integrate a rapid validation pipeline. Instead of spending six months forming a committee to evaluate a new direction, product leaders can generate an objective, data-grounded strategic scorecard in ten seconds. This separates high-potential initiatives from low-viability experiments immediately." },
      { type: "heading", text: "Venture Studio Integration" },
      { type: "paragraph", text: "Modern venture studios operate on speed and high-throughput. They need to evaluate hundreds of concepts each month. Integrating our automated analysis engine directly into the studio's early-stage funnel allows them to stress-test ideas before allocating developer resources, ensuring that only high-conviction concepts receive seed capital." }
    ]
  },
  {
    id: "contact-art-2",
    title: "The Pitch Brief: Translating Convix Metrics into Investor Conviction",
    category: "VC & Pitching",
    readTime: "7 min",
    excerpt: "How to use quantitative gap analysis and strategic risk indices to build a compelling, data-grounded narrative for early-stage investors.",
    author: "Arief Fajar",
    date: "May 20, 2026",
    coverGradient: "from-violet-600 to-fuchsia-800",
    content: [
      { type: "paragraph", text: "When you present your startup to venture capitalists, the most common question you will face is: 'Why has nobody else built this?' If you answer 'because nobody else thought of it,' you reveal a lack of market awareness. If you answer 'others have tried, but we are different,' you must prove exactly how and where that difference lies." },
      { type: "heading", text: "Building Quantitative Narratives" },
      { type: "paragraph", text: "Early-stage venture capital is a game of risk management. Investors see thousands of pitch decks full of optimistic projections and generic declarations of market size. What they rarely see is a sober, analytical risk assessment that proves the founder understands the structural challenges of the vertical." },
      { type: "quote", text: "Investors don't just invest in your vision; they invest in your understanding of the risks." },
      { type: "paragraph", text: "Using the Convix Gap Detection and Risk Index metrics inside your pitch decks changes the conversation. Instead of saying 'our market is huge,' you say: 'We have mapped 24 competitors across this space and identified a distinct semantic void in this exact pricing tier.' This demonstrates absolute mastery of your environment." },
      { type: "heading", text: "De-risking the Seed Round" },
      { type: "paragraph", text: "By presenting an objective strategic scorecard as part of your pitch materials, you prove to investors that you have rigorous filtering mechanisms. It shows that you did not choose this path blindly, but evaluated it against market signals, unit economics stress-tests, and regulatory boundaries. In a crowded fundraising market, that analytical rigor is your ultimate competitive edge." }
    ]
  }
];

/* ============================================
   EYE-TRACKING CHARACTER ANIMATION SYSTEM
   ============================================ */

interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
}

function Pupil({ size = 12, maxDistance = 5, pupilColor = "#1A1A1A", forceLookX, forceLookY }: PupilProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const calc = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const dx = mouseX - (r.left + r.width / 2);
    const dy = mouseY - (r.top + r.height / 2);
    const d = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const a = Math.atan2(dy, dx);
    return { x: Math.cos(a) * d, y: Math.sin(a) * d };
  };
  const p = calc();

  return (
    <div ref={ref} className="rounded-full" style={{ width: size, height: size, backgroundColor: pupilColor, transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 0.1s ease-out' }} />
  );
}

interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
}

function EyeBall({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white", pupilColor = "#1A1A1A", isBlinking = false, forceLookX, forceLookY }: EyeBallProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const calc = () => {
    if (!ref.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const r = ref.current.getBoundingClientRect();
    const dx = mouseX - (r.left + r.width / 2);
    const dy = mouseY - (r.top + r.height / 2);
    const d = Math.min(Math.sqrt(dx ** 2 + dy ** 2), maxDistance);
    const a = Math.atan2(dy, dx);
    return { x: Math.cos(a) * d, y: Math.sin(a) * d };
  };
  const p = calc();

  return (
    <div ref={ref} className="rounded-full flex items-center justify-center transition-all duration-150 shadow-[inset_0_4px_10px_rgba(0,0,0,0.3)]"
      style={{ width: size, height: isBlinking ? 2 : size, backgroundColor: eyeColor, overflow: 'hidden' }}
    >
      {!isBlinking && (
        <div className="rounded-full" style={{ width: pupilSize, height: pupilSize, backgroundColor: pupilColor, transform: `translate(${p.x}px, ${p.y}px)`, transition: 'transform 0.1s ease-out' }} />
      )}
    </div>
  );
}

/* ============================================ */

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocusedOnMessage, setIsFocusedOnMessage] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  // Blink timers
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => { setIsPurpleBlinking(true); setTimeout(() => { setIsPurpleBlinking(false); schedule(); }, 150); }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule(); return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => { setIsBlackBlinking(true); setTimeout(() => { setIsBlackBlinking(false); schedule(); }, 150); }, Math.random() * 4000 + 3000);
      return t;
    };
    const t = schedule(); return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (isTyping) { setIsLookingAtEachOther(true); const t = setTimeout(() => setIsLookingAtEachOther(false), 800); return () => clearTimeout(t); }
    setIsLookingAtEachOther(false);
  }, [isTyping]);

  useEffect(() => {
    if (isFocusedOnMessage) {
      const t = setTimeout(() => { setIsPurplePeeking(true); setTimeout(() => setIsPurplePeeking(false), 800); }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    }
    setIsPurplePeeking(false);
  }, [isFocusedOnMessage, isPurplePeeking]);

  const calcPos = (ref: RefObject<HTMLDivElement | null>) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dx = mouseX - (rect.left + rect.width / 2);
    const dy = mouseY - (rect.top + rect.height / 3);
    return { faceX: Math.max(-15, Math.min(15, dx / 20)), faceY: Math.max(-10, Math.min(10, dy / 30)), bodySkew: Math.max(-6, Math.min(6, -dx / 120)) };
  };

  const pp = calcPos(purpleRef);
  const bp = calcPos(blackRef);
  const yp = calcPos(yellowRef);
  const op = calcPos(orangeRef);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (name && email && message) { setSuccess("Message sent successfully! We'll get back to you soon."); setName(""); setEmail(""); setMessage(""); }
    else { setError("Please fill in all fields."); }
    setIsLoading(false);
  };

  return (
    <>
      <CinematicHero
        videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
        headline={<>Let's build <span className="font-serif italic font-normal">smarter</span><br />together.</>}
        subheadline="Connect with the Convix team for partnerships, enterprise strategy, or founder support."
      />

      {/* Contact Form with Eye Characters */}
      <section className="cinematic-section relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
        {/* Ambient orbs */}
        <div className="absolute top-[10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[#ef4d23]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30vw] h-[30vw] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-[1100px] mx-auto glass-panel rounded-[2rem] overflow-hidden flex flex-col lg:flex-row relative z-10"
        >
          {/* Left — Character Stage */}
          <div className="relative hidden lg:flex w-[55%] p-12 flex-col justify-between overflow-hidden border-r" style={{ borderColor: 'var(--border)' }}>
            <div className="relative z-20 flex gap-4">
              <div className="h-px w-12 mt-3" style={{ backgroundColor: 'var(--fg-muted)' }} />
              <p className="text-sm tracking-widest uppercase" style={{ color: 'var(--fg-secondary)' }}>Say Hello</p>
            </div>

            <div className="relative z-20 flex items-end justify-center h-[420px] mt-10">
              {/* Stage glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30px] bg-[#ef4d23]/10 blur-2xl rounded-[100%]" />

              <div className="relative" style={{ width: 500, height: 380 }}>
                {/* Purple character */}
                <div ref={purpleRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{ left: 60, width: 170, height: (isTyping || isFocusedOnMessage) ? 420 : 380, background: 'linear-gradient(180deg, #8155FF 0%, #5B2CE0 100%)', borderRadius: '16px 16px 0 0', zIndex: 1,
                    transform: isFocusedOnMessage ? 'skewX(0)' : isTyping ? `skewX(${(pp.bodySkew || 0) - 12}deg) translateX(40px)` : `skewX(${pp.bodySkew || 0}deg)`, transformOrigin: 'bottom center',
                    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.4)'
                  }}
                >
                  <div className="absolute flex gap-8 transition-all duration-700 ease-in-out"
                    style={{ left: isFocusedOnMessage ? 20 : isLookingAtEachOther ? 55 : 45 + pp.faceX, top: isFocusedOnMessage ? 35 : isLookingAtEachOther ? 65 : 40 + pp.faceY }}>
                    <EyeBall size={20} pupilSize={8} maxDistance={6} isBlinking={isPurpleBlinking} forceLookX={isFocusedOnMessage ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={isFocusedOnMessage ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                    <EyeBall size={20} pupilSize={8} maxDistance={6} isBlinking={isPurpleBlinking} forceLookX={isFocusedOnMessage ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined} forceLookY={isFocusedOnMessage ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                  </div>
                </div>

                {/* Black character */}
                <div ref={blackRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{ left: 220, width: 115, height: 290, background: 'linear-gradient(180deg, #2A2A2A 0%, #111 100%)', borderRadius: '12px 12px 0 0', zIndex: 2,
                    transform: isFocusedOnMessage ? 'skewX(0)' : isLookingAtEachOther ? `skewX(${(bp.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)` : `skewX(${bp.bodySkew || 0}deg)`, transformOrigin: 'bottom center',
                    boxShadow: 'inset 0 0 30px rgba(255,255,255,0.05), 0 20px 40px rgba(0,0,0,0.5)'
                  }}
                >
                  <div className="absolute flex gap-6 transition-all duration-700 ease-in-out"
                    style={{ left: isFocusedOnMessage ? 10 : isLookingAtEachOther ? 32 : 26 + bp.faceX, top: isFocusedOnMessage ? 28 : isLookingAtEachOther ? 12 : 32 + bp.faceY }}>
                    <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isBlackBlinking} forceLookX={isFocusedOnMessage ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={isFocusedOnMessage ? -4 : isLookingAtEachOther ? -4 : undefined} />
                    <EyeBall size={18} pupilSize={7} maxDistance={5} isBlinking={isBlackBlinking} forceLookX={isFocusedOnMessage ? -4 : isLookingAtEachOther ? 0 : undefined} forceLookY={isFocusedOnMessage ? -4 : isLookingAtEachOther ? -4 : undefined} />
                  </div>
                </div>

                {/* Orange character */}
                <div ref={orangeRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{ left: 0, width: 220, height: 190, background: 'linear-gradient(180deg, #FFB08A 0%, #E87A45 100%)', borderRadius: '110px 110px 0 0', zIndex: 3,
                    transform: isFocusedOnMessage ? 'skewX(0)' : `skewX(${op.bodySkew || 0}deg)`, transformOrigin: 'bottom center',
                    boxShadow: 'inset 0 0 40px rgba(255,255,255,0.2), 0 20px 40px rgba(0,0,0,0.4)'
                  }}
                >
                  <div className="absolute flex gap-8 transition-all duration-200 ease-out" style={{ left: isFocusedOnMessage ? 50 : 82 + (op.faceX || 0), top: isFocusedOnMessage ? 85 : 90 + (op.faceY || 0) }}>
                    <Pupil size={14} maxDistance={6} forceLookX={isFocusedOnMessage ? -5 : undefined} forceLookY={isFocusedOnMessage ? -4 : undefined} />
                    <Pupil size={14} maxDistance={6} forceLookX={isFocusedOnMessage ? -5 : undefined} forceLookY={isFocusedOnMessage ? -4 : undefined} />
                  </div>
                </div>

                {/* Yellow character */}
                <div ref={yellowRef} className="absolute bottom-0 transition-all duration-700 ease-in-out"
                  style={{ left: 290, width: 130, height: 220, background: 'linear-gradient(180deg, #F9E96A 0%, #D1C03A 100%)', borderRadius: '65px 65px 0 0', zIndex: 4,
                    transform: isFocusedOnMessage ? 'skewX(0)' : `skewX(${yp.bodySkew || 0}deg)`, transformOrigin: 'bottom center',
                    boxShadow: 'inset 0 0 30px rgba(255,255,255,0.3), 0 20px 40px rgba(0,0,0,0.4)'
                  }}
                >
                  <div className="absolute flex gap-6 transition-all duration-200 ease-out" style={{ left: isFocusedOnMessage ? 20 : 52 + (yp.faceX || 0), top: isFocusedOnMessage ? 35 : 40 + (yp.faceY || 0) }}>
                    <Pupil size={14} maxDistance={6} forceLookX={isFocusedOnMessage ? -5 : undefined} forceLookY={isFocusedOnMessage ? -4 : undefined} />
                    <Pupil size={14} maxDistance={6} forceLookX={isFocusedOnMessage ? -5 : undefined} forceLookY={isFocusedOnMessage ? -4 : undefined} />
                  </div>
                  <div className="absolute w-20 h-[5px] bg-[#1A1A1A] rounded-full transition-all duration-200 ease-out"
                    style={{ left: isFocusedOnMessage ? 10 : 40 + (yp.faceX || 0), top: isFocusedOnMessage ? 88 : 88 + (yp.faceY || 0) }} />
                </div>
              </div>
            </div>

            <div className="relative z-20 flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--fg-muted)' }}>
              <a href="https://instagram.com/arief.fajr" target="_blank" rel="noopener noreferrer" className="hover:text-[#ef4d23] transition-colors">Instagram</a>
              <a href="https://www.linkedin.com/in/arief-fajar-a76855390" target="_blank" rel="noopener noreferrer" className="hover:text-[#ef4d23] transition-colors">LinkedIn</a>
              <a href="mailto:arieffajarmarhas@gmail.com" className="hover:text-[#ef4d23] transition-colors">Email</a>
            </div>
          </div>

          {/* Right — Form */}
          <div className="w-full lg:w-[45%] p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
            <div className="w-full max-w-[400px] mx-auto">
              <div className="mb-10">
                <h2 className="text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--fg)' }}>Send a Message</h2>
                <p className="text-[15px]" style={{ color: 'var(--fg-muted)' }}>Your strategic ideas deserve a proper conversation.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1" style={{ color: 'var(--fg-secondary)' }}>Full Name</label>
                  <input type="text" placeholder="Your name" value={name} autoComplete="off"
                    onChange={e => setName(e.target.value)} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                    className="w-full h-12 rounded-xl px-4 text-base outline-none border transition-all duration-300"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-strong)', color: 'var(--fg)' }}
                    required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1" style={{ color: 'var(--fg-secondary)' }}>Email</label>
                  <input type="email" placeholder="you@example.com" value={email} autoComplete="off"
                    onChange={e => setEmail(e.target.value)} onFocus={() => setIsTyping(true)} onBlur={() => setIsTyping(false)}
                    className="w-full h-12 rounded-xl px-4 text-base outline-none border transition-all duration-300"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-strong)', color: 'var(--fg)' }}
                    required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium ml-1" style={{ color: 'var(--fg-secondary)' }}>Message</label>
                  <textarea placeholder="Describe your idea or question..." value={message}
                    onChange={e => setMessage(e.target.value)} onFocus={() => setIsFocusedOnMessage(true)} onBlur={() => setIsFocusedOnMessage(false)}
                    className="w-full min-h-[120px] rounded-xl p-4 text-base outline-none border transition-all duration-300 resize-y"
                    style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-strong)', color: 'var(--fg)' }}
                    required />
                </div>

                {error && <div className="p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}
                {success && <div className="p-3 text-sm text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">{success}</div>}

                <button type="submit" disabled={isLoading}
                  className="w-full h-12 text-base font-semibold bg-[#ef4d23] hover:bg-[#d9441f] text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      <InsightsHub
        sectionTitle="VC Pitch Briefings & Accelerator Logs"
        sectionSubtitle="Optimize early-stage pitch presentations, VC data scoring, and innovation systems."
        articles={contactArticles}
        videos={contactVideos}
      />
      <Footer />
    </>
  );
}
