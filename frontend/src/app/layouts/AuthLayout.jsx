import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import './Layouts.css';

export function AuthLayout() {
  return (
    <div className="layout-auth">
      <div className="auth-header">
        <Link to="/" className="auth-brand">
          <Activity size={28} className="brand-logo" />
          <span>HealthOS</span>
        </Link>
      </div>
      <div className="auth-card-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
