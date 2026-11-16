import { storageService } from './storageService';
import type { ClinicalHandoff, HandoffStatus } from '../types/health';

export const clinicalHandoffService = {
  getClinicalHandoffs: async (): Promise<ClinicalHandoff[]> => {
    return storageService.getState().handoffs;
  },

  getClinicalHandoffByPatientId: async (patientId: string): Promise<ClinicalHandoff | null> => {
    const state = storageService.getState();
    const cleanId = patientId.replace(/^#/, '');
    const found = state.handoffs.find(
      (h) => h.patientId === cleanId || h.patientNumber === `#${cleanId}` || h.patientNumber === cleanId
    );
    return found || null;
  },

  updateClinicalHandoffStatus: async (patientId: string, status: HandoffStatus): Promise<void> => {
    storageService.setState((prev) => {
      const cleanId = patientId.replace(/^#/, '');
      const updatedHandoffs = prev.handoffs.map((h) => {
        if (h.patientId === cleanId || h.patientNumber === `#${cleanId}` || h.patientNumber === cleanId) {
          return {
            ...h,
            handoffStatus: status,
          };
        }
        return h;
      });

      return {
        ...prev,
        handoffs: updatedHandoffs,
      };
    });
  },

  createClinicalHandoff: async (handoff: ClinicalHandoff): Promise<ClinicalHandoff> => {
    storageService.setState((prev) => ({
      ...prev,
      handoffs: [handoff, ...prev.handoffs.filter((h) => h.id !== handoff.id)],
    }));
    return handoff;
  },
};
