import React from 'react';
import {
  Pill,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import type { MedicationItem } from '../../types/health';

interface MedicationVaultScreenProps {
  medications: MedicationItem[];
  onStartConsultation?: () => void;
}

export const MedicationVaultScreen: React.FC<MedicationVaultScreenProps> = ({
  medications,
}) => {
  const activeMeds = medications.filter((m) => m.status === 'Active');
  const completedMeds = medications.filter((m) => m.status === 'Completed' || m.status === 'Discontinued');

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <span className="font-mono text-xs text-[#0D5C3A] font-semibold uppercase tracking-wider block">
            Medication Vault
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Prescription & Drug History
          </h1>
          <p className="text-xs text-[#5E5B54] mt-0.5">
            Complete longitudinal medication profile to track active treatments and previous drug trials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs px-3 py-1.5 bg-[#EBF4EE] text-[#0D5C3A] border border-[#0D5C3A]/20 rounded-xl font-bold">
            {activeMeds.length} Active Prescriptions
          </span>
        </div>
      </div>

      {/* Safety Alert */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-amber-900">
            Known Drug Allergy Alert: Penicillin (Beta-lactam)
          </div>
          <p className="text-amber-800 leading-relaxed text-[11px]">
            Avoid Penicillin, Amoxicillin, and Ampicillin formulations. Verified by Dr. V. Rao, MD.
          </p>
        </div>
      </div>

      {/* VISUAL MEDICATION TIMELINE */}
      <div className="bg-white border border-[#E2DFD8] rounded-2xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0D5C3A]" />
            <span className="font-bold text-xs uppercase tracking-wider text-[#111111]">
              Medication Timeline (2025 – 2026)
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#8A867C]">Longitudinal View</span>
        </div>

        <div className="space-y-3 pt-2">
          {/* Paracetamol */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111111]">Paracetamol 500 mg (Twice Daily SOS)</span>
              <span className="font-mono text-[11px] text-[#0D5C3A] font-semibold">12 Aug 2026 → Current</span>
            </div>
            <div className="w-full h-3 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E2DFD8] relative">
              <div className="absolute right-0 w-[45%] h-full bg-[#0D5C3A] rounded-full" />
            </div>
            <span className="text-[10px] text-[#8A867C] block">Prescribed by Dr. Sharma • Govt Hospital Hassan</span>
          </div>

          {/* Domperidone */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#111111]">Domperidone 10 mg (Once Daily AC)</span>
              <span className="font-mono text-[11px] text-[#0D5C3A] font-semibold">12 Aug 2026 → Current</span>
            </div>
            <div className="w-full h-3 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E2DFD8] relative">
              <div className="absolute right-0 w-[35%] h-full bg-emerald-600 rounded-full" />
            </div>
            <span className="text-[10px] text-[#8A867C] block">Prescribed by Dr. Sharma • For Nausea</span>
          </div>

          {/* Cetirizine */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#5E5B54]">Cetirizine 10 mg (Once Daily Bedtime)</span>
              <span className="font-mono text-[11px] text-[#8A867C]">03 Jul 2026 → 10 Jul 2026</span>
            </div>
            <div className="w-full h-3 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E2DFD8] relative">
              <div className="absolute left-[50%] w-[15%] h-full bg-[#8A867C] rounded-full opacity-70" />
            </div>
            <span className="text-[10px] text-[#8A867C] block">Prescribed by Dr. K. Mehta • Dermatology • Resolved & Stopped</span>
          </div>

          {/* Omeprazole */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#5E5B54]">Omeprazole 20 mg (Once Daily OD Morning)</span>
              <span className="font-mono text-[11px] text-[#8A867C]">18 Dec 2025 → 25 Dec 2025</span>
            </div>
            <div className="w-full h-3 bg-[#FAF9F6] rounded-full overflow-hidden border border-[#E2DFD8] relative">
              <div className="absolute left-[15%] w-[12%] h-full bg-[#8A867C] rounded-full opacity-70" />
            </div>
            <span className="text-[10px] text-[#8A867C] block">Prescribed by Dr. V. Rao • District Hospital • Acute Gastritis (Resolved)</span>
          </div>
        </div>
      </div>

      {/* CURRENT MEDICATIONS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] font-semibold">
            1. Current Active Medications ({activeMeds.length})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeMeds.map((med, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#EBF4EE] text-[#0D5C3A]">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#111111]">
                      {med.name} <span className="text-[#0D5C3A]">({med.dosage})</span>
                    </h3>
                    <div className="text-xs text-[#5E5B54] font-medium">{med.frequency}</div>
                  </div>
                </div>

                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#EBF4EE] text-[#0D5C3A] font-bold rounded">
                  Active
                </span>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Started Date:</span>
                  <span className="font-mono font-bold text-[#111111]">{med.startDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Prescribed by:</span>
                  <span className="font-medium text-[#111111]">{med.prescribedBy}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Facility:</span>
                  <span className="text-[#111111]">{med.facility}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Indication:</span>
                  <span className="text-[#111111]">{med.reason}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PREVIOUS MEDICATIONS SECTION */}
      <div className="space-y-3">
        <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] font-semibold block">
          2. Previous / Completed Medications ({completedMeds.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completedMeds.map((med, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-[#E2DFD8] rounded-2xl space-y-3 shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-[#FAF9F6] text-[#8A867C]">
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#111111]">
                      {med.name} <span className="text-[#8A867C]">({med.dosage})</span>
                    </h3>
                    <div className="text-xs text-[#5E5B54] font-medium">{med.frequency}</div>
                  </div>
                </div>

                <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-[#FAF9F6] text-[#8A867C] font-semibold rounded border border-[#E2DFD8]">
                  Completed
                </span>
              </div>

              <div className="p-3 bg-[#FAF9F6] border border-[#E2DFD8] rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Duration:</span>
                  <span className="font-mono text-[#111111]">{med.startDate} → {med.endDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Prescribed by:</span>
                  <span className="text-[#111111]">{med.prescribedBy} ({med.facility})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Reason:</span>
                  <span className="text-[#111111]">{med.reason}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#8A867C]">Outcome:</span>
                  <span className="text-[#0D5C3A] font-medium">{med.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
