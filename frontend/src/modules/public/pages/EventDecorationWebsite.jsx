/**
 * @file EventDecorationWebsite.jsx
 * @description Master Luxury Event & Decoration Multi-Page Website for "Jay Gurudev Event & Management"
 * - Full-Width (100% Edge-to-Edge) Fluid Responsive Layout for All Screen Sizes
 * - Dedicated Page Navigation for Every Tab (Home, Aadiyogi Theme, 20ft Blueprint, Services, Gallery, Proposal, Contact)
 * - Real User Uploaded Images:
 *     /images/events/jay_gurudev_banner.jpg
 *     /images/events/aadiyogi_stage_dimensions.jpg (20ft x 15ft Blueprint)
 *     /images/events/aadiyogi_day_stage.jpg
 *     /images/events/bridal_entry_fireworks.jpg
 *     /images/events/flower_arch_tunnel.jpg
 *     /images/events/aadiyogi_nandi_trishul_setup.jpg
 *     /images/events/aadiyogi_safe_transport.jpg
 * - Real-Time Proposal Generator with LocalStorage Sync for Admin Panel & WhatsApp Dispatch
 * - Contact: 76519 72973 | Bhaisodi, Sarnath, Varanasi
 * @module frontend/src/modules/public/pages/EventDecorationWebsite
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  PartyPopper,
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  Phone,
  Camera,
  Music,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Star,
  Zap,
  Flame,
  CloudRain,
  Eye,
  X,
  Share2,
  MessageCircle,
  FileText,
  Sliders,
  Maximize2,
  ChevronRight,
  Layers,
  Award,
  Crown,
  Menu,
  Check,
  Heart,
  Home
} from 'lucide-react';

export default function EventDecorationWebsite() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read active tab from URL query params (default to 'HOME')
  const rawTab = searchParams.get('tab');
  const activeTab = (rawTab || 'HOME').toUpperCase();

  // Mobile menu drawer
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  // Gallery category filter
  const [galleryFilter, setGalleryFilter] = useState('ALL');

  // Change tab and update URL query param
  const switchTab = (tabId) => {
    setSearchParams({ tab: tabId.toLowerCase() });
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PROPOSAL & COST ESTIMATOR STATE
  // ══════════════════════════════════════════════════════════════════════════
  const [proposalConfig, setProposalConfig] = useState({
    eventType: 'Wedding & Jaimala (Grand Setup)',
    stageSize: '20ft x 15ft (Standard Grand Blueprint)',
    includeAadiyogi: true,
    bridalEntryArch: '15ft Glowing Flower Arch Tunnel',
    fogEffect: 'Stage + 1st Entry (Dry Ice Cloud)',
    crackerEffect: '4-Guns Cold Pyro Sparks',
    flowerType: 'Premium Hybrid (Fresh Orchids + Luxury Silks)',
    eventDate: '',
    clientName: '',
    clientPhone: '',
    venueLocation: 'Varanasi',
  });

  const proposalSummary = useMemo(() => {
    let base = 65000;
    if (proposalConfig.includeAadiyogi) base += 45000;
    if (proposalConfig.stageSize.includes('30ft')) base += 25000;
    if (proposalConfig.stageSize.includes('40ft')) base += 50000;
    if (proposalConfig.bridalEntryArch.includes('15ft')) base += 25000;
    if (proposalConfig.bridalEntryArch.includes('30ft')) base += 45000;
    if (proposalConfig.fogEffect.includes('Stage')) base += 12000;
    if (proposalConfig.crackerEffect.includes('4-Guns')) base += 10000;
    if (proposalConfig.crackerEffect.includes('8-Guns')) base += 18000;
    if (proposalConfig.flowerType.includes('Fresh')) base += 22000;

    const discount = Math.round(base * 0.15); // 15% Wedding Special discount
    const total = base - discount;
    return { base, discount, total };
  }, [proposalConfig]);

  // Dispatch proposal to WhatsApp & save to LocalStorage for Admin
  const handleSendToWhatsApp = () => {
    try {
      const newProp = {
        id: `PROP-${Date.now().toString().slice(-4)}`,
        clientName: proposalConfig.clientName || 'Website Client',
        phone: proposalConfig.clientPhone || '+91 76519 72973',
        eventType: proposalConfig.eventType,
        date: proposalConfig.eventDate || 'Upcoming Wedding Date',
        venue: proposalConfig.venueLocation,
        stageSize: proposalConfig.stageSize,
        includeAadiyogi: proposalConfig.includeAadiyogi,
        bridalEntry: proposalConfig.bridalEntryArch,
        effects: `${proposalConfig.fogEffect} + ${proposalConfig.crackerEffect}`,
        amount: proposalSummary.total,
        status: 'Pending Review',
        createdDate: new Date().toLocaleDateString('en-GB'),
      };
      const existing = JSON.parse(localStorage.getItem('jay_gurudev_proposals') || '[]');
      localStorage.setItem('jay_gurudev_proposals', JSON.stringify([newProp, ...existing]));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    const text = `*🔱 JAY GURUDEV EVENT & MANAGEMENT — WEDDING PROPOSAL REQUEST*
---------------------------------------------
*Event Type:* ${proposalConfig.eventType}
*Event Date:* ${proposalConfig.eventDate || 'Upcoming Wedding Date'}
*Venue / City:* ${proposalConfig.venueLocation}
*Client Name:* ${proposalConfig.clientName || 'Valued Client'}
*Contact:* ${proposalConfig.clientPhone || 'Not specified'}

*SELECTED GRAND SETUP SPECIFICATIONS:*
• *Stage Design:* ${proposalConfig.stageSize}
• *Aadiyogi Theme:* ${proposalConfig.includeAadiyogi ? 'YES (Grand Mahadev + Nandi + Trishul + Damru)' : 'No'}
• *Bridal Entry:* ${proposalConfig.bridalEntryArch}
• *Special Effects:* ${proposalConfig.fogEffect} + ${proposalConfig.crackerEffect}
• *Floral Selection:* ${proposalConfig.flowerType}

*PROPOSAL ESTIMATION:*
• Base Package Value: ₹${proposalSummary.base.toLocaleString()}
• Wedding Special Discount (15%): -₹${proposalSummary.discount.toLocaleString()}
*• Estimated Final Package: ₹${proposalSummary.total.toLocaleString()}*

Please confirm date availability and schedule our venue visit!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917651972973?text=${encoded}`, '_blank');
  };

  // Gallery items
  const galleryItems = [
    {
      id: 1,
      title: 'Aadiyogi Mahadev Stage — Full Daytime View',
      category: 'AADIYOGI',
      tag: 'Grand Stage',
      desc: 'Handcrafted black sculpted Shiva bust with golden sun-rays aura, Trishul pillars, Nandi in front and vibrant floral canopy.',
      src: '/images/events/aadiyogi_day_stage.jpg',
    },
    {
      id: 2,
      title: 'Royal Bridal Couple Entry with Cold Pyrotechnics',
      category: 'BRIDAL_ENTRY',
      tag: 'Cold Pyro Entry',
      desc: 'Dreamy red rose petal carpet pathway lined with safe cold fireworks sparkulars and floral borders.',
      src: '/images/events/bridal_entry_fireworks.jpg',
    },
    {
      id: 3,
      title: 'Illuminated Glowing Circular Arch Pathway',
      category: 'FLORAL_TUNNEL',
      tag: 'Enchanted Walkway',
      desc: 'Circular LED-illuminated arches adorned with cascading white & pink cherry blossom flowers on reflective black mirror flooring.',
      src: '/images/events/flower_arch_tunnel.jpg',
    },
    {
      id: 4,
      title: 'Aadiyogi 20ft x 15ft Architectural Stage Blueprint',
      category: 'BLUEPRINT',
      tag: '3D Render & Dimensions',
      desc: 'Official technical layout: 20ft Stage Width, 15ft Depth, 8ft Jaimala Platform, 6ft Nandi back area & 15ft Bridal Ramp.',
      src: '/images/events/aadiyogi_stage_dimensions.jpg',
    },
    {
      id: 5,
      title: 'Aadiyogi with Nandi, Golden Damru & Trishul Setup',
      category: 'AADIYOGI',
      tag: 'Production Unit',
      desc: 'Real production floor showcase of the high-detail Lord Shiva sculpture, Nandi with golden jewelry, pair of damrus and trishuls.',
      src: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
    },
    {
      id: 6,
      title: 'Official Jay Gurudev Wedding Special Package Banner',
      category: 'AADIYOGI',
      tag: 'Flagship Package',
      desc: 'Grand setup package highlighting Aadiyogi Theme Stage + Bridal Entry + Fog + Pyro + Floral in one single combo.',
      src: '/images/events/jay_gurudev_banner.jpg',
    },
    {
      id: 7,
      title: 'Safe Transit & Heavy Duty Steel Trolley Fabrication',
      category: 'PRODUCTION',
      tag: 'Safe Logistics',
      desc: 'Precision packaging with protective multi-layer film on heavy-duty caster-wheeled iron base for scratchless installation.',
      src: '/images/events/aadiyogi_safe_transport.jpg',
    },
  ];

  const filteredGallery = galleryFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === galleryFilter);

  return (
    <div style={{ background: '#0a0312', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', width: '100%', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. FULL-WIDTH TOP DIVINE RIBBON
         ══════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, #3b0764 0%, #7e22ce 30%, #b91c1c 70%, #d97706 100%)',
          color: '#ffffff',
          padding: '8px clamp(1rem, 3vw, 3rem)',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
            🔱 WEDDING SPECIAL
          </span>
          <span>Har Pal Ko Banayein Khaas... | Jay Gurudev Event & Management</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', fontSize: '12px' }}>
          <a
            href="tel:7651972973"
            style={{ color: '#ffffff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}
          >
            <Phone size={13} color="#facc15" />
            <span>+91 76519 72973</span>
          </a>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fef08a' }}>
            <MapPin size={13} color="#facc15" />
            <span>Bhaisodi, Sarnath, Varanasi</span>
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════════
          2. FULL-WIDTH STICKY LUXURY NAVIGATION HEADER
         ══════════════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          width: '100%',
          background: 'rgba(15, 7, 21, 0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0.85rem clamp(1rem, 3vw, 3rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxSizing: 'border-box',
        }}
      >
        {/* Brand Logo & Trishul */}
        <div
          onClick={() => switchTab('HOME')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #b45309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(250, 204, 21, 0.35)',
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: '24px', lineHeight: 1 }}>🔱</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.1 }}>
              Jay Gurudev
            </div>
            <div style={{ fontSize: '9.5px', color: '#facc15', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              EVENT & MANAGEMENT
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Direct Page Openers) */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'HOME', label: 'Home' },
            { id: 'AADIYOGI', label: '🔱 Aadiyogi Theme' },
            { id: 'DIMENSIONS', label: '📐 20ft Blueprint' },
            { id: 'SERVICES', label: 'Services' },
            { id: 'GALLERY', label: 'Gallery' },
            { id: 'PROPOSAL', label: 'Cost Estimator' },
            { id: 'CONTACT', label: 'Contact Us' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              style={{
                background: activeTab === item.id ? 'rgba(250, 204, 21, 0.18)' : 'transparent',
                border: activeTab === item.id ? '1px solid #facc15' : '1px solid transparent',
                color: activeTab === item.id ? '#facc15' : '#cbd5e1',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.84rem',
                fontWeight: activeTab === item.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Actions & Mobile Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              color: '#facc15',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Return to Master Platform Hub"
          >
            <Home size={15} />
            <span>🏠 Main Page</span>
          </button>

          <button
            onClick={() => setBookingModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
              color: '#0f172a',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '0.84rem',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(250, 204, 21, 0.35)',
            }}
          >
            <Sparkles size={16} />
            <span>Book Setup Now</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#facc15',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Sliders size={20} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Navigation Drawer ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(10, 3, 18, 0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 49,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
            NAVIGATION PAGES
          </div>
          {[
            { id: 'HOME', label: '🏠 Home Overview' },
            { id: 'AADIYOGI', label: '🔱 Aadiyogi Theme Package' },
            { id: 'DIMENSIONS', label: '📐 20ft Architecture Blueprint' },
            { id: 'SERVICES', label: '👑 Core Decor Services' },
            { id: 'GALLERY', label: '📸 Real Wedding Gallery' },
            { id: 'PROPOSAL', label: '📑 Instant Proposal Estimator' },
            { id: 'CONTACT', label: '📞 Contact & Booking Office' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => switchTab(item.id)}
              style={{
                background: activeTab === item.id ? 'rgba(250, 204, 21, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: activeTab === item.id ? '1px solid #facc15' : '1px solid rgba(255, 255, 255, 0.1)',
                color: activeTab === item.id ? '#facc15' : '#ffffff',
                padding: '12px 18px',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: 700,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}

          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '8px' }}>
              📍 Bhaisodi, Sarnath, Varanasi
            </div>
            <a
              href="tel:7651972973"
              style={{
                display: 'block',
                background: '#dc2626',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '10px',
                fontWeight: 900,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              📞 Call Now: 76519 72973
            </a>
          </div>
        </div>
      )}

      {/* ── Active Page Breadcrumb Banner (When not on Home) ── */}
      {activeTab !== 'HOME' && (
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #180527 0%, #2b0b42 100%)',
            borderBottom: '1px solid rgba(250, 204, 21, 0.2)',
            padding: '12px clamp(1rem, 3vw, 3rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => switchTab('HOME')}
              style={{ background: 'transparent', border: 'none', color: '#facc15', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <Home size={15} />
              <span>Home</span>
            </button>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/</span>
            <span style={{ color: '#ffffff', fontWeight: 700 }}>
              {activeTab === 'AADIYOGI' && '🔱 Aadiyogi Theme Package'}
              {activeTab === 'DIMENSIONS' && '📐 20ft Architecture Blueprint'}
              {activeTab === 'SERVICES' && '👑 Core Decor Services'}
              {activeTab === 'GALLERY' && '📸 Real Wedding Gallery'}
              {activeTab === 'PROPOSAL' && '📑 Custom Proposal Estimator'}
              {activeTab === 'CONTACT' && '📞 Contact & Office'}
            </span>
          </div>

          <button
            onClick={() => switchTab('HOME')}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#facc15',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              padding: '5px 12px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={13} />
            <span>Back to Home</span>
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          3. PAGE VIEW: HOME TAB
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'HOME' && (
        <>
          {/* Full-Width Hero Section */}
          <section
            style={{
              position: 'relative',
              width: '100%',
              padding: '4rem clamp(1rem, 4vw, 4rem) 5rem',
              minHeight: '85vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `radial-gradient(circle at 50% 30%, rgba(126, 34, 206, 0.35) 0%, rgba(10, 3, 18, 0.98) 70%), url('/images/events/jay_gurudev_banner.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderBottom: '1px solid rgba(234, 179, 8, 0.2)',
              boxSizing: 'border-box',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(10, 3, 18, 0.75) 0%, rgba(10, 3, 18, 0.92) 80%, #0a0312 100%)',
              }}
            />

            <div style={{ position: 'relative', zIndex: 10, width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              
              {/* Left Column */}
              <div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(250, 204, 21, 0.12)',
                    border: '1px solid rgba(250, 204, 21, 0.4)',
                    padding: '5px 14px',
                    borderRadius: '999px',
                    color: '#facc15',
                    fontSize: '12px',
                    fontWeight: 800,
                    marginBottom: '1.25rem',
                  }}
                >
                  <span>🔱</span>
                  <span>WEDDING SPECIAL GRAND SETUP PACKAGE</span>
                </div>

                <h1
                  style={{
                    fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: 1.15,
                    margin: '0 0 1rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Aadiyogi Theme Stage <br />
                  <span style={{ color: '#facc15', textShadow: '0 0 25px rgba(250, 204, 21, 0.4)' }}>
                    + Royal Bridal Entry
                  </span>
                  <br />
                  <span style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#f43f5e', fontWeight: 800 }}>
                    Ek Hi Package Mein!
                  </span>
                </h1>

                <p style={{ fontSize: '1.05rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.75rem', maxWidth: '640px' }}>
                  Varanasi’s most prestigious wedding decor and stage production by <strong>Jay Gurudev Event & Management</strong>.
                  Divine Aadiyogi Mahadev Stage with golden sun rays aura, Nandi, Trishuls, paired with a dreamy floral arch bridal entrance, cold fireworks sparkulars, and heavenly dry ice fog.
                </p>

                {/* 3 Core Pills */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  {[
                    { label: 'Divine Theme', color: '#facc15', icon: '🔱' },
                    { label: 'Royal Look', color: '#38bdf8', icon: '👑' },
                    { label: 'Memorable Moments', color: '#f43f5e', icon: '✨' },
                  ].map((pill, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(255, 255, 255, 0.06)',
                        border: `1px solid ${pill.color}55`,
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#ffffff',
                      }}
                    >
                      <span>{pill.icon}</span>
                      <span style={{ color: pill.color }}>{pill.label}</span>
                    </div>
                  ))}
                </div>

                {/* Direct Action Buttons */}
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setBookingModalOpen(true)}
                    style={{
                      background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
                      color: '#0f172a',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontWeight: 900,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 6px 20px rgba(250, 204, 21, 0.4)',
                    }}
                  >
                    <span>Book Grand Setup Now</span>
                    <ArrowRight size={18} />
                  </button>

                  <button
                    onClick={() => switchTab('DIMENSIONS')}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Maximize2 size={16} color="#facc15" />
                    <span>View 20ft Blueprint Page</span>
                  </button>

                  <button
                    onClick={() => switchTab('PROPOSAL')}
                    style={{
                      background: 'rgba(250, 204, 21, 0.15)',
                      color: '#facc15',
                      border: '1px solid #facc15',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FileText size={16} />
                    <span>Cost Estimator Page</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '2px solid rgba(250, 204, 21, 0.4)',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 40px rgba(234, 179, 8, 0.2)',
                    background: '#150921',
                  }}
                >
                  <img
                    src="/images/events/aadiyogi_day_stage.jpg"
                    alt="Aadiyogi Grand Stage Setup"
                    style={{
                      width: '100%',
                      height: '420px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />

                  {/* Overlay Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: 'linear-gradient(to top, rgba(10,3,18,0.95) 0%, rgba(10,3,18,0.4) 60%, transparent 100%)',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 800, textTransform: 'uppercase' }}>
                        SIGNATURE PRODUCTION
                      </div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                        Aadiyogi Wedding Stage
                      </div>
                      <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
                        Total Width 20ft • Depth 15ft • Handcrafted Sculpture
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveLightboxImg('/images/events/aadiyogi_day_stage.jpg')}
                      style={{
                        background: '#facc15',
                        color: '#0f172a',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontWeight: 800,
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={14} />
                      <span>View Full</span>
                    </button>
                  </div>
                </div>

                {/* Floating Mini Card */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    background: 'rgba(21, 9, 33, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    borderRadius: '14px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}
                >
                  <img
                    src="/images/events/bridal_entry_fireworks.jpg"
                    alt="Bridal Entry"
                    style={{ width: '44px', height: '44px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f43f5e' }}>
                      Royal Bridal Entry
                    </div>
                    <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
                      Cold Pyro & Flower Arch
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Quick Package Navigation Tiles (Full Width) */}
          <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', background: '#07020d', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
                EXPLORE JAY GURUDEV PAGES
              </span>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '8px 0 4px' }}>
                Dedicated Event & Decoration Portals
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#94a3b8' }}>
                Click any portal below to open its dedicated full page view.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {[
                { id: 'AADIYOGI', title: '🔱 Aadiyogi Theme Package', desc: '5 Core Pillars: Stage, Bridal Entry, Fog, Pyro & Floral in one combo.', img: '/images/events/aadiyogi_day_stage.jpg' },
                { id: 'DIMENSIONS', title: '📐 20ft Architectural Blueprint', desc: 'Precise 20ft × 15ft technical dimensions, Jaimala ramp & Nandi specs.', img: '/images/events/aadiyogi_stage_dimensions.jpg' },
                { id: 'SERVICES', title: '👑 Core Decor Services', desc: 'Banquets, Sangeet LED walls, theme lighting & wedding production.', img: '/images/events/bridal_entry_fireworks.jpg' },
                { id: 'GALLERY', title: '📸 Real Wedding Gallery', desc: 'High-res photos of real setups in Varanasi lawns and palaces.', img: '/images/events/flower_arch_tunnel.jpg' },
                { id: 'PROPOSAL', title: '📑 Custom Proposal Estimator', desc: 'Instant price calculator with direct 1-click WhatsApp quote dispatch.', img: '/images/events/jay_gurudev_banner.jpg' },
                { id: 'CONTACT', title: '📞 Contact & Office Location', desc: 'Office at Bhaisodi, Sarnath, Varanasi. Phone: 76519 72973.', img: '/images/events/aadiyogi_nandi_trishul_setup.jpg' },
              ].map((tile) => (
                <div
                  key={tile.id}
                  onClick={() => switchTab(tile.id)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(250, 204, 21, 0.25)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = '#facc15';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.25)';
                  }}
                >
                  <div style={{ height: '180px', overflow: 'hidden' }}>
                    <img src={tile.img} alt={tile.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                      {tile.title}
                    </h3>
                    <p style={{ margin: '0 0 10px', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {tile.desc}
                    </p>
                    <div style={{ color: '#facc15', fontSize: '0.82rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Open Dedicated Page</span>
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          4. PAGE VIEW: AADIYOGI THEME SPECIAL PAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'AADIYOGI' && (
        <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
              DEDICATED PAGE: 5 CORE PILLARS
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Aadiyogi Theme Stage + Bridal Entry Package
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto' }}>
              Everything in one comprehensive grand package designed exclusively by Jay Gurudev Event & Management.
            </p>
          </div>

          {/* Official Banner Full Width */}
          <div
            style={{
              width: '100%',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '2px solid rgba(250, 204, 21, 0.4)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              marginBottom: '3rem',
              cursor: 'pointer',
            }}
            onClick={() => setActiveLightboxImg('/images/events/jay_gurudev_banner.jpg')}
          >
            <img
              src="/images/events/jay_gurudev_banner.jpg"
              alt="Jay Gurudev Grand Setup Package"
              style={{ width: '100%', maxHeight: '460px', objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* The 5 Pillars Cards Full Width Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3.5rem' }}>
            
            {/* 1. Stage */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(250, 204, 21, 0.35)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🔱</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                1. Aadiyogi Theme Wedding Stage
              </h3>
              <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700, marginBottom: '8px' }}>
                Handcrafted Shiva Bust & Floral Setup
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                High-detail sculpted Lord Shiva bust with golden sun rays aura backdrop, sacred Nandi idol in front, dual golden damrus, 4 golden trishuls & royal bride-groom seating platform.
              </p>
            </div>

            {/* 2. Bridal Entry */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(244, 63, 94, 0.35)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🌸</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                2. Royal Bridal Entry Flower Arch
              </h3>
              <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700, marginBottom: '8px' }}>
                15ft Glowing Tunnel & Rose Petal Path
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Illuminated circular LED arches adorned with cascading white & pink cherry blossom flowers on reflective black mirrored flooring, creating an enchanting royal entrance.
              </p>
            </div>

            {/* 3. Fog Effect */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(56, 189, 248, 0.35)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>☁️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                3. Heavy Dry Ice Fog Effect
              </h3>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>
                Stage + 1st Entry Cloud Blanketing
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Dense, ground-hugging dry ice clouds that float across the floor during the bridal entry walk and envelope the stage during the divine Jaimala garland exchange.
              </p>
            </div>

            {/* 4. Cracker Effect */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(234, 179, 8, 0.35)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                4. Special Entry Cracker Effect
              </h3>
              <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700, marginBottom: '8px' }}>
                Safe Cold Pyro Sparkulars Display
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Certified 100% smoke-free, fire-hazard safe cold spark pyrotechnics that shoot sparkling golden fountains alongside the entry tunnel and behind the stage.
              </p>
            </div>

            {/* 5. Flower Decor */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(168, 85, 247, 0.35)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ fontSize: '32px', marginBottom: '1rem' }}>🌺</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                5. Fresh & Silk Flower Decoration
              </h3>
              <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700, marginBottom: '8px' }}>
                Exotic Floral Arrangements
              </div>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>
                Handcrafted combinations of fragrant fresh Indian roses, imported Dutch orchids, carnations, and luxury silk florals designed by master Varanasi artisans.
              </p>
            </div>

          </div>

          {/* Book Callout */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setBookingModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                color: '#0f172a',
                border: 'none',
                padding: '14px 32px',
                borderRadius: '12px',
                fontWeight: 900,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 6px 25px rgba(250, 204, 21, 0.4)',
              }}
            >
              Book Grand Package For Your Wedding Date →
            </button>
          </div>

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          5. PAGE VIEW: 20ft × 15ft ARCHITECTURE BLUEPRINT PAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'DIMENSIONS' && (
        <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
              DEDICATED PAGE: TECHNICAL BLUEPRINT
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              20ft × 15ft Architectural Blueprint & Dimensions
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto' }}>
              Every foot planned with precision to guarantee maximum camera coverage, bride-groom prominence, and guest visibility.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '3rem' }}>
            
            {/* Blueprint Diagram */}
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid rgba(250, 204, 21, 0.4)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveLightboxImg('/images/events/aadiyogi_stage_dimensions.jpg')}
            >
              <img
                src="/images/events/aadiyogi_stage_dimensions.jpg"
                alt="20ft Stage Dimensions Blueprint"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: '#facc15', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>
                🔍 Click to Zoom High-Res
              </div>
            </div>

            {/* Dimension Breakdown Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 800 }}>TOTAL STAGE FOOTPRINT</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff' }}>20 Feet Width × 15 Feet Depth</div>
                </div>
                <div style={{ background: '#facc15', color: '#0f172a', fontWeight: 900, padding: '6px 14px', borderRadius: '8px', fontSize: '12px' }}>
                  300 Sq.Ft Base
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>1. Jaimala & Bride-Groom Staging Area</span>
                  <span style={{ color: '#facc15', fontWeight: 800 }}>8 Feet Approx.</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                  Soft carpet/ramp platform with central royal seating thrones and floral stage stairs.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>2. Nandi + Shiva Statue Back Area</span>
                  <span style={{ color: '#facc15', fontWeight: 800 }}>6 Feet Approx.</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                  Elevated pedestal zone supporting the 2-ton Lord Shiva sculpture, Nandi, and sun rays aura.
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#ffffff' }}>3. Left & Right Seating & Decor Space</span>
                  <span style={{ color: '#facc15', fontWeight: 800 }}>6 Feet Each Side</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                  Symmetrical floral canopy pillars, warm background lighting & VIP photography staging.
                </div>
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.06)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#f43f5e' }}>4. Bridal Entry Flower Arch Carpet Path</span>
                  <span style={{ color: '#f43f5e', fontWeight: 800 }}>Width 4ft × Length 15ft</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
                  Continuous glowing flower tunnel extending from the entrance straight to the stage.
                </div>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          6. PAGE VIEW: CORE DECOR SERVICES PAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'SERVICES' && (
        <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
              DEDICATED PAGE: SERVICES CATALOG
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Wedding Decor & Stage Production Services
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto' }}>
              Full wedding venue transformation across Varanasi, Mirzapur, Jaunpur, Ghazipur, and Chandauli.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {[
              { title: 'Aadiyogi Mahadev Wedding Stage', category: 'Divine Theme', desc: 'Sculpted Lord Shiva bust, sun rays aura, Nandi, damrus, trishuls & floral stage.', img: '/images/events/aadiyogi_day_stage.jpg' },
              { title: 'Royal Bridal Entry with Cold Pyro', category: 'Special Entrance', desc: 'Flower arch tunnel with red carpet, rose petal shower & 100% safe cold sparkulars.', img: '/images/events/bridal_entry_fireworks.jpg' },
              { title: 'Illuminated Circular Flower Arches', category: 'Walkway Canopy', desc: 'Circular LED rings draped in white and pink cherry blossoms on reflective black floor.', img: '/images/events/flower_arch_tunnel.jpg' },
              { title: 'Heavy Dry Ice Cloud Fog Machine', category: 'Special Effects', desc: 'Dense, ground-level clouds covering walking paths and stage during Jaimala garland exchange.', img: '/images/events/jay_gurudev_banner.jpg' },
              { title: 'Haldi & Mehendi Vibrant Setups', category: 'Pre-Wedding', desc: 'Bright marigold canopies, traditional jhula seating, brass urlis and photobooths.', img: '/images/events/aadiyogi_nandi_trishul_setup.jpg' },
              { title: 'Curved LED Wall & Concert Lighting Truss', category: 'Sangeet & Cocktail', desc: 'High-definition P3 LED video backdrops, moving beam lights, laser effects & line-array sound.', img: '/images/events/aadiyogi_safe_transport.jpg' },
            ].map((srv, idx) => (
              <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(250, 204, 21, 0.25)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <img src={srv.img} alt={srv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    {srv.category}
                  </div>
                  <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                    {srv.title}
                  </h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.5 }}>
                    {srv.desc}
                  </p>
                  <button
                    onClick={() => switchTab('PROPOSAL')}
                    style={{ background: '#7e22ce', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '0.84rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Get Estimate →
                  </button>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          7. PAGE VIEW: REAL SETUP GALLERY PAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'GALLERY' && (
        <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
              DEDICATED PAGE: REAL WEDDING PHOTOS
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Jay Gurudev Production Photo Gallery
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto' }}>
              Authentic on-site photographs of our Aadiyogi Mahadev stages, bridal entrance flower arches, cold pyro sparks, and logistics fabrication.
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {[
              { id: 'ALL', label: 'All Photos' },
              { id: 'AADIYOGI', label: '🔱 Aadiyogi Stages' },
              { id: 'BRIDAL_ENTRY', label: '👑 Bridal Entry' },
              { id: 'FLORAL_TUNNEL', label: '🌸 Glowing Arches' },
              { id: 'BLUEPRINT', label: '📐 20ft Blueprints' },
              { id: 'PRODUCTION', label: '🚚 Logistics & Setup' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGalleryFilter(tab.id)}
                style={{
                  background: galleryFilter === tab.id ? '#facc15' : 'rgba(255, 255, 255, 0.05)',
                  color: galleryFilter === tab.id ? '#0f172a' : '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '0.86rem',
                  fontWeight: galleryFilter === tab.id ? 900 : 600,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Full Width Gallery Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onClick={() => setActiveLightboxImg(item.src)}
              >
                <div style={{ height: '260px', overflow: 'hidden' }}>
                  <img src={item.src} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          8. PAGE VIEW: PROPOSAL & COST ESTIMATOR PAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'PROPOSAL' && (
        <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
              DEDICATED PAGE: INSTANT ESTIMATOR
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Custom Wedding Proposal & Cost Calculator
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto' }}>
              Configure your exact wedding stage preferences, calculate live pricing, and send the proposal directly to WhatsApp or save for the Admin team.
            </p>
          </div>

          <div
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '20px',
              padding: 'clamp(1.5rem, 3vw, 2.5rem)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '2.5rem',
              boxSizing: 'border-box',
            }}
          >
            {/* Form Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Event Occasion
                </label>
                <select
                  value={proposalConfig.eventType}
                  onChange={(e) => setProposalConfig({ ...proposalConfig, eventType: e.target.value })}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.9rem' }}
                >
                  <option>Wedding & Jaimala (Grand Setup)</option>
                  <option>Sangeet & Cocktail Night</option>
                  <option>Haldi & Mehendi Celebration</option>
                  <option>Reception & Banquet Gala</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Stage Dimensions
                </label>
                <select
                  value={proposalConfig.stageSize}
                  onChange={(e) => setProposalConfig({ ...proposalConfig, stageSize: e.target.value })}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.9rem' }}
                >
                  <option>20ft x 15ft (Standard Grand Blueprint)</option>
                  <option>30ft x 20ft (Mega Lawn & Palace Setup)</option>
                  <option>40ft x 25ft (Royale Destination Wedding)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Aadiyogi Theme Stage Inclusion
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setProposalConfig({ ...proposalConfig, includeAadiyogi: true })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: proposalConfig.includeAadiyogi ? '2px solid #facc15' : '1px solid rgba(255,255,255,0.1)',
                      background: proposalConfig.includeAadiyogi ? 'rgba(250, 204, 21, 0.15)' : '#12051f',
                      color: proposalConfig.includeAadiyogi ? '#facc15' : '#cbd5e1',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    🔱 Include Aadiyogi (+Nandi +Trishul)
                  </button>
                  <button
                    type="button"
                    onClick={() => setProposalConfig({ ...proposalConfig, includeAadiyogi: false })}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: !proposalConfig.includeAadiyogi ? '2px solid #facc15' : '1px solid rgba(255,255,255,0.1)',
                      background: !proposalConfig.includeAadiyogi ? 'rgba(250, 204, 21, 0.15)' : '#12051f',
                      color: !proposalConfig.includeAadiyogi ? '#facc15' : '#cbd5e1',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    Classical Floral Mandap
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Bridal Entry Flower Tunnel
                </label>
                <select
                  value={proposalConfig.bridalEntryArch}
                  onChange={(e) => setProposalConfig({ ...proposalConfig, bridalEntryArch: e.target.value })}
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.9rem' }}
                >
                  <option>15ft Glowing Flower Arch Tunnel (Standard)</option>
                  <option>30ft Grand Canopy Tunnel with LED Rings</option>
                  <option>Simple Carpet Path with Flower Pedestals</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                    Dry Ice Fog Effect
                  </label>
                  <select
                    value={proposalConfig.fogEffect}
                    onChange={(e) => setProposalConfig({ ...proposalConfig, fogEffect: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.85rem' }}
                  >
                    <option>Stage + 1st Entry (Dry Ice Cloud)</option>
                    <option>Continuous Dual-Cloud Setup</option>
                    <option>No Fog Machine</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                    Cold Pyro Fireworks
                  </label>
                  <select
                    value={proposalConfig.crackerEffect}
                    onChange={(e) => setProposalConfig({ ...proposalConfig, crackerEffect: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.85rem' }}
                  >
                    <option>4-Guns Cold Pyro Sparks</option>
                    <option>8-Guns Synchronized Display</option>
                    <option>12-Guns Royal Finale Pyro</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={proposalConfig.clientName}
                    onChange={(e) => setProposalConfig({ ...proposalConfig, clientName: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 76519 72973"
                    value={proposalConfig.clientPhone}
                    onChange={(e) => setProposalConfig({ ...proposalConfig, clientPhone: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#12051f', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

            </div>

            {/* Price Card Right */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 11, 48, 0.95) 0%, rgba(18, 5, 31, 0.98) 100%)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                borderRadius: '16px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                  <Crown size={22} color="#facc15" />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                    Live Proposal Breakdown
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Stage Footprint:</span>
                    <strong style={{ color: '#ffffff' }}>{proposalConfig.stageSize.split('(')[0]}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Aadiyogi Mahadev:</span>
                    <strong style={{ color: proposalConfig.includeAadiyogi ? '#facc15' : '#94a3b8' }}>
                      {proposalConfig.includeAadiyogi ? 'Included' : 'Standard'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bridal Tunnel:</span>
                    <strong style={{ color: '#ffffff' }}>{proposalConfig.bridalEntryArch.split('(')[0]}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Special Effects:</span>
                    <strong style={{ color: '#38bdf8' }}>Fog + Cold Pyro</strong>
                  </div>

                  <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Standard List Price:</span>
                    <span style={{ textDecoration: 'line-through', color: '#94a3b8' }}>
                      ₹{proposalSummary.base.toLocaleString()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4ade80' }}>
                    <span>Wedding Package Discount (15%):</span>
                    <strong>-₹{proposalSummary.discount.toLocaleString()}</strong>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '1.5rem',
                    padding: '1.25rem',
                    background: 'rgba(250, 204, 21, 0.1)',
                    borderRadius: '12px',
                    border: '1px solid rgba(250, 204, 21, 0.3)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 800, textTransform: 'uppercase' }}>
                    Estimated Final Package
                  </div>
                  <div style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                    ₹{proposalSummary.total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    *Includes setup, transport, crane rigging & operational crew in Varanasi
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSendToWhatsApp}
                  style={{
                    background: '#22c55e',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.94rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(34, 197, 94, 0.35)',
                  }}
                >
                  <MessageCircle size={18} />
                  <span>Send Proposal to WhatsApp (76519 72973)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingModalOpen(true)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(250, 204, 21, 0.4)',
                    color: '#facc15',
                    padding: '11px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                  }}
                >
                  Reserve Wedding Date Directly →
                </button>
              </div>

            </div>

          </div>

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          9. PAGE VIEW: CONTACT & BOOKING OFFICE PAGE
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CONTACT' && (
        <section style={{ width: '100%', padding: '3.5rem clamp(1rem, 4vw, 4rem)', boxSizing: 'border-box' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '4px 14px', borderRadius: '999px', fontSize: '11px', fontWeight: 900 }}>
              DEDICATED PAGE: CONTACT OFFICE
            </span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Connect With Jay Gurudev Event & Management
            </h1>
            <p style={{ fontSize: '1rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto' }}>
              Visit our central workshop and production base in Sarnath, Varanasi or call our 24x7 wedding inquiry desk.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            
            {/* Contact Info Card */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '20px', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.3rem', fontWeight: 900, color: '#facc15' }}>
                Office & Workshop Address
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <MapPin size={20} color="#facc15" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <div>
                    <strong style={{ color: '#ffffff' }}>Production Base:</strong>
                    <div style={{ color: '#cbd5e1' }}>Bhaisodi, Sarnath, Varanasi, Uttar Pradesh - 221007</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Phone size={20} color="#facc15" flexShrink={0} />
                  <div>
                    <strong style={{ color: '#ffffff' }}>Direct Line:</strong>
                    <div>
                      <a href="tel:7651972973" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 800 }}>
                        +91 76519 72973
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MessageCircle size={20} color="#22c55e" flexShrink={0} />
                  <div>
                    <strong style={{ color: '#ffffff' }}>WhatsApp Official:</strong>
                    <div>
                      <a href="https://wa.me/917651972973" target="_blank" rel="noreferrer" style={{ color: '#4ade80', textDecoration: 'none', fontWeight: 700 }}>
                        Chat with Manager (76519 72973)
                      </a>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={20} color="#facc15" flexShrink={0} />
                  <div>
                    <strong style={{ color: '#ffffff' }}>Working Hours:</strong>
                    <div style={{ color: '#cbd5e1' }}>Monday to Sunday: 08:00 AM – 10:00 PM</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <button
                  onClick={() => setBookingModalOpen(true)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                    color: '#0f172a',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                  }}
                >
                  Schedule Venue Inspection Visit →
                </button>
              </div>
            </div>

            {/* Direct Reservation Form */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(250, 204, 21, 0.3)', borderRadius: '20px', padding: '2rem' }}>
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.3rem', fontWeight: 900, color: '#ffffff' }}>
                Direct Wedding Inquiry Form
              </h3>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! Your date inquiry has been sent to our manager. We will call you within 30 minutes.');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                    Your Full Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Anand Maurya"
                    style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#12051f', color: '#ffffff', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                      Contact Number
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 76519 72973"
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#12051f', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                      Wedding Date
                    </label>
                    <input
                      required
                      type="date"
                      style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#12051f', color: '#ffffff', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                    Venue / Lawn Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sarnath Heritage Lawn or Sigra Banquet"
                    style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: '#12051f', color: '#ffffff', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: '#7e22ce',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    marginTop: '6px',
                  }}
                >
                  Submit Inquiry
                </button>
              </form>
            </div>

          </div>

        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          10. FULL-WIDTH FOOTER
         ══════════════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          width: '100%',
          background: '#05010a',
          color: '#cbd5e1',
          padding: '4rem clamp(1rem, 4vw, 4rem) 2rem',
          borderTop: '1px solid rgba(234, 179, 8, 0.25)',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                🔱
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>Jay Gurudev</div>
                <div style={{ fontSize: '9px', color: '#facc15', fontWeight: 800, letterSpacing: '0.1em' }}>EVENT & MANAGEMENT</div>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '380px' }}>
              <em>Har Pal Ko Banayein Khaas...</em><br />
              Varanasi’s most celebrated wedding stage and decor masters. Specializing in Aadiyogi themes, flower tunnels, cold fireworks, and heavy dry ice fog.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>
              Setup Pages
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <button onClick={() => switchTab('AADIYOGI')} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                🔱 Aadiyogi Theme Stage Page
              </button>
              <button onClick={() => switchTab('DIMENSIONS')} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                📐 20ft Architecture Blueprint Page
              </button>
              <button onClick={() => switchTab('SERVICES')} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                👑 Core Decor Services Page
              </button>
              <button onClick={() => switchTab('GALLERY')} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                📸 Real Setup Gallery Page
              </button>
              <button onClick={() => switchTab('PROPOSAL')} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', textAlign: 'left', cursor: 'pointer', padding: 0 }}>
                📑 Proposal Estimator Page
              </button>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>
              Contact & Booking Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <div>📞 Phone: <strong>+91 76519 72973</strong></div>
              <div>📍 Location: Bhaisodi, Sarnath, Varanasi - 221007</div>
              <div>💬 WhatsApp: Active 24x7 for Wedding Bookings</div>
            </div>
          </div>

        </div>

        <div style={{ width: '100%', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © 2026 Jay Gurudev Event & Management. All Rights Reserved.
          </div>
          <div>
            Kashi Service Multi-Vertical Ecosystem • Varanasi, UP
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════
          11. MODAL: RESERVE WEDDING DATE
         ══════════════════════════════════════════════════════════════════════════ */}
      {bookingModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 1, 10, 0.88)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#150921',
              border: '2px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 25px 50px rgba(0,0,0,0.8)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={() => setBookingModalOpen(false)}
              style={{
                position: 'absolute',
                top: '1.25rem',
                right: '1.25rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#ffffff',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '28px' }}>🔱</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                  Reserve Wedding Date
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#facc15' }}>
                  Jay Gurudev Event & Management • Sarnath, Varanasi
                </p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you! Your date reservation request has been submitted. Our manager will call you within 30 minutes.');
                setBookingModalOpen(false);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                  Client Full Name
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0d0417', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                    Phone Number
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 76519 72973"
                    style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0d0417', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                    Wedding Date
                  </label>
                  <input
                    required
                    type="date"
                    style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0d0417', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                  Select Package
                </label>
                <select
                  style={{ width: '100%', padding: '11px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#0d0417', color: '#ffffff', fontSize: '0.85rem', boxSizing: 'border-box' }}
                >
                  <option>Grand Setup: Aadiyogi Stage + Bridal Entry Combo</option>
                  <option>Aadiyogi Stage Only (20ft x 15ft)</option>
                  <option>Bridal Entry Flower Tunnel + Fog + Cold Pyro</option>
                  <option>Full Wedding Lawn Complete Production</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  color: '#0f172a',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '6px',
                  boxShadow: '0 4px 15px rgba(250, 204, 21, 0.35)',
                }}
              >
                Confirm Date Booking
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          12. LIGHTBOX MODAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeLightboxImg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.94)',
            backdropFilter: 'blur(12px)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setActiveLightboxImg(null)}
        >
          <div style={{ position: 'relative', maxWidth: '95vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveLightboxImg(null)}
              style={{
                position: 'absolute',
                top: '-45px',
                right: '0',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={20} />
            </button>

            <img
              src={activeLightboxImg}
              alt="Enlarged setup"
              style={{
                maxWidth: '92vw',
                maxHeight: '85vh',
                borderRadius: '12px',
                border: '2px solid rgba(250, 204, 21, 0.4)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>
      )}

    </div>
  );
}
