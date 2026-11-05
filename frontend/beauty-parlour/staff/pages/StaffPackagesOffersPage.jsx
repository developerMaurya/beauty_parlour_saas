/**
 * @file StaffPackagesOffersPage.jsx
 * @description Salon Packages & Active Promotional Offers View for Staff.
 * Conforms to Phase 05 Section 18 & 19.
 */

import React, { useState, useEffect } from 'react';
import * as pkgApi from '../../../services/api/staff/packageFetcher.js';
import * as offApi from '../../../services/api/staff/offerFetcher.js';

export default function StaffPackagesOffersPage() {
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'offers'
  const [packages, setPackages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pkgRes, offRes] = await Promise.allSettled([
          pkgApi.getPackages(),
          offApi.getOffers(),
        ]);
        if (pkgRes.status === 'fulfilled' && pkgRes.value?.data) {
          setPackages(Array.isArray(pkgRes.value.data) ? pkgRes.value.data : []);
        }
        if (offRes.status === 'fulfilled' && offRes.value?.data) {
          setOffers(Array.isArray(offRes.value.data) ? offRes.value.data : []);
        }
      } catch (err) {
        console.warn('Load err:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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
            <span style={{ fontSize: '24px' }}>🎁</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Salon Packages & Active Deals
            </h1>
          </div>
          <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '13.5px' }}>
            Check bundled packages and promotional discount offers active at your branch
          </p>
        </div>

        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px' }}>
          {[
            { id: 'packages', label: 'Salon Packages' },
            { id: 'offers', label: 'Active Branch Offers' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#94a3b8',
                border: 'none',
                padding: '8px 16px',
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
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading offers...</div>
      ) : activeTab === 'packages' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {packages.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#64748b' }}>
              No packages currently available.
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{pkg.name}</div>
                  <div style={{ color: '#10b981', fontWeight: '800', fontSize: '16px' }}>₹{pkg.price}</div>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0 12px' }}>
                  {pkg.description || 'Exclusive bundled treatments'}
                </p>

                {Array.isArray(pkg.services) && pkg.services.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#cbd5e1', fontWeight: '600', marginBottom: '6px' }}>
                      INCLUDED SERVICES:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {pkg.services.map((srv, idx) => (
                        <span key={idx} style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>
                          ✓ {typeof srv === 'object' ? srv.name : srv}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {offers.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#64748b' }}>
              No active offers at this moment.
            </div>
          ) : (
            offers.map((off) => (
              <div key={off._id} style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>{off.title || off.name}</div>
                  <span style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>
                    {off.discountPercent ? `${off.discountPercent}% OFF` : 'DEAL'}
                  </span>
                </div>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: '8px 0 10px' }}>
                  {off.description || 'Special seasonal deal'}
                </p>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Valid: {off.validFrom ? new Date(off.validFrom).toLocaleDateString() : 'Active'} -{' '}
                  {off.validUntil ? new Date(off.validUntil).toLocaleDateString() : 'Ongoing'}
                </div>
              </div>
            ))
          )}
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
