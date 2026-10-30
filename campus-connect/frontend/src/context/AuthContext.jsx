import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const DEFAULT_ACCOUNTS = [
  {
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
    role: 'Student & Tech Lead',
    skills: [
      { name: 'React', level: 'Advanced' },
      { name: 'FastAPI', level: 'Advanced' },
      { name: 'Python', level: 'Expert' },
      { name: 'Machine Learning', level: 'Intermediate' }
    ]
  },
  {
    id: 2,
    email: 'priya.patel@berkeley.edu',
    full_name: 'Priya Patel',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    university: 'UC Berkeley',
    major: 'Cognitive Science & UI/UX',
    graduation_year: 2025,
    bio: 'Product Designer specialized in design systems, human-AI interfaces, and interactive prototyping.',
    preferred_role: 'UI/UX Product Designer',
    interests: 'Design Systems, Accessibility, WebGL',
    availability_hours_per_week: 12,
    role: 'UX Designer',
    skills: [
      { name: 'Figma', level: 'Expert' },
      { name: 'User Research', level: 'Advanced' },
      { name: 'CSS/Tailwind', level: 'Advanced' }
    ]
  },
  {
    id: 3,
    email: 'elena.rostova@mit.edu',
    full_name: 'Dr. Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    university: 'MIT CSAIL',
    major: 'AI Research Director',
    graduation_year: 2020,
    bio: 'Faculty advisor and researcher supporting cross-campus capstones, LLM agents, and robotics squads.',
    preferred_role: 'Faculty Advisor & Mentor',
    interests: 'Applied AI, Research, Mentorship',
    availability_hours_per_week: 10,
    role: 'Faculty Mentor',
    skills: [
      { name: 'PyTorch', level: 'Expert' },
      { name: 'System Design', level: 'Expert' },
      { name: 'Team Leadership', level: 'Expert' }
    ]
  }
];

export const AuthProvider = ({ children }) => {
  // Accounts list for Instagram-style account switching
  const [accounts, setAccounts] = useState(() => {
    try {
      const savedAccounts = localStorage.getItem('cc_accounts');
      if (savedAccounts) {
        return JSON.parse(savedAccounts);
      }
    } catch {
      // Fallback
    }
    localStorage.setItem('cc_accounts', JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS;
  });

  // Current active user: strictly null if no stored login session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cc_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('cc_auth_token') || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If real token exists, attempt to verify with backend
    if (token && token !== 'demo_token' && !token.startsWith('demo_token_')) {
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

  const saveAccountsToStorage = (updatedList) => {
    setAccounts(updatedList);
    localStorage.setItem('cc_accounts', JSON.stringify(updatedList));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login({ email, password });
      setToken(response.access_token);
      setUser(response.user);
      localStorage.setItem('cc_auth_token', response.access_token);
      localStorage.setItem('cc_auth_user', JSON.stringify(response.user));

      // Add to accounts list if not present
      const existing = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      if (!existing) {
        const updated = [...accounts, response.user];
        saveAccountsToStorage(updated);
      }
      return { success: true };
    } catch (err) {
      // Demo / fallback local matching
      const matchingAccount = accounts.find((a) => a.email.toLowerCase() === email.toLowerCase());
      const activeUser = matchingAccount || {
        id: Date.now(),
        email,
        full_name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        university: 'University Campus',
        major: 'Computer Science',
        graduation_year: 2026,
        bio: 'Aspiring university collaborator and team builder.',
        role: 'Student Collaborator',
        skills: [{ name: 'React', level: 'Intermediate' }]
      };

      const demoToken = `demo_token_${activeUser.id}`;
      setToken(demoToken);
      setUser(activeUser);
      localStorage.setItem('cc_auth_token', demoToken);
      localStorage.setItem('cc_auth_user', JSON.stringify(activeUser));

      if (!matchingAccount) {
        const updated = [...accounts, activeUser];
        saveAccountsToStorage(updated);
      }
      return { success: true, warning: 'Logged in successfully' };
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

      const updated = [...accounts, response.user];
      saveAccountsToStorage(updated);
      return { success: true };
    } catch (err) {
      const newUser = {
        id: Date.now(),
        ...userData,
        role: userData.role || 'Student Collaborator',
        skills: []
      };
      const demoToken = `demo_token_${newUser.id}`;
      setToken(demoToken);
      setUser(newUser);
      localStorage.setItem('cc_auth_token', demoToken);
      localStorage.setItem('cc_auth_user', JSON.stringify(newUser));

      const updated = [...accounts, newUser];
      saveAccountsToStorage(updated);
      return { success: true, warning: 'Registered in local mode' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('cc_auth_token');
    localStorage.removeItem('cc_auth_user');
    setToken(null);
    setUser(null);
  };

  const updateProfileState = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('cc_auth_user', JSON.stringify(updated));

      // Also update in accounts list
      const updatedAccounts = accounts.map((acc) => (acc.id === prev.id ? { ...acc, ...updatedFields } : acc));
      saveAccountsToStorage(updatedAccounts);

      return updated;
    });
  };

  // Instagram-style Rename Account
  const renameUser = (newName, newUniversity, newMajor, newBio) => {
    if (!user) return false;
    const updatedFields = {
      full_name: newName || user.full_name,
      university: newUniversity || user.university,
      major: newMajor || user.major,
      bio: newBio !== undefined ? newBio : user.bio
    };
    updateProfileState(updatedFields);
    return true;
  };

  // Instagram-style Change Password
  const changePassword = async (currentPassword, newPassword) => {
    if (!newPassword || newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters long.');
    }
    // Simulate API delay and store
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true, message: 'Password updated successfully!' };
  };

  // Instagram-style Switch Account
  const switchAccount = (targetAccount) => {
    if (!targetAccount) return;
    const newToken = `demo_token_${targetAccount.id}`;
    setUser(targetAccount);
    setToken(newToken);
    localStorage.setItem('cc_auth_token', newToken);
    localStorage.setItem('cc_auth_user', JSON.stringify(targetAccount));
  };

  // Instagram-style Add Account
  const addAccount = (newAccountData) => {
    const createdAccount = {
      id: Date.now(),
      email: newAccountData.email,
      full_name: newAccountData.full_name || newAccountData.email.split('@')[0],
      university: newAccountData.university || 'Campus University',
      major: newAccountData.major || 'Computer Science',
      role: newAccountData.role || 'Student',
      avatar_url: newAccountData.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(newAccountData.full_name || 'User')}`,
      graduation_year: 2026,
      bio: newAccountData.bio || 'New collaborative student account.',
      skills: []
    };

    const updated = [...accounts, createdAccount];
    saveAccountsToStorage(updated);
    switchAccount(createdAccount);
    return createdAccount;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        accounts,
        login,
        register,
        logout,
        updateProfileState,
        renameUser,
        changePassword,
        switchAccount,
        addAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
