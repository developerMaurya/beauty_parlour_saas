import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { testFetcher } from '../../../services/api/student';

export default function StudentTestExamDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const isExam = location.pathname.includes('/exams/');

  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 mins default
  const [started, setStarted] = useState(false);

  useEffect(() => {
    async function loadTest() {
      try {
        setLoading(true);
        const res = isExam ? await testFetcher.getExamById(id) : await testFetcher.getById(id);
        if (res.success) {
          setTest(res.data);
          if (res.data?.durationMinutes) {
            setTimeLeft(res.data.durationMinutes * 60);
          }
          if (res.data?.result || res.data?.obtainedMarks !== undefined) {
            setResult(res.data.result || {
              obtainedMarks: res.data.obtainedMarks,
              totalMarks: res.data.totalMarks || 100,
              passed: res.data.obtainedMarks >= (res.data.passingMarks || 40)
            });
          }
        } else {
          setError(res.message || 'Failed to load test paper');
        }
      } catch (err) {
        setError(err.message || 'Error fetching test');
      } finally {
        setLoading(false);
      }
    }
    loadTest();
  }, [id, isExam]);

  // Timer countdown
  useEffect(() => {
    if (!started || result || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [started, result, timeLeft]);

  const handleSelectAnswer = (qIndex, optIndex) => {
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await testFetcher.submit(id, { answers });
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.message || 'Failed to grade submission');
      }
    } catch (err) {
      setError(err.message || 'Error grading test');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Loading assessment environment...</div>
      </div>
    );
  }

  if (error && !test) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', color: '#fca5a5' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Test Not Found</div>
        <div>{error}</div>
        <Link to="/student/tests" style={{ display: 'inline-block', marginTop: '16px', color: '#f59e0b', textDecoration: 'none' }}>
          ← Back to Tests & Exams
        </Link>
      </div>
    );
  }

  // Sample default questions if test has none configured in DB
  const questions = test?.questions?.length > 0 ? test.questions : [
    {
      q: 'Which color neutralizing base is used to counteract unwanted yellow undertones in hair or skin tone correction?',
      options: ['Violet / Purple', 'Green', 'Orange', 'Yellow']
    },
    {
      q: 'What is the standard required sanitization sterilization standard for reusable metal esthetic tools?',
      options: ['Autoclave or Hospital-grade EPA disinfectant', 'Hot tap water rinse', 'Paper towel wipe', 'Alcohol spritz only']
    },
    {
      q: 'Which layer of human skin is responsible for providing elasticity and collagen structural support?',
      options: ['Dermis', 'Epidermis (Stratum Corneum)', 'Hypodermis', 'Subcutaneous adipose']
    }
  ];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/student/tests" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to Assessments
          </Link>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '8px 0 2px', color: '#f8fafc' }}>{test.title}</h1>
          <div style={{ fontSize: '13px', color: '#f59e0b' }}>
            Course: {test.courseId?.name || 'Professional Cosmetology Track'}
          </div>
        </div>

        {started && !result && (
          <div style={{
            background: '#0f172a',
            border: '2px solid #f59e0b',
            borderRadius: '10px',
            padding: '10px 18px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Time Remaining</div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: timeLeft < 300 ? '#ef4444' : '#f59e0b' }}>
              {formatTime(timeLeft)}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Result Card */}
      {result ? (
        <div style={{
          background: result.passed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${result.passed ? '#10b981' : '#ef4444'}`,
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: result.passed ? '#10b981' : '#ef4444',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 16px'
          }}>
            {result.passed ? '✓' : '✕'}
          </div>
          <h2 style={{ color: '#f8fafc', margin: '0 0 8px' }}>
            {result.passed ? 'Assessment Passed!' : 'Assessment Not Passed'}
          </h2>
          <div style={{ fontSize: '32px', fontWeight: 800, color: result.passed ? '#10b981' : '#ef4444', margin: '8px 0' }}>
            Score: {result.obtainedMarks || 85}%
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '500px', margin: '0 auto 24px' }}>
            {result.passed
              ? 'Great job! Your score meets institutional diploma requirements.'
              : 'You did not achieve the minimum passing score. You may schedule a re-test with your instructor.'}
          </p>
          <Link
            to="/student/tests"
            style={{
              display: 'inline-block',
              background: '#334155',
              color: '#f8fafc',
              fontWeight: 600,
              padding: '10px 24px',
              borderRadius: '8px',
              textDecoration: 'none'
            }}
          >
            ← Return to Assessments
          </Link>
        </div>
      ) : !started ? (
        /* Start Screen */
        <div style={{ background: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
          <h2 style={{ color: '#f8fafc', margin: '0 0 8px' }}>Ready to Begin?</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '540px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            This assessment contains {questions.length} questions. You will have {Math.round(timeLeft / 60)} minutes to complete and submit your answers. Please ensure an uninterrupted session.
          </p>

          <div style={{ display: 'inline-flex', gap: '24px', background: '#0f172a', padding: '16px 28px', borderRadius: '10px', marginBottom: '28px', textAlign: 'left', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>Total Questions: </span>
              <strong style={{ color: '#f8fafc' }}>{questions.length}</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Passing Score: </span>
              <strong style={{ color: '#10b981' }}>{test.passingMarks || 40}%</strong>
            </div>
            <div>
              <span style={{ color: '#94a3b8' }}>Format: </span>
              <strong style={{ color: '#cbd5e1' }}>Multiple Choice</strong>
            </div>
          </div>

          <div>
            <button
              onClick={() => setStarted(true)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                fontWeight: 800,
                fontSize: '16px',
                padding: '14px 36px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.3)'
              }}
            >
              Start Assessment Now →
            </button>
          </div>
        </div>
      ) : (
        /* Questions list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((qObj, qIdx) => (
            <div key={qIdx} style={{ background: '#1e293b', borderRadius: '14px', border: '1px solid #334155', padding: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: answers[qIdx] !== undefined ? '#10b981' : '#334155',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {qIdx + 1}
                </span>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', lineHeight: 1.5 }}>
                  {qObj.q}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '40px' }}>
                {qObj.options.map((opt, oIdx) => {
                  const isSelected = answers[qIdx] === oIdx;
                  return (
                    <div
                      key={oIdx}
                      onClick={() => handleSelectAnswer(qIdx, oIdx)}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(245, 158, 11, 0.15)' : '#0f172a',
                        border: isSelected ? '1px solid #f59e0b' : '1px solid #334155',
                        color: isSelected ? '#fbbf24' : '#cbd5e1',
                        cursor: 'pointer',
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <input
                        type="radio"
                        name={`question-${qIdx}`}
                        checked={isSelected}
                        onChange={() => {}}
                        style={{ accentColor: '#f59e0b' }}
                      />
                      <span>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button
              disabled={submitting}
              onClick={handleSubmit}
              style={{
                background: submitting ? '#475569' : 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '15px',
                padding: '14px 36px',
                borderRadius: '8px',
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
              }}
            >
              {submitting ? 'Submitting & Grading...' : 'Submit Assessment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
