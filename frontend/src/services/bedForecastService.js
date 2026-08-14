import { supabase } from '../lib/supabase/client';

/**
 * Default Mock Datasets for Demo & Offline Fallback
 */
const DEFAULT_HOSPITAL_DATA = {
  'HOS-HOSP-CENTRAL': {
    hospitalId: 'HOS-HOSP-CENTRAL',
    hospitalName: 'District Central Emergency Hospital',
    location: 'Banda, Uttar Pradesh',
    totalIcuBeds: 25,
    occupiedIcuBeds: 22, // O_current (ICU)
    totalWardBeds: 100,
    occupiedWardBeds: 82, // O_current (Ward)
    incomingErPatients: 16, // E_current
    expectedDischargesIcu: 4, // D_expected (ICU)
    expectedDischargesWard: 12, // D_expected (Ward)
    dataSource: 'LOCAL_FALLBACK',
  },
  'HOS-HOSP-CITY': {
    hospitalId: 'HOS-HOSP-CITY',
    hospitalName: 'City Specialty Trauma & Care',
    location: 'Kanpur, Uttar Pradesh',
    totalIcuBeds: 30,
    occupiedIcuBeds: 26,
    totalWardBeds: 120,
    occupiedWardBeds: 95,
    incomingErPatients: 20,
    expectedDischargesIcu: 3,
    expectedDischargesWard: 15,
    dataSource: 'LOCAL_FALLBACK',
  },
  'HOS-HOSP-AIIMS': {
    hospitalId: 'HOS-HOSP-AIIMS',
    hospitalName: 'AIIMS Regional Referral Center',
    location: 'Gorakhpur, Uttar Pradesh',
    totalIcuBeds: 50,
    occupiedIcuBeds: 44,
    totalWardBeds: 250,
    occupiedWardBeds: 210,
    incomingErPatients: 35,
    expectedDischargesIcu: 6,
    expectedDischargesWard: 25,
    dataSource: 'LOCAL_FALLBACK',
  },
};

