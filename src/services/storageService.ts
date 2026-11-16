import type {
  PatientProfile,
  AppointmentItem,
  ClinicalHandoff,
  ActiveConsultation,
  PrescriptionRecord,
  MedicationItem,
  HealthRecord,
  VaultDocument,
  ConsentGrant,
  AccessAuditLog,
  DoctorProfile,
  HospitalDepartment,
} from '../types/health';
import {
  CURRENT_DOCTOR,
  ALL_PATIENT_PROFILES,
  INITIAL_APPOINTMENTS,
  INITIAL_CLINICAL_HANDOFFS,
  INITIAL_CONSULTATION_CASE,
  INITIAL_PRESCRIPTIONS,
  INITIAL_MEDICATIONS,
  INITIAL_HEALTH_TIMELINE,
  INITIAL_VAULT_DOCUMENTS,
  INITIAL_CONSENT_GRANT,
  INITIAL_ACCESS_AUDIT_LOGS,
  HOSPITAL_DEPARTMENTS,
  INITIAL_SYMPTOMS_HISTORY,
  INITIAL_FACILITIES_HISTORY,
  INITIAL_PREVIOUS_CONDITIONS,
} from '../mock/healthStore';

export interface DoctorPortalState {
  doctorProfile: DoctorProfile;
  patients: PatientProfile[];
  appointments: AppointmentItem[];
  handoffs: ClinicalHandoff[];
  consultation: ActiveConsultation;
  prescriptions: PrescriptionRecord[];
  medications: MedicationItem[];
  timeline: HealthRecord[];
  documents: VaultDocument[];
  consent: ConsentGrant;
  accessLogs: AccessAuditLog[];
  departments: HospitalDepartment[];
  symptomsHistory: typeof INITIAL_SYMPTOMS_HISTORY;
  facilitiesHistory: typeof INITIAL_FACILITIES_HISTORY;
  previousConditions: typeof INITIAL_PREVIOUS_CONDITIONS;
}

const STORAGE_KEY = 'codescribe_doctor_portal_data_v1';

export function getInitialState(): DoctorPortalState {
  return {
    doctorProfile: CURRENT_DOCTOR,
    patients: ALL_PATIENT_PROFILES,
    appointments: INITIAL_APPOINTMENTS,
    handoffs: INITIAL_CLINICAL_HANDOFFS,
    consultation: INITIAL_CONSULTATION_CASE,
    prescriptions: INITIAL_PRESCRIPTIONS,
    medications: INITIAL_MEDICATIONS,
    timeline: INITIAL_HEALTH_TIMELINE,
    documents: INITIAL_VAULT_DOCUMENTS,
    consent: INITIAL_CONSENT_GRANT,
    accessLogs: INITIAL_ACCESS_AUDIT_LOGS,
    departments: HOSPITAL_DEPARTMENTS,
    symptomsHistory: INITIAL_SYMPTOMS_HISTORY,
    facilitiesHistory: INITIAL_FACILITIES_HISTORY,
    previousConditions: INITIAL_PREVIOUS_CONDITIONS,
  };
}

class StorageService {
  private inMemoryState: DoctorPortalState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.inMemoryState = this.loadFromStorage();
  }

  private loadFromStorage(): DoctorPortalState {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const item = window.localStorage.getItem(STORAGE_KEY);
        if (item) {
          const parsed = JSON.parse(item);
          // Simple validation
          if (parsed && Array.isArray(parsed.patients) && Array.isArray(parsed.prescriptions)) {
            return parsed;
          }
        }
      }
    } catch {
      // ignore storage errors
    }
    return getInitialState();
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryState));
      }
    } catch {
      // ignore storage errors
    }
    this.notify();
  }

  public getState(): DoctorPortalState {
    return this.inMemoryState;
  }

  public setState(updater: (prev: DoctorPortalState) => DoctorPortalState) {
    this.inMemoryState = updater(this.inMemoryState);
    this.persist();
  }

  public resetDemoData(): DoctorPortalState {
    this.inMemoryState = getInitialState();
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    this.persist();
    return this.inMemoryState;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const storageService = new StorageService();
