import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { MOCK_HOSPITALS } from '../../services/mockHospitals';
import {
  Ambulance,
  PhoneCall,
  ShieldAlert,
  Activity,
  Hospital,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
} from 'lucide-react';
import './EmergencyPublicPage.css';

export function EmergencyPublicPage() {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [isDispatched, setIsDispatched] = useState(false);

  const symptomsList = [
    { id: 'chest_pain', label: 'Severe Chest Pain', urgency: 'CRITICAL' },
    { id: 'breathing', label: 'Difficulty Breathing', urgency: 'CRITICAL' },
    { id: 'stroke', label: 'Sudden Weakness / Stroke Signs', urgency: 'CRITICAL' },
    { id: 'trauma', label: 'Severe Physical Trauma', urgency: 'HIGH' },
    { id: 'fever', label: 'High Fever & Disorientation', urgency: 'HIGH' },
    { id: 'allergic', label: 'Severe Allergic Reaction', urgency: 'HIGH' },
  ];

  const toggleSymptom = (id) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== id));
    } else {
      setSelectedSymptoms([...selectedSymptoms, id]);
    }
  };

  const hasCritical = selectedSymptoms.some((id) =>
    ['chest_pain', 'breathing', 'stroke'].includes(id)
  );

  const emergencyHospitals = MOCK_HOSPITALS.filter((h) => h.emergencyCapable);

  return (
    <div className="emergency-page-container">
      {/* DEMOWARE NOTICE */}
      <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#92400e' }}>
        <AlertTriangle size={18} style={{ flexShrink: 0 }} />
        <div>
          <strong>Demoware Simulation Mode:</strong> This page simulates emergency triage & hospital matching. For actual real-life medical emergencies, dial <strong>911</strong> or your local emergency hotline immediately.
        </div>
      </div>

      {/* EMERGENCY HERO BANNER */}
      <div className="emergency-hero-banner">
        <Badge variant="danger">24/7 RAPID EMERGENCY DISPATCH</Badge>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.75rem' }}>
          HealthOS Emergency Care & Response Portal
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '750px', margin: '0.75rem auto 2rem' }}>
          Rapid emergency triage, live hospital bed matching, and ambulance coordination in real time.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:911" className="btn btn-emergency btn-lg" style={{ textDecoration: 'none' }}>
            <PhoneCall size={20} /> CALL 911 IMMEDIATELY
          </a>
          <Button variant="dark" size="lg" onClick={() => setIsDispatched(true)}>
            <Ambulance size={20} /> Request Triage Simulation
          </Button>
        </div>
      </div>

      {/* SIMULATED DISPATCH SUCCESS BANNER */}
      {isDispatched && (
        <div style={{ background: '#dcfce7', border: '2px solid #86efac', padding: '1.75rem', borderRadius: 'var(--radius-lg)', color: '#14532d' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <CheckCircle2 size={32} style={{ color: '#16a34a' }} />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Demoware Emergency Intake Activated</h3>
              <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Assigned to: <strong>Metropolitan General Hospital Level 1 Trauma Center</strong> (ETA: 7 mins). Hospital ER pre-notified of incoming patient status.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK SYMPTOM TRIAGE WIDGET */}
      <div className="triage-widget-card">
        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
          Quick Emergency Triage Selector
        </h3>
        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
          Select observed symptoms to calculate urgency level and filter emergency ER facilities.
        </p>

        <div className="symptom-btn-grid">
          {symptomsList.map((sym) => {
            const isSelected = selectedSymptoms.includes(sym.id);
            return (
              <button
                key={sym.id}
                className={`symptom-toggle-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleSymptom(sym.id)}
              >
                <div>{sym.label}</div>
                <div style={{ fontSize: '0.725rem', opacity: 0.8, marginTop: '0.2rem' }}>{sym.urgency}</div>
              </button>
            );
          })}
        </div>

        {selectedSymptoms.length > 0 && (
          <div
            className="urgency-badge-card"
            style={{
              background: hasCritical ? '#ffe4e6' : '#fef3c7',
              border: `1px solid ${hasCritical ? '#fecdd3' : '#fde68a'}`,
              color: hasCritical ? '#b91c1c' : '#92400e',
            }}
          >
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                CALCULATED URGENCY: {hasCritical ? 'CRITICAL (IMMEDIATE RED INTAKE)' : 'HIGH PRIORITY'}
              </div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>
                {hasCritical
                  ? 'High risk of acute cardiopulmonary or neurological event. Dispatching to Level 1 Trauma Center.'
                  : 'Requires urgent medical evaluation within 30 minutes.'}
              </div>
            </div>
            <Button
              variant={hasCritical ? 'emergency' : 'primary'}
              size="sm"
              onClick={() => setIsDispatched(true)}
            >
              Simulate Matching
            </Button>
          </div>
        )}
      </div>

      {/* 5-STAGE EMERGENCY FLOW */}
      <Card title="HealthOS Emergency Response Flow" subtitle="5-step automated emergency protocol">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, color: '#e11d48', fontSize: '0.85rem' }}>STAGE 1</div>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Emergency Request</h5>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Patient or bystander initiates request via app or hotline.</p>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, color: '#0284c7', fontSize: '0.85rem' }}>STAGE 2</div>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>AI Triage Assessment</h5>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Symptom evaluation & risk priority classification.</p>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, color: '#10b981', fontSize: '0.85rem' }}>STAGE 3</div>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Hospital Matching</h5>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Queries live ICU beds & trauma center capacity.</p>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '0.85rem' }}>STAGE 4</div>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Ambulance Dispatch</h5>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>Routes nearest available EMS vehicle to patient location.</p>
          </div>

          <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontWeight: 800, color: '#6366f1', fontSize: '0.85rem' }}>STAGE 5</div>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginTop: '0.25rem' }}>Hospital Pre-Notice</h5>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>ER trauma bay preps before patient arrival.</p>
          </div>
        </div>
      </Card>

      {/* NEARBY EMERGENCY HOSPITALS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
              Nearby Emergency Ready Hospitals
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Live ER intake status & ICU availability</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigate('/hospitals')}>
            View All Hospitals <ArrowRight size={14} />
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {emergencyHospitals.map((hosp) => (
            <Card key={hosp.id} title={hosp.name} subtitle={`${hosp.distanceKm} km away • ${hosp.type}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontSize: '0.875rem' }}>
                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>AVAILABLE BEDS</span>
                  <strong style={{ color: '#15803d', fontSize: '1.1rem' }}>{hosp.availableBeds} / {hosp.totalBeds}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>ICU UNITS</span>
                  <strong style={{ color: '#0369a1', fontSize: '1.1rem' }}>{hosp.availableIcu} Ready</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>ER DESK</span>
                  <Badge variant="danger">OPEN 24/7</Badge>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Button variant="emergency" size="sm" style={{ flex: 1 }} onClick={() => navigate(`/hospitals/${hosp.id}`)}>
                  View Emergency Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
