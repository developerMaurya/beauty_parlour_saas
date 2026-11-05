/**
 * @file CustomerPackagesPage.jsx
 * @description Salon Packages Catalog and Purchase Flow.
 * Displays multi-treatment bundles, custom inclusions, and purchase triggers.
 * @module frontend/src/modules/customer/pages/CustomerPackagesPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as packageApi from '../../../services/api/customer/packageFetcher.js';

export default function CustomerPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPackages() {
      try {
        setLoading(true);
        const res = await packageApi.getPackages();
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.packages || []);
        setPackages(list);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handlePurchase = async (pkgId) => {
    setPurchasingId(pkgId);
    setMsg({ type: '', text: '' });
    try {
      await packageApi.purchasePackage(pkgId, { paymentMethod: 'ONLINE' });
      setMsg({ type: 'success', text: 'Package successfully added to your portfolio!' });
      setTimeout(() => {
        navigate('/customer/packages/my');
      }, 1000);
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Package purchase failed.' });
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            Curated Beauty & Bridal Packages
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Enjoy multi-session savings, pre-bridal rituals, and premium spa memberships.
          </p>
        </div>
        <NavLink
          to="/customer/packages/my"
          style={{ background: 'rgba(255, 255, 255, 0.08)', color: '#ec4899', textDecoration: 'none', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: '1px solid rgba(236, 72, 153, 0.3)' }}
        >
          🎟️ My Purchased Packages & Sessions →
        </NavLink>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 18px', borderRadius: '12px', marginBottom: '20px', fontSize: '13.5px', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: msg.type === 'success' ? '#34d399' : '#f87171' }}>
          {msg.text}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading salon packages...</div>
      ) : packages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
          No promotional packages active currently.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {packages.map((p) => (
            <div
              key={p._id}
              style={{
                background: 'rgba(17, 24, 39, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '26px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                    {p.code || 'PACKAGE'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    Valid {p.validityDays || 90} Days
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px' }}>
                  {p.description || 'Exclusive bundle curated for complete grooming and glow.'}
                </p>

                {/* Included services */}
                <div style={{ marginBottom: '16px', background: 'rgba(255, 255, 255, 0.02)', padding: '12px', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '6px' }}>
                    Included Services ({p.services?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {(p.services || []).map((s, idx) => (
                      <div key={idx} style={{ fontSize: '12.5px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                        <span>• {s.name || s.serviceId?.name || 'Treatment'}</span>
                        <span style={{ color: '#ec4899', fontWeight: 600 }}>x{s.quantity || 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
                  <div style={{ fontSize: '12.5px', color: '#94a3b8' }}>Total Bundle Price</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
                    ₹{p.price}
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(p._id)}
                  disabled={purchasingId === p._id}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: purchasingId === p._id ? 'not-allowed' : 'pointer',
                  }}
                >
                  {purchasingId === p._id ? 'Securing Package...' : 'Buy Package Online'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
