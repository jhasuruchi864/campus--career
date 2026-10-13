import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const MOCK_CURRENT_USER = {
  id: 1,
  email: 'alex.rivera@stanford.edu',
  full_name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  university: 'Stanford University',
  major: 'Computer Science & AI',
  graduation_year: 2026,
  bio: 'Junior CS major passionate about autonomous systems, full-stack architectures, and ML teammate pairing.',
  preferred_role: 'Full Stack / ML Engineer',
  interests: 'AI/ML, Web3, Hackathons, Open Source',
  availability_hours_per_week: 15,
  skills: [
    { name: 'React', level: 'Advanced' },
    { name: 'FastAPI', level: 'Advanced' },
    { name: 'Python', level: 'Expert' },
    { name: 'Machine Learning', level: 'Intermediate' }
  ]
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cc_auth_user');
    return saved ? JSON.parse(saved) : MOCK_CURRENT_USER;
  });
  const [token, setToken] = useState(() => localStorage.getItem('cc_auth_token') || 'demo_token');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If real token exists, attempt to verify with backend
    if (token && token !== 'demo_token') {
      authService.getCurrentUser()
        .then((userData) => {
          setUser(userData);
          localStorage.setItem('cc_auth_user', JSON.stringify(userData));
        })
        .catch(() => {
          // Token expired or server unreachable
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setToken(response.access_token);
      setUser(response.user);
      localStorage.setItem('cc_auth_token', response.access_token);
      localStorage.setItem('cc_auth_user', JSON.stringify(response.user));
      return { success: true };
    } catch (err) {
      // Demo fallback if backend is offline
      const fallbackUser = {
        id: 1,
        email,
        full_name: email.split('@')[0].replace('.', ' '),
        university: 'University Campus',
        major: 'Computer Science',
        graduation_year: 2026,
        bio: 'Aspiring software engineer exploring tech collaborations.',
        skills: [{ name: 'React', level: 'Intermediate' }]
      };
      setToken('demo_token');
      setUser(fallbackUser);
      localStorage.setItem('cc_auth_token', 'demo_token');
      localStorage.setItem('cc_auth_user', JSON.stringify(fallbackUser));
      return { success: true, warning: 'Connected in local mode' };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await authService.register(userData);
      setToken(response.access_token);
      setUser(response.user);
      localStorage.setItem('cc_auth_token', response.access_token);
      localStorage.setItem('cc_auth_user', JSON.stringify(response.user));
      return { success: true };
    } catch (err) {
      const fallbackUser = {
        id: Date.now(),
        ...userData,
        skills: []
      };
      setToken('demo_token');
      setUser(fallbackUser);
      localStorage.setItem('cc_auth_token', 'demo_token');
      localStorage.setItem('cc_auth_user', JSON.stringify(fallbackUser));
      return { success: true, warning: 'Registered in local mode' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateProfileState = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('cc_auth_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
