import React, { useState } from 'react';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Camera,
  Flashlight,
  Loader2,
} from 'lucide-react';
import type { HealthIdentity } from '../../types/health';

interface AbhaConnectScreenProps {
  identity: HealthIdentity;
  onConsentComplete: () => void;
  onViewHistory: () => void;
}

export const AbhaConnectScreen: React.FC<AbhaConnectScreenProps> = ({
  identity,
  onConsentComplete,
  onViewHistory,
}) => {
  const [method, setMethod] = useState<'scan' | 'manual'>('scan');
  const [abhaInput, setAbhaInput] = useState<string>(identity.abhaAddress);
  const [step, setStep] = useState<'input' | 'verifying' | 'found' | 'consent' | 'connected'>('input');
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);

  const handleStartVerification = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('found');
      setTimeout(() => {
        setStep('consent');
      }, 1000);
    }, 1400);
  };

  const handleGrantConsent = () => {
    setStep('connected');
    onConsentComplete();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Top ABDM Architectural Statement Banner */}
      <div className="p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <div className="font-bold text-amber-950 flex items-center gap-2">
            <span>ABDM Sandbox & Patient-Controlled Interoperability</span>
            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-amber-200/70 text-amber-900 rounded font-semibold">
              Prototype Mode
            </span>
          </div>
          <p className="text-amber-900/90 leading-relaxed text-[11px]">
            CodeScribe Health operates as an ABDM Health Information User (HIU) and Provider (HIP). Records are fetched dynamically via explicit patient consent from participating health facilities — never from a centralized medical repository.
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white border border-[#E2DFD8] rounded-2xl shadow-xs overflow-hidden">
        {/* Step: INPUT (Scan QR or Enter ABHA) */}
        {step === 'input' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center mx-auto text-[#0D5C3A]">
                <QrCode className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold text-[#111111] tracking-tight">
                Bring your health history together
              </h1>
              <p className="text-xs sm:text-sm text-[#5E5B54] leading-relaxed">
                Connect your ABHA to link available health records from participating hospitals, clinics, and diagnostic labs.
              </p>
            </div>

            {/* Method Tabs: Scan QR vs Enter ABHA */}
            <div className="max-w-md mx-auto">
              <div className="grid grid-cols-2 p-1 bg-[#F5F3EE] rounded-xl border border-[#E2DFD8] text-xs font-semibold">
                <button
                  onClick={() => setMethod('scan')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    method === 'scan' ? 'bg-white text-[#111111] shadow-xs' : 'text-[#5E5B54] hover:text-[#111111]'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5 text-[#0D5C3A]" />
                  <span>Option A: Scan QR</span>
                </button>
                <button
                  onClick={() => setMethod('manual')}
                  className={`py-2 px-3 rounded-lg transition-all flex items-center justify-center gap-2 ${
                    method === 'manual' ? 'bg-white text-[#111111] shadow-xs' : 'text-[#5E5B54] hover:text-[#111111]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C3A]" />
                  <span>Option B: Enter ABHA</span>
                </button>
              </div>
            </div>

            {/* Option A: Scanner Viewfinder */}
            {method === 'scan' ? (
              <div className="max-w-sm mx-auto space-y-4">
                <div className="relative aspect-square w-full rounded-2xl bg-[#111111] border-2 border-[#0D5C3A]/40 overflow-hidden shadow-inner flex flex-col items-center justify-center p-6 text-center text-white">
                  {/* Viewfinder corner brackets */}
                  <div className="absolute inset-8 border-2 border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                    {/* Animated scanning laser */}
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#34d399] animate-bounce-subtle" />
                  </div>

                  <QrCode className="w-16 h-16 text-emerald-300/40 mb-3" />
                  <span className="font-mono text-xs text-emerald-200 font-semibold z-10">
                    Position the QR code inside the frame
                  </span>
                  <span className="text-[10px] text-[#A3A3A3] mt-1 z-10">
                    ABHA Card or ABDM Health App QR
                  </span>

                  {/* Flashlight toggle */}
                  <button
                    onClick={() => setIsFlashOn(!isFlashOn)}
                    className={`absolute bottom-3 right-3 p-2 rounded-full text-xs ${
                      isFlashOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    title="Toggle Flash"
                  >
                    <Flashlight className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleStartVerification}
                  className="w-full py-3.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  <span>Simulate QR Scan (Lakshmi Gowda)</span>
                </button>
              </div>
            ) : (
              /* Option B: Enter ABHA manually */
              <div className="max-w-md mx-auto space-y-4">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase text-[#5E5B54] font-semibold block">
                    ABHA Address / ABHA Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={abhaInput}
                      onChange={(e) => setAbhaInput(e.target.value)}
                      placeholder="e.g. lakshmi.gowda@abdm or 91-4829-1049-2819"
                      className="w-full p-3.5 pl-10 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#0D5C3A]"
                    />
                    <ShieldCheck className="w-4 h-4 text-[#0D5C3A] absolute left-3.5 top-3.5" />
                  </div>
                  <span className="text-[10px] text-[#8A867C] block">
                    Use demo ID: <code className="font-mono text-[#0D5C3A]">lakshmi.gowda@abdm</code>
                  </span>
                </div>

                <button
                  onClick={handleStartVerification}
                  className="w-full py-3.5 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step: VERIFYING & REQUESTING */}
        {(step === 'verifying' || step === 'found') && (
          <div className="p-8 sm:p-12 text-center space-y-5 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-[#111111]">
                {step === 'verifying' ? 'Verifying health identity…' : 'Identity verified! Requesting available records…'}
              </h2>
              <p className="text-xs text-[#5E5B54] font-mono">
                Querying ABDM Gateway for linked records from participating care facilities…
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl text-left space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8A867C]">Health Identity:</span>
                <span className="font-mono font-bold text-[#111111]">{identity.abhaAddress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A867C]">ABHA Number:</span>
                <span className="font-mono text-[#5E5B54]">{identity.abhaId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A867C]">Status:</span>
                <span className="text-[#0D5C3A] font-semibold">Gateway Verified ✓</span>
              </div>
            </div>
          </div>
        )}

        {/* Step: CONSENT SCREEN */}
        {step === 'consent' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-xl mx-auto">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#EBF4EE] text-[#0D5C3A]">
                  <Lock className="w-4 h-4" />
                </span>
                <span className="font-mono text-xs uppercase text-[#0D5C3A] font-bold tracking-wider">
                  Patient Consent Required
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#111111] tracking-tight">
                CodeScribe Health wants to access your linked health records
              </h2>
              <p className="text-xs text-[#5E5B54] leading-relaxed">
                The following records were discovered from ABDM-compatible healthcare facilities linked to your ABHA. Explicit consent is required before importing them to your health history.
              </p>
            </div>

            {/* Discovered Records Breakdown */}
            <div className="bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl p-4 space-y-3">
              <div className="font-mono text-[11px] uppercase text-[#8A867C] font-semibold">
                Records Available for Linking:
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white border border-[#E2DFD8] rounded-lg flex items-center justify-between">
                  <span className="text-[#111111] font-medium">OPD Consultations</span>
                  <span className="font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded">3</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E2DFD8] rounded-lg flex items-center justify-between">
                  <span className="text-[#111111] font-medium">Prescriptions</span>
                  <span className="font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded">2</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E2DFD8] rounded-lg flex items-center justify-between">
                  <span className="text-[#111111] font-medium">Lab & Diagnostic Reports</span>
                  <span className="font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded">4</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E2DFD8] rounded-lg flex items-center justify-between">
                  <span className="text-[#111111] font-medium">Medication History</span>
                  <span className="font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded">1</span>
                </div>
                <div className="p-2.5 bg-white border border-[#E2DFD8] rounded-lg flex items-center justify-between col-span-2">
                  <span className="text-[#111111] font-medium">Allergy Record (Penicillin)</span>
                  <span className="font-mono font-bold text-[#0D5C3A] bg-[#EBF4EE] px-2 py-0.5 rounded">1 Record</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#EAE7DE] flex items-center justify-between text-[11px] text-[#5E5B54]">
                <span>Sources: Govt Hospital, City Care, Private Clinic</span>
                <span className="font-mono text-[#0D5C3A]">ABDM Sandbox Ready</span>
              </div>
            </div>

            {/* Consent Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleGrantConsent}
                className="w-full py-3.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Allow Access & Import to Health History</span>
              </button>

              <button
                onClick={handleGrantConsent}
                className="w-full py-2.5 bg-white border border-[#E2DFD8] hover:border-[#111111] text-[#111111] rounded-xl text-xs font-medium transition-colors"
              >
                Review Records Individually
              </button>
            </div>
          </div>
        )}

        {/* Step: CONNECTED SUCCESS */}
        {step === 'connected' && (
          <div className="p-8 sm:p-10 text-center space-y-6 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-[#111111]">
                Health Records Linked Successfully
              </h2>
              <p className="text-xs text-[#5E5B54]">
                Demo health records loaded from ABDM-compatible source. Your longitudinal medical history is now ready.
              </p>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl text-left space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8A867C]">Total Consultations:</span>
                <span className="font-mono font-bold text-[#111111]">8 Records</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A867C]">Active Medications:</span>
                <span className="font-mono font-bold text-[#0D5C3A]">2 Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8A867C]">Known Allergies:</span>
                <span className="font-mono font-bold text-amber-700">1 (Penicillin)</span>
              </div>
            </div>

            <button
              onClick={onViewHistory}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>View Health History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
