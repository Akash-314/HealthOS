import React from 'react';
import { Loader2 } from 'lucide-react';
import './LoadingState.css';

export function LoadingState({ message = 'Loading HealthOS data...' }) {
  return (
    <div className="loading-state">
      <Loader2 className="loading-spinner" size={32} />
      <p className="loading-message">{message}</p>
    </div>
  );
}
