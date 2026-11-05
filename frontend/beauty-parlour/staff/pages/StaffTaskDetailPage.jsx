/**
 * @file StaffTaskDetailPage.jsx
 * @description Task Details & Discussion Thread for Staff.
 * Conforms to Phase 05 Section 44 & 45.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as taskApi from '../../../services/api/staff/taskFetcher.js';

export default function StaffTaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tRes, cRes] = await Promise.allSettled([
        taskApi.getTask(id),
        taskApi.getTaskComments(id),
      ]);
      if (tRes.status === 'fulfilled' && tRes.value?.data) setTask(tRes.value.data);
      if (cRes.status === 'fulfilled' && cRes.value?.data) {
        setComments(Array.isArray(cRes.value.data) ? cRes.value.data : []);
      }
    } catch (err) {
      console.warn('Task load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await taskApi.addTaskComment(id, { comment: commentText });
      success('Comment posted to task thread!');
      setCommentText('');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await taskApi.deleteTaskComment(id, commentId);
      success('Comment deleted.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading task details...</div>;
  }

  const t = task || {};

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <button onClick={() => navigate('/staff/tasks')} style={backLinkStyle}>
          ← Back to Tasks List
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: '#fff' }}>
                {t.title || 'Task Details'}
              </h1>
              <span style={statusBadgeStyle(t.status)}>{t.status}</span>
            </div>
            <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
              {t.description || 'No detailed instructions provided.'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>DUE DATE</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
              {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'Today'}
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Thread */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
          💬 Task Discussion & Operational Updates
        </h2>

        {/* Comment input */}
        <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            rows={2}
            required
            placeholder="Post an update or question regarding this task..."
            style={inputStyle}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '12.5px',
              }}
            >
              {submittingComment ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>

        {/* Comments Feed */}
        {comments.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No comments yet on this task.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {comments.map((cm) => (
              <div
                key={cm._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: '600', color: '#fff', fontSize: '13px' }}>
                      {cm.authorName || 'Team Member'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {cm.createdAt ? new Date(cm.createdAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{cm.comment}</div>
                </div>

                <button
                  onClick={() => handleDeleteComment(cm._id)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  resize: 'vertical',
  boxSizing: 'border-box',
};

const statusBadgeStyle = (status) => ({
  background: status === 'completed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
  color: status === 'completed' ? '#34d399' : '#60a5fa',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
