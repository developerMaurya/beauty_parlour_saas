/**
 * @file PlatformHubPage.jsx
 * @description Customer-Facing Public Portal for Kashi Service Ecosystem.
 * - Simple clean website visitor experience for customers
 * - Top Right: Customer Login / Customer Profile Pill (Red Circle Avatar)
 * - Service Cards: Visit Website only (NO Admin/Staff buttons for customers)
 * - Customers cannot access or control Admin/Staff dashboards
 * @module frontend/src/modules/public/pages/PlatformHubPage
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { customer, isAuthenticated, logout } = useCustomer();
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
      id: 'SOFTWARE',
      name: 'RB Software & Tech Hub',
      category: 'Digital Systems & Cloud Solutions',
      tagline: 'High-speed business software, billing POS, web & mobile application platforms.',
      icon: Code2,
      color: '#6366f1',
      bgLight: '#eef2ff',
      websiteRoute: '/software',
      badge: 'Tech Hub',
      features: [
        'Custom Business Software & Cloud Management',
        'Smart Billing POS with GST & UPI Integration',
        'Customer Mobile Apps & Booking Portals',
        'Fast WhatsApp Business Messaging Automations',
        '24/7 Cloud Support & High Security',
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
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              }}
            >
              <Zap size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  KASHI SERVICE
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    textTransform: 'uppercase',
                  }}
                >
                  Services Portal
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
                Beauty Parlour • Event Decor • Plotting • Office/Rent • RB Software
              </div>
            </div>
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

          {/* ── Top Right: Customer Login / Customer Profile Pill with Red Circle Avatar & Settings ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated && customer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {/* Red Circle Customer Badge */}
                <div
                  onClick={() => navigate('/customer/profile')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 12px 4px 6px',
                    borderRadius: '999px',
                    background: '#fef2f2',
                    border: '1.5px solid #fecaca',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.1)',
                  }}
                  title="Customer Profile & Security"
                >
                  {/* Red Circle Avatar */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '13px',
                      boxShadow: '0 2px 6px rgba(220, 38, 38, 0.35)',
                    }}
                  >
                    {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#991b1b', lineHeight: 1.2 }}>
                      {customer?.name || 'Customer'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#dc2626', fontWeight: 600 }}>Profile & Password</div>
                  </div>
                </div>

                {/* Change Password / Settings Link */}
                <button
                  onClick={() => navigate('/customer/security')}
                  style={{
                    padding: '7px 10px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#334155',
                    cursor: 'pointer',
                  }}
                  title="Change Password & Security"
                >
                  Change Password
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  style={{
                    padding: '7px 11px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                  title="Log out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  onClick={() => navigate('/customer/login')}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 800,
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
                  }}
                >
                  <LogIn size={15} />
                  <span>Customer Login</span>
                </button>

                <button
                  onClick={() => navigate('/customer/forgot-password')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 600,
                    border: '1px solid #e2e8f0',
                    background: '#ffffff',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            )}
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
            Explore our businesses below — <strong>Golden Beauty Parlour</strong>, <strong>Event & Decoration</strong>, <strong>Real Estate Plotting</strong>, <strong>Office/Rent Commercial</strong>, and <strong>RB Software Solutions</strong>.
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
