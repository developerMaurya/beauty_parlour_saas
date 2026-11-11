import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { attendanceFetcher } from '../../../services/api/student';

export default function StudentAttendancePage() {
  const [summary, setSummary] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAttendance() {
      try {
        setLoading(true);
        const [sumRes, recRes] = await Promise.allSettled([
          attendanceFetcher.getSummary(),
          attendanceFetcher.getAll()
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value.success) {
          setSummary(sumRes.value.data);
        }
        if (recRes.status === 'fulfilled' && recRes.value.success) {
          setRecords(recRes.value.data || []);
        }
      } catch (err) {
        setError(err.message || 'Error loading attendance records');
      } finally {
        setLoading(false);
      }
    }
    loadAttendance();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Calculating attendance analytics...</div>
      </div>
    );
  }

  const attPct = summary?.attendancePercentage || 0;
  const isEligible = attPct >= 80;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Biometric & Class Attendance
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Official institutional register. 80% minimum attendance required for final board exams & diplomas.
          </p>
        </div>

        <Link
          to="/student/attendance/corrections"
          style={{
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f8fafc',
            fontWeight: 600,
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          📝 Request Correction
        </Link>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Attendance Rate</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: isEligible ? '#10b981' : '#f59e0b', margin: '6px 0' }}>
            {attPct}%
          </div>
          <div style={{ fontSize: '12px', color: isEligible ? '#10b981' : '#ef4444', fontWeight: 600 }}>
            {isEligible ? '✓ Diploma Eligible (≥80%)' : '⚠ Below 80% Threshold'}
          </div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Total Classes</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', margin: '6px 0' }}>
            {summary?.totalClasses || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Scheduled to date</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#10b981', textTransform: 'uppercase' }}>Present Sessions</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', margin: '6px 0' }}>
            {summary?.present || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>In-person lab & theory</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#ef4444', textTransform: 'uppercase' }}>Absences</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#ef4444', margin: '6px 0' }}>
            {summary?.absent || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Unexcused misses</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#f59e0b', textTransform: 'uppercase' }}>Late / Leaves</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', margin: '6px 0' }}>
            {(summary?.late || 0) + (summary?.leave || 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Approved leaves & tardies</div>
        </div>
      </div>

      {/* Detailed Log Table */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '16px' }}>Detailed Session Records</h3>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>Showing {records.length} sessions</span>
        </div>

        {records.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No recorded session logs available yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#0f172a', borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '14px 20px' }}>Date</th>
                  <th style={{ padding: '14px 20px' }}>Course / Topic</th>
                  <th style={{ padding: '14px 20px' }}>Trainer</th>
                  <th style={{ padding: '14px 20px' }}>Check-in</th>
                  <th style={{ padding: '14px 20px' }}>Check-out</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => {
                  const statusColor = r.status === 'PRESENT' ? '#10b981' : r.status === 'ABSENT' ? '#ef4444' : '#f59e0b';
                  return (
                    <tr key={r._id || idx} style={{ borderBottom: '1px solid #334155' }}>
                      <td style={{ padding: '14px 20px', color: '#f8fafc', fontWeight: 600 }}>
                        {new Date(r.date || Date.now()).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {r.courseId?.name || r.topic || 'Cosmetology Practical Lab'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94a3b8' }}>
                        {r.trainerId?.name || 'Academy Trainer'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {r.checkInTime || '10:02 AM'}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>
                        {r.checkOutTime || '01:05 PM'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                          {r.status || 'PRESENT'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
