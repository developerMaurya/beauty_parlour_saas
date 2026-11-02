import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendanceCorrectionFetcher } from '../../../api/student';

export default function StudentAttendanceCorrectionsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    currentStatus: 'ABSENT',
    requestedStatus: 'PRESENT',
    reason: '',
    attachmentUrl: ''
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await attendanceCorrectionFetcher.getAll();
      if (res.success) {
        setRequests(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await attendanceCorrectionFetcher.create(formData);
      if (res.success) {
        setShowModal(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          currentStatus: 'ABSENT',
          requestedStatus: 'PRESENT',
          reason: '',
          attachmentUrl: ''
        });
        loadRequests();
      } else {
        setError(res.message || 'Failed to submit correction request');
      }
    } catch (err) {
      setError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this correction request?')) return;
    try {
      await attendanceCorrectionFetcher.cancel(id);
      loadRequests();
    } catch (err) {
      alert(err.message || 'Error cancelling request');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/student/attendance" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Attendance
          </Link>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '8px 0 4px', color: '#f8fafc' }}>
            Attendance Correction Requests
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Submit verification proofs for biometric missed punches or medical leaves.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000',
            fontWeight: 700,
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + New Correction Request
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading correction requests...</div>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📋</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Requests on File</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>You have not submitted any attendance correction requests.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {requests.map(req => {
            const statusColor = req.status === 'APPROVED' ? '#10b981' : req.status === 'REJECTED' ? '#ef4444' : '#f59e0b';
            return (
              <div
                key={req._id}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                      {req.status}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>
                      Date: {new Date(req.date).toLocaleDateString()}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', color: '#cbd5e1', marginBottom: '6px' }}>
                    Status Change: <span style={{ color: '#ef4444' }}>{req.currentStatus}</span> → <strong style={{ color: '#10b981' }}>{req.requestedStatus}</strong>
                  </div>

                  <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                    <strong>Reason:</strong> {req.reason}
                  </div>

                  {req.adminRemarks && (
                    <div style={{ marginTop: '10px', fontSize: '13px', color: '#fbbf24', background: '#0f172a', padding: '8px 12px', borderRadius: '6px' }}>
                      <strong>Admin Remark:</strong> {req.adminRemarks}
                    </div>
                  )}
                </div>

                {req.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    style={{ background: '#334155', color: '#ef4444', border: '1px solid #ef444455', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel Request
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submission Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '28px', maxWidth: '480px', width: '90%' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Request Attendance Correction</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Class Session Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Current Status</label>
                  <select
                    value={formData.currentStatus}
                    onChange={e => setFormData({ ...formData, currentStatus: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}
                  >
                    <option value="ABSENT">ABSENT</option>
                    <option value="LATE">LATE</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Requested Status</label>
                  <select
                    value={formData.requestedStatus}
                    onChange={e => setFormData({ ...formData, requestedStatus: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}
                  >
                    <option value="PRESENT">PRESENT</option>
                    <option value="LEAVE">LEAVE</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Reason / Explanation</label>
                <textarea
                  rows="3"
                  required
                  placeholder="e.g. Biometric machine error during checkout or medical certificate attached."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Proof Document URL (Optional)</label>
                <input
                  type="text"
                  placeholder="https://... (medical note or pass)"
                  value={formData.attachmentUrl}
                  onChange={e => setFormData({ ...formData, attachmentUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#334155', color: '#f8fafc', padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '10px 22px', borderRadius: '6px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
