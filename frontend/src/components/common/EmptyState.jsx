import React from 'react';
import { Inbox } from 'lucide-react';
import './EmptyState.css';

export function EmptyState({ icon: Icon = Inbox, title = 'No data available', description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon-wrapper">
        <Icon size={36} />
      </div>
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-description">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}
