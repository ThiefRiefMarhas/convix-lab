import CinematicHero from './CinematicHero';
import DashboardPreview from './DashboardPreview';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <CinematicHero
      videoSrc="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_064411_9e9d7f84-9277-41f4-ab10-59172d89e6be.mp4"
      headline={
        <>
          Validate <span className="font-serif italic font-normal text-white/90">ideas</span> before<br />
          the market decides.
        </>
      }
      subheadline="AI-powered strategic intelligence for founders, operators, and future-building teams."
      ctaText="Validate Idea"
      ctaLink="/app"
      ctaSecondaryText="Explore Features"
      ctaSecondaryLink="/features"
    >
      {/* Dashboard Preview bleeding off the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10 sm:mt-14 w-full max-w-[900px] transform translate-y-6 sm:translate-y-10"
      >
        <DashboardPreview />
      </motion.div>
    </CinematicHero>
  );
}
