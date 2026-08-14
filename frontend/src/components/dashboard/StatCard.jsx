import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export function StatCard({ title, value, supportingText, trend, trendValue, onClick }) {
  return (
    <div className="healight-stat-card">
      <div className="stat-card-top">
        <span>{title}</span>
        <button
          className="stat-card-arrow"
          onClick={onClick}
          title={`View ${title} Details`}
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <ArrowUpRight size={16} />
        </button>
      </div>

      <div className="stat-card-bottom">
        <div className="stat-big-number">{value}</div>
        <div className="stat-desc-text">
          {trendValue && (
            <span className={trend === 'down' ? 'stat-badge-decrease' : 'stat-badge-increase'} style={{ marginRight: '4px' }}>
              {trendValue}
            </span>
          )}
          {supportingText}
        </div>
      </div>
    </div>
  );
}
