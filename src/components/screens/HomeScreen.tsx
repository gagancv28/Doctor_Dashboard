import React from 'react';
import {
  Mic,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
  Pill,
  FileText,
  Share2,
  Sparkles,
  HeartPulse,
} from 'lucide-react';
import type { HealthIdentity, HealthRecord, TabType, MedicationItem, VaultDocument } from '../../types/health';

interface HomeScreenProps {
  identity: HealthIdentity;
  timeline: HealthRecord[];
  medications: MedicationItem[];
  documents: VaultDocument[];
  onSelectTab: (tab: TabType) => void;
  onOpenRecord: (record: HealthRecord) => void;
  onStartConsultation: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  identity,
  timeline,
  medications,
  documents,
  onSelectTab,
  onOpenRecord,
  onStartConsultation,
}) => {
  const activeMeds = medications.filter((m) => m.status === 'Active');
  const recentDocs = documents.slice(0, 2);
  const lastRecord = timeline[0];

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Welcome Bar */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-[#8A867C] uppercase tracking-wider font-semibold">
            Patient Portal
          </span>
          <span className="font-mono text-[10px] px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] font-bold rounded flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#0D5C3A]" /> ✓ ABHA Connected
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
          Good morning, {identity.name.split(' ')[0]}
        </h1>
        <p className="text-xs text-[#5E5B54]">
          One health history across all hospitals. Patient controlled.
        </p>
      </div>

      {/* HEALTH IDENTITY & QUICK CONSULTATION CARD */}
      <div className="bg-white border border-[#E2DFD8] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center text-[#0D5C3A] shrink-0">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm text-[#111111] truncate">Longitudinal Health Identity</div>
              <div className="text-xs text-[#0D5C3A] font-mono truncate">
                ABHA ID: {identity.abhaAddress}
              </div>
            </div>
          </div>

          <button
            onClick={onStartConsultation}
            className="w-full sm:w-auto px-4 py-3 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98"
          >
            <Mic className="w-4 h-4" />
            <span>Start New Consultation</span>
          </button>
        </div>

        {/* 4 Compact Metric Cards (2-column grid on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div
            onClick={() => onSelectTab('medications')}
            className="p-3 bg-[#FAF9F6] hover:bg-[#F0EFEB] border border-[#E2DFD8] rounded-xl space-y-1 cursor-pointer transition-colors"
          >
            <span className="font-mono text-[10px] text-[#8A867C] uppercase block font-semibold">
              Active Medications
            </span>
            <span className="text-xl font-bold font-mono text-[#0D5C3A] block">
              {activeMeds.length} Active
            </span>
            <span className="text-[10px] text-[#5E5B54] truncate block">Paracetamol SOS</span>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="font-mono text-[10px] text-amber-900 uppercase block font-bold">
              Known Allergy
            </span>
            <span className="text-xl font-bold font-mono text-amber-950 block">
              1 (Penicillin)
            </span>
            <span className="text-[10px] text-amber-800 truncate block font-medium">Beta-lactam alert</span>
          </div>

          <div
            onClick={() => onSelectTab('health')}
            className="p-3 bg-[#FAF9F6] hover:bg-[#F0EFEB] border border-[#E2DFD8] rounded-xl space-y-1 cursor-pointer transition-colors"
          >
            <span className="font-mono text-[10px] text-[#8A867C] uppercase block font-semibold">
              Consultations
            </span>
            <span className="text-xl font-bold font-mono text-[#111111] block">
              {timeline.length} Recorded
            </span>
            <span className="text-[10px] text-[#5E5B54] truncate block">4 care facilities</span>
          </div>

          <div
            onClick={() => onSelectTab('documents')}
            className="p-3 bg-[#FAF9F6] hover:bg-[#F0EFEB] border border-[#E2DFD8] rounded-xl space-y-1 cursor-pointer transition-colors"
          >
            <span className="font-mono text-[10px] text-[#8A867C] uppercase block font-semibold">
              Health Documents
            </span>
            <span className="text-xl font-bold font-mono text-[#111111] block">
              {documents.length} Docs
            </span>
            <span className="text-[10px] text-[#5E5B54] truncate block">Prescriptions & labs</span>
          </div>
        </div>
      </div>

      {/* 4 CORE DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Recent Consultation */}
        <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EBF4EE] text-[#0D5C3A]">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                Recent Consultation
              </span>
            </div>
            <button
              onClick={() => onSelectTab('health')}
              className="text-[11px] font-mono text-[#0D5C3A] hover:underline flex items-center gap-1"
            >
              <span>History</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div
            onClick={() => lastRecord && onOpenRecord(lastRecord)}
            className="p-3.5 bg-[#FAF9F6] hover:bg-[#F0EFEB] border border-[#E2DFD8] rounded-xl cursor-pointer transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-[#111111]">
                {lastRecord?.title || 'Neurology & General OPD Consultation'}
              </span>
              <span className="font-mono text-[10px] text-[#8A867C]">
                {lastRecord?.displayDate || '12 Aug 2026'}
              </span>
            </div>
            <p className="text-xs text-[#5E5B54] line-clamp-2">
              {lastRecord?.summary || 'Tension headache following work stress. Advised oral hydration and SOS analgesics.'}
            </p>
            <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-[#8A867C]">
              <span>Facility: {lastRecord?.facility || 'Government Hospital, Hassan'}</span>
              <span className="text-[#0D5C3A] font-semibold">Doctor Verified ✓</span>
            </div>
          </div>
        </div>

        {/* Card 2: Current Medications */}
        <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EBF4EE] text-[#0D5C3A]">
                <Pill className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                Current Medications ({activeMeds.length})
              </span>
            </div>
            <button
              onClick={() => onSelectTab('medications')}
              className="text-[11px] font-mono text-[#0D5C3A] hover:underline flex items-center gap-1"
            >
              <span>Vault</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {activeMeds.map((med, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#111111]">
                    {med.name} <span className="font-normal text-[#5E5B54]">({med.dosage})</span>
                  </div>
                  <div className="text-[10px] text-[#5E5B54]">{med.frequency} • {med.facility}</div>
                </div>
                <span className="font-mono text-[9px] px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] font-semibold rounded">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Recent Documents */}
        <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EBF4EE] text-[#0D5C3A]">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                Recent Documents
              </span>
            </div>
            <button
              onClick={() => onSelectTab('documents')}
              className="text-[11px] font-mono text-[#0D5C3A] hover:underline flex items-center gap-1"
            >
              <span>All 14</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2">
            {recentDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectTab('documents')}
                className="p-2.5 bg-[#FAF9F6] hover:bg-[#F0EFEB] border border-[#E2DFD8] rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-[#111111] truncate">{doc.title}</div>
                  <div className="text-[10px] text-[#5E5B54] truncate">{doc.facility} • {doc.date}</div>
                </div>
                <span className="font-mono text-[10px] text-[#0D5C3A] shrink-0 font-medium">
                  OCR Verified
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 4: Shared Access & Consent */}
        <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#EBF4EE] text-[#0D5C3A]">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
                Shared Access & Consent
              </span>
            </div>
            <button
              onClick={() => onSelectTab('consent')}
              className="text-[11px] font-mono text-[#0D5C3A] hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="p-3.5 bg-[#EBF4EE] border border-[#0D5C3A]/30 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#0D5C3A] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 1 Doctor Currently Has Access
              </span>
              <span className="font-mono text-[10px] bg-[#0D5C3A] text-white px-2 py-0.5 rounded font-semibold">
                Active Grant
              </span>
            </div>
            <p className="text-[11px] text-[#111111]/80">
              Dr. Sharma (City Care Hospital OPD) • Purpose: Consultation & Triage. Time-bound access expires automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Multilingual Voice Intake Callout */}
      <div className="p-5 bg-gradient-to-r from-[#111111] to-[#1F2937] text-white rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm tracking-tight">CodeScribe Multilingual Clinical Intake</span>
          </div>
          <p className="text-xs text-[#D1D5DB] leading-relaxed max-w-xl">
            Visiting a new hospital or Ayush centre today? Speak in your native language (Kannada, Hindi, Tamil, Telugu, etc.) to generate structured case history before seeing the physician.
          </p>
        </div>

        <button
          onClick={onStartConsultation}
          className="px-5 py-3 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm"
        >
          <Mic className="w-4 h-4 text-emerald-300" />
          <span>Start Consultation (Kannada / 12 Languages)</span>
        </button>
      </div>
    </div>
  );
};
