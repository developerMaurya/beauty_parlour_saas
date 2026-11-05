/**
 * @file CustomerOffersPage.jsx
 * @description Customer Promotions, Birthday Discounts & Coupon Voucher Center.
 * Supports interactive coupon code validation and instant checkout links.
 * @module frontend/src/modules/customer/pages/CustomerOffersPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as offerApi from '../../../services/api/customer/offerFetcher.js';
import * as couponApi from '../../../services/api/customer/couponFetcher.js';

export default function CustomerOffersPage() {
  const [offers, setOffers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [testCode, setTestCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadDeals() {
      try {
        setLoading(true);
        const [offRes, cpnRes] = await Promise.allSettled([
          offerApi.getOffers(),
          couponApi.getCoupons(),
        ]);
        if (offRes.status === 'fulfilled' && offRes.value?.data) {
          const list = Array.isArray(offRes.value.data) ? offRes.value.data : (offRes.value.data?.offers || []);
          setOffers(list);
        }
        if (cpnRes.status === 'fulfilled' && cpnRes.value?.data) {
          const cpnList = Array.isArray(cpnRes.value.data) ? cpnRes.value.data : (cpnRes.value.data?.coupons || []);
          setCoupons(cpnList);
        }
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!testCode) return;
    setValidating(true);
    setCouponResult(null);
    try {
      const res = await couponApi.validateCoupon({ code: testCode, orderAmount: 2000 });
      setCouponResult({ success: true, data: res.data });
    } catch (err) {
      setCouponResult({ success: false, message: err?.message || 'Invalid or expired coupon.' });
    } finally {
      setValidating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
          Exclusive Offers & Coupons
        </h1>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
          Save on your favorite salon treatments with verified seasonal promotions and voucher codes.
        </p>
      </div>

      {/* Coupon Verification Tool */}
      <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: '18px', padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>
          🎟️ Have a Coupon or Gift Voucher?
        </h3>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
          Enter your code below to test discount eligibility against our server pricing engine.
        </p>

        <form onSubmit={handleValidate} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            required
            placeholder="e.g. GLAM20, FESTIVE50"
            value={testCode}
            onChange={(e) => setTestCode(e.target.value.toUpperCase())}
            style={{ width: '280px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '10px 16px', color: '#fff', fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', outline: 'none' }}
          />
          <button
            type="submit"
            disabled={validating}
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13.5px', fontWeight: 700, cursor: validating ? 'not-allowed' : 'pointer' }}
          >
            {validating ? 'Verifying...' : 'Validate Code'}
          </button>
        </form>

        {couponResult && (
          <div style={{ marginTop: '16px', padding: '12px 16px', borderRadius: '10px', fontSize: '13px', background: couponResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${couponResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: couponResult.success ? '#34d399' : '#f87171' }}>
            {couponResult.success ? (
              <span>✓ Coupon <strong>{couponResult.data.code}</strong> is active! Discount: ₹{couponResult.data.discountAmount} off (Order ₹2,000 → ₹{couponResult.data.finalAmount})</span>
            ) : (
              <span>✕ {couponResult.message}</span>
            )}
          </div>
        )}
      </div>

      {/* Active Deals Grid */}
      <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
        Active Salon Promotions
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading offers...</div>
      ) : offers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
          No promotional offers active right now. Please check back soon!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {offers.map((off) => (
            <div
              key={off._id}
              style={{
                background: 'rgba(17, 24, 39, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                    {off.discountType === 'percentage' ? `${off.discountValue}% DISCOUNT` : `₹${off.discountValue} FLAT SAVINGS`}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                    {off.validUntil ? `Until ${new Date(off.validUntil).toLocaleDateString()}` : 'Limited Time'}
                  </span>
                </div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                  {off.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
                  {off.description || 'Special seasonal offer available on select services.'}
                </p>
              </div>

              <div>
                <button
                  onClick={() => navigate(`/customer/book?offerId=${off._id}`)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Book with this Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
