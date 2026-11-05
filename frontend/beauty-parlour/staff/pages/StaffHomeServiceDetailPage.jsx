/**
 * @file StaffHomeServiceDetailPage.jsx
 * @description Mobile-First Journey Console for Doorstep Beauty Services.
 * Conforms to Phase 05 Section 20, 21, 22, 23, 24, 25, 26 & 55.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as homeApi from '../../../services/api/staff/homeServiceFetcher.js';

export default function StaffHomeServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [appointment, setAppointment] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`doorstep_queue_${id}`) || '[]');
    } catch {
      return [];
    }
  });

  // Forms
  const [expenseForm, setExpenseForm] = useState({ type: 'travel', amount: '', notes: '' });
  const [reportForm, setReportForm] = useState({ notes: '', productsUsed: '', customerFeedback: '' });
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Sync offline queue helper
  const syncOfflineQueue = async () => {
    const queue = JSON.parse(localStorage.getItem(`doorstep_queue_${id}`) || '[]');
    if (queue.length === 0) return;

    let synced = 0;
    const remaining = [];

    for (const item of queue) {
      try {
        if (item.type === 'location') {
          await homeApi.updateLocation(id, item.payload);
        } else if (item.type === 'action') {
          await executeAction(item.payload);
        }
        synced++;
      } catch (err) {
        remaining.push(item);
      }
    }

    localStorage.setItem(`doorstep_queue_${id}`, JSON.stringify(remaining));
    setOfflineQueue(remaining);

    if (synced > 0) {
      success(`Successfully synced ${synced} offline event(s) to dispatch center!`);
      loadData();
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineQueue();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [id]);

  const queueOffline = (type, payload) => {
    const current = JSON.parse(localStorage.getItem(`doorstep_queue_${id}`) || '[]');
    const updated = [...current, { type, payload, timestamp: Date.now() }];
    localStorage.setItem(`doorstep_queue_${id}`, JSON.stringify(updated));
    setOfflineQueue(updated);
    success('Network offline: Action safely saved locally and will auto-sync once connected!');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [apptRes, trackRes, expRes, repRes] = await Promise.allSettled([
        homeApi.getHomeService(id),
        homeApi.getHomeServiceTracking(id),
        homeApi.getExpenses(id),
        homeApi.getWorkReport(id),
      ]);

      if (apptRes.status === 'fulfilled' && apptRes.value?.data) setAppointment(apptRes.value.data);
      if (trackRes.status === 'fulfilled' && trackRes.value?.data) setTracking(trackRes.value.data);
      if (expRes.status === 'fulfilled' && expRes.value?.data) {
        setExpenses(Array.isArray(expRes.value.data) ? expRes.value.data : []);
      }
      if (repRes.status === 'fulfilled' && repRes.value?.data) setReport(repRes.value.data);
    } catch (err) {
      console.warn('Error loading journey console:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const executeAction = async (action) => {
    if (action === 'accept') return homeApi.acceptHomeService(id);
    if (action === 'reject') return homeApi.rejectHomeService(id);
    if (action === 'on-the-way') return homeApi.onTheWayHomeService(id);
    if (action === 'arrived') return homeApi.arrivedHomeService(id);
    if (action === 'start') return homeApi.startHomeService(id);
    if (action === 'pause') return homeApi.pauseHomeService(id);
    if (action === 'resume') return homeApi.resumeHomeService(id);
    if (action === 'complete') return homeApi.completeHomeService(id);
    if (action === 'depart') return homeApi.departHomeService(id);
  };

  // GPS Location Trigger
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      toastError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const payload = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          status: tracking?.currentStatus || appointment?.status || 'ON_THE_WAY',
        };
        if (!navigator.onLine) {
          queueOffline('location', payload);
          return;
        }
        try {
          await homeApi.updateLocation(id, payload);
          success('GPS coordinates uploaded to Salon dispatch center!');
          loadData();
        } catch (err) {
          queueOffline('location', payload);
        }
      },
      (err) => toastError(`Location error: ${err.message}`)
    );
  };

  // State Transition Handlers
  const handleTransition = async (action) => {
    if (!navigator.onLine) {
      queueOffline('action', action);
      // Optimistically update appointment status display
      setTracking((prev) => ({
        ...prev,
        currentStatus: action.replace('-', '_').toUpperCase(),
      }));
      return;
    }

    try {
      setActionLoading(true);
      await executeAction(action);
      success(`Journey stage updated: ${action.replace('-', ' ').toUpperCase()}`);
      await loadData();
    } catch (err) {
      if (!navigator.onLine || err.message === 'Network Error') {
        queueOffline('action', action);
      } else {
        toastError(err?.response?.data?.message || 'Invalid state transition');
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Add Expense
  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await homeApi.addExpense(id, expenseForm);
      success('Travel expense logged for approval');
      setShowExpenseModal(false);
      setExpenseForm({ type: 'travel', amount: '', notes: '' });
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to add expense');
    }
  };

  // Submit Work Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      await homeApi.submitWorkReport(id, reportForm);
      success('Work report submitted successfully!');
      setShowReportModal(false);
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to submit report');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading doorstep journey...</div>;
  }

  const a = appointment || {};
  const c = a.customer || {};
  const currentStatus = tracking?.currentStatus || a.status?.toUpperCase() || 'ASSIGNED';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => navigate('/staff/home-services')} style={backLinkStyle}>
            ← Back to Doorstep List
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11.5px',
                padding: '4px 8px',
                borderRadius: '12px',
                fontWeight: '600',
                background: isOnline ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.2)',
                color: isOnline ? '#10b981' : '#f59e0b',
                border: `1px solid ${isOnline ? '#10b98144' : '#f59e0b44'}`,
              }}
            >
              {isOnline ? '🟢 GPS Live' : '🟠 Low Connectivity / Offline'}
            </span>
            {offlineQueue.length > 0 && (
              <button
                onClick={syncOfflineQueue}
                style={{
                  background: '#f59e0b',
                  color: '#000',
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                Sync Offline ({offlineQueue.length})
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>🚗</span>
              <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
                Doorstep Visit Console
              </h1>
              <span style={statusBadgeStyle(currentStatus)}>{currentStatus}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
              {a.service?.name} • Scheduled: {a.date ? new Date(a.date).toLocaleDateString() : ''} at {a.scheduledTime}
            </div>
          </div>

          <button
            onClick={handleShareLocation}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '10px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
            }}
          >
            📡 Ping GPS Location
          </button>
        </div>
      </div>

      {/* MOBILE-FIRST BIG TOUCH ACTION BAR (Section 55) */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '14px', fontWeight: '700' }}>
          Touch Action for Active Specialist Journey
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          {currentStatus === 'ASSIGNED' && (
            <>
              <button
                onClick={() => handleTransition('accept')}
                disabled={actionLoading}
                style={bigButtonStyle('#10b981')}
              >
                ✅ Accept Home Service
              </button>
              <button
                onClick={() => handleTransition('reject')}
                disabled={actionLoading}
                style={bigButtonStyle('#ef4444')}
              >
                ❌ Decline
              </button>
            </>
          )}

          {(currentStatus === 'ACCEPTED' || currentStatus === 'CONFIRMED') && (
            <button
              onClick={() => handleTransition('on-the-way')}
              disabled={actionLoading}
              style={bigButtonStyle('#3b82f6')}
            >
              🚗 On The Way To Client
            </button>
          )}

          {currentStatus === 'ON_THE_WAY' && (
            <button
              onClick={() => handleTransition('arrived')}
              disabled={actionLoading}
              style={bigButtonStyle('#f59e0b')}
            >
              📍 Arrived At Doorstep
            </button>
          )}

          {currentStatus === 'ARRIVED' && (
            <button
              onClick={() => handleTransition('start')}
              disabled={actionLoading}
              style={bigButtonStyle('#ec4899')}
            >
              ✂️ Start Home Treatment
            </button>
          )}

          {currentStatus === 'WORKING' && (
            <>
              <button
                onClick={() => handleTransition('pause')}
                disabled={actionLoading}
                style={bigButtonStyle('#64748b')}
              >
                ⏸️ Pause Service
              </button>
              <button
                onClick={() => handleTransition('complete')}
                disabled={actionLoading}
                style={bigButtonStyle('#10b981')}
              >
                🎉 Complete Service
              </button>
            </>
          )}

          {currentStatus === 'PAUSED' && (
            <button
              onClick={() => handleTransition('resume')}
              disabled={actionLoading}
              style={bigButtonStyle('#8b5cf6')}
            >
              ▶️ Resume Service
            </button>
          )}

          {currentStatus === 'COMPLETED' && (
            <button
              onClick={() => handleTransition('depart')}
              disabled={actionLoading}
              style={bigButtonStyle('#6366f1')}
            >
              🏁 Depart Client Location
            </button>
          )}

          {currentStatus === 'DEPARTED' && (
            <div style={{ color: '#10b981', fontWeight: '700', fontSize: '15px' }}>
              ✨ Journey Finished & Departed Successfully
            </div>
          )}
        </div>
      </div>

      {/* Client Address & Navigation Card */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px', color: '#fff' }}>
          📍 Doorstep Address & Navigation
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
          <div>
            <strong style={{ color: '#fff' }}>Client Name:</strong> {c.name || 'Doorstep Customer'}
          </div>
          <div>
            <strong style={{ color: '#fff' }}>Phone:</strong>{' '}
            <a href={`tel:${c.phone}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
              {c.phone || 'N/A'}
            </a>
          </div>
          <div>
            <strong style={{ color: '#fff' }}>Address:</strong> {c.address || a.homeAddress || 'Not Provided'}
          </div>
          {c.address && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.address)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60a5fa',
                padding: '8px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                width: 'fit-content',
                marginTop: '4px',
              }}
            >
              🗺️ Open in Google Maps
            </a>
          )}
        </div>
      </div>

      {/* Travel Expenses & Work Reports Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Expenses Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#fff' }}>
              🚕 Travel Expenses
            </h3>
            <button
              onClick={() => setShowExpenseModal(true)}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
            >
              + Log Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No travel expenses recorded.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {expenses.map((exp, idx) => (
                <div key={idx} style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#fff' }}>{exp.type?.toUpperCase()}</div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8' }}>{exp.notes || 'No description'}</div>
                  </div>
                  <div style={{ color: '#10b981', fontWeight: '700' }}>₹{exp.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Work Report Card */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#fff' }}>
              📋 Completion Work Report
            </h3>
            {!report && (
              <button
                onClick={() => setShowReportModal(true)}
                style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
              >
                Submit Report
              </button>
            )}
          </div>

          {report ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div><strong style={{ color: '#94a3b8' }}>Notes:</strong> {report.notes || 'None'}</div>
              <div><strong style={{ color: '#94a3b8' }}>Products:</strong> {report.productsUsed || 'None listed'}</div>
              <div><strong style={{ color: '#94a3b8' }}>Feedback:</strong> {report.customerFeedback || 'Satisfied'}</div>
            </div>
          ) : (
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No completion report submitted yet.</p>
          )}
        </div>
      </div>

      {/* Expense Modal */}
      {showExpenseModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Record Travel / Parking Expense</h3>
            <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Expense Category</label>
                <select
                  value={expenseForm.type}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, type: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="travel">Cab / Travel Fare</option>
                  <option value="parking">Parking Fee</option>
                  <option value="toll">Highway Toll</option>
                  <option value="other">Other Approved Expense</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Amount (₹)</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))}
                  required
                  placeholder="e.g. 150"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Notes</label>
                <input
                  type="text"
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="e.g. Paid parking at apartment gate"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowExpenseModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" style={btnPrimaryStyle}>
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Work Report Modal */}
      {showReportModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Submit Doorstep Work Report</h3>
            <form onSubmit={handleSubmitReport} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Products Used</label>
                <input
                  type="text"
                  value={reportForm.productsUsed}
                  onChange={(e) => setReportForm((p) => ({ ...p, productsUsed: e.target.value }))}
                  placeholder="e.g. Gold Facial Kit 50g, Wax strips"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Work Summary & Notes</label>
                <textarea
                  value={reportForm.notes}
                  onChange={(e) => setReportForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={3}
                  required
                  placeholder="Treatment highlights, client skin reaction, etc."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Client Feedback</label>
                <input
                  type="text"
                  value={reportForm.customerFeedback}
                  onChange={(e) => setReportForm((p) => ({ ...p, customerFeedback: e.target.value }))}
                  placeholder="e.g. Client loved the hair styling"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowReportModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" style={btnPrimaryStyle}>
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const bigButtonStyle = (color) => ({
  background: color,
  color: '#fff',
  border: 'none',
  padding: '16px 28px',
  borderRadius: '14px',
  fontSize: '15px',
  fontWeight: '800',
  cursor: 'pointer',
  boxShadow: `0 6px 20px ${color}44`,
  minWidth: '220px',
  transition: 'transform 0.15s ease',
});

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '22px',
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
  padding: '10px',
  color: '#fff',
  fontSize: '13px',
  marginTop: '4px',
  boxSizing: 'border-box',
};

const btnPrimaryStyle = {
  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
};

const btnCancelStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '20px',
};

const modalContentStyle = {
  background: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
};

const statusBadgeStyle = (status) => ({
  background: 'rgba(59, 130, 246, 0.2)',
  color: '#60a5fa',
  padding: '4px 10px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase',
});
