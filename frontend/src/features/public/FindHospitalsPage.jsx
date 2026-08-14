import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { hospitalService } from '../../services/hospitalService';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers/AuthProvider';
import {
  Search,
  MapPin,
  Hospital,
  Bed,
  Activity,
  Star,
  PhoneCall,
  Navigation,
  Grid,
  Map,
  Filter,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import './FindHospitalsPage.css';

export function FindHospitalsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  // Filter States
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'ALL');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [hasBeds, setHasBeds] = useState(false);
  const [sortBy, setSortBy] = useState('distance');
  const [activePin, setActivePin] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await hospitalService.getHospitals({
        query,
        type,
        emergencyOnly,
        hasAvailableBeds: hasBeds,
        sortBy,
      });
      setHospitals(data);
      if (data.length > 0) setActivePin(data[0]);
      setLoading(false);
    }
    loadData();
  }, [query, type, emergencyOnly, hasBeds, sortBy]);

  const handleBookClick = (hospitalId) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/patient/appointments&hospitalId=${hospitalId}`);
    } else {
      navigate(`/patient/appointments?hospitalId=${hospitalId}`);
    }
  };

  return (
    <div className="hospitals-page-container">
      {/* PAGE HEADER */}
      <div className="hospitals-header">
        <div>
          <Badge variant="info">PUBLIC HOSPITAL DIRECTORY</Badge>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            Find Verified Hospitals & Care Capacity
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.25rem' }}>
            No sign-in required for public care discovery. View live bed counts, ICU status, and emergency response teams.
          </p>
        </div>

        <div className="view-mode-toggle">
          <button
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} /> Grid View
          </button>
          <button
            className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
            onClick={() => setViewMode('map')}
          >
            <Map size={16} /> Map View
          </button>
        </div>
      </div>

      {/* FILTERS BAR */}
      <div className="filters-bar">
        <div className="input-container has-icon">
          <Search className="input-icon" size={16} />
          <input
            type="text"
            className="input-field"
            placeholder="Search hospital name, city, specialty..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="ALL">All Hospital Types</option>
          <option value="Trauma">Trauma Center Level 1</option>
          <option value="Pediatric">Pediatric & Family</option>
          <option value="Cardiology">Cardiology Specialty</option>
          <option value="Clinic">Community Clinic</option>
        </select>

        <select className="input-field" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="distance">Sort: Nearest Distance</option>
          <option value="beds">Sort: Most Beds Available</option>
          <option value="rating">Sort: Highest Rating</option>
        </select>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => setEmergencyOnly(e.target.checked)}
            />
            🚨 24/7 ER Only
          </label>

          <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <input
              type="checkbox"
              checked={hasBeds}
              onChange={(e) => setHasBeds(e.target.checked)}
            />
            🛏️ Beds Available
          </label>
        </div>

        <Button variant="secondary" size="sm" onClick={() => { setQuery(''); setType('ALL'); setEmergencyOnly(false); setHasBeds(false); }}>
          Reset
        </Button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#64748b' }}>
          <Activity className="animate-spin" size={32} style={{ margin: '0 auto 1rem', color: '#0284c7' }} />
          Searching live hospital capacity...
        </div>
      )}

      {/* GRID VIEW */}
      {!loading && viewMode === 'grid' && (
        <div className="hospitals-grid">
          {hospitals.map((hosp) => (
            <div className="hospital-card" key={hosp.id}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Badge variant={hosp.emergencyCapable ? 'danger' : 'info'}>
                    {hosp.type}
                  </Badge>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>
                    <Star size={16} style={{ color: '#f59e0b', fill: '#f59e0b' }} /> {hosp.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.65rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {hosp.name}
                  {(hosp.verification_status === 'VERIFIED' || hosp.verification_status === undefined) && (
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#15803d', background: '#dcfce7', border: '1px solid #bbf7d0', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <ShieldCheck size={12} /> HealthOS Verified
                    </span>
                  )}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={14} style={{ color: '#0284c7' }} /> {hosp.address} ({hosp.distanceKm} km away)
                </p>
              </div>

              {/* LIVE CAPACITY METRICS */}
              <div className="hospital-metrics-row">
                <div className="metric-box">
                  <span className="metric-value" style={{ color: hosp.availableBeds > 0 ? '#16a34a' : '#dc2626' }}>
                    {hosp.availableBeds} / {hosp.totalBeds}
                  </span>
                  <span className="metric-label">Available Beds</span>
                </div>

                {/* CAPACITY METRICS ROW */}
                <div className="hospital-metrics-row">
                  <div className="metric-box">
                    <span className="metric-value" style={{ color: hosp.availableBeds > 0 ? '#16a34a' : '#dc2626' }}>
                      {hosp.availableBeds} / {hosp.totalBeds}
                    </span>
                    <span className="metric-label">Available Beds</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-value" style={{ color: hosp.availableIcu > 0 ? '#0284c7' : '#94a3b8' }}>
                      {hosp.availableIcu} / {hosp.totalIcu}
                    </span>
                    <span className="metric-label">Available ICUs</span>
                  </div>

                  <div className="metric-box">
                    <span className="metric-value">{hosp.ventilatorsAvailable}</span>
                    <span className="metric-label">Ventilators</span>
                  </div>
                </div>

                <div className="metric-box">
                  <span className="metric-value" style={{ color: hosp.emergencyCapable ? '#e11d48' : '#64748b' }}>
                    {hosp.emergencyCapable ? 'OPEN 24/7' : 'Scheduled'}
                  </span>
                  <span className="metric-label">ER Intake</span>
                </div>
              </div>

              {/* SPECIALIZATIONS TAGS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1.25rem' }}>
                {hosp.specializations.slice(0, 3).map((spec, i) => (
                  <span key={i} style={{ fontSize: '0.725rem', padding: '0.2rem 0.5rem', background: '#f1f5f9', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
                    {spec}
                  </span>
                ))}
              </div>

              {/* CARD ACTIONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <Button variant="secondary" size="sm" onClick={() => navigate(`/hospitals/${hosp.id}`)}>
                  View Details
                </Button>

                <Button variant="primary" size="sm" onClick={() => handleBookClick(hosp.id)}>
                  <Calendar size={14} /> Book Care
                </Button>
              </div>
            </div>
          ))}

          {hospitals.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
              <Hospital size={48} style={{ color: '#94a3b8', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>No hospitals match your search</h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Try clearing filters or searching another location.</p>
            </div>
          )}
        </div>
      )}

      {/* MAP VIEW */}
      {!loading && viewMode === 'map' && (
        <div className="map-simulation-container">
          <div className="simulated-map-canvas">
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'rgba(255, 255, 255, 0.9)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', boxShadow: 'var(--shadow-sm)' }}>
              📍 Interactive Simulated Map View (New York Sector)
            </div>

            {hospitals.map((hosp, idx) => (
              <div
                key={hosp.id}
                className={`map-pin ${activePin?.id === hosp.id ? 'active' : ''}`}
                style={{
                  top: `${30 + idx * 18}%`,
                  left: `${25 + idx * 20}%`,
                }}
                onClick={() => setActivePin(hosp)}
              >
                <Hospital size={14} /> {hosp.name.split(' ')[0]} ({hosp.availableBeds} Beds)
              </div>
            ))}
          </div>

          {/* ACTIVE PIN DETAILS PANEL */}
          {activePin && (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1rem' }}>
              <div>
                <Badge variant="danger">{activePin.type}</Badge>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.75rem', color: '#0f172a' }}>
                  {activePin.name}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.35rem' }}>
                  <MapPin size={14} style={{ display: 'inline', color: '#0284c7' }} /> {activePin.address} ({activePin.distanceKm} km)
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
                  <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#0369a1', fontWeight: 700 }}>AVAILABLE BEDS</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{activePin.availableBeds} / {activePin.totalBeds}</div>
                  </div>

                  <div style={{ padding: '1rem', background: '#ffe4e6', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 700 }}>ICU UNITS</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{activePin.availableIcu} / {activePin.totalIcu}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5 }}>
                  <strong>Emergency Contact:</strong> {activePin.emergencyHotline}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <Button variant="primary" size="md" onClick={() => navigate(`/hospitals/${activePin.id}`)}>
                  View Full Details
                </Button>
                <Button variant="secondary" size="md" onClick={() => handleBookClick(activePin.id)}>
                  Book Care
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
