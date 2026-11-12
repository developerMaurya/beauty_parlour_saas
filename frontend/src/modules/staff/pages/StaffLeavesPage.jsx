/**
 * @file StaffLeavesPage.jsx
 * @description Leave Application, Approval Tracking & Salon Holiday Calendar for Staff.
 * Conforms to Phase 05 Section 9 & 10.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import * as leaveApi from '../../../services/api/staff/leaveFetcher.js';
import * as holApi from '../../../services/api/staff/holidayFetcher.js';
import {
  getMasterLeaves,
  applyStaffLeave,
  getTodayDateStr,
} from '../../../services/hrSharedStorage.js';

export default function StaffLeavesPage() {
  const { success, error: toastError } = useToast();
  const { staffUser, staffProfile } = useStaff();

  const [activeTab, setActiveTab] = useState('leaves'); // 'leaves' | 'holidays'
  const [leaves, setLeaves] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Apply Leave Modal
  const [showModal, setShowModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'casual',
    fromDate: new Date().toISOString().slice(0, 10),
    toDate: new Date().toISOString().slice(0, 10),
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [lRes, hRes] = await Promise.allSettled([
        leaveApi.getLeaves(),
        holApi.getHolidays(),
      ]);

      if (lRes.status === 'fulfilled' && lRes.value?.data) {
        setLeaves(Array.isArray(lRes.value.data) ? lRes.value.data : []);
      }
      if (hRes.status === 'fulfilled' && hRes.value?.data) {
        setHolidays(Array.isArray(hRes.value.data) ? hRes.value.data : []);
      }

      // Sync with real-time shared leave requests
      const masterLeaves = getMasterLeaves();
      const myId = staffUser?._id || staffProfile?.staffId;
      const myLeaves = masterLeaves.filter((l) => (myId ? l.staffId === myId : true));

      setLeaves((prev) => (prev && prev.length > 0 ? prev : myLeaves.length > 0 ? myLeaves : masterLeaves));
    } catch (err) {
      console.warn('Leaves load err:', err);
    } finally {
      setLoading(false);
    }
  }, [staffUser, staffProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const myId = staffUser?._id || staffProfile?.staffId || 'STF-P-101';
      const myName = staffUser?.name || staffProfile?.name || 'Staff Member';
      const myDept = (staffUser?.targetBusiness || 'PARLOUR').toUpperCase();

      applyStaffLeave({
        staffId: myId,
        staffName: myName,
        department: myDept,
        leaveType: leaveForm.leaveType,
        fromDate: leaveForm.fromDate,
        toDate: leaveForm.toDate,
        reason: leaveForm.reason,
      });

      try {
        await leaveApi.applyLeave(leaveForm);
      } catch (e) {
        console.warn('Backend API fallback sync active');
      }

      success('Leave application submitted for Admin approval!');
      setShowModal(false);
      setLeaveForm({
        leaveType: 'casual',
        fromDate: new Date().toISOString().slice(0, 10),
        toDate: new Date().toISOString().slice(0, 10),
        reason: '',
      });
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to submit leave');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLeave = async (leaveId) => {
    if (!window.confirm('Cancel this leave request?')) return;
    try {
      await leaveApi.cancelLeave(leaveId);
      success('Leave cancelled successfully.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Cancel failed');
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
            <span style={{ fontSize: '24px' }}>🏖️</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Leaves & Salon Holidays
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Submit time-off requests, track managerial approval, and view company holidays
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'leaves', label: `My Leaves (${leaves.length})` },
              { id: 'holidays', label: `Holidays (${holidays.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Apply For Leave
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading leave records...</div>
      ) : activeTab === 'leaves' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            📋 Leave Application History
          </h2>
          {leaves.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No leave applications submitted.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leaves.map((l) => (
                <div
                  key={l._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14.5px' }}>
                      {l.leaveType?.toUpperCase()} LEAVE
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>
                      📅 {l.fromDate ? new Date(l.fromDate).toLocaleDateString() : ''} to{' '}
                      {l.toDate ? new Date(l.toDate).toLocaleDateString() : ''} — {l.reason}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={statusBadgeStyle(l.status)}>{l.status}</span>
                    {l.status === 'pending' && (
                      <button
                        onClick={() => handleCancelLeave(l._id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🎉 Upcoming Salon & National Holidays
          </h2>
          {holidays.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No holidays listed.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {holidays.map((hol) => (
                <div
                  key={hol._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#fff' }}>{hol.name || hol.title}</div>
                  <div style={{ fontSize: '13px', color: '#ec4899', marginTop: '4px', fontWeight: '600' }}>
                    📅 {hol.date ? new Date(hol.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    {hol.description || 'Full Salon Holiday'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Leave Application Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Apply For Leave</h3>
            <form onSubmit={handleApplyLeave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Leave Category</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm((p) => ({ ...p, leaveType: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual / Earned Leave</option>
                  <option value="emergency">Emergency Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1' }}>From Date</label>
                  <input
                    type="date"
                    value={leaveForm.fromDate}
                    onChange={(e) => setLeaveForm((p) => ({ ...p, fromDate: e.target.value }))}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1' }}>To Date</label>
                  <input
                    type="date"
                    value={leaveForm.toDate}
                    onChange={(e) => setLeaveForm((p) => ({ ...p, toDate: e.target.value }))}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Reason For Leave</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm((p) => ({ ...p, reason: e.target.value }))}
                  rows={3}
                  required
                  placeholder="Explain reason for time-off..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={btnPrimaryStyle}>
                  {submitting ? 'Submitting...' : 'Submit to Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
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
  background:
    status === 'approved'
      ? 'rgba(16, 185, 129, 0.2)'
      : status === 'rejected'
      ? 'rgba(239, 68, 68, 0.2)'
      : 'rgba(245, 158, 11, 0.2)',
  color:
    status === 'approved'
      ? '#34d399'
      : status === 'rejected'
      ? '#f87171'
      : '#fbbf24',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
