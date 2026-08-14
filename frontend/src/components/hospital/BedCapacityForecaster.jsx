import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { bedForecastService } from '../../services/bedForecastService';
import {
  Activity,
  Bed,
  AlertTriangle,
  RefreshCw,
  Sliders,
  TrendingUp,
  Building2,
  Users,
  CheckCircle2,
  Zap,
  Database,
} from 'lucide-react';
import './BedCapacityForecaster.css';

export function BedCapacityForecaster() {
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState('HOS-HOSP-CENTRAL');
  const [bedData, setBedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Active Mode: 'ICU' or 'WARD'
  const [mode, setMode] = useState('ICU');

  // Formula UI Slider Variables
  // S: Surge Multiplier (1.0 to 3.0, default 1.0)
  const [surgeMultiplier, setSurgeMultiplier] = useState(1.0);

  // P_icu: Probability factor of ER patients needing ICU/Ward bed (0.01 to 0.30, default 0.15)
  const [pIcu, setPIcu] = useState(0.15);

  // 1. Fetch hospitals list on mount
  useEffect(() => {
    async function loadHospitals() {
      const list = await bedForecastService.getHospitals();
      setHospitals(list);
    }
    loadHospitals();
  }, []);

  // 2. Fetch live bed data for selected hospital
  const fetchBedData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await bedForecastService.getHospitalBedData(selectedHospitalId);
      setBedData(data);
    } catch (err) {
      console.error('Failed to load bed forecast data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedHospitalId]);

  useEffect(() => {
    fetchBedData();
  }, [fetchBedData]);

  // 3. Compute variables based on active mode (ICU vs WARD)
  const O_current = useMemo(() => {
    if (!bedData) return 0;
    return mode === 'ICU' ? bedData.occupiedIcuBeds : bedData.occupiedWardBeds;
  }, [bedData, mode]);

  const totalCapacity = useMemo(() => {
    if (!bedData) return 1;
    return mode === 'ICU' ? bedData.totalIcuBeds : bedData.totalWardBeds;
  }, [bedData, mode]);

  const E_current = useMemo(() => {
    if (!bedData) return 0;
    return bedData.incomingErPatients;
  }, [bedData]);

  const D_expected = useMemo(() => {
    if (!bedData) return 0;
    return mode === 'ICU' ? bedData.expectedDischargesIcu : bedData.expectedDischargesWard;
  }, [bedData, mode]);

  // 4. Calculate Mathematical Forecast Reactively
  // O_forecast = O_current + (E_current * S * P_icu) - D_expected
  const forecast = useMemo(() => {
    return bedForecastService.calculateForecast({
      O_current,
      E_current,
      S: surgeMultiplier,
      P_icu: pIcu,
      D_expected,
      totalCapacity,
    });
  }, [O_current, E_current, surgeMultiplier, pIcu, D_expected, totalCapacity]);

  // Quick Preset Scenarios
  const applyPreset = (s, p) => {
    setSurgeMultiplier(s);
    setPIcu(p);
  };

  return (
    <div className="forecaster-wrapper">
      {/* HEADER & CONTROLS BAR */}
      <div className="forecaster-header">
        <div className="forecaster-title-group">
          <div className="forecaster-icon-badge">
            <Activity size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h2>Bed Capacity Forecaster</h2>
              {bedData?.dataSource === 'SUPABASE' ? (
                <span className="data-source-badge supabase" title="Live data fetched from Supabase database">
                  <Database size={13} /> Data Source: Supabase ✓
                </span>
              ) : (
                <span className="data-source-badge fallback" title="Operating with local fallback dataset">
                  <Database size={13} /> Data Source: Local Fallback
                </span>
              )}
            </div>
            <p>Predictive near-future ICU & Ward requirement model using live Supabase data</p>
          </div>
        </div>

        <div className="forecaster-controls-group">
          {/* ICU vs WARD Toggle */}
          <div className="mode-toggle-group">
            <button
              className={`mode-tab-btn ${mode === 'ICU' ? 'active' : ''}`}
              onClick={() => setMode('ICU')}
            >
              <Activity size={16} />
              <span>ICU Beds</span>
            </button>
            <button
              className={`mode-tab-btn ${mode === 'WARD' ? 'active' : ''}`}
              onClick={() => setMode('WARD')}
            >
              <Bed size={16} />
              <span>General Ward</span>
            </button>
          </div>

          {/* Hospital Select Dropdown */}
          <select
            className="hospital-select-dropdown"
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
          >
            {hospitals.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>

          {/* Refresh Data Button */}
          <button className="refresh-btn" onClick={fetchBedData} disabled={isLoading}>
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Loading...' : 'Refresh Data'}</span>
          </button>
        </div>
      </div>

      {/* OVERFLOW WARNING ALERT BANNER */}
      {forecast.isOverflow && (
        <div className="overflow-alert-banner">
          <div className="overflow-alert-icon">
            <AlertTriangle size={28} />
          </div>
          <div className="overflow-alert-content">
            <h4>CRITICAL CAPACITY OVERFLOW WARNING</h4>
            <p>
              Predicted {mode} occupancy ({forecast.forecastRounded} beds) exceeds total physical capacity ({totalCapacity} beds).{' '}
              <strong>Deficit: {forecast.deficitBeds} additional {mode} beds required!</strong>
            </p>
          </div>
        </div>
      )}

      {/* MAIN DASHBOARD GRID */}
      <div className="forecaster-grid">
        {/* LEFT COLUMN: INTERACTIVE VARIABLES & SLIDERS */}
        <div className="forecaster-card">
          <div className="card-title-header">
            <h3>
              <Sliders size={20} style={{ color: '#0284c7' }} />
              <span>What-If Scenario Sliders</span>
            </h3>
            <span className="slider-value-badge">Live Math Active</span>
          </div>

          {/* Slider 1: Surge Multiplier (S) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span className="slider-name">
                <Zap size={16} style={{ color: '#f59e0b' }} />
                <span>Surge Multiplier (S)</span>
              </span>
              <span className="slider-value-badge">{surgeMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.1"
              value={surgeMultiplier}
              onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
              className="custom-range-slider"
            />
            <div className="slider-minmax-row">
              <span>1.0x (Standard Baseline)</span>
              <span>2.0x (Heavy Surge)</span>
              <span>3.0x (Extreme Epidemic)</span>
            </div>
          </div>

          {/* Slider 2: ICU/Ward Transition Probability (P_icu) */}
          <div className="slider-group">
            <div className="slider-label-row">
              <span className="slider-name">
                <TrendingUp size={16} style={{ color: '#38bdf8' }} />
                <span>Admission Probability (P_icu)</span>
              </span>
              <span className="slider-value-badge">{(pIcu * 100).toFixed(0)}% ({pIcu.toFixed(2)})</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.30"
              step="0.01"
              value={pIcu}
              onChange={(e) => setPIcu(parseFloat(e.target.value))}
              className="custom-range-slider"
            />
            <div className="slider-minmax-row">
              <span>1% (Low Acuity)</span>
              <span>15% (Standard Baseline)</span>
              <span>30% (Severe Acuity)</span>
            </div>
          </div>

          {/* QUICK PRESET SCENARIO CHIPS */}
          <div className="presets-section">
            <h4>Quick Preset Scenarios</h4>
            <div className="preset-buttons-grid">
              <button
                className="preset-chip-btn"
                onClick={() => applyPreset(1.0, 0.15)}
              >
                Standard (1.0x)
              </button>
              <button
                className="preset-chip-btn"
                onClick={() => applyPreset(1.8, 0.22)}
              >
                MVA Disaster (1.8x)
              </button>
              <button
                className="preset-chip-btn"
                onClick={() => applyPreset(2.5, 0.28)}
              >
                Viral Outbreak (2.5x)
              </button>
              <button
                className="preset-chip-btn"
                onClick={() => applyPreset(1.2, 0.10)}
              >
                Weekend Delay (1.2x)
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PREDICTED RESULT & FORMULA BREAKDOWN */}
        <div className="forecaster-card">
          <div className="card-title-header">
            <h3>
              <Activity size={20} style={{ color: '#10b981' }} />
              <span>Forecast Outcome ({mode})</span>
            </h3>
            {forecast.isOverflow ? (
              <span style={{ color: '#f43f5e', fontWeight: 700, fontSize: '0.85rem' }}>
                ⚠️ Over Capacity
              </span>
            ) : (
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} style={{ display: 'inline', marginRight: 4 }} />
                Optimal Capacity
              </span>
            )}
          </div>

          {/* HERO FORECAST NUMBER */}
          <div className={`forecast-result-hero ${forecast.isOverflow ? 'overflow' : ''}`}>
            <div className="result-label">Predicted Occupied {mode} Beds (O_forecast)</div>
            <div className="result-number">{forecast.forecastRounded}</div>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Physical Capacity: <strong>{totalCapacity} Beds</strong> ({forecast.occupancyRatePercent}% Occupancy)
            </div>

            {/* CAPACITY GAUGE PROGRESS BAR */}
            <div className="capacity-progress-container">
              <div className="capacity-progress-bar-bg">
                <div
                  className={`capacity-progress-bar-fill ${forecast.isOverflow ? 'overflow' : ''}`}
                  style={{ width: `${Math.min(100, forecast.occupancyRatePercent)}%` }}
                />
              </div>
              <div className="capacity-stats-row">
                <span>Current: {O_current} Beds</span>
                <span>Net 24h Change: {forecast.netChange >= 0 ? `+${forecast.netChange}` : forecast.netChange} Beds</span>
              </div>
            </div>
          </div>

          {/* FORMULA BREAKDOWN CARDS */}
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Formula Input breakdown
          </div>
          <div className="formula-variables-grid">
            <div className="var-stat-box">
              <div className="var-stat-name">O_current</div>
              <div className="var-stat-value">{O_current}</div>
              <div className="var-stat-sub">Occupied Now</div>
            </div>

            <div className="var-stat-box">
              <div className="var-stat-name">E_current * S * P</div>
              <div className="var-stat-value" style={{ color: '#38bdf8' }}>
                +{forecast.incomingNeedFloat}
              </div>
              <div className="var-stat-sub">Incoming ({E_current} ER)</div>
            </div>

            <div className="var-stat-box">
              <div className="var-stat-name">D_expected</div>
              <div className="var-stat-value" style={{ color: '#10b981' }}>
                -{D_expected}
              </div>
              <div className="var-stat-sub">24h Discharges</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
