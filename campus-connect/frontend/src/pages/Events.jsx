import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import EventFilter from '../components/events/EventFilter';
import EventCard from '../components/events/EventCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import { useToast } from '../context/ToastContext';
import { EVENT_TYPES } from '../js/utils/constants';

const INITIAL_EVENTS = [
  {
    id: 1,
    title: 'Stanford TreeHacks 2026: AI & Spatial Computing',
    event_type: 'Hackathon',
    location: 'Arrillaga Alumni Center, Stanford Campus',
    start_time: '2026-11-06T18:00:00Z',
    end_time: '2026-11-08T15:00:00Z',
    description: 'Northern California’s premier collegiate hackathon. 36 hours of hacking, $75,000 in sponsor prizes, and direct mentorship from leading AI laboratories.',
    registration_url: 'https://treehacks.com',
    banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    title: 'Scalable Systems Workshop: FastAPI & Vector Databases',
    event_type: 'Workshop',
    location: 'Huang Engineering Center Room 203 & Zoom',
    start_time: '2026-10-24T17:30:00Z',
    end_time: '2026-10-24T19:30:00Z',
    description: 'Learn how to architect high-throughput asynchronous Python microservices using FastAPI, SQLAlchemy 2.0, and pgvector for semantic search.',
    registration_url: '',
    banner_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 3,
    title: 'Campus Venture Demo Night: Student Founders & Angels',
    event_type: 'Pitch Night',
    location: 'Tressider Oak Lounge',
    start_time: '2026-11-12T19:00:00Z',
    end_time: '2026-11-12T21:30:00Z',
    description: 'Top student-led startups and capstone teams present 3-minute pitches to Bay Area seed investors, university angels, and alumni operators.',
    registration_url: '',
    banner_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'
  }
];

export const Events = () => {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    event_type: 'Hackathon',
    location: '',
    start_time: '',
    description: ''
  });

  const { showToast } = useToast();

  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase()) ||
      ev.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = type === 'All' || ev.event_type === type;
    return matchesSearch && matchesType;
  });

  const handleRegister = (event) => {
    showToast(`RSVP confirmed for "${event.title}"! Added to your calendar.`, 'success');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.location) return;

    const created = {
      ...newEvent,
      id: Date.now(),
      start_time: newEvent.start_time || new Date().toISOString()
    };

    setEvents([created, ...events]);
    setIsModalOpen(false);
    showToast(`Campus event "${created.title}" successfully scheduled!`, 'success');
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Campus Events & Hackathons</h1>
          <p className="section-subtitle">
            Discover college coding sprints, engineering workshops, and networking mixers across campus.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Host Event
        </Button>
      </div>

      <EventFilter
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
      />

      {filteredEvents.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No events found</h3>
          <p className="empty-state-desc">Try resetting your filters or check back later for new event listings.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setType('All'); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid-3">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={handleRegister}
            />
          ))}
        </div>
      )}

      {/* Host Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Host a Campus Event"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateEvent}>Publish Event</Button>
          </>
        }
      >
        <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <Input
            label="Event Title"
            id="ev-title"
            placeholder="e.g., Spring 2026 AI Hack Night"
            required
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="ev-type">Event Type</label>
              <select
                id="ev-type"
                className="form-select"
                value={newEvent.event_type}
                onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
              >
                {EVENT_TYPES.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <Input
              label="Location / Zoom Link"
              id="ev-loc"
              placeholder="e.g., Gates Computer Science 104"
              required
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>

          <Input
            label="Start Date & Time"
            id="ev-time"
            type="datetime-local"
            value={newEvent.start_time}
            onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
          />

          <div className="form-group">
            <label className="form-label" htmlFor="ev-desc">Event Description</label>
            <textarea
              id="ev-desc"
              className="form-textarea"
              rows="3"
              placeholder="Provide agenda, prerequisites, and registration instructions..."
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
