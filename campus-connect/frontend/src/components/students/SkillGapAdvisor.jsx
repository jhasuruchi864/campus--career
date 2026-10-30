import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { AlertCircle, Lightbulb, Compass } from 'lucide-react';

export const SkillGapAdvisor = ({ gaps = [], recommendations = [] }) => {
  if (!gaps.length && !recommendations.length) return null;

  return (
    <Card style={{ backgroundColor: 'var(--color-bg-surface)', borderLeft: '4px solid var(--color-warning)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
        <Lightbulb size={20} color="var(--color-warning)" />
        <h4 style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
          AI Skill-Gap & Team Composition Insights
        </h4>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '1rem' }}>
        Based on your current roster and project milestones, our AI detected critical skill gaps that could impact velocity.
      </p>

      {gaps.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase' }}>
            Unfilled Competencies:
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
            {gaps.map((skill, idx) => (
              <Badge key={idx} variant="warning">
                <AlertCircle size={12} /> {typeof skill === 'string' ? skill : skill.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-accent-hover)', textTransform: 'uppercase' }}>
            Recommended Next Actions:
          </span>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
            {recommendations.map((rec, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--color-text-main)' }}>
                <Compass size={14} color="var(--color-accent)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default SkillGapAdvisor;
