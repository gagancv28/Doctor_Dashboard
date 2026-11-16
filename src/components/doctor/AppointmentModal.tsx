import React from 'react';
import {
  X,
  Calendar,
  Globe,
  Mic,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import type { AppointmentItem } from '../../types/health';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentItem | null;
  onOpenPatient: (patientId: string) => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onOpenPatient,
}) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-[#E2DFD8] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#EAE7DE] flex items-center justify-between bg-[#FAF9F6]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0D5C3A] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#111111]">
                  Appointment {appointment.appointmentNumber}
                </h3>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    appointment.status === 'Waiting'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : appointment.status === 'In Consultation'
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
              <p className="text-xs text-[#5E5B54]">
                Source: {appointment.source} · Token: {appointment.tokenNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#EAE7DE] flex items-center justify-center text-[#5E5B54] hover:text-[#111111] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 max-h-[75vh]">
          {/* Patient Header Card */}
          <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0D5C3A] text-white font-bold flex items-center justify-center text-xs">
                {appointment.patientName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div>
                <div className="font-bold text-xs text-[#111111] flex items-center gap-1.5">
                  {appointment.patientName}
                  <span className="text-[10px] font-mono text-[#0D5C3A] font-bold">
                    {appointment.patientNumber}
                  </span>
                </div>
                <div className="text-[11px] text-[#5E5B54]">
                  {appointment.patientAge} years · {appointment.patientSex} · ABHA {appointment.abhaStatus}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono px-2 py-1 rounded-lg bg-white border border-[#E2DFD8] text-[#111111] font-bold">
              {appointment.time}
            </span>
          </div>

          {/* Appointment Clinical Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8]">
              <span className="text-[#8A867C] block font-mono text-[10px] uppercase font-bold">
                Hospital & Department
              </span>
              <span className="text-[#111111] font-medium mt-0.5 block">
                {appointment.hospital}
              </span>
              <span className="text-[#5E5B54] text-[11px]">
                {appointment.department}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8]">
              <span className="text-[#8A867C] block font-mono text-[10px] uppercase font-bold">
                Assigned Attending Doctor
              </span>
              <span className="text-[#111111] font-medium mt-0.5 block">
                {appointment.doctorName}
              </span>
              <span className="text-[#5E5B54] text-[11px]">
                Senior Attending Physician
              </span>
            </div>
          </div>

          {/* Today's Reported Complaint */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono">
                Patient Reported Complaint
              </span>
              <span className="text-[11px] text-[#0D5C3A] font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Language: {appointment.language}
              </span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] text-xs text-[#111111] font-medium leading-relaxed">
              {appointment.reportedComplaint}
            </div>
          </div>

          {/* Voice Intake Summary if available */}
          {appointment.symptomSummary && (
            <div className="space-y-2">
              <div className="text-xs font-bold text-[#111111] uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#0D5C3A]" /> Patient Intake Summary
              </div>
              <div className="p-4 rounded-xl bg-[#EBF4EE]/40 border border-[#0D5C3A]/20 text-xs text-[#5E5B54] leading-relaxed">
                {appointment.symptomSummary}
              </div>
            </div>
          )}

          {/* Consent Status */}
          <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0D5C3A]" />
              <span className="text-[#111111] font-medium">ABDM Sandbox Consent:</span>
            </div>
            <span className="font-bold text-[#0D5C3A] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {appointment.consentStatus}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EAE7DE] bg-[#FAF9F6] flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#E2DFD8] text-xs font-bold text-[#5E5B54] hover:bg-[#EAE7DE] transition-all"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenPatient(appointment.patientId);
            }}
            className="px-6 py-2 rounded-xl bg-[#0D5C3A] text-white text-xs font-bold hover:bg-[#0B4D31] transition-all flex items-center gap-1.5 shadow-xs"
          >
            Open Patient Record <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
