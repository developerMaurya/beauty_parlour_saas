/**
 * @file AdminUnifiedRequestsPage.jsx
 * @description Unified Admin Manager for Global Customer Inquiries & Service Requests.
 * Displays all requests across all 5 business verticals:
 *   1. 💄 Golden Beauty Parlour (Bridal Makeovers, Spa, Packages)
 *   2. 🏡 Kashi Real Estate Plotting (Plot Inquiries, Site Visits)
 *   3. 🏢 Office & Godam Commercial Rent (Office Leases, Warehouse Tours)
 *   4. 🔱 Jay Gurudev Event Decoration (Aadiyogi Stage, Floral Tunnels, Pyro)
 *   5. 💻 RB Software & 4K Cinema Studio (Cloud SaaS, POS Billing, 4K Cinema, Drone)
 * @module frontend/src/modules/admin/pages/AdminUnifiedRequestsPage
 */

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Trash2,
  Filter,
  Search,
  RefreshCw,
  Home,
  Scissors,
  Trees,
  Building,
  Sparkles,
  Code2,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext.jsx';

export default function AdminUnifiedRequestsPage() {
  const { addToast } = useToast() || { addToast: () => {} };

  const [requests, setRequests] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Seed Data if empty
  const defaultSampleRequests = [
    {
      id: 'REQ-101',
      createdAt: '2026-11-10T14:30:00.000Z',
      customerId: 'CUST-8492',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@gmail.com',
      customerPhone: '9876543210',
      serviceType: 'parlour',
      serviceName: 'Royale Airbrush Bridal HD Makeover',
      eventDate: '2026-11-25',
      timeSlot: '11:00 AM',
      budget: '₹22,000',
      notes: 'Need heavy low fog entry and trial session before wedding date.',
      status: 'Confirmed',
    },
    {
      id: 'REQ-102',
      createdAt: '2026-11-10T16:15:00.000Z',
      customerId: 'CUST-3921',
      customerName: 'Rajesh Verma',
      customerEmail: 'rajesh.verma@outlook.com',
      customerPhone: '9812345678',
      serviceType: 'plotting',
      serviceName: 'Green Valley Enclave - Plot #P-12 (1200 Sq.Ft)',
      eventDate: '2026-11-15',
      timeSlot: '03:00 PM',
      budget: '₹15,00,000',
      notes: 'Interested in registry paperwork and 24-month EMI plan.',
      status: 'Pending',
    },
    {
      id: 'REQ-103',
      createdAt: '2026-11-11T09:20:00.000Z',
      customerId: 'CUST-5510',
      customerName: 'Amitabh Gupta',
      customerEmail: 'amitabh.logistics@gmail.com',
      customerPhone: '9765432109',
      serviceType: 'rent',
      serviceName: 'Ground Floor Commercial Godam (2,000 Sq.Ft)',
      eventDate: '2026-11-18',
      timeSlot: '12:00 PM',
      budget: '₹28,000 / month',
      notes: 'Looking for 3-year commercial lease with truck loading access.',
      status: 'Pending',
    },
    {
      id: 'REQ-104',
      createdAt: '2026-11-11T10:45:00.000Z',
      customerId: 'CUST-7742',
      customerName: 'Deepak Maurya',
      customerEmail: 'deepak.maurya@yahoo.com',
      customerPhone: '9888877777',
      serviceType: 'events',
      serviceName: '20ft Aadiyogi Theme Stage + Flower Archway',
      eventDate: '2026-12-05',
      timeSlot: '07:00 PM',
      budget: '₹1,25,000',
      notes: 'Need cold pyro fireworks and dry ice low fog cloud entry.',
      status: 'In Progress',
    },
    {
      id: 'REQ-105',
      createdAt: '2026-11-11T11:30:00.000Z',
      customerId: 'CUST-9120',
      customerName: 'Sanjay Agarwal',
      customerEmail: 'sanjay@techsolutions.com',
      customerPhone: '9845012345',
      serviceType: 'software',
      serviceName: 'OmniPOS Cloud Billing ERP + Dynamic UPI QR',
      eventDate: '2026-11-20',
      timeSlot: '04:00 PM',
      budget: '₹18,500',
      notes: 'Need thermal printer integration for 3 billing counters.',
      status: 'Confirmed',
    },
    {
      id: 'REQ-106',
      createdAt: '2026-11-11T12:00:00.000Z',
      customerId: 'CUST-6104',
      customerName: 'Aman & Sneha',
      customerEmail: 'aman.sneha@gmail.com',
      customerPhone: '9876512345',
      serviceType: 'photography',
      serviceName: 'Gold Cinematic Vivah Combo (4K FX3 + Drone + Album)',
      eventDate: '2026-12-12',
      timeSlot: 'Full Day',
      budget: '₹95,000',
      notes: 'Wedding at Taj Ganges. Need same-day Instagram Reels.',
      status: 'Confirmed',
    },
  ];

  const loadRequests = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('all_customer_service_requests') || '[]');
      if (stored.length === 0) {
        localStorage.setItem('all_customer_service_requests', JSON.stringify(defaultSampleRequests));
        setRequests(defaultSampleRequests);
      } else {
        setRequests(stored);
      }
    } catch {
      setRequests(defaultSampleRequests);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status: newStatus } : r));
    setRequests(updated);
    localStorage.setItem('all_customer_service_requests', JSON.stringify(updated));
    addToast?.(`Request ${id} marked as ${newStatus}`, 'success');
  };

  const handleDeleteRequest = (id) => {
    if (window.confirm(`Are you sure you want to delete request ${id}?`)) {
      const updated = requests.filter((r) => r.id !== id);
      setRequests(updated);
      localStorage.setItem('all_customer_service_requests', JSON.stringify(updated));
      addToast?.(`Request ${id} removed`, 'info');
    }
  };

  // Filter requests
  const filteredRequests = requests.filter((r) => {
    const matchesCategory =
      activeCategory === 'ALL' ||
      (activeCategory === 'parlour' && r.serviceType === 'parlour') ||
      (activeCategory === 'plotting' && r.serviceType === 'plotting') ||
      (activeCategory === 'rent' && r.serviceType === 'rent') ||
      (activeCategory === 'events' && r.serviceType === 'events') ||
      (activeCategory === 'software' && (r.serviceType === 'software' || r.serviceType === 'photography'));

    const matchesStatus = statusFilter === 'ALL' || r.status.toLowerCase() === statusFilter.toLowerCase();

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      r.customerName?.toLowerCase().includes(query) ||
      r.customerEmail?.toLowerCase().includes(query) ||
      r.customerPhone?.includes(query) ||
      r.serviceName?.toLowerCase().includes(query) ||
      r.id?.toLowerCase().includes(query);

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getServiceBadge = (type) => {
    switch (type) {
      case 'parlour':
        return { label: '💄 Golden Beauty Parlour', bg: '#fdf2f8', text: '#db2777', border: '#fbcfe8' };
      case 'plotting':
        return { label: '🏡 Kashi Plotting', bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'rent':
        return { label: '🏢 Office & Godam Rent', bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'events':
        return { label: '🔱 Jay Gurudev Events', bg: '#fefce8', text: '#ca8a04', border: '#fef08a' };
      case 'software':
        return { label: '💻 RB Software & Cloud', bg: '#eef2ff', text: '#4f46e5', border: '#c7d2fe' };
      case 'photography':
        return { label: '📸 RB 4K Studio & Drone', bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      default:
        return { label: '✨ General Service', bg: '#f8fafc', text: '#475569', border: '#e2e8f0' };
    }
  };

  const getStatusStyle = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'confirmed':
        return { bg: '#dcfce7', text: '#15803d', border: '#86efac' };
      case 'in progress':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' };
      case 'completed':
        return { bg: '#f1f5f9', text: '#334155', border: '#cbd5e1' };
      case 'cancelled':
        return { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5' };
      default: // Pending
        return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
    }
  };

  return (
    <div style={{ padding: 'clamp(1rem, 2.5vw, 2.5rem)', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#6366f1', letterSpacing: '0.08em' }}>
            GLOBAL CUSTOMER CRM & SERVICE DISPATCH
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 900, color: '#0f172a', margin: '4px 0 6px' }}>
            Customer Inquiries & Service Requests
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Unified incoming booking requests from Golden Beauty, Kashi Plotting, Office/Godam Rent, Jay Gurudev Events & RB Software.
          </p>
        </div>

        <button
          onClick={loadRequests}
          style={{
            padding: '9px 16px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1.5px solid #e2e8f0',
            color: '#334155',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          }}
        >
          <RefreshCw size={15} /> Refresh List
        </button>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Inquiries', count: requests.length, color: '#6366f1' },
          { label: 'Pending Review', count: requests.filter((r) => r.status === 'Pending').length, color: '#eab308' },
          { label: 'Confirmed Bookings', count: requests.filter((r) => r.status === 'Confirmed').length, color: '#22c55e' },
          { label: 'In Progress', count: requests.filter((r) => r.status === 'In Progress').length, color: '#0ea5e9' },
        ].map((m, mI) => (
          <div
            key={mI}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.25rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{m.label}</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: m.color, marginTop: '4px' }}>{m.count}</div>
          </div>
        ))}
      </div>

      {/* Filters Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        {/* Service Vertical Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#475569', marginRight: '6px' }}>Service:</span>
          {[
            { id: 'ALL', label: 'All Services (' + requests.length + ')' },
            { id: 'parlour', label: '💄 Golden Beauty' },
            { id: 'plotting', label: '🏡 Kashi Plotting' },
            { id: 'rent', label: '🏢 Office & Godam Rent' },
            { id: 'events', label: '🔱 Jay Gurudev Events' },
            { id: 'software', label: '💻 RB Software & Media' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 700,
                border: activeCategory === cat.id ? '1.5px solid #6366f1' : '1px solid #e2e8f0',
                background: activeCategory === cat.id ? '#6366f1' : '#f8fafc',
                color: activeCategory === cat.id ? '#ffffff' : '#475569',
                cursor: 'pointer',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search & Status Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by customer name, phone, email or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table / Cards */}
      {filteredRequests.length === 0 ? (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '3.5rem 1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔍</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 6px' }}>No inquiries match your filter</h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Try clearing filters or search query.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredRequests.map((req) => {
            const badge = getServiceBadge(req.serviceType);
            const statusStyle = getStatusStyle(req.status);

            return (
              <div
                key={req.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1.5rem',
                  flexWrap: 'wrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                {/* Left: Customer & Service Info */}
                <div style={{ flex: 2, minWidth: '280px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        padding: '3px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {badge.label}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>ID: {req.id}</span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>• {new Date(req.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
                    {req.serviceName}
                  </h3>

                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#475569', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <strong style={{ color: '#0f172a' }}>{req.customerName}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Phone size={13} color="#6366f1" />
                      <a href={`tel:${req.customerPhone}`} style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
                        {req.customerPhone}
                      </a>
                    </div>
                    {req.customerEmail && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={13} color="#64748b" />
                        <span>{req.customerEmail}</span>
                      </div>
                    )}
                  </div>

                  {/* Date, Time & Budget */}
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '12px', color: '#64748b', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px' }}>
                    {req.eventDate && (
                      <div>
                        📅 Target Date: <strong style={{ color: '#0f172a' }}>{req.eventDate}</strong>
                      </div>
                    )}
                    {req.timeSlot && (
                      <div>
                        ⏰ Preferred Time: <strong style={{ color: '#0f172a' }}>{req.timeSlot}</strong>
                      </div>
                    )}
                    {req.budget && (
                      <div>
                        💰 Budget / Quote: <strong style={{ color: '#16a34a' }}>{req.budget}</strong>
                      </div>
                    )}
                  </div>

                  {req.notes && (
                    <div style={{ fontSize: '12.5px', color: '#475569', fontStyle: 'italic', background: '#fffbeb', border: '1px solid #fef3c7', padding: '8px 12px', borderRadius: '8px' }}>
                      "{req.notes}"
                    </div>
                  )}
                </div>

                {/* Right: Status Dropdown & Action Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', minWidth: '180px' }}>
                  {/* Status Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Status:</span>
                    <select
                      value={req.status}
                      onChange={(e) => handleUpdateStatus(req.id, e.target.value)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 800,
                        background: statusStyle.bg,
                        color: statusStyle.text,
                        border: `1px solid ${statusStyle.border}`,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <a
                      href={`https://wa.me/91${req.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${req.customerName}, regarding your inquiry for ${req.serviceName} (Ref ID: ${req.id})...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        background: '#22c55e',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        boxShadow: '0 2px 6px rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <MessageSquare size={13} /> WhatsApp
                    </a>

                    <a
                      href={`tel:${req.customerPhone}`}
                      style={{
                        padding: '7px 12px',
                        borderRadius: '8px',
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        color: '#1e293b',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <Phone size={13} /> Call
                    </a>

                    <button
                      onClick={() => handleDeleteRequest(req.id)}
                      style={{
                        padding: '7px 9px',
                        borderRadius: '8px',
                        background: '#fff1f2',
                        border: '1px solid #fecaca',
                        color: '#ef4444',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                      title="Delete request"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
