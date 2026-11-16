import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Stethoscope,
  Pill,
  FolderHeart,
  FileCheck2,
  ShieldCheck,
  Settings,
  Search,
  FileText,
  QrCode,
  RotateCcw,
} from 'lucide-react';
import type {
  ActiveConsultation,
  HealthRecord,
  HealthIdentity,
  PatientProfile,
  MedicationItem,
  PrescriptionRecord,
  AppointmentItem,
  SymptomHistoryItem,
  FacilityCareHistory,
  PreviousCondition,
  VaultDocument,
  AccessAuditLog,
  ConsentGrant,
  HospitalDepartment,
  DoctorProfile,
  DoctorTab,
} from '../../types/health';
import { DoctorDashboard } from './DoctorDashboard';
import { AbhaScanModal } from './AbhaScanModal';
import { AppointmentModal } from './AppointmentModal';
import { RecordDetailModal } from '../screens/RecordDetailModal';

interface DoctorWorkstationProps {
  consultCase: ActiveConsultation;
  timeline: HealthRecord[];
  identity: HealthIdentity;
  patients: PatientProfile[];
  medications: MedicationItem[];
  prescriptions: PrescriptionRecord[];
  appointments: AppointmentItem[];
  departments: HospitalDepartment[];
  symptomsHistory: SymptomHistoryItem[];
  facilitiesHistory: FacilityCareHistory[];
  previousConditions: PreviousCondition[];
  documents: VaultDocument[];
  consent: ConsentGrant;
  accessLogs: AccessAuditLog[];
  doctorProfile: DoctorProfile;
  onUpdateConsultCase: (updated: ActiveConsultation) => void;
  onVerifyAndAddToTimeline: (verifiedRecord: HealthRecord) => void;
  onSavePrescription: (
    prescription: PrescriptionRecord,
    newActiveMedications: MedicationItem[]
  ) => void;
  onResetDemo: () => void;
}

