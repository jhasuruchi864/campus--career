import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Users,
  GitBranch,
  Calendar,
  CheckCircle,
  XCircle,
  Sparkles,
  Send,
  Kanban,
  FileCode2,
  Award,
  Plus,
  Clock,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Star,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import JoinRequestModal from '../components/projects/JoinRequestModal';
import SkillGapAdvisor from '../components/students/SkillGapAdvisor';
import { useToast } from '../context/ToastContext';
import api from '../services/api';

export const ProjectDetails = () => {
  const { id } = useParams();
  const { addToast } = useToast();
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'kanban', 'resources', 'reviews'

  const [project] = useState({
    id: Number(id) || 1,
    title: 'MediVision: Real-Time Diagnostic Assistance',
    category: 'AI & Machine Learning',
    status: 'Recruiting',
    max_team_size: 4,
    created_at: '2026-09-15',
    github_repo: 'https://github.com/stanford-med/medivision',
    demo_url: 'https://medivision-demo.stanford.edu',
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

  // Kanban Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Setup PyTorch Edge Quantization Pipeline', description: 'Benchmark ONNX runtime vs TensorRT on Raspberry Pi 5', status: 'in_progress', priority: 'high', assignee_name: 'Alex Rivera' },
    { id: 2, title: 'Build FastAPI Microservice for Inference', description: 'REST endpoint accepting multipart image files with <50ms response', status: 'todo', priority: 'high', assignee_name: 'David Kim' },
    { id: 3, title: 'Prepare TreeHacks 3-Minute Pitch Video', description: 'Record live microscope slide segmentation demo with slide deck', status: 'review', priority: 'low', assignee_name: 'Alex Rivera' },
    { id: 4, title: 'Design Medical Triage UI in Figma', description: 'High-fidelity wireframes for clinician pathology dashboard', status: 'done', priority: 'medium', assignee_name: 'David Kim' }
  ]);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  // Shared Resources State
  const [resources, setResources] = useState([
    { id: 1, title: 'Figma Clinician Design System & Slide Viewer', type: 'Design', url: 'https://figma.com/@stanford/medivision', author: 'Alex Rivera' },
    { id: 2, title: 'Edge Quantization Benchmark Spreadsheet (CSV)', type: 'Data', url: 'https://docs.google.com/spreadsheets/d/medivision-bench', author: 'David Kim' },
    { id: 3, title: 'HIPAA Edge De-identification Protocol (PDF)', type: 'Docs', url: 'https://stanford.edu/med/compliance.pdf', author: 'Alex Rivera' }
  ]);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState('Docs');

  // Peer Reviews State
  const [reviews, setReviews] = useState([
    { id: 1, author: 'Dr. Katherine Sanders', role: 'Faculty Mentor (Pathology)', rating: 5, comment: 'Outstanding velocity on edge model quantization. The pipeline reproduces standard clinical accuracy within 2% margin.' },
    { id: 2, author: 'David Kim', role: 'Backend Engineer', rating: 5, comment: 'Alex is an exceptional team lead. Clear API specifications and daily milestone updates made backend integration seamless.' }
  ]);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);

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
    addToast(`Accepted ${name} into MediVision team!`, 'success');
  };

  const handleReject = (reqId, name) => {
    setRequests((prev) => prev.filter((r) => r.id !== reqId));
    addToast(`Declined request from ${name}.`, 'info');
  };

  const handleJoinSubmit = () => {
    addToast('Your application pitch was submitted to the project lead!', 'success');
  };

  // Move task status
  const moveTask = (taskId, nextStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
    addToast('Task status updated on Kanban board!', 'info');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const item = {
      id: Date.now(),
      title: newTaskTitle,
      description: newTaskDesc,
      priority: newTaskPriority,
      status: newTaskStatus,
      assignee_name: 'Alex Rivera'
    };
    setTasks((prev) => [item, ...prev]);
    setIsAddTaskOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    addToast('New task added to project sprint!', 'success');
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResUrl.trim()) return;
    setResources((prev) => [
      { id: Date.now(), title: newResTitle, url: newResUrl, type: newResType, author: 'Alex Rivera' },
      ...prev
    ]);
    setNewResTitle('');
    setNewResUrl('');
    addToast('Shared resource linked!', 'success');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;
    setReviews((prev) => [
      { id: Date.now(), author: 'Alex Rivera (Verified Teammate)', role: 'Project Member', rating: newReviewRating, comment: newReviewComment },
      ...prev
    ]);
    setNewReviewComment('');
    addToast('Peer review & skill endorsement posted!', 'success');
  };

  return (
    <div style={{ paddingBottom: '3rem' }}>
      <Link to="/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem', color: 'var(--color-text-muted)' }}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      {/* Hero Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
              <Badge variant="primary">{project.category}</Badge>
              <Badge variant={project.status === 'Recruiting' ? 'success' : 'default'}>{project.status}</Badge>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                <ShieldCheck size={14} /> Verified Working Project
              </span>
            </div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--color-primary)', margin: '0 0 0.25rem 0' }}>{project.title}</h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {project.tagline}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {project.github_repo && (
              <a href={project.github_repo} target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <GitBranch size={16} /> GitHub Repo
                </Button>
              </a>
            )}
            <Link to="/chat">
              <Button variant="outline">
                <MessageSquare size={16} /> Team Chat Room
              </Button>
            </Link>
            <Button variant="primary" onClick={() => setIsJoinOpen(true)}>
              <Send size={16} /> Apply to Join Team
            </Button>
          </div>
        </div>

        {/* Project Sub-navigation tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem', overflowX: 'auto' }}>
          <button
            onClick={() => setActiveTab('overview')}
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Users size={15} /> Overview & Applications
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`btn btn-sm ${activeTab === 'kanban' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Kanban size={15} /> Team Kanban Board ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`btn btn-sm ${activeTab === 'resources' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileCode2 size={15} /> Shared Resources ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`btn btn-sm ${activeTab === 'reviews' ? 'btn-primary' : 'btn-ghost'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Award size={15} /> Peer Reviews & Endorsements ({reviews.length})
          </button>
        </div>
      </div>

      {/* ===================== TAB 1: OVERVIEW & APPLICATIONS ===================== */}
      {activeTab === 'overview' && (
        <div className="grid-3">
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <Card>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>About the Project</h3>
              <div style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                {project.description}
              </div>
            </Card>

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
      )}

      {/* ===================== TAB 2: MINI KANBAN BOARD ===================== */}
      {activeTab === 'kanban' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
                Sprint Task Board
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>
                Track deliverables across To Do, In Progress, Review, and Completed columns.
              </p>
            </div>
            <button onClick={() => setIsAddTaskOpen(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Add Task
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', alignItems: 'flex-start' }}>
            {['todo', 'in_progress', 'review', 'done'].map((column) => {
              const columnTasks = tasks.filter((t) => t.status === column);
              const columnTitles = {
                todo: '📋 To Do',
                in_progress: '⚡ In Progress',
                review: '🔍 Code Review',
                done: '✅ Completed'
              };

              return (
                <div key={column} style={{ backgroundColor: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', minHeight: '380px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                      {columnTitles[column]}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.06)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                      {columnTasks.length}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {columnTasks.map((t) => (
                      <div key={t.id} className="card" style={{ padding: '1rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-xs)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                            backgroundColor: t.priority === 'high' ? 'var(--color-danger-bg)' : t.priority === 'medium' ? 'var(--color-warning-bg)' : 'var(--color-info-bg)',
                            color: t.priority === 'high' ? 'var(--color-danger)' : t.priority === 'medium' ? 'var(--color-warning)' : 'var(--color-info)'
                          }}>
                            {t.priority}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)' }}>
                            {t.assignee_name}
                          </span>
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)', marginBottom: '0.35rem' }}>
                          {t.title}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4, margin: '0 0 0.75rem 0' }}>
                          {t.description}
                        </p>

                        {/* Move task dropdown */}
                        <div style={{ display: 'flex', gap: '4px', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem' }}>
                          {column !== 'todo' && (
                            <button onClick={() => moveTask(t.id, 'todo')} className="btn btn-ghost btn-xs" style={{ fontSize: '0.65rem' }}>
                              To Do
                            </button>
                          )}
                          {column !== 'in_progress' && (
                            <button onClick={() => moveTask(t.id, 'in_progress')} className="btn btn-ghost btn-xs" style={{ fontSize: '0.65rem' }}>
                              In Progress
                            </button>
                          )}
                          {column !== 'review' && (
                            <button onClick={() => moveTask(t.id, 'review')} className="btn btn-ghost btn-xs" style={{ fontSize: '0.65rem' }}>
                              Review
                            </button>
                          )}
                          {column !== 'done' && (
                            <button onClick={() => moveTask(t.id, 'done')} className="btn btn-ghost btn-xs" style={{ fontSize: '0.65rem', color: 'var(--color-success)' }}>
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Task Modal */}
          {isAddTaskOpen && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <div className="card" style={{ width: '100%', maxWidth: '460px', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  Add Sprint Task
                </h3>
                <form onSubmit={handleAddTask}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Task Title</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Integrate WebGL microscope slider"
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Description</label>
                    <textarea
                      className="form-input"
                      rows={3}
                      value={newTaskDesc}
                      onChange={(e) => setNewTaskDesc(e.target.value)}
                      placeholder="Technical acceptance criteria..."
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Priority</label>
                      <select className="form-input" value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Column</label>
                      <select className="form-input" value={newTaskStatus} onChange={(e) => setNewTaskStatus(e.target.value)}>
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setIsAddTaskOpen(false)} className="btn btn-outline btn-sm">Cancel</button>
                    <button type="submit" className="btn btn-primary btn-sm">Create Task</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: SHARED RESOURCES ===================== */}
      {activeTab === 'resources' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Shared Workspace Links & Code Snippets
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resources.map((res) => (
                  <div key={res.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                        {res.type} • Shared by {res.author}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-primary)', margin: '4px 0 0 0' }}>
                        {res.title}
                      </h4>
                    </div>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      Open <ExternalLink size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                Share Link or Resource
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
                Post Figma boards, GitHub PRs, Google Docs, or Colab notebooks with the squad.
              </p>
              <form onSubmit={handleAddResource}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Resource Title</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    value={newResTitle}
                    onChange={(e) => setNewResTitle(e.target.value)}
                    placeholder="e.g. Model inference benchmark charts"
                  />
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>URL / Web Link</label>
                  <input
                    type="url"
                    className="form-input"
                    required
                    value={newResUrl}
                    onChange={(e) => setNewResUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Type</label>
                  <select className="form-input" value={newResType} onChange={(e) => setNewResType(e.target.value)}>
                    <option value="Design">Design (Figma / UI)</option>
                    <option value="Docs">Documentation / Spec</option>
                    <option value="Data">Data & Benchmarks</option>
                    <option value="Code">GitHub PR / Repo</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                  Post to Team Workspace
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 4: PEER REVIEWS & ENDORSEMENTS ===================== */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
              Proof-of-Work & Verified Peer Endorsements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {reviews.map((rev) => (
                <div key={rev.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-primary)' }}>{rev.author}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '6px' }}>• {rev.role}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.5, margin: 0 }}>
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
              Write Peer Recommendation
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Completed milestone deliverables? Leave an endorsement for your team members to build their campus reputation badge.
            </p>
            <form onSubmit={handleAddReview}>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Rating</label>
                <select className="form-input" value={newReviewRating} onChange={(e) => setNewReviewRating(Number(e.target.value))}>
                  <option value={5}>5 Stars - Exceptional Contribution</option>
                  <option value={4}>4 Stars - Solid Teammate</option>
                  <option value={3}>3 Stars - Met Expectations</option>
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Endorsement Comment</label>
                <textarea
                  className="form-input"
                  rows={4}
                  required
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="Describe your peer's technical contribution and collaboration..."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
                Submit Verified Recommendation
              </button>
            </form>
          </div>
        </div>
      )}

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
