import React from 'react';
import { Users, ArrowUpRight, GitBranch } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Link } from 'react-router-dom';

export const ProjectCard = ({ project, onJoinClick }) => {
  const isFull = (project.team_members_count || 1) >= (project.max_team_size || 4);

  return (
    <Card interactive className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="card-header" style={{ marginBottom: '0.75rem' }}>
        <Badge variant="primary">{project.category}</Badge>
        <Badge variant={project.status === 'Recruiting' ? 'success' : 'default'}>
          {project.status}
        </Badge>
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: 'var(--color-primary)' }}>
          {project.title}
        </h3>
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          marginBottom: '1rem',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {project.tagline || project.description}
        </p>

        {/* Required Skills */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-subtle)', textTransform: 'uppercase' }}>
            Seeking Skills:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {project.required_skills?.map((skill, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-accent-light)',
                  color: 'var(--color-accent-hover)',
                  fontWeight: 500
                }}
              >
                {typeof skill === 'string' ? skill : skill.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="card-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.875rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          <Users size={16} />
          <span>
            {project.team_members_count || 1} / {project.max_team_size || 4} Members
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/projects/${project.id}`}>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </Link>
          {onJoinClick && !isFull && (
            <Button variant="primary" size="sm" onClick={() => onJoinClick(project)}>
              Apply <ArrowUpRight size={14} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;
