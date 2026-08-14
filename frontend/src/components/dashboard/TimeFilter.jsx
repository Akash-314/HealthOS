import React from 'react';

export function TimeFilter({ activeFilter = 'Today', onChange }) {
  return (
    <div className="healight-time-filter">
      <button
        className={`time-filter-btn ${activeFilter === 'Today' ? 'active' : ''}`}
        onClick={() => onChange && onChange('Today')}
      >
        Today
      </button>

      <button
        className={`time-filter-btn ${activeFilter === 'This Week' ? 'active' : ''}`}
        onClick={() => onChange && onChange('This Week')}
      >
        This Week
      </button>

      <button
        className={`time-filter-btn ${activeFilter === 'This Month' ? 'active' : ''}`}
        onClick={() => onChange && onChange('This Month')}
      >
        This Month
      </button>
    </div>
  );
}
