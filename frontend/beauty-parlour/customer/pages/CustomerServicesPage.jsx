/**
 * @file CustomerServicesPage.jsx
 * @description Customer Salon Treatment & Beauty Services Catalog.
 * Supports category tabs, instant search, duration/price filters, and booking shortcut.
 * @module frontend/src/modules/customer/pages/CustomerServicesPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as serviceApi from '../../../services/api/customer/serviceFetcher.js';
import * as categoryApi from '../../../services/api/customer/categoryFetcher.js';
import * as favApi from '../../../services/api/customer/favoriteFetcher.js';

export default function CustomerServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCatalog() {
      try {
        setLoading(true);
        const [svcRes, catRes, favRes] = await Promise.allSettled([
          serviceApi.getServices(),
          categoryApi.getCategories(),
          favApi.getFavorites(),
        ]);

        if (svcRes.status === 'fulfilled' && svcRes.value?.data) {
          const list = Array.isArray(svcRes.value.data) ? svcRes.value.data : (svcRes.value.data?.services || []);
          setServices(list);
        }
        if (catRes.status === 'fulfilled' && catRes.value?.data) {
          const catList = Array.isArray(catRes.value.data) ? catRes.value.data : (catRes.value.data?.categories || []);
          setCategories(catList);
        }
        if (favRes.status === 'fulfilled' && favRes.value?.data?.services) {
          const favIds = new Set(favRes.value.data.services.map((s) => s._id || s));
          setFavorites(favIds);
        }
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const toggleFavorite = async (serviceId) => {
    try {
      if (favorites.has(serviceId)) {
        await favApi.removeFavoriteService(serviceId);
        const next = new Set(favorites);
        next.delete(serviceId);
        setFavorites(next);
      } else {
        await favApi.addFavoriteService(serviceId);
        const next = new Set(favorites);
        next.add(serviceId);
        setFavorites(next);
      }
    } catch (err) {
      console.warn('Favorite toggle error:', err.message);
    }
  };

  const filtered = services.filter((s) => {
    const matchesCat = selectedCategory === 'ALL' || s.categoryId?._id === selectedCategory || s.categoryId === selectedCategory || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.description && s.description.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            Salon Treatments & Services
          </h1>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
            Choose from our luxury hair, skin, bridal and nail couture offerings.
          </p>
        </div>
        <input
          type="text"
          placeholder="🔍 Search service name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '260px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px', outline: 'none' }}
        />
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        <button
          onClick={() => setSelectedCategory('ALL')}
          style={{
            background: selectedCategory === 'ALL' ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 18px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          All Treatments
        </button>
        {categories.map((c) => (
          <button
            key={c._id}
            onClick={() => setSelectedCategory(c._id)}
            style={{
              background: selectedCategory === c._id ? 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' : 'rgba(255, 255, 255, 0.05)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 18px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid of Services */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading services...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
          No treatments found matching your criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((s) => {
            const isFav = favorites.has(s._id);
            return (
              <div
                key={s._id}
                style={{
                  background: 'rgba(17, 24, 39, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '18px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#ec4899', letterSpacing: '0.06em' }}>
                      {s.categoryId?.name || 'Hair & Beauty'}
                    </span>
                    <button
                      onClick={() => toggleFavorite(s._id)}
                      style={{ background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                      title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFav ? '💖' : '🤍'}
                    </button>
                  </div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>
                    {s.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 16px', minHeight: '36px' }}>
                    {s.description || 'Premium salon care performed by experienced senior stylists.'}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                    <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
                      ⏱️ {s.durationMinutes || 45} mins
                    </div>
                    <div style={{ fontSize: '19px', fontWeight: 800, color: '#10b981' }}>
                      ₹{s.price}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/customer/book?serviceId=${s._id}`)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '13.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Select & Book Treatment
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
