/**
 * @file EventDecorationDashboard.jsx
 * @description Master Luxury Admin Panel for "Jay Gurudev Event & Management"
 * Specializing in:
 *   - Aadiyogi Theme Wedding Stage (Mahadev Bust + Sun Rays Aura + Nandi + Trishul + Damru)
 *   - Royal Bridal Entry (15ft Illuminated Flower Arch Tunnel + Carpet)
 *   - Cold Pyro Fireworks & Dry Ice Heavy Cloud Fog Machines
 *   - Real-time Proposal & Quotations Management
 *   - Inventory Tracker for Sculptures, Stage Platforms, Hardware & Lighting
 *   - Client & Couple Directory with Advance Payment Ledgers
 * @module frontend/src/modules/admin/pages/EventDecorationDashboard
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PartyPopper, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Music, 
  Camera, 
  Utensils, 
  QrCode,
  Flame,
  CloudRain,
  Phone,
  ExternalLink,
  Plus,
  Eye,
  Layers,
  Crown,
  Search,
  Filter,
  ChevronDown,
  X,
  FileText,
  Share2,
  Check,
  TrendingUp,
  Box,
  Truck,
  Wrench,
  AlertCircle,
  MessageCircle,
  Maximize2
} from 'lucide-react';

export function EventDecorationDashboard() {
  const navigate = useNavigate();

  // Active top tab in Admin
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'STAGES' | 'PROPOSALS' | 'CLIENTS' | 'INVENTORY'
  const [searchQuery, setSearchQuery] = useState('');
  const [venueFilter, setVenueFilter] = useState('ALL');
  const [venueDropdownOpen, setVenueDropdownOpen] = useState(false);
  const [rangeFilter, setRangeFilter] = useState('Wedding Season 2026');
  const [rangeDropdownOpen, setRangeDropdownOpen] = useState(false);

  // Modals state
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [newProposalModalOpen, setNewProposalModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  // ══════════════════════════════════════════════════════════════════════════
  // 1. EVENT CONTRACTS & BOOKINGS DATA
  // ══════════════════════════════════════════════════════════════════════════
  const [eventContracts, setEventContracts] = useState([
    {
      id: 'JGD-2026-01',
      client: 'Rahul Sharma & Sneha',
      phone: '+91 98765 43210',
      type: 'Aadiyogi Theme Stage (20ft) + Royal Bridal Entry Arch',
      date: '18 Nov 2026',
      venue: 'Sarnath Heritage Lawn, Varanasi',
      status: 'In Production',
      totalAmount: 275000,
      advancePaid: 150000,
      balance: 125000,
      crewLead: 'Vikram Singh (Stage Master)',
      effects: 'Cold Pyro (8 Guns) + Dry Ice Cloud Fog',
    },
    {
      id: 'JGD-2026-02',
      client: 'Priya & Amit Wedding Gala',
      phone: '+91 94152 88910',
      type: 'Aadiyogi Grand Theme + 15ft Flower Tunnel + Jaimala Platform',
      date: '22 Nov 2026',
      venue: 'Taj Nadesar Convention Grounds',
      status: 'Confirmed',
      totalAmount: 340000,
      advancePaid: 200000,
      balance: 140000,
      crewLead: 'Sunil Verma (Florist Chief)',
      effects: 'Imported Orchids + LED Sun Rays Aura',
    },
    {
      id: 'JGD-2026-03',
      client: 'Verma Sangeet & Cocktail',
      phone: '+91 91200 44556',
      type: '30ft Curved LED Stage + Dynamic Lighting Truss',
      date: '25 Nov 2026',
      venue: 'Riviera Riverfront Lawns, Sigra',
      status: 'Confirmed',
      totalAmount: 220000,
      advancePaid: 100000,
      balance: 120000,
      crewLead: 'Rakesh Yadav (Lighting Tech)',
      effects: 'Sound Line-Array + 4 Pyro Guns',
    },
    {
      id: 'JGD-2026-04',
      client: 'Mishra 25th Silver Jubilee',
      phone: '+91 98390 11223',
      type: 'Golden Royale Floral Arch Mandap & Banquet Theme',
      date: '30 Nov 2026',
      venue: 'Grand Regal Palace, Cantt',
      status: 'Planning',
      totalAmount: 150000,
      advancePaid: 50000,
      balance: 100000,
      crewLead: 'Manoj Kumar (Fabricator)',
      effects: 'Fresh Roses + Velvet Draping',
    },
    {
      id: 'JGD-2026-05',
      client: 'Gupta Destination Wedding',
      phone: '+91 94500 77889',
      type: 'Aadiyogi Full Production + 30ft Glowing Floral Tunnel',
      date: '05 Dec 2026',
      venue: 'Ganga View Palace Grounds, Babatpur',
      status: 'Confirmed',
      totalAmount: 420000,
      advancePaid: 250000,
      balance: 170000,
      crewLead: 'Vikram Singh (Stage Master)',
      effects: '12 Pyro Guns + Dual Fog Machines',
    },
  ]);

  // ══════════════════════════════════════════════════════════════════════════
  // 2. PROPOSALS & QUOTATIONS DATA (Syncs with website)
  // ══════════════════════════════════════════════════════════════════════════
  const [proposals, setProposals] = useState([
    {
      id: 'PROP-101',
      clientName: 'Deepak Agrawal',
      phone: '+91 99351 22334',
      eventType: 'Wedding & Jaimala',
      date: '12 Dec 2026',
      venue: 'Kashi Vishwanath Corridor Lawn',
      stageSize: '20ft x 15ft Standard Grand',
      includeAadiyogi: true,
      bridalEntry: '15ft Glowing Flower Arch Tunnel',
      effects: 'Stage + 1st Entry (Fog + 8 Pyro)',
      flowerType: 'Fresh Orchids + Silk Florals',
      amount: 285000,
      status: 'Pending Review',
      createdDate: '10 Nov 2026',
    },
    {
      id: 'PROP-102',
      clientName: 'Sanjay Maurya',
      phone: '+91 98890 55667',
      eventType: 'Grand Sangeet & Reception',
      date: '15 Dec 2026',
      venue: 'Sarnath Luxury Resort',
      stageSize: '30ft x 20ft Mega Lawn',
      includeAadiyogi: true,
      bridalEntry: '30ft Grand Canopy Tunnel',
      effects: 'Dual Cloud Fog + 12 Pyro Guns',
      flowerType: 'Imported Dutch Exotic',
      amount: 375000,
      status: 'Accepted',
      createdDate: '09 Nov 2026',
    },
    {
      id: 'PROP-103',
      clientName: 'Ananya Pandey',
      phone: '+91 97920 12345',
      eventType: 'Haldi & Mehendi Celebration',
      date: '20 Dec 2026',
      venue: 'Cantt Officers Club Grounds',
      stageSize: '20ft Stage Platform',
      includeAadiyogi: false,
      bridalEntry: 'Simple Flower Pedestal Path',
      effects: 'No Pyro / Mild Fog',
      flowerType: 'Marigold & Sunflowers',
      amount: 110000,
      status: 'Proposal Sent',
      createdDate: '08 Nov 2026',
    },
  ]);

  // Read live proposals generated from public website from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('jay_gurudev_proposals');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProposals((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const newItems = parsed.filter((p) => !ids.has(p.id));
            return [...newItems, ...prev];
          });
        }
      }
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, []);

  // ══════════════════════════════════════════════════════════════════════════
  // 3. HARDWARE & STAGE INVENTORY LEDGER
  // ══════════════════════════════════════════════════════════════════════════
  const [inventory, setInventory] = useState([
    {
      id: 'INV-01',
      name: 'Aadiyogi Lord Shiva Bust Sculptures (High-Detail Black Finish)',
      category: 'Backdrop Sculpture',
      total: 2,
      inUse: 1,
      available: 1,
      location: 'Workshop Warehouse / Sarnath Heritage Lawn',
      condition: 'Excellent (Protective Wrapped)',
      img: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 'INV-02',
      name: 'Nandi Idols with Golden Jewelry Ornaments',
      category: 'Divine Sculpture',
      total: 2,
      inUse: 1,
      available: 1,
      location: 'Workshop Bay 2',
      condition: 'Pristine Gold Coating',
      img: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 'INV-03',
      name: 'Golden Damru Sets & Golden Trishul Steel Pillars',
      category: 'Stage Emblems',
      total: 8,
      inUse: 4,
      available: 4,
      location: 'Central Rigging Rack',
      condition: 'High Gloss Metallic Finish',
      img: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 'INV-04',
      name: 'Circular Glowing Flower Arches (Bridal Entry Rings)',
      category: 'Bridal Walkway',
      total: 12,
      inUse: 6,
      available: 6,
      location: 'Transit Trolleys (Bhaisodi)',
      condition: 'LED Strip Tested OK',
      img: '/images/events/flower_arch_tunnel.jpg',
    },
    {
      id: 'INV-05',
      name: 'Cold Pyro Sparkular Machines (Indoor/Outdoor Safe Non-Flammable)',
      category: 'Special Effects',
      total: 16,
      inUse: 8,
      available: 8,
      location: 'AV Tech Room',
      condition: 'Safety Certified Zero-Smoke',
      img: '/images/events/bridal_entry_fireworks.jpg',
    },
    {
      id: 'INV-06',
      name: 'Heavy Dry Ice Fog Machines (Dual Ground Cloud Nozzles)',
      category: 'Special Effects',
      total: 6,
      inUse: 2,
      available: 4,
      location: 'Cryo Storage Bay',
      condition: 'Tested Ready to Dispatch',
      img: '/images/events/jay_gurudev_banner.jpg',
    },
    {
      id: 'INV-07',
      name: 'Heavy Duty Caster-Wheeled Iron Transport Trolleys',
      category: 'Logistics',
      total: 4,
      inUse: 2,
      available: 2,
      location: 'Logistics Fleet',
      condition: 'High Bearing Load 2 Ton',
      img: '/images/events/aadiyogi_safe_transport.jpg',
    },
  ]);

  // Filtered contracts
  const filteredContracts = eventContracts.filter((c) => {
    const matchesSearch = c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVenue = venueFilter === 'ALL' || c.venue.includes(venueFilter);
    return matchesSearch && matchesVenue;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', paddingBottom: '3rem' }}>
      
      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BAR (Matching Reference Standard)
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
        {/* Left: Venue Filter & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setVenueDropdownOpen(!venueDropdownOpen)}
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
              <span>{venueFilter === 'ALL' ? 'All Wedding Venues ▾' : venueFilter}</span>
              <ChevronDown size={14} color="#64748b" />
            </button>

            {venueDropdownOpen && (
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
                  width: '280px',
                  zIndex: 50,
                  overflow: 'hidden',
                }}
              >
                {['ALL', 'Sarnath', 'Taj Nadesar', 'Riviera', 'Regal Palace', 'Babatpur'].map((ven, vIdx) => (
                  <div
                    key={vIdx}
                    onClick={() => {
                      setVenueFilter(ven);
                      setVenueDropdownOpen(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      fontSize: '0.82rem',
                      fontWeight: venueFilter === ven ? 700 : 500,
                      color: venueFilter === ven ? '#7e22ce' : '#334155',
                      background: venueFilter === ven ? '#faf5ff' : '#ffffff',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f1f5f9',
                    }}
                  >
                    {ven === 'ALL' ? 'All Venues & Lawns' : `${ven} Ground`}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '260px',
            }}
          >
            <Search size={15} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search wedding, client or stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.82rem',
                width: '100%',
                color: '#1e293b',
              }}
            />
          </div>
        </div>

        {/* Right: Actions, Public Website link & Admin profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => window.open('/events', '_blank')}
            style={{
              background: '#fef08a',
              color: '#854d0e',
              border: '1px solid #fde047',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>🔱 Live Website</span>
            <ExternalLink size={13} />
          </button>

          <button
            onClick={() => setNewBookingModalOpen(true)}
            style={{
              background: '#7e22ce',
              color: '#ffffff',
              border: 'none',
              padding: '7px 16px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 3px 10px rgba(126, 34, 206, 0.3)',
            }}
          >
            <Plus size={15} />
            <span>+ New Contract</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', borderLeft: '1px solid #e2e8f0' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
              alt="Super Admin"
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #7e22ce' }}
            />
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                Jay Gurudev Admin
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                Master Production Lead
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. PAGE SUBHEADER & SECONDARY NAVIGATION TABS
         ══════════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: '1.5rem 2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '20px' }}>🔱</span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              Jay Gurudev Event & Management Dashboard
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748b' }}>
            Managing <strong>Aadiyogi Mahadev Stage</strong>, Royal Bridal Flower Arches, Cold Pyro, and Dry Ice Fog contracts in Varanasi.
          </p>
        </div>

        {/* Date / Season Filter */}
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
            <span>{rangeFilter}</span>
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
                width: '180px',
                zIndex: 50,
                overflow: 'hidden',
              }}
            >
              {['Wedding Season 2026', 'This Month', 'Upcoming 90 Days', 'Full Year 2026'].map((r, rIdx) => (
                <div
                  key={rIdx}
                  onClick={() => {
                    setRangeFilter(r);
                    setRangeDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: rangeFilter === r ? 700 : 500,
                    color: rangeFilter === r ? '#7e22ce' : '#334155',
                    background: rangeFilter === r ? '#faf5ff' : '#ffffff',
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

      {/* ── Sub Tabs Bar (Dashboard | Aadiyogi Inventory | Proposals | Clients) ── */}
      <div style={{ padding: '0 2rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
          {[
            { id: 'DASHBOARD', label: '📊 Dashboard Overview' },
            { id: 'STAGES', label: '🔱 Aadiyogi & Stage Inventory' },
            { id: 'PROPOSALS', label: '📑 Customer Proposals & Quotes', count: proposals.length },
            { id: 'CLIENTS', label: '👥 Wedding Couples & Ledger', count: eventContracts.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? '#7e22ce' : '#ffffff',
                color: activeTab === tab.id ? '#ffffff' : '#475569',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#7e22ce' : '#cbd5e1',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === tab.id ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.25)' : '#f1f5f9',
                    color: activeTab === tab.id ? '#ffffff' : '#64748b',
                    fontSize: '10.5px',
                    fontWeight: 900,
                    padding: '1px 6px',
                    borderRadius: '999px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. TAB 1: DASHBOARD OVERVIEW
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DASHBOARD' && (
        <>
          {/* 4 KPI Metric Cards */}
          <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            
            {/* KPI 1 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>+22% ↑</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Wedding Contracts</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>14 Bookings</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>8 Aadiyogi Grand Setups</div>
            </div>

            {/* KPI 2 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Crown size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>100% Ready</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Aadiyogi Sculptures & Stages</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>2 Master Units</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>1 On Ground • 1 Ready in Transit</div>
            </div>

            {/* KPI 3 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>+18% ↑</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Cold Pyro & Fog Machines</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>22 Hardware Units</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>16 Sparkulars • 6 Cryo Foggers</div>
            </div>

            {/* KPI 4 */}
            <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '1.35rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={22} />
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#16a34a' }}>+28% ↑</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>Total Booking Volume</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a' }}>₹14.85 Lakh</div>
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>₹7.50L Advance Received</div>
            </div>

          </div>

          {/* Middle Row: Season Curve Chart & Theme Donut */}
          <div style={{ padding: '0 2rem 1.5rem', display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '1.25rem' }}>
            
            {/* Wave Chart: Season Booking Trend */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Wedding Season Production & Bookings
                </h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', fontWeight: 700 }}>
                  <span style={{ color: '#7e22ce' }}>● Aadiyogi Stages</span>
                  <span style={{ color: '#f59e0b' }}>● Bridal Entries</span>
                </div>
              </div>

              {/* SVG Wave Chart */}
              <div style={{ width: '100%', height: '200px' }}>
                <svg viewBox="0 0 600 180" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.28" />
                      <stop offset="100%" stopColor="#7e22ce" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="30" y1="30" x2="570" y2="30" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="75" x2="570" y2="75" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="120" x2="570" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />
                  <line x1="30" y1="150" x2="570" y2="150" stroke="#e2e8f0" strokeWidth="1" />

                  {/* Curve Area */}
                  <path
                    d="M 50 130 C 130 110, 200 90, 270 60 C 340 40, 420 50, 490 30 C 530 20, 560 15, 570 10 L 570 150 L 50 150 Z"
                    fill="url(#purpleGrad)"
                  />
                  {/* Curve Line */}
                  <path
                    d="M 50 130 C 130 110, 200 90, 270 60 C 340 40, 420 50, 490 30 C 530 20, 560 15, 570 10"
                    fill="none"
                    stroke="#7e22ce"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  {[[50, 130], [150, 105], [270, 60], [380, 45], [490, 30], [570, 10]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r="5" fill="#ffffff" stroke="#7e22ce" strokeWidth="3" />
                  ))}

                  <text x="45" y="168" fontSize="11" fill="#64748b" fontWeight="600">Sep</text>
                  <text x="145" y="168" fontSize="11" fill="#64748b" fontWeight="600">Oct</text>
                  <text x="260" y="168" fontSize="11" fill="#64748b" fontWeight="600">Nov (Peak)</text>
                  <text x="375" y="168" fontSize="11" fill="#64748b" fontWeight="600">Dec (Peak)</text>
                  <text x="480" y="168" fontSize="11" fill="#64748b" fontWeight="600">Jan</text>
                  <text x="560" y="168" fontSize="11" fill="#64748b" fontWeight="600">Feb</text>
                </svg>
              </div>
            </div>

            {/* Donut Chart: Theme Distribution */}
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Stage Theme Share
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                  <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {/* Aadiyogi Theme 55% (Purple) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#7e22ce" strokeWidth="18" strokeDasharray="131 239" strokeDashoffset="0" />
                    {/* Bridal Arches 25% (Gold) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#facc15" strokeWidth="18" strokeDasharray="60 239" strokeDashoffset="-131" />
                    {/* Classic Sangeet 20% (Rose) */}
                    <circle cx="50" cy="50" r="38" fill="none" stroke="#f43f5e" strokeWidth="18" strokeDasharray="48 239" strokeDashoffset="-191" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>14</div>
                    <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>Total</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7e22ce' }}></span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Aadiyogi (55%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15' }}></span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>Bridal Arch (25%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }}></span>
                    <span style={{ color: '#475569', fontWeight: 600 }}>LED & Sangeet (20%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Table: Active Wedding Contracts */}
          <div style={{ padding: '0 2rem' }}>
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  Active Wedding Contracts & Schedules
                </h3>
                <button
                  onClick={() => setActiveTab('CLIENTS')}
                  style={{ background: 'transparent', border: 'none', color: '#7e22ce', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer' }}
                >
                  View All Clients →
                </button>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>
                      <th style={{ padding: '10px 12px' }}>ID & Client</th>
                      <th style={{ padding: '10px 12px' }}>Setup Theme</th>
                      <th style={{ padding: '10px 12px' }}>Date</th>
                      <th style={{ padding: '10px 12px' }}>Venue Location</th>
                      <th style={{ padding: '10px 12px' }}>Budget</th>
                      <th style={{ padding: '10px 12px' }}>Advance Paid</th>
                      <th style={{ padding: '10px 12px', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContracts.map((c, i) => (
                      <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px' }}>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{c.client}</div>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.id} • {c.phone}</div>
                        </td>
                        <td style={{ padding: '12px', color: '#334155' }}>
                          <div style={{ fontWeight: 600 }}>{c.type}</div>
                          <div style={{ fontSize: '0.72rem', color: '#7e22ce', fontWeight: 700 }}>{c.effects}</div>
                        </td>
                        <td style={{ padding: '12px', color: '#64748b' }}>{c.date}</td>
                        <td style={{ padding: '12px', color: '#475569' }}>{c.venue}</td>
                        <td style={{ padding: '12px', fontWeight: 800, color: '#0f172a' }}>
                          ₹{c.totalAmount.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#16a34a' }}>
                          ₹{c.advancePaid.toLocaleString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <span
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: c.status === 'Confirmed' ? '#dcfce7' : c.status === 'In Production' ? '#fef3c7' : '#f3e8ff',
                              color: c.status === 'Confirmed' ? '#15803d' : c.status === 'In Production' ? '#b45309' : '#7e22ce',
                            }}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. TAB 2: AADIYOGI & STAGE INVENTORY
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'STAGES' && (
        <div style={{ padding: '0 2rem' }}>
          
          {/* Blueprint Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #180527 0%, #2b0b42 100%)',
              borderRadius: '16px',
              border: '2px solid rgba(250, 204, 21, 0.4)',
              padding: '1.75rem',
              color: '#ffffff',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ background: '#facc15', color: '#0f172a', fontSize: '10.5px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>
                  20ft × 15ft MASTER BLUEPRINT
                </span>
                <span style={{ fontSize: '12px', color: '#facc15' }}>Official Architectural Specifications</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0 0 4px', color: '#ffffff' }}>
                Aadiyogi Theme Stage & Bridal Ramp Blueprint
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '600px' }}>
                20ft Total Width • 15ft Total Depth • 8ft Jaimala Ramp • 6ft Nandi Back Area • 15ft Bridal Arch Tunnel.
              </p>
            </div>

            <button
              onClick={() => setBlueprintModalOpen(true)}
              style={{
                background: '#facc15',
                color: '#0f172a',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 900,
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Maximize2 size={16} />
              <span>Open Blueprint Modal</span>
            </button>
          </div>

          {/* Hardware & Sculpture Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {inventory.map((inv) => (
              <div
                key={inv.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={inv.img}
                      alt={inv.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(15, 23, 42, 0.85)',
                        color: '#facc15',
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {inv.category}
                    </div>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      {inv.name}
                    </h4>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '8px' }}>
                      📍 <strong>Location:</strong> {inv.location}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 700 }}>
                      ✓ {inv.condition}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: '10px 1.25rem',
                    background: '#f8fafc',
                    borderTop: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.8rem',
                  }}
                >
                  <span>Total: <strong>{inv.total}</strong></span>
                  <span style={{ color: '#ea580c' }}>In Use: <strong>{inv.inUse}</strong></span>
                  <span style={{ color: '#16a34a' }}>Available: <strong>{inv.available}</strong></span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. TAB 3: PROPOSALS & QUOTATIONS MANAGER
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'PROPOSALS' && (
        <div style={{ padding: '0 2rem' }}>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
                  Client Wedding Proposals & Estimates
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#64748b' }}>
                  Review custom quotations submitted from the public website or generated by admin.
                </p>
              </div>

              <button
                onClick={() => setNewProposalModalOpen(true)}
                style={{
                  background: '#7e22ce',
                  color: '#ffffff',
                  border: 'none',
                  padding: '9px 18px',
                  borderRadius: '8px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={16} />
                <span>+ Create Custom Proposal</span>
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                    <th style={{ padding: '10px 12px' }}>Proposal ID</th>
                    <th style={{ padding: '10px 12px' }}>Client & Contact</th>
                    <th style={{ padding: '10px 12px' }}>Occasion & Date</th>
                    <th style={{ padding: '10px 12px' }}>Configured Package</th>
                    <th style={{ padding: '10px 12px' }}>Estimated Price</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((prop) => (
                    <tr key={prop.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#64748b' }}>{prop.id}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{prop.clientName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{prop.phone}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{prop.eventType}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{prop.date} • {prop.venue}</div>
                      </td>
                      <td style={{ padding: '12px', color: '#334155' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7e22ce' }}>
                          {prop.stageSize}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                          {prop.bridalEntry} • {prop.effects}
                        </div>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 900, color: '#16a34a', fontSize: '0.95rem' }}>
                        ₹{prop.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            background: prop.status === 'Accepted' ? '#dcfce7' : prop.status === 'Pending Review' ? '#fef3c7' : '#f3e8ff',
                            color: prop.status === 'Accepted' ? '#15803d' : prop.status === 'Pending Review' ? '#b45309' : '#7e22ce',
                          }}
                        >
                          {prop.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button
                            onClick={() => {
                              const text = `*JAY GURUDEV EVENT & MANAGEMENT PROPOSAL*
Dear ${prop.clientName},
Your quotation for ${prop.eventType} on ${prop.date} at ${prop.venue} is approved!
Total Package: ₹${prop.amount.toLocaleString()}
Please call 76519 72973 to finalize contract.`;
                              window.open(`https://wa.me/${prop.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                            }}
                            style={{
                              background: '#22c55e',
                              color: '#ffffff',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <MessageCircle size={13} />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          6. TAB 4: CLIENT & COUPLE DIRECTORY
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CLIENTS' && (
        <div style={{ padding: '0 2rem' }}>
          
          <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a' }}>
              Wedding Clients & Payment Ledger
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {eventContracts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    background: '#f8fafc',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ background: '#7e22ce', color: '#ffffff', fontSize: '10.5px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                        {c.id}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>
                        {c.status}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {c.client}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      📞 {c.phone}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '4px' }}>
                      📍 {c.venue}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7e22ce', fontWeight: 600, marginTop: '4px' }}>
                      {c.type}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Contract Value</div>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>₹{c.totalAmount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Advance Paid</div>
                      <div style={{ fontWeight: 800, color: '#16a34a' }}>₹{c.advancePaid.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>Balance Due</div>
                      <div style={{ fontWeight: 800, color: '#dc2626' }}>₹{c.balance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          7. MODAL: 20ft BLUEPRINT & TECHNICAL SPECIFICATIONS
         ══════════════════════════════════════════════════════════════════════════ */}
      {blueprintModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 1, 10, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setBlueprintModalOpen(false)}
        >
          <div
            style={{
              maxWidth: '920px',
              width: '100%',
              background: '#150921',
              borderRadius: '20px',
              border: '2px solid #facc15',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#facc15' }}>
                  Aadiyogi Theme Stage: 20ft × 15ft Architectural Dimensions
                </h3>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  Width 20ft • Depth 15ft • Ramp 15ft • Sarnath Workshop Technical Specs
                </div>
              </div>
              <button
                onClick={() => setBlueprintModalOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <img
              src="/images/events/aadiyogi_stage_dimensions.jpg"
              alt="Blueprint Dimensions"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          8. MODAL: + NEW BOOKING CONTRACT
         ══════════════════════════════════════════════════════════════════════════ */}
      {newBookingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
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
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setNewBookingModalOpen(false)}
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7e22ce' }}>
                <PartyPopper size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  Create Wedding Decor Contract
                </h3>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Jay Gurudev Event & Management • Sarnath, Varanasi
                </div>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Wedding contract created and stage hardware locked!');
                setNewBookingModalOpen(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Couple / Client Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh & Pooja Wedding"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Contact Phone
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Event Date
                  </label>
                  <input
                    required
                    type="date"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Stage Theme Selection
                </label>
                <select
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option>🔱 Aadiyogi Grand Theme Stage (20ft) + Royal Bridal Entry Arch</option>
                  <option>🔱 Aadiyogi Mega Theme Stage (30ft) + 30ft Flower Arch Tunnel</option>
                  <option>🌸 Royale Heritage Floral Mandap & Floating Aisle</option>
                  <option>✨ Cinematic Concert LED Stage & 3D Lighting Truss</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Venue Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarnath Heritage Lawn / Taj Nadesar"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Total Amount (₹)
                  </label>
                  <input
                    type="text"
                    defaultValue="₹2,75,000"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Advance Token (₹)
                  </label>
                  <input
                    type="text"
                    defaultValue="₹1,00,000"
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setNewBookingModalOpen(false)}
                  style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#ffffff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Book & Lock Hardware
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          9. MODAL: + CREATE CUSTOM PROPOSAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {newProposalModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
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
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setNewProposalModalOpen(false)}
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

            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
              Create Custom Wedding Proposal
            </h3>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.84rem', color: '#64748b' }}>
              Generate an official quotation for client with automatic package discounts.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Proposal generated and ready to share via WhatsApp!');
                setNewProposalModalOpen(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Client Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Vikas Maurya"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Client WhatsApp Phone
                </label>
                <input
                  required
                  type="tel"
                  placeholder="e.g. 76519 72973"
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Aadiyogi Theme Package Options
                </label>
                <select
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#f8fafc' }}
                >
                  <option>Full Combo: Aadiyogi Stage + Bridal Arch + Cold Pyro + Dry Ice Fog (₹2,75,000)</option>
                  <option>Grand Stage Only: 20ft Aadiyogi Mahadev (₹1,50,000)</option>
                  <option>Bridal Walkway Only: 15ft Flower Arch Tunnel + Pyro (₹75,000)</option>
                  <option>Mega 30ft Stage + Dual Fog Machine (₹3,50,000)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  background: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  marginTop: '6px',
                }}
              >
                Save & Dispatch to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default EventDecorationDashboard;
