/**
 * @file EventUsersManagement.jsx
 * @description Full Interactive Event Clients, Weddings, Stage Production Crew & Staff Management for Jay Gurudev Events.
 * Features search, filter, Add Client Modal, Add Staff Modal, status updates, and live KPI stats.
 * @module frontend/src/modules/admin/pages/EventUsersManagement
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  PartyPopper,
  Users,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  DollarSign,
  ShieldCheck,
  Trash2,
  X,
  ExternalLink,
  Sparkles,
  Award,
  Filter,
} from 'lucide-react';

const INITIAL_CLIENTS = [
  {
    id: 'evt_cli_01',
    name: 'Rajesh & Sunita Sharma',
    type: 'Royal Destination Wedding',
    event: 'Luxury Mandapam, Stage Decor & DJ Truss',
    date: '2026-11-28',
    dateDisplay: '28 Nov 2026',
    venue: 'Grand Regal Palace, Varanasi',
    phone: '+91 98111 22334',
    email: 'sharma.wedding@gmail.com',
    budget: 450000,
    advancePaid: 200000,
    guestCount: 850,
    status: 'IN_PRODUCTION', // 'IN_PRODUCTION' | 'CONFIRMED' | 'ADVANCE_PAID' | 'COMPLETED'
  },
  {
    id: 'evt_cli_02',
    name: 'Vikramaditya Verma',
    type: 'Sangeet & Cocktail Night',
    event: 'Concert DJ Stage, LED Truss & Lighting Show',
    date: '2026-12-02',
    dateDisplay: '02 Dec 2026',
    venue: 'Taj Nadesar Lawns, Varanasi',
    phone: '+91 98333 44556',
    email: 'verma.vikram@gmail.com',
    budget: 280000,
    advancePaid: 150000,
    guestCount: 450,
    status: 'CONFIRMED',
  },
  {
    id: 'evt_cli_03',
    name: 'Dr. Anand Mishra',
    type: 'Grand Reception Ceremony',
    event: 'Floral Tunnel Archway & Banquet Royal Stage',
    date: '2026-12-12',
    dateDisplay: '12 Dec 2026',
    venue: 'Riviera Riverfront Resort',
    phone: '+91 98444 55667',
    email: 'dr.mishra.anand@aiims.edu',
    budget: 320000,
    advancePaid: 120000,
    guestCount: 600,
    status: 'ADVANCE_PAID',
  },
  {
    id: 'evt_cli_04',
    name: 'Kapil & Neha Singhania',
    type: 'Haldi & Mehndi Setup',
    event: 'Yellow Bohemian Marigold Canopy & Photo Booths',
    date: '2026-12-18',
    dateDisplay: '18 Dec 2026',
    venue: 'Brijrama Heritage Courtyard',
    phone: '+91 98777 66554',
    email: 'singhania.events@outlook.com',
    budget: 180000,
    advancePaid: 90000,
    guestCount: 300,
    status: 'CONFIRMED',
  },
];

const INITIAL_STAFF = [
  {
    id: 'evt_stf_01',
    name: 'Amit Kumar',
    role: 'Head Floral Stage Designer',
    department: 'Floral Artistry',
    phone: '+91 98999 11223',
    venue: 'Grand Regal Palace Wedding',
    experience: '8 Years',
    dailyRate: 3500,
    status: 'ON_DUTY', // 'ON_DUTY' | 'STANDBY' | 'ON_LEAVE'
  },
  {
    id: 'evt_stf_02',
    name: 'Rohan Srivastava',
    role: 'Chief Sound & AV Lighting Engineer',
    department: 'Audio & Visuals',
    phone: '+91 98777 44556',
    venue: 'Taj Nadesar Sangeet Concert',
    experience: '6 Years',
    dailyRate: 4000,
    status: 'ON_DUTY',
  },
  {
    id: 'evt_stf_03',
    name: 'Karan Tiwari',
    role: 'Fast QR Gate Pass Coordinator',
    department: 'Gate Access Control',
    phone: '+91 98222 33445',
    venue: 'Riviera Resort Reception',
    experience: '3 Years',
    dailyRate: 2200,
    status: 'STANDBY',
  },
  {
    id: 'evt_stf_04',
    name: 'Sunil Vishwakarma',
    role: 'Heavy Truss & Fabricator Lead',
    department: 'Stage Infrastructure',
    phone: '+91 98555 12345',
    venue: 'Brijrama Heritage Courtyard',
    experience: '10 Years',
    dailyRate: 3200,
    status: 'ON_DUTY',
  },
];

export default function EventUsersManagement() {
  const [activeTab, setActiveTab] = useState('CLIENTS'); // 'CLIENTS' | 'STAFF'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Load state from localStorage or fallback
  const [clients, setClients] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_event_clients');
      return stored ? JSON.parse(stored) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [staff, setStaff] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_event_staff');
      return stored ? JSON.parse(stored) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  useEffect(() => {
    localStorage.setItem('kashi_event_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('kashi_event_staff', JSON.stringify(staff));
  }, [staff]);

  // Modal State
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [staffModalOpen, setStaffModalOpen] = useState(false);

  // Form State
  const [clientForm, setClientForm] = useState({
    name: '',
    type: 'Royal Destination Wedding',
    event: '',
    date: '',
    venue: '',
    phone: '',
    email: '',
    budget: '',
    advancePaid: '',
    guestCount: '',
    status: 'CONFIRMED',
  });

  const [staffForm, setStaffForm] = useState({
    name: '',
    role: '',
    department: 'Floral Artistry',
    phone: '',
    venue: '',
    experience: '',
    dailyRate: '',
    status: 'ON_DUTY',
  });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.phone || !clientForm.venue) {
      alert('Please fill out client name, phone and venue.');
      return;
    }
    const newClient = {
      id: `evt_cli_${Date.now()}`,
      name: clientForm.name,
      type: clientForm.type,
      event: clientForm.event || `${clientForm.type} Decor & Lighting`,
      date: clientForm.date || new Date().toISOString().split('T')[0],
      dateDisplay: clientForm.date ? new Date(clientForm.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Upcoming',
      venue: clientForm.venue,
      phone: clientForm.phone,
      email: clientForm.email || `${clientForm.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      budget: Number(clientForm.budget) || 250000,
      advancePaid: Number(clientForm.advancePaid) || 50000,
      guestCount: Number(clientForm.guestCount) || 500,
      status: clientForm.status,
    };
    setClients([newClient, ...clients]);
    setClientModalOpen(false);
    setClientForm({
      name: '',
      type: 'Royal Destination Wedding',
      event: '',
      date: '',
      venue: '',
      phone: '',
      email: '',
      budget: '',
      advancePaid: '',
      guestCount: '',
      status: 'CONFIRMED',
    });
  };

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!staffForm.name || !staffForm.role || !staffForm.phone) {
      alert('Please fill out staff name, role and phone.');
      return;
    }
    const newStaff = {
      id: `evt_stf_${Date.now()}`,
      name: staffForm.name,
      role: staffForm.role,
      department: staffForm.department,
      phone: staffForm.phone,
      venue: staffForm.venue || 'Varanasi Central Fleet',
      experience: staffForm.experience || '3 Years',
      dailyRate: Number(staffForm.dailyRate) || 2500,
      status: staffForm.status,
    };
    setStaff([newStaff, ...staff]);
    setStaffModalOpen(false);
    setStaffForm({
      name: '',
      role: '',
      department: 'Floral Artistry',
      phone: '',
      venue: '',
      experience: '',
      dailyRate: '',
      status: 'ON_DUTY',
    });
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Are you sure you want to remove this client?')) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      setStaff(staff.filter((s) => s.id !== id));
    }
  };

  const handleToggleClientStatus = (id) => {
    setClients(
      clients.map((c) => {
        if (c.id === id) {
          const next =
            c.status === 'CONFIRMED'
              ? 'IN_PRODUCTION'
              : c.status === 'IN_PRODUCTION'
              ? 'COMPLETED'
              : 'CONFIRMED';
          return { ...c, status: next };
        }
        return c;
      })
    );
  };

  // Filtered lists
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery);
      const matchStatus = statusFilter === 'ALL' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.venue.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'ALL' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [staff, searchQuery, statusFilter]);

  // Aggregate Metrics
  const totalBudget = clients.reduce((acc, c) => acc + (c.budget || 0), 0);
  const totalAdvance = clients.reduce((acc, c) => acc + (c.advancePaid || 0), 0);
  const activeCrewCount = staff.filter((s) => s.status === 'ON_DUTY').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* ── Top Header Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #7e22ce 50%, #581c87 100%)',
          color: '#ffffff',
          padding: '2rem 2.25rem',
          borderRadius: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(88, 28, 135, 0.25)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#f3e8ff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 12px',
                borderRadius: '999px',
                letterSpacing: '0.04em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <Sparkles size={12} color="#c084fc" />
              JAY GURUDEV EVENT & DECORATION ENTERPRISE
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff', letterSpacing: '-0.02em' }}>
            🎉 Event Clients & Production Crew Management
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#e9d5ff', maxWidth: '720px', lineHeight: 1.5 }}>
            Complete roster of wedding families, corporate hosts, stage florists, sound technicians, and gate QR pass security specialists.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setActiveTab('CLIENTS');
              setClientModalOpen(true);
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#ffffff',
              color: '#581c87',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}
          >
            <Plus size={16} />
            <span>+ Add Event Client</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('STAFF');
              setStaffModalOpen(true);
            }}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.3)',
              background: 'rgba(255,255,255,0.12)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>+ Add Decor Crew</span>
          </button>
        </div>
      </div>

      {/* ── 4 KPI Stats Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Active Event Clients</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#faf5ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>{clients.length} Bookings</div>
          <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: 700, marginTop: 4 }}>
            {clients.filter((c) => c.status === 'IN_PRODUCTION').length} In Live Production Today
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Gross Event Order Value</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669' }}>
            ₹{(totalBudget / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
            Advance Cleared: ₹{(totalAdvance / 100000).toFixed(2)}L
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Production Crew on Duty</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>{activeCrewCount} Technicians</div>
          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginTop: 4 }}>
            Total Roster: {staff.length} Specialists
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Gate QR Code Check-ins</span>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a' }}>
            {clients.reduce((s, c) => s + (c.guestCount || 0), 0)} Passes
          </div>
          <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 700, marginTop: 4 }}>
            Digital Security Gate Control
          </div>
        </div>
      </div>

      {/* ── Search, Filter & Tabs Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('CLIENTS')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'CLIENTS' ? '#ffffff' : 'transparent',
              color: activeTab === 'CLIENTS' ? '#581c87' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'CLIENTS' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Users size={15} />
            <span>Wedding & Event Clients ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('STAFF')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'STAFF' ? '#ffffff' : 'transparent',
              color: activeTab === 'STAFF' ? '#581c87' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: activeTab === 'STAFF' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <UserCheck size={15} />
            <span>Decor Crew & Technicians ({staff.length})</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, venue or phone..."
              style={{
                padding: '8px 12px 8px 34px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                width: '100%',
                outline: 'none',
              }}
            />
          </div>

          {/* Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              outline: 'none',
            }}
          >
            <option value="ALL">All Statuses</option>
            {activeTab === 'CLIENTS' ? (
              <>
                <option value="IN_PRODUCTION">In Production</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="ADVANCE_PAID">Advance Paid</option>
                <option value="COMPLETED">Completed</option>
              </>
            ) : (
              <>
                <option value="ON_DUTY">On Duty</option>
                <option value="STANDBY">Standby</option>
                <option value="ON_LEAVE">On Leave</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* ── CLIENTS TABLE ── */}
      {activeTab === 'CLIENTS' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                🎉 Confirmed Wedding & Banquet Clients ({filteredClients.length})
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Live production schedule, advance payments, and assigned banquet destinations.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>Client & Event</th>
                  <th style={{ padding: '12px 16px' }}>Date & Venue</th>
                  <th style={{ padding: '12px 16px' }}>Contact Details</th>
                  <th style={{ padding: '12px 16px' }}>Budget / Advance</th>
                  <th style={{ padding: '12px 16px' }}>Guests / Passes</th>
                  <th style={{ padding: '12px 16px' }}>Production Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      No event clients matching your filter. Click "+ Add Event Client" to create one.
                    </td>
                  </tr>
                ) : (
                  filteredClients.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>{c.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#7e22ce', fontWeight: 600, marginTop: 2 }}>{c.event}</div>
                        <span style={{ fontSize: '10.5px', background: '#faf5ff', color: '#7e22ce', padding: '2px 6px', borderRadius: 4, fontWeight: 700, marginTop: 4, display: 'inline-block' }}>
                          {c.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: '#0f172a' }}>
                          <Calendar size={13} color="#7e22ce" />
                          <span>{c.dateDisplay}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '12px', color: '#64748b', marginTop: 3 }}>
                          <MapPin size={12} />
                          <span>{c.venue}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#0f172a', fontWeight: 600 }}>
                          <Phone size={12} color="#059669" />
                          <a href={`tel:${c.phone}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                            {c.phone}
                          </a>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '11px', color: '#64748b', marginTop: 2 }}>
                          <Mail size={11} />
                          <span>{c.email}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#059669', fontSize: '14px' }}>
                          ₹{(c.budget).toLocaleString('en-IN')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>
                          Recv: ₹{(c.advancePaid).toLocaleString('en-IN')}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, color: '#0f172a' }}>
                          <ShieldCheck size={14} color="#7e22ce" />
                          <span>{c.guestCount} QR Passes</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => handleToggleClientStatus(c.id)}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            border: 'none',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            background:
                              c.status === 'IN_PRODUCTION'
                                ? '#fef3c7'
                                : c.status === 'CONFIRMED'
                                ? '#eff6ff'
                                : c.status === 'COMPLETED'
                                ? '#ecfdf5'
                                : '#f3e8ff',
                            color:
                              c.status === 'IN_PRODUCTION'
                                ? '#b45309'
                                : c.status === 'CONFIRMED'
                                ? '#1d4ed8'
                                : c.status === 'COMPLETED'
                                ? '#047857'
                                : '#7e22ce',
                          }}
                          title="Click to advance status"
                        >
                          ● {c.status.replace('_', ' ')}
                        </button>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                          <button
                            onClick={() => handleDeleteClient(c.id)}
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #fee2e2',
                              background: '#fef2f2',
                              color: '#dc2626',
                              cursor: 'pointer',
                            }}
                            title="Delete Client"
                          >
                            <Trash2 size={13} />
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
      )}

      {/* ── STAFF TABLE ── */}
      {activeTab === 'STAFF' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                🛠️ Decor Technicians, Stage Artists & Field Crew ({filteredStaff.length})
              </h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                On-duty staff, daily wages, assigned banquet destinations, and specialization departments.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>Technician / Artist</th>
                  <th style={{ padding: '12px 16px' }}>Department & Role</th>
                  <th style={{ padding: '12px 16px' }}>Current Venue Assignment</th>
                  <th style={{ padding: '12px 16px' }}>Contact Phone</th>
                  <th style={{ padding: '12px 16px' }}>Daily Wage</th>
                  <th style={{ padding: '12px 16px' }}>Duty Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                      No staff members matching your filter. Click "+ Add Decor Crew" to register a specialist.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '13.5px' }}>{s.name}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748b', marginTop: 2 }}>Exp: {s.experience}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#7e22ce' }}>{s.role}</div>
                        <span style={{ fontSize: '10.5px', background: '#faf5ff', color: '#7e22ce', padding: '2px 6px', borderRadius: 4, fontWeight: 700, marginTop: 3, display: 'inline-block' }}>
                          {s.department}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#0f172a', fontWeight: 600 }}>
                          <MapPin size={12} color="#059669" />
                          <span>{s.venue}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#0f172a', fontWeight: 600 }}>
                          <Phone size={12} color="#059669" />
                          <a href={`tel:${s.phone}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                            {s.phone}
                          </a>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>
                          ₹{Number(s.dailyRate).toLocaleString('en-IN')}/day
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: s.status === 'ON_DUTY' ? '#ecfdf5' : s.status === 'STANDBY' ? '#eff6ff' : '#fef2f2',
                            color: s.status === 'ON_DUTY' ? '#047857' : s.status === 'STANDBY' ? '#1d4ed8' : '#dc2626',
                          }}
                        >
                          ● {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteStaff(s.id)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid #fee2e2',
                            background: '#fef2f2',
                            color: '#dc2626',
                            cursor: 'pointer',
                          }}
                          title="Remove Staff"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══════════════════ MODAL: ADD CLIENT ═══════════════════ */}
      {clientModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                  🎉 Add New Wedding or Event Client
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Create booking entry in Jay Gurudev Events ledger
                </p>
              </div>
              <button onClick={() => setClientModalOpen(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Client Family / Host Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh & Meenakshi Agarwal"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Event Category
                  </label>
                  <select
                    value={clientForm.type}
                    onChange={(e) => setClientForm({ ...clientForm, type: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Royal Destination Wedding">Royal Destination Wedding</option>
                    <option value="Sangeet & Cocktail Night">Sangeet & Cocktail Night</option>
                    <option value="Grand Reception Ceremony">Grand Reception Ceremony</option>
                    <option value="Haldi & Mehndi Setup">Haldi & Mehndi Setup</option>
                    <option value="Corporate LED Stage">Corporate LED Stage</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={clientForm.date}
                    onChange={(e) => setClientForm({ ...clientForm, date: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Banquet Hall / Resort Venue *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Grand Regal Palace, Nadesar, Varanasi"
                  value={clientForm.venue}
                  onChange={(e) => setClientForm({ ...clientForm, venue: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98111 22334"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Total Budget (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="350000"
                    value={clientForm.budget}
                    onChange={(e) => setClientForm({ ...clientForm, budget: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Advance Cleared (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={clientForm.advancePaid}
                    onChange={(e) => setClientForm({ ...clientForm, advancePaid: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Estimated Guests (QR Passes)
                  </label>
                  <input
                    type="number"
                    placeholder="650"
                    value={clientForm.guestCount}
                    onChange={(e) => setClientForm({ ...clientForm, guestCount: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setClientModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#ffffff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(126,34,206,0.3)' }}
                >
                  Save Event Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════════ MODAL: ADD STAFF ═══════════════════ */}
      {staffModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '18px', width: '100%', maxWidth: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.3rem', fontWeight: 900, color: '#0f172a' }}>
                  🛠️ Register Decor & Production Crew
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Assign technician to stage & banquet logistics
                </p>
              </div>
              <button onClick={() => setStaffModalOpen(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Technician / Artist Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rameshwar Pal"
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Specialization Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Mandap Florist"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Department
                  </label>
                  <select
                    value={staffForm.department}
                    onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Floral Artistry">Floral Artistry</option>
                    <option value="Audio & Visuals">Audio & Visuals</option>
                    <option value="Stage Infrastructure">Stage Infrastructure</option>
                    <option value="Gate Access Control">Gate Access Control</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Daily Wage Rate (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="3000"
                    value={staffForm.dailyRate}
                    onChange={(e) => setStaffForm({ ...staffForm, dailyRate: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                  Assigned Venue / Event Project
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grand Regal Palace Wedding"
                  value={staffForm.venue}
                  onChange={(e) => setStaffForm({ ...staffForm, venue: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setStaffModalOpen(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#ffffff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', boxShadow: '0 4px 14px rgba(126,34,206,0.3)' }}
                >
                  Register Crew Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