export const bedForecastService = {
  /**
   * List available hospitals for dropdown selection
   */
  async getHospitals() {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, healthos_hospital_id, name, address, total_icu, available_icu, total_beds, available_beds');

      if (!error && data && data.length > 0) {
        return data.map((h) => ({
          id: h.healthos_hospital_id || h.id,
          rawUuid: h.id,
          name: h.name,
          address: h.address,
        }));
      }
    } catch (_err) {
      // Fallback to default hospital list
    }

    return Object.values(DEFAULT_HOSPITAL_DATA).map((h) => ({
      id: h.hospitalId,
      rawUuid: h.hospitalId,
      name: h.hospitalName,
      address: h.location,
    }));
  },

  /**
   * Fetch live bed capacity variables from Supabase (O_current, E_current, D_expected)
   * with transparent data source indicator.
   * @param {string} hospitalId
   */
  async getHospitalBedData(hospitalId = 'HOS-HOSP-CENTRAL') {
    const fallback = DEFAULT_HOSPITAL_DATA[hospitalId] || DEFAULT_HOSPITAL_DATA['HOS-HOSP-CENTRAL'];

    try {
      // 1. Fetch beds from Supabase `beds` table using hospital_id OR healthos_hospital_id
      let { data: bedsData, error: bedsError } = await supabase
        .from('beds')
        .select('bed_type, is_icu, status, hospital_id, healthos_hospital_id')
        .or(`hospital_id.eq.${hospitalId},healthos_hospital_id.eq.${hospitalId}`);

      if (bedsError) {
        // Retry querying by hospital_id equal to hospitalId if OR syntax had schema restriction
        const retryBeds = await supabase
          .from('beds')
          .select('is_icu, bed_type, status')
          .eq('hospital_id', hospitalId);
        if (!retryBeds.error && retryBeds.data) {
          bedsData = retryBeds.data;
        }
      }

      // 2. Fetch incoming ER admissions from `er_admissions` table
      let incomingErPatients = fallback.incomingErPatients;
      const { data: erData } = await supabase
        .from('er_admissions')
        .select('id')
        .or(`hospital_id.eq.${hospitalId},healthos_hospital_id.eq.${hospitalId}`)
        .eq('status', 'INCOMING');

      if (erData && erData.length > 0) {
        incomingErPatients = erData.length;
      }

      // 3. Fetch 24-hour planned discharges from `planned_discharges` table
      let expectedDischargesIcu = fallback.expectedDischargesIcu;
      let expectedDischargesWard = fallback.expectedDischargesWard;

      const { data: dischargesData } = await supabase
        .from('planned_discharges')
        .select('bed_type')
        .or(`hospital_id.eq.${hospitalId},healthos_hospital_id.eq.${hospitalId}`)
        .eq('status', 'PLANNED');

      if (dischargesData && dischargesData.length > 0) {
        expectedDischargesIcu = dischargesData.filter((d) => d.bed_type === 'ICU').length;
        expectedDischargesWard = dischargesData.filter((d) => d.bed_type === 'WARD').length;
      }

      if (bedsData && bedsData.length > 0) {
        // Support both `is_icu` boolean and `bed_type` text string
        const icuBeds = bedsData.filter((b) => b.is_icu === true || b.bed_type === 'ICU');
        const wardBeds = bedsData.filter((b) => b.is_icu === false || b.bed_type === 'WARD');

        const occupiedIcuBeds = icuBeds.filter((b) => b.status === 'OCCUPIED').length;
        const occupiedWardBeds = wardBeds.filter((b) => b.status === 'OCCUPIED').length;

        return {
          hospitalId,
          hospitalName: fallback.hospitalName,
          location: fallback.location,
          totalIcuBeds: icuBeds.length || fallback.totalIcuBeds,
          occupiedIcuBeds: occupiedIcuBeds || fallback.occupiedIcuBeds,
          totalWardBeds: wardBeds.length || fallback.totalWardBeds,
          occupiedWardBeds: occupiedWardBeds || fallback.occupiedWardBeds,
          incomingErPatients,
          expectedDischargesIcu,
          expectedDischargesWard,
          dataSource: 'SUPABASE', // Data retrieved from Supabase
        };
      }
    } catch (_err) {
      console.warn('Supabase query notice, using local fallback dataset:', _err);
    }

    return {
      ...fallback,
      dataSource: 'LOCAL_FALLBACK', // Data loaded from fallback
    };
  },

  /**
   * Implement the EXACT Forecasting Formula:
   * O_forecast = O_current + (E_current * S * P_icu) - D_expected
   *
   * @param {Object} params
   * @param {number} params.O_current - Currently occupied beds
   * @param {number} params.E_current - Baseline incoming ER patients
   * @param {number} params.S - Surge Multiplier (1.0 to 3.0)
   * @param {number} params.P_icu - Probability of ER patients needing bed (0.01 to 0.30)
   * @param {number} params.D_expected - Expected discharges in 24 hours
   * @param {number} params.totalCapacity - Total physical beds in hospital
   */
  calculateForecast({ O_current, E_current, S, P_icu, D_expected, totalCapacity }) {
    const oCurrent = Number(O_current) || 0;
    const eCurrent = Number(E_current) || 0;
    const sVal = Number(S) || 1.0;
    const pIcuVal = Number(P_icu) || 0.15;
    const dExpected = Number(D_expected) || 0;

    // Additional expected incoming admissions: E_current * S * P_icu
    const incomingNeedFloat = eCurrent * sVal * pIcuVal;
    
    // O_forecast = O_current + (E_current * S * P_icu) - D_expected
    const forecastExact = oCurrent + incomingNeedFloat - dExpected;
    
    // Ceiling or round to non-negative integer bed count
    const forecastRounded = Math.max(0, Math.round(forecastExact));
    
    const netChange = forecastRounded - oCurrent;
    const availableTotal = Number(totalCapacity) || 1;
    const occupancyRatePercent = Math.round((forecastRounded / availableTotal) * 100);
    const isOverflow = forecastRounded > availableTotal;
    const deficitBeds = isOverflow ? forecastRounded - availableTotal : 0;

    return {
      forecastExact: Number(forecastExact.toFixed(2)),
      forecastRounded,
      incomingNeedFloat: Number(incomingNeedFloat.toFixed(2)),
      netChange,
      occupancyRatePercent,
      isOverflow,
      deficitBeds,
      availableTotal,
      currentOccupied: oCurrent,
      expectedDischarges: dExpected,
    };
  },
};
