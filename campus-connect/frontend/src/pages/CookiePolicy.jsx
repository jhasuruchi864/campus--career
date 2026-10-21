import React from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft, CheckCircle2, Shield, Settings, Info } from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';

export const CookiePolicy = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg-main)' }}>
      <PublicNavbar />

      <main id="main-content" style={{ flex: 1, padding: '3rem 0 5rem' }}>
        <div className="container" style={{ maxWidth: 840, margin: '0 auto' }}>
          
          {/* Breadcrumb Navigation */}
          <div style={{ marginBottom: '1.5rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.875rem',
                color: 'var(--color-accent)',
                fontWeight: 600
              }}
              aria-label="Back to home page"
            >
              <ArrowLeft size={16} /> Back to Home
            </Link>
          </div>

          {/* Header Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-accent-light)',
              color: 'var(--color-accent-hover)',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '1rem'
            }}>
              <Cookie size={16} />
              <span>Transparent & Minimal Storage</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
              Cookie & Storage Policy
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Last Updated: October 2026. This policy explains how Campus Connect uses browser storage and cookies. We believe in privacy by design: we only use what is strictly necessary to run the service.
            </p>
          </div>

          {/* Content Card */}
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem'
          }}>

            {/* 1. What are Cookies and Local Storage? */}
            <section aria-labelledby="section-what-is-cookie">
              <h2 id="section-what-is-cookie" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Info size={20} color="var(--color-accent)" />
                1. What are Cookies and Local Storage?
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                Cookies and browser local storage are small pieces of data saved on your computer or phone when you visit a website. They help websites remember that you are logged in so you do not have to type your password on every single page.
              </p>
            </section>

            {/* 2. What We Use */}
            <section aria-labelledby="section-what-we-use">
              <h2 id="section-what-we-use" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="var(--color-accent)" />
                2. What We Store (Essential Only)
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                We only use strictly essential items needed for the platform to function:
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--color-bg-subtle)', textAlign: 'left', borderBottom: '2px solid var(--color-border)' }}>
                      <th style={{ padding: '10px 12px', color: 'var(--color-primary)' }}>Storage Key</th>
                      <th style={{ padding: '10px 12px', color: 'var(--color-primary)' }}>Type</th>
                      <th style={{ padding: '10px 12px', color: 'var(--color-primary)' }}>Purpose</th>
                      <th style={{ padding: '10px 12px', color: 'var(--color-primary)' }}>Lifespan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>access_token</td>
                      <td style={{ padding: '10px 12px' }}>Local Storage</td>
                      <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>Keeps your session authenticated securely while you navigate projects and events.</td>
                      <td style={{ padding: '10px 12px' }}>Until logout or token expiration (24h)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>cc_cookie_consent</td>
                      <td style={{ padding: '10px 12px' }}>Local Storage</td>
                      <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>Remembers that you acknowledged our privacy notice banner so it doesn't show again.</td>
                      <td style={{ padding: '10px 12px' }}>Persistent (can be cleared anytime)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 3. What We Do NOT Use */}
            <section aria-labelledby="section-what-we-dont-use">
              <h2 id="section-what-we-dont-use" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="var(--color-accent)" />
                3. What We Never Do
              </h2>
              <div style={{
                padding: '1.25rem',
                backgroundColor: 'var(--color-success-bg)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #bbf7d0',
                color: '#166534',
                fontSize: '0.925rem',
                lineHeight: 1.7
              }}>
                <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                  <li><strong>No Advertising Cookies:</strong> We do not show ads and do not track you for marketing purposes.</li>
                  <li><strong>No Third-Party Tracker Scripts:</strong> We do not load data-broker scripts or cross-site tracking beacons.</li>
                  <li><strong>No Sale of Data:</strong> Your activity is never packaged or sold to any third party.</li>
                </ul>
              </div>
            </section>

            {/* 4. Managing Your Storage */}
            <section aria-labelledby="section-manage-storage">
              <h2 id="section-manage-storage" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={20} color="var(--color-accent)" />
                4. How to Clear Browser Storage
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                You have full control over your browser. You can clear cookies and local storage at any time in your browser settings:
              </p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                <li><strong>Google Chrome:</strong> Settings &rarr; Privacy and Security &rarr; Delete browsing data.</li>
                <li><strong>Mozilla Firefox:</strong> Settings &rarr; Privacy & Security &rarr; Cookies and Site Data &rarr; Clear Data.</li>
                <li><strong>Apple Safari:</strong> Preferences &rarr; Privacy &rarr; Manage Website Data.</li>
                <li><strong>Microsoft Edge:</strong> Settings &rarr; Privacy, Search, and Services &rarr; Clear browsing data.</li>
              </ul>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.75rem' }}>
                Note: Clearing your local storage will log you out of your current session on Campus Connect.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
