import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, UserCheck, Users, Calendar, MessageSquare, HelpCircle, Sparkles } from 'lucide-react';
import './Sidebar.css';

export function Sidebar({ items = [], title }) {
  const defaultItems = [
    { to: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: 'doctors', label: 'Doctors', icon: UserCheck },
    { to: 'patients', label: 'Patients', icon: Users },
    { to: 'appointments', label: 'Appointment', icon: Calendar },
    { to: 'messages', label: 'Message', icon: MessageSquare, badge: '99+' },
    { to: 'help', label: 'Help Center', icon: HelpCircle },
  ];

  const navList = items.length > 0 ? items : defaultItems;

  return (
    <aside className="app-sidebar">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0.75rem', marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.15rem', color: '#0f172a' }}>
          <Sparkles size={20} style={{ color: '#2563eb' }} /> HealthOS
        </div>

        {title && <div className="sidebar-title">{title}</div>}

        <nav className="sidebar-nav">
          {navList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => clsx('sidebar-link', isActive && 'active')}
              >
                {Icon && <Icon size={18} className="sidebar-icon" />}
                <span>{item.label}</span>
                {item.badge && <span className="sidebar-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer-text">
        v1.6.5 © Copyright 2026 HealthOS
      </div>
    </aside>
  );
}
