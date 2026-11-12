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
  Shield,
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
  Database,
  Cloud,
  FileText,
  Camera,
  Video,
  Clock,
  DollarSign,
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
  // INDEPENDENT SIMPLE DROPDOWN STATE (Master, Parlour, Event, Plot, Rent, etc.)
  // ══════════════════════════════════════════════════════════════════════════
  const [openSections, setOpenSections] = useState({
    master: true,
    parlour: false,
    events: false,
    plotting: false,
    rent: false,
    software: false,
    system: false,
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
    setOpenSections({
      master: true,
      parlour: true,
      events: true,
      plotting: true,
      rent: true,
      software: true,
      system: true,
    });
  };

  const collapseAllSections = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setOpenSections({
      master: false,
      parlour: false,
      events: false,
      plotting: false,
      rent: false,
      software: false,
      system: false,
    });
  };

  // Auto-open active module on route change without closing others
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const business = (searchParams.get('business') || searchParams.get('vertical') || '').toUpperCase();

    if (business === 'PARLOUR') {
      setOpenSections((prev) => ({ ...prev, parlour: true }));
    } else if (business === 'EVENTS') {
      setOpenSections((prev) => ({ ...prev, events: true }));
    } else if (business === 'PLOTTING') {
      setOpenSections((prev) => ({ ...prev, plotting: true }));
    } else if (business === 'RENT') {
      setOpenSections((prev) => ({ ...prev, rent: true }));
    } else if (business === 'SOFTWARE') {
      setOpenSections((prev) => ({ ...prev, software: true }));
    } else if (business === 'SYSTEM' || location.pathname.includes('system')) {
      setOpenSections((prev) => ({ ...prev, system: true }));
    } else if (
      location.pathname === '/admin/dashboard' ||
      (location.pathname === '/admin/users' && !business) ||
      location.pathname.includes('role') ||
      location.pathname.includes('master')
    ) {
      setOpenSections((prev) => ({ ...prev, master: true }));
    } else if (isSoftwareRoute) {
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
  }, [location.pathname, location.search, isSoftwareRoute, isEventsRoute, isRentRoute, isPlottingRoute]);

  // ══════════════════════════════════════════════════════════════════════════
  // SIMPLE BUSINESS DROPDOWN DATA (Folder with Overview & User Management)
  // ══════════════════════════════════════════════════════════════════════════
  const menuDropdownSections = [
    {
      id: 'master',
      title: 'Master Management',
      shortTitle: 'Master Management',
      iconEmoji: '👑',
      accentColor: '#facc15',
      badge: 'Master',
      badgeBg: '#ca8a04',
      items: [
        { label: 'Master Overview', path: '/admin/dashboard', icon: LayoutDashboard, badge: 'Overview' },
        { label: 'All Users Management', path: '/admin/users', icon: Users, badge: 'Users' },
        { label: 'Role Management', path: '/admin/roles', icon: Shield, badge: 'Roles' },
        { label: 'Staff Attendance', path: '/admin/staff-attendance', icon: Clock, badge: 'HR' },
        { label: 'Leave Management', path: '/admin/leave-management', icon: Calendar, badge: 'Leaves' },
        { label: 'Staff Salary & Payroll', path: '/admin/staff-salary', icon: DollarSign, badge: 'Payroll' },
      ],
    },
    {
      id: 'parlour',
      title: 'Golden Beauty Parlour',
      shortTitle: 'Golden Beauty Parlour',
      iconEmoji: '💄',
      accentColor: '#c084fc',
      badge: 'Salon',
      badgeBg: '#7e22ce',
      items: [
        { label: 'Beauty Parlour Overview', path: '/admin/golden-beauty-parlour', icon: LayoutDashboard, badge: 'Overview' },
        { label: 'Parlour Users', path: '/admin/users?business=PARLOUR', icon: Users, badge: 'Users' },
      ],
    },
    {
      id: 'events',
      title: 'Jaygurudev Event & Management',
      shortTitle: 'Jaygurudev Event & Mgmt',
      iconEmoji: '🔱',
      accentColor: '#facc15',
      badge: 'Event',
      badgeBg: '#ca8a04',
      items: [
        { label: 'Event & Management Overview', path: '/admin/event-decoration', icon: LayoutDashboard, badge: 'Overview' },
        { label: 'Event Users', path: '/admin/users?business=EVENTS', icon: Users, badge: 'Users' },
      ],
    },
    {
      id: 'plotting',
      title: 'Plotting & Real Estate',
      shortTitle: 'Plotting & Real Estate',
      iconEmoji: '🏡',
      accentColor: '#4ade80',
      badge: 'Plots',
      badgeBg: '#16a34a',
      items: [
        { label: 'Plotting & Real Estate Overview', path: '/admin/plotting', icon: LayoutDashboard, badge: 'Overview' },
        { label: 'Plotting Users', path: '/admin/users?business=PLOTTING', icon: Users, badge: 'Users' },
      ],
    },
    {
      id: 'rent',
      title: 'Office & Rental Management',
      shortTitle: 'Office & Rental Mgmt',
      iconEmoji: '🏢',
      accentColor: '#fbbf24',
      badge: 'Rent',
      badgeBg: '#b45309',
      items: [
        { label: 'Office & Rental Overview', path: '/admin/rent-office', icon: LayoutDashboard, badge: 'Overview' },
        { label: 'Rental Users', path: '/admin/users?business=RENT', icon: Users, badge: 'Users' },
      ],
    },
    {
      id: 'software',
      title: 'Software & Media Services',
      shortTitle: 'Software & Media Services',
      iconEmoji: '💻',
      accentColor: '#38bdf8',
      badge: 'Software',
      badgeBg: '#4338ca',
      items: [
        { label: 'Software & Tech Overview', path: '/admin/rb-software', icon: LayoutDashboard, badge: 'Overview' },
        { label: 'Software Users', path: '/admin/users?business=SOFTWARE', icon: Users, badge: 'Users' },
      ],
    },
    {
      id: 'system',
      title: 'Central Administration',
      shortTitle: 'Central Administration',
      iconEmoji: '⚙️',
      accentColor: '#94a3b8',
      badge: 'System',
      badgeBg: '#334155',
      items: [
        { label: 'Configuration', path: '/admin/system/config', icon: Settings, badge: 'Config' },
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
          {/* Section Divider & Expand / Collapse Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.4rem 0.35rem 0.25rem' }}>
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

                {/* Inside Dropdown: Items (Overview & User Management for all business modules) */}
                {isSectionOpen && (
                  <div style={{ padding: '4px 6px 6px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {section.items && section.items.map((item, iIdx) => {
                      const ItemIcon = item.icon || LayoutDashboard;
                      const currentFullPath = location.pathname + (location.search || '');
                      const isItemActive =
                        item.path === '/admin/system/config'
                          ? location.pathname.includes('/admin/system')
                          : item.path.includes('?')
                          ? currentFullPath === item.path
                          : location.pathname === item.path && (!location.search || location.search === '');
                      return (
                        <NavLink
                          key={iIdx}
                          to={item.path}
                          onClick={() => isMobile && setMobileMenuOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '7px 10px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: isItemActive ? 800 : 600,
                            color: isItemActive ? '#ffffff' : '#f1f5f9',
                            background: isItemActive
                              ? 'rgba(255, 255, 255, 0.16)'
                              : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${isItemActive ? section.accentColor : 'rgba(255, 255, 255, 0.08)'}`,
                            textDecoration: 'none',
                            transition: 'all 0.15s ease',
                            boxShadow: isItemActive ? `0 2px 10px ${section.accentColor}33` : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ItemIcon size={14} color={section.accentColor} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              style={{
                                fontSize: '9px',
                                fontWeight: 800,
                                background: section.accentColor,
                                color: '#0f172a',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                letterSpacing: '0.04em',
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
