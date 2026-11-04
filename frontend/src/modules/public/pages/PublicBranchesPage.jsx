/**
 * @file PublicBranchesPage.jsx
 * @description Public Salon Locations, Branch Amenities & Working Hours Directory.
 * Displays branch facilities, telephone contacts, operating hours, and location guidance.
 * @module frontend/src/modules/public/pages/PublicBranchesPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as brApi from '../../../services/api/public/branchFetcher.js';

export default function PublicBranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await brApi.getBranches();
        const data = res?.data?.branches || res?.data || res?.branches || res;
        if (Array.isArray(data)) {
          setBranches(data);
        } else if (Array.isArray(data?.data)) {
          setBranches(data.data);
        }
      } catch (err) {
        console.error('Failed to load branches', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
          Salon Sanctuaries & Locations
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Find your nearest luxury salon oasis with private styling suites, bridal lounges, and certified artists.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading salon locations...</div>
      ) : branches.length === 0 ? (
        <div style={{
          padding: '4rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          No salon branches listed at present.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {branches.map((b) => {
            const bid = b._id || b.id;
            return (
              <div
                key={bid}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.25rem'
                    }}>
                      📍
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>
                        {b.name || 'Prime Salon Sanctuary'}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>● Open Today</span>
                    </div>
                  </div>

                  <p style={{ margin: '0.75rem 0', color: '#cbd5e1', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {typeof b.address === 'object' && b.address
                      ? [b.address.street, b.address.city, b.address.state].filter(Boolean).join(', ') || 'High Street Luxury Boulevard, Level 2, Metro Center'
                      : String(b.address || 'High Street Luxury Boulevard, Level 2, Metro Center')}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', fontSize: '0.8125rem', color: '#94a3b8' }}>
                    <div>📞 <strong>Phone:</strong> {b.phone || '+91 98765 43210'}</div>
                    <div>📧 <strong>Email:</strong> {b.email || 'concierge@salonsaas.com'}</div>
                    <div>⏰ <strong>Hours:</strong> 09:00 AM – 09:00 PM (Daily)</div>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/book?branchId=${bid}`)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Book at This Branch
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
