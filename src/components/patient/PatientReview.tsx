import React from 'react';
import { Check, Edit2, ArrowRight, ShieldCheck, Languages } from 'lucide-react';
import type { PatientCase, SupportedLanguage } from '../../types/clinical';

interface PatientReviewProps {
  patientCase: PatientCase;
  selectedLanguage: SupportedLanguage;
  onConfirm: () => void;
  onEdit: () => void;
}

export const PatientReview: React.FC<PatientReviewProps> = ({
  patientCase,
  selectedLanguage,
  onConfirm,
  onEdit,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
      {/* Top Context */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#111111]">PATIENT VERIFICATION</span>
          <span className="font-mono text-xs text-[#8A867C]">04 / 04</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#5E5B54]">
          <Languages className="w-3.5 h-3.5 text-[#0D5C3A]" />
          <span>Intake Language: {selectedLanguage.name}</span>
        </div>
      </div>

      {/* Main Review Summary */}
      <div className="my-auto py-6 sm:py-8 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0D5C3A] font-medium">
            Pre-Submission Check
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] mt-1 leading-tight">
            “Here’s what we understood.”
          </h1>
          <p className="text-xs sm:text-sm text-[#5E5B54] mt-1">
            Please verify if our understanding of your symptoms is correct before sending to the doctor.
          </p>
        </div>

        {/* Structured Grid Table */}
        <div className="bg-white border border-[#E2DFD8] rounded-md overflow-hidden">
          <div className="divide-y divide-[#E2DFD8]">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 bg-[#FAF9F6]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] w-48 shrink-0">
                Chief Complaint
              </span>
              <span className="font-semibold text-base sm:text-lg text-[#111111] flex-1">
                {patientCase.chiefComplaint}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] w-48 shrink-0">
                Onset & Timeline
              </span>
              <span className="text-sm sm:text-base text-[#111111] flex-1 font-medium">
                {patientCase.onset} ({patientCase.duration})
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 bg-[#FAF9F6]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] w-48 shrink-0">
                Location
              </span>
              <span className="text-sm sm:text-base text-[#111111] flex-1 font-medium">
                {patientCase.location}
              </span>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] w-48 shrink-0">
                Associated Symptoms
              </span>
              <div className="flex-1 flex flex-wrap gap-1.5">
                {patientCase.associatedSymptoms.map((symp, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-2.5 py-0.5 rounded text-xs bg-[#EBF4EE] border border-[#0D5C3A]/20 text-[#0D5C3A] font-medium"
                  >
                    {symp}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 bg-[#FAF9F6]">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] w-48 shrink-0">
                Pain Severity
              </span>
              <div className="flex-1 flex items-center gap-3">
                <span className="font-mono text-base font-bold text-[#111111]">
                  {patientCase.severity} / 10
                </span>
                <span className="font-mono text-xs text-[#5E5B54]">
                  ({patientCase.severity >= 7 ? 'Moderate-Severe' : 'Mild-Moderate'})
                </span>
              </div>
            </div>

            {/* Original Spoken Script snippet */}
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] w-48 shrink-0">
                Spoken Statement ({selectedLanguage.nativeName})
              </span>
              <span className="text-xs sm:text-sm text-[#5E5B54] italic flex-1">
                “{patientCase.rawTranscript}”
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#5E5B54]">
          <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
          <span>Patient confirmation requested before transmission to Doctor Workstation.</span>
        </div>
      </div>

      {/* Bottom Verification Actions */}
      <div className="pt-6 border-t border-[#E2DFD8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-2 px-5 py-3 rounded border border-[#E2DFD8] bg-white hover:border-[#111111] text-[#111111] text-xs font-mono font-medium transition-colors order-2 sm:order-1 focus:outline-none"
        >
          <Edit2 className="w-3.5 h-3.5 text-[#5E5B54]" />
          <span>Edit my responses</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 bg-[#111111] hover:bg-[#0D5C3A] text-[#F5F3EE] font-semibold text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]"
          >
            <Check className="w-4 h-4" />
            <span>Yes, this is correct — Submit to Doctor</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
