import GlobalCustomerHeaderPill from '../../../components/common/GlobalCustomerHeaderPill.jsx';
import { useCustomer } from '../../../context/CustomerContext.jsx';
/**
 * @file RealEstatePlottingWebsite.jsx
 * @description Master Kashi Plotting Services Frontend Portal matching the reference design.
 * Features:
 *   - Top header with logo, navigation (Home, Plots, Services, Gallery, About Us, Testimonials, Contact), phone helpline & "Book Now" CTA
 *   - Hero Section: "Your Dream Plot Our Priority" with CTA buttons & luxury villa backdrop
 *   - Our Plotting Services: Residential, Commercial, Farmhouse, Investment & Property Consultation
 *   - About Us: Transparency, 1000+ Happy Customers & verified legal titles
 *   - Featured Plots Catalog (Residential, Commercial, Farmhouse) with "For Sale" badges & detail modals
 *   - Let's Find Your Perfect Plot Today callout banner with Varanasi skyline
 *   - Booking & Inquiry Modal with site visit scheduler
 * @module frontend/src/modules/public/pages/RealEstatePlottingWebsite
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home,
  Building,
  Trees,
  TrendingUp,
  Users,
  MapPin,
  CheckCircle2,
  Phone,
  ArrowRight,
  Play,
  X,
  Send,
  Calendar,
  ShieldCheck,
  Award,
  Layers,
  Search,
  ExternalLink,
  MessageCircle,
  FileText,
} from 'lucide-react';

export default function RealEstatePlottingWebsite() {
  const { isAuthenticated, customer, openAuthModal, submitServiceBooking } = useCustomer();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab
  const [activeTab, setActiveTab] = useState('HOME'); // 'HOME' | 'PLOTS' | 'SERVICES' | 'GALLERY' | 'ABOUT' | 'TESTIMONIALS' | 'CONTACT'

  // Modals
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState(null);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    plotType: 'Residential Plot (Varanasi)',
    preferredDate: '',
    budget: '₹15,00,000 - ₹25,00,000',
    message: '',
  });

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!inquiryForm.name || !inquiryForm.phone) {
      alert('Please enter your name and phone number.');
      return;
    }
    try {
      submitServiceBooking({
        serviceType: 'plotting',
        serviceName: inquiryForm.plotType || selectedPlot || 'Residential Land Plot',
        customerName: inquiryForm.name || customer?.name,
        customerPhone: inquiryForm.phone || customer?.phone,
        eventDate: inquiryForm.preferredDate,
        budget: inquiryForm.budget,
        notes: inquiryForm.message,
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

  // 5 Plotting Services
  const servicesList = [
    {
      id: 'res',
      name: 'Residential Plots',
      icon: Home,
      desc: 'Prime residential land inside approved gated townships with 30-40 ft blacktop roads, water pipeline, electricity & boundary demarcation.',
      badge: 'Popular Choice',
    },
    {
      id: 'com',
      name: 'Commercial Plots',
      icon: Building,
      desc: 'High-visibility highway frontage plots ideal for shopping arcades, showrooms, hospitals, hotels & office towers on 60-80 ft corridors.',
      badge: 'High ROI',
    },
    {
      id: 'farm',
      name: 'Farmhouse Plots',
      icon: Trees,
      desc: 'Serene green eco-living plots along river breeze zones with organic soil, fruit orchards, perimeter fencing and private club access.',
      badge: 'Eco Living',
    },
    {
      id: 'inv',
      name: 'Investment Plots',
      icon: TrendingUp,
      desc: 'Strategic high-growth land corridors near upcoming ring roads, logistics parks & expressways offering 25-35% annual capital appreciation.',
      badge: 'Max Growth',
    },
    {
      id: 'cons',
      name: 'Property Consultation',
      icon: Users,
      desc: 'Comprehensive 1-on-1 legal due diligence, title clearance, Khatauni mutation (Dakhil Kharij), RERA compliance & bank home-loan assistance.',
      badge: 'Free Guidance',
    },
  ];

  // Featured Plots
  const featuredPlots = [
    {
      id: 'p1',
      title: 'Residential Plot',
      location: 'Varanasi, UP',
      corridor: 'Near Naibazar & Sarnath Corridor',
      price: '₹15,00,000',
      size: '1,000 - 1,500 Sq Ft',
      facing: 'East Facing, 30 Ft Wide Road',
      status: 'For Sale',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 'p2',
      title: 'Commercial Plot',
      location: 'Sarnath, Varanasi',
      corridor: 'Main Ring Road Highway Frontage',
      price: '₹35,00,000',
      size: '2,200 - 3,500 Sq Ft',
      facing: '60 Ft Highway Facing',
      status: 'For Sale',
      img: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 'p3',
      title: 'Farmhouse Plot',
      location: 'Bhaisodi, Varanasi',
      corridor: 'Greenbelt Riverfront Zone',
      price: '₹22,00,000',
      size: '4,500 - 6,000 Sq Ft',
      facing: 'Corner Plot with Plantation',
      status: 'For Sale',
      img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=700&q=80',
    },
  ];

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* ── Scoped CSS ── */}
      <style>{`
        * { box-sizing: border-box; }
        .kashiplot-container {
          width: 100%;
          max-width: 1540px;
          margin-left: auto;
          margin-right: auto;
          padding-left: clamp(1rem, 3.5vw, 2.5rem);
          padding-right: clamp(1rem, 3.5vw, 2.5rem);
        }
        .plot-nav-links {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        @media (max-width: 1024px) {
          .plot-nav-links {
            display: none;
          }
        }
      `}</style>

      {/* ── Top Navigation Bar Matching Image ── */}
      <nav
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          padding: '0.85rem 0',
        }}
      >
        <div className="kashiplot-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Brand Logo: Official Kashi Logo + "Ploting Services" */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => setActiveTab('HOME')}
          >
            <img
              src="/kashi-logo.png"
              alt="Kashi Service Logo"
              style={{ height: '42px', width: 'auto', objectFit: 'contain' }}
            />
            <div style={{ borderLeft: '2px solid #cbd5e1', paddingLeft: '10px' }}>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#064e3b', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Ploting Services
              </div>
              <div style={{ fontSize: '9.5px', color: '#059669', fontWeight: 800, letterSpacing: '0.08em' }}>
                KASHIPLOT • VARANASI
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="plot-nav-links">
            {[
              { id: 'HOME', label: 'Home' },
              { id: 'PLOTS', label: 'Plots' },
              { id: 'SERVICES', label: 'Services' },
              { id: 'GALLERY', label: 'Gallery' },
              { id: 'ABOUT', label: 'About Us' },
              { id: 'TESTIMONIALS', label: 'Testimonials' },
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
                    background: isActive ? '#059669' : 'transparent',
                    color: isActive ? '#ffffff' : '#475569',
                    fontWeight: isActive ? 800 : 600,
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

          {/* Right Helpline & Book Now CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                color: '#065f46',
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
            <GlobalCustomerHeaderPill theme="light" />

            <a
              href="tel:+919876543210"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#065f46',
                fontWeight: 800,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              <Phone size={15} color="#059669" />
              <span>+91 98765 43210</span>
            </a>

            <button
              onClick={() => {
                setSelectedPlot('Residential Plot (Varanasi)');
                setBookModalOpen(true);
              }}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              }}
            >
              Book Now
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero Section (Matching Left Image) ── */}
      <section
        style={{
          padding: 'clamp(2.5rem, 5vw, 4.5rem) 0',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #ecfdf5 100%)',
          borderBottom: '1px solid #d1fae5',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="kashiplot-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 440px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'center',
            }}
          >
            <div>
              <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)', fontWeight: 900, color: '#064e3b', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
                Your Dream Plot <br />
                <span style={{ color: '#059669' }}>Our Priority</span>
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', color: '#475569', lineHeight: 1.6, margin: '0 0 2rem' }}>
                Buy, Sell & Invest in the Best Locations with Trusted Plotting Services in Varanasi, Sarnath & Expressway Corridors.
              </p>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const el = document.getElementById('featured-plots');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '13px 26px',
                    borderRadius: '10px',
                    background: '#059669',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: '0 6px 18px rgba(5, 150, 105, 0.35)',
                  }}
                >
                  <span>Explore Plots</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => setVideoModalOpen(true)}
                  style={{
                    padding: '13px 24px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    color: '#065f46',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: '1.5px solid #a7f3d0',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Play size={15} fill="#059669" color="#059669" />
                  <span>Watch Video</span>
                </button>
              </div>
            </div>

            {/* Right Image: Luxury Villa & Plotted Greenery with Location Marker */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Dream Plot Villa"
                style={{
                  width: '100%',
                  height: 'clamp(280px, 40vw, 440px)',
                  objectFit: 'cover',
                  borderRadius: '24px',
                  boxShadow: '0 20px 40px rgba(5, 150, 105, 0.18)',
                }}
              />
              {/* Red Location Pin Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '30%',
                  left: '42%',
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
                  border: '3px solid #ffffff',
                }}
              >
                <MapPin size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Plotting Services (5 Cards Matching Screenshot) ── */}
      <section style={{ padding: 'clamp(3rem, 5vw, 4.5rem) 0' }}>
        <div className="kashiplot-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              OUR PLOTING SERVICES
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.3rem)', fontWeight: 900, color: '#064e3b', margin: '6px 0 8px' }}>
              Complete Solution for Your Land & Property Needs
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '1.5rem' }}>
            {servicesList.map((srv) => {
              const SrvIcon = srv.icon;
              return (
                <div
                  key={srv.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    padding: '2rem 1.5rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '12px',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '16px',
                      background: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <SrvIcon size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
                    {srv.name}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                    {srv.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About Us Section (Matching Screenshot) ── */}
      <section style={{ padding: 'clamp(3rem, 5vw, 4.5rem) 0', background: '#f0fdf4', borderTop: '1px solid #d1fae5', borderBottom: '1px solid #d1fae5' }}>
        <div className="kashiplot-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
              gap: 'clamp(2rem, 4vw, 3.5rem)',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                ABOUT US
              </span>
              <h2 style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.5rem)', fontWeight: 900, color: '#064e3b', margin: '6px 0 12px' }}>
                Trusted Name in Ploting Services
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.65, margin: '0 0 1.5rem' }}>
                We provide the best plotting solutions with transparency, trust and professional support. Your dream property is our commitment. All our colonies have clear 143 conversion documents and bank loan facility.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '2rem' }}>
                {[
                  'Prime Location',
                  'Clear Documents',
                  'Secure Investment',
                  'Excellent Support',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13.5px', fontWeight: 700, color: '#064e3b' }}>
                    <CheckCircle2 size={18} color="#059669" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setSelectedPlot('General Property Consultation');
                  setBookModalOpen(true);
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '13.5px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>Learn More</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {/* Right Plotted Land Image + 1000+ Happy Customers Badge */}
            <div style={{ position: 'relative' }}>
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80"
                alt="Plotted Lands"
                style={{
                  width: '100%',
                  height: 'clamp(280px, 38vw, 380px)',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  boxShadow: '0 16px 36px rgba(5, 150, 105, 0.15)',
                }}
              />
              {/* Floating Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: -15,
                  right: 20,
                  background: '#059669',
                  color: '#ffffff',
                  padding: '12px 22px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 10px 24px rgba(5, 150, 105, 0.35)',
                }}
              >
                <Users size={24} />
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.25rem', lineHeight: 1 }}>1000+</div>
                  <div style={{ fontSize: '11px', fontWeight: 700 }}>Happy Customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Plots Section (Matching 3 Cards in Screenshot) ── */}
      <section id="featured-plots" style={{ padding: 'clamp(3rem, 5vw, 4.5rem) 0' }}>
        <div className="kashiplot-container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              FEATURED PLOTS
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.3rem)', fontWeight: 900, color: '#064e3b', margin: '6px 0 8px' }}>
              Explore Our Top Featured Plots
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '1.75rem' }}>
            {featuredPlots.map((plot) => (
              <div
                key={plot.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img src={plot.img} alt={plot.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: '#059669',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '4px 12px',
                        borderRadius: '999px',
                      }}
                    >
                      {plot.status}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#064e3b', margin: '0 0 4px' }}>
                      {plot.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#64748b', fontSize: '12px', marginBottom: 12 }}>
                      <MapPin size={13} color="#059669" />
                      <span>{plot.location}</span>
                    </div>

                    <div style={{ fontSize: '1.45rem', fontWeight: 900, color: '#059669' }}>
                      {plot.price}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <button
                    onClick={() => {
                      setSelectedPlot(`${plot.title} (${plot.location} - ${plot.price})`);
                      setBookModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Green Callout Banner: "Let's Find Your Perfect Plot Today!" ── */}
      <section
        style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #047857 50%, #065f46 100%)',
          color: '#ffffff',
          padding: '2.5rem 0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="kashiplot-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                flexShrink: 0,
              }}
            >
              🤝
            </div>
            <div>
              <h3 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)', fontWeight: 900, margin: '0 0 4px', color: '#ffffff' }}>
                Let's Find Your Perfect Plot Today!
              </h3>
              <p style={{ margin: 0, fontSize: '13px', color: '#a7f3d0' }}>
                Get in touch with us for the best deals, immediate registry and expert legal guidance.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedPlot('Express Inquiry');
              setBookModalOpen(true);
            }}
            style={{
              padding: '11px 24px',
              borderRadius: '999px',
              background: '#facc15',
              color: '#064e3b',
              border: 'none',
              fontWeight: 900,
              fontSize: '13.5px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
            }}
          >
            <span>Contact Us</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* ── Footer Matching Screenshot ── */}
      <footer style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0', padding: '2rem 0' }}>
        <div className="kashiplot-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trees size={20} color="#059669" />
            <span style={{ fontWeight: 900, fontSize: '14px', color: '#064e3b' }}>Ploting Services</span>
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: '#64748b', fontWeight: 600 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('HOME')}>Home</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('PLOTS')}>Plots</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('ABOUT')}>About Us</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('GALLERY')}>Gallery</span>
            <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('CONTACT')}>Contact</span>
          </div>

          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            © 2026 Ploting Services (KashiPlot). All Rights Reserved.
          </div>
        </div>
      </footer>

      {/* ── Booking / Inquiry Modal ── */}
      {bookModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#064e3b' }}>
                  🏡 Book Plot / Site Visit
                </h3>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Kashi Plotting Services • Varanasi</div>
              </div>
              <button onClick={() => setBookModalOpen(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Inquiry Received!</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Thank you <strong>{inquiryForm.name}</strong>. Our senior property advisor will call you on {inquiryForm.phone} to arrange a free site visit cab!
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
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
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Selected Plot / Location
                  </label>
                  <input
                    type="text"
                    value={selectedPlot || inquiryForm.plotType}
                    onChange={(e) => setSelectedPlot(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Preferred Visit Date
                    </label>
                    <input
                      type="date"
                      value={inquiryForm.preferredDate}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, preferredDate: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Budget Range
                    </label>
                    <select
                      value={inquiryForm.budget}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, budget: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      <option>₹10 Lakh - ₹20 Lakh</option>
                      <option>₹20 Lakh - ₹35 Lakh</option>
                      <option>₹35 Lakh - ₹50 Lakh</option>
                      <option>₹50 Lakh+</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="button" onClick={() => setBookModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Schedule Visit</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Video Tour Modal */}
      {videoModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', width: '100%', maxWidth: '640px', position: 'relative' }}>
            <button onClick={() => setVideoModalOpen(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', borderRadius: '50%', padding: 6, cursor: 'pointer', zIndex: 10 }}>
              <X size={20} />
            </button>
            <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#fff' }}>
              <Trees size={48} color="#10b981" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ margin: '0 0 8px', fontSize: '1.3rem', fontWeight: 900 }}>Kashi Plotting Video Walkthrough</h3>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Aerial drone tour of Kashi Green Valley, Sarnath Ring Road & Bhaisodi Farmhouse Townships.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
