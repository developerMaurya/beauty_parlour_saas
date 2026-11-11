import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentFetcher } from '../../../services/api/student';

export default function StudentAssignmentDetailPage() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [notes, setNotes] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [asgRes, subRes] = await Promise.allSettled([
        assignmentFetcher.getById(id),
        assignmentFetcher.getResult(id)
      ]);

      if (asgRes.status === 'fulfilled' && asgRes.value.success) {
        setAssignment(asgRes.value.data);
      } else {
        setError('Assignment not found');
      }

      if (subRes.status === 'fulfilled' && subRes.value.success) {
        setSubmission(subRes.value.data);
        if (subRes.value.data) {
          setNotes(subRes.value.data.notes || '');
          setFileUrl(subRes.value.data.fileUrl || '');
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching assignment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await assignmentFetcher.submit(id, { notes, fileUrl });
      if (res.success) {
        setSuccess('Assignment successfully submitted for evaluation!');
        loadData();
      } else {
        setError(res.message || 'Failed to submit assignment');
      }
    } catch (err) {
      setError(err.message || 'Submission error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Loading assignment details...</div>
      </div>
    );
  }

  if (error && !assignment) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', color: '#fca5a5' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Assignment Not Found</div>
        <div>{error}</div>
        <Link to="/student/assignments" style={{ display: 'inline-block', marginTop: '16px', color: '#f59e0b', textDecoration: 'none' }}>
          ← Back to All Assignments
        </Link>
      </div>
    );
  }

  const isEvaluated = submission?.status === 'EVALUATED' || assignment.status === 'EVALUATED';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/student/assignments" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
          ← Back to Assignments List
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#f8fafc' }}>{assignment.title}</h1>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '20px',
            background: isEvaluated ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            color: isEvaluated ? '#10b981' : '#f59e0b'
          }}>
            {submission?.status || assignment.status || 'PENDING'}
          </span>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '14px', color: '#6ee7b7', marginBottom: '20px' }}>
          {success}
        </div>
      )}

      {/* Assignment Brief */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 12px', color: '#f8fafc', fontSize: '16px' }}>Assignment Instructions & Scope</h3>
        <p style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '14px', margin: '0 0 20px' }}>
          {assignment.description || 'Complete hands-on client consultation sheet, capture high-definition portfolio photographs under natural light, and detail product formulations used.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', paddingTop: '16px', borderTop: '1px solid #334155', fontSize: '13px' }}>
          <div>
            <span style={{ color: '#94a3b8' }}>Maximum Marks: </span>
            <strong style={{ color: '#f8fafc' }}>{assignment.maxMarks || 100} Points</strong>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Submission Deadline: </span>
            <span style={{ color: '#f59e0b', fontWeight: 600 }}>{new Date(assignment.dueDate || Date.now()).toLocaleDateString()}</span>
          </div>
          <div>
            <span style={{ color: '#94a3b8' }}>Trainer: </span>
            <span style={{ color: '#cbd5e1' }}>{assignment.trainerId?.name || 'Chief Evaluator'}</span>
          </div>
        </div>
      </div>

      {/* Trainer Evaluation Rubric & Feedback (if evaluated) */}
      {isEvaluated && (
        <div style={{ background: 'rgba(16, 185, 129, 0.08)', borderRadius: '14px', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3 style={{ margin: 0, color: '#10b981', fontSize: '16px' }}>Evaluator Review & Score</h3>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#10b981' }}>
              {submission?.marks || assignment.marksObtained || 92} / {assignment.maxMarks || 100}
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.5 }}>
            <strong>Instructor Feedback:</strong>
            <p style={{ margin: '6px 0 0', color: '#f8fafc' }}>
              {submission?.feedback || assignment.feedback || 'Excellent execution of foundation blending and contour precision. Hygiene protocols adhered to strictly.'}
            </p>
          </div>
        </div>
      )}

      {/* Submission Form / View */}
      <div style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px' }}>
        <h3 style={{ margin: '0 0 16px', color: '#f8fafc', fontSize: '16px' }}>
          {submission ? 'Your Submission' : 'Submit Assignment'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
              Submission Notes / Case Summary
            </label>
            <textarea
              rows="4"
              required
              disabled={isEvaluated}
              placeholder="Describe your process, shade matching techniques, and skin preparation steps..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
              Portfolio Link / Drive Attachment URL
            </label>
            <input
              type="text"
              required
              disabled={isEvaluated}
              placeholder="https://drive.google.com/... or portfolio photo link"
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', boxSizing: 'border-box' }}
            />
          </div>

          {!isEvaluated && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  fontWeight: 700,
                  padding: '12px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer'
                }}
              >
                {submitting ? 'Submitting...' : submission ? 'Update Submission' : 'Turn In Assignment'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
