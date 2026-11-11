/**
 * @file PlottingDashboard.jsx
 * @description Master Plotting Admin Dashboard for Kashi Plotting Services matching the reference design.
 * Features:
 *   - Top Bar with notifications, messages & Admin profile
 *   - 4 Top KPI Cards (Total Plots: 245, Total Bookings: 128, Total Customers: 3,560, Total Revenue: ₹45,80,000)
 *   - Bookings Overview curve chart (Jan-Jul) + Top Locations progress bars
 *   - Recent Bookings Table (#BK001, #BK002, #BK003) with status badges
 *   - Quick Actions Grid (Add Plot, View Bookings, Manage Customers, View Reports)
 *   - Plot Listings grid (Residential, Commercial, Farmhouse)
 *   - Grow Your Business SaaS Promo Card
 *   - Interactive Add Plot & Booking Modals
 * @module frontend/src/modules/admin/pages/PlottingDashboard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trees,
  Home,
  Building,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  FileText,
  BarChart3,
  Box,
  Send,
  X,
  Bell,
  Search,
  ExternalLink,
  ChevronDown,
  Globe,
} from 'lucide-react';

export default function PlottingDashboard() {
  const navigate = useNavigate();

  // Range filter
  const [dateRange, setDateRange] = useState('30_DAYS');

  // Interactive Modals
  const [modalType, setModalType] = useState(null); // 'ADD_PLOT' | 'BOOKINGS' | 'REPORTS'
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  // Sample Plot Listings
  const [plotListings, setPlotListings] = useState([
    {
      id: 'pl_01',
      title: 'Residential Plot',
      price: '₹15,00,000',
      location: 'Varanasi',
      status: 'Active',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'pl_02',
      title: 'Commercial Plot',
      price: '₹35,00,000',
      location: 'Sarnath',
      status: 'Active',
      img: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'pl_03',
      title: 'Farmhouse Plot',
      price: '₹22,00,000',
      location: 'Bhaisodi',
      status: 'Active',
      img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
    },
  ]);

  // Recent Bookings
  const recentBookings = [
    {
      id: '#BK001',
      customer: 'Rahul Sharma',
      plot: 'Residential Plot',
      amount: '₹15,00,000',
      status: 'Confirmed',
      statusColor: '#16a34a',
      statusBg: '#dcfce7',
      img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: '#BK002',
      customer: 'Priya Singh',
      plot: 'Commercial Plot',
      amount: '₹35,00,000',
      status: 'Pending',
      statusColor: '#ea580c',
      statusBg: '#ffedd5',
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    },
    {
      id: '#BK003',
      customer: 'Amit Kumar',
      plot: 'Farmhouse Plot',
      amount: '₹22,00,000',
      status: 'Confirmed',
      statusColor: '#16a34a',
      statusBg: '#dcfce7',
      img: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    },
  ];

  const handleAddPlotSubmit = (e) => {
    e.preventDefault();
    setModalSuccessMsg('Plot successfully added to inventory!');
    setTimeout(() => {
      setModalType(null);
      setModalSuccessMsg('');
    }, 1800);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* ── Top Header matching screenshot ── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '1rem 1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#064e3b', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Welcome to Kashi Plotting Services Admin Panel
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {/* Last 30 Days Dropdown */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155',
              background: '#f8fafc',
              outline: 'none',
            }}
          >
            <option value="30_DAYS">Last 30 Days</option>
            <option value="7_DAYS">Last 7 Days</option>
            <option value="90_DAYS">Last Quarter</option>
          </select>

          {/* Website Link */}
          <button
            onClick={() => navigate('/plotting')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #a7f3d0',
              background: '#ecfdf5',
              color: '#047857',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <Globe size={13} />
            <span>View Website</span>
          </button>

          {/* Notification with Badge */}
          <div style={{ position: 'relative', cursor: 'pointer', padding: 6, borderRadius: '50%', background: '#f8fafc' }}>
            <Bell size={18} color="#64748b" />
            <span
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                background: '#ef4444',
                color: '#fff',
                fontSize: '10px',
                fontWeight: 900,
                width: 15,
                height: 15,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              3
            </span>
          </div>

          {/* Admin Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
              alt="Admin"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a7f3d0' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '13px', color: '#0f172a', lineHeight: 1.2 }}>Admin</div>
              <div style={{ fontSize: '10.5px', color: '#64748b' }}>Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Body Content ── */}
      <main style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* 1. Top 4 KPI Metric Cards (Matching Screenshot) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          {/* Card 1: Total Plots */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trees size={22} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Plots</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>245</span>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>↑ 12%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Total Bookings */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Bookings</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>128</span>
                  <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 800 }}>↑ 18%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Total Customers */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Customers</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>3,560</span>
                  <span style={{ fontSize: '11px', color: '#ea580c', fontWeight: 800 }}>↑ 10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Total Revenue */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: '#fae8ff', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 900 }}>
                ₹
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>Total Revenue</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 2 }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>₹45,80,000</span>
                  <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 800 }}>↑ 22%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Middle Section: Bookings Overview Chart (Left 2/3) + Top Locations (Right 1/3) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)', gap: '1.25rem', alignItems: 'stretch' }}>
          {/* Left: Bookings Overview Chart */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BarChart3 size={18} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Bookings Overview</h3>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16a34a' }} />
                  <span style={{ color: '#475569' }}>Bookings</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0284c7' }} />
                  <span style={{ color: '#475569' }}>Inquiries</span>
                </div>
              </div>
            </div>

            {/* Area Chart SVG (Jan - Jul) */}
            <div style={{ position: 'relative', width: '100%', height: '220px' }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                {['200', '150', '100', '50', '0'].map((label, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8', width: '32px' }}>{label}</span>
                    <div style={{ flex: 1, height: '1px', background: '#f1f5f9' }} />
                  </div>
                ))}
              </div>

              <svg width="100%" height="100%" viewBox="0 0 600 200" preserveAspectRatio="none" style={{ position: 'absolute', left: 34, right: 0, top: 0, bottom: 0, width: 'calc(100% - 34px)' }}>
                <defs>
                  <linearGradient id="plotGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="plotBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Blue Inquiries Curve */}
                <path
                  d="M0 140 C 90 120, 150 150, 220 110 C 300 80, 360 140, 440 90 C 500 130, 560 110, 600 70"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                />

                {/* Green Bookings Curve */}
                <path
                  d="M0 115 C 90 95, 150 125, 220 80 C 300 50, 360 110, 440 60 C 500 100, 560 85, 600 40"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* X Axis Months */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '34px', marginTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
            </div>
          </div>

          {/* Right: Top Locations (Matching Screenshot) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                <MapPin size={18} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Top Locations</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { name: 'Varanasi', pct: 38, color: '#16a34a' },
                  { name: 'Sarnath', pct: 32, color: '#0284c7' },
                  { name: 'Bhaisodi', pct: 20, color: '#ea580c' },
                  { name: 'Others', pct: 10, color: '#9333ea' },
                ].map((loc, idx) => (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: loc.color }} />
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155' }}>{loc.name}</span>
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>{loc.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '7px', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ width: `${loc.pct}%`, height: '100%', background: loc.color, borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Lower Section: Recent Bookings Table (Left 2/3) + Quick Actions (Right 1/3) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)', gap: '1.25rem', alignItems: 'stretch' }}>
          {/* Left: Recent Bookings Table */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Calendar size={18} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Recent Bookings</h3>
                </div>
                <button
                  onClick={() => setModalType('BOOKINGS')}
                  style={{ background: 'none', border: 'none', color: '#059669', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                      <th style={{ padding: '8px 10px' }}>#</th>
                      <th style={{ padding: '8px 10px' }}>Customer</th>
                      <th style={{ padding: '8px 10px' }}>Plot</th>
                      <th style={{ padding: '8px 10px' }}>Amount</th>
                      <th style={{ padding: '8px 10px' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f8fafc' }}>
                        <td style={{ padding: '10px', fontWeight: 800, color: '#64748b' }}>{b.id}</td>
                        <td style={{ padding: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <img src={b.img} alt={b.customer} style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
                            <span style={{ fontWeight: 800, color: '#0f172a' }}>{b.customer}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px', color: '#475569' }}>{b.plot}</td>
                        <td style={{ padding: '10px', fontWeight: 900, color: '#064e3b' }}>{b.amount}</td>
                        <td style={{ padding: '10px' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 800,
                              background: b.statusBg,
                              color: b.statusColor,
                            }}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: Quick Actions (4 Tiles Matching Screenshot) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
              <TrendingUp size={18} color="#059669" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Quick Actions</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Tile 1: Add Plot */}
              <div
                onClick={() => setModalType('ADD_PLOT')}
                style={{
                  background: '#f0fdf4',
                  borderRadius: '14px',
                  padding: '1.2rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #dcfce7',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Home size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#064e3b' }}>Add Plot</span>
              </div>

              {/* Tile 2: View Bookings */}
              <div
                onClick={() => setModalType('BOOKINGS')}
                style={{
                  background: '#f0f9ff',
                  borderRadius: '14px',
                  padding: '1.2rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #e0f2fe',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1' }}>View Bookings</span>
              </div>

              {/* Tile 3: Manage Customers */}
              <div
                onClick={() => navigate('/admin/plotting-users')}
                style={{
                  background: '#faf5ff',
                  borderRadius: '14px',
                  padding: '1.2rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #f3e8ff',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#7e22ce' }}>Manage Customers</span>
              </div>

              {/* Tile 4: View Reports */}
              <div
                onClick={() => setModalType('REPORTS')}
                style={{
                  background: '#fff7ed',
                  borderRadius: '14px',
                  padding: '1.2rem 0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  border: '1px solid #ffedd5',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={20} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#c2410c' }}>View Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Section: Plot Listings (Left 2/3) + Grow Your Business Promo (Right 1/3) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1.15fr)', gap: '1.25rem', alignItems: 'stretch' }}>
          {/* Left: Plot Listings (Matching Screenshot) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Trees size={18} color="#059669" />
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Plot Listings</h3>
                </div>
                <button
                  onClick={() => navigate('/plotting')}
                  style={{ background: 'none', border: 'none', color: '#059669', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <span>View All</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* 3 Plot Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {plotListings.map((p, idx) => (
                  <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '95px', position: 'relative' }}>
                      <img src={p.img} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{p.title}</div>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#059669', marginTop: 2 }}>{p.price}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{p.location}</span>
                        <span style={{ background: '#dcfce7', color: '#16a34a', fontSize: '10px', fontWeight: 800, padding: '1px 6px', borderRadius: '4px' }}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Grow Your Business Promo Card (Matching Screenshot) */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
              borderRadius: '18px',
              padding: '1.5rem',
              border: '1.5px solid #d1fae5',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#064e3b', margin: '0 0 6px', lineHeight: 1.25 }}>
                Grow Your Business with Ploting Services
              </h3>
              <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                Manage plots, bookings and customers easily with Kashi Service enterprise real estate suite.
              </p>

              <button
                onClick={() => navigate('/admin/billing')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                <span>Upgrade Plan</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Modern Villa with Red Pin Image matching screenshot */}
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"
                alt="Plotted Villa"
                style={{ width: '130px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <div style={{ position: 'absolute', top: -10, right: 20, width: 28, height: 28, borderRadius: '50%', background: '#ef4444', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={16} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Interactive Modals ── */}
      {modalType && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#064e3b' }}>
                {modalType === 'ADD_PLOT' && '🏡 Add New Plot to Inventory'}
                {modalType === 'BOOKINGS' && '📅 Plot Bookings Master List'}
                {modalType === 'REPORTS' && '📊 Plotting Revenue & Sales Report'}
              </h3>
              <button onClick={() => setModalType(null)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {modalSuccessMsg ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px' }} />
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>{modalSuccessMsg}</div>
              </div>
            ) : (
              <div>
                {modalType === 'ADD_PLOT' && (
                  <form onSubmit={handleAddPlotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input type="text" required placeholder="Colony / Project (e.g. Kashi Green Valley)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="text" required placeholder="Plot Title & Number (e.g. Plot B-205)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="number" required placeholder="Price (₹)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <input type="text" placeholder="Dimensions (e.g. 1500 Sq Ft - 30x50)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
                    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                      <button type="button" onClick={() => setModalType(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                      <button type="submit" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Plot</button>
                    </div>
                  </form>
                )}

                {modalType === 'BOOKINGS' && (
                  <div>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '1rem' }}>Showing latest verified plot reservations across Varanasi colonies:</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto' }}>
                      {recentBookings.map((b, i) => (
                        <div key={i} style={{ padding: '10px', borderRadius: '10px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '13px' }}>{b.customer}</div>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>{b.plot} • {b.amount}</div>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: b.statusBg, color: b.statusColor }}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {modalType === 'REPORTS' && (
                  <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <BarChart3 size={44} color="#059669" style={{ margin: '0 auto 10px' }} />
                    <h4 style={{ margin: '0 0 6px', fontWeight: 900 }}>Total Quarterly Revenue: ₹45,80,000</h4>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>128 active plot bookings processed across Varanasi, Sarnath & Bhaisodi corridors.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
