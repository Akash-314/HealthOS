import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROLES } from '../../types/roles';
import { StatCard } from './StatCard';
import { AnalyticsCard } from './AnalyticsCard';
import { AppointmentsCard } from './AppointmentsCard';
import { ScheduleCard } from './ScheduleCard';
import { NetworkCard } from './NetworkCard';
import { TimeFilter } from './TimeFilter';
import './HealightDashboard.css';

export function HealightDashboard({ roleTitle }) {
  const { role: userRole } = useAuth();
  const navigate = useNavigate();
  const currentRole = roleTitle || userRole || ROLES.PATIENT;

  const [timeFilter, setTimeFilter] = useState('Today');

  // Authority / Admin KPI Metrics
  const adminKPIs = [
    { title: 'Total Hospitals', value: '128', text: 'Hospitals connected to HealthOS', trend: 'up', trendValue: '' },
    { title: 'Available Beds', value: '1,240', text: 'Have increased from yesterday', trend: 'up', trendValue: '+3.5%' },
    { title: 'Available ICU', value: '140', text: 'Critical care capacity available', trend: 'up', trendValue: '' },
    { title: 'Active Patients', value: '3,240', text: 'Count has dropped from yesterday', trend: 'down', trendValue: '-2.5%' },
  ];

  // Hospital KPI Metrics
  const hospitalKPIs = [
    { title: 'Total Beds', value: '350', text: 'Total licensed ward capacity', trend: 'up', trendValue: '' },
    { title: 'Available Beds', value: '48', text: 'Ready for emergency intake', trend: 'up', trendValue: '+3.5%' },
    { title: 'Available ICU', value: '12', text: 'Units equipped with ventilators', trend: 'up', trendValue: '' },
    { title: "Today's Intakes", value: '24', text: 'Queue reduction from yesterday', trend: 'down', trendValue: '-2.5%' },
  ];

  // Patient KPI Metrics
  const patientKPIs = [
    { title: 'Upcoming Care', value: '2', text: 'Scheduled appointments this week', trend: 'up', trendValue: '' },
    { title: 'Health Score', value: '98%', text: 'Increased from last checkup', trend: 'up', trendValue: '+1.5%' },
    { title: 'Active Care Plans', value: '3', text: 'Ongoing treatment protocols', trend: 'up', trendValue: '' },
    { title: 'Digital Records', value: '14', text: 'Verified lab & diagnostic reports', trend: 'up', trendValue: '' },
  ];

  let kpiData = adminKPIs;
  let chartTitle = 'Healthcare Network Overview';
  let chartSubtitle = 'Overview of capacity, patient activity and ongoing care across the HealthOS network.';
  let stat1Label = 'Under treatment';
  let stat1Val = '86';
  let stat2Label = 'Recovered';
  let stat2Val = '54';

  if (currentRole === ROLES.HOSPITAL) {
    kpiData = hospitalKPIs;
    chartTitle = 'Hospital Ward & Bed Utilization';
    chartSubtitle = 'Real-time telemetry of occupied inpatient beds and ICU triage intake.';
    stat1Label = 'Inpatient Beds';
    stat1Val = '302';
    stat2Label = 'Available Beds';
    stat2Val = '48';
  } else if (currentRole === ROLES.PATIENT) {
    kpiData = patientKPIs;
    chartTitle = 'Personal Health Activity & Vitals';
    chartSubtitle = 'Track your recovery, daily health score trends, and active vitals.';
    stat1Label = 'Health Index';
    stat1Val = '98';
    stat2Label = 'Target Goal';
    stat2Val = '100';
  }

  return (
    <div className="healight-dashboard">
      {/* TOP HEADING & TIME FILTER */}
      <div className="healight-top-bar">
        <h1 className="healight-page-title">Dashboard</h1>
        <TimeFilter activeFilter={timeFilter} onChange={(filter) => setTimeFilter(filter)} />
      </div>

      {/* TOP 4 KPI CARDS */}
      <div className="healight-stat-grid">
        {kpiData.map((kpi, idx) => (
          <StatCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            supportingText={kpi.text}
            trend={kpi.trend}
            trendValue={kpi.trendValue}
            onClick={() => navigate('/hospitals')}
          />
        ))}
      </div>

      {/* MIDDLE ROW (58% CHARTS + 42% APPOINTMENTS) */}
      <div className="healight-grid-2col">
        <AnalyticsCard
          title={chartTitle}
          subtitle={chartSubtitle}
          stat1Label={stat1Label}
          stat1Value={stat1Val}
          stat2Label={stat2Label}
          stat2Value={stat2Val}
        />

        <AppointmentsCard
          onActionClick={() => navigate(currentRole === ROLES.PATIENT ? '/patient/appointments' : '/hospital/appointments')}
        />
      </div>

      {/* BOTTOM ROW (45% SCHEDULE + 55% NETWORK) */}
      <div className="healight-grid-bottom">
        <ScheduleCard
          title={currentRole === ROLES.PATIENT ? 'Care Team' : "Doctor's schedule"}
          subtitle="Key statistics on the most frequently visited polyclinics"
          onActionClick={() => navigate(currentRole === ROLES.HOSPITAL ? '/hospital/doctors' : '/hospitals')}
        />

        <NetworkCard
          title={currentRole === ROLES.PATIENT ? 'Health Summary' : 'Polyclinics'}
          subtitle="Key statistics across connected HealthOS facilities"
          onActionClick={() => navigate('/about')}
        />
      </div>
    </div>
  );
}
