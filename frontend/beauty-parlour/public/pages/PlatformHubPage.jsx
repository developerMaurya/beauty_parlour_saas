/**
 * @file KashiServicePlatformPage.jsx
 * @description Master Platform & Service Marketplace Landing for Kashi Service.
 * Showcases:
 *   1. 5 Core Business Verticals: Software SaaS, Event Services, Parlour Services, Plotting Services, Rent Services
 *   2. Architecture & Documentation Notes
 *   3. SaaS vs White-Label Comparison Matrix
 *   4. Instant 14-Day Free Trial & Custom Domain Onboarding Wizard
 *   5. Live Demo Tenant Previews (Blossom Salon, Glamour Academy, Serene Spa)
 * @module frontend/src/modules/kashi-service/pages/KashiServicePlatformPage
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
} from 'lucide-react';
import { getKashiServices, getKashiDemoTenants } from '../../../services/api/kashi/kashiPlatformApi.js';
import ServiceDetailModal from '../components/ServiceDetailModal.jsx';
import TenantOnboardingWizardModal from '../components/TenantOnboardingWizardModal.jsx';
import TenantProvisionedSuccessModal from '../components/TenantProvisionedSuccessModal.jsx';
import EventServicesView from '../../events/EventServicesView.jsx';
import PlottingServicesView from '../../plotting/PlottingServicesView.jsx';
import RentServicesView from '../../rent/RentServicesView.jsx';
import SoftwareServicesView from '../../software/SoftwareServicesView.jsx';
import BeautyParlourModuleHub from '../../beauty-parlour/BeautyParlourModuleHub.jsx';
import { useToast } from '../../../context/ToastContext.jsx';

export default function KashiServicePlatformPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeVerticalTab, setActiveVerticalTab] = useState('ALL'); // 'ALL' | 'SOFTWARE' | 'BEAUTY' | 'EVENTS' | 'PLOTTING' | 'RENT'
  const [services, setServices] = useState([]);
  const [demoTenants, setDemoTenants] = useState([]);
  const [selectedService, setSelectedService] = useState(null); // for detail modal
  const [onboardingService, setOnboardingService] = useState(null); // for wizard modal
  const [selectedPlanForWizard, setSelectedPlanForWizard] = useState(null);
  const [receiptData, setReceiptData] = useState(null); // for success modal
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#070b14',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── 1. Top Platform Header & Fast Navigation ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(7, 11, 20, 0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '0.85rem 2rem',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Logo & Platform Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                KASHI <span style={{ color: '#ec4899' }}>SERVICE</span>
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Multi-Tenant SaaS & White-Label Cloud Platform
              </div>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <a href="#services" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', textDecoration: 'none' }}>
              Services Catalog
            </a>
            <a href="#architecture" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', textDecoration: 'none' }}>
              Architecture
            </a>
            <a href="#comparison" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', textDecoration: 'none' }}>
              SaaS vs White-Label
            </a>
            <a href="#demos" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', textDecoration: 'none' }}>
              Live Demos
            </a>
          </nav>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              onClick={() => handleLaunchDemoTenant('blossom-salon')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <span>💅 Salon Demo</span>
            </button>

            <button
              onClick={() => navigate('/admin/login')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <span>🏢 Tenant Login</span>
            </button>

            <button
              onClick={() => navigate('/superadmin/login')}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <span>👑 Super Admin</span>
            </button>

            <button
              onClick={() => handleStartOnboarding(services[0])}
              className="btn btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.82rem',
                padding: '7px 16px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Free Trial</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Section ── */}
      <section
        style={{
          padding: '4.5rem 2rem 3.5rem 2rem',
          background: 'radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(7, 11, 20, 0) 70%)',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#818cf8',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kashi Service • Multi-Tenant SaaS & White-Label Cloud Ecosystem</span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.03em',
            }}
          >
            Launch Your Website & Admin Dashboard on Your Own Domain in <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #ec4899 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>60 Seconds</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: '1.1rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            From <strong>Beauty Parlours</strong> and <strong>Event Companies</strong> to <strong>Real Estate Plotting</strong> and <strong>Rental Leases</strong> — Kashi Service provisions autonomous tenants with custom domains, isolated databases, GPS staff radar, and complete business operations.
          </p>

          {/* Hero CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button
              onClick={() => handleStartOnboarding(services[0])}
              className="btn btn-primary"
              style={{
                fontSize: '1rem',
                padding: '14px 28px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles className="w-5 h-5" />
              <span>Start 14-Day Free Trial</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleLaunchDemoTenant('blossom-salon')}
              className="btn btn-secondary"
              style={{
                fontSize: '1rem',
                padding: '14px 24px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>💅 Explore Live Beauty Parlour</span>
            </button>
          </div>

          {/* Quick Pillars Strip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginTop: '1.5rem',
              fontSize: '0.82rem',
              color: '#cbd5e1',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Free Subdomain (<code>.kashiservice.com</code>)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Custom Branded Domain (<code>.com / .in</code>)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Google Satellite GPS Staff Tracking
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Database Provisioning
            </span>
          </div>
        </div>
      </section>

      {/* ── 3. 5 Core Service Verticals Catalog ── */}
      <section id="services" style={{ padding: '3rem 2rem 5rem 2rem', maxWidth: '1360px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Comprehensive Business Solutions
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#fff', margin: '6px 0 10px 0' }}>
            Explore Kashi Service Core Verticals
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto' }}>
            Click on any service to inspect complete documentation notes, architecture specifications, and subscription plans.
          </p>
        </div>

        {/* Sub-Vertical Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '2.5rem',
          }}
        >
          {[
            { id: 'ALL', label: '🌟 All Services Hub', color: '#6366f1' },
            { id: 'BEAUTY', label: '💄 Beauty Parlour ERP', color: '#ec4899' },
            { id: 'SOFTWARE', label: '💻 Software SaaS Hub', color: '#38bdf8' },
            { id: 'EVENTS', label: '🎉 Event Services', color: '#db2777' },
            { id: 'PLOTTING', label: '🏗️ Plotting & Real Estate', color: '#10b981' },
            { id: 'RENT', label: '🔑 Rent & Asset Leasing', color: '#f59e0b' },
          ].map((tab) => {
            const isActive = activeVerticalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveVerticalTab(tab.id)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: isActive ? tab.color : 'rgba(255, 255, 255, 0.1)',
                  background: isActive ? `${tab.color}22` : 'rgba(255, 255, 255, 0.03)',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? `0 4px 15px ${tab.color}33` : 'none',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Render based on Active Vertical Tab */}
        {activeVerticalTab === 'BEAUTY' && (
          <BeautyParlourModuleHub onStartTrial={handleStartOnboarding} />
        )}

        {activeVerticalTab === 'SOFTWARE' && (
          <SoftwareServicesView onStartTrial={handleStartOnboarding} />
        )}

        {activeVerticalTab === 'EVENTS' && (
          <EventServicesView onStartTrial={handleStartOnboarding} />
        )}

        {activeVerticalTab === 'PLOTTING' && (
          <PlottingServicesView onStartTrial={handleStartOnboarding} />
        )}

        {activeVerticalTab === 'RENT' && (
          <RentServicesView onStartTrial={handleStartOnboarding} />
        )}

        {/* Cards Grid when ALL is selected */}
        {activeVerticalTab === 'ALL' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {(services.length > 0 ? services : [
            { id: 'software-saas', name: 'Software Services (Multi-Tenant SaaS)', icon: '💻', tagline: 'Beauty Parlour, Grocery, Electronics, Institute & Boutique Cloud ERP', gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', status: 'ACTIVE_PRODUCTION', features: ['Custom White-Label Domain', 'Staff Biometric & GPS Punch', 'Academy LMS', 'GST Billing POS'] },
            { id: 'event-service', name: 'Event Services & Production', icon: '🎉', tagline: 'Weddings, Corporate Gatherings, Stage Staging & Catering Operations', gradient: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)', status: 'ACTIVE_VERTICAL', features: ['Milestone Gantt Tracker', 'Vendor Payout Ledger', 'Digital QR Passes', 'Banquet Floorplans'] },
            { id: 'parlour-service', name: 'Parlour Services & Salon Concierge', icon: '💄', tagline: 'Haute Couture Bridal Artistry, Hair Spa, Hydra-Facial & Derma Clinic', gradient: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)', status: 'ACTIVE_VERTICAL', features: ['VIP Online Booking', 'Home Doorstep Dispatch', 'Digital Skin Profiles', 'Loyalty Rewards'] },
            { id: 'plotting-service', name: 'Plotting Services (Real Estate & Colonies)', icon: '🏗️', tagline: 'Colony Land Layout Mapping, Interactive Plot Status & EMI Schedules', gradient: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)', status: 'ACTIVE_VERTICAL', features: ['Interactive SVG Masterplan', 'Down-Payment Token E-Receipt', 'EMI Schedule Ledger', 'RERA Registry Vault'] },
            { id: 'rent-service', name: 'Rent Services (Properties & Assets)', icon: '🔑', tagline: 'Commercial Leases, Flat Rentals, Machinery & Heavy Equipment Staging', gradient: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)', status: 'ACTIVE_VERTICAL', features: ['Digital E-Sign Lease', 'Monthly Auto-Invoicing', 'WhatsApp Rent Reminders', 'Deposit Escrow Tracker'] },
          ]).map((srv) => (
            <div
              key={srv.id}
              style={{
                borderRadius: '22px',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
                transition: 'all 0.3s ease',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div>
                {/* Header with Icon and Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: srv.gradient || 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '26px',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                    }}
                  >
                    {srv.icon}
                  </div>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#10b981',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                    }}
                  >
                    ● {srv.status?.replace(/_/g, ' ') || 'ACTIVE'}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 style={{ margin: '0 0 6px 0', fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                  {srv.name}
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {srv.tagline}
                </p>

                {/* Active Sub-Verticals Pills */}
                {srv.activeVerticals && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '14px 0' }}>
                    {srv.activeVerticals.map((v) => (
                      <span
                        key={v.id}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: '#cbd5e1',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                        }}
                      >
                        {v.name}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bullet Features */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '14px 0 0 0' }}>
                  {(srv.features || []).slice(0, 4).map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <button
                  onClick={() => handleOpenDetail(srv)}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', padding: '9px' }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Docs & Notes</span>
                </button>

                <button
                  onClick={() => handleStartOnboarding(srv)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.82rem', padding: '9px' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Start Free Trial</span>
                </button>
              </div>
            </div>
          ))}
          </div>
        )}
      </section>

      {/* ── 4. Architecture & Complete Customer Journey Diagram ── */}
      <section id="architecture" style={{ padding: '4rem 2rem', background: '#0a0f1d', borderTop: '1px solid rgba(255, 255, 255, 0.06)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              System Engineering & Provisioning Flow
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '6px 0 10px 0' }}>
              How Kashi Service Operates (End-to-End Flow)
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '680px', margin: '0 auto' }}>
              Designed as an autonomous multi-tenant engine: from main platform browsing to automated database creation and live custom domain routing.
            </p>
          </div>

          {/* Architecture Step Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              {
                step: '01',
                title: 'Main SaaS Platform (kashiservice.com)',
                desc: 'Customer browses all verticals (Beauty Parlour, Event, Plotting, Rent). Clicks Demo or Start Free Trial.',
                icon: Globe,
                color: '#6366f1',
              },
              {
                step: '02',
                title: 'Instant Registration & Domain Choice',
                desc: 'Customer enters Business Name, Owner details, Admin Email & Password, and selects Subdomain or Custom Domain.',
                icon: Users,
                color: '#ec4899',
              },
              {
                step: '03',
                title: 'Automated 60s Provisioning',
                desc: 'Backend automatically creates Tenant, assigns Subscription, seeds DB collections, and creates Owner credentials.',
                icon: Server,
                color: '#10b981',
              },
              {
                step: '04',
                title: 'Autonomous Storefront & Admin Live',
                desc: 'Public website (riya.kashiservice.com) and Private Admin (/admin) go live instantly with full isolated data.',
                icon: Zap,
                color: '#f59e0b',
              },
            ].map((st) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.step}
                  style={{
                    padding: '24px',
                    borderRadius: '18px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${st.color}22`,
                        color: st.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'rgba(255,255,255,0.15)' }}>
                      {st.step}
                    </span>
                  </div>

                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fff' }}>
                    {st.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. SaaS vs White-Label Comparison Matrix ── */}
      <section id="comparison" style={{ padding: '4.5rem 2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Branding & Deployment Flexibility
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '6px 0 10px 0' }}>
            SaaS vs 100% White-Label in Your Business
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '640px', margin: '0 auto' }}>
            Choose whether to run your business on Kashi Service subdomains or completely hide our name under your private brand domain.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          style={{
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr 1fr',
              padding: '16px 24px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}
          >
            <span style={{ color: '#94a3b8' }}>CAPABILITY</span>
            <span style={{ color: '#38bdf8' }}>STANDARD SAAS</span>
            <span style={{ color: '#ec4899' }}>100% WHITE-LABEL</span>
          </div>

          {[
            { cap: 'Public Storefront URL', saas: 'riya.kashiservice.com', wl: 'www.riyabeauty.com' },
            { cap: 'Private Admin Dashboard', saas: 'riya.kashiservice.com/admin', wl: 'admin.riyabeauty.com' },
            { cap: 'Platform Branding', saas: 'Powered by Kashi Service', wl: '100% Your Own Logo & Identity' },
            { cap: 'TLS / SSL Encryption', saas: 'Automated Let\'s Encrypt Wildcard', wl: 'Dedicated TLS via CNAME' },
            { cap: 'Customer SMS & Email', saas: 'Kashi Service Gateway', wl: 'Custom Twilio / SendGrid / WhatsApp API' },
            { cap: 'Database Architecture', saas: 'Shared Isolated Collection', wl: 'Separate Dedicated DB Option' },
            { cap: 'Staff GPS Radar Tracking', saas: 'Standard Google Satellite', wl: 'Branded Fleet Radar' },
          ].map((row, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 1fr 1fr',
                padding: '14px 24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                fontSize: '0.82rem',
                background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)',
              }}
            >
              <span style={{ fontWeight: 700, color: '#f1f5f9' }}>{row.cap}</span>
              <span style={{ color: '#cbd5e1' }}>{row.saas}</span>
              <span style={{ fontWeight: 800, color: '#f472b6' }}>{row.wl}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Live Demo Tenancy Explorer ── */}
      <section id="demos" style={{ padding: '4rem 2rem 5rem 2rem', background: '#0a0f1d', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Instant Proof of Concept
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff', margin: '6px 0 0 0' }}>
                Test Live Seeded Tenant Sanctuaries
              </h2>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8', maxWidth: '480px' }}>
              Explore how Blossom Salon and Glamour Academy operate with real appointments, services, staff GPS tracking, and academy students.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {[
              {
                slug: 'blossom-salon',
                name: 'Blossom Luxury Salon & Spa',
                tag: 'High-End Bridal Sanctuary',
                city: 'South Extension, New Delhi',
                badges: ['3 Branches', 'Senior Makeup Staff', 'Hydra-Facial Machine', 'Google Satellite Radar'],
                color: '#ec4899',
              },
              {
                slug: 'glamour-academy',
                name: 'Glamour Cosmetology Academy',
                tag: 'Certified Cosmetology LMS',
                city: 'Cyber City, Gurgaon',
                badges: ['4 Diploma Plans', 'Trainee Students', 'Auto-Certificates', 'Biometric Punch Clock'],
                color: '#6366f1',
              },
              {
                slug: 'serene-spa',
                name: 'Serene Aesthetic Wellness Lounge',
                tag: 'Holistic Spa & Body Therapy',
                city: 'Connaught Place Heritage',
                badges: ['Ayurvedic Therapies', 'VIP Membership Wallets', 'Doorstep Massage Dispatch'],
                color: '#10b981',
              },
            ].map((demo) => (
              <div
                key={demo.slug}
                style={{
                  padding: '24px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: demo.color }}>{demo.tag}</span>
                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      ACTIVE DEMO
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>{demo.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>📍 {demo.city}</div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                    {demo.badges.map((b, bi) => (
                      <span key={bi} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <button
                    onClick={() => handleLaunchDemoTenant(demo.slug)}
                    className="btn btn-secondary"
                    style={{ fontSize: '0.82rem', padding: '8px' }}
                  >
                    View Storefront
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('active_tenant_slug', demo.slug);
                      sessionStorage.setItem('current_tenant_slug', demo.slug);
                      navigate(`/admin/login?tenant=${demo.slug}`);
                    }}
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '8px' }}
                  >
                    Open Admin
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Footer ── */}
      <footer
        style={{
          padding: '2.5rem 2rem',
          background: '#050810',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.85rem',
          color: '#94a3b8',
        }}
      >
        <div
          style={{
            maxWidth: '1360px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, color: '#fff', fontSize: '1rem' }}>
              KASHI <span style={{ color: '#ec4899' }}>SERVICE</span>
            </div>
            <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
              The Sovereign Multi-Tenant Cloud Operating System for Modern Businesses.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <NavLink to="/superadmin/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Super Admin Gateway
            </NavLink>
            <NavLink to="/admin/login" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Salon Admin Portal
            </NavLink>
            <a href="#services" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Services Marketplace
            </a>
          </div>

          <div>
            © 2026 Kashi Service. All rights reserved. Let's Encrypt TLS 1.3 Active.
          </div>
        </div>
      </footer>

      {/* ── Modals ── */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onSelectPlanForOnboarding={(srv, plan) => handleStartOnboarding(srv, plan)}
        />
      )}

      {onboardingService && (
        <TenantOnboardingWizardModal
          service={onboardingService}
          selectedPlan={selectedPlanForWizard}
          onClose={() => setOnboardingService(null)}
          onProvisionSuccess={(data) => {
            setOnboardingService(null);
            setReceiptData(data);
          }}
        />
      )}

      {receiptData && (
        <TenantProvisionedSuccessModal
          receiptData={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}
    </div>
  );
}

