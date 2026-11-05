/**
 * @file CustomerFavoritesPage.jsx
 * @description Customer Saved & Favorite Treatments, Specialists, and Packages.
 * @module frontend/src/modules/customer/pages/CustomerFavoritesPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as favApi from '../../../services/api/customer/favoriteFetcher.js';

export default function CustomerFavoritesPage() {
  const [favorites, setFavorites] = useState({ services: [], staff: [], packages: [] });
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const res = await favApi.getFavorites();
      if (res.data?.success) {
        setFavorites(res.data.data || { services: [], staff: [], packages: [] });
      }
    } catch (err) {
      console.error('Failed to load favorites', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (type, id) => {
    try {
      setActionLoading(true);
      setMsg({ type: '', text: '' });
      if (type === 'service') {
        await favApi.removeFavoriteService(id);
      } else if (type === 'staff') {
        await favApi.removeFavoriteStaff(id);
      } else if (type === 'package') {
        await favApi.removeFavoritePackage(id);
      }
      setMsg({ type: 'success', text: `Item removed from favorites.` });
      await loadFavorites();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update favorites.' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
            My Curated Favorites
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9375rem', marginTop: '0.25rem' }}>
            Saved salon treatments, preferred master artists, and wellness packages.
          </p>
        </div>
      </div>

      {msg.text && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          border: `1px solid ${msg.type === 'error' ? '#ef4444' : '#10b981'}`,
          color: msg.type === 'error' ? '#ef4444' : '#10b981',
          fontSize: '0.875rem'
        }}>
          {msg.text}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '0.5rem' }}>
        {[
          { key: 'services', label: `Services (${favorites.services?.length || 0})` },
          { key: 'staff', label: `Staff / Artists (${favorites.staff?.length || 0})` },
          { key: 'packages', label: `Packages (${favorites.packages?.length || 0})` }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.625rem 1.25rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.key ? 'linear-gradient(135deg, #ec4899, #8b5cf6)' : 'transparent',
              color: activeTab === tab.key ? '#fff' : '#94a3b8',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.875rem',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
          Loading your favorite items...
        </div>
      ) : (
        <div>
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div>
              {favorites.services?.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                  <p style={{ margin: 0 }}>You haven't saved any services yet.</p>
                  <NavLink to="/customer/services" style={{ display: 'inline-block', marginTop: '1rem', color: '#ec4899', fontWeight: 600, textDecoration: 'none' }}>
                    Explore Services →
                  </NavLink>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {favorites.services.map((item, idx) => {
                    const s = item.serviceId || item;
                    const sid = s._id || s.id || item;
                    return (
                      <div key={idx} style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
                              {s.name || 'Treatment'}
                            </h3>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleRemove('service', sid)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.125rem' }}
                              title="Remove from favorites"
                            >
                              ♥
                            </button>
                          </div>
                          <p style={{ margin: '0.5rem 0', color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.4' }}>
                            {s.description || 'Premium salon treatment with customized formulation.'}
                          </p>
                          <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                            <span>⏱ {s.duration || 45} mins</span>
                            <span>•</span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>₹{s.price || s.finalPrice || 0}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          <button
                            onClick={() => navigate(`/customer/book?serviceId=${sid}`)}
                            style={{
                              flex: 1,
                              padding: '0.625rem',
                              borderRadius: '10px',
                              border: 'none',
                              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                              color: '#fff',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: '0.875rem'
                            }}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <div>
              {favorites.staff?.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                  <p style={{ margin: 0 }}>You haven't saved any stylists or artists yet.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {favorites.staff.map((item, idx) => {
                    const st = item.staffId || item;
                    const stid = st._id || st.id || item;
                    return (
                      <div key={idx} style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              color: '#fff'
                            }}>
                              {(st.name || 'S')[0]}
                            </div>
                            <div>
                              <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>
                                {st.name || 'Master Artist'}
                              </h4>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{st.designation || 'Specialist'}</span>
                            </div>
                          </div>
                          <button
                            disabled={actionLoading}
                            onClick={() => handleRemove('staff', stid)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.125rem' }}
                            title="Remove from favorites"
                          >
                            ♥
                          </button>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#94a3b8' }}>
                          Preferred specialist for signature styling and home services.
                        </p>
                        <button
                          onClick={() => navigate(`/customer/book?staffId=${stid}`)}
                          style={{
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(236, 72, 153, 0.4)',
                            background: 'rgba(236, 72, 153, 0.1)',
                            color: '#ec4899',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.8125rem'
                          }}
                        >
                          Book with this Specialist
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div>
              {favorites.packages?.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', background: 'rgba(30, 41, 59, 0.4)', borderRadius: '16px', border: '1px dashed rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                  <p style={{ margin: 0 }}>You haven't saved any packages yet.</p>
                  <NavLink to="/customer/packages" style={{ display: 'inline-block', marginTop: '1rem', color: '#8b5cf6', fontWeight: 600, textDecoration: 'none' }}>
                    View Packages →
                  </NavLink>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                  {favorites.packages.map((item, idx) => {
                    const pkg = item.packageId || item;
                    const pkgId = pkg._id || pkg.id || item;
                    return (
                      <div key={idx} style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>
                              {pkg.name || 'Signature Wellness Package'}
                            </h3>
                            <button
                              disabled={actionLoading}
                              onClick={() => handleRemove('package', pkgId)}
                              style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.125rem' }}
                              title="Remove from favorites"
                            >
                              ♥
                            </button>
                          </div>
                          <p style={{ margin: '0.5rem 0', color: '#94a3b8', fontSize: '0.875rem' }}>
                            {pkg.description || 'Comprehensive multi-session bundle.'}
                          </p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                            <span>Validity: {pkg.validityDays || 90} Days</span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>₹{pkg.price || 0}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate('/customer/packages')}
                          style={{
                            padding: '0.625rem',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                            color: '#fff',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}
                        >
                          View & Purchase Package
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
