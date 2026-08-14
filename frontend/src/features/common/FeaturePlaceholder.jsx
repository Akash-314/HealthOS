import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HealightDashboard } from '../../components/dashboard/HealightDashboard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  FileText,
  Plus,
  Search,
  Activity,
  ShieldCheck,
  Phone,
  Video,
  Download,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Heart,
  Pill,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import './FeaturePlaceholder.css';

export function FeaturePlaceholder({ title, description, category, role }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // If dashboard title, render Healight overview
  if (title?.toLowerCase().includes('dashboard') || title?.toLowerCase().includes('overview')) {
    return <HealightDashboard roleTitle={role || category} />;
  }

  // APPOINTMENTS MODULE CUSTOM FEATURE VIEW
  if (title?.toLowerCase().includes('appointment') || title?.toLowerCase().includes('booking')) {
    const sampleAppointments = [
      {
        id: 'APT-9042',
        hospitalName: 'Rani Durgavati Medical College & District Hospital',
        doctorName: 'Dr. Rajesh Verma',
        specialty: 'Emergency Cardiology',
        date: 'Tomorrow, Aug 15, 2026',
        time: '10:30 AM',
        status: 'CONFIRMED',
        type: 'In-Person Consultation',
        token: 'TOKEN #14',
        location: 'Kanpur Road, Banda, UP',
      },
      {
        id: 'APT-8819',
        hospitalName: 'Government District Sadar Hospital Banda',
        doctorName: 'Dr. Alok Kumar Gupta',
        specialty: 'Trauma & General Surgery',
        date: 'Aug 18, 2026',
        time: '02:15 PM',
        status: 'SCHEDULED',
        type: 'Follow-up Checkup',
        token: 'TOKEN #08',
        location: 'Civil Lines, Banda, UP',
      },
      {
        id: 'APT-7410',
        hospitalName: 'Metropolitan General Hospital & Trauma Center',
        doctorName: 'Dr. Ananya Sharma',
        specialty: 'Pulmonology',
        date: 'Aug 02, 2026',
        time: '11:00 AM',
        status: 'COMPLETED',
        type: 'Routine Triage',
        token: 'TOKEN #22',
        location: 'Healthcare Blvd, Metro Central',
      },
    ];

    const filteredAppointments = sampleAppointments.filter((apt) => {
      if (activeTab === 'UPCOMING' && apt.status === 'COMPLETED') return false;
      if (activeTab === 'COMPLETED' && apt.status !== 'COMPLETED') return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          apt.hospitalName.toLowerCase().includes(q) ||
          apt.doctorName.toLowerCase().includes(q) ||
          apt.specialty.toLowerCase().includes(q)
        );
      }
      return true;
    });

    return (
      <div className="module-feature-container">
        {/* MODULE HEADER */}
        <div className="module-header-row">
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
              <Badge variant="info">PATIENT CARE PORTAL</Badge>
              <Badge variant="success">ABDM INTEGRATED</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
              Appointments & Care Bookings
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
              Manage your upcoming hospital visits, OPD tokens, and specialist consultations in Banda.
            </p>
          </div>

          <Button variant="primary" size="md" onClick={() => navigate('/hospitals')}>
            <Plus size={16} /> Book New Appointment
          </Button>
        </div>

        {/* STATS METRICS GRID */}
        <div className="module-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue">
              <Calendar size={20} />
            </div>
            <div>
              <div className="stat-number">2</div>
              <div className="stat-label">Upcoming Appointments</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div className="stat-number">14</div>
              <div className="stat-label">Completed Consultations</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper purple">
              <Stethoscope size={20} />
            </div>
            <div>
              <div className="stat-number">3</div>
              <div className="stat-label">Primary Care Specialists</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper orange">
              <Clock size={20} />
            </div>
            <div>
              <div className="stat-number">10:30 AM</div>
              <div className="stat-label">Next Appointment (Tomorrow)</div>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR */}
        <div className="module-controls-bar">
          <div className="tab-pill-group">
            <button
              className={`tab-pill ${activeTab === 'ALL' ? 'active' : ''}`}
              onClick={() => setActiveTab('ALL')}
            >
              All Appointments (3)
            </button>
            <button
              className={`tab-pill ${activeTab === 'UPCOMING' ? 'active' : ''}`}
              onClick={() => setActiveTab('UPCOMING')}
            >
              Upcoming (2)
            </button>
            <button
              className={`tab-pill ${activeTab === 'COMPLETED' ? 'active' : ''}`}
              onClick={() => setActiveTab('COMPLETED')}
            >
              Past Records (1)
            </button>
          </div>

          <div className="search-input-wrapper">
            <Search size={15} className="search-icon-inside" />
            <input
              type="text"
              placeholder="Filter by hospital or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* APPOINTMENTS CARDS LIST */}
        <div className="appointments-list-grid">
          {filteredAppointments.map((apt) => (
            <div className="appointment-card" key={apt.id}>
              <div className="apt-card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span className="apt-id-badge">{apt.id}</span>
                    <span className="apt-token-badge">{apt.token}</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    {apt.hospitalName}
                  </h3>
                </div>

                <span
                  className={`apt-status-pill ${
                    apt.status === 'CONFIRMED'
                      ? 'confirmed'
                      : apt.status === 'COMPLETED'
                      ? 'completed'
                      : 'scheduled'
                  }`}
                >
                  {apt.status === 'CONFIRMED' && <CheckCircle2 size={12} />}
                  {apt.status}
                </span>
              </div>

              <div className="apt-card-body">
                <div className="apt-detail-row">
                  <UserCheck size={16} style={{ color: '#0284c7' }} />
                  <div>
                    <strong>{apt.doctorName}</strong> — <span style={{ color: '#64748b' }}>{apt.specialty}</span>
                  </div>
                </div>

                <div className="apt-detail-row">
                  <Calendar size={16} style={{ color: '#0284c7' }} />
                  <div>
                    <span>{apt.date}</span> at <strong>{apt.time}</strong> ({apt.type})
                  </div>
                </div>

                <div className="apt-detail-row">
                  <MapPin size={16} style={{ color: '#64748b' }} />
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{apt.location}</span>
                </div>
              </div>

              <div className="apt-card-footer">
                <Button variant="secondary" size="sm" onClick={() => navigate('/hospitals')}>
                  <MapPin size={14} /> Navigate Hospital
                </Button>

                <Button variant="primary" size="sm" onClick={() => alert(`Appointment ${apt.id} slip downloaded.`)}>
                  <Download size={14} /> Download Slip
                </Button>
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="empty-module-state">
              <Calendar size={40} style={{ color: '#94a3b8', margin: '0 auto 0.75rem' }} />
              <h3>No appointments found</h3>
              <p>Try searching another keyword or book a fresh appointment in Banda.</p>
              <Button variant="primary" size="sm" style={{ marginTop: '1rem' }} onClick={() => navigate('/hospitals')}>
                Find Verified Hospitals
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // GENERIC HIGH-AESTHETIC FEATURE DASHBOARD FOR OTHER MODULES
  return (
    <div className="module-feature-container">
      {/* MODULE HEADER */}
      <div className="module-header-row">
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
            <Badge variant="info">{category || 'HEALTHOS CORE'}</Badge>
            {role && <Badge variant="warning">ROLE: {role}</Badge>}
            <Badge variant="success">LIVE TELEMETRY</Badge>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>
            {title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            {description || 'Connected HealthOS clinical module with live Supabase database sync.'}
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => navigate('/hospitals')}>
          <Sparkles size={16} /> Explore Hospital Network
        </Button>
      </div>

      {/* THREE RICH OVERVIEW CARDS */}
      <div className="module-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Activity size={20} />
          </div>
          <div>
            <div className="stat-number">ACTIVE</div>
            <div className="stat-label">System Module Status</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="stat-number">VERIFIED</div>
            <div className="stat-label">Data Security & RLS Policy</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <FileText size={20} />
          </div>
          <div>
            <div className="stat-number">LIVE PERSISTENCE</div>
            <div className="stat-label">Supabase PostgreSQL Database</div>
          </div>
        </div>
      </div>

      {/* DETAILED CONTENT CARD */}
      <div className="module-content-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{title} Operational Suite</h3>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Banda Healthcare District Integration</div>
          </div>
        </div>

        <p style={{ color: '#475569', lineHeight: 1.6, fontSize: '0.925rem' }}>
          {description || 'This module provides real-time telemetry, synchronized clinical data, and emergency response capabilities across all connected healthcare providers.'}
        </p>

        <div className="module-status-banner">
          <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
          <div>
            <strong>Operational Status:</strong> All service boundaries active, secure role authentication enabled, and live route guards operating normally.
          </div>
        </div>
      </div>
    </div>
  );
}
