import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import SkillTag from '../components/students/SkillTag';
import { PROFICIENCY_LEVELS } from '../js/utils/constants';
import { Save, Plus, GraduationCap, GitBranch, Globe, Clock } from 'lucide-react';
import { getInitials } from '../js/utils/helpers';

export const Profile = () => {
  const { user, updateProfileState } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    full_name: user?.full_name || 'Alex Rivera',
    university: user?.university || 'Stanford University',
    major: user?.major || 'Computer Science & AI',
    graduation_year: user?.graduation_year || 2026,
    bio: user?.bio || 'Junior CS major passionate about autonomous systems, full-stack architectures, and ML teammate pairing.',
    preferred_role: user?.preferred_role || 'Full Stack / ML Engineer',
    availability_hours_per_week: user?.availability_hours_per_week || 15,
    github_url: user?.github_url || 'https://github.com/alexrivera',
    linkedin_url: user?.linkedin_url || 'https://linkedin.com/in/alexrivera',
    portfolio_url: user?.portfolio_url || 'https://alexrivera.dev'
  });

  const [skills, setSkills] = useState(user?.skills || [
    { name: 'React', level: 'Advanced' },
    { name: 'FastAPI', level: 'Advanced' },
    { name: 'Python', level: 'Expert' },
    { name: 'Machine Learning', level: 'Intermediate' }
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [saving, setSaving] = useState(false);

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    if (skills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      showToast('Skill is already added!', 'warning');
      return;
    }

    setSkills([...skills, { name: newSkillName.trim(), level: newSkillLevel }]);
    setNewSkillName('');
    showToast(`Added ${newSkillName.trim()} to your profile!`, 'success');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter((s) => s.name !== skillToRemove.name));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      updateProfileState({
        ...formData,
        skills
      });
      showToast('Profile updated successfully!', 'success');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h1 style={{ fontSize: '1.75rem' }}>Student Profile & Skills</h1>
          <p className="section-subtitle">
            Keep your skills, availability, and university details current to maximize match accuracy.
          </p>
        </div>
      </div>

      <div className="grid-3">
        {/* Left Col: Profile Preview Card */}
        <div>
          <Card style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="avatar avatar-lg"
                style={{ margin: '0 auto 1rem auto' }}
              />
            ) : (
              <div className="avatar avatar-lg" style={{ margin: '0 auto 1rem auto' }}>
                {getInitials(formData.full_name)}
              </div>
            )}

            <h3 style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{formData.full_name}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: 600, marginBottom: '0.5rem' }}>
              {formData.preferred_role}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
              <GraduationCap size={15} />
              <span>{formData.university} • {formData.graduation_year}</span>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-accent-light)',
              color: 'var(--color-accent-hover)',
              fontSize: '0.8rem',
              fontWeight: 600,
              marginBottom: '1.5rem'
            }}>
              <Clock size={14} />
              <span>{formData.availability_hours_per_week} hrs / week available</span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, textAlign: 'left', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
              {formData.bio}
            </p>
          </Card>
        </div>

        {/* Right 2 Cols: Form Editors */}
        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <Card>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Academic & Personal Details</h3>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="grid-2">
                <Input
                  label="Full Name"
                  id="profile-name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
                <Input
                  label="Preferred Role"
                  id="profile-role"
                  value={formData.preferred_role}
                  onChange={(e) => setFormData({ ...formData, preferred_role: e.target.value })}
                />
              </div>

              <div className="grid-3">
                <Input
                  label="University"
                  id="profile-uni"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                />
                <Input
                  label="Major"
                  id="profile-major"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
                <Input
                  label="Graduation Year"
                  id="profile-grad"
                  type="number"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData({ ...formData, graduation_year: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-bio">Bio & Background</label>
                <textarea
                  id="profile-bio"
                  className="form-textarea"
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                />
              </div>

              <div className="grid-3">
                <Input
                  label="GitHub URL"
                  id="profile-gh"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                />
                <Input
                  label="LinkedIn URL"
                  id="profile-li"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                />
                <Input
                  label="Portfolio URL"
                  id="profile-port"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <Button type="submit" variant="primary" loading={saving}>
                  <Save size={16} /> Save Changes
                </Button>
              </div>
            </form>
          </Card>

          {/* Skills Management Card */}
          <Card>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Technical & Domain Skills</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1.25rem' }}>
              These competencies form your embedding vector used by the AI matching engine.
            </p>

            {/* Current Skills list */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem', minHeight: 40 }}>
              {skills.map((skill, index) => (
                <SkillTag
                  key={index}
                  name={skill.name}
                  level={skill.level}
                  onRemove={() => handleRemoveSkill(skill)}
                />
              ))}
            </div>

            {/* Add Skill form */}
            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 200px' }}>
                <Input
                  label="Add Skill"
                  id="new-skill-name"
                  placeholder="e.g. Scikit-Learn, PyTorch, Docker"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>

              <div style={{ minWidth: 150 }}>
                <label className="form-label" htmlFor="new-skill-level">Proficiency</label>
                <select
                  id="new-skill-level"
                  className="form-select"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <Button type="submit" variant="outline" style={{ height: 42 }}>
                <Plus size={16} /> Add Skill
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
