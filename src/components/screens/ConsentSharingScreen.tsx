import React, { useState } from 'react';
import {
  ShieldCheck,
  Check,
  Clock,
  AlertTriangle,
  XCircle,
  Building2,
  History,
  CheckCircle2,
} from 'lucide-react';
import type { ConsentGrant, AccessAuditLog } from '../../types/health';

interface ConsentSharingScreenProps {
  consent: ConsentGrant;
  accessLogs: AccessAuditLog[];
  onUpdateConsent: (updated: ConsentGrant) => void;
  onClose?: () => void;
}

export const ConsentSharingScreen: React.FC<ConsentSharingScreenProps> = ({
  consent,
  accessLogs,
  onUpdateConsent,
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(consent.sharedRecordTypes);
  const [durationHours, setDurationHours] = useState<number>(24);
  const [isGranted, setIsGranted] = useState<boolean>(consent.isActive);
  const [showRevokeToast, setShowRevokeToast] = useState<boolean>(false);

  const availableTypes = [
    { id: 'curr', label: 'Current consultation intake', hint: 'Today’s case history & vitals' },
    { id: 'headache', label: 'Previous headache consultations', hint: 'March & July 2026 OPD records' },
    { id: 'rx', label: 'Medication history & active vault', hint: 'Paracetamol & past prescriptions' },
    { id: 'lab', label: 'Lab reports & Blood tests', hint: 'CBC & Thyroid panel' },
    { id: 'all_docs', label: 'All uploaded documents & scans', hint: 'Full 14 documents in vault' },
  ];

  const toggleType = (label: string) => {
    if (selectedTypes.includes(label)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== label));
    } else {
      setSelectedTypes([...selectedTypes, label]);
    }
  };

  const handleGiveConsent = () => {
    const updated: ConsentGrant = {
      ...consent,
      sharedRecordTypes: selectedTypes,
      durationMinutes: durationHours * 60,
      isActive: true,
      grantedAt: '10:30 AM',
      expiresAt: durationHours === 24 ? 'Tomorrow, 10:30 AM' : 'Today, 11:30 AM',
    };
    onUpdateConsent(updated);
    setIsGranted(true);
  };

  const handleRevoke = () => {
    const revoked: ConsentGrant = {
      ...consent,
      isActive: false,
    };
    onUpdateConsent(revoked);
    setIsGranted(false);
    setShowRevokeToast(true);
    setTimeout(() => setShowRevokeToast(false), 3500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <span className="font-mono text-xs text-[#0D5C3A] font-semibold uppercase tracking-wider block">
            Patient-Controlled Privacy
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
            Share & Consent Manager
          </h1>
          <p className="text-xs text-[#5E5B54] mt-0.5">
            You decide what records are shared, with which clinician, and for how long.
          </p>
        </div>

        <span className="font-mono text-xs text-[#0D5C3A] bg-[#EBF4EE] px-3 py-1.5 rounded-xl border border-[#0D5C3A]/20 font-bold self-start">
          ABDM Consent Artifact v2.1
        </span>
      </div>

      {/* Recipient Healthcare Facility Card */}
      <div className="p-5 bg-white border border-[#E2DFD8] rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold">
            Requesting Clinician / Facility
          </span>
          <span className="font-mono text-[10px] text-[#0D5C3A] bg-[#EBF4EE] px-2.5 py-0.5 rounded font-bold">
            Verified OPD Node
          </span>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] border border-[#0D5C3A]/20 flex items-center justify-center text-[#0D5C3A] shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm sm:text-base text-[#111111]">
              {consent.facility}
            </div>
            <div className="text-xs text-[#5E5B54]">
              {consent.doctorName} • Purpose: <span className="font-semibold text-[#111111]">{consent.purpose}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE CONSENT STATE OR SELECTION FORM */}
      {isGranted ? (
        <div className="space-y-4">
          <div className="p-5 bg-[#EBF4EE] border-2 border-[#0D5C3A]/40 rounded-2xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0D5C3A] font-bold text-sm">
                <Check className="w-5 h-5 stroke-[3]" />
                <span>Access Granted & Active</span>
              </div>
              <span className="font-mono text-xs text-[#0D5C3A] font-bold bg-white px-2.5 py-1 rounded-lg border border-[#0D5C3A]/20">
                Expires: {consent.expiresAt}
              </span>
            </div>

            <div className="p-3.5 bg-white/80 rounded-xl space-y-2 text-xs">
              <span className="font-mono text-[10px] uppercase text-[#5E5B54] font-bold block">
                Records Included in this Grant:
              </span>
              <ul className="space-y-1 font-medium text-[#111111]">
                {selectedTypes.map((t, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0D5C3A]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#5E5B54] font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#0D5C3A]" /> Granted at {consent.grantedAt}
              </span>
              <span>Time-bound ABDM Token</span>
            </div>
          </div>

          {/* Revoke Action */}
          <button
            onClick={handleRevoke}
            className="w-full py-3.5 px-4 bg-white border border-red-200 hover:border-red-400 text-red-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <XCircle className="w-4 h-4" />
            <span>Revoke Access Immediately</span>
          </button>
        </div>
      ) : (
        /* Form to Grant Consent */
        <div className="space-y-5">
          {/* Record Selection */}
          <div className="space-y-2.5">
            <span className="font-mono text-xs uppercase tracking-wider text-[#5E5B54] font-semibold block">
              Choose records to share with doctor:
            </span>

            <div className="space-y-2">
              {availableTypes.map((item) => {
                const isChecked = selectedTypes.includes(item.label);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleType(item.label)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all focus:outline-none ${
                      isChecked
                        ? 'border-[#0D5C3A] bg-[#EBF4EE] ring-1 ring-[#0D5C3A]'
                        : 'border-[#E2DFD8] bg-white hover:border-[#111111]'
                    }`}
                  >
                    <div>
                      <div className={`font-bold text-xs sm:text-sm ${isChecked ? 'text-[#0D5C3A]' : 'text-[#111111]'}`}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-[#5E5B54] mt-0.5">{item.hint}</div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                        isChecked
                          ? 'border-[#0D5C3A] bg-[#0D5C3A] text-white'
                          : 'border-[#C8C4BA] bg-white'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration Selector */}
          <div className="p-4 bg-white border border-[#E2DFD8] rounded-xl space-y-2.5">
            <span className="font-mono text-[10px] uppercase text-[#8A867C] font-semibold block">
              Access Duration (Time-Bound)
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs font-mono font-semibold">
              {[
                { h: 1, label: '1 Hour' },
                { h: 24, label: '24 Hours (Recommended)' },
                { h: 72, label: '3 Days' },
              ].map((d) => (
                <button
                  key={d.h}
                  onClick={() => setDurationHours(d.h)}
                  className={`py-2.5 px-3 rounded-xl border transition-all ${
                    durationHours === d.h
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-[#FAF9F6] border-[#E2DFD8] text-[#111111] hover:border-[#111111]'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGiveConsent}
            className="w-full py-4 px-4 bg-[#0D5C3A] hover:bg-[#08482A] text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Give Consent for this Consultation</span>
          </button>
        </div>
      )}

      {/* Revocation Toast */}
      {showRevokeToast && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2.5 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>Access revoked. The doctor workstation can no longer view these health records.</span>
        </div>
      )}

      {/* ACCESS HISTORY AUDIT LOG */}
      <div className="pt-4 border-t border-[#E2DFD8] space-y-3">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#0D5C3A]" />
          <h2 className="font-bold text-sm sm:text-base text-[#111111]">
            Who accessed my health records? (Audit Trail)
          </h2>
        </div>
        <p className="text-xs text-[#5E5B54]">
          Complete tamper-evident log of all healthcare providers and clinicians who have accessed your records.
        </p>

        <div className="space-y-2.5 pt-1">
          {accessLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 bg-white border border-[#E2DFD8] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#111111]">{log.accessorName}</span>
                  <span className="text-[#8A867C]">•</span>
                  <span className="text-[#5E5B54]">{log.facility}</span>
                </div>
                <div className="text-[11px] text-[#5E5B54]">
                  Viewed: <span className="font-medium text-[#111111]">{log.accessedRecords.join(', ')}</span>
                </div>
                <div className="text-[10px] text-[#8A867C] font-mono">Purpose: {log.purpose}</div>
              </div>

              <div className="text-right shrink-0">
                <span
                  className={`font-mono text-[9px] uppercase px-2 py-0.5 rounded font-bold ${
                    log.status === 'Active'
                      ? 'bg-[#EBF4EE] text-[#0D5C3A]'
                      : 'bg-[#FAF9F6] text-[#8A867C] border border-[#E2DFD8]'
                  }`}
                >
                  {log.status === 'Active' ? 'Active Access' : 'Access Expired'}
                </span>
                <span className="text-[10px] text-[#8A867C] font-mono block mt-1">
                  {log.accessedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
