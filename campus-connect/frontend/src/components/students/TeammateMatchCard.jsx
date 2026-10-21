import React, { useState } from 'react';
import Card from '../common/Card';
import MatchScoreBadge from '../common/MatchScoreBadge';
import Button from '../common/Button';
import { getInitials } from '../../js/utils/helpers';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, UserPlus } from 'lucide-react';

export const TeammateMatchCard = ({ match, onInvite }) => {
  const [expanded, setExpanded] = useState(false);
  const { student, match_score = 85, score_breakdown, match_reasons = [] } = match;

  return (
    <Card className="animate-fade-in" style={{
      border: '1px solid rgba(13, 148, 136, 0.25)',
      boxShadow: '0 4px 14px rgba(13, 148, 136, 0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {student.avatar_url ? (
            <img src={student.avatar_url} alt={student.full_name} className="avatar avatar-lg" />
          ) : (
            <div className="avatar avatar-lg">
              {getInitials(student.full_name)}
            </div>
          )}
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--color-primary)' }}>{student.full_name}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: 600 }}>
              {student.preferred_role || 'Candidate Collaborator'}
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {student.university} • Class of {student.graduation_year || 2026}
            </span>
          </div>
        </div>

        <MatchScoreBadge score={match_score} />
      </div>

      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.45 }}>
        {student.bio || 'Motivated student builder ready to join active teams.'}
      </p>

      {/* Primary Matching Reasons (Explainable AI) */}
      <div style={{
        backgroundColor: 'var(--color-accent-light)',
        borderRadius: 'var(--radius-sm)',
        padding: '0.75rem 1rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Sparkles size={14} color="var(--color-accent-hover)" />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-hover)', textTransform: 'uppercase' }}>
            Why This Candidate Matches:
          </span>
        </div>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {match_reasons.slice(0, 3).map((reason, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--color-primary-dark)' }}>
              <CheckCircle2 size={13} color="var(--color-accent)" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expandable Breakdown Details */}
      {score_breakdown && (
        <div style={{ marginBottom: '1rem' }}>
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Hide Score Breakdown' : 'View Explainable Score Breakdown'}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: 'var(--color-text-muted)',
              cursor: 'pointer'
            }}
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            <span>{expanded ? 'Hide Score Breakdown' : 'View Explainable Score Breakdown'}</span>
          </button>

          {expanded && (
            <div style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-bg-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Skill Overlap Score:</span>
                <strong>{Math.round(score_breakdown.skill_score || 0)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Domain & Interest Alignment:</span>
                <strong>{Math.round(score_breakdown.interest_score || 0)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Role & Availability Compatibility:</span>
                <strong>{Math.round(score_breakdown.role_score || 0)}%</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Overlapping Candidate Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '1.25rem' }}>
        {student.skills?.map((skill, index) => (
          <span
            key={index}
            style={{
              fontSize: '0.75rem',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: '#ffffff',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-main)',
              fontWeight: 500
            }}
          >
            {typeof skill === 'string' ? skill : skill.name}
          </span>
        ))}
      </div>

      <div className="card-footer" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.875rem' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          Available: {student.availability_hours_per_week || 10}h / week
        </span>
        {onInvite && (
          <Button variant="primary" size="sm" onClick={() => onInvite(match)}>
            <UserPlus size={14} /> Invite to Team
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TeammateMatchCard;
