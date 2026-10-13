import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getInitials } from '../../js/utils/helpers';
import { Mail, GraduationCap, Clock } from 'lucide-react';

export const StudentCard = ({ student, onConnect }) => {
  return (
    <Card className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        {student.avatar_url ? (
          <img src={student.avatar_url} alt={student.full_name} className="avatar avatar-lg" />
        ) : (
          <div className="avatar avatar-lg">
            {getInitials(student.full_name)}
          </div>
        )}
        <div>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}>{student.full_name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)', fontWeight: 600 }}>
            {student.preferred_role || 'Student Collaborator'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            <GraduationCap size={14} />
            <span>{student.university || 'University'} • {student.graduation_year || 2026}</span>
          </div>
        </div>
      </div>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--color-text-muted)',
        marginBottom: '1rem',
        lineHeight: 1.4,
        flex: 1
      }}>
        {student.bio || 'Student actively looking for innovative team collaborations.'}
      </p>

      {/* Skills list */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {student.skills?.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              style={{
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-bg-subtle)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-border)'
              }}
            >
              {typeof skill === 'string' ? skill : skill.name}
            </span>
          ))}
          {student.skills?.length > 5 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-subtle)', alignSelf: 'center' }}>
              +{student.skills.length - 5} more
            </span>
          )}
        </div>
      </div>

      <div className="card-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          <Clock size={13} />
          <span>{student.availability_hours_per_week || 10}h / week</span>
        </div>
        {onConnect && (
          <Button variant="outline" size="sm" onClick={() => onConnect(student)}>
            <Mail size={14} /> Connect
          </Button>
        )}
      </div>
    </Card>
  );
};

export default StudentCard;
