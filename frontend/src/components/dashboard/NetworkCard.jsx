import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ArrowUpRight } from 'lucide-react';

export function NetworkCard({
  title = 'Health Summary',
  subtitle = 'Key statistics across connected HealthOS facilities',
  percentageText = '+35%',
  descriptionText = 'Data increase from the last day: 120 to 200 patients.',
  metrics,
  onActionClick,
}) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0); // Default General Practitioners (0)

  const defaultMetrics = [
    { label: 'General Practitioners', value: 80, heightPct: '100%' },
    { label: 'Pediatrics', value: 50, heightPct: '65%' },
    { label: 'Cardiology', value: 40, heightPct: '50%' },
    { label: 'Dermatology', value: 30, heightPct: '38%' },
  ];

  const list = metrics || defaultMetrics;
  const activeMetric = list[activeCategoryIndex] || list[0];

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <button className="stat-card-arrow" onClick={onActionClick} title="View Network Analytics">
          <ArrowUpRight size={16} />
        </button>
      }
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            {percentageText}
          </div>
          <span style={{ fontSize: '0.825rem', color: '#64748b' }}>
            Active: <strong style={{ color: '#0284c7' }}>{activeMetric.label}</strong> ({activeMetric.value})
          </span>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
          {descriptionText}
        </p>

        {/* 4 METRIC COLUMNS */}
        <div className="polyclinics-metrics">
          {list.map((m, idx) => (
            <div
              key={idx}
              className={`polyclinic-card-item ${activeCategoryIndex === idx ? 'active' : ''}`}
              onClick={() => setActiveCategoryIndex(idx)}
              onMouseEnter={() => setActiveCategoryIndex(idx)}
            >
              <div className="polyclinic-count">{m.value}</div>
              <div className="polyclinic-label">{m.label}</div>
            </div>
          ))}
        </div>

        {/* INTERACTIVE WORKING BAR CHART */}
        <div className="bar-chart-visual">
          {list.map((m, idx) => (
            <div
              key={idx}
              className={`bar-item ${activeCategoryIndex === idx ? 'active highlight' : ''}`}
              style={{ height: m.heightPct || `${(m.value / 80) * 100}%` }}
              onClick={() => setActiveCategoryIndex(idx)}
              onMouseEnter={() => setActiveCategoryIndex(idx)}
              title={`${m.label}: ${m.value}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
