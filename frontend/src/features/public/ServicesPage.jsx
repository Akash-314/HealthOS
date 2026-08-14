import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Hospital,
  Calendar,
  Brain,
  Ambulance,
  FileText,
  Home,
  Activity,
  Network,
  ArrowRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import './ServicesPage.css';

export function ServicesPage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);

  const servicesList = [
    {
      id: 'discovery',
      icon: <Hospital size={24} />,
      title: 'Hospital Discovery',
      description: 'Search verified hospitals by location, trauma level, and live bed/ICU room telemetry.',
      tag: 'Public & Patient',
      cta: 'Explore Hospitals',
      link: '/hospitals',
      details: 'Allows patients and emergency responders to view real-time ward capacity, ICU availability, doctor rosters, and contact hotlines without compulsory authentication.',
    },
    {
      id: 'appointments',
      icon: <Calendar size={24} />,
      title: 'Appointments',
      description: 'Book outpatient clinic slots, specialist consultations, and virtual telehealth sessions.',
      tag: 'Patient Care',
      cta: 'Book Appointment',
      link: '/login',
      details: 'Direct scheduling with accredited general practitioners and specialists, synced with digital calendar reminders and e-prescriptions.',
    },
    {
      id: 'ai',
      icon: <Brain size={24} />,
      title: 'AI Health Assistant',
      description: 'Interact with clinical AI for 24/7 symptom triage and health record summaries.',
      tag: 'AI Intelligence',
      cta: 'Explore AI Engine',
      link: '/login',
      details: 'Natural language symptom triage engine that evaluates severity, recommends care pathways, and summarizes health history.',
    },
    {
      id: 'emergency',
      icon: <Ambulance size={24} />,
      title: 'Emergency Support',
      description: 'Instant triage matching, pre-arrival hospital ER notifications, and ambulance fleet routing.',
      tag: '24/7 Emergency',
      cta: 'Emergency Portal',
      link: '/emergency',
      details: 'Pre-notifies hospital trauma bays of incoming critical patients and coordinates emergency dispatch telemetry.',
    },
    {
      id: 'records',
      icon: <FileText size={24} />,
      title: 'Health Records (PHR)',
      description: 'Encrypted digital repository for lab test results, prescriptions, and medical history.',
      tag: 'Interoperability',
      cta: 'Access Records',
      link: '/login',
      details: 'HIPAA-compliant 256-bit encrypted health data container accessible across all participating network hospitals.',
    },
    {
      id: 'homecare',
      icon: <Home size={24} />,
      title: 'Home Care',
      description: 'Remote patient vital monitoring, post-op instructions, and home nurse coordination.',
      tag: 'Follow-up',
      cta: 'Learn More',
      link: '/how-it-works',
      details: 'Enables continuous post-discharge care with remote vital logging and automated follow-up reminders.',
    },
    {
      id: 'resource',
      icon: <Activity size={24} />,
      title: 'Resource Coordination',
      description: 'Telemetry dashboard to track beds, ICU wards, medical inventory, and rosters.',
      tag: 'Hospital Ops',
      cta: 'Hospital Portal',
      link: '/register?type=hospital',
      details: 'Operational dashboard for hospital administrators to balance ward occupancy and staff schedules.',
    },
    {
      id: 'network',
      icon: <Network size={24} />,
      title: 'Network Intelligence',
      description: 'Capacity surveillance, epidemic outbreak alerts, and surge capacity management.',
      tag: 'Authority Admin',
      cta: 'Network Overview',
      link: '/about',
      details: 'Regional command analytics for health departments to monitor macro-level capacity and outbreak alerts.',
    },
  ];

  return (
    <div className="services-container">
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <Badge variant="info">CLICKABLE SERVICES EXPLORER</Badge>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>
          HealthOS Platform Services
        </h1>
        <p style={{ fontSize: '1rem', color: '#475569' }}>
          Click any service card below to view detailed capabilities & launch features instantly.
        </p>
      </div>

      <div className="services-grid">
        {servicesList.map((srv) => (
          <div
            className="service-card-item"
            key={srv.id}
            onClick={() => setSelectedService(srv)}
            style={{ cursor: 'pointer' }}
          >
            <div>
              <div className="service-icon-box">{srv.icon}</div>
              <Badge variant="neutral">{srv.tag}</Badge>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '0.65rem', color: '#0f172a' }}>
                {srv.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.4 }}>
                {srv.description}
              </p>
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0284c7', fontWeight: 700, fontSize: '0.85rem' }}>
              Click for Details <ArrowRight size={14} />
            </div>
          </div>
        ))}
      </div>

      {/* CLICKABLE SERVICE DETAIL MODAL */}
      {selectedService && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '520px', width: '90%', boxShadow: 'var(--shadow-modal)', position: 'relative' }}>
            <button
              onClick={() => setSelectedService(null)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            <div className="service-icon-box">{selectedService.icon}</div>
            <Badge variant="info">{selectedService.tag}</Badge>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.75rem', color: '#0f172a' }}>
              {selectedService.title}
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#475569', marginTop: '0.5rem', lineHeight: 1.5 }}>
              {selectedService.details}
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
              <Button
                variant="primary"
                style={{ flex: 1 }}
                onClick={() => {
                  const link = selectedService.link;
                  setSelectedService(null);
                  navigate(link);
                }}
              >
                {selectedService.cta} <ArrowRight size={16} />
              </Button>
              <Button variant="secondary" onClick={() => setSelectedService(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
