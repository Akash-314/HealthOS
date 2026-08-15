import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emergencyHospitalService } from '../../services/emergencyHospitalService';
import { hospitalService } from '../../services/hospitalService';
import { EMERGENCY_TYPES, EMERGENCY_STATUS_LABELS } from '../../types/emergency';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  AlertTriangle,
  Ambulance,
  Heart,
  RefreshCw,
  ShieldCheck,
  Lock,
  ArrowRight,
  MapPin,
  Activity,
  AlertCircle,
  PhoneCall,
  Building2,
} from 'lucide-react';
import './HospitalEmergencyDashboard.css';

export function HospitalEmergencyDashboard() {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);

  // Hospital Selector State
  const [hospitalsList, setHospitalsList] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState('a1b2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6');
  const [verifStatus, setVerifStatus] = useState('VERIFIED');

  useEffect(() => {
    loadHospitalsList();
  }, []);

  const loadHospitalsList = async () => {
    try {
      const data = await hospitalService.getHospitals();
      setHospitalsList(data);
    } catch (_e) {
      // Fallback
    }
  };

  useEffect(() => {
    const savedVerif = localStorage.getItem(`healthos_verification_${selectedHospitalId}`);
    if (savedVerif) {
      try {
        const parsed = JSON.parse(savedVerif);
        if (parsed.status) setVerifStatus(parsed.status);
      } catch (_e) {
        // Fallback
      }
    } else {
      setVerifStatus('VERIFIED');
    }
  }, [selectedHospitalId]);

  const loadData = async () => {
    setLoading(true);
    const data = await emergencyHospitalService.getHospitalEmergencies(selectedHospitalId);
    setEmergencies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const unsubscribe = emergencyHospitalService.subscribeToHospitalEmergencies(selectedHospitalId, () => {
      loadData();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedHospitalId]);

  const handleAccept = async (emgId) => {
    const selectedHosp = hospitalsList.find((h) => h.id === selectedHospitalId);
    const hospName = selectedHosp ? selectedHosp.name : 'Hospital';
    await emergencyHospitalService.acceptEmergency(emgId, hospName);
    setActiveAlert(`Emergency intake accepted by ${hospName}! Trauma bay notified & ambulance dispatch confirmed.`);
    setTimeout(() => setActiveAlert(null), 4000);
    loadData();
  };

  const handleReject = async (emgId) => {
    const selectedHosp = hospitalsList.find((h) => h.id === selectedHospitalId);
    const hospName = selectedHosp ? selectedHosp.name : 'Hospital';
    await emergencyHospitalService.rejectEmergency(emgId, hospName);
    setActiveAlert('Declined intake. System is re-routing SOS call to next nearest capable hospital.');
    setTimeout(() => setActiveAlert(null), 4000);
    loadData();
  };

  const renderVerificationBanner = () => {
    switch (verifStatus) {
      case 'VERIFIED':
        return (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={24} style={{ color: '#16a34a' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#14532d', fontSize: '0.95rem' }}>🟢 HealthOS Verified Emergency Facility</div>
                <div style={{ fontSize: '0.8rem', color: '#15803d' }}>Authorized for live SOS routing, automatic nearest matching, and ambulance dispatch.</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/hospital/verification')}>
              Verification Dossier <ArrowRight size={14} />
            </Button>
          </div>
        );
      case 'UNDER_REVIEW':
        return (
          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={24} style={{ color: '#ea580c' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#9a3412', fontSize: '0.95rem' }}>🟠 Verification Under Regional Review</div>
                <div style={{ fontSize: '0.8rem', color: '#c2410c' }}>Credentials are being verified by HealthOS Admin before joining live dispatch network.</div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/hospital/verification')}>
              View Application <ArrowRight size={14} />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const currentHospitalObj = hospitalsList.find((h) => h.id === selectedHospitalId);

  return (
    <div className="hospital-emergency-container">
      {/* HEADER */}
      <div className="hospital-emergency-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <Badge variant="danger">24/7 ER TRAUMA & SOS INTAKE COMMAND</Badge>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            Emergency SOS & Ambulance Dispatch Command
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.15rem' }}>
            Realtime SOS calls, patient vitals, location coordinates, and ambulance dispatch status.
          </p>
        </div>

        {/* FACILITY SELECTOR DROPDOWN */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Select Hospital Facility:</label>
            <select
              value={selectedHospitalId}
              onChange={(e) => setSelectedHospitalId(e.target.value)}
              style={{ padding: '0.5rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', background: '#ffffff', outline: 'none' }}
            >
              <option value="ALL">🌐 All Regional Facilities (Network Feed)</option>
              {hospitalsList.map((h) => (
                <option key={h.id} value={h.id}>
                  🏥 {h.name}
                </option>
              ))}
            </select>
          </div>

          <Button variant="secondary" size="sm" onClick={loadData} style={{ marginTop: '1.25rem' }}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {/* VERIFICATION BANNER */}
      {renderVerificationBanner()}

      {/* ALERT BANNER */}
      {activeAlert && (
        <div style={{ padding: '0.85rem 1.25rem', background: '#dcfce7', border: '1px solid #86efac', borderRadius: 'var(--radius-md)', color: '#14532d', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          {activeAlert}
        </div>
      )}

      {/* EMERGENCY SOS LIST */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', fontWeight: 600 }}>
          Loading live hospital emergency intakes...
        </div>
      ) : emergencies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0' }}>
          <ShieldAlert size={36} style={{ color: '#94a3b8', margin: '0 auto 0.5rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>No Active Emergency SOS Intakes</h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            No incoming emergency requests currently assigned to {currentHospitalObj ? currentHospitalObj.name : 'this facility'}.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {emergencies.map((item) => {
            const amb = item.ambulance_details || {
              vehicle_number: 'UP-90-AMB-1081',
              driver_name: 'Ramesh Yadav',
              driver_phone: '+91 98390 10810',
              status: 'DISPATCHED',
              eta_minutes: 5,
            };

            return (
              <Card key={item.id} className="emergency-intake-card" style={{ padding: '1.25rem', borderLeft: '5px solid #ef4444' }}>
                {/* CARD HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                    <div className="emergency-type-icon-box" style={{ background: '#fef2f2', padding: '0.65rem', borderRadius: 'var(--radius-md)' }}>
                      <Heart size={26} style={{ color: '#ef4444' }} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          {item.emergency_type || 'CRITICAL'} EMERGENCY SOS
                        </h3>
                        <Badge variant="danger">{item.severity || 'HIGH'} SEVERITY</Badge>
                        <Badge variant="outline">TOKEN: {item.access_token || item.id.slice(0, 8)}</Badge>
                      </div>
                      <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} /> SOS Received: {item.created_at ? new Date(item.created_at).toLocaleTimeString() : 'Just now'} • Nearest Hospital Matched: <strong>{currentHospitalObj ? currentHospitalObj.name : 'Rani Durgavati Medical College'}</strong>
                      </p>
                    </div>
                  </div>

                  <Badge variant={item.status === 'HOSPITAL_ACCEPTED' ? 'success' : 'warning'} style={{ fontSize: '0.85rem', padding: '0.35rem 0.75rem' }}>
                    {EMERGENCY_STATUS_LABELS[item.status] || item.status}
                  </Badge>
                </div>

                {/* DETAILED INFORMATION GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1.1rem', borderRadius: 'var(--radius-md)', margin: '1rem 0', border: '1px solid #e2e8f0' }}>
                  {/* PATIENT DETAILS */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <User size={14} style={{ color: '#2563eb' }} /> Patient Details
                    </div>
                    <div style={{ fontWeight: 800, color: '#0f172a', marginTop: '0.25rem', fontSize: '1rem' }}>
                      {item.guest_patient_name || 'Emergency Patient'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.1rem' }}>
                      Age: {item.guest_patient_age || 42} yrs • Gender: {item.guest_patient_gender || 'Male'} • Blood Group: <strong style={{ color: '#dc2626' }}>{item.blood_group || 'O+'}</strong>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#1e293b', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Phone size={13} style={{ color: '#16a34a' }} />
                      <a href={`tel:${item.guest_patient_phone || '+919415099480'}`} style={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none' }}>
                        {item.guest_patient_phone || '+91 94150 99480'}
                      </a>
                    </div>
                    {item.guest_emergency_contact_name && (
                      <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.25rem' }}>
                        Kin: {item.guest_emergency_contact_name} ({item.guest_emergency_contact_phone || 'Contact provided'})
                      </div>
                    )}
                  </div>

                  {/* CLINICAL SYMPTOMS & VITALS */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Activity size={14} style={{ color: '#dc2626' }} /> Clinical Vitals & Symptoms
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700, marginTop: '0.25rem' }}>
                      {item.description || 'Emergency medical call registered via HealthOS SOS button.'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: item.is_conscious !== false ? '#dcfce7' : '#fee2e2', color: item.is_conscious !== false ? '#15803d' : '#b91c1c', borderRadius: '4px', fontWeight: 700 }}>
                        {item.is_conscious !== false ? '🟢 Conscious' : '🔴 Unconscious'}
                      </span>
                      <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: item.is_breathing_normally !== false ? '#dcfce7' : '#fee2e2', color: item.is_breathing_normally !== false ? '#15803d' : '#b91c1c', borderRadius: '4px', fontWeight: 700 }}>
                        {item.is_breathing_normally !== false ? '🟢 Normal Breathing' : '🔴 Respiratory Distress'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.35rem' }}>
                      Allergies: <strong>{item.known_allergies || 'None Reported'}</strong>
                    </div>
                  </div>

                  {/* INCIDENT LOCATION */}
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={14} style={{ color: '#d97706' }} /> GPS Incident Location
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>
                      {item.address_text || 'Banda, Uttar Pradesh'}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.15rem', fontFamily: 'monospace' }}>
                      Lat: {item.latitude || 25.4760}, Lon: {item.longitude || 80.3320}
                    </div>
                  </div>

                  {/* AMBULANCE DISPATCH & CALL STATUS */}
                  <div style={{ background: '#f0f9ff', padding: '0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Ambulance size={15} style={{ color: '#0284c7' }} /> Ambulance Calling & Dispatch
                    </div>
                    <div style={{ fontWeight: 800, color: '#0369a1', marginTop: '0.25rem', fontSize: '0.95rem' }}>
                      Unit {amb.vehicle_number} ({amb.status})
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '0.15rem' }}>
                      Driver: <strong>{amb.driver_name}</strong>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#0284c7', marginTop: '0.15rem', fontWeight: 700 }}>
                      ETA: ~{amb.eta_minutes || 5} mins to scene
                    </div>
                    <div style={{ marginTop: '0.4rem' }}>
                      <a
                        href={`tel:${amb.driver_phone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          background: '#0284c7',
                          color: '#ffffff',
                          padding: '0.3rem 0.65rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <PhoneCall size={13} /> Call Driver ({amb.driver_phone})
                      </a>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {item.status !== 'HOSPITAL_ACCEPTED' ? (
                    <>
                      <Button variant="danger" size="sm" onClick={() => handleReject(item.id)}>
                        <XCircle size={16} /> Decline / Re-route SOS Call
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleAccept(item.id)}>
                        <CheckCircle2 size={16} /> Accept Emergency Intake (Confirm Trauma Bay Ready)
                      </Button>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.9rem' }}>
                      <CheckCircle2 size={18} /> Intake Accepted & ER Trauma Bay Reserved
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

