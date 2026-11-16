import React from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import type { AppViewMode, HealthIdentity } from '../../types/health';

interface TopBarProps {
  currentMode: AppViewMode;
  onSelectMode: (mode: AppViewMode) => void;
  identity: HealthIdentity;
  onResetDemo: () => void;
  onToggleTour: () => void;
  tourOpen: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentMode,
  onSelectMode,
  identity,
  onResetDemo,
  onToggleTour,
  tourOpen,
}) => {
  return (
    <header className="w-full bg-[#FAF9F6] border-b border-[#E2DFD8] px-3 sm:px-6 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sticky top-0 z-40 shadow-xs">
      {/* Brand & Subtitle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#0D5C3A] text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
            <HeartPulse className="w-5 h-5 text-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#111111]">
                CodeScribe Health
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] border border-[#0D5C3A]/20 rounded font-bold">
                SIH26047 • Ayush
              </span>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-[#F0EFEB] text-[#5E5B54] border border-[#E2DFD8] rounded font-medium">
                Clinical Portal
              </span>
            </div>
            <div className="text-[11px] text-[#5E5B54] flex items-center gap-1.5 truncate">
              <span className="hidden md:inline italic">“Your health history. Wherever you go.”</span>
              <span className="hidden md:inline text-[#8A867C]">•</span>
              <span className="font-mono text-[10px] text-[#0D5C3A] font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#0D5C3A]" /> ABHA: {identity.abhaAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Mobile-only Tour button */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={onToggleTour}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
              tourOpen ? 'bg-[#0D5C3A] text-white border-[#0D5C3A]' : 'bg-white border-[#E2DFD8] text-[#111111]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher & Actions */}
      <div className="flex items-center justify-between md:justify-end gap-2 overflow-x-auto no-scrollbar">
        {/* Three Distinct Interfaces Switcher for Demo */}
        <div className="flex items-center bg-[#EAE7DE] p-1 rounded-xl border border-[#DDD9CE] shadow-inner shrink-0 gap-1">
          <button
            onClick={() => onSelectMode('patient')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'patient'
                ? 'bg-white text-[#111111] shadow-xs ring-1 ring-black/5 font-bold'
                : 'text-[#5E5B54] hover:text-[#111111]'
            }`}
          >
            <span>📱 Patient App</span>
          </button>

          <button
            onClick={() => onSelectMode('doctor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'doctor'
                ? 'bg-white text-[#111111] shadow-xs ring-1 ring-[#0D5C3A]/30 font-bold'
                : 'text-[#5E5B54] hover:text-[#111111]'
            }`}
          >
            <span>🖥️ Doctor Dashboard</span>
          </button>

          <button
            onClick={() => onSelectMode('kiosk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentMode === 'kiosk'
                ? 'bg-white text-[#111111] shadow-xs ring-1 ring-black/5 font-bold'
                : 'text-[#5E5B54] hover:text-[#111111]'
            }`}
          >
            <span>🏥 Hospital Kiosk</span>
          </button>
        </div>

        {/* Demo Tour Guide Toggle */}
        <button
          onClick={onToggleTour}
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            tourOpen
              ? 'bg-[#0D5C3A] text-white border-[#0D5C3A] shadow-xs'
              : 'bg-white border-[#E2DFD8] text-[#111111] hover:border-[#111111]'
          }`}
          title="Interactive Demo Walkthrough for SIH Judges"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Demo Story Tour</span>
        </button>

        {/* Reset Demo */}
        <button
          onClick={onResetDemo}
          title="Reset Demo State"
          className="p-2 rounded-xl text-[#7A766C] hover:text-[#111111] hover:bg-[#EAE7DE] border border-transparent hover:border-[#DDD9CE] transition-all shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
