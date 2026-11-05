/**
 * @file MasterHomePage.jsx
 * @description Intelligent Root Entry Router for Kashi Service Multi-Tenant Ecosystem.
 * - On Root Domain (localhost:3000 / kashiservice.com): Displays Kashi Service Platform Landing Page by default.
 * - On Tenant Subdomain (e.g. blossom.kashiservice.com / blossom.localhost:3000): Renders Tenant Public Website.
 * - Clicking "Beauty Parlour" / "View Demo" on the platform navigates to the live parlour storefront (/site/blossom-salon).
 * @module frontend/src/modules/public/pages/MasterHomePage
 */

import React from 'react';
import PublicLayout from '@/layouts/PublicLayout.jsx';
import PublicHomePage from './PublicHomePage.jsx';
import PlatformHubPage from './PlatformHubPage.jsx';
import { extractSubdomainFromHost } from '@/utils/tenantDomain.js';

export default function MasterHomePage() {
  const isTenantSubdomain = (() => {
    if (typeof window !== 'undefined') {
      const sub = extractSubdomainFromHost(window.location.hostname);
      if (sub && !['www', 'kashi', 'kashiservice', 'platform', 'localhost'].includes(sub)) {
        return true;
      }
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'storefront') {
        return true;
      }
    }
    return false;
  })();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  return (
    <div
      className="public-layout-light"
      data-theme="light"
      style={{ position: 'relative', minHeight: '100vh', background: '#ffffff', color: '#0f172a' }}
    >
      {isTenantSubdomain ? (
        <PublicLayout>
          <PublicHomePage />
        </PublicLayout>
      ) : (
        <PlatformHubPage />
      )}
    </div>
  );
}
