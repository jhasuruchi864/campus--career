import React from 'react';

export const Loader = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClass = size === 'sm' ? 'spinner-sm' : size === 'lg' ? 'spinner-lg' : '';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1rem',
      gap: '1rem',
      color: 'var(--color-text-muted)'
    }}>
      <div className={`spinner ${sizeClass}`} />
      {message && <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>}
    </div>
  );
};

export default Loader;
