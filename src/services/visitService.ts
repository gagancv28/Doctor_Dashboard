import { storageService } from './storageService';
import type { FacilityCareHistory } from '../types/health';

/**
 * Visit Service — Healthcare Journey & Facility Care History
 */
export const visitService = {
  getFacilitiesHistory: async (_patientId?: string): Promise<FacilityCareHistory[]> => {
    const state = storageService.getState();
    return state.facilitiesHistory;
  },

  getFacilityByName: async (facilityName: string): Promise<FacilityCareHistory | null> => {
    const state = storageService.getState();
    const found = state.facilitiesHistory.find(
      (f) => f.name.toLowerCase() === facilityName.toLowerCase()
    );
    return found || null;
  },
};
