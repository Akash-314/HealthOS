import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Sparkles,
  Search,
  MapPin,
  Ambulance,
  Hospital,
  ShieldCheck,
  Brain,
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Zap,
  Users,
  Building2,
  Stethoscope,
} from 'lucide-react';
import '../../pages/Home.css';

export function PublicHome() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('PATIENT');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/hospitals?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePillClick = (filterType) => {
    navigate(`/hospitals?q=${encodeURIComponent(filterType)}`);
  };

  return (
    <div className="landing-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-pill-badge">
          <Sparkles size={16} /> ONE CONNECTED HEALTHCARE PLATFORM
        </div>
        <h1 className="hero-headline">
          Unified Healthcare Operations for <span>Patients, Hospitals & Networks</span>
        </h1>
        <p className="hero-subheadline">
          Find care instantly, view live hospital bed capacity, get AI symptom guidance, or request rapid emergency triage.
        </p>

        {/* SEARCH WIDGET */}
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <form className="search-widget-form" onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="input-container has-icon" style={{ flex: 1 }}>
              <Search className="input-icon" size={18} />
              <input
                type="text"
                className="input-field"
                placeholder="Search hospital name, city, specialty, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="dark" size="md" type="submit">
              Search Care
            </Button>
          </form>

          {/* CLICKABLE QUICK FILTER PILLS */}
          <div className="hero-filter-pills">
            <button className="hero-pill-btn" onClick={() => navigate('/emergency')}>
              🚨 24/7 ER Only
            </button>
            <button className="hero-pill-btn" onClick={() => handlePillClick('Cardiology')}>
              🫀 Cardiology
            </button>
            <button className="hero-pill-btn" onClick={() => handlePillClick('Pediatrics')}>
              👶 Pediatrics
            </button>
            <button className="hero-pill-btn" onClick={() => handlePillClick('Trauma')}>
              🏣 Level 1 Trauma
            </button>
            <button className="hero-pill-btn" onClick={() => handlePillClick('Neurology')}>
              🧠 Neurology
            </button>
          </div>
        </div>
      </section>

      {/* 2. 4 LARGE INTERACTIVE ACTION TILES */}
      <section className="hero-action-tiles">
        <div className="action-tile-card" onClick={() => navigate('/hospitals')}>
          <div>
            <div className="tile-icon-box"><Hospital size={22} /></div>
            <Badge variant="info">LIVE DIRECTORY</Badge>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.65rem', color: '#0f172a' }}>
              Find Nearby Hospitals
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
              View live bed capacity, ICU availability, & doctor rosters.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
            Search Hospitals <ArrowRight size={14} />
          </div>
        </div>

        <div className="action-tile-card emergency-tile" onClick={() => navigate('/emergency')}>
          <div>
            <div className="tile-icon-box"><Ambulance size={22} /></div>
            <Badge variant="danger">RAPID DISPATCH</Badge>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.65rem', color: '#0f172a' }}>
              Request Emergency Care
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
              Symptom triage matching & hospital ER pre-notification.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e11d48', fontWeight: 700, fontSize: '0.85rem' }}>
            🚨 Emergency Portal <ArrowRight size={14} />
          </div>
        </div>

        <div className="action-tile-card" onClick={() => navigate('/services')}>
          <div>
            <div className="tile-icon-box"><Brain size={22} /></div>
            <Badge variant="info">CLINICAL AI</Badge>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.65rem', color: '#0f172a' }}>
              AI Health Assistant
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
              Instant 24/7 symptom assessment & risk recommendations.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
            Explore AI Engine <ArrowRight size={14} />
          </div>
        </div>

        <div className="action-tile-card" onClick={() => navigate('/register?type=hospital')}>
          <div>
            <div className="tile-icon-box"><Building2 size={22} /></div>
            <Badge variant="success">PROVIDER PORTAL</Badge>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '0.65rem', color: '#0f172a' }}>
              Hospital Onboarding
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem' }}>
              Register your hospital for ward management & regional network telemetry.
            </p>
          </div>
          <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontWeight: 700, fontSize: '0.85rem' }}>
            Register Facility <ArrowRight size={14} />
          </div>
        </div>
      </section>

      {/* 3. CLICKABLE TABBED PLATFORM EXPLORER (In place of long scrolling text!) */}
      <section className="explorer-tabs-container">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Badge variant="neutral">CLICKABLE EXPLORER</Badge>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginTop: '0.35rem' }}>
            Explore HealthOS Capabilities
          </h2>
        </div>

        <div className="explorer-tab-header">
          <button
            className={`tab-selector-btn ${activeTab === 'PATIENT' ? 'active' : ''}`}
            onClick={() => setActiveTab('PATIENT')}
          >
            Patient Care
          </button>

          <button
            className={`tab-selector-btn ${activeTab === 'HOSPITAL' ? 'active' : ''}`}
            onClick={() => setActiveTab('HOSPITAL')}
          >
            Hospital Operations
          </button>

          <button
            className={`tab-selector-btn ${activeTab === 'AI' ? 'active' : ''}`}
            onClick={() => setActiveTab('AI')}
          >
            AI Intelligence
          </button>

          <button
            className={`tab-selector-btn ${activeTab === 'SECURITY' ? 'active' : ''}`}
            onClick={() => setActiveTab('SECURITY')}
          >
            Trust & Security
          </button>
        </div>

        {/* TAB 1: PATIENT CARE */}
        {activeTab === 'PATIENT' && (
          <div className="explorer-content-grid">
            <div className="explorer-feature-box">
              <Clock size={20} style={{ color: '#0284c7' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Zero-Wait Hospital Discovery</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>View open beds and ICU availability before traveling.</p>
            </div>

            <div className="explorer-feature-box">
              <Brain size={20} style={{ color: '#0284c7' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>AI Symptom Triage</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Instant symptom assessment & risk recommendations.</p>
            </div>

            <div className="explorer-feature-box">
              <ShieldCheck size={20} style={{ color: '#0284c7' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Unified Health Records</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Access lab results, prescriptions, and history across all clinics.</p>
            </div>
          </div>
        )}

        {/* TAB 2: HOSPITAL OPERATIONS */}
        {activeTab === 'HOSPITAL' && (
          <div className="explorer-content-grid">
            <div className="explorer-feature-box">
              <Activity size={20} style={{ color: '#10b981' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Ward & Bed Telemetry</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Update bed status, ICU rooms, and ventilator availability.</p>
            </div>

            <div className="explorer-feature-box">
              <Ambulance size={20} style={{ color: '#e11d48' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Pre-Intake ER Triage</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Receive incoming ambulance patient vitals prior to hospital arrival.</p>
            </div>

            <div className="explorer-feature-box">
              <Users size={20} style={{ color: '#0284c7' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Doctor Roster Desk</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Schedule shifts, assign doctors, and manage outpatient queues.</p>
            </div>
          </div>
        )}

        {/* TAB 3: AI INTELLIGENCE */}
        {activeTab === 'AI' && (
          <div className="explorer-content-grid">
            <div className="explorer-feature-box">
              <Stethoscope size={20} style={{ color: '#0284c7' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Guided Assessment</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Natural language symptom triage and clinical risk stratification.</p>
            </div>

            <div className="explorer-feature-box">
              <Activity size={20} style={{ color: '#10b981' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Smart Resource Routing</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Matches patients to nearest equipped ER facility.</p>
            </div>

            <div className="explorer-feature-box">
              <Zap size={20} style={{ color: '#f59e0b' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Record Summarization</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Summarizes complex medical histories into actionable notes.</p>
            </div>
          </div>
        )}

        {/* TAB 4: TRUST & SECURITY */}
        {activeTab === 'SECURITY' && (
          <div className="explorer-content-grid">
            <div className="explorer-feature-box">
              <Lock size={20} style={{ color: '#0284c7' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>HIPAA & GDPR Compliant</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Strict data protection standards for patient health records.</p>
            </div>

            <div className="explorer-feature-box">
              <ShieldCheck size={20} style={{ color: '#10b981' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>Verified Providers</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>Hospital licenses audited by regional health authorities.</p>
            </div>

            <div className="explorer-feature-box">
              <CheckCircle2 size={20} style={{ color: '#2563eb' }} />
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.5rem' }}>256-Bit Encryption</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>AES encryption for all patient data in transit and at rest.</p>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Button variant="primary" size="md" onClick={() => navigate('/hospitals')}>
            Search Nearby Hospitals <ArrowRight size={16} />
          </Button>
        </div>
      </section>
    </div>
  );
}
