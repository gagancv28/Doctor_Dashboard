import React, { useState } from 'react';
import {
  Building2,
  Pill,
  Clock,
  Search,
  Stethoscope,
  Activity,
  FileText,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
} from 'lucide-react';
import type { LongitudinalRecord } from '../../types/socrates';

interface LongitudinalTimelineProps {
  records: LongitudinalRecord[];
  patientName: string;
}

export const LongitudinalTimeline: React.FC<LongitudinalTimelineProps> = ({
  records,
  patientName,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Filter records by category and search
  const filteredRecords = records.filter((rec) => {
    const matchesCategory =
      activeCategory === 'all' || rec.category === activeCategory;
    const matchesSearch =
      rec.symptomsDiagnoses.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.hospitalClinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.prescriptions.some((p) =>
        p.medication.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Top Header & Search Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DFD8] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#0B4F8A] font-semibold uppercase tracking-wider">
              ABHA Longitudinal History
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B4F8A]" />
            <span className="font-mono text-xs text-[#7A766C]">Cross-Facility OPD Journey</span>
          </div>
          <h2 className="text-xl font-bold text-[#111111] tracking-tight mt-0.5">
            Past Medical Journey & Prescriptions
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A867C]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search symptoms, clinics, drugs..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E2DFD8] rounded-xl text-xs text-[#111111] placeholder:text-[#8A867C] focus:outline-none focus:border-[#0B4F8A]"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'consultation', label: 'Consultations' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'lab', label: 'Lab & Diagnostics' },
          { id: 'discharge', label: 'Discharges' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-[#111111] text-[#F9F9F6]'
                : 'bg-white border border-[#E2DFD8] text-[#5E5B54] hover:text-[#111111] hover:bg-[#F5F4EF]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Vertical Timeline Nodes */}
      <div className="flex-1 space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E2DFD8] py-2">
        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center bg-white border border-[#E2DFD8] rounded-2xl text-xs text-[#8A867C]">
            No historical records matched your query "{searchQuery}".
          </div>
        ) : (
          filteredRecords.map((rec) => {
            const isExpanded = expandedRecordId === rec.id;

            return (
              <div key={rec.id} className="relative pl-10 group">
                {/* Timeline node icon */}
                <div
                  className={`absolute left-0 top-1 w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                    rec.isCurrentVisit
                      ? 'bg-[#0B4F8A] border-[#0B4F8A] text-white ring-4 ring-[#0B4F8A]/15 shadow-sm'
                      : 'bg-white border-[#DDD9CE] text-[#5E5B54] group-hover:border-[#0B4F8A] group-hover:text-[#0B4F8A]'
                  }`}
                >
                  {rec.category === 'consultation' && <Stethoscope className="w-3.5 h-3.5" />}
                  {rec.category === 'prescription' && <Pill className="w-3.5 h-3.5" />}
                  {rec.category === 'lab' && <Activity className="w-3.5 h-3.5" />}
                  {rec.category === 'discharge' && <FileText className="w-3.5 h-3.5" />}
                </div>

                {/* Timeline Node Content Card */}
                <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl shadow-xs transition-all hover:shadow-sm hover:border-[#DDD9CE] space-y-3">
                  {/* Top Bar: Date, Hospital Name, Doctor */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#111111]">
                          {rec.date}
                        </span>
                        {rec.isCurrentVisit && (
                          <span className="font-mono text-[10px] bg-[#EEF4F9] text-[#0B4F8A] px-2 py-0.5 rounded-full font-bold uppercase">
                            Current Episode
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#8A867C] uppercase">
                          • {rec.category}
                        </span>
                      </div>

                      {/* Explicit Facility / Hospital Visited */}
                      <div className="flex items-center gap-1.5 text-xs text-[#0B4F8A] font-semibold">
                        <Building2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{rec.hospitalClinic}</span>
                        {rec.department && (
                          <span className="text-[#8A867C] font-normal">({rec.department})</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-[#7A766C] block font-medium">{rec.doctorName}</span>
                      <span className="font-mono text-[10px] text-emerald-700 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" /> ABDM Signed
                      </span>
                    </div>
                  </div>

                  {/* Diagnosis & Past Symptoms */}
                  <div className="p-3 bg-[#F9F9F6] rounded-xl border border-[#EAE7DE] space-y-1">
                    <span className="font-mono text-[10px] text-[#8A867C] uppercase font-bold block">
                      Past Symptoms & Clinical Diagnosis
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#111111] leading-snug">
                      {rec.symptomsDiagnoses}
                    </p>
                    <p className="text-xs text-[#5E5B54] font-normal pt-1">
                      {rec.clinicalNotes}
                    </p>
                  </div>

                  {/* Full Medication Prescriptions with Dosage and Duration */}
                  {rec.prescriptions && rec.prescriptions.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="font-mono text-[10px] text-[#0B4F8A] uppercase font-bold flex items-center gap-1">
                        <Pill className="w-3 h-3" />
                        Full Medication Prescriptions ({rec.prescriptions.length})
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {rec.prescriptions.map((rx, rxIdx) => (
                          <div
                            key={rxIdx}
                            className="p-2.5 bg-white border border-[#E2DFD8] rounded-xl flex flex-col justify-between gap-1 shadow-2xs hover:border-[#0B4F8A]/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="font-bold text-[#111111]">{rx.medication}</span>
                              <span className="font-mono text-[10px] px-1.5 py-0.5 bg-[#F0EFEB] text-[#4A4A46] rounded shrink-0 font-medium">
                                {rx.duration}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#5E5B54] flex items-center justify-between">
                              <span>{rx.dosage}</span>
                              <span className="italic text-[#7A766C]">{rx.instructions}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expandable Lab & Clinical Details */}
                  {rec.labMetrics && rec.labMetrics.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => setExpandedRecordId(isExpanded ? null : rec.id)}
                        className="flex items-center gap-1 text-xs text-[#0B4F8A] font-semibold hover:underline"
                      >
                        <span>{isExpanded ? 'Hide Lab Parameters' : 'View Recorded Lab Parameters'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 bg-[#EEF4F9]/40 border border-[#0B4F8A]/20 rounded-xl space-y-2 text-xs animate-in fade-in duration-200">
                          <span className="font-mono text-[10px] text-[#0B4F8A] uppercase font-bold">Diagnostic Lab Metrics</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {rec.labMetrics.map((lab, lIdx) => (
                              <div key={lIdx} className="p-2 bg-white rounded-lg border border-[#E2DFD8]">
                                <span className="text-[#8A867C] block text-[10px]">{lab.test}</span>
                                <span className="font-bold text-[#111111]">{lab.result}</span>
                                <span className="text-[10px] text-[#7A766C] block font-mono">(Normal: {lab.normalRange})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Meta */}
      <div className="pt-4 border-t border-[#E2DFD8] flex items-center justify-between text-xs text-[#7A766C] font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#0B4F8A]" />
          <span>Longitudinal Sync: Real-time ABDM Gateway</span>
        </div>
        <span>Patient: {patientName}</span>
      </div>
    </div>
  );
};
