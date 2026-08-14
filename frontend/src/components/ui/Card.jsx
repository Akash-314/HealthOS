import React from 'react';
import clsx from 'clsx';
import './Card.css';

export function Card({ children, title, subtitle, className, action, ...props }) {
  return (
    <div className={clsx('card-container', className)} {...props}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-body">{children}</div>
    </div>
  );
}
