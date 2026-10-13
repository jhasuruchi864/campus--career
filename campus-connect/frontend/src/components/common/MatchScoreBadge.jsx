import React from 'react';
import { Sparkles } from 'lucide-react';
import { getMatchScoreMeta } from '../../js/utils/helpers';

export const MatchScoreBadge = ({ score = 85, showLabel = true, size = 'md' }) => {
  const meta = getMatchScoreMeta(score);

  return (
    <div
      className={`match-score-badge ${meta.className}`}
      title={`AI Match Fit: ${score}%`}
      style={{
        fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
        padding: size === 'sm' ? '0.2rem 0.5rem' : '0.35rem 0.75rem'
      }}
    >
      <Sparkles size={size === 'sm' ? 12 : 14} style={{ color: meta.color }} />
      <span>{Math.round(score)}%</span>
      {showLabel && (
        <span style={{ opacity: 0.85, fontWeight: 500, marginLeft: 2 }}>
          • {meta.label}
        </span>
      )}
    </div>
  );
};

export default MatchScoreBadge;
