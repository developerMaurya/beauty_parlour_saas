/**
 * @file TenantAdminLayout.jsx
 * @description Master Luxury Admin Layout with dedicated business vertical sidebars:
 *   1. 💄 Golden Beauty Parlour (Purple Theme #241434 with Crown logo & user screenshot menu)
 *   2. 🏡 Kashi Plotting Services (Forest Green Theme #0a2618 with House/Tree logo & user screenshot menu)
 *   3. Multi-business quick switcher to seamlessly jump between Parlour, Plotting, Events, Rent & Software
 * @module frontend/src/layouts/TenantAdminLayout
 */

import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Scissors,
  PartyPopper,
  Compass,
  Key,
  Code2,
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  Calendar,
  CreditCard,
  Package,
  Globe,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Sun,
  Moon,
  Bell,
  UserCog,
  Crown,
  HeartHandshake,
  Tag,
  BarChart3,
  Download,
  Headphones,
  Search,
  MessageSquare,
  Layers,
  Box,
  Trees,
  Home,
  Building,
  HelpCircle,
  Image,
  MessageSquareQuote,
  FileText,
  Camera,
  Video,
} from 'lucide-react';
import { useTenantAdmin } from '../context/TenantAdminContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export const TenantAdminLayout = () => {
  const { user, logout, isLoading } = useTenantAdmin();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1024 : false));
  const location = useLocation();
  const navigate = useNavigate();

  // Listen for window resize to toggle mobile mode smoothly
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Determine current active business vertical: 'PARLOUR' | 'PLOTTING' | 'RENT' | 'EVENTS' | 'SOFTWARE'
  const isPlottingRoute =
    location.pathname.includes('plotting') ||
    location.pathname.includes('plot') ||
    location.pathname.includes('kashiplot');

  const isRentRoute =
    location.pathname.includes('rent') ||
    location.pathname.includes('office') ||
    location.pathname.includes('commercial') ||
    location.pathname.includes('godam');

  const isEventsRoute =
    location.pathname.includes('event') ||
    location.pathname.includes('jay-gurudev') ||
    location.pathname.includes('decor') ||
    location.pathname.includes('aadiyogi');

  const isSoftwareRoute =
    location.pathname.includes('software') ||
    location.pathname.includes('tech') ||
    location.pathname.includes('media') ||
    location.pathname.includes('photography') ||
    location.pathname.includes('videography') ||
    location.pathname.includes('camera');

  const [activeVertical, setActiveVertical] = useState(
    isSoftwareRoute
      ? 'SOFTWARE'
      : isEventsRoute
      ? 'EVENTS'
      : isRentRoute
      ? 'RENT'
      : isPlottingRoute
      ? 'PLOTTING'
      : 'PARLOUR'
  );

  useEffect(() => {
    if (isSoftwareRoute) {
      setActiveVertical('SOFTWARE');
    } else if (isEventsRoute) {
      setActiveVertical('EVENTS');
    } else if (isRentRoute) {
      setActiveVertical('RENT');
    } else if (isPlottingRoute) {
      setActiveVertical('PLOTTING');
    } else if (
      location.pathname.includes('parlour') ||
      location.pathname.includes('beauty') ||
      location.pathname === '/admin/dashboard' ||
      location.pathname === '/admin'
    ) {
      setActiveVertical('PARLOUR');
    }
  }, [location.pathname, isPlottingRoute, isRentRoute, isEventsRoute, isSoftwareRoute]);

  // ══════════════════════════════════════════════════════════════════════════
  // INDEPENDENT MULTI-LEVEL DROPDOWN STATE FOR ALL MODULES
  // ══════════════════════════════════════════════════════════════════════════
  const [openSections, setOpenSections] = useState({
    parlour: true,
    parlour_bookings: true,
    parlour_clients: false,
    parlour_catalog: false,
    parlour_finance: false,
    parlour_web: false,
    events: false,
    events_decor: true,
    events_bookings: false,
    events_ops: false,
    events_web: false,
    plotting: false,
    plotting_plots: true,
    plotting_leads: false,
    plotting_finance: false,
    plotting_web: false,
    rent: false,
    rent_spaces: true,
    rent_tenants: false,
    rent_finance: false,
    rent_web: false,
    software: false,
    software_saas: true,
    software_media: false,
    software_clients: false,
    software_web: false,
    system: false,
    system_core: true,
  });

  // Independent toggle handler — toggles only the targeted key, NEVER closes others!
  const toggleSection = (id, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAllSections = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenSections((prev) => {
      const allTrue = {};
      Object.keys(prev).forEach((k) => {
        allTrue[k] = true;
      });
      return allTrue;
    });
  };

  const collapseAllSections = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenSections((prev) => {
      const allFalse = {};
      Object.keys(prev).forEach((k) => {
        allFalse[k] = false;
      });
      return allFalse;
    });
  };

  // Auto-open active module on route change without closing previously opened modules
  useEffect(() => {
    if (isSoftwareRoute) {
      setOpenSections((prev) => ({ ...prev, software: true }));
    } else if (isEventsRoute) {
      setOpenSections((prev) => ({ ...prev, events: true }));
    } else if (isRentRoute) {
      setOpenSections((prev) => ({ ...prev, rent: true }));
    } else if (isPlottingRoute) {
      setOpenSections((prev) => ({ ...prev, plotting: true }));
    } else if (
      location.pathname.includes('parlour') ||
      location.pathname.includes('beauty')
    ) {
      setOpenSections((prev) => ({ ...prev, parlour: true }));
    }
  }, [location.pathname, isSoftwareRoute, isEventsRoute, isRentRoute, isPlottingRoute]);

  // ══════════════════════════════════════════════════════════════════════════
  // COMPLETE MULTI-LEVEL DROPDOWN DATA FOR ALL 5 VERTICALS + SYSTEM ADMIN
  // ══════════════════════════════════════════════════════════════════════════
  const menuDropdownSections = [
    {
      id: 'parlour',
      title: 'Golden Beauty Parlour',
      shortTitle: 'Golden Beauty Parlour',
      iconEmoji: '💄',
      icon: Scissors,
      accentColor: '#c084fc',
      badge: 'Salon',
      badgeBg: '#7e22ce',
      subGroups: [
        {
          id: 'parlour_bookings',
          title: 'Bookings & Home Dispatch',
          icon: Calendar,
          items: [
            { label: 'Appointments Calendar', path: '/admin/parlour-appointments', icon: Calendar, badge: '12' },
            { label: 'Doorstep Home Services', path: '/admin/home-services', icon: Scissors, badge: 'Live' },
            { label: 'Specialist Live Radar', path: '/admin/live-tracking', icon: Compass },
            { label: 'Front Desk Receptionist', path: '/admin/receptionist', icon: UserCheck },
          ],
        },
        {
          id: 'parlour_clients',
          title: 'Clients, Staff & Academy',
          icon: Users,
          items: [
            { label: 'Customers Directory', path: '/admin/parlour-users', icon: Users },
            { label: 'Stylists & Staff', path: '/admin/parlour-staff', icon: UserCheck },
            { label: 'Beauty Academy & Students', path: '/admin/parlour-students', icon: GraduationCap },
            { label: 'CRM & Client Retention', path: '/admin/crm', icon: HeartHandshake },
          ],
        },
        {
          id: 'parlour_catalog',
          title: 'Services, Offers & Stock',
          icon: Package,
          items: [
            { label: 'Salon Services Catalog', path: '/admin/parlour-services', icon: Scissors },
            { label: 'Packages & Combos', path: '/admin/packages', icon: Package },
            { label: 'Offers & Discounts', path: '/admin/offers', icon: Tag },
            { label: 'Inventory & Cosmetics Stock', path: '/admin/parlour-inventory', icon: Box },
          ],
        },
        {
          id: 'parlour_finance',
          title: 'Billing POS & Financials',
          icon: CreditCard,
          items: [
            { label: 'POS Billing & Invoices', path: '/admin/parlour-billing', icon: CreditCard },
            { label: 'Facilities & Expenses', path: '/admin/facilities-expenses', icon: Building },
            { label: 'Salon Sales & Reports', path: '/admin/reports', icon: BarChart3 },
          ],
        },
        {
          id: 'parlour_web',
          title: 'Website & CMS',
          icon: Globe,
          items: [
            { label: 'Public Salon Website', path: '/storefront', icon: Globe, isExternal: true },
            { label: 'Website Content CMS', path: '/admin/website-cms', icon: FileText },
          ],
        },
      ],
    },
    {
      id: 'events',
      title: 'Jaygurudev Event & Management',
      shortTitle: 'Jaygurudev Event & Mgmt',
      iconEmoji: '🔱',
      icon: Sparkles,
      accentColor: '#facc15',
      badge: 'Royal Decor',
      badgeBg: '#ca8a04',
      subGroups: [
        {
          id: 'events_decor',
          title: 'Stage Decor & Blueprints',
          icon: Crown,
          items: [
            { label: 'Aadiyogi & Grand Stages', path: '/admin/event-decoration?tab=stages', icon: Crown },
            { label: 'Royal Bridal Entries', path: '/admin/event-decoration?tab=entries', icon: Sparkles },
            { label: 'Stage Blueprints & 3D', path: '/events#dimensions', icon: Image, isExternal: true },
          ],
        },
        {
          id: 'events_bookings',
          title: 'Wedding Contracts & Couples',
          icon: Calendar,
          items: [
            { label: 'Wedding Contracts & Dates', path: '/admin/event-decoration?tab=bookings', icon: Calendar },
            { label: 'Proposals & Quotations', path: '/admin/event-decoration?tab=proposals', icon: FileText },
            { label: 'Couples & Family Clients', path: '/admin/event-users', icon: Users },
          ],
        },
        {
          id: 'events_ops',
          title: 'Production, Crew & Accounts',
          icon: Box,
          items: [
            { label: 'Truss, DJ Sound & Lights', path: '/admin/event-decoration?tab=inventory', icon: Box },
            { label: 'Crew & Florist Staff', path: '/admin/parlour-staff', icon: UserCheck },
            { label: 'Payments Ledger & Advances', path: '/admin/parlour-billing', icon: CreditCard },
            { label: 'Event Profitability Reports', path: '/admin/reports', icon: BarChart3 },
          ],
        },
        {
          id: 'events_web',
          title: 'Public Portal',
          icon: Globe,
          items: [
            { label: 'Jaygurudev Live Website', path: '/events', icon: Globe, isExternal: true },
          ],
        },
      ],
    },
    {
      id: 'plotting',
      title: 'Plotting & Real Estate',
      shortTitle: 'Plotting & Real Estate',
      iconEmoji: '🏡',
      icon: Trees,
      accentColor: '#4ade80',
      badge: 'Land & Plots',
      badgeBg: '#16a34a',
      subGroups: [
        {
          id: 'plotting_plots',
          title: 'Plots Directory & Map',
          icon: Trees,
          items: [
            { label: 'Plots Directory & Status', path: '/admin/plotting', icon: Trees },
            { label: 'Plot Bookings & Registry', path: '/admin/plotting', icon: Calendar },
          ],
        },
        {
          id: 'plotting_leads',
          title: 'Buyers, Agents & Leads',
          icon: Users,
          items: [
            { label: 'Land Buyers & Investors', path: '/admin/plotting-users', icon: Users },
            { label: 'Real Estate Agents & Brokers', path: '/admin/plotting-agents', icon: UserCheck },
            { label: 'Plot Customer Inquiries', path: '/admin/customer-requests', icon: MessageSquare },
          ],
        },
        {
          id: 'plotting_finance',
          title: 'Installments & Commercial',
          icon: CreditCard,
          items: [
            { label: 'Installments & Payments', path: '/admin/parlour-billing', icon: CreditCard },
            { label: 'Colony Offers & Discounts', path: '/admin/packages', icon: Tag },
            { label: 'Land Sales Analytics', path: '/admin/reports', icon: BarChart3 },
          ],
        },
        {
          id: 'plotting_web',
          title: 'Public Portal',
          icon: Globe,
          items: [
            { label: 'Public Plotting Website', path: '/plotting', icon: Globe, isExternal: true },
          ],
        },
      ],
    },
    {
      id: 'rent',
      title: 'Office & Rental Management',
      shortTitle: 'Office & Rental Mgmt',
      iconEmoji: '🏢',
      icon: Building,
      accentColor: '#fbbf24',
      badge: '3 Floors',
      badgeBg: '#b45309',
      subGroups: [
        {
          id: 'rent_spaces',
          title: 'Commercial Spaces & Floors',
          icon: Building,
          items: [
            { label: 'Commercial Projects Directory', path: '/admin/rent-office?tab=projects', icon: Building },
            { label: 'Office, Shop & Godown Spaces', path: '/admin/rent-office?tab=spaces', icon: Layers },
          ],
        },
        {
          id: 'rent_tenants',
          title: 'Tenants & Leases',
          icon: Users,
          items: [
            { label: 'Lease Agreements & Bookings', path: '/admin/rent-office?tab=bookings', icon: Calendar },
            { label: 'Registered Tenants', path: '/admin/rent-tenants', icon: Users },
            { label: 'Space Enquiries & Leads', path: '/admin/rent-office?tab=enquiries', icon: MessageSquare },
          ],
        },
        {
          id: 'rent_finance',
          title: 'Rental Accounts & Ledger',
          icon: CreditCard,
          items: [
            { label: 'Monthly Rent Receipts & POS', path: '/admin/parlour-billing', icon: CreditCard },
            { label: 'Occupancy & Revenue Reports', path: '/admin/reports', icon: BarChart3 },
          ],
        },
        {
          id: 'rent_web',
          title: 'Public Portal',
          icon: Globe,
          items: [
            { label: 'Public Rental Website', path: '/rent', icon: Globe, isExternal: true },
          ],
        },
      ],
    },
    {
      id: 'software',
      title: 'Software & Media Services',
      shortTitle: 'Software & Media Services',
      iconEmoji: '💻',
      icon: Code2,
      accentColor: '#38bdf8',
      badge: 'SaaS Cloud',
      badgeBg: '#4338ca',
      subGroups: [
        {
          id: 'software_saas',
          title: 'Cloud SaaS Products',
          icon: Code2,
          items: [
            { label: 'Central SaaS Portfolio', path: '/admin/rb-software?tab=software', icon: Code2 },
            { label: 'Beauty Parlour SaaS', path: '/admin/golden-beauty-parlour', icon: Scissors },
            { label: 'Pharmacy Management SaaS', path: '/software', icon: Package },
          ],
        },
        {
          id: 'software_media',
          title: 'Studio & 4K Media Production',
          icon: Camera,
          items: [
            { label: 'Camera & Photo Studio', path: '/admin/rb-software?tab=media', icon: Camera },
            { label: '4K Drone & Cinematography', path: '/admin/rb-software?tab=videography', icon: Video },
            { label: 'Production Equipment Stock', path: '/admin/rb-software?tab=gear', icon: Box },
          ],
        },
        {
          id: 'software_clients',
          title: 'Enterprise Clients & Bids',
          icon: Users,
          items: [
            { label: 'Project Estimates & Quotes', path: '/admin/rb-software?tab=proposals', icon: FileText },
            { label: 'Enterprise IT Clients', path: '/admin/software-clients', icon: Users },
          ],
        },
        {
          id: 'software_web',
          title: 'Public Portal',
          icon: Globe,
          items: [
            { label: 'Public Software Portal', path: '/software', icon: Globe, isExternal: true },
          ],
        },
      ],
    },
    {
      id: 'system',
      title: 'Central Administration & Roles',
      shortTitle: 'Central Administration',
      iconEmoji: '⚙️',
      icon: Settings,
      accentColor: '#94a3b8',
      badge: 'Core',
      badgeBg: '#334155',
      subGroups: [
        {
          id: 'system_core',
          title: 'System Control & Security',
          icon: Settings,
          items: [
            { label: 'Branch & Multi-Location', path: '/admin/branches', icon: Building },
            { label: 'Roles & Permissions', path: '/admin/roles', icon: UserCog },
            { label: 'Global Platform Settings', path: '/admin/settings', icon: Settings },
            { label: 'System Notifications', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
            { label: '24/7 Support Desk', path: '/admin/support', icon: Headphones },
          ],
        },
      ],
    },
  ];

  // Colors & Configuration for Active Vertical
  const isParlour = activeVertical === 'PARLOUR';
  const isPlotting = activeVertical === 'PLOTTING';
  const isRent = activeVertical === 'RENT';
  const isEvents = activeVertical === 'EVENTS';
  const isSoftware = activeVertical === 'SOFTWARE';

  const sidebarBg = isParlour
    ? '#241434'
    : isPlotting
    ? '#0a2618'
    : isRent
    ? '#0d1b2a'
    : isEvents
    ? '#180527'
    : '#0b0f19'; // Cyber slate obsidian for RB Software & Media
  const activePillBg = isParlour
    ? '#7e22ce'
    : isPlotting
    ? '#16a34a'
    : isRent
    ? '#facc15'
    : isEvents
    ? '#facc15'
    : '#6366f1'; // Indigo glow pill
  const activeTextColor = isRent || isEvents ? '#0f172a' : '#ffffff';
  const accentColor = isParlour
    ? '#c084fc'
    : isPlotting
    ? '#4ade80'
    : isRent
    ? '#facc15'
    : isEvents
    ? '#facc15'
    : '#38bdf8';

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ width: '42px', height: '42px', borderRadius: '50%', border: '3.5px solid #16a34a', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      {/* ── Mobile Backdrop Overlay (Click to close drawer) ── */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 99998,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* ── Left Branded Sidebar (Desktop fixed 260px, Mobile drawer 280px) ── */}
      <aside
        style={{
          width: isMobile ? '280px' : '260px',
          background: sidebarBg,
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: isMobile ? 99999 : 50,
          overflowY: 'auto',
          boxShadow: isMobile ? '8px 0 30px rgba(0,0,0,0.4)' : '4px 0 20px rgba(0,0,0,0.15)',
          transform: isMobile ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s ease',
        }}
      >
        {/* Brand Header */}
        <div
          style={{
            padding: '1.2rem 1.1rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {isParlour ? (
            /* Golden Beauty Parlour Header */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/golden-beauty-parlour')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 50%, #db2777 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Crown size={22} />
              </div>
              <div>
                <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 900, fontSize: '1.2rem', color: '#ffffff', lineHeight: 1.05 }}>
                  Golden
                </div>
                <div style={{ fontSize: '9.5px', color: '#d8b4fe', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  BEAUTY PARLOUR
                </div>
              </div>
            </div>
          ) : isPlotting ? (
            /* Kashi Plotting Services Header Matching Screenshot */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/plotting')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #4ade80 0%, #16a34a 50%, #15803d 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Trees size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.1 }}>
                  Ploting
                </div>
                <div style={{ fontSize: '9.5px', color: '#86efac', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  SERVICES • KASHIPLOT
                </div>
              </div>
            </div>
          ) : isRent ? (
            /* Prime Plots / Kashi Office & Godam Rent Header Matching Screenshot */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/rent-office')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  boxShadow: '0 4px 14px rgba(250, 204, 21, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Building size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.1 }}>
                  Prime Plots
                </div>
                <div style={{ fontSize: '9.5px', color: '#facc15', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  ADMIN PANEL • 3 FLOORS
                </div>
              </div>
            </div>
          ) : isEvents ? (
            /* Jay Gurudev Event & Management Header */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/event-decoration')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0f172a',
                  boxShadow: '0 4px 14px rgba(250, 204, 21, 0.4)',
                  flexShrink: 0,
                  fontSize: '20px',
                }}
              >
                🔱
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', lineHeight: 1.1 }}>
                  Jay Gurudev
                </div>
                <div style={{ fontSize: '9.5px', color: '#facc15', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  EVENT & MANAGEMENT
                </div>
              </div>
            </div>
          ) : (
            /* RB Software & Media Tech Hub Header */
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/rb-software')}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                  flexShrink: 0,
                }}
              >
                <Code2 size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#ffffff', lineHeight: 1.1 }}>
                  RB Software & Media
                </div>
                <div style={{ fontSize: '9px', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em', marginTop: '2px' }}>
                  TECH & CINEMA HUB
                </div>
              </div>
            </div>
          )}

          {isMobile && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                cursor: 'pointer',
              }}
              title="Close Navigation"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Main Navigation: Independent Multi-Level Dropdowns ── */}
        <div style={{ padding: '0.65rem 0.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {/* Quick Direct Items */}
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: isActive ? 800 : 600,
              color: isActive ? '#ffffff' : '#e2e8f0',
              background: isActive ? activePillBg : 'rgba(255, 255, 255, 0.05)',
              textDecoration: 'none',
              boxShadow: isActive ? `0 4px 14px ${activePillBg}55` : 'none',
              transition: 'all 0.15s ease',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <LayoutDashboard size={17} color={accentColor} />
              <span>Overview Dashboard</span>
            </div>
            <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.12)', padding: '1px 6px', borderRadius: '4px' }}>Main</span>
          </NavLink>

          <NavLink
            to="/admin/customer-requests"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: isActive ? 800 : 600,
              color: isActive ? '#ffffff' : '#e2e8f0',
              background: isActive ? activePillBg : 'rgba(255, 255, 255, 0.05)',
              textDecoration: 'none',
              boxShadow: isActive ? `0 4px 14px ${activePillBg}55` : 'none',
              transition: 'all 0.15s ease',
            })}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MessageSquare size={17} color="#38bdf8" />
              <span>Customer Requests & Leads</span>
            </div>
            <span style={{ fontSize: '10px', background: '#6366f1', color: '#fff', padding: '1px 7px', borderRadius: '999px', fontWeight: 800 }}>New</span>
          </NavLink>

          {/* Section Divider & Expand / Collapse Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.35rem 0.25rem', marginTop: '4px' }}>
            <span style={{ fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)' }}>
              BUSINESS MODULES (DROPDOWNS)
            </span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                type="button"
                onClick={expandAllSections}
                title="Expand all dropdowns"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#94a3b8',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 5px',
                  cursor: 'pointer',
                }}
              >
                + Expand All
              </button>
              <button
                type="button"
                onClick={collapseAllSections}
                title="Collapse all dropdowns"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#94a3b8',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 5px',
                  cursor: 'pointer',
                }}
              >
                - Collapse All
              </button>
            </div>
          </div>

          {/* Dropdown Sections (Each completely independent) */}
          {menuDropdownSections.map((section) => {
            const isSectionOpen = !!openSections[section.id];
            return (
              <div
                key={section.id}
                style={{
                  borderRadius: '11px',
                  background: isSectionOpen ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  border: `1px solid ${isSectionOpen ? section.accentColor + '33' : 'rgba(255, 255, 255, 0.06)'}`,
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  marginTop: '2px',
                }}
              >
                {/* Level 1: Main Business Dropdown Header */}
                <div
                  onClick={(e) => toggleSection(section.id, e)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    background: isSectionOpen ? 'rgba(255, 255, 255, 0.07)' : 'transparent',
                    userSelect: 'none',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.09)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = isSectionOpen ? 'rgba(255, 255, 255, 0.07)' : 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '15px', flexShrink: 0 }}>{section.iconEmoji}</span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        color: isSectionOpen ? '#ffffff' : '#cbd5e1',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {section.shortTitle}
                    </span>
                    {section.badge && (
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          background: section.badgeBg,
                          color: '#ffffff',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          flexShrink: 0,
                        }}
                      >
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      color: section.accentColor,
                      transform: isSectionOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      marginLeft: '4px',
                    }}
                  >
                    <ChevronDown size={15} />
                  </div>
                </div>

                {/* Level 2: Inside Main Dropdown (Multiple Sub-Dropdowns) */}
                {isSectionOpen && (
                  <div style={{ padding: '4px 6px 6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {section.subGroups.map((group) => {
                      const isGroupOpen = !!openSections[group.id];
                      const GroupIcon = group.icon;
                      return (
                        <div
                          key={group.id}
                          style={{
                            borderRadius: '8px',
                            background: isGroupOpen ? 'rgba(0, 0, 0, 0.22)' : 'transparent',
                            border: `1px solid ${isGroupOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}`,
                            overflow: 'hidden',
                          }}
                        >
                          {/* Level 2 Header: Sub-Dropdown Toggle */}
                          <div
                            onClick={(e) => toggleSection(group.id, e)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              cursor: 'pointer',
                              background: isGroupOpen ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                              userSelect: 'none',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = isGroupOpen ? 'rgba(255, 255, 255, 0.04)' : 'transparent';
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
                              <GroupIcon size={13} color={section.accentColor} />
                              <span
                                style={{
                                  fontWeight: 700,
                                  fontSize: '0.76rem',
                                  color: isGroupOpen ? '#ffffff' : '#94a3b8',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {group.title}
                              </span>
                            </div>
                            <div
                              style={{
                                color: '#94a3b8',
                                transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0,
                              }}
                            >
                              <ChevronDown size={13} />
                            </div>
                          </div>

                          {/* Level 3: Feature Items inside Sub-Dropdown */}
                          {isGroupOpen && (
                            <div
                              style={{
                                padding: '3px 0 3px 14px',
                                marginLeft: '8px',
                                borderLeft: `1.5px solid ${section.accentColor}44`,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '2px',
                              }}
                            >
                              {group.items.map((item, iIdx) => {
                                const ItemIcon = item.icon;
                                const isActive = location.pathname === item.path;
                                if (item.isExternal) {
                                  return (
                                    <NavLink
                                      key={iIdx}
                                      to={item.path}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '5px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.76rem',
                                        fontWeight: 600,
                                        color: '#cbd5e1',
                                        textDecoration: 'none',
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                        e.currentTarget.style.color = '#ffffff';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#cbd5e1';
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <ItemIcon size={12} color={section.accentColor} />
                                        <span>{item.label}</span>
                                      </div>
                                      <span style={{ fontSize: '9px', color: section.accentColor }}>↗</span>
                                    </NavLink>
                                  );
                                }

                                return (
                                  <NavLink
                                    key={iIdx}
                                    to={item.path}
                                    onClick={() => isMobile && setMobileMenuOpen(false)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      padding: '5px 8px',
                                      borderRadius: '6px',
                                      fontSize: '0.76rem',
                                      fontWeight: isActive ? 800 : 500,
                                      color: isActive ? '#ffffff' : '#cbd5e1',
                                      background: isActive ? section.accentColor + '33' : 'transparent',
                                      border: isActive ? `1px solid ${section.accentColor}66` : '1px solid transparent',
                                      textDecoration: 'none',
                                      transition: 'all 0.15s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                                        e.currentTarget.style.color = '#ffffff';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#cbd5e1';
                                      }
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <ItemIcon size={12} color={isActive ? '#ffffff' : section.accentColor} />
                                      <span>{item.label}</span>
                                    </div>
                                    {item.badge && (
                                      <span
                                        style={{
                                          fontSize: '9px',
                                          fontWeight: 800,
                                          background: section.accentColor,
                                          color: '#0f172a',
                                          padding: '1px 5px',
                                          borderRadius: '999px',
                                        }}
                                      >
                                        {item.badge}
                                      </span>
                                    )}
                                  </NavLink>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Logout Button */}
          <div
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#ef4444',
              cursor: 'pointer',
              marginTop: '8px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
            }}
          >
            <LogOut size={16} />
            <span>Logout Account</span>
          </div>
        </div>

        {/* ── Bottom Upgrade Plan Button ── */}
        <div style={{ padding: '0.85rem 1rem 1.25rem' }}>
          <button
            onClick={() => navigate('/admin/billing')}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '12px',
              background: isParlour
                ? 'linear-gradient(135deg, #7e22ce 0%, #9333ea 50%, #a855f7 100%)'
                : isPlotting
                ? 'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)'
                : isRent
                ? 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)'
                : 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #b45309 100%)',
              color: isRent || isEvents ? '#0f172a' : '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: isParlour
                ? '0 6px 18px rgba(126, 34, 206, 0.45)'
                : isPlotting
                ? '0 6px 18px rgba(22, 163, 74, 0.45)'
                : '0 6px 18px rgba(250, 204, 21, 0.35)',
            }}
          >
            {isParlour ? <Crown size={17} /> : isPlotting ? <Trees size={17} /> : isRent ? <Building size={17} /> : <span style={{ fontSize: '15px', lineHeight: 1 }}>🔱</span>}
            <span>{isEvents ? 'Visit Events Site' : 'Upgrade Plan'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main Right Content Area (Responsive on all screen sizes) ── */}
      <div
        style={{
          marginLeft: isMobile ? 0 : '260px',
          width: isMobile ? '100%' : 'calc(100% - 260px)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          transition: 'margin-left 0.25s ease',
        }}
      >
        {/* ── Mobile Top Bar (Sticky, visible ONLY when screen is narrow < 1024px) ── */}
        {isMobile && (
          <header
            style={{
              height: '56px',
              background: sidebarBg,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 1rem',
              position: 'sticky',
              top: 0,
              zIndex: 40,
              color: '#ffffff',
              boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
                title="Open Navigation Menu"
              >
                <Menu size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span style={{ fontSize: '18px' }}>
                  {isParlour ? '👑' : isPlotting ? '🏡' : isRent ? '🏢' : isEvents ? '🔱' : '💻'}
                </span>
                <span style={{ fontWeight: 900, fontSize: '13.5px', letterSpacing: '0.01em' }}>
                  {isParlour
                    ? 'Golden Beauty Parlour'
                    : isPlotting
                    ? 'Kashi Plotting'
                    : isRent
                    ? 'Prime Plots Rent'
                    : isEvents
                    ? 'Jay Gurudev Events'
                    : 'RB Software Hub'}
                </span>
              </div>
            </div>

            {/* Quick Actions on Mobile Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/customer-requests')}
                style={{
                  background: 'rgba(99, 102, 241, 0.25)',
                  border: '1px solid rgba(99, 102, 241, 0.4)',
                  color: '#ffffff',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <MessageSquare size={13} />
                <span>Requests</span>
              </button>

              <div
                onClick={() => navigate('/admin/profile')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c084fc 0%, #db2777 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
              >
                A
              </div>
            </div>
          </header>
        )}

        <Outlet />
      </div>
    </div>
  );
};

export default TenantAdminLayout;
