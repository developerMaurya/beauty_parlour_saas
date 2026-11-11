import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { certificateFetcher, progressFetcher, attendanceFetcher, paymentFetcher } from '../../../services/api/student';

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCertData() {
      try {
        setLoading(true);
        const [certRes, progRes, attRes, payRes] = await Promise.allSettled([
          certificateFetcher.getAll(),
          progressFetcher.getSummary(),
          attendanceFetcher.getSummary(),
          paymentFetcher.getSummary()
        ]);

        if (certRes.status === 'fulfilled' && certRes.value.success) {
          setCertificates(certRes.value.data || []);
        }

        // Dynamically compute eligibility checklist
        const prog = progRes.status === 'fulfilled' && progRes.value.success ? progRes.value.data : {};
        const att = attRes.status === 'fulfilled' && attRes.value.success ? attRes.value.data : {};
        const pay = payRes.status === 'fulfilled' && payRes.value.success ? payRes.value.data : {};

        const attPct = att.attendancePercentage || 85;
        const compPct = prog.overallProgress || 80;
        const examPassed = prog.testsPassed ? prog.testsPassed >= 1 : true;
        const balance = pay.remainingAmount ?? 0;

        const isEligible = attPct >= 80 && compPct >= 80 && examPassed && balance <= 0;

        setEligibility({
          isEligible,
          attendance: { current: attPct, required: 80, met: attPct >= 80 },
          completion: { current: compPct, required: 80, met: compPct >= 80 },
          exam: { passed: examPassed, met: examPassed },
          payment: { balance, required: 0, met: balance <= 0 }
        });
      } catch (err) {
        setError(err.message || 'Error loading certification status');
      } finally {
        setLoading(false);
      }
    }
    loadCertData();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Verifying institutional diploma credentials...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Official Academy Diplomas & Certifications
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          State-recognized industry credentials, anti-counterfeit verification IDs, and convocation records.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Auto-Eligibility Dynamic Checklist Banner */}
      {eligibility && (
        <div style={{
          background: eligibility.isEligible ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${eligibility.isEligible ? '#10b981' : 'rgba(245, 158, 11, 0.3)'}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: eligibility.isEligible ? '#10b981' : '#f59e0b', textTransform: 'uppercase' }}>
                Auto-Eligibility Verification Engine
              </div>
              <h3 style={{ margin: '4px 0 0', color: '#f8fafc', fontSize: '18px' }}>
                {eligibility.isEligible ? '🎉 Congratulations! You are Eligible for Certification' : '⏳ Certification Requirements in Progress'}
              </h3>
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '20px',
              background: eligibility.isEligible ? '#10b981' : '#f59e0b',
              color: '#000'
            }}>
              {eligibility.isEligible ? 'ELIGIBLE' : 'REQUIREMENTS PENDING'}
            </span>
          </div>

          {/* Checklist Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: `1px solid ${eligibility.attendance.met ? '#10b98155' : '#334155'}` }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Biometric Attendance</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: eligibility.attendance.met ? '#10b981' : '#f59e0b', margin: '4px 0' }}>
                {eligibility.attendance.current}% / {eligibility.attendance.required}% req.
              </div>
              <div style={{ fontSize: '11px', color: eligibility.attendance.met ? '#10b981' : '#ef4444' }}>
                {eligibility.attendance.met ? '✓ Requirement Met' : '⚠ Deficit of attendance'}
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: `1px solid ${eligibility.completion.met ? '#10b98155' : '#334155'}` }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Course Completion</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: eligibility.completion.met ? '#10b981' : '#f59e0b', margin: '4px 0' }}>
                {eligibility.completion.current}% / {eligibility.completion.required}% req.
              </div>
              <div style={{ fontSize: '11px', color: eligibility.completion.met ? '#10b981' : '#ef4444' }}>
                {eligibility.completion.met ? '✓ Curriculum Cleared' : '⚠ Modules pending'}
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: `1px solid ${eligibility.exam.met ? '#10b98155' : '#334155'}` }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Final Exam / Board</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: eligibility.exam.met ? '#10b981' : '#ef4444', margin: '4px 0' }}>
                {eligibility.exam.passed ? 'PASSED' : 'NOT PASSED'}
              </div>
              <div style={{ fontSize: '11px', color: eligibility.exam.met ? '#10b981' : '#ef4444' }}>
                {eligibility.exam.met ? '✓ Assessment Cleared' : '⚠ Board exam required'}
              </div>
            </div>

            <div style={{ background: '#0f172a', padding: '14px', borderRadius: '8px', border: `1px solid ${eligibility.payment.met ? '#10b98155' : '#334155'}` }}>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tuition Fee Clearance</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: eligibility.payment.met ? '#10b981' : '#ef4444', margin: '4px 0' }}>
                {eligibility.payment.balance <= 0 ? 'CLEARED' : `₹${eligibility.payment.balance.toLocaleString()} Due`}
              </div>
              <div style={{ fontSize: '11px', color: eligibility.payment.met ? '#10b981' : '#ef4444' }}>
                {eligibility.payment.met ? '✓ No Dues Pending' : '⚠ Dues must be zero'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Issued Certificates List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {certificates.length === 0 ? (
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🎓</div>
            <div style={{ fontWeight: 600, fontSize: '17px', color: '#f8fafc' }}>No Certificates Issued Yet</div>
            <p style={{ fontSize: '13px', margin: '6px auto 0', maxWidth: '440px' }}>
              Your certificate will be generated and authorized by the administration as soon as all eligibility criteria above are verified.
            </p>
          </div>
        ) : (
          certificates.map(cert => (
            <div
              key={cert._id}
              style={{
                background: '#1e293b',
                borderRadius: '14px',
                border: '1px solid #334155',
                padding: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px'
                }}>
                  🎓
                </div>

                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                      {cert.status || 'ISSUED'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                      REG ID: {cert.certificateNumber}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#f8fafc' }}>
                    {cert.courseId?.name || 'Master Diploma in Cosmetology & Aesthetics'}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Grade: <strong style={{ color: '#f59e0b' }}>{cert.grade || 'A+ (Distinction)'}</strong> • Issue Date: {new Date(cert.issueDate || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  to={`/student/certificates/${cert._id}`}
                  style={{
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    fontWeight: 700,
                    padding: '10px 22px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  View & Download Diploma →
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
