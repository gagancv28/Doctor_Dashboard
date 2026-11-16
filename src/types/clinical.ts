export type SupportedLanguage = {
  id: string;
  name: string;
  nativeName: string;
  script: string;
  samplePhrase: string;
  translatedPhrase: string;
};

export type PrescriptionItem = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string;
  duration: string;
  confidence: number;
};

export type PatientCase = {
  id: string;
  displayId: string; // e.g. #0247
  queueTime: string;
  name: string;
  age: number;
  sex: 'Female' | 'Male' | 'Other';
  language: string;
  languageCode: string;
  chiefComplaint: string;
  hpi: string; // History of Present Illness
  onset: string;
  location: string;
  associatedSymptoms: string[];
  severity: number; // 1-10
  duration: string;
  rawVoiceAudioDuration?: string;
  rawTranscript: string;
  translatedTranscript: string;
  relevantHistory?: string;
  medications?: string[];
  allergies?: string[];
  previousPrescription?: {
    date: string;
    doctorName: string;
    hospital: string;
    items: PrescriptionItem[];
    rawNotes: string;
  };
  doctorVerified: boolean;
  verifiedAt?: string;
  doctorName?: string;
  doctorNotes?: string;
  abdmHealthId?: string;
  fhirReady: boolean;
};

export type RecordStatus =
  | 'new'
  | 'intake'
  | 'processing'
  | 'structured'
  | 'doctor_review'
  | 'doctor_edit'
  | 'verified'
  | 'completed';

export type AppView =
  | 'landing'
  | 'patient-welcome'
  | 'patient-lang'
  | 'patient-voice'
  | 'patient-followup'
  | 'patient-review'
  | 'patient-structuring'
  | 'doctor-dashboard'
  | 'doctor-ocr'
  | 'final-record';
