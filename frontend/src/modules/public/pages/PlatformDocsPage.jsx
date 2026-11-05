/**
 * @file PlatformDocsPage.jsx
 * @description Comprehensive Platform Documentation & Reader Guide for Kashi Service Ecosystem.
 * Features:
 *   - Service Sub-Tabs: Beauty Parlour, Software SaaS, Event Services, Plotting, Rental Assets, 5 Dashboards, System Architecture.
 *   - In-depth, GitBook/Stripe-style Documentation Reader for each service.
 *   - Table of contents, architectural diagrams, data models, REST APIs, and direct 1-click Free Trial & Purchase actions.
 * @module frontend/src/modules/public/pages/PlatformDocsPage
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, NavLink, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Layers,
  Shield,
  Zap,
  Globe,
  Database,
  Users,
  Compass,
  ArrowRight,
  CheckCircle2,
  Server,
  Cpu,
  Lock,
  Code,
  FileText,
  DollarSign,
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
  Ticket,
  Home,
  Key,
  Check,
  Copy,
  Terminal,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import InstantTrialModal from '../components/InstantTrialModal.jsx';
import SaaSPurchaseModal from '../components/SaaSPurchaseModal.jsx';
import { useToast } from '@/context/ToastContext.jsx';

export default function PlatformDocsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // Sub-tabs configuration for all platform services & architecture
  const serviceTabs = [
    {
      id: 'beauty-parlour',
      name: 'Beauty Parlour & Salon ERP',
      shortName: 'Beauty Parlour',
      icon: '💅',
      badge: 'Production Ready',
      color: '#ec4899',
      bgColor: '#fdf2f8',
      borderColor: '#fbcfe8',
      desc: 'Multi-branch salon ERP, Doorstep GPS tracking, Cosmetology Academy LMS & POS billing.',
    },
    {
      id: 'software-saas',
      name: 'Software SaaS Suite (Retail & LMS)',
      shortName: 'Software Suites',
      icon: '🛍️',
      badge: '4 Modules Inside',
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      desc: 'Grocery POS, Computer Institute LMS, Electronics IMEI Repair & Boutique tailoring.',
    },
    {
      id: 'event-services',
      name: 'Event Services & Stage Operations',
      shortName: 'Event Services',
      icon: '🎪',
      badge: 'QR Gate Pass API',
      color: '#ea580c',
      bgColor: '#fff7ed',
      borderColor: '#fed7aa',
      desc: 'Destination weddings, Live QR gate ticketing, AV sound ledger & artist staging.',
    },
    {
      id: 'plotting-services',
      name: 'Real Estate & Colony Plotting',
      shortName: 'Colony Plotting',
      icon: '🏡',
      badge: 'Interactive SVG Map',
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      desc: 'Colony masterplan layout, plot token booking, KYC vault & 12-60 month EMI calculator.',
    },
    {
      id: 'rent-services',
      name: 'Rental Properties & Asset Leasing',
      shortName: 'Rental Assets',
      icon: '🔑',
      badge: 'Auto UPI Bot',
      color: '#d97706',
      bgColor: '#fef3c7',
      borderColor: '#fde68a',
      desc: 'Commercial leases, banquets, equipment rentals & automated WhatsApp UPI reminders.',
    },
    {
      id: 'dashboards',
      name: '5 Autonomous Dashboards Included',
      shortName: '5 Core Dashboards',
      icon: '🖥️',
      badge: 'Role-Based Portals',
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      desc: 'Super Admin, Tenant Admin, Staff Mobile Radar, Student Academy & Customer Storefront.',
    },
    {
      id: 'architecture',
      name: 'Technical Architecture & Cloud DB',
      shortName: 'Architecture & DB',
      icon: '🏗️',
      badge: 'Multi-Tenant Specs',
      color: '#4f46e5',
      bgColor: '#eef2ff',
      borderColor: '#c7d2fe',
      desc: 'Dedicated vs Shared MongoDB, Custom SSL domains, WebSocket radar & Cloudflare proxy.',
    },
  ];

  // URL query parameter synchronization
  const initialService = searchParams.get('service');
  const validInitial = serviceTabs.some((t) => t.id === initialService) ? initialService : 'beauty-parlour';

  const [selectedServiceDoc, setSelectedServiceDoc] = useState(validInitial);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState(null);

  // Modals state
  const [instantTrialService, setInstantTrialService] = useState(null);
  const [purchaseService, setPurchaseService] = useState(null);

  // Sync state if URL search params change
  useEffect(() => {
    const qService = searchParams.get('service');
    if (qService && serviceTabs.some((t) => t.id === qService) && qService !== selectedServiceDoc) {
      setSelectedServiceDoc(qService);
    }
  }, [searchParams]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDoc = (docId) => {
    setSelectedServiceDoc(docId);
    setSearchParams({ service: docId });
    setIsDropdownOpen(false);
  };

  const handleCopyCode = (code, id) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast.success('Snippet copied to clipboard!');
  };

  const handleOpenTrial = (serviceObj) => {
    setInstantTrialService(serviceObj);
  };

  const handleOpenPurchase = (serviceObj) => {
    setPurchaseService(serviceObj);
  };

  const currentTab = serviceTabs.find((t) => t.id === selectedServiceDoc) || serviceTabs[0];

  return (
    <div
      className="public-layout-light"
      data-theme="light"
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── 1. Top Navigation Bar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.85rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Back button & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <NavLink
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#475569',
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                transition: 'all 0.15s ease',
              }}
            >
              <ArrowLeft size={15} />
              <span>Back to Platform</span>
            </NavLink>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                }}
              >
                <BookOpen size={18} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                    KASHI SERVICE DOCS
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#e0e7ff',
                      color: '#4338ca',
                      textTransform: 'uppercase',
                    }}
                  >
                    API & Operator Manual
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                  Multi-Tenant Platform Specifications & Buyer's Guide
                </div>
              </div>
            </div>
          </div>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => handleOpenTrial({ id: currentTab.id, name: currentTab.name })}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
            >
              <Zap size={14} />
              <span>Start 14-Day Free Trial</span>
            </button>

            <button
              onClick={() => handleOpenPurchase({ id: currentTab.id, name: currentTab.name })}
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>💳 Buy SaaS License</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Primary Sub-Bar: Dropdown Menu & Quick Pills ── */}
      <section
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: '61px',
          zIndex: 90,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '10px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Main Service Dropdown Selector */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 800,
                border: '1.5px solid #4f46e5',
                background: isDropdownOpen ? '#eef2ff' : '#ffffff',
                color: '#1e1b4b',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.12)',
                transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '18px' }}>{currentTab.icon}</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '10px', color: '#6366f1', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>
                  Select Service Document ▾
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 900, color: '#0f172a' }}>
                  {currentTab.name}
                </div>
              </div>
              <ChevronDown
                size={18}
                color="#4f46e5"
                style={{
                  transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  marginLeft: '4px',
                }}
              />
            </button>

            {/* Dropdown Menu Options */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: 0,
                  width: '380px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.2), 0 8px 16px -6px rgba(15, 23, 42, 0.1)',
                  padding: '8px',
                  zIndex: 1000,
                  maxHeight: '440px',
                  overflowY: 'auto',
                }}
              >
                <div
                  style={{
                    padding: '8px 12px 6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    borderBottom: '1px solid #f1f5f9',
                    marginBottom: '4px',
                  }}
                >
                  Choose Service or Architecture Guide:
                </div>

                {serviceTabs.map((tab) => {
                  const isSelected = selectedServiceDoc === tab.id;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => handleSelectDoc(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        background: isSelected ? tab.bgColor : 'transparent',
                        border: isSelected ? `1px solid ${tab.borderColor}` : '1px solid transparent',
                        transition: 'background 0.15s ease',
                        marginBottom: '2px',
                      }}
                      onMouseOver={(e) => {
                        if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                      }}
                      onMouseOut={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: isSelected ? '#ffffff' : tab.bgColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '18px',
                          flexShrink: 0,
                          boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                        }}
                      >
                        {tab.icon}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? tab.color : '#0f172a' }}>
                            {tab.name}
                          </span>
                          <span
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '999px',
                              background: isSelected ? tab.color : '#f1f5f9',
                              color: isSelected ? '#ffffff' : '#64748b',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tab.badge}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                          {tab.desc}
                        </div>
                      </div>

                      {isSelected && (
                        <div style={{ color: tab.color, display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                          <Check size={16} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Sub-Pills for Fast 1-Click Jumping */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              flex: 1,
              justifyContent: 'flex-end',
            }}
          >
            {serviceTabs.map((tab) => {
              const isSelected = selectedServiceDoc === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectDoc(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: isSelected ? 800 : 600,
                    border: isSelected ? `1.5px solid ${tab.color}` : '1px solid #e2e8f0',
                    background: isSelected ? tab.bgColor : '#ffffff',
                    color: isSelected ? tab.color : '#475569',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Main Documentation Reader Container ── */}
      <div
        style={{
          maxWidth: '1440px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 24px 4rem',
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '2.5rem',
          flex: 1,
        }}
      >
        {/* Left Table of Contents / Sidebar */}
        <aside
          style={{
            position: 'sticky',
            top: '145px',
            height: 'fit-content',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#0f172a' }}>
            <FileText size={16} color="#4f46e5" />
            <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              On This Page
            </span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <a href="#overview" style={{ color: '#475569', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}>
              1. Executive Overview
            </a>
            <a href="#portals" style={{ color: '#475569', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}>
              2. Dashboards & Access Roles
            </a>
            <a href="#features" style={{ color: '#475569', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}>
              3. Core Features & Capabilities
            </a>
            <a href="#schema" style={{ color: '#475569', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}>
              4. Database & Multi-Tenant Isolation
            </a>
            <a href="#api" style={{ color: '#475569', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}>
              5. REST API & Endpoints
            </a>
            <a href="#pricing" style={{ color: '#475569', textDecoration: 'none', padding: '4px 8px', borderRadius: '6px' }}>
              6. Pricing & License Provisioning
            </a>
          </nav>

          <hr style={{ borderColor: '#f1f5f9', margin: '1.25rem 0' }} />

          {/* Quick Action Card inside Sidebar */}
          <div
            style={{
              background: currentTab.bgColor,
              border: `1px solid ${currentTab.borderColor}`,
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '20px', marginBottom: '6px' }}>{currentTab.icon}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: currentTab.color, marginBottom: '6px' }}>
              Test {currentTab.shortName}
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px', lineHeight: 1.4 }}>
              Launch instant pre-filled admin session with 1 click.
            </p>
            <button
              onClick={() => handleOpenTrial({ id: currentTab.id, name: currentTab.name })}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                background: currentTab.color,
                color: '#ffffff',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              ⚡ Instant Auto-Login
            </button>
          </div>
        </aside>

        {/* Right Content Area: The Reading Document */}
        <main
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2.5rem 3rem',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2.5rem',
          }}
        >
          {/* Document Header */}
          <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Platform Docs</span>
              <ChevronRight size={14} color="#94a3b8" />
              <span style={{ fontSize: '12px', color: '#64748b' }}>Verticals & Services</span>
              <ChevronRight size={14} color="#94a3b8" />
              <span style={{ fontSize: '12px', fontWeight: 700, color: currentTab.color }}>
                {currentTab.shortName}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1
                  style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: '0 0 8px',
                    letterSpacing: '-0.025em',
                  }}
                >
                  {currentTab.name}
                </h1>
                <p style={{ fontSize: '1.05rem', color: '#475569', margin: 0, lineHeight: 1.6, maxWidth: '850px' }}>
                  {currentTab.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    background: currentTab.bgColor,
                    border: `1px solid ${currentTab.borderColor}`,
                    color: currentTab.color,
                    fontSize: '12px',
                    fontWeight: 800,
                  }}
                >
                  <Sparkles size={13} />
                  v2.4.0 • Enterprise
                </span>
              </div>
            </div>
          </div>

          {/* ═════════════ DOCUMENT VIEW 1: BEAUTY PARLOUR & SALON ERP ═════════════ */}
          {selectedServiceDoc === 'beauty-parlour' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Section 1: Overview */}
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Executive Overview & System Purpose
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  The <strong>Beauty Parlour, Luxury Salon & Academy SaaS</strong> is a mission-critical operations system engineered for single-chair studios, multi-branch city salon chains, and certified cosmetology academies. It merges public-facing online booking storefronts with deep operational backends, offering real-time GPS telemetry for doorstep home visits, POS split billing, biometric punch logs, and comprehensive student academy course certifications.
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginTop: '1rem',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Target Audience</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>Salons, Spas, Makeup Studios, Cosmetology Academies</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Supported Modes</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>In-Studio Appointments & Doorstep Home Dispatch</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Tenancy Architecture</div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>Multi-Tenant with Physical DB Isolation Option</div>
                  </div>
                </div>
              </section>

              {/* Section 2: Portals */}
              <section id="portals">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  2. Dashboards & Access Roles
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '1.25rem' }}>
                  Every beauty parlour tenant is provisioned with 5 distinct role-based interfaces operating from a unified backend:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    {
                      role: '🏢 Tenant Owner Admin (/admin)',
                      desc: 'Full operational control over branches, beauticians, appointment booking calendar, POS billing, split tax invoices, coupons, inventory, and analytics.',
                      url: '/admin/login?tenant=blossom-salon&autologin=true',
                      action: 'Launch Admin Auto-Login →',
                    },
                    {
                      role: '✂️ Staff Mobile GPS Radar (/staff)',
                      desc: 'Dedicated mobile view for beauticians. Allows GPS attendance punch, doorstep client routing polyline, ETA countdown, and service completion sign-off.',
                      url: '/staff/login',
                      action: 'Open Staff Login →',
                    },
                    {
                      role: '🎓 Academy Student LMS (/student)',
                      desc: 'Enrolled cosmetology students access syllabus, practical assignment uploads, attendance logs, tuition installment schedules, and auto-generated PDF diplomas.',
                      url: '/student/login',
                      action: 'Open Student Login →',
                    },
                    {
                      role: '💄 Public Customer Storefront (/site/blossom-salon)',
                      desc: 'Clean, luminous white branded luxury website with treatment menu, package checkout, branch locator, and real-time appointment reservation engine.',
                      url: '/site/blossom-salon',
                      action: 'View Public Storefront →',
                    },
                  ].map((p, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        background: '#ffffff',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{p.role}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px', maxWidth: '750px', lineHeight: 1.5 }}>
                          {p.desc}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(p.url)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: '#0f172a',
                          cursor: 'pointer',
                        }}
                      >
                        {p.action}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Key Features */}
              <section id="features">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  3. Core Features & Capabilities
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                  {[
                    {
                      title: 'Live Staff GPS Radar (Satellite Mode)',
                      desc: 'Tracks specialist coordinates on Google Maps. Auto-updates checked-in, checked-out, and on-dispatch status with route polylines.',
                    },
                    {
                      title: 'Fast POS Billing & GST Split Invoicing',
                      desc: '1-Click invoice generation supporting cash, UPI QR codes, debit cards, customer loyalty wallets, and tiered promotional discounts.',
                    },
                    {
                      title: 'Cosmetology Academy LMS & PDF Diplomas',
                      desc: 'Student admissions, course batch schedules, installment tracking, practical assignments, and cryptographic verification QR codes on PDF certificates.',
                    },
                    {
                      title: 'Multi-Branch & Shift Roster Control',
                      desc: 'Seamless branch switching (e.g. Flagship, Cyber City, South Extension) with independent inventory levels and localized staff shift rotas.',
                    },
                    {
                      title: 'Doorstep Home Service Dispatch',
                      desc: 'Customers can book certified beauticians directly to their home. Staff portal calculates travel radius, distance surcharge, and customer GPS coordinates.',
                    },
                    {
                      title: 'Customer Loyalty Wallet & Automated SMS/WhatsApp',
                      desc: 'Auto-schedules appointment confirmations, 2-hour reminders, birthday vouchers, and post-treatment feedback review requests.',
                    },
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#fdf2f8',
                        border: '1px solid #fbcfe8',
                        borderRadius: '12px',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <CheckCircle2 size={16} color="#be185d" />
                        <span style={{ fontWeight: 800, fontSize: '13.5px', color: '#9d174d' }}>{feat.title}</span>
                      </div>
                      <p style={{ fontSize: '12.5px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {feat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4: Schema & Multi-Tenancy */}
              <section id="schema">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  4. Database & Multi-Tenant Isolation
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  Kashi Service provisions every parlour tenant with strict tenancy enforcement. In standard cloud plans, data is partitioned by <code>tenantId</code> and verified at the database connection layer via Mongoose middleware. In Enterprise White-Label tiers, the system automatically spawns a dedicated, physically isolated MongoDB database instance.
                </p>

                <div
                  style={{
                    background: '#0f172a',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    color: '#e2e8f0',
                    fontFamily: 'monospace',
                    fontSize: '12.5px',
                    position: 'relative',
                  }}
                >
                  <button
                    onClick={() =>
                      handleCopyCode(
                        `// Multi-Tenant Isolation Pattern\nconst tenantDb = await getTenantConnection(req.tenant.id);\nconst Appointment = tenantDb.model('Appointment', AppointmentSchema);\nconst appointments = await Appointment.find({ branchId: req.branchId });`,
                        'schema-code'
                      )
                    }
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#334155',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '4px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    {copiedCode === 'schema-code' ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedCode === 'schema-code' ? 'Copied' : 'Copy'}</span>
                  </button>
                  <pre style={{ margin: 0, overflowX: 'auto' }}>
{`// Mongoose Data Models inside Beauty Parlour Tenant Database:
1. Tenants:       { name, slug, customDomain, branding, subscriptionTier, isolatedDbUri }
2. Branches:      { tenantId, name, address, phone, geolocation: { lat, lng } }
3. StaffSpecialist: { name, email, phone, role, branchId, liveGps: { lat, lng, lastSeen } }
4. Services:      { title, category, durationMinutes, price, doorstepAvailable }
5. Appointments:  { customerId, specialistId, branchId, scheduledDate, mode, status, totalPaid }
6. AcademyCourses:{ title, code, durationMonths, price, syllabus, certificateTemplate }`}
                  </pre>
                </div>
              </section>

              {/* Section 5: REST API */}
              <section id="api">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  5. REST API & Endpoints
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { method: 'POST', endpoint: '/api/v1/admin/auth/login', desc: 'Authenticates tenant admin and returns JWT with tenant scope' },
                    { method: 'GET', endpoint: '/api/v1/services', desc: 'Lists all available beauty services, treatments, packages, and pricing' },
                    { method: 'POST', endpoint: '/api/v1/appointments/book', desc: 'Creates instant appointment reservation (In-Studio or Doorstep)' },
                    { method: 'POST', endpoint: '/api/v1/staff/gps/telemetry', desc: 'Staff mobile beacon sends live lat/lng coordinates and trip ETA' },
                    { method: 'POST', endpoint: '/api/v1/billing/pos/split-invoice', desc: 'Generates GST invoice with split payments (UPI, Cash, Card)' },
                  ].map((api, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 800,
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: api.method === 'GET' ? '#ecfdf5' : '#eff6ff',
                          color: api.method === 'GET' ? '#047857' : '#1d4ed8',
                        }}
                      >
                        {api.method}
                      </span>
                      <code style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace' }}>{api.endpoint}</code>
                      <span style={{ color: '#64748b', fontSize: '12px', marginLeft: 'auto' }}>{api.desc}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ═════════════ DOCUMENT VIEW 2: SOFTWARE SAAS SUITE ═════════════ */}
          {selectedServiceDoc === 'software-saas' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Executive Overview & 4-in-1 Suite Architecture
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  The <strong>Software SaaS Suite</strong> provides turnkey cloud business operating systems for micro and medium enterprises. Rather than requiring distinct software licenses for retail, repair, education, and tailoring, this unified suite provides four specialized modules under a single multi-tenant tenancy.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { name: '🛒 Grocery POS & Barcode', desc: 'UPC/EAN-13 hardware scanner support, batch expiry tracking, and low-stock SMS warnings.' },
                    { name: '🎓 Computer Institute LMS', desc: 'Student enrollment, practical coding assignments, fee installments, and QR-verifiable certificates.' },
                    { name: '📱 Electronics IMEI Repair', desc: 'IMEI history ledger, repair job card progression (Diagnosis -> Part Ordered -> Tested), and warranty cards.' },
                    { name: '👗 Designer Boutique Cards', desc: 'Client body measurement cards, fabric swatches, trial fitting dates, and tailor commission splits.' },
                  ].map((mod, idx) => (
                    <div key={idx} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#1d4ed8', marginBottom: '4px' }}>{mod.name}</div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{mod.desc}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section id="features">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  2. Functional Capabilities & Operator Workflow
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  Operators can toggle modules on or off inside the Super Admin plane. A store running both grocery retail and electronics repair can operate unified customer accounts, split GST receipts, and export combined P&L reports.
                </p>
              </section>
            </div>
          )}

          {/* ═════════════ DOCUMENT VIEW 3: EVENT SERVICES & STAGE OPERATIONS ═════════════ */}
          {selectedServiceDoc === 'event-services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Executive Overview & Stage Operations
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  The <strong>Event Services & Stage Operations</strong> system is constructed for destination wedding planners, corporate banquet managers, and concert production firms. It automates fast gate entry ticket scanning, stage lighting/AV equipment deployment ledgers, and vendor milestone payments.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { title: 'Instant Gate Ticket QR Scanner', desc: 'Security scanner checks passes in under 180ms with anti-passback duplicate detection.' },
                    { title: 'AV & Stage Lighting Ledger', desc: 'Asset check-out, return condition audits, and rental equipment depreciation logs.' },
                    { title: 'Artist Hospitality & Lineup Schedule', desc: 'Performer time slots, sound check schedules, rider fulfillment checklists.' },
                    { title: 'Client Budget & Vendor Invoicing', desc: 'Split invoicing for caterers, decorators, and stage technicians with automated GST filing.' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#c2410c', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ═════════════ DOCUMENT VIEW 4: REAL ESTATE PLOTTING ═════════════ */}
          {selectedServiceDoc === 'plotting-services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Executive Overview & Interactive Colony Plotting
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  The <strong>Real Estate & Colony Plotting SaaS</strong> empowers property developers, colony colonizers, and layout architects to present interactive SVG masterplans. Prospective buyers can click on individual plots to view square yard dimensions, road widths, corner premiums, and launch an instant 12 to 60-month EMI schedule calculator.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { title: 'Interactive SVG Colony Map', desc: 'Real-time color-coded plot statuses: Available (Green), Token Booked (Yellow), Registered (Slate).' },
                    { title: 'Auto 12-60 Month EMI Schedule', desc: 'Instant calculation of monthly installment, down payment, interest amortization, and payment due dates.' },
                    { title: 'Token Booking & Buyer KYC Ledger', desc: 'Aadhaar/PAN document vault with digital agreement generation and receipt issuance.' },
                    { title: 'Broker Commission Matrix', desc: 'Channel partner commissions, sales milestone tracking, and automated payout invoices.' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#047857', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ═════════════ DOCUMENT VIEW 5: RENTAL PROPERTIES & ASSET LEASING ═════════════ */}
          {selectedServiceDoc === 'rent-services' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Executive Overview & Rental Asset Leasing
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  The <strong>Rental Properties & Asset Leasing SaaS</strong> automates leasing lifecycles for commercial properties, warehouses, banquet halls, earthmovers (JCBs), cranes, and rental vehicles. It generates automated monthly UPI invoices with pre-filled QR codes and dispatches WhatsApp payment reminders.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {[
                    { title: '1-Click Monthly Rent UPI Invoicing', desc: 'Pre-filled UPI QR codes sent straight to tenant WhatsApp with instant bank settlement.' },
                    { title: 'Dynamic Lease Agreement & Escrow', desc: 'Automated digital lease agreements with security deposit holding ledgers and renewal alerts.' },
                    { title: 'Heavy Machinery & Return Log', desc: 'Track engine hours, operating odometer, maintenance schedules, and return inspection condition.' },
                    { title: 'Due Date Reminder WhatsApp Bot', desc: 'Auto-dispatches polite payment reminders 3 days before due date and on the 1st of every month.' },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#b45309', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ═════════════ DOCUMENT VIEW 6: 5 CORE DASHBOARDS WALKTHROUGH ═════════════ */}
          {selectedServiceDoc === 'dashboards' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Overview of the 5 Autonomous Portals
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '1.5rem' }}>
                  Every licensed SaaS business tenant is powered by five independent portals, designed for specific operational roles and security tiers:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                    {
                      num: '1',
                      title: '👑 Super Admin Control Plane (/superadmin)',
                      badge: 'Host Governance',
                      color: '#4f46e5',
                      details: [
                        'Global tenant provisioning wizard (60-second setup)',
                        'Physical database routing (Shared MongoDB vs Dedicated MongoDB)',
                        'Custom domain SSL verification and Cloudflare tunnel health',
                        'Global Monthly Recurring Revenue (MRR) ledger and automated license expiration controls',
                      ],
                    },
                    {
                      num: '2',
                      title: '🏢 Tenant Owner Admin Dashboard (/admin)',
                      badge: 'Daily Business Management',
                      color: '#be185d',
                      details: [
                        'Real-time Google Satellite Staff GPS radar tracking',
                        'Appointment booking calendar with drag-and-drop rescheduling',
                        'Point-of-Sale (POS) counter billing with split payment (UPI, Cash, Card) and GST breakdown',
                        'Multi-branch switcher and biometric employee shift management',
                      ],
                    },
                    {
                      num: '3',
                      title: '✂️ Staff Mobile GPS Radar (/staff)',
                      badge: 'Field Specialist Telemetry',
                      color: '#059669',
                      details: [
                        'GPS attendance punch-in with geolocation perimeter enforcement',
                        'Assigned appointment itinerary with doorstep navigation route polyline and ETA countdown',
                        'Client treatment checklist and digital sign-off protocol',
                        'Daily earnings, tips, and commission payout ledger',
                      ],
                    },
                    {
                      num: '4',
                      title: '🎓 Student Academy LMS (/student)',
                      badge: 'Education & Accreditation',
                      color: '#d97706',
                      details: [
                        'Course curriculum, video lectures, and practical styling demo videos',
                        'Practical assignment upload and instructor grading system',
                        'Tuition installment fee payment gateway and tax receipt generator',
                        'Auto-generated PDF diploma certificate with anti-counterfeit verification QR code',
                      ],
                    },
                    {
                      num: '5',
                      title: '💄 Public Customer Storefront (/site/blossom-salon)',
                      badge: 'Client Booking & Packages',
                      color: '#db2777',
                      details: [
                        'Pristine luminous luxury white design with high-contrast text and zero visual clutter',
                        'Online real-time service selection, specialist picking, and doorstep request',
                        'Instant bridal package checkout with UPI/Card payment integration',
                        'Branch directions, studio phone contact, and Google Maps pin integration',
                      ],
                    },
                  ].map((portal, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '14px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{portal.title}</div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: '#f1f5f9',
                            color: portal.color,
                          }}
                        >
                          {portal.badge}
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#475569', fontSize: '13px', lineHeight: 1.7 }}>
                        {portal.details.map((d, dIdx) => (
                          <li key={dIdx}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ═════════════ DOCUMENT VIEW 7: TECHNICAL ARCHITECTURE & CLOUD DB ═════════════ */}
          {selectedServiceDoc === 'architecture' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              <section id="overview">
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
                  1. Technical Architecture & Database Isolation
                </h2>
                <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px' }}>
                  Kashi Service implements a cloud-native, multi-tenant architecture designed to scale seamlessly across thousands of independent businesses while maintaining rigorous data privacy.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
                  <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '6px' }}>
                      Option A: Standard SaaS (Partitioned DB)
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 10px' }}>
                      All tenants share a central MongoDB cluster. Documents are stamped with a tenant discriminator field and queried through scoped tenant connection pools.
                    </p>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>
                      Starter & Pro Plans
                    </span>
                  </div>

                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#065f46', marginBottom: '6px' }}>
                      Option B: Dedicated Physical DB (White-Label)
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#047857', lineHeight: 1.5, margin: '0 0 10px' }}>
                      The platform provisions an independent MongoDB database instance per enterprise tenant. Zero shared tables, customized backup frequencies, and individual encryption keys.
                    </p>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#d1fae5', padding: '2px 8px', borderRadius: '4px' }}>
                      Enterprise White-Label Plan
                    </span>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Section 6: Pricing & Commercial Licensing Actions */}
          <section id="pricing" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
              6. Pricing, Licensing & Instant Deployment
            </h2>
            <p style={{ color: '#334155', lineHeight: 1.7, fontSize: '15px', marginBottom: '1.5rem' }}>
              Ready to deploy {currentTab.name} for your organization? Choose between our Starter, Multi-Branch Pro, or Enterprise White-Label tiers.
            </p>

            <div
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
                border: '1px solid #c7d2fe',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Deploy {currentTab.shortName} in 60 Seconds
                </div>
                <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                  Instant 14-day free trial with auto-filled credentials or direct commercial purchase with GST tax invoice.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleOpenTrial({ id: currentTab.id, name: currentTab.name })}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: 'none',
                    background: '#4f46e5',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)',
                  }}
                >
                  <Zap size={16} />
                  <span>Start 14-Day Free Trial (Auto-Login)</span>
                </button>

                <button
                  onClick={() => handleOpenPurchase({ id: currentTab.id, name: currentTab.name })}
                  style={{
                    padding: '12px 22px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>💳 Buy SaaS License</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ── 4. Clean Footer ── */}
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '2rem',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '12px', color: '#64748b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} color="#4f46e5" />
            <strong style={{ color: '#0f172a' }}>KASHI SERVICE</strong>
            <span>• Enterprise SaaS Documentation & Architectural Reference</span>
          </div>
          <div>© {new Date().getFullYear()} Kashi Service. All Rights Reserved.</div>
        </div>
      </footer>

      {/* ── Modals: Instant Trial Auto-Login & SaaS Purchase ── */}
      {instantTrialService && (
        <InstantTrialModal
          isOpen={Boolean(instantTrialService)}
          service={instantTrialService}
          onClose={() => setInstantTrialService(null)}
          onOpenCustomWizard={() => {
            setInstantTrialService(null);
            navigate('/platform');
          }}
        />
      )}

      {purchaseService && (
        <SaaSPurchaseModal
          isOpen={Boolean(purchaseService)}
          service={purchaseService}
          onClose={() => setPurchaseService(null)}
        />
      )}
    </div>
  );
}
