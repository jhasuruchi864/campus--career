import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Users, FolderGit2, Calendar, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';
import Button from '../components/common/Button';
import Footer from '../components/common/Footer';

export const Home = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
      {/* Top Header */}
      <PublicNavbar />

      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-accent-light)',
            color: 'var(--color-accent-hover)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} />
            <span>AI-Driven University Collaboration Platform</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            color: 'var(--color-primary)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem'
          }}>
            Build Balanced Teams for <span style={{ color: 'var(--color-accent)' }}>Capstone</span>, <span style={{ color: 'var(--color-secondary)' }}>Hackathons</span> & Research.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'var(--color-text-muted)',
            lineHeight: 1.6,
            marginBottom: '2.5rem',
            maxWidth: 680,
            margin: '0 auto 2.5rem'
          }}>
            Connect with motivated college students across frontend, backend, ML, and UX disciplines using skill overlap and explainable recommendations.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', marginBottom: '3.5rem' }}>
            <Link to="/register">
              <Button variant="primary" size="lg" aria-label="Get Started Free and Join Campus">
                Get Started Free <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/find-teammates">
              <Button variant="outline" size="lg" aria-label="Try AI Teammate Matching">
                <Sparkles size={18} color="var(--color-accent)" /> Try AI Teammate Matching
              </Button>
            </Link>
          </div>

          {/* Genuine Platform Capabilities Highlights (Replaces unverified fake counters) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            padding: '1.5rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'left'
          }}>
            <div style={{ padding: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Sparkles size={18} color="var(--color-accent)" />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>Explainable AI</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>TF-IDF skill similarity and complement scoring.</div>
            </div>
            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <FolderGit2 size={18} color="var(--color-secondary)" />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>Student Projects</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Publish capstones and review team pitch requests.</div>
            </div>
            <div style={{ padding: '0.5rem', borderLeft: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Calendar size={18} color="#10b981" />
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)' }}>Campus Events</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Explore upcoming collegiate hackathons and seminars.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Value Props */}
      <section style={{ padding: '4.5rem 0', backgroundColor: 'var(--color-bg-main)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 3rem auto' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>Everything You Need to Succeed</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Designed specifically for engineering, design, and business colleges to streamline campus team building.
            </p>
          </div>

          <div className="grid-3">
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                backgroundColor: 'var(--color-accent-light)',
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Sparkles size={24} color="var(--color-accent)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>AI Matching Engine</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Leverages scikit-learn TF-IDF vectorization and cosine distance to pair frontend, backend, ML, and UX skills accurately.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <FolderGit2 size={24} color="var(--color-secondary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Capstones & Side-Projects</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Publish project taglines, required competencies, team size targets, and evaluate student pitch applications in one place.
              </p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem'
              }}>
                <Calendar size={24} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Campus Hackathons & Events</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Never miss an upcoming university hackathon, coding sprint, or alumni pitch night. Connect with participants in advance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '5rem 0',
        background: 'linear-gradient(135deg, #0f2b48 0%, #173d66 60%, #0d9488 100%)',
        color: '#ffffff',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <h2 style={{ fontSize: '2.5rem', color: '#ffffff', marginBottom: '1rem' }}>
            Ready to find your dream team?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#e2e8f0', marginBottom: '2rem', lineHeight: 1.6 }}>
            Connect with university developers, designers, and researchers to build capstone and hackathon projects together.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)' }} aria-label="Create Student Account and Get Started">
              Create Student Account <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
