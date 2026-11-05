/**
 * @file StaffCustomerDetailPage.jsx
 * @description Detailed Client CRM View & Professional Service Notes for Staff.
 * Conforms to Phase 05 Section 14 & 15.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../../context/ToastContext.jsx';
import * as crmApi from '../../../services/api/staff/customerFetcher.js';

export default function StaffCustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [customer, setCustomer] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Note
  const [newNote, setNewNote] = useState('');
  const [category, setCategory] = useState('hair_preference');
  const [submittingNote, setSubmittingNote] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cRes, aRes, nRes] = await Promise.allSettled([
        crmApi.getCustomer(id),
        crmApi.getCustomerAppointments(id),
        crmApi.getCustomerNotes(id),
      ]);

      if (cRes.status === 'fulfilled' && cRes.value?.data) setCustomer(cRes.value.data);
      if (aRes.status === 'fulfilled' && aRes.value?.data) {
        setAppointments(Array.isArray(aRes.value.data) ? aRes.value.data : []);
      }
      if (nRes.status === 'fulfilled' && nRes.value?.data) {
        setNotes(Array.isArray(nRes.value.data) ? nRes.value.data : []);
      }
    } catch (err) {
      console.warn('Customer load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      setSubmittingNote(true);
      await crmApi.addCustomerNote(id, {
        note: newNote,
        category,
      });
      success('Professional styling preference note saved!');
      setNewNote('');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Failed to save note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this service note?')) return;
    try {
      await crmApi.deleteCustomerNote(id, noteId);
      success('Note deleted.');
      loadData();
    } catch (err) {
      toastError(err?.response?.data?.message || 'Delete note failed');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading client record...</div>;
  }

  const c = customer || {};

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <button onClick={() => navigate('/staff/customers')} style={backLinkStyle}>
          ← Back to All Clients
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: '700',
            }}
          >
            {c.name?.charAt(0) || 'C'}
          </div>

          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              {c.name || 'Client Profile'}
            </h1>
            <div style={{ fontSize: '13.5px', color: '#94a3b8', marginTop: '4px' }}>
              📞 {c.phone || 'No phone'} • ✉️ {c.email || 'No email on record'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              📍 {c.address || 'Address not listed'}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Notes Section */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px', color: '#fff' }}>
          📝 Professional Service & Styling Preferences
        </h2>
        <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px' }}>
          Record client formula preferences (hair color, skin sensitivities, nail art preferences, allergy alerts).
        </p>

        {/* Note input form */}
        <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '12.5px',
                outline: 'none',
              }}
            >
              <option value="hair_preference">💇 Hair Formula / Preference</option>
              <option value="makeup_preference">💄 Makeup / Skin Tone</option>
              <option value="product_preference">🧴 Product / Brand Preference</option>
              <option value="allergy_alert">⚠️ Sensitivity / Allergy Alert</option>
              <option value="general_note">📝 General Styling Note</option>
            </select>
          </div>

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={2}
            required
            placeholder="Type confidential client service note here..."
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submittingNote || !newNote.trim()}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                color: '#fff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '12.5px',
                cursor: 'pointer',
              }}
            >
              {submittingNote ? 'Saving...' : 'Add Service Note'}
            </button>
          </div>
        </form>

        {/* Existing Notes Feed */}
        {notes.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No service notes recorded yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notes.map((n) => (
              <div
                key={n._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={categoryBadgeStyle(n.category)}>{n.category?.replace('_', ' ')}</span>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>{n.note}</div>
                </div>

                <button
                  onClick={() => handleDeleteNote(n._id)}
                  style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px' }}
                  title="Delete Note"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment History */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px', color: '#fff' }}>
          ✂️ Past Appointments with Client
        </h2>

        {appointments.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>No appointment history found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {appointments.map((a) => (
              <div
                key={a._id}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#fff', fontSize: '13.5px' }}>
                    {a.service?.name || 'Salon Treatment'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                    {a.date ? new Date(a.date).toLocaleDateString() : ''} at {a.scheduledTime}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '13px', color: '#10b981', fontWeight: '600' }}>₹{a.amount || 0}</span>
                  <span style={statusBadgeStyle(a.status)}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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

const backLinkStyle = {
  background: 'none',
  border: 'none',
  color: '#94a3b8',
  cursor: 'pointer',
  padding: 0,
  fontSize: '13px',
};

const categoryBadgeStyle = (cat) => ({
  background: 'rgba(139, 92, 246, 0.15)',
  color: '#c4b5fd',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});

const statusBadgeStyle = (status) => ({
  background: 'rgba(59, 130, 246, 0.2)',
  color: '#60a5fa',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
});
