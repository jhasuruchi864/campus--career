import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  CheckCircle,
  ExternalLink,
  Building,
  Sparkles,
  Send,
  X,
  FileCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Internships = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Apply Modal state
  const [selectedListing, setSelectedListing] = useState(null);
  const [pitchNote, setPitchNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      let query = '';
      const params = [];
      if (roleFilter) params.push(`role_type=${encodeURIComponent(roleFilter)}`);
      if (locationFilter) params.push(`location=${encodeURIComponent(locationFilter)}`);
      if (searchTerm) params.push(`search=${encodeURIComponent(searchTerm)}`);
      if (params.length) query = `?${params.join('&')}`;

      const data = await api.get(`/internships${query}`);
      setInternships(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to load internships.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [roleFilter, locationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const handleApply = async () => {
    if (!user) {
      addToast('Please log in with your student account to apply.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await api.post(`/internships/${selectedListing.id}/apply`, { pitch_note: pitchNote });
      addToast('Application submitted successfully! Recruiter notified.', 'success');
      setSelectedListing(null);
      setPitchNote('');
      fetchInternships();
    } catch (err) {
      addToast(err.message || 'Could not submit application.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-secondary-light)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: 'var(--color-secondary)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
            <Briefcase size={14} /> Career & Research Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
            Campus Internships & Research Fellowships
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
            Discover high-impact opportunities from top tech startups, foundation labs, and professor research groups. Apply with your unified student profile.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px' }}
              placeholder="Search by title, company, or skills (e.g., PyTorch, Next.js)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="form-input"
            style={{ width: 'auto', minWidth: '160px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Opportunity Types</option>
            <option value="Internship">Industry Internship</option>
            <option value="Research RA">Professor / Lab Research</option>
            <option value="Full-time">New Grad Full-Time</option>
          </select>

          <select
            className="form-input"
            style={{ width: 'auto', minWidth: '140px' }}
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="Remote">Remote</option>
            <option value="On-Campus">On-Campus</option>
            <option value="Hybrid / San Francisco">Hybrid / Tech Hubs</option>
          </select>

          <button type="submit" className="btn btn-primary btn-sm">
            Filter
          </button>
        </form>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          Loading opportunities...
        </div>
      ) : internships.length === 0 ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          <Briefcase size={40} style={{ margin: '0 auto 1rem auto', color: 'var(--color-text-subtle)' }} />
          <h3>No listings match your criteria</h3>
          <p>Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {internships.map((job) => (
            <div key={job.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={job.logo_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100'}
                      alt={job.company_name}
                      style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--color-border)' }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{job.company_name}</div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>{job.title}</h3>
                    </div>
                  </div>
                  <span style={{
                    backgroundColor: job.role_type === 'Research RA' ? 'var(--color-accent-light)' : 'var(--color-secondary-light)',
                    color: job.role_type === 'Research RA' ? 'var(--color-accent)' : 'var(--color-secondary)',
                    fontSize: '0.75rem',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: 700
                  }}>
                    {job.role_type}
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {job.description}
                </p>

                {/* Metadata Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {job.location}
                  </span>
                  {job.stipend && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: 'var(--color-success)' }}>
                      <DollarSign size={14} /> {job.stipend}
                    </span>
                  )}
                  {job.deadline && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} /> Deadline in {Math.max(1, Math.ceil((new Date(job.deadline) - new Date()) / (1000 * 60 * 60 * 24)))} days
                    </span>
                  )}
                </div>

                {/* Required Skills */}
                {job.required_skills && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                    {job.required_skills.split(',').map((skill, idx) => (
                      <span key={idx} style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                  {job.application_count} campus applicants
                </span>

                {job.has_applied ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-success)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <CheckCircle size={16} /> Applied
                  </span>
                ) : (
                  <button
                    onClick={() => setSelectedListing(job)}
                    className="btn btn-primary btn-sm"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Sparkles size={14} /> 1-Click Profile Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 1-Click Application Modal */}
      {selectedListing && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setSelectedListing(null)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              Quick Apply to {selectedListing.company_name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              Role: <strong>{selectedListing.title}</strong>
            </p>

            <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '4px' }}>
                <FileCheck size={16} color="var(--color-success)" /> Verified Student Profile Linked
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Your GPA, GitHub, verified skills catalog, and capstone project portfolio will be attached automatically.
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                Pitch Note to Recruiter / Faculty (Optional)
              </label>
              <textarea
                className="form-input"
                rows={4}
                value={pitchNote}
                onChange={(e) => setPitchNote(e.target.value)}
                placeholder="Briefly state why you're a great fit for this project or fellowship..."
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedListing(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={submitting}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={14} />
                {submitting ? 'Submitting...' : 'Confirm 1-Click Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Internships;
