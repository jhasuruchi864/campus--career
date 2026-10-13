import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Users,
  Calendar,
  UserCircle,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/projects', label: 'Explore Projects', icon: FolderGit2 },
    { to: '/find-teammates', label: 'Find Teammates', icon: Users, badge: 'AI' },
    { to: '/events', label: 'Campus Events', icon: Calendar },
    { to: '/profile', label: 'Student Profile', icon: UserCircle },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div style={{
          backgroundColor: 'var(--color-accent)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <GraduationCap size={22} color="#ffffff" />
        </div>
        <div>
          <span className="sidebar-brand-name">CampusConnect</span>
        </div>
        <span className="sidebar-brand-badge">SaaS</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <Sparkles size={10} /> {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          padding: '12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={14} color="var(--color-accent-light)" />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f8fafc' }}>AI Teammate Engine</span>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.4 }}>
            TF-IDF & semantic role scoring active for 2026 capstones.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
