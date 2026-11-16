import React from 'react';
import { Mic, Keyboard, Globe, Shield, ArrowRight } from 'lucide-react';
import type { SupportedLanguage } from '../../types/clinical';

interface WelcomeScreenProps {
  selectedLanguage: SupportedLanguage;
  onChangeLanguage: () => void;
  onStartVoice: () => void;
  onUseTouch: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  selectedLanguage,
  onChangeLanguage,
  onStartVoice,
  onUseTouch,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 w-full">
      {/* Kiosk Top Bar */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#5E5B54] uppercase tracking-wider">Hospital OPD Intake</span>
          <span className="text-[#8A867C]">•</span>
          <span className="font-mono text-xs text-[#0D5C3A] font-semibold">Kiosk Terminal #04</span>
        </div>

        {/* Selected Language Indicator with quick tap */}
        <button
          onClick={onChangeLanguage}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded text-sm text-[#111111] transition-all group focus:outline-none"
        >
          <Globe className="w-4 h-4 text-[#0D5C3A]" />
          <span className="font-medium">{selectedLanguage.name}</span>
          <span className="font-mono text-[#5E5B54] text-xs">({selectedLanguage.nativeName})</span>
          <span className="text-xs text-[#8A867C] group-hover:text-[#111111] pl-1 font-mono">Change</span>
        </button>
      </div>

      {/* Main Kiosk Center Prompt */}
      <div className="my-auto py-10 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EBF4EE] text-[#0D5C3A] border border-[#0D5C3A]/20 rounded-full text-xs font-mono mb-6">
          <span>Multilingual Voice-First Intake</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] max-w-2xl leading-tight">
          Tell us what brings you here today.
        </h1>

        <p className="text-base sm:text-xl text-[#5E5B54] font-normal mt-4 max-w-xl">
          You can speak in your preferred language. You can also type or tap.
        </p>

        {/* Large Physical-feel Central Voice Trigger */}
        <div className="mt-10 sm:mt-12 flex flex-col items-center">
          <button
            onClick={onStartVoice}
            className="group relative flex flex-col items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#111111] hover:bg-[#0D5C3A] text-[#F5F3EE] shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#0D5C3A]/30 active:scale-95"
            aria-label="Start speaking"
          >
            <div className="absolute inset-0 rounded-full border-2 border-[#111111]/20 group-hover:border-[#0D5C3A]/40 animate-pulse-ring" />
            <Mic className="w-10 h-10 sm:w-12 sm:h-12 text-[#F5F3EE] mb-2 transition-transform group-hover:scale-110" />
            <span className="font-semibold text-sm sm:text-base tracking-tight">Start speaking</span>
            <span className="font-mono text-[10px] text-[#A6A298] group-hover:text-emerald-200 mt-0.5">
              in {selectedLanguage.name}
            </span>
          </button>
        </div>

        {/* Secondary Touch Option */}
        <div className="mt-8">
          <button
            onClick={onUseTouch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded border border-[#E2DFD8] bg-white hover:border-[#111111] text-[#111111] text-sm font-medium transition-colors"
          >
            <Keyboard className="w-4 h-4 text-[#5E5B54]" />
            <span>Use touch instead</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8A867C]" />
          </button>
        </div>
      </div>

      {/* Reassuring Doctor-in-Control Footer Note */}
      <div className="pt-6 border-t border-[#E2DFD8] flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-[#5E5B54]">
        <Shield className="w-4 h-4 text-[#0D5C3A] shrink-0" />
        <span>Your answers are reviewed by a doctor before clinical decisions are made.</span>
      </div>
    </div>
  );
};
