import { storageService } from './storageService';
import type { HealthRecord } from '../types/health';

export const recordService = {
  getRecords: async (patientId?: string): Promise<HealthRecord[]> => {
    const state = storageService.getState();
    if (!patientId || patientId === 'P001' || patientId === '#P001') {
      return state.timeline;
    }
    return state.timeline;
  },

  addRecord: async (record: HealthRecord): Promise<HealthRecord> => {
    storageService.setState((prev) => ({
      ...prev,
      timeline: [record, ...prev.timeline.filter((r) => r.id !== record.id)],
    }));
    return record;
  },
};
