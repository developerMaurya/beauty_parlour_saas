/**
 * @file StaffTasksPage.jsx
 * @description Assigned Salon Tasks & Lifecycle Management for Staff.
 * Conforms to Phase 05 Section 44 & 45.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as taskApi from '../../../services/api/staff/taskFetcher.js';

export default function StaffTasksPage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await taskApi.getTasks({ status: statusFilter || undefined });
      if (res?.data) {
        setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
      }
    } catch (err) {
      console.warn('Tasks fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') await taskApi.acceptTask(id);
      else if (action === 'start') await taskApi.startTask(id);
      else if (action === 'pause') await taskApi.pauseTask(id);
      else if (action === 'complete') await taskApi.completeTask(id);
      else if (action === 'reject') await taskApi.rejectTask(id);

      success(`Task updated: ${action.toUpperCase()}`);
      loadTasks();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Specialist Assigned Tasks
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Salon operations, sanitation duties, stock replenishment, and client follow-ups
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px 14px',
            color: '#fff',
            fontSize: '13px',
            outline: 'none',
          }}
        >
          <option value="">All Tasks</option>
          <option value="assigned">Assigned</option>
          <option value="accepted">Accepted</option>
          <option value="working">Working</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Task List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div
          style={{
            background: 'rgba(30, 41, 59, 0.4)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>✨</div>
          <p style={{ margin: 0, fontSize: '15px', color: '#cbd5e1' }}>No tasks found in this view.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((t) => (
            <div
              key={t._id}
              style={{
                background: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '18px 22px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  📋
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '15.5px', fontWeight: '700', margin: 0, color: '#fff' }}>
                      {t.title}
                    </h3>
                    <span style={statusBadgeStyle(t.status)}>{t.status}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '3px' }}>
                    {t.description || 'No description'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Today'} • Priority:{' '}
                    <span style={{ color: t.priority === 'high' ? '#ef4444' : '#fbbf24', fontWeight: '600' }}>
                      {t.priority?.toUpperCase() || 'MEDIUM'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {t.status === 'assigned' && (
                  <button onClick={() => handleAction(t._id, 'accept')} style={actionBtnStyle('#10b981')}>
                    Accept Task
                  </button>
                )}
                {t.status === 'accepted' && (
                  <button onClick={() => handleAction(t._id, 'start')} style={actionBtnStyle('#3b82f6')}>
                    Start Working
                  </button>
                )}
                {t.status === 'working' && (
                  <>
                    <button onClick={() => handleAction(t._id, 'pause')} style={actionBtnStyle('#64748b')}>
                      Pause
                    </button>
                    <button onClick={() => handleAction(t._id, 'complete')} style={actionBtnStyle('#10b981')}>
                      Mark Done
                    </button>
                  </>
                )}
                {t.status === 'paused' && (
                  <button onClick={() => handleAction(t._id, 'start')} style={actionBtnStyle('#8b5cf6')}>
                    Resume
                  </button>
                )}
                <button
                  onClick={() => navigate(`/staff/tasks/${t._id}`)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  Comments & Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const actionBtnStyle = (color) => ({
  background: color,
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '8px',
  fontSize: '12.5px',
  fontWeight: '700',
  cursor: 'pointer',
});

const statusBadgeStyle = (status) => ({
  background: status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
  color: status === 'completed' ? '#34d399' : '#60a5fa',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
