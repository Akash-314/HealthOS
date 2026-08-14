import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
  Mail,
  User,
  PhoneCall,
  MapPin,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  HelpCircle,
  Building2,
  FileText,
  LifeBuoy,
} from 'lucide-react';
import './ContactPage.css';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'PATIENT_HELP',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', category: 'PATIENT_HELP', subject: '', message: '' });
    }, 4000);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: 'Do patients need an account to search for nearby hospital beds?',
      a: 'No! Public users can search hospitals, check live bed capacity, view doctor rosters, and access emergency hotline details without any sign-in requirement.',
    },
    {
      q: 'How does hospital onboarding and verification work?',
      a: 'Newly registered hospitals enter a PENDING_VERIFICATION state. Regional health authorities audit the official medical license and facility credentials before granting full access to hospital command features.',
    },
    {
      q: 'Is HealthOS HIPAA & GDPR compliant?',
      a: 'Yes. HealthOS strictly enforces end-to-end 256-bit encryption for all personal health data, ensuring compliance with international privacy standards.',
    },
    {
      q: 'What happens if I request emergency assistance on HealthOS?',
      a: 'The HealthOS emergency triage engine evaluates symptom priority, identifies the nearest equipped trauma center, pre-notifies the hospital ER bay, and assists in ambulance coordination.',
    },
    {
      q: 'How can healthcare authorities monitor regional hospital capacity?',
      a: 'Authorized health department accounts have access to the Admin Regional Command Center dashboard, showing aggregate bed occupancy, ICU load, and epidemic surveillance alerts.',
    },
    {
      q: 'Can patients transfer records between different hospitals on HealthOS?',
      a: 'Yes! The HealthOS Personal Health Record (PHR) system allows authorized digital sharing of lab reports, prescriptions, and medical histories across all participating network hospitals.',
    },
  ];

  return (
    <div className="contact-container">
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <Badge variant="info">SUPPORT & COMMUNICATIONS</Badge>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#0f172a', margin: '0.75rem 0' }}>
          Contact HealthOS Support & Network Desk
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#475569', lineHeight: 1.6 }}>
          Have questions about patient accounts, hospital licensing, or network API integration? We are here to help.
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="contact-layout-grid">
        {/* CONTACT FORM */}
        <Card title="Send Us a Message" subtitle="Our team responds within 24 operational hours">
          {submitted ? (
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', padding: '1.5rem', borderRadius: 'var(--radius-md)', color: '#14532d', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <CheckCircle2 size={24} style={{ color: '#16a34a', flexShrink: 0 }} />
              <div>
                <strong>Message Received Successfully!</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.2rem' }}>Thank you for contacting HealthOS Support. A support specialist has been assigned to your ticket.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Your Full Name"
                type="text"
                icon={User}
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="alex@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="input-label">Support Category</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="PATIENT_HELP">Patient Portal & Account Help</option>
                  <option value="HOSPITAL_LICENSE">Hospital Registration & Verification</option>
                  <option value="TECHNICAL">Technical & API Integration</option>
                  <option value="PRESS">Press, Media & Partnerships</option>
                </select>
              </div>

              <Input
                label="Subject"
                type="text"
                placeholder="Inquiry regarding hospital verification..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="input-label">Detailed Message</label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Describe your inquiry or support issue..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  style={{ borderRadius: 'var(--radius-md)' }}
                />
              </div>

              <Button variant="primary" size="lg" style={{ width: '100%' }} type="submit">
                Submit Support Ticket
              </Button>
            </form>
          )}
        </Card>

        {/* SUPPORT CATEGORIES & OFFICIAL INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Official Platform Contacts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>EMERGENCY HOTLINE</span>
                <div style={{ color: '#e11d48', fontWeight: 800, fontSize: '1.1rem', marginTop: '0.2rem' }}>
                  <PhoneCall size={16} style={{ display: 'inline', marginRight: '6px' }} /> 1-800-HEALTHOS
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>GENERAL SUPPORT EMAIL</span>
                <div style={{ color: '#0284c7', fontWeight: 600, marginTop: '0.2rem' }}>
                  support@healthos.org
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>HOSPITAL LICENSING DESK</span>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
                  licensing@healthos.org
                </div>
              </div>

              <div>
                <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>SUPPORT DESK HOURS</span>
                <div style={{ color: '#0f172a', fontWeight: 600, marginTop: '0.2rem' }}>
                  <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} /> 24/7 Operations Command Center
                </div>
              </div>
            </div>
          </Card>

          <Card title="Support Categories">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <LifeBuoy size={18} style={{ color: '#0284c7' }} />
                <h5 style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.35rem', color: '#0f172a' }}>Patient Care</h5>
              </div>

              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <Building2 size={18} style={{ color: '#2563eb' }} />
                <h5 style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.35rem', color: '#0f172a' }}>Hospitals</h5>
              </div>

              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <FileText size={18} style={{ color: '#10b981' }} />
                <h5 style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.35rem', color: '#0f172a' }}>API & Data</h5>
              </div>

              <div style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <HelpCircle size={18} style={{ color: '#f59e0b' }} />
                <h5 style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: '0.35rem', color: '#0f172a' }}>Media Desk</h5>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Badge variant="neutral">KNOWLEDGE BASE</Badge>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', color: '#0f172a' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {faqItems.map((item, idx) => (
            <div className="faq-accordion-item" key={idx}>
              <button className="faq-question-btn" onClick={() => toggleFaq(idx)}>
                <span>{item.q}</span>
                {openFaq === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {openFaq === idx && <div className="faq-answer-box">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
