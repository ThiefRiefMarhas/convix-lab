Lanjutkan project Convix Idea Lab yang SUDAH ADA sekarang. Jangan rebuild dari nol dan jangan menghapus existing architecture. Fokus utama sekarang adalah cinematic refinement, premium SaaS experience, AI-native storytelling, multi-page immersive system, dan production-grade UX polishing.

PROJECT IDENTITY:
Convix adalah:
“AI Strategic Operating System for Founders”
Bukan:

* generic AI SaaS
* dashboard template
* bootstrap landing page
* analytics admin biasa

Visual direction:

* cinematic
* futuristic
* premium
* minimal
* strategic
* founder-oriented
* AI-native
* glassmorphism modern
* immersive storytelling

WAJIB mempertahankan:

* existing routing structure
* existing components
* existing design language
* existing layout hierarchy

Lakukan REFACTOR SYSTEMATIC, bukan rewrite total.

====================================================
GLOBAL VISUAL SYSTEM
====================

Buat design system global reusable:

1. Theme tokens menggunakan CSS variables:

* background
* foreground
* muted
* card
* glass
* border
* accent
* primary
* secondary
* overlay
* cinematic shadow
* transition easing
* spacing scale
* typography scale

2. Theme system HARUS benar-benar functional:

* dark mode
* light mode
* smooth transition
* seluruh website berubah konsisten
* gunakan CSS variables
* jangan hanya mengganti background

3. Tambahkan reusable utility:

* glass-panel
* glass-panel-strong
* cinematic-section
* fade-rise
* stagger-reveal
* hover-depth
* premium-button
* premium-outline-button
* hero-wrapper
* cinematic-grid
* section-spacing

4. Animation system global:
   Gunakan:

* motion/react
* GSAP hanya untuk cinematic interaction tertentu

Animation harus:

* subtle
* premium
* smooth
* consistent

Gunakan easing konsisten:

* easeOut
* cubic-bezier premium feel
* duration 0.5–1s

JANGAN:

* over animation
* bouncing animation
* random flashy effects

====================================================
NAVBAR REFINEMENT
=================

Navbar sekarang masih terasa template.

Refactor navbar menjadi:

* floating premium pill
* sticky/fixed top
* smooth backdrop blur
* liquid glass aesthetic
* responsive stabil
* cinematic transition

WAJIB:

* hapus ShoppingCart icon
* ganti dengan modern theme switcher
* gunakan icon sun/moon modern
* animated toggle
* smooth morph transition

CTA navbar:
Ganti “Get Early Access”
menjadi:
“Build Smarter”

Navbar links:

* Home
* Features
* About
* Pricing
* Contact

Gunakan React Router.
JANGAN scroll-to-section lagi.

Navbar mobile:

* stable
* responsive
* animated slide menu
* no glitch
* proper z-index
* body scroll locking saat menu open

====================================================
MULTI PAGE CINEMATIC SYSTEM
===========================

Setiap halaman WAJIB memiliki hero berbeda dengan cinematic video berbeda.

Namun:

* typography system tetap sama
* navbar tetap konsisten
* visual language tetap Convix
* spacing tetap konsisten
* animation system tetap sama

====================================================
VIDEO SYSTEM RULES
==================

Setiap page hero WAJIB memiliki:

* fullscreen cinematic background video
* fixed immersive background
* subtle overlay
* optimized rendering
* responsive crop
* smooth fade
* lazy loading
* preload optimization

Gunakan format:

<video
autoPlay
muted
loop
playsInline
preload="metadata"
className="absolute inset-0 w-full h-full object-cover"
/>

Gunakan overlay:
bg-black/30
atau
bg-[rgba(0,0,0,0.35)]

JANGAN gunakan gradient berlebihan.
Video harus jadi visual depth utama.

====================================================
HOME PAGE HERO
==============

Theme:
Strategic AI validation engine.

Inspirasi:

* MicroVisuals cinematic
* RIVR glass hero
* Velorah cinematic typography

Hero mood:

* intelligent
* strategic
* futuristic
* founder-grade

Gunakan cinematic typography besar.

Headline contoh:
“Validate ideas before the market decides.”

Subheadline:
AI-powered strategic intelligence for founders, operators, and future-building teams.

