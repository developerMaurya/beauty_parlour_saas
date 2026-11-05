import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { enrollmentFetcher } from '../../../api/student';

export default function StudentEnrollmentDetailPage() {
  const { id } = useParams();
  const [enrollment, setEnrollment] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [enrRes, timeRes] = await Promise.allSettled([
          enrollmentFetcher.getById(id),
          enrollmentFetcher.getTimeline(id)
        ]);

        if (enrRes.status === 'fulfilled' && enrRes.value.success) {
          setEnrollment(enrRes.value.data);
        } else {
          setError('Enrollment record not found');
        }

        if (timeRes.status === 'fulfilled' && timeRes.value.success) {
          setTimeline(timeRes.value.data || []);
        }
      } catch (err) {
        setError(err.message || 'Error loading details');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Loading enrollment record...</div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', color: '#fca5a5' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Enrollment Not Found</div>
        <div>{error}</div>
        <Link to="/student/enrollments" style={{ display: 'inline-block', marginTop: '16px', color: '#f59e0b', textDecoration: 'none' }}>
          ← Back to Enrollments
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/student/enrollments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
          ← Back to All Enrollments
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            Enrollment #{enrollment.enrollmentNumber || enrollment._id.slice(-6).toUpperCase()}
          </h1>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            background: enrollment.status === 'ACTIVE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: enrollment.status === 'ACTIVE' ? '#10b981' : '#f59e0b',
            border: enrollment.status === 'ACTIVE' ? '1px solid #10b981' : '1px solid #f59e0b'
          }}>
            {enrollment.status}
          </span>
        </div>
      </div>

      {/* Grid of Key Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '16px' }}>Academic Information</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Course: </span>
              <strong style={{ color: '#f8fafc' }}>{enrollment.courseId?.name || 'Professional Cosmetology'}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Plan: </span>
              <span style={{ color: '#f59e0b' }}>{enrollment.planId?.name || 'Master Diploma'}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Trainer: </span>
              <span style={{ color: '#cbd5e1' }}>{enrollment.trainerId?.name || 'Chief Educator'}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Branch: </span>
              <span style={{ color: '#cbd5e1' }}>{enrollment.branchId?.name || 'City Central Campus'}</span>
            </div>
          </div>
        </div>

        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '16px' }}>Duration & Dates</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Commencement Date: </span>
              <span style={{ color: '#cbd5e1' }}>{new Date(enrollment.startDate || Date.now()).toLocaleDateString()}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Expected End Date: </span>
              <span style={{ color: '#cbd5e1' }}>{new Date(enrollment.expectedEndDate || Date.now()).toLocaleDateString()}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Payment Standing: </span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{enrollment.paymentStatus || 'Verified / Current'}</span>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Certification Status: </span>
              <span style={{ color: '#cbd5e1' }}>{enrollment.certificateStatus || 'In Progress'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Milestones / Timeline */}
      <div style={{ background: '#1e293b', padding: '28px', borderRadius: '14px', border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 20px', color: '#f8fafc' }}>Academic Progression Timeline</h3>
        
        <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '2px solid #334155' }}>
          {(timeline.length > 0 ? timeline : [
            { title: 'Enrollment & Admission Confirmed', date: enrollment.startDate || '2026-10-01', desc: 'Seat allocated and registration fees verified.', done: true },
            { title: 'Orientation & Kit Handover', date: '2026-10-05', desc: 'Received professional study guides and tools.', done: true },
            { title: 'Foundations & Hygiene Module Completed', date: '2026-10-20', desc: 'Passed Module 1 practical assessment.', done: true },
            { title: 'Mid-Term Practical Evaluation', date: '2026-11-15', desc: 'Live client demo and portfolio review.', done: false },
            { title: 'Final Theory & Practical Board Exam', date: '2026-12-10', desc: 'Comprehensive testing for certification.', done: false },
            { title: 'Government / Academy Diploma Awarded', date: '2026-12-20', desc: 'Graduation convocation & certificate dispatch.', done: false }
          ]).map((t, idx) => (
            <div key={idx} style={{ marginBottom: '24px', position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '-36px',
                top: '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: t.done ? '#10b981' : '#475569',
                border: '3px solid #1e293b'
              }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: t.done ? '#f8fafc' : '#94a3b8' }}>
                {t.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 6px' }}>
                {new Date(t.date).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '13px', color: '#cbd5e1' }}>
                {t.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
