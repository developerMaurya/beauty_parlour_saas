import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentFetcher } from '../../../api/student';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAssignments() {
      try {
        setLoading(true);
        const res = await assignmentFetcher.getAll();
        if (res.success) {
          setAssignments(res.data || []);
        } else {
          setError(res.message || 'Failed to load assignments');
        }
      } catch (err) {
        setError(err.message || 'Error fetching assignments');
      } finally {
        setLoading(false);
      }
    }
    loadAssignments();
  }, []);

  const filtered = assignments.filter(a => {
    if (filter === 'ALL') return true;
    return a.status === filter;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Course Assignments & Practical Case Studies
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Mandatory hands-on lab submissions, client lookbooks, and theory reflection assessments.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'PENDING', 'SUBMITTED', 'EVALUATED', 'LATE'].map(st => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              border: 'none',
              background: filter === st ? '#f59e0b' : '#1e293b',
              color: filter === st ? '#000' : '#94a3b8',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading assignments...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Assignments Listed</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>There are currently no assignments matching "{filter}".</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(asg => {
            const statusColor = asg.status === 'EVALUATED' ? '#10b981' : asg.status === 'SUBMITTED' ? '#3b82f6' : asg.status === 'LATE' ? '#ef4444' : '#f59e0b';
            return (
              <div
                key={asg._id}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                      {asg.status || 'PENDING'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Due: {new Date(asg.dueDate || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '17px', color: '#f8fafc' }}>{asg.title}</h3>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                    Course: <strong style={{ color: '#f59e0b' }}>{asg.courseId?.name || 'Professional Diploma'}</strong> • Module: {asg.moduleId?.name || 'Practical Lab'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {asg.marksObtained !== undefined && asg.marksObtained !== null && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Score Awarded</div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>
                        {asg.marksObtained} / {asg.maxMarks || 100}
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/student/assignments/${asg._id}`}
                    style={{
                      background: asg.status === 'PENDING' ? '#f59e0b' : '#334155',
                      color: asg.status === 'PENDING' ? '#000' : '#f8fafc',
                      fontWeight: 700,
                      padding: '10px 18px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                  >
                    {asg.status === 'PENDING' ? 'Submit Assignment →' : 'View Submission →'}
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
