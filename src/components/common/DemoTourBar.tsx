import React from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { DEMO_STEPS } from '../../types/demoTour';

interface DemoTourBarProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const DemoTourBar: React.FC<DemoTourBarProps> = ({
  currentStepIndex,
  onSelectStep,
  isOpen,
  onToggleOpen,
}) => {
  const currentStep = DEMO_STEPS[currentStepIndex];

  if (!isOpen) {
    return (
      <button
        onClick={onToggleOpen}
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 bg-[#111111] hover:bg-[#0D5C3A] text-white px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-semibold transition-all border border-white/20 hover:scale-105"
        title="Open SIH 2026 Judge Demo Story Guide"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>Judge Demo Story ({currentStepIndex + 1}/{DEMO_STEPS.length})</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[520px] z-50 bg-[#FAF9F6] border-2 border-[#0D5C3A] rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between pb-2 border-b border-[#E2DFD8]">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-[#EBF4EE] text-[#0D5C3A]">
            <Sparkles className="w-4 h-4" />
          </span>
          <div>
            <div className="text-[10px] font-mono uppercase text-[#0D5C3A] font-bold tracking-wider">
              SIH26047 Judge Presentation Tour
            </div>
            <div className="text-xs font-bold text-[#111111]">
              Step {currentStepIndex + 1} of {DEMO_STEPS.length}: {currentStep.title}
            </div>
          </div>
        </div>

        <button
          onClick={onToggleOpen}
          className="p-1 rounded-full text-[#8A867C] hover:text-[#111111] hover:bg-[#EAE7DE]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-2.5 space-y-2">
        <p className="text-xs text-[#5E5B54] leading-relaxed">
          {currentStep.subtitle}
        </p>

        {/* Step pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] no-scrollbar">
          {DEMO_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => onSelectStep(idx)}
              className={`px-2 py-1 rounded-md font-mono whitespace-nowrap transition-all ${
                idx === currentStepIndex
                  ? 'bg-[#0D5C3A] text-white font-bold shadow-xs'
                  : idx < currentStepIndex
                  ? 'bg-[#EBF4EE] text-[#0D5C3A] hover:bg-[#D5EAD9]'
                  : 'bg-white border border-[#E2DFD8] text-[#8A867C] hover:text-[#111111]'
              }`}
            >
              {idx + 1}. {s.badge}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="pt-2 border-t border-[#E2DFD8] flex items-center justify-between">
        <button
          onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
          disabled={currentStepIndex === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#5E5B54] hover:text-[#111111] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#EAE7DE] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <span className="font-mono text-[11px] text-[#8A867C]">
          {currentStepIndex + 1} / {DEMO_STEPS.length}
        </span>

        <button
          onClick={() => onSelectStep(Math.min(DEMO_STEPS.length - 1, currentStepIndex + 1))}
          disabled={currentStepIndex === DEMO_STEPS.length - 1}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#0D5C3A] hover:bg-[#08482A] text-white disabled:opacity-30 disabled:pointer-events-none transition-colors shadow-xs"
        >
          <span>Next Step</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
