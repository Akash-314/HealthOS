import React from 'react';
import { HealightDashboard } from '../../components/dashboard/HealightDashboard';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export function FeaturePlaceholder({ title, description, category, role }) {
  if (title?.toLowerCase().includes('dashboard') || title?.toLowerCase().includes('overview')) {
    return <HealightDashboard roleTitle={role || category} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
            <Badge variant="info">{category || 'HEALTHOS CORE'}</Badge>
            {role && <Badge variant="warning">ROLE: {role}</Badge>}
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
            {title}
          </h1>
        </div>
      </div>

      <Card title={`${title} Module`} subtitle="HealthOS Connected Architecture">
        <p style={{ color: '#475569', lineHeight: 1.6 }}>
          {description || 'This module boundary and service architecture have been established.'}
        </p>
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: '#64748b' }}>
          <strong>System Status:</strong> Clean architecture boundaries and live route guards active.
        </div>
      </Card>
    </div>
  );
}
