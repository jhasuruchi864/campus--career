import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  FolderGit2,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Building2,
  Download,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AdminAnalytics = () => {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await api.get('/analytics/campus-summary');
        setData(res);
      } catch (err) {
        addToast(err.message || 'Failed to load analytics.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    addToast('College Placement & Capstone Intelligence Report generated (.PDF/.CSV)!', 'success');
  };

  if (loading) {
    return <div className="container" style={{ padding: '3rem', textAlign: 'center' }}>Loading campus analytics...</div>;
  }

  const { overview, trending_skills, placement_stats } = data || {};

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-accent-light)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <BarChart3 size={14} /> College Placement & Department Intelligence
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
            Campus Analytics & Placement Portal
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Live metrics on student skill adoption, capstone project velocity, internship conversions, and alumni mentorship activity.
          </p>
        </div>
        <button onClick={handleExport} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Download size={16} /> Export Accreditation Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Active Students</span>
            <Users size={18} color="var(--color-secondary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{overview?.total_students}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
            {placement_stats?.verified_student_profiles_pct}% .edu Verified
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Capstone Projects</span>
            <FolderGit2 size={18} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{overview?.total_projects}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
            {overview?.active_recruiting_projects} recruiting multidisciplinary squads
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Campus Internships</span>
            <Briefcase size={18} color="var(--color-warning)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{overview?.total_internships}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {overview?.total_applications} student applications submitted
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Alumni Mentorship</span>
            <GraduationCap size={18} color="var(--color-success)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-primary)' }}>{overview?.total_sessions_booked}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 600 }}>
            1:1 Sessions completed across top firms
          </div>
        </div>
      </div>

      {/* Main Grid: Trending Skills & Placement Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        {/* Trending Skills Meter */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
              Trending Tech Stacks on Campus
            </h3>
            <span style={{ fontSize: '0.75rem', backgroundColor: 'var(--color-bg-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
              Live Skill Verification
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {trending_skills?.map((item, idx) => {
              const maxCount = trending_skills[0]?.students_count || 50;
              const pct = Math.round((item.students_count / maxCount) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-primary)' }}>{item.skill}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{item.students_count} verified students</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: idx % 2 === 0 ? 'var(--color-accent)' : 'var(--color-secondary)',
                        borderRadius: 'var(--radius-full)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Placement Metrics */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
              Placement & Fellowship Outcomes
            </h3>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700 }}>
              <TrendingUp size={14} /> +8.3% YoY
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-success-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Placement Rate</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-success)' }}>
                {placement_stats?.placement_rate_pct}%
              </div>
            </div>
            <div style={{ backgroundColor: 'var(--color-secondary-light)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Average Intern Stipend</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-secondary)' }}>
                {placement_stats?.average_stipend}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              TOP RECRUITING CAMPUS PARTNERS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {placement_stats?.active_partner_companies?.map((comp, idx) => (
                <span key={idx} style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                  🏢 {comp}
                </span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              HIGH DEMAND CAPSTONE DOMAINS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {placement_stats?.top_recruiting_domains?.map((dom, idx) => (
                <span key={idx} style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  ⚡ {dom}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
