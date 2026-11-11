/**
 * @file RentOfficeDashboard.jsx
 * @description Master Commercial Office & Godam Rent Admin Panel
 * Matches exact UI/UX from reference screenshot (media_1794375531019_3e619ed7.jpg):
 * - Top Navigation: Hamburger, Project Selector ('All Projects ▾'), Notifications (3), Super Admin Profile
 * - Header: 'Dashboard - Welcome back, Super Admin!', Date Filter ('Last 30 Days ▾')
 * - 4 Metric Cards: Total Projects (4 / 1 Complex), Total Plots/Spaces (240 / 3 Floors), Total Bookings (86), Total Customers (1,250)
 * - Booking Overview Wave Chart (Jan - Jun) with Bookings & Enquiries toggles
 * - Plot / Space Status Donut Chart (Available 45%, Booked 35%, Sold/Leased 20%)
 * - Recent Bookings Table (#1001 Rahul Sharma, #1002 Priya Singh, #1003 Amit Kumar, #1004 Neha Gupta)
 * - Quick Actions: + Add Project, + Add Plot/Space, 📅 View Bookings, 👥 Manage Users
 * - Upcoming Activities & 'Grow Your Business' commercial card
 * - Built specifically for the user's single commercial property with 3 available floors:
 *   1. Ground Floor: Godown / Logistics (2,200 sq.ft, ₹35,000/mo)
 *   2. 1st Floor: Commercial Corporate Office (1,800 sq.ft, ₹28,000/mo)
 *   3. 2nd Floor: Executive Suite / IT Studio (1,600 sq.ft, ₹24,000/mo)
 *   + Whole Building Combo Lease (5,600 sq.ft, ₹78,000/mo)
 * @module frontend/src/modules/admin/pages/RentOfficeDashboard
 */

