import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  X,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Mentors = () => {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');

  // Booking Modal
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [topic, setTopic] = useState('Resume & Portfolio Review');
  const [sessionDate, setSessionDate] = useState('');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // My Bookings
  const [myBookings, setMyBookings] = useState([]);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      let query = '';
      const params = [];
      if (companyFilter) params.push(`company=${encodeURIComponent(companyFilter)}`);
      if (params.length) query = `?${params.join('&')}`;

      const data = await api.get(`/mentors${query}`);
      setMentors(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to load mentors.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBookings = async () => {
    if (!user) return;
    try {
      const data = await api.get('/mentors/my-bookings');
      setMyBookings(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchMyBookings();
  }, [companyFilter]);

  const handleBookSession = async () => {
    if (!user) {
      addToast('Please sign in to book mentorship sessions.', 'warning');
      return;
    }
    if (!sessionDate) {
      addToast('Please select a date & time for the session.', 'warning');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post(`/mentors/${selectedMentor.id}/book`, {
        topic,
        scheduled_at: new Date(sessionDate).toISOString(),
        notes
      });
      addToast(`1:1 Session booked with ${selectedMentor.name}!`, 'success');
      setSelectedMentor(null);
      setSessionDate('');
      setNotes('');
      fetchMentors();
      fetchMyBookings();
    } catch (err) {
      addToast(err.message || 'Failed to book session.', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const filteredMentors = mentors.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.company.toLowerCase().includes(term) ||
      m.expertise.toLowerCase().includes(term)
    );
  });

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-accent-light)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          <GraduationCap size={14} /> Alumni Mentorship Network
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
          Connect with Alumni at Top Companies
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
          Book 1:1 guidance sessions, resume critiques, and system design interviews with passed-out seniors now engineering at Google, Anthropic, Stripe, and Microsoft.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="card" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '36px' }}
            placeholder="Search mentors by name, company, or domain (e.g., LLM, Stripe)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-input"
          style={{ width: 'auto', minWidth: '150px' }}
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
        >
          <option value="">All Companies</option>
          <option value="Google">Google</option>
          <option value="Anthropic">Anthropic</option>
          <option value="Stripe">Stripe</option>
          <option value="Microsoft">Microsoft</option>
        </select>
      </div>

      {/* Scheduled Bookings Banner if user has sessions */}
      {myBookings.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem', backgroundColor: 'var(--color-accent-light)', border: '1px solid var(--color-accent)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="var(--color-accent)" /> Your Upcoming 1:1 Sessions ({myBookings.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
            {myBookings.map((b) => (
              <div key={b.id} style={{ backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{b.mentor_name} ({b.mentor_company})</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.topic}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600, marginTop: '4px' }}>
                  {new Date(b.scheduled_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mentors Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>Loading alumni mentors...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                  <img
                    src={mentor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                    alt={mentor.name}
                    style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-accent)' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                      {mentor.name}
                    </h3>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-accent)' }}>
                      {mentor.role} @ {mentor.company}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                      Class of {mentor.graduation_year} • {mentor.university}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {mentor.bio}
                </p>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>EXPERTISE</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {mentor.expertise.split(',').map((exp, idx) => (
                      <span key={idx} style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-primary)', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 500 }}>
                        {exp.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: mentor.available_slots > 0 ? 'var(--color-success)' : 'var(--color-text-subtle)', fontWeight: 600 }}>
                  {mentor.available_slots > 0 ? `${mentor.available_slots} slots open this week` : 'Fully Booked'}
                </span>

                <button
                  onClick={() => setSelectedMentor(mentor)}
                  disabled={mentor.available_slots <= 0}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Calendar size={14} /> Book 1:1
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedMentor && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setSelectedMentor(null)}
              style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-subtle)' }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.25rem' }}>
              Schedule Session with {selectedMentor.name}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '1.25rem' }}>
              {selectedMentor.role} at {selectedMentor.company}
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                Consultation Topic
              </label>
              <select className="form-input" value={topic} onChange={(e) => setTopic(e.target.value)}>
                <option value="Resume & Portfolio Review">Resume & High-Impact Portfolio Review</option>
                <option value="Technical System Design Mock">Technical / System Design Mock Interview</option>
                <option value="Startup Pitch & Architecture Critique">Startup Pitch & Architecture Critique</option>
                <option value="Career Transition & Graduate School">Career Transition & Industry Roadmap</option>
              </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                Preferred Date & Time (30-Min Session)
              </label>
              <input
                type="datetime-local"
                className="form-input"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', marginBottom: '0.4rem' }}>
                Specific Questions / Focus Areas
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share your GitHub repo, resume link, or specific questions you'd like guidance on..."
                style={{ width: '100%', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button onClick={() => setSelectedMentor(null)} className="btn btn-outline btn-sm">
                Cancel
              </button>
              <button
                onClick={handleBookSession}
                disabled={bookingLoading}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <CheckCircle size={14} />
                {bookingLoading ? 'Booking...' : 'Confirm 1:1 Consultation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
