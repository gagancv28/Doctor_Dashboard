import React, { useState } from 'react';
import {
  Stethoscope,
  Pill,
  Activity,
  Building,
  FileText,
  CheckCircle2,
  Share2,
  Sparkles,
  PlusCircle,
  ShieldCheck,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';
import type { HealthRecord, RecordCategory } from '../../types/health';

interface HealthTimelineScreenProps {
  timeline: HealthRecord[];
  onOpenRecord: (record: HealthRecord) => void;
  onOpenConsentSharing: () => void;
  onStartConsultation: () => void;
}

export const HealthTimelineScreen: React.FC<HealthTimelineScreenProps> = ({
  timeline,
  onOpenRecord,
  onOpenConsentSharing,
  onStartConsultation,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<RecordCategory | 'all'>('all');

  const filteredRecords =
    selectedCategory === 'all'
      ? timeline
      : timeline.filter((r) => r.category === selectedCategory);

  const years = Array.from(new Set(filteredRecords.map((r) => r.year))).sort((a, b) => b - a);

  const getCategoryIcon = (cat: RecordCategory) => {
    switch (cat) {
      case 'consultation':
        return <Stethoscope className="w-4 h-4 text-[#0D5C3A]" />;
      case 'prescription':
        return <Pill className="w-4 h-4 text-[#0D5C3A]" />;
      case 'lab':
        return <Activity className="w-4 h-4 text-[#0D5C3A]" />;
      case 'discharge':
        return <Building className="w-4 h-4 text-[#0D5C3A]" />;
      case 'ayush':
        return <HeartPulse className="w-4 h-4 text-[#0D5C3A]" />;
      default:
        return <FileText className="w-4 h-4 text-[#0D5C3A]" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <span className="font-mono text-xs text-[#0D5C3A] font-semibold uppercase tracking-wider block">
            Longitudinal Health History
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Patient Medical Journey
          </h1>
          <p className="text-xs text-[#5E5B54] mt-0.5">
            One chronological timeline aggregating records from all hospitals, clinics, and Ayush wellness centres.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenConsentSharing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E2DFD8] hover:border-[#111111] rounded-xl text-xs font-semibold text-[#111111] transition-colors shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
            <span>Share Timeline</span>
          </button>
          <button
            onClick={onStartConsultation}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs font-semibold transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Consultation</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {[
          { id: 'all', label: 'All Records' },
          { id: 'consultation', label: 'Consultations' },
          { id: 'prescription', label: 'Prescriptions' },
          { id: 'lab', label: 'Lab Reports' },
          { id: 'discharge', label: 'Discharge Summaries' },
          { id: 'ayush', label: 'Ayush Records' },
        ].map((tab) => {
          const isSelected = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors focus:outline-none ${
                isSelected
                  ? 'bg-[#111111] text-white shadow-xs'
                  : 'bg-white border border-[#E2DFD8] text-[#5E5B54] hover:text-[#111111]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* NEW CODESCRIBE CONSULTATION NOTIFICATION */}
      {timeline.some((r) => r.isNewCodeScribeEntry) && (
        <div className="p-4 bg-[#EBF4EE] border border-[#0D5C3A]/30 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#0D5C3A] font-bold uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Latest CodeScribe Consultation Added
            </span>
            <span className="font-mono text-[10px] bg-[#0D5C3A] text-white px-2 py-0.5 rounded font-semibold">
              Doctor Verified Today
            </span>
          </div>
          <p className="text-xs text-[#111111] leading-relaxed">
            Your recent Kannada voice-intake consultation case has been reviewed and verified by the attending physician (Dr. Sharma, MD) and permanently linked into your longitudinal health history.
          </p>
        </div>
      )}

      {/* Chronological Timeline by Year & Month */}
      <div className="space-y-8">
        {years.map((year) => {
          const yearRecords = filteredRecords.filter((r) => r.year === year);
          return (
            <div key={year} className="space-y-4">
              {/* Year Separator */}
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-sm text-[#111111] bg-white border border-[#E2DFD8] px-3 py-1 rounded-xl shadow-xs">
                  {year}
                </span>
                <div className="h-[1px] bg-[#E2DFD8] flex-1" />
                <span className="font-mono text-[10px] text-[#8A867C]">
                  {yearRecords.length} {yearRecords.length === 1 ? 'Record' : 'Records'}
                </span>
              </div>

              {/* Records in this Year */}
              <div className="space-y-3 pl-3 sm:pl-4 border-l-2 border-[#E2DFD8] ml-3">
                {yearRecords.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => onOpenRecord(rec)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 relative shadow-xs ${
                      rec.isNewCodeScribeEntry
                        ? 'bg-white border-[#0D5C3A] ring-2 ring-[#0D5C3A]/20'
                        : 'bg-white border-[#E2DFD8] hover:border-[#111111]'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] text-[#0D5C3A] shrink-0 mt-0.5">
                          {getCategoryIcon(rec.category)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm sm:text-base text-[#111111]">
                              {rec.title}
                            </span>
                            {rec.isNewCodeScribeEntry && (
                              <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-[#0D5C3A] text-white rounded font-bold">
                                CodeScribe AI
                              </span>
                            )}
                            {rec.category === 'ayush' && (
                              <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-semibold">
                                Ayush
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-[#5E5B54] font-medium mt-0.5">
                            {rec.facility} {rec.department && `• ${rec.department}`}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xs font-semibold text-[#111111] block">
                          {rec.displayDate}
                        </span>
                        <span className="text-[10px] text-[#8A867C] block font-mono">
                          {rec.month}
                        </span>
                      </div>
                    </div>

                    {/* Complaint / Diagnosis / Summary */}
                    <div className="space-y-1.5 pl-11">
                      {rec.chiefComplaint && (
                        <div className="text-xs text-[#111111]">
                          <span className="font-semibold text-[#5E5B54]">Complaint:</span>{' '}
                          <span className="font-medium">{rec.chiefComplaint}</span>
                        </div>
                      )}

                      {rec.diagnosis && (
                        <div className="text-xs text-[#0D5C3A] bg-[#EBF4EE] p-2 rounded-lg font-medium inline-block">
                          <span className="font-bold">Diagnosis:</span> {rec.diagnosis}
                        </div>
                      )}

                      <p className="text-xs text-[#5E5B54] leading-relaxed">
                        {rec.summary}
                      </p>

                      {rec.treatmentOutcome && (
                        <div className="text-[11px] text-[#111111] italic bg-[#FAF9F6] p-2 rounded-lg border border-[#E2DFD8]">
                          Outcome: “{rec.treatmentOutcome}”
                        </div>
                      )}
                    </div>

                    {/* Footer Badges */}
                    <div className="pt-2.5 border-t border-[#EAE7DE] flex items-center justify-between text-[10px] font-mono text-[#8A867C] pl-11">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#0D5C3A]" />
                        <span className="truncate max-w-[200px] sm:max-w-none">
                          Source: {rec.source.split('(')[0]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[#0D5C3A] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Doctor Verified
                        </span>
                        <span className="text-[#111111] font-semibold flex items-center gap-0.5 hover:underline">
                          <span>Full Record</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
