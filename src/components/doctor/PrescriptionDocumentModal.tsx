import React, { useState } from 'react';
import { X, Printer, Download, CheckCircle2, Pill, Check } from 'lucide-react';
import type { PrescriptionRecord } from '../../types/health';
import { pdfService } from '../../services/pdfService';

interface PrescriptionDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: PrescriptionRecord | null;
}

export const PrescriptionDocumentModal: React.FC<PrescriptionDocumentModalProps> = ({
  isOpen,
  onClose,
  prescription,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  if (!isOpen || !prescription) return null;

  const handleExportPDF = () => {
    pdfService.exportPrescriptionPDF(prescription);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const cleanPatientId = prescription.patientId.replace(/^#/, '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Clinical Prescription Document</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  {prescription.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Prescription #{prescription.id} · {prescription.date}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Document Paper */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6 bg-slate-50">
          <div id="printable-prescription-sheet" className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6 text-slate-900">
            {/* Hospital & Doctor Header */}
            <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-base font-extrabold uppercase tracking-wide text-slate-900">
                  {prescription.facility}
                </h2>
                <div className="text-xs text-slate-600 font-medium">
                  {prescription.department} · Hassan, Karnataka
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  ABDM Facility ID: IN-KA-HSSN-GGH-01 · OPD Unit #104
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-slate-900">{prescription.doctorName}</div>
                <div className="text-xs text-blue-600 font-semibold">Senior Attending Physician</div>
                <div className="text-[11px] font-mono text-slate-500">
                  Reg: {prescription.doctorRegistration || '#KMC-48291'}
                </div>
              </div>
            </div>

            {/* Patient Info Row */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase font-bold">Patient Name</span>
                <span className="font-bold text-slate-900">{prescription.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase font-bold">Patient ID</span>
                <span className="font-mono font-bold text-blue-600">#{cleanPatientId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-mono uppercase font-bold">Prescription Date</span>
                <span className="font-medium text-slate-900">{prescription.date}, {prescription.time || '10:52 AM'}</span>
              </div>
            </div>

            {/* Rx Symbol & Medication List */}
            <div className="space-y-4">
              <div className="text-2xl font-serif font-black text-blue-600 border-b border-slate-200 pb-1">
                ℞
              </div>

              <div className="space-y-3">
                {prescription.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900">
                        {index + 1}. Tab. {item.medicine} {item.dose}
                      </div>
                      <div className="text-slate-600 font-medium">
                        Dosage: <strong className="text-slate-900">{item.frequency}</strong> for{' '}
                        <strong className="text-slate-900">{item.duration}</strong> ({item.route || 'Oral'})
                      </div>
                      {item.instructions && (
                        <div className="text-blue-700 text-[11px] font-semibold">
                          Instructions: {item.instructions}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                      Active Rx
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Clinical Advice */}
            {prescription.additionalAdvice && (
              <div className="space-y-1 border-t border-slate-200 pt-3 text-xs">
                <span className="font-bold text-slate-900">General Advice & Precautions:</span>
                <p className="text-slate-600 leading-relaxed">{prescription.additionalAdvice}</p>
              </div>
            )}

            {/* Follow-up Date */}
            {prescription.followUpDate && (
              <div className="text-xs text-slate-900 flex items-center gap-2">
                <strong>Review / Follow-up:</strong>
                <span className="font-mono font-bold text-blue-600">{prescription.followUpDate}</span>
              </div>
            )}

            {/* Verification Stamp & Signature */}
            <div className="border-t-2 border-slate-900 pt-4 flex items-end justify-between">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-0.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Doctor Verified Digitally
                </div>
                <div className="text-[11px] text-slate-600 font-mono">
                  Verified by: {prescription.doctorName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Timestamp: {prescription.verifiedAt || `${prescription.date}, 10:52 AM`}
                </div>
              </div>

              <div className="text-right">
                <div className="font-serif italic font-bold text-sm text-blue-600">
                  {prescription.doctorName}
                </div>
                <div className="text-[11px] text-slate-500">Attending Physician Signature</div>
                <div className="text-[10px] font-mono text-slate-400">Government General Hospital</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex justify-between items-center shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" /> Print Prescription
            </button>
            <button
              onClick={handleExportPDF}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {downloadSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : <Download className="w-4 h-4" />}
              {downloadSuccess ? 'PDF Downloaded ✓' : 'Export PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
