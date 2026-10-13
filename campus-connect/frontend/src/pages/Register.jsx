import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    university: 'Stanford University',
    major: 'Computer Science',
    graduation_year: 2026,
    preferred_role: 'Full Stack Developer'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { confirm_password, ...payload } = formData;
      const result = await register({
        ...payload,
        graduation_year: parseInt(payload.graduation_year, 10)
      });
      if (result.success) {
        showToast('Account created successfully!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      showToast('Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--color-primary)' }}>
        Join Campus Connect
      </h2>
      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Create your student builder profile and get matched with project teams
      </p>

      {error && (
        <div style={{
          backgroundColor: 'var(--color-danger-bg)',
          color: 'var(--color-danger)',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <Input
          label="Full Name"
          id="reg-name"
          placeholder="e.g., Alex Rivera"
          required
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
        />

        <Input
          label="University Email"
          id="reg-email"
          type="email"
          placeholder="alex@stanford.edu"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />

        <div className="grid-2">
          <Input
            label="Password"
            id="reg-password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <Input
            label="Confirm Password"
            id="reg-confirm"
            type="password"
            placeholder="••••••••"
            required
            value={formData.confirm_password}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
          />
        </div>

        <div className="grid-2">
          <Input
            label="University"
            id="reg-uni"
            placeholder="e.g., Stanford University"
            required
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
          />

          <Input
            label="Graduation Year"
            id="reg-grad"
            type="number"
            min="2024"
            max="2030"
            required
            value={formData.graduation_year}
            onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
          />
        </div>

        <Input
          label="Major / Field of Study"
          id="reg-major"
          placeholder="e.g., Computer Science, Electrical Eng, BioTech"
          required
          value={formData.major}
          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          style={{ width: '100%', marginTop: '0.75rem' }}
        >
          <UserPlus size={18} /> Register as Student
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Already registered?{' '}
        <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
          Log In
        </Link>
      </div>
    </div>
  );
};

export default Register;
