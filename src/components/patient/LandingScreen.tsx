import React from 'react';
import { ArrowRight, Stethoscope, Mic, ShieldCheck, Languages, Sparkles } from 'lucide-react';
import { SignalVisualizer } from '../common/SignalVisualizer';

interface LandingScreenProps {
  onStartIntake: () => void;
  onViewDoctor: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartIntake, onViewDoctor }) => {
  return (
    <div className="flex-1 flex flex-col justify-between max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-16 w-full">
      {/* Top Tag */}
      <div className="flex flex-col items-start gap-2">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white border border-[#E2DFD8] rounded font-mono text-xs uppercase tracking-widest text-[#5E5B54]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A]" />
          CodeScribe AI / OPD Case-Taking
        </div>
      </div>

      {/* Main Hero Editorial */}
      <div className="my-10 sm:my-14 space-y-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111111] leading-[1.05] max-w-3xl">
          Let patients tell their story.
        </h1>

        <p className="text-lg sm:text-2xl text-[#5E5B54] font-normal leading-relaxed max-w-2xl">
          CodeScribe AI turns multilingual patient conversations into structured clinical histories for faster OPD consultations.
        </p>

        {/* 3D Waveform to Structure sculptural visual */}
        <div className="w-full bg-[#FAF9F6] border border-[#E2DFD8] rounded-md p-6 sm:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-[#8A867C] mb-4 pb-2 border-b border-[#EAE7DE]">
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#0D5C3A]" />
              Patient Natural Voice (12+ Languages)
            </span>
            <span className="hidden sm:inline text-[#B0ABA0]">───── Clinical Signal Extraction ─────▶</span>
            <span className="flex items-center gap-1.5 text-[#111111]">
              <Sparkles className="w-3.5 h-3.5 text-[#0D5C3A]" />
              Structured Case Summary (FHIR-ready)
            </span>
          </div>

          <SignalVisualizer variant="hero" className="w-full h-24 sm:h-28" />

          <div className="flex items-center justify-between text-[11px] font-mono text-[#8A867C] mt-3 pt-2 border-t border-[#EAE7DE]">
            <span>Kannada • Hindi • Bengali • Tamil • Telugu + 7 more</span>
            <span className="text-[#0D5C3A] font-medium">Doctor in Control</span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button
            onClick={onStartIntake}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-[#111111] text-[#F5F3EE] hover:bg-[#0D5C3A] transition-colors rounded text-base font-semibold tracking-tight shadow-sm group focus:outline-none focus:ring-2 focus:ring-[#111111]"
          >
            <span>Start Patient Intake</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onViewDoctor}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-transparent border border-[#111111]/20 hover:border-[#111111] text-[#111111] rounded text-base font-medium transition-colors focus:outline-none"
          >
            <Stethoscope className="w-4 h-4 text-[#0D5C3A]" />
            <span>View Doctor Dashboard</span>
          </button>
        </div>
      </div>

      {/* Understated bottom facts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#E2DFD8]">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-[#E2DFD8] text-[#0D5C3A]">
            <Languages className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm text-[#111111]">12+ Indian languages</div>
            <div className="text-xs text-[#5E5B54] mt-0.5">Spoken vernacular with exact script preservation</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-[#E2DFD8] text-[#0D5C3A]">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm text-[#111111]">Voice + touch</div>
            <div className="text-xs text-[#5E5B54] mt-0.5">Dual-mode kiosk interface built for hospital OPDs</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded bg-white border border-[#E2DFD8] text-[#0D5C3A]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm text-[#111111]">Doctor-in-control workflow</div>
            <div className="text-xs text-[#5E5B54] mt-0.5">AI structures history; doctor reviews and approves</div>
          </div>
        </div>
      </div>
    </div>
  );
};
