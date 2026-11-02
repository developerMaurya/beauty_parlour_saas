import React, { useState, useEffect } from 'react';
import { documentFetcher } from '../../../api/student';

export default function StudentDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    documentType: 'ID_PROOF',
    fileUrl: '',
    description: ''
  });

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await documentFetcher.getAll();
      if (res.success) {
        setDocuments(res.data || []);
      } else {
        setError(res.message || 'Failed to load documents');
      }
    } catch (err) {
      setError(err.message || 'Error fetching document repository');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const res = await documentFetcher.upload(formData);
      if (res.success) {
        setShowModal(false);
        setFormData({ title: '', documentType: 'ID_PROOF', fileUrl: '', description: '' });
        loadDocs();
      } else {
        setError(res.message || 'Failed to upload document');
      }
    } catch (err) {
      setError(err.message || 'Upload error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this uploaded document?')) return;
    try {
      await documentFetcher.delete(id);
      loadDocs();
    } catch (err) {
      alert(err.message || 'Error deleting file');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
            Identity & Admission Documents
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
            Government ID proof, address verification, qualifications, and entrance records.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
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
          + Upload New Document
        </button>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading student document files...</div>
        </div>
      ) : documents.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Documents Uploaded</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Please submit your government ID proof to verify your enrollment.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {documents.map(doc => {
            const statusColor = doc.verificationStatus === 'VERIFIED' ? '#10b981' : doc.verificationStatus === 'REJECTED' ? '#ef4444' : '#f59e0b';
            return (
              <div
                key={doc._id}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}55` }}>
                      {doc.verificationStatus || 'PENDING'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {doc.documentType || 'ID_PROOF'}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#f8fafc' }}>{doc.title}</h3>
                  <p style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: '13px', lineHeight: 1.5 }}>
                    {doc.description || 'Verified institutional file submission.'}
                  </p>
                </div>

                <div style={{ paddingTop: '14px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: '#334155', color: '#f8fafc', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}
                  >
                    View File 📄
                  </a>

                  {doc.verificationStatus !== 'VERIFIED' && (
                    <button
                      onClick={() => handleDelete(doc._id)}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '14px', padding: '28px', maxWidth: '460px', width: '90%' }}>
            <h3 style={{ margin: '0 0 16px', color: '#f8fafc' }}>Upload Student Document</h3>
            
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aadhaar Card Front & Back / Class 12 Certificate"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Category</label>
                <select
                  value={formData.documentType}
                  onChange={e => setFormData({ ...formData, documentType: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}
                >
                  <option value="ID_PROOF">Government ID Proof (Aadhaar / Voter ID)</option>
                  <option value="ADDRESS_PROOF">Address Proof</option>
                  <option value="QUALIFICATION">Educational Qualification / Marksheet</option>
                  <option value="PREVIOUS_CERTIFICATE">Previous Beauty Certification</option>
                  <option value="PHOTOGRAPH">Passport Sized Photograph</option>
                  <option value="OTHER">Other Institutional Document</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>File URL or Cloud Storage Link</label>
                <input
                  type="text"
                  required
                  placeholder="https://... or upload link"
                  value={formData.fileUrl}
                  onChange={e => setFormData({ ...formData, fileUrl: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Description / Notes (Optional)</label>
                <textarea
                  rows="2"
                  placeholder="Additional notes for administrative verification..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ background: '#334155', color: '#f8fafc', padding: '10px 18px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '10px 22px', borderRadius: '6px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer' }}
                >
                  {submitting ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
