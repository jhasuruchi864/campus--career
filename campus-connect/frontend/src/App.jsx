import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import FindTeammates from './pages/FindTeammates';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Events from './pages/Events';
import AiHub from './pages/AiHub';
import Internships from './pages/Internships';
import Mentors from './pages/Mentors';
import Chat from './pages/Chat';
import AdminAnalytics from './pages/AdminAnalytics';
import NotFound from './pages/NotFound';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import CookiePolicy from './pages/CookiePolicy';
import CookieBanner from './components/common/CookieBanner';

export const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <Routes>
              {/* Public Landing */}
              <Route path="/" element={<Home />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/cookies" element={<CookiePolicy />} />

              {/* Authentication Flow */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>

              {/* Main Application Flow */}
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/find-teammates" element={<FindTeammates />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/ai-hub" element={<AiHub />} />
                <Route path="/internships" element={<Internships />} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/events" element={<Events />} />
                <Route path="/analytics" element={<AdminAnalytics />} />
              </Route>

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieBanner />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
