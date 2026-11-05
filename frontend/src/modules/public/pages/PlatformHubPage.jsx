/**
 * @file PlatformHubPage.jsx
 * @description Master Multi-Tenant SaaS & White-Label Platform Landing Page (Clean Professional White Theme).
 * Showcases:
 *   1. 5 Core Business Verticals: Beauty Parlour, Software SaaS, Event Services, Plotting, Rent
 *   2. Single Professional White Header with Direct Portals & Demo Switcher
 *   3. Modern Crisp Typography & High-Contrast Visual Architecture
 *   4. Instant 14-Day Free Trial & Custom Domain Onboarding Wizard
 *   5. Seeded Demo Tenants Discovery (Blossom Salon, Glamour Academy, Serene Spa)
 * @module frontend/src/modules/public/pages/PlatformHubPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  Layers,
  Cpu,
  Zap,
  Server,
  Users,
  Compass,
  Building,
  Check,
  ExternalLink,
  ChevronRight,
  Eye,
  Star,
  MapPin,
  Calendar,
  Lock,
  BookOpen,
  Scissors,
  ShoppingBag,
  Ticket,
  Home,
  Key,
} from 'lucide-react';
import { getKashiServices, getKashiDemoTenants } from '@/services/api/kashi/kashiPlatformApi.js';
import ServiceDetailModal from '../components/ServiceDetailModal.jsx';
import TenantOnboardingWizardModal from '../components/TenantOnboardingWizardModal.jsx';
import TenantProvisionedSuccessModal from '../components/TenantProvisionedSuccessModal.jsx';
import InstantTrialModal from '../components/InstantTrialModal.jsx';
import SaaSPurchaseModal from '../components/SaaSPurchaseModal.jsx';
import EventServicesView from '@/modules/events/EventServicesView.jsx';
import PlottingServicesView from '@/modules/plotting/PlottingServicesView.jsx';
import RentServicesView from '@/modules/rent/RentServicesView.jsx';
import SoftwareServicesView from '@/modules/software/SoftwareServicesView.jsx';
import BeautyParlourModuleHub from '@/modules/beauty-parlour/BeautyParlourModuleHub.jsx';
import { useToast } from '@/context/ToastContext.jsx';

export default function PlatformHubPage({ onSwitchToStorefront }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeVerticalTab, setActiveVerticalTab] = useState('ALL'); // 'ALL' | 'BEAUTY' | 'SOFTWARE' | 'EVENTS' | 'PLOTTING' | 'RENT'
  const [services, setServices] = useState([]);
  const [demoTenants, setDemoTenants] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [onboardingService, setOnboardingService] = useState(null);
  const [selectedPlanForWizard, setSelectedPlanForWizard] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [instantTrialService, setInstantTrialService] = useState(null);
  const [purchaseService, setPurchaseService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesRes, demoRes] = await Promise.allSettled([
          getKashiServices(),
          getKashiDemoTenants(),
        ]);
        if (servicesRes.status === 'fulfilled' && servicesRes.value?.data?.services) {
          setServices(servicesRes.value.data.services);
        }
        if (demoRes.status === 'fulfilled' && demoRes.value?.data?.tenants) {
          setDemoTenants(demoRes.value.data.tenants);
        }
      } catch (err) {
        console.warn('Could not load Kashi Service catalog:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleOpenDetail = (service) => {
    setSelectedService(service);
  };

  const handleStartOnboarding = (service, plan = null) => {
    setSelectedService(null);
    setOnboardingService(service || services[0]);
    setSelectedPlanForWizard(plan || service?.plans?.[0] || null);
  };

  const handleLaunchDemoTenant = (slug) => {
    sessionStorage.setItem('current_tenant_slug', slug);
    localStorage.setItem('active_tenant_slug', slug);
    navigate(`/site/${slug}`);
  };

  const handleOpenInstantTrial = (service) => {
    setInstantTrialService(service || services[0] || { id: 'beauty-parlour', name: 'Beauty Parlour & Salon ERP' });
  };

  const handleOpenPurchase = (service) => {
    setPurchaseService(service || services[0] || { id: 'beauty-parlour', name: 'Beauty Parlour & Salon ERP' });
  };

  return (
    <div
      className="public-layout-light"
      data-theme="light"
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── 1. Pristine White Sticky Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.85rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Zap size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  KASHI SERVICE
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#e0e7ff',
                    color: '#4338ca',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  SaaS Platform
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                White-Label Multi-Tenant Cloud Ecosystem
              </div>
            </div>
          </div>

          {/* Center Navigation Shortcuts */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveVerticalTab('ALL')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeVerticalTab === 'ALL' ? 700 : 500,
                color: activeVerticalTab === 'ALL' ? '#4f46e5' : '#475569',
                cursor: 'pointer',
              }}
            >
              All Verticals
            </button>
            <button
              onClick={() => setActiveVerticalTab('BEAUTY')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeVerticalTab === 'BEAUTY' ? 700 : 500,
                color: activeVerticalTab === 'BEAUTY' ? '#ec4899' : '#475569',
                cursor: 'pointer',
              }}
            >
              Beauty Parlour
            </button>
            <button
              onClick={() => setActiveVerticalTab('SOFTWARE')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeVerticalTab === 'SOFTWARE' ? 700 : 500,
                color: activeVerticalTab === 'SOFTWARE' ? '#2563eb' : '#475569',
                cursor: 'pointer',
              }}
            >
              Software Suites
            </button>
            <button
              onClick={() => setActiveVerticalTab('EVENTS')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeVerticalTab === 'EVENTS' ? 700 : 500,
                color: activeVerticalTab === 'EVENTS' ? '#ea580c' : '#475569',
                cursor: 'pointer',
              }}
            >
              Event Services
            </button>
            <button
              onClick={() => setActiveVerticalTab('PLOTTING')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeVerticalTab === 'PLOTTING' ? 700 : 500,
                color: activeVerticalTab === 'PLOTTING' ? '#059669' : '#475569',
                cursor: 'pointer',
              }}
            >
              Real Estate
            </button>
            <button
              onClick={() => setActiveVerticalTab('RENT')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13px',
                fontWeight: activeVerticalTab === 'RENT' ? 700 : 500,
                color: activeVerticalTab === 'RENT' ? '#d97706' : '#475569',
                cursor: 'pointer',
              }}
            >
              Rental Assets
            </button>

            <NavLink
              to="/docs"
              style={{
                textDecoration: 'none',
                fontSize: '13px',
                fontWeight: 700,
                color: '#4f46e5',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                background: '#eef2ff',
                border: '1px solid #c7d2fe',
                transition: 'all 0.15s ease',
              }}
            >
              <span>📖 Docs & Dashboards</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {/* ── 2. Hero Section (Clean White & High-Contrast Slate) ── */}
      <section
        style={{
          position: 'relative',
          padding: '4.5rem 2rem 3.5rem',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid #f1f5f9',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          {/* Top Announcement Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: '#e0e7ff',
              border: '1px solid #c7d2fe',
              fontSize: '12px',
              fontWeight: 700,
              color: '#3730a3',
              marginBottom: '1.75rem',
            }}
          >
            <Sparkles size={14} color="#4f46e5" />
            <span>5-in-1 Multi-Tenant SaaS Platform • Instant 14-Day Free Trial</span>
          </div>

          {/* Primary Hero Heading */}
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: '1.25rem',
            }}
          >
            Launch Your Website & Admin Dashboard on Your Own Domain{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              in 60 Seconds
            </span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '820px',
              margin: '0 auto 2.5rem',
              fontWeight: 400,
            }}
          >
            From <strong>Beauty Parlours</strong> and <strong>Retail & Software ERPs</strong> to{' '}
            <strong>Event Planners</strong>, <strong>Real Estate Plotting</strong>, and <strong>Asset Leasing</strong> —
            Kashi Service provisions autonomous business tenants with custom domains, isolated databases, GPS staff radar,
            and full mobile operations.
          </p>

          {/* Primary Action Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <button
              onClick={() => handleOpenInstantTrial(services[0] || null)}
              style={{
                padding: '14px 32px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.35)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#4338ca')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#4f46e5')}
            >
              <Zap size={18} />
              <span>Start 14-Day Free Trial (Auto-Login)</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => handleLaunchDemoTenant('blossom-salon')}
              style={{
                padding: '14px 28px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                e.currentTarget.style.background = '#f8fafc';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.background = '#ffffff';
              }}
            >
              <span>💅 Explore Beauty Parlour Demo</span>
              <ExternalLink size={16} />
            </button>

            <NavLink
              to="/docs"
              style={{
                padding: '14px 24px',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 700,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#334155',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <span>📖 Platform Docs & Dashboards</span>
            </NavLink>
          </div>

          {/* 4 Clean Metric Feature Highlights */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.25rem',
              textAlign: 'left',
            }}
          >
            {[
              {
                icon: <Zap size={22} color="#4f46e5" />,
                title: '60-Sec Provisioning',
                desc: 'Auto DB schemas, admin account & sample records generated instantly.',
              },
              {
                icon: <Globe size={22} color="#2563eb" />,
                title: 'Custom Domain & SSL',
                desc: 'Use YourBrand.com or yourname.kashiservice.com with free SSL.',
              },
              {
                icon: <Compass size={22} color="#059669" />,
                title: 'Live Staff GPS Radar',
                desc: 'Real-time check-in/out & doorstep transit tracking on Google Satellite.',
              },
              {
                icon: <Shield size={22} color="#7c3aed" />,
                title: 'Isolated Database Option',
                desc: 'Choose Separate DB per tenant for enterprise security & compliance.',
              },
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  borderRadius: '12px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>
                    {f.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Interactive 5-Vertical Navigation Tab Bar ── */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2.5rem 2rem 1.5rem',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <h2
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#0f172a',
              margin: '0 0 6px',
            }}
          >
            Explore the 5 Business Verticals
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Choose a vertical below to inspect its dedicated modules, live features, and demo portals.
          </p>
        </div>

        {/* Tab Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            padding: '6px',
            background: '#f1f5f9',
            borderRadius: '12px',
            maxWidth: '1000px',
            margin: '0 auto 2.5rem',
          }}
        >
          {[
            { id: 'ALL', label: '🌟 All 5 Verticals', count: 5 },
            { id: 'BEAUTY', label: '💄 Beauty Parlour ERP', badge: 'Ready' },
            { id: 'SOFTWARE', label: '💻 Software SaaS (Grocery / Institute / Repair / Boutique)' },
            { id: 'EVENTS', label: '🎉 Event Services' },
            { id: 'PLOTTING', label: '🏗️ Real Estate Plotting' },
            { id: 'RENT', label: '🔑 Rental Assets' },
          ].map((tab) => {
            const isActive = activeVerticalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveVerticalTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  border: 'none',
                  background: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#0f172a' : '#64748b',
                  cursor: 'pointer',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.08)' : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#059669',
                      fontWeight: 800,
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Sub-Vertical View Injections ── */}
        {activeVerticalTab === 'BEAUTY' && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <BeautyParlourModuleHub onStartTrial={handleStartOnboarding} />
          </div>
        )}

        {activeVerticalTab === 'SOFTWARE' && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <SoftwareServicesView onStartTrial={handleStartOnboarding} />
          </div>
        )}

        {activeVerticalTab === 'EVENTS' && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <EventServicesView onStartTrial={handleStartOnboarding} />
          </div>
        )}

        {activeVerticalTab === 'PLOTTING' && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <PlottingServicesView onStartTrial={handleStartOnboarding} />
          </div>
        )}

        {activeVerticalTab === 'RENT' && (
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <RentServicesView onStartTrial={handleStartOnboarding} />
          </div>
        )}

        {/* ── 'ALL' Tab Grid Cards ── */}
        {activeVerticalTab === 'ALL' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Card 1: Beauty Parlour */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#fdf2f8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Scissors size={22} color="#ec4899" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#059669',
                    }}
                  >
                    Production Ready
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Beauty Parlour & Salon ERP
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Complete luxury salon management system with multi-branch control, live staff GPS tracking radar,
                  biometric check-in, academy LMS, POS billing, and online customer bookings.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {[
                    'Live Staff GPS Tracking Radar (Satellite Mode)',
                    'Multi-Branch & Shift Roster Control',
                    'Beauty Academy Student LMS & PDF Certificates',
                    'Fast POS Billing with GST & Coupons',
                    'Doorstep Home Services Dispatch',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#10b981" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => handleLaunchDemoTenant('blossom-salon')}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  👁️ View Demo
                </button>
                <button
                  onClick={() => handleOpenInstantTrial(services.find((s) => s.id === 'beauty-parlour') || { id: 'beauty-parlour', name: 'Beauty Parlour & Salon ERP' })}
                  style={{
                    flex: 1.2,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    background: '#ec4899',
                    color: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚡ Start 14-Day Trial
                </button>
                <button
                  onClick={() => handleOpenPurchase(services.find((s) => s.id === 'beauty-parlour') || { id: 'beauty-parlour', name: 'Beauty Parlour & Salon ERP' })}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #fbcfe8',
                    background: '#fdf2f8',
                    color: '#be185d',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  💳 Buy SaaS
                </button>
              </div>
            </div>

            {/* Card 2: Software SaaS Suite */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ShoppingBag size={22} color="#2563eb" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                    }}
                  >
                    4 Verticals Inside
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Software SaaS Suite (Retail & LMS)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Turnkey cloud business software suites with custom domain support, user roles, billing, and inventory tracking:
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {[
                    '🛒 Grocery Shop Cloud POS & Barcode Scanner API',
                    '🎓 Computer Institute LMS & Student Certificate Generator',
                    '📱 Electronics Repair ERP & IMEI Warranty Tracker',
                    '👗 Designer Boutique Custom Measurement Cards',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#2563eb" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setActiveVerticalTab('SOFTWARE')}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Inspect Suite
                </button>
                <button
                  onClick={() => handleOpenInstantTrial(services.find((s) => s.id === 'software-saas') || { id: 'software-saas', name: 'Software SaaS Suite' })}
                  style={{
                    flex: 1.2,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    background: '#2563eb',
                    color: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚡ Start 14-Day Trial
                </button>
                <button
                  onClick={() => handleOpenPurchase(services.find((s) => s.id === 'software-saas') || { id: 'software-saas', name: 'Software SaaS Suite' })}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #bfdbfe',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  💳 Buy SaaS
                </button>
              </div>
            </div>

            {/* Card 3: Event Services */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#fff7ed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ticket size={22} color="#ea580c" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: '#fff7ed',
                      color: '#c2410c',
                    }}
                  >
                    Live QR Passes
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Event Services & Stage Operations
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  End-to-end event planning system for destination weddings, stage shows, artist management, and gate control.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {[
                    'Instant Gate Ticket QR Scanner for Fast Entry',
                    'Stage, Lighting & AV Equipment Ledger',
                    'Live Budget & Vendor Invoicing Automation',
                    'Wedding & Corporate Booking Schedule',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#ea580c" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setActiveVerticalTab('EVENTS')}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Try Gate Scanner
                </button>
                <button
                  onClick={() => handleOpenInstantTrial(services.find((s) => s.id === 'event-services') || { id: 'event-services', name: 'Event Services & Stage Operations' })}
                  style={{
                    flex: 1.2,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    background: '#ea580c',
                    color: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚡ Start 14-Day Trial
                </button>
                <button
                  onClick={() => handleOpenPurchase(services.find((s) => s.id === 'event-services') || { id: 'event-services', name: 'Event Services & Stage Operations' })}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #fed7aa',
                    background: '#fff7ed',
                    color: '#c2410c',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  💳 Buy SaaS
                </button>
              </div>
            </div>

            {/* Card 4: Real Estate & Plotting */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Home size={22} color="#059669" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: '#ecfdf5',
                      color: '#047857',
                    }}
                  >
                    SVG Masterplan
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Real Estate & Colony Plotting
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Interactive colony layout map with live plot status (Available, Booked, Sold) and built-in EMI schedule calculator.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {[
                    'Interactive SVG Colony Map with Clickable Plots',
                    'Token Booking & Buyer KYC Documents Ledger',
                    'Auto 12-60 Month EMI Schedule Generator',
                    'Corner & Park-Facing Premium Calculations',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#059669" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setActiveVerticalTab('PLOTTING')}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  View Plot Layout
                </button>
                <button
                  onClick={() => handleOpenInstantTrial(services.find((s) => s.id === 'plotting-services') || { id: 'plotting-services', name: 'Real Estate & Colony Plotting' })}
                  style={{
                    flex: 1.2,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    background: '#059669',
                    color: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚡ Start 14-Day Trial
                </button>
                <button
                  onClick={() => handleOpenPurchase(services.find((s) => s.id === 'plotting-services') || { id: 'plotting-services', name: 'Real Estate & Colony Plotting' })}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #a7f3d0',
                    background: '#ecfdf5',
                    color: '#047857',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  💳 Buy SaaS
                </button>
              </div>
            </div>

            {/* Card 5: Rental & Asset Leasing */}
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.75rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Key size={22} color="#d97706" />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: '#fef3c7',
                      color: '#b45309',
                    }}
                  >
                    Auto UPI Bot
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                  Rental Properties & Asset Leasing
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  Commercial leasing, banquets, earthmovers, scaffolding, and vehicle rental tracking with automated monthly UPI bills.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                  {[
                    'Dynamic Lease Agreement Generator & Security Deposits',
                    '1-Click Monthly Rent UPI Invoicing with QR',
                    'Automated WhatsApp Due Date Reminder Bot',
                    'Machinery Maintenance & Return Tracker',
                  ].map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                      <CheckCircle2 size={15} color="#d97706" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                <button
                  onClick={() => setActiveVerticalTab('RENT')}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#0f172a',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Generate UPI Bill
                </button>
                <button
                  onClick={() => handleOpenInstantTrial(services.find((s) => s.id === 'rent-services') || { id: 'rent-services', name: 'Rental Properties & Asset Leasing' })}
                  style={{
                    flex: 1.2,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: 'none',
                    background: '#d97706',
                    color: '#ffffff',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ⚡ Start 14-Day Trial
                </button>
                <button
                  onClick={() => handleOpenPurchase(services.find((s) => s.id === 'rent-services') || { id: 'rent-services', name: 'Rental Properties & Asset Leasing' })}
                  style={{
                    flex: 1,
                    padding: '9px 6px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #fde68a',
                    background: '#fef3c7',
                    color: '#b45309',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  💳 Buy SaaS
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── 4. Live Seeded Demo Tenants Section (White Theme) ── */}
      <section
        style={{
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          borderBottom: '1px solid #e2e8f0',
          padding: '4rem 2rem',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#4f46e5',
                padding: '4px 12px',
                borderRadius: '999px',
                background: '#e0e7ff',
              }}
            >
              Instant Sandbox Access
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: '12px 0 6px' }}>
              Test Drive Seeded Demo Businesses
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
              Pre-configured demo environments with sample branches, staff GPS locations, bookings, and full admin permissions.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {[
              {
                slug: 'blossom-salon',
                name: 'Blossom Luxury Salon & Spa',
                category: 'BEAUTY & SALON ERP',
                color: '#ec4899',
                branches: '3 Flagship Branches (Bandra, Cyber City, Connaught Place)',
                staffCount: '18 Active Staff',
                features: ['Live GPS Radar', 'POS Billing & GST', 'Doorstep Home Service'],
                adminEmail: 'admin@parlour.local',
                adminPass: 'Password@123',
              },
              {
                slug: 'glamour-academy',
                name: 'Glamour Cosmetology Academy',
                category: 'ACADEMY & TRAINING INSTITUTE',
                color: '#2563eb',
                branches: '2 Campuses (Delhi South Ex, Gurugram)',
                staffCount: '12 Senior Instructors',
                features: ['Student Batch Timetable', 'Online Exams & Grading', 'Auto PDF Certificates'],
                adminEmail: 'admin@glamour.com',
                adminPass: 'Password@123',
              },
              {
                slug: 'serene-spa',
                name: 'Serene Wellness Sanctuary',
                category: 'DAY SPA & AYURVEDA',
                color: '#059669',
                branches: 'Flagship Sanctuary Lounge',
                staffCount: '8 Estheticians & Therapists',
                features: ['Aromatherapy Rooms', 'Membership Passes', 'Online Booking Wizard'],
                adminEmail: 'admin@serene.com',
                adminPass: 'Password@123',
              },
            ].map((tenant, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: `${tenant.color}15`,
                        color: tenant.color,
                        letterSpacing: '0.04em',
                      }}
                    >
                      {tenant.category}
                    </span>
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>🟢 Live Online</span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    {tenant.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                    {tenant.branches} • {tenant.staffCount}
                  </div>

                  {/* Features Tag */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                    {tenant.features.map((feat, fi) => (
                      <span
                        key={fi}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#475569',
                          fontWeight: 500,
                        }}
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>

                  {/* Credentials Box */}
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      fontSize: '11px',
                      color: '#475569',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div><strong>Admin Login:</strong> <code style={{ color: '#0f172a' }}>{tenant.adminEmail}</code></div>
                    <div><strong>Password:</strong> <code style={{ color: '#0f172a' }}>{tenant.adminPass}</code></div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleLaunchDemoTenant(tenant.slug)}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#0f172a',
                      cursor: 'pointer',
                    }}
                  >
                    🌐 Storefront
                  </button>
                  <NavLink
                    to={`/admin/login?tenant=${tenant.slug}`}
                    style={{
                      flex: 1,
                      padding: '9px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      border: 'none',
                      background: '#4f46e5',
                      color: '#ffffff',
                      textDecoration: 'none',
                      textAlign: 'center',
                    }}
                  >
                    🏢 Admin Login
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. SaaS vs White-Label Architecture Table (White Theme) ── */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
            Multi-Tenant SaaS vs. White-Label Deployment
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
            Compare standard shared tenancy against dedicated white-label with isolated database hosting.
          </p>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '16px 20px', fontWeight: 700, color: '#475569' }}>Feature / Capability</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, color: '#4f46e5' }}>Standard SaaS Plan</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, color: '#059669' }}>White-Label Pro</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Domain Setup', saas: 'subdomain.kashiservice.com', wl: 'YourOwnDomain.com (Custom SSL)' },
                { feature: 'Database Isolation', saas: 'Shared DB (Tenant ID partitioned)', wl: 'Dedicated Database (Physical Isolation)' },
                { feature: 'Live Staff GPS Radar', saas: 'Standard Google Streets', wl: 'Google Satellite Aerial Mode' },
                { feature: 'Biometric Attendance & Leaves', saas: 'Included', wl: 'Included with Shift Multi-Branches' },
                { feature: 'Student Academy LMS', saas: 'Up to 50 Students', wl: 'Unlimited Students & Auto PDF Certs' },
                { feature: 'Payment Gateway', saas: 'Platform Razorpay / Stripe', wl: 'Own Custom UPI / Razorpay Credentials' },
                { feature: 'Custom Theme & Branding', saas: 'Logo & Color Accent', wl: '100% Brand Removal / Pure White-Label' },
              ].map((row, rIdx) => (
                <tr key={rIdx} style={{ borderBottom: rIdx === 6 ? 'none' : '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 600, color: '#0f172a' }}>{row.feature}</td>
                  <td style={{ padding: '14px 20px', color: '#475569' }}>{row.saas}</td>
                  <td style={{ padding: '14px 20px', color: '#059669', fontWeight: 700 }}>{row.wl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. Clean White Footer ── */}
      <footer
        style={{
          borderTop: '1px solid #e2e8f0',
          background: '#ffffff',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          marginTop: 'auto',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#4f46e5" />
            <span style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>KASHI SERVICE</span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>• Enterprise Multi-Tenant Platform</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            © {new Date().getFullYear()} Kashi Service. All Rights Reserved. Built for Scalable Multi-Tenant Operations.
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '12px' }}>
            <NavLink to="/docs" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
              Platform Architecture & Docs
            </NavLink>
          </div>
        </div>
      </footer>

      {/* ── Modals ── */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onStartTrial={() => handleStartOnboarding(selectedService)}
        />
      )}

      {onboardingService && (
        <TenantOnboardingWizardModal
          service={onboardingService}
          initialPlan={selectedPlanForWizard}
          onClose={() => setOnboardingService(null)}
          onSuccess={(data) => {
            setOnboardingService(null);
            setReceiptData(data);
          }}
        />
      )}

      {receiptData && (
        <TenantProvisionedSuccessModal
          data={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

      {instantTrialService && (
        <InstantTrialModal
          isOpen={Boolean(instantTrialService)}
          service={instantTrialService}
          onClose={() => setInstantTrialService(null)}
          onOpenCustomWizard={(srv) => handleStartOnboarding(srv)}
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
