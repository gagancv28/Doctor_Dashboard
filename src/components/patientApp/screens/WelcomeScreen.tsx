import React from 'react';
import { ShieldCheck, ArrowRight, HeartPulse, Sparkles, QrCode } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onAlreadyHaveAbha: () => void;
  onNewPatient: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  onAlreadyHaveAbha,
  onNewPatient,
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#FAF9F6] text-[#111111]">
      {/* Top Brand Pill */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0D5C3A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            <HeartPulse className="w-4 h-4 text-emerald-200" />
          </div>
          <span className="font-bold text-base tracking-tight text-[#111111]">
            CodeScribe Health
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] border border-[#0D5C3A]/20 rounded-full font-bold">
          ABDM Sandbox
        </span>
      </div>

      {/* Hero Illustration / Graphic */}
      <div className="my-auto py-6 space-y-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center mx-auto text-[#0D5C3A] shadow-inner relative">
          <ShieldCheck className="w-10 h-10" />
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#0D5C3A] text-white flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          </div>
        </div>

        <div className="space-y-2 max-w-xs mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] leading-tight">
            Your health history. Wherever you go.
          </h1>
          <p className="text-xs text-[#5E5B54] leading-relaxed">
            Keep your health records organized, create structured medical history in your own language, and securely share the right information with your doctor.
          </p>
        </div>

        <div className="p-3 bg-white border border-[#E2DFD8] rounded-2xl text-[11px] text-[#0D5C3A] font-medium max-w-xs mx-auto flex items-center justify-center gap-1.5 shadow-xs">
          <span>One health history. Many hospitals. Patient controlled.</span>
        </div>
      </div>

      {/* Bottom CTA Buttons (Prompt Requirement: Screen 1) */}
      <div className="space-y-2.5 pb-2">
        <button
          onClick={onAlreadyHaveAbha}
          className="w-full py-3.5 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
        >
          <QrCode className="w-4 h-4" />
          <span>I already have an ABHA</span>
        </button>

        <button
          onClick={onGetStarted}
          className="w-full py-3.5 bg-[#111111] hover:bg-[#222222] text-white rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onNewPatient}
          className="w-full py-2.5 text-center text-xs font-medium text-[#5E5B54] hover:text-[#111111] transition-colors"
        >
          Continue as New Patient
        </button>
      </div>
    </div>
  );
};
