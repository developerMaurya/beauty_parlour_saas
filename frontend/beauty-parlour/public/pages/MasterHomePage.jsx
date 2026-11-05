/**
 * @file MasterHomePage.jsx
 * @description Intelligent Root Entry Router for Kashi Service Multi-Tenant Ecosystem.
 * Responsibilities:
 *   - On Main Platform Domain (kashiservice.com / localhost): Renders Kashi Service Platform Landing Page
 *   - On Tenant Subdomain (e.g. riya.kashiservice.com / blossom-salon.localhost): Renders Tenant Public Website
 *   - Provides instant 1-click view switcher between Kashi Service Platform & Active Salon Storefront
 * @module frontend/src/modules/public/pages/MasterHomePage
 */

import React, { useState, useEffect } from 'react';
import PublicHomePage from './PublicHomePage.jsx';
import PlatformHubPage from './PlatformHubPage.jsx';
import { extractSubdomainFromHost } from '../../../utils/tenantDomain.js';

export default function MasterHomePage() {
  const [viewMode, setViewMode] = useState(() => {
    // 1. If explicit tenant subdomain in hostname (e.g. blossom-salon.localhost), force storefront
    if (typeof window !== 'undefined') {
      const sub = extractSubdomainFromHost(window.location.hostname);
      if (sub && !['www', 'kashi', 'kashiservice', 'platform'].includes(sub)) {
        return 'storefront';
      }
      // 2. Query param ?view=storefront or ?view=platform
      const params = new URLSearchParams(window.location.search);
      const queryView = params.get('view');
      if (queryView === 'storefront' || queryView === 'platform') {
        return queryView;
      }
      // 3. User preference in localStorage
      const cached = localStorage.getItem('kashi_view_mode');
      if (cached === 'storefront') return 'storefront';
    }
    // Default to Kashi Service Master Platform!
    return 'platform';
  });

  const toggleView = (newMode) => {
    setViewMode(newMode);
    localStorage.setItem('kashi_view_mode', newMode);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* ── View Switcher Pill Floating at Top-Right ── */}
      <div
        style={{
          position: 'fixed',
          top: '12px',
          right: '24px',
          zIndex: 99999,
          background: 'rgba(15, 23, 42, 0.94)',
          backdropFilter: 'blur(12px)',
          padding: '4px 6px',
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <button
          onClick={() => toggleView('platform')}
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 800,
            border: 'none',
            background: viewMode === 'platform' ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' : 'transparent',
            color: viewMode === 'platform' ? '#ffffff' : '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ⚡ Kashi Service Platform
        </button>

        <button
          onClick={() => toggleView('storefront')}
          style={{
            padding: '5px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 800,
            border: 'none',
            background: viewMode === 'storefront' ? 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)' : 'transparent',
            color: viewMode === 'storefront' ? '#ffffff' : '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          💅 Salon Storefront Demo
        </button>
      </div>

      {/* Render Selected View */}
      {viewMode === 'platform' ? <PlatformHubPage /> : <PublicHomePage />}
    </div>
  );
}

