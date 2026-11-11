/**
 * @file EventDecorationWebsite.jsx
 * @description Master Luxury Event & Decoration Website for "Jay Gurudev Event & Management"
 * Tagline: "Har Pal Ko Banayein Khaas..."
 * Signature Package: "Wedding Special Grand Setup Package - Aadiyogi Theme Stage + Bridal Entry Ek Hi Package Mein"
 * Inclusions:
 *   1. Aadiyogi Theme Wedding Stage (Decor & Flower Setup)
 *   2. Bridal Entry (Flower Arch / Tunnel)
 *   3. Fog Effect (1st Entry + Stage)
 *   4. Cracker Effect (Cold Pyro Fireworks)
 *   5. Flower Decoration (Real / Artificial)
 * Features:
 *   - Real user photos integration:
 *       /images/events/jay_gurudev_banner.jpg
 *       /images/events/aadiyogi_stage_dimensions.jpg (20ft x 15ft Blueprint)
 *       /images/events/aadiyogi_day_stage.jpg
 *       /images/events/bridal_entry_fireworks.jpg
 *       /images/events/flower_arch_tunnel.jpg
 *       /images/events/aadiyogi_nandi_trishul_setup.jpg
 *       /images/events/aadiyogi_safe_transport.jpg
 *   - Interactive Stage Dimension & Blueprint Explorer
 *   - Real-time Interactive Wedding Proposal & Quotation Generator with WhatsApp dispatch
 *   - Filterable Gallery with HD Lightbox
 *   - Booking Date Modal
 *   - Contact: 76519 72973 | Bhaisodi, Sarnath, Varanasi
 * @module frontend/src/modules/public/pages/EventDecorationWebsite
 */

import React, { useState, useMemo } from 'react';
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
  Crown
} from 'lucide-react';

