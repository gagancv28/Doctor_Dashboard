import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  AlertTriangle,
  Loader2,
  X,
  Sparkles,
  CheckCircle2,
  Check,
} from 'lucide-react';
import type { VaultDocument } from '../../types/health';

interface DocumentVaultScreenProps {
  documents: VaultDocument[];
  onAddDocument: (doc: VaultDocument) => void;
}

export const DocumentVaultScreen: React.FC<DocumentVaultScreenProps> = ({
  documents,
  onAddDocument,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [activeOcrModalDoc, setActiveOcrModalDoc] = useState<VaultDocument | null>(null);
  const [isVerifiedByHuman, setIsVerifiedByHuman] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Documents (14)' },
    { id: 'prescriptions', label: 'Prescriptions' },
    { id: 'labs', label: 'Lab Reports' },
    { id: 'discharge', label: 'Discharge Summaries' },
    { id: 'imaging', label: 'Imaging & Scans' },
    { id: 'ayush', label: 'Ayush Records' },
  ];

  const filteredDocs =
    selectedCategory === 'all'
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(1);

    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev < 4) return prev + 1;
        clearInterval(timer);
        setTimeout(() => {
          setIsUploading(false);
          const newDoc: VaultDocument = {
            id: `doc-new-${Date.now()}`,
            title: 'OPD Prescription — City Care Hospital',
            category: 'prescriptions',
            date: 'Today, 11 Sep 2026',
            facility: 'City Care Hospital, Bangalore',
            doctor: 'Dr. Sharma, MD',
            fileSize: '1.2 MB • Scanned Document',
            fileType: 'Prescription PDF',
            ocrProcessed: true,
            ocrExtraction: {
              medications: [
                {
                  name: 'Tab. Paracetamol',
                  dosage: '500 mg',
                  frequency: 'Twice daily after food',
                  timing: 'SOS (As needed)',
                  confidence: 98,
                },
                {
                  name: 'Tab. Domperidone',
                  dosage: '10 mg',
                  frequency: 'Once daily before breakfast',
                  timing: 'OD (Morning)',
                  confidence: 94,
                },
              ],
              notes: 'Patient advised rest in dim room and adequate oral fluids. Follow-up in 3 days if symptoms persist.',
              doctorName: 'Dr. Sharma, MD',
              facilityName: 'City Care Hospital',
              date: '11 Sep 2026',
              confidenceAverage: 96,
              isVerifiedByPatient: false,
            },
          };
          onAddDocument(newDoc);
          setActiveOcrModalDoc(newDoc);
          setIsVerifiedByHuman(false);
        }, 500);
        return prev;
      });
    }, 450);
  };

  const uploadSteps = [
    'Document uploaded & preprocessed',
    'Vision OCR extracting handwriting & text',
    'Clinical entities, medicines & dosages structured',
    'Side-by-side verification view prepared',
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <span className="font-mono text-xs text-[#0D5C3A] font-semibold uppercase tracking-wider block">
            Encrypted Document Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Medical Documents & Scans
          </h1>
          <p className="text-xs text-[#5E5B54] mt-0.5">
            DigiLocker & ABDM-compatible document vault with AI Vision OCR extraction and human verification.
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Prescription / Report</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((c) => {
          const isSelected = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors focus:outline-none ${
                isSelected
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-[#E2DFD8] text-[#5E5B54] hover:text-[#111111]'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Upload & Vision OCR Progress Overlay */}
      {isUploading && (
        <div className="p-5 bg-white border-2 border-[#0D5C3A]/40 rounded-2xl space-y-3 shadow-md animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-[#111111]">
            <Loader2 className="w-4 h-4 animate-spin text-[#0D5C3A]" />
            <span>Processing document with CodeScribe Vision OCR…</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {uploadSteps.map((st, i) => {
              const isDone = i < uploadProgress;
              const isCurrent = i === uploadProgress;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 ${
                    isDone
                      ? 'text-[#0D5C3A] font-semibold'
                      : isCurrent
                      ? 'text-[#111111] font-bold'
                      : 'text-[#8A867C]'
                  }`}
                >
                  <span className="text-[11px] font-mono">{isDone ? '✓' : '•'}</span>
                  <span>{st}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Documents Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-2xl flex flex-col justify-between gap-4 transition-all shadow-xs"
          >
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] text-[#0D5C3A] shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="font-bold text-sm text-[#111111] leading-tight">
                  {doc.title}
                </div>
                <div className="text-xs text-[#5E5B54]">
                  {doc.facility} • {doc.date}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#8A867C] pt-0.5">
                  <span>{doc.fileSize}</span>
                  <span>•</span>
                  <span className="text-[#0D5C3A] font-semibold">
                    OCR Confidence {doc.ocrExtraction?.confidenceAverage || 94}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#EAE7DE] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8A867C] uppercase">
                {doc.fileType}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveOcrModalDoc(doc);
                    setIsVerifiedByHuman(!!doc.ocrExtraction?.isVerifiedByPatient);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#EBF4EE] hover:bg-[#D5EAD9] text-[#0D5C3A] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>OCR Side-by-Side</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SIDE-BY-SIDE OCR VERIFICATION MODAL */}
      {activeOcrModalDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#E2DFD8] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#EBF4EE] text-[#0D5C3A]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#111111]">
                    Side-by-Side OCR Extraction & Human Verification
                  </h3>
                  <p className="text-xs text-[#5E5B54]">
                    AI Vision OCR extracted data displayed beside original scanned prescription.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveOcrModalDoc(null)}
                className="p-1.5 rounded-full hover:bg-[#EAE7DE] text-[#5E5B54]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SIDE-BY-SIDE GRID */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* LEFT: Original Scanned Document */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-bold text-[#5E5B54]">
                    1. Original Scanned Document
                  </span>
                  <span className="font-mono text-[10px] text-[#8A867C]">200 DPI Optical Scan</span>
                </div>

                <div className="p-5 bg-white border-2 border-dashed border-[#D1CEC5] rounded-2xl space-y-4 font-mono shadow-inner min-h-[360px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-center font-bold pb-2 border-b border-[#E2DFD8] text-[#111111]">
                      {activeOcrModalDoc.facility}
                      <div className="text-[10px] text-[#8A867C] font-normal">OPD CLINICAL PRESCRIPTION</div>
                    </div>

                    <div className="text-[11px] text-[#333333] space-y-1">
                      <div>Patient: Lakshmi Gowda | 34 / F</div>
                      <div>Date: {activeOcrModalDoc.date}</div>
                      <div>Doctor: {activeOcrModalDoc.doctor || 'Dr. Sharma, MD'}</div>
                    </div>

                    <div className="pt-4 border-t border-[#EAE7DE] text-[#222222] space-y-2">
                      <div className="font-bold text-xs">Rx (Prescribed Medications):</div>
                      {activeOcrModalDoc.ocrExtraction?.medications.map((m, i) => (
                        <div key={i} className="pl-2 border-l-2 border-[#0D5C3A]/40">
                          <div>• {m.name} — {m.dosage}</div>
                          <div className="text-[10px] text-[#666666]">Sig: {m.frequency} ({m.timing})</div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 text-[11px] text-[#555555]">
                      Notes: {activeOcrModalDoc.ocrExtraction?.notes}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#EAE7DE] flex items-center justify-between text-[10px] text-[#8A867C]">
                    <span>Original Document Authenticated</span>
                    <span>Signed by Doctor ✓</span>
                  </div>
                </div>
              </div>

              {/* RIGHT: AI Extracted & Structured Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase font-bold text-[#0D5C3A]">
                    2. AI Extracted Structured Data
                  </span>
                  <span className="font-mono text-[10px] bg-[#EBF4EE] text-[#0D5C3A] px-2 py-0.5 rounded font-bold">
                    {activeOcrModalDoc.ocrExtraction?.confidenceAverage}% Confidence
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Extracted Fields */}
                  <div className="p-4 bg-white border border-[#E2DFD8] rounded-xl space-y-2.5">
                    <span className="font-mono text-[10px] uppercase text-[#8A867C] font-bold block">
                      Digitized Prescription Items
                    </span>

                    {activeOcrModalDoc.ocrExtraction?.medications.map((m, i) => (
                      <div
                        key={i}
                        className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-[#111111]">
                            {m.name} <span className="text-[#0D5C3A]">({m.dosage})</span>
                          </div>
                          <div className="text-[11px] text-[#5E5B54]">{m.frequency} • {m.timing}</div>
                        </div>
                        <span className="font-mono text-[10px] bg-[#EBF4EE] text-[#0D5C3A] px-2 py-0.5 rounded font-semibold">
                          {m.confidence}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Doctor & Facility Extracted */}
                  <div className="p-3.5 bg-white border border-[#E2DFD8] rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#8A867C]">Prescribing Doctor:</span>
                      <span className="font-bold text-[#111111]">{activeOcrModalDoc.doctor || 'Dr. Sharma, MD'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#8A867C]">Facility:</span>
                      <span className="font-semibold text-[#111111]">{activeOcrModalDoc.facility}</span>
                    </div>
                  </div>

                  {/* Safety Notice */}
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      OCR output is never treated as automatically correct. Review against original document before committing to medication records.
                    </span>
                  </div>

                  {/* Verification CTA */}
                  <button
                    onClick={() => setIsVerifiedByHuman(true)}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isVerifiedByHuman
                        ? 'bg-[#EBF4EE] text-[#0D5C3A] border-2 border-[#0D5C3A]'
                        : 'bg-[#0D5C3A] hover:bg-[#08482A] text-white'
                    }`}
                  >
                    {isVerifiedByHuman ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Extracted Information Verified by Patient ✓</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Verify Extracted Information</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-[#E2DFD8] flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#8A867C]">
                ABDM Document Reference: {activeOcrModalDoc.id}
              </span>
              <button
                onClick={() => setActiveOcrModalDoc(null)}
                className="px-5 py-2 bg-[#111111] text-white rounded-xl text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
