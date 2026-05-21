import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel-thick" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center', padding: '2.5rem' }}>
        <div className="modal-icon" style={{ marginBottom: '1.5rem', color: 'var(--danger)' }}>
          <AlertTriangle size={56} style={{ margin: '0 auto' }} />
        </div>
        <h2 className="modal-title" style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{title}</h2>
        <p className="modal-text" style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.5' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
