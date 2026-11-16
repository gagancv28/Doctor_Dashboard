import React, { useState } from 'react';
import {
  X,
  QrCode,
  Search,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import type { HealthIdentity, ConsentGrant } from '../../types/health';

interface AbhaScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPatientIdentified: (patientId: string) => void;
  identity: HealthIdentity;
  consent?: ConsentGrant;
}

export const AbhaScanModal: React.FC<AbhaScanModalProps> = ({
  isOpen,
  onClose,
  onPatientIdentified,
  identity,
}) => {
  const [step, setStep] = useState<'search' | 'consent' | 'success'>('search');
  const [searchMethod, setSearchMethod] = useState<'qr' | 'abha' | 'id' | 'name'>('qr');
  const [searchValue, setSearchValue] = useState<string>('lakshmi.gowda@abdm');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleUseDemoPatient = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setStep('consent');
    }, 800);
  };

  const handleGrantConsentAndView = () => {
    setStep('success');
    setTimeout(() => {
      onPatientIdentified('patient-0247');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2DFD8] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE7DE] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D5C3A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#111111]">ABHA Patient Identification</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#0D5C3A] font-bold">
                  ABDM Sandbox
                </span>
              </div>
              <p className="text-xs text-[#5E5B54]">
                Ayushman Bharat Digital Mission (ABDM) Prototype / Sandbox
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STEP 1: SEARCH / SCAN */}
          {step === 'search' && (
            <div className="space-y-5">
              {/* Method Switcher Tabs */}
              <div className="flex p-1 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setSearchMethod('qr')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    searchMethod === 'qr'
                      ? 'bg-white text-[#0D5C3A] font-bold shadow-xs'
                      : 'text-[#5E5B54] hover:text-[#111111]'
                  }`}
                >
                  <QrCode className="w-3.5 h-3.5" /> Scan QR
                </button>
                <button
                  onClick={() => setSearchMethod('abha')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    searchMethod === 'abha'
                      ? 'bg-white text-[#0D5C3A] font-bold shadow-xs'
                      : 'text-[#5E5B54] hover:text-[#111111]'
                  }`}
                >
                  ABHA Address
                </button>
                <button
                  onClick={() => setSearchMethod('id')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    searchMethod === 'id'
                      ? 'bg-white text-[#0D5C3A] font-bold shadow-xs'
                      : 'text-[#5E5B54] hover:text-[#111111]'
                  }`}
                >
                  Patient ID
                </button>
                <button
                  onClick={() => setSearchMethod('name')}
                  className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    searchMethod === 'name'
                      ? 'bg-white text-[#0D5C3A] font-bold shadow-xs'
                      : 'text-[#5E5B54] hover:text-[#111111]'
                  }`}
                >
                  Name / Phone
                </button>
              </div>

              {/* QR Scanner Mock */}
              {searchMethod === 'qr' ? (
                <div className="p-6 border-2 border-dashed border-[#0D5C3A]/30 rounded-2xl bg-[#FAF9F6] text-center space-y-4">
                  <div className="relative w-40 h-40 mx-auto rounded-xl bg-white border border-[#E2DFD8] flex items-center justify-center overflow-hidden shadow-xs">
                    <QrCode className="w-32 h-32 text-[#111111] opacity-80" />
                    {isScanning && (
                      <div className="absolute inset-x-0 top-0 h-1 bg-[#0D5C3A] shadow-[0_0_10px_#0D5C3A] animate-scan-laser" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-[#111111]">
                      {isScanning ? 'Verifying ABHA token...' : 'Scan Patient ABHA QR Code'}
                    </div>
                    <p className="text-[11px] text-[#5E5B54]">
                      Hold patient's ABHA card or mobile QR in front of the workstation scanner.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-[#5E5B54]">
                    Enter {searchMethod === 'abha' ? 'ABHA Address' : searchMethod === 'id' ? 'Patient ID' : 'Name or Registered Phone'}
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#8A867C] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder={
                        searchMethod === 'abha'
                          ? 'e.g. lakshmi.gowda@abdm'
                          : searchMethod === 'id'
                          ? 'e.g. #0247'
                          : 'e.g. Lakshmi Gowda or 9876543210'
                      }
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2DFD8] bg-white text-xs font-medium text-[#111111] focus:border-[#0D5C3A] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* DEMO PATIENT SHORTCUT BUTTON */}
              <div className="p-4 rounded-xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0D5C3A]">
                    Demo Patient Shortcut
                  </div>
                  <div className="text-[11px] text-[#5E5B54]">
                    Load Patient #0247 (Lakshmi Gowda · lakshmi.gowda@abdm)
                  </div>
                </div>
                <button
                  onClick={handleUseDemoPatient}
                  disabled={isScanning}
                  className="px-4 py-2 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold hover:bg-[#0B4D31] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Use Demo Patient
                </button>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] flex items-start gap-2.5 text-xs text-[#5E5B54]">
                <ShieldCheck className="w-4 h-4 text-[#0D5C3A] shrink-0 mt-0.5" />
                <p>
                  <strong>ABDM Architecture Rule:</strong> Patient health records are not stored in a centralized database by Aadhaar. Instead, data is fetched dynamically with patient consent via interoperable ABHA health information networks.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: PATIENT CONSENT SCREEN */}
          {step === 'consent' && (
            <div className="space-y-5">
              {/* Identity Verified Badge */}
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0D5C3A] text-white font-bold flex items-center justify-center text-xs">
                    LG
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                      {identity.name}
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EBF4EE] text-[#0D5C3A] font-mono">
                        #0247
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5E5B54] font-mono">
                      ABHA: {identity.abhaAddress} · {identity.age} yrs · {identity.sex}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0D5C3A] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Identity Verified
                </span>
              </div>

              {/* Consent Scope Card */}
              <div className="border border-[#E2DFD8] rounded-xl p-4 bg-white space-y-3 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE7DE]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#0D5C3A]" />
                    <span className="text-xs font-bold text-[#111111]">Patient Consent Authorization</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded-full">
                    Status: ✓ Consent Granted
                  </span>
                </div>

                <div className="text-xs text-[#5E5B54]">
                  Patient has authorized temporary access to linked historical records for:
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] text-[#111111] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
                    <span>Consultations</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] text-[#111111] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
                    <span>Medication History</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] text-[#111111] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
                    <span>Past Prescriptions</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] text-[#111111] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
                    <span>Diagnostic Reports</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-[#EAE7DE] text-[#5E5B54]">
                  <div>
                    <span className="text-[#8A867C]">Purpose:</span>
                    <div className="font-medium text-[#111111]">OPD Clinical Consultation</div>
                  </div>
                  <div>
                    <span className="text-[#8A867C]">Access Duration:</span>
                    <div className="font-medium text-[#111111]">24 Hours (Active)</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#0D5C3A] mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-[#111111]">Patient Records Decrypted</h4>
              <p className="text-xs text-[#5E5B54]">
                Opening Lakshmi Gowda (#0247) clinical workstation...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAE7DE] bg-[#FAF9F6] flex justify-between items-center">
          {step === 'search' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[#E2DFD8] text-xs font-bold text-[#5E5B54] hover:bg-[#EAE7DE] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUseDemoPatient}
                className="px-5 py-2 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold hover:bg-[#0B4D31] transition-all flex items-center gap-1.5 shadow-xs"
              >
                Search & Verify <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : step === 'consent' ? (
            <>
              <button
                onClick={() => setStep('search')}
                className="px-4 py-2 rounded-xl border border-[#E2DFD8] text-xs font-bold text-[#5E5B54] hover:bg-[#EAE7DE] transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleGrantConsentAndView}
                className="px-6 py-2.5 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold hover:bg-[#0B4D31] transition-all flex items-center gap-2 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4" /> View Records (Consent Verified)
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};
