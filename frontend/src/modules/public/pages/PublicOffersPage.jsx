/**
 * @file PublicOffersPage.jsx
 * @description Public Special Offers, Festive Discounts & Coupon Promotions (Luminous White & Rose Theme).
 * Displays active coupon codes, discount terms, and promotional deals.
 * @module frontend/src/modules/public/pages/PublicOffersPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as offApi from '../../../services/api/public/offerFetcher.js';
import QuickParlourBuyModal from '../components/QuickParlourBuyModal.jsx';
import { Sparkles, Gift, Tag, Check, Copy, ShoppingBag, Calendar } from 'lucide-react';

export default function PublicOffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState('');
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await offApi.getOffers();
        const data = res?.data?.offers || res?.data || res?.offers || res;
        if (Array.isArray(data) && data.length > 0) {
          setOffers(data);
        } else if (Array.isArray(data?.data) && data.data.length > 0) {
          setOffers(data.data);
        } else {
          // Fallback promotional offers
          setOffers([
            {
              id: 'off-welcome20',
              name: 'First-Visit Welcome Privilege',
              code: 'BLOSSOM20',
              discount: '20% OFF',
              description: 'Flat 20% discount on any parlour treatment or bridal service booked online.',
              minAmount: 999,
              validUntil: '31 Dec 2026',
            },
            {
              id: 'off-bridal5000',
              name: 'Royal Bridal Season Privilege',
              code: 'ROYALBRIDE',
              discount: '₹4,000 FLAT OFF',
              description: 'Save ₹4,000 on full bridal couture makeovers with free trial consultation.',
              minAmount: 10000,
              validUntil: 'Valid this wedding season',
            },
            {
              id: 'off-trial499',
              name: 'First-Timer Glow Trial Voucher',
              code: 'TRIAL499',
              discount: '75% OFF',
              description: 'Complete fruit cleanup, threading, and skincare consultation at just ₹499.',
              minAmount: 499,
              validUntil: 'Ongoing promotional voucher',
            },
          ]);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingBottom: '3rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#be185d', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          <Gift size={14} /> Seasonal Savings & Trial Coupons
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
          Exclusive Offers & Coupons
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Take advantage of festive discounts, bridal specials, and limited-time promotional codes.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading parlour offers...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {offers.map((off) => {
            const offId = off._id || off.id;
            const code = off.code || off.couponCode || 'BLOSSOM20';
            return (
              <div
                key={offId}
                style={{
                  background: '#ffffff',
                  border: '1px solid #fecdd3',
                  borderRadius: '22px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  boxShadow: '0 4px 14px rgba(190, 24, 93, 0.05)',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '24px' }}>🎁</span>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: '#fff1f2',
                        color: '#be185d',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                      }}
                    >
                      {off.discount || '20% OFF'}
                    </span>
                  </div>

                  <h3 style={{ margin: '12px 0 6px 0', fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>
                    {off.name}
                  </h3>

                  <p style={{ margin: '0 0 1rem 0', color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5' }}>
                    {off.description || 'Special seasonal privilege valid on selected parlour treatments.'}
                  </p>

                  {/* Coupon Code Pill */}
                  <div
                    style={{
                      background: '#fff8fa',
                      border: '1px dashed #f43f5e',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#9d174d', fontWeight: 700, textTransform: 'uppercase' }}>
                        Coupon Code
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '0.05em' }}>
                        {code}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy(code)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: '1px solid #fecdd3',
                        background: '#ffffff',
                        color: copiedCode === code ? '#059669' : '#be185d',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {copiedCode === code ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode === code ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => setBuyModalOpen(true)}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Apply & Buy</span>
                  </button>

                  <button
                    onClick={() => navigate(`/book?coupon=${code}`)}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <Calendar size={14} />
                    <span>Book with Code</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickParlourBuyModal isOpen={buyModalOpen} onClose={() => setBuyModalOpen(false)} isTrial={true} />
    </div>
  );
}
