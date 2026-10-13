import React from 'react';
import { Search, Bell, Menu, Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { getInitials } from '../../js/utils/helpers';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          style={{ display: 'inline-flex' }}
        >
          <Menu size={20} />
        </button>

        <div className="top-navbar-search">
          <Search size={16} className="top-navbar-search-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search projects, skills, or students..."
            style={{ borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg-subtle)' }}
          />
        </div>
      </div>

      <div className="top-navbar-actions">
        <Link to="/find-teammates" className="btn btn-outline btn-sm" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>
          <Sparkles size={14} />
          <span>AI Match</span>
        </Link>

        <button className="btn btn-ghost btn-icon" aria-label="Notifications" title="Notifications">
          <Bell size={18} />
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="avatar" style={{ width: 34, height: 34 }} />
              ) : (
                <div className="avatar" style={{ width: 34, height: 34, fontSize: '0.75rem' }}>
                  {getInitials(user.full_name)}
                </div>
              )}
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                {user.full_name}
              </span>
            </Link>

            <button
              onClick={logout}
              className="btn btn-ghost btn-icon"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-outline btn-sm">Log in</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Join Campus</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
