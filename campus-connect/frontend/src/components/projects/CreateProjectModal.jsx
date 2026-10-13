import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { PROJECT_CATEGORIES } from '../../js/utils/constants';

export const CreateProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Web Development',
    max_team_size: 4,
    skills_input: '',
    github_repo: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    setSubmitting(true);
    try {
      const skills = formData.skills_input
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await onCreateProject({
        ...formData,
        max_team_size: parseInt(formData.max_team_size, 10),
        required_skills: skills
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Campus Project"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Publish Project</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Input
          label="Project Title"
          id="project-title"
          placeholder="e.g., Campus Pulse AI Analytics"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Input
          label="Tagline (Short Summary)"
          id="project-tagline"
          placeholder="e.g., Real-time dining hall sentiment and campus feedback"
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
        />

        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="project-category">Category</label>
            <select
              id="project-category"
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {PROJECT_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <Input
            label="Max Team Size"
            id="project-size"
            type="number"
            min="2"
            max="10"
            value={formData.max_team_size}
            onChange={(e) => setFormData({ ...formData, max_team_size: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-description">Detailed Description *</label>
          <textarea
            id="project-description"
            className="form-textarea"
            rows="3"
            placeholder="Describe the problem, current architecture, roadmap and role expectations..."
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <Input
          label="Required Skills (Comma separated)"
          id="project-skills"
          placeholder="e.g., React, FastAPI, PostgreSQL, UI/UX"
          hint="These skills are used by our AI engine to rank candidate recommendations."
          value={formData.skills_input}
          onChange={(e) => setFormData({ ...formData, skills_input: e.target.value })}
        />

        <Input
          label="GitHub Repository (Optional)"
          id="project-github"
          placeholder="https://github.com/org/project-repo"
          value={formData.github_repo}
          onChange={(e) => setFormData({ ...formData, github_repo: e.target.value })}
        />
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
