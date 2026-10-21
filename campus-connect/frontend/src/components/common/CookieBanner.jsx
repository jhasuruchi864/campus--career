import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cc_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cc_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="region"
      aria-label="Cookie and Privacy Notice"
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        maxWidth: '540px',
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
      className="animate-fade-in"
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-accent-hover)',
            padding: '6px',
            borderRadius: 'var(--radius-sm)',
            display: 'inline-flex'
          }}>
            <ShieldCheck size={18} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>
            Privacy & Essential Storage
          </span>
        </div>
        <button
          onClick={handleAccept}
          aria-label="Close cookie notice"
          style={{
            cursor: 'pointer',
            color: 'var(--color-text-muted)',
            display: 'inline-flex',
            padding: '4px'
          }}
        >
          <X size={16} />
        </button>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
        We only use essential local storage to keep your login session secure. We do not use third-party advertising cookies or cross-site tracking.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
        <button
          onClick={handleAccept}
          className="btn btn-primary btn-sm"
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
          aria-label="Accept essential cookies"
        >
          Got it
        </button>
        <Link
          to="/cookies"
          style={{ fontSize: '0.85rem', color: 'var(--color-accent)', textDecoration: 'underline' }}
          aria-label="Read our Cookie Policy"
        >
          Read Cookie Policy
        </Link>
      </div>
    </aside>
  );
};

export default CookieBanner;
