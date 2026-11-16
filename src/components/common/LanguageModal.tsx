import React from 'react';
import { X, Check, Globe } from 'lucide-react';
import type { SupportedLanguage } from '../../types/clinical';
import { SUPPORTED_LANGUAGES } from '../../mock/patientData';

interface LanguageModalProps {
  isOpen: boolean;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onClose: () => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  currentLanguage,
  onSelectLanguage,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-md shadow-xl max-w-xl w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0D5C3A]" />
            <h3 className="font-bold text-base text-[#111111]">Select Speaking Language</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#EAE7DE] text-[#5E5B54]">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage.id === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => {
                  onSelectLanguage(lang);
                  onClose();
                }}
                className={`p-3 rounded border text-left flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#0D5C3A] bg-[#EBF4EE] ring-1 ring-[#0D5C3A]'
                    : 'border-[#E2DFD8] bg-white hover:border-[#111111]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-base ${isSelected ? 'text-[#0D5C3A]' : 'text-[#111111]'}`}>
                    {lang.nativeName}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#0D5C3A]" />}
                </div>
                <span className="text-xs text-[#5E5B54] mt-1">{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
