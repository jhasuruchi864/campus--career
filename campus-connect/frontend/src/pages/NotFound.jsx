import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Compass, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        backgroundColor: 'var(--color-accent-light)',
        borderRadius: '50%',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        color: 'var(--color-accent)'
      }}>
        <Compass size={48} />
      </div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: 'var(--color-primary)' }}>
        404 - Page Not Found
      </h1>
      <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', maxWidth: 450, marginBottom: '2rem' }}>
        The campus link you followed does not exist or has been relocated to another corridor.
      </p>
      <Link to="/dashboard">
        <Button variant="primary">
          <Home size={16} /> Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
