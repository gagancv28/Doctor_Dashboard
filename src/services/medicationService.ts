import { storageService } from './storageService';
import type { MedicationItem } from '../types/health';

export const medicationService = {
  getMedications: async (patientId?: string): Promise<MedicationItem[]> => {
    const state = storageService.getState();
    if (!patientId || patientId === 'P001' || patientId === '#P001') {
      return state.medications;
    }
    return state.medications;
  },

  addActiveMedications: async (newMeds: MedicationItem[]): Promise<void> => {
    storageService.setState((prev) => {
      const existingNames = new Set(newMeds.map((m) => m.name.toLowerCase()));
      const filteredPrev = prev.medications.filter((m) => !existingNames.has(m.name.toLowerCase()));
      return {
        ...prev,
        medications: [...newMeds, ...filteredPrev],
      };
    });
  },
};
