import React from 'react';
import { X, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import type { PatientCase } from '../../types/clinical';

interface PrescriptionOCRModalProps {
  patient: PatientCase;
  isOpen: boolean;
  onClose: () => void;
  onApplyToCase?: () => void;
}

export const PrescriptionOCRModal: React.FC<PrescriptionOCRModalProps> = ({
  patient,
  isOpen,
  onClose,
  onApplyToCase,
}) => {
  if (!isOpen) return null;

  const rx = patient.previousPrescription;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-md shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E2DFD8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#EBF4EE] text-[#0D5C3A]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#111111]">Previous Prescription OCR Extraction</h3>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Vision OCR Sandbox
                </span>
              </div>
              <p className="text-xs text-[#5E5B54]">
                {patient.displayId} • {patient.name} • Scanned document dated {rx?.date || '14 Feb 2026'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#EAE7DE] text-[#5E5B54] hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Side-by-side Prescription Image & Digitized Extraction */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-y-auto divide-y md:divide-y-0 md:divide-x divide-[#E2DFD8]">
          {/* Left: Scanned Prescription Representation */}
          <div className="p-5 bg-[#F5F3EE] flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#5E5B54]">
              <span>ORIGINAL SCANNED DOCUMENT</span>
              <span>300 DPI SCAN</span>
            </div>

            {/* Realistic Prescription Pad Layout */}
            <div className="bg-white p-5 rounded border border-[#DDD9CE] shadow-xs space-y-4 font-serif text-[#1F2937] text-xs">
              <div className="border-b border-gray-300 pb-3 flex justify-between items-start">
                <div>
                  <div className="font-bold font-sans text-sm text-[#111111] tracking-tight">
                    {rx?.hospital || 'DISTRICT HOSPITAL OPD'}
                  </div>
                  <div className="text-[11px] text-gray-600 font-sans">{rx?.doctorName || 'Dr. V. Rao, MD'}</div>
                  <div className="text-[10px] text-gray-500 font-mono">Reg No: KMC-48291</div>
                </div>
                <div className="text-right font-mono text-[10px] text-gray-500">
                  <div>Date: {rx?.date}</div>
                  <div>OPD No: 9142</div>
                </div>
              </div>

              <div className="text-[11px] border-b border-gray-200 pb-2 font-sans flex justify-between">
                <span>Pt: {patient.name} ({patient.age}y / {patient.sex})</span>
                <span>BP: 120/80 mmHg</span>
              </div>

              {/* Hand-drawn style Rx symbol & medication items */}
              <div className="py-2 space-y-3">
                <div className="text-xl font-bold font-serif text-[#0D5C3A]">℞</div>
                <div className="space-y-2.5 pl-3 border-l-2 border-emerald-900/20 italic font-mono text-xs text-gray-800">
                  <div>
                    1. Tab. Paracetamol 500mg ── 1 tab SOS (post meals) × 3 days
                  </div>
                  <div>
                    2. Tab. Domperidone 10mg ── 1 tab OD (ac) × 3 days
                  </div>
                  <div>
                    3. Cap. Omeprazole 20mg ── 1 cap OD (empty stomach) × 5 days
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200 text-[10px] font-sans text-gray-500 italic">
                Notes: {rx?.rawNotes}
              </div>
            </div>

            <div className="text-[11px] text-[#8A867C] font-mono text-center">
              Scanned via Kiosk Flatbed Scanner / Mobile Lens
            </div>
          </div>

          {/* Right: Digitized OCR Structured Interpretation */}
          <div className="p-5 bg-white flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#0D5C3A] font-semibold">DIGITIZED CLINICAL MEDICATION LIST</span>
                <span className="text-[#5E5B54]">High Confidence (94% avg)</span>
              </div>

              {/* OCR Items List */}
              <div className="space-y-2.5">
                {rx?.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#111111] flex items-center gap-2">
                        <span>{item.name}</span>
                        <span className="font-mono text-xs px-1.5 py-0.5 bg-[#EAE7DE] rounded text-[#5E5B54]">
                          {item.dosage}
                        </span>
                      </div>
                      <div className="text-xs text-[#5E5B54] mt-1 space-x-2">
                        <span>{item.frequency}</span>
                        <span>•</span>
                        <span className="text-[#0D5C3A] font-medium">{item.timing}</span>
                        <span>•</span>
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {item.confidence}% OCR
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Doctor safety notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded flex items-start gap-2 text-xs text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">OCR extraction — verify against original document</span>
                  <span>
                    Clinician must cross-check handwriting before adding legacy prescriptions into current therapeutic regimen.
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#E2DFD8] flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#E2DFD8] text-xs font-mono rounded hover:bg-[#FAF9F6]"
              >
                Close
              </button>
              {onApplyToCase && (
                <button
                  onClick={() => {
                    onApplyToCase();
                    onClose();
                  }}
                  className="flex items-center gap-2 px-5 py-2 bg-[#0D5C3A] text-white text-xs font-semibold rounded hover:bg-[#09472C] transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Import Verified Meds into HPI</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
