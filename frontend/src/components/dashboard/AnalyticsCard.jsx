import React, { useState } from 'react';
import { Card } from '../ui/Card';

export function AnalyticsCard({
  title = 'Personal Health Activity & Vitals',
  subtitle = 'Track your recovery, daily health score trends, and active vitals.',
  stat1Label = 'Health Index',
  stat1Value = '98',
  stat2Label = 'Target Goal',
  stat2Value = '100',
}) {
  const [hoveredDayIndex, setHoveredDayIndex] = useState(5); // Default Friday

  const daysData = [
    { day: 'Sun', blueVal: 82, greenVal: 90, cx: 30, cyBlue: 100, cyGreen: 130 },
    { day: 'Mon', blueVal: 78, greenVal: 92, cx: 120, cyBlue: 110, cyGreen: 128 },
    { day: 'Tue', blueVal: 85, greenVal: 95, cx: 210, cyBlue: 90, cyGreen: 122 },
    { day: 'Wed', blueVal: 92, greenVal: 96, cx: 300, cyBlue: 60, cyGreen: 120 },
    { day: 'Thu', blueVal: 88, greenVal: 98, cx: 390, cyBlue: 75, cyGreen: 118 },
    { day: 'Fri', blueVal: 98, greenVal: 100, cx: 480, cyBlue: 30, cyGreen: 115 },
    { day: 'Sat', blueVal: 94, greenVal: 100, cx: 570, cyBlue: 50, cyGreen: 115 },
  ];

  const currentActive = daysData[hoveredDayIndex] || daysData[5];

  return (
    <Card
      title={title}
      subtitle={subtitle}
      action={
        <div className="chart-header-dots">
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {currentActive.blueVal}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '0.35rem' }}>
              <span className="dot-indicator" style={{ background: '#3b82f6' }}></span> {stat1Label}
            </span>
          </div>

          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
              {currentActive.greenVal}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '0.35rem' }}>
              <span className="dot-indicator" style={{ background: '#10b981' }}></span> {stat2Label}
            </span>
          </div>
        </div>
      }
    >
      <div className="chart-svg-container">
        {/* INTERACTIVE TOOLTIP POPUP */}
        {hoveredDayIndex !== null && (
          <div
            className="chart-tooltip-popup"
            style={{ left: `${(currentActive.cx / 600) * 100}%` }}
          >
            {currentActive.day}: {stat1Label} {currentActive.blueVal} / {stat2Label} {currentActive.greenVal}
          </div>
        )}

        <svg width="100%" height="160" viewBox="0 0 600 160" fill="none" preserveAspectRatio="none">
          {/* Highlight Container on Active Day */}
          <rect
            x={currentActive.cx - 20}
            y="10"
            width="40"
            height="140"
            fill="rgba(147, 197, 253, 0.22)"
            rx="8"
            style={{ transition: 'x 0.2s ease' }}
          />

          {/* Blue Area & Curve Line */}
          <path
            d="M 30 100 Q 120 110 210 90 T 300 60 T 390 75 T 480 30 T 570 50 L 570 150 L 30 150 Z"
            fill="url(#blueGradient)"
            opacity="0.2"
          />
          <path
            d="M 30 100 Q 120 110 210 90 T 300 60 T 390 75 T 480 30 T 570 50"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Green Area & Curve Line */}
          <path
            d="M 30 130 Q 120 128 210 122 T 300 120 T 390 118 T 480 115 T 570 115 L 570 150 L 30 150 Z"
            fill="url(#greenGradient)"
            opacity="0.15"
          />
          <path
            d="M 30 130 Q 120 128 210 122 T 300 120 T 390 118 T 480 115 T 570 115"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* DYNAMIC CLICKABLE / HOVERABLE DAY NODES */}
          {daysData.map((d, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredDayIndex(idx)} style={{ cursor: 'pointer' }}>
              <circle
                cx={d.cx}
                cy={d.cyBlue}
                r={hoveredDayIndex === idx ? 7 : 4}
                fill="#3b82f6"
                stroke="#ffffff"
                strokeWidth="2"
                className="chart-node-point"
              />
              <circle
                cx={d.cx}
                cy={d.cyGreen}
                r={hoveredDayIndex === idx ? 6 : 3}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2"
                className="chart-node-point"
              />
            </g>
          ))}

          {/* SVG GRADIENTS */}
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

        {/* X-AXIS LABELS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.5rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          {daysData.map((d, idx) => (
            <span
              key={idx}
              style={{
                color: hoveredDayIndex === idx ? '#0284c7' : '#64748b',
                fontWeight: hoveredDayIndex === idx ? 800 : 600,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredDayIndex(idx)}
            >
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
