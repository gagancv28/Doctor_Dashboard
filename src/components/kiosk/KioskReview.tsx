import React from 'react';
import { Check, Edit2, ArrowRight } from 'lucide-react';
import type { SocratesCase } from '../../types/socrates';

interface KioskReviewProps {
  socratesCase: SocratesCase;
  onSubmitToDoctor: () => void;
  onEdit: () => void;
}

export const KioskReview: React.FC<KioskReviewProps> = ({
  socratesCase,
  onSubmitToDoctor,
  onEdit,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full p-6 sm:p-10">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <span className="font-mono text-xs font-bold text-[#111111]">PATIENT VERIFICATION</span>
        <span className="font-mono text-xs text-[#8A867C]">STEP 04 / 04</span>
      </div>

      {/* Main Review Summary */}
      <div className="my-auto py-6 space-y-6">
        <div>
          <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider block">
            Pre-Submission Check
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] mt-1 leading-tight">
            “Here's what we understood”
          </h1>
          <p className="text-sm text-[#5E5B54] mt-1">
            Please verify your symptoms. The doctor will see this structured summary alongside your historical timeline.
          </p>
        </div>

        {/* Structured SOCRATES Summary Grid */}
        <div className="p-6 bg-white border border-[#E2DFD8] rounded-2xl shadow-sm space-y-3.5 text-xs">
          <div className="flex justify-between border-b border-[#EAE7DE] pb-2.5">
            <span className="font-mono text-[#8A867C] font-semibold">CHIEF COMPLAINT</span>
            <span className="font-bold text-[#111111] text-right">{socratesCase.chiefComplaint}</span>
          </div>

          <div className="flex justify-between border-b border-[#EAE7DE] pb-2.5">
            <span className="font-mono text-[#8A867C] font-semibold">SITE / RADIATION</span>
            <span className="font-medium text-[#111111] text-right max-w-xs">
              {socratesCase.site} ({socratesCase.radiation})
            </span>
          </div>

          <div className="flex justify-between border-b border-[#EAE7DE] pb-2.5">
            <span className="font-mono text-[#8A867C] font-semibold">CHARACTER & ONSET</span>
            <span className="font-medium text-[#111111] text-right max-w-xs">
              {socratesCase.character} • {socratesCase.onset}
            </span>
          </div>

          <div className="flex justify-between border-b border-[#EAE7DE] pb-2.5">
            <span className="font-mono text-[#8A867C] font-semibold">PAIN SEVERITY</span>
            <span className="font-bold text-[#0B4F8A] px-2 py-0.5 bg-[#EEF4F9] rounded border border-[#0B4F8A]/20">
              {socratesCase.severity} / 10 Pain Scale
            </span>
          </div>

          <div className="flex justify-between pt-1">
            <span className="font-mono text-[#8A867C] font-semibold">ASSOCIATED SIGNS</span>
            <span className="font-medium text-[#111111] text-right max-w-xs">
              {socratesCase.associations.join(', ')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-[#E2DFD8] flex items-center justify-between gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#5E5B54] hover:text-[#111111] px-4 py-2 rounded-xl transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Answers</span>
        </button>

        <button
          onClick={onSubmitToDoctor}
          className="px-6 py-3 bg-[#111111] hover:bg-[#222222] text-[#F9F9F6] text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Confirm & Send to Doctor OPD Screen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
