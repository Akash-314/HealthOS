import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Search, Sparkles, Settings } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROLES } from '../../types/roles';
import './Header.css';

export function Header({ roleTitle, showSearch = true }) {
  const { user, role, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/hospitals?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

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

            <button className="icon-btn" title="Settings">
              <Settings size={18} />
            </button>

            <button className="icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="notification-dot"></span>
            </button>

            <div className="user-profile">
              <div className="avatar">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <span className="user-email">{user?.full_name || user?.email || 'User'}</span>
            </div>

            <button className="icon-btn logout-btn" onClick={logout} title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
