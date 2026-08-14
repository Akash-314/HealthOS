import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROLES } from '../../types/roles';
import { Mail, Lock, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import './Auth.css';

export function Login() {
  const [selectedRole, setSelectedRole] = useState(ROLES.PATIENT);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, loginAs, isLoading, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = new URLSearchParams(location.search).get('redirect') || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSubmitting(true);
    try {
      const user = await login(email, password, selectedRole);
      const targetRole = user?.role || selectedRole;

      if (targetRole === ROLES.PATIENT) {
        navigate(redirectPath || '/patient/dashboard');
      } else if (targetRole === ROLES.HOSPITAL) {
        if (user?.hospital_status === 'PENDING_VERIFICATION') {
          navigate('/register?status=pending');
        } else {
          navigate('/hospital/dashboard');
        }
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setLocalError(err?.message || 'Invalid email or password credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoShortcut = (role, demoEmail) => {
    loginAs(role, demoEmail);
    if (role === ROLES.PATIENT) navigate(redirectPath || '/patient/dashboard');
    else if (role === ROLES.HOSPITAL) {
      if (demoEmail.includes('pending')) navigate('/register?status=pending');
      else navigate('/hospital/dashboard');
    } else navigate('/admin/dashboard');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
            <Sparkles style={{ color: '#2563eb' }} size={22} /> HealthOS Sign In
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.35rem' }}>
            Select your account portal to sign in securely
          </p>
        </div>

        {/* ROLE SELECTOR */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="input-label">Account Role</label>
          <div className="auth-role-grid">
            <button
              type="button"
              className={`auth-role-btn ${selectedRole === ROLES.PATIENT ? 'active' : ''}`}
              onClick={() => setSelectedRole(ROLES.PATIENT)}
            >
              Patient
            </button>

            <button
              type="button"
              className={`auth-role-btn ${selectedRole === ROLES.HOSPITAL ? 'active' : ''}`}
              onClick={() => setSelectedRole(ROLES.HOSPITAL)}
            >
              Hospital
            </button>

            <button
              type="button"
              className={`auth-role-btn ${selectedRole === ROLES.ADMIN ? 'active' : ''}`}
              onClick={() => setSelectedRole(ROLES.ADMIN)}
            >
              Admin / Authority
            </button>
          </div>
        </div>

        {/* ERROR BANNER */}
        {(localError || authError) && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {localError || authError}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder={`${selectedRole.toLowerCase()}@healthos.org`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.25rem 0 1.25rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <Link to="/forgot-password" style={{ color: '#0284c7', fontWeight: 600 }}>Forgot password?</Link>
          </div>

          <Button variant="primary" size="lg" style={{ width: '100%' }} disabled={submitting || isLoading}>
            {submitting ? 'Verifying Credentials...' : `Sign In to ${selectedRole} Portal`}
          </Button>
        </form>

        {/* DEMO ONE-CLICK SHORTCUTS FOR REVIEW */}
        <div className="demo-login-shortcuts">
          <p style={{ fontSize: '0.775rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>
            ⚡ Instant Demo Login Shortcuts:
          </p>
          <div>
            <button
              className="demo-shortcut-btn"
              onClick={() => handleDemoShortcut(ROLES.PATIENT, 'patient@healthos.org')}
            >
              Demo Patient
            </button>
            <button
              className="demo-shortcut-btn"
              onClick={() => handleDemoShortcut(ROLES.HOSPITAL, 'hospital@healthos.org')}
            >
              Demo Hospital (Verified)
            </button>
            <button
              className="demo-shortcut-btn"
              onClick={() => handleDemoShortcut(ROLES.HOSPITAL, 'pending.hospital@healthos.org')}
            >
              Demo Hospital (Pending)
            </button>
            <button
              className="demo-shortcut-btn"
              onClick={() => handleDemoShortcut(ROLES.ADMIN, 'admin@healthos.org')}
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account? <Link to="/register" style={{ color: '#0284c7', fontWeight: 700 }}>Register Now</Link>
        </div>
      </div>
    </div>
  );
}
