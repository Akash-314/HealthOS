import { supabase } from '../lib/supabase/client';

/**
 * HealthOS Realtime Event Subscriptions Boundary
 */
export const realtimeService = {
  /**
   * Subscribe to Bed & ICU Availability Channel
   */
  subscribeToBedAvailability(hospitalId, callback) {
    const channel = supabase
      .channel(`hospital-beds-${hospitalId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'beds', filter: `hospital_id=eq.${hospitalId}` },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  /**
   * Subscribe to Emergency SOS Stream
   */
  subscribeToEmergencyRequests(regionId, callback) {
    const channel = supabase
      .channel(`emergencies-${regionId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'emergencies' },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },

  /**
   * Subscribe to Ambulance Location & Status Stream
   */
  subscribeToAmbulanceStatus(ambulanceId, callback) {
    const channel = supabase
      .channel(`ambulance-${ambulanceId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'ambulances', filter: `id=eq.${ambulanceId}` },
        (payload) => callback(payload)
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  },
};