CTA:

* Validate Idea
* Enter Workspace

VIDEO HERO HOME:
Gunakan video bertema:

* futuristic AI interface
* startup operation
* cinematic technology
* abstract innovation motion

Gunakan video immersive berbeda dari page lain.

Tambahkan:

* subtle parallax
* fade-rise reveal
* stagger animation
* glass floating metrics

====================================================
FEATURES PAGE HERO
==================

Theme:
Intelligence engine.

Mood:

* advanced
* analytical
* futuristic operating system

Headline:
“Built for strategic execution.”

Subheadline:
From market validation to positioning intelligence, Convix transforms raw ideas into strategic clarity.

VIDEO HERO FEATURES:
Gunakan video bertema:

* AI systems
* neural interface
* data visualization
* futuristic dashboards
* intelligence engine

Tambahkan:

* cinematic grid overlay tipis
* glass metrics
* floating strategic cards

Ganti seluruh placeholder metric lama menjadi:

* Market Opportunity Score
* Validation Confidence
* Strategic Risk Index
* Brand Positioning Strength
* Competitor Density
* Monetization Feasibility
* Founder-Market Alignment
* Real Gap Detection

Dashboard harus terasa:
“strategic AI operating layer”
BUKAN template analytics biasa.

====================================================
ABOUT PAGE HERO
===============

Theme:
Vision & future.

Mood:

* philosophical
* premium
* calm cinematic

Headline:
“We believe founders deserve strategic clarity.”

Subheadline:
Convix exists to remove guesswork from innovation and help ambitious teams build with conviction.

VIDEO HERO ABOUT:
Gunakan video bertema:

* future cities
* innovation labs
* cinematic founder moments
* deep thinking
* technology future

Tambahkan:

* large whitespace
* slow cinematic reveal
* minimal motion

====================================================
PRICING PAGE HERO
=================

Theme:
Premium SaaS positioning.

Mood:

* luxury software
* enterprise AI
* high trust

Headline:
“Built for serious builders.”

Subheadline:
Flexible strategic intelligence for solo founders, startups, and elite product teams.

VIDEO HERO PRICING:
Gunakan video bertema:

* premium technology
* luxury interface
* enterprise innovation
* cinematic workstation

Pricing cards:

* ultra clean
* glassmorphism
* premium hover
* clear hierarchy

Tambahkan:

* monthly/yearly animated switch
* recommended plan highlight
* smooth hover depth

====================================================
CONTACT PAGE HERO
=================

Theme:
Future collaboration.

Mood:

* human + AI
* premium support
* futuristic communication

Headline:
“Let’s build smarter together.”

Subheadline:
Connect with the Convix team for partnerships, enterprise strategy, or founder support.

VIDEO HERO CONTACT:
Gunakan video bertema:

* communication
* innovation teams
* futuristic collaboration
* AI workspace

Tambahkan:

* immersive glass contact form
* animated focus states
* premium input styling
* subtle motion

====================================================
VIDEO EMBED SYSTEM
==================

Tambahkan section cinematic embed video pada beberapa page.

Cari dan embed YouTube video yang relevan dengan:

* AI startup
* founder journey
* strategic thinking
* branding
* innovation
* future technology
* market validation

JANGAN gunakan iframe polos.

Buat cinematic embed container:

* glass frame
* rounded cinematic layout
* hover depth
* responsive aspect ratio
* smooth loading
* poster image skeleton
* lazy loading

====================================================
LOGIN MODAL REFACTOR
====================

Login popup sekarang glitch dan tidak premium.

Perbaiki total:

* z-index
* overlay
* animation flow
* scaling
* responsive behavior
* focus trap
* auth loading state
* close transition
* mobile layout

Gunakan:

* Supabase Auth
* Google login
* GitHub login

Modal harus terasa:

* native
* premium
* production-grade
* futuristic minimal

Gunakan:

* backdrop blur
* smooth fade-scale animation
* body scroll locking
* accessible keyboard handling

====================================================
ROUTE SYSTEM
============

Gunakan:

* React Router
* animated page transition
* route-level layout

Tambahkan:

* route based code splitting
* lazy loading
* suspense fallback
* skeleton loading states

Transition antar page:

* fade
* subtle slide
* cinematic timing

