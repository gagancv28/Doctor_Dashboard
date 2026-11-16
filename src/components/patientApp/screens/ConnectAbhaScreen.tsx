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
  Check,
  ArrowLeft,
} from 'lucide-react';
import type { HealthIdentity } from '../../../types/health';

interface ConnectAbhaScreenProps {
  identity: HealthIdentity;
  onConsentComplete: () => void;
  onBack: () => void;
}

export const ConnectAbhaScreen: React.FC<ConnectAbhaScreenProps> = ({
  identity,
  onConsentComplete,
  onBack,
}) => {
  const [subStep, setSubStep] = useState<'options' | 'scan' | 'manual' | 'verifying' | 'consent' | 'connected'>('options');
  const [abhaInput, setAbhaInput] = useState<string>(identity.abhaAddress);
  const [isFlashOn, setIsFlashOn] = useState<boolean>(false);

  // Checkboxes for Screen 4: Choose what to connect
  const [selectedRecords, setSelectedRecords] = useState<{ [key: string]: boolean }>({
    consultations: true,
    prescriptions: true,
    medications: true,
    labReports: true,
    otherDocs: false,
  });

  const toggleRecord = (key: string) => {
    setSelectedRecords((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartVerification = () => {
    setSubStep('verifying');
    setTimeout(() => {
      setSubStep('consent');
    }, 1500);
  };

  const handleGrantConsent = () => {
    setSubStep('connected');
    setTimeout(() => {
      onConsentComplete();
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 bg-[#FAF9F6] text-[#111111]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD8]">
        <button
          onClick={onBack}
          className="p-1 rounded-lg text-[#5E5B54] hover:text-[#111111]"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-mono text-xs text-[#0D5C3A] font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" /> ABDM Sandbox
        </span>
        <div className="w-5" />
      </div>

      {/* SCREEN 2: CONNECT ABHA OPTIONS */}
      {subStep === 'options' && (
        <div className="space-y-6 my-auto">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center mx-auto text-[#0D5C3A]">
              <QrCode className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
              Connect your ABHA
            </h2>
            <p className="text-xs text-[#5E5B54] max-w-xs mx-auto leading-relaxed">
              Link available health records to your personal health history.
            </p>
          </div>

          <div className="space-y-3">
            {/* Option A: Scan QR */}
            <button
              onClick={() => setSubStep('scan')}
              className="w-full p-4 bg-white border-2 border-[#0D5C3A] rounded-2xl text-left flex items-center justify-between transition-all group shadow-xs active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#EBF4EE] text-[#0D5C3A]">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#111111]">Scan your health QR</div>
                  <div className="text-[11px] text-[#5E5B54]">Scan QR code on ABHA health card</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#0D5C3A]" />
            </button>

            {/* Option B: Enter ABHA */}
            <button
              onClick={() => setSubStep('manual')}
              className="w-full p-4 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-2xl text-left flex items-center justify-between transition-all group shadow-xs active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] text-[#111111]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#111111]">Enter ABHA Number</div>
                  <div className="text-[11px] text-[#5E5B54]">Enter 14-digit ID or ABHA address</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#8A867C]" />
            </button>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-tight">
            <strong>ABDM Prototype:</strong> Records are retrieved dynamically from linked health facilities with your consent.
          </div>
        </div>
      )}

      {/* SUBSTEP: SCAN QR VIEWFINDER */}
      {subStep === 'scan' && (
        <div className="space-y-6 my-auto text-center">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#111111]">Scan your health QR</h2>
            <p className="text-xs text-[#5E5B54]">Position the QR code inside the frame</p>
          </div>

          <div className="relative aspect-square w-60 mx-auto rounded-3xl bg-[#111111] border-2 border-[#0D5C3A]/50 overflow-hidden flex flex-col items-center justify-center text-white p-6 shadow-inner">
            <div className="absolute inset-5 border-2 border-dashed border-emerald-400/70 rounded-2xl flex items-center justify-center pointer-events-none">
              <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-bounce-subtle" />
            </div>
            <QrCode className="w-14 h-14 text-emerald-300/40 mb-2" />
            <span className="text-[10px] text-emerald-200 font-mono">Simulating camera optical feed</span>

            <button
              onClick={() => setIsFlashOn(!isFlashOn)}
              className={`absolute bottom-3 right-3 p-2 rounded-full text-xs ${
                isFlashOn ? 'bg-amber-400 text-black' : 'bg-white/20 text-white'
              }`}
            >
              <Flashlight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleStartVerification}
            className="w-full py-3.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Simulate QR Scan (Lakshmi Gowda)</span>
          </button>
        </div>
      )}

      {/* SUBSTEP: MANUAL ABHA INPUT */}
      {subStep === 'manual' && (
        <div className="space-y-6 my-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#111111]">Enter ABHA Details</h2>
            <p className="text-xs text-[#5E5B54]">Enter your ABHA Address or 14-digit ABHA Number</p>
          </div>

          <div className="space-y-2">
            <label className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
              ABHA Number / ABHA Address
            </label>
            <input
              type="text"
              value={abhaInput}
              onChange={(e) => setAbhaInput(e.target.value)}
              className="w-full p-3.5 bg-white border border-[#E2DFD8] rounded-xl text-xs font-mono text-[#111111] focus:outline-none focus:border-[#0D5C3A]"
            />
            <span className="text-[10px] text-[#8A867C] block font-mono">
              Demo ABHA: <code className="text-[#0D5C3A]">lakshmi.gowda@abdm</code>
            </span>
          </div>

          <button
            onClick={handleStartVerification}
            className="w-full py-3.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SCREEN 3: VERIFYING HEALTH IDENTITY */}
      {subStep === 'verifying' && (
        <div className="space-y-5 my-auto text-center max-w-xs mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-[#111111]">Verifying health identity...</h2>
            <p className="text-xs text-[#5E5B54] font-mono">Querying ABDM sandbox registry for linked care records…</p>
          </div>
        </div>
      )}

      {/* SCREEN 4: CHOOSE WHAT TO CONNECT & CONSENT */}
      {subStep === 'consent' && (
        <div className="space-y-4 my-auto">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#0D5C3A] font-mono text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Identity Verified • Health records found</span>
            </div>
            <h2 className="text-xl font-bold text-[#111111] tracking-tight">
              Choose what to connect
            </h2>
            <p className="text-xs text-[#5E5B54]">
              Select which categories from your linked health records to import into your personal health history.
            </p>
          </div>

          {/* Checkboxes matching Screen 4 in Prompt */}
          <div className="space-y-2 text-xs">
            {[
              { key: 'consultations', label: '3 Consultations', sub: 'Govt Hospital, City Care, Private Clinic' },
              { key: 'prescriptions', label: '2 Prescriptions', sub: 'OPD Paracetamol & Cetirizine scripts' },
              { key: 'medications', label: 'Medication History', sub: '1 Active & previous drug trials' },
              { key: 'labReports', label: '4 Lab Reports', sub: 'CBC blood test & Thyroid panel' },
              { key: 'otherDocs', label: 'Other Medical Documents', sub: 'Discharge summaries & scans' },
            ].map((item) => {
              const checked = selectedRecords[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => toggleRecord(item.key)}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    checked
                      ? 'bg-[#EBF4EE] border-[#0D5C3A] ring-1 ring-[#0D5C3A]'
                      : 'bg-white border-[#E2DFD8] hover:border-[#111111]'
                  }`}
                >
                  <div>
                    <div className={`font-bold ${checked ? 'text-[#0D5C3A]' : 'text-[#111111]'}`}>
                      {item.label}
                    </div>
                    <div className="text-[10px] text-[#5E5B54]">{item.sub}</div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                      checked
                        ? 'bg-[#0D5C3A] border-[#0D5C3A] text-white'
                        : 'bg-white border-[#C8C4BA]'
                    }`}
                  >
                    {checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-white border border-[#E2DFD8] rounded-xl flex items-center gap-2 text-[11px] text-[#5E5B54]">
            <Lock className="w-4 h-4 text-[#0D5C3A] shrink-0" />
            <span>Your consent controls access to your health information.</span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleGrantConsent}
              className="w-full py-3.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Give Consent & Connect Records</span>
            </button>

            <button
              onClick={() => setSubStep('options')}
              className="w-full py-2.5 text-center text-xs text-[#5E5B54] hover:text-[#111111]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CONNECTED SUCCESS */}
      {subStep === 'connected' && (
        <div className="space-y-4 my-auto text-center max-w-xs mx-auto animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#EBF4EE] border border-[#0D5C3A]/30 flex items-center justify-center mx-auto text-[#0D5C3A]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-[#111111]">✓ Records connected</h2>
            <p className="text-xs text-[#5E5B54]">Your longitudinal medical history is loaded and ready.</p>
          </div>
        </div>
      )}

      <div className="text-[10px] text-[#8A867C] text-center font-mono pt-2">
        Patient #0247 • ABDM Sandbox Gateway v2.1
      </div>
    </div>
  );
};
