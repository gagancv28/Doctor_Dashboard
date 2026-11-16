import React from 'react';
import { ArrowRight, ShieldCheck, Key } from 'lucide-react';
import type { HealthIdentity } from '../../types/health';
import { HealthArchive3D } from '../visual/HealthArchive3D';

interface WelcomeOnboardingProps {
  identity: HealthIdentity;
  onGetStarted: () => void;
  onContinueWithAbha: () => void;
}

export const WelcomeOnboarding: React.FC<WelcomeOnboardingProps> = ({
  identity,
  onGetStarted,
  onContinueWithAbha,
}) => {
  const [step, setStep] = React.useState<'intro' | 'identity'>('intro');

  return (
    <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 bg-[#F5F3EE]">
      {/* Brand Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#111111] text-[#F5F3EE] flex items-center justify-center font-bold text-sm">
            CS
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-[#111111]">CODESCRIBE</span>
            <span className="font-mono text-[10px] text-[#0D5C3A] font-semibold ml-1.5 uppercase">HEALTH</span>
          </div>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] border border-[#0D5C3A]/20 rounded">
          SIH26047
        </span>
      </div>

      {step === 'intro' ? (
        /* SCREEN 1: WELCOME INTRO */
        <div className="my-auto py-8 space-y-6">
          <div className="w-full h-36 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl overflow-hidden p-2 flex items-center justify-center relative">
            <HealthArchive3D variant="compact" className="w-full h-full" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#111111] leading-tight">
              Your health history. Wherever you go.
            </h1>
            <p className="text-sm sm:text-base text-[#5E5B54] leading-relaxed">
              Keep your medical history organized and share the right information with the right doctor — when you choose.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <button
              onClick={() => setStep('identity')}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 bg-[#111111] hover:bg-[#0D5C3A] text-white rounded-lg text-sm font-semibold tracking-tight transition-colors shadow-sm"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full py-3 px-6 bg-transparent border border-[#E2DFD8] hover:border-[#111111] text-[#111111] rounded-lg text-xs font-medium transition-colors"
            >
              I already have an account
            </button>
          </div>
        </div>
      ) : (
        /* SCREEN 2: HEALTH IDENTITY SETUP (ABHA) */
        <div className="my-auto py-8 space-y-6">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#0D5C3A] font-semibold">
              Digital Health ID
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111]">
              Set up your health profile
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5B54]">
              Your health identity helps connect records across participating healthcare services.
            </p>
          </div>

          {/* ABHA Card Mockup */}
          <div className="p-5 bg-white border border-[#E2DFD8] rounded-xl shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE7DE]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#0D5C3A]" />
                <span className="font-bold text-xs tracking-wider text-[#111111]">ABHA / HEALTH ID</span>
              </div>
              <span className="text-[10px] font-mono bg-[#EBF4EE] text-[#0D5C3A] px-2 py-0.5 rounded font-medium">
                Sandbox Connected
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#8A867C] uppercase">Health ID (ABHA)</span>
              <div className="font-mono font-bold text-base text-[#111111] tracking-wider">
                {identity.abhaId}
              </div>
              <div className="text-xs font-mono text-[#0D5C3A]">{identity.abhaAddress}</div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-[#5E5B54] border-t border-[#EAE7DE]">
              <span>Name: {identity.name}</span>
              <span>{identity.sex} • {identity.age} yrs</span>
            </div>
          </div>

          <div className="text-[11px] text-[#5E5B54] p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded space-y-1 font-mono">
            <div className="flex items-center gap-1.5 text-[#111111] font-semibold">
              <Key className="w-3.5 h-3.5 text-[#0D5C3A]" />
              <span>Optional identity verification</span>
            </div>
            <p className="text-[#8A867C]">
              Aadhaar-based eKYC is used solely for initial identity verification. Medical records remain in your control.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={onContinueWithAbha}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-[#0D5C3A] hover:bg-[#09472C] text-white rounded-lg text-sm font-semibold tracking-tight transition-colors shadow-sm"
            >
              <span>Continue with ABHA</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGetStarted}
              className="w-full py-2.5 text-xs font-mono text-[#5E5B54] hover:text-[#111111] text-center"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* Footer reassuring note */}
      <div className="pt-4 border-t border-[#E2DFD8] text-center text-[11px] text-[#8A867C] font-mono">
        ABDM Sandbox Protocol • Privacy First Architecture
      </div>
    </div>
  );
};
