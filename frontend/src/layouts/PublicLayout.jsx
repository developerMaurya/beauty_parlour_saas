/**
 * @file PublicLayout.jsx
 * @description White-Label Public Luxury Beauty Parlour Showcase Layout (Luminous White & Rose-Gold Theme).
 * Provides public service browsing, packages, offers, branch locator, academy courses,
 * about page, contact form, and dynamic secondary sub-navigation ribbon configured by Admin.
 * @module frontend/src/layouts/PublicLayout
 */

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import * as publicBusinessApi from '../services/api/public/businessFetcher.js';
import QuickParlourBuyModal from '../modules/public/components/QuickParlourBuyModal.jsx';
import {
  Sparkles,
  Phone,
  Calendar,
  Clock,
  MapPin,
  Mail,
  GraduationCap,
  MessageCircle,
  Scissors,
  Heart,
  Award,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';

export default function PublicLayout({ children }) {
  const [business, setBusiness] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await publicBusinessApi.getBusinessInfo();
        const data = res?.data?.data || res?.data || res;
        if (data && typeof data === 'object') {
          setBusiness(data);
        }
      } catch (err) {
        console.warn('Public business load:', err.message);
      }
    }
    loadInfo();
  }, []);

  const businessName = business?.name || 'Blossom Luxury Beauty Parlour & Bridal Studio';
  const tagline =
    business?.websiteConfig?.tagline ||
    business?.tagline ||
    'Bespoke Bridal Makeovers, Herbal Glow Facials, Nail Artistry & Doorstep Parlour Care';
  const primaryColor = business?.websiteConfig?.primaryColor || business?.branding?.primaryColor || '#be185d';
  const announcement = business?.websiteConfig?.announcementBar || {
    isVisible: true,
    text: 'Special Privilege: 20% OFF on First Online Beauty Parlour Appointment! Use Code: BLOSSOM20',
  };
  const phone = business?.websiteConfig?.contactPhone || business?.branches?.[0]?.phone || '+91 98765 43210';
  const email = business?.websiteConfig?.contactEmail || business?.branches?.[0]?.email || 'concierge@blossombeauty.in';
  const rawAddr =
    business?.websiteConfig?.address ||
    business?.branches?.[0]?.address ||
    'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049';
  const address =
    typeof rawAddr === 'object' && rawAddr
      ? [rawAddr.street, rawAddr.city, rawAddr.state].filter(Boolean).join(', ') ||
        'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049'
      : String(rawAddr);

  // Dynamic Sub-Nav Categories configured for Beauty Parlour
  const dynamicCategories =
    business?.categories?.length > 0
      ? business.categories
      : business?.websiteConfig?.dynamicCategories?.length > 0
      ? business.websiteConfig.dynamicCategories
      : [
          { name: 'Bridal Couture & HD Makeup', slug: 'bridal', icon: '👰' },
          { name: 'Herbal & Gold Facials', slug: 'facials', icon: '💆' },
          { name: 'Hair Botox & Keratin Spa', slug: 'hair', icon: '💇' },
          { name: 'Gel Nails & Nail Art', slug: 'nails', icon: '💅' },
          { name: 'Mehendi & Pre-Bridal', slug: 'mehendi', icon: '🌿' },
          { name: 'Doorstep Home Parlour', slug: 'home-service', icon: '🚗', path: '/book?mode=doorstep' },
          { name: 'Cosmetology Academy', slug: 'academy', icon: '🎓', path: '/academy' },
          { name: 'Instant Booking', slug: 'booking', icon: '📅', path: '/book' },
        ];

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div
      className="public-layout-light"
      data-theme="light"
      style={{
        minHeight: '100vh',
        background: '#fffdfa',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Navigation Header (Clean White Luxury Beauty Parlour) */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #f1e6ea',
          padding: '0 32px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
        }}
      >
        {/* Brand Logo & Name */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
          onClick={() => navigate('/storefront')}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 4px 14px rgba(190, 24, 93, 0.25)',
              flexShrink: 0,
              overflow: 'hidden',
              color: '#ffffff',
            }}
          >
            <img
              src={business?.websiteConfig?.logoUrl || '/kashi-logo.png'}
              alt={businessName}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <div
              style={{
                fontWeight: 900,
                fontSize: '17px',
                letterSpacing: '-0.02em',
                color: '#0f172a',
                whiteSpace: 'nowrap',
              }}
            >
              {businessName}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#be185d',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {tagline}
            </div>
          </div>
        </div>

        {/* Primary Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {(business?.websiteConfig?.navMenu?.length > 0
            ? business.websiteConfig.navMenu.filter((m) => m.isVisible !== false)
            : [
                { label: 'Home', path: '/storefront' },
                { label: 'Services', path: '/services' },
                { label: 'Packages', path: '/packages' },
                { label: 'Offers', path: '/offers' },
                { label: 'Branches', path: '/branches' },
                { label: 'Academy', path: '/academy' },
                { label: 'About Us', path: '/about' },
                { label: 'Contact', path: '/contact' },
              ]
          ).map((nav) => (
            <NavLink
              key={nav.path}
              to={nav.path}
              end={nav.path === '/storefront'}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#be185d' : '#334155',
                padding: '6px 10px',
                borderRadius: '8px',
                background: isActive ? '#fff1f2' : 'transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <NavLink
            to="/book"
            style={{
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 22px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(190, 24, 93, 0.3)',
              whiteSpace: 'nowrap',
              transition: 'transform 0.15s ease',
            }}
          >
            Book Appointment
          </NavLink>
        </div>
      </header>

      {/* 3. Dynamic Secondary Sub-Header Navigation Ribbon */}
      <div
        style={{
          background: '#fff8fa',
          borderBottom: '1px solid #fce7f3',
          padding: '8px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#9d174d',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <Sparkles className="w-3 h-3 text-pink-600" /> Curated Parlour Menus:
        </span>

        {dynamicCategories.map((cat, idx) => {
          if (!cat) return null;
          const catName = typeof cat === 'string' ? cat : cat.name || 'Category';
          const catSlug = typeof cat === 'string' ? cat.toLowerCase().replace(/[^a-z0-9]/g, '-') : cat.slug || 'all';
          const catIcon = typeof cat === 'object' && cat.icon ? cat.icon : '✨';
          const targetPath =
            typeof cat === 'object' && cat.path
              ? cat.path
              : catSlug === 'academy'
              ? '/academy'
              : catSlug === 'booking'
              ? '/book'
              : `/services?category=${cat._id || catSlug}`;
          const isActive =
            location.pathname === targetPath || (location.search?.includes(catSlug) && location.pathname === '/services');

          return (
            <NavLink
              key={cat._id || catSlug || idx}
              to={targetPath}
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#be185d' : '#475569',
                background: isActive ? '#fce7f3' : '#ffffff',
                border: isActive ? '1px solid #be185d' : '1px solid #e2e8f0',
                padding: '4px 12px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{catIcon}</span>
              <span>{catName}</span>
            </NavLink>
          );
        })}
      </div>

      {/* 4. Main Body Content */}
      <main
        style={{
          flex: 1,
          padding: '36px 32px',
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
        }}
      >
        {children || <Outlet />}
      </main>

      {/* 5. Complete Luxury Beauty Parlour & Bridal Studio Footer (White & Warm Slate) */}
      <footer
        style={{
          background: '#fdfaf8',
          borderTop: '1px solid #f1e6ea',
          padding: '50px 32px 30px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '2.5rem',
            marginBottom: '40px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#ffffff',
                }}
              >
                💄
              </div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#0f172a' }}>{businessName}</div>
            </div>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
              {tagline}. Experience couture bridal makeovers, clinical herbal facials, nail enhancements, and doorstep home parlour visits by verified master beauticians.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#be185d',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                }}
              >
                📸
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                }}
              >
                📘
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  textDecoration: 'none',
                  border: '1px solid #e2e8f0',
                }}
              >
                ▶️
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '14px' }}>
              Parlour Treatments & Packages
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <NavLink to="/services" style={{ color: '#64748b', textDecoration: 'none' }}>
                Bridal Couture & HD Makeup
              </NavLink>
              <NavLink to="/services" style={{ color: '#64748b', textDecoration: 'none' }}>
                Herbal & 24K Gold Facials
              </NavLink>
              <NavLink to="/packages" style={{ color: '#64748b', textDecoration: 'none' }}>
                Bridal & Pre-Wedding Rituals
              </NavLink>
              <NavLink to="/offers" style={{ color: '#64748b', textDecoration: 'none' }}>
                Seasonal Trial Offers
              </NavLink>
              <button
                onClick={() => setIsBuyModalOpen(true)}
                style={{
                  color: '#be185d',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textAlign: 'left',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Instant Buy Package (UPI/Card) →
              </button>
            </div>
          </div>

          {/* Academy & Studio */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '14px' }}>
              Academy & Studio Sanctuaries
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <NavLink to="/academy" style={{ color: '#64748b', textDecoration: 'none' }}>
                Cosmetology Academy Courses
              </NavLink>
              <NavLink to="/branches" style={{ color: '#64748b', textDecoration: 'none' }}>
                Studio Locations & Directions
              </NavLink>
              <NavLink to="/about" style={{ color: '#64748b', textDecoration: 'none' }}>
                Heritage & Certified Beauticians
              </NavLink>
              <NavLink to="/contact" style={{ color: '#64748b', textDecoration: 'none' }}>
                Contact Concierge
              </NavLink>
            </div>
          </div>

          {/* Direct Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a', marginBottom: '14px' }}>
              Concierge & Home Dispatch
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone className="w-4 h-4 text-pink-600 flex-shrink-0" />
                <a href={`tel:${phone}`} style={{ color: '#0f172a', textDecoration: 'none', fontWeight: 600 }}>
                  {phone}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <a href={`mailto:${email}`} style={{ color: '#64748b', textDecoration: 'none' }}>
                  {email}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" style={{ marginTop: '3px' }} />
                <span style={{ color: '#64748b' }}>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            borderTop: '1px solid #f1e6ea',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '12px',
            color: '#94a3b8',
          }}
        >
          <div>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span style={{ color: '#94a3b8' }}>Certified Organic Care & Doorstep Sanitization</span>
          </div>
        </div>
      </footer>

      {/* Global Quick Buy & Trial Modal */}
      <QuickParlourBuyModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </div>
  );
}
