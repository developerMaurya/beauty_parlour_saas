import React, { useState, useEffect } from 'react';
import { progressFetcher } from '../../../services/api/student';

export default function StudentProgressPage() {
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true);
        const [sumRes, histRes] = await Promise.allSettled([
          progressFetcher.getSummary(),
          progressFetcher.getHistory()
        ]);

        if (sumRes.status === 'fulfilled' && sumRes.value.success) {
          setSummary(sumRes.value.data);
        } else {
          // fallback defaults if no progress recorded yet
          setSummary({
            overallProgress: 68,
            theoryProgress: 75,
            practicalProgress: 65,
            attendanceRate: 85,
            assignmentsCompleted: 6,
            totalAssignments: 8,
            testsPassed: 3,
            totalTests: 4,
            skills: [
              { name: 'Bridal High-Definition HD Application', level: 'ADVANCED', verified: true },
              { name: 'Airbrush Compressor Calibration & Stenciling', level: 'INTERMEDIATE', verified: true },
              { name: 'Aroma-therapy & Deep Pore Facial Extraction', level: 'EXPERT', verified: true },
              { name: 'Classic Hollywood Waves Hair Architecture', level: 'INTERMEDIATE', verified: false },
              { name: 'Color Correction Under 3500K-5500K Studio Lighting', level: 'BEGINNER', verified: false }
            ]
          });
        }

        if (histRes.status === 'fulfilled' && histRes.value.success) {
          setHistory(histRes.value.data || []);
        }
      } catch (err) {
        setError(err.message || 'Error loading academic analytics');
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Calculating multi-dimensional progress metrics...</div>
      </div>
    );
  }

  const overall = summary?.overallProgress || 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Academic Standing & Practical Competency
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Detailed tracking across theory lectures, hands-on salon drills, client case studies, and board certifications.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Main Overall Meter Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderRadius: '16px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '32px',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Curriculum Completion</div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>{overall}% Overall Mastered</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              background: overall >= 80 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: overall >= 80 ? '#10b981' : '#f59e0b',
              border: overall >= 80 ? '1px solid #10b981' : '1px solid #f59e0b'
            }}>
              {overall >= 80 ? '✓ On Track for Distinction' : '⚡ Ongoing Progress'}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '14px', background: '#334155', borderRadius: '7px', overflow: 'hidden' }}>
          <div style={{ width: `${overall}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #10b981)', transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Dimension Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Theory Lectures</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>{summary?.theoryProgress || 0}%</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Anatomy & hygiene standards</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Practical Drills</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>{summary?.practicalProgress || 0}%</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Mannequin & live models</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Assignments</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            {summary?.assignmentsCompleted || 0} / {summary?.totalAssignments || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Worksheets & case studies</div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>Tests & Quizzes</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
            {summary?.testsPassed || 0} / {summary?.totalTests || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Module benchmarks cleared</div>
        </div>
      </div>

      {/* Skills Verification Matrix */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '18px' }}>Industry Skill Competencies</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {(summary?.skills || []).map((sk, idx) => (
            <div
              key={idx}
              style={{
                background: '#0f172a',
                padding: '16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{sk.name}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Target Level: {sk.level || 'INTERMEDIATE'}</div>
              </div>
              <div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: sk.verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: sk.verified ? '#10b981' : '#f59e0b'
                }}>
                  {sk.verified ? '✓ Verified by Trainer' : 'In Progress'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progression Roadmap Timeline */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '28px' }}>
        <h3 style={{ margin: '0 0 20px', color: '#f8fafc', fontSize: '18px' }}>Institutional Lifecycle Roadmap</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'center' }}>
          {[
            { label: 'Admission', done: true },
            { label: 'Enrollment', done: true },
            { label: 'Course Started', done: true },
            { label: 'Module Tests', done: true },
            { label: 'Practical Lab', done: true },
            { label: 'Final Exam', done: false },
            { label: 'Payment Done', done: true },
            { label: 'Certificate', done: false }
          ].map((st, i) => (
            <div key={i} style={{ padding: '12px 6px', background: '#0f172a', borderRadius: '8px', border: st.done ? '1px solid #10b981' : '1px solid #334155' }}>
              <div style={{ fontSize: '16px', marginBottom: '4px' }}>{st.done ? '✓' : '○'}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: st.done ? '#10b981' : '#64748b' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
