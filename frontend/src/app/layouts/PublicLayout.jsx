import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '../../components/dashboard/DashboardLayout';
import { ROLES } from '../../types/roles';

export function PublicLayout() {
  return (
    <DashboardLayout roleTitle={ROLES.PUBLIC}>
      <Outlet />
    </DashboardLayout>
  );
}
