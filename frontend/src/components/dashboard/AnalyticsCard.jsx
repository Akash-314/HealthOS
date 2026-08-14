import React from 'react';
import { Card } from '../ui/Card';

export function AnalyticsCard({
  title = 'Healthcare Network Overview',
  subtitle = 'Overview of capacity, patient activity and ongoing care across the HealthOS network.',
  stat1Label = 'Under treatment',
  stat1Value = '86',
  stat2Label = 'Recovered',
  stat2Value = '54',
}) {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <div className="chart-header-dots">
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{stat1Value}</span>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>
            <span className="dot-indicator" style={{ background: '#3b82f6' }}></span> {stat1Label}
          </span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginLeft: '0.5rem' }}>{stat2Value}</span>
          <span style={{ color: '#475569', fontSize: '0.8rem' }}>
            <span className="dot-indicator" style={{ background: '#10b981' }}></span> {stat2Label}
          </span>
        </div>
      }
    >
      <div className="chart-svg-container">
        <svg width="100%" height="180" viewBox="0 0 600 180" fill="none" preserveAspectRatio="none">
          {/* Highlight Bar on Friday */}
          <rect x="420" y="10" width="40" height="150" fill="rgba(147, 197, 253, 0.22)" rx="8" />

          {/* Blue Area & Curve Line (Active Patient Activity) */}
          <path
            d="M 20 80 Q 80 50 140 90 T 260 60 T 380 90 T 500 30 T 580 80 L 580 160 L 20 160 Z"
            fill="url(#blueGradient)"
            opacity="0.25"
          />
          <path
            d="M 20 80 Q 80 50 140 90 T 260 60 T 380 90 T 500 30 T 580 80"
            stroke="#3b82f6"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="500" cy="30" r="5" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />

          {/* Green Area & Curve Line (Recovered / Capacity) */}
          <path
            d="M 20 130 Q 80 145 140 135 T 260 120 T 380 135 T 500 125 T 580 105 L 580 160 L 20 160 Z"
            fill="url(#greenGradient)"
            opacity="0.2"
          />
          <path
            d="M 20 130 Q 80 145 140 135 T 260 120 T 380 135 T 500 125 T 580 105"
            stroke="#10b981"
            strokeWidth="3"
            fill="none"
          />
          <circle cx="500" cy="125" r="5" fill="#10b981" stroke="#ffffff" strokeWidth="2" />

          {/* SVG Gradients */}
          <defs>
            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>
        </svg>

        {/* X AXIS LABELS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 1rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          <span>Sun</span>
          <span>Mon</span>
          <span>Tur</span>
          <span>Wed</span>
          <span>Thu</span>
          <span style={{ color: '#0284c7', fontWeight: 800 }}>Fri</span>
          <span>San</span>
        </div>
      </div>
    </Card>
  );
}
