import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  courseFetcher,
  materialFetcher,
  progressFetcher,
  attendanceFetcher,
  certificateFetcher
} from '../../../api/student';

export default function StudentCourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCourseDetails() {
      try {
        setLoading(true);
        setError(null);
        const [cRes, mRes, matRes, pRes, attRes, certRes] = await Promise.allSettled([
          courseFetcher.getById(id),
          courseFetcher.getModules(id),
          materialFetcher.getAll({ courseId: id }),
          progressFetcher.getByCourse(id),
          attendanceFetcher.getSummary(),
          certificateFetcher.getAll()
        ]);

        if (cRes.status === 'fulfilled' && cRes.value.success) {
          setCourse(cRes.value.data);
        } else {
          setError('Failed to load course details');
        }

        if (mRes.status === 'fulfilled' && mRes.value.success) {
          setModules(mRes.value.data?.modules || mRes.value.data || []);
        }
        if (matRes.status === 'fulfilled' && matRes.value.success) {
          setMaterials(matRes.value.data || []);
        }
        if (pRes.status === 'fulfilled' && pRes.value.success) {
          setProgress(pRes.value.data);
        }
        if (attRes.status === 'fulfilled' && attRes.value.success) {
          setAttendance(attRes.value.data);
        }
        if (certRes.status === 'fulfilled' && certRes.value.success) {
          setCertificates(certRes.value.data || []);
        }
      } catch (err) {
        setError(err.message || 'Error loading course details');
      } finally {
        setLoading(false);
      }
    }
    loadCourseDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Loading comprehensive course details...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', color: '#fca5a5' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Course Not Found</div>
        <div>{error || 'Unable to retrieve course information.'}</div>
        <Link to="/student/courses" style={{ display: 'inline-block', marginTop: '16px', color: '#f59e0b', textDecoration: 'none' }}>
          ← Back to All Courses
        </Link>
      </div>
    );
  }

  const courseCert = certificates.find(c => c.courseId?._id === id || c.courseId === id);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: '#3b82f6', color: '#fff', fontWeight: 600 }}>
                {course.code || 'CRS'}
              </span>
              <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', color: '#cbd5e1' }}>
                {course.category || 'Beauty & Wellness'}
              </span>
              <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: course.status === 'ACTIVE' ? '#10b981' : '#64748b', color: '#fff', fontWeight: 600 }}>
                {course.status || 'ACTIVE'}
              </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{course.name}</h1>
            <p style={{ margin: '8px 0 0', color: '#94a3b8', maxWidth: '700px', fontSize: '14px', lineHeight: 1.5 }}>
              {course.description || 'Master hands-on salon artistry, theory, and professional client consultations.'}
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8' }}>Total Course Fee</div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>
              ₹{course.fee?.toLocaleString() || 0}
            </div>
            <Link
              to={`/student/purchase?courseId=${course._id}`}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                fontWeight: 700,
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}
            >
              Enroll / Purchase Now
            </Link>
          </div>
        </div>

        {/* Quick Highlights Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Duration</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{course.duration} {course.durationUnit || 'Weeks'}</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Total Classes</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{course.totalClasses || 48} sessions</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Theory vs Practical</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{course.theoryHours || 20}h Theory / {course.practicalHours || 60}h Practical</div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Certificate</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>{course.certificateEligibility ? 'Included' : 'Available'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { key: 'overview', label: '📖 Overview' },
          { key: 'curriculum', label: `📚 Curriculum (${modules.length})` },
          { key: 'materials', label: `📁 Materials (${materials.length})` },
          { key: 'progress', label: '📈 Progress & Skills' },
          { key: 'attendance', label: '🗓 Attendance' },
          { key: 'certificate', label: '🎓 Certificate' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px 8px 0 0',
              border: 'none',
              background: activeTab === tab.key ? '#1e293b' : 'transparent',
              color: activeTab === tab.key ? '#f59e0b' : '#94a3b8',
              fontWeight: activeTab === tab.key ? 700 : 500,
              cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #f59e0b' : '2px solid transparent',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Course Description & Goals</h3>
            <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '14px' }}>
              {course.description || 'Comprehensive training curriculum providing hands-on masterclasses, industry-standard hygiene protocols, tool handling, and salon operational excellence.'}
            </p>
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f59e0b', marginBottom: '8px' }}>Key Skills Covered:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(course.skills || ['Bridal Makeup', 'Airbrush', 'Hair Styling', 'Skin Anatomy', 'Client Consultation']).map((s, idx) => (
                  <span key={idx} style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '12px', padding: '4px 10px', borderRadius: '20px' }}>
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Training & Location</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
              <div>
                <span style={{ color: '#94a3b8' }}>Trainer: </span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{course.trainerId?.name || 'Senior Academy Instructor'}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Campus Branch: </span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{course.branchId?.name || 'Main Academy Campus'}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Prerequisites: </span>
                <span style={{ color: '#f8fafc' }}>{course.prerequisites || 'None. Beginners and intermediate artists welcome.'}</span>
              </div>
              <div>
                <span style={{ color: '#94a3b8' }}>Class Capacity: </span>
                <span style={{ color: '#f8fafc' }}>Maximum 15 Students (Individual Workstations)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Curriculum Modules */}
      {activeTab === 'curriculum' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {modules.length === 0 ? (
            <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8' }}>
              No modules listed yet for this course.
            </div>
          ) : (
            modules.map((mod, idx) => (
              <div key={mod._id || idx} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f59e0b', color: '#000', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                      {idx + 1}
                    </span>
                    <h4 style={{ margin: 0, fontSize: '16px', color: '#f8fafc' }}>{mod.name || mod.title}</h4>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>{mod.durationHours || 12} Hours</span>
                </div>
                <p style={{ margin: '0 0 12px', color: '#94a3b8', fontSize: '13px' }}>{mod.description || 'Hands-on practical demonstration and supervised lab drills.'}</p>
                {mod.topics && mod.topics.length > 0 && (
                  <div style={{ paddingLeft: '40px', borderLeft: '2px solid #334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {mod.topics.map((t, tIdx) => (
                      <div key={tIdx} style={{ fontSize: '13px', color: '#cbd5e1' }}>
                        • {typeof t === 'string' ? t : (t.title || t.name)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Materials */}
      {activeTab === 'materials' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {materials.length === 0 ? (
            <div style={{ background: '#1e293b', padding: '32px', borderRadius: '12px', textAlign: 'center', color: '#94a3b8', gridColumn: '1 / -1' }}>
              No study materials uploaded for this course yet.
            </div>
          ) : (
            materials.map((mat, idx) => (
              <div key={mat._id || idx} style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📄</div>
                <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '15px' }}>{mat.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 12px' }}>{mat.type || 'PDF Document'} • {mat.size || '2.4 MB'}</div>
                <a
                  href={mat.fileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-block', padding: '6px 14px', background: '#334155', color: '#f8fafc', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}
                >
                  Download / View Resource
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 4: Progress & Skills */}
      {activeTab === 'progress' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 20px', color: '#f8fafc' }}>Your Progress in this Course</h3>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#cbd5e1' }}>Overall Completion</span>
              <span style={{ fontWeight: 700, color: '#f59e0b' }}>{progress?.overallProgress || 0}%</span>
            </div>
            <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${progress?.overallProgress || 0}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #10b981)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Theory Progress</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: '4px 0' }}>{progress?.theoryProgress || 0}%</div>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Practical Progress</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: '4px 0' }}>{progress?.practicalProgress || 0}%</div>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Assignments</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f8fafc', margin: '4px 0' }}>{progress?.assignmentsCompleted || 0} Done</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Attendance */}
      {activeTab === 'attendance' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Attendance Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Classes</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>{attendance?.totalClasses || 0}</div>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#10b981' }}>Present</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#10b981' }}>{attendance?.present || 0}</div>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#ef4444' }}>Absent</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444' }}>{attendance?.absent || 0}</div>
            </div>
            <div style={{ background: '#0f172a', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '12px', color: '#f59e0b' }}>Attendance %</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#f59e0b' }}>{attendance?.attendancePercentage || 0}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Certificate */}
      {activeTab === 'certificate' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
          <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Certification Status</h3>
          {courseCert ? (
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '20px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>CERTIFICATE ISSUED</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '4px 0' }}>{courseCert.certificateNumber}</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Issued on: {new Date(courseCert.issueDate).toLocaleDateString()}</div>
                </div>
                <Link
                  to={`/student/certificates/${courseCert._id}`}
                  style={{ background: '#10b981', color: '#000', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, textDecoration: 'none' }}
                >
                  View & Download
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#fbbf24', marginBottom: '8px' }}>Certificate In Progress</div>
              <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                To earn your completion diploma for <strong>{course.name}</strong>, complete at least 80% of practical classes, pass all exams, and ensure fees are cleared.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
