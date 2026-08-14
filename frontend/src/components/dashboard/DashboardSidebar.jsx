import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { ROLES } from '../../types/roles';
import {
  Sparkles,
  LayoutDashboard,
  Building2,
  Calendar,
  AlertTriangle,
  Bot,
  HeartPulse,
  FileText,
  Pill,
  ShieldCheck,
  Users,
  Bed,
  Stethoscope,
  Ambulance,
  BarChart3,
  Siren,
  Activity,
  Bell,
  HelpCircle,
  User,
  PhoneCall,
  Home,
  Info,
} from 'lucide-react';

export function DashboardSidebar({ role = ROLES.PATIENT }) {
  // Public Nav List (All tabs on the LEFT part of the webpage!)
  const PUBLIC_NAV = [
    { to: '/', label: 'Home', icon: Home, exact: true },
    { to: '/about', label: 'About', icon: Info },
    { to: '/how-it-works', label: 'How it Works', icon: Activity },
    { to: '/hospitals', label: 'Find Hospitals', icon: Building2 },
    { to: '/emergency', label: 'Emergency', icon: AlertTriangle, badge: 'SOS' },
    { to: '/services', label: 'Services', icon: FileText },
    { to: '/contact', label: 'Contact', icon: HelpCircle },
    { to: '/login', label: 'Sign In', icon: User },
  ];

  // Patient Nav List
  const PATIENT_NAV = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/patient/hospitals', label: 'Find Hospitals', icon: Building2 },
    { to: '/patient/appointments', label: 'Appointments', icon: Calendar },
    { to: '/patient/emergency', label: 'Emergency', icon: AlertTriangle, badge: 'SOS' },
    { to: '/patient/ai', label: 'AI Assistant', icon: Bot },
    { to: '/patient/home-care', label: 'Home Care', icon: HeartPulse },
    { to: '/patient/records', label: 'Health Records', icon: FileText },
    { to: '/patient/prescriptions', label: 'Prescriptions', icon: Pill },
    { to: '/patient/insurance', label: 'Insurance', icon: ShieldCheck },
  ];

  // Hospital Nav List
  const HOSPITAL_NAV = [
    { to: '/hospital/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/hospital/patients', label: 'Patients', icon: Users },
    { to: '/hospital/appointments', label: 'Appointments', icon: Calendar },
    { to: '/hospital/beds', label: 'Beds', icon: Bed },
    { to: '/hospital/icu', label: 'ICU', icon: Activity },
    { to: '/hospital/doctors', label: 'Doctors', icon: Stethoscope },
    { to: '/hospital/staff', label: 'Staff', icon: Users },
    { to: '/hospital/emergency', label: 'Emergency', icon: AlertTriangle, badge: 'LIVE' },
    { to: '/hospital/ambulance', label: 'Ambulances', icon: Ambulance },
    { to: '/hospital/inventory', label: 'Inventory', icon: FileText },
    { to: '/hospital/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/hospital/ai', label: 'AI Insights', icon: Bot },
  ];

  // Admin / Authority Nav List
  const ADMIN_NAV = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/network', label: 'Hospital Network', icon: Building2 },
    { to: '/admin/capacity', label: 'Capacity', icon: Activity },
    { to: '/admin/emergencies', label: 'Emergencies', icon: Siren, badge: 'ALERT' },
    { to: '/admin/ambulances', label: 'Ambulances', icon: Ambulance },
    { to: '/admin/resources', label: 'Resources', icon: FileText },
    { to: '/admin/health-trends', label: 'Health Trends', icon: BarChart3 },
    { to: '/admin/hospitals', label: 'Hospitals', icon: ShieldCheck },
    { to: '/admin/alerts', label: 'Alerts', icon: Bell },
  ];

  let navItems = PATIENT_NAV;
  if (role === ROLES.PUBLIC) navItems = PUBLIC_NAV;
  if (role === ROLES.HOSPITAL) navItems = HOSPITAL_NAV;
  if (role === ROLES.ADMIN || role === ROLES.AUTHORITY) navItems = ADMIN_NAV;

  return (
    <aside className="healthos-sidebar">
      <div>
        {/* BRAND LOGO TOP LEFT */}
        <NavLink to="/" className="healthos-brand-logo">
          <Sparkles className="brand-spark-icon" size={22} />
          <span>HEALTHOS</span>
        </NavLink>

        {/* LEFT VERTICAL NAVIGATION STACK */}
        <nav className="healthos-nav-list">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={idx}
                to={item.to}
                end={item.exact}
                className={({ isActive }) => clsx('healthos-nav-item', isActive && 'active')}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.badge && <span className="healthos-nav-badge">{item.badge}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer-text">
        v1.6.5 © HEALTHOS
      </div>
    </aside>
  );
}
