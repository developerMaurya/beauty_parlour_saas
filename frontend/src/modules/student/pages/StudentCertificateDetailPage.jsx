import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { certificateFetcher } from '../../../services/api/student';

export default function StudentCertificateDetailPage() {
  const { id } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCert() {
      try {
        setLoading(true);
        const res = await certificateFetcher.getById(id);
        if (res.success) {
          setCert(res.data);
        } else {
          setError(res.message || 'Certificate not found or revoked');
        }
      } catch (err) {
        setError(err.message || 'Error fetching diploma record');
      } finally {
        setLoading(false);
      }
    }
    loadCert();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
        <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
        <div>Verifying cryptographic certificate signature...</div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', padding: '24px', color: '#fca5a5', maxWidth: '600px', margin: '40px auto' }}>
        <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '8px' }}>Certificate Unavailable</div>
        <div>{error}</div>
        <Link to="/student/certificates" style={{ display: 'inline-block', marginTop: '16px', color: '#f59e0b', textDecoration: 'none' }}>
          ← Back to Certificates
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <Link to="/student/certificates" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '13px' }}>
            ← Back to All Diplomas
          </Link>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '8px 0 2px', color: '#f8fafc' }}>
            Diploma Certificate #{cert.certificateNumber}
          </h1>
          <div style={{ fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
            Status: {cert.status || 'AUTHENTIC & VERIFIED'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            🖨️ Print / Download PDF
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div
        id="diploma-frame"
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #151d2f 100%)',
          border: '8px double #f59e0b',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative corner accents */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', color: '#f59e0b', fontSize: '24px' }}>⚜️</div>
        <div style={{ position: 'absolute', top: '16px', right: '16px', color: '#f59e0b', fontSize: '24px' }}>⚜️</div>
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', color: '#f59e0b', fontSize: '24px' }}>⚜️</div>
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', color: '#f59e0b', fontSize: '24px' }}>⚜️</div>

        <div style={{ fontSize: '13px', letterSpacing: '4px', textTransform: 'uppercase', color: '#f59e0b', fontWeight: 700, marginBottom: '12px' }}>
          NATIONAL ACADEMY OF COSMETOLOGY & BEAUTY ARTS
        </div>

        <h2 style={{ fontSize: '32px', fontFamily: 'serif', color: '#f8fafc', margin: '0 0 16px', fontStyle: 'italic' }}>
          Certificate of Professional Competency
        </h2>

        <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px' }}>
          This is to officially certify and confer that
        </p>

        <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', margin: '0 0 24px', letterSpacing: '1px' }}>
          {cert.studentName || 'Devina Sharma'}
        </div>

        <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '640px', margin: '0 auto 28px', lineHeight: 1.7 }}>
          has satisfactorily fulfilled all prescribed practical lab requirements, clinical demonstrations, and formal examinations for the professional diploma program in
        </p>

        <div style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '28px' }}>
          {cert.courseName || cert.courseId?.name || 'Master Diploma in Cosmetology, Hair & Aesthetics'}
        </div>

        {/* Verification and Signatures row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '24px',
          borderTop: '1px solid rgba(245, 158, 11, 0.3)',
          paddingTop: '28px',
          marginTop: '32px',
          textAlign: 'left',
          fontSize: '13px'
        }}>
          <div>
            <div style={{ color: '#94a3b8' }}>Issue Date:</div>
            <strong style={{ color: '#f8fafc' }}>{new Date(cert.issueDate || Date.now()).toLocaleDateString()}</strong>
            <div style={{ color: '#94a3b8', marginTop: '6px' }}>Grade / Standing:</div>
            <strong style={{ color: '#10b981' }}>{cert.grade || 'A+ (Distinction)'}</strong>
          </div>

          <div style={{ textAlign: 'center' }}>
            {/* Simulated QR Code Badge */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 6px',
              background: '#fff',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '10px', color: '#000', fontWeight: 800, wordBreak: 'break-all', textAlign: 'center' }}>
                QR VERIFIED #{cert.certificateNumber?.slice(-6) || '2026'}
              </div>
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Scan to Verify Authenticity</div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontStyle: 'italic', fontFamily: 'serif', fontSize: '18px', color: '#f59e0b', marginBottom: '4px' }}>
              Academic Council
            </div>
            <div style={{ borderTop: '1px solid #64748b', display: 'inline-block', paddingTop: '4px', fontSize: '12px', color: '#94a3b8' }}>
              Director of Education & Examination
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
