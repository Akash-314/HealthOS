import React from 'react';
import { Card } from '../ui/Card';
import { ArrowUpRight } from 'lucide-react';

export function NetworkCard({
  title = 'Polyclinics',
  subtitle = 'Key statistics on the most frequently visited polyclinics',
  percentageText = '+35%',
  descriptionText = 'Data increase from the lastday: 120 to 200 patients.',
  metrics,
  onActionClick,
}) {
  const defaultMetrics = [
    { label: 'General Practitioners', value: 80 },
    { label: 'Pediatrics', value: 50 },
    { label: 'Cardiology', value: 40 },
    { label: 'Dermatology', value: 30 },
  ];

  const list = metrics || defaultMetrics;

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <button className="stat-card-arrow" onClick={onActionClick} title="View Network Analytics" style={{ border: 'none', cursor: 'pointer' }}>
          <ArrowUpRight size={16} />
        </button>
      }
    >
      <div>
        <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>{percentageText}</div>
        <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.2rem' }}>
          {descriptionText}
        </p>

        <div className="polyclinics-metrics">
          {list.map((m, idx) => (
            <div key={idx}>
              <div className="polyclinic-count">{m.value}</div>
              <div className="polyclinic-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* BLUE ROUNDED BAR CHART VISUAL AT BOTTOM */}
        <div className="bar-chart-visual">
          <div className="bar-item highlight" style={{ height: '100%' }}></div>
          <div className="bar-item" style={{ height: '65%' }}></div>
          <div className="bar-item" style={{ height: '50%' }}></div>
          <div className="bar-item" style={{ height: '38%' }}></div>
        </div>
      </div>
    </Card>
  );
}
