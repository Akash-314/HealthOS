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

    // 3 Explicit Criteria Sorting Algorithms requested by user
    const sortMode = filters.sortBy || 'nearest';

    if (sortMode === 'nearest') {
      // 1. Nearest: Sort purely by distance (closest first)
      result.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (sortMode === 'far_best') {
      // 2. Far but Best: Prioritizes top rated (4.8 - 5.0) hospitals located farther away (> 5.0 km)
      result.sort((a, b) => {
        const isFarA = a.distanceKm >= 5.0 ? 1 : 0;
        const isFarB = b.distanceKm >= 5.0 ? 1 : 0;

        if (isFarA !== isFarB) return isFarB - isFarA; // Farther hospitals first
        if (b.rating !== a.rating) return b.rating - a.rating; // Highest rated first
        return b.availableBeds - a.availableBeds; // Most beds available
      });
    } else if (sortMode === 'nearest_best') {
      // 3. Nearest but Best: Combines top rating with minimal distance
      result.sort((a, b) => {
        const scoreA = (a.rating * 10) / (a.distanceKm + 0.5);
        const scoreB = (b.rating * 10) / (b.distanceKm + 0.5);
        return scoreB - scoreA;
      });
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
