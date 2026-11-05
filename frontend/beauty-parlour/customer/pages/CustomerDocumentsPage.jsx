/**
 * @file CustomerDocumentsPage.jsx
 * @description Customer Personal Treatment Documents & Consultation Records Vault.
 * Conforms to Phase 07 Section 39: Upload, View, Update, and Download treatment waivers & skin consultation charts.
 * @module frontend/src/modules/customer/pages/CustomerDocumentsPage
 */

import React, { useState, useEffect } from 'react';
import * as docApi from '../../../services/api/customer/documentFetcher.js';

const DOCUMENT_TYPES = [
  { value: 'GENERAL', label: 'General Document' },
  { value: 'CONSULTATION_CHART', label: 'Skin / Hair Consultation Chart' },
  { value: 'PATCH_TEST_WAIVER', label: 'Patch Test & Allergy Waiver' },
  { value: 'MEDICAL_CONSENT', label: 'Medical History & Consent Form' },
  { value: 'BEFORE_AFTER_PHOTO', label: 'Before & After Photograph' },
  { value: 'ID_PROOF', label: 'Identification Verification' }
];

export default function CustomerDocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('ALL');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalDoc, setEditModalDoc] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    documentType: 'CONSULTATION_CHART',
    fileUrl: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await docApi.getDocuments();
      if (res.data?.success) {
        setDocuments(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load documents', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.fileUrl.trim()) {
      setMsg({ type: 'error', text: 'Document title and file URL are required.' });
      return;
    }

    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const res = await docApi.uploadDocument(formData);
      if (res.data?.success) {
        setUploadModalOpen(false);
        setFormData({ title: '', documentType: 'CONSULTATION_CHART', fileUrl: '', notes: '' });
        setMsg({ type: 'success', text: 'Document uploaded to your vault successfully.' });
        await loadDocuments();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to upload document.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editModalDoc) return;

    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const res = await docApi.updateDocument(editModalDoc._id || editModalDoc.id, {
        title: editModalDoc.title,
        documentType: editModalDoc.documentType,
        notes: editModalDoc.notes || editModalDoc.description || ''
      });
      if (res.data?.success) {
        setEditModalDoc(null);
        setMsg({ type: 'success', text: 'Document details updated.' });
        await loadDocuments();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update document.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document from your vault?')) return;
    try {
      await docApi.deleteDocument(id);
      setMsg({ type: 'success', text: 'Document removed.' });
      await loadDocuments();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete document.' });
    }
  };

  const filteredDocs = documents.filter(d => {
    if (selectedType === 'ALL') return true;
    return d.documentType === selectedType;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Personal Document Vault
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Secure storage for skin consultation charts, medical waivers, allergy patch tests, and consent records.
          </p>
        </div>
        <button
          onClick={() => setUploadModalOpen(true)}
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.875rem'
          }}
        >
          + Upload Document
        </button>
      </div>

      {msg.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${msg.type === 'error' ? '#ef4444' : '#10b981'}`,
          color: msg.type === 'error' ? '#ef4444' : '#10b981',
          fontSize: '0.875rem'
        }}>
          {msg.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setSelectedType('ALL')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            border: 'none',
            background: selectedType === 'ALL' ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
            color: selectedType === 'ALL' ? '#fff' : '#94a3b8',
            fontSize: '0.8125rem',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          All Documents ({documents.length})
        </button>
        {DOCUMENT_TYPES.map(t => {
          const count = documents.filter(d => d.documentType === t.value).length;
          return (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: selectedType === t.value ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                color: selectedType === t.value ? '#fff' : '#94a3b8',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {t.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Documents Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading vault documents...</div>
      ) : filteredDocs.length === 0 ? (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          No documents found in this section. Upload a skin analysis or consent form above.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {filteredDocs.map((doc) => {
            const did = doc._id || doc.id;
            const typeObj = DOCUMENT_TYPES.find(t => t.value === doc.documentType) || { label: doc.documentType || 'Document' };
            return (
              <div
                key={did}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      background: 'rgba(236, 72, 153, 0.15)',
                      color: '#ec4899',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {typeObj.label}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {doc.uploadedAt || doc.createdAt ? new Date(doc.uploadedAt || doc.createdAt).toLocaleDateString() : 'Recorded'}
                    </span>
                  </div>

                  <h3 style={{ margin: '0.75rem 0 0.35rem 0', fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
                    {doc.title}
                  </h3>

                  {(doc.notes || doc.description) && (
                    <p style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1', fontSize: '0.8125rem', lineHeight: '1.4' }}>
                      {doc.notes || doc.description}
                    </p>
                  )}

                  <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>✓</span> {doc.verificationStatus || 'VERIFIED VAULT RECORD'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      color: '#fff',
                      textAlign: 'center',
                      textDecoration: 'none',
                      fontSize: '0.8125rem',
                      fontWeight: 600
                    }}
                  >
                    View / Download
                  </a>
                  <button
                    onClick={() => setEditModalDoc(doc)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                      fontSize: '0.8125rem',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(did)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#ef4444',
                      fontSize: '0.8125rem',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#f8fafc', fontSize: '1.25rem' }}>Upload Personal Document</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skin Allergy Patch Test Clearance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Document Type</label>
                <select
                  value={formData.documentType}
                  onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  {DOCUMENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>File URL or Document Cloud Link</label>
                <input
                  type="url"
                  required
                  placeholder="https://cloud.storage.com/waivers/consent.pdf"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Notes & Instructions (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Additional context or practitioner sign-off..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Uploading...' : 'Save to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalDoc && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '2rem',
            width: '100%',
            maxWidth: '480px'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#f8fafc', fontSize: '1.25rem' }}>Update Document Details</h3>
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Document Title</label>
                <input
                  type="text"
                  required
                  value={editModalDoc.title}
                  onChange={(e) => setEditModalDoc({ ...editModalDoc, title: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Document Type</label>
                <select
                  value={editModalDoc.documentType}
                  onChange={(e) => setEditModalDoc({ ...editModalDoc, documentType: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                >
                  {DOCUMENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.375rem' }}>Notes & Instructions</label>
                <textarea
                  rows={3}
                  value={editModalDoc.notes || editModalDoc.description || ''}
                  onChange={(e) => setEditModalDoc({ ...editModalDoc, notes: e.target.value, description: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setEditModalDoc(null)}
                  style={{ padding: '0.625rem 1rem', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '0.625rem 1.25rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    cursor: submitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {submitting ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
