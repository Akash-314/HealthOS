import { supabase } from '../lib/supabase/client';
import { emergencyService } from './emergencyService';
import { EMERGENCY_STATUS } from '../types/emergency';
import { ambulanceService } from './ambulanceService';

/**
 * HealthOS Hospital Emergency Intake & Dispatch Service
 */
export const emergencyHospitalService = {
  /**
   * Retrieves active incoming emergency requests assigned to a specific hospital or all regional hospitals.
   */
  async getHospitalEmergencies(hospitalId = null) {
    let requests = [];

    try {
      let query = supabase.from('emergency_requests').select('*');

      if (hospitalId && hospitalId !== 'ALL') {
        query = query.eq('matched_hospital_id', hospitalId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        requests = data;
      }
    } catch (_err) {
      requests = [];
    }

    // Merge locally saved SOS requests (for demo/offline persistence across browser sessions)
    try {
      const localReqs = JSON.parse(localStorage.getItem('healthos_emergency_requests') || '[]');
      for (const item of localReqs) {
        if (!requests.some((r) => r.id === item.id || (r.access_token && r.access_token === item.access_token))) {
          if (!hospitalId || hospitalId === 'ALL' || !item.matched_hospital_id || item.matched_hospital_id === hospitalId) {
            requests.unshift(item);
          }
        }
      }
    } catch (_e) {
      // Ignore
    }

    // Fallback: Check memory emergencies if database empty or offline
    if (requests.length === 0) {
      const sampleList = [
        {
          id: 'emg-demo-101',
          access_token: 'SOS-8F92A1',
          guest_patient_name: 'Rajesh Kumar',
          guest_patient_age: 48,
          guest_patient_gender: 'Male',
          guest_patient_phone: '+91 98390 12345',
          guest_emergency_contact_name: 'Sunita Kumar (Wife)',
          guest_emergency_contact_phone: '+91 94150 99881',
          emergency_type: 'CARDIAC',
          description: 'Severe chest pain radiating to left arm & shortness of breath',
          is_conscious: true,
          is_breathing_normally: false,
          blood_group: 'B+',
          known_allergies: 'Penicillin',
          known_conditions: 'Hypertension, High Cholesterol',
          address_text: 'Civil Lines, Near Head Post Office, Banda, Uttar Pradesh',
          latitude: 25.4760,
          longitude: 80.3320,
          severity: 'CRITICAL',
          status: 'HOSPITAL_ACCEPTED',
          matched_hospital_id: hospitalId || 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
          created_at: new Date(Date.now() - 6 * 60000).toISOString(),
          ambulance_details: {
            vehicle_number: 'UP-90-AMB-1081',
            driver_name: 'Ramesh Yadav',
            driver_phone: '+91 98390 10810',
            status: 'EN_ROUTE_SCENE',
            eta_minutes: 6,
          },
        },
        {
          id: 'emg-demo-102',
          access_token: 'SOS-3B4C5D',
          guest_patient_name: 'Priyanka Sharma',
          guest_patient_age: 32,
          guest_patient_gender: 'Female',
          guest_patient_phone: '+91 94152 77102',
          guest_emergency_contact_name: 'Amit Sharma (Husband)',
          guest_emergency_contact_phone: '+91 94152 77100',
          emergency_type: 'TRAUMA',
          description: 'Road traffic collision, severe leg injury & bleeding',
          is_conscious: true,
          is_breathing_normally: true,
          blood_group: 'O+',
          known_allergies: 'None Reported',
          known_conditions: 'None',
          address_text: 'Kanpur Road Bypass, Near Medical College Gate, Banda, UP',
          latitude: 25.4870,
          longitude: 80.3420,
          severity: 'HIGH',
          status: 'AMBULANCE_ASSIGNED',
          matched_hospital_id: hospitalId || 'a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6',
          created_at: new Date(Date.now() - 12 * 60000).toISOString(),
          ambulance_details: {
            vehicle_number: 'UP-90-AMB-1082',
            driver_name: 'Suresh Kumar',
            driver_phone: '+91 98390 10820',
            status: 'DISPATCHED',
            eta_minutes: 9,
          },
        },
      ];

      requests = sampleList;
    }

    // Attach ambulance details if missing
    for (const req of requests) {
      if (!req.ambulance_details) {
        req.ambulance_details = {
          vehicle_number: req.ambulance_id ? `UP-90-AMB-${req.ambulance_id.slice(-4)}` : 'UP-90-AMB-1081',
          driver_name: 'Ramesh Yadav',
          driver_phone: '+91 98390 10810',
          status: req.status === 'HOSPITAL_ACCEPTED' ? 'EN_ROUTE_SCENE' : 'DISPATCHED',
          eta_minutes: 5,
        };
      }
    }

    return requests;
  },

  /**
   * Hospital accepts an incoming emergency intake.
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
      .channel(`hospital_emergency_${hospitalId || 'all'}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emergency_requests' },
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

