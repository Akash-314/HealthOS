import { apiFetch } from './api';

/**
 * Emergency & Ambulance Service Boundary
 */
export const emergencyService = {
  async triggerSOS(emergencyData) {
    return apiFetch('/emergency/sos', {
      method: 'POST',
      body: JSON.stringify(emergencyData),
    });
  },

  async getActiveEmergencies() {
    return apiFetch('/emergency/active').catch(() => []);
  },

  async dispatchAmbulance(emergencyId, ambulanceId) {
    return apiFetch(`/emergency/${emergencyId}/dispatch`, {
      method: 'POST',
      body: JSON.stringify({ ambulanceId }),
    });
  },
};
