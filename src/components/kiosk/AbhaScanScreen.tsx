import React, { useState } from 'react';
import { Scan, ShieldCheck, Loader2 } from 'lucide-react';
import type { AbhaProfile } from '../../types/socrates';
import { AbhaScanner3D } from '../visual/AbhaScanner3D';

interface AbhaScanScreenProps {
  profile: AbhaProfile;
  onScanComplete: () => void;
  onSkipToManual: () => void;
}

export const AbhaScanScreen: React.FC<AbhaScanScreenProps> = ({
  profile,
  onScanComplete,
  onSkipToManual,
}) => {
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleSimulateScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onScanComplete();
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full p-6 sm:p-10">
      {/* Top Context */}
      <div className="flex items-center justify-between border-b border-[#E2DFD8] pb-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider">
            Hospital OPD Kiosk Terminal #01
          </span>
          <span className="text-[#8A867C]">•</span>
          <span className="font-mono text-xs text-[#5E5B54]">ABDM Integrated</span>
        </div>

        <span className="font-mono text-[11px] px-2.5 py-0.5 bg-[#EEF4F9] text-[#0B4F8A] border border-[#0B4F8A]/20 rounded-full font-medium">
          ABHA Gateway Ready
        </span>
      </div>

      {/* Main Scanner Center Area */}
      <div className="my-auto py-8 text-center space-y-6">
        <div className="space-y-2">
          <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider">
            Patient Identification
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#111111] leading-tight">
            Hold your ABHA Health Card <br className="hidden sm:inline" />
            or QR code here
          </h1>
          <p className="text-sm sm:text-base text-[#5E5B54] max-w-lg mx-auto">
            Position your Ayushman Bharat Health Account (ABHA) QR code within the frame to securely link your longitudinal medical records.
          </p>
        </div>

        {/* 3D Soft-Rendered Interactive Scanner Canvas */}
        <div
          onClick={handleSimulateScan}
          className="relative max-w-sm mx-auto cursor-pointer group transition-transform duration-300 hover:scale-[1.01]"
        >
          <AbhaScanner3D />

          {/* Overlay instruction */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-transparent pointer-events-none">
            <div className="bg-white/85 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/60 shadow-lg flex items-center gap-2 text-xs font-semibold text-[#111111] group-hover:bg-white transition-all">
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#0B4F8A] animate-spin" />
                  <span>Decoding ABHA Health Key...</span>
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 text-[#0B4F8A]" />
                  <span>Tap to Simulate Instant ABHA Scan</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Real-world demo hint */}
        <div className="flex items-center justify-center gap-2 text-xs text-[#8A867C] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#0B4F8A]" />
          <span>Encrypted FHIR R4 Compliant Data Exchange</span>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-[#E2DFD8] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-[#7A766C]">
          Configured for patient: <strong className="text-[#111111]">{profile.name}</strong> ({profile.abhaAddress})
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onSkipToManual}
            className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#5E5B54] hover:text-[#111111] hover:bg-[#EAE7DE] rounded-xl transition-colors text-center"
          >
            Manual ABHA Entry
          </button>
          <button
            onClick={handleSimulateScan}
            disabled={isProcessing}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#111111] hover:bg-[#222222] text-[#F9F9F6] text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#F9F9F6]" />
            ) : (
              <span>Simulate Scan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
