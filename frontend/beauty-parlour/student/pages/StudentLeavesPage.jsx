import React, { useState, useEffect } from 'react';
import { leaveFetcher } from '../../../api/student';

export default function StudentLeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    leaveType: 'MEDICAL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    reason: '',
    attachmentUrl: ''
  });

  const loadLeaves = async () => {
    try {
      setLoading(true);
      const res = await leaveFetcher.getAll();
      if (res.success) {
        setLeaves(res.data || []);
      } else {
        setError(res.message || 'Failed to load leaves');
      }
    } catch (err) {
      setError(err.message || 'Error fetching leave applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await leaveFetcher.create(formData);
      if (res.success) {
        setShowModal(false);
        setFormData({
          leaveType: 'MEDICAL',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0],
          reason: '',
          attachmentUrl: ''
        });
        loadLeaves();
      } else {
        setError(res.message || 'Failed to apply for leave');
      }
    } catch (err) {
      setError(err.message || 'Leave application error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this leave application?')) return;
    try {
      await leaveFetcher.cancel(id);
      loadLeaves();
    } catch (err) {
      alert(err.message || 'Error cancelling leave');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Academic Leave Applications
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Formal leave requests for sickness, family events, or examinations to excuse absences.
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
          + Apply for Leave
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
          <div>Loading student leave history...</div>
        </div>
      ) : leaves.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏖️</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Leaves on Record</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>You have perfect academic attendance with no applied leaves.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {leaves.map(lv => {
            const statusColor = lv.status === 'APPROVED' ? '#10b981' : lv.status === 'REJECTED' ? '#ef4444' : '#f59e0b';
            return (
              <div
                key={lv._id}
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
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                      {lv.status}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                      {lv.leaveType} LEAVE
                    </span>
                    <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                      ({new Date(lv.startDate).toLocaleDateString()} - {new Date(lv.endDate).toLocaleDateString()})
                    </span>
                  </div>

                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    <strong>Reason:</strong> {lv.reason}
                  </p>

                  {lv.adminRemarks && (
                    <div style={{ background: '#0f172a', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', color: '#fbbf24' }}>
                      <strong>Admin Response:</strong> {lv.adminRemarks}
                    </div>
                  )}
                </div>

                {lv.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(lv._id)}
                    style={{ background: '#334155', color: '#ef4444', border: '1px solid #ef444455', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel Application
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '28px', maxWidth: '460px', width: '90%' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Apply for Academic Leave</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Leave Category</label>
                <select
                  value={formData.leaveType}
                  onChange={e => setFormData({ ...formData, leaveType: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}
                >
                  <option value="MEDICAL">Medical / Health Sickness</option>
                  <option value="PERSONAL">Personal / Urgent Family Affair</option>
                  <option value="EXAM">College / Academic Examination</option>
                  <option value="EMERGENCY">Emergency Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>From Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>To Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Explanation / Reason</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Detail the circumstances necessitating your absence..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
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
                  {submitting ? 'Applying...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