import React, { useState } from 'react';
import {
  Building2,
  Layers,
  Calendar,
  Users,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  Plus,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Building,
  Eye,
  FileText,
  DollarSign,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RentOfficeDashboard() {
  const navigate = useNavigate();

  // Active Dropdowns & Filters
  const [selectedProject, setSelectedProject] = useState('All Projects (1 Complex - 3 Floors)');
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);

  // Modals state
  const [addSpaceModalOpen, setAddSpaceModalOpen] = useState(false);
  const [viewBookingsModalOpen, setViewBookingsModalOpen] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState('ALL');

  // Chart hover state
  const [hoveredMonth, setHoveredMonth] = useState('May');

  // Floor / Space Details (User's 1 Property with 3 Floors)
  const floorSpaces = [
    {
      id: 'GF-01',
      floor: 'Ground Floor',
      title: 'Heavy Logistics Godown & Warehouse',
      area: '2,200 Sq.Ft',
      rent: '₹35,000/mo',
      deposit: '₹1,00,000',
      status: 'Available',
      specs: '18ft High Ceiling • Direct 20ft Shutter • 3-Phase 25kW Power • Forklift & Truck Bay',
      color: '#10b981',
      tenant: 'Ready to Move',
    },
    {
      id: 'FF-01',
      floor: '1st Floor',
      title: 'Furnished Corporate Commercial Office',
      area: '1,800 Sq.Ft',
      rent: '₹28,000/mo',
      deposit: '₹85,000',
      status: 'Under Negotiation',
      specs: '2 Executive Cabins • 24 Workstations • Conference Room • Server Room • High-Speed LAN',
      color: '#f59e0b',
      tenant: 'Inspection Scheduled',
    },
    {
      id: 'SF-01',
      floor: '2nd Floor',
      title: 'Executive Suite & Creative IT Studio',
      area: '1,600 Sq.Ft',
      rent: '₹24,000/mo',
      deposit: '₹70,000',
      status: 'Available',
      specs: 'Open Creative Hall • Private Director Suite • Modern Pantry • Terrace Access • High Natural Light',
      color: '#3b82f6',
      tenant: 'Available for Immediate Lease',
    },
    {
      id: 'ALL-BLD',
      floor: 'Full Complex',
      title: 'Complete Commercial Building (G+1+2)',
      area: '5,600 Sq.Ft',
      rent: '₹78,000/mo',
      deposit: '₹2,50,000',
      status: 'Combo Lease Option',
      specs: 'Exclusive Road Frontage • Dedicated Lift & Stairwell • 50kW Dual Power Backup • 15+ Car Parking',
      color: '#8b5cf6',
      tenant: 'Best for Banks, MNCs, Hospitals, IT HQ',
    },
  ];

  // Recent Bookings Data matching the table in the screenshot
  const [recentBookings, setRecentBookings] = useState([
    {
      id: '#1001',
      customer: 'Rahul Sharma',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      project: 'Green Valley',
      floorName: 'Ground Floor Godown',
      plotNo: 'P-12',
      date: '20-06-2026',
      status: 'Confirmed',
      amount: '₹35,000/mo',
    },
    {
      id: '#1002',
      customer: 'Priya Singh',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      project: 'Business Hub',
      floorName: '1st Floor Office',
      plotNo: 'C-05',
      date: '19-06-2026',
      status: 'Pending',
      amount: '₹28,000/mo',
    },
    {
      id: '#1003',
      customer: 'Amit Kumar',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      project: 'Royal Residency',
      floorName: '2nd Floor IT Suite',
      plotNo: 'P-23',
      date: '18-06-2026',
      status: 'Confirmed',
      amount: '₹24,000/mo',
    },
    {
      id: '#1004',
      customer: 'Neha Gupta',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      project: 'City Square',
      floorName: 'Full Building Combo',
      plotNo: 'C-17',
      date: '17-06-2026',
      status: 'Cancelled',
      amount: '₹78,000/mo',
    },
  ]);

  // Upcoming Activities
  const upcomingActivities = [
    {
      title: 'Site Visit - Ground Floor Godown',
      time: '21 Jun 2026, 10:00 AM',
      color: '#3b82f6',
      client: 'Varanasi Logistics Corp',
    },
    {
      title: 'Payment Received - ₹35,000',
      time: '20 Jun 2026, 04:30 PM',
      color: '#10b981',
      client: 'Security Deposit Cleared',
    },
    {
      title: 'New Enquiry - Business Hub 1st Floor Office',
      time: '20 Jun 2026, 02:15 PM',
      color: '#f59e0b',
      client: 'TechVibe Software Solutions',
    },
  ];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '0 0 2.5rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BAR (Matches Right Side Header in Screenshot)
         ══════════════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        {/* Left: Project Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#334155',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '18px' }}>
              <span style={{ height: '2px', background: '#334155', borderRadius: '2px' }}></span>
              <span style={{ height: '2px', background: '#334155', borderRadius: '2px' }}></span>
              <span style={{ height: '2px', background: '#334155', borderRadius: '2px' }}></span>
            </div>
          </button>

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#f1f5f9',
                border: '1px solid #cbd5e1',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#1e293b',
                cursor: 'pointer',
              }}
            >
              <span>{selectedProject}</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {projectDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '6px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  width: '320px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {[
                  'All Projects (1 Complex - 3 Floors)',
                  'Ground Floor - Logistics Godown (2,200 sq.ft)',
                  '1st Floor - Commercial Office (1,800 sq.ft)',
                  '2nd Floor - Executive IT Studio (1,600 sq.ft)',
                  'Full Building Commercial Lease (5,600 sq.ft)',
                ].map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    onClick={() => {
                      setSelectedProject(proj);
                      setProjectDropdownOpen(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: selectedProject === proj ? 700 : 500,
                      color: selectedProject === proj ? '#1e3a8a' : '#334155',
                      background: selectedProject === proj ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {proj}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Notifications & Super Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#475569',
              }}
            >
              <Bell size={17} />
            </div>
            <span
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff',
              }}
            >
              3
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
              alt="Admin"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #facc15',
              }}
            />
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }}>
                Admin
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
                Super Admin
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. PAGE SUBHEADER & DATE FILTER
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
            Welcome back, Super Admin! Managing Kashi Commercial Complex (3 Leasable Floors).
          </p>
        </div>

        {/* Right Date Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <span>{selectedRange}</span>
            <ChevronDown size={14} color="#64748b" />
          </button>

          {rangeDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '6px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                width: '160px',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              {['Today', 'Last 7 Days', 'Last 30 Days', 'This Quarter', 'Year 2026'].map((r, rIdx) => (
                <div
                  key={rIdx}
                  onClick={() => {
                    setSelectedRange(r);
                    setRangeDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: selectedRange === r ? 700 : 500,
                    color: selectedRange === r ? '#2563eb' : '#334155',
                    background: selectedRange === r ? '#eff6ff' : '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. 4 KPI METRIC CARDS (Matches Screenshot Grid)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Total Projects */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
              }}
            >
              <Building size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              Total Projects
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                4
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                +12% ↑
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
              1 Master Complex (3 Floors Ready)
            </div>
          </div>
        </div>

        {/* Card 2: Total Plots / Units */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16a34a',
              }}
            >
              <Layers size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              Total Plots / Units
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                240
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                +8% ↑
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
              3 Leasable Floors (5,600 sq.ft Total)
            </div>
          </div>
        </div>

        {/* Card 3: Total Bookings */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#f3e8ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9333ea',
              }}
            >
              <Calendar size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              Total Bookings
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                86
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                +15% ↑
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
              Commercial leases & inspections
            </div>
          </div>
        </div>

        {/* Card 4: Total Customers */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            padding: '1.35rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
              }}
            >
              <Users size={22} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
              Total Customers
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>
                1,250
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                +18% ↑
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>
              Corporate clients & lessees
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          4. MIDDLE SECTION: BOOKING OVERVIEW (WAVE CHART) & PLOT STATUS (DONUT)
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.25rem' }}>
        
        {/* Left: Booking Overview Smooth Curve Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Booking Overview
            </h3>

            {/* Legend Toggles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></span>
                <span>Bookings</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a855f7' }}></span>
                <span>Enquiries</span>
              </div>
            </div>
          </div>

          {/* SVG Smooth Wave Chart (Jan - Jun) */}
          <div style={{ width: '100%', position: 'relative', height: '220px' }}>
            <svg
              viewBox="0 0 600 200"
              style={{ width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="blueWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="purpleWaveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="30" y1="20" x2="580" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="65" x2="580" y2="65" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="110" x2="580" y2="110" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="155" x2="580" y2="155" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="30" y1="180" x2="580" y2="180" stroke="#e2e8f0" strokeWidth="1" />

              {/* Y Axis Values */}
              <text x="5" y="24" fontSize="10" fill="#94a3b8" fontWeight="600">100</text>
              <text x="5" y="69" fontSize="10" fill="#94a3b8" fontWeight="600">75</text>
              <text x="5" y="114" fontSize="10" fill="#94a3b8" fontWeight="600">50</text>
              <text x="5" y="159" fontSize="10" fill="#94a3b8" fontWeight="600">25</text>
              <text x="15" y="184" fontSize="10" fill="#94a3b8" fontWeight="600">0</text>

              {/* Shaded Area for Blue Curve */}
              <path
                d="M 50 140 C 140 120, 200 100, 270 95 C 340 90, 420 85, 490 60 C 530 45, 560 35, 570 30 L 570 180 L 50 180 Z"
                fill="url(#blueWaveGrad)"
              />

              {/* Blue Curve (Bookings) */}
              <path
                d="M 50 140 C 140 120, 200 100, 270 95 C 340 90, 420 85, 490 60 C 530 45, 560 35, 570 30"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Blue Points */}
              {[[50, 140], [150, 122], [270, 95], [370, 90], [490, 60], [570, 30]].map(([px, py], i) => (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r="5"
                  fill="#ffffff"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  style={{ cursor: 'pointer' }}
                />
              ))}

              {/* Shaded Area for Purple Curve (Enquiries) */}
              <path
                d="M 50 160 C 140 150, 200 135, 270 125 C 340 120, 420 105, 490 90 C 530 80, 560 70, 570 65 L 570 180 L 50 180 Z"
                fill="url(#purpleWaveGrad)"
              />

              {/* Purple Curve (Enquiries) */}
              <path
                d="M 50 160 C 140 150, 200 135, 270 125 C 340 120, 420 105, 490 90 C 530 80, 560 70, 570 65"
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="4 2"
              />

              {/* Purple Points */}
              {[[50, 160], [150, 148], [270, 125], [370, 118], [490, 90], [570, 65]].map(([px, py], i) => (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r="4"
                  fill="#ffffff"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  style={{ cursor: 'pointer' }}
                />
              ))}

              {/* X Axis Months */}
              <text x="45" y="196" fontSize="11" fill="#64748b" fontWeight="600">Jan</text>
              <text x="145" y="196" fontSize="11" fill="#64748b" fontWeight="600">Feb</text>
              <text x="260" y="196" fontSize="11" fill="#64748b" fontWeight="600">Mar</text>
              <text x="360" y="196" fontSize="11" fill="#64748b" fontWeight="600">Apr</text>
              <text x="480" y="196" fontSize="11" fill="#64748b" fontWeight="600">May</text>
              <text x="560" y="196" fontSize="11" fill="#64748b" fontWeight="600">Jun</text>
            </svg>
          </div>
        </div>

        {/* Right: Plot Status Donut Chart */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            Plot Status
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flex: 1 }}>
            {/* Donut SVG */}
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
              <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                {/* Available 45% (Green) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="18"
                  strokeDasharray="107 239"
                  strokeDashoffset="0"
                />
                {/* Booked 35% (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="18"
                  strokeDasharray="83 239"
                  strokeDashoffset="-107"
                />
                {/* Sold / Leased 20% (Orange) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="18"
                  strokeDasharray="48 239"
                  strokeDashoffset="-190"
                />
              </svg>

              {/* Center Text inside Donut */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                  240
                </div>
                <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total
                </div>
              </div>
            </div>

            {/* Legend Labels on Right */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }}></span>
                <span style={{ color: '#475569', fontWeight: 600 }}>Available</span>
                <span style={{ fontWeight: 800, color: '#0f172a', marginLeft: 'auto' }}>45%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }}></span>
                <span style={{ color: '#475569', fontWeight: 600 }}>Booked</span>
                <span style={{ fontWeight: 800, color: '#0f172a', marginLeft: 'auto' }}>35%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316', flexShrink: 0 }}></span>
                <span style={{ color: '#475569', fontWeight: 600 }}>Sold</span>
                <span style={{ fontWeight: 800, color: '#0f172a', marginLeft: 'auto' }}>20%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. BOTTOM SECTION: RECENT BOOKINGS TABLE & QUICK ACTIONS
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.25rem' }}>
        
        {/* Left: Recent Bookings Table */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Recent Bookings
            </h3>
            <button
              onClick={() => setViewBookingsModalOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>View All</span>
              <span>→</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                  <th style={{ padding: '8px 10px', width: '60px' }}>#</th>
                  <th style={{ padding: '8px 10px' }}>Customer</th>
                  <th style={{ padding: '8px 10px' }}>Project / Floor</th>
                  <th style={{ padding: '8px 10px' }}>Plot / Unit</th>
                  <th style={{ padding: '8px 10px' }}>Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 10px', fontWeight: 600, color: '#64748b' }}>
                      {b.id}
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img
                          src={b.avatar}
                          alt={b.customer}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>{b.customer}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#475569' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{b.project}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{b.floorName}</div>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: 700, color: '#0f172a' }}>
                      {b.plotNo}
                    </td>
                    <td style={{ padding: '12px 10px', color: '#64748b' }}>
                      {b.date}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background:
                            b.status === 'Confirmed'
                              ? '#dcfce7'
                              : b.status === 'Pending'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            b.status === 'Confirmed'
                              ? '#15803d'
                              : b.status === 'Pending'
                              ? '#b45309'
                              : '#b91c1c',
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

        {/* Right: Quick Actions */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h3 style={{ margin: '0 0 1.2rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            Quick Actions
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', flex: 1 }}>
            
            {/* + Add Project */}
            <button
              onClick={() => setAddSpaceModalOpen(true)}
              style={{
                background: '#eff6ff',
                border: '1px solid #dbeafe',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#dbeafe')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#eff6ff')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Plus size={20} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1e3a8a' }}>
                + Add Project
              </span>
            </button>

            {/* + Add Plot / Space */}
            <button
              onClick={() => setAddSpaceModalOpen(true)}
              style={{
                background: '#f0fdf4',
                border: '1px solid #dcfce7',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#dcfce7')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f0fdf4')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Layers size={20} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#14532d' }}>
                + Add Plot / Space
              </span>
            </button>

            {/* View Bookings */}
            <button
              onClick={() => setViewBookingsModalOpen(true)}
              style={{
                background: '#faf5ff',
                border: '1px solid #f3e8ff',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f3e8ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#faf5ff')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#a855f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Calendar size={18} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#581c87' }}>
                View Bookings
              </span>
            </button>

            {/* Manage Users */}
            <button
              onClick={() => navigate('/admin/rent-tenants')}
              style={{
                background: '#fff7ed',
                border: '1px solid #ffedd5',
                borderRadius: '12px',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#ffedd5')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff7ed')}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: '#f97316',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Users size={18} />
              </div>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#7c2d12' }}>
                Manage Users
              </span>
            </button>

          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. LOWER ROW: UPCOMING ACTIVITIES & GROW YOUR BUSINESS CARD
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '0 2rem', display: 'grid', gridTemplateColumns: '1.2fr 1.6fr', gap: '1.25rem' }}>
        
        {/* Upcoming Activities */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Upcoming Activities
            </h3>
            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: '#2563eb',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              View All →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingActivities.map((act, aIdx) => (
              <div
                key={aIdx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}
              >
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: act.color,
                    marginTop: '5px',
                    flexShrink: 0,
                  }}
                ></span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                    {act.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px' }}>
                    {act.time} • <span style={{ color: '#0284c7', fontWeight: 600 }}>{act.client}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grow Your Business with Prime Plots Promo Card (Matches Image Exactly) */}
        <div
          style={{
            borderRadius: '16px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '1.75rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            backgroundImage: `linear-gradient(to top, rgba(13, 27, 42, 0.95) 0%, rgba(13, 27, 42, 0.55) 60%, rgba(0,0,0,0.2) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#ffffff',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ fontSize: '0.8rem', color: '#facc15', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Commercial Growth
            </div>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.4rem', fontWeight: 900, color: '#ffffff' }}>
              Grow Your Business with Prime Plots
            </h3>
            <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: '#cbd5e1', maxWidth: '420px' }}>
              One master commercial property at Sathwa Road, Sarnath. 3 floors tailored for logistics godowns, corporate offices, and tech studios.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate('/rent')}
                style={{
                  background: '#facc15',
                  color: '#0f172a',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(250, 204, 21, 0.3)',
                }}
              >
                <span>View Live Website</span>
                <ArrowUpRight size={16} />
              </button>

              <button
                onClick={() => setAddSpaceModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  padding: '9px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                Manage 3 Floors →
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. DEDICATED 3-FLOOR LEASE OVERVIEW STRIP
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '1.5rem 2rem 0' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e2e8f0',
            padding: '1.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                Single Property Floor Configuration (Naibazar, Sathwa Road)
              </h3>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                Exact status of all 3 available commercial floors & full building lease option.
              </p>
            </div>

            <button
              onClick={() => setAddSpaceModalOpen(true)}
              style={{
                background: '#0d1b2a',
                color: '#facc15',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={15} />
              <span>Configure Space</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {floorSpaces.map((floor, fIdx) => (
              <div
                key={fIdx}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.2rem',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {floor.floor}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: floor.color,
                        background: `${floor.color}15`,
                        padding: '2px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {floor.status}
                    </span>
                  </div>

                  <h4 style={{ margin: '0 0 6px', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                    {floor.title}
                  </h4>
                  <p style={{ margin: '0 0 10px', fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
                    {floor.specs}
                  </p>
                </div>

                <div style={{ paddingTop: '8px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Monthly Rent</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0d1b2a' }}>{floor.rent}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>Floor Area</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#2563eb' }}>{floor.area}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. MODAL: ADD SPACE / CONFIGURE FLOOR
         ══════════════════════════════════════════════════════════════════════════ */}
      {addSpaceModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setAddSpaceModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#fef08a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#854d0e',
                }}
              >
                <Building size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  Configure Leasable Space / Floor
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  Kashi Commercial Complex • Sathwa Road, Varanasi
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Floor settings updated successfully in lease ledger!');
                setAddSpaceModalOpen(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Select Target Floor
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    background: '#f8fafc',
                  }}
                >
                  <option>Ground Floor - Logistics Godown (2,200 sq.ft)</option>
                  <option>1st Floor - Commercial Corporate Office (1,800 sq.ft)</option>
                  <option>2nd Floor - Executive IT Studio (1,600 sq.ft)</option>
                  <option>Full Building Combo (5,600 sq.ft)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Monthly Rent (₹)
                  </label>
                  <input
                    type="text"
                    defaultValue="₹35,000"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Security Deposit (₹)
                  </label>
                  <input
                    type="text"
                    defaultValue="₹1,00,000"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Availability Status
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    background: '#f8fafc',
                  }}
                >
                  <option>Available for Immediate Lease</option>
                  <option>Under Inspection / Site Visit Scheduled</option>
                  <option>Leased / Agreement Active</option>
                  <option>Under Renovation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Key Amenities & Specs
                </label>
                <textarea
                  rows={3}
                  defaultValue="18ft ceiling height, 20ft heavy truck shutter, 3-phase 25kW power, washroom, dedicated parking bay."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setAddSpaceModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#0d1b2a',
                    color: '#facc15',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          9. MODAL: VIEW ALL RECENT BOOKINGS
         ══════════════════════════════════════════════════════════════════════════ */}
      {viewBookingsModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              maxWidth: '800px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setViewBookingsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: '#f1f5f9',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={18} />
            </button>

            <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
              All Commercial Bookings & Leases
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
              Full ledger of commercial inspections, earnest advance receipts, and leased units.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                    <th style={{ padding: '10px 12px' }}>ID</th>
                    <th style={{ padding: '10px 12px' }}>Client Name</th>
                    <th style={{ padding: '10px 12px' }}>Floor / Space</th>
                    <th style={{ padding: '10px 12px' }}>Amount</th>
                    <th style={{ padding: '10px 12px' }}>Date</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#64748b' }}>{b.id}</td>
                      <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>{b.customer}</td>
                      <td style={{ padding: '12px', color: '#334155' }}>{b.floorName}</td>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#2563eb' }}>{b.amount}</td>
                      <td style={{ padding: '12px', color: '#64748b' }}>{b.date}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: b.status === 'Confirmed' ? '#dcfce7' : b.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                            color: b.status === 'Confirmed' ? '#15803d' : b.status === 'Pending' ? '#b45309' : '#b91c1c',
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

            <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
              <button
                onClick={() => setViewBookingsModalOpen(false)}
                style={{
                  background: '#0d1b2a',
                  color: '#facc15',
                  padding: '9px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default RentOfficeDashboard;
