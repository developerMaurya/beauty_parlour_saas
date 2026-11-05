/**
 * @file PlatformDocsPage.jsx
 * @description Comprehensive Platform Documentation, Dashboards Breakdown & Architecture Guide for Kashi Service Ecosystem.
 * Clean, high-contrast white aesthetic providing in-depth details for SaaS buyers, tenants, and developers.
 * @module frontend/src/modules/public/pages/PlatformDocsPage
 */

import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
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
} from 'lucide-react';

export default function PlatformDocsPage() {
  const navigate = useNavigate();
  const [activeDocSection, setActiveDocSection] = useState('DASHBOARDS'); // 'OVERVIEW' | 'DASHBOARDS' | 'VERTICALS' | 'ARCHITECTURE' | 'BUYING_GUIDE'

  return (
    <div
      className="public-layout-light"
      data-theme="light"
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#0f172a',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* ── 1. Top Documentation Header ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
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
          }}
        >
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
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <ArrowLeft size={14} />
              <span>Back to Platform</span>
            </NavLink>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <BookOpen size={18} />
              </div>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                KASHI SERVICE • PLATFORM DOCS & BUYER'S GUIDE
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate('/site/blossom-salon')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#0f172a',
                cursor: 'pointer',
              }}
            >
              💅 Live Parlour Demo
            </button>
            <button
              onClick={() => navigate('/admin/login?tenant=blossom-salon&autologin=true')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                cursor: 'pointer',
              }}
            >
              ⚡ Enter Admin Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* ── 2. Hero Announcement & Filter Navigation Tabs ── */}
      <section
        style={{
          background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '2.5rem 2rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#e0e7ff',
              color: '#3730a3',
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            <Sparkles size={14} color="#4f46e5" />
            <span>Complete Architecture, Dashboards & Feature Specifications</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              margin: '0 0 10px',
            }}
          >
            Everything You Need to Know Before Licensing Kashi Service SaaS
          </h1>
          <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '750px', margin: '0 auto 2rem' }}>
            Explore what each autonomous dashboard provides, how multi-tenant database isolation operates, and how to scale your white-label business.
          </p>

          {/* Section Tabs */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
              background: '#f1f5f9',
              padding: '6px',
              borderRadius: '12px',
              maxWidth: '820px',
              margin: '0 auto',
            }}
          >
            {[
              { id: 'DASHBOARDS', label: '🖥️ 5 Core Dashboards Included' },
              { id: 'VERTICALS', label: '💄 5 Business Verticals' },
              { id: 'ARCHITECTURE', label: '🏗️ Technical Architecture & DB' },
              { id: 'BUYING_GUIDE', label: '💳 Pricing & Buyer\'s Guide' },
            ].map((tab) => {
              const isActive = activeDocSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveDocSection(tab.id)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: isActive ? 800 : 600,
                    border: 'none',
                    background: isActive ? '#ffffff' : 'transparent',
                    color: isActive ? '#0f172a' : '#64748b',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 6px rgba(0, 0, 0, 0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. Content Sections ── */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem 5rem' }}>
        {/* SECTION 1: 5 CORE DASHBOARDS INCLUDED */}
        {activeDocSection === 'DASHBOARDS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                5 Separate Autonomous Dashboards Built Into Every Tenant
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Every licensed business tenant receives five specialized portals crafted for distinct user roles:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  id: 'superadmin',
                  role: 'Platform Owner / Host',
                  title: '1. Super Admin Control Plane (/superadmin)',
                  icon: '👑',
                  badge: 'Full Platform Governance',
                  badgeColor: '#4f46e5',
                  url: '/superadmin/login',
                  features: [
                    'Global Multi-Tenant Registry & Provisioning Wizard',
                    'Database Management (Shared DB vs Isolated Separate MongoDB per Tenant)',
                    'Custom Domain SSL Verification & Status Monitor',
                    'Global Financial MRR, Subscriptions & Automated Invoicing',
                    'System Audit Logs, Access Control & API Key Manager',
                  ],
                },
                {
                  id: 'tenant-admin',
                  role: 'Business Owner / Salon Director',
                  title: '2. Tenant Owner Admin Dashboard (/admin)',
                  icon: '🏢',
                  badge: 'Core Daily Operations',
                  badgeColor: '#be185d',
                  url: '/admin/login?tenant=blossom-salon&autologin=true',
                  features: [
                    'Real-Time Live Staff GPS Radar on Google Satellite Mode',
                    'Appointment Scheduling Calendar & Doorstep Home Dispatch Matrix',
                    'Fast POS Billing with Split Invoicing, GST & Coupon Codes',
                    'Multi-Branch Switching, Shift Rosters & Biometric Punches',
                    'Inventory Stock Auditing & Beautician Commission Payroll',
                  ],
                },
                {
                  id: 'staff-portal',
                  role: 'Beautician / Stylist / Field Agent',
                  title: '3. Specialist & Staff Mobile Radar (/staff)',
                  icon: '✂️',
                  badge: 'Mobile Field Operations',
                  badgeColor: '#059669',
                  url: '/staff/login',
                  features: [
                    'GPS Check-In, Check-Out & Live Status Radar Telemetry',
                    'Daily Assigned Client Appointments & In-Parlour Treatments',
                    'Doorstep Home Visit Route Polyline, Distance & Live ETA Countdown',
                    'Service Completion Checklist & Client Sign-off Protocol',
                    'Personal Tips, Commissions & Weekly Payroll Ledger',
                  ],
                },
                {
                  id: 'student-portal',
                  role: 'Cosmetology Trainee / Student',
                  title: '4. Academy Student Learning Portal (/student)',
                  icon: '🎓',
                  badge: 'Education & LMS',
                  badgeColor: '#7c3aed',
                  url: '/student/login',
                  features: [
                    'Academic Curriculum Syllabus & Lecture Schedule',
                    'Classroom & Practical Clinical Attendance Tracker',
                    'Assignments Submission, Online Theory Exams & Scores',
                    'Fee Installment Payment Ledger & Instant Receipts',
                    'Official Accredited PDF Certificates & 21-Section Transcripts',
                  ],
                },
                {
                  id: 'customer-portal',
                  role: 'Online Guests & Regular Clients',
                  title: '5. Public Web Storefront & Customer Portal',
                  icon: '💄',
                  badge: 'High-Converting Sales Engine',
                  badgeColor: '#ea580c',
                  url: '/site/blossom-salon',
                  features: [
                    'Artisanal Treatment Menu with Duration, Price & Variant Selectors',
                    'Real-Time Specialist Availability & Seamless Slot Booking',
                    'Doorstep Home Service Dispatch vs In-Parlour Sanctuary Picker',
                    'Instant UPI QR Codes, Card Payments & Pay-on-Service Option',
                    'Digital Parlour Pass with Automated SMS & WhatsApp Confirmation',
                  ],
                },
              ].map((d) => (
                <div
                  key={d.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '26px' }}>{d.icon}</span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: `${d.badgeColor}15`,
                          color: d.badgeColor,
                        }}
                      >
                        {d.badge}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                      {d.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, marginBottom: '14px' }}>
                      Role: <strong>{d.role}</strong>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {d.features.map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#334155' }}>
                          <CheckCircle2 size={15} color={d.badgeColor} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate(d.url)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#0f172a',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>Launch & Inspect Dashboard</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2: 5 BUSINESS VERTICALS */}
        {activeDocSection === 'VERTICALS' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                5 Plug-and-Play Business Verticals in One Ecosystem
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Kashi Service is designed with modular domain engines for rapid business adaptation:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  title: '1. Beauty Parlour, Luxury Salon & Academy ERP',
                  icon: '💄',
                  desc: 'Comprehensive multi-branch parlour operating system with satellite GPS staff tracking, cosmetology academy LMS, GST split invoicing, and doorstep service dispatch.',
                  highlights: ['Bridal Makeovers & Airbrush', 'Gold & Hydra Facials', 'Live Staff GPS Radar', 'Biometric Punches'],
                },
                {
                  title: '2. Retail & Education Software SaaS Suites',
                  icon: '💻',
                  desc: 'Turnkey cloud business management suites supporting grocery cloud POS with barcode scanning, computer institute LMS with certificates, repair ticket trackers, and boutique measurement charts.',
                  highlights: ['Grocery Cloud POS', 'Computer Training Institute LMS', 'Electronics Repair IMEI Tracker', 'Boutique Measurement Cards'],
                },
                {
                  title: '3. Event Services & Stage Operations',
                  icon: '🎉',
                  desc: 'End-to-end wedding and destination event management platform with digital QR gate pass verification, artist staging rosters, and equipment ledger.',
                  highlights: ['Instant Gate Pass QR Scanner', 'Equipment AV Ledger', 'Live Budget & Vendor Invoicing', 'Wedding Booking Schedules'],
                },
                {
                  title: '4. Real Estate & Colony Plotting',
                  icon: '🏗️',
                  desc: 'Interactive SVG masterplan plotting system with real-time plot boundary reservations, corner plot premiums, and automatic EMI amortization schedules.',
                  highlights: ['Interactive SVG Masterplans', 'Instant EMI Calculator', 'Plot Hold & Booking Protocols', 'Registry Document Generation'],
                },
                {
                  title: '5. Rental Properties & Asset Leasing',
                  icon: '🔑',
                  desc: 'Commercial and residential property leasing ERP with automatic monthly rent invoice generation, UPI collection bots, and security deposit management.',
                  highlights: ['Digital Lease Agreement Generator', 'Automated WhatsApp Rent Invoices', 'Maintenance Ticket Tracker', 'Security Deposit Audits'],
                },
              ].map((v, i) => (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{v.icon}</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>{v.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, marginBottom: '14px' }}>{v.desc}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {v.highlights.map((h, hi) => (
                      <span
                        key={hi}
                        style={{
                          fontSize: '11.5px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#334155',
                          fontWeight: 600,
                        }}
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: TECHNICAL ARCHITECTURE */}
        {activeDocSection === 'ARCHITECTURE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                Enterprise Cloud Architecture & Data Isolation
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Engineered for 99.99% reliability, instant tenant provisioning, and compliance:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  title: 'Dual Database Strategy',
                  desc: 'Tenants can run on high-density Central Multi-Tenant Shared DB or opt for completely Isolated Dedicated Databases per tenant for banking/medical compliance.',
                  icon: <Database size={24} color="#4f46e5" />,
                },
                {
                  title: 'Automatic Custom Domain SSL',
                  desc: 'Supports custom domains (e.g. BlossomBeauty.com) and subdomains (blossom.kashiservice.com) with automated zero-downtime Let\'s Encrypt SSL certificates.',
                  icon: <Globe size={24} color="#059669" />,
                },
                {
                  title: 'Direct Cloudflare Streaming',
                  desc: 'Integrated direct Cloudflare Images API with memory streaming, eliminating server disk storage bottlenecks for gallery and staff verification photos.',
                  icon: <Server size={24} color="#ea580c" />,
                },
                {
                  title: 'JWT Role-Based Access Control',
                  desc: 'Strict permission boundary separation between Super Admin, Tenant Admin, Staff, Student, and Customer roles with dual refresh tokens and audit logging.',
                  icon: <Lock size={24} color="#7c3aed" />,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.5rem',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ padding: '8px', borderRadius: '8px', background: '#f8fafc', display: 'inline-block', marginBottom: '12px' }}>
                    {item.icon}
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: PRICING & BUYER'S GUIDE */}
        {activeDocSection === 'BUYING_GUIDE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                Transparent Pricing, Licensing & How to Buy
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.95rem', margin: 0 }}>
                Every plan includes 14-day free trial, free SSL, automatic updates, and zero lock-in:
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[
                {
                  name: 'Starter Business Plan',
                  price: '₹1,999/month',
                  badge: 'Single Location / Studio',
                  desc: 'Perfect for boutique parlours or single stores launching their online appointment & billing system.',
                  features: ['1 Branch Location', 'Up to 5 Staff Members', 'Online Storefront & Booking Engine', 'GST Billing & POS', 'Free Subdomain + SSL'],
                },
                {
                  name: 'Multi-Branch Pro Chain',
                  price: '₹4,999/month',
                  badge: 'Most Popular for Parlour Chains',
                  popular: true,
                  desc: 'Full multi-location control with real-time GPS staff tracking radar, custom domain, and WhatsApp reminders.',
                  features: ['Up to 5 Branch Locations', 'Unlimited Staff & Doorstep Dispatch', 'Live Google Satellite Staff GPS Radar', 'Custom Domain (YourBrand.com)', 'Automated WhatsApp & SMS Alerts', 'Inventory Stock Auditing'],
                },
                {
                  name: 'White-Label Enterprise & LMS',
                  price: '₹9,999/month',
                  badge: 'Academy & Large Franchises',
                  desc: 'Ultimate white-label solution with dedicated isolated database, Cosmetology Academy LMS, and priority SLA.',
                  features: ['Unlimited Branches & Locations', 'Dedicated Isolated Database Option', 'Full Cosmetology Academy LMS', 'Automated PDF Diplomas & Transcripts', '24/7 Dedicated Support & SLA', 'Source Code License Available'],
                },
              ].map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: p.popular ? '#fff1f2' : '#ffffff',
                    border: p.popular ? '2px solid #be185d' : '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    boxShadow: p.popular ? '0 8px 24px rgba(190, 24, 93, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: p.popular ? '#be185d' : '#4f46e5', textTransform: 'uppercase' }}>
                      {p.badge}
                    </span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>{p.name}</h3>
                    <div style={{ fontSize: '1.65rem', fontWeight: 900, color: p.popular ? '#be185d' : '#0f172a', margin: '8px 0 12px' }}>
                      {p.price}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>{p.desc}</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {p.features.map((f, fi) => (
                        <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                          <CheckCircle2 size={14} color={p.popular ? '#be185d' : '#059669'} style={{ flexShrink: 0 }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => navigate('/admin/login?tenant=blossom-salon&autologin=true')}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      border: 'none',
                      background: p.popular ? '#be185d' : '#0f172a',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Start 14-Day Free Trial
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

