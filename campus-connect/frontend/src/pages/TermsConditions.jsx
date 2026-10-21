import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ArrowLeft, CheckCircle2, Shield, AlertTriangle, Scale } from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';

export const TermsConditions = () => {
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
              <Scale size={16} />
              <span>User Agreement</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
              Terms & Conditions
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Last Updated: October 2026. Please read these simple terms before using Campus Connect. They outline your rights, student ownership, and community standards.
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

            {/* 1. Agreement */}
            <section aria-labelledby="section-terms-agreement">
              <h2 id="section-terms-agreement" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="var(--color-accent)" />
                1. Acceptance of Terms
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                By creating an account or using Campus Connect, you agree to these terms. If you do not agree with any part of these rules, please do not use the platform.
              </p>
            </section>

            {/* 2. Who Can Use Campus Connect */}
            <section aria-labelledby="section-terms-eligibility">
              <h2 id="section-terms-eligibility" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={20} color="var(--color-accent)" />
                2. Eligibility and Account Responsibility
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                Campus Connect is built for students, university researchers, and project collaborators:
              </p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                <li>You must provide accurate and truthful details regarding your name and university.</li>
                <li>You are responsible for keeping your login password confidential.</li>
                <li>You must notify us immediately if you suspect unauthorized access to your account.</li>
              </ul>
            </section>

            {/* 3. Intellectual Property Ownership */}
            <section aria-labelledby="section-terms-ownership">
              <h2 id="section-terms-ownership" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--color-accent)" />
                3. Your Project Ownership & Intellectual Property
              </h2>
              <div style={{
                padding: '1.25rem',
                backgroundColor: 'var(--color-accent-light)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #99f6e4',
                color: 'var(--color-primary)',
                fontSize: '0.925rem',
                lineHeight: 1.7,
                marginBottom: '1rem'
              }}>
                <strong>You Own Your Work:</strong> You and your team retain 100% full ownership and copyright of all project descriptions, software code, research, designs, and pitch materials you share. Campus Connect does not claim any ownership over your intellectual property.
              </div>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                You grant Campus Connect only a basic, non-exclusive license to display your public profile and project summaries to other registered students for collaboration purposes.
              </p>
            </section>

            {/* 4. Community Code of Conduct */}
            <section aria-labelledby="section-terms-conduct">
              <h2 id="section-terms-conduct" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="var(--color-accent)" />
                4. Community Code of Conduct
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                To maintain a safe, welcoming environment for all learners, you agree NOT to:
              </p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                <li>Harass, abuse, discriminate, or threaten fellow students.</li>
                <li>Upload malware, malicious code, or unauthorized links.</li>
                <li>Post false, misleading, or deceptive credentials.</li>
                <li>Scrape, crawl, or harvest personal data of other members without explicit authorization.</li>
                <li>Engage in commercial spamming or unsolicited advertising.</li>
              </ul>
            </section>

            {/* 5. Limitation of Liability */}
            <section aria-labelledby="section-terms-liability">
              <h2 id="section-terms-liability" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={20} color="var(--color-accent)" />
                5. Fair Expectations & Disclaimers
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                Campus Connect is a platform to discover opportunities and find teammates. We do not guarantee hackathon prizes, job placements, or specific grades on your academic capstone projects. Teammate commitment and project success depend entirely on mutual communication and hard work.
              </p>
            </section>

            {/* 6. Governing Law */}
            <section aria-labelledby="section-terms-law">
              <h2 id="section-terms-law" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="var(--color-accent)" />
                6. Governing Law & Contact
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                These Terms are governed by and construed in accordance with the laws of India. For any questions or legal inquiries regarding these terms, please email us at <a href="mailto:support@campusconnect.edu" style={{ fontWeight: 600 }}>support@campusconnect.edu</a>.
              </p>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
