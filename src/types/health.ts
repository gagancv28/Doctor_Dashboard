export type HandoffStatus =
  | 'Awaiting Intake'
  | 'Handoff Ready'
  | 'AI Summary Ready'
  | 'Doctor Reviewing'
  | 'In Consultation'
  | 'Doctor Verified'
  | 'Completed';

export type ClinicalHandoff = {
  id: string;
  patientId: string;
  patientName: string;
  patientNumber: string; // e.g. "#0247"
  tokenNumber: string; // e.g. "Token 07" or "GM-14"
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  language: string;
  languageNative: string;
  languageCode: string;
  chiefComplaint: string;
  duration: string;
  severity: number;
  doctorAdjustedSeverity?: number;
  associatedSymptoms: string[];
  location?: string;
  inputMethod: 'Voice' | 'Text' | 'Touch';
  conciseSummary: string;
  priority: 'Normal' | 'Moderate' | 'High';
  handoffStatus: HandoffStatus;
  consentStatus: 'Granted' | 'Pending' | 'Revoked';
  abhaStatus: 'Connected' | 'Unlinked' | 'Pending';
  source: 'Patient Mobile App' | 'Hospital OPD' | 'ABHA-linked record' | 'Walk-in Desk';
  submittedAt: string;
  aiStructuredAt: string;
  doctorReceivedAt: string;
  originalStatement: {
    language: string;
    rawTranscript: string;
    translatedTranscript: string;
    hasAudio: boolean;
  };
  relevantPreviousHistory: string;
  currentMedications: string[];
  knownAllergies: string[];
  isDigitalComplete: boolean;
  createdAt: string;
};

export type HealthIdentity = {
  id?: string;
  abhaId: string; // e.g. "91-4829-1049-2819"
  abhaAddress: string; // e.g. "lakshmi.gowda@abdm"
  name: string;
  age: number;
  sex: 'Female' | 'Male' | 'Other';
  dob: string;
  phone: string;
  kycStatus: 'Verified (ABDM Sandbox)' | 'Pending';
  bloodGroup: string;
  emergencyContact: string;
  address: string;
  state: string;
  pincode: string;
};

export type PatientProfile = {
  id: string; // e.g. "patient-0247"
  patientNumber: string; // e.g. "#0247"
  identity: HealthIdentity;
  knownAllergies: Array<{
    substance: string;
    severity: 'Severe' | 'Moderate' | 'Mild';
    status: 'Verified' | 'Reported';
    source: string;
    diagnosedDate?: string;
  }>;
  bloodGroup: string;
  previousConsultationsCount: number;
  documentsCount: number;
  activeMedicationsCount: number;
  allergiesCount: number;
  primaryCondition?: string;
  lastVisitDate?: string;
  registeredDate: string;
};

export type RecordCategory =
  | 'consultation'
  | 'prescription'
  | 'lab'
  | 'document'
  | 'hospitalization'
  | 'discharge'
  | 'ayush';

export type MedicationItem = {
  id?: string;
  name: string;
  dosage: string;
  frequency: string;
  route?: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  instructions?: string;
  prescribedBy: string;
  facility: string;
  reason: string;
  outcome?: string;
  status: 'Active' | 'Completed' | 'Discontinued';
  verifiedBy?: string;
  verifiedAt?: string;
  source?: 'Written' | 'Voice' | 'OCR' | 'Imported record' | 'Current consultation';
};

export type PrescriptionItemDetail = {
  id: string;
  medicine: string;
  dose: string;
  frequency: string;
  duration: string;
  route?: string;
  instructions: string;
  additionalAdvice?: string;
  confidence?: number;
};

export type PrescriptionRecord = {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  time?: string;
  facility: string;
  department: string;
  doctorName: string;
  doctorRegistration: string;
  items: PrescriptionItemDetail[];
  additionalAdvice?: string;
  followUpDate?: string;
  doctorVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  status: 'Doctor Verified' | 'Draft' | 'Completed' | 'Discontinued';
  source: 'Written' | 'Voice' | 'OCR' | 'Current consultation';
  originalPhotoUrl?: string;
  syncedToPatientApp: boolean;
  auditTrail: {
    createdBy: string;
    createdAt: string;
    verifiedBy: string;
    verifiedAt: string;
    sourceType: string;
  };
};

export type HealthRecord = {
  id: string;
  date: string;
  displayDate: string; // e.g. "12 Aug 2026" or "Today, 11 Sep 2026"
  year: number;
  month: string;
  category: RecordCategory;
  title: string;
  facility: string;
  doctor?: string;
  department?: string;
  chiefComplaint?: string;
  diagnosis?: string;
  clinicalObservations?: string;
  summary: string;
  treatmentOutcome?: string;
  source: string;
  originalDocumentUrl?: string;
  originalDocumentName?: string;
  doctorVerified: boolean;
  verifiedBy?: string;
  verifiedDate?: string;
  fhirReady: boolean;
  isNewCodeScribeEntry?: boolean;
  details?: {
    hpi?: string;
    associatedSymptoms?: string[];
    severity?: number;
    duration?: string;
    location?: string;
    triggers?: string;
    originalLanguage?: string;
    originalTranscript?: string;
    translatedTranscript?: string;
    medications?: MedicationItem[];
    labResults?: Array<{ test: string; result: string; normalRange: string; status: 'Normal' | 'Abnormal' | 'Borderline' }>;
    prescriptions?: string[];
    ayushCorrelation?: string;
  };
};

