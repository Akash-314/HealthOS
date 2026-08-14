import React from 'react';
import './Navbar.css';

export function Navbar({ backendStatus }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="brand-icon">🏥</span>
          <span className="brand-name">HealthOS</span>
        </div>
        <nav className="navbar-links">
          <a href="#overview">Overview</a>
          <a href="#services">Services</a>
          <a href="#docs">API Docs</a>
        </nav>
        <div className="navbar-status">
          <span className={`status-dot ${backendStatus ? 'online' : 'checking'}`}></span>
          <span className="status-text">
            {backendStatus ? `API: ${backendStatus.health.toUpperCase()}` : 'Connecting API...'}
          </span>
        </div>
      </div>
    </header>
  );
}