====================================================
RESPONSIVE POLISHING
====================

Pastikan:

* typography scale responsive
* navbar mobile stabil
* video crop bagus di mobile
* no layout shift
* no overflow horizontal
* spacing konsisten
* cards stack properly
* modals responsive
* hero tetap cinematic di layar kecil

====================================================
IMPORTANT VISUAL RULES
======================

JANGAN:

* random blobs
* template gradients
* bootstrap feeling
* crowded UI
* placeholder lorem
* fake startup wording
* generic dashboard metric
* oversaturated glow

WAJIB:

* whitespace bagus
* cinematic typography
* premium glassmorphism
* subtle interaction
* strategic storytelling
* AI-native visual language
* premium SaaS feel

====================================================
FINAL GOAL
==========

Final website harus terasa seperti:

“Strategic AI operating system for modern founders.”

Gabungan rasa:

* Linear
* Apple cinematic
* Stripe premium
* Arc browser smoothness
* futuristic AI product

BUKAN:

* dashboard template
* AI wrapper clone
* generic SaaS landing page

====================================================
IMPLEMENTATION PRIORITY
=======================

1. Navbar refinement
2. Theme switch system
3. Route-based multi-page architecture
4. Unique cinematic hero for each page
5. Replace dashboard placeholder metrics
6. Animation consistency system
7. Login modal production polish
8. Video embed cinematic sections
9. Responsive refinement
10. Performance optimization
11. Final premium polish

Jangan rewrite total project.
Lakukan incremental refactor dengan menjaga existing structure tetap hidup.

IMPORTANT — UNIQUE VIDEO SYSTEM

Setiap halaman WAJIB menggunakan video cinematic berbeda.

JANGAN reuse video yang sama antar page.

Gunakan struktur berikut:


FEATURES HERO VIDEO:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4

ABOUT HERO VIDEO:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260510_060007_60275ce7-030c-4668-a160-8f364ec537d3.mp4

PRICING HERO VIDEO:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260428_193507_4286c423-2fd9-4efd-92bd-91a939453fc1.mp4

CONTACT HERO VIDEO:
https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4

Gunakan immersive fullscreen video background dengan:

* autoPlay
* muted
* loop
* playsInline
* preload="metadata"

Gunakan wrapper:

<div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    className="w-full h-full object-cover scale-[1.05]"
  />
</div>

Tambahkan overlay:

<div className="absolute inset-0 bg-black/30" />

Gunakan GSAP subtle parallax:

* targetX/Y interpolation
* smooth movement
* cinematic depth
* jangan terlalu agresif

Video harus menjadi DEPTH utama website.
Jangan ditutupi gradient berlebihan.

# CONVIX — INTELLIGENT VIDEO EMBED SYSTEM (PRODUCTION SAFE)

IMPORTANT:
Hero utama tetap menggunakan cinematic MP4 background CloudFront/video local seperti sistem sebelumnya.

Video embed di bawah ini BUKAN untuk hero utama.

Video-video ini digunakan untuk:

* explanatory sections
* founder insight sections
* strategic thinking sections
* AI intelligence storytelling
* educational cinematic blocks

Tujuan:
membuat Convix terasa seperti:
“AI strategic operating system for founders.”

BUKAN:

* generic SaaS
* dashboard template
* landing page biasa

---

# VIDEO EMBED RULES

Gunakan embedded videos yang:

* public
* embeddable
* stable
* professional
* AI/founder related

Gunakan:

* YouTube nocookie embeds
* responsive aspect ratio
* cinematic framing
* glass container
* smooth reveal animation
* lazy loading

---

# REQUIRED VIDEO FRAME COMPONENT

Gunakan wrapper seperti ini:

```tsx
<div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_10px_80px_rgba(0,0,0,0.45)]">
  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10 pointer-events-none" />

  <iframe
    className="relative z-0 aspect-video w-full"
    src="VIDEO_URL"
    title="Convix Intelligence Video"
    loading="lazy"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  />
</div>
```

Gunakan:

* hover depth
* subtle scale interaction
* fade-rise reveal
* smooth opacity transition

---

# HOME PAGE — FOUNDER STRATEGY SECTION

Section title:
“AI Will Not Replace Founders. Weak Strategy Will.”