export type AppointmentItem = {
  id: string;
  appointmentNumber: string; // e.g. "#A-1024"
  patientId: string;
  patientNumber: string; // "#0247"
  tokenNumber: string; // "Token 07" or "GM-14"
  patientName: string;
  patientAge: number;
  patientSex: 'Female' | 'Male' | 'Other';
  date: string;
  time: string;
  hospital: string;
  department: string;
  doctorName: string;
  reportedComplaint: string;
  duration?: string;
  priority?: 'Normal' | 'Moderate' | 'High';
  handoffStatus?: HandoffStatus;
  symptomSummary: string;
  language: string;
  nativeLanguage?: string;
  languageCode: string;
  abhaStatus: 'Connected' | 'Unlinked' | 'Pending';
  consentStatus: 'Granted' | 'Pending' | 'Revoked';
  source: 'Patient App' | 'OPD Desk' | 'Walk-in' | 'ABHA Scan';
  status: 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled';
  updatedAt?: string;
  originalVoiceTranscript?: string;
  translatedVoiceTranscript?: string;
};

export type ConsentGrant = {
  id: string;
  patientId?: string;
  patientName?: string;
  doctorName: string;
  facility: string;
  purpose: string;
  grantedAt: string;
  expiresAt: string;
  durationMinutes: number;
  sharedRecordTypes: string[];
  isActive: boolean;
  abdmConsentArtifactId: string;
  environment: 'ABDM Prototype / Sandbox';
};

export type AccessAuditLog = {
  id: string;
  accessorName: string;
  facility: string;
  role: string;
  accessedAt: string;
  accessedRecords: string[];
  purpose: string;
  status: 'Active' | 'Expired' | 'Revoked';
  modificationSource?: 'Written' | 'Voice' | 'OCR' | 'Patient-reported' | 'Imported record';
  verifiedBy?: string;
};

export type VaultDocument = {
  id: string;
  title: string;
  category: 'prescriptions' | 'labs' | 'discharge' | 'imaging' | 'ayush' | 'other';
  date: string;
  facility: string;
  doctor?: string;
  fileSize: string;
  fileType: string;
  ocrProcessed: boolean;
  relatedConsultationId?: string;
  originalImageUrl?: string;
  ocrExtraction?: {
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      timing: string;
      confidence: number;
    }>;
    notes: string;
    doctorName?: string;
    facilityName?: string;
    date?: string;
    confidenceAverage: number;
    isVerifiedByPatient?: boolean;
  };
};

export type SymptomHistoryItem = {
  symptom: string;
  firstReported: string;
  lastReported: string;
  visitCount: number;
  facilities: string[];
  relatedMedications: string[];
  outcomes: string[];
  status: 'Recurring' | 'Resolved' | 'New';
};

export type FacilityCareHistory = {
  name: string;
  location: string;
  type: 'Government Hospital' | 'Private Hospital' | 'Specialty Clinic' | 'Diagnostic Centre' | 'Ayush Centre';
  visitCount: number;
  lastVisit: string;
  departments: string[];
  doctors: string[];
  recordsSummary: string;
  visits: Array<{
    date: string;
    doctor: string;
    department: string;
    complaint: string;
    treatment: string;
    prescription: string;
    report?: string;
    outcome: string;
  }>;
};

export type PreviousCondition = {
  condition: string;
  firstRecorded: string;
  lastRecorded: string;
  visitCount: number;
  facilitiesCount: number;
  facilities: string[];
  treatmentReceived: string;
  outcome: string;
  status: 'Chronic / Recurrent' | 'Under Control' | 'Resolved';
};

export type ActiveConsultation = {
  id: string;
  patientId?: string;
  displayId: string; // "#0247"
  patientName: string;
  age: number;
  sex: 'Female' | 'Male' | 'Other';
  language: string;
  languageCode: string;
  isExistingPatient: boolean;
  previousConsultationsCount: number;
  step:
    | 'choice'
    | 'consent-select'
    | 'voice-intake'
    | 'structured-questions'
    | 'patient-review'
    | 'ai-structuring'
    | 'doctor-review'
    | 'verified-record';
  hasSharedPreviousRecords: boolean;
  sharedRecordIds: string[];
  rawTranscript: string;
  translatedTranscript: string;
  chiefComplaint: string;
  hpi: string;
  onset: string;
  location: string;
  severity: number; // Patient reported e.g. 7
  doctorAdjustedSeverity?: number; // Doctor adjusted e.g. 6
  duration: string;
  associatedSymptoms: string[];
  triggers: string;
  vomitingOrNausea: string;
  previousEpisodes: string;
  currentMedicationsTaken: string;
  doctorVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  doctorNotes?: string;
  provisionalDiagnosis?: string;
  ayushDiagnosis?: string;
  prescribedTreatment?: string;
  addedToTimeline: boolean;
};

export type DoctorProfile = {
  id: string;
  name: string;
  title: string;
  specialty: string;
  registrationNumber: string;
  hospital: string;
  department: string;
  status: 'Online' | 'In Consultation' | 'Away';
  avatarInitials: string;
};

export type HospitalDepartment = {
  name: string;
  waitingCount: number;
  inConsultationCount: number;
  completedCount: number;
  activeDoctorsCount: number;
};

export type DoctorTab =
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'consultations'
  | 'prescriptions'
  | 'medications'
  | 'records'
  | 'reports'
  | 'consent'
  | 'settings';

export type TabType =
  | 'home'
  | 'health'
  | 'consult'
  | 'documents'
  | 'medications'
  | 'consent'
  | 'abha'
  | 'profile';

export type AppViewMode = 'patient' | 'doctor' | 'kiosk';

