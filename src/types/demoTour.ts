import type { AppViewMode, TabType } from './health';

export interface DemoStep {
  id: number;
  title: string;
  subtitle: string;
  mode: AppViewMode;
  tab?: TabType;
  consultStep?: string;
  badge: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: '1. Welcome & ABDM Positioning',
    subtitle: 'CodeScribe Health concept: One health history across many hospitals.',
    mode: 'patient',
    tab: 'home',
    badge: 'Overview',
  },
  {
    id: 2,
    title: '2. Connect ABHA & Consent',
    subtitle: 'QR scan / Health ID entry with explicit ABDM consent before record loading.',
    mode: 'patient',
    tab: 'abha',
    badge: 'ABDM Flow',
  },
  {
    id: 3,
    title: '3. Longitudinal Health Timeline',
    subtitle: '8 chronological records across 4 hospitals with full visit details & source docs.',
    mode: 'patient',
    tab: 'health',
    badge: 'Timeline',
  },
  {
    id: 4,
    title: '4. Multilingual Case-Taking Intake',
    subtitle: 'Voice-first intake in Kannada with live speech translation & SOCRATES questions.',
    mode: 'patient',
    tab: 'consult',
    consultStep: 'voice-intake',
    badge: 'CodeScribe AI',
  },
  {
    id: 5,
    title: '5. Patient Review Safety Step',
    subtitle: 'Patient verifies structured symptoms before creating the clinical history.',
    mode: 'patient',
    tab: 'consult',
    consultStep: 'patient-review',
    badge: 'Patient Safety',
  },
  {
    id: 6,
    title: '6. Doctor Longitudinal Workspace',
    subtitle: 'Patient #0247 snapshot, "What Changed?", recurrent headache history & care facilities.',
    mode: 'doctor',
    badge: 'Doctor View',
  },
  {
    id: 7,
    title: '7. Clinical Review & Severity Edit',
    subtitle: 'Doctor reviews today’s intake, adjusts severity 7/10 → 6/10 & adds Ayush diagnosis.',
    mode: 'doctor',
    badge: 'Doctor Review',
  },
  {
    id: 8,
    title: '8. Doctor Verification & Timeline Sync',
    subtitle: 'Record marked "Doctor Verified" and seamlessly committed to patient health history.',
    mode: 'doctor',
    badge: 'Verification',
  },
  {
    id: 9,
    title: '9. Medication Vault & Timeline',
    subtitle: 'Current vs past medications with visual duration bars and outcomes.',
    mode: 'patient',
    tab: 'medications',
    badge: 'Medications',
  },
  {
    id: 10,
    title: '10. Document Vault & Vision OCR',
    subtitle: 'Prescription OCR extraction with side-by-side human verification.',
    mode: 'patient',
    tab: 'documents',
    badge: 'Vision OCR',
  },
  {
    id: 11,
    title: '11. Consent & Access Audit Log',
    subtitle: 'Time-bound sharing grants, Revoke Access, and "Who accessed my records?" log.',
    mode: 'patient',
    tab: 'consent',
    badge: 'Audit Log',
  },
];
