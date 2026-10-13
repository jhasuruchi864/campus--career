/**
 * Extracts initials from a user's full name
 * @param {string} name 
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return 'CC';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Formats a date string to readable format
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Formats date and time
 * @param {string|Date} dateString 
 * @returns {string}
 */
export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Returns classname and label corresponding to a match score percentage (0 - 100)
 * @param {number} score 
 */
export function getMatchScoreMeta(score) {
  const num = Math.round(score);
  if (num >= 80) {
    return { className: 'match-high', label: 'Strong Fit', color: '#047857' };
  }
  if (num >= 55) {
    return { className: 'match-medium', label: 'Moderate Fit', color: '#1d4ed8' };
  }
  return { className: 'match-low', label: 'Developing Fit', color: '#64748b' };
}
