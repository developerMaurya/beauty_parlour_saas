import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { testFetcher } from '../../../services/api/student';

export default function StudentTestsExamsPage() {
  const [tab, setTab] = useState('tests');
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAssessments() {
      try {
        setLoading(true);
        const res = tab === 'tests' ? await testFetcher.getAll() : await testFetcher.getAllExams();
        if (res.success) {
          setTests(res.data || []);
        } else {
          setError(res.message || 'Failed to load assessments');
        }
      } catch (err) {
        setError(err.message || 'Error fetching assessments');
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();
  }, [tab]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Academic Tests & Board Examinations
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Formal module pop-quizzes, midterms, and final diploma certification exams.
          </p>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', background: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155' }}>
          <button
            onClick={() => setTab('tests')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'tests' ? '#f59e0b' : 'transparent',
              color: tab === 'tests' ? '#000' : '#94a3b8',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Module Tests
          </button>
          <button
            onClick={() => setTab('exams')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'exams' ? '#f59e0b' : 'transparent',
              color: tab === 'exams' ? '#000' : '#94a3b8',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Final Board Exams
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading assessment catalog...</div>
        </div>
      ) : tests.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>✍️</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Assessments Active</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>There are currently no active {tab} scheduled for your enrolled tracks.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {tests.map(t => {
            const isPassed = t.obtainedMarks !== undefined && t.obtainedMarks >= (t.passingMarks || 40);
            return (
              <div
                key={t._id}
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
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                      {t.durationMinutes || 45} MINS
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Passing: {t.passingMarks || 40}%
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '18px', color: '#f8fafc' }}>{t.title}</h3>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '14px' }}>
                    Course: <strong style={{ color: '#cbd5e1' }}>{t.courseId?.name || 'Cosmetology'}</strong>
                  </div>

                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px' }}>
                    {t.description || 'Comprehensive evaluation covering safety protocols, color theory, skin tone analysis, and tools.'}
                  </p>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {t.obtainedMarks !== undefined ? (
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Status</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: isPassed ? '#10b981' : '#ef4444' }}>
                        {isPassed ? `PASSED (${t.obtainedMarks}%)` : `FAILED (${t.obtainedMarks}%)`}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 600 }}>
                      Pending Attempt
                    </div>
                  )}

                  <Link
                    to={tab === 'tests' ? `/student/tests/${t._id}` : `/student/exams/${t._id}`}
                    style={{
                      background: t.obtainedMarks !== undefined ? '#334155' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: t.obtainedMarks !== undefined ? '#f8fafc' : '#000',
                      fontWeight: 700,
                      padding: '8px 18px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                  >
                    {t.obtainedMarks !== undefined ? 'View Result' : 'Start Test →'}
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
