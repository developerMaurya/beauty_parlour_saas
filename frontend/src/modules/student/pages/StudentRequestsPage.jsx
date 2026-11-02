import React, { useState, useEffect } from 'react';
import { requestFetcher } from '../../../api/student';

export default function StudentRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    requestType: 'SCHEDULE_CHANGE',
    subject: '',
    description: ''
  });

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await requestFetcher.getAll();
      if (res.success) {
        setRequests(res.data || []);
      } else {
        setError(res.message || 'Failed to load requests');
      }
    } catch (err) {
      setError(err.message || 'Error fetching student desk requests');
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
      const res = await requestFetcher.create(formData);
      if (res.success) {
        setShowModal(false);
        setFormData({ requestType: 'SCHEDULE_CHANGE', subject: '', description: '' });
        loadRequests();
      } else {
        setError(res.message || 'Failed to file ticket');
      }
    } catch (err) {
      setError(err.message || 'Ticket creation error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this service request?')) return;
    try {
      await requestFetcher.cancel(id);
      loadRequests();
    } catch (err) {
      alert(err.message || 'Error cancelling request');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Administrative Helpdesk & Service Tickets
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Raise requests for batch transfers, branch relocations, fee clarifications, or extra training sessions.
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
          + Raise New Ticket
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
          <div>Loading student tickets...</div>
        </div>
      ) : requests.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎫</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Tickets Raised</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>All your administrative requests and queries will appear here.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {requests.map(req => {
            const statusColor = req.status === 'COMPLETED' || req.status === 'APPROVED' ? '#10b981' : req.status === 'REJECTED' ? '#ef4444' : '#f59e0b';
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
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                      {req.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
                      {req.requestType}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Filed on {new Date(req.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#f8fafc' }}>
                    {req.subject || req.title || 'Administrative Service Ticket'}
                  </h3>

                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {req.description}
                  </p>

                  {req.resolutionNotes && (
                    <div style={{ background: '#0f172a', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', color: '#10b981' }}>
                      <strong>Resolution:</strong> {req.resolutionNotes}
                    </div>
                  )}
                </div>

                {req.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancel(req._id)}
                    style={{ background: '#334155', color: '#ef4444', border: '1px solid #ef444455', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel Ticket
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ticket Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '28px', maxWidth: '480px', width: '90%' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Submit Service Request</h3>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Ticket Category</label>
                <select
                  value={formData.requestType}
                  onChange={e => setFormData({ ...formData, requestType: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}
                >
                  <option value="SCHEDULE_CHANGE">Timetable / Batch Schedule Adjustment</option>
                  <option value="COURSE_CHANGE">Course Track Transfer</option>
                  <option value="BRANCH_CHANGE">Campus Branch Relocation</option>
                  <option value="PAYMENT_ISSUE">Tuition / Fee Payment Query</option>
                  <option value="ADDITIONAL_CLASS">Request Remedial / Extra Practical Lab</option>
                  <option value="CERTIFICATE_REQUEST">Certificate Reissue / Verification</option>
                  <option value="DOCUMENT_UPDATE">Student Document Update</option>
                  <option value="GENERAL_REQUEST">Other Administrative Request</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of request..."
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Detailed Explanation</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide complete context and preferred dates or branches..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
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
                  {submitting ? 'Submitting...' : 'File Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
