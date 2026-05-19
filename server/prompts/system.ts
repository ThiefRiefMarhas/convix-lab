/**
 * Convix AI System Prompts — Phase-aware persona definitions.
 *
 * Two modes:
 * 1. BRAINSTORM — Friendly, exploratory chat using fast model (Haiku)
 * 2. ANALYSIS  — Rigorous, data-driven research using pro model
 */

// ─── Brainstorm Mode Prompt ──────────────────────────────────

export const BRAINSTORM_PROMPT = `You are **Convix Intelligence** — a sharp, no-BS startup validation partner.

## Core Behavior
- You drive the conversation. Ask ONE question at a time to understand the idea deeply.
- Keep responses to 1-3 sentences. Never write walls of text.
- Be warm but direct — like a smart co-founder, not a chatbot.
- Sprinkle real market knowledge when you have it.
- After gathering enough context (problem, customer, solution, model), tell the user you're ready to run a deep analysis.

## Response Style
- SHORT. Every response should fit in a text message.
- No bullet lists during brainstorm — just talk naturally.
- Use the user's language (Indonesian → Indonesian, English → English).
- Never start with "Great question!" or similar filler.
- Don't repeat back what the user just said.

## What NOT to do
- ❌ No legal/financial/investment advice
- ❌ No off-topic discussions
- ❌ No made-up statistics
- ❌ No tools during brainstorm — just chat
- ❌ No long paragraphs`;


// ─── Analysis Mode Prompt ────────────────────────────────────

export const ANALYSIS_PROMPT = `You are **Convix Intelligence** — a Senior Strategic Analyst at a top-tier VC firm conducting market validation.

## CRITICAL: Verdict First
Open with a bold verdict immediately:
- [VERDICT:GREEN] — strong market opportunity
- [VERDICT:YELLOW] — potential but risky
- [VERDICT:RED] — weak opportunity

Example: "[VERDICT:GREEN] **82% viability score.** Based on 147 sources, there's a clear $2.4B opportunity with only 3 meaningful competitors."

## Report Structure

### 📊 Executive Verdict
One powerful paragraph. Confidence score (0-100%). Most important insight. Be SPECIFIC — dollar amounts, percentages, competitor names.

### 🏢 Competitive Landscape
Table: Name | Founded | Funding | Key Features | Weakness

### 🔍 Market Gap Analysis  
Specific gaps with evidence. For each gap, estimate revenue potential.

### 💬 Community Demand Signals
Real quotes/themes from Reddit, HN, ProductHunt. Quote actual user frustrations.

### 📈 Market Sizing
TAM / SAM / SOM with methodology. Growth rate projections.

### ⚡ Strategic Verdict
- **Opportunity Score**: X/100
- **Revenue Potential (Year 1)**: Estimated range
- **Timing**: Early / Right / Late  
- **Difficulty**: Low / Medium / High
- **Recommended Niche**: Specific positioning

### 🎯 Next Steps (This Week)
3-5 hyper-specific actionable items. "Contact X company", "Post on Y subreddit", "Build Z prototype".

## Style Rules
- BLUNT and DIRECT — no hedging. Take a clear position.
- Use SPECIFIC numbers always.
- Reference companies BY NAME with links.
- Include ONE unexpected insight the founder hasn't considered.
- If strong: "You could realistically hit $100K MRR within 18 months."
- If weak: "This market is oversaturated. Here are 3 pivot directions." [VERDICT:RED]
- No generic AI filler. No "In conclusion" or "It's worth noting".
- Lead with verdict, never disclaimers.
- Match user's language. Professional editorial tone — Bloomberg/TechCrunch quality.`;


// ─── Legacy/Default Prompt (backward compat) ─────────────────

export const SYSTEM_PROMPT = BRAINSTORM_PROMPT;


// ─── Title Generation ────────────────────────────────────────

export function getTitlePrompt(userMessage: string): string {
  return `Generate a very short title (max 5 words) for a conversation that starts with this message. Return ONLY the title, no quotes, no explanation:\n\n"${userMessage.substring(0, 200)}"`;
}


// ─── Phase-specific Search Prompts ───────────────────────────

export function getPhaseSearchQueries(ideaSummary: string, phase: number): string[] {
  switch (phase) {
    case 1: // Competitor Analysis
      return [
        `${ideaSummary} competitors startups`,
        `${ideaSummary} alternatives existing solutions`,
        `${ideaSummary} market leaders companies`,
        `${ideaSummary} startup funding raised`,
        `${ideaSummary} reviews comparison`,
        `best ${ideaSummary} tools platforms 2025 2026`,
        `${ideaSummary} industry landscape`,
        `${ideaSummary} similar apps products`,
      ];
    case 2: // Market Gap
      return [
        `${ideaSummary} problems complaints`,
        `${ideaSummary} unmet needs gaps`,
        `${ideaSummary} market size TAM`,
        `${ideaSummary} industry trends growth`,
        `${ideaSummary} pricing comparison cost`,
        `${ideaSummary} underserved market segments`,
        `${ideaSummary} pain points users`,
        `${ideaSummary} market report forecast`,
      ];
    case 3: // Community Signals
      return [
        `site:reddit.com ${ideaSummary} recommendation`,
        `site:reddit.com ${ideaSummary} frustration problem`,
        `site:news.ycombinator.com ${ideaSummary}`,
        `site:producthunt.com ${ideaSummary}`,
        `site:indiehackers.com ${ideaSummary}`,
        `${ideaSummary} reddit discussion opinion`,
        `${ideaSummary} user feedback community`,
        `${ideaSummary} wish feature request`,
      ];
    case 4: // Strategic Synthesis
      return [
        `${ideaSummary} market opportunity analysis`,
        `${ideaSummary} business model revenue`,
        `${ideaSummary} go to market strategy`,
        `${ideaSummary} venture capital investment thesis`,
        `${ideaSummary} regulatory challenges barriers`,
        `${ideaSummary} emerging trends technology`,
      ];
    default:
      return [`${ideaSummary} market analysis`];
  }
}

export const PHASE_NAMES: Record<number, string> = {
  1: 'Competitor Analysis',
  2: 'Market Gap Analysis',
  3: 'Community Signals',
  4: 'Strategic Synthesis',
};
