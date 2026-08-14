import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROLES } from '../../types/roles';
import './DashboardLayout.css';

export function DashboardLayout({ children, roleTitle }) {
  const { role } = useAuth();
  const currentRole = roleTitle || role || ROLES.PATIENT;

  return (
    <div className="healthos-app-shell">
      <div className="healthos-workspace-container">
        {/* LEFT VERTICAL SIDEBAR */}
        <DashboardSidebar role={currentRole} />

        {/* MAIN BODY AREA */}
        <div className="healthos-main-body">
          {/* TOP HEADER */}
          <DashboardHeader />

          {/* DASHBOARD CONTENT WORKSPACE */}
          <main className="healthos-dashboard-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
