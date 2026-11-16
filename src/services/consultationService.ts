import { storageService } from './storageService';
import type { ActiveConsultation } from '../types/health';

export const consultationService = {
  getActiveConsultation: async (): Promise<ActiveConsultation> => {
    return storageService.getState().consultation;
  },

  updateConsultation: async (
    updates: Partial<ActiveConsultation>
  ): Promise<ActiveConsultation> => {
    let updatedCase: ActiveConsultation = storageService.getState().consultation;
    storageService.setState((prev) => {
      updatedCase = {
        ...prev.consultation,
        ...updates,
      };
      return {
        ...prev,
        consultation: updatedCase,
      };
    });
    return updatedCase;
  },
};
