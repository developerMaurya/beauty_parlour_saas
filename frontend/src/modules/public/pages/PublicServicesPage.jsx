/**
 * @file PublicServicesPage.jsx
 * @description Public Beauty Parlour Treatment Menu (High-Contrast White & Rose Theme).
 * Allows prospective clients and guests to explore parlour rituals, pricing, durations, and booking slots.
 * @module frontend/src/modules/public/pages/PublicServicesPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as srvApi from '../../../services/api/public/serviceFetcher.js';
import * as catApi from '../../../services/api/public/categoryFetcher.js';
import QuickParlourBuyModal from '../components/QuickParlourBuyModal.jsx';
import { Sparkles, Clock, Calendar, ShoppingBag, CheckCircle2, Search } from 'lucide-react';

export default function PublicServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedServiceForBuy, setSelectedServiceForBuy] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [sRes, cRes] = await Promise.allSettled([srvApi.getServices(), catApi.getServiceCategories()]);
        if (sRes.status === 'fulfilled') {
          const sData = sRes.value?.data?.services || sRes.value?.data || sRes.value?.services || sRes.value;
          setServices(Array.isArray(sData) ? sData : Array.isArray(sData?.data) ? sData.data : []);
        }
        if (cRes.status === 'fulfilled') {
          const cData = cRes.value?.data?.categories || cRes.value?.data || cRes.value?.categories || cRes.value;
          setCategories(Array.isArray(cData) ? cData : Array.isArray(cData?.data) ? cData.data : []);
        }
      } catch (err) {
        console.error('Failed to load public services', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = services.filter((s) => {
    const matchesCat = selectedCat === 'ALL' || (s.categoryId?._id || s.categoryId || s.category) === selectedCat;
    const matchesSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#be185d', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          <Sparkles size={14} /> Certified Beauty Parlour Rituals
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.025em' }}>
          Parlour & Bridal Treatment Menu
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem', marginTop: '0.5rem', lineHeight: '1.5' }}>
          Explore our range of haircuts, skin rejuvenations, wellness massages, and signature bridal packages.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #f1e6ea',
          borderRadius: '16px',
          padding: '1rem 1.25rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div style={{ flex: '1 1 260px', position: 'relative' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search treatments by name or benefit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.625rem 1rem 0.625rem 2.25rem',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#f8fafc',
              color: '#0f172a',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
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
              border: selectedCat === 'ALL' ? '1px solid #be185d' : '1px solid #e2e8f0',
              background: selectedCat === 'ALL' ? '#be185d' : '#ffffff',
              color: selectedCat === 'ALL' ? '#ffffff' : '#475569',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            All Categories
          </button>
          {categories.map((c) => {
            const cid = c._id || c.id;
            const isSelected = selectedCat === cid;
            return (
              <button
                key={cid}
                onClick={() => setSelectedCat(cid)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: isSelected ? '1px solid #be185d' : '1px solid #e2e8f0',
                  background: isSelected ? '#be185d' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
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
        <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>Loading treatment menu...</div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            padding: '4rem',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
            color: '#64748b',
          }}
        >
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
                  background: '#ffffff',
                  border: '1px solid #f1e6ea',
                  borderRadius: '18px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>{s.name}</h3>
                    <span style={{ fontSize: '1.25rem', color: '#be185d', fontWeight: 900 }}>
                      ₹{s.price || s.finalPrice || 0}
                    </span>
                  </div>

                  <p style={{ margin: '0.625rem 0', color: '#64748b', fontSize: '0.875rem', lineHeight: '1.5' }}>
                    {s.description || 'Customized luxury treatment utilizing verified organic products.'}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem', color: '#475569' }}>
                    <span>⏱ {s.duration || 45} mins</span>
                    <span>•</span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>🏢 Studio & 🚗 Doorstep</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedServiceForBuy(s);
                      setBuyModalOpen(true);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
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
                    <span>Buy (UPI)</span>
                  </button>

                  <button
                    onClick={() => navigate(`/book?serviceId=${sid}`)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
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
                    <span>Book Slot</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <QuickParlourBuyModal isOpen={buyModalOpen} onClose={() => setBuyModalOpen(false)} />
    </div>
  );
}
