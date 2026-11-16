import React from 'react';
import { X, ExternalLink, ShieldCheck, Database, FileText, Mic, CheckCircle2 } from 'lucide-react';
import type { HealthRecord } from '../../types/health';

interface SourceTraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: HealthRecord[];
  onOpenRecord?: (record: HealthRecord) => void;
}

export const SourceTraceabilityModal: React.FC<SourceTraceabilityModalProps> = ({
  isOpen,
  onClose,
  timeline,
  onOpenRecord,
}) => {
  if (!isOpen) return null;

  const sources = [
    {
      id: 'src-voice',
      type: 'Patient Voice Intake',
      title: 'Current Visit Voice Statement',
      facility: 'Patient App — Remote Intake',
      date: 'Today, 11 Sep 2026 (10:20 AM)',
      doctor: 'Self-Reported by Lakshmi Gowda',
      contribution: 'Provided right-sided headache location, photophobia trigger, onset since yesterday evening, and severity 7/10.',
      icon: <Mic className="w-4 h-4 text-[#0D5C3A]" />,
      verified: true,
    },
    {
      id: 'src-rec-03',
      type: 'Clinical Consultation Record',
      title: 'Tension Headache Review (OPD Visit #2026-0812)',
      facility: 'Government General Hospital — Hassan',
      date: '12 Aug 2026',
      doctor: 'Dr. Sharma, MD',
      contribution: 'Confirmed previous treatment with Paracetamol 500mg SOS and symptom resolution after 5 days.',
      icon: <FileText className="w-4 h-4 text-[#0D5C3A]" />,
      recordId: 'rec-03',
      verified: true,
    },
    {
      id: 'src-rec-02',
      type: 'Hospital OPD & Lab Record',
      title: 'Headache with Nausea Evaluation',
      facility: 'City Care Hospital — Bangalore',
      date: '04 Jul 2026',
      doctor: 'Dr. Arvind Rao, MD',
      contribution: 'Documented previous nausea association, Domperidone prescription, Normal CBC lab, and verified Penicillin allergy flag.',
      icon: <Database className="w-4 h-4 text-[#0D5C3A]" />,
      recordId: 'rec-02',
      verified: true,
    },
    {
      id: 'src-rec-01',
      type: 'Specialty Clinic Note',
      title: 'Initial Migraine Episode Assessment',
      facility: 'Private Specialty Clinic — Hassan',
      date: '18 Mar 2026',
      doctor: 'Dr. K. Raghavan, DM (Neurology)',
      contribution: 'Established baseline first-onset date of episodic unilateral right headache in March 2026.',
      icon: <FileText className="w-4 h-4 text-[#0D5C3A]" />,
      recordId: 'rec-01',
      verified: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2DFD8] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE7DE] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D5C3A]/10 text-[#0D5C3A] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#111111]">Clinical Summary Source Traceability</h3>
              <p className="text-xs text-[#5E5B54] font-mono">
                Lineage & Provenance for AI Longitudinal Summary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#EAE7DE] flex items-center justify-center text-[#5E5B54] hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#0D5C3A] shrink-0 mt-0.5" />
            <p className="text-xs text-[#5E5B54] leading-relaxed">
              <strong className="text-[#111111]">Clinical Safety & Integrity Rule:</strong> The Clinical Continuity Summary synthesizes verified historical encounters across linked facilities. The system acts strictly as decision-support software and does not autonomously diagnose or formulate treatment plans without doctor verification.
            </p>
          </div>

          <div className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono pt-1">
            Linked Source Records ({sources.length})
          </div>

          <div className="space-y-3">
            {sources.map((src, index) => {
              const matchingRecord = timeline.find((r) => r.id === src.recordId);
              return (
                <div
                  key={src.id}
                  className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] hover:border-[#C5C1B6] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white border border-[#E2DFD8] flex items-center justify-center text-xs font-bold text-[#0D5C3A]">
                        {index + 1}
                      </div>
                      <span className="text-xs font-bold text-[#111111]">{src.title}</span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#0D5C3A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Source Verified
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#5E5B54] pt-1 border-t border-[#EAE7DE]">
                    <div>
                      <span className="text-[#8A867C]">Facility:</span> <span className="text-[#111111] font-medium">{src.facility}</span>
                    </div>
                    <div>
                      <span className="text-[#8A867C]">Date:</span> <span className="text-[#111111] font-medium">{src.date}</span>
                    </div>
                    <div>
                      <span className="text-[#8A867C]">Clinician:</span> <span className="text-[#111111] font-medium">{src.doctor}</span>
                    </div>
                    <div>
                      <span className="text-[#8A867C]">Type:</span> <span className="text-[#111111] font-medium">{src.type}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-[#EAE7DE] text-xs text-[#5E5B54]">
                    <span className="font-semibold text-[#111111]">Information Contributed: </span>
                    {src.contribution}
                  </div>

                  {matchingRecord && onOpenRecord && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          onClose();
                          onOpenRecord(matchingRecord);
                        }}
                        className="text-xs text-[#0D5C3A] hover:underline font-semibold flex items-center gap-1"
                      >
                        View Full Clinical Encounter <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#EAE7DE] bg-[#FAF9F6] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-[#2A2926] transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
