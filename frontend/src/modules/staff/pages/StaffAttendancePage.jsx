/**
 * @file StaffAttendancePage.jsx
 * @description Attendance Clock-In, Monthly Log & Correction Requests for Staff.
 * Conforms to Phase 05 Section 7 & 8.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import { useStaff } from '../../../context/StaffContext.jsx';
import * as attApi from '../../../services/api/staff/attendanceFetcher.js';
import * as corrApi from '../../../services/api/staff/attendanceCorrectionFetcher.js';
import {
  getMasterAttendance,
  clockInStaff,
  clockOutStaff,
  getTodayDateStr,
} from '../../../services/hrSharedStorage.js';

export default function StaffAttendancePage() {
  const { success, error: toastError } = useToast();
  const { staffUser, staffProfile } = useStaff();

  const [activeTab, setActiveTab] = useState('attendance'); // 'attendance' | 'corrections'
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [summary, setSummary] = useState(null);
  const [corrections, setCorrections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);

  // Correction Form Modal
  const [showModal, setShowModal] = useState(false);
  const [corrForm, setCorrForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    requestType: 'forgot_check_in',
    correctedCheckIn: '09:00',
    correctedCheckOut: '18:00',
    reason: '',
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, hRes, sRes, cRes] = await Promise.allSettled([
        attApi.getTodayAttendance(),
        attApi.getAttendanceRecords(),
        attApi.getAttendanceSummary(),
        corrApi.getCorrectionRequests(),
      ]);

      if (tRes.status === 'fulfilled' && tRes.value?.data) setTodayRecord(tRes.value.data);
      if (hRes.status === 'fulfilled' && hRes.value?.data) {
        setHistory(Array.isArray(hRes.value.data) ? hRes.value.data : []);
      }
      if (sRes.status === 'fulfilled' && sRes.value?.data) setSummary(sRes.value.data);
      if (cRes.status === 'fulfilled' && cRes.value?.data) {
        setCorrections(Array.isArray(cRes.value.data) ? cRes.value.data : []);
      }

      // Fallback / sync with real-time shared HR storage
      const masterList = getMasterAttendance();
      const today = getTodayDateStr();
      const myId = staffUser?._id || staffProfile?.staffId;
      const myTodayRec = masterList.find((r) => (myId ? r.staffId === myId : true) && r.date === today);

      if (myTodayRec) {
        setTodayRecord((prev) => prev || myTodayRec);
      }
      if (!history || history.length === 0) {
        setHistory(masterList.filter((r) => (myId ? r.staffId === myId : true)));
      }
    } catch (err) {
      console.warn('Attendance load error:', err);
    } finally {
      setLoading(false);
    }
  }, [staffUser, staffProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCheckIn = async () => {
    try {
      setClockLoading(true);
      const myId = staffUser?._id || staffProfile?.staffId || 'STF-P-101';
      const myName = staffUser?.name || staffProfile?.name || 'Staff Member';
      const myDept = (staffUser?.targetBusiness || 'PARLOUR').toUpperCase();

      clockInStaff({
        staffId: myId,
        staffName: myName,
        department: myDept,
        notes: 'Clocked in from Staff Portal',
      });

      try {
        await attApi.checkIn({ notes: 'Clocked in from Staff Portal' });
      } catch (e) {
        console.warn('Backend API fallback sync active');
      }

      success('Clocked in successfully! Have a great day.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Check-in failed');
    } finally {
      setClockLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setClockLoading(true);
      const myId = staffUser?._id || staffProfile?.staffId || 'STF-P-101';

      clockOutStaff({ staffId: myId });

      try {
        await attApi.checkOut({ notes: 'Clocked out from Staff Portal' });
      } catch (e) {
        console.warn('Backend API fallback sync active');
      }

      success('Clocked out successfully!');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Check-out failed');
    } finally {
      setClockLoading(false);
    }
  };

  const handleCreateCorrection = async (e) => {
    e.preventDefault();
    try {
      await corrApi.createCorrectionRequest(corrForm);
      success('Attendance correction request submitted to Admin!');
      setShowModal(false);
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Correction submission failed');
    }
  };

  const handleCancelCorrection = async (id) => {
    try {
      await corrApi.cancelCorrectionRequest(id);
      success('Correction request cancelled.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Cancellation failed');
    }
  };

  const isCheckedIn = todayRecord?.checkIn && !todayRecord?.checkOut;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Banner & Clock-in widget */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
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
            <span style={{ fontSize: '24px' }}>⏱️</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Staff Attendance & Time Clock
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#cbd5e1', fontSize: '13.5px' }}>
            Track daily work hours, punctuality, and submit correction requests
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {!isCheckedIn ? (
            <button
              onClick={handleCheckIn}
              disabled={clockLoading}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              }}
            >
              ⏱️ Clock In For Shift
            </button>
          ) : (
            <button
              onClick={handleCheckOut}
              disabled={clockLoading}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
              }}
            >
              🛑 Clock Out (Shift End)
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff',
              border: 'none',
              padding: '12px 18px',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            + Request Correction
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Present Days</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981' }}>
            {summary?.presentDays ?? history.filter((h) => h.status === 'present').length}
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Late Arrivals</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>
            {summary?.lateDays ?? history.filter((h) => h.lateMinutes > 0).length}
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Hours Logged</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#38bdf8' }}>
            {summary?.totalHours ?? '0'} hrs
          </div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>Overtime Hours</div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#c084fc' }}>
            {summary?.overtimeHours ?? '0'} hrs
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        <button
          onClick={() => setActiveTab('attendance')}
          style={{
            background: activeTab === 'attendance' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
            color: activeTab === 'attendance' ? '#fff' : '#94a3b8',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Daily Clock Log
        </button>
        <button
          onClick={() => setActiveTab('corrections')}
          style={{
            background: activeTab === 'corrections' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
            color: activeTab === 'corrections' ? '#fff' : '#94a3b8',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Correction Requests ({corrections.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading records...</div>
      ) : activeTab === 'attendance' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            📅 Monthly Attendance History
          </h2>
          {history.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No attendance records found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {history.map((rec) => (
                <div
                  key={rec._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                      {rec.date ? new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : 'Date'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      In: {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'} • Out:{' '}
                      {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {rec.lateMinutes > 0 && (
                      <span style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                        Late: {rec.lateMinutes}m
                      </span>
                    )}
                    <span style={statusBadgeStyle(rec.status)}>{rec.status || 'PRESENT'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            📬 Submitted Attendance Corrections
          </h2>
          {corrections.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No correction requests found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {corrections.map((c) => (
                <div
                  key={c._id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                      {c.requestType?.replace(/_/g, ' ')?.toUpperCase()} • {c.date ? new Date(c.date).toLocaleDateString() : ''}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Requested: {c.correctedCheckIn} to {c.correctedCheckOut} — {c.reason}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={corrStatusBadgeStyle(c.status)}>{c.status}</span>
                    {c.status === 'pending' && (
                      <button
                        onClick={() => handleCancelCorrection(c._id)}
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
      )}

      {/* Correction Request Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Attendance Correction Request</h3>
            <form onSubmit={handleCreateCorrection} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Shift Date</label>
                <input
                  type="date"
                  value={corrForm.date}
                  onChange={(e) => setCorrForm((p) => ({ ...p, date: e.target.value }))}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Correction Reason</label>
                <select
                  value={corrForm.requestType}
                  onChange={(e) => setCorrForm((p) => ({ ...p, requestType: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="forgot_check_in">Forgot Check-in</option>
                  <option value="forgot_check_out">Forgot Check-out</option>
                  <option value="wrong_timing">Wrong Timing / Machine Glitch</option>
                  <option value="wrong_branch">Wrong Branch Logged</option>
                  <option value="other">Other Official Reason</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Actual Check In</label>
                  <input
                    type="time"
                    value={corrForm.correctedCheckIn}
                    onChange={(e) => setCorrForm((p) => ({ ...p, correctedCheckIn: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Actual Check Out</label>
                  <input
                    type="time"
                    value={corrForm.correctedCheckOut}
                    onChange={(e) => setCorrForm((p) => ({ ...p, correctedCheckOut: e.target.value }))}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Detailed Explanation</label>
                <textarea
                  value={corrForm.reason}
                  onChange={(e) => setCorrForm((p) => ({ ...p, reason: e.target.value }))}
                  rows={2}
                  required
                  placeholder="Explain why the timing needs adjustment..."
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" style={btnPrimaryStyle}>
                  Submit Request
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

const kpiCardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  padding: '18px 20px',
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
  background: 'linear-gradient(135deg, #10b981, #059669)',
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
  background: status === 'present' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
  color: status === 'present' ? '#34d399' : '#fbbf24',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});

const corrStatusBadgeStyle = (status) => ({
  background: status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
  color: status === 'approved' ? '#34d399' : '#fbbf24',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
