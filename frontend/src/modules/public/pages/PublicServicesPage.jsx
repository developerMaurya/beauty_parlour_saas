/**
 * @file PublicServicesPage.jsx
 * @description Public Salon & Spa Treatment Menu.
 * Allows prospective clients and guests to explore salon rituals, pricing, durations, and booking slots.
 * @module frontend/src/modules/public/pages/PublicServicesPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as srvApi from '../../../services/api/public/serviceFetcher.js';
import * as catApi from '../../../services/api/public/categoryFetcher.js';

export default function PublicServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sRes, cRes] = await Promise.allSettled([
          srvApi.getServices(),
          catApi.getServiceCategories()
        ]);
        if (sRes.status === 'fulfilled' && sRes.value.data?.success) {
          setServices(sRes.value.data.data?.services || sRes.value.data.data || []);
        }
        if (cRes.status === 'fulfilled' && cRes.value.data?.success) {
          setCategories(cRes.value.data.data?.categories || cRes.value.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load public services', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = services.filter(s => {
    const matchesCat = selectedCat === 'ALL' || (s.categoryId?._id || s.categoryId || s.category) === selectedCat;
    const matchesSearch = !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.025em' }}>
          Salon & Spa Treatment Menu
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Explore our range of haircuts, skin rejuvenations, wellness massages, and signature bridal packages.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '1rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1 1 260px' }}>
          <input
            type="text"
            placeholder="Search treatments by name or benefit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 1rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#0f172a',
              color: '#fff',
              fontSize: '0.875rem'
            }}
          />
        </div>

        {/* Categories Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button
            onClick={() => setSelectedCat('ALL')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: 'none',
              background: selectedCat === 'ALL' ? '#ec4899' : 'rgba(255, 255, 255, 0.06)',
              color: '#fff',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All Categories
          </button>
          {categories.map((c) => {
            const cid = c._id || c.id;
            return (
              <button
                key={cid}
                onClick={() => setSelectedCat(cid)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedCat === cid ? '#ec4899' : 'rgba(255, 255, 255, 0.06)',
                  color: '#fff',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Services List Grid */}
      {loading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>Loading treatment menu...</div>
      ) : filtered.length === 0 ? (
        <div style={{
          padding: '4rem',
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.4)',
          borderRadius: '16px',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          color: '#94a3b8'
        }}>
          No treatments match your criteria. Try adjusting your search query.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((s) => {
            const sid = s._id || s.id;
            return (
              <div
                key={sid}
                style={{
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1875rem', color: '#f8fafc', fontWeight: 700 }}>{s.name}</h3>
                    <span style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 800 }}>₹{s.price || s.finalPrice || 0}</span>
                  </div>

                  <p style={{ margin: '0.625rem 0', color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {s.description || 'Customized luxury treatment utilizing verified organic products.'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                    <span>⏱ {s.duration || 45} mins</span>
                    <span>•</span>
                    <span style={{ color: '#ec4899', fontWeight: 600 }}>Salon & Home Dispatch</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/public/book?serviceId=${sid}`)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Book as Guest / Client
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
