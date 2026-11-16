import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { SupportedLanguage } from '../../types/clinical';

interface FollowUpQuestionsProps {
  selectedLanguage: SupportedLanguage;
  onComplete: (data: {
    onset: string;
    severity: number;
    associatedSymptoms: string[];
  }) => void;
  onBack: () => void;
}

export const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  selectedLanguage,
  onComplete,
  onBack,
}) => {
  // Step 1: Onset, Step 2: Severity (1-10), Step 3: Associated Symptoms
  const [subStep, setSubStep] = useState<number>(1);

  const [onset, setOnset] = useState<string>('Yesterday evening');
  const [severity, setSeverity] = useState<number>(7);
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([
    'Light sensitivity (Photophobia)',
    'Nausea',
  ]);

  const onsetOptions = [
    { label: 'Yesterday evening', hint: '~12-16 hours ago' },
    { label: '2–3 days ago', hint: 'Subacute' },
    { label: 'More than a week ago', hint: 'Chronic / Persistent' },
    { label: 'I’m not sure / Gradual', hint: 'Indeterminate onset' },
  ];

  const symptomOptions = [
    { id: 'nausea', label: 'Nausea / Upset stomach' },
    { id: 'vomiting', label: 'Vomiting' },
    { id: 'photophobia', label: 'Light sensitivity (Photophobia)' },
    { id: 'blurred-vision', label: 'Blurred vision' },
    { id: 'fever', label: 'Fever / High temperature' },
    { id: 'neck-stiffness', label: 'Neck stiffness' },
    { id: 'none', label: 'None of these' },
  ];

  const toggleSymptom = (label: string) => {
    if (label === 'None of these') {
      setAssociatedSymptoms(['None of these']);
      return;
    }
    const filtered = associatedSymptoms.filter((s) => s !== 'None of these');
    if (filtered.includes(label)) {
      setAssociatedSymptoms(filtered.filter((s) => s !== label));
    } else {
      setAssociatedSymptoms([...filtered, label]);
    }
  };

  const handleNext = () => {
    if (subStep < 3) {
      setSubStep(subStep + 1);
    } else {
      onComplete({
        onset,
        severity,
        associatedSymptoms:
          associatedSymptoms.length > 0 ? associatedSymptoms : ['None of these'],
      });
    }
  };

  const handlePrevious = () => {
    if (subStep > 1) {
      setSubStep(subStep - 1);
    } else {
      onBack();
    }
  };

  const stepLabels = ['02 / 04', '03 / 04', '04 / 04'];
  const stepTitles = ['Onset & Timeline', 'Severity Assessment', 'Associated Symptoms'];

  return (
    <div className="flex-1 flex flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full">
      {/* Top Progress */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-[#111111]">CLINICAL INTAKE</span>
          <span className="font-mono text-xs text-[#8A867C]">{stepLabels[subStep - 1]}</span>
          <span className="text-[#8A867C]">•</span>
          <span className="font-mono text-xs text-[#5E5B54]">{stepTitles[subStep - 1]}</span>
        </div>
        <div className="font-mono text-xs text-[#0D5C3A] font-medium">
          Language: {selectedLanguage.name}
        </div>
      </div>

      {/* Main Question Area */}
      <div className="my-auto py-6 sm:py-8 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0D5C3A] font-medium">
            Clinical History Structuring
          </span>
          <p className="text-xs sm:text-sm text-[#5E5B54] mt-0.5">
            A few quick questions so we can understand your symptoms better.
          </p>
        </div>

        {/* SUBSTEP 1: ONSET */}
        {subStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              “When did the headache start?”
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {onsetOptions.map((opt) => {
                const isSelected = onset === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setOnset(opt.label)}
                    className={`text-left p-4 rounded border transition-all flex items-center justify-between focus:outline-none ${
                      isSelected
                        ? 'border-[#0D5C3A] bg-[#EBF4EE] ring-1 ring-[#0D5C3A]'
                        : 'border-[#E2DFD8] bg-white hover:border-[#111111]'
                    }`}
                  >
                    <div>
                      <div className={`font-semibold text-base ${isSelected ? 'text-[#0D5C3A]' : 'text-[#111111]'}`}>
                        {opt.label}
                      </div>
                      <div className="text-xs text-[#5E5B54] mt-0.5">{opt.hint}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBSTEP 2: SEVERITY (1-10 SCALE) */}
        {subStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                “How severe is it right now?”
              </h2>
              <p className="text-xs sm:text-sm text-[#5E5B54] mt-1">
                Select from 1 (very mild) to 10 (worst pain imaginable).
              </p>
            </div>

            <div className="bg-white border border-[#E2DFD8] rounded-md p-6 sm:p-8 space-y-6">
              {/* Big visual number display */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-[#8A867C] uppercase tracking-wider">Pain Score</span>
                  <div className="text-4xl sm:text-5xl font-bold font-mono text-[#111111] mt-0.5">
                    {severity} <span className="text-xl text-[#8A867C]">/ 10</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs uppercase px-2.5 py-1 rounded bg-[#EAE7DE] text-[#111111] font-semibold">
                    {severity >= 8 ? 'Severe / Urgent' : severity >= 5 ? 'Moderate to Severe' : 'Mild'}
                  </span>
                </div>
              </div>

              {/* Number buttons grid 1 to 10 */}
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                  const isSelected = severity === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setSeverity(num)}
                      className={`h-14 rounded flex flex-col items-center justify-center font-mono font-bold text-lg transition-all focus:outline-none ${
                        isSelected
                          ? 'bg-[#0D5C3A] text-white shadow-sm ring-2 ring-[#0D5C3A]/40 scale-105'
                          : 'bg-[#F5F3EE] border border-[#E2DFD8] text-[#111111] hover:border-[#111111]'
                      }`}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#8A867C] pt-2">
                <span>1 — Barely noticeable</span>
                <span>5 — Moderate</span>
                <span>10 — Unbearable</span>
              </div>
            </div>
          </div>
        )}

        {/* SUBSTEP 3: ASSOCIATED SYMPTOMS */}
        {subStep === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
                “Do you have any of these symptoms?”
              </h2>
              <p className="text-xs sm:text-sm text-[#5E5B54] mt-1">
                Select all that apply to help doctor triage your case.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {symptomOptions.map((item) => {
                const isChecked = associatedSymptoms.includes(item.label);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleSymptom(item.label)}
                    className={`text-left p-3.5 rounded border transition-all flex items-center justify-between focus:outline-none ${
                      isChecked
                        ? 'border-[#0D5C3A] bg-[#EBF4EE] ring-1 ring-[#0D5C3A]'
                        : 'border-[#E2DFD8] bg-white hover:border-[#111111]'
                    }`}
                  >
                    <span className={`text-sm font-medium ${isChecked ? 'text-[#0D5C3A]' : 'text-[#111111]'}`}>
                      {item.label}
                    </span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked
                          ? 'border-[#0D5C3A] bg-[#0D5C3A] text-white'
                          : 'border-[#C8C4BA] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="pt-6 border-t border-[#E2DFD8] flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5E5B54] hover:text-[#111111] transition-colors focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[#111111] hover:bg-[#0D5C3A] text-[#F5F3EE] font-semibold text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D5C3A]"
        >
          <span>{subStep === 3 ? 'Review Structured Summary' : 'Next Question'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