export default function EventDecorationWebsite() {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState('HOME');

  // Modals state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  // Gallery filter
  const [galleryFilter, setGalleryFilter] = useState('ALL');

  // ══════════════════════════════════════════════════════════════════════════
  // PROPOSAL / QUOTATION CALCULATOR STATE
  // ══════════════════════════════════════════════════════════════════════════
  const [proposalConfig, setProposalConfig] = useState({
    eventType: 'Wedding & Jaimala',
    stageSize: '20ft x 15ft (Standard Grand)',
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

  // Calculate dynamic proposal price
  const proposalSummary = useMemo(() => {
    let base = 65000; // Base wedding setup
    if (proposalConfig.includeAadiyogi) base += 45000;
    if (proposalConfig.stageSize.includes('30ft')) base += 25000;
    if (proposalConfig.stageSize.includes('40ft')) base += 50000;
    if (proposalConfig.bridalEntryArch.includes('15ft')) base += 25000;
    if (proposalConfig.bridalEntryArch.includes('30ft')) base += 45000;
    if (proposalConfig.fogEffect.includes('Stage')) base += 12000;
    if (proposalConfig.crackerEffect.includes('4-Guns')) base += 10000;
    if (proposalConfig.crackerEffect.includes('8-Guns')) base += 18000;
    if (proposalConfig.flowerType.includes('Fresh')) base += 22000;

    const discount = Math.round(base * 0.15); // 15% Wedding Special Package discount
    const total = base - discount;
    return { base, discount, total };
  }, [proposalConfig]);

  // Gallery Assets
  const galleryItems = [
    {
      id: 1,
      title: 'Aadiyogi Mahadev Stage — Full Daytime View',
      category: 'AADIYOGI',
      tag: 'Grand Stage',
      desc: 'Handcrafted black sculpted Shiva bust with golden sun-rays aura, Trishul pillars, Nandi in front and vibrant floral canopy.',
      src: '/images/events/aadiyogi_day_stage.jpg',
      aspect: 'landscape',
    },
    {
      id: 2,
      title: 'Royal Bridal Couple Entry with Cold Pyrotechnics',
      category: 'BRIDAL_ENTRY',
      tag: 'Cold Pyro Entry',
      desc: 'Dreamy red rose petal carpet pathway lined with safe cold fireworks sparkulars and floral borders.',
      src: '/images/events/bridal_entry_fireworks.jpg',
      aspect: 'portrait',
    },
    {
      id: 3,
      title: 'Illuminated Glowing Circular Arch Pathway',
      category: 'FLORAL_TUNNEL',
      tag: 'Enchanted Walkway',
      desc: 'Circular LED-illuminated arches adorned with cascading white & pink cherry blossom flowers on reflective black mirror flooring.',
      src: '/images/events/flower_arch_tunnel.jpg',
      aspect: 'portrait',
    },
    {
      id: 4,
      title: 'Aadiyogi 20ft x 15ft Architectural Stage Blueprint',
      category: 'BLUEPRINT',
      tag: '3D Render & Dimensions',
      desc: 'Official technical layout: 20ft Stage Width, 15ft Depth, 8ft Jaimala Platform, 6ft Nandi back area & 15ft Bridal Ramp.',
      src: '/images/events/aadiyogi_stage_dimensions.jpg',
      aspect: 'landscape',
    },
    {
      id: 5,
      title: 'Aadiyogi with Nandi, Golden Damru & Trishul Workshop Setup',
      category: 'AADIYOGI',
      tag: 'Production Unit',
      desc: 'Real production floor showcase of the high-detail Lord Shiva sculpture, Nandi with golden jewelry, pair of damrus and trishuls.',
      src: '/images/events/aadiyogi_nandi_trishul_setup.jpg',
      aspect: 'landscape',
    },
    {
      id: 6,
      title: 'Official Jay Gurudev Wedding Special Package Banner',
      category: 'AADIYOGI',
      tag: 'Flagship Package',
      desc: 'Grand setup package highlighting Aadiyogi Theme Stage + Bridal Entry + Fog + Pyro + Floral in one single combo.',
      src: '/images/events/jay_gurudev_banner.jpg',
      aspect: 'landscape',
    },
    {
      id: 7,
      title: 'Safe Transit & Heavy Duty Steel Trolley Fabrication',
      category: 'PRODUCTION',
      tag: 'Safe Logistics',
      desc: 'Precision packaging with protective multi-layer film on heavy-duty caster-wheeled iron base for scratchless installation.',
      src: '/images/events/aadiyogi_safe_transport.jpg',
      aspect: 'portrait',
    },
  ];

  const filteredGallery = galleryFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === galleryFilter);

  // Dispatch proposal to WhatsApp
  const handleSendToWhatsApp = () => {
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

Please confirm availability and share final site visit schedule!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917651972973?text=${encoded}`, '_blank');
  };

  return (
    <div style={{ background: '#0a0312', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════════════════════════════════════
          1. TOP DIVINE RIBBON
         ══════════════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: 'linear-gradient(90deg, #3b0764 0%, #7e22ce 30%, #b91c1c 70%, #d97706 100%)',
          color: '#ffffff',
          padding: '8px 2rem',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ background: '#fef08a', color: '#854d0e', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
            WEDDING SPECIAL
          </span>
          <span>🔱 Har Pal Ko Banayein Khaas... | Jay Gurudev Event & Management</span>
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
          2. LUXURY STICKY HEADER & NAVIGATION
         ══════════════════════════════════════════════════════════════════════════ */}
      <header
        style={{
          background: 'rgba(15, 7, 21, 0.94)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand Logo & Trishul */}
        <div
          onClick={() => setActiveNav('HOME')}
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

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {[
            { id: 'HOME', label: 'Home' },
            { id: 'AADIYOGI', label: 'Aadiyogi Theme' },
            { id: 'DIMENSIONS', label: '20ft Blueprint' },
            { id: 'SERVICES', label: 'Services' },
            { id: 'GALLERY', label: 'Gallery' },
            { id: 'PROPOSAL', label: 'Cost Estimator' },
            { id: 'CONTACT', label: 'Contact Us' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                const el = document.getElementById(item.id.toLowerCase());
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                background: activeNav === item.id ? 'rgba(250, 204, 21, 0.15)' : 'transparent',
                border: activeNav === item.id ? '1px solid #facc15' : '1px solid transparent',
                color: activeNav === item.id ? '#facc15' : '#cbd5e1',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: activeNav === item.id ? 800 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Book Now Button */}
        <div style={{ display: 'flex', gap: '10px' }}>
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
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════════
          3. HERO SECTION (DIVINE AADIYOGI & ROYAL BRIDAL ENTRY)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="home"
        style={{
          position: 'relative',
          padding: '4rem 2rem 5rem',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle at 50% 30%, rgba(126, 34, 206, 0.35) 0%, rgba(10, 3, 18, 0.98) 70%), url('/images/events/jay_gurudev_banner.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid rgba(234, 179, 8, 0.2)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(10, 3, 18, 0.75) 0%, rgba(10, 3, 18, 0.92) 80%, #0a0312 100%)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
          
          {/* Left Column: Headings & Value Props */}
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
                fontSize: '2.8rem',
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
              <span style={{ fontSize: '1.8rem', color: '#f43f5e', fontWeight: 800 }}>
                Ek Hi Package Mein!
              </span>
            </h1>

            <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.75rem', maxWidth: '580px' }}>
              Varanasi’s most majestic wedding production by <strong>Jay Gurudev Event & Management</strong>.
              Divine Aadiyogi Mahadev Stage with golden sun rays aura, Nandi, Trishuls, paired with a dreamy floral arch bridal entrance, cold fireworks sparkulars, and heavenly dry ice fog.
            </p>

            {/* 3 Core Highlights Pills */}
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

            {/* Action Buttons */}
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
                onClick={() => setBlueprintModalOpen(true)}
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
                <span>View 20ft Blueprint</span>
              </button>

              <a
                href="tel:7651972973"
                style={{
                  background: '#dc2626',
                  color: '#ffffff',
                  textDecoration: 'none',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(220, 38, 38, 0.35)',
                }}
              >
                <Phone size={16} />
                <span>76519 72973</span>
              </a>
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
                  height: '380px',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
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
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
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

            {/* Floating Mini Card: Bridal Entry */}
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
                maxWidth: '220px',
              }}
            >
              <img
                src="/images/events/bridal_entry_fireworks.jpg"
                alt="Bridal Entry"
                style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
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

      {/* ══════════════════════════════════════════════════════════════════════════
          4. THE 5 CORE INCLUSIONS ("EK HI PACKAGE MEIN")
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="aadiyogi"
        style={{
          padding: '5rem 2rem',
          background: 'linear-gradient(180deg, #0a0312 0%, #150921 50%, #0a0312 100%)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.15)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span
              style={{
                background: 'rgba(250, 204, 21, 0.15)',
                color: '#facc15',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.08em',
              }}
            >
              COMPLETE WEDDING PRODUCTION
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Everything in One Grand Package
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto' }}>
              The 5 essential pillars of royal luxury included in our signature Jay Gurudev package to make your special day truly unforgettable.
            </p>
          </div>

          {/* 5 Inclusions Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            
            {/* 1. Aadiyogi Theme Stage */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(250, 204, 21, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(250, 204, 21, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '1rem',
                }}
              >
                🔱
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                Aadiyogi Theme Wedding Stage
              </h3>
              <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700, marginBottom: '8px' }}>
                Decor & Flower Setup
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Majestic Lord Shiva bust sculpture with golden sun rays backdrop, Nandi idol, dual golden damrus, trishul pillars & royal bride-groom seating thrones.
              </p>
            </div>

            {/* 2. Bridal Entry */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(244, 63, 94, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '1rem',
                }}
              >
                🌸
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                Bridal Entry
              </h3>
              <div style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700, marginBottom: '8px' }}>
                Flower Arch / Tunnel (15 Feet)
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Grand floral walkway with illuminated round arches, soft red carpet path, cascading petals, creating a fairy-tale bridal arrival for bride and groom.
              </p>
            </div>

            {/* 3. Fog Effect */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '1rem',
                }}
              >
                ☁️
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                Fog Effect
              </h3>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '8px' }}>
                1st Entry + Stage (Dry Ice Cloud)
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Dense cloud ground fog that blankets the floor during the bridal walking path and the divine Jaimala garland exchange ceremony on stage.
              </p>
            </div>

            {/* 4. Cracker Effect */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(234, 179, 8, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '1rem',
                }}
              >
                ✨
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                Cracker Effect
              </h3>
              <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700, marginBottom: '8px' }}>
                Special Entry (Cold Pyro Fireworks)
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                100% smoke-free, odourless, fire-hazard safe cold pyrotechnics sparkulars that shoot sparkling golden fountains during entry and garland exchange.
              </p>
            </div>

            {/* 5. Flower Decoration */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: 'rgba(168, 85, 247, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '26px',
                  marginBottom: '1rem',
                }}
              >
                🌺
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>
                Flower Decoration
              </h3>
              <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700, marginBottom: '8px' }}>
                Real Fresh / Artificial Luxury
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Fresh fragrant Indian roses, imported Dutch orchids, carnations, and premium silk florals designed by master Varanasi florists.
              </p>
            </div>

          </div>

          {/* Banner Callout */}
          <div
            style={{
              marginTop: '3rem',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              position: 'relative',
              cursor: 'pointer',
            }}
            onClick={() => setActiveLightboxImg('/images/events/jay_gurudev_banner.jpg')}
          >
            <img
              src="/images/events/jay_gurudev_banner.jpg"
              alt="Jay Gurudev Grand Setup Package"
              style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }}
            />
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          5. STAGE BLUEPRINT & 3D DIMENSIONS EXPLORER (20ft x 15ft)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="dimensions"
        style={{
          padding: '5rem 2rem',
          background: '#07020d',
          borderBottom: '1px solid rgba(234, 179, 8, 0.15)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.08em',
              }}
            >
              TECHNICAL ARCHITECTURE & PRECISION
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Stage Layout & Dimension Blueprint
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto' }}>
              Precision engineered for optimal photography, videography angles, guest visibility, and bride-groom comfort.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'center' }}>
            
            {/* Left: Interactive Blueprint Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid rgba(250, 204, 21, 0.4)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
                cursor: 'pointer',
              }}
              onClick={() => setActiveLightboxImg('/images/events/aadiyogi_stage_dimensions.jpg')}
            >
              <img
                src="/images/events/aadiyogi_stage_dimensions.jpg"
                alt="20ft Stage Dimensions Blueprint"
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0,0,0,0.7)',
                  color: '#facc15',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Maximize2 size={13} />
                <span>Click to Enlarge</span>
              </div>
            </div>

            {/* Right: Technical Spec Breakdown List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Overall Size Card */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(250, 204, 21, 0.3)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 800, textTransform: 'uppercase' }}>
                    MASTER STAGE FOOTPRINT
                  </div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>
                    20 Feet Width × 15 Feet Depth
                  </div>
                </div>
                <div
                  style={{
                    background: '#facc15',
                    color: '#0f172a',
                    fontWeight: 900,
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                >
                  300 Sq.Ft
                </div>
              </div>

              {/* Breakdown 1 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
                    1. Jaimala & Bride-Groom Staging Area
                  </span>
                  <span style={{ color: '#facc15', fontWeight: 800, fontSize: '0.9rem' }}>8 Feet Approx.</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Soft velvet carpeted ramp platform with central royal thrones and floral step framing.
                </div>
              </div>

              {/* Breakdown 2 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
                    2. Aadiyogi Sculpture & Nandi Back Area
                  </span>
                  <span style={{ color: '#facc15', fontWeight: 800, fontSize: '0.9rem' }}>6 Feet Approx.</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Dedicated elevated backdrop zone accommodating the Mahadev bust, Sun rays aura & dual Trishuls.
                </div>
              </div>

              {/* Breakdown 3 */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
                    3. Left & Right Floral Canopies & Seating
                  </span>
                  <span style={{ color: '#facc15', fontWeight: 800, fontSize: '0.9rem' }}>6 Feet Each Side</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Symmetrical floral arches, warm ambient backlighting & VIP photography family zones.
                </div>
              </div>

              {/* Breakdown 4: Bridal Entry Path */}
              <div
                style={{
                  background: 'rgba(244, 63, 94, 0.06)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, color: '#f43f5e', fontSize: '0.95rem' }}>
                    4. Bridal Entry Flower Arch Carpet Path
                  </span>
                  <span style={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.9rem' }}>Width 4ft × Length 15ft</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  Continuous glowing flower tunnel extending straight from venue gateway up to the stage stairs.
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          6. INTERACTIVE PROPOSAL & COST ESTIMATOR
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="proposal"
        style={{
          padding: '5rem 2rem',
          background: 'linear-gradient(180deg, #07020d 0%, #170724 50%, #0a0312 100%)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.15)',
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span
              style={{
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#facc15',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.08em',
              }}
            >
              INSTANT QUOTATION BUILDER
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Create Your Custom Wedding Proposal
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto' }}>
              Select your wedding setup preferences, calculate real-time estimated pricing with special package discounts, and send proposal directly to our team via WhatsApp.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(250, 204, 21, 0.3)',
              borderRadius: '20px',
              padding: '2.5rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '2.5rem',
            }}
          >
            {/* Form Selectors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Event Type */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Event Occasion
                </label>
                <select
                  value={proposalConfig.eventType}
                  onChange={(e) => setProposalConfig({ ...proposalConfig, eventType: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#12051f',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option>Wedding & Jaimala (Grand Setup)</option>
                  <option>Sangeet & Cocktail Night</option>
                  <option>Haldi & Mehendi Celebration</option>
                  <option>Reception & Banquet Gala</option>
                  <option>Corporate Annual Convention</option>
                </select>
              </div>

              {/* Stage Dimensions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Stage Dimensions
                </label>
                <select
                  value={proposalConfig.stageSize}
                  onChange={(e) => setProposalConfig({ ...proposalConfig, stageSize: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#12051f',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option>20ft x 15ft (Standard Grand Blueprint)</option>
                  <option>30ft x 20ft (Mega Lawn & Palace Setup)</option>
                  <option>40ft x 25ft (Royale Destination Wedding)</option>
                </select>
              </div>

              {/* Aadiyogi Theme Toggle */}
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

              {/* Bridal Entry Arch Tunnel */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                  Bridal Entry Flower Tunnel
                </label>
                <select
                  value={proposalConfig.bridalEntryArch}
                  onChange={(e) => setProposalConfig({ ...proposalConfig, bridalEntryArch: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#12051f',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                >
                  <option>15ft Glowing Flower Arch Tunnel (Standard)</option>
                  <option>30ft Grand Canopy Tunnel with LED Rings</option>
                  <option>Simple Carpet Path with Flower Pedestals</option>
                </select>
              </div>

              {/* Special Effects: Fog & Cold Pyro */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#facc15', marginBottom: '6px' }}>
                    Dry Ice Fog Effect
                  </label>
                  <select
                    value={proposalConfig.fogEffect}
                    onChange={(e) => setProposalConfig({ ...proposalConfig, fogEffect: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#12051f',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                    }}
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
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#12051f',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                    }}
                  >
                    <option>4-Guns Cold Pyro Sparks</option>
                    <option>8-Guns Synchronized Display</option>
                    <option>12-Guns Royal Finale Pyro</option>
                  </select>
                </div>
              </div>

              {/* Client Info Inputs */}
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
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#12051f',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    value={proposalConfig.clientPhone}
                    onChange={(e) => setProposalConfig({ ...proposalConfig, clientPhone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#12051f',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

            </div>

            {/* Right: Live Price Breakdown & WhatsApp Dispatch */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(30, 11, 48, 0.9) 0%, rgba(18, 5, 31, 0.95) 100%)',
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
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>
                    Estimated Proposal
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem', color: '#cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Selected Stage:</span>
                    <strong style={{ color: '#ffffff' }}>{proposalConfig.stageSize.split('(')[0]}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Aadiyogi Theme:</span>
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
                    <span>Grand Package Discount (15%):</span>
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
                    Total Estimated Package
                  </div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
                    ₹{proposalSummary.total.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    *All inclusive of setup, transport & operational crew in Varanasi
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    fontSize: '0.92rem',
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
                    padding: '10px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Reserve Wedding Date Directly →
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          7. REAL EVENT GALLERY (WITH HD LIGHTBOX)
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="gallery"
        style={{
          padding: '5rem 2rem',
          background: '#0a0312',
          borderBottom: '1px solid rgba(234, 179, 8, 0.15)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span
              style={{
                background: 'rgba(244, 63, 94, 0.15)',
                color: '#f43f5e',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.08em',
              }}
            >
              REAL WEDDINGS & WORKSHOP SHOTS
            </span>
            <h2 style={{ fontSize: '2.3rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 6px' }}>
              Jay Gurudev Production Gallery
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', maxWidth: '650px', margin: '0 auto' }}>
              Authentic on-site photographs of our Aadiyogi Mahadev stages, bridal entrance flower arches, cold pyro sparks, and logistics fabrication.
            </p>
          </div>

          {/* Category Filter Tabs */}
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
                  padding: '7px 16px',
                  borderRadius: '999px',
                  fontSize: '0.84rem',
                  fontWeight: galleryFilter === tab.id ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
                onClick={() => setActiveLightboxImg(item.src)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(250, 204, 21, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(10, 3, 18, 0.85)',
                      color: '#facc15',
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {item.tag}
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <h4 style={{ margin: '0 0 6px', fontSize: '1rem', fontWeight: 800, color: '#ffffff' }}>
                    {item.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          8. ABOUT JAY GURUDEV EVENT & MANAGEMENT
         ══════════════════════════════════════════════════════════════════════════ */}
      <section
        id="services"
        style={{
          padding: '5rem 2rem',
          background: 'linear-gradient(180deg, #0a0312 0%, #150921 50%, #0a0312 100%)',
          borderBottom: '1px solid rgba(234, 179, 8, 0.15)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          
          <div>
            <span
              style={{
                background: 'rgba(250, 204, 21, 0.15)',
                color: '#facc15',
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 900,
                letterSpacing: '0.08em',
              }}
            >
              ABOUT JAY GURUDEV
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', margin: '12px 0 1rem' }}>
              Varanasi’s Trusted Grand Wedding Stage Specialists
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 1.25rem' }}>
              Based in <strong>Bhaisodi, Sarnath, Varanasi</strong>, Jay Gurudev Event & Management is a premier wedding decor and stage production company.
              We specialize in royal, divine themes that evoke spirituality and high luxury.
            </p>
            <p style={{ fontSize: '0.95rem', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 2rem' }}>
              From the intricately crafted <strong>Aadiyogi Shiva Stage</strong> to breathtaking 15ft flower arch bridal walkways and certified cold fireworks sparkulars, every wedding setup is executed with zero compromise on safety and precision.
            </p>

            {/* Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              {[
                '100% In-House Inventory',
                'Zero Middlemen Commission',
                'Smoke-Free Cold Pyro Sparks',
                '3-Hour Prior Setup Delivery',
                '20ft to 40ft Stage Adapters',
                'On-Site Sound & Tech Crew',
              ].map((point, pIdx) => (
                <div key={pIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#ffffff' }}>
                  <CheckCircle2 size={16} color="#facc15" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <a
                href="tel:7651972973"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  color: '#0f172a',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Phone size={18} />
                <span>Call: 76519 72973</span>
              </a>

              <button
                onClick={() => setBookingModalOpen(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                }}
              >
                Reserve Date
              </button>
            </div>
          </div>

          {/* Right: Real Setup Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2px solid rgba(250, 204, 21, 0.3)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <img
                src="/images/events/aadiyogi_nandi_trishul_setup.jpg"
                alt="Adiyogi Production Ground"
                style={{ width: '100%', height: '420px', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════════
          9. FOOTER & CONTACT INFO
         ══════════════════════════════════════════════════════════════════════════ */}
      <footer
        id="contact"
        style={{
          background: '#05010a',
          color: '#cbd5e1',
          padding: '4rem 2rem 2rem',
          borderTop: '1px solid rgba(234, 179, 8, 0.25)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#facc15',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                }}
              >
                🔱
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>Jay Gurudev</div>
                <div style={{ fontSize: '9px', color: '#facc15', fontWeight: 800, letterSpacing: '0.1em' }}>EVENT & MANAGEMENT</div>
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '340px' }}>
              <em>Har Pal Ko Banayein Khaas...</em><br />
              Varanasi’s most celebrated wedding stage and decor masters. Specializing in Aadiyogi themes, flower tunnels, cold fireworks, and heavy dry ice fog.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>
              Setup Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
              <span>🔱 Aadiyogi Theme Wedding Stage</span>
              <span>👑 Royal Bridal Entry (Flower Arch)</span>
              <span>☁️ Heavy Dry Ice Fog Machine</span>
              <span>✨ Cold Pyro Sparkulars Display</span>
              <span>🌺 Exotic Fresh & Silk Floral Decor</span>
              <span>📐 20ft Architectural Blueprint</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 800, marginBottom: '1rem' }}>
              Contact & Booking Office
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#facc15" />
                <a href="tel:7651972973" style={{ color: '#ffffff', fontWeight: 800, textDecoration: 'none' }}>
                  +91 76519 72973
                </a>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={16} color="#facc15" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>Bhaisodi, Sarnath, Varanasi, Uttar Pradesh - 221007</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageCircle size={16} color="#22c55e" />
                <a
                  href="https://wa.me/917651972973"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#4ade80', fontWeight: 700, textDecoration: 'none' }}
                >
                  WhatsApp Booking: 76519 72973
                </a>
              </div>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: '#64748b' }}>
          <div>
            © 2026 Jay Gurudev Event & Management. All Rights Reserved.
          </div>
          <div>
            Designed for Kashi Service Multi-Vertical Ecosystem • Varanasi, UP
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════════
          10. MODAL: BOOK WEDDING DATE / SITE VISIT
         ══════════════════════════════════════════════════════════════════════════ */}
      {bookingModalOpen && (
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
                alert('Thank you! Your wedding booking request has been submitted. Our manager will call you within 30 minutes.');
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
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0d0417',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
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
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0d0417',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                    Wedding Date
                  </label>
                  <input
                    required
                    type="date"
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      background: '#0d0417',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                  Venue Location (Lawn / Banquet / Palace)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Sarnath, Sigra, Cantt or Babatpur Road"
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0d0417',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#facc15', marginBottom: '4px' }}>
                  Select Package
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    background: '#0d0417',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
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
          11. MODAL: 20ft BLUEPRINT ENLARGED
         ══════════════════════════════════════════════════════════════════════════ */}
      {blueprintModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 1, 10, 0.9)',
            backdropFilter: 'blur(10px)',
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
              maxWidth: '900px',
              width: '100%',
              background: '#150921',
              borderRadius: '20px',
              border: '2px solid rgba(250, 204, 21, 0.5)',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#facc15' }}>
                  Aadiyogi Stage & Bridal Entry Architecture Blueprint
                </h3>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Stage: 20ft × 15ft • Ramp: 15ft × 4ft</div>
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
          12. LIGHTBOX MODAL
         ══════════════════════════════════════════════════════════════════════════ */}
      {activeLightboxImg && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.92)',
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
