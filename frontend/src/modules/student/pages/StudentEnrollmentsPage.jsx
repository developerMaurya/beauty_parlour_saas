import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentFetcher } from '../../../services/api/student';

export default function StudentEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL');

  useEffect(() => {
    async function loadEnrollments() {
      try {
        setLoading(true);
        const res = await enrollmentFetcher.getAll();
        if (res.success) {
          setEnrollments(res.data || []);
        } else {
          setError(res.message || 'Failed to load enrollments');
        }
      } catch (err) {
        setError(err.message || 'Error fetching enrollment records');
      } finally {
        setLoading(false);
      }
    }
    loadEnrollments();
  }, []);

  const filtered = enrollments.filter(e => {
    if (filterStatus === 'ALL') return true;
    return e.status === filterStatus;
  });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Loading academic enrollments...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            My Course Enrollments
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Official institutional registrations, academic timelines, and course standing.
          </p>
        </div>

        <Link
          to="/student/courses"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000',
            fontWeight: 700,
            padding: '10px 20px',
            borderRadius: '8px',
            textDecoration: 'none'
          }}
        >
          + Enroll New Course
        </Link>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'PAUSED'].map(st => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              background: filterStatus === st ? '#f59e0b' : '#1e293b',
              color: filterStatus === st ? '#000' : '#94a3b8',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc', marginBottom: '4px' }}>No Enrollments Found</div>
          <div style={{ fontSize: '13px' }}>You do not currently have any enrollments matching "{filterStatus}".</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(enr => {
            const courseName = enr.courseId?.name || 'Cosmetology Professional Track';
            const planName = enr.planId?.name || 'Standard Diploma';
            const statusColor = enr.status === 'ACTIVE' ? '#10b981' : enr.status === 'COMPLETED' ? '#3b82f6' : '#f59e0b';

            return (
              <div
                key={enr._id}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                      {enr.status}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                      REG #{enr.enrollmentNumber || enr._id.slice(-6).toUpperCase()}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#f8fafc' }}>{courseName}</h3>
                  <div style={{ fontSize: '13px', color: '#f59e0b', marginBottom: '16px' }}>{planName}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                    <div>
                      <span>Branch: </span>
                      <strong style={{ color: '#cbd5e1' }}>{enr.branchId?.name || 'Main Campus'}</strong>
                    </div>
                    <div>
                      <span>Start Date: </span>
                      <span style={{ color: '#cbd5e1' }}>{new Date(enr.startDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span>Expected Completion: </span>
                      <span style={{ color: '#cbd5e1' }}>{new Date(enr.expectedEndDate || Date.now()).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link
                    to={`/student/enrollments/${enr._id}`}
                    style={{
                      background: '#334155',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    View Timeline & Status →
                  </Link>
                  <Link
                    to={`/student/courses/${enr.courseId?._id || enr.courseId || ''}`}
                    style={{
                      color: '#f59e0b',
                      fontSize: '13px',
                      fontWeight: 600,
                      textDecoration: 'none'
                    }}
                  >
                    Open Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
