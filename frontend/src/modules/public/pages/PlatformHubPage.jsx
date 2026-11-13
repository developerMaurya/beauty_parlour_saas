import GlobalCustomerHeaderPill from '../../../components/common/GlobalCustomerHeaderPill.jsx';
/**
 * @file PlatformHubPage.jsx
 * @description Customer-Facing Public Portal for Kashi Service Ecosystem.
 * - Simple clean website visitor experience for customers
 * - Top Right: Customer Login / Customer Profile Pill (Red Circle Avatar)
 * - Service Cards: Visit Website only (NO Admin/Staff buttons for customers)
 * - Customers cannot access or control Admin/Staff dashboards
 * @module frontend/src/modules/public/pages/PlatformHubPage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Scissors,
  PartyPopper,
  Compass,
  Key,
  Code2,
  Camera,
  Video,
  Film,
  Zap,
  LogIn,
  LogOut,
  User,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useCustomer } from '@/context/CustomerContext.jsx';
import EventServicesView from '@/modules/events/EventServicesView.jsx';
import PlottingServicesView from '@/modules/plotting/PlottingServicesView.jsx';
import RentServicesView from '@/modules/rent/RentServicesView.jsx';
import SoftwareServicesView from '@/modules/software/SoftwareServicesView.jsx';
import BeautyParlourModuleHub from '@/modules/beauty-parlour/BeautyParlourModuleHub.jsx';

export default function PlatformHubPage() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, logout, openAuthModal } = useCustomer();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    if (searchParams.get('auth') === 'login' || searchParams.get('auth') === 'register') {
      openAuthModal();
    }
  }, [searchParams]);
  const [activeVerticalTab, setActiveVerticalTab] = useState('ALL');

  const businessCards = [
    {
      id: 'BEAUTY',
      name: 'Golden Beauty Parlour & Salon',
      category: 'Luxury Salon & Beauty Academy',
      tagline: 'Bridal makeovers, hair styling, skin aesthetics & doorstep home treatments.',
      icon: Scissors,
      color: '#ec4899',
      bgLight: '#fdf2f8',
      websiteRoute: '/storefront',
      badge: 'Open Now',
      features: [
        'Bridal & Pre-Bridal Luxury Makeovers',
        'Advanced Hair Spa, Styling & Keratin Treatment',
        'Skin Aesthetics, Facials & Glow Therapies',
        'Certified Beauty Training Academy Courses',
        'Verified Doorstep Home Services',
      ],
    },
    {
      id: 'EVENTS',
      name: 'Jay Gurudev Event & Management',
      category: 'Aadiyogi Stage Decor, Banquets & Royal Weddings',
      tagline: 'Har Pal Ko Banayein Khaas... Aadiyogi Theme Stage + Royal Bridal Entry in one grand package.',
      icon: PartyPopper,
      color: '#eab308',
      bgLight: '#fefce8',
      websiteRoute: '/events',
      badge: 'Wedding Special Package',
      features: [
        '🔱 Aadiyogi Theme Wedding Stage (Mahadev + Nandi + Trishul)',
        '🌸 Royal Bridal Entry (15ft Illuminated Flower Arch Tunnel)',
        '☁️ Heavy Dry Ice Fog Effect (1st Entry + Stage Vimal Cloud)',
        '✨ Special Entry Cracker Effect (Safe Cold Pyro Fireworks)',
        '🌺 Real Fresh & Luxury Artificial Flower Decorations',
        '📞 Direct Booking: 76519 72973 • Bhaisodi, Sarnath, Varanasi',
      ],
    },
    {
      id: 'PLOTTING',
      name: 'Real Estate Plotting & Colonies',
      category: 'Residential Townships & Plots',
      tagline: 'Prime residential land plots, colony layouts, transparent registry & easy EMI.',
      icon: Compass,
      color: '#059669',
      bgLight: '#ecfdf5',
      websiteRoute: '/plotting',
      badge: 'RERA Approved',
      features: [
        'Interactive Colony Layout & Dimension Plans',
        'Available Plots with Instant Dimension Details',
        'Easy 12-60 Months Customer EMI Calculator',
        'Immediate Registry & Clear Legal Title',
        'Expressway & Highway Connected Locations',
      ],
    },
    {
      id: 'RENT',
      name: 'Office & Commercial Rent',
      category: 'Corporate Leases & Showrooms',
      tagline: 'Furnished office suites, co-working spaces, prime retail shops & commercial premises.',
      icon: Key,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      websiteRoute: '/rent',
      badge: 'Spaces Ready',
      features: [
        'Furnished Corporate Office & Private Cabins',
        'Ground Floor High-Footfall Retail Showrooms',
        'Digital Lease Agreements & Clear Documentation',
        'Automated Monthly Rent Receipts & WhatsApp Alerts',
        'Ample Customer Parking & 24/7 Security',
      ],
    },
    {
      id: 'PHOTOGRAPHY',
      name: 'RB Photography & 4K Cinema Studio',
      category: 'Sony FX3 Cinema Rigs, Drone Filming & Weddings',
      tagline: 'Full-frame Sony FX3 & A7 IV cinema cameras, DJI Mavic 3 Pro 5.1K aerial drones, royal wedding candids & live streaming.',
      icon: Camera,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      websiteRoute: '/photography',
      badge: 'Sony Cinema & Drone',
      features: [
        '🎥 Sony FX3 4K 120fps Hollywood S-Cinetone Wedding Films',
        '📸 Royal Wedding, Candid & Pre-Wedding Couple Shoots',
        '🚁 DJI Mavic 3 Pro Hasselblad 5.1K Aerial Drone Cinematography',
        '📺 Multi-Camera YouTube / Facebook Live Stream Broadcast',
        '📖 Handcrafted Italian Silk & Leatherette 40-Page Photobooks',
        '⚡ Same-Day 24-Hour Viral Instagram Reels & Shorts Pack',
      ],
    },
    {
      id: 'SOFTWARE',
      name: 'RB Software & Tech Hub',
      category: 'Enterprise Cloud SaaS, Billing ERP & Mobile Apps',
      tagline: 'High-speed business software, OmniPOS billing with thermal print & dynamic UPI QR, web & mobile platforms.',
      icon: Code2,
      color: '#6366f1',
      bgLight: '#eef2ff',
      websiteRoute: '/software',
      badge: 'Next-Gen Tech',
      features: [
        'Custom Business Software & Cloud Multi-Tenant Architecture',
        'OmniPOS Smart Thermal Billing POS with GST & Dynamic UPI QR',
        'Customer Mobile Booking Apps (iOS & Android Native)',
        'Official Meta WhatsApp Business Cloud Messaging Automations',
        '24/7 Cloud Cluster Monitoring & 99.98% Guaranteed SLA',
      ],
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── 1. Clean Customer Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.98)',
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
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', cursor: 'pointer' }}
            onClick={() => {
              setActiveVerticalTab('ALL');
              navigate('/');
            }}
          >
            <img
              src="/kashi-logo.png"
              alt="Kashi Service Logo"
              style={{
                height: '46px',
                width: 'auto',
                maxWidth: '180px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 9px',
                borderRadius: '999px',
                background: '#eff6ff',
                color: '#2563eb',
                border: '1px solid #bfdbfe',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Services Portal
            </span>
          </div>

          {/* Navigation Links: Clean About, Contact, Services, Gallery & Academy */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              Home
            </button>
            <button
              onClick={() => navigate('/services')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Services
            </button>
            <button
              onClick={() => navigate('/gallery')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Portfolio & Gallery
            </button>
            <button
              onClick={() => navigate('/about')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              About
            </button>
            <button
              onClick={() => navigate('/contact')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Contact
            </button>
            <button
              onClick={() => navigate('/academy')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Academy
            </button>
          </nav>

          {/* ── Top Right: Global Universal Customer Header Pill ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <GlobalCustomerHeaderPill theme="light" />
          </div>
        </div>
      </header>

      {/* ── 2. Simple High-Impact Kashi Service Banner ── */}
      <section
        style={{
          padding: '3rem 2rem 2.5rem',
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid #f1f5f9',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              fontSize: '12px',
              fontWeight: 700,
              color: '#1d4ed8',
              marginBottom: '1.25rem',
            }}
          >
            <Sparkles size={15} color="#2563eb" />
            <span>Kashi Service Multi-Business Hub</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.2,
              letterSpacing: '-0.03em',
              color: '#0f172a',
              marginBottom: '1rem',
            }}
          >
            Welcome to{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Kashi Service
            </span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '750px',
              margin: '0 auto',
            }}
          >
            Explore our 6 premier business verticals below — <strong>Golden Beauty Parlour</strong>, <strong>Event & Decoration</strong>, <strong>Real Estate Plotting</strong>, <strong>Office & Commercial Rent</strong>, <strong>RB Photography & 4K Cinema Studio</strong>, and <strong>RB Software Solutions</strong>.
          </p>
        </div>
      </section>

      {/* ── 3. Business Verticals & Customer Cards ── */}
      <section
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2.5rem 2rem 3.5rem',
          width: '100%',
        }}
      >
        {/* Business Cards Grid (Visit Website Only) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {businessCards.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = b.color;
                  e.currentTarget.style.boxShadow = `0 8px 24px ${b.color}20`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        background: b.bgLight,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: b.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        background: b.bgLight,
                        color: b.color,
                      }}
                    >
                      {b.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    {b.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: b.color, marginBottom: '8px' }}>
                    {b.category}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {b.tagline}
                  </p>

                  {/* Features list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                    {b.features.map((feat, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                        <CheckCircle2 size={15} color={b.color} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Single Clean Action: Visit Website (Customer-Safe) */}
                <div style={{ paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => {
                      if (b.websiteRoute) {
                        navigate(b.websiteRoute);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      border: 'none',
                      background: b.color,
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: `0 4px 14px ${b.color}35`,
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <ExternalLink size={16} />
                    <span>Visit Website</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
