import React from 'react';
import { Brain, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ThinkingStep } from '../../hooks/useChat';

interface ThinkingPhaseProps {
  steps: ThinkingStep[];
  isComplete: boolean;
}

export default function ThinkingPhase({ steps, isComplete }: ThinkingPhaseProps) {
  if (steps.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-5 py-4"
    >
      <div className="max-w-3xl mx-auto ml-7">
        <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/50 dark:from-orange-950/20 dark:to-amber-950/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl p-5 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ef4d23] to-[#ff7a55] flex items-center justify-center shadow-sm">
              <Brain size={16} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {isComplete ? 'Analysis Framework Ready' : 'Strategic Thinking...'}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {isComplete ? `${steps.length} key questions identified` : 'Formulating research strategy'}
              </p>
            </div>
            {!isComplete && (
              <div className="ml-auto">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] thinking-dot" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] thinking-dot" style={{ animationDelay: '300ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ef4d23] thinking-dot" style={{ animationDelay: '600ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Thinking Steps */}
          <div className="space-y-2">
            <AnimatePresence>
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05, duration: 0.3 }}
                  className="thinking-line flex items-start gap-2.5 py-1.5"
                >
                  {step.status === 'done' ? (
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <Loader2 size={14} className="text-[#ef4d23] shrink-0 mt-0.5 animate-spin" />
                  )}
                  <span className={`text-[13px] leading-relaxed ${
                    step.status === 'done'
                      ? 'text-neutral-600 dark:text-neutral-400'
                      : 'text-neutral-800 dark:text-neutral-200 font-medium'
                  }`}>
                    {step.question}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
