import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  Users,
  Lightbulb,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';

export const AiHub = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('resume');

  // Resume ATS Analyzer State
  const [resumeText, setResumeText] = useState(
    `Alex Rivera\nJunior Computer Science student at Stanford University\n\nEXPERIENCE:\n- Engineered low-latency distributed microservices in FastAPI and Python handling 10,000+ daily requests.\n- Developed responsive frontend applications in React, TypeScript, and Tailwind CSS, increasing user engagement by 40%.\n- Implemented edge computer vision inference pipelines utilizing PyTorch, OpenCV, and ONNX Runtime.\n- Architected PostgreSQL relational schemas and deployed Docker containerized services on AWS ECS.`
  );
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult, setAtsResult] = useState(null);

  // Hackathon Team Builder State
  const [hackathonTheme, setHackathonTheme] = useState('Autonomous AI & Healthcare Diagnostics');
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamResult, setTeamResult] = useState(null);

  // Project Generator State
  const [projectDomain, setProjectDomain] = useState('fintech');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [genLoading, setGenLoading] = useState(false);
  const [genResult, setGenResult] = useState(null);

  // Mock Interview State
  const [interviewSkill, setInterviewSkill] = useState('react');
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewResult, setInterviewResult] = useState(null);
  const [revealedHints, setRevealedHints] = useState({});
  const [revealedAnswers, setRevealedAnswers] = useState({});

  // 1. Analyze Resume
  const handleAnalyzeResume = async () => {
    if (!resumeText.trim() || resumeText.length < 20) {
      addToast('Please enter at least 20 characters of resume text.', 'warning');
      return;
    }
    setAtsLoading(true);
    try {
      const data = await api.post('/ai/resume-analyzer', { resume_text: resumeText });
      setAtsResult(data);
      addToast('Resume ATS analysis generated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to analyze resume.', 'error');
    } finally {
      setAtsLoading(false);
    }
  };

  // 2. Build Team
  const handleBuildTeam = async () => {
    setTeamLoading(true);
    try {
      const data = await api.post('/ai/hackathon-team-builder', { theme: hackathonTheme });
      setTeamResult(data);
      addToast('AI Hackathon Squad synthesized!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate team.', 'error');
    } finally {
      setTeamLoading(false);
    }
  };

  // 3. Generate Project
  const handleGenerateProject = async () => {
    setGenLoading(true);
    try {
      const data = await api.post('/ai/project-generator', { domain: projectDomain, difficulty });
      setGenResult(data);
      addToast('New capstone specification synthesized!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate project.', 'error');
    } finally {
      setGenLoading(false);
    }
  };

  // 4. Generate Interview
  const handleGenerateInterview = async () => {
    setInterviewLoading(true);
    try {
      const data = await api.post('/ai/mock-interview', { skill: interviewSkill });
      setInterviewResult(data);
      setRevealedHints({});
      setRevealedAnswers({});
      addToast(`Generated mock interview for ${interviewSkill.toUpperCase()}`, 'success');
    } catch (err) {
      addToast(err.message || 'Failed to generate interview questions.', 'error');
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--color-accent-light)', padding: '4px 12px', borderRadius: 'var(--radius-full)', color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.5rem' }}>
          <Sparkles size={14} /> Campus Intelligence Suite
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-primary)', margin: '0 0 0.5rem 0' }}>
          AI Career & Collaboration Hub
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '750px' }}>
          Accelerate your collegiate journey with industry-grade AI tools: score your resume against ATS benchmarks, build balanced hackathon dream teams, draft capstone specs, and practice technical interview questions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setActiveTab('resume')}
          className={`btn btn-sm ${activeTab === 'resume' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <FileText size={16} /> ATS Resume Scanner
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={`btn btn-sm ${activeTab === 'team' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Users size={16} /> Hackathon Team Builder
        </button>
        <button
          onClick={() => setActiveTab('project')}
          className={`btn btn-sm ${activeTab === 'project' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Lightbulb size={16} /> Project Idea & Roadmap
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`btn btn-sm ${activeTab === 'interview' ? 'btn-primary' : 'btn-ghost'}`}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <HelpCircle size={16} /> AI Mock Interviewer
        </button>
      </div>

      {/* ===================== TAB 1: ATS RESUME SCANNER ===================== */}
      {activeTab === 'resume' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="var(--color-accent)" /> Paste Resume Content
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Paste your raw bullet points or PDF text. Our NLP engine will extract tech skills, check metric quantifications, and score ATS compliance.
            </p>
            <textarea
              className="form-input"
              rows={11}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your education, skills, and project experience here..."
              style={{ fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', width: '100%', marginBottom: '1rem' }}
            />
            <button
              onClick={handleAnalyzeResume}
              disabled={atsLoading}
              className="btn btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {atsLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {atsLoading ? 'Analyzing Resume...' : 'Analyze ATS Score & Match Projects'}
            </button>
          </div>

          <div>
            {atsResult ? (
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700 }}>Overall ATS Compatibility</span>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: atsResult.ats_score >= 80 ? 'var(--color-success)' : 'var(--color-warning)', margin: 0 }}>
                      {atsResult.ats_score}<span style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)' }}>/100</span>
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: atsResult.ats_score >= 80 ? 'var(--color-success-bg)' : 'var(--color-warning-bg)',
                      color: atsResult.ats_score >= 80 ? 'var(--color-success)' : 'var(--color-warning)',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}>
                      {atsResult.grade}
                    </span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Keyword Density</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{atsResult.breakdown.keywords} / 30 pts</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Quantified Metrics</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{atsResult.breakdown.metrics} / 25 pts</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tech Stack Breadth</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{atsResult.breakdown.tech_breadth} / 25 pts</div>
                  </div>
                  <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Action Verbs</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{atsResult.breakdown.formatting_and_action_verbs} / 20 pts</div>
                  </div>
                </div>

                {/* Identified Skills */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>Detected Technical Skills ({atsResult.detected_skills.length})</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {atsResult.detected_skills.map((s, idx) => (
                      <span key={idx} style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Strengths & Improvements */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--color-success)' }}>Strengths</h4>
                  {atsResult.strengths.map((str, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                      <CheckCircle2 size={14} color="var(--color-success)" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{str}</span>
                    </div>
                  ))}

                  {atsResult.actionable_improvements.length > 0 && (
                    <>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.75rem', marginBottom: '0.4rem', color: 'var(--color-warning)' }}>Actionable Improvements</h4>
                      {atsResult.actionable_improvements.map((imp, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-main)', marginBottom: '4px' }}>
                          <AlertTriangle size={14} color="var(--color-warning)" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <span>{imp}</span>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Recommended Matching Projects */}
                {atsResult.recommended_projects?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Recommended Campus Capstones</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {atsResult.recommended_projects.map((p) => (
                        <Link
                          key={p.id}
                          to={`/projects/${p.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0.75rem',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            color: 'inherit'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--color-primary)' }}>{p.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{p.category}</div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-accent)' }}>{p.fit_percentage}% Fit</span>
                            <ChevronRight size={16} color="var(--color-text-subtle)" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                <Sparkles size={40} color="var(--color-accent)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>No Analysis Generated Yet</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '340px', margin: '0 auto' }}>
                  Click "Analyze ATS Score" on the left to see your full compatibility report, identified skills, and project matches.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== TAB 2: HACKATHON TEAM BUILDER ===================== */}
      {activeTab === 'team' && (
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--color-accent)" /> Hackathon Squad Synthesizer
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Enter the theme of an upcoming hackathon (e.g. Stanford TreeHacks, CalHacks). Our algorithmic match engine will assemble a balanced dream team covering Architecture, AI/ML, Frontend, and Product UI/UX.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1, minWidth: '280px' }}
                value={hackathonTheme}
                onChange={(e) => setHackathonTheme(e.target.value)}
                placeholder="Enter hackathon theme e.g. Generative AI, Spatial Computing, FinTech..."
              />
              <button
                onClick={handleBuildTeam}
                disabled={teamLoading}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {teamLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {teamLoading ? 'Assembling Squad...' : '1-Click Auto-Build Team'}
              </button>
            </div>
          </div>

          {teamResult && (
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 700, textTransform: 'uppercase' }}>Balanced Dream Squad</div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>{teamResult.theme}</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'var(--color-bg-subtle)', padding: '8px 16px', borderRadius: 'var(--radius-full)' }}>
                  <TrendingUp size={18} color="var(--color-success)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                    Team Synergy Score: <span style={{ color: 'var(--color-success)' }}>{teamResult.team_synergy_score}%</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {teamResult.squad.map((member, idx) => (
                  <div key={idx} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--color-bg-surface)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                      {member.assigned_role}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
                      <img
                        src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={member.full_name}
                        style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{member.full_name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{member.university}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {member.top_skills.map((sk, sidx) => (
                        <span key={sidx} style={{ backgroundColor: 'var(--color-bg-subtle)', color: 'var(--color-text-main)', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: 'var(--color-accent-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                  <strong>Synergy Rationale:</strong> {teamResult.rationale}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 3: PROJECT IDEA & ROADMAP ===================== */}
      {activeTab === 'project' && (
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={18} color="var(--color-accent)" /> Capstone Idea & Architecture Generator
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Select a domain and target difficulty. The AI will output an innovative project title, system architecture diagram specification, required roles, and a 4-week execution roadmap.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                className="form-input"
                style={{ width: 'auto', minWidth: '180px' }}
                value={projectDomain}
                onChange={(e) => setProjectDomain(e.target.value)}
              >
                <option value="fintech">Fintech & Payments</option>
                <option value="healthtech">Healthcare & Telemetry</option>
                <option value="ai agents">Multi-Agent AI Systems</option>
                <option value="education">EdTech & Collaborative Learning</option>
                <option value="cleantech">Climate & Renewable Energy</option>
              </select>

              <select
                className="form-input"
                style={{ width: 'auto', minWidth: '140px' }}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced (Production)</option>
              </select>

              <button
                onClick={handleGenerateProject}
                disabled={genLoading}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {genLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {genLoading ? 'Synthesizing...' : 'Generate Project Specification'}
              </button>
            </div>
          </div>

          {genResult && (
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <span style={{ backgroundColor: 'var(--color-accent-light)', color: 'var(--color-accent)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {projectDomain.toUpperCase()} CAPSTONE
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '0.5rem', marginBottom: '0.25rem' }}>
                  {genResult.title}
                </h2>
                <p style={{ fontSize: '1rem', color: 'var(--color-accent)', fontWeight: 600 }}>{genResult.tagline}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>{genResult.problem}</p>
              </div>

              {/* Architecture & Tech Stack */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} color="var(--color-accent)" /> System Architecture
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', margin: 0, lineHeight: 1.5 }}>
                    {genResult.architecture}
                  </p>
                </div>
                <div style={{ backgroundColor: 'var(--color-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} color="var(--color-secondary)" /> Recommended Tech Stack
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {genResult.recommended_stack.map((t, idx) => (
                      <span key={idx} style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4-Week Milestone Roadmap */}
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  4-Week Execution Roadmap
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  {genResult.roadmap.map((step) => (
                    <div key={step.week} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', padding: '1rem', backgroundColor: 'var(--color-bg-surface)' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-accent)', marginBottom: '0.25rem' }}>
                        WEEK {step.week}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', margin: 0 }}>
                        {step.goal}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================== TAB 4: MOCK INTERVIEW & QUIZ ===================== */}
      {activeTab === 'interview' && (
        <div>
          <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={18} color="var(--color-accent)" /> Technical Mock Interviewer & Quiz
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              Choose a technology stack. The AI will generate authentic technical interview questions asked at top firms (Google, Stripe, OpenAI), with progressive hints and model answers.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                className="form-input"
                style={{ width: 'auto', minWidth: '180px' }}
                value={interviewSkill}
                onChange={(e) => setInterviewSkill(e.target.value)}
              >
                <option value="react">React & Frontend Internals</option>
                <option value="python">Python & CPython Concurrency</option>
                <option value="fastapi">FastAPI & Async Architectures</option>
                <option value="machine learning">Machine Learning & Transformers</option>
                <option value="system design">System Design & Databases</option>
              </select>

              <button
                onClick={handleGenerateInterview}
                disabled={interviewLoading}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {interviewLoading ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {interviewLoading ? 'Generating Questions...' : 'Start Mock Practice Round'}
              </button>
            </div>
          </div>

          {interviewResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ backgroundColor: 'var(--color-accent-light)', padding: '1rem', borderRadius: 'var(--radius-sm)', color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 500 }}>
                💡 <strong>Placement Tip:</strong> {interviewResult.prep_tip}
              </div>

              {interviewResult.questions.map((q, qidx) => (
                <div key={qidx} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-accent)' }}>
                      QUESTION {qidx + 1} • {q.category}
                    </span>
                    <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--color-bg-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                    {q.question}
                  </h3>

                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setRevealedHints((prev) => ({ ...prev, [qidx]: !prev[qidx] }))}
                    >
                      {revealedHints[qidx] ? 'Hide Hint' : 'Show Architectural Hint'}
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setRevealedAnswers((prev) => ({ ...prev, [qidx]: !prev[qidx] }))}
                    >
                      {revealedAnswers[qidx] ? 'Hide Model Answer' : 'Reveal Expected Answer'}
                    </button>
                  </div>

                  {revealedHints[qidx] && (
                    <div style={{ backgroundColor: 'var(--color-warning-bg)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#78350f' }}>
                      <strong>Hint:</strong> {q.hint}
                    </div>
                  )}

                  {revealedAnswers[qidx] && (
                    <div style={{ backgroundColor: 'var(--color-bg-subtle)', borderLeft: '3px solid var(--color-accent)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                      <strong>Model Answer:</strong> {q.expected_answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiHub;
