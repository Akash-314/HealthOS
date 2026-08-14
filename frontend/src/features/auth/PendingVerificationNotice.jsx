import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Clock, CheckCircle2, Building2, PhoneCall, ArrowRight } from 'lucide-react';
import './Auth.css';

export function PendingVerificationNotice({ hospitalName = 'Registered Medical Facility' }) {
  const navigate = useNavigate();

  return (
    <div className="auth-page-container">
      <div className="auth-card-box" style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
          <Clock size={32} />
        </div>

        <Badge variant="warning">STATUS: PENDING_VERIFICATION</Badge>

        <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginTop: '0.75rem' }}>
          Hospital Account Under Verification
        </h2>

        <p style={{ fontSize: '1rem', color: '#475569', marginTop: '0.5rem', lineHeight: 1.6 }}>
          Thank you for registering <strong>{hospitalName}</strong> with HealthOS. To preserve patient safety and medical network integrity, all provider accounts are audited by Regional Health Authorities before full operational features are unlocked.
        </p>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1.75rem 0', textAlign: 'left' }}>
          <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Verification Audit Process:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.85rem', color: '#475569' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <CheckCircle2 size={16} style={{ color: '#16a34a' }} /> 1. Registration received & license queued for audit
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Clock size={16} style={{ color: '#f59e0b' }} /> 2. Regional authority verification (Estimated: 24-48 hours)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', opacity: 0.6 }}>
              <Building2 size={16} /> 3. Hospital Command Center features unlocked upon approval
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button variant="secondary" onClick={() => navigate('/')}>
            Return to Public Home
          </Button>
          <Button variant="primary" onClick={() => navigate('/contact')}>
            Contact Verification Desk <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
