import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
            <div style={{
              backgroundColor: 'var(--color-accent)',
              borderRadius: 'var(--radius-sm)',
              padding: '8px',
              display: 'inline-flex'
            }}>
              <GraduationCap size={24} color="#ffffff" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>
              Campus Connect
            </span>
          </Link>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Empowering student builders and campus innovation
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
