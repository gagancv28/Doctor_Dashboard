import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Printer,
  Code2,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';
import type { SocratesCase, AbhaProfile } from '../../types/socrates';

interface VerifiedRecordModalProps {
  socratesCase: SocratesCase;
  profile: AbhaProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const VerifiedRecordModal: React.FC<VerifiedRecordModalProps> = ({
  socratesCase,
  profile,
  isOpen,
  onClose,
}) => {
  const [showFhirJson, setShowFhirJson] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const fhirPayload = {
    resourceType: 'Bundle',
    id: `codescribe-fhir-${profile.abhaId}`,
    type: 'document',
    timestamp: new Date().toISOString(),
    entry: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'patient-0247',
          identifier: [{ system: 'https://healthid.ndhm.gov.in', value: profile.abhaAddress }],
          name: [{ text: profile.name }],
          gender: profile.gender.toLowerCase(),
          birthDate: profile.dob,
        },
      },
      {
        resource: {
          resourceType: 'Encounter',
          status: 'finished',
          class: { code: 'AMB', display: 'ambulatory' },
          reasonCode: [{ text: socratesCase.chiefComplaint }],
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { text: 'SOCRATES Pain Matrix' },
          component: [
            { code: { text: 'Site' }, valueString: socratesCase.site },
            { code: { text: 'Onset' }, valueString: socratesCase.onset },
            { code: { text: 'Character' }, valueString: socratesCase.character },
            { code: { text: 'Radiation' }, valueString: socratesCase.radiation },
            { code: { text: 'Severity' }, valueInteger: socratesCase.severity },
            { code: { text: 'Associations' }, valueString: socratesCase.associations.join(', ') },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-[#F9F9F6] border border-[#E2DFD8] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-white border-b border-[#E2DFD8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#111111]">Clinical Encounter Signed & Stamped</h3>
              <p className="text-xs text-[#5E5B54]">ABDM / ABHA Interoperable Clinical Artifact Generated</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8A867C] hover:text-[#111111] hover:bg-[#F5F4EF] rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="p-4 bg-white border border-[#E2DFD8] rounded-2xl space-y-3">
            <div className="flex justify-between border-b border-[#EAE7DE] pb-2">
              <span className="font-mono text-[#8A867C]">PATIENT</span>
              <span className="font-bold text-[#111111]">{profile.name} ({profile.abhaAddress})</span>
            </div>
            <div className="flex justify-between border-b border-[#EAE7DE] pb-2">
              <span className="font-mono text-[#8A867C]">ATTENDING PHYSICIAN</span>
              <span className="font-bold text-[#111111]">Dr. S. K. Narayan, MD (KMC #48291)</span>
            </div>
            <div className="flex justify-between border-b border-[#EAE7DE] pb-2">
              <span className="font-mono text-[#8A867C]">FACILITY</span>
              <span className="font-medium text-[#111111]">General Medicine OPD, City Hospital Bangalore</span>
            </div>
            <div className="flex justify-between border-b border-[#EAE7DE] pb-2">
              <span className="font-mono text-[#8A867C]">DIAGNOSIS</span>
              <span className="font-bold text-[#0B4F8A]">{socratesCase.chiefComplaint}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="font-mono text-[#8A867C]">ENCRYPTED HASH</span>
              <span className="font-mono text-[10px] text-[#5E5B54]">0x8f2a...94d2 (Aadhaar/ABDM e-Sign)</span>
            </div>
          </div>

          {/* FHIR Toggle button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFhirJson(!showFhirJson)}
              className="flex items-center gap-1.5 text-xs text-[#0B4F8A] font-semibold hover:underline"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{showFhirJson ? 'Hide HL7 FHIR R4 Bundle' : 'Inspect HL7 FHIR R4 Schema'}</span>
            </button>

            {showFhirJson && (
              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-[11px] text-[#5E5B54] hover:text-[#111111]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            )}
          </div>

          {showFhirJson && (
            <div className="bg-[#111111] text-emerald-400 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48 border border-black">
              <pre>{JSON.stringify(fhirPayload, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E2DFD8] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8A867C]">
            <ShieldCheck className="w-4 h-4 text-[#0B4F8A]" />
            <span>Transmitted to National Health Stack</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-2 bg-white border border-[#E2DFD8] hover:bg-[#F5F4EF] text-[#111111] font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Prescription</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#111111] hover:bg-[#222222] text-[#F9F9F6] font-semibold rounded-xl text-xs shadow-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
