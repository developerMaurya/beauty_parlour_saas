/**
 * @file CustomerMyPackagesPage.jsx
 * @description My Purchased Packages & Remaining Sessions Ledger.
 * Displays total vs used vs remaining treatments, expiry countdown, and redemption history.
 * @module frontend/src/modules/customer/pages/CustomerMyPackagesPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as packageApi from '../../../services/api/customer/packageFetcher.js';

export default function CustomerMyPackagesPage() {
  const [myPackages, setMyPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadPurchased() {
      try {
        setLoading(true);
        const res = await packageApi.getMyPackages();
        const list = Array.isArray(res?.data) ? res.data : (res?.data?.packages || []);
        setMyPackages(list);
      } finally {
        setLoading(false);
      }
    }
    loadPurchased();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            My Packages & Remaining Sessions
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Real-time ledger of your purchased salon memberships, treatments redeemed, and remaining sessions.
          </p>
        </div>
        <NavLink
          to="/customer/packages"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
        >
          + Buy New Package
        </NavLink>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading package usage ledger...</div>
      ) : myPackages.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🎟️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>
            No Active Packages in Your Portfolio
          </h3>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 20px' }}>
            Save up to 30% on salon services by purchasing a package bundle.
          </p>
          <NavLink
            to="/customer/packages"
            style={{ background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.4)', textDecoration: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 600, display: 'inline-block' }}
          >
            Explore Salon Packages
          </NavLink>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {myPackages.map((pkg) => (
            <div
              key={pkg._id}
              style={{
                background: 'rgba(17, 24, 39, 0.75)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '6px' }}>
                      {pkg.status || 'ACTIVE'}
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#94a3b8' }}>
                      Purchase #{pkg.purchaseNumber || 'PKG'}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
                    {pkg.packageName || 'Beauty Package'}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Expires: {pkg.expiryDate ? new Date(pkg.expiryDate).toLocaleDateString() : 'Never'}
                  </div>
                </div>

                {/* Section 34 Ledger: Total Services / Used / Remaining */}
                <div style={{ display: 'flex', gap: '16px', background: 'rgba(255, 255, 255, 0.04)', padding: '12px 20px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Total</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc' }}>{pkg.totalServices || 0}</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Used</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6' }}>{pkg.usedServices || 0}</div>
                  </div>
                  <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Remaining</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#10b981' }}>{pkg.remainingServices || 0}</div>
                  </div>
                </div>
              </div>

              {/* Individual Service breakdown */}
              <div style={{ background: 'rgba(0, 0, 0, 0.2)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Session Quota Breakdown
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {(pkg.services || []).map((s, idx) => (
                    <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#e2e8f0', fontWeight: 500 }}>{s.name || 'Treatment'}</span>
                      <span style={{ fontSize: '12.5px', color: '#10b981', fontWeight: 700 }}>
                        {s.remainingCount ?? s.quantity} / {s.totalCount ?? s.quantity} Left
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => navigate(`/customer/book?packagePurchaseId=${pkg._id}`)}
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  📅 Redeem Session & Book
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
