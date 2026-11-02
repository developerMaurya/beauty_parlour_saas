/**
 * @file PublicLayout.jsx
 * @description White-Label Public & Guest Showcase Layout.
 * Provides public service browsing, packages, offers, branch locator, and booking flow.
 * @module frontend/src/layouts/PublicLayout
 */

import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import * as publicBusinessApi from '../services/api/public/businessFetcher.js';

export default function PublicLayout() {
  const [business, setBusiness] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadInfo() {
      try {
        const res = await publicBusinessApi.getBusinessInfo();
        if (res?.data) {
          setBusiness(res.data);
        }
      } catch (err) {
        console.warn('Public business load:', err.message);
      }
    }
    loadInfo();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner / Navbar */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0 40px',
          height: '76px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => navigate('/public')}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              boxShadow: '0 6px 18px rgba(236, 72, 153, 0.35)',
            }}
          >
            💅
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '19px', letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 40%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {business?.name || 'LUXE BEAUTY SALON'}
            </div>
            <div style={{ fontSize: '11px', color: '#ec4899', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {business?.tagline || 'Premium Beauty & Spa Experience'}
            </div>
          </div>
        </div>

        {/* Public Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {[
            { label: 'Services', path: '/public/services' },
            { label: 'Packages', path: '/public/packages' },
            { label: 'Offers', path: '/public/offers' },
            { label: 'Branches', path: '/public/branches' },
          ].map((nav) => (
            <NavLink
              key={nav.path}
              to={nav.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#ec4899' : '#94a3b8',
                transition: 'color 0.15s ease',
              })}
            >
              {nav.label}
            </NavLink>
          ))}
        </nav>

        {/* Customer Portal Entry & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <NavLink
            to="/customer/login"
            style={{
              color: '#e2e8f0',
              textDecoration: 'none',
              fontSize: '13.5px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            Customer Login
          </NavLink>
          <NavLink
            to="/public/book"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: 600,
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)',
            }}
          >
            Book Appointment
          </NavLink>
        </div>
      </header>

      {/* Main Public Body */}
      <main style={{ flex: 1, padding: '40px' }}>
        <Outlet />
      </main>

      {/* Modern Public Footer */}
      <footer style={{ background: '#05070c', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '40px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '15px', color: '#f8fafc' }}>
              {business?.name || 'Luxe Salon & Academy'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              White-Label Enterprise Multi-Tenant Salon Management Platform
            </div>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', gap: '20px' }}>
            <NavLink to="/public/services" style={{ color: '#94a3b8', textDecoration: 'none' }}>Services</NavLink>
            <NavLink to="/public/packages" style={{ color: '#94a3b8', textDecoration: 'none' }}>Packages</NavLink>
            <NavLink to="/public/offers" style={{ color: '#94a3b8', textDecoration: 'none' }}>Offers</NavLink>
            <NavLink to="/customer/login" style={{ color: '#ec4899', textDecoration: 'none', fontWeight: 600 }}>Customer Portal</NavLink>
          </div>
        </div>
      </footer>
    </div>
  );
}
