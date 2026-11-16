import React, { useEffect } from 'react';
import { X, Building2, Calendar, Pill, CheckCircle2, MapPin } from 'lucide-react';
import type { FacilityCareHistory } from '../../types/health';

interface FacilityVisitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  facility: FacilityCareHistory | null;
}

export const FacilityVisitsModal: React.FC<FacilityVisitsModalProps> = ({
  isOpen,
  onClose,
  facility,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !facility) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">{facility.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 text-[10px] font-mono font-bold border border-blue-800">
                  {facility.visitCount} Visits Documented
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-slate-400" /> {facility.location} · {facility.type}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 bg-slate-50">
          {/* Facility Summary Strip */}
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] font-mono uppercase font-bold block">
                Departments Consulted
              </span>
              <span className="font-semibold text-slate-900">{facility.departments.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] font-mono uppercase font-bold block">
                Last Encounter
              </span>
              <span className="font-mono font-bold text-blue-600">{facility.lastVisit}</span>
            </div>
          </div>

          {/* Visits Timeline Stream */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Encounter History at this Facility ({facility.visits.length})
            </h4>

            {facility.visits.map((visit, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900 font-mono">{visit.date}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-xs font-medium text-slate-600">{visit.department}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 font-semibold">
                    {visit.doctor}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">Chief Complaint: </span>
                    <strong className="text-slate-900">{visit.complaint}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Treatment & Procedures: </span>
                    <span className="text-slate-800">{visit.treatment}</span>
                  </div>
                  {visit.prescription && (
                    <div className="flex items-center gap-1.5 text-blue-600 font-medium">
                      <Pill className="w-3.5 h-3.5 shrink-0" />
                      <span>Prescribed: {visit.prescription}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Outcome: {visit.outcome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
          >
            Close Visits
          </button>
        </div>
      </div>
    </div>
  );
};
