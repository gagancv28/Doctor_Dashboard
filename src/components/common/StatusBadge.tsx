import React from 'react';
import { ShieldCheck, Sparkles, CheckCircle2, Clock, Globe } from 'lucide-react';

interface StatusBadgeProps {
  type: 'ai-structured' | 'doctor-verified' | 'doctor-review' | 'abdm-sandbox' | 'fhir' | 'language';
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, label, size = 'sm' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-[11px] px-2 py-0.5 tracking-wider' : 'text-xs px-2.5 py-1';

  switch (type) {
    case 'ai-structured':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase rounded border border-[#0D5C3A]/20 bg-[#EBF4EE] text-[#0D5C3A] font-medium ${sizeClasses}`}
        >
          <Sparkles className="w-3 h-3 text-[#0D5C3A]" />
          {label || 'AI Structured / Clinician Review Required'}
        </span>
      );

    case 'doctor-verified':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase rounded border border-emerald-800/30 bg-emerald-900 text-white font-medium ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-300" />
          {label || 'Doctor Verified'}
        </span>
      );

    case 'doctor-review':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase rounded border border-amber-300 bg-amber-50 text-amber-900 font-medium ${sizeClasses}`}
        >
          <Clock className="w-3 h-3 text-amber-700" />
          {label || 'Pending Clinician Review'}
        </span>
      );

    case 'abdm-sandbox':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase rounded border border-[#E2DFD8] bg-[#FAF9F6] text-[#5E5B54] font-medium ${sizeClasses}`}
        >
          <ShieldCheck className="w-3 h-3 text-[#5E5B54]" />
          {label || 'ABDM Sandbox'}
        </span>
      );

    case 'fhir':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase rounded border border-[#E2DFD8] bg-[#FAF9F6] text-[#5E5B54] font-medium ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D5C3A]" />
          {label || 'FHIR R4 Ready'}
        </span>
      );

    case 'language':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono uppercase rounded border border-[#E2DFD8] bg-white text-[#111111] font-medium ${sizeClasses}`}
        >
          <Globe className="w-3 h-3 text-[#0D5C3A]" />
          {label || 'Multilingual'}
        </span>
      );

    default:
      return null;
  }
};
