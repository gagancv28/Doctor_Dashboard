import React, { useState } from 'react';
import type { SupportedLanguage } from '../../types/clinical';
import { SUPPORTED_LANGUAGES } from '../../mock/patientData';
import { Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface LanguageSelectProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onBack: () => void;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  currentLanguage,
  onSelectLanguage,
  onBack,
}) => {
  const [selected, setSelected] = useState<SupportedLanguage>(currentLanguage);

  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-12 w-full">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5E5B54] hover:text-[#111111] transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <div className="font-mono text-xs text-[#8A867C]">12 Official Indian Languages</div>
      </div>

      {/* Main Content */}
      <div className="my-auto py-6 sm:py-8">
        <div className="max-w-2xl mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] leading-tight">
            Which language are you most comfortable speaking?
          </h1>
          <p className="text-sm sm:text-base text-[#5E5B54] mt-2">
            You can speak naturally in your mother tongue. You can change this anytime during intake.
          </p>
        </div>

        {/* 12-Language Minimal Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selected.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setSelected(lang)}
                className={`text-left p-3.5 rounded border transition-all relative flex flex-col justify-between min-h-[82px] focus:outline-none focus:ring-1 focus:ring-[#0D5C3A] ${
                  isSelected
                    ? 'border-[#0D5C3A] bg-[#EBF4EE] ring-1 ring-[#0D5C3A]'
                    : 'border-[#E2DFD8] bg-white hover:border-[#111111] hover:bg-[#FAF9F6]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`font-semibold text-lg sm:text-xl leading-none ${
                      isSelected ? 'text-[#0D5C3A]' : 'text-[#111111]'
                    }`}
                  >
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#EAE7DE]">
                  <span className="text-xs text-[#5E5B54]">{lang.name}</span>
                  <span className="font-mono text-[10px] text-[#8A867C] uppercase">{lang.id}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-6 border-t border-[#E2DFD8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-[#8A867C] font-mono order-2 sm:order-1">
          You can change this later.
        </span>

        <button
          onClick={() => onSelectLanguage(selected)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#0D5C3A] text-[#F5F3EE] font-semibold text-sm rounded transition-colors order-1 sm:order-2 focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]"
        >
          <span>Continue in {selected.name}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
