import React, { useState } from 'react';
import type { AppView, SupportedLanguage, RecordStatus } from '../../types/clinical';
import { RotateCcw, Stethoscope, User, Globe, PlusCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentView: AppView;
  recordStatus: RecordStatus;
  onNavigate: (view: AppView) => void;
  selectedLanguage: SupportedLanguage;
  onOpenLanguageModal?: () => void;
  onResetDemo: () => void;
  onStartNewPatient: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  recordStatus,
  onNavigate,
  selectedLanguage,
  onOpenLanguageModal,
  onResetDemo,
  onStartNewPatient,
}) => {
  const [showNewPatientConfirm, setShowNewPatientConfirm] = useState<boolean>(false);

  const isPatientMode = currentView.startsWith('patient') || currentView === 'landing';
  const isDoctorMode = currentView.startsWith('doctor') || currentView === 'final-record';

  // Calculate workflow stage index (1 to 5)
  // 01 Patient (welcome, lang, voice)
  // 02 Symptoms (followup)
  // 03 Review (patient-review, structuring)
  // 04 Doctor (doctor-dashboard)
  // 05 Verified (final-record)
  const getStageIndex = (): number => {
    if (recordStatus === 'verified' || currentView === 'final-record') return 5;
    if (currentView === 'doctor-dashboard') return 4;
    if (currentView === 'patient-review' || currentView === 'patient-structuring') return 3;
    if (currentView === 'patient-followup') return 2;
    return 1;
  };

  const activeStage = getStageIndex();

  const stages = [
    { num: '01', label: 'Patient' },
    { num: '02', label: 'Symptoms' },
    { num: '03', label: 'Review' },
    { num: '04', label: 'Doctor' },
    { num: '05', label: 'Verified' },
  ];

  return (
    <header className="w-full bg-[#F5F3EE] border-b border-[#E2DFD8] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('landing')}
            className="text-left group flex items-center gap-2.5 focus:outline-none focus:ring-1 focus:ring-[#111111] p-1 rounded"
          >
            <div className="w-7 h-7 rounded bg-[#111111] text-[#F5F3EE] flex items-center justify-center font-bold text-xs tracking-tighter">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-tight text-[#111111] leading-none">
                CodeScribe AI
              </span>
              <span className="font-mono text-[10px] tracking-widest text-[#5E5B54] uppercase mt-0.5">
                OPD Case-Taking
              </span>
            </div>
          </button>

          {/* Workflow Progress Indicator (Editorial & Subtle) */}
          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-[#E2DFD8] font-mono text-[11px]">
            {stages.map((st, idx) => {
              const stageNum = idx + 1;
              const isPast = stageNum < activeStage;
              const isCurrent = stageNum === activeStage;

              return (
                <div key={st.num} className="flex items-center gap-1.5">
                  <span
                    className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                      isCurrent
                        ? 'bg-[#111111] text-white font-bold'
                        : isPast
                        ? 'bg-[#EBF4EE] text-[#0D5C3A] font-medium'
                        : 'text-[#8A867C]'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-3 h-3 text-[#0D5C3A]" />
                    ) : (
                      <span>{st.num}</span>
                    )}
                    <span className="tracking-tight">{st.label}</span>
                  </span>
                  {idx < stages.length - 1 && (
                    <span className="text-[#C8C4BA]">›</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Active Language Chip */}
          {onOpenLanguageModal && isPatientMode && currentView !== 'landing' && (
            <button
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FAF9F6] border border-[#E2DFD8] rounded text-xs text-[#111111] hover:border-[#111111] transition-colors focus:outline-none"
              title="Change speaking language"
            >
              <Globe className="w-3.5 h-3.5 text-[#0D5C3A]" />
              <span className="font-medium">{selectedLanguage.name}</span>
              <span className="font-mono text-[#5E5B54] text-[11px]">({selectedLanguage.nativeName})</span>
            </button>
          )}

          {/* Subtle Presenter Mode Switcher */}
          <div className="flex items-center bg-[#EAE7DE] p-0.5 rounded border border-[#DDD9CE]">
            <button
              onClick={() => {
                if (recordStatus === 'verified' || currentView === 'final-record') {
                  onNavigate('patient-review');
                } else {
                  onNavigate('patient-welcome');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
                isPatientMode
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#5E5B54] hover:text-[#111111]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient Kiosk</span>
            </button>
            <button
              onClick={() => {
                if (recordStatus === 'verified') {
                  onNavigate('final-record');
                } else {
                  onNavigate('doctor-dashboard');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
                isDoctorMode
                  ? 'bg-white text-[#111111] shadow-xs'
                  : 'text-[#5E5B54] hover:text-[#111111]'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor Workstation</span>
            </button>
          </div>

          {/* Explicit "New Patient" Button (with confirmation) */}
          <button
            onClick={() => setShowNewPatientConfirm(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#111111] hover:bg-[#EAE7DE] border border-[#DDD9CE] rounded transition-colors focus:outline-none"
            title="Start a new patient intake"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#0D5C3A]" />
            <span>New Patient</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-[#5E5B54] hover:text-[#111111] hover:bg-[#EAE7DE] rounded transition-colors focus:outline-none"
            title="Reset to initial clean demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for New Patient */}
      {showNewPatientConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-md shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-100 text-amber-900">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#111111]">Start a new patient case?</h3>
                <p className="text-xs text-[#5E5B54] mt-0.5">
                  This will archive the current case and open a fresh patient intake kiosk.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2DFD8]">
              <button
                onClick={() => setShowNewPatientConfirm(false)}
                className="px-4 py-2 text-xs font-mono border border-[#E2DFD8] rounded bg-white hover:bg-[#FAF9F6] text-[#111111]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewPatientConfirm(false);
                  onStartNewPatient();
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#111111] hover:bg-[#0D5C3A] text-white rounded transition-colors"
              >
                Start New Case
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