export const DoctorWorkstation: React.FC<DoctorWorkstationProps> = ({
  consultCase,
  timeline,
  identity,
  patients,
  medications,
  prescriptions,
  appointments,
  departments,
  symptomsHistory,
  facilitiesHistory,
  previousConditions,
  documents,
  consent,
  accessLogs,
  doctorProfile,
  onUpdateConsultCase,
  onVerifyAndAddToTimeline,
  onSavePrescription,
  onResetDemo,
}) => {
  const [activeTab, setActiveTab] = useState<DoctorTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<PatientProfile[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const [showAbhaScanModal, setShowAbhaScanModal] = useState<boolean>(false);
  const [selectedAppointmentForModal, setSelectedAppointmentForModal] =
    useState<AppointmentItem | null>(null);
  const [selectedRecordForDetail, setSelectedRecordForDetail] =
    useState<HealthRecord | null>(null);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live patient search handler
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    const raw = query.trim();
    if (!raw) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setShowSearchDropdown(true);
    const normalizedId = raw.replace(/^#/, '').toUpperCase();
    const qLower = raw.toLowerCase();

    // 1. Exact ID Match (P001 - P010)
    const exactMatches = patients.filter((p) => {
      const pId = p.id.toUpperCase();
      const pNum = p.patientNumber.replace(/^#/, '').toUpperCase();
      return pId === normalizedId || pNum === normalizedId || pId === `P${normalizedId}` || pNum === `P${normalizedId}`;
    });

    if (exactMatches.length > 0) {
      setSearchResults(exactMatches);
      return;
    }

    // 2. Name, Phone, ABHA, Condition Matches
    const fuzzyMatches = patients.filter((p) => {
      return (
        p.identity.name.toLowerCase().includes(qLower) ||
        p.patientNumber.toLowerCase().includes(qLower) ||
        p.identity.phone.includes(qLower) ||
        p.identity.abhaAddress.toLowerCase().includes(qLower) ||
        (p.primaryCondition || '').toLowerCase().includes(qLower)
      );
    });

    setSearchResults(fuzzyMatches);
  };

  // Open matched patient
  const handleOpenPatient = (patient: PatientProfile) => {
    onUpdateConsultCase({
      ...consultCase,
      patientId: patient.id,
      patientName: patient.identity.name,
      age: patient.identity.age,
      sex: patient.identity.sex,
      chiefComplaint: patient.primaryCondition || 'General Consultation',
    });
    setSearchQuery('');
    setShowSearchDropdown(false);
    setActiveTab('consultations');
  };

  // Left sidebar navigation menu (Clean, clinical typography and active states)
  const navItems: Array<{ id: DoctorTab; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" />, badge: `${patients.length}` },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" />, badge: `${appointments.filter((a) => a.status === 'Waiting').length} new` },
    { id: 'consultations', label: 'Consultations', icon: <Stethoscope className="w-4 h-4" />, badge: 'Active' },
    { id: 'prescriptions', label: 'Prescriptions', icon: <FileText className="w-4 h-4" />, badge: `${prescriptions.length}` },
    { id: 'medications', label: 'Medications', icon: <Pill className="w-4 h-4" />, badge: `${medications.filter((m) => m.status === 'Active').length}` },
    { id: 'records', label: 'Medical Records', icon: <FolderHeart className="w-4 h-4" />, badge: `${timeline.length}` },
    { id: 'reports', label: 'Reports', icon: <FileCheck2 className="w-4 h-4" />, badge: `${documents.length}` },
    { id: 'consent', label: 'Consent', icon: <ShieldCheck className="w-4 h-4" />, badge: 'ABDM' },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="h-screen w-full flex flex-col md:flex-row overflow-hidden bg-slate-50 text-slate-900 font-sans">
      {/* 1440 × 900 CLINICAL DESKTOP FIXED LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              CS
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900 tracking-tight">
                CodeScribe Health
              </div>
              <div className="text-[10px] text-blue-600 font-semibold font-mono">
                Doctor & Hospital Portal
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Navigation Menu (Scrolls internally if viewport is small) */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          <div className="px-3 py-1 font-mono text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Clinical Workstation
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={isActive ? 'text-blue-600' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 border border-slate-200 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM: PINNED DOCTOR PROFILE FOOTER (Permanently visible across all viewport heights) */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2.5 shrink-0 mt-auto">
          <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {doctorProfile.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 truncate">{doctorProfile.name}</div>
              <div className="text-[10px] text-blue-600 font-medium truncate">{doctorProfile.title}</div>
              <div className="text-[9px] text-slate-500 font-mono truncate">
                Reg: {doctorProfile.registrationNumber}
              </div>
              <div className="text-[9px] text-slate-500 truncate">
                {doctorProfile.hospital}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Online</span>
              </div>
            </div>
          </div>

          {/* Quick Demo Utilities */}
          <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
            <button
              onClick={onResetDemo}
              className="hover:text-slate-900 flex items-center gap-1 font-mono transition-colors"
              title="Reset state to baseline dataset"
            >
              <RotateCcw className="w-3 h-3" /> Reset Data
            </button>
            <span className="font-mono text-[9px] text-blue-600">v2.6 OPD Portal</span>
          </div>
        </div>
      </aside>

      {/* MAIN CLINICAL CONTENT AREA WITH TOP WORKSTATION BAR */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">{doctorProfile.hospital}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">{doctorProfile.department}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Clinical Gateway Active
            </div>

            {/* Active Consultation Spotlight */}
            <button
              onClick={() => setActiveTab('consultations')}
              className={`hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg text-xs transition-all ${
                activeTab === 'consultations'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-900 hover:border-blue-600'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Active Case: <strong>#{consultCase.patientId || 'P001'} {consultCase.patientName}</strong></span>
            </button>
          </div>

          {/* Top-Right Global Patient ID Search with Live Dropdown */}
          <div className="flex items-center gap-3">
            <div ref={searchContainerRef} className="relative w-64 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSearchDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (searchResults.length > 0) {
                      handleOpenPatient(searchResults[0]);
                    }
                  } else if (e.key === 'Escape') {
                    setShowSearchDropdown(false);
                  }
                }}
                placeholder="Search Patient ID (#P005), Name..."
                className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none shadow-xs"
              />

              {/* Autocomplete / Search Results Dropdown */}
              {showSearchDropdown && searchQuery.trim().length > 0 && (
                <div className="absolute right-0 top-full mt-1.5 w-80 md:w-96 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  {searchResults.length > 0 ? (
                    <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                      <div className="px-3.5 py-1.5 bg-slate-50 text-[10px] font-mono font-bold text-slate-400 uppercase">
                        Matched Patients ({searchResults.length})
                      </div>
                      {searchResults.map((patient) => (
                        <div
                          key={patient.id}
                          onClick={() => handleOpenPatient(patient)}
                          className="p-3 hover:bg-blue-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 truncate group-hover:text-blue-600">
                                {patient.identity.name}
                              </span>
                              <span className="font-mono text-xs font-bold text-blue-600 shrink-0">
                                {patient.patientNumber}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {patient.identity.age} yrs · {patient.identity.sex} · {patient.bloodGroup}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate">
                              Condition: <strong className="text-slate-700">{patient.primaryCondition}</strong>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPatient(patient);
                            }}
                            className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 transition-all shrink-0 shadow-xs cursor-pointer"
                          >
                            Open
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center space-y-2">
                      <p className="font-bold text-slate-800">Patient not found</p>
                      <p className="text-slate-500 text-[11px]">
                        No patient matches "{searchQuery}".
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchDropdown(false);
                        }}
                        className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                      >
                        Clear Search
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAbhaScanModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <QrCode className="w-4 h-4" /> Scan / Search ABHA
            </button>
          </div>
        </header>

        {/* Dynamic Screen View Router */}
        <DoctorDashboard
          currentTab={activeTab}
          onSelectTab={setActiveTab}
          consultCase={consultCase}
          timeline={timeline}
          identity={identity}
          patients={patients}
          medications={medications}
          prescriptions={prescriptions}
          appointments={appointments}
          departments={departments}
          symptomsHistory={symptomsHistory}
          facilitiesHistory={facilitiesHistory}
          previousConditions={previousConditions}
          documents={documents}
          consent={consent}
          accessLogs={accessLogs}
          doctorProfile={doctorProfile}
          onUpdateConsultCase={onUpdateConsultCase}
          onVerifyAndAddToTimeline={onVerifyAndAddToTimeline}
          onSavePrescription={onSavePrescription}
          onOpenRecord={(rec) => setSelectedRecordForDetail(rec)}
          onOpenAbhaModal={() => setShowAbhaScanModal(true)}
          onOpenAppointmentModal={(appt) => setSelectedAppointmentForModal(appt)}
          onResetDemo={onResetDemo}
        />
      </div>

      {/* ABHA QR & Search Modal */}
      <AbhaScanModal
        isOpen={showAbhaScanModal}
        onClose={() => setShowAbhaScanModal(false)}
        identity={identity}
        consent={consent}
        onPatientIdentified={() => {
          setActiveTab('consultations');
        }}
      />

      {/* Appointment Detail Modal */}
      <AppointmentModal
        isOpen={!!selectedAppointmentForModal}
        onClose={() => setSelectedAppointmentForModal(null)}
        appointment={selectedAppointmentForModal}
        onOpenPatient={() => {
          setActiveTab('consultations');
        }}
      />

      {/* Longitudinal Record Detail Modal */}
      <RecordDetailModal
        record={selectedRecordForDetail}
        onClose={() => setSelectedRecordForDetail(null)}
      />
    </div>
  );
};
