import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';

export const JoinRequestModal = ({ isOpen, onClose, project, onSubmitRequest }) => {
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pitch.trim()) return;

    setSubmitting(true);
    try {
      await onSubmitRequest(project.id, { pitch_message: pitch });
      setPitch('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!project) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Join Project: ${project.title}`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit} loading={submitting}>Send Join Request</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
            Tell the project team why you are excited to contribute and which skills you bring.
          </p>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="join-pitch">Your Application Pitch *</label>
          <textarea
            id="join-pitch"
            className="form-textarea"
            rows="4"
            placeholder="Hi team! I'm interested in helping build the frontend and API integrations. I've worked on React and FastAPI projects before..."
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default JoinRequestModal;
