import React from 'react';
import clsx from 'clsx';
import './Input.css';

export function Input({ label, error, icon: Icon, className, ...props }) {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && <Icon className="input-icon" size={18} />}
        <input
          className={clsx('input-field', Icon && 'has-icon', error && 'has-error', className)}
          {...props}
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
}
