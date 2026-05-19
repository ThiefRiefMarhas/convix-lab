Extracted Design System — “Convix Software”
Visual Identity

Brand Personality

Modern SaaS
Premium PR-tech
Minimal but soft
Editorial + startup aesthetic
Slight Apple/Linear/Framer influence
Trustworthy but creative
Color Palette
Primary Brand Colors
Purpose	Color	Hex
Primary Orange	Convix Orange	#ef4d23
Dark CTA	Deep Navy	#0b0f1a
Page Background	Light Gray	#ededed
Hero Background	Soft Gray	#d9d9d9
Dashboard Tray	Warm Cream	#f5f2ee
Neutral System
Usage	Hex
White	#ffffff
Neutral 700	#404040
Neutral 500	#737373
Neutral 300	#d4d4d8
Neutral 200	#e5e5e5
Neutral 100	#f5f5f5
Semantic Colors
Usage	Hex
Danger bg	#fef2f2
Danger text	#dc2626
Success/Uptrend	#9ca3af
Typography System
Fonts
Primary UI Font
Inter
Weights:
400
500
600
700
Editorial Accent Font
Instrument Serif
Regular + Italic
Used ONLY for emotional/highlight words
Typography Hierarchy
Hero Heading
font-size: clamp(36px, 8vw, 72px);
line-height: 1.05;
font-weight: 500;
letter-spacing: -0.02em;
Style Notes
Tight tracking
Huge whitespace
Editorial contrast
Serif italic inserted inside sans-serif heading
Subtitle
font-size: clamp(13px, 3.5vw, 16px);

Tone:

Soft
Neutral
Product-oriented
Small Labels

Mostly:

11px
12px
13px
Neutral colors
Medium weight
Design Language
Overall Style

The UI combines:

SaaS minimalism
Soft glass-like layering
Warm neutral dashboard tones
Floating card system
Rounded luxury UI
Layout System
Outer Frame
min-h-screen
padding container
Design Intent

Makes the website feel:

App-like
Framed
Premium
Not edge-to-edge brutalist
Hero Container
overflow-hidden
rounded-3xl
relative
Important Design Principle

Everything is clipped together:

video
overlay
content
dashboard

This creates:

cinematic composition
unified hero experience
Spacing System
Common Radius Values
Element	Radius
Main hero	24px / rounded-3xl
Cards	16px / rounded-2xl
Buttons	9999px / full
Inputs	12px / rounded-lg
Padding Rhythm
Size	Usage
p-1	toggle pills
p-2	icon groups
p-4	mobile containers
p-5	dashboard cards
p-6	desktop dashboard tray

Consistent 4px spacing scale.

Component Design
Navbar Style
Visual Characteristics
Floating pill navbar
White background
Soft shadow
Hairline border
Centered
Not attached to edges
Vibe

Feels like:

Arc browser
Linear
Vercel
Modern AI SaaS
Button System
Primary CTA
bg-[#0b0f1a]
text-white
rounded-full
Special Trait

Contains:

inner circular icon holder
semi-transparent white background

This creates:

depth
modern interaction feel
premium SaaS aesthetic
Secondary Orange Buttons
bg-[#ef4d23]

Used for:

save actions
early access
key conversion moments
Dashboard Design
Tray
bg-[#f5f2ee]
rounded-3xl

Warm neutral instead of pure gray.

This is intentional:

feels more premium
less sterile
more editorial
Cards

All cards:

white
rounded-2xl
soft spacing
no harsh borders
clean data hierarchy
Data Visualization Style
Gauge Component

Design language:

radial analytics
lightweight visualization
no complex chart libraries
minimalist dashboard metrics
Gauge Characteristics
180° arc
thin rounded ticks
muted inactive states
orange accent progress
Vibe

Feels inspired by:

Notion analytics
Stripe dashboards
modern startup admin panels
Motion Philosophy
Explicitly Minimal

No fancy animations.

Only:

native background video

This implies:

confidence in layout
premium restraint
“less but better” philosophy
Responsive Strategy
Mobile First

Grid:

1 column → 2 columns → 3 columns

Navbar:

Desktop nav → Hamburger dropdown

Typography:

clamp() scaling everywhere

Meaning:

fluid responsiveness
no breakpoint-heavy scaling
modern responsive philosophy
UI/UX Patterns Extracted
Strong Patterns Used
Floating navigation
Rounded SaaS cards
Dashboard bleeding outside viewport
Editorial serif contrast
Warm-gray palette
Inline icon circles
Soft depth layering
Minimal border usage
Center-focused hierarchy
Implied Brand Keywords

The prompt communicates these brand traits:

Innovative
Elegant
Strategic
AI-driven
Premium
Modern
Creative-tech
Future-facing
Clean intelligence
Tailwind Token Translation
colors: {
  primary: "#ef4d23",
  dark: "#0b0f1a",
  page: "#ededed",
  hero: "#d9d9d9",
  tray: "#f5f2ee",
}
Design Style Classification

This design is a mix of:

Minimal SaaS UI
Editorial typography
Soft dashboard design
Startup landing page
Cinematic hero layout
Warm modernism
Best Matching Existing Brands

Closest aesthetic inspirations:

Linear
Vercel
Framer
Arc
Stripe

But with:

warmer palette
more editorial serif usage
PR-agency positioning instead of dev tooling.