import { storageService } from './storageService';
import type { PatientProfile, HealthRecord } from '../types/health';

export const patientService = {
  getPatients: async (): Promise<PatientProfile[]> => {
    return storageService.getState().patients;
  },

  getPatientById: async (patientId: string): Promise<PatientProfile | null> => {
    const state = storageService.getState();
    const cleanId = patientId.replace(/^#/, '');
    const found = state.patients.find(
      (p) => p.id === cleanId || p.patientNumber === `#${cleanId}` || p.patientNumber === cleanId
    );
    return found || null;
  },

  getPatientHistory: async (patientId: string): Promise<HealthRecord[]> => {
    const state = storageService.getState();
    // In prototype, Lakshmi Gowda (P001) has the full timeline
    if (patientId === 'P001' || patientId === '#P001') {
      return state.timeline;
    }
    // Filter by patient ID if multiple patients have records
    return state.timeline;
  },

  searchPatients: async (query: string): Promise<PatientProfile[]> => {
    const state = storageService.getState();
    const raw = query.trim();
    if (!raw) return [];

    const normalizedId = raw.replace(/^#/, '').toUpperCase();
    const qLower = raw.toLowerCase();

    // 1. Exact ID match check (P005, #P005, 005)
    const exactIdMatch = state.patients.filter((p) => {
      const pId = p.id.toUpperCase();
      const pNum = p.patientNumber.replace(/^#/, '').toUpperCase();
      return pId === normalizedId || pNum === normalizedId || pId === `P${normalizedId}` || pNum === `P${normalizedId}`;
    });

    if (exactIdMatch.length > 0) {
      return exactIdMatch;
    }

    // 2. Name, phone, ABHA, condition match
    return state.patients.filter((p) => {
      return (
        p.identity.name.toLowerCase().includes(qLower) ||
        p.identity.phone.includes(qLower) ||
        p.identity.abhaAddress.toLowerCase().includes(qLower) ||
        (p.primaryCondition || '').toLowerCase().includes(qLower)
      );
    });
  },
};
