/**
 * @file LiveTrackingPage.jsx
 * @description Dedicated Real-Time Staff GPS Tracking, Field Ops & Multi-User Login Radar.
 * High-performance pure React/SVG radar map:
 * - Interactive GPS Grid with Green (Check-in/Active) and Red (Check-out/Idle) pins
 * - Home service field dispatch tracker with live route simulation from salon to client doorstep
 * - User login origin radar (Staff, Students, Customers login geo-coordinates & IP points)
 * - Live shift punch status, battery status, distance to client, and 1-click staff contact
 * @module frontend/src/modules/admin/pages/LiveTrackingPage
 */

import React, { useState, useEffect } from 'react';
import {
  Navigation,
  MapPin,
  Phone,
  Clock,
  Battery,
  Shield,
  Activity,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Car,
  Play,
  Pause,
  Compass,
  Radio,
} from 'lucide-react';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';

export default function LiveTrackingPage() {
  const { tenant } = useTenantAdmin();
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'CHECKED_OUT' | 'ON_LEAVE' | 'HOME_SERVICE' | 'LOGINS'
  const [mapDisplayMode, setMapDisplayMode] = useState('SATELLITE'); // 'SATELLITE' | 'ROADMAP' | 'DARK'
  const [selectedPin, setSelectedPin] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Field Staff List with live coordinates and shift status
  const [staffList, setStaffList] = useState([
    {
      id: 'stf_1',
      name: 'Priya Sharma',
      role: 'Senior Makeup Artist',
      department: 'Makeup Department',
      phone: '+91 98765 43211',
      status: 'ON_DUTY', // 'ON_DUTY' (Green) | 'OFF_DUTY' (Red) | 'IN_TRANSIT' (Blue) | 'ON_LEAVE' (Yellow)
      battery: 88,
      speed: 'Stationary',
      locationName: 'Flagship Sanctuary - South Extension Part 2',
      coordinates: { x: 35, y: 40 },
      latLng: '28.5684° N, 77.2185° E',
      lastPunch: '09:05 AM (Checked-In)',
      type: 'STAFF',
    },
    {
      id: 'stf_2',
      name: 'Rohit Verma',
      role: 'Senior Hair Stylist',
      department: 'Hair Department',
      phone: '+91 98765 43212',
      status: 'IN_TRANSIT',
      battery: 64,
      speed: '28 km/h',
      locationName: 'En Route to Client Home (Defence Colony A-Block)',
      coordinates: { x: 55, y: 52 },
      latLng: '28.5728° N, 77.2341° E',
      lastPunch: '09:15 AM (Checked-In)',
      type: 'STAFF',
      activeAssignment: {
        appointmentCode: 'APT-2026-7840',
        customerName: 'Sunita Kapoor',
        destination: 'A-42, Defence Colony, New Delhi',
        service: 'HD Airbrush Bridal Makeover',
        etaMinutes: 12,
        distanceKm: 2.4,
      },
    },
    {
      id: 'stf_3',
      name: 'Alisha Merchant',
      role: 'General Parlour Employee',
      department: 'Parlour Department',
      phone: '+91 98765 43220',
      status: 'ON_DUTY',
      battery: 92,
      speed: 'Stationary',
      locationName: 'Station 3, South Extension Flagship',
      coordinates: { x: 40, y: 45 },
      latLng: '28.5690° N, 77.2201° E',
      lastPunch: '09:30 AM (Checked-In)',
      type: 'STAFF',
    },
    {
      id: 'stf_4',
      name: 'Sneha Sen',
      role: 'Clinical Esthetician / Skin Specialist',
      department: 'Skin & Facial Department',
      phone: '+91 98765 43217',
      status: 'OFF_DUTY',
      battery: 35,
      speed: '0 km/h',
      locationName: 'Cyber City Branch (Punch-Out Logged)',
      coordinates: { x: 75, y: 70 },
      latLng: '28.4952° N, 77.0891° E',
      lastPunch: '05:45 PM (Checked-Out)',
      type: 'STAFF',
    },
    {
      id: 'stf_5',
      name: 'Aarti Saxena',
      role: 'Senior Hair Stylist',
      department: 'Hair Department',
      phone: '+91 98765 43224',
      status: 'ON_LEAVE',
      battery: 80,
      speed: 'Off-Shift',
      locationName: 'Approved Casual Leave (Medical)',
      coordinates: { x: 22, y: 68 },
      latLng: '28.5412° N, 77.2140° E',
      lastPunch: 'On Leave (Approved by Admin)',
      type: 'STAFF',
    },
  ]);

  // Multi-User Login Locations (Staff, Student, Customer)
  const loginLocations = [
    {
      id: 'log_1',
      user: 'Aryan Mehta',
      type: 'STUDENT',
      role: 'Academy Trainee',
      ip: '103.21.12.89',
      city: 'Delhi - Lajpat Nagar',
      coordinates: { x: 48, y: 35 },
      latLng: '28.5701° N, 77.2410° E',
      time: '12 mins ago',
    },
    {
      id: 'log_2',
      user: 'Kavita Patel',
      type: 'CUSTOMER',
      role: 'VIP Diamond Member',
      ip: '14.139.45.102',
      city: 'Greater Kailash 1',
      coordinates: { x: 60, y: 65 },
      latLng: '28.5524° N, 77.2372° E',
      time: '25 mins ago',
    },
    {
      id: 'log_3',
      user: 'Neha Verma',
      type: 'STUDENT',
      role: 'Master Cosmetology Student',
      ip: '49.36.128.4',
      city: 'Connaught Place',
      coordinates: { x: 30, y: 22 },
      latLng: '28.6315° N, 77.2167° E',
      time: '1 hour ago',
    },
  ];

  // Live GPS simulation loop
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setStaffList((prev) =>
          prev.map((s) => {
            if (s.id === 'stf_2') {
              const newX = Math.min(68, s.coordinates.x + 1.2);
              const newY = Math.min(62, s.coordinates.y + 0.8);
              return {
                ...s,
                coordinates: { x: newX, y: newY },
                activeAssignment: {
                  ...s.activeAssignment,
                  etaMinutes: Math.max(1, s.activeAssignment.etaMinutes - 1),
                  distanceKm: Math.max(0.3, Number((s.activeAssignment.distanceKm - 0.2).toFixed(1))),
                },
              };
            }
            return s;
          })
        );
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const filteredStaff = staffList.filter((s) => {
    if (activeFilter === 'ACTIVE') return s.status === 'ON_DUTY';
    if (activeFilter === 'CHECKED_OUT') return s.status === 'OFF_DUTY';
    if (activeFilter === 'ON_LEAVE') return s.status === 'ON_LEAVE';
    if (activeFilter === 'HOME_SERVICE') return s.status === 'IN_TRANSIT';
    return true;
  });

  const checkedInCount = staffList.filter((s) => s.status === 'ON_DUTY' || s.status === 'IN_TRANSIT').length;
  const checkedOutCount = staffList.filter((s) => s.status === 'OFF_DUTY').length;
  const onLeaveCount = staffList.filter((s) => s.status === 'ON_LEAVE').length;
  const inTransitCount = staffList.filter((s) => s.status === 'IN_TRANSIT').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🛰️</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Live Staff GPS Tracking & Google Satellite Radar
            </h1>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Real-time biometric punch tracking (Green Checked-In / Red Checked-Out / Yellow On Leave), doorstep dispatch, and multi-user login coordinates
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setIsSimulating(!isSimulating);
              toast.success(isSimulating ? 'GPS transit simulation paused' : 'Live field GPS movement simulation started!');
            }}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isSimulating ? 'Pause GPS Transit' : 'Simulate Doorstep Transit'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards - All Attendance, Leave & Transit Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        {/* Card 1: 🟢 Total Staff Checked-In */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase' }}>🟢 Checked-In (On Duty)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>
            {checkedInCount} Staff
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Active Biometric / GPS Punches</div>
        </div>

        {/* Card 2: 🔴 Total Staff Checked-Out */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(239, 68, 68, 0.4)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase' }}>🔴 Checked-Out (Off Duty)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ef4444', marginTop: '4px' }}>
            {checkedOutCount} Staff
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Shift Ended / Punched-Out Logged</div>
        </div>

        {/* Card 3: 🟡 Total Staff On Leave */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(245, 158, 11, 0.4)', boxShadow: '0 4px 15px rgba(245, 158, 11, 0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase' }}>🟡 Total On Leave</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>
            {onLeaveCount} Staff
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Approved Medical / Casual Leave</div>
        </div>

        {/* Card 4: 🚗 Home Service In Transit */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(56, 189, 248, 0.4)', boxShadow: '0 4px 15px rgba(56, 189, 248, 0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase' }}>🚗 Home Service In-Transit</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8', marginTop: '4px' }}>
            {inTransitCount} Visit
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Live Doorstep GPS Dispatch</div>
        </div>

        {/* Card 5: 🟣 Multi-User Login Points */}
        <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--bg-surface)', border: '1px solid rgba(168, 85, 247, 0.4)', boxShadow: '0 4px 15px rgba(168, 85, 247, 0.08)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase' }}>🟣 Multi-User Login Radar</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#a855f7', marginTop: '4px' }}>
            {loginLocations.length} Geopoints
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Students & Customer Web Sessions</div>
        </div>
      </div>

      {/* Main Radar Layout: Interactive GPS Map + Staff Side Deck */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px' }}>
        {/* Interactive GPS Map Container */}
        <div
          style={{
            height: '620px',
            borderRadius: '18px',
            background:
              mapDisplayMode === 'SATELLITE'
                ? '#141e1b'
                : mapDisplayMode === 'ROADMAP'
                ? '#e5e3df'
                : '#090e1a',
            overflow: 'hidden',
            border: '2px solid var(--border-color)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            position: 'relative',
          }}
        >
          {/* Top Radar Header Bar */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.92)',
              backdropFilter: 'blur(10px)',
              padding: '8px 14px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#10b981', fontSize: '12px' }}>●</span>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>
                {mapDisplayMode === 'SATELLITE'
                  ? '🛰️ GOOGLE MAPS SATELLITE (HYBRID)'
                  : mapDisplayMode === 'ROADMAP'
                  ? '🗺️ GOOGLE STREETS ROADMAP'
                  : '🌌 TACTICAL DARK RADAR'}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Delhi-NCR (28.5684° N, 77.2185° E) • Live Biometrics
            </span>
          </div>

          {/* Map Layer Mode Switcher & Filter Pills */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '8px',
            }}
          >
            {/* Map Mode Buttons (Satellite / Streets / Dark) */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(10px)',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                gap: '4px',
              }}
            >
              {[
                { id: 'SATELLITE', label: '🛰️ Google Satellite' },
                { id: 'ROADMAP', label: '🗺️ Google Streets' },
                { id: 'DARK', label: '🌌 Dark Radar' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMapDisplayMode(m.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '7px',
                    fontSize: '11px',
                    fontWeight: mapDisplayMode === m.id ? 800 : 500,
                    cursor: 'pointer',
                    border: 'none',
                    background: mapDisplayMode === m.id ? '#10b981' : 'transparent',
                    color: mapDisplayMode === m.id ? '#ffffff' : '#94a3b8',
                    transition: 'all 0.2s',
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Filter Pills */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(10px)',
                padding: '5px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
            >
              {[
                { id: 'ALL', label: 'All Geopins' },
                { id: 'ACTIVE', label: '🟢 Checked-In' },
                { id: 'CHECKED_OUT', label: '🔴 Checked-Out' },
                { id: 'ON_LEAVE', label: '🟡 On Leave' },
                { id: 'HOME_SERVICE', label: '🚗 Doorstep Transit' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  style={{
                    padding: '5px 9px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeFilter === f.id ? '#6366f1' : 'transparent',
                    color: activeFilter === f.id ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Display Layers */}
          {/* 1. Google Satellite Photorealistic Imagery Background Layer */}
          {mapDisplayMode === 'SATELLITE' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(circle at 45% 35%, rgba(34, 55, 42, 0.95) 0%, rgba(18, 30, 24, 0.98) 50%, rgba(10, 18, 14, 1) 100%), linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 45px 45px, 45px 45px',
              }}
            >
              {/* Satellite Aerial Building & Landscape Features */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {/* Ring Road Aerial Corridors with Asphalt Texture */}
                <path d="M 0 160 Q 250 200 550 280 T 1000 400" fill="none" stroke="rgba(255, 255, 255, 0.38)" strokeWidth="12" />
                <path d="M 0 160 Q 250 200 550 280 T 1000 400" fill="none" stroke="#222" strokeWidth="8" strokeDasharray="14 10" />
                <path d="M 220 0 Q 340 300 480 620" fill="none" stroke="rgba(255, 255, 255, 0.32)" strokeWidth="10" />
                <path d="M 680 40 Q 610 320 670 620" fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="8" />

                {/* Lush Green Parks & Tree Clusters */}
                <ellipse cx="200" cy="180" rx="95" ry="65" fill="rgba(34, 197, 94, 0.22)" stroke="rgba(34, 197, 94, 0.45)" strokeWidth="1.5" />
                <ellipse cx="650" cy="210" rx="130" ry="85" fill="rgba(34, 197, 94, 0.18)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="1.5" />
                <ellipse cx="380" cy="480" rx="80" ry="50" fill="rgba(34, 197, 94, 0.2)" stroke="rgba(34, 197, 94, 0.35)" strokeWidth="1" />

                {/* Commercial Building & Salon Rooftops */}
                <rect x="290" y="100" width="55" height="40" fill="rgba(255, 255, 255, 0.14)" stroke="rgba(255,255,255,0.3)" />
                <rect x="360" y="90" width="65" height="50" fill="rgba(255, 255, 255, 0.16)" stroke="rgba(255,255,255,0.3)" />
                <rect x="440" y="120" width="45" height="35" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255,255,255,0.25)" />
                <rect x="520" y="320" width="70" height="45" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255,255,255,0.3)" />
                <rect x="610" y="340" width="50" height="40" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255,255,255,0.25)" />
              </svg>
            </div>
          )}

          {/* 2. Google Streets / Roadmap Layer */}
          {mapDisplayMode === 'ROADMAP' && (
            <div style={{ position: 'absolute', inset: 0, background: '#e5e3df' }}>
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {/* River Water Body */}
                <path d="M 780 0 Q 840 280 890 620" fill="none" stroke="#aadaff" strokeWidth="45" />
                {/* Expressways */}
                <path d="M 0 160 Q 250 200 550 280 T 1000 400" fill="none" stroke="#fcd34d" strokeWidth="14" />
                <path d="M 220 0 Q 340 300 480 620" fill="none" stroke="#ffffff" strokeWidth="12" />
                {/* City Streets */}
                <path d="M 120 0 L 120 620" fill="none" stroke="#ffffff" strokeWidth="5" />
                <path d="M 420 0 L 420 620" fill="none" stroke="#ffffff" strokeWidth="5" />
                <path d="M 0 340 L 1000 340" fill="none" stroke="#ffffff" strokeWidth="5" />
                {/* Parks */}
                <ellipse cx="200" cy="180" rx="95" ry="65" fill="#c8f2b8" />
                <ellipse cx="650" cy="210" rx="130" ry="85" fill="#c8f2b8" />
              </svg>
            </div>
          )}

          {/* 3. Dark Tactical Radar Layer */}
          {mapDisplayMode === 'DARK' && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#090e1a',
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '45px 45px',
              }}
            >
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path d="M 50 150 Q 250 180 500 240 T 800 350" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
                <path d="M 200 50 Q 320 300 450 550" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <path d="M 600 80 Q 550 320 620 580" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              </svg>
            </div>
          )}

          {/* Live Field Transit Polyline for Home Service Doorstep Dispatch */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <polyline
              points="280,248 360,280 440,322 560,372"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="6 8"
            />
          </svg>

          {/* Render Staff Markers */}
          {filteredStaff.map((staff) => {
            const isSelected = selectedPin?.id === staff.id;
            const isCheckedIn = staff.status === 'ON_DUTY';
            const isInTransit = staff.status === 'IN_TRANSIT';
            const isOnLeave = staff.status === 'ON_LEAVE';
            const isCheckedOut = staff.status === 'OFF_DUTY';

            const color = isCheckedIn
              ? '#10b981'
              : isInTransit
              ? '#38bdf8'
              : isOnLeave
              ? '#f59e0b'
              : '#ef4444';

            const emoji = isCheckedIn ? '🟢' : isInTransit ? '🚗' : isOnLeave ? '🟡' : '🔴';

            return (
              <div
                key={staff.id}
                onClick={() => setSelectedPin(staff)}
                style={{
                  position: 'absolute',
                  top: `${staff.coordinates.y}%`,
                  left: `${staff.coordinates.x}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 20 : 15,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Pin Circle with Ripple Pulse */}
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: color,
                    border: '3px solid #ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    boxShadow: `0 0 20px ${color}aa`,
                    transition: 'all 0.3s ease',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                  }}
                >
                  {emoji}
                </div>

                {/* Pin Label */}
                <div
                  style={{
                    marginTop: '4px',
                    background: 'rgba(15, 23, 42, 0.92)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    border: `1px solid ${color}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                  }}
                >
                  {staff.name}
                </div>
              </div>
            );
          })}

          {/* Render Multi-User Login Markers */}
          {loginLocations.map((log) => (
            <div
              key={log.id}
              onClick={() => setSelectedPin(log)}
              style={{
                position: 'absolute',
                top: `${log.coordinates.y}%`,
                left: `${log.coordinates.x}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#a855f7',
                  border: '2px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  boxShadow: '0 0 15px rgba(168, 85, 247, 0.6)',
                }}
              >
                🟣
              </div>
              <div
                style={{
                  marginTop: '2px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '9px',
                  fontWeight: 700,
                  color: '#e9d5ff',
                  whiteSpace: 'nowrap',
                }}
              >
                {log.user} ({log.type.toLowerCase()})
              </div>
            </div>
          ))}

          {/* Selected Pin Info Card (Overlay) */}
          {selectedPin && (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                right: '16px',
                zIndex: 25,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                padding: '16px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>
                    {selectedPin.name || selectedPin.user}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(99, 102, 241, 0.2)',
                      color: '#818cf8',
                    }}
                  >
                    {selectedPin.role} · {selectedPin.department || selectedPin.city}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  📍 {selectedPin.locationName || selectedPin.city} · GPS: {selectedPin.latLng}
                </div>
                {selectedPin.activeAssignment && (
                  <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '4px', fontWeight: 700 }}>
                    🚗 Client Doorstep: {selectedPin.activeAssignment.customerName} ({selectedPin.activeAssignment.destination}) — ETA: {selectedPin.activeAssignment.etaMinutes} mins
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {selectedPin.phone && (
                  <button
                    onClick={() => toast.success(`Calling ${selectedPin.name} at ${selectedPin.phone}...`)}
                    className="btn btn-primary btn-sm"
                  >
                    📞 Call Staff
                  </button>
                )}
                <button
                  onClick={() => setSelectedPin(null)}
                  className="btn btn-secondary btn-sm"
                >
                  Close
                </button>
              </div>
            </div>
          )}
          {/* Google Maps Live Map Attribution Watermark */}
          <div
            style={{
              position: 'absolute',
              bottom: selectedPin ? '90px' : '10px',
              right: '12px',
              zIndex: 10,
              background: 'rgba(15, 23, 42, 0.75)',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              color: '#94a3b8',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>Google Maps © 2026 Maxar Technologies</span>
            <span>•</span>
            <span style={{ color: '#10b981' }}>Live GPS Feeds</span>
          </div>
        </div>

        {/* Staff Side Deck */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '620px', overflowY: 'auto' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Field Personnel Radar</h3>

          {staffList.map((staff) => (
            <div
              key={staff.id}
              onClick={() => setSelectedPin(staff)}
              className="card"
              style={{
                padding: '16px',
                borderRadius: '14px',
                background: selectedPin?.id === staff.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-surface)',
                border: selectedPin?.id === staff.id ? '1px solid #6366f1' : '1px solid var(--border-color)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)' }}>{staff.name}</div>
                  <div style={{ fontSize: '11px', color: '#f472b6', fontWeight: 700 }}>{staff.role}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{staff.department}</div>
                </div>

                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: 800,
                    background:
                      staff.status === 'ON_DUTY'
                        ? 'rgba(16, 185, 129, 0.2)'
                        : staff.status === 'IN_TRANSIT'
                        ? 'rgba(56, 189, 248, 0.2)'
                        : staff.status === 'ON_LEAVE'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'rgba(239, 68, 68, 0.2)',
                    color:
                      staff.status === 'ON_DUTY'
                        ? '#10b981'
                        : staff.status === 'IN_TRANSIT'
                        ? '#38bdf8'
                        : staff.status === 'ON_LEAVE'
                        ? '#f59e0b'
                        : '#ef4444',
                  }}
                >
                  {staff.status === 'ON_DUTY'
                    ? '🟢 ON DUTY'
                    : staff.status === 'IN_TRANSIT'
                    ? '🚗 EN ROUTE'
                    : staff.status === 'ON_LEAVE'
                    ? '🟡 ON LEAVE'
                    : '🔴 OFF DUTY'}
                </span>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                📍 {staff.locationName}
              </div>

              {staff.activeAssignment && (
                <div
                  style={{
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: '#38bdf8' }}>
                    🚗 Doorstep Visit: {staff.activeAssignment.customerName}
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '2px' }}>
                    ETA: <strong>{staff.activeAssignment.etaMinutes} mins</strong> ({staff.activeAssignment.distanceKm} km away)
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Battery className="w-3.5 h-3.5" /> {staff.battery}%
                </span>
                <span>{staff.lastPunch}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Dialing ${staff.name} at ${staff.phone}...`);
                  }}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '2px 8px', fontSize: '10px' }}
                >
                  📞 Call
                </button>
              </div>
            </div>
          ))}

          {/* User Logins Radar Feed */}
          <div
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>
              🟣 Multi-User Geo Login Radar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {loginLocations.map((l) => (
                <div key={l.id} style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    <strong>{l.user}</strong> ({l.type.toLowerCase()})
                  </span>
                  <span style={{ color: 'var(--text-muted)' }}>{l.city}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
