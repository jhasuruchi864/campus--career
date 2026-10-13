import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ProjectFilter from '../components/projects/ProjectFilter';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import JoinRequestModal from '../components/projects/JoinRequestModal';
import Button from '../components/common/Button';
import { useToast } from '../context/ToastContext';

const INITIAL_PROJECTS = [
  {
    id: 1,
    title: 'MediVision: Real-Time Diagnostic Assistance',
    tagline: 'Edge AI inference for pathology image segmentation and physician triage in clinical settings.',
    description: 'We are engineering an offline-first computer vision pipeline that runs on lightweight edge devices to analyze microscopy slides. Seeking backend and ML students.',
    category: 'AI & Machine Learning',
    status: 'Recruiting',
    max_team_size: 4,
    team_members_count: 2,
    required_skills: ['Python', 'FastAPI', 'PyTorch', 'Computer Vision']
  },
  {
    id: 2,
    title: 'EcoCampus: University Zero-Waste Tracking',
    tagline: 'Student IoT weigh-scales and automated dining hall diversion analytics dashboard.',
    description: 'Connecting campus cafeteria scales via MQTT to a live React analytics dashboard to reduce food waste by 35% across dorm dining facilities.',
    category: 'Web Development',
    status: 'In Progress',
    max_team_size: 4,
    team_members_count: 3,
    required_skills: ['React', 'PostgreSQL', 'Node.js', 'UI/UX Design']
  },
  {
    id: 3,
    title: 'StudySync: Collaborative Peer Scheduling AI',
    tagline: 'Autonomous calendar negotiation and study cohort formation using NLP.',
    description: 'A mobile & web tool that aggregates students course syllabi, exam deadlines, and study preferences to auto-assemble balanced study groups.',
    category: 'Mobile Apps',
    status: 'Recruiting',
    max_team_size: 3,
    team_members_count: 1,
    required_skills: ['React Native', 'FastAPI', 'Natural Language Processing']
  },
  {
    id: 4,
    title: 'SolarGrid: Microgrid IoT Telemetry Monitor',
    tagline: 'ESP32 sensor mesh reporting solar rooftop battery state of health in real-time.',
    description: 'Building an embedded telemetry broker that streams battery temperature and voltage drops to a centralized telemetry server.',
    category: 'Hardware & IoT',
    status: 'Recruiting',
    max_team_size: 5,
    team_members_count: 2,
    required_skills: ['C++', 'Python', 'MQTT', 'Docker']
  }
];

export const Projects = () => {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const { showToast } = useToast();

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.required_skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = category === 'All' || p.category === category;
    const matchesStatus = !status || p.status === status;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateProject = (newProj) => {
    const created = {
      ...newProj,
      id: Date.now(),
      team_members_count: 1,
      status: 'Recruiting'
    };
    setProjects([created, ...projects]);
    showToast(`Project "${created.title}" successfully launched!`, 'success');
  };

  const handleOpenJoin = (project) => {
    setSelectedProject(project);
    setIsJoinOpen(true);
  };

  const handleSubmitJoin = (projectId, pitchData) => {
    showToast(`Application submitted to ${selectedProject?.title}! The owner will review your pitch.`, 'success');
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Explore Campus Projects</h1>
          <p className="section-subtitle">
            Find innovative capstones, hackathon teams, and faculty research projects looking for members.
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> Create Project
        </Button>
      </div>

      <ProjectFilter
        search={search}
        onSearchChange={setSearch}
        category={category}
        onCategoryChange={setCategory}
        status={status}
        onStatusChange={setStatus}
      />

      {filteredProjects.length === 0 ? (
        <div className="empty-state">
          <h3 className="empty-state-title">No projects found</h3>
          <p className="empty-state-desc">Try loosening your search query or switching categories.</p>
          <Button variant="outline" onClick={() => { setSearch(''); setCategory('All'); setStatus(''); }}>
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid-2">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onJoinClick={handleOpenJoin}
            />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <JoinRequestModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        project={selectedProject}
        onSubmitRequest={handleSubmitJoin}
      />
    </div>
  );
};

export default Projects;
