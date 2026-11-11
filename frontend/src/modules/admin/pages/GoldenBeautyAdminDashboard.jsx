/**
 * @file GoldenBeautyAdminDashboard.jsx
 * @description Master Executive Dashboard for Golden Beauty Parlour matching the luxury SaaS layout.
 * Features:
 *   - Dark purple branded sidebar navigation (Dashboard, Website, Appointments, Customers, Staff, Students, Services, Packages, Inventory, Billing, CRM, Offers, Reports, Import/Export, Notifications, Support, Settings, Upgrade)
 *   - Top bar with global search, notifications, messages & Admin profile
 *   - Welcome banner with "Look Beautiful Feel Beautiful" bridal showcase & "View Website" CTA
 *   - 4 Top Metric Cards (Appointments 248, Customers 1,245, Revenue ₹2,48,750, Reviews 4.8/5) with sparklines
 *   - Sales Overview area chart with Last 30 Days filter & active tooltip
 *   - 6 Quick Action tiles (Book Appointment, Add Customer, Add Service, Update Inventory, Create Invoice, Send Notification)
 *   - Bottom row: Top Services progress, Upcoming Appointments status, and SaaS Growth promo card
 * @module frontend/src/modules/admin/pages/GoldenBeautyAdminDashboard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Crown,
  Calendar,
  Users,
  UserCheck,
  GraduationCap,
  Package,
  CreditCard,
  HeartHandshake,
  Tag,
  BarChart3,
  Download,
  Bell,
  Headphones,
  Settings,
  Search,
  MessageSquare,
  Globe,
  ArrowRight,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  Box,
  FileText,
  Send,
  MoreVertical,
  X,
  ExternalLink,
} from 'lucide-react';

export function GoldenBeautyAdminDashboard() {
  const navigate = useNavigate();

  // State for Sales Chart filter
  const [salesRange, setSalesRange] = useState('30_DAYS');
  const [activeTooltip, setActiveTooltip] = useState({ date: 'Oct 28', revenue: '₹1,25,000', visible: true });

  // Quick Action Modals
  const [quickModal, setQuickModal] = useState(null); // 'BOOK_APPT' | 'ADD_CUST' | 'ADD_SERV' | 'INVOICE' | 'NOTIF'
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  // Simple modal submit handler
  const handleModalSubmit = (e, title) => {
    e.preventDefault();
    setModalSuccessMsg(`${title} processed successfully!`);
    setTimeout(() => {
      setQuickModal(null);
      setModalSuccessMsg('');
    }, 1800);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* ── Top Header Bar ── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '340px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Search anything..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
          />
        </div>

        {/* Right Nav Icons & Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Notification with Badge */}
          <div
            onClick={() => navigate('/admin/notifications')}
            style={{ position: 'relative', cursor: 'pointer', padding: 6, borderRadius: '50%', background: '#f8fafc' }}
          >
            <Bell size={19} color="#64748b" />
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 900,
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              3
            </span>
          </div>

          {/* Chat Messages */}
          <div
            onClick={() => navigate('/admin/support')}
            style={{ cursor: 'pointer', padding: 6, borderRadius: '50%', background: '#f8fafc' }}
          >
            <MessageSquare size={19} color="#64748b" />
          </div>

          {/* Admin Avatar & Role */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/profile')}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
              alt="Admin Profile"
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fce7f3' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a', lineHeight: 1.2 }}>
                Admin
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body Content ── */}
      <main style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* 1. Welcome Banner Card with Bridal Model */}
        <div
          style={{
            background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #fae8ff 100%)',
            borderRadius: '20px',
            border: '1px solid #fbcfe8',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(244, 114, 182, 0.1)',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          <div style={{ maxWidth: '560px', zIndex: 2, flex: 1, minWidth: '240px' }}>
            <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 900, color: '#1e1b4b', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Welcome Back, Admin!
            </h1>
            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
              Manage your beauty parlour business easily and grow more customers.
            </p>
            <button
              onClick={() => navigate('/storefront')}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                background: '#7e22ce',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
              }}
            >
              <span>View Website</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Right Bridal Banner Image & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 2 }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.6rem', color: '#4a044e', fontWeight: 700, lineHeight: 1.1 }}>
                Look Beautiful
              </div>
              <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#701a75', fontWeight: 600 }}>
                Feel Beautiful...
              </div>
            </div>
            <img
              src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80"
              alt="Bridal Model"
              style={{
                width: '120px',
                height: '110px',
                objectFit: 'cover',
                borderRadius: '16px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                border: '2px solid #ffffff',
              }}
            />
          </div>
        </div>

        {/* 2. Top 4 KPI Metric Cards with Sparklines */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Total Appointments */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: '#f3e8ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Appointments</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 2 }}>
                  <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>248</span>
                  <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 800 }}>↑ 12%</span>
                </div>
              </div>
            </div>

            {/* Sparkline Wave SVG (Purple) */}
            <svg width="70" height="32" viewBox="0 0 70 32" fill="none">
              <path
                d="M1 28C10 24 15 12 25 18C35 24 45 4 55 10C62 14 65 2 69 4"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M1 28C10 24 15 12 25 18C35 24 45 4 55 10C62 14 65 2 69 4V32H1V28Z"
                fill="#f3e8ff"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Card 2: Total Customers */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Customers</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 2 }}>
                  <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>1,245</span>
                  <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 800 }}>↑ 18%</span>
                </div>
              </div>
            </div>

            {/* Sparkline Wave SVG (Green) */}
            <svg width="70" height="32" viewBox="0 0 70 32" fill="none">
              <path
                d="M1 26C12 20 20 26 30 16C40 6 48 18 58 10C64 4 67 2 69 3"
                stroke="#22c55e"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M1 26C12 20 20 26 30 16C40 6 48 18 58 10C64 4 67 2 69 3V32H1V26Z"
                fill="#dcfce7"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Card 3: Total Revenue */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: '#ffedd5',
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  fontWeight: 900,
                }}
              >
                ₹
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Revenue</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: 2 }}>
                  <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>₹2,48,750</span>
                  <span style={{ fontSize: '11.5px', color: '#16a34a', fontWeight: 800 }}>↑ 22%</span>
                </div>
              </div>
            </div>

            {/* Sparkline Wave SVG (Orange) */}
            <svg width="70" height="32" viewBox="0 0 70 32" fill="none">
              <path
                d="M1 24C10 20 20 10 32 18C42 24 50 8 60 6C65 4 67 2 69 3"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M1 24C10 20 20 10 32 18C42 24 50 8 60 6C65 4 67 2 69 3V32H1V24Z"
                fill="#ffedd5"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Card 4: Reviews */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem 1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: '#fce7f3',
                  color: '#db2777',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={24} fill="#db2777" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Reviews</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 2 }}>
                  <span style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>4.8 / 5</span>
                </div>
                <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Middle Section: Sales Overview Chart (Left 2/3) + Quick Actions (Right 1/3) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)', gap: '1.25rem', alignItems: 'stretch' }}>
          {/* Left: Sales Overview Chart */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={20} color="#7e22ce" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Sales Overview</h3>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Legend */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 600 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7e22ce' }} />
                    <span style={{ color: '#475569' }}>Revenue</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ec4899' }} />
                    <span style={{ color: '#475569' }}>Appointments</span>
                  </div>
                </div>

                {/* Filter */}
                <select
                  value={salesRange}
                  onChange={(e) => setSalesRange(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#334155',
                    outline: 'none',
                    background: '#f8fafc',
                  }}
                >
                  <option value="30_DAYS">Last 30 Days</option>
                  <option value="7_DAYS">Last 7 Days</option>
                  <option value="90_DAYS">Last Quarter</option>
                </select>
              </div>
            </div>

            {/* SVG Wavy Curve Chart Area matching screenshot */}
            <div style={{ position: 'relative', width: '100%', height: '230px', marginTop: '10px' }}>
              {/* Y Axis Grid lines */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                {['200K', '150K', '100K', '50K', '0'].map((label, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', width: '38px', flexShrink: 0 }}>{label}</span>
                    <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
                  </div>
                ))}
              </div>

              {/* Area Chart SVG */}
              <svg width="100%" height="100%" viewBox="0 0 650 200" preserveAspectRatio="none" style={{ position: 'absolute', left: 40, right: 0, top: 0, bottom: 0, width: 'calc(100% - 40px)' }}>
                <defs>
                  {/* Purple Gradient for Revenue */}
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Pink Gradient for Appointments */}
                  <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Pink Curve (Appointments) */}
                <path
                  d="M0 160 C 80 145, 140 170, 200 135 C 260 100, 320 155, 380 90 C 440 145, 500 160, 560 120 C 600 100, 630 130, 650 110"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                />

                {/* Purple Curve (Revenue) */}
                <path
                  d="M0 130 C 80 110, 140 135, 200 105 C 260 80, 320 125, 380 60 C 440 110, 500 125, 560 85 C 600 65, 630 90, 650 70"
                  fill="none"
                  stroke="#7e22ce"
                  strokeWidth="2.5"
                />

                {/* Interactive Tooltip Dot on Oct 28 (x=380, y=60) */}
                <circle cx="380" cy="60" r="5" fill="#7e22ce" stroke="#ffffff" strokeWidth="2" />
                <circle cx="380" cy="90" r="4" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                <line x1="380" y1="20" x2="380" y2="190" stroke="#cbd5e1" strokeDasharray="3 3" />
              </svg>

              {/* Floating Tooltip matching image */}
              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '52%',
                  transform: 'translateX(-50%)',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontWeight: 900, fontSize: '13px', color: '#0f172a' }}>₹1,25,000</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>(Oct 28)</div>
              </div>
            </div>

            {/* X Axis Dates */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '40px', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
              <span>Oct 12</span>
              <span>Oct 16</span>
              <span>Oct 20</span>
              <span>Oct 24</span>
              <span>Oct 28</span>
              <span>Nov 01</span>
              <span>Nov 05</span>
              <span>Nov 10</span>
            </div>
          </div>

          {/* Right: Quick Actions (6 colorful cards matching screenshot) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              <Sparkles size={18} color="#7e22ce" />
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Quick Actions</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {/* 1. Book Appointment */}
              <div
                onClick={() => setQuickModal('BOOK_APPT')}
                style={{
                  background: '#faf5ff',
                  borderRadius: '14px',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #f3e8ff',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>Book Appointment</span>
              </div>

              {/* 2. Add Customer */}
              <div
                onClick={() => setQuickModal('ADD_CUST')}
                style={{
                  background: '#fdf2f8',
                  borderRadius: '14px',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #fce7f3',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fce7f3', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>Add Customer</span>
              </div>

              {/* 3. Add Service */}
              <div
                onClick={() => setQuickModal('ADD_SERV')}
                style={{
                  background: '#f0fdf4',
                  borderRadius: '14px',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #dcfce7',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Scissors size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>Add Service</span>
              </div>

              {/* 4. Update Inventory */}
              <div
                onClick={() => navigate('/admin/parlour-inventory')}
                style={{
                  background: '#eff6ff',
                  borderRadius: '14px',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #dbeafe',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>Update Inventory</span>
              </div>

              {/* 5. Create Invoice */}
              <div
                onClick={() => setQuickModal('INVOICE')}
                style={{
                  background: '#fff7ed',
                  borderRadius: '14px',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #ffedd5',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>Create Invoice</span>
              </div>

              {/* 6. Send Notification */}
              <div
                onClick={() => setQuickModal('NOTIF')}
                style={{
                  background: '#faf5ff',
                  borderRadius: '14px',
                  padding: '1rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #f3e8ff',
                  transition: 'transform 0.15s ease',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3e8ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Send size={18} />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#334155', lineHeight: 1.2 }}>Send Notification</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Row: Top Services (1/3) + Upcoming Appointments (1/3) + Promo Card (1/3) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '1.25rem', alignItems: 'stretch' }}>
          {/* Column 1: Top Services */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: '18px' }}>🏆</span>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Top Services</h3>
                </div>
                <button
                  onClick={() => navigate('/admin/parlour-services')}
                  style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    name: 'Bridal Makeup',
                    bookings: '98 Bookings',
                    pct: 32,
                    img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    name: 'Hair Spa',
                    bookings: '76 Bookings',
                    pct: 24,
                    img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    name: 'Facial Treatment',
                    bookings: '64 Bookings',
                    pct: 21,
                    img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    name: 'Manicure & Pedicure',
                    bookings: '52 Bookings',
                    pct: 17,
                    img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=100&q=80',
                  },
                ].map((s, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={s.img} alt={s.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{s.name}</span>
                          <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 8 }}>{s.bookings}</span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#7e22ce' }}>{s.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: `${s.pct}%`, height: '100%', background: '#7e22ce', borderRadius: '999px' }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Upcoming Appointments */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1px solid #f1f5f9',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={18} color="#7e22ce" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Upcoming Appointments</h3>
                </div>
                <button
                  onClick={() => navigate('/admin/parlour-appointments')}
                  style={{ background: 'none', border: 'none', color: '#7e22ce', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    time: '10:30 AM',
                    day: 'Today',
                    name: 'Priya Sharma',
                    service: 'Bridal Makeup',
                    status: 'Confirmed',
                    statusColor: '#16a34a',
                    statusBg: '#dcfce7',
                    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    time: '12:00 PM',
                    day: 'Today',
                    name: 'Neha Singh',
                    service: 'Hair Spa',
                    status: 'Pending',
                    statusColor: '#0284c7',
                    statusBg: '#e0f2fe',
                    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
                  },
                  {
                    time: '02:00 PM',
                    day: 'Today',
                    name: 'Anjali Verma',
                    service: 'Facial Treatment',
                    status: 'Confirmed',
                    statusColor: '#16a34a',
                    statusBg: '#dcfce7',
                    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80',
                  },
                ].map((a, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: '12px', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ textAlign: 'center', minWidth: '55px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{a.time}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>{a.day}</div>
                      </div>
                      <img src={a.img} alt={a.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{a.name}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{a.service}</div>
                      </div>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: a.statusBg,
                        color: a.statusColor,
                      }}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Grow Your Business SaaS Promo Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%)',
              borderRadius: '20px',
              padding: '1.5rem',
              border: '1.5px solid #fce7f3',
              boxShadow: '0 4px 14px rgba(244, 114, 182, 0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#881337', margin: '0 0 10px', lineHeight: 1.25 }}>
                Grow Your Business with Our Beauty Parlour SaaS
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                  <CheckCircle2 size={15} color="#be123c" />
                  <span>Manage Appointments</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                  <CheckCircle2 size={15} color="#be123c" />
                  <span>Handle Customers</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                  <CheckCircle2 size={15} color="#be123c" />
                  <span>Track Sales & Growth</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/admin/billing')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#7e22ce',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(126, 34, 206, 0.25)',
                }}
              >
                <span>Upgrade Now</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Spa Towel & Pink Orchid Flowers Image matching screenshot */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=350&q=80"
                alt="Spa Treatment"
                style={{
                  width: '130px',
                  height: '75px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ── Quick Action Interactive Modals ── */}
      {quickModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                {quickModal === 'BOOK_APPT' && '📅 Book Appointment'}
                {quickModal === 'ADD_CUST' && '👤 Add New Customer'}
                {quickModal === 'ADD_SERV' && '✂️ Add New Service'}
                {quickModal === 'INVOICE' && '📄 Generate Instant Invoice'}
                {quickModal === 'NOTIF' && '📢 Send Notification'}
              </h3>
              <button onClick={() => setQuickModal(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {modalSuccessMsg ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{modalSuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={(e) => handleModalSubmit(e, quickModal)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {quickModal === 'BOOK_APPT' && (
                  <>
                    <input type="text" required placeholder="Customer Name" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="tel" required placeholder="Phone Number" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
                      <option>Bridal Makeup (₹14,999)</option>
                      <option>Brazilian Keratin Hair Spa (₹4,499)</option>
                      <option>Hydra-Facial Therapy (₹2,799)</option>
                      <option>Ear Locking & Lobe Repair (₹1,499)</option>
                    </select>
                  </>
                )}

                {quickModal === 'ADD_CUST' && (
                  <>
                    <input type="text" required placeholder="Customer Full Name" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="tel" required placeholder="WhatsApp Number" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="text" placeholder="City / Area (e.g. Naibazar, Varanasi)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                  </>
                )}

                {quickModal === 'ADD_SERV' && (
                  <>
                    <input type="text" required placeholder="Service Name (e.g. Royal Gold Facial)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="number" required placeholder="Price (₹)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="text" placeholder="Duration (e.g. 60 mins)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                  </>
                )}

                {quickModal === 'INVOICE' && (
                  <>
                    <input type="text" required placeholder="Client Name or Phone" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="number" required placeholder="Total Amount (₹)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <select style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
                      <option>Payment: UPI / QR Code</option>
                      <option>Payment: Cash</option>
                      <option>Payment: Debit / Credit Card</option>
                    </select>
                  </>
                )}

                {quickModal === 'NOTIF' && (
                  <>
                    <input type="text" required placeholder="Campaign Title (e.g. 20% Off Bridal Makeovers)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <textarea rows={3} placeholder="Message text for WhatsApp & SMS..." style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                  </>
                )}

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="button" onClick={() => setQuickModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Submit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoldenBeautyAdminDashboard;

