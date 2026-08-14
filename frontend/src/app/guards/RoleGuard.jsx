import React from 'react';
import { useAuth } from '../providers/AuthProvider';
import { hasRole } from '../../types/roles';

export function RoleGuard({ allowedRoles, children }) {
  const { role } = useAuth();

  if (!hasRole(role, allowedRoles)) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-danger-500)' }}>403 - Unauthorized Access</h2>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Your account role ({role}) does not have permission to view this section.
        </p>
      </div>
    );
  }

  return children;
}
