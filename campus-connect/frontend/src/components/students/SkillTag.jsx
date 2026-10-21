import React from 'react';

export const SkillTag = ({ name, level, onRemove }) => {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px',
      backgroundColor: 'var(--color-bg-subtle)',
      color: 'var(--color-primary)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.75rem',
      fontWeight: 500,
      border: '1px solid var(--color-border)'
    }}>
      <span>{name}</span>
      {level && (
        <span style={{
          fontSize: '0.65rem',
          color: 'var(--color-accent)',
          fontWeight: 700,
          marginLeft: '2px'
        }}>
          [{level}]
        </span>
      )}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${name} skill`}
          style={{
            marginLeft: '4px',
            color: 'var(--color-text-subtle)',
            fontSize: '12px',
            lineHeight: 1,
            cursor: 'pointer'
          }}
          title={`Remove ${name} skill`}
        >
          &times;
        </button>
      )}
    </span>
  );
};

export default SkillTag;
