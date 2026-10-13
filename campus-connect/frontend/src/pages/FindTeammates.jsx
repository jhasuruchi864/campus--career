import React, { useState } from 'react';
import { Sparkles, Filter, Search, UserCheck } from 'lucide-react';
import TeammateMatchCard from '../components/students/TeammateMatchCard';
import SkillGapAdvisor from '../components/students/SkillGapAdvisor';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

const CANDIDATE_MATCHES = [
  {
    id: 101,
    student: {
      id: 21,
      full_name: 'Elena Rostova',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      university: 'Stanford University',
      graduation_year: 2026,
      preferred_role: 'Computer Vision & Deep Learning Engineer',
      bio: 'Graduate researcher in medical imaging. Built high-accuracy segmentation pipelines using PyTorch, OpenCV, and TorchScript.',
      availability_hours_per_week: 16,
      skills: ['PyTorch', 'Computer Vision', 'Python', 'OpenCV', 'CUDA']
    },
    match_score: 96,
    score_breakdown: {
      skill_score: 98,
      interest_score: 94,
      role_score: 95
    },
    match_reasons: [
      'Matches requested Python and Computer Vision requirements exactly',
      'High overlap in biomedical AI research interest domain',
      'Proven commitment capacity: 16 hours/week aligned with project timeline'
    ]
  },
  {
    id: 102,
    student: {
      id: 22,
      full_name: 'Marcus Chen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      university: 'UC Berkeley',
      graduation_year: 2025,
      preferred_role: 'Lead UI/UX & Design Systems',
      bio: 'Design major with hands-on frontend knowledge. Specialized in clean SaaS ergonomics, accessibility WCAG AA, and design tokens.',
      availability_hours_per_week: 12,
      skills: ['Figma', 'UI/UX Design', 'React', 'CSS Architecture']
    },
    match_score: 89,
    score_breakdown: {
      skill_score: 85,
      interest_score: 92,
      role_score: 90
    },
    match_reasons: [
      'Addresses critical frontend & user interface gap in project roster',
      'Complementary cross-functional background for multidisciplinary teams',
      'Extensive design system portfolio verified on GitHub/Figma'
    ]
  },
  {
    id: 103,
    student: {
      id: 23,
      full_name: 'Aisha Patel',
      avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      university: 'Stanford University',
      graduation_year: 2026,
      preferred_role: 'Cloud Architect & DevOps',
      bio: 'Passionate about containerized microservices, CI/CD GitHub Actions, PostgreSQL performance tuning, and FastAPI deployments.',
      availability_hours_per_week: 14,
      skills: ['Docker', 'FastAPI', 'PostgreSQL', 'AWS', 'Linux']
    },
    match_score: 84,
    score_breakdown: {
      skill_score: 82,
      interest_score: 85,
      role_score: 86
    },
    match_reasons: [
      'Strong FastAPI and PostgreSQL overlap with backend stack',
      'Brings enterprise-grade DevOps automation experience'
    ]
  },
  {
    id: 104,
    student: {
      id: 24,
      full_name: 'Leo Tanaka',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
      university: 'San Jose State University',
      graduation_year: 2026,
      preferred_role: 'Full Stack Web Developer',
      bio: 'Junior CS student passionate about building rapid prototypes with React, Tailwind, and Node.js.',
      availability_hours_per_week: 10,
      skills: ['React', 'JavaScript', 'Node.js', 'HTML/CSS']
    },
    match_score: 72,
    score_breakdown: {
      skill_score: 70,
      interest_score: 75,
      role_score: 72
    },
    match_reasons: [
      'Solid web development fundamentals',
      'Ready to assist with client-side state and responsive views'
    ]
  }
];

export const FindTeammates = () => {
  const [selectedProject, setSelectedProject] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [matches, setMatches] = useState(CANDIDATE_MATCHES);
  const { showToast } = useToast();

  const filteredMatches = matches.filter((m) => {
    const student = m.student;
    const query = searchQuery.toLowerCase();
    const nameMatch = student.full_name.toLowerCase().includes(query);
    const roleMatch = (student.preferred_role || '').toLowerCase().includes(query);
    const skillMatch = student.skills.some((s) => s.toLowerCase().includes(query));
    return nameMatch || roleMatch || skillMatch;
  });

  const handleInvite = (match) => {
    showToast(`Team invitation sent to ${match.student.full_name}! They will be notified via campus email.`, 'success');
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Sparkles size={24} color="var(--color-accent)" /> AI Teammate Discovery Engine
          </h1>
          <p className="section-subtitle">
            Ranked candidate suggestions calculated using TF-IDF skill cosine distance and complementary role optimization.
          </p>
        </div>
      </div>

      {/* Control bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: '#ffffff',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 260 }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Target Project:
          </span>
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{ width: 'auto', flex: 1 }}
          >
            <option value="1">MediVision (AI Diagnostic)</option>
            <option value="2">EcoCampus (Zero-Waste IoT)</option>
            <option value="3">StudySync (Cohort Scheduling)</option>
          </select>
        </div>

        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Filter candidates by skill (e.g. PyTorch, UI/UX)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>
      </div>

      {/* Skill Gap Advice Bar */}
      <div style={{ marginBottom: '1.75rem' }}>
        <SkillGapAdvisor
          gaps={['PyTorch & Computer Vision (High Priority)', 'Figma UI/UX Design']}
          recommendations={[
            'Top match Elena Rostova holds 96% compatibility for MediVision vision models.',
            'Adding a UX specialist will fulfill project rubric requirement for accessible user studies.'
          ]}
        />
      </div>

      {/* Grid of Teammates */}
      <div className="grid-2">
        {filteredMatches.map((match) => (
          <TeammateMatchCard
            key={match.id}
            match={match}
            onInvite={handleInvite}
          />
        ))}
      </div>
    </div>
  );
};

export default FindTeammates;
