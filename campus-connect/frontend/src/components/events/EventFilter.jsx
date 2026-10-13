import React from 'react';
import { Search } from 'lucide-react';
import { EVENT_TYPES } from '../../js/utils/constants';

export const EventFilter = ({ search, onSearchChange, type, onTypeChange }) => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      alignItems: 'center',
      marginBottom: '1.75rem',
      backgroundColor: '#ffffff',
      padding: '1rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--color-border)',
      boxShadow: 'var(--shadow-xs)'
    }}>
      <div style={{ position: 'relative', flex: '1 1 240px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
        <input
          type="text"
          className="form-input"
          placeholder="Search hackathons, workshops, seminars..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ paddingLeft: '2.25rem' }}
        />
      </div>

      <div style={{ minWidth: 180 }}>
        <select
          className="form-select"
          value={type}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Event Types' : t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EventFilter;
