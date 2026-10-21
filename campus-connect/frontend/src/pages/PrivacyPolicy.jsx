import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Lock, FileText, UserCheck, AlertCircle, Mail } from 'lucide-react';
import PublicNavbar from '../components/common/PublicNavbar';
import Footer from '../components/common/Footer';

export const PrivacyPolicy = () => {
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
              <ShieldCheck size={16} />
              <span>India DPDP Act (2023) Aligned</span>
            </div>

            <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
              Privacy Policy
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Last Updated: October 2026. This policy explains what information Campus Connect collects, why we collect it, and how your rights are protected under applicable laws including India's Digital Personal Data Protection Act, 2023 (DPDP Act).
            </p>
          </div>

          {/* Content Sections */}
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

            {/* 1. Who We Are */}
            <section aria-labelledby="section-who-we-are">
              <h2 id="section-who-we-are" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="var(--color-accent)" />
                1. Who We Are (Data Fiduciary)
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--color-text-main)' }}>
                Campus Connect is an academic collaboration platform designed to help university students discover peers, build teams for capstone projects and hackathons, and connect based on technical skills. Under the Digital Personal Data Protection Act, 2023, Campus Connect acts as the <strong>Data Fiduciary</strong> responsible for protecting your personal data.
              </p>
            </section>

            {/* 2. What Data We Collect */}
            <section aria-labelledby="section-data-collected">
              <h2 id="section-data-collected" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={20} color="var(--color-accent)" />
                2. Information You Provide to Us
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                We only collect information that you knowingly provide when creating an account or updating your profile. We do not secretly scrape or buy student data:
              </p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                <li><strong>Account Basics:</strong> Full name and college email address.</li>
                <li><strong>Student Profile:</strong> University name, major, graduation year, bio, and preferred role.</li>
                <li><strong>Technical Skills:</strong> Self-selected skills (e.g. Python, React, UI/UX) and proficiency levels.</li>
                <li><strong>Project Pitch Applications:</strong> Messages you choose to send to project owners when applying to join teams.</li>
                <li><strong>Optional External Links:</strong> Links you choose to share (GitHub, LinkedIn, or portfolio URLs).</li>
              </ul>
            </section>

            {/* 3. Why We Use This Data */}
            <section aria-labelledby="section-data-purpose">
              <h2 id="section-data-purpose" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} color="var(--color-accent)" />
                3. Purpose of Data Use (No Data Selling)
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                Your personal data is strictly used for university project matching and communication:
              </p>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                <li>Displaying your student profile to classmates looking for project teammates.</li>
                <li>Matching project requirements with relevant candidate skills using our open algorithm.</li>
                <li>Sending relevant account notifications (such as project application acceptance).</li>
              </ul>
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                backgroundColor: 'var(--color-success-bg)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #bbf7d0',
                color: '#166534',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                Guaranteed: We never sell your personal data, and we do not share your information with advertisers or marketing brokers.
              </div>
            </section>

            {/* 4. Tracking, Analytics & Third-Party Embeds */}
            <section aria-labelledby="section-tracking">
              <h2 id="section-tracking" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={20} color="var(--color-accent)" />
                4. Analytics, Tracking & Third-Party Embeds
              </h2>
              <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.925rem', color: 'var(--color-text-muted)' }}>
                <li><strong>No Ad Trackers:</strong> We do not load advertising trackers, Facebook Pixels, or cross-site tracking scripts.</li>
                <li><strong>Authentication Storage:</strong> We only store a secure session token (JWT) in your browser's local storage to keep you logged in.</li>
                <li><strong>External Links:</strong> Project cards and event listings may contain links to external university websites or GitHub repositories. Clicking these takes you to external platforms governed by their own privacy practices.</li>
              </ul>
            </section>

            {/* 5. Your Rights Under DPDP Act 2023 */}
            <section aria-labelledby="section-dpdp-rights">
              <h2 id="section-dpdp-rights" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="var(--color-accent)" />
                5. Your Rights as a Data Principal (India DPDP Act)
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '0.75rem', color: 'var(--color-text-main)' }}>
                You have full control over your personal data. Under India's Digital Personal Data Protection Act, 2023, you have the following clear rights:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: 'var(--color-primary)' }}>Right to Access</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>View all personal details held in your profile at any time from your dashboard.</div>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: 'var(--color-primary)' }}>Right to Correction</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Update your bio, skills, or college details anytime via the Profile Settings page.</div>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: 'var(--color-primary)' }}>Right to Erasure</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Request total deletion of your account and associated records by contacting us.</div>
                </div>
                <div style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-bg-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: 'var(--color-primary)' }}>Right to Redressal</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>File any privacy concern directly to our designated Grievance Officer.</div>
                </div>
              </div>
            </section>

            {/* 6. Grievance Redressal Officer */}
            <section aria-labelledby="section-grievance">
              <h2 id="section-grievance" style={{ fontSize: '1.3rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={20} color="var(--color-accent)" />
                6. Grievance Redressal & Contact Information
              </h2>
              <p style={{ fontSize: '0.925rem', lineHeight: 1.7, marginBottom: '1rem', color: 'var(--color-text-main)' }}>
                If you have questions about your privacy, wish to delete your data, or want to report an issue, please contact our designated Grievance Officer:
              </p>
              <div style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-subtle)',
                border: '1px solid var(--color-border)',
                fontSize: '0.9rem',
                lineHeight: 1.7
              }}>
                <div><strong>Designation:</strong> Data Grievance Redressal Officer</div>
                <div><strong>Platform:</strong> Campus Connect</div>
                <div><strong>Email:</strong> <a href="mailto:privacy@campusconnect.edu" style={{ fontWeight: 600 }}>privacy@campusconnect.edu</a></div>
                <div><strong>Response Timeline:</strong> We respond to all verified grievance requests within 7 business days.</div>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
