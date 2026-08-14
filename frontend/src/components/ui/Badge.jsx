import React from 'react';
import clsx from 'clsx';
import './Badge.css';

export function Badge({ children, variant = 'info', className }) {
  return (
    <span className={clsx('badge', `badge-${variant}`, className)}>
      {children}
    </span>
  );
}
