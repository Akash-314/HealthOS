import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers/AuthProvider';
import { Sparkles, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import './Auth.css';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await requestPasswordReset(email);
    setSubmitting(false);
    setSent(true);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
            <Sparkles style={{ color: '#2563eb' }} size={22} /> Password Recovery
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.35rem' }}>
            Enter your account email to receive password reset instructions
          </p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Reset Instructions Sent</h3>
            <p style={{ fontSize: '0.9rem', color: '#475569', margin: '0.5rem 0 1.5rem', lineHeight: 1.5 }}>
              If an account exists for <strong>{email}</strong>, you will receive an email with password recovery steps shortly.
            </p>
            <Link to="/login" className="btn btn-secondary" style={{ width: '100%', textDecoration: 'none' }}>
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Account Email Address"
              type="email"
              icon={Mail}
              placeholder="user@healthos.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '0.5rem' }} disabled={submitting}>
              {submitting ? 'Sending Request...' : 'Send Recovery Email'}
            </Button>

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link to="/login" style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
