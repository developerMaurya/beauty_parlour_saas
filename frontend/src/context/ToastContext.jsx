/**
 * @file ToastContext.jsx
 * @description Global Toast Notification Context & Provider
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, title = 'Success') => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((message, title = 'Error') => {
    addToast({ type: 'error', title, message });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning') => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((message, title = 'Info') => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <div>{getIcon(toast.type)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '4px',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastContext;
