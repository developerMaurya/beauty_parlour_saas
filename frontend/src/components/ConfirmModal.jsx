/**
 * @file ConfirmModal.jsx
 * @description Confirmation Modal for Destructive / Critical Actions
 */

import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action? This operation cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </button>
          <button
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '2.75rem',
            height: '2.75rem',
            borderRadius: '50%',
            background: isDanger ? 'var(--color-danger-bg)' : 'rgba(99, 102, 241, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: isDanger ? '#EF4444' : 'var(--primary)',
          }}
        >
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
