import { storageService } from './storageService';
import type { AppointmentItem, HandoffStatus } from '../types/health';

export const appointmentService = {
  getAppointments: async (): Promise<AppointmentItem[]> => {
    return storageService.getState().appointments;
  },

  getAppointmentById: async (appointmentId: string): Promise<AppointmentItem | null> => {
    const state = storageService.getState();
    return state.appointments.find((a) => a.id === appointmentId) || null;
  },

  updateAppointmentStatus: async (
    patientId: string,
    status: 'Waiting' | 'In Consultation' | 'Completed' | 'Cancelled',
    handoffStatus?: HandoffStatus
  ): Promise<void> => {
    storageService.setState((prev) => {
      const cleanId = patientId.replace(/^#/, '');
      const updatedAppointments = prev.appointments.map((a) => {
        if (a.patientId === cleanId || a.patientNumber === `#${cleanId}` || a.patientNumber === cleanId) {
          return {
            ...a,
            status,
            handoffStatus: handoffStatus || (status === 'Completed' ? 'Completed' : a.handoffStatus),
            updatedAt: 'Just now',
          };
        }
        return a;
      });

      return {
        ...prev,
        appointments: updatedAppointments,
      };
    });
  },
};
