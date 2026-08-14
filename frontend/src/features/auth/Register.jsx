import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../app/providers/AuthProvider';
import { PendingVerificationNotice } from './PendingVerificationNotice';
import { Sparkles, Mail, Lock, User, Phone, Building2, ShieldCheck, FileText, AlertCircle } from 'lucide-react';
import './Auth.css';

export function Register() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') === 'hospital' || searchParams.get('status') === 'pending' ? 'HOSPITAL' : 'PATIENT';
  const isPendingView = searchParams.get('status') === 'pending';

  const [regType, setRegType] = useState(initialType);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [isPendingState, setIsPendingState] = useState(isPendingView);

  const { registerPatient, registerHospital } = useAuth();
  const navigate = useNavigate();

  // Patient State
  const [patientForm, setPatientForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    gender: 'Other',
    dob: '',
    consent: false,
  });

  // Hospital State
  const [hospitalForm, setHospitalForm] = useState({
    hospitalName: '',
    licenseNumber: '',
    address: '',
    city: '',
    phone: '',
    emergencyHotline: '',
    hospitalType: 'General Hospital',
    totalBeds: 150,
    totalIcu: 25,
    adminName: '',
    adminEmail: '',
    password: '',
    confirmPassword: '',
    documentUploaded: true,
    consent: false,
  });

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (patientForm.password !== patientForm.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!patientForm.consent) {
      setFormError('Please acknowledge the data privacy consent checkbox.');
      return;
    }

    setSubmitting(true);
    try {
      await registerPatient(patientForm);
      navigate('/patient/dashboard');
    } catch (err) {
      setFormError(err?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (hospitalForm.password !== hospitalForm.confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!hospitalForm.consent) {
      setFormError('Please accept the regulatory compliance terms.');
      return;
    }

    setSubmitting(true);
    try {
      await registerHospital(hospitalForm);
      setIsPendingState(true);
    } catch (err) {
      setFormError(err?.message || 'Hospital registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (isPendingState) {
    return <PendingVerificationNotice hospitalName={hospitalForm.hospitalName || 'Registered Medical Center'} />;
  }

  return (
    <div className="auth-page-container">
      <div className="auth-card-box" style={{ maxWidth: regType === 'HOSPITAL' ? '680px' : '520px' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>
            <Sparkles style={{ color: '#2563eb' }} size={22} /> Create HealthOS Account
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.35rem' }}>
            Join the unified healthcare network today
          </p>
        </div>

        {/* REGISTRATION TYPE TABS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.75rem' }}>
          <button
            type="button"
            className={`auth-role-btn ${regType === 'PATIENT' ? 'active' : ''}`}
            onClick={() => setRegType('PATIENT')}
            style={{ padding: '0.75rem' }}
          >
            <User size={16} style={{ display: 'inline', marginRight: '4px' }} /> Patient Account
          </button>

          <button
            type="button"
            className={`auth-role-btn ${regType === 'HOSPITAL' ? 'active' : ''}`}
            onClick={() => setRegType('HOSPITAL')}
            style={{ padding: '0.75rem' }}
          >
            <Building2 size={16} style={{ display: 'inline', marginRight: '4px' }} /> Hospital Provider
          </button>
        </div>

        {formError && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', color: '#b91c1c', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {formError}
          </div>
        )}

        {/* PATIENT REGISTRATION FORM */}
        {regType === 'PATIENT' && (
          <form onSubmit={handlePatientSubmit}>
            <Input
              label="Full Name"
              type="text"
              icon={User}
              placeholder="Alex Morgan"
              value={patientForm.fullName}
              onChange={(e) => setPatientForm({ ...patientForm, fullName: e.target.value })}
              required
            />

            <Input
              label="Email Address"
              type="email"
              icon={Mail}
              placeholder="alex@example.com"
              value={patientForm.email}
              onChange={(e) => setPatientForm({ ...patientForm, email: e.target.value })}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              icon={Phone}
              placeholder="+1 (555) 019-2831"
              value={patientForm.phone}
              onChange={(e) => setPatientForm({ ...patientForm, phone: e.target.value })}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={patientForm.password}
                onChange={(e) => setPatientForm({ ...patientForm, password: e.target.value })}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={patientForm.confirmPassword}
                onChange={(e) => setPatientForm({ ...patientForm, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={patientForm.consent}
                  onChange={(e) => setPatientForm({ ...patientForm, consent: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <span>I acknowledge the HealthOS Patient Terms of Service & Privacy Policy for handling my digital health records.</span>
              </label>
            </div>

            <Button variant="primary" size="lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Creating Patient Account...' : 'Complete Patient Registration'}
            </Button>
          </form>
        )}

        {/* HOSPITAL REGISTRATION FORM */}
        {regType === 'HOSPITAL' && (
          <form onSubmit={handleHospitalSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Official Hospital Name"
                type="text"
                icon={Building2}
                placeholder="City General Hospital"
                value={hospitalForm.hospitalName}
                onChange={(e) => setHospitalForm({ ...hospitalForm, hospitalName: e.target.value })}
                required
              />

              <Input
                label="Official License / Tax ID"
                type="text"
                placeholder="LIC-NY-99482"
                value={hospitalForm.licenseNumber}
                onChange={(e) => setHospitalForm({ ...hospitalForm, licenseNumber: e.target.value })}
                required
              />
            </div>

            <Input
              label="Official Street Address"
              type="text"
              placeholder="450 Healthcare Blvd, New York"
              value={hospitalForm.address}
              onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="General Contact Phone"
                type="tel"
                icon={Phone}
                placeholder="+1 (555) 019-2831"
                value={hospitalForm.phone}
                onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                required
              />

              <Input
                label="24/7 Emergency Hotline"
                type="tel"
                placeholder="1-800-ER-911"
                value={hospitalForm.emergencyHotline}
                onChange={(e) => setHospitalForm({ ...hospitalForm, emergencyHotline: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label className="input-label">Hospital Type</label>
                <select
                  className="input-field"
                  value={hospitalForm.hospitalType}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, hospitalType: e.target.value })}
                >
                  <option value="General Hospital">General Hospital</option>
                  <option value="Trauma Center Level 1">Trauma Center Level 1</option>
                  <option value="Pediatric Specialty">Pediatric Specialty</option>
                  <option value="Cardiology Center">Cardiology Center</option>
                </select>
              </div>

              <div>
                <label className="input-label">Total Beds</label>
                <input
                  type="number"
                  className="input-field"
                  value={hospitalForm.totalBeds}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, totalBeds: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="input-label">ICU Units</label>
                <input
                  type="number"
                  className="input-field"
                  value={hospitalForm.totalIcu}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, totalIcu: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Admin Contact Name"
                type="text"
                icon={User}
                placeholder="Dr. Sarah Lin"
                value={hospitalForm.adminName}
                onChange={(e) => setHospitalForm({ ...hospitalForm, adminName: e.target.value })}
                required
              />

              <Input
                label="Admin Email Address"
                type="email"
                icon={Mail}
                placeholder="admin@hospital.org"
                value={hospitalForm.adminEmail}
                onChange={(e) => setHospitalForm({ ...hospitalForm, adminEmail: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={hospitalForm.password}
                onChange={(e) => setHospitalForm({ ...hospitalForm, password: e.target.value })}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={hospitalForm.confirmPassword}
                onChange={(e) => setHospitalForm({ ...hospitalForm, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <FileText size={16} style={{ color: '#0284c7' }} /> Medical Licensing & Verification
              </div>
              <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
                Newly registered hospital accounts enter a <strong>PENDING_VERIFICATION</strong> status until regional health authorities verify licensing documentation.
              </p>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={hospitalForm.consent}
                  onChange={(e) => setHospitalForm({ ...hospitalForm, consent: e.target.checked })}
                  style={{ marginTop: '3px' }}
                />
                <span>I certify that I am an authorized administrative representative of this medical facility and agree to HealthOS compliance audits.</span>
              </label>
            </div>

            <Button variant="primary" size="lg" style={{ width: '100%' }} disabled={submitting}>
              {submitting ? 'Submitting Registration...' : 'Submit Hospital Registration for Audit'}
            </Button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already registered? <Link to="/login" style={{ color: '#0284c7', fontWeight: 700 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
}
