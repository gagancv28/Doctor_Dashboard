import React, { useState } from 'react';
import {
  X,
  Stethoscope,
  Pill,
  Activity,
  FileText,
  ShieldCheck,
  Eye,
} from 'lucide-react';
import type { HealthRecord } from '../../types/health';

interface RecordDetailModalProps {
  record: HealthRecord | null;
  onClose: () => void;
  onShareRecord?: (record: HealthRecord) => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({
  record,
  onClose,
}) => {
  const [showOriginalDoc, setShowOriginalDoc] = useState<boolean>(false);

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E2DFD8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center text-[#0D5C3A] shrink-0">
              {record.category === 'consultation' ? (
                <Stethoscope className="w-5 h-5" />
              ) : record.category === 'prescription' ? (
                <Pill className="w-5 h-5" />
              ) : (
                <Activity className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#111111] tracking-tight">
                  {record.title}
                </h2>
                {record.isNewCodeScribeEntry && (
                  <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-[#0D5C3A] text-white rounded font-bold">
                    CodeScribe AI
                  </span>
                )}
              </div>
              <div className="text-xs text-[#5E5B54] flex items-center gap-2">
                <span>{record.facility}</span>
                <span>•</span>
                <span className="font-mono">{record.displayDate}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#EAE7DE] text-[#5E5B54] hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs">
          {/* Source Verification Badge */}
          <div className="p-3 bg-[#EBF4EE] border border-[#0D5C3A]/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0D5C3A] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Source: {record.source}</span>
            </div>
            <span className="font-mono text-[10px] text-[#0D5C3A] bg-white px-2 py-0.5 rounded font-bold border border-[#0D5C3A]/20">
              Doctor Verified ✓
            </span>
          </div>

          {/* Visit Information Grid */}
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-4 space-y-3">
            <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
              Visit Information
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[#8A867C] block text-[10px]">Date of Visit</span>
                <span className="font-mono font-bold text-[#111111]">{record.displayDate}</span>
              </div>
              <div>
                <span className="text-[#8A867C] block text-[10px]">Hospital / Facility</span>
                <span className="font-semibold text-[#111111]">{record.facility}</span>
              </div>
              <div>
                <span className="text-[#8A867C] block text-[10px]">Attending Physician</span>
                <span className="font-semibold text-[#111111]">{record.doctor || 'OPD Physician'}</span>
              </div>
              <div>
                <span className="text-[#8A867C] block text-[10px]">Department</span>
                <span className="font-semibold text-[#111111]">{record.department || 'General OPD'}</span>
              </div>
            </div>
          </div>

          {/* Reason for Visit & Symptoms */}
          <div className="bg-white border border-[#E2DFD8] rounded-xl p-4 space-y-3">
            <div className="space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
                Reason for Visit / Chief Complaint
              </span>
              <div className="font-bold text-sm text-[#111111]">
                {record.chiefComplaint || record.title}
              </div>
            </div>

            {record.details?.hpi && (
              <div className="space-y-1 pt-2 border-t border-[#EAE7DE]">
                <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
                  History of Present Illness (HPI)
                </span>
                <p className="text-xs text-[#5E5B54] leading-relaxed">
                  {record.details.hpi}
                </p>
              </div>
            )}

            {record.clinicalObservations && (
              <div className="space-y-1 pt-2 border-t border-[#EAE7DE]">
                <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
                  Clinical Observations & Vitals
                </span>
                <p className="text-xs text-[#5E5B54] leading-relaxed">
                  {record.clinicalObservations}
                </p>
              </div>
            )}

            {record.diagnosis && (
              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-lg space-y-0.5">
                <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold block">
                  Diagnosis / Clinical Impression
                </span>
                <div className="font-bold text-xs text-[#111111]">{record.diagnosis}</div>
              </div>
            )}
          </div>

          {/* Medications Prescribed */}
          {record.details?.medications && record.details.medications.length > 0 && (
            <div className="bg-white border border-[#E2DFD8] rounded-xl p-4 space-y-3">
              <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
                Prescribed Medications
              </span>

              <div className="space-y-2">
                {record.details.medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-xs text-[#111111]">
                        {med.name} <span className="text-[#0D5C3A]">({med.dosage})</span>
                      </div>
                      <div className="text-[11px] text-[#5E5B54] mt-0.5">
                        {med.frequency} • Route: {med.route || 'Oral'}
                      </div>
                      <div className="text-[10px] text-[#8A867C]">
                        Duration: {med.startDate} → {med.endDate || 'Current'}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-[9px] px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] font-semibold rounded block">
                        {med.status}
                      </span>
                      <span className="text-[10px] text-[#8A867C] block mt-0.5">
                        By {med.prescribedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagnostic & Lab Results */}
          {record.details?.labResults && record.details.labResults.length > 0 && (
            <div className="bg-white border border-[#E2DFD8] rounded-xl p-4 space-y-3">
              <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
                Lab Diagnostic Parameters
              </span>

              <div className="space-y-1.5">
                {record.details.labResults.map((lr, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-[#111111]">{lr.test}</div>
                      <div className="text-[10px] text-[#8A867C]">Ref Range: {lr.normalRange}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-[#111111]">{lr.result}</span>
                      <span className="font-mono text-[9px] text-[#0D5C3A] bg-[#EBF4EE] px-1.5 py-0.2 rounded ml-2">
                        {lr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Treatment Outcome */}
          {record.treatmentOutcome && (
            <div className="p-3.5 bg-white border border-[#E2DFD8] rounded-xl space-y-1">
              <span className="font-mono text-[10px] uppercase text-[#0D5C3A] font-bold block">
                Treatment Outcome & Clinical Progress
              </span>
              <p className="text-xs text-[#111111] leading-relaxed">
                “{record.treatmentOutcome}”
              </p>
            </div>
          )}

          {/* Source Document Preview Button */}
          <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-[#0D5C3A]" />
              <div>
                <div className="font-semibold text-xs text-[#111111]">
                  {record.originalDocumentName || 'Scanned_Clinical_Document.pdf'}
                </div>
                <div className="text-[10px] text-[#8A867C]">
                  Original hospital source record • Verified by ABDM Node
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowOriginalDoc(!showOriginalDoc)}
              className="px-3 py-1.5 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-lg text-xs font-mono font-semibold text-[#111111] flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#0D5C3A]" />
              <span>{showOriginalDoc ? 'Hide Document' : 'View Document'}</span>
            </button>
          </div>

          {/* Scanned Document Viewer Simulation */}
          {showOriginalDoc && (
            <div className="p-4 bg-white border border-[#0D5C3A]/30 rounded-xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-[#EAE7DE] pb-2">
                <span className="font-mono text-[10px] uppercase text-[#8A867C]">Original Hospital Scan</span>
                <span className="font-mono text-[10px] text-[#0D5C3A]">200 DPI Digitized</span>
              </div>
              <div className="bg-[#FAF9F6] p-6 rounded-lg border border-[#E2DFD8] font-mono text-[11px] text-[#333333] space-y-2">
                <div className="text-center font-bold pb-2 border-b border-[#DDD9CE]">
                  {record.facility} • CLINICAL CASE SHEET
                </div>
                <div>PATIENT: Lakshmi Gowda | AGE: 34/F | DATE: {record.displayDate}</div>
                <div>ATTENDING: {record.doctor || 'Dr. Sharma, MD'}</div>
                <div className="pt-2 text-[#555555]">
                  Rx: {record.summary}
                </div>
                <div className="text-right text-[10px] text-[#888888] pt-4">
                  Signed & Verified: {record.doctor || 'Medical Officer'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-[#E2DFD8] flex items-center justify-between">
          <div className="text-[11px] text-[#8A867C] font-mono">
            Record ID: {record.id}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
};
