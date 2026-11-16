export type SocratesCase = {
  chiefComplaint: string;
  // SOCRATES Acronym:
  site: string; // Site: Location of pain/symptom
  onset: string; // Onset: When it started & how (acute/insidious)
  character: string; // Character: Nature of the pain (throbbing, sharp, dull)
  radiation: string; // Radiation: Where the symptom spreads
  associations: string[]; // Associations: Accompanying signs (photophobia, nausea)
  timeCourse: string; // Time Course: Duration, periodicity, frequency
  exacerbatingRelieving: string; // Exacerbating / Relieving factors
  severity: number; // Severity: 1 - 10 pain scale

  // Multilingual Spoken Narrative:
  language: string;
  languageCode: string;
  rawTranscript: string;
  translatedTranscript: string;
  hpi: string;

  // Clinician Verdict:
  doctorVerified: boolean;
  verifiedAt?: string;
  doctorName?: string;
  doctorNotes?: string;
  status?: 'ready-for-review' | 'signed';
};

export type PrescriptionItem = {
  medication: string; // e.g. "Tab. Paracetamol 500mg"
  dosage: string; // e.g. "500 mg"
  instructions: string; // e.g. "1 tablet TDS after meals (SOS)"
  duration: string; // e.g. "5 days"
};

export type LongitudinalRecord = {
  id: string;
  date: string; // e.g. "12 Aug 2026"
  year: number;
  category: 'consultation' | 'prescription' | 'lab' | 'discharge';
  hospitalClinic: string; // Specific hospital/clinic visited
  doctorName?: string;
  department?: string;
  symptomsDiagnoses: string; // Past symptoms / diagnoses
  prescriptions: PrescriptionItem[]; // Full medication prescriptions
  clinicalNotes: string;
  labMetrics?: Array<{ test: string; result: string; normalRange: string }>;
  isCurrentVisit?: boolean;
};

export type AbhaProfile = {
  abhaId: string; // e.g. "91-4829-1049-2819"
  abhaAddress: string; // e.g. "lakshmi.gowda@abdm"
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  phone: string;
  linkedRecordsCount: number;
  kycStatus: string;
  emergencyContact: string;
};

export type AppMode = 'patient-kiosk' | 'doctor-dashboard';
export type KioskStep = 'scan' | 'success' | 'intake' | 'questions' | 'review';
