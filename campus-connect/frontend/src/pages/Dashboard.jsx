import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  FolderGit2,
  Users,
  Calendar,
  Plus,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import MatchScoreBadge from '../components/common/MatchScoreBadge';
import SkillGapAdvisor from '../components/students/SkillGapAdvisor';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../js/utils/helpers';

export const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Sample dashboard state (augmented with live state)
  const [stats] = useState({
    activeProjects: 2,
    pendingRequests: 1,
    aiMatchFit: 94,
    upcomingEvents: 3
  });

  const [recommendedTeammates] = useState([
    {
      id: 101,
      student: {
        full_name: 'Elena Rostova',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        university: 'Stanford University',
        preferred_role: 'Computer Vision & ML',
        skills: ['PyTorch', 'Computer Vision', 'Python']
      },
      match_score: 95,
      match_reasons: [
        'Fills critical Computer Vision gap for your Capstone project',
        'High mutual availability (15h/week)',
        'Matched via TF-IDF skill cosine similarity'
      ]
    },
    {
      id: 102,
      student: {
        full_name: 'Marcus Chen',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        university: 'UC Berkeley',
        preferred_role: 'Product Designer (UI/UX)',
        skills: ['Figma', 'UI/UX Design', 'Design Systems']
      },
      match_score: 88,
      match_reasons: [
        'Complementary UX skillset for web applications',
        'Previous college hackathon winner'
      ]
    }
  ]);

  const [myProjects] = useState([
    {
      id: 1,
      title: 'MediVision: Real-Time Diagnostic Assistance',
      category: 'AI & Machine Learning',
      status: 'Recruiting',
      team_members_count: 3,
      max_team_size: 4,
      role: 'Project Lead'
    },
    {
      id: 2,
      title: 'EcoCampus: University Zero-Waste Tracking',
      category: 'Web Development',
      status: 'In Progress',
      team_members_count: 4,
      max_team_size: 4,
      role: 'Full Stack Engineer'
    }
  ]);

  const handleCreateProject = async (projectData) => {
    showToast(`Project "${projectData.title}" created successfully!`, 'success');
  };

  return (
    <div>
      {/* Top Banner / Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2b48 0%, #173d66 65%, #0d9488 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.5rem',
        color: '#ffffff',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="avatar avatar-lg" style={{ border: '3px solid #ffffff' }} />
          ) : (
            <div className="avatar avatar-lg" style={{ border: '3px solid rgba(255,255,255,0.8)', backgroundColor: '#ffffff', color: '#0f2b48' }}>
              {getInitials(user?.full_name)}
            </div>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ color: '#ffffff', fontSize: '1.75rem' }}>Welcome back, {user?.full_name || 'Student'}!</h1>
              <span style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                {user?.university || 'Campus'}
              </span>
            </div>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', marginTop: '4px' }}>
              {user?.major || 'Computer Science'} • Class of {user?.graduation_year || 2026} • {user?.preferred_role || 'Developer'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" style={{ backgroundColor: '#ffffff', color: '#0f2b48', fontWeight: 700 }} onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} /> New Project
          </Button>
          <Link to="/find-teammates">
            <Button variant="outline" style={{ borderColor: 'rgba(255, 255, 255, 0.4)', color: '#ffffff', backgroundColor: 'transparent' }}>
              <Sparkles size={16} /> Match Teammates
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>My Projects</span>
            <FolderGit2 size={20} color="var(--color-secondary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {stats.activeProjects}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)' }}>1 Recruiting • 1 In Progress</span>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Pending Requests</span>
            <Users size={20} color="var(--color-accent)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {stats.pendingRequests}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>1 incoming student pitch</span>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>AI Teammate Fit</span>
            <Sparkles size={20} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#047857' }}>
            {stats.aiMatchFit}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#047857' }}>Strong Capstone compatibility</span>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Campus Events</span>
            <Calendar size={20} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {stats.upcomingEvents}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Next: Stanford AI Hackathon</span>
        </Card>
      </div>

      {/* Main Grid: Recommended Matches & Projects */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Left: AI Recommended Teammates */}
        <div>
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--color-accent)" /> AI Recommended Teammates
              </h2>
              <p className="section-subtitle">Based on your project's missing skills & interests</p>
            </div>
            <Link to="/find-teammates" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recommendedTeammates.map((item) => (
              <Card key={item.id} style={{ borderLeft: '4px solid var(--color-accent)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={item.student.avatar_url} alt={item.student.full_name} className="avatar" />
                    <div>
                      <h4 style={{ fontSize: '1rem' }}>{item.student.full_name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
                        {item.student.preferred_role}
                      </span>
                    </div>
                  </div>
                  <MatchScoreBadge score={item.match_score} size="sm" />
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  {item.match_reasons[0]}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {item.student.skills.map((s, i) => (
                      <span key={i} style={{ fontSize: '0.7rem', padding: '2px 6px', backgroundColor: 'var(--color-bg-subtle)', borderRadius: '4px' }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => showToast(`Invite sent to ${item.student.full_name}!`, 'success')}>
                    Invite
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: Active Projects & Skill Gap */}
        <div>
          <div className="section-header">
            <div>
              <h2 className="section-title" style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderGit2 size={18} color="var(--color-secondary)" /> My Active Projects
              </h2>
              <p className="section-subtitle">Teams you lead and collaborate with</p>
            </div>
            <Link to="/projects" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              Explore <ArrowRight size={14} style={{ display: 'inline', verticalAlign: 'middle' }} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {myProjects.map((proj) => (
              <Card key={proj.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <Badge variant="primary">{proj.category}</Badge>
                  <Badge variant={proj.status === 'Recruiting' ? 'success' : 'default'}>{proj.status}</Badge>
                </div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>{proj.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>Role: <strong>{proj.role}</strong></span>
                  <span>{proj.team_members_count}/{proj.max_team_size} Members</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Skill Gap Advisor Box */}
          <SkillGapAdvisor
            gaps={['Cloud Infrastructure (AWS/Docker)', 'UI Design Systems']}
            recommendations={[
              'MediVision requires 1 DevOps engineer to prepare for deployment testing.',
              'Search for candidates with Docker & Kubernetes in the Teammate Finder.'
            ]}
          />
        </div>
      </div>

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
};

export default Dashboard;
