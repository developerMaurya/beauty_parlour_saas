/**
 * @file StaffDocumentsPage.jsx
 * @description Official Documents & Professional Certificates for Staff.
 * Conforms to Phase 05 Section 32 & 33.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import * as docApi from '../../../services/api/staff/documentFetcher.js';
import * as certApi from '../../../services/api/staff/certificateFetcher.js';

export default function StaffDocumentsPage() {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'certificates'
  const [documents, setDocuments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload Modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('document'); // 'document' | 'certificate'
  const [formData, setFormData] = useState({ title: '', type: 'id_proof', fileUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dRes, cRes] = await Promise.allSettled([
        docApi.getDocuments(),
        certApi.getCertificates(),
      ]);
      if (dRes.status === 'fulfilled' && dRes.value?.data) {
        setDocuments(Array.isArray(dRes.value.data) ? dRes.value.data : []);
      }
      if (cRes.status === 'fulfilled' && cRes.value?.data) {
        setCertificates(Array.isArray(cRes.value.data) ? cRes.value.data : []);
      }
    } catch (err) {
      console.warn('Doc load err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (modalType === 'document') {
        await docApi.createDocument(formData);
        success('Document uploaded for salon record!');
      } else {
        await certApi.createCertificate(formData);
        success('Certificate submitted for Admin verification!');
      }
      setShowModal(false);
      setFormData({ title: '', type: 'id_proof', fileUrl: '' });
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📜</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Documents & Certifications
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Official onboarding records, ID proofs, employment contracts, and verified beauty diplomas
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'documents', label: `Documents (${documents.length})` },
              { id: 'certificates', label: `Certificates (${certificates.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setModalType(activeTab === 'documents' ? 'document' : 'certificate');
              setShowModal(true);
            }}
            style={{
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Upload {activeTab === 'documents' ? 'Document' : 'Certificate'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading credentials...</div>
      ) : activeTab === 'documents' ? (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            📁 Official Staff Documents
          </h2>
          {documents.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No documents uploaded yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {documents.map((doc) => (
                <div key={doc._id} style={docCardStyle}>
                  <div style={{ fontSize: '26px' }}>📄</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{doc.title || doc.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Type: {doc.type?.toUpperCase() || 'DOCUMENT'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
            🎓 Beauty Academy Diplomas & Certifications
          </h2>
          {certificates.length === 0 ? (
            <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0 }}>No certificates on file.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {certificates.map((cert) => (
                <div key={cert._id} style={docCardStyle}>
                  <div style={{ fontSize: '26px' }}>🎓</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                      {cert.title || cert.courseName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      Issuer: {cert.issuingOrganization || 'Beauty Academy'}
                    </div>
                    <div style={{ marginTop: '6px' }}>
                      <span style={verifyBadgeStyle(cert.verificationStatus || cert.status)}>
                        {cert.verificationStatus || cert.status || 'Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>
              Upload {modalType === 'document' ? 'Document' : 'Certificate'}
            </h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                  required
                  placeholder={modalType === 'document' ? 'e.g. Aadhaar Card Front & Back' : 'e.g. Master Cosmetology Diploma'}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Type / Category</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData((p) => ({ ...p, type: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="id_proof">National ID / Passport</option>
                  <option value="address_proof">Address Verification</option>
                  <option value="contract">Employment Agreement</option>
                  <option value="certificate">Certification / Diploma</option>
                  <option value="other">Other Official Document</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Document URL or Storage Reference</label>
                <input
                  type="text"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, fileUrl: e.target.value }))}
                  required
                  placeholder="https://... or uploaded storage key"
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={btnPrimaryStyle}>
                  {submitting ? 'Saving...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  background: 'rgba(30, 41, 59, 0.6)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
};

const docCardStyle = {
  background: 'rgba(15, 23, 42, 0.6)',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  padding: '10px',
  color: '#fff',
  fontSize: '13px',
  marginTop: '4px',
  boxSizing: 'border-box',
};

const btnPrimaryStyle = {
  background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '700',
  cursor: 'pointer',
};

const btnCancelStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#fff',
  border: 'none',
  padding: '10px 18px',
  borderRadius: '8px',
  fontWeight: '600',
  cursor: 'pointer',
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '20px',
};

const modalContentStyle = {
  background: '#1e293b',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '480px',
};

const verifyBadgeStyle = (status) => ({
  background: status === 'verified' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
  color: status === 'verified' ? '#34d399' : '#fbbf24',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
