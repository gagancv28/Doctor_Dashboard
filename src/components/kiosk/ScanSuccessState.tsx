import React from 'react';
import { CheckCircle2, ShieldCheck, ArrowRight, Clock } from 'lucide-react';
import type { AbhaProfile } from '../../types/socrates';

interface ScanSuccessStateProps {
  profile: AbhaProfile;
  onProceedToIntake: () => void;
}

export const ScanSuccessState: React.FC<ScanSuccessStateProps> = ({
  profile,
  onProceedToIntake,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-300">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider">
            ABHA Identity Resolved
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#5E5B54]">Token #ABDM-8829-OK</span>
      </div>

      {/* Main Success Card */}
      <div className="my-auto py-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-[#EEF4F9] border border-[#0B4F8A]/30 flex items-center justify-center text-[#0B4F8A] mx-auto mb-2 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111]">
            Medical History Loaded Successfully
          </h1>
          <p className="text-sm sm:text-base text-[#5E5B54]">
            Past clinical consultations, diagnostic lab reports, and prescriptions retrieved via ABHA gateway.
          </p>
        </div>

        {/* Patient Credentials Card */}
        <div className="p-6 bg-white border border-[#E2DFD8] rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE7DE] gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#8A867C] font-semibold">Verified Patient Name</span>
              <h3 className="text-lg font-bold text-[#111111]">{profile.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-[#F9F9F6] border border-[#E2DFD8] text-xs font-mono rounded-lg text-[#111111]">
                {profile.gender}, {profile.age} yrs
              </span>
              <span className="px-2.5 py-1 bg-[#EEF4F9] border border-[#0B4F8A]/20 text-xs font-mono text-[#0B4F8A] font-medium rounded-lg">
                {profile.abhaAddress}
              </span>
            </div>
          </div>

          {/* Connected Facility Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#F9F9F6] rounded-xl border border-[#EAE7DE]">
              <span className="text-[#8A867C] block text-[10px] font-mono">LINKED VISITS</span>
              <span className="text-base font-bold text-[#111111]">{profile.linkedRecordsCount} Records</span>
            </div>
            <div className="p-3 bg-[#F9F9F6] rounded-xl border border-[#EAE7DE]">
              <span className="text-[#8A867C] block text-[10px] font-mono">TIMELINE RANGE</span>
              <span className="text-base font-bold text-[#111111]">2024 – 2026</span>
            </div>
            <div className="p-3 bg-[#F9F9F6] rounded-xl border border-[#EAE7DE] col-span-2 sm:col-span-1">
              <span className="text-[#8A867C] block text-[10px] font-mono">KYC STATUS</span>
              <span className="text-base font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Aadhaar Verified
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-[#5E5B54]">
          <Clock className="w-3.5 h-3.5 text-[#0B4F8A]" />
          <span>Next step: Describe what brings you to the hospital today.</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-[#E2DFD8] flex justify-end">
        <button
          onClick={onProceedToIntake}
          className="w-full sm:w-auto px-6 py-3 bg-[#0B4F8A] hover:bg-[#093D6B] text-[#F9F9F6] text-sm font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Symptom Intake</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
