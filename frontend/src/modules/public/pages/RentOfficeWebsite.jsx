import GlobalCustomerHeaderPill from '../../../components/common/GlobalCustomerHeaderPill.jsx';
import { useCustomer } from '../../../context/CustomerContext.jsx';
/**
 * @file RentOfficeWebsite.jsx
 * @description Master Kashi Commercial Office & Godown Leasing Portal matching the Prime Plots design.
 * Dedicated to the 1 Commercial Property with 3 Available Floors:
 *   - Ground Floor: High-ceiling Logistics & Storage Godown (Heavy vehicle shutter, loading ramp)
 *   - 1st Floor: Furnished Corporate Commercial Office Space (Cabins, conference room, workstations)
 *   - 2nd Floor: Executive Suite & IT Studio (Terrace view, private cabins, pantry)
 * Features:
 *   - Gold & Navy luxury theme matching the uploaded screenshot
 *   - Interactive Working Tabs: Home, Projects / Floors, Spaces, Amenities, Gallery, About Us, Contact
 *   - Hero with "Your Dream Land, Our Priority" / Commercial Hub, CTA buttons & video tour
 *   - Why Choose Us (100% Legal Title, Prime Location, Affordable Pricing, Modern Infra, Support)
 *   - Modern Amenities strip (Wide Road, 24x7 Security, Electricity, Water Supply, Parking, Market)
 *   - Interactive Map & Site Visit Booking Modal
 * @module frontend/src/modules/public/pages/RentOfficeWebsite
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Building,
  Key,
  Warehouse,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  MapPin,
  Phone,
  ArrowRight,
  Calculator,
  Compass,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Wifi,
  Car,
  Lock,
  Play,
  X,
  Send,
  Calendar,
  Home,
  Users,
  Award,
  Trees,
  Check,
  Search,
} from 'lucide-react';

export default function RentOfficeWebsite() {
  const { isAuthenticated, customer, openAuthModal, submitServiceBooking } = useCustomer();
  const navigate = useNavigate();

  // Active Tab: 'HOME' | 'PROJECTS' | 'SPACES' | 'AMENITIES' | 'GALLERY' | 'ABOUT' | 'CONTACT'
  const [activeTab, setActiveTab] = useState('HOME');

  // Modals
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    selectedFloor: 'Ground Floor Godown / Warehouse (₹35,000/mo)',
    visitDate: '',
    duration: '11 Months Lease (Renewable)',
    message: '',
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      alert('Please fill out your name and phone number.');
      return;
    }
    try {
      submitServiceBooking({
        serviceType: 'rent',
        serviceName: selectedSpace || bookingForm.selectedFloor || 'Office / Godam Space',
        customerName: bookingForm.name || customer?.name,
        customerPhone: bookingForm.phone || customer?.phone,
        eventDate: bookingForm.visitDate,
        notes: `Duration: ${bookingForm.duration} - ${bookingForm.message}`,
      });
    } catch(err) {
      console.warn(err);
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookModalOpen(false);
      setBookingSuccess(false);
    }, 2200);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // SPECIFIC REQUIREMENT: 1 PROPERTY WITH 3 AVAILABLE FLOORS (Office & Godam)
  // ══════════════════════════════════════════════════════════════════════════
  const commercialFloors = [
    {
      id: 'floor_ground',
      floorNumber: 'Ground Floor',
      title: 'Heavy Logistics Godam & Warehouse Space',
      type: 'Godam / Storage',
      area: '2,200 sq.ft (Double Height 18 Ft)',
      rent: '₹35,000 / month',
      originalRent: '₹42,000 / month',
      badge: 'Available Now',
      features: [
        'Wide 14-ft rolling steel shutter for truck & tempo loading',
        'Heavy-duty industrial concrete flooring (reinforced for cargo)',
        '18-ft clear ceiling height for vertical pallet racking',
        'Dedicated 3-phase commercial electrical line & sub-meter',
        'Private office cabin inside godam + staff washroom',
      ],
      idealFor: 'E-commerce logistics, FMCG distributors, electronics inventory, pharma storage.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'floor_first',
      floorNumber: 'First Floor',
      title: 'Corporate Commercial Office & Showroom Hub',
      type: 'Commercial Office',
      area: '1,800 sq.ft',
      rent: '₹28,000 / month',
      originalRent: '₹34,000 / month',
      badge: 'Ready to Move',
      features: [
        'Glass frontage overlooking main 60-ft wide arterial road',
        '2 Executive Director cabins with soundproof acoustic glass',
        'Spacious open hall accommodating 20-30 staff workstations',
        'High-speed optical fiber connectivity & network cabling',
        'Reception welcome desk, waiting lounge & private washroom',
      ],
      idealFor: 'IT companies, CA / Legal consultancies, corporate regional headquarters, financial services.',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'floor_second',
      floorNumber: 'Second Floor',
      title: 'Executive Penthouse Office Suite & Studio',
      type: 'Executive Suite',
      area: '1,600 sq.ft + Terrace Access',
      rent: '₹24,000 / month',
      originalRent: '₹30,000 / month',
      badge: 'Prime View',
      features: [
        'Panoramic open terrace access with serene Varanasi greenbelt view',
        'Airy natural daylight on all 4 sides with cross ventilation',
        'Modular pantry station & dining nook for office staff',
        'Conference / presentation room with projector provision',
        'Dedicated secure biometric digital door lock entrance',
      ],
      idealFor: 'Design studios, software development labs, architecture firms, marketing agencies.',
      img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'floor_combo',
      floorNumber: 'Entire Building Combo',
      title: 'Complete 3-Floor Commercial Complex (Office + Godam)',
      type: 'Full Building Lease',
      area: '5,600 sq.ft Total Built-up Area',
      rent: '₹78,000 / month',
      originalRent: '₹95,000 / month',
      badge: '👑 Best Value Combo',
      features: [
        'Exclusive possession of Ground Floor Godam + 1st Floor Office + 2nd Floor Studio',
        'Ideal all-in-one setup: Storage downstairs & corporate headquarters upstairs',
        'Private compound parking for 6 cars and 15+ two-wheelers',
        'Full building rooftop solar & heavy DG generator backup space',
        'Prominent building naming & branding rights on main highway',
      ],
      idealFor: 'Large enterprise distributors, regional corporate branch, healthcare diagnostic center.',
      img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#0f172a', background: '#ffffff', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* ── Scoped CSS ── */}
      <style>{`
        * { box-sizing: border-box; }
        .kashioffice-container {
          width: 100%;
          max-width: 1540px;
          margin-left: auto;
          margin-right: auto;
          padding-left: clamp(1rem, 3.5vw, 2.5rem);
          padding-right: clamp(1rem, 3.5vw, 2.5rem);
        }
        .prime-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        @media (max-width: 1024px) {
          .prime-nav-links {
            display: none;
          }
        }
      `}</style>

      {/* ── Top Ribbon (Matching Screenshot: +91 98765 43210, Varanasi, UP, Login/Register) ── */}
      <div
        style={{
          background: '#0a192f',
          color: '#cbd5e1',
          padding: '8px 0',
          fontSize: '12px',
          fontWeight: 600,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="kashioffice-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Phone size={13} color="#facc15" />
              <span>+91 98765 43210</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <MapPin size={13} color="#facc15" />
              <span>Naibazar, Sathwa Road (Near Sarnath), Varanasi, UP</span>
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              onClick={() => navigate('/admin/login')}
              style={{ cursor: 'pointer', color: '#facc15', fontWeight: 700 }}
            >
              Login / Register
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Navigation Bar (Gold & Navy Luxury Theme) ── */}
      <nav
        style={{
          background: '#0d1b2a',
          color: '#ffffff',
          padding: '0.85rem 0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        }}
      >
        <div className="kashioffice-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Brand Logo: Gold Skyscraper Gate + "Prime Plots / Kashi Office & Godam" */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => setActiveTab('HOME')}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0a192f',
                boxShadow: '0 4px 14px rgba(250, 204, 21, 0.4)',
                flexShrink: 0,
              }}
            >
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#facc15', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Prime Plots
              </div>
              <div style={{ fontSize: '9.5px', color: '#cbd5e1', fontWeight: 800, letterSpacing: '0.1em' }}>
                OFFICE & GODAM • KASHI HUB
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="prime-nav-links">
            {[
              { id: 'HOME', label: 'Home' },
              { id: 'PROJECTS', label: 'Projects / Floors' },
              { id: 'SPACES', label: 'Plots / Spaces' },
              { id: 'AMENITIES', label: 'Amenities' },
              { id: 'GALLERY', label: 'Gallery' },
              { id: 'ABOUT', label: 'About Us' },
              { id: 'CONTACT', label: 'Contact' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? '#facc15' : 'transparent',
                    color: isActive ? '#0a192f' : '#cbd5e1',
                    fontWeight: isActive ? 900 : 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Book Plot CTA Button & Main Page Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(250, 204, 21, 0.4)',
                color: '#facc15',
                fontWeight: 800,
                fontSize: '12.5px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="Return to Master Platform Hub"
            >
              <Home size={14} />
              <span>🏠 Main Page</span>
            </button>

            {/* Global Universal Customer Pill */}
            <GlobalCustomerHeaderPill theme="dark" />

            <button
              onClick={() => {
                setSelectedSpace('Commercial Hub - Ground Floor Godam');
                setBookModalOpen(true);
              }}
              style={{
                padding: '9px 20px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                color: '#0a192f',
                border: 'none',
                fontWeight: 900,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 4px 14px rgba(250, 204, 21, 0.4)',
              }}
            >
              <span>Book Space</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Matching Left Screenshot: Grand Gate & Commercial Building) ── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 60%, #0d1b2a 100%)',
          color: '#ffffff',
          padding: 'clamp(3rem, 5vw, 5rem) 0',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(250, 204, 21, 0.2)',
        }}
      >
        <div className="kashioffice-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: '999px', background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', fontSize: '11px', fontWeight: 800, marginBottom: '1.25rem' }}>
                <Sparkles size={14} />
                <span>VARANASI PRIME ARTERIAL CORRIDOR • READY FOR RENT</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 900, color: '#ffffff', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
                Prime Commercial Hub <br />
                <span style={{ color: '#facc15' }}>Your Dream Space, Our Priority</span>
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1.75rem' }}>
                Premium Office & Godam Commercial Complex for Rent in Varanasi. <strong>3 Entire Floors Available:</strong> Ground Floor Warehouse / Godam, 1st Floor Corporate Office, and 2nd Floor Executive Studio.
              </p>

              {/* 3 Checkpoints matching screenshot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
                {[
                  'Prime Location (Near Naibazar, Sathwa Road & Sarnath Corridor)',
                  'Direct Owner Lease with 100% Verified Legal Documents',
                  'Modern Facilities: High Ceiling Godam, 3-Phase Power, Lift & Water',
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13.5px', color: '#e2e8f0', fontWeight: 600 }}>
                    <CheckCircle2 size={18} color="#facc15" style={{ flexShrink: 0 }} />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    setSelectedSpace('All 3 Floors Walkthrough');
                    setBookModalOpen(true);
                  }}
                  style={{
                    padding: '13px 26px',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                    color: '#0a192f',
                    fontWeight: 900,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 6px 18px rgba(250, 204, 21, 0.4)',
                  }}
                >
                  <span>Book Your Space</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  style={{
                    padding: '13px 24px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Play size={15} fill="#facc15" color="#facc15" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>

            {/* Right: Grand Commercial Entrance Gate matching screenshot */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
                alt="Prime Commercial Entrance Gate"
                style={{
                  width: '100%',
                  height: 'clamp(280px, 40vw, 440px)',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  border: '2px solid rgba(250, 204, 21, 0.4)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: -15,
                  left: 20,
                  background: '#0a192f',
                  border: '1.5px solid #facc15',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#facc15' }}>KASHI PRIME COMPLEX</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>3 Floors Ready for Immediate Possession</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section: Our Projects / The 3 Available Floors ── */}
      <section style={{ padding: 'clamp(3rem, 5vw, 4.5rem) 0', background: '#f8fafc' }}>
        <div className="kashioffice-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#ca8a04', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              OUR PROJECTS / AVAILABLE SPACES
            </span>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)', fontWeight: 900, color: '#0d1b2a', margin: '6px 0 8px' }}>
              Only 1 Prime Complex with 3 Dedicated Floors
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Ground Floor Godam + 1st Floor Office + 2nd Floor Studio. Available individually or as a combined building lease.
            </p>
          </div>

          {/* 4 Cards Grid (3 Floors + 1 Combo) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.75rem' }}>
            {commercialFloors.map((floor) => (
              <div
                key={floor.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  border: floor.id === 'floor_combo' ? '2.5px solid #eab308' : '1px solid #e2e8f0',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  <div style={{ height: '190px', position: 'relative' }}>
                    <img src={floor.img} alt={floor.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: floor.id === 'floor_combo' ? '#eab308' : '#0d1b2a',
                        color: floor.id === 'floor_combo' ? '#0a192f' : '#facc15',
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '4px 12px',
                        borderRadius: '999px',
                      }}
                    >
                      {floor.badge}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        background: 'rgba(0,0,0,0.7)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      📍 {floor.floorNumber}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0d1b2a', margin: '0 0 6px', lineHeight: 1.3 }}>
                      {floor.title}
                    </h3>
                    <div style={{ fontSize: '12.5px', color: '#64748b', fontWeight: 600, marginBottom: 12 }}>
                      📐 {floor.area}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
                      <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0d1b2a' }}>{floor.rent}</span>
                      <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>{floor.originalRent}</span>
                    </div>

                    {/* Features List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                      {floor.features.slice(0, 3).map((f, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '12px', color: '#475569' }}>
                          <Check size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <button
                    onClick={() => {
                      setSelectedSpace(`${floor.floorNumber} - ${floor.title} (${floor.rent})`);
                      setBookModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '8px',
                      background: floor.id === 'floor_combo' ? 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' : '#0d1b2a',
                      color: floor.id === 'floor_combo' ? '#0a192f' : '#ffffff',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>Schedule Site Visit</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Why Choose Us? (5 Cards + Side Banner matching screenshot) ── */}
      <section style={{ padding: 'clamp(3rem, 5vw, 4.5rem) 0', background: '#ffffff' }}>
        <div className="kashioffice-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.4rem)', fontWeight: 900, color: '#0d1b2a', margin: '0 0 8px' }}>
              Why Choose Us?
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { title: '100% Legal & Clear Title', icon: ShieldCheck },
              { title: 'Prime Location', icon: MapPin },
              { title: 'Affordable Pricing', icon: Calculator },
              { title: 'Modern Infrastructure', icon: Building2 },
              { title: 'Dedicated Support', icon: Users },
            ].map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '1.5rem 1.25rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fef08a', color: '#854d0e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ItemIcon size={24} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0d1b2a' }}>{item.title}</div>
                </div>
              );
            })}
          </div>

          {/* Invest Smart Grow Better Banner matching screenshot */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              boxShadow: '0 12px 30px rgba(13, 27, 42, 0.2)',
            }}
          >
            <div>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)', fontWeight: 900, margin: '0 0 6px', color: '#facc15' }}>
                Invest Smart, Grow Better
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>
                Secure your corporate future with Kashi Prime Office & Godam Commercial Hub. Zero brokerage, direct lease.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSpace('General Lease Inquiry');
                setBookModalOpen(true);
              }}
              style={{
                padding: '12px 26px',
                borderRadius: '8px',
                background: '#facc15',
                color: '#0a192f',
                fontWeight: 900,
                fontSize: '13.5px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Get In Touch →
            </button>
          </div>
        </div>
      </section>

      {/* ── Section: Our Amenities (Horizontal Strip matching screenshot) ── */}
      <section style={{ padding: '2.5rem 0', background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="kashioffice-container">
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0d1b2a', margin: 0 }}>Our Amenities</h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            {[
              { label: 'Wide Road (60 Ft)', icon: Car },
              { label: '24x7 Security & CCTV', icon: Lock },
              { label: '3-Phase Electricity', icon: Zap },
              { label: 'Water Supply', icon: ShieldCheck },
              { label: 'Green Park / Parking', icon: Trees },
              { label: 'Nearby Market & Bank', icon: Building },
            ].map((am, i) => {
              const AmIcon = am.icon;
              return (
                <div key={i} style={{ padding: '12px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <AmIcon size={22} color="#ca8a04" style={{ margin: '0 auto 6px' }} />
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{am.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section: Location Map matching screenshot ── */}
      <section style={{ padding: '3.5rem 0', background: '#ffffff' }}>
        <div className="kashioffice-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0d1b2a', margin: '0 0 4px' }}>Location</h3>
              <div style={{ fontSize: '12.5px', color: '#64748b' }}>Naibazar, Sathwa Road (near Sarnath), Varanasi - 221007</div>
            </div>
            <a
              href="https://maps.google.com/?q=Naibazar+Sathwa+Road+Varanasi"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                background: '#0d1b2a',
                color: '#facc15',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>View on Map</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div style={{ height: '340px', width: '100%', borderRadius: '20px', overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
            <iframe
              title="Kashi Commercial Office Location Map"
              src="https://maps.google.com/maps?q=Naibazar,+Sathwa+Road,+Varanasi,+Uttar+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Footer Matching Screenshot ── */}
      <footer style={{ background: '#0a192f', color: '#cbd5e1', padding: '3.5rem 0 2rem' }}>
        <div className="kashioffice-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Building2 size={24} color="#facc15" />
                <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#facc15' }}>Prime Plots</span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 1rem' }}>
                Premium plotting, commercial office suites & heavy godam solutions in Varanasi. Built for your business future.
              </p>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff', marginBottom: 12 }}>Quick Links</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '13px' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('HOME')}>Home</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('PROJECTS')}>Projects / 3 Floors</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('AMENITIES')}>Amenities</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('ABOUT')}>About Us</span>
                <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('CONTACT')}>Contact</span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff', marginBottom: 12 }}>Contact Us</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '13px', color: '#cbd5e1' }}>
                <div>📞 +91 98765 43210</div>
                <div>✉️ info@kashiservice.com</div>
                <div>📍 Varanasi, Uttar Pradesh - 221007</div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '14px', color: '#ffffff', marginBottom: 12 }}>Newsletter</div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 10px' }}>Subscribe for latest commercial leasing updates.</p>
              <div style={{ display: 'flex', gap: 6 }}>
                <input type="email" placeholder="Your Email" style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '12px', flex: 1 }} />
                <button style={{ padding: '8px 14px', borderRadius: '6px', background: '#facc15', color: '#0a192f', border: 'none', fontWeight: 900, fontSize: '12px', cursor: 'pointer' }}>Subscribe</button>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, fontSize: '12px', color: '#64748b' }}>
            <span>© 2026 Prime Plots (Kashi Commercial Hub). All Rights Reserved.</span>
            <div style={{ display: 'flex', gap: 16 }}>
              <span>Privacy Policy</span>
              <span>Terms & Conditions</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── Booking / Site Visit Modal ── */}
      {bookModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 25, 47, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0d1b2a' }}>
                  🏢 Schedule Site Visit
                </h3>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Kashi Prime Commercial Hub (Office & Godam)</div>
              </div>
              <button onClick={() => setBookModalOpen(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={40} color="#16a34a" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Site Visit Scheduled!</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Thank you <strong>{bookingForm.name}</strong>. Our commercial leasing manager will call you on {bookingForm.phone} with gate entry pass & floor keys!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Your Name / Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra (Chandra Logistics)"
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Select Floor Space
                  </label>
                  <select
                    value={selectedSpace || bookingForm.selectedFloor}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option>Ground Floor Godam / Warehouse (₹35,000/mo - 2,200 sq.ft)</option>
                    <option>1st Floor Corporate Commercial Office (₹28,000/mo - 1,800 sq.ft)</option>
                    <option>2nd Floor Executive Suite & Studio (₹24,000/mo - 1,600 sq.ft)</option>
                    <option>Entire 3-Floor Building Combo Lease (₹78,000/mo - 5,600 sq.ft)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    value={bookingForm.visitDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, visitDate: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="button" onClick={() => setBookModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#facc15', color: '#0a192f', fontWeight: 900, cursor: 'pointer' }}>Confirm Visit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#0a192f', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '640px', position: 'relative', border: '1.5px solid #facc15' }}>
            <button onClick={() => setVideoModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', padding: 6, cursor: 'pointer', zIndex: 10 }}>
              <X size={20} />
            </button>
            <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#fff' }}>
              <Building2 size={50} color="#facc15" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 900, color: '#facc15' }}>Kashi Prime Commercial Hub Drone Tour</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Showing Ground Floor Godam Shutter Entry, 1st Floor Corporate Office & 2nd Floor Executive Suite.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
