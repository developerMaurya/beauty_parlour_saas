/**
 * @file PublicHomePage.jsx
 * @description White-Label Public Luxury Beauty Parlour Landing Page (Luminous White & Rose-Gold Aesthetic).
 * Displays bridal couture makeovers, organic facials, instant package buy, trial vouchers & doorstep reservations.
 * @module frontend/src/modules/public/pages/PublicHomePage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import * as srvApi from '../../../services/api/public/serviceFetcher.js';
import * as offApi from '../../../services/api/public/offerFetcher.js';
import * as brApi from '../../../services/api/public/branchFetcher.js';
import QuickParlourBuyModal, { PARLOUR_PACKAGES } from '../components/QuickParlourBuyModal.jsx';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ShoppingBag,
  ArrowRight,
  Shield,
  Star,
  Car,
  Home,
  Tag,
  Phone,
  Gift,
} from 'lucide-react';

export default function PublicHomePage() {
  const [business, setBusiness] = useState(null);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [selectedPkgId, setSelectedPkgId] = useState(null);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [bRes, sRes, oRes, brRes] = await Promise.allSettled([
          bizApi.getBusinessInfo(),
          srvApi.getServices({ limit: 6 }),
          offApi.getOffers({ limit: 3 }),
          brApi.getBranches(),
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

  const openBuyModalWithPackage = (pkgId = null, trial = false) => {
    setSelectedPkgId(pkgId);
    setIsTrialMode(trial);
    setBuyModalOpen(true);
  };

  const businessName = business?.name || 'Blossom Luxury Beauty Parlour & Bridal Studio';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '3rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── 1. Hero Section: Luxury Beauty Parlour Aesthetic (Luminous White & Warm Rose) ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fff5f7 0%, #fffbf8 50%, #fdf2f8 100%)',
          border: '1px solid #fce7f3',
          borderRadius: '28px',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(190, 24, 93, 0.04)',
        }}
      >
        {/* Decorative Ambient Accents */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-60px',
            width: '260px',
            height: '260px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Floating Parlour Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '24px',
            background: '#ffffff',
            border: '1px solid #fecdd3',
            color: '#be185d',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            boxShadow: '0 2px 8px rgba(190, 24, 93, 0.08)',
          }}
        >
          <Sparkles size={14} className="text-pink-600" />
          <span>Haute Couture Beauty Parlour & Bridal Studio</span>
        </div>

        {/* Main Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5.5vw, 3.8rem)',
            fontWeight: 900,
            color: '#0f172a',
            lineHeight: '1.15',
            margin: 0,
            maxWidth: '900px',
            letterSpacing: '-0.03em',
          }}
        >
          Elevate Your Natural Radiance & Bespoke Bridal Artistry.
        </h1>

        <p
          style={{
            color: '#475569',
            fontSize: '1.15rem',
            maxWidth: '720px',
            margin: 0,
            lineHeight: '1.6',
            fontWeight: 400,
          }}
        >
          Handcrafted bridal makeovers, 24K gold herbal facials, keratin hair therapy, and certified doorstep parlour care delivered directly to your home.
        </p>

        {/* Action Buttons: Booking + Buy Packages + Free Trial */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: '0.5rem',
          }}
        >
          {/* Primary Book Appointment */}
          <button
            onClick={() => navigate('/book')}
            style={{
              padding: '0.9rem 2rem',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
              color: '#ffffff',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(190, 24, 93, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Calendar size={18} />
            <span>Book Parlour Appointment</span>
          </button>

          {/* Instant Buy Treatment Package */}
          <button
            onClick={() => openBuyModalWithPackage('pkg-bridal')}
            style={{
              padding: '0.9rem 1.8rem',
              borderRadius: '14px',
              border: '1px solid #fbcfe8',
              background: '#ffffff',
              color: '#831843',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            }}
          >
            <ShoppingBag size={18} className="text-pink-600" />
            <span>Buy Treatment Package (UPI/Card)</span>
          </button>

          {/* Claim Trial Voucher */}
          <button
            onClick={() => openBuyModalWithPackage('pkg-trial-voucher', true)}
            style={{
              padding: '0.9rem 1.6rem',
              borderRadius: '14px',
              border: '1px solid #a7f3d0',
              background: '#ecfdf5',
              color: '#065f46',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Gift size={18} className="text-emerald-600" />
            <span>Claim 20% Trial Voucher</span>
          </button>

          {/* Doorstep Home Service Booking */}
          <button
            onClick={() => openBuyModalWithPackage(null, false)}
            style={{
              padding: '0.9rem 1.5rem',
              borderRadius: '14px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Car size={18} className="text-slate-600" />
            <span>Doorstep Home Visit</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginTop: '1.25rem',
            fontSize: '0.85rem',
            color: '#64748b',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>10,000+ Happy Brides & Guests</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Star size={16} className="text-amber-500 fill-amber-500" />
            <span>4.9 / 5 Star Verified Rating</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={16} className="text-pink-600" />
            <span>100% Sterile Single-Use Kits</span>
          </div>
        </div>
      </section>

      {/* ── 2. Feature Highlights (Clean White Cards) ── */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
        {[
          {
            icon: '👰',
            title: 'Master Bridal Artisans',
            desc: 'Certified HD Airbrush, Sabyasachi & Manish Malhotra draping styles, lash extensions, and custom jewelry setting.',
          },
          {
            icon: '🌿',
            title: '100% Organic & Herbal Care',
            desc: 'Pure botanical active formulations from O3+, Shahnaz Husain, and 24K gold leaves for lasting skin radiance.',
          },
          {
            icon: '🚗',
            title: 'Doorstep Home Parlour',
            desc: 'Verified master beauticians arrive at your home with sterilized kits, portable steamers, and luxury towels.',
          },
          {
            icon: '💳',
            title: 'Transparent Pricing & UPI Pass',
            desc: 'Zero hidden salon taxes or surcharge fees. Instant UPI QR verification with digital booking receipts.',
          },
        ].map((f, i) => (
          <div
            key={i}
            style={{
              background: '#ffffff',
              border: '1px solid #f1e6ea',
              borderRadius: '20px',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)',
            }}
          >
            <div style={{ fontSize: '2.4rem' }}>{f.icon}</div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.15rem', fontWeight: 800 }}>{f.title}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', lineHeight: '1.55' }}>{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── 3. Popular Parlour Packages & Instant Purchase Grid ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#be185d', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={14} /> Signature Parlour Packages & Vouchers
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0 0 0', letterSpacing: '-0.02em' }}>
              Handcrafted Treatments & Packages
            </h2>
          </div>
          <button
            onClick={() => openBuyModalWithPackage(null)}
            style={{
              background: '#fff1f2',
              color: '#be185d',
              border: '1px solid #fecdd3',
              borderRadius: '10px',
              padding: '8px 16px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={15} />
            <span>Instant Buy Any Package →</span>
          </button>
        </div>

        {/* 6 High-Conversion Parlour Package Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {PARLOUR_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              style={{
                background: '#ffffff',
                border: pkg.popular ? '2px solid #f43f5e' : '1px solid #f1e6ea',
                borderRadius: '22px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: pkg.popular ? '0 8px 24px rgba(244, 63, 94, 0.1)' : '0 4px 14px rgba(0, 0, 0, 0.03)',
                position: 'relative',
              }}
            >
              {pkg.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '4px 12px',
                    borderRadius: '12px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(190, 24, 93, 0.3)',
                  }}
                >
                  ★ Most Popular
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '28px' }}>{pkg.icon}</span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      background: pkg.trial ? '#ecfdf5' : '#fce7f3',
                      color: pkg.trial ? '#059669' : '#be185d',
                    }}
                  >
                    {pkg.discount}
                  </span>
                </div>

                <h3 style={{ margin: '10px 0 4px 0', fontSize: '1.2rem', color: '#0f172a', fontWeight: 800 }}>
                  {pkg.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span>⏱ {pkg.duration}</span>
                  <span>•</span>
                  <span>🏢 Parlour & 🚗 Home Visit</span>
                </div>

                <div style={{ margin: '14px 0 8px 0', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#be185d' }}>
                    ₹{pkg.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                    ₹{pkg.originalPrice.toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '12px' }}>
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#475569' }}>
                      <CheckCircle2 size={14} className="text-emerald-600 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2 Action Buttons: Instant Buy vs Reserve Slot */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => openBuyModalWithPackage(pkg.id, pkg.trial)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 10px rgba(190, 24, 93, 0.25)',
                  }}
                >
                  <ShoppingBag size={14} />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => navigate(`/book?packageId=${pkg.id}`)}
                  style={{
                    padding: '10px',
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
          ))}
        </div>
      </section>

      {/* ── 4. Seasonal Trial Voucher Callout ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fff1f2 0%, #fdf2f8 50%, #faf5ff 100%)',
          border: '1px solid #fbcfe8',
          borderRadius: '24px',
          padding: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 4px 16px rgba(190, 24, 93, 0.05)',
        }}
      >
        <div>
          <div
            style={{
              color: '#be185d',
              fontSize: '0.82rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            🎟️ Exclusive New Client Privilege
          </div>
          <h3 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0' }}>
            Claim 20% Off Trial Voucher on Any Beauty Parlour Ritual
          </h3>
          <p style={{ color: '#475569', margin: 0, fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.5 }}>
            Valid for both Studio Visits and Doorstep Home Appointments. Includes a complimentary skin analysis & hair health consultation.
          </p>
        </div>

        <button
          onClick={() => openBuyModalWithPackage('pkg-trial-voucher', true)}
          style={{
            padding: '1rem 2rem',
            borderRadius: '14px',
            border: 'none',
            background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(190, 24, 93, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Gift size={18} />
          <span>Claim Trial Voucher (₹499)</span>
        </button>
      </section>

      {/* ── 5. Parlour Branches & Studio Sanctuaries ── */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <span style={{ color: '#be185d', fontSize: '0.82rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Physical Sanctuaries
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '0.25rem 0 0 0', letterSpacing: '-0.02em' }}>
            Our Beauty Parlour Studios
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {(branches.length > 0
            ? branches
            : [
                {
                  name: 'Flagship Parlour & Bridal Studio',
                  address: 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049',
                  phone: '+91 98765 43210',
                },
                {
                  name: 'Cyber City Luxury Express Studio',
                  address: 'Building 10B, DLF Cyber City, Sector 24, Gurugram - 122002',
                  phone: '+91 98111 22334',
                },
                {
                  name: 'Indiranagar Couture Wellness Sanctuary',
                  address: '100ft Road, 12th Main, Indiranagar, Bengaluru - 560038',
                  phone: '+91 98888 77665',
                },
              ]
          ).map((b, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #f1e6ea',
                borderRadius: '18px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📍</span>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 800 }}>
                  {b.name || 'Prime Beauty Parlour'}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', lineHeight: '1.5' }}>
                {typeof b.address === 'object' && b.address
                  ? [b.address.street, b.address.city, b.address.state].filter(Boolean).join(', ') ||
                    'High Street Luxury Arcade, Metro Hub'
                  : String(b.address || 'High Street Luxury Arcade, Metro Hub')}
              </p>
              <div style={{ color: '#0f172a', fontSize: '0.85rem', fontWeight: 600 }}>
                📞 {b.phone || '+91 98765 43210'}
              </div>
              <button
                onClick={() => navigate('/book')}
                style={{
                  marginTop: '0.5rem',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid #fecdd3',
                  background: '#fff1f2',
                  color: '#be185d',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                Visit Studio or Book Specialist →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Buy & Trial Modal */}
      <QuickParlourBuyModal
        isOpen={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        initialPackageId={selectedPkgId}
        isTrial={isTrialMode}
      />
    </div>
  );
}
