import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Menu, Sparkles, User, LogOut, Check, CheckCheck, ExternalLink, Sun, Moon, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { getInitials } from '../../js/utils/helpers';
import api from '../../services/api';
import InstagramSettingsMenu from './InstagramSettingsMenu';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const notifRef = useRef(null);
  const themeRef = useRef(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Stanford TreeHacks 2026 Registration Open',
      message: 'TreeHacks accepted applications. Auto-build your 4-person squad in AI Hub.',
      type: 'event',
      link_url: '/events',
      is_read: false,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'New Join Request on MediVision',
      message: 'Samantha Wu requested to join as Frontend & WebGL Developer.',
      type: 'team_invite',
      link_url: '/projects/1',
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 3,
      title: 'Alumni Session Confirmed',
      message: 'Sarah Chen (Google) accepted your 1:1 resume & system design session.',
      type: 'info',
      link_url: '/mentors',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await api.get('/notifications');
      if (data && data.length > 0) {
        setNotifications(data);
      }
    } catch (err) {
      // Fallback to local default notifications
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
      if (themeRef.current && !themeRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const markAsRead = async (id, link) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (err) {
      // Ignore
    }
    if (link) {
      setIsNotifOpen(false);
      navigate(link);
    }
  };

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    try {
      await api.post('/notifications/mark-all-read');
    } catch (err) {
      // Ignore
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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

        <form onSubmit={handleSearch} className="top-navbar-search">
          <Search size={16} className="top-navbar-search-icon" />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects, skills, or students..."
            style={{ borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-bg-subtle)' }}
          />
        </form>
      </div>

      <div className="top-navbar-actions">
        <Link to="/ai-hub" className="btn btn-outline btn-sm" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}>
          <Sparkles size={14} />
          <span>AI Hub</span>
        </Link>

        {/* Theme Switcher Dropdown */}
        <div ref={themeRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setIsThemeOpen((prev) => !prev)}
            title={`Current Theme: ${theme.toUpperCase()}`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' && <Sun size={18} color="#f59e0b" />}
            {theme === 'dark' && <Moon size={18} color="var(--color-accent)" />}
            {theme === 'cyberpunk' && <Palette size={18} color="var(--color-secondary)" />}
          </button>

          {isThemeOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '45px',
                width: '210px',
                padding: '0.5rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 110,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-subtle)', padding: '4px 8px' }}>
                Appearance Theme
              </div>
              <button
                onClick={() => { setTheme('light'); setIsThemeOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: theme === 'light' ? 'var(--color-accent-light)' : 'transparent',
                  color: theme === 'light' ? 'var(--color-accent)' : 'var(--color-text-main)',
                  fontWeight: theme === 'light' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textAlign: 'left'
                }}
              >
                <Sun size={15} color="#f59e0b" /> Classic Campus (Light)
              </button>
              <button
                onClick={() => { setTheme('dark'); setIsThemeOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: theme === 'dark' ? 'var(--color-accent-light)' : 'transparent',
                  color: theme === 'dark' ? 'var(--color-accent)' : 'var(--color-text-main)',
                  fontWeight: theme === 'dark' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textAlign: 'left'
                }}
              >
                <Moon size={15} color="#14b8a6" /> Midnight Obsidian (Dark)
              </button>
              <button
                onClick={() => { setTheme('cyberpunk'); setIsThemeOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: 'none',
                  backgroundColor: theme === 'cyberpunk' ? 'var(--color-accent-light)' : 'transparent',
                  color: theme === 'cyberpunk' ? 'var(--color-accent)' : 'var(--color-text-main)',
                  fontWeight: theme === 'cyberpunk' ? 700 : 500,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  textAlign: 'left'
                }}
              >
                <Palette size={15} color="#c084fc" /> Cyberpunk Violet (Neon)
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            aria-label="Notifications"
            title="Notifications"
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '16px',
                height: '16px',
                backgroundColor: 'var(--color-danger)',
                color: '#ffffff',
                borderRadius: '50%',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div
              className="card"
              style={{
                position: 'absolute',
                right: 0,
                top: '45px',
                width: '320px',
                padding: '0.75rem',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 110,
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                  Notifications ({unreadCount} unread)
                </span>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="btn btn-ghost btn-xs" style={{ fontSize: '0.7rem', color: 'var(--color-accent)' }}>
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '1.5rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id, n.link_url)}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: n.is_read ? 'transparent' : 'var(--color-accent-light)',
                        cursor: 'pointer',
                        transition: 'background 0.15s'
                      }}
                    >
                      <div style={{ fontWeight: n.is_read ? 600 : 800, fontSize: '0.8rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>{n.title}</span>
                        {!n.is_read && (
                          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-accent)' }} />
                        )}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-main)', marginTop: '2px', lineHeight: 1.3 }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Instagram-Style Settings & Profile Widget */}
        <InstagramSettingsMenu />
      </div>
    </header>
  );
};

export default Navbar;
