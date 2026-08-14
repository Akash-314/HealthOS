import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Cpu, Heart, Activity, ArrowRight, Target, Globe, CheckCircle2 } from 'lucide-react';
import './AboutPage.css';

export function AboutPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('MISSION');

  return (
    <div className="about-container">
      {/* HERO */}
      <section className="about-hero">
        <Badge variant="info">ABOUT HEALTHOS</Badge>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', margin: '0.5rem 0' }}>
          Unified Healthcare Intelligence
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#475569' }}>
          Click the tabs below to explore our mission, platform architecture, and roadmap.
        </p>
      </section>

      {/* CLICKABLE TAB SELECTOR */}
      <div className="perspective-tabs">
        <button
          className={`perspective-btn ${activeTab === 'MISSION' ? 'active' : ''}`}
          onClick={() => setActiveTab('MISSION')}
        >
          Mission & Solution
        </button>

        <button
          className={`perspective-btn ${activeTab === 'NETWORK' ? 'active' : ''}`}
          onClick={() => setActiveTab('NETWORK')}
        >
          Network Vision
        </button>

        <button
          className={`perspective-btn ${activeTab === 'ROADMAP' ? 'active' : ''}`}
          onClick={() => setActiveTab('ROADMAP')}
        >
          Roadmap
        </button>
      </div>

      {/* TAB 1: MISSION & SOLUTION */}
      {activeTab === 'MISSION' && (
        <section className="problem-solution-grid">
          <Card title="Fragmented Healthcare Problem" subtitle="Why traditional health systems fail in crises">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <ShieldAlert size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>
                  <strong>Isolated Hospital Data:</strong> Transport delays due to unknown ICU capacity.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <ShieldAlert size={18} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>
                  <strong>Fragmented EMR Records:</strong> Incompatible software forcing redundant tests.
                </p>
              </div>
            </div>
          </Card>

          <Card title="HealthOS Solution" subtitle="Building a connected healthcare ecosystem">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Activity size={18} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>
                  <strong>Live Bed Telemetry:</strong> Real-time bed, ICU, & ventilator tracking.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <Cpu size={18} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.875rem', color: '#475569' }}>
                  <strong>AI Symptom Engine:</strong> Automated triage and patient-to-hospital matching.
                </p>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* TAB 2: NETWORK VISION */}
      {activeTab === 'NETWORK' && (
        <section className="timeline-box">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
            <div>
              <Badge variant="success">OUR VISION</Badge>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
                Connecting Patients & Hospitals Globally
              </h2>
              <p style={{ color: '#475569', marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
                HealthOS powers seamless care coordination for individual patients, city-wide hospitals, and regional health authorities.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Target size={16} style={{ color: '#0284c7' }} /> Patient-First Access
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Discover care, manage appointments, and track records with total transparency.
                </p>
              </div>

              <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <Globe size={16} style={{ color: '#10b981' }} /> Regional Command
                </div>
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
                  Macro-level capacity analytics and emergency load balancing.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TAB 3: ROADMAP */}
      {activeTab === 'ROADMAP' && (
        <section className="roadmap-grid">
          <div className="roadmap-card">
            <Badge variant="info">PHASE 1</Badge>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>Core Architecture</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Role-based routing, database schemas, and FastAPI / Supabase authentication.
            </p>
          </div>

          <div className="roadmap-card" style={{ borderColor: '#0284c7', background: '#f0f9ff' }}>
            <Badge variant="success">PHASE 2 - ACTIVE</Badge>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>Public Website & Auth</h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
              Public discovery, search without login, emergency portal, and onboarding.
            </p>
          </div>

          <div className="roadmap-card">
            <Badge variant="neutral">PHASE 3</Badge>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem', color: '#0f172a' }}>Patient Portal</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>
              Full patient dashboard, AI symptom engine, appointments, and record management.
            </p>
          </div>
        </section>
      )}

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Button variant="primary" size="md" onClick={() => navigate('/hospitals')}>
          Find Nearby Hospitals <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
