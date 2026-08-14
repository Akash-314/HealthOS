import { supabase } from '../lib/supabase/client';
import { emergencyService } from './emergencyService';
import { EMERGENCY_STATUS } from '../types/emergency';

/**
 * Hospital Emergency Intake Service
 */
export const emergencyHospitalService = {
  /**
   * Retrieves active incoming emergency requests assigned to a hospital.
   */
  async getHospitalEmergencies(hospitalId) {
    try {
      const { data, error } = await supabase
        .from('emergency_requests')
        .select('*')
        .eq('matched_hospital_id', hospitalId)
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) return data;
    } catch (_err) {
      // Fallback
    }

    return [];
  },

  /**
   * Hospital accepts an incoming emergency.
   */
  async acceptEmergency(emergencyId, hospitalName = 'Hospital') {
    await emergencyService.updateEmergencyStatus(
      emergencyId,
      EMERGENCY_STATUS.HOSPITAL_ACCEPTED,
      `${hospitalName} ER Trauma Bay confirmed intake readiness.`
    );
    return true;
  },

  /**
   * Hospital rejects an incoming emergency and triggers re-matching.
   */
  async rejectEmergency(emergencyId, hospitalName = 'Hospital', reason = 'Trauma bay at maximum capacity') {
    await emergencyService.updateEmergencyStatus(
      emergencyId,
      EMERGENCY_STATUS.MATCHING_HOSPITAL,
      `${hospitalName} declined intake (${reason}). Re-matching next capable hospital...`
    );
    return true;
  },

  /**
   * Subscribes hospital dashboard to realtime incoming emergency alerts.
   */
  subscribeToHospitalEmergencies(hospitalId, onNewEmergency) {
    const channel = supabase
      .channel(`hospital_emergency_${hospitalId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emergency_requests', filter: `matched_hospital_id=eq.${hospitalId}` },
        (payload) => {
          if (onNewEmergency && payload.new) {
            onNewEmergency(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
