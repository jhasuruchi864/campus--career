import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { LogIn, KeyRound } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        showToast('Welcome back to Campus Connect!', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
      showToast('Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('alex.rivera@stanford.edu');
    setPassword('Campus@2026!');
    setLoading(true);
    try {
      await login('alex.rivera@stanford.edu', 'Campus@2026!');
      showToast('Logged in as Alex Rivera (Student)', 'success');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--color-primary)' }}>
        Welcome Back
      </h2>
      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem' }}>
        Log in to explore projects and review teammate invites
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <Input
          label="University Email"
          id="login-email"
          type="email"
          placeholder="student@university.edu"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          id="login-password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.8rem',
          marginBottom: '1.25rem'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked />
            <span>Remember me</span>
          </label>
          <a href="#forgot" onClick={(e) => e.preventDefault()} style={{ color: 'var(--color-accent)' }}>
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          style={{ width: '100%', marginBottom: '0.75rem' }}
        >
          <LogIn size={18} /> Sign In
        </Button>

        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={handleDemoLogin}
          style={{ width: '100%', borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
        >
          <KeyRound size={16} /> Quick Demo Student Login
        </Button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
        Don't have a student account?{' '}
        <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;
