/**
 * @file PublicHomePage.jsx
 * @description White-Label Public Salon & Spa Showcase Landing Page.
 * Displays brand identity, signature rituals, active promotions, and direct booking gateway.
 * @module frontend/src/modules/public/pages/PublicHomePage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import * as srvApi from '../../../services/api/public/serviceFetcher.js';
import * as offApi from '../../../services/api/public/offerFetcher.js';
import * as brApi from '../../../services/api/public/branchFetcher.js';

export default function PublicHomePage() {
  const [business, setBusiness] = useState(null);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [bRes, sRes, oRes, brRes] = await Promise.allSettled([
          bizApi.getBusinessInfo(),
          srvApi.getServices({ limit: 6 }),
          offApi.getOffers({ limit: 3 }),
          brApi.getBranches()
        ]);
        if (bRes.status === 'fulfilled') {
          const bData = bRes.value?.data?.data || bRes.value?.data || bRes.value;
          if (bData && typeof bData === 'object') setBusiness(bData);
        }
        if (sRes.status === 'fulfilled') {
          const sData = sRes.value?.data?.data || sRes.value?.data || sRes.value;
          setFeaturedServices(sData?.services || (Array.isArray(sData) ? sData : []));
        }
        if (oRes.status === 'fulfilled') {
          const oData = oRes.value?.data?.data || oRes.value?.data || oRes.value;
          setOffers(oData?.offers || (Array.isArray(oData) ? oData : []));
        }
        if (brRes.status === 'fulfilled') {
          const brData = brRes.value?.data?.data || brRes.value?.data || brRes.value;
          setBranches(brData?.branches || (Array.isArray(brData) ? brData : []));
        }
      } catch (err) {
        console.error('Failed to load public portal info', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const banners = business?.websiteConfig?.banners?.filter((b) => b.isActive !== false) || [];
  const activeSlide = banners.length > 0 ? banners[currentSlide % banners.length] : null;

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '3rem' }}>
      {/* Multi-Banner Hero Slider */}
      <section style={{
        background: activeSlide?.imageUrl
          ? `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.9)), url(${activeSlide.imageUrl}) center/cover no-repeat`
          : 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(139, 92, 246, 0.15))',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        padding: '5rem 2rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '380px',
        justifyContent: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        transition: 'background 0.5s ease',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.875rem',
          borderRadius: '20px',
          background: 'rgba(236, 72, 153, 0.2)',
          border: '1px solid rgba(236, 72, 153, 0.4)',
          color: '#f472b6',
          fontSize: '0.8125rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          ✨ Ultra-Luxury Salon & Spa Sanctuary
        </div>

        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          color: '#f8fafc',
          lineHeight: '1.15',
          margin: 0,
          maxWidth: '850px',
          letterSpacing: '-0.03em'
        }}>
          {activeSlide?.title || business?.websiteConfig?.heroHeading || 'Artisanal Beauty Care & Doorstep Luxury Treatments'}
        </h1>

        <p style={{ color: '#cbd5e1', fontSize: '1.125rem', maxWidth: '660px', margin: 0, lineHeight: '1.6' }}>
          {activeSlide?.subtitle || business?.websiteConfig?.heroSubheading || 'Experience couture bridal makeovers, customized organic facials, and doorstep home services performed by certified master artists.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button
            onClick={() => navigate(activeSlide?.buttonUrl || '/book')}
            style={{
              padding: '0.875rem 2rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(236, 72, 153, 0.35)',
              transition: 'transform 0.2s'
            }}
          >
            {activeSlide?.buttonText || 'Book Appointment Now'}
          </button>
          <button
            onClick={() => navigate('/services')}
            style={{
              padding: '0.875rem 1.75rem',
              borderRadius: '14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(30, 41, 59, 0.7)',
              color: '#f8fafc',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Browse Treatment Menu
          </button>
        </div>

        {/* Slide Indicator Dots */}
        {banners.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '1.5rem', zIndex: 10 }}>
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                style={{
                  width: (currentSlide % banners.length) === i ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '999px',
                  background: (currentSlide % banners.length) === i ? '#ec4899' : 'rgba(255, 255, 255, 0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
                title={`Slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {[
          { icon: '🌿', title: 'Organic Formulations', desc: 'Sustainably sourced botanical active ingredients for radiant skincare results.' },
          { icon: '🚗', title: 'Doorstep Home Care', desc: 'Certified specialists arrive at your home with sanitized, sterile kit setups.' },
          { icon: '⭐', title: 'Certified Artists', desc: 'Top 1% industry stylists with verified accreditations and master portfolio work.' },
          { icon: '🔒', title: 'Transparent Pricing', desc: 'Zero hidden salon taxes or surcharge fees with instantaneous verified tax invoices.' }
        ].map((f, i) => (
          <div key={i} style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '18px',
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ fontSize: '2rem' }}>{f.icon}</div>
            <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '1.125rem', fontWeight: 700 }}>{f.title}</h3>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Signature Treatments Showcase */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ color: '#ec4899', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>Signature Catalog</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '0.25rem 0 0 0' }}>Popular Treatments</h2>
          </div>
          <NavLink to="/services" style={{ color: '#ec4899', fontWeight: 600, textDecoration: 'none', fontSize: '0.9375rem' }}>
            View Full Menu ({featuredServices.length}+) →
          </NavLink>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {featuredServices.slice(0, 6).map((s, idx) => (
            <div key={idx} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '18px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.25rem'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>{s.name}</h3>
                  <span style={{ fontSize: '1.125rem', color: '#10b981', fontWeight: 800 }}>₹{s.price || s.finalPrice || 999}</span>
                </div>
                <p style={{ margin: '0.5rem 0', color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {s.description || 'Customized luxury treatment with certified organic nourishment.'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.8125rem', color: '#cbd5e1' }}>
                  <span>⏱ {s.duration || 45} mins</span>
                  <span>•</span>
                  <span>Salon & Home Service</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/book?serviceId=${s._id || s.id}`)}
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
                Instant Book Treatment
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Seasonal Offers Callout */}
      {offers.length > 0 && (
        <section style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.15))',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '24px',
          padding: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <span style={{ color: '#a78bfa', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>Exclusive Promotion</span>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', margin: '0.25rem 0' }}>
              {offers[0].name || 'Seasonal Glow Promotion'}
            </h3>
            <p style={{ color: '#cbd5e1', margin: 0, fontSize: '0.9375rem' }}>
              {offers[0].description || 'Unlock up to 30% discount on bridal and pre-wedding packages.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/offers')}
            style={{
              padding: '0.875rem 1.75rem',
              borderRadius: '12px',
              border: 'none',
              background: '#8b5cf6',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Claim Promotional Offers
          </button>
        </section>
      )}

      {/* Branch Locations */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <span style={{ color: '#ec4899', fontSize: '0.8125rem', fontWeight: 700, textTransform: 'uppercase' }}>Physical Locations</span>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: '0.25rem 0 0 0' }}>Salon Sanctuaries</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {branches.map((b, idx) => (
            <div key={idx} style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>📍</span>
                <h3 style={{ margin: 0, fontSize: '1.125rem', color: '#f8fafc', fontWeight: 700 }}>{b.name || 'Prime Salon'}</h3>
              </div>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.4' }}>
                {typeof b.address === 'object' && b.address
                  ? [b.address.street, b.address.city, b.address.state].filter(Boolean).join(', ') || 'High Street Luxury Arcade, Metro Hub'
                  : String(b.address || 'High Street Luxury Arcade, Metro Hub')}
              </p>
              <div style={{ color: '#cbd5e1', fontSize: '0.8125rem' }}>
                📞 {b.phone || '+91 98765 43210'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
