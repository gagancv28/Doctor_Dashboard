import React from 'react';
import { Stethoscope, User, ShieldCheck, RotateCcw } from 'lucide-react';
import type { AppMode, AbhaProfile } from '../../types/socrates';

interface HeaderNavProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  profile: AbhaProfile;
  onResetDemo: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentMode,
  onSelectMode,
  profile,
  onResetDemo,
}) => {
  return (
    <header className="w-full bg-[#F9F9F6] border-b border-[#E2DFD8] px-4 sm:px-8 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-[#111111] text-[#F9F9F6] flex items-center justify-center font-bold text-xs tracking-tight shadow-xs">
          CS
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-[#111111]">
              CodeScribe AI
            </span>
            <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[#EEF4F9] text-[#0B4F8A] border border-[#0B4F8A]/20 rounded font-semibold">
              OPD Clinical Engine
            </span>
          </div>
          <div className="text-[11px] text-[#5E5B54] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[#0B4F8A]" />
            <span>ABHA: {profile.abhaAddress}</span>
            <span className="text-[#8A867C]">•</span>
            <span>{profile.name} (Pt #0247)</span>
          </div>
        </div>
      </div>

      {/* Center/Right Controls: Mode Switcher & Reset */}
      <div className="flex items-center gap-3">
        {/* Subtle Mode Switcher (Patient Kiosk vs Doctor Dashboard) */}
        <div className="flex items-center bg-[#EAE7DE] p-0.5 rounded-lg border border-[#DDD9CE] shadow-inner">
          <button
            onClick={() => onSelectMode('patient-kiosk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentMode === 'patient-kiosk'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#5E5B54] hover:text-[#111111]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Patient Kiosk (Intake)</span>
          </button>

          <button
            onClick={() => onSelectMode('doctor-dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              currentMode === 'doctor-dashboard'
                ? 'bg-white text-[#111111] shadow-xs'
                : 'text-[#5E5B54] hover:text-[#111111]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-[#0B4F8A]" />
            <span>Doctor Dashboard (40/60 View)</span>
          </button>
        </div>

        {/* Reset Demo Button */}
        <button
          onClick={onResetDemo}
          title="Reset Interactive Prototype"
          className="p-1.5 rounded-lg text-[#7A766C] hover:text-[#111111] hover:bg-[#EAE7DE] border border-transparent hover:border-[#DDD9CE] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
