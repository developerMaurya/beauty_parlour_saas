/**
 * @file ReceptionistFrontDeskPage.jsx
 * @description Dedicated Front Desk Receptionist & Salon Floor Command Center.
 * Handles:
 * - Live Customer Token Calling & Station Seating
 * - Instant Walk-in Guest Registration & Token Issuance
 * - Staff Biometric Check-in / Check-out Clock at Reception
 * - Today's Live Token & Appointment Roster
 * @module frontend/src/modules/admin/pages/ReceptionistFrontDeskPage
 */

import React, { useState, useEffect } from 'react';
import {
  Radio,
  UserCheck,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Printer,
  Sparkles,
  Scissors,
  Users,
  ChevronRight,
  Phone,
  Calendar,
  Volume2,
  Tv,
  Check,
  X,
  CreditCard,
  QrCode,
  Shield,
  Send,
} from 'lucide-react';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { useToast } from '../../../context/ToastContext.jsx';

export const ReceptionistFrontDeskPage = () => {
  const { user, selectedBranch, selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [isStaffPunchModalOpen, setIsStaffPunchModalOpen] = useState(false);
  const [tokenReceiptModal, setTokenReceiptModal] = useState(null);

  // Walk-in form state
  const [walkInForm, setWalkInForm] = useState({
    customerName: '',
    phone: '',
    serviceName: 'Bridal HD Makeup & Glow',
    chairOrStation: 'Chair 2 (Bridal Suite)',
    stylistName: 'Sneha Sen',
    billAmount: 3500,
  });

  // Current Serving State
  const [nowServing, setNowServing] = useState({
    tokenNumber: 4,
    tokenDisplay: 'Token #04',
    customerName: 'Ananya Deshmukh',
    customerPhone: '+91 98765 43210',
    serviceName: 'Bridal HD Makeover & Hair Artistry',
    chairOrStation: 'Chair 2 (Bridal Suite)',
    stylistName: 'Sneha Sen',
    startedAt: '11:15 AM',
    durationMins: 60,
    progressPercent: 65,
    billAmount: 5500,
  });

  // Today's Master Token Roster
  const [tokens, setTokens] = useState([
    {
      id: 'tok_01',
      tokenNumber: 1,
      tokenDisplay: 'Token #01',
      customerName: 'Aarav Patel',
      phone: '+91 98111 00111',
      serviceName: 'Executive Haircut & Beard Grooming',
      chairOrStation: 'Chair 5 (Mens Unit)',
      stylistName: 'Vikas Malhotra',
      time: '10:00 AM',
      status: 'COMPLETED',
      billAmount: 950,
      paymentStatus: 'PAID',
    },
    {
      id: 'tok_02',
      tokenNumber: 2,
      tokenDisplay: 'Token #02',
      customerName: 'Pooja Verma',
      phone: '+91 98111 00222',
      serviceName: 'Balayage Color & Hair Spa Treatment',
      chairOrStation: 'Chair 1 (Hair Architect)',
      stylistName: 'Rohit Verma',
      time: '10:30 AM',
      status: 'IN_SERVICE',
      billAmount: 4800,
      paymentStatus: 'PENDING',
    },
    {
      id: 'tok_03',
      tokenNumber: 3,
      tokenDisplay: 'Token #03',
      customerName: 'Sonia Gupta',
      phone: '+91 98111 00333',
      serviceName: 'Threading & Herbal Clean-up Ritual',
      chairOrStation: 'Chair 3 (Facial Lounge)',
      stylistName: 'Alisha Merchant',
      time: '10:45 AM',
      status: 'COMPLETED',
      billAmount: 850,
      paymentStatus: 'PAID',
    },
    {
      id: 'tok_04',
      tokenNumber: 4,
      tokenDisplay: 'Token #04',
      customerName: 'Ananya Deshmukh',
      phone: '+91 98111 00444',
      serviceName: 'Bridal HD Makeover & Hair Artistry',
      chairOrStation: 'Chair 2 (Bridal Suite)',
      stylistName: 'Sneha Sen',
      time: '11:15 AM',
      status: 'IN_SERVICE',
      billAmount: 5500,
      paymentStatus: 'PENDING',
    },
    {
      id: 'tok_05',
      tokenNumber: 5,
      tokenDisplay: 'Token #05',
      customerName: 'Riya Kapoor',
      phone: '+91 98111 00555',
      serviceName: 'O2 Hydra Radiance Clinical Facial',
      chairOrStation: 'Chair 3 (Facial Lounge)',
      stylistName: 'Alisha Merchant',
      time: '11:30 AM',
      status: 'IN_SERVICE',
      billAmount: 2800,
      paymentStatus: 'PENDING',
    },
    {
      id: 'tok_06',
      tokenNumber: 6,
      tokenDisplay: 'Token #06',
      customerName: 'Megha Singhania',
      phone: '+91 98111 00666',
      serviceName: 'Gel Extensions & Nail Art Couture',
      chairOrStation: 'Chair 4 (Nail Bar)',
      stylistName: 'Aarti Saxena',
      time: '11:45 AM',
      status: 'IN_SERVICE',
      billAmount: 2200,
      paymentStatus: 'PENDING',
    },
    {
      id: 'tok_07',
      tokenNumber: 7,
      tokenDisplay: 'Token #07',
      customerName: 'Sunita Roy',
      phone: '+91 98111 00777',
      serviceName: 'Party Makeup & Hair Curls',
      chairOrStation: 'Chair 2 (Next in Line)',
      stylistName: 'Sneha Sen',
      time: '12:15 PM',
      status: 'WAITING',
      billAmount: 3200,
      paymentStatus: 'UNPAID',
    },
    {
      id: 'tok_08',
      tokenNumber: 8,
      tokenDisplay: 'Token #08',
      customerName: 'Tanvi Chopra',
      phone: '+91 98111 00888',
      serviceName: 'Blow Dry & Keratin Gloss Polish',
      chairOrStation: 'Chair 1 (Next in Line)',
      stylistName: 'Rohit Verma',
      time: '12:45 PM',
      status: 'WAITING',
      billAmount: 1800,
      paymentStatus: 'UNPAID',
    },
  ]);

  // Salon Staff Biometric Attendance State
  const [staffAttendance, setStaffAttendance] = useState([
    { id: 'st_1', name: 'Sneha Sen', role: 'Bridal Makeup Specialist', status: 'PRESENT', inTime: '09:00 AM', outTime: null, chair: 'Chair 2' },
    { id: 'st_2', name: 'Rohit Verma', role: 'Master Hair Colorist', status: 'PRESENT', inTime: '09:15 AM', outTime: null, chair: 'Chair 1' },
    { id: 'st_3', name: 'Alisha Merchant', role: 'Clinical Skin Cosmetologist', status: 'PRESENT', inTime: '09:30 AM', outTime: null, chair: 'Chair 3' },
    { id: 'st_4', name: 'Aarti Saxena', role: 'Nail Artist & Esthetician', status: 'PRESENT', inTime: '09:45 AM', outTime: null, chair: 'Chair 4' },
    { id: 'st_5', name: 'Vikas Malhotra', role: 'Mens Grooming & Spa', status: 'PRESENT', inTime: '10:00 AM', outTime: null, chair: 'Chair 5' },
    { id: 'st_6', name: 'Priya Sharma', role: 'Senior Aesthetician', status: 'ON_LEAVE', inTime: null, outTime: null, chair: 'Approved Sick Leave' },
  ]);

  // Call Next Waiting Token
  const handleCallNextToken = () => {
    const nextWaiting = tokens.find((t) => t.status === 'WAITING');
    if (!nextWaiting) {
      toast.info('All waiting tokens have already been called!');
      return;
    }

    setTokens((prev) =>
      prev.map((t) => (t.id === nextWaiting.id ? { ...t, status: 'IN_SERVICE' } : t))
    );

    setNowServing({
      tokenNumber: nextWaiting.tokenNumber,
      tokenDisplay: nextWaiting.tokenDisplay,
      customerName: nextWaiting.customerName,
      customerPhone: nextWaiting.phone,
      serviceName: nextWaiting.serviceName,
      chairOrStation: nextWaiting.chairOrStation,
      stylistName: nextWaiting.stylistName,
      startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      durationMins: 45,
      progressPercent: 10,
      billAmount: nextWaiting.billAmount,
    });

    toast.success(`📢 Calling ${nextWaiting.tokenDisplay}: ${nextWaiting.customerName} to ${nextWaiting.chairOrStation}!`);
  };

  // Mark Current Serving as Completed
  const handleCompleteCurrentService = () => {
    if (!nowServing) return;

    setTokens((prev) =>
      prev.map((t) =>
        t.tokenNumber === nowServing.tokenNumber ? { ...t, status: 'COMPLETED', paymentStatus: 'PAID' } : t
      )
    );

    toast.success(`Service completed for ${nowServing.customerName}! Token marked as completed.`);

    // Auto-advance to next waiting
    const nextWaiting = tokens.find((t) => t.status === 'WAITING' && t.tokenNumber !== nowServing.tokenNumber);
    if (nextWaiting) {
      handleCallNextToken();
    }
  };

  // Create Walk-in Token
  const handleCreateWalkIn = (e) => {
    e.preventDefault();
    if (!walkInForm.customerName || !walkInForm.phone) {
      toast.error('Please enter customer name and phone number');
      return;
    }

    const nextNum = Math.max(...tokens.map((t) => t.tokenNumber), 0) + 1;
    const tokenDisplay = `Token #${String(nextNum).padStart(2, '0')}`;

    const newTok = {
      id: `tok_${String(nextNum).padStart(2, '0')}`,
      tokenNumber: nextNum,
      tokenDisplay,
      customerName: walkInForm.customerName,
      phone: walkInForm.phone,
      serviceName: walkInForm.serviceName,
      chairOrStation: walkInForm.chairOrStation,
      stylistName: walkInForm.stylistName,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'WAITING',
      billAmount: Number(walkInForm.billAmount) || 1500,
      paymentStatus: 'UNPAID',
    };

    setTokens((prev) => [...prev, newTok]);
    setIsWalkInModalOpen(false);
    setTokenReceiptModal(newTok);
    toast.success(`🎫 Issued ${tokenDisplay} for ${walkInForm.customerName}!`);

    setWalkInForm({
      customerName: '',
      phone: '',
      serviceName: 'Bridal HD Makeup & Glow',
      chairOrStation: 'Chair 2 (Bridal Suite)',
      stylistName: 'Sneha Sen',
      billAmount: 3500,
    });
  };

  // Staff Attendance Punch In / Out
  const handleToggleStaffPunch = (staffId) => {
    setStaffAttendance((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          const isPresent = s.status === 'PRESENT';
          const newStatus = isPresent ? 'PUNCHED_OUT' : 'PRESENT';
          const outTime = isPresent
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : null;
          const inTime = !isPresent
            ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : s.inTime;
          toast.success(`${s.name} ${isPresent ? 'punched out' : 'punched in'} successfully at Reception Desk!`);
          return { ...s, status: newStatus, inTime, outTime };
        }
        return s;
      })
    );
  };

  // Filtered tokens
  const filteredTokens = tokens.filter((t) => {
    const matchesFilter =
      activeFilter === 'ALL'
        ? true
        : activeFilter === 'WAITING'
        ? t.status === 'WAITING'
        : activeFilter === 'IN_SERVICE'
        ? t.status === 'IN_SERVICE'
        : t.status === 'COMPLETED';

    const matchesSearch =
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.phone.includes(searchQuery) ||
      t.tokenDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serviceName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const inServiceCount = tokens.filter((t) => t.status === 'IN_SERVICE').length;
  const waitingCount = tokens.filter((t) => t.status === 'WAITING').length;
  const completedCount = tokens.filter((t) => t.status === 'COMPLETED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0.5rem 0 2rem 0' }}>
      {/* ── Top Header Bar ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                padding: '2px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Shield style={{ width: '12px', height: '12px' }} />
              RECEPTIONIST & FRONT DESK DESK
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Branch: <strong>{selectedBranch?.name || 'All Branches'}</strong>
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
            Front Desk & Salon Queue Manager
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
            Instant walk-in token generation, floor caller, station chair seating, and staff biometric attendance
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setIsWalkInModalOpen(true)}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              border: 'none',
              padding: '10px 18px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.35)',
            }}
          >
            <Plus style={{ width: '18px', height: '18px' }} />
            + Issue Walk-In Token
          </button>

          <button
            type="button"
            onClick={() => setIsStaffPunchModalOpen(true)}
            className="btn btn-secondary"
            style={{
              padding: '10px 16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Clock style={{ width: '16px', height: '16px', color: '#10b981' }} />
            Staff Biometric Punch Clock
          </button>
        </div>
      </div>

      {/* ── Big Live Floor Caller Box ── */}
      <div
        style={{
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #090d16 0%, #0f172a 100%)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          padding: '1.75rem 2rem',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        {/* Big Token Number Display */}
        <div
          style={{
            padding: '1rem 1.75rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
            border: '2px solid #10b981',
            textAlign: 'center',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.25)',
          }}
        >
          <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            🔴 LIVE CALLER
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', lineHeight: 1.1, margin: '4px 0' }}>
            {nowServing.tokenDisplay}
          </div>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
            {nowServing.chairOrStation}
          </div>
        </div>

        {/* Middle: Customer & Service Details */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase' }}>
              CURRENT CLIENT ON SEAT
            </span>
            <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '1px 6px', borderRadius: '4px' }}>
              Started {nowServing.startedAt}
            </span>
          </div>

          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f8fafc' }}>
            {nowServing.customerName}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#ec4899', fontWeight: 700 }}>
              💄 {nowServing.serviceName}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              👩‍🎨 Stylist: <strong style={{ color: '#f1f5f9' }}>{nowServing.stylistName}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              📞 {nowServing.customerPhone}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700 }}>
              ₹{nowServing.billAmount?.toLocaleString()}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ width: '100%', maxWidth: '400px', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', marginTop: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${nowServing.progressPercent || 60}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: '999px',
              }}
            />
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleCallNextToken}
            className="btn btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              padding: '10px 16px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
            }}
          >
            <Radio style={{ width: '16px', height: '16px' }} />
            Call Next Waiting Token
          </button>

          <button
            type="button"
            onClick={handleCompleteCurrentService}
            className="btn btn-secondary"
            style={{
              padding: '8px 14px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
            }}
          >
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10b981' }} />
            Complete Service & Bill
          </button>

          <button
            type="button"
            onClick={() => toast.success(`📢 Re-announcing ${nowServing.tokenDisplay} for ${nowServing.customerName} over Floor Chime!`)}
            className="btn btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.75rem',
              color: '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Volume2 style={{ width: '14px', height: '14px' }} />
            Re-announce Chime
          </button>
        </div>
      </div>

      {/* ── Floor Metrics Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>In-Salon Now</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#10b981', marginTop: '2px' }}>
            {inServiceCount} Active
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Currently receiving treatments</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Waiting Queue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#f59e0b', marginTop: '2px' }}>
            {waitingCount} Tokens
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated turn: ~10-15 mins</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Completed Today</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#38bdf8', marginTop: '2px' }}>
            {completedCount} Guests
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total visits serviced</div>
        </div>

        <div className="card" style={{ padding: '1rem 1.25rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Staff on Duty</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#a855f7', marginTop: '2px' }}>
            {staffAttendance.filter((s) => s.status === 'PRESENT').length} Stylists
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Punched in at reception desk</div>
        </div>
      </div>

      {/* ── Active Stations / Chairs Status Grid ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Styling Chairs & Specialist Stations Live Occupancy
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Receptionist station assigner: check which chair is vacant or busy before seating next walk-in
            </p>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
            4 Occupied • 2 Vacant Ready
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          {[
            { id: 1, name: 'Chair 1 • Hair Architect', stylist: 'Rohit Verma', occupied: true, token: 'Token #02', client: 'Pooja Verma', srv: 'Balayage & Hair Spa', time: '35 mins' },
            { id: 2, name: 'Chair 2 • Bridal Suite', stylist: 'Sneha Sen', occupied: true, token: 'Token #04', client: 'Ananya Deshmukh', srv: 'Bridal HD Makeover', time: '40 mins' },
            { id: 3, name: 'Chair 3 • Facial Lounge', stylist: 'Alisha Merchant', occupied: true, token: 'Token #05', client: 'Riya Kapoor', srv: 'O2 Hydra Facial', time: '20 mins' },
            { id: 4, name: 'Chair 4 • Nail & Pedicure Bar', stylist: 'Aarti Saxena', occupied: true, token: 'Token #06', client: 'Megha Singhania', srv: 'Gel Extensions & Art', time: '15 mins' },
            { id: 5, name: 'Chair 5 • Mens / Styling Unit', stylist: 'Vikas Malhotra', occupied: false, token: null, client: null, srv: 'Vacant • Ready for Next Walk-in', time: null },
            { id: 6, name: 'Chair 6 • Relax & Spa Station', stylist: 'Priya Sharma', occupied: false, token: null, client: null, srv: 'Vacant • Open for Walk-ins', time: null },
          ].map((ch) => (
            <div
              key={ch.id}
              style={{
                padding: '1.15rem',
                borderRadius: '12px',
                background: ch.occupied ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${ch.occupied ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {ch.name}
                </span>
                {ch.occupied ? (
                  <span style={{ background: '#10b981', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                    {ch.token}
                  </span>
                ) : (
                  <span style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                    VACANT
                  </span>
                )}
              </div>

              {ch.occupied ? (
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{ch.client}</div>
                  <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>✨ {ch.srv}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Stylist: <strong>{ch.stylist}</strong> • In progress for {ch.time}
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Station ready. Assigned stylist on standby: <strong>{ch.stylist}</strong>
                </div>
              )}

              <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.5rem' }}>
                {ch.occupied ? (
                  <button
                    type="button"
                    onClick={() => toast.success(`Marked service done for ${ch.client}! Transferred to Billing POS.`)}
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.72rem' }}
                  >
                    Complete Service
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.success(`Assigned next token to ${ch.name}!`)}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1, fontSize: '0.72rem', background: '#10b981', border: 'none' }}
                  >
                    Seat Next Guest
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Today's Master Token Roster ── */}
      <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Today's Live Token & Appointment Roster
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Full sequence of walk-ins and appointments booked for today
            </p>
          </div>

          {/* Search & Status Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ width: '14px', height: '14px', position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search token or guest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 12px 6px 30px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-page)',
                  color: 'var(--text-primary)',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-page)', padding: '3px', borderRadius: '8px' }}>
              {['ALL', 'WAITING', 'IN_SERVICE', 'COMPLETED'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: activeFilter === f ? 'var(--primary)' : 'transparent',
                    color: activeFilter === f ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Guest Details</th>
                <th>Requested Service</th>
                <th>Station / Chair</th>
                <th>Assigned Stylist</th>
                <th>Time</th>
                <th>Live Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No tokens found matching filter.
                  </td>
                </tr>
              ) : (
                filteredTokens.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>
                        {t.tokenDisplay}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.customerName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.phone}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{t.serviceName}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t.chairOrStation}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.stylistName}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.time}</span>
                    </td>
                    <td>
                      {t.status === 'IN_SERVICE' ? (
                        <span style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                          🟢 In-Service
                        </span>
                      ) : t.status === 'COMPLETED' ? (
                        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                          ✓ Completed
                        </span>
                      ) : (
                        <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px' }}>
                          ⏳ Waiting Next
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{t.billAmount?.toLocaleString()}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {t.status === 'WAITING' && (
                          <button
                            type="button"
                            onClick={() => {
                              setTokens((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: 'IN_SERVICE' } : x)));
                              toast.success(`Seated ${t.tokenDisplay}: ${t.customerName}!`);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '3px 8px', background: '#10b981', border: 'none' }}
                          >
                            Seat Client
                          </button>
                        )}
                        {t.status === 'IN_SERVICE' && (
                          <button
                            type="button"
                            onClick={() => {
                              setTokens((prev) => prev.map((x) => (x.id === t.id ? { ...x, status: 'COMPLETED', paymentStatus: 'PAID' } : x)));
                              toast.success(`Marked ${t.tokenDisplay} as completed!`);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                          >
                            Complete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setTokenReceiptModal(t)}
                          className="btn-icon"
                          title="Print / View Token Slip"
                          style={{ padding: '4px', background: 'transparent', border: 'none', color: '#94a3b8' }}
                        >
                          <Printer style={{ width: '14px', height: '14px' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL 1: Issue Instant Walk-In Token ── */}
      {isWalkInModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '520px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                  🎫 Issue Walk-In Token
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Register guest at front desk & assign to next available salon chair
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWalkInModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateWalkIn} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Guest Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Radhika Sharma"
                    value={walkInForm.customerName}
                    onChange={(e) => setWalkInForm((p) => ({ ...p, customerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    value={walkInForm.phone}
                    onChange={(e) => setWalkInForm((p) => ({ ...p, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Requested Beauty Service *</label>
                <select
                  className="form-select"
                  value={walkInForm.serviceName}
                  onChange={(e) => setWalkInForm((p) => ({ ...p, serviceName: e.target.value }))}
                >
                  <option value="Bridal HD Makeup & Glow">Bridal HD Makeup & Glow (₹3,500)</option>
                  <option value="Party Glam Makeup & Hair Curls">Party Glam Makeup & Hair Curls (₹2,200)</option>
                  <option value="Balayage Color Melt & Hair Spa">Balayage Color Melt & Hair Spa (₹4,800)</option>
                  <option value="O2 Hydra Radiance Facial">O2 Hydra Radiance Facial (₹2,800)</option>
                  <option value="Executive Haircut & Beard Trim">Executive Haircut & Beard Trim (₹950)</option>
                  <option value="Gel Nail Extensions & Art">Gel Nail Extensions & Art (₹2,200)</option>
                  <option value="Threading & Herbal Waxing">Threading & Herbal Waxing (₹650)</option>
                </select>
              </div>

              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Station / Chair Assignment *</label>
                  <select
                    className="form-select"
                    value={walkInForm.chairOrStation}
                    onChange={(e) => setWalkInForm((p) => ({ ...p, chairOrStation: e.target.value }))}
                  >
                    <option value="Chair 2 (Bridal Suite)">Chair 2 (Bridal Suite)</option>
                    <option value="Chair 1 (Hair Architect)">Chair 1 (Hair Architect)</option>
                    <option value="Chair 3 (Facial Lounge)">Chair 3 (Facial Lounge)</option>
                    <option value="Chair 4 (Nail Bar)">Chair 4 (Nail Bar)</option>
                    <option value="Chair 5 (Mens Unit)">Chair 5 (Mens Unit)</option>
                    <option value="Chair 6 (Spa Suite)">Chair 6 (Spa Suite)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialist Stylist</label>
                  <select
                    className="form-select"
                    value={walkInForm.stylistName}
                    onChange={(e) => setWalkInForm((p) => ({ ...p, stylistName: e.target.value }))}
                  >
                    <option value="Sneha Sen">Sneha Sen (Senior Makeup)</option>
                    <option value="Rohit Verma">Rohit Verma (Master Colorist)</option>
                    <option value="Alisha Merchant">Alisha Merchant (Skin Cosmetologist)</option>
                    <option value="Aarti Saxena">Aarti Saxena (Nail Artist)</option>
                    <option value="Vikas Malhotra">Vikas Malhotra (Grooming & Spa)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Bill (₹)</label>
                <input
                  type="number"
                  className="form-input"
                  value={walkInForm.billAmount}
                  onChange={(e) => setWalkInForm((p) => ({ ...p, billAmount: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsWalkInModalOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)', border: 'none', fontWeight: 800 }}
                >
                  🎫 Print & Issue Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Staff Biometric Attendance Punch Clock ── */}
      {isStaffPunchModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#1e293b',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '1.75rem',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc', margin: 0 }}>
                  ⏱️ Staff Biometric Attendance Clock
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: '2px 0 0 0' }}>
                  Reception desk attendance console: 1-click check-in & check-out for salon team
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsStaffPunchModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto' }}>
              {staffAttendance.map((s) => {
                const isPresent = s.status === 'PRESENT';
                return (
                  <div
                    key={s.id}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '0.9rem' }}>{s.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{s.role} • {s.chair}</div>
                      {s.inTime && (
                        <div style={{ fontSize: '0.7rem', color: '#10b981', marginTop: '2px' }}>
                          ✓ In at {s.inTime} {s.outTime && `• Out at ${s.outTime}`}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: isPresent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isPresent ? '#10b981' : '#ef4444',
                        }}
                      >
                        {s.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleStaffPunch(s.id)}
                        className={`btn btn-sm ${isPresent ? 'btn-secondary' : 'btn-primary'}`}
                        style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                      >
                        {isPresent ? 'Punch Out' : 'Punch In'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setIsStaffPunchModalOpen(false)}
                className="btn btn-secondary"
              >
                Close Console
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Token Slip / Printable Voucher ── */}
      {tokenReceiptModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              background: '#0f172a',
              border: '2px dashed #10b981',
              borderRadius: '20px',
              padding: '1.75rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6)',
            }}
          >
            <div style={{ fontSize: '1.8rem' }}>🌸</div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#f8fafc', margin: '6px 0 2px 0' }}>
              {selectedBranch?.name || 'Blossom Luxury Salon'}
            </h4>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
              Front Desk Walk-In Customer Slip
            </div>

            <div
              style={{
                margin: '1.25rem 0',
                padding: '1rem',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6ee7b7', fontWeight: 800, textTransform: 'uppercase' }}>
                YOUR TOKEN NUMBER
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>
                {tokenReceiptModal.tokenDisplay}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                {tokenReceiptModal.chairOrStation}
              </div>
            </div>

            <div style={{ textAlign: 'left', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px dashed #334155', borderBottom: '1px dashed #334155', padding: '0.75rem 0' }}>
              <div><strong>Client:</strong> {tokenReceiptModal.customerName}</div>
              <div><strong>Service:</strong> {tokenReceiptModal.serviceName}</div>
              <div><strong>Stylist:</strong> {tokenReceiptModal.stylistName}</div>
              <div><strong>Time Issued:</strong> {tokenReceiptModal.time}</div>
              <div><strong>Est. Bill:</strong> ₹{tokenReceiptModal.billAmount?.toLocaleString()}</div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              🔔 Please relax in the salon lounge. You will be called when your token turns live!
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  toast.success('Print command sent!');
                }}
                className="btn btn-secondary"
                style={{ flex: 1, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
              >
                <Printer style={{ width: '14px', height: '14px' }} />
                Print Slip
              </button>
              <button
                type="button"
                onClick={() => setTokenReceiptModal(null)}
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.8rem', background: '#10b981', border: 'none' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistFrontDeskPage;

