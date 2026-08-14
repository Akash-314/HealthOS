import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Search, Sparkles, Settings, Building2, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROLES } from '../../types/roles';
import './Header.css';

export function Header({ roleTitle, showSearch = true }) {
  const { user, role, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/hospitals?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Member';

  return (
    <header className="app-header">
      <div className="header-left">
        <Link to="/" className="header-brand">
          <Sparkles className="brand-logo" size={24} />
          <span className="brand-title">HealthOS</span>
          {roleTitle && <span className="role-badge">{roleTitle}</span>}
        </Link>

        {showSearch && (
          <div className="header-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search hospitals, doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
            />
          </div>
        )}
      </div>

      <div className="header-right">
        {role === ROLES.PUBLIC ? (
          <div className="header-actions">
            <Link to="/emergency" className="btn-emergency-link">
              🚨 Emergency Care
            </Link>
            <Link to="/login" className="btn-login">Sign In</Link>
            <Link to="/register" className="btn-register">Get Started</Link>
          </div>
        ) : (
          <div className="header-actions">
            <Link to="/emergency" className="btn-emergency-link">
              🚨 Emergency
            </Link>

            <button className="icon-btn" title="Settings" onClick={() => navigate('/contact')}>
              <Settings size={18} />
            </button>

            {/* USER PROFILE DROPDOWN */}
            <div style={{ position: 'relative' }}>
              <div
                className="user-profile"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <div className="avatar">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <span className="user-email">{displayName}</span>
                <ChevronDown size={14} style={{ color: '#64748b' }} />
              </div>

              {/* PROFILE DROPDOWN MENU */}
              {showProfileMenu && (
                <div className="popover-panel" style={{ position: 'absolute', top: '45px', right: 0, width: '250px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)', padding: '1rem', zIndex: 1000 }}>
                  <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{displayName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email || 'authenticated@healthos.org'}</div>
                  </div>

                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.04em' }}>
                    Switch Portal Dashboard
                  </div>

                  <button
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', background: 'transparent', border: 'none', padding: '0.35rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/patient/dashboard');
                    }}
                  >
                    <User size={15} style={{ color: '#0284c7' }} /> Patient Dashboard
                  </button>

                  <button
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', background: 'transparent', border: 'none', padding: '0.35rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/hospital/dashboard');
                    }}
                  >
                    <Building2 size={15} style={{ color: '#10b981' }} /> Hospital Dashboard
                  </button>

                  <button
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', background: 'transparent', border: 'none', padding: '0.35rem 0', fontSize: '0.85rem', color: '#0f172a', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/admin/dashboard');
                    }}
                  >
                    <ShieldCheck size={15} style={{ color: '#2563eb' }} /> Admin / Authority
                  </button>

                  <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                    <button
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', background: 'transparent', border: 'none', padding: '0.25rem 0', fontSize: '0.85rem', color: '#dc2626', fontWeight: 700, cursor: 'pointer', textAlign: 'left' }}
                      onClick={logout}
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
