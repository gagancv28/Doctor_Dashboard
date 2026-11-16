import React, { useState, useEffect } from 'react';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { SignalVisualizer } from '../common/SignalVisualizer';

interface StructuringStateProps {
  onComplete: () => void;
}

export const StructuringState: React.FC<StructuringStateProps> = ({ onComplete }) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const steps = [
    'Language recognized',
    'Symptoms identified',
    'Timeline extracted',
    'Relevant history organized',
    'Case summary prepared',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 400);

    return () => clearInterval(timer);
  }, [steps.length]);

  // Transition automatically when all steps are completed
  useEffect(() => {
    if (activeStepIndex >= steps.length) {
      const autoRedirect = setTimeout(() => {
        onComplete();
      }, 700);
      return () => clearTimeout(autoRedirect);
    }
  }, [activeStepIndex, steps.length, onComplete]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center max-w-xl mx-auto px-4 sm:px-6 py-12 w-full text-center">
      {/* Calm Visual Signal */}
      <div className="w-full max-w-md bg-[#FAF9F6] border border-[#E2DFD8] rounded-md p-5 mb-8">
        <div className="text-[11px] font-mono text-[#8A867C] mb-2 uppercase tracking-wider">
          Signal to Clinical Structure Stream
        </div>
        <SignalVisualizer variant="processing" isProcessing={true} className="w-full h-16" />
      </div>

      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-[#EBF4EE] text-[#0D5C3A] font-mono text-xs border border-[#0D5C3A]/20">
          <Loader2 className="w-3 h-3 animate-spin text-[#0D5C3A]" />
          <span>Structuring Case Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
          Structuring your case…
        </h1>
        <p className="text-xs sm:text-sm text-[#5E5B54] max-w-md">
          Converting patient spoken narrative into standardized clinical terminology for doctor review.
        </p>
      </div>

      {/* Trustworthy Step-by-Step Status Lines */}
      <div className="w-full bg-white border border-[#E2DFD8] rounded-md p-6 text-left space-y-3.5 mb-8 shadow-xs">
        {steps.map((step, idx) => {
          const isDone = idx < activeStepIndex;
          const isCurrent = idx === activeStepIndex;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                isDone ? 'opacity-100' : isCurrent ? 'opacity-90' : 'opacity-30'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs transition-colors ${
                  isDone
                    ? 'bg-[#0D5C3A] text-white'
                    : isCurrent
                    ? 'border-2 border-[#0D5C3A] text-[#0D5C3A]'
                    : 'border border-[#C8C4BA] text-transparent'
                }`}
              >
                {isDone ? (
                  <Check className="w-3 h-3 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A] animate-pulse" />
                ) : null}
              </div>

              <span
                className={`text-sm ${
                  isDone
                    ? 'text-[#111111] font-medium'
                    : isCurrent
                    ? 'text-[#0D5C3A] font-semibold'
                    : 'text-[#8A867C]'
                }`}
              >
                {isDone ? `✓ ${step}` : step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Manual Continue / Skip Action */}
      <button
        onClick={onComplete}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded text-xs font-semibold tracking-tight transition-colors shadow-xs"
      >
        <span>Continue to Doctor Review</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
