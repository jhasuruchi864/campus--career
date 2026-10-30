import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import InstagramSettingsMenu from '../common/InstagramSettingsMenu';

export const AuthLayout = () => {
  return (
    <div className="auth-layout" style={{ position: 'relative' }}>
      {/* Top Right Instagram-Style Settings Trigger */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 50 }}>
        <InstagramSettingsMenu />
      </div>

      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
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
          </div>
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
