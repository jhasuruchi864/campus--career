import React from 'react';
import { Link } from 'react-router-dom';

export const PublicNavbar = () => {
  return (
    <nav className="public-navbar" aria-label="Main Navigation">
      <div className="container public-nav-container">
        <Link to="/" className="public-logo" aria-label="Campus Connect Home">
          <span style={{
            backgroundColor: 'var(--color-accent)',
            color: '#ffffff',
            borderRadius: 'var(--radius-sm)',
            padding: '4px 8px',
            fontSize: '1.1rem',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700
          }}>
            CC
          </span>
          <span>Campus Connect</span>
        </Link>

        <ul className="public-links">
          <li><Link to="/projects">Explore Projects</Link></li>
          <li><Link to="/find-teammates">AI Teammate Finder</Link></li>
          <li><Link to="/events">Campus Events</Link></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/login" className="btn btn-outline btn-sm" aria-label="Log In">Log In</Link>
          <Link to="/register" className="btn btn-primary btn-sm" aria-label="Join Campus as Student">Join Campus</Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
