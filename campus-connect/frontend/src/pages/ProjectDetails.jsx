import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  GitBranch,
  Calendar,
  CheckCircle,
  XCircle,
  Sparkles,
  Send
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import JoinRequestModal from '../components/projects/JoinRequestModal';
import SkillGapAdvisor from '../components/students/SkillGapAdvisor';
import { useToast } from '../context/ToastContext';
import { getInitials } from '../js/utils/helpers';

export const ProjectDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const [project] = useState({
    id: Number(id) || 1,
    title: 'MediVision: Real-Time Diagnostic Assistance',
    category: 'AI & Machine Learning',
    status: 'Recruiting',
    max_team_size: 4,
    created_at: '2026-09-15',
    github_repo: 'https://github.com/stanford-med/medivision',
    tagline: 'Edge AI inference for pathology image segmentation and physician triage in clinical settings.',
    description: `MediVision is tackling the global shortage of anatomical pathologists by providing real-time, on-device AI segmentation for biopsy slide analysis. Most existing computer vision models require streaming gigabytes of gigapixel Whole Slide Images (WSI) to cloud GPUs, introducing immense latency and HIPAA compliance hurdles.

Our project builds a quantized neural network capable of executing on local edge workstations (NVIDIA Jetson / Apple Silicon) within 1.5 seconds per slide quadrant. We've collected over 5,000 anonymized training crops and are currently standardizing our REST APIs and annotation dashboard.`,
    required_skills: [
      { name: 'Python', level: 'Expert' },
      { name: 'FastAPI', level: 'Intermediate' },
      { name: 'PyTorch', level: 'Advanced' },
      { name: 'Computer Vision', level: 'Advanced' }
    ],
    members: [
      { id: 1, name: 'Alex Rivera', role: 'Project Lead / ML Engineer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', university: 'Stanford' },
      { id: 2, name: 'David Kim', role: 'Backend & Data Pipelines', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80', university: 'Stanford' }
    ]
  });

  const [requests, setRequests] = useState([
    {
      id: 201,
      name: 'Samantha Wu',
      university: 'UC Berkeley',
      role: 'Frontend & WebGL Developer',
      pitch: 'Hey Alex! I saw MediVision and love the mission. I built a Whole Slide Image viewer in React with OpenSeadragon last semester and would love to build your slide inspection UI.',
      status: 'Pending'
    }
  ]);

  const handleAccept = (reqId, name) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast(`Accepted ${name} into MediVision team!`, 'success');
  };

  const handleReject = (reqId, name) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    showToast(`Declined request from ${name}.`, 'info');
  };

  const handleJoinSubmit = (projectId, data) => {
    showToast('Your application pitch was submitted to the project lead!', 'success');
  };

  return (
    <div>
      <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <Badge variant="primary">{project.category}</Badge>
              <Badge variant={project.status === 'Recruiting' ? 'success' : 'default'}>{project.status}</Badge>
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--color-primary)' }}>{project.title}</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              {project.tagline}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {project.github_repo && (
              <a href={project.github_repo} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <GitBranch size={16} /> GitHub Repo
                </Button>
              </a>
            )}
            <Button variant="primary" onClick={() => setIsJoinOpen(true)}>
              <Send size={16} /> Apply to Join Team
            </Button>
          </div>
        </div>
      </div>

      <div className="grid-3">
        {/* Left 2 Cols: Description & Join Requests */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>About the Project</h3>
            <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
              {project.description}
            </div>
          </Card>

          {/* Pending Applications Box */}
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Pending Join Requests ({requests.length})</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Project Owner View</span>
            </div>

            {requests.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No pending applications currently.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {requests.map((req) => (
                  <div key={req.id} style={{
                    backgroundColor: 'var(--color-bg-main)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1.25rem',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <div>
                        <strong>{req.name}</strong> • <span style={{ color: 'var(--color-accent)' }}>{req.role}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{req.university}</div>
                      </div>
                      <Badge variant="warning">{req.status}</Badge>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: 1.5, marginBottom: '1rem' }}>
                      "{req.pitch}"
                    </p>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <Button variant="outline" size="sm" onClick={() => handleReject(req.id, req.name)}>
                        <XCircle size={14} /> Decline
                      </Button>
                      <Button variant="primary" size="sm" onClick={() => handleAccept(req.id, req.name)}>
                        <CheckCircle size={14} /> Accept into Team
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Col: Team Members & Skills & AI Advisor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={18} /> Current Team ({project.members.length}/{project.max_team_size})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {project.members.map((member) => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={member.avatar} alt={member.name} className="avatar" />
                  <div>
                    <h4 style={{ fontSize: '0.95rem' }}>{member.name}</h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>{member.role}</p>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>{member.university}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.75rem' }}>Required Tech Stack</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {project.required_skills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.75rem',
                    padding: '3px 9px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--color-accent-light)',
                    color: 'var(--color-accent-hover)',
                    fontWeight: 600
                  }}
                >
                  {skill.name} • {skill.level}
                </span>
              ))}
            </div>
          </Card>

          <SkillGapAdvisor
            gaps={['React / WebGL Viewer']}
            recommendations={[
              '1 open slot available for a frontend specialist to build microscopy viewers.',
              'Check AI Teammate Finder for students with JavaScript & UI/UX.'
            ]}
          />
        </div>
      </div>

      <JoinRequestModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        project={project}
        onSubmitRequest={handleJoinSubmit}
      />
    </div>
  );
};

export default ProjectDetails;
