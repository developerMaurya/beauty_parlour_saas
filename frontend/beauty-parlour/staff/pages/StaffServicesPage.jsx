/**
 * @file StaffServicesPage.jsx
 * @description Catalog of authorized salon services, staff skills, and skill upgrade requests.
 * Conforms to Phase 05 Section 16 & 17.
 */

import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext.jsx';
import * as servApi from '../../../services/api/staff/serviceFetcher.js';

export default function StaffServicesPage() {
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('services'); // 'services', 'skills', 'requests'
  const [services, setServices] = useState([]);
  const [skills, setSkills] = useState([]);
  const [skillRequests, setSkillRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Skill Request modal
  const [showModal, setShowModal] = useState(false);
  const [requestForm, setRequestForm] = useState({ skillName: '', reason: '', certificationDetails: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sRes, skRes, reqRes] = await Promise.allSettled([
        servApi.getServices(),
        servApi.getSkills(),
        servApi.getSkillRequests(),
      ]);

      if (sRes.status === 'fulfilled' && sRes.value?.data) {
        setServices(Array.isArray(sRes.value.data) ? sRes.value.data : []);
      }
      if (skRes.status === 'fulfilled' && skRes.value?.data) {
        setSkills(Array.isArray(skRes.value.data) ? skRes.value.data : []);
      }
      if (reqRes.status === 'fulfilled' && reqRes.value?.data) {
        setSkillRequests(Array.isArray(reqRes.value.data) ? reqRes.value.data : []);
      }
    } catch (err) {
      console.warn('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSkillRequest = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await servApi.createSkillRequest(requestForm);
      success('Skill update request submitted to Salon Administration!');
      setShowModal(false);
      setRequestForm({ skillName: '', reason: '', certificationDetails: '' });
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to submit skill request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelRequest = async (reqId) => {
    try {
      await servApi.cancelSkillRequest(reqId);
      success('Skill request cancelled.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to cancel');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <span style={{ fontSize: '24px' }}>✨</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Authorized Services & Specialist Skills
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            View treatments you are qualified to perform and request new skill certifications
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'services', label: 'Authorized Services' },
              { id: 'skills', label: 'My Skills & Badges' },
              { id: 'requests', label: 'Skill Requests' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  padding: '8px 14px',
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
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Request Skill Update
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading catalog...</div>
      ) : (
        <>
          {/* TAB 1: Services */}
          {activeTab === 'services' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {services.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#64748b' }}>
                  No services assigned yet.
                </div>
              ) : (
                services.map((srv) => (
                  <div key={srv._id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontWeight: '700', fontSize: '15px', color: '#fff' }}>{srv.name}</div>
                      <span style={{ color: '#10b981', fontWeight: '700', fontSize: '14px' }}>₹{srv.price}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '6px' }}>
                      ⏱️ Duration: {srv.duration || 45} minutes
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                      Category: {srv.category?.name || 'General Beauty'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Skills */}
          {activeTab === 'skills' && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
                🌟 Verified Specializations & Skill Endorsements
              </h2>
              {skills.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13.5px' }}>No skills currently linked.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {skills.map((sk, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#c4b5fd',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13.5px',
                        fontWeight: '600',
                      }}
                    >
                      <span>✨</span> {typeof sk === 'object' ? sk.name : sk}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Requests */}
          {activeTab === 'requests' && (
            <div style={cardStyle}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px', color: '#fff' }}>
                📬 Submitted Skill Update Requests
              </h2>
              {skillRequests.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13.5px' }}>No active skill requests.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {skillRequests.map((req) => (
                    <div
                      key={req._id}
                      style={{
                        background: 'rgba(15, 23, 42, 0.6)',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>
                          Skill: {req.skillName || req.requestedSkill}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                          Reason: {req.reason || 'None provided'}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={statusBadgeStyle(req.status)}>{req.status}</span>
                        {req.status === 'pending' && (
                          <button
                            onClick={() => handleCancelRequest(req._id)}
                            style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal for Skill Update */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ margin: '0 0 16px', color: '#fff' }}>Request New Skill / Specialization</h3>
            <form onSubmit={handleCreateSkillRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Desired Skill Name</label>
                <input
                  type="text"
                  value={requestForm.skillName}
                  onChange={(e) => setRequestForm((p) => ({ ...p, skillName: e.target.value }))}
                  required
                  placeholder="e.g. Balayage Expert, HydraFacial Pro"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Certification / Diploma Details</label>
                <input
                  type="text"
                  value={requestForm.certificationDetails}
                  onChange={(e) => setRequestForm((p) => ({ ...p, certificationDetails: e.target.value }))}
                  placeholder="e.g. L'Oreal Professional Color Master 2024"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1' }}>Reason for Request</label>
                <textarea
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm((p) => ({ ...p, reason: e.target.value }))}
                  rows={3}
                  required
                  placeholder="Why should this skill be added to your profile?"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={btnCancelStyle}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} style={btnPrimaryStyle}>
                  {submitting ? 'Submitting...' : 'Send to Admin'}
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
  background: 'linear-gradient(135deg, #10b981, #059669)',
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

const statusBadgeStyle = (status) => ({
  background: status === 'approved' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
  color: status === 'approved' ? '#34d399' : '#fbbf24',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
