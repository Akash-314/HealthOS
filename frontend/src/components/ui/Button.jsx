import React from 'react';
import clsx from 'clsx';
import './Button.css';

export function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'emergency' | 'ghost'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      className={clsx('btn', `btn-${variant}`, `btn-${size}`, className)}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="btn-icon" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      <span>{children}</span>
    </button>
  );
}
