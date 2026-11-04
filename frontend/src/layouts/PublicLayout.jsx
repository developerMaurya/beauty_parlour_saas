/**
 * @file PublicLayout.jsx
 * @description White-Label Public & Guest Showcase Layout.
 * Provides public service browsing, packages, offers, branch locator, academy courses,
 * about page, contact form, and dynamic secondary sub-navigation ribbon configured by Admin.
 * @module frontend/src/layouts/PublicLayout
 */

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import * as publicBusinessApi from '../services/api/public/businessFetcher.js';
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
} from 'lucide-react';

export default function PublicLayout() {
  const [business, setBusiness] = useState(null);
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

  const businessName = business?.name || 'GLAMOUR COSMETOLOGY ACADEMY & SALON';
  const tagline = business?.websiteConfig?.tagline || business?.tagline || 'Haute Couture Salon & Accredited Cosmetology Academy';
  const primaryColor = business?.websiteConfig?.primaryColor || business?.branding?.primaryColor || '#ec4899';
  const announcement = business?.websiteConfig?.announcementBar;
  const phone = business?.websiteConfig?.contactPhone || business?.branches?.[0]?.phone || '+91 98765 43210';
  const email = business?.websiteConfig?.contactEmail || business?.branches?.[0]?.email || 'concierge@glamouracademy.in';
  const rawAddr = business?.websiteConfig?.address || business?.branches?.[0]?.address || 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049';
  const address = typeof rawAddr === 'object' && rawAddr
    ? ([rawAddr.street, rawAddr.city, rawAddr.state].filter(Boolean).join(', ') || 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049')
    : String(rawAddr);

  // Dynamic Sub-Nav Categories configured by Admin
  const dynamicCategories = business?.categories?.length > 0 ? business.categories : (
    business?.websiteConfig?.dynamicCategories?.length > 0 ? business.websiteConfig.dynamicCategories : [
      { name: 'Hair Care & Styling', slug: 'hair', icon: '✂️' },
      { name: 'Skin & Facials', slug: 'skin', icon: '💆' },
      { name: 'Bridal Artistry', slug: 'bridal', icon: '💄' },
      { name: 'Nails & Pedicure', slug: 'nails', icon: '💅' },
      { name: 'Academy Training', slug: 'academy', icon: '🎓', path: '/academy' },
      { name: 'Luxury Spa', slug: 'spa', icon: '🌿' },
      { name: 'Instant Booking', slug: 'booking', icon: '📅', path: '/book' },
    ]
  );

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Optional Top Announcement Ticker */}
      {announcement?.isVisible !== false && announcement?.text && (
        <div
          style={{
            background: 'linear-gradient(90deg, #be185d 0%, #7c3aed 50%, #be185d 100%)',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.03em',
            textAlign: 'center',
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>✨</span>
          <span>{announcement.text}</span>
          <NavLink to="/book" style={{ color: '#fde047', textDecoration: 'underline', marginLeft: '6px' }}>
            Book Now &gt;
          </NavLink>
        </div>
      )}

      {/* 2. Main Navigation Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(9, 13, 22, 0.92)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 32px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${primaryColor} 0%, #8b5cf6 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: `0 6px 18px rgba(236, 72, 153, 0.35)`,
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            {business?.websiteConfig?.logoUrl ? (
              <img
                src={business.websiteConfig.logoUrl}
                alt={businessName}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              '💅'
            )}
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
              {businessName}
            </div>
            <div style={{ fontSize: '11px', color: primaryColor, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {tagline}
            </div>
          </div>
        </div>

        {/* Primary Navigation Links (Dynamic from CMS) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
          {(business?.websiteConfig?.navMenu?.length > 0
            ? business.websiteConfig.navMenu.filter((m) => m.isVisible !== false)
            : [
                { label: 'Home', path: '/' },
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
              end={nav.path === '/'}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? primaryColor : '#cbd5e1',
                padding: '6px 8px',
                borderRadius: '6px',
                background: isActive ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <NavLink
            to="/customer/login"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            Customer Login
          </NavLink>
          <NavLink
            to="/book"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, #8b5cf6 100%)`,
              color: '#ffffff',
              textDecoration: 'none',
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 700,
              boxShadow: `0 4px 16px rgba(236, 72, 153, 0.4)`,
              whiteSpace: 'nowrap',
            }}
          >
            Book Appointment
          </NavLink>
        </div>
      </header>

      {/* 3. Dynamic Secondary Sub-Header Navigation Ribbon (Right below the main header) */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          backdropFilter: 'blur(10px)',
          padding: '8px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Sparkles className="w-3 h-3 text-pink-400" /> Curated Menus:
        </span>

        {dynamicCategories.map((cat, idx) => {
          if (!cat) return null;
          const catName = typeof cat === 'string' ? cat : (cat.name || 'Category');
          const catSlug = typeof cat === 'string' ? cat.toLowerCase().replace(/[^a-z0-9]/g, '-') : (cat.slug || 'all');
          const catIcon = typeof cat === 'object' && cat.icon ? cat.icon : '✨';
          const targetPath = typeof cat === 'object' && cat.path
            ? cat.path
            : (catSlug === 'academy' ? '/academy' : (catSlug === 'booking' ? '/book' : `/services?category=${cat._id || catSlug}`));
          const isActive = location.pathname === targetPath || (location.search?.includes(catSlug) && location.pathname === '/services');

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
                color: isActive ? '#f8fafc' : '#cbd5e1',
                background: isActive ? 'rgba(236, 72, 153, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                border: isActive ? `1px solid ${primaryColor}` : '1px solid rgba(255, 255, 255, 0.08)',
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
      <main style={{ flex: 1, padding: '36px 32px', maxWidth: '1440px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        <Outlet />
      </main>

      {/* 5. Complete Luxury Salon & Academy Footer */}
      <footer style={{ background: '#05070c', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '50px 32px 30px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '40px' }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💅</div>
              <div style={{ fontWeight: 800, fontSize: '16px', color: '#f8fafc' }}>{businessName}</div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
              {tagline}. Experience bespoke beauty care, clinical dermatology treatments, and internationally accredited cosmetology certification.
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>📸</a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>📘</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.08)' }}>▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '14px' }}>Services & Menus</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <NavLink to="/services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Hair Styling & Colour</NavLink>
              <NavLink to="/services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Skin Care & Facials</NavLink>
              <NavLink to="/packages" style={{ color: '#94a3b8', textDecoration: 'none' }}>Bridal & Groom Packages</NavLink>
              <NavLink to="/offers" style={{ color: '#94a3b8', textDecoration: 'none' }}>Promotional Offers</NavLink>
              <NavLink to="/book" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 600 }}>Reserve Appointment</NavLink>
            </div>
          </div>

          {/* Academy & Heritage */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '14px' }}>Academy & Sanctuary</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <NavLink to="/academy" style={{ color: '#94a3b8', textDecoration: 'none' }}>Cosmetology Courses</NavLink>
              <NavLink to="/branches" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sanctuary Locations</NavLink>
              <NavLink to="/about" style={{ color: '#94a3b8', textDecoration: 'none' }}>Heritage & Story</NavLink>
              <NavLink to="/contact" style={{ color: '#94a3b8', textDecoration: 'none' }}>Contact Concierge</NavLink>
            </div>
          </div>

          {/* Direct Contact */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#f8fafc', marginBottom: '14px' }}>Concierge Desk</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px', color: '#cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <a href={`tel:${phone}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: 600 }}>{phone}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href={`mailto:${email}`} style={{ color: '#cbd5e1', textDecoration: 'none' }}>{email}</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0" style={{ marginTop: '3px' }} />
                <span>{address}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: '#64748b' }}>
          <div>
            © {new Date().getFullYear()} {businessName}. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <NavLink to="/customer/login" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 600 }}>Customer Portal</NavLink>
            <NavLink to="/staff/login" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 500 }}>Staff Login</NavLink>
            <NavLink to="/student/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 500 }}>Student Login</NavLink>
            <NavLink to="/admin/login" style={{ color: '#f59e0b', textDecoration: 'none', fontWeight: 500 }}>Salon Admin</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
