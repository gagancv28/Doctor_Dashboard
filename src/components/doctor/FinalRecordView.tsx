import React, { useState } from 'react';
import type { PatientCase } from '../../types/clinical';
import { StatusBadge } from '../common/StatusBadge';
import {
  CheckCircle2,
  Printer,
  Code2,
  ArrowLeft,
  UserCheck,
  Copy,
  Check,
  Shield,
  PlusCircle,
  AlertCircle,
} from 'lucide-react';

interface FinalRecordViewProps {
  patient: PatientCase;
  onBackToDashboard: () => void;
  onResetDemo: () => void;
  onStartNewPatient?: () => void;
}

export const FinalRecordView: React.FC<FinalRecordViewProps> = ({
  patient,
  onBackToDashboard,
  onResetDemo,
  onStartNewPatient,
}) => {
  const [showFhirJson, setShowFhirJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showNewPatientConfirm, setShowNewPatientConfirm] = useState<boolean>(false);

  // Generate valid HL7 FHIR R4 Bundle structure
  const fhirPayload = {
    resourceType: 'Bundle',
    id: `codescribe-bundle-${patient.id}`,
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: [
      {
        fullUrl: `urn:uuid:patient-${patient.id}`,
        resource: {
          resourceType: 'Patient',
          id: patient.id,
          identifier: [
            {
              system: 'https://healthid.ndhm.gov.in',
              value: patient.abdmHealthId || 'lakshmi.gowda@abdm',
            },
          ],
          name: [{ text: patient.name }],
          gender: patient.sex.toLowerCase(),
          birthDate: '1992-04-12',
          telecom: [{ system: 'phone', value: '+91 98765 43210' }],
          communication: [
            {
              language: {
                coding: [
                  {
                    system: 'urn:ietf:bcp:47',
                    code: patient.languageCode || 'kn',
                    display: patient.language,
                  },
                ],
              },
              preferred: true,
            },
          ],
        },
      },
      {
        fullUrl: `urn:uuid:condition-${patient.id}-1`,
        resource: {
          resourceType: 'Condition',
          clinicalStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }],
          },
          verificationStatus: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/condition-ver-status',
                code: 'confirmed',
              },
            ],
          },
          code: {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '25064002',
                display: patient.chiefComplaint,
              },
            ],
            text: patient.chiefComplaint,
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          onsetDateTime: '2026-09-10T18:00:00+05:30',
          severity: {
            coding: [{ system: 'http://snomed.info/sct', code: '6736007', display: 'Moderate to severe' }],
          },
          note: [{ text: patient.hpi }],
        },
      },
      {
        fullUrl: `urn:uuid:encounter-${patient.id}`,
        resource: {
          resourceType: 'Encounter',
          status: 'finished',
          class: {
            system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
            code: 'AMB',
            display: 'ambulatory / OPD',
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          participant: [
            {
              individual: {
                display: patient.doctorName || 'Dr. S. K. Narayan, MD (Attending Physician)',
              },
            },
          ],
        },
      },
    ],
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(fhirPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 rounded hover:bg-[#EAE7DE] text-[#5E5B54] transition-colors focus:outline-none"
            title="Return to Doctor Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
                PATIENT CASE RECORD
              </h1>
              <StatusBadge type="doctor-verified" label="DOCTOR VERIFIED" />
            </div>
            <p className="text-xs text-[#5E5B54] font-mono mt-0.5">
              Record ID: REC-2026-OPD-{patient.displayId.replace('#', '')} • Verified at {patient.verifiedAt || '09:58 AM'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowFhirJson(!showFhirJson)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E2DFD8] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] transition-colors"
          >
            <Code2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
            <span>{showFhirJson ? 'Hide FHIR JSON' : 'View FHIR JSON'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#E2DFD8] bg-white text-xs font-mono text-[#111111] hover:border-[#111111] transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print Record</span>
          </button>

          {onStartNewPatient && (
            <button
              onClick={() => setShowNewPatientConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#111111] hover:bg-[#0D5C3A] text-white text-xs font-mono transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Patient</span>
            </button>
          )}
        </div>
      </div>

      {/* Optional FHIR JSON Viewer */}
      {showFhirJson && (
        <div className="bg-[#111111] text-emerald-300 p-4 sm:p-5 rounded-md font-mono text-xs overflow-x-auto relative border border-emerald-900/50">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800 text-gray-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              HL7 FHIR R4 Bundle Payload (ABDM Standard Specification)
            </span>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1 px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-[11px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="max-h-72 overflow-y-auto leading-relaxed">
            {JSON.stringify(fhirPayload, null, 2)}
          </pre>
        </div>
      )}

      {/* Main Clinical Document Paper */}
      <div className="bg-white border border-[#E2DFD8] rounded-md shadow-xs overflow-hidden">
        {/* Document Header */}
        <div className="p-6 bg-[#FAF9F6] border-b border-[#E2DFD8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#8A867C] uppercase tracking-widest">
              Standard Clinical Case Summary
            </div>
            <div className="text-xl font-bold text-[#111111] mt-0.5">
              {patient.name} ({patient.displayId})
            </div>
            <div className="text-xs text-[#5E5B54] mt-1 space-x-3">
              <span>Age: {patient.age}</span>
              <span>•</span>
              <span>Sex: {patient.sex}</span>
              <span>•</span>
              <span className="text-[#0D5C3A] font-medium">Language: {patient.language}</span>
              <span>•</span>
              <span>ABDM ID: {patient.abdmHealthId}</span>
            </div>
          </div>

          <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EAE7DE]">
            <div className="text-xs font-mono text-[#5E5B54]">Attending Physician</div>
            <div className="font-semibold text-sm text-[#111111]">
              {patient.doctorName || 'Dr. S. K. Narayan, MD'}
            </div>
            <div className="text-[11px] text-[#8A867C] font-mono">OPD Dept. of General Medicine</div>
          </div>
        </div>

        {/* Structured Clinical Sections */}
        <div className="p-6 sm:p-8 space-y-6 divide-y divide-[#EAE7DE]">
          {/* Section 1: Patient Information */}
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block">
              PATIENT INFORMATION
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
                <span className="font-mono text-[11px] text-[#8A867C] uppercase block">Age</span>
                <span className="text-sm font-semibold text-[#111111] mt-0.5 block">{patient.age} years</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
                <span className="font-mono text-[11px] text-[#8A867C] uppercase block">Sex</span>
                <span className="text-sm font-semibold text-[#111111] mt-0.5 block">{patient.sex}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
                <span className="font-mono text-[11px] text-[#8A867C] uppercase block">Language</span>
                <span className="text-sm font-semibold text-[#0D5C3A] mt-0.5 block">{patient.language}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
                <span className="font-mono text-[11px] text-[#8A867C] uppercase block">Patient ID</span>
                <span className="text-sm font-semibold font-mono text-[#111111] mt-0.5 block">{patient.displayId}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Chief Complaint & HPI */}
          <div className="pt-6 space-y-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54]">
                CHIEF COMPLAINT
              </span>
              <h3 className="text-xl font-bold text-[#111111] mt-1">
                {patient.chiefComplaint}
              </h3>
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block mb-1">
                HISTORY OF PRESENT ILLNESS
              </span>
              <p className="text-sm sm:text-base text-[#111111] leading-relaxed bg-[#FAF9F6] p-4 rounded border border-[#E2DFD8]">
                {patient.hpi}
              </p>
            </div>
          </div>

          {/* Section 3: Clinical Parameters */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A867C] block">
                Onset
              </span>
              <span className="text-sm font-semibold text-[#111111] mt-0.5 block">
                {patient.onset}
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A867C] block">
                Location
              </span>
              <span className="text-sm font-semibold text-[#111111] mt-0.5 block">
                {patient.location}
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A867C] block">
                Duration
              </span>
              <span className="text-sm font-semibold text-[#111111] mt-0.5 block">
                {patient.duration}
              </span>
            </div>

            <div className="p-3.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#8A867C] block">
                Severity Score
              </span>
              <span className="text-sm font-semibold font-mono text-[#111111] mt-0.5 block">
                {patient.severity} / 10
              </span>
            </div>
          </div>

          {/* Section 4: Associated Symptoms */}
          <div className="pt-6 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block">
              ASSOCIATED SYMPTOMS
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {patient.associatedSymptoms.map((symp, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded bg-[#EBF4EE] border border-[#0D5C3A]/20 text-[#0D5C3A] text-xs font-medium"
                >
                  {symp}
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Bilingual Spoken Source & Interpretation */}
          <div className="pt-6 space-y-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block">
                ORIGINAL PATIENT STATEMENT ({patient.language})
              </span>
              <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded mt-1.5">
                <p className="text-base sm:text-lg font-medium text-[#111111] leading-relaxed">
                  “{patient.rawTranscript}”
                </p>
              </div>
            </div>

            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#0D5C3A] block font-semibold">
                NORMALIZED INTERPRETATION (ENGLISH)
              </span>
              <div className="p-4 bg-[#EBF4EE] border border-[#0D5C3A]/20 rounded mt-1.5">
                <p className="text-sm sm:text-base text-[#111111] leading-relaxed">
                  “{patient.translatedTranscript}”
                </p>
              </div>
            </div>
          </div>

          {/* Section 6: Relevant History, Medications, Allergies */}
          <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block">
                Relevant History
              </span>
              <p className="text-xs text-[#111111] leading-relaxed">
                {patient.relevantHistory || 'No significant previous history recorded.'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block">
                Current Medications
              </span>
              <p className="text-xs text-[#111111] leading-relaxed">
                {patient.medications?.join(', ') || 'None recorded'}
              </p>
            </div>

            <div className="p-4 bg-[#FAF9F6] border border-[#E2DFD8] rounded space-y-1">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] block">
                Allergies
              </span>
              <p className="text-xs text-[#111111] leading-relaxed">
                {patient.allergies?.join(', ') || 'No Known Drug Allergies (NKDA)'}
              </p>
            </div>
          </div>

          {/* Section 7: Doctor Clinical Notes & Verdict */}
          <div className="pt-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54]">
                Doctor Clinical Notes & Verdict
              </span>
              <span className="font-mono text-[11px] text-[#0D5C3A] font-medium flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Doctor Reviewed & Verified
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#111111] bg-[#F5F3EE] p-4 rounded border border-[#E2DFD8] leading-relaxed font-sans">
              {patient.doctorNotes || 'Case reviewed and verified. Proceeding with standard outpatient supportive protocol.'}
            </p>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-t border-[#E2DFD8] text-[11px] text-[#5E5B54] flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#0D5C3A] shrink-0" />
          <span>
            AI-generated summaries assist documentation. Clinical decisions remain with the doctor.
          </span>
        </div>

        {/* Record Footer Status & ABDM / FHIR Verification */}
        <div className="p-4 sm:p-5 bg-[#FAF9F6] border-t border-[#E2DFD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#0D5C3A] font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Record status: DOCTOR VERIFIED</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#5E5B54]">
            <StatusBadge type="fhir" label="FHIR: READY FOR EXPORT" />
            <StatusBadge type="abdm-sandbox" label="ABDM: SANDBOX" />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#5E5B54] hover:text-[#111111] border border-[#E2DFD8] rounded bg-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Doctor Workspace</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetDemo}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono text-[#5E5B54] hover:text-[#111111] border border-[#E2DFD8] rounded bg-white"
          >
            <span>Reset Demo</span>
          </button>

          {onStartNewPatient && (
            <button
              onClick={() => setShowNewPatientConfirm(true)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-[#111111] text-[#F5F3EE] rounded hover:bg-[#0D5C3A] transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Start New Patient Case</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for New Patient */}
      {showNewPatientConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-md shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-amber-100 text-amber-900">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#111111]">Start a new patient case?</h3>
                <p className="text-xs text-[#5E5B54] mt-0.5">
                  This will archive the current case (#0247) and open a fresh patient intake kiosk.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2DFD8]">
              <button
                onClick={() => setShowNewPatientConfirm(false)}
                className="px-4 py-2 text-xs font-mono border border-[#E2DFD8] rounded bg-white hover:bg-[#FAF9F6] text-[#111111]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowNewPatientConfirm(false);
                  if (onStartNewPatient) onStartNewPatient();
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#111111] hover:bg-[#0D5C3A] text-white rounded transition-colors"
              >
                Start New Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
