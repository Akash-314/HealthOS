import { apiFetch } from './api';

/**
 * Authority & Admin Service Boundary
 */
export const adminService = {
  async getNetworkOverview() {
    return apiFetch('/admin/network/overview').catch(() => ({
      totalHospitals: 42,
      activeBeds: 3420,
      occupiedBeds: 2810,
      activeAmbulances: 88,
      activeEmergencies: 14,
    }));
  },

  async getRegionalCapacity() {
    return apiFetch('/admin/network/capacity').catch(() => []);
  },

  async getNetworkAlerts() {
    return apiFetch('/admin/network/alerts').catch(() => []);
  },

  async approveHospitalRegistration(hospitalId) {
    return apiFetch(`/admin/hospitals/${hospitalId}/approve`, { method: 'POST' });
  },
};
