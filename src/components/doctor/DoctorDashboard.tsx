import React, { useState } from 'react';
import {
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Building2,
  FileText,
  Pill,
  CheckCircle2,
  Save,
  Sparkles,
  TrendingUp,
  Search,
  ChevronRight,
  ArrowRight,
  Lock,
  Volume2,
  History,
  Layers,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import type {
  ActiveConsultation,
  HealthRecord,
  HealthIdentity,
  MedicationItem,
  PrescriptionRecord,
  AppointmentItem,
  SymptomHistoryItem,
  FacilityCareHistory,
  PreviousCondition,
  VaultDocument,
  AccessAuditLog,
  ConsentGrant,
  PatientProfile,
  HospitalDepartment,
  DoctorProfile,
  ClinicalHandoff,
} from '../../types/health';
import { INITIAL_CLINICAL_HANDOFFS } from '../../mock/healthStore';
import { OriginalStatementModal } from './OriginalStatementModal';
import { SourceTraceabilityModal } from './SourceTraceabilityModal';
import { PrescriptionWorkflowModal } from './PrescriptionWorkflowModal';
import { PrescriptionDocumentModal } from './PrescriptionDocumentModal';
import { ClinicalHandoffModal } from './ClinicalHandoffModal';
import { FacilityVisitsModal } from './FacilityVisitsModal';

interface DoctorDashboardProps {
  currentTab: string;
  onSelectTab: (tab: any) => void;
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
  onVerifyAndAddToTimeline?: (verifiedRecord: HealthRecord) => void;
  onSavePrescription: (
    prescription: PrescriptionRecord,
    newActiveMedications: MedicationItem[]
  ) => void;
  onOpenRecord: (record: HealthRecord) => void;
  onOpenAbhaModal: () => void;
  onOpenAppointmentModal: (appt: AppointmentItem) => void;
  onResetDemo?: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  currentTab,
  onSelectTab,
  consultCase,
  timeline,
  identity,
  patients,
  medications,
  prescriptions,
  appointments,
  departments: _departments,
  symptomsHistory,
  facilitiesHistory,
  previousConditions,
  documents,
  consent,
  accessLogs,
  doctorProfile,
  onUpdateConsultCase,
  onSavePrescription,
  onOpenRecord,
  onOpenAbhaModal,
  onOpenAppointmentModal,
  onResetDemo,
}) => {
  // Clinical Handoffs State
  const [handoffs] = useState<ClinicalHandoff[]>(INITIAL_CLINICAL_HANDOFFS);
  const [selectedHandoffForModal, setSelectedHandoffForModal] = useState<ClinicalHandoff | null>(
    null
  );
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [resetSuccessMessage, setResetSuccessMessage] = useState<boolean>(false);

  // Doctor Interactive Review State
  const [severity, setSeverity] = useState<number>(consultCase.doctorAdjustedSeverity || 6);
  const [doctorNotes, setDoctorNotes] = useState<string>(
    consultCase.doctorNotes ||
      'Unilateral pulsatile headache exacerbated by light triggers. Consistent with acute Migraine without aura (ICD-10 G43.0). Advised oral rehydration and dark room rest.'
  );
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState<string>(
    consultCase.provisionalDiagnosis || 'Migraine without aura (ICD-10 G43.0)'
  );
  const [prescribedTreatment, setPrescribedTreatment] = useState<string>(
    consultCase.prescribedTreatment ||
      'Tab. Paracetamol 500mg Twice daily for 3 days after food + Tab. Domperidone 10mg SOS; Rest in dark quiet room; Adequate hydration.'
  );

  // Relevant vs Complete History Toggle
  const [relevantHistoryOnly, setRelevantHistoryOnly] = useState<boolean>(true);

  // Selected drilldown items
  const [selectedFacility, setSelectedFacility] = useState<FacilityCareHistory | null>(
    facilitiesHistory[0]
  );
  const [selectedFacilityForModal, setSelectedFacilityForModal] =
    useState<FacilityCareHistory | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<SymptomHistoryItem | null>(
    symptomsHistory[0]
  );
  const [selectedPrescriptionForDoc, setSelectedPrescriptionForDoc] =
    useState<PrescriptionRecord | null>(null);

  // Modals state
  const [showOriginalStatementModal, setShowOriginalStatementModal] = useState<boolean>(false);
  const [showSourceTraceModal, setShowSourceTraceModal] = useState<boolean>(false);
  const [showPrescriptionWorkflowModal, setShowPrescriptionWorkflowModal] =
    useState<boolean>(false);

  // Search and filter states
  const [patientSearchQuery, setPatientSearchQuery] = useState<string>('');
  const [appointmentSearch, setAppointmentSearch] = useState<string>('');
  const [appointmentFilterStatus, setAppointmentFilterStatus] = useState<string>('all');
  const [appointmentFilterPriority, setAppointmentFilterPriority] = useState<string>('all');
  const [documentCategoryFilter, setDocumentCategoryFilter] = useState<string>('all');
  const [medicationStatusFilter, setMedicationStatusFilter] = useState<'all' | 'Active' | 'Completed'>('all');

  const activeMeds = medications.filter((m) => m.status === 'Active');
  const previousMeds = medications.filter((m) => m.status === 'Completed');

  // Handle saving draft adjustments
  const handleSaveDraft = () => {
    onUpdateConsultCase({
      ...consultCase,
      doctorAdjustedSeverity: severity,
      doctorNotes,
      provisionalDiagnosis,
      prescribedTreatment,
    });
  };

  // Start Consultation from Handoff (Carries data without re-entry)
  const handleStartConsultationFromHandoff = (handoff: ClinicalHandoff) => {
    onUpdateConsultCase({
      ...consultCase,
      patientName: handoff.patientName,
      age: handoff.age,
      sex: handoff.gender,
      language: handoff.language,
      languageCode: handoff.languageCode,
      chiefComplaint: handoff.chiefComplaint,
      duration: handoff.duration,
      severity: handoff.severity,
      doctorAdjustedSeverity: handoff.doctorAdjustedSeverity || handoff.severity,
      associatedSymptoms: handoff.associatedSymptoms,
      location: handoff.location || 'Temporal',
      rawTranscript: handoff.originalStatement.rawTranscript,
      translatedTranscript: handoff.originalStatement.translatedTranscript,
    });
    setSeverity(handoff.doctorAdjustedSeverity || handoff.severity);
    onSelectTab('consultations');
  };

  // Filtered appointments for OPD Queue View
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.patientName.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      appt.patientNumber.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      appt.reportedComplaint.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      appt.language.toLowerCase().includes(appointmentSearch.toLowerCase());

    const matchesStatus =
      appointmentFilterStatus === 'all' ||
      (appointmentFilterStatus === 'Handoff Ready' &&
        (appt.handoffStatus === 'Handoff Ready' || appt.status === 'Waiting')) ||
      (appointmentFilterStatus === 'High Priority' && appt.priority === 'High') ||
      (appointmentFilterStatus === 'Awaiting Intake' && appt.handoffStatus === 'Awaiting Intake') ||
      (appointmentFilterStatus === 'Doctor Reviewing' && appt.handoffStatus === 'Doctor Reviewing') ||
      (appointmentFilterStatus === 'Doctor Verified' &&
        (appt.handoffStatus === 'Doctor Verified' || appt.status === 'Completed'));

    const matchesPriority =
      appointmentFilterPriority === 'all' || appt.priority === appointmentFilterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Filtered patients for Patients View
  const filteredPatients = patients.filter((p) => {
    const q = patientSearchQuery.toLowerCase();
    return (
      p.identity.name.toLowerCase().includes(q) ||
      p.patientNumber.toLowerCase().includes(q) ||
      p.identity.abhaAddress.toLowerCase().includes(q) ||
      p.identity.phone.includes(q)
    );
  });

  // Filtered documents for Reports View
  const filteredDocuments = documents.filter((doc) => {
    if (documentCategoryFilter === 'all') return true;
    return doc.category === documentCategoryFilter;
  });

  // Filtered timeline based on Relevant vs Complete history
  const filteredTimeline = relevantHistoryOnly
    ? timeline.filter(
        (r) =>
          r.chiefComplaint?.toLowerCase().includes('headache') ||
          r.title.toLowerCase().includes('headache') ||
          r.title.toLowerCase().includes('migraine') ||
          r.category === 'consultation'
      )
    : timeline;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900">
      {/* =========================================================================
          VIEW 1: DASHBOARD (Clinical Workstation Hierarchy)
          1. Doctor Context & Live Sync
          2. 4 Clinical KPI Cards
          3. Priority Queue (Immediate attention)
          4. Today's OPD Flow (Progress stages)
          5. Clinical Safety Summary (Decision support triage)
          6. New Clinical Handoffs (Real-time intake stream)
         ========================================================================= */}
      {currentTab === 'dashboard' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          {/* Top Greeting & Hospital Context */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4" /> {doctorProfile.hospital} · {doctorProfile.department}
                <span className="text-slate-300">•</span>
                <span className="text-emerald-600 flex items-center gap-1 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Sync
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                Good morning, {doctorProfile.name}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Friday, 11 Sep 2026 · OPD Room 104 · Digital Clinical Handoff Gateway Active
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenAbhaModal}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-200" /> Scan / Search ABHA Patient
              </button>
            </div>
          </div>

          {/* 1. CLINICAL KPI CARDS (4 Essential Clinical Indicators) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Patients Waiting</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">6</div>
              <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                In OPD waiting queue
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Handoffs Ready</span>
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
              </div>
              <div className="text-2xl font-black text-cyan-700 font-mono">3</div>
              <div className="text-[11px] text-cyan-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" /> First-mile intake complete
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">High Priority</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-600 font-mono">2</div>
              <div className="text-[11px] text-rose-600 font-semibold">Immediate doctor review</div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Seen Today</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono">22</div>
              <div className="text-[11px] text-emerald-600 font-semibold">15 Completed · 7 In progress</div>
            </div>
          </div>

          {/* 2. PRIORITY QUEUE (High Priority Cases Requiring Immediate Attention) */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Priority Queue — Action Required</h2>
                  <span className="text-[10px] text-slate-500">
                    Patients flagged for priority clinical assessment by triage rules
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                2 High Priority Cases
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sunita Devi */}
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Sunita Devi</span>
                      <span className="text-xs font-mono text-slate-500">58 · Female</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                        हिन्दी Hindi
                      </span>
                    </div>
                    <div className="text-xs font-bold text-rose-900 pt-0.5">
                      Chief Complaint: <span className="font-normal text-rose-950">Chest pain on exertion</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Duration: <strong>2 hours</strong> · Diaphoresis & left arm radiation
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-600 text-white shadow-xs">
                      HIGH
                    </span>
                    <span className="text-[10px] font-mono text-cyan-700 font-bold">Handoff Ready ✓</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rose-200/60">
                  <span className="text-[10px] text-slate-500 font-mono">Token 05 · Arrived 10:18 AM</span>
                  <button
                    onClick={() => {
                      const h = handoffs.find((x) => x.patientNumber === '#0512') || handoffs[1];
                      setSelectedHandoffForModal(h);
                    }}
                    className="px-3.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    Review Priority Handoff <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Arjun Mehta */}
              <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">Arjun Mehta</span>
                      <span className="text-xs font-mono text-slate-500">31 · Male</span>
                      <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-semibold text-slate-700">
                        English
                      </span>
                    </div>
                    <div className="text-xs font-bold text-rose-900 pt-0.5">
                      Chief Complaint: <span className="font-normal text-rose-950">Breathlessness on exertion</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Duration: <strong>Since morning</strong> · Wheezing after dust exposure
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-600 text-white shadow-xs">
                      HIGH
                    </span>
                    <span className="text-[10px] font-mono text-cyan-700 font-bold">Handoff Ready ✓</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-rose-200/60">
                  <span className="text-[10px] text-slate-500 font-mono">Token 06 · Arrived 10:20 AM</span>
                  <button
                    onClick={() => {
                      const h = handoffs.find((x) => x.patientNumber === '#0489') || handoffs[2];
                      setSelectedHandoffForModal(h);
                    }}
                    className="px-3.5 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    Review Priority Handoff <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TODAY'S OPD FLOW & CLINICAL SAFETY SUMMARY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's OPD Flow (Progress Card) */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">Today's OPD Flow</h2>
                </div>
                <span className="text-xs text-slate-500 font-mono">25 Total Today</span>
              </div>

              {/* Segmented Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
                <div style={{ width: '12%' }} className="bg-slate-300" title="Awaiting Intake (3)" />
                <div style={{ width: '12%' }} className="bg-cyan-500" title="Handoff Ready (3)" />
                <div style={{ width: '8%' }} className="bg-amber-500" title="Waiting Review (2)" />
                <div style={{ width: '8%' }} className="bg-blue-600" title="In Consultation (2)" />
                <div style={{ width: '60%' }} className="bg-emerald-500" title="Completed (15)" />
              </div>

              {/* Progress Count Grid */}
              <div className="grid grid-cols-3 gap-2.5 text-xs pt-1">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 text-[11px]">Awaiting Intake</span>
                  <div className="font-bold font-mono text-slate-900 text-base">3</div>
                </div>
                <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200">
                  <span className="text-cyan-700 text-[11px] font-semibold">Handoff Ready</span>
                  <div className="font-bold font-mono text-cyan-800 text-base">2</div>
                </div>
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-amber-800 text-[11px] font-semibold">Waiting Review</span>
                  <div className="font-bold font-mono text-amber-800 text-base">1</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <span className="text-blue-700 text-[11px] font-semibold">In Consultation</span>
                  <div className="font-bold font-mono text-blue-800 text-base">2</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-700 text-[11px] font-semibold">Doctor Verified</span>
                  <div className="font-bold font-mono text-emerald-800 text-base">2</div>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                  <span className="text-emerald-700 text-[11px] font-semibold">Completed</span>
                  <div className="font-bold font-mono text-emerald-800 text-base">15</div>
                </div>
              </div>
            </div>

            {/* Clinical Safety Summary */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-rose-600" />
                    <h2 className="text-sm font-bold text-slate-900">Clinical Safety Summary</h2>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200">
                    2 cases requiring attention
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900">Sunita Devi:</strong> Chest pain on exertion (2 hrs)
                      <div className="text-[11px] text-rose-600 font-semibold">Priority flagged for doctor review</div>
                    </div>
                    <button
                      onClick={() => {
                        const h = handoffs.find((x) => x.patientNumber === '#0512') || handoffs[1];
                        setSelectedHandoffForModal(h);
                      }}
                      className="px-3 py-1 rounded bg-white border border-slate-200 hover:border-blue-600 font-bold text-blue-600 cursor-pointer text-[11px]"
                    >
                      Review
                    </button>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900">Arjun Mehta:</strong> Breathlessness on exertion (Since morning)
                      <div className="text-[11px] text-rose-600 font-semibold">Priority flagged for doctor review</div>
                    </div>
                    <button
                      onClick={() => {
                        const h = handoffs.find((x) => x.patientNumber === '#0489') || handoffs[2];
                        setSelectedHandoffForModal(h);
                      }}
                      className="px-3 py-1 rounded bg-white border border-slate-200 hover:border-blue-600 font-bold text-blue-600 cursor-pointer text-[11px]"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200 text-[11px] text-slate-600 leading-relaxed">
                <strong>Clinical Note:</strong> System highlights triage priority flags from patient-entered symptoms. The doctor remains solely responsible for definitive diagnosis.
              </div>
            </div>
          </div>

          {/* 4. NEW CLINICAL HANDOFFS (Connected Patient App Ingestion Stream) */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">New Clinical Handoffs</h2>
                <span className="text-[10px] font-mono text-slate-400">
                  Received digitally from CodeScribe Patient App & Hospital Intake
                </span>
              </div>
              <button
                onClick={() => onSelectTab('appointments')}
                className="text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                View Full OPD Queue ({appointments.length}) <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Lakshmi Gowda (Token 07) */}
              <div className="p-4 rounded-xl bg-white border border-blue-200 ring-1 ring-blue-100 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600">Token 07</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">Lakshmi Gowda</h3>
                    <div className="text-[11px] text-slate-500">34 · Female · ಕನ್ನಡ Kannada</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold">
                    Handoff Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                  <div className="font-semibold text-slate-900">Right-sided headache (1 day)</div>
                  <div className="text-[11px] text-slate-500">Photophobia · Voice intake · Severity 7/10</div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">Submitted 10:21 AM</span>
                  <button
                    onClick={() => {
                      const h = handoffs.find((x) => x.patientNumber === '#0247') || handoffs[0];
                      setSelectedHandoffForModal(h);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    Review Handoff →
                  </button>
                </div>
              </div>

              {/* Ravi Kumar (Token 08) */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-600">Token 08</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">Ravi Kumar</h3>
                    <div className="text-[11px] text-slate-500">45 · Male · ಕನ್ನಡ Kannada</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-[10px] font-bold">
                    Handoff Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                  <div className="font-semibold text-slate-900">Fever + cough (2 days)</div>
                  <div className="text-[11px] text-slate-500">Moderate severity · Voice intake</div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">Submitted 10:24 AM</span>
                  <button
                    onClick={() => {
                      const h = handoffs.find((x) => x.patientNumber === '#0623') || handoffs[3];
                      setSelectedHandoffForModal(h);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Review Handoff →
                  </button>
                </div>
              </div>

              {/* Ananya Rao (Token 09) */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-600">Token 09</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">Ananya Rao</h3>
                    <div className="text-[11px] text-slate-500">29 · Female · English</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                    Doctor Reviewing
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                  <div className="font-semibold text-slate-900">Epigastric burning (3 days)</div>
                  <div className="text-[11px] text-slate-500">Sulfa allergy · Touch intake</div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] font-mono text-slate-400">Submitted 09:50 AM</span>
                  <button
                    onClick={() => {
                      const h = handoffs.find((x) => x.patientNumber === '#0198') || handoffs[4];
                      setSelectedHandoffForModal(h);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Review Handoff →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: PATIENTS DIRECTORY (All registered patient profiles)
         ========================================================================= */}
      {currentTab === 'patients' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Patient Directory</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ABHA-linked patient profiles with verified demographic and allergy registries
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
                placeholder="Search by name, ID (#0247), phone..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        {p.identity.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                          {p.identity.name}
                          <span className="font-mono text-xs text-blue-600 font-bold">
                            {p.patientNumber}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.identity.age} yrs · {p.identity.sex} · {p.bloodGroup}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      ABHA ✓
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <div className="text-slate-500 font-mono text-[11px]">
                      ABHA: <strong className="text-slate-900">{p.identity.abhaAddress}</strong>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Primary Condition: <strong className="text-slate-900">{p.primaryCondition}</strong>
                    </div>
                  </div>

                  {p.knownAllergies.length > 0 ? (
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Allergy: <strong>{p.knownAllergies[0].substance}</strong> ({p.knownAllergies[0].status})</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 italic">No known allergies documented</div>
                  )}

                  <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 font-mono">{p.previousConsultationsCount}</div>
                      <div className="text-[10px] text-slate-500">Consults</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 font-mono">{p.activeMedicationsCount}</div>
                      <div className="text-[10px] text-slate-500">Active Rx</div>
                    </div>
                    <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900 font-mono">{p.documentsCount}</div>
                      <div className="text-[10px] text-slate-500">Records</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectTab('consultations')}
                  className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  Open Patient Overview <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: APPOINTMENTS / OPD QUEUE (Full Handoff Queue with Quick Filters)
         ========================================================================= */}
      {currentTab === 'appointments' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">OPD Clinical Handoff Queue</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Incoming patient packets from CodeScribe Mobile App & hospital triage desks
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
              Today: 11 Sep 2026 ({filteredAppointments.length} Displayed)
            </span>
          </div>

          {/* Quick Filter Chips & Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
              <span className="text-slate-400 text-[11px] font-mono uppercase mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Cases' },
                { id: 'Handoff Ready', label: 'Handoff Ready ✓' },
                { id: 'High Priority', label: 'High Priority ⚠' },
                { id: 'Doctor Reviewing', label: 'Doctor Reviewing' },
                { id: 'Awaiting Intake', label: 'Awaiting Intake' },
                { id: 'Doctor Verified', label: 'Doctor Verified ✓' },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setAppointmentFilterStatus(filter.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer text-xs ${
                    appointmentFilterStatus === filter.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}

              {appointmentFilterStatus !== 'all' && (
                <button
                  onClick={() => {
                    setAppointmentFilterStatus('all');
                    setAppointmentFilterPriority('all');
                    setAppointmentSearch('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-900 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Reset
                </button>
              )}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appointmentSearch}
                onChange={(e) => setAppointmentSearch(e.target.value)}
                placeholder="Search patient, complaint, language..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
            </div>
          </div>

          {/* OPD Queue Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <th className="py-3 px-4 font-bold">Token</th>
                  <th className="py-3 px-4 font-bold">Patient</th>
                  <th className="py-3 px-4 font-bold">Language</th>
                  <th className="py-3 px-4 font-bold">Chief Complaint</th>
                  <th className="py-3 px-4 font-bold">Duration</th>
                  <th className="py-3 px-4 font-bold">Priority</th>
                  <th className="py-3 px-4 font-bold">Handoff Status</th>
                  <th className="py-3 px-4 font-bold">Updated</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-600">{appt.tokenNumber}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{appt.patientName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {appt.patientAge}y · {appt.patientSex} · {appt.patientNumber}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                        {appt.nativeLanguage ? `${appt.nativeLanguage} ` : ''}({appt.language})
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {appt.reportedComplaint}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">{appt.duration || '1 day'}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          appt.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : appt.priority === 'Moderate'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {appt.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                          appt.handoffStatus === 'Handoff Ready' || appt.status === 'Waiting'
                            ? 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : appt.handoffStatus === 'In Consultation' || appt.status === 'In Consultation'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : appt.handoffStatus === 'Doctor Verified' || appt.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {appt.handoffStatus === 'Handoff Ready' ? <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> : null}
                        {appt.handoffStatus || 'Handoff Ready'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {appt.updatedAt || 'Just now'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            const matched = handoffs.find((h) => h.patientNumber === appt.patientNumber);
                            if (matched) {
                              setSelectedHandoffForModal(matched);
                            } else {
                              onOpenAppointmentModal(appt);
                            }
                          }}
                          className="px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: CONSULTATIONS / PATIENT OVERVIEW (Core Screen)
          Section 1: Patient Header
          Section 2: TODAY'S CLINICAL HANDOFF (Top Positioned)
          Section 3: Penicillin Allergy Alert
          Section 4: Since Last Visit (What Changed?)
          Section 5: Relevant History vs Complete History Filter
          Section 6: Consultation Workspace (Doctor Severity Correction, Notes, Rx)
          Section 7: Longitudinal EHR Timeline
         ========================================================================= */}
      {currentTab === 'consultations' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          {/* 1. PATIENT HEADER */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                  LG
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-extrabold text-slate-900">
                      Patient #0247 — Lakshmi Gowda
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> ABHA Connected ✓
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 flex flex-wrap items-center gap-2">
                    <span>Token: <strong className="text-blue-600">Token 07</strong></span>
                    <span>•</span>
                    <span>34 years · Female</span>
                    <span>•</span>
                    <span>Blood Group: <strong className="text-slate-900">O+</strong></span>
                    <span>•</span>
                    <span className="text-blue-600 font-semibold">lakshmi.gowda@abdm</span>
                    <span>•</span>
                    <span>Hassan, Karnataka</span>
                  </div>
                </div>
              </div>

              {/* Add Prescription Primary Action */}
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setShowPrescriptionWorkflowModal(true)}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Pill className="w-4 h-4" /> Add Prescription (Write / Voice / OCR)
                </button>
              </div>
            </div>

            {/* 2. TODAY'S CLINICAL HANDOFF (PLACED AT THE VERY TOP!) */}
            <div className="p-5 rounded-xl bg-blue-50/40 border border-blue-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                      Today's Clinical Handoff
                    </h2>
                    <span className="text-[10px] text-blue-700 font-mono">
                      Source: Patient Mobile App · Submitted: 11 Sep 2026 · 10:21 AM
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Handoff Ready ✓
                  </span>
                  <button
                    onClick={() => {
                      const h = handoffs.find((x) => x.patientNumber === '#0247') || handoffs[0];
                      setSelectedHandoffForModal(h);
                    }}
                    className="px-3 py-1 rounded-lg bg-white border border-blue-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    View Full Handoff Packet →
                  </button>
                </div>
              </div>

              {/* Handoff 5-Parameter Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                    Chief Complaint
                  </span>
                  <span className="text-slate-900 font-bold mt-0.5 block">
                    Right-sided headache
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                    Duration
                  </span>
                  <span className="text-slate-900 font-medium mt-0.5 block">
                    Since yesterday evening
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                    Severity
                  </span>
                  <span className="text-amber-700 font-bold mt-0.5 block">
                    7/10 (Patient Reported)
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                    Associated Symptoms
                  </span>
                  <span className="text-slate-900 font-medium mt-0.5 block">
                    Photophobia, Mild nausea
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                    Language & Input
                  </span>
                  <span className="text-blue-600 font-semibold mt-0.5 block">
                    ಕನ್ನಡ Kannada (Voice)
                  </span>
                </div>
              </div>

              {/* Crisp Patient Summary Quote */}
              <blockquote className="p-3.5 rounded-xl bg-white border-l-4 border-blue-600 text-xs text-slate-900 font-medium leading-relaxed italic shadow-2xs">
                “Patient reports right-sided headache since yesterday evening, aggravated by bright light. Similar episodes have been documented previously.”
              </blockquote>

              {/* Timestamp Pipeline & Digital Handoff Notice */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-2 font-mono">
                  <span>Patient submitted: <strong>10:21 AM</strong></span>
                  <span>→</span>
                  <span>AI structured: <strong>10:22 AM</strong></span>
                  <span>→</span>
                  <span>Doctor received: <strong>10:22 AM</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowOriginalStatementModal(true)}
                    className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> View Original Statement (Kannada)
                  </button>
                </div>
              </div>
            </div>

            {/* 3. CRITICAL INFORMATION ALERT: Penicillin Allergy */}
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start justify-between gap-3 text-xs text-rose-950">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-sm text-rose-900 flex items-center gap-2">
                    ⚠ Known Allergy: Penicillin
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-rose-200 text-rose-900 font-bold">
                      Status: Verified
                    </span>
                  </div>
                  <div className="text-rose-800 text-[11px] mt-0.5">
                    Source: Previous clinical record (City Care Hospital OPD · 04 Jul 2026). Do NOT prescribe Penicillin or Beta-lactams.
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-rose-700 bg-rose-100 px-2 py-1 rounded-md font-semibold">
                Critical Safety Alert
              </span>
            </div>

            {/* PATIENT SNAPSHOT (4 Compact Summary Cards) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
              <div
                onClick={() => onSelectTab('records')}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition-all space-y-1"
              >
                <div className="text-[11px] text-slate-500 font-medium">Previous Consultations</div>
                <div className="text-xl font-black text-slate-900 font-mono">8</div>
                <div className="text-[10px] text-blue-600 font-semibold">3 headache-related</div>
              </div>

              <div
                onClick={() => onSelectTab('medications')}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition-all space-y-1"
              >
                <div className="text-[11px] text-slate-500 font-medium">Active Medications</div>
                <div className="text-xl font-black text-slate-900 font-mono">2</div>
                <div className="text-[10px] text-blue-600 font-semibold">Paracetamol, Domperidone</div>
              </div>

              <div
                onClick={() => onSelectTab('reports')}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 cursor-pointer transition-all space-y-1"
              >
                <div className="text-[11px] text-slate-500 font-medium">Documents Vault</div>
                <div className="text-xl font-black text-slate-900 font-mono">14</div>
                <div className="text-[10px] text-blue-600 font-semibold">Labs, Prescriptions, Imaging</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[11px] text-slate-500 font-medium">Known Allergies</div>
                <div className="text-xl font-black text-rose-600 font-mono">1</div>
                <div className="text-[10px] text-rose-600 font-semibold">Penicillin (Verified)</div>
              </div>
            </div>
          </div>

          {/* 4. "SINCE LAST VISIT" (What Changed?) & CLINICAL CONTINUITY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Since Last Visit */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm font-bold text-slate-900">Since Last Visit (What Changed?)</h2>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Last Visit: 12 Aug 2026</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                  <span className="font-bold text-amber-800 font-mono text-[10px] uppercase bg-amber-200 px-1.5 py-0.5 rounded shrink-0">
                    New Symptom
                  </span>
                  <div>
                    <strong className="text-amber-900">Photophobia:</strong> Newly reported sensitivity to glare with today's episode.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-blue-600 font-mono text-[10px] uppercase bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                    Recurrence
                  </span>
                  <div>
                    <strong className="text-slate-900">Right-sided headache:</strong> Recurrent unilateral flare-up similar to March & July 2026 episodes.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-slate-600 font-mono text-[10px] uppercase bg-slate-200 px-1.5 py-0.5 rounded shrink-0">
                    Medication
                  </span>
                  <div>
                    <strong className="text-slate-900">Cetirizine 10mg:</strong> 7-day antihistamine course completed in July.
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-emerald-600 font-mono text-[10px] uppercase bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                    Recent Report
                  </span>
                  <div>
                    <strong className="text-slate-900">CBC Lab Report:</strong> Normal findings (Hb: 12.8 g/dL, WBC: 7,400 /mcL).
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                  <span className="font-bold text-emerald-600 font-mono text-[10px] uppercase bg-emerald-50 px-1.5 py-0.5 rounded shrink-0">
                    Previous Response
                  </span>
                  <div>
                    <strong className="text-slate-900">Paracetamol 500mg:</strong> Symptoms improved after previous August treatment.
                  </div>
                </div>
              </div>
            </div>

            {/* Clinical Continuity Summary & Sources */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    <h2 className="text-sm font-bold text-slate-900">Clinical Continuity Summary</h2>
                  </div>
                  <button
                    onClick={() => setShowSourceTraceModal(true)}
                    className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Sources (4)
                  </button>
                </div>

                <p className="text-xs text-slate-900 leading-relaxed">
                  “Patient has documented recurrent headache consultations across three facilities since March 2026. Previous treatment included Paracetamol with partial to good improvement. Today's presentation includes recurrent right-sided headache with new photophobia.”
                </p>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-900 block text-[11px] uppercase font-mono text-slate-400">
                    Traceable Sources:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-blue-600 font-medium">
                      • Patient Voice Intake (Today)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-blue-600 font-medium">
                      • 12 Aug Consultation (Govt Hosp)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-blue-600 font-medium">
                      • 04 Jul Prescription & CBC (City Care)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-blue-600 font-medium">
                      • 18 Mar Neurology Note (Specialty Clinic)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                    AI-assisted
                  </span>
                  Verify against source records before clinical use.
                </span>
                <span className="text-blue-600 font-bold">Decision Support Only</span>
              </div>
            </div>
          </div>

          {/* 5. CLINICAL WORKSPACE: FORM & RELEVANT HISTORY FILTER */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT 2 COLS: CLINICAL CONSULTATION FORM (CARRIES HANDOFF) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    <h2 className="text-base font-bold text-slate-900">Clinical Consultation Workspace</h2>
                  </div>
                  <span className="text-xs font-mono text-blue-600 font-bold bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                    Handoff Auto-Populated
                  </span>
                </div>

                {/* Pre-populated Case Attributes from Handoff */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Location</span>
                    <p className="text-slate-900 font-medium mt-0.5">{consultCase.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Onset & Duration</span>
                    <p className="text-slate-900 font-medium mt-0.5">{consultCase.onset}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Associated Symptoms</span>
                    <p className="text-slate-900 font-medium mt-0.5">{consultCase.associatedSymptoms.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Triggers Identified</span>
                    <p className="text-slate-900 font-medium mt-0.5">{consultCase.triggers}</p>
                  </div>
                </div>

                {/* DOCTOR SEVERITY CORRECTION: Patient Reported 7/10 vs Doctor Adjusted 6/10 */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">Pain Severity Assessment</span>
                      <div className="text-[11px] text-slate-500">
                        Patient reported: <strong className="text-amber-700">7/10</strong> · Doctor adjusted:{' '}
                        <strong className="text-blue-600">{severity}/10</strong>
                      </div>
                    </div>
                    <span className="text-base font-bold text-blue-600 font-mono">{severity} / 10</span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>1 (Mild)</span>
                    <span>5 (Moderate)</span>
                    <span>7 (Pt Reported)</span>
                    <span>10 (Severe)</span>
                  </div>
                </div>

                {/* Provisional Diagnosis */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900">
                    Provisional Clinical Diagnosis (ICD-10)
                  </label>
                  <input
                    type="text"
                    value={provisionalDiagnosis}
                    onChange={(e) => setProvisionalDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 font-medium focus:border-blue-600 focus:outline-none"
                    placeholder="e.g. Migraine without aura (ICD-10 G43.0)"
                  />
                </div>

                {/* Doctor Clinical Notes */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900">
                    Doctor Clinical Notes & Observations
                  </label>
                  <textarea
                    rows={3}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
                    placeholder="Enter clinical examination notes..."
                  />
                </div>

                {/* Prescribed Treatment Advice Text */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-900">
                    Treatment Plan & Lifestyle Advice
                  </label>
                  <textarea
                    rows={2}
                    value={prescribedTreatment}
                    onChange={(e) => setPrescribedTreatment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-900 focus:border-blue-600 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <button
                    onClick={handleSaveDraft}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" /> Save Clinical Draft
                  </button>

                  <button
                    onClick={() => setShowPrescriptionWorkflowModal(true)}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Pill className="w-4 h-4" /> Add & Verify Prescription →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT 1 COL: RELEVANT HISTORY FOCUS & QUICK CONTEXT */}
            <div className="space-y-5">
              {/* Critical Allergy */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Known Allergies (1)
                  </span>
                  <span className="text-[10px] font-mono text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full font-semibold">
                    Verified
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                  <div className="font-bold text-rose-900">Penicillin</div>
                  <div className="text-[11px] text-rose-700">City Care Hospital · 04 Jul 2026</div>
                </div>
              </div>

              {/* Active Meds */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-blue-600" /> Active Medications ({activeMeds.length})
                  </span>
                  <button
                    onClick={() => onSelectTab('medications')}
                    className="text-[11px] text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2">
                  {activeMeds.map((med) => (
                    <div
                      key={med.id || med.name}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{med.name} {med.dosage}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-50 text-blue-600 font-bold border border-blue-200">
                          Active
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {med.frequency} · {med.facility}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Headache History Focus */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-blue-600" /> Relevant History (3 Visits)
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 font-bold">Headache Focus</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">12 Aug 2026 · Govt Gen Hospital</div>
                    <div className="text-[11px] text-slate-500">Tension headache → Paracetamol 500mg SOS</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">04 Jul 2026 · City Care Hospital</div>
                    <div className="text-[11px] text-slate-500">Headache + nausea → Paracetamol + Domperidone</div>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">18 Mar 2026 · Specialty Clinic</div>
                    <div className="text-[11px] text-slate-500">Migraine episode → Analgesics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6. LONGITUDINAL MEDICAL HISTORY TIMELINE (WITH RELEVANT HISTORY TOGGLE) */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Longitudinal Medical History</h2>
                <p className="text-xs text-slate-500">
                  {relevantHistoryOnly
                    ? 'Showing relevant headache & neurology consultations'
                    : 'Showing complete chronological history across all facilities'}
                </p>
              </div>

              {/* Toggle Relevant vs Complete History */}
              <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-semibold self-start sm:self-auto">
                <button
                  onClick={() => setRelevantHistoryOnly(true)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    relevantHistoryOnly
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Show Relevant History (Focused)
                </button>
                <button
                  onClick={() => setRelevantHistoryOnly(false)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                    !relevantHistoryOnly
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  View Complete History ({timeline.length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {filteredTimeline.map((record) => (
                <div
                  key={record.id}
                  className={`p-5 rounded-xl border transition-all space-y-3 ${
                    record.id === 'rec-04'
                      ? 'bg-slate-50 border-blue-300 ring-1 ring-blue-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-mono font-bold text-xs text-slate-900">
                        {record.displayDate}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">{record.facility}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">
                        Dept: {record.department || 'General OPD'}
                      </span>
                      {record.doctorVerified && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Doctor Verified
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Complaint</span>
                      <p className="font-bold text-slate-900 mt-0.5">{record.chiefComplaint || record.title}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Treatment / Medication</span>
                      <p className="text-slate-900 font-medium mt-0.5">
                        {record.details?.medications?.[0]?.name || record.summary}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Outcome</span>
                      <p className="text-emerald-600 font-semibold mt-0.5">{record.treatmentOutcome}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs text-slate-500">
                    <span>Source: {record.source}</span>
                    <button
                      onClick={() => onOpenRecord(record)}
                      className="text-blue-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      View Encounter Records <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. PREVIOUS ILLNESSES & HEALTHCARE JOURNEY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Previous Illnesses */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <h2 className="text-sm font-bold text-slate-900">Previous Illnesses & Conditions</h2>
                <span className="text-[10px] font-mono text-blue-600">1 Chronic Profile</span>
              </div>

              <div className="space-y-3">
                {previousConditions.map((cond) => (
                  <div
                    key={cond.condition}
                    className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{cond.condition}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                        {cond.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>First Recorded: <strong className="text-slate-900">{cond.firstRecorded}</strong></div>
                      <div>Last Recorded: <strong className="text-slate-900">{cond.lastRecorded}</strong></div>
                      <div>Total Visits: <strong className="text-slate-900">{cond.visitCount}</strong></div>
                      <div>Distinct Facilities: <strong className="text-slate-900">{cond.facilitiesCount}</strong></div>
                    </div>

                    <div className="p-2 rounded-lg bg-white border border-slate-200">
                      <span className="font-semibold text-slate-900">Treatment Received: </span>
                      {cond.treatmentReceived}
                    </div>

                    <div className="text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-900">Outcome: </span>
                      {cond.outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Healthcare Journey */}
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Healthcare Journey</h2>
                  <span className="text-[10px] text-slate-500">Where has this patient received care?</span>
                </div>
                <span className="text-[10px] font-mono text-blue-600">3 Facilities</span>
              </div>

              <div className="space-y-3">
                {facilitiesHistory.map((fac) => {
                  const isExpanded = selectedFacility?.name === fac.name;
                  return (
                    <div
                      key={fac.name}
                      className={`rounded-lg border transition-all overflow-hidden ${
                        isExpanded
                          ? 'bg-blue-50/70 border-blue-500 ring-1 ring-blue-300'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div
                        onClick={() => {
                          setSelectedFacility(isExpanded ? null : fac);
                        }}
                        className="p-3.5 cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{fac.name}</span>
                          <span className="font-mono text-xs text-blue-600 font-bold">
                            {fac.visitCount} visits
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{fac.location} · {fac.departments.join(', ')}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFacility(fac);
                              setSelectedFacilityForModal(fac);
                            }}
                            className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                          >
                            Click for visits →
                          </button>
                        </div>
                      </div>

                      {/* Accordion visits view */}
                      {isExpanded && (
                        <div className="p-3.5 bg-white border-t border-blue-200 space-y-2 text-xs animate-in fade-in duration-100">
                          <div className="font-bold text-xs text-blue-700 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5" /> Visits at {fac.name}:
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedFacilityForModal(fac);
                              }}
                              className="text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                            >
                              Open Full Modal View ↗
                            </button>
                          </div>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto">
                            {fac.visits.map((v, i) => (
                              <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] space-y-0.5">
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                  <span>{v.date}</span>
                                  <span className="text-blue-600 font-mono text-[10px]">{v.department || 'OPD'}</span>
                                </div>
                                <div className="text-slate-800 font-medium">{v.complaint}</div>
                                <div className="text-slate-500">Treatment: {v.treatment} {v.prescription ? `· Rx: ${v.prescription}` : ''}</div>
                                <div className="text-emerald-700 font-semibold text-[10px]">Outcome: {v.outcome}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 8. SYMPTOMS OVER TIME */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Symptoms Over Time</h2>
                <p className="text-xs text-slate-500">Frequency, first/last reported dates, and treatment outcomes</p>
              </div>
              <span className="text-[10px] font-mono text-blue-600 font-bold">4 Tracked Symptoms</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {symptomsHistory.map((sym) => (
                <div
                  key={sym.symptom}
                  onClick={() => setSelectedSymptom(sym)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all space-y-1.5 ${
                    selectedSymptom?.symptom === sym.symptom
                      ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{sym.symptom}</span>
                    <span className="font-mono text-xs text-blue-600 font-bold">{sym.visitCount} visits</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Status: <strong className={sym.status === 'Recurring' ? 'text-amber-700' : 'text-emerald-600'}>{sym.status}</strong>
                  </div>
                  <div className="text-[10px] text-slate-400">First: {sym.firstReported}</div>
                </div>
              ))}
            </div>

            {selectedSymptom && (
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                  <span>Detailed History: {selectedSymptom.symptom}</span>
                  <span className="text-blue-600 font-mono">Reported across {selectedSymptom.facilities.length} Facilities</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                  <div>Facilities: <strong className="text-slate-900">{selectedSymptom.facilities.join(', ')}</strong></div>
                  <div>Related Meds: <strong className="text-slate-900">{selectedSymptom.relatedMedications.join(', ')}</strong></div>
                </div>
                <div className="text-[11px] text-slate-500">
                  Outcomes: <strong className="text-slate-900">{selectedSymptom.outcomes.join(' · ')}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: PRESCRIPTIONS (Master Prescriptions Ledger & PDF viewer)
         ========================================================================= */}
      {currentTab === 'prescriptions' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Prescriptions Management</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Doctor verified clinical prescriptions with audit trail and mobile app synchronization
              </p>
            </div>

            <button
              onClick={() => setShowPrescriptionWorkflowModal(true)}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Pill className="w-4 h-4" /> Add New Prescription (Write / Voice / OCR)
            </button>
          </div>

          {/* Prescriptions List */}
          <div className="space-y-4">
            {prescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{rx.date}</span>
                      <span className="font-mono text-xs text-slate-500">({rx.time || '10:52 AM'})</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        {rx.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {rx.facility} · {rx.doctorName} (Reg: {rx.doctorRegistration})
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPrescriptionForDoc(rx)}
                    className="px-4 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" /> View Prescription Document
                  </button>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {rx.items.map((it, idx) => (
                    <div
                      key={it.id || idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">
                          {idx + 1}. {it.medicine} {it.dose}
                        </span>
                        <span className="text-[10px] font-mono text-blue-600 font-bold">
                          {it.route || 'Oral'}
                        </span>
                      </div>
                      <div className="text-slate-500">
                        Frequency: <strong className="text-slate-900">{it.frequency}</strong> for{' '}
                        <strong className="text-slate-900">{it.duration}</strong>
                      </div>
                      {it.instructions && (
                        <div className="text-[11px] text-blue-600 font-semibold">
                          Instructions: {it.instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {rx.additionalAdvice && (
                  <div className="text-xs text-slate-500">
                    <strong className="text-slate-900">Advice:</strong> {rx.additionalAdvice}
                  </div>
                )}

                {/* Audit Line */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Audit Source: {rx.source}</span>
                  <span>Verified by: {rx.verifiedBy || rx.doctorName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 6: MEDICATIONS (Dedicated Longitudinal Medication History)
         ========================================================================= */}
      {currentTab === 'medications' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Medication Registry & History</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Current and historical medications across all linked facilities
              </p>
            </div>

            {/* Filter */}
            <div className="flex p-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold">
              <button
                onClick={() => setMedicationStatusFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  medicationStatusFilter === 'all'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({medications.length})
              </button>
              <button
                onClick={() => setMedicationStatusFilter('Active')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  medicationStatusFilter === 'Active'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({activeMeds.length})
              </button>
              <button
                onClick={() => setMedicationStatusFilter('Completed')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  medicationStatusFilter === 'Completed'
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({previousMeds.length})
              </button>
            </div>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {medications
              .filter((m) => medicationStatusFilter === 'all' || m.status === medicationStatusFilter)
              .map((med) => (
                <div
                  key={med.id || med.name}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {med.name} <span className="font-mono text-sm text-blue-600">{med.dosage}</span>
                      </h3>
                      <span className="text-xs text-slate-500">{med.reason}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        med.status === 'Active'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {med.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div>
                      <span className="text-slate-400">Frequency:</span> <strong className="text-slate-900">{med.frequency}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Route:</span> <strong className="text-slate-900">{med.route || 'Oral'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Start Date:</span> <strong className="text-slate-900">{med.startDate}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Duration:</span> <strong className="text-slate-900">{med.duration || 'As prescribed'}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400">Prescribed by:</span> <strong className="text-slate-900">{med.prescribedBy}</strong> ({med.facility})
                    </div>
                  </div>

                  {med.outcome && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-900">Outcome: </span>
                      {med.outcome}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 7: MEDICAL RECORDS (Records List & Handoff Integration)
         ========================================================================= */}
      {currentTab === 'records' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Longitudinal Medical Records</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete clinical encounter record across Government General Hospital, City Care, and Private Clinics
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {timeline.map((record) => (
              <div
                key={record.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 font-mono font-bold text-xs text-slate-900">
                      {record.displayDate}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{record.title}</h3>
                      <div className="text-xs text-slate-500">
                        {record.facility} · {record.doctor || 'Attending Physician'} · Case: <span className="font-mono text-blue-600 font-bold">CS-0247</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Doctor Verified
                    </span>
                    <button
                      onClick={() => onOpenRecord(record)}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      Open Clinical Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">{record.summary}</p>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Chief Complaint: <strong className="text-slate-900">{record.chiefComplaint || 'Consultation'}</strong></span>
                  <span>Outcome: <strong className="text-emerald-600">{record.treatmentOutcome || 'Documented'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 8: REPORTS & DOCUMENTS (Vault of Lab Reports, Imaging, Prescriptions)
         ========================================================================= */}
      {currentTab === 'reports' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Medical Documents & Diagnostic Reports</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Prescription slips, complete blood counts, imaging, and discharge summaries
              </p>
            </div>

            {/* Filter by Category */}
            <div className="flex p-1 bg-white border border-slate-200 rounded-lg text-xs font-semibold">
              {['all', 'prescriptions', 'labs', 'discharge'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDocumentCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md capitalize transition-all cursor-pointer ${
                    documentCategoryFilter === cat
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xs text-slate-900">{doc.title}</h3>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {doc.facility} · {doc.date}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {doc.category}
                    </span>
                  </div>

                  {doc.ocrExtraction && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
                      <span className="font-bold text-slate-900 block text-[11px]">
                        Extracted Clinical Notes:
                      </span>
                      <p className="leading-relaxed">{doc.ocrExtraction.notes}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>Size: {doc.fileSize} · {doc.fileType}</span>
                  <span className="text-emerald-600 font-bold">OCR Processed ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 9: CONSENT & AUDIT TRAIL (Live ABHA Sandbox Token & Access Logs)
         ========================================================================= */}
      {currentTab === 'consent' && (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Consent & Clinical Audit Trail</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                ABDM Sandbox consent grants, token durations, and immutable clinical modification logs
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              ABDM Sandbox Gateway Active
            </span>
          </div>

          {/* Active Consent Grant Card */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-bold text-slate-900">Active Patient Consent Grant</h2>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Status: ✓ Active (24hr OPD Duration)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Patient</span>
                <p className="font-bold text-slate-900 mt-0.5">{consent.patientName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Authorized Doctor</span>
                <p className="font-bold text-slate-900 mt-0.5">{consent.doctorName}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Purpose</span>
                <p className="font-medium text-slate-900 mt-0.5">{consent.purpose}</p>
              </div>
              <div>
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">Artifact ID</span>
                <p className="font-mono text-blue-600 font-bold mt-0.5 truncate">{consent.abdmConsentArtifactId}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 block">Authorized Data Types:</span>
              <div className="flex flex-wrap gap-2">
                {consent.sharedRecordTypes.map((t) => (
                  <span key={t} className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-blue-600 font-semibold">
                    ✓ {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Access Audit Trail Ledger */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Clinical Access & Modification Audit Trail</h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                    <th className="py-3 px-4 font-bold">Timestamp</th>
                    <th className="py-3 px-4 font-bold">Accessor</th>
                    <th className="py-3 px-4 font-bold">Facility & Role</th>
                    <th className="py-3 px-4 font-bold">Records Accessed / Modified</th>
                    <th className="py-3 px-4 font-bold">Source</th>
                    <th className="py-3 px-4 font-bold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {accessLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono text-slate-900">{log.accessedAt}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.accessorName}</td>
                      <td className="py-3 px-4 text-slate-500">{log.facility} ({log.role})</td>
                      <td className="py-3 px-4 text-slate-900">{log.accessedRecords.join(', ')}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-mono text-blue-600">
                          {log.modificationSource || 'Written'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{log.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 10: SETTINGS (Doctor Registration, Hospital Station, ABDM Config)
         ========================================================================= */}
      {currentTab === 'settings' && (
        <div className="p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
          <div className="border-b border-slate-200 pb-5">
            <h1 className="text-2xl font-extrabold text-slate-900">Clinical Workstation Settings</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Doctor credentials, hospital registration, and ABDM sandbox gateway parameters
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900">Physician Profile & State Medical Council</h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Doctor Name</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.name}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Registration Number</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.registrationNumber}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Hospital</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.hospital}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Assigned Department</label>
                <input
                  type="text"
                  disabled
                  value={doctorProfile.department}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-900"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-slate-900">ABDM Interoperability Gateway</h2>
            <div className="p-3.5 rounded-lg bg-cyan-50 border border-cyan-200 text-xs space-y-1">
              <div className="font-bold text-cyan-800">ABDM Sandbox v3.1 Protocol Connected</div>
              <p className="text-slate-600">
                This workstation connects dynamically to ABDM consent networks for simulated patient identity exchange. FHIR release 4.0.1 profiles supported.
              </p>
            </div>
          </div>

          {/* Demo Controls & Data Reset */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-amber-600" />
                <h2 className="text-base font-bold text-slate-900">Prototype Demonstration Controls</h2>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                Local State Management
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Resetting demo data will restore the default baseline clinical dataset: 10 verified patient profiles (P001–P010), incoming OPD appointments, clinical handoffs, longitudinal records, and active medication registries.
            </p>

            {resetSuccessMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Demo dataset successfully restored to initial state.
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-mono">
                Storage: Local / Mock Service Layer
              </span>
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(true)}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* 1. Clinical Handoff Packet Modal */}
      <ClinicalHandoffModal
        isOpen={!!selectedHandoffForModal}
        onClose={() => setSelectedHandoffForModal(null)}
        handoff={selectedHandoffForModal}
        onStartConsultation={(h) => handleStartConsultationFromHandoff(h)}
        onViewOriginalStatement={() => setShowOriginalStatementModal(true)}
      />

      {/* 2. Original Patient Statement Modal */}
      <OriginalStatementModal
        isOpen={showOriginalStatementModal}
        onClose={() => setShowOriginalStatementModal(false)}
        originalTranscript={consultCase.rawTranscript}
        translatedTranscript={consultCase.translatedTranscript}
        language={consultCase.language}
        source="CodeScribe Patient App (Voice Assist)"
      />

      {/* 3. Source Traceability Modal */}
      <SourceTraceabilityModal
        isOpen={showSourceTraceModal}
        onClose={() => setShowSourceTraceModal(false)}
        timeline={timeline}
        onOpenRecord={onOpenRecord}
      />

      {/* 4. Prescription Workflow Modal (Write, Voice, OCR + Mandatory Confirmation) */}
      <PrescriptionWorkflowModal
        isOpen={showPrescriptionWorkflowModal}
        onClose={() => setShowPrescriptionWorkflowModal(false)}
        patientId={consultCase.patientId || identity.id || 'P001'}
        patientName={consultCase.patientName || identity.name || 'Lakshmi Gowda'}
        onSavePrescription={onSavePrescription}
      />

      {/* 5. Prescription Document PDF Modal */}
      <PrescriptionDocumentModal
        isOpen={!!selectedPrescriptionForDoc}
        onClose={() => setSelectedPrescriptionForDoc(null)}
        prescription={selectedPrescriptionForDoc}
      />

      {/* 6. Demo Reset Confirmation Dialog Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reset All Demo Data?</h3>
                <p className="text-xs text-slate-500">This will restore the default demonstration dataset.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              All newly submitted prescriptions, updated consultation records, timeline additions, and status changes will be reset to the original mock dataset.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onResetDemo) {
                    onResetDemo();
                  }
                  setShowResetConfirmModal(false);
                  setResetSuccessMessage(true);
                  setTimeout(() => setResetSuccessMessage(false), 4000);
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Facility Care Visits Modal */}
      <FacilityVisitsModal
        isOpen={!!selectedFacilityForModal}
        onClose={() => setSelectedFacilityForModal(null)}
        facility={selectedFacilityForModal}
      />
    </div>
  );
};
