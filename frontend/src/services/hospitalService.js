import { apiFetch } from './api';
import { MOCK_HOSPITALS } from './mockHospitals';

/**
 * Hospital Operations Service
 * Bridges backend API endpoints with rich local fallback demo data
 */
export const hospitalService = {
  async getHospitals(filters = {}) {
    try {
      const data = await apiFetch('/hospitals');
      if (Array.isArray(data) && data.length > 0) return data;
    } catch (_err) {
      // Fallback to rich mock dataset
    }

    let result = [...MOCK_HOSPITALS];

    // Filter by query (search term)
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.specializations.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Filter by type
    if (filters.type && filters.type !== 'ALL') {
      result = result.filter((h) => h.type.toLowerCase().includes(filters.type.toLowerCase()));
    }

    // Filter by emergency capability
    if (filters.emergencyOnly) {
      result = result.filter((h) => h.emergencyCapable);
    }

    // Filter by min beds available
    if (filters.hasAvailableBeds) {
      result = result.filter((h) => h.availableBeds > 0);
    }

    // Sort
    if (filters.sortBy === 'distance') {
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (filters.sortBy === 'beds') {
      result.sort((a, b) => b.availableBeds - a.availableBeds);
    } else if (filters.sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  },

  async getHospitalById(id) {
    try {
      const data = await apiFetch(`/hospitals/${id}`);
      if (data && data.id) return data;
    } catch (_err) {
      // Fallback
    }
    return MOCK_HOSPITALS.find((h) => h.id === id) || MOCK_HOSPITALS[0];
  },

  async updateBedCapacity(hospitalId, bedData) {
    return apiFetch(`/hospitals/${hospitalId}/beds`, {
      method: 'PUT',
      body: JSON.stringify(bedData),
    }).catch(() => ({ success: true, message: 'Bed capacity updated (demo mode).' }));
  },

  async getDoctors(hospitalId) {
    const hosp = await this.getHospitalById(hospitalId);
    return hosp ? hosp.doctors || [] : [];
  },

  async getOperationalAnalytics(hospitalId) {
    return apiFetch(`/hospitals/${hospitalId}/analytics`).catch(() => ({
      bedOccupancyRate: 84,
      icuOccupancyRate: 78,
      activeEmergencies: 4,
    }));
  },
};
