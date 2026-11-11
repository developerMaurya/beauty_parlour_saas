/**
 * @file TenantAdminLayout.jsx
 * @description Master Luxury Admin Layout with dedicated business vertical sidebars:
 *   1. 💄 Golden Beauty Parlour (Purple Theme #241434 with Crown logo & user screenshot menu)
 *   2. 🏡 Kashi Plotting Services (Forest Green Theme #0a2618 with House/Tree logo & user screenshot menu)
 *   3. Multi-business quick switcher to seamlessly jump between Parlour, Plotting, Events, Rent & Software
 * @module frontend/src/layouts/TenantAdminLayout
 */

import React, { useState, useEffect } from 'react';
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
  const location = useLocation();
  const navigate = useNavigate();

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

  // Multi-vertical dropdown state
  const [verticalsDropdownOpen, setVerticalsDropdownOpen] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // 1. GOLDEN BEAUTY PARLOUR MENU (Purple Theme)
  // ══════════════════════════════════════════════════════════════════════════
  const parlourMenuItems = [
    { label: 'Dashboard', path: '/admin/golden-beauty-parlour', icon: LayoutDashboard },
    { label: 'Website', path: '/storefront', icon: Globe, isExternal: true },
    { label: 'Customer Requests', path: '/admin/customer-requests', icon: MessageSquare, badge: 'New', badgeColor: '#6366f1' },
    { label: 'Appointments', path: '/admin/parlour-appointments', icon: Calendar, badge: '12' },
    { label: 'Customers', path: '/admin/parlour-users', icon: Users },
    { label: 'Staff', path: '/admin/parlour-staff', icon: UserCheck },
    { label: 'Students', path: '/admin/parlour-students', icon: GraduationCap },
    { label: 'Services', path: '/admin/parlour-services', icon: Scissors },
    { label: 'Packages', path: '/admin/packages', icon: Package },
    { label: 'Inventory', path: '/admin/parlour-inventory', icon: Box },
    { label: 'Billing', path: '/admin/parlour-billing', icon: CreditCard },
    { label: 'CRM', path: '/admin/crm', icon: HeartHandshake },
    { label: 'Offers & Discounts', path: '/admin/offers', icon: Tag },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Import / Export', path: '/admin/import-export', icon: Download },
    { label: 'Notification', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // 2. KASHI PLOTTING SERVICES MENU (Forest Green Theme Matching Image)
  // ══════════════════════════════════════════════════════════════════════════
  const plottingMenuItems = [
    { label: 'Dashboard', path: '/admin/plotting', icon: LayoutDashboard },
    { label: 'Customer Requests', path: '/admin/customer-requests', icon: MessageSquare, badge: 'New', badgeColor: '#6366f1' },
    { label: 'Plots Management', path: '/admin/plotting', icon: Trees },
    { label: 'Bookings', path: '/admin/plotting', icon: Calendar },
    { label: 'Customers', path: '/admin/plotting-users', icon: Users },
    { label: 'Agents', path: '/admin/plotting-agents', icon: UserCheck },
    { label: 'Inquiries', path: '/admin/plotting-users', icon: HelpCircle },
    { label: 'Payments', path: '/admin/parlour-billing', icon: CreditCard },
    { label: 'Offers & Discounts', path: '/admin/packages', icon: Tag },
    { label: 'Gallery', path: '/plotting', icon: Image, isExternal: true },
    { label: 'Testimonials', path: '/plotting', icon: MessageSquareQuote, isExternal: true },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Notification', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // 3. PRIME PLOTS / OFFICE & GODAM RENT MENU (Navy & Gold Theme Matching Image)
  // ══════════════════════════════════════════════════════════════════════════
  const rentMenuItems = [
    { label: 'Dashboard', path: '/admin/rent-office', icon: LayoutDashboard },
    { label: 'Customer Requests', path: '/admin/customer-requests', icon: MessageSquare, badge: 'New', badgeColor: '#6366f1' },
    { label: 'Projects', path: '/admin/rent-office?tab=projects', icon: Building },
    { label: 'Plots', path: '/admin/rent-office?tab=spaces', icon: Layers },
    { label: 'Bookings', path: '/admin/rent-office?tab=bookings', icon: Calendar },
    { label: 'Customers', path: '/admin/rent-tenants', icon: Users },
    { label: 'Enquiries', path: '/admin/rent-office?tab=enquiries', icon: MessageSquare },
    { label: 'Payments', path: '/admin/parlour-billing', icon: CreditCard },
    { label: 'Offers & Discounts', path: '/admin/offers', icon: Tag },
    { label: 'Gallery', path: '/rent', icon: Image, isExternal: true },
    { label: 'Website Content', path: '/rent', icon: Globe, isExternal: true },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Users & Roles', path: '/admin/roles', icon: UserCog },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // 4. JAY GURUDEV EVENT & MANAGEMENT MENU (Crimson & Gold Royal Theme)
  // ══════════════════════════════════════════════════════════════════════════
  const eventsMenuItems = [
    { label: 'Dashboard', path: '/admin/event-decoration', icon: LayoutDashboard },
    { label: 'Customer Requests', path: '/admin/customer-requests', icon: MessageSquare, badge: 'New', badgeColor: '#6366f1' },
    { label: 'Aadiyogi Stages', path: '/admin/event-decoration?tab=stages', icon: Crown },
    { label: 'Bridal Entries', path: '/admin/event-decoration?tab=entries', icon: Sparkles },
    { label: 'Wedding Contracts', path: '/admin/event-decoration?tab=bookings', icon: Calendar },
    { label: 'Proposals & Quotes', path: '/admin/event-decoration?tab=proposals', icon: FileText },
    { label: 'Clients & Couples', path: '/admin/event-users', icon: Users },
    { label: 'Hardware Inventory', path: '/admin/event-decoration?tab=inventory', icon: Box },
    { label: 'Crew & Florists', path: '/admin/parlour-staff', icon: UserCheck },
    { label: 'Payments Ledger', path: '/admin/parlour-billing', icon: CreditCard },
    { label: 'Stage Blueprints', path: '/events#dimensions', icon: Image, isExternal: true },
    { label: 'Public Website', path: '/events', icon: Globe, isExternal: true },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: '3', badgeColor: '#ef4444' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
  ];

  // ══════════════════════════════════════════════════════════════════════════
  // 5. RB SOFTWARE & MEDIA TECH HUB (Cyber Slate & Electric Blue/Indigo Theme)
  // ══════════════════════════════════════════════════════════════════════════
  const softwareMenuItems = [
    { label: 'Dashboard', path: '/admin/rb-software', icon: LayoutDashboard },
    { label: 'Customer Requests', path: '/admin/customer-requests', icon: MessageSquare, badge: 'New', badgeColor: '#6366f1' },
    { label: 'Cloud Microservices', path: '/admin/rb-software?tab=software', icon: Code2 },
    { label: 'Camera & Photo Studio', path: '/admin/rb-software?tab=media', icon: Camera },
    { label: '4K Drone & Video', path: '/admin/rb-software?tab=videography', icon: Video },
    { label: 'Equipment Inventory', path: '/admin/rb-software?tab=gear', icon: Box },
    { label: 'Estimates & Quotes', path: '/admin/rb-software?tab=proposals', icon: FileText },
    { label: 'Clients & Contracts', path: '/admin/software-clients', icon: Users },
    { label: 'Public Tech Website', path: '/software', icon: Globe, isExternal: true },
    { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Notifications', path: '/admin/notifications', icon: Bell, badge: '2', badgeColor: '#38bdf8' },
    { label: 'Support', path: '/admin/support', icon: Headphones },
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
      {/* ── Left Branded Sidebar ── */}
      <aside
        style={{
          width: '260px',
          background: sidebarBg,
          color: '#e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          transition: 'background 0.25s ease',
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

          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* ── 5-Vertical Switcher Buttons (Parlour ⟷ Plotting ⟷ Rent ⟷ Events ⟷ Software/Media) ── */}
        <div style={{ padding: '0.75rem 0.85rem 0.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px', background: 'rgba(255,255,255,0.06)', padding: '3px', borderRadius: '10px' }}>
            <button
              onClick={() => {
                setActiveVertical('PARLOUR');
                navigate('/admin/golden-beauty-parlour');
              }}
              style={{
                padding: '6px 1px',
                borderRadius: '8px',
                border: 'none',
                background: isParlour ? '#7e22ce' : 'transparent',
                color: isParlour ? '#ffffff' : '#94a3b8',
                fontWeight: isParlour ? 800 : 600,
                fontSize: '9px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              💄 Salon
            </button>
            <button
              onClick={() => {
                setActiveVertical('PLOTTING');
                navigate('/admin/plotting');
              }}
              style={{
                padding: '6px 1px',
                borderRadius: '8px',
                border: 'none',
                background: isPlotting ? '#16a34a' : 'transparent',
                color: isPlotting ? '#ffffff' : '#94a3b8',
                fontWeight: isPlotting ? 800 : 600,
                fontSize: '9px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              🏡 Plot
            </button>
            <button
              onClick={() => {
                setActiveVertical('RENT');
                navigate('/admin/rent-office');
              }}
              style={{
                padding: '6px 1px',
                borderRadius: '8px',
                border: 'none',
                background: isRent ? '#facc15' : 'transparent',
                color: isRent ? '#0f172a' : '#94a3b8',
                fontWeight: isRent ? 800 : 600,
                fontSize: '9px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              🏢 Rent
            </button>
            <button
              onClick={() => {
                setActiveVertical('EVENTS');
                navigate('/admin/event-decoration');
              }}
              style={{
                padding: '6px 1px',
                borderRadius: '8px',
                border: 'none',
                background: isEvents ? '#facc15' : 'transparent',
                color: isEvents ? '#0f172a' : '#94a3b8',
                fontWeight: isEvents ? 800 : 600,
                fontSize: '9px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              🔱 Event
            </button>
            <button
              onClick={() => {
                setActiveVertical('SOFTWARE');
                navigate('/admin/rb-software');
              }}
              style={{
                padding: '6px 1px',
                borderRadius: '8px',
                border: 'none',
                background: isSoftware ? '#6366f1' : 'transparent',
                color: isSoftware ? '#ffffff' : '#94a3b8',
                fontWeight: isSoftware ? 800 : 600,
                fontSize: '9px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'center',
              }}
            >
              💻 Tech
            </button>
          </div>
        </div>

        {/* ── Main Navigation Menu Items ── */}
        <div style={{ padding: '0.65rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
          {(isParlour ? parlourMenuItems : isPlotting ? plottingMenuItems : isRent ? rentMenuItems : isEvents ? eventsMenuItems : softwareMenuItems).map((item, idx) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.label === 'Dashboard' &&
                (isParlour
                  ? location.pathname === '/admin/dashboard' || location.pathname === '/admin/golden-beauty-parlour'
                  : isPlotting
                  ? location.pathname === '/admin/plotting'
                  : isRent
                  ? location.pathname === '/admin/rent-office' || location.pathname === '/admin/rent'
                  : isEvents
                  ? location.pathname === '/admin/event-decoration' || location.pathname === '/admin/events'
                  : location.pathname === '/admin/rb-software' || location.pathname === '/admin/software'));

            if (item.isExternal) {
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '10px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={17} color={accentColor} />
                    <span>{item.label}</span>
                  </div>
                  <span style={{ fontSize: '10px', color: accentColor }}>↗</span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={idx}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? 800 : 600,
                  color: isActive ? activeTextColor : '#cbd5e1',
                  background: isActive ? activePillBg : 'transparent',
                  textDecoration: 'none',
                  boxShadow: isActive ? `0 4px 14px ${activePillBg}55` : 'none',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={17} color={isActive ? activeTextColor : accentColor} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    style={{
                      background: item.badgeColor || '#ec4899',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: 900,
                      padding: '1px 7px',
                      borderRadius: '999px',
                      lineHeight: '16px',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          {/* Logout Menu Item */}
          <div
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.85rem',
              borderRadius: '10px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#ef4444',
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </div>

          {/* ── Other Business Verticals Switcher ── */}
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div
              onClick={() => setVerticalsDropdownOpen(!verticalsDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: accentColor,
                background: verticalsDropdownOpen ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
              }}
            >
              <span>ALL 5 KASHI VERTICALS</span>
              {verticalsDropdownOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>

            {verticalsDropdownOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '4px', paddingLeft: '4px' }}>
                {[
                  { label: '💄 Golden Beauty Parlour', path: '/admin/golden-beauty-parlour' },
                  { label: '🏡 Kashi Plotting Services', path: '/admin/plotting' },
                  { label: '🔱 Jay Gurudev Event & Management', path: '/admin/event-decoration' },
                  { label: '🔑 Office & Rent Commercial', path: '/admin/rent-office' },
                  { label: '💻 RB Software Hub', path: '/admin/rb-software' },
                  { label: '📊 Master Business Overview', path: '/admin/business-folders' },
                ].map((ov, oIdx) => (
                  <NavLink
                    key={oIdx}
                    to={ov.path}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 800 : 500,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                      textDecoration: 'none',
                    })}
                  >
                    <span>{ov.label}</span>
                  </NavLink>
                ))}
              </div>
            )}
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

      {/* ── Main Right Content Area (With 260px Margin) ── */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default TenantAdminLayout;
