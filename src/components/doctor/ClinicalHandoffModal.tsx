import React from 'react';
import {
  X,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  Mic,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Pill,
  History,
  Sparkles,
  Layers,
} from 'lucide-react';
import type { ClinicalHandoff } from '../../types/health';

interface ClinicalHandoffModalProps {
  isOpen: boolean;
  onClose: () => void;
  handoff: ClinicalHandoff | null;
  onStartConsultation: (handoff: ClinicalHandoff) => void;
  onViewOriginalStatement?: () => void;
}

export const ClinicalHandoffModal: React.FC<ClinicalHandoffModalProps> = ({
  isOpen,
  onClose,
  handoff,
  onStartConsultation,
  onViewOriginalStatement,
}) => {
  if (!isOpen || !handoff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* MODAL HEADER */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Clinical Handoff Packet
                </h2>
                <span className="font-mono text-xs text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-800">
                  {handoff.tokenNumber}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Handoff Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                First-mile structured clinical packet · {handoff.patientName} ({handoff.patientNumber})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-900 bg-slate-50">
          {/* DIGITAL HANDOFF COMPLETE NOTICE */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong className="font-bold">Digital Handoff Complete ✓</strong> — Patient intake completed digitally via {handoff.source}. No manual transcription required.
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-semibold px-2 py-0.5 rounded bg-white border border-emerald-200">
              ABDM Interoperable
            </span>
          </div>

          {/* PIPELINE PROGRESSION INDICATOR */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" /> Patient → Doctor Clinical Handoff Pipeline
            </span>
            <div className="flex items-center justify-between gap-1 text-[11px] overflow-x-auto py-1 font-semibold">
              <div className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                1. Patient Input ({handoff.inputMethod})
              </div>
              <span className="text-slate-300">→</span>
              <div className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                2. Structured Summary
              </div>
              <span className="text-slate-300">→</span>
              <div className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                3. OPD Queue ({handoff.tokenNumber})
              </div>
              <span className="text-slate-300">→</span>
              <div className="px-2 py-1 rounded bg-blue-600 text-white font-bold shrink-0 shadow-xs">
                4. Doctor Handoff
              </div>
              <span className="text-slate-300">→</span>
              <div className="px-2 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                5. Consultation & Rx
              </div>
            </div>
          </div>

          {/* TIMESTAMPS & PROVENANCE PIPELINE */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Patient Submitted</span>
              <div className="font-bold text-sm text-slate-900 font-mono">{handoff.submittedAt}</div>
              <span className="text-[10px] text-slate-500">{handoff.source}</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">AI Structured</span>
              <div className="font-bold text-sm text-cyan-700 font-mono">{handoff.aiStructuredAt}</div>
              <span className="text-[10px] text-cyan-600 font-semibold">NLP & Entity Extractor</span>
            </div>
            <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Doctor Received</span>
              <div className="font-bold text-sm text-blue-600 font-mono">{handoff.doctorReceivedAt}</div>
              <span className="text-[10px] text-blue-600 font-semibold">Ready in OPD Queue</span>
            </div>
          </div>

          {/* PATIENT IDENTITY & STATUS BAR */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Patient</span>
              <p className="font-bold text-slate-900 mt-0.5 text-sm">{handoff.patientName}</p>
              <span className="text-[11px] text-slate-500 font-mono">{handoff.patientNumber} · {handoff.age}y {handoff.gender}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Language & Input</span>
              <p className="font-bold text-blue-600 mt-0.5 text-sm">
                {handoff.language} ({handoff.languageNative})
              </p>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Mic className="w-3 h-3 text-cyan-600" /> {handoff.inputMethod} Input
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Priority Triage</span>
              <p className="mt-0.5">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-xs inline-block ${
                    handoff.priority === 'High'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : handoff.priority === 'Moderate'
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {handoff.priority} Priority
                </span>
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">ABHA & Consent</span>
              <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {handoff.abhaStatus} · {handoff.consentStatus}
              </p>
              <span className="text-[10px] text-slate-400">24hr OPD Authorization</span>
            </div>
          </div>

          {/* STRUCTURED CLINICAL FINDINGS */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-slate-900 border-b border-slate-200 pb-2">
              Structured Symptoms & Chief Complaint
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Chief Complaint</span>
                <p className="font-bold text-slate-900 mt-0.5">{handoff.chiefComplaint}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Duration</span>
                <p className="font-medium text-slate-900 mt-0.5">{handoff.duration}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Severity</span>
                <p className="font-bold text-amber-700 mt-0.5">{handoff.severity}/10 (Patient Reported)</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-400 text-[10px] font-mono uppercase font-bold">Associated Symptoms</span>
                <p className="font-medium text-slate-900 mt-0.5">{handoff.associatedSymptoms.join(', ')}</p>
              </div>
            </div>

            {/* Crisp Patient Summary Quote */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-600" /> Patient's Concise Clinical Summary
              </span>
              <blockquote className="p-3.5 rounded-lg bg-blue-50/50 border-l-3 border-blue-600 text-xs text-slate-900 font-medium italic leading-relaxed">
                “{handoff.conciseSummary}”
              </blockquote>
            </div>

            {/* Verbatim Original Statement */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-cyan-600" /> Original Verbatim Transcript ({handoff.language}):
                </span>
                {onViewOriginalStatement && (
                  <button
                    onClick={onViewOriginalStatement}
                    className="text-blue-600 hover:underline font-bold text-[11px] cursor-pointer"
                  >
                    Audio & Normalization View →
                  </button>
                )}
              </div>
              <p className="font-medium text-slate-800 italic bg-white p-2 rounded border border-slate-200">
                “{handoff.originalStatement.rawTranscript}”
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Normalized English:</strong> {handoff.originalStatement.translatedTranscript}
              </p>
            </div>
          </div>

          {/* SAFETY ALERTS, KNOWN ALLERGIES & CURRENT MEDICATIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Allergies */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Known Allergies
              </span>
              {handoff.knownAllergies.length > 0 ? (
                <div className="p-2 rounded bg-rose-50 border border-rose-200 text-rose-900 font-bold text-xs">
                  ⚠ {handoff.knownAllergies.join(', ')}
                </div>
              ) : (
                <div className="text-slate-400 italic text-xs">No allergies documented</div>
              )}
            </div>

            {/* Current Meds */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <Pill className="w-3.5 h-3.5 text-blue-600" /> Current Medications
              </span>
              <div className="space-y-1">
                {handoff.currentMedications.map((m, i) => (
                  <div key={i} className="p-1.5 rounded bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-800">
                    • {m}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RELEVANT PREVIOUS HISTORY */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 text-xs">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-600" /> Relevant Previous History
            </span>
            <p className="text-slate-600 leading-relaxed">{handoff.relevantPreviousHistory}</p>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close Packet
          </button>

          <button
            onClick={() => {
              onStartConsultation(handoff);
              onClose();
            }}
            className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Stethoscope className="w-4 h-4" /> Start Consultation (Carries Handoff) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
