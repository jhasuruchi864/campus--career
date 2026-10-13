import React from 'react';
import { GraduationCap, GitBranch, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="public-footer">
      <div className="container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '2rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ maxWidth: 360 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
              <div style={{
                backgroundColor: 'var(--color-accent)',
                borderRadius: 'var(--radius-sm)',
                padding: '6px',
                display: 'inline-flex'
              }}>
                <GraduationCap size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>Campus Connect</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
              The next-generation college collaboration platform powering cross-disciplinary student projects, hackathons, and AI-driven teammate recommendations.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li><Link to="/projects" style={{ color: '#94a3b8' }}>Browse Projects</Link></li>
              <li><Link to="/find-teammates" style={{ color: '#94a3b8' }}>AI Teammate Finder</Link></li>
              <li><Link to="/events" style={{ color: '#94a3b8' }}>Campus Hackathons</Link></li>
              <li><Link to="/dashboard" style={{ color: '#94a3b8' }}>Student Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '1rem' }}>Architecture</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
              <li style={{ color: '#94a3b8' }}>React 18 + Vite</li>
              <li style={{ color: '#94a3b8' }}>Python 3 + FastAPI</li>
              <li style={{ color: '#94a3b8' }}>PostgreSQL + SQLAlchemy</li>
              <li style={{ color: '#94a3b8' }}>Scikit-Learn (TF-IDF & Cosine)</li>
            </ul>
          </div>
        </div>

        <div style={{
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8rem',
          color: '#64748b'
        }}>
          <div>
            &copy; {new Date().getFullYear()} Campus Connect. Designed for University Innovation & Placement Portfolios.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Built with precision & passion</span>
            <Heart size={14} color="#ef4444" fill="#ef4444" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
