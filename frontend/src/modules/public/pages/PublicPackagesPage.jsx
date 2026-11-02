/**
 * @file PublicPackagesPage.jsx
 * @description Public Packages & Bridal Bundles Showcase.
 * Displays curated wellness combinations, bridal regimens, and multi-session service bundles.
 * @module frontend/src/modules/public/pages/PublicPackagesPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pkgApi from '../../../services/api/public/packageFetcher.js';

export default function PublicPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await pkgApi.getPackages();
        if (res.data?.success) {
          setPackages(res.data.data?.packages || res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load public packages', err);
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
          Curated Treatment Packages
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Save with our bridal, festival, and seasonal multi-session bundles designed for maximum radiance.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading salon packages...</div>
      ) : packages.length === 0 ? (
        <div style={{
          padding: '4rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          No packages are currently active. Check back soon for seasonal releases!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {packages.map((pkg) => {
            const pkgId = pkg._id || pkg.id;
            return (
              <div
                key={pkgId}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
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
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }}>{pkg.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.375rem', color: '#10b981', fontWeight: 800 }}>₹{pkg.price || 0}</span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <div style={{ fontSize: '0.8125rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ₹{pkg.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: '0.75rem 0', color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {pkg.description || 'Complete rejuvenation package featuring head-to-toe styling rituals.'}
                  </p>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#ec4899', fontWeight: 700, letterSpacing: '0.05em' }}>
                      Included Treatments ({pkg.services?.length || 0})
                    </span>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: '#cbd5e1', fontSize: '0.8125rem', lineHeight: '1.6' }}>
                      {(pkg.services || []).slice(0, 4).map((srv, i) => (
                        <li key={i}>{srv.name || srv.serviceId?.name || 'Signature Service'}</li>
                      ))}
                      {(pkg.services?.length || 0) > 4 && (
                        <li style={{ color: '#ec4899' }}>+ {pkg.services.length - 4} more treatments</li>
                      )}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#94a3b8', marginTop: '1rem' }}>
                    <span>Validity: <strong>{pkg.validityDays || 90} Days</strong></span>
                    <span>•</span>
                    <span>All Salon Branches</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/public/book?packageId=${pkgId}`)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9375rem',
                    cursor: 'pointer'
                  }}
                >
                  Book Package Consultation
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
