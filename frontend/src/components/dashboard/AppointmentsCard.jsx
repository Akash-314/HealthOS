import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ArrowUpRight, MessageSquare, Phone } from 'lucide-react';

export function AppointmentsCard({
  title = 'Appointments',
  subtitle = 'Key statistics on the most frequently visited polyclinics',
  appointments,
  onActionClick,
}) {
  const [activeAlert, setActiveAlert] = useState(null);

  const defaultList = [
    {
      id: 'apt-1',
      name: 'Rajesh Kumar',
      reason: 'General Consultation',
      badge: 'Today',
      time: '09.40 AM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'apt-2',
      name: 'Priya Sharma',
      reason: 'Cardiology',
      badge: 'Today',
      time: '10.40 AM',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'apt-3',
      name: 'Amit Verma',
      reason: 'Follow-up',
      badge: 'Today',
      time: '11.20 AM',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'apt-4',
      name: 'Kavita Singh',
      reason: 'Cardiology',
      badge: 'Today',
      time: '12.10 PM',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const list = appointments && appointments.length > 0 ? appointments : defaultList;

  const handleMessage = (name) => {
    setActiveAlert(`Connecting secure chat session with ${name}...`);
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const handleCall = (name) => {
    setActiveAlert(`Initiating secure telehealth call to ${name}...`);
    setTimeout(() => setActiveAlert(null), 3000);
  };

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <button className="stat-card-arrow" onClick={onActionClick} title="View All Appointments">
          <ArrowUpRight size={16} />
        </button>
      }
    >
      <div>
        {activeAlert && (
          <div style={{ padding: '0.4rem 0.75rem', background: '#e0f2fe', color: '#0369a1', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', animation: 'fadeIn 0.15s ease' }}>
            {activeAlert}
          </div>
        )}

        {list.map((apt) => (
          <div className="appt-list-item" key={apt.id}>
            <div className="appt-user-info">
              <img src={apt.avatar} alt={apt.name} className="appt-avatar-img" />
              <div>
                <h5 style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a', margin: 0 }}>{apt.name}</h5>
                <p style={{ fontSize: '0.775rem', color: '#64748b', margin: '0.1rem 0 0' }}>{apt.reason}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.725rem', color: '#94a3b8', fontWeight: 600 }}>{apt.badge}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{apt.time}</div>
              </div>

              <div className="appt-actions">
                <button className="circle-action-btn" title="Message" onClick={() => handleMessage(apt.name)}>
                  <MessageSquare size={14} />
                </button>
                <button className="circle-action-btn" title="Call" onClick={() => handleCall(apt.name)}>
                  <Phone size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
