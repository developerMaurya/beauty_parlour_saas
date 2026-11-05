/**
 * @file PublicBranchesPage.jsx
 * @description Public Beauty Parlour Locations, Branch Amenities & Working Hours Directory (Luminous White & Rose Theme).
 * Displays branch facilities, telephone contacts, operating hours, and location guidance.
 * @module frontend/src/modules/public/pages/PublicBranchesPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as brApi from '../../../services/api/public/branchFetcher.js';
import { MapPin, Phone, Mail, Clock, Calendar, CheckCircle2 } from 'lucide-react';

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
        if (Array.isArray(data) && data.length > 0) {
          setBranches(data);
        } else if (Array.isArray(data?.data) && data.data.length > 0) {
          setBranches(data.data);
        } else {
          setBranches([
            {
              id: 'br-flagship',
              name: 'Flagship Parlour & Bridal Studio',
              address: 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049',
              phone: '+91 98765 43210',
              email: 'delhi@blossombeauty.in',
              timings: '09:00 AM - 09:00 PM (All 7 Days)',
              amenities: ['Private Bridal Suite', 'HD Airbrush Studio', 'Valet Parking', 'Herbal Dispensary'],
            },
            {
              id: 'br-cyber',
              name: 'Cyber City Luxury Express Studio',
              address: 'Building 10B, DLF Cyber City, Sector 24, Gurugram - 122002',
              phone: '+91 98111 22334',
              email: 'gurugram@blossombeauty.in',
              timings: '08:30 AM - 09:30 PM (All 7 Days)',
              amenities: ['Express Hair Spa', 'Gel Nail Bar', 'Doorstep Fleet Hub', 'Complimentary Green Tea'],
            },
            {
              id: 'br-blr',
              name: 'Indiranagar Couture Wellness Sanctuary',
              address: '100ft Road, 12th Main, Indiranagar, Bengaluru - 560038',
              phone: '+91 98888 77665',
              email: 'bengaluru@blossombeauty.in',
              timings: '09:00 AM - 09:00 PM (All 7 Days)',
              amenities: ['Aroma Steam Therapy', 'Organic Facial Lounges', 'Academy Classroom', 'VIP Dressing Room'],
            },
          ]);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#be185d', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          <MapPin size={14} /> Physical Sanctuaries & Fleet Dispatch
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
          Beauty Parlour Studios & Locations
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Find your nearest luxury parlour oasis with private styling suites, bridal lounges, and certified artists.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading parlour locations...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {branches.map((b) => {
            const bid = b._id || b.id;
            const addrStr =
              typeof b.address === 'object' && b.address
                ? [b.address.street, b.address.city, b.address.state].filter(Boolean).join(', ')
                : String(b.address || 'Central City Center');
            return (
              <div
                key={bid}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1e6ea',
                  borderRadius: '22px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#fff1f2',
                        color: '#be185d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                      }}
                    >
                      📍
                    </div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                      {b.name || 'Prime Beauty Parlour'}
                    </h3>
                  </div>

                  <p style={{ margin: '14px 0', color: '#475569', fontSize: '0.9rem', lineHeight: '1.55' }}>
                    {addrStr}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} className="text-pink-600" />
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{b.phone || '+91 98765 43210'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock size={14} className="text-purple-600" />
                      <span>{b.timings || '09:00 AM - 09:00 PM (All 7 Days)'}</span>
                    </div>
                  </div>

                  {b.amenities && (
                    <div style={{ marginTop: '14px', borderTop: '1px solid #f1e6ea', paddingTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {b.amenities.map((a, i) => (
                        <span
                          key={i}
                          style={{
                            padding: '3px 8px',
                            borderRadius: '8px',
                            background: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            fontSize: '0.75rem',
                            color: '#334155',
                            fontWeight: 600,
                          }}
                        >
                          ✓ {a}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/book?branchId=${bid}`)}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(190, 24, 93, 0.25)',
                  }}
                >
                  <Calendar size={16} />
                  <span>Book at this Studio</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
