import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import type { SocratesCase } from '../../types/socrates';

interface SocratesQuestionsProps {
  socratesCase: SocratesCase;
  onComplete: (updated: Partial<SocratesCase>) => void;
  onBack: () => void;
}

export const SocratesQuestions: React.FC<SocratesQuestionsProps> = ({
  socratesCase,
  onComplete,
  onBack,
}) => {
  const [stepIndex, setStepIndex] = useState<number>(0);

  // SOCRATES state
  const [site, setSite] = useState<string>(socratesCase.site);
  const [onset, setOnset] = useState<string>(socratesCase.onset);
  const [character, setCharacter] = useState<string>(socratesCase.character);
  const [radiation, setRadiation] = useState<string>(socratesCase.radiation);
  const [severity, setSeverity] = useState<number>(socratesCase.severity);
  const [associations, setAssociations] = useState<string[]>(socratesCase.associations);

  const steps = [
    {
      label: 'Site & Radiation',
      acronym: 'S • R',
      question: 'Where is the pain located and does it spread?',
      render: () => (
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#0B4F8A] uppercase font-bold">Location (Site)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Right temporal & frontoparietal region',
                'Left hemicranial / temple',
                'Bilateral band-like across forehead',
                'Occipital & posterior neck',
              ].map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSite(loc)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    site === loc
                      ? 'bg-[#EEF4F9] border-[#0B4F8A] text-[#0B4F8A] font-semibold'
                      : 'bg-white border-[#E2DFD8] text-[#111111] hover:bg-[#F5F4EF]'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="font-mono text-[10px] text-[#0B4F8A] uppercase font-bold">Radiation / Spreading</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Radiates to right retro-orbital space and ipsilateral neck',
                'Radiates down both shoulders',
                'No radiation (strictly localized)',
                'Spreads across whole top of head',
              ].map((rad) => (
                <button
                  key={rad}
                  onClick={() => setRadiation(rad)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    radiation === rad
                      ? 'bg-[#EEF4F9] border-[#0B4F8A] text-[#0B4F8A] font-semibold'
                      : 'bg-white border-[#E2DFD8] text-[#111111] hover:bg-[#F5F4EF]'
                  }`}
                >
                  {rad}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Character & Onset',
      acronym: 'C • O',
      question: 'What does the pain feel like, and how did it begin?',
      render: () => (
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-[#0B4F8A] uppercase font-bold">Pain Character</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Severe throbbing, pulsating vascular ache',
                'Sharp, stabbing, electric sensation',
                'Dull, persistent constricting band',
                'Burning or gnawing discomfort',
              ].map((c) => (
                <button
                  key={c}
                  onClick={() => setCharacter(c)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    character === c
                      ? 'bg-[#EEF4F9] border-[#0B4F8A] text-[#0B4F8A] font-semibold'
                      : 'bg-white border-[#E2DFD8] text-[#111111] hover:bg-[#F5F4EF]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="font-mono text-[10px] text-[#0B4F8A] uppercase font-bold">Onset & Timing</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                'Started 4 days ago, worsening each morning upon waking',
                'Sudden thunderclap onset 2 hours ago',
                'Gradual build-up over the last 3 weeks',
                'Intermittent episodes for 2 months',
              ].map((o) => (
                <button
                  key={o}
                  onClick={() => setOnset(o)}
                  className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
                    onset === o
                      ? 'bg-[#EEF4F9] border-[#0B4F8A] text-[#0B4F8A] font-semibold'
                      : 'bg-white border-[#E2DFD8] text-[#111111] hover:bg-[#F5F4EF]'
                  }`}
                >
                  {o}
                </button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      label: 'Severity Scale (1-10)',
      acronym: 'S',
      question: 'How intense is the pain right now?',
      render: () => (
        <div className="space-y-6 py-4">
          <div className="text-center space-y-1">
            <span className="text-5xl font-black text-[#111111] tracking-tight">{severity} / 10</span>
            <p className="text-xs text-[#5E5B54] font-medium">
              {severity >= 8 ? 'Severe / Disruptive to daily activities' : severity >= 5 ? 'Moderate pain' : 'Mild discomfort'}
            </p>
          </div>

          <div className="flex items-center justify-between gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setSeverity(num)}
                className={`flex-1 py-3.5 rounded-xl border text-sm font-bold transition-all ${
                  severity === num
                    ? 'bg-[#0B4F8A] border-[#0B4F8A] text-[#F9F9F6] scale-105 shadow-md'
                    : 'bg-white border-[#E2DFD8] text-[#111111] hover:bg-[#F5F4EF]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-[11px] text-[#8A867C] font-mono">
            <span>1 = Barely Noticeable</span>
            <span>5 = Moderate Discomfort</span>
            <span>10 = Unbearable Pain</span>
          </div>
        </div>
      ),
    },
    {
      label: 'Associated Symptoms',
      acronym: 'A',
      question: 'Are you experiencing any accompanying signs?',
      render: () => (
        <div className="space-y-3">
          {[
            'Marked Photophobia (Light sensitivity)',
            'Phonophobia (Sound sensitivity)',
            'Nausea & Epigastric Queasiness',
            'Visual Zig-zag Aura / Scintillating Scotoma',
            'Dizziness / Vertigo',
            'Neck Stiffness',
          ].map((item) => {
            const isSelected = associations.includes(item);
            return (
              <button
                key={item}
                onClick={() => {
                  if (isSelected) {
                    setAssociations(associations.filter((x) => x !== item));
                  } else {
                    setAssociations([...associations, item]);
                  }
                }}
                className={`w-full p-3.5 text-left rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#EEF4F9] border-[#0B4F8A] text-[#0B4F8A] font-semibold'
                    : 'bg-white border-[#E2DFD8] text-[#111111] hover:bg-[#F5F4EF]'
                }`}
              >
                <span>{item}</span>
                {isSelected && <Check className="w-4 h-4 text-[#0B4F8A]" />}
              </button>
            );
          })}
        </div>
      ),
    },
  ];

  const handleNextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      onComplete({
        site,
        onset,
        character,
        radiation,
        severity,
        associations,
      });
    }
  };

  const currentStep = steps[stepIndex];

  return (
    <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full p-6 sm:p-10">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#0B4F8A] font-bold">
            SOCRATES CLINICAL TRIAGE • STEP {stepIndex + 1} OF {steps.length}
          </span>
          <span className="text-[#8A867C]">•</span>
          <span className="font-mono text-xs text-[#5E5B54]">{currentStep.label}</span>
        </div>
        <span className="font-mono text-xs bg-[#F5F4EF] px-2 py-0.5 rounded border border-[#E2DFD8] font-bold text-[#0B4F8A]">
          {currentStep.acronym}
        </span>
      </div>

      {/* Main Question Body */}
      <div className="my-auto py-6 space-y-6">
        <div>
          <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider block">
            Focused Assessment
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] mt-1 leading-tight">
            {currentStep.question}
          </h1>
        </div>

        {/* Dynamic step renderer */}
        {currentStep.render()}
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-[#E2DFD8] flex items-center justify-between">
        <button
          onClick={() => {
            if (stepIndex === 0) onBack();
            else setStepIndex(stepIndex - 1);
          }}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#5E5B54] hover:text-[#111111] px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNextStep}
          className="px-6 py-3 bg-[#0B4F8A] hover:bg-[#093D6B] text-[#F9F9F6] text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <span>{stepIndex === steps.length - 1 ? 'Review Structured Case' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
