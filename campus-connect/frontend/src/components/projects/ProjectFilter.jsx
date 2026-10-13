import React from 'react';
import { Search } from 'lucide-react';
import { PROJECT_CATEGORIES } from '../../js/utils/constants';

export const ProjectFilter = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange
}) => {
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
          placeholder="Filter by keyword or project title..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{ paddingLeft: '2.25rem' }}
        />
      </div>

      <div style={{ minWidth: 180 }}>
        <select
          className="form-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {PROJECT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      <div style={{ minWidth: 140 }}>
        <select
          className="form-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Recruiting">Recruiting</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default ProjectFilter;
