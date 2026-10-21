import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Calendar, MapPin, ExternalLink, Users } from 'lucide-react';
import { formatDateTime } from '../../js/utils/helpers';

export const EventCard = ({ event, onRegister }) => {
  return (
    <Card className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
      {event.banner_url ? (
        <img
          src={event.banner_url}
          alt={event.title}
          style={{ width: '100%', height: '140px', objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          height: '110px',
          background: 'linear-gradient(135deg, #0f2b48 0%, #0d9488 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '-0.02em',
          padding: '1rem',
          textAlign: 'center'
        }}>
          {event.title}
        </div>
      )}

      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <Badge variant={event.event_type === 'Hackathon' ? 'accent' : 'primary'}>
            {event.event_type}
          </Badge>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            College Event
          </span>
        </div>

        <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0.875rem', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--color-accent)" />
            <span>{formatDateTime(event.start_time)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} color="var(--color-secondary)" />
            <span>{event.location}</span>
          </div>
        </div>

        <p style={{
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
          marginBottom: '1.25rem',
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </p>

        <div className="card-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              Open to all majors
            </span>
            {event.registration_url ? (
              <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="sm">
                  Register <ExternalLink size={13} />
                </Button>
              </a>
            ) : (
              <Button variant="primary" size="sm" onClick={() => onRegister && onRegister(event)}>
                RSVP Now
              </Button>
            )}
          </div>

          {/* Add to Calendar Utilities */}
          <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-xs"
              style={{ flex: 1, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
            >
              <Calendar size={12} /> Google Calendar
            </a>
            <button
              onClick={() => {
                const icsData = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDESCRIPTION:${event.description}\nLOCATION:${event.location}\nEND:VEVENT\nEND:VCALENDAR`;
                const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="btn btn-ghost btn-xs"
              style={{ fontSize: '0.7rem' }}
              title="Download Apple / Outlook .ics calendar file"
            >
              .ics Export
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
