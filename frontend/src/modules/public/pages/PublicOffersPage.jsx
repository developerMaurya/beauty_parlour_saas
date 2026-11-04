/**
 * @file PublicOffersPage.jsx
 * @description Public Special Offers, Festive Discounts & Coupon Promotions.
 * Displays active coupon codes, discount terms, and promotional deals.
 * @module frontend/src/modules/public/pages/PublicOffersPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as offApi from '../../../services/api/public/offerFetcher.js';

export default function PublicOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await offApi.getOffers();
        const data = res?.data?.offers || res?.data || res?.offers || res;
        if (Array.isArray(data)) {
          setOffers(data);
        } else if (Array.isArray(data?.data)) {
          setOffers(data.data);
        }
      } catch (err) {
        console.error('Failed to load public offers', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
          Exclusive Offers & Coupons
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Take advantage of festive discounts, bridal specials, and limited-time promotional codes.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading salon offers...</div>
      ) : offers.length === 0 ? (
        <div style={{
          padding: '4rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          No promotions active today. Subscribe to our alerts to get notified of festive releases!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {offers.map((off) => {
            const offId = off._id || off.id;
            const code = off.code || off.couponCode || 'GLOWSPECIAL';
            return (
              <div
                key={offId}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(236, 72, 153, 0.25)',
                  borderRadius: '20px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>
                      {off.name || 'Festive Glow Offer'}
                    </h3>
                    <span style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '10px',
                      background: 'rgba(236, 72, 153, 0.15)',
                      color: '#ec4899',
                      fontWeight: 800,
                      fontSize: '0.9375rem'
                    }}>
                      {off.discountPercent ? `${off.discountPercent}% OFF` : `₹${off.discountAmount || 500} OFF`}
                    </span>
                  </div>

                  <p style={{ margin: '0.75rem 0', color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {off.description || 'Enjoy premier discounts across hair styling, organic facials, and beauty rituals.'}
                  </p>

                  {/* Coupon Code Pill */}
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    background: '#0f172a',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.6875rem', color: '#94a3b8', textTransform: 'uppercase' }}>Coupon Code</div>
                      <div style={{ fontSize: '1.125rem', color: '#f8fafc', fontWeight: 800, letterSpacing: '0.05em' }}>
                        {code}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(code)}
                      style={{
                        padding: '0.375rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: copiedCode === code ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {copiedCode === code ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                    Valid until: <strong>{off.endDate ? new Date(off.endDate).toLocaleDateString() : 'Limited Time'}</strong>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/book?couponCode=${code}`)}
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
                  Apply & Book Appointment
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
