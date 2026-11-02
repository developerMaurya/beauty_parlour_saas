/**
 * @file CustomerAddressesPage.jsx
 * @description Customer Saved Locations & Home-Service Dispatch Addresses.
 * Allows managing primary residence, office, and doorstep service delivery locations.
 * @module frontend/src/modules/customer/pages/CustomerAddressesPage
 */

import React, { useState, useEffect } from 'react';
import * as addrApi from '../../../services/api/customer/addressFetcher.js';

export default function CustomerAddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Home',
    house: '',
    street: '',
    area: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
    landmark: '',
    instructions: ''
  });
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const res = await addrApi.getAddresses();
      if (res.data?.success) {
        setAddresses(res.data.data?.addresses || res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMsg({ type: '', text: '' });
      const res = await addrApi.createAddress(formData);
      if (res.data?.success) {
        setModalOpen(false);
        setFormData({
          name: 'Home',
          house: '',
          street: '',
          area: '',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '',
          landmark: '',
          instructions: ''
        });
        setMsg({ type: 'success', text: 'New address saved successfully.' });
        await loadAddresses();
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to save address.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addrApi.setDefaultAddress(id);
      setMsg({ type: 'success', text: 'Default dispatch address updated.' });
      await loadAddresses();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update default address.' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addrApi.deleteAddress(id);
      setMsg({ type: 'success', text: 'Address removed.' });
      await loadAddresses();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to delete address.' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            Saved Addresses & Locations
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Locations saved for rapid booking of doorstep home-service treatments.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
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
          + Add New Address
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

      {/* Grid */}
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Loading addresses...</div>
      ) : addresses.length === 0 ? (
        <div style={{
          padding: '3rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          No addresses saved yet. Add one above to enable 1-click home service booking.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
          {addresses.map((a) => {
            const aid = a._id || a.id;
            const isDefault = !!a.isDefault;
            return (
              <div
                key={aid}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: `1px solid ${isDefault ? 'rgba(236, 72, 153, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.125rem' }}>📍</span>
                      <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
                        {a.name || 'Location'}
                      </h3>
                    </div>
                    {isDefault && (
                      <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(236, 72, 153, 0.15)',
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        color: '#ec4899',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.4' }}>
                    {a.house ? `${a.house}, ` : ''}{a.street ? `${a.street}, ` : ''}{a.area ? `${a.area}, ` : ''}{a.city} {a.pincode}
                  </p>
                  {a.landmark && (
                    <p style={{ margin: '0 0 0.5rem 0', color: '#94a3b8', fontSize: '0.8125rem' }}>
                      <strong>Landmark:</strong> {a.landmark}
                    </p>
                  )}
                  {a.instructions && (
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8125rem', fontStyle: 'italic' }}>
                      "{a.instructions}"
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {!isDefault && (
                    <button
                      onClick={() => handleSetDefault(aid)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#cbd5e1',
                        fontSize: '0.8125rem',
                        cursor: 'pointer'
                      }}
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(aid)}
                    style={{
                      padding: '0.5rem 0.875rem',
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

      {/* Modal */}
      {modalOpen && (
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
            maxWidth: '500px'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', color: '#f8fafc', fontSize: '1.25rem' }}>Save Home-Service Location</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Address Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Primary Residence / Penthouse / Office"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Flat / House / Villa #</label>
                  <input
                    type="text"
                    required
                    value={formData.house}
                    onChange={(e) => setFormData({ ...formData, house: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Street / Road</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Area / Locality</label>
                  <input
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Pincode</label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Landmark (Optional)</label>
                <input
                  type="text"
                  placeholder="Near Club House / Opposite Grand Mall"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Entry / Gate Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="Buzzer #402, visitor parking available"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#0f172a', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
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
                  {submitting ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
