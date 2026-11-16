import React, { useState } from 'react';
import type { SocratesCase, LongitudinalRecord, AbhaProfile } from '../../types/socrates';
import { SocratesConsultPanel } from './SocratesConsultPanel';
import { LongitudinalTimeline } from './LongitudinalTimeline';
import { VerifiedRecordModal } from './VerifiedRecordModal';

interface DoctorDashboardViewProps {
  socratesCase: SocratesCase;
  abhaProfile: AbhaProfile;
  timelineRecords: LongitudinalRecord[];
  onUpdateCase: (updatedCase: SocratesCase) => void;
  onNavigateToKiosk: () => void;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  socratesCase,
  abhaProfile,
  timelineRecords,
  onUpdateCase,
  onNavigateToKiosk,
}) => {
  const [showVerifiedModal, setShowVerifiedModal] = useState(false);

  const handleApproveCase = () => {
    const updated: SocratesCase = {
      ...socratesCase,
      doctorVerified: true,
      verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    onUpdateCase(updated);
    setShowVerifiedModal(true);
  };

  const handlePartialUpdate = (updated: Partial<SocratesCase>) => {
    onUpdateCase({
      ...socratesCase,
      ...updated,
    });
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-[#F9F9F6] overflow-hidden">
      {/* Top Clinical Header Strip */}
      <div className="bg-white border-b border-[#E2DFD8] px-6 py-3 flex flex-wrap items-center justify-between gap-4 shadow-2xs z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0B4F8A]/10 border border-[#0B4F8A]/20 flex items-center justify-center font-bold text-[#0B4F8A] text-xs">
              LG
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#111111] leading-tight">{abhaProfile.name}</h1>
                <span className="text-[11px] bg-[#F0EFEB] text-[#4A4A46] px-2 py-0.5 rounded font-mono font-medium">
                  {abhaProfile.gender}, {abhaProfile.age}y
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B4F8A] bg-[#EEF4F9] px-2 py-0.5 rounded-full border border-[#0B4F8A]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F8A]" />
                  ABHA: {abhaProfile.abhaAddress}
                </span>
              </div>
              <p className="text-xs text-[#73726C] mt-0.5">
                Chief Complaint: <strong className="text-[#111111] font-medium">{socratesCase.chiefComplaint}</strong> • Token #0247 (OPD Room 4B)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#73726C] bg-[#F5F4EF] px-3 py-1.5 rounded-lg border border-[#E2DFD8]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>FHIR R4 Gateway Connected</span>
          </div>

          <button
            onClick={onNavigateToKiosk}
            className="text-xs font-semibold text-[#4A4A46] hover:text-[#111111] bg-white hover:bg-[#F5F4EF] border border-[#E2DFD8] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <svg className="w-3.5 h-3.5 text-[#73726C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Patient Intake
          </button>
        </div>
      </div>

      {/* 40% / 60% Asymmetrical Split Layout */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left 40% Panel: SOCRATES Current Consult Matrix */}
        <div className="w-full lg:w-[40%] h-auto lg:h-full border-r border-[#E2DFD8] bg-[#FDFDFB] overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-5 flex-1">
            <SocratesConsultPanel
              socratesCase={socratesCase}
              profile={abhaProfile}
              onUpdateCase={handlePartialUpdate}
              onApproveAndPrescribe={handleApproveCase}
            />
          </div>
        </div>

        {/* Right 60% Panel: ABHA Longitudinal Health Journey */}
        <div className="w-full lg:w-[60%] h-auto lg:h-full bg-[#F9F9F6] overflow-y-auto custom-scrollbar flex flex-col">
          <div className="p-5 flex-1">
            <LongitudinalTimeline
              records={timelineRecords}
              patientName={abhaProfile.name}
            />
          </div>
        </div>
      </div>

      {/* Verified Record Modal after approval */}
      <VerifiedRecordModal
        socratesCase={socratesCase}
        profile={abhaProfile}
        isOpen={showVerifiedModal}
        onClose={() => setShowVerifiedModal(false)}
      />
    </div>
  );
};
