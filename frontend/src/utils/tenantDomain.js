/**
 * @file tenantDomain.js
 * @description Central Domain & Portal Routing Utility for Multi-Tenant Beauty SaaS.
 * Supports:
 *   1. Option A: Kashi Service Platform Subdomain (e.g. glamour.kashiservice.com / glamour.localhost:3000)
 *   2. Option B: White-Label Custom Domain (e.g. www.glamourbeauty.com)
 *   3. Localhost & IP Development Compatibility (*.localhost and direct IP)
 * @module frontend/src/utils/tenantDomain
 */

export const PLATFORM_DOMAIN = 'kashiservice.com';

/**
 * Extracts tenant subdomain from a given hostname.
 * Examples:
 *   - glamour.kashiservice.com  -> "glamour"
 *   - glamour-academy.localhost -> "glamour-academy"
 *   - salon1.beautysaas.local   -> "salon1"
 *   - localhost                 -> null
 *   - 127.0.0.1                 -> null
 */
export const extractSubdomainFromHost = (hostname) => {
  if (!hostname) return null;
  const host = hostname.toLowerCase().split(':')[0].trim();

  // Localhost Subdomain support (RFC 6761 compliant, resolves natively in browsers)
  if (host.endsWith('.localhost')) {
    const sub = host.replace('.localhost', '').trim();
    if (sub && !['www', 'api', 'admin', 'superadmin', 'app'].includes(sub)) {
      return sub;
    }
  }

  // Raw IP or plain localhost has no subdomain
  if (host === 'localhost' || /^(\d{1,3}\.){3}\d{1,3}$/.test(host)) {
    return null;
  }

  // Platform Subdomain: e.g. *.kashiservice.com or generic *.domain.com
  if (host.includes('.')) {
    const parts = host.split('.');
    if (parts.length >= 3) {
      const firstPart = parts[0];
      if (!['www', 'api', 'admin', 'superadmin', 'app', 'cname'].includes(firstPart)) {
        return firstPart;
      }
    }
  }

  return null;
};

/**
 * Detects current active tenant identifier from hostname, URL path, query params, or storage.
 */
export const getCurrentTenantIdentifier = () => {
  if (typeof window === 'undefined') return null;

  // 1. Hostname Subdomain (Primary)
  const hostSubdomain = extractSubdomainFromHost(window.location.hostname);
  if (hostSubdomain) {
    try {
      sessionStorage.setItem('current_tenant_slug', hostSubdomain);
    } catch {}
    return hostSubdomain;
  }

  // 2. Path prefix /site/:tenantSlug
  const pathParts = window.location.pathname.split('/').filter(Boolean);
  if (pathParts[0] === 'site' && pathParts[1]) {
    const slug = pathParts[1];
    try {
      sessionStorage.setItem('current_tenant_slug', slug);
    } catch {}
    return slug;
  }

  // 3. Query Param fallback ?tenant=slug
  const searchParams = new URLSearchParams(window.location.search);
  const queryTenant = searchParams.get('tenant') || searchParams.get('tenantId') || searchParams.get('tenantSlug');
  if (queryTenant) {
    try {
      sessionStorage.setItem('current_tenant_slug', queryTenant);
    } catch {}
    return queryTenant;
  }

  // 4. Session / LocalStorage fallback
  try {
    const cached = sessionStorage.getItem('current_tenant_slug') || localStorage.getItem('tenant_slug') || localStorage.getItem('tenant_id');
    if (cached) return cached;
  } catch {}

  // 5. Custom Domain Hostname (e.g. www.testing.com or glamourbeauty.com)
  const host = window.location.hostname.toLowerCase();
  if (
    host &&
    host !== 'localhost' &&
    host !== '127.0.0.1' &&
    !host.endsWith('.localhost') &&
    !host.endsWith('.kashiservice.com') &&
    !host.endsWith('.yourplatform.com') &&
    !/^(\d{1,3}\.){3}\d{1,3}$/.test(host)
  ) {
    const cleanHost = host.replace(/^www\./, '');
    try {
      sessionStorage.setItem('current_tenant_slug', cleanHost);
    } catch {}
    return cleanHost;
  }

  return null;
};

/**
 * Builds clean, professional white-label URLs for any tenant portal:
 *   - Website / Store: /
 *   - Booking:         /book (or /booking)
 *   - Admin:           /admin
 *   - Staff:           /staff
 *   - Customer:        /customer
 *   - Student:         /student
 *
 * @param {Object|string} tenant Tenant object or slug string
 * @param {string} portal Target portal ('public'|'website'|'booking'|'admin'|'staff'|'customer'|'student')
 * @returns {string} Fully-qualified absolute URL
 */
export const buildTenantUrl = (tenant, portal = 'public') => {
  if (!tenant) return '#';

  const tenantObj = typeof tenant === 'object' ? tenant : { slug: tenant, subdomain: tenant };
  const slug = tenantObj.subdomain || tenantObj.slug || 'salon';

  const hasCustomDomain = Boolean(
    tenantObj.primaryDomain &&
    !tenantObj.primaryDomain.includes(PLATFORM_DOMAIN) &&
    !tenantObj.primaryDomain.includes('localhost') &&
    !tenantObj.primaryDomain.includes('127.0.0.1')
  );

  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.localhost') ||
    /^(\d{1,3}\.){3}\d{1,3}$/.test(window.location.hostname)
  );

  const port = typeof window !== 'undefined' && window.location.port ? `:${window.location.port}` : '';
  const protocol = typeof window !== 'undefined' ? window.location.protocol : 'http:';

  // Determine portal path
  let path = '/';
  if (portal === 'admin') path = '/admin/login';
  else if (portal === 'customer') path = '/customer/login';
  else if (portal === 'staff') path = '/staff/login';
  else if (portal === 'student') path = '/student/login';
  else if (portal === 'booking' || portal === 'book') path = '/book';

  // ----------------------------------------------------
  // Local Development Environment
  // ----------------------------------------------------
  if (isLocal) {
    // If running locally, route to *.localhost:PORT so modern browsers natively resolve to 127.0.0.1
    // e.g. http://glamour.localhost:3000/ or http://glamour.localhost:3000/admin/login
    const localHost = `${slug}.localhost${port}`;
    return `${protocol}//${localHost}${path}`;
  }

  // ----------------------------------------------------
  // Live Production / Cloud Environment
  // ----------------------------------------------------
  if (hasCustomDomain) {
    // Option B: Customer's Own Custom White-Label Domain
    // e.g. https://www.glamourbeauty.com/ or https://www.glamourbeauty.com/admin/login
    const cleanDomain = tenantObj.primaryDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${cleanDomain}${path}`;
  }

  // Option A: Kashi Service Platform Subdomain
  // e.g. https://glamour.kashiservice.com/ or https://glamour.kashiservice.com/admin/login
  return `https://${slug}.${PLATFORM_DOMAIN}${path}`;
};

