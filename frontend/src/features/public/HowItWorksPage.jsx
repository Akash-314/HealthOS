import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ShieldCheck, ArrowRight, Activity, Brain, Ambulance, Stethoscope, CheckCircle2 } from 'lucide-react';
import './HowItWorksPage.css';

export function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('PATIENT');
  const navigate = useNavigate();

  return (
    <div className="howitworks-container">
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <Badge variant="info">INTERACTIVE SYSTEM WORKFLOW</Badge>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0' }}>
          How HealthOS Operates
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6 }}>
          Select a role perspective below to see how HealthOS orchestrates real-time health operations.
        </p>
      </div>

      {/* PERSPECTIVE SWITCHER */}
      <div className="perspective-tabs">
        <button
          className={`perspective-btn ${activeTab === 'PATIENT' ? 'active' : ''}`}
          onClick={() => setActiveTab('PATIENT')}
        >
          <User size={18} style={{ display: 'inline', marginRight: '6px' }} /> Patient Journey
        </button>

        <button
          className={`perspective-btn ${activeTab === 'HOSPITAL' ? 'active' : ''}`}
          onClick={() => setActiveTab('HOSPITAL')}
        >
          <Building2 size={18} style={{ display: 'inline', marginRight: '6px' }} /> Hospital Operations
        </button>

        <button
          className={`perspective-btn ${activeTab === 'AUTHORITY' ? 'active' : ''}`}
          onClick={() => setActiveTab('AUTHORITY')}
        >
          <ShieldCheck size={18} style={{ display: 'inline', marginRight: '6px' }} /> Authority & Network
        </button>
      </div>

      {/* PATIENT WORKFLOW */}
      {activeTab === 'PATIENT' && (
        <div className="flow-cards-container">
          <div className="flow-step-item">
            <div className="flow-step-badge">1</div>
            <div>
              <Badge variant="info">STEP 1: PATIENT DISCOVERY & INTAKE</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Search Care or Consult AI Assistant
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Patients search nearby verified hospitals by specialization and live bed capacity, or interact with the HealthOS AI Assistant to describe symptoms and receive immediate triage guidance.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge">2</div>
            <div>
              <Badge variant="info">STEP 2: HEALTHOS PLATFORM MATCHING</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Intelligent Resource & Capacity Allocation
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                The HealthOS core engine queries live hospital bed databases, ICU ward statuses, and doctor schedules to find the optimal care location within seconds.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge">3</div>
            <div>
              <Badge variant="success">STEP 3: CARE DELIVERY & ADMISSION</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Frictionless Hospital Intake
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Patient health profile records, allergy notes, and emergency intake data are transmitted securely to the admitting clinical team before the patient arrives.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge">4</div>
            <div>
              <Badge variant="neutral">STEP 4: FOLLOW-UP & DIGITAL RECORDS</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Post-Care Monitoring & Digital Prescriptions
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Discharge instructions, e-prescriptions, and follow-up appointment reminders sync automatically to the patient’s personal health record portal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HOSPITAL WORKFLOW */}
      {activeTab === 'HOSPITAL' && (
        <div className="flow-cards-container">
          <div className="flow-step-item">
            <div className="flow-step-badge" style={{ background: '#e0f2fe' }}>1</div>
            <div>
              <Badge variant="info">STEP 1: TELEMETRY & BED CAPACITY UPDATES</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Real-Time Ward Management
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Hospital staff update bed availability, ward maintenance status, and ICU ventilator counts through the intuitive Hospital Command Dashboard.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge" style={{ background: '#ffe4e6', color: '#e11d48' }}>2</div>
            <div>
              <Badge variant="danger">STEP 2: EMERGENCY TRIAGE NOTIFICATIONS</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Pre-Arrival Patient Telemetry
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                When an emergency ambulance is dispatched, emergency ER rooms receive live incoming patient vitals and triage priority notifications.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge">3</div>
            <div>
              <Badge variant="success">STEP 3: CLINICAL SCHEDULING & ROSTER DESK</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Doctor Roster & Outpatient Management
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Manage doctor consultation slots, specialist availability, and outpatient queues seamlessly without phone delays.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AUTHORITY WORKFLOW */}
      {activeTab === 'AUTHORITY' && (
        <div className="flow-cards-container">
          <div className="flow-step-item">
            <div className="flow-step-badge" style={{ background: '#fef3c7', color: '#b45309' }}>1</div>
            <div>
              <Badge variant="warning">STEP 1: REGIONAL MONITORING</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Macro-Level Capacity Surveillance
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Health authorities view aggregated bed occupancy rates, ICU stress levels, and ambulance response times across all regional hospitals.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge">2</div>
            <div>
              <Badge variant="info">STEP 2: RESOURCE LOAD BALANCING</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Automated Surge Allocation
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                During mass casualty events or seasonal surges, authority admins route emergency traffic dynamically to under-utilized facilities.
              </p>
            </div>
          </div>

          <div className="flow-step-item">
            <div className="flow-step-badge">3</div>
            <div>
              <Badge variant="success">STEP 3: HOSPITAL LICENSING AUDITS</Badge>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>
                Provider Verification & Safety Standards
              </h3>
              <p style={{ color: '#475569', fontSize: '0.925rem', marginTop: '0.35rem', lineHeight: 1.5 }}>
                Review newly registered hospital licensing documents and verify operational standards before granting verified network status.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Button variant="primary" size="lg" onClick={() => navigate('/hospitals')}>
          Try Hospital Finder Now <ArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
}
