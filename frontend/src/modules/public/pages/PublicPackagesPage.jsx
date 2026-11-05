/**
 * @file PublicPackagesPage.jsx
 * @description Public Packages & Bridal Bundles Showcase (Luminous White & Rose Theme).
 * Displays curated wellness combinations, bridal regimens, and multi-session service bundles.
 * @module frontend/src/modules/public/pages/PublicPackagesPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as pkgApi from '../../../services/api/public/packageFetcher.js';
import QuickParlourBuyModal, { PARLOUR_PACKAGES } from '../components/QuickParlourBuyModal.jsx';
import { Sparkles, ShoppingBag, Calendar, CheckCircle2 } from 'lucide-react';

export default function PublicPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await pkgApi.getPackages();
        const data = res?.data?.packages || res?.data || res?.packages || res;
        if (Array.isArray(data) && data.length > 0) {
          setPackages(data);
        } else if (Array.isArray(data?.data) && data.data.length > 0) {
          setPackages(data.data);
        } else {
          // Fallback to high-converting parlour packages if database has none seeded
          setPackages(PARLOUR_PACKAGES);
        }
      } catch (err) {
        console.error('Failed to load public packages', err);
        setPackages(PARLOUR_PACKAGES);
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
          <Sparkles size={14} /> Luxury Beauty Bundles & Regimens
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
          Curated Parlour & Bridal Packages
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Save with our bridal, festival, and seasonal multi-session bundles designed for maximum radiance.
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading parlour packages...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {packages.map((pkg) => {
            const pkgId = pkg._id || pkg.id;
            return (
              <div
                key={pkgId}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: 800 }}>{pkg.name}</h3>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.4rem', color: '#be185d', fontWeight: 900 }}>
                        ₹{(pkg.price || 0).toLocaleString()}
                      </span>
                      {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ₹{pkg.originalPrice.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <p style={{ margin: '0.75rem 0', color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {pkg.description || 'Complete rejuvenation package featuring head-to-toe styling rituals.'}
                  </p>

                  <div style={{ borderTop: '1px solid #f1e6ea', paddingTop: '1rem', marginTop: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#be185d', fontWeight: 800, letterSpacing: '0.05em' }}>
                      Included Treatments ({pkg.features?.length || pkg.services?.length || 4})
                    </span>
                    <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.25rem', color: '#334155', fontSize: '0.82rem', lineHeight: '1.6' }}>
                      {(pkg.features || pkg.services || ['HD Airbrush Makeup', 'Hairstyling & Draping', 'Nail Art & Lashes', 'Trial Consultation']).slice(0, 4).map((srv, i) => (
                        <li key={i}>{typeof srv === 'string' ? srv : srv.name || srv.serviceId?.name || 'Signature Ritual'}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#64748b', marginTop: '1rem' }}>
                    <span>Validity: <strong>{pkg.validityDays || 90} Days</strong></span>
                    <span>•</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>🏢 Studio & 🚗 Home Visit</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedPkgId(pkgId);
                      setBuyModalOpen(true);
                    }}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <ShoppingBag size={14} />
                    <span>Buy (UPI/Card)</span>
                  </button>

                  <button
                    onClick={() => navigate(`/book?packageId=${pkgId}`)}
                    style={{
                      padding: '0.8rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <Calendar size={14} />
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickParlourBuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        initialPackageId={selectedPkgId}
      />
    </div>
  );
}
