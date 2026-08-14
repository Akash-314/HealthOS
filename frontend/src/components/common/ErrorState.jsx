import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorState.css';

export function ErrorState({ title = 'Error encountered', message = 'An error occurred while loading this section.', onRetry }) {
  return (
    <div className="error-state">
      <AlertCircle size={36} className="error-icon" />
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}
