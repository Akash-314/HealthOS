import { apiFetch } from './api';

/**
 * Patient Service Boundary
 */
export const patientService = {
  async getDashboardSummary(patientId) {
    return apiFetch(`/patients/${patientId}/dashboard`).catch(() => ({
      upcomingAppointments: [],
      prescriptions: [],
      recentRecords: [],
    }));
  },

  async bookAppointment(appointmentData) {
    return apiFetch('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    });
  },

  async getHealthRecords(patientId) {
    return apiFetch(`/patients/${patientId}/records`).catch(() => []);
  },

  async getPrescriptions(patientId) {
    return apiFetch(`/patients/${patientId}/prescriptions`).catch(() => []);
  },
};