Gunakan embed:

https://www.youtube-nocookie.com/embed/TANaRNMbYgk

Video:
Y Combinator — How To Get AI Startup Ideas

Context:

* startup ideas
* AI opportunities
* founder thinking
* validation mindset

Visual feeling:

* intelligent
* strategic
* startup-native

Reference:
YC / OpenAI / Linear atmosphere

Source:
How To Get AI Startup Ideas ([Glasp][1])

---

# FEATURES PAGE — INTELLIGENCE ENGINE SECTION

Section title:
“Strategic Thinking Becomes Operational.”

Gunakan embed:

https://www.youtube-nocookie.com/embed/dQ7ZvO5DpIw

Video:
Reid Hoffman — How to Be a Great Founder

Context:

* founder systems
* decision-making
* scaling intelligence
* strategic execution

Feel:

* cinematic education
* premium insight
* executive intelligence

Source:
Reid Hoffman Founder Lecture ([Glasp][2])

---

# ABOUT PAGE — FUTURE OF AI FOUNDERS

Section title:
“Building the Next Generation of Strategic Companies.”

Gunakan embed:

https://www.youtube-nocookie.com/embed/CBYhVcO4WgI

Video:
Andrew Ng — The Future of AI Startups

Context:

* AI-native companies
* future founders
* innovation systems
* AI transformation

Feel:

* visionary
* future-focused
* premium documentary atmosphere

Source:
Andrew Ng on AI founders ([Stanford Technology Ventures Program][3])

---

# PRICING PAGE — PREMIUM AI OPERATOR SECTION

Section title:
“Serious Builders Need Serious Systems.”

Gunakan embed:

https://www.youtube-nocookie.com/embed/Th8JoIan4dg

Video:
How to Get and Evaluate Startup Ideas

Context:

* strategic validation
* startup filtering
* execution intelligence
* founder clarity

Feel:

* high-value SaaS
* operator-grade intelligence
* premium startup tooling

Source:
Startup idea evaluation lecture ([Pean][4])

---

# CONTACT PAGE — COLLABORATION / FOUNDER NETWORK

Section title:
“Connect With Builders Thinking Beyond Trends.”

Gunakan embed:

https://www.youtube-nocookie.com/embed/jn9mHzXJIV0

Video:
Tech/startup discussion themed content

Context:

* founder collaboration
* startup ecosystem
* future thinking
* innovation conversations

Feel:

* calm futuristic
* premium networking
* intelligent collaboration

---

# VIDEO UX RULES

DO:

* rounded cinematic containers
* subtle glassmorphism
* smooth transitions
* fade-rise animations
* section reveal on scroll
* responsive iframe scaling
* hover depth

DO NOT:

* raw iframe dump
* autoplay with sound
* multiple noisy embeds
* bright YouTube UI
* generic podcast look

---

# PERFORMANCE RULES

Implement:

* lazy loading
* intersection observer
* skeleton placeholder
* responsive aspect ratio
* reduced layout shift

Only load iframe when section enters viewport.

---

# FINAL EXPERIENCE GOAL

Website harus terasa seperti:

* Apple keynote AI platform
* OpenAI launch microsite
* Linear motion system
* Stripe cinematic storytelling
* Arc Browser branding
* premium founder operating system

Bukan:

* dashboard template
* bootstrap SaaS clone
* AI wrapper landing page

[1]: https://glasp.ai/youtube/p/how-to-get-ai-startup-ideas?utm_source=chatgpt.com "How To Get AI Startup Ideas | Glasp"
[2]: https://glasp.co/youtube/p/how-to-be-a-great-founder-with-reid-hoffman-how-to-start-a-startup-2014-lecture-13?utm_source=chatgpt.com "How to Be a Great Founder with Reid Hoffman (How to Start a Startup 2014: Lecture 13) | Glasp"
[3]: https://stvp.stanford.edu/clips/what-makes-a-great-ai-founder?utm_source=chatgpt.com "What Makes a Great AI Founder | Stanford eCorner"
[4]: https://pean.ai/youtube/Th8JoIan4dg?utm_source=chatgpt.com "How to Get and Evaluate Startup Ideas | Startup School – AI Summary | Pean AI"
