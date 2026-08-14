import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ArrowUpRight } from 'lucide-react';

export function ScheduleCard({
  title = "Doctor's schedule",
  subtitle = 'Key statistics on the most frequently visited polyclinics',
  doctors,
  onActionClick,
}) {
  const defaultDoctors = [
    {
      id: 'doc-1',
      name: 'DR. Johan Henry',
      specialty: 'General Practitioners',
      status: 'Available',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80',
    },
    {
      id: 'doc-2',
      name: 'DR. David Cooper',
      specialty: 'Cardiology',
      status: 'Available',
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80',
    },
  ];

  const list = doctors && doctors.length > 0 ? doctors : defaultDoctors;

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <button className="stat-card-arrow" onClick={onActionClick} title="View All Staff" style={{ border: 'none', cursor: 'pointer' }}>
          <ArrowUpRight size={16} />
        </button>
      }
    >
      <div>
        {list.map((doc) => (
          <div className="appt-list-item" key={doc.id}>
            <div className="appt-user-info">
              <img src={doc.avatar} alt={doc.name} className="appt-avatar-img" />
              <div>
                <h5 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{doc.name}</h5>
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{doc.specialty}</p>
              </div>
            </div>

            <Badge variant="success">{doc.status || 'Available'}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
