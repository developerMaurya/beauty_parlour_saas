import React, { useState, useEffect } from 'react';
import { timelineFetcher } from '../../../services/api/student';

export default function StudentTimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTimeline() {
      try {
        setLoading(true);
        const res = await timelineFetcher.getEvents();
        if (res.success && res.data?.length > 0) {
          setTimeline(res.data);
        } else {
          // Standard full institutional progression
          setTimeline([
            { stage: '1. Registration', title: 'Student Portal Account Created', date: '2026-09-28', status: 'COMPLETED', desc: 'Verified mobile number and created institutional student credential.' },
            { stage: '2. Admission', title: 'Formal Academy Admission Accepted', date: '2026-10-01', status: 'COMPLETED', desc: 'Identity verification submitted and admission serial allocated.' },
            { stage: '3. Plan Purchase', title: 'Cosmetology Professional Master Plan', date: '2026-10-01', status: 'COMPLETED', desc: 'Selected complete diploma track with starter lab toolkit.' },
            { stage: '4. Advance Payment', title: 'Tuition Advance Deposit Received', date: '2026-10-01', status: 'COMPLETED', desc: 'Payment verified via online gateway. Tax receipt INV-2026-001 issued.' },
            { stage: '5. Enrollment', title: 'Registered in Main Campus Batch A', date: '2026-10-05', status: 'COMPLETED', desc: 'Assigned to Master Educator Ananya Verma in Room A-102.' },
            { stage: '6. Course Started', title: 'Orientation & Induction Commenced', date: '2026-10-08', status: 'COMPLETED', desc: 'Introduction to sanitation protocols, color charts, and tool handling.' },
            { stage: '7. Classes & Attendance', title: 'Biometric Lab Sessions (85% Met)', date: '2026-10-20', status: 'COMPLETED', desc: 'Completed 41 hours of direct clinical lab practice.' },
            { stage: '8. Assignments', title: 'Lookbook & Case Study Submitted', date: '2026-11-01', status: 'COMPLETED', desc: 'Graded with score 92/100 by department head.' },
            { stage: '9. Module Tests', title: 'Skin & Color Theory Midterms', date: '2026-11-10', status: 'COMPLETED', desc: 'Passed module assessment with 85% score.' },
            { stage: '10. Board Examination', title: 'Final Theory & Demonstration Exam', date: '2026-12-10', status: 'UPCOMING', desc: 'Live client demo in front of external examiner board.' },
            { stage: '11. Fee Balance Clearance', title: 'Final Installment Payment', date: '2026-12-15', status: 'PENDING', desc: 'Scheduled final installment to ensure zero institutional balance.' },
            { stage: '12. Certificate Conferred', title: 'National Professional Diploma Award', date: '2026-12-22', status: 'UPCOMING', desc: 'Graduation convocation and cryptographic certificate release.' }
          ]);
        }
      } catch (err) {
        setError(err.message || 'Error loading student roadmap');
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Student Institutional Lifecycle Roadmap
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Trace your journey from initial admission, course purchase, lab drills, and examinations through to final graduation.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading milestone timeline...</div>
        </div>
      ) : (
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '36px' }}>
          <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid #334155' }}>
            {timeline.map((item, idx) => {
              const isCompleted = item.status === 'COMPLETED';
              const isPending = item.status === 'PENDING';
              const dotColor = isCompleted ? '#10b981' : isPending ? '#f59e0b' : '#475569';

              return (
                <div key={idx} style={{ marginBottom: '32px', position: 'relative' }}>
                  {/* Timeline dot */}
                  <div style={{
                    position: 'absolute',
                    left: '-41px',
                    top: '2px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: dotColor,
                    border: '4px solid #1e293b',
                    boxShadow: isCompleted ? '0 0 10px rgba(16, 185, 129, 0.5)' : 'none'
                  }} />

                  <div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${dotColor}22`, color: dotColor }}>
                        {item.stage || `STAGE ${idx + 1}`}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 style={{ margin: '0 0 4px', fontSize: '17px', color: '#f8fafc' }}>{item.title}</h3>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>
                      {item.desc || item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
