/**
 * @file GoldenBeautyWebsite.jsx
 * @description Master Luxury Portal for Golden Beauty Parlour & Salon, Academy & Doorstep Home Services.
 * Features:
 *   - Dedicated Navigation Tabs: Home, About, Services, Courses & Academy, Contact
 *   - Golden Beauty Academy: Basic Course, Advance Course, Golden Master Platinum Course (with Ear Locking, Step-by-Step Training & Salon Ops)
 *   - Contact & Real Google Map: Naibazar Sathwa Road, Varanasi (Near Jaygurudev Event & Management & Near Kashi Service)
 *   - Interactive Service Catalog, Bridal Booking & Enrollment Modals
 * @module frontend/src/modules/public/pages/GoldenBeautyWebsite
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Heart,
  Star,
  Clock,
  MapPin,
  Phone,
  Calendar,
  CheckCircle2,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  MessageCircle,
  Gem,
  Smile,
  Check,
  Search,
  BookOpen,
  GraduationCap,
  Layers,
  Sparkle,
  X,
  Send,
  Building,
  Navigation,
  Globe,
  Home,
  Menu,
} from 'lucide-react';

export default function GoldenBeautyWebsite() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active top tab: 'HOME' | 'ABOUT' | 'SERVICES' | 'COURSES' | 'CONTACT'
  const tabFromUrl = searchParams.get('tab')?.toUpperCase() || 'HOME';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  useEffect(() => {
    const t = searchParams.get('tab')?.toUpperCase();
    if (t && ['HOME', 'ABOUT', 'SERVICES', 'COURSES', 'CONTACT'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName.toLowerCase() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // State for Service Filter
  const [serviceCategory, setServiceCategory] = useState('ALL');
  const [serviceSearch, setServiceSearch] = useState('');

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState(null);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null);

  // Form states
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    serviceName: '',
    date: '',
    time: '11:00 AM',
    mode: 'IN_SALON', // 'IN_SALON' | 'DOORSTEP_HOME'
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [enrollForm, setEnrollForm] = useState({
    studentName: '',
    phone: '',
    email: '',
    courseName: 'Golden Master Platinum Pro Course',
    batchPreference: 'Morning Batch (10 AM - 1 PM)',
  });
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const [contactInquiry, setContactInquiry] = useState({
    name: '',
    phone: '',
    subject: 'Bridal Makeover Inquiry',
    message: '',
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // 1. SERVICES CATALOG DATA
  // ══════════════════════════════════════════════════════════════════════════
  const servicesList = [
    {
      id: 'srv_01',
      name: 'Royale Airbrush Bridal HD Makeover',
      category: 'BRIDAL',
      price: '₹14,999',
      originalPrice: '₹18,500',
      time: '180 mins',
      tag: 'Signature Bridal',
      desc: 'Exclusive celebrity HD Airbrush makeup with 3D mink lashes, contouring, high-shine glow setting, designer hair styling, jewelry fixing & dupatta draping.',
      img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_02',
      name: 'Pre-Bridal Radiance 7-Day Glow Spa',
      category: 'BRIDAL',
      price: '₹7,999',
      originalPrice: '₹10,500',
      time: '150 mins',
      tag: 'Bridal Prep',
      desc: 'Full-body aromatic gold polish, ultrasonic dead skin exfoliation, Moroccan body wrap, chocolate wax & 24K pure gold facial.',
      img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_03',
      name: 'Brazilian Keratin & Protein Infusion Hair Spa',
      category: 'HAIR',
      price: '₹4,499',
      originalPrice: '₹6,000',
      time: '120 mins',
      tag: 'Best Seller',
      desc: 'Deep structural hair bonding, anti-frizz keratin protein therapy, split-end repair, steam infusion & mirror-glass shine blow dry.',
      img: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_04',
      name: 'Organic Balayage Highlights & Global Color',
      category: 'HAIR',
      price: '₹5,200',
      originalPrice: '₹7,000',
      time: '140 mins',
      tag: 'Trending Color',
      desc: 'Zero-ammonia imported Italian pigment balayage, custom sun-kissed shades, gloss toner treatment & bond-protecting hair bath.',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_05',
      name: 'Hydra-Oxygen Clinical Facial & Microdermabrasion',
      category: 'SKIN',
      price: '₹3,499',
      originalPrice: '₹4,800',
      time: '75 mins',
      tag: 'Clinical Glow',
      desc: '9-step medical-grade hydra-dermabrasion suction, pore deep detox, peptide serum infusion, LED phototherapy & cryo-tightening hammer.',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_06',
      name: 'O3+ D-Tan & Diamond Crystal Polish',
      category: 'SKIN',
      price: '₹2,299',
      originalPrice: '₹3,000',
      time: '60 mins',
      tag: 'Instant Tan Removal',
      desc: 'Deep melanin de-pigmentation, crystal peel scrub, botanical lightening mask & anti-pollution protective serum shield.',
      img: 'https://images.unsplash.com/photo-1512290900672-1f02e6c5188d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_07',
      name: 'Ear Piercing & Lobe Locking Treatment',
      category: 'CLINICAL',
      price: '₹999',
      originalPrice: '₹1,500',
      time: '30 mins',
      tag: 'Painless Ear Care',
      desc: 'Surgical sterilized gun piercing and specialized ear lobe locking repair treatment for stretched or torn earring holes without stitches.',
      img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_08',
      name: 'VIP Doorstep Wedding Specialist Dispatch',
      category: 'HOME',
      price: '₹16,500',
      originalPrice: '₹20,000',
      time: 'At Your Venue',
      tag: 'Home Service',
      desc: 'Senior bridal artist & hair stylist dispatched to your home or hotel room with mobile LED vanity studio and sanitized disposable kits.',
      img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const filteredServices = useMemo(() => {
    return servicesList.filter((s) => {
      const matchCat = serviceCategory === 'ALL' || s.category === serviceCategory;
      const matchSearch =
        s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
        s.desc.toLowerCase().includes(serviceSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [servicesList, serviceCategory, serviceSearch]);

  // ══════════════════════════════════════════════════════════════════════════
  // 2. TRAINING & ACADEMY COURSES DATA
  // ══════════════════════════════════════════════════════════════════════════
  const academyCourses = [
    {
      id: 'course_basic',
      name: '1. Basic Beauty & Grooming Course',
      badge: 'Beginner Level',
      duration: '45 Days (1.5 Months)',
      fee: '₹9,999',
      originalFee: '₹14,500',
      color: '#059669',
      bgColor: '#ecfdf5',
      tagline: 'Foundations of Professional Parlour Artistry for Aspiring Beauticians',
      highlights: [
        'Skin Anatomy & Skin Type Assessment',
        'Professional Eyebrow Threading & Facial Waxing',
        'Deep Cleansing, Steam Detox & Basic Facials',
        'Everyday Day Makeup & Party Eye Looks',
        'Hair Cleansing, Basic Blow Dry & Straight Hair Cuts',
        'Sanitization, Hygiene & Client Welcome Etiquette',
      ],
      idealFor: 'Beginners starting from scratch with zero prior experience.',
    },
    {
      id: 'course_advance',
      name: '2. Advance Cosmetology & Bridal Master Course',
      badge: 'Professional Level',
      duration: '90 Days (3 Months)',
      fee: '₹24,999',
      originalFee: '₹32,000',
      color: '#a855f7',
      bgColor: '#faf5ff',
      tagline: 'Master High-End HD Bridal Makeovers, Chemical Hair Chemistry & Hydra-Skin',
      highlights: [
        'Celebrity Airbrush & 3D HD Bridal Makeovers',
        'Keratin, Rebonding, Botox & Balayage Color Formulation',
        'Clinical Hydra-Facials & Ultrasonic Skin Radiance Therapies',
        'Designer Saree, Lehenga & Heavy Dupatta Draping Styles',
        'Bridal Hair Bun Architectures & Floral Pinning',
        'Color Correction, Camouflage Contouring & Strobing',
      ],
      idealFor: 'Beauticians wanting to specialize in luxury bridal & high-ticket salon services.',
    },
    {
      id: 'course_golden',
      name: '3. Golden Master Platinum Pro Course (All-in-One)',
      badge: '👑 Flagship All-in-One',
      duration: '180 Days (6 Months)',
      fee: '₹39,999',
      originalFee: '₹55,000',
      color: '#be123c',
      bgColor: '#fff1f2',
      tagline: 'Complete Basic + Advance + Ear Locking + Step-by-Step Training & Salon Ops',
      highlights: [
        'Complete Basic Course + Advance Bridal Master Curriculum',
        '★ Painless Ear Piercing & Ear Lobe Hole Repair / Locking Technique',
        '★ Step-by-Step Practical Daily Masterclasses with Live Models',
        '★ Complete Salon Setup, Staff Management & Client Counseling',
        '★ Social Media Branding, Vanity Ring-Light Photography & Portfolio',
        '★ Complimentary Comprehensive Professional Makeup & Styling Vanity Kit',
        '★ Government Recognized Dual-Certification & 100% Placement Guarantee',
      ],
      idealFor: 'Entrepreneurs aiming to open their own profitable luxury parlour or bridal studio.',
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: 'Ritu Keshari',
      event: 'Bridal Makeover Client',
      city: 'Sarnath, Varanasi',
      review: 'Golden Beauty Parlour made my wedding day unforgettable! The airbrush HD makeup stayed fresh for over 14 hours without any patchiness. Sneha ma’am and her team are true artists.',
      stars: 5,
    },
    {
      name: 'Pooja Vishwakarma',
      event: 'Golden Master Course Graduate',
      city: 'Naibazar, Varanasi',
      review: 'I completed the 6-Month Golden Master Course. They taught me step by step — from basic threading to advanced airbrush bridal and ear locking. Today I run my own salon earning ₹60,000+ per month!',
      stars: 5,
    },
    {
      name: 'Meenakshi Agrawal',
      event: 'Doorstep Home Service',
      city: 'Shivpur, Varanasi',
      review: 'Booked their doorstep service for my sister’s engagement. The team arrived on time with sanitized kits and ring lights. Absolutely flawless professional experience!',
      stars: 5,
    },
  ];

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.phone) {
      alert('Please enter your name and phone number.');
      return;
    }
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalOpen(false);
      setBookingSuccess(false);
    }, 2500);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!enrollForm.studentName || !enrollForm.phone) {
      alert('Please enter your name and phone number.');
      return;
    }
    setEnrollSuccess(true);
    setTimeout(() => {
      setEnrollModalOpen(false);
      setEnrollSuccess(false);
    }, 2500);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactInquiry.name || !contactInquiry.phone) {
      alert('Please fill out your name and phone number.');
      return;
    }
    setContactSuccess(true);
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#0f172a', background: '#faf9f6', minHeight: '100vh' }}>
      {/* ── Top Announcement Bar ── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #881337 0%, #be123c 50%, #881337 100%)',
          color: '#fdf2f8',
          padding: '8px 24px',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: '#fecdd3', color: '#9f1239', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
            ACADEMY ADMISSIONS OPEN
          </span>
          <span>✨ New Batches for Golden Master Course Starting This Week • Call: +91 98765 43210</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11.5px' }}>
          <span>📍 Naibazar Sathwa Road, Near Jaygurudev Events, Varanasi</span>
          <span>🕒 09:00 AM - 09:00 PM</span>
        </div>
      </div>

      {/* ── Master Glassmorphic Navigation Bar ── */}
      <nav
        style={{
          padding: '1rem 2.5rem',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #fce7f3',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px -2px rgba(159, 18, 57, 0.06)',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => handleTabChange('HOME')}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 50%, #881337 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 18px rgba(190, 18, 60, 0.35)',
            }}
          >
            <Scissors size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#881337', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              GOLDEN BEAUTY
            </div>
            <div style={{ fontSize: '10px', color: '#be123c', fontWeight: 800, letterSpacing: '0.12em', marginTop: '2px' }}>
              LUXURY SALON & ACADEMY • VARANASI
            </div>
          </div>
        </div>

        {/* 5 Master Tabs (Home, About, Services, Courses, Contact) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fdf2f8', padding: '5px', borderRadius: '12px', border: '1px solid #fce7f3' }}>
          {[
            { id: 'HOME', label: 'Home', icon: Home },
            { id: 'ABOUT', label: 'About Parlour', icon: Heart },
            { id: 'SERVICES', label: 'Services', icon: Sparkles },
            { id: 'COURSES', label: 'Training & Courses', icon: GraduationCap },
            { id: 'CONTACT', label: 'Contact & Map', icon: MapPin },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9px',
                  border: 'none',
                  background: isActive ? '#be123c' : 'transparent',
                  color: isActive ? '#ffffff' : '#64748b',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isActive ? '0 4px 12px rgba(190, 18, 60, 0.3)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Top Right Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => {
              setSelectedServiceForBooking('Royale Airbrush Bridal HD Makeover');
              setBookingModalOpen(true);
            }}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
              color: '#fff',
              border: 'none',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 6px 18px rgba(244, 63, 94, 0.35)',
            }}
          >
            <Calendar size={15} />
            <span>Book Appointment</span>
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: HOME TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'HOME' && (
        <div>
          {/* Hero Banner */}
          <section
            style={{
              padding: '4.5rem 2.5rem',
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fdf2f8 100%)',
              borderBottom: '1px solid #fce7f3',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: '999px', background: '#ffe4e6', color: '#be123c', fontSize: '11.5px', fontWeight: 800, marginBottom: '1.25rem' }}>
                  <Gem size={14} />
                  <span>EASTERN UP’S PREMIER BRIDAL COUTURE & TRAINING ACADEMY</span>
                </div>
                <h1 style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.4rem)', fontWeight: 900, color: '#881337', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
                  Where Timeless Bridal Beauty Meets Master Artistry
                </h1>
                <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.65, margin: '0 0 2rem' }}>
                  Welcome to <strong>Golden Beauty Parlour & Salon</strong> in Varanasi. We specialize in Royale Airbrush HD Makeovers, Brazilian Keratin Hair Therapy, Clinical Hydra Facials, Ear Locking Treatment, and Certified Beauty Training Courses.
                </p>

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleTabChange('SERVICES')}
                    style={{
                      padding: '13px 26px',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
                    }}
                  >
                    <span>Explore All Services</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={() => handleTabChange('COURSES')}
                    style={{
                      padding: '13px 26px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#881337',
                      fontWeight: 800,
                      fontSize: '14px',
                      border: '1.5px solid #fecdd3',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <GraduationCap size={16} />
                    <span>View Academy Courses</span>
                  </button>
                </div>

                {/* 3 Quick USPs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #fecdd3' }}>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#881337' }}>1,800+</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Royal Brides Styled</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#881337' }}>450+</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Academy Beauticians</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#881337' }}>100%</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Sterilized & Organic</div>
                  </div>
                </div>
              </div>

              {/* Right Image Collage */}
              <div style={{ position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
                  alt="Golden Beauty Royale Bride"
                  style={{ width: '100%', height: '440px', objectFit: 'cover', borderRadius: '24px', boxShadow: '0 20px 40px rgba(136, 19, 55, 0.2)' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: -20,
                    left: 20,
                    background: '#ffffff',
                    padding: '1rem 1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '1px solid #fce7f3',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#ffe4e6', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 900, fontSize: '13px', color: '#881337' }}>Varanasi No. 1 Salon & Academy</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Certified Master Beauticians</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Services Preview Section */}
          <section style={{ padding: '4rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SIGNATURE TREATMENTS</span>
                <h2 style={{ fontSize: '2.1rem', fontWeight: 900, color: '#881337', margin: '6px 0 0' }}>Our Signature Specialties</h2>
              </div>
              <button onClick={() => handleTabChange('SERVICES')} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #fecdd3', background: '#fff', color: '#881337', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span>View Full 24+ Services Menu</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {servicesList.slice(0, 4).map((s) => (
                <div key={s.id} style={{ background: '#ffffff', borderRadius: '18px', overflow: 'hidden', border: '1px solid #fce7f3', boxShadow: '0 4px 14px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ height: '180px', position: 'relative' }}>
                      <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(136, 19, 55, 0.85)', color: '#fff', fontSize: '10.5px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px' }}>
                        {s.tag}
                      </span>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>{s.name}</h3>
                      <p style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.5, margin: '0 0 12px' }}>{s.desc}</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: '1.3rem', fontWeight: 900, color: '#881337' }}>{s.price}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>{s.originalPrice}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: '0 1.25rem 1.25rem' }}>
                    <button
                      onClick={() => {
                        setSelectedServiceForBooking(s.name);
                        setBookingModalOpen(true);
                      }}
                      style={{ width: '100%', padding: '9px', borderRadius: '8px', background: '#be123c', color: '#fff', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                    >
                      Book Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Academy Highlights on Home Page */}
          <section style={{ padding: '4rem 2.5rem', background: '#fff1f2', borderTop: '1px solid #fce7f3', borderBottom: '1px solid #fce7f3' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GOVERNMENT ACCREDITED ACADEMY</span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#881337', margin: '6px 0 12px' }}>
                  Master the Art of Cosmetology & Salon Entrepreneurship
                </h2>
                <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.65, margin: '0 0 1.5rem' }}>
                  Join Varanasi’s most comprehensive beauty academy. From foundation hair cuts to celebrity airbrush makeup and specialized ear piercing / ear locking techniques, we train you step by step with live practicals on real models.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
                  {[
                    'Basic Course (45 Days) — Foundation beauty & skin care',
                    'Advance Course (90 Days) — 3D Airbrush & chemical hair chemistry',
                    'Golden Master Platinum Course (6 Months) — All-in-one with Ear Locking & Salon Management',
                    'Daily live practical classes on real models with professional tools',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                      <CheckCircle2 size={16} color="#be123c" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleTabChange('COURSES')}
                  style={{ padding: '12px 24px', borderRadius: '10px', background: '#881337', color: '#fff', border: 'none', fontWeight: 800, fontSize: '13.5px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <BookOpen size={15} />
                  <span>Explore 3 Training Courses & Fees</span>
                </button>
              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=700&q=80"
                  alt="Golden Beauty Academy Hands-on Training"
                  style={{ width: '100%', height: '380px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 16px 36px rgba(136, 19, 55, 0.15)' }}
                />
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section style={{ padding: '4rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase' }}>REAL REVIEWS</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#881337', margin: '4px 0 6px' }}>Love from Our Brides & Students</h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Verified customer and academy student experiences across Varanasi</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {testimonials.map((t, idx) => (
                <div key={idx} style={{ padding: '1.5rem', borderRadius: '16px', background: '#ffffff', border: '1px solid #fce7f3', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '10px' }}>
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} size={15} fill="#e11d48" color="#e11d48" />
                    ))}
                  </div>
                  <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '1rem' }}>
                    "{t.review}"
                  </p>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#be123c', fontWeight: 700 }}>{t.event} • {t.city}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: ABOUT TAB (About Parlour & Owner Details)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ABOUT' && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>HERITAGE & ARTISTRY</span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#881337', margin: '6px 0 12px' }}>
              About Golden Beauty Parlour & Salon
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
              Rooted in the cultural capital of Varanasi, Golden Beauty Parlour is a sanctuary of Indian bridal heritage, clinical skin aesthetics, and certified cosmetology education.
            </p>
          </div>

          {/* Owner & Founder Showcase */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              border: '1.5px solid #fce7f3',
              padding: '3rem',
              boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
              marginBottom: '4rem',
            }}
          >
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: '999px', background: '#ffe4e6', color: '#be123c', fontSize: '11px', fontWeight: 800, marginBottom: '1rem' }}>
                <Award size={14} />
                <span>FOUNDER & MASTER COSMETOLOGIST</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#881337', margin: '0 0 6px' }}>
                Smt. Sneha Maurya
              </h2>
              <div style={{ fontSize: '13px', color: '#be123c', fontWeight: 700, marginBottom: '1.25rem' }}>
                Master Makeup Artist & Certified Cosmetology Educator (15+ Years Experience)
              </div>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.7, margin: '0 0 1rem' }}>
                With over a decade and a half of dedicated expertise in bridal couture, clinical dermatology treatments, and traditional Indian makeover rituals, Sneha Maurya founded <strong>Golden Beauty Parlour</strong> to provide women with a luxurious, hygienic, and authentic beauty experience.
              </p>
              <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
                She has mentored over 450+ successful women across Eastern UP to establish their own independent salons through the <strong>Golden Master Platinum Course</strong>, teaching them not only makeup and hair, but also specialized techniques like painless ear locking and salon business operations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#881337' }}>1,800+</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Brides Personally Styled</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#881337' }}>450+</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Students Mentored</div>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                alt="Sneha Maurya - Founder Golden Beauty Parlour"
                style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 16px 36px rgba(0,0,0,0.1)' }}
              />
            </div>
          </div>

          {/* Core Values */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { title: '100% Sterilization Guarantee', desc: 'Single-use towels, disposable makeup sponges, and UV-autoclaved instruments for complete hygiene.', icon: ShieldCheck },
              { title: 'Premium International Brands', desc: 'We exclusively work with Kryolan HD, MAC, Huda Beauty, L’Oreal Professionnel, and Dermalogica.', icon: Gem },
              { title: 'Step-by-Step Training Methodology', desc: 'Every student receives personal 1-on-1 attention with practical live model experience.', icon: GraduationCap },
              { title: 'Doorstep VIP Dispatches', desc: 'Mobile bridal studio sent to your home or banquet anywhere in Varanasi and Eastern UP.', icon: Home },
            ].map((v, i) => {
              const VIcon = v.icon;
              return (
                <div key={i} style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #fce7f3' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff1f2', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <VIcon size={22} />
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>{v.title}</h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 3: SERVICES TAB (Full Service Catalog)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'SERVICES' && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FULL LUXURY MENU</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#881337', margin: '6px 0 10px' }}>
              Our Services & Packages
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
              Select a category or search for bridal makeovers, keratin therapy, hydra facials, or ear piercing.
            </p>
          </div>

          {/* Search & Categories Filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', background: '#fdf2f8', padding: '4px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
              {[
                { id: 'ALL', label: 'All Services' },
                { id: 'BRIDAL', label: '💄 Bridal Couture' },
                { id: 'HAIR', label: '✂️ Hair Therapy' },
                { id: 'SKIN', label: '💆 Hydra Skin' },
                { id: 'CLINICAL', label: '👂 Ear Locking & Piercing' },
                { id: 'HOME', label: '🚗 Doorstep Home' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setServiceCategory(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: serviceCategory === tab.id ? '#be123c' : 'transparent',
                    color: serviceCategory === tab.id ? '#ffffff' : '#64748b',
                    fontWeight: serviceCategory === tab.id ? 800 : 600,
                    fontSize: '12.5px',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
              <input
                type="text"
                placeholder="Search service..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 32px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Services Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {filteredServices.map((s) => (
              <div
                key={s.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid #fce7f3',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img src={s.img} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(136, 19, 55, 0.85)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px' }}>
                      {s.tag}
                    </span>
                    <span style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255, 255, 255, 0.95)', color: '#0f172a', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>
                      ⏱️ {s.time}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.3 }}>
                      {s.name}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748b', lineHeight: 1.5, margin: '0 0 14px' }}>
                      {s.desc}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#881337' }}>{s.price}</span>
                      <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{s.originalPrice}</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <button
                    onClick={() => {
                      setSelectedServiceForBooking(s.name);
                      setBookingModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 4: COURSES & ACADEMY TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'COURSES' && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 3.5rem' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CERTIFIED BEAUTY ACADEMY</span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#881337', margin: '6px 0 12px' }}>
              Golden Beauty Academy Courses & Admissions
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.65, margin: 0 }}>
              Learn from award-winning master cosmetologists. We offer 3 structured certification courses with live model practicals, ear locking specialization, and salon management training.
            </p>
          </div>

          {/* 3 Main Course Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            {academyCourses.map((c) => (
              <div
                key={c.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: c.id === 'course_golden' ? '2.5px solid #be123c' : '1px solid #fce7f3',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: c.id === 'course_golden' ? '0 12px 36px rgba(190, 18, 60, 0.15)' : '0 4px 14px rgba(0,0,0,0.03)',
                  position: 'relative',
                }}
              >
                {c.id === 'course_golden' && (
                  <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#be123c', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '4px 14px', borderRadius: '999px', letterSpacing: '0.04em' }}>
                    MOST RECOMMENDED ALL-IN-ONE
                  </span>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: c.bgColor, color: c.color }}>
                      {c.badge}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>⏱️ {c.duration}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px', lineHeight: 1.25 }}>
                    {c.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                    {c.tagline}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: c.color }}>{c.fee}</span>
                    <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>{c.originalFee}</span>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginLeft: 'auto' }}>Installment Available</span>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.04em' }}>
                      Curriculum Highlights:
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {c.highlights.map((h, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '12.5px', color: '#334155', lineHeight: 1.4 }}>
                          <CheckCircle2 size={15} color={c.color} style={{ flexShrink: 0, marginTop: 2 }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', fontSize: '11.5px', color: '#475569', marginBottom: '1rem' }}>
                    <strong>Best for:</strong> {c.idealFor}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourseForEnroll(c.name);
                      setEnrollForm((prev) => ({ ...prev, courseName: c.name }));
                      setEnrollModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      background: c.color,
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <GraduationCap size={16} />
                    <span>Apply for Admission</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Golden Master Course Special Callout */}
          <div
            style={{
              background: 'linear-gradient(135deg, #881337 0%, #be123c 50%, #4c0519 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 16px 40px rgba(136, 19, 55, 0.25)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#ffe4e6', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px' }}>
                SPECIAL MASTER PRACTICALS
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: '10px 0', lineHeight: 1.25 }}>
                Ear Piercing & Ear Locking Technique + Step-by-Step Salon Management
              </h2>
              <p style={{ fontSize: '13.5px', color: '#fbcfe8', lineHeight: 1.65, margin: 0 }}>
                In our flagship <strong>Golden Master Course</strong>, students learn the highly sought-after, high-income skill of <strong>Ear Lobe Locking & Hole Repair</strong> (stitching-less cosmetic ear lobe restoration). We also teach client retention, product inventory costing, and salon staff leadership step-by-step.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Specialized Ear Locking repair kit and sterile techniques',
                'Live model practice for bridal draping and hair setting',
                'Business registration, GST billing & salon pricing guidance',
                'Free professional beauty kit worth ₹15,000 included',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '13px' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#f43f5e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} />
                  </div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 5: CONTACT & REAL GOOGLE MAP TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CONTACT' && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3.5rem 2.5rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>VISIT OUR SANCTUARY</span>
            <h1 style={{ fontSize: '2.6rem', fontWeight: 900, color: '#881337', margin: '6px 0 10px' }}>
              Contact & Location Map
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
              Conveniently located in Naibazar, Sarnath corridor, Varanasi. Drop by for beauty consultations, bridal bookings, or academy inquiries.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
            {/* Address Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '18px', border: '1.5px solid #fce7f3', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#881337', fontWeight: 900, fontSize: '1.1rem', marginBottom: 10 }}>
                  <MapPin size={22} color="#be123c" />
                  <span>Exact Parlour & Academy Address</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                  Golden Beauty Parlour & Salon
                </div>
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px' }}>
                  <strong>Naibazar, Sathwa Road (Near Sarnath),</strong><br />
                  Varanasi, Uttar Pradesh - 221007<br />
                  <span style={{ color: '#be123c', fontWeight: 700 }}>
                    ★ Landmark: Near Jaygurudev Event & Management, Near Kashi Service Hub
                  </span>
                </p>

                <div style={{ display: 'flex', gap: 10 }}>
                  <a
                    href="https://maps.google.com/?q=Naibazar+Sathwa+Road+Varanasi"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      background: '#be123c',
                      color: '#fff',
                      fontSize: '12px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Navigation size={13} />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '18px', border: '1.5px solid #fce7f3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#881337', fontWeight: 900, fontSize: '1.1rem', marginBottom: 10 }}>
                  <Phone size={20} color="#059669" />
                  <span>Call & WhatsApp Helpline</span>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#059669', marginBottom: 4 }}>
                  +91 98765 43210 / +91 98111 00222
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 12px' }}>
                  Direct line for Bridal Bookings, Academy Admissions & Home Service Orders.
                </p>
                <a
                  href="https://wa.me/919876543210?text=Hello%20Golden%20Beauty%20Parlour,%20I%20would%20like%20to%20inquire%20about%20services/courses."
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    background: '#25d366',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 800,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <MessageCircle size={14} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '18px', border: '1.5px solid #fce7f3' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#881337', fontWeight: 900, fontSize: '1.1rem', marginBottom: 8 }}>
                  <Clock size={20} color="#7e22ce" />
                  <span>Visiting & Class Hours</span>
                </div>
                <div style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6 }}>
                  <div><strong>Monday - Saturday:</strong> 09:00 AM - 09:00 PM</div>
                  <div><strong>Sunday:</strong> 10:00 AM - 08:30 PM</div>
                  <div><strong>Academy Batches:</strong> Morning (10 AM - 1 PM) & Evening (3 PM - 6 PM)</div>
                </div>
              </div>
            </div>

            {/* Quick Inquiry Form */}
            <div style={{ background: '#ffffff', padding: '2.25rem', borderRadius: '24px', border: '1.5px solid #fce7f3', boxShadow: '0 8px 24px rgba(136, 19, 55, 0.04)' }}>
              {contactSuccess ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>Message Received!</h3>
                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 1.5rem' }}>
                    Thank you <strong>{contactInquiry.name}</strong>. Our front desk manager will contact you on <strong>{contactInquiry.phone}</strong> shortly.
                  </p>
                  <button onClick={() => setContactSuccess(false)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#be123c', color: '#fff', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#881337', margin: '0 0 4px' }}>
                      Send an Instant Message
                    </h3>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                      Ask questions about bridal dates, package customization, or course curriculum.
                    </p>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja Sharma"
                      value={contactInquiry.name}
                      onChange={(e) => setContactInquiry({ ...contactInquiry, name: e.target.value })}
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
                      value={contactInquiry.phone}
                      onChange={(e) => setContactInquiry({ ...contactInquiry, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Inquiry Category
                    </label>
                    <select
                      value={contactInquiry.subject}
                      onChange={(e) => setContactInquiry({ ...contactInquiry, subject: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      <option value="Bridal Makeover Inquiry">Bridal Makeover Inquiry</option>
                      <option value="Golden Master Course Admission">Golden Master Course Admission</option>
                      <option value="Ear Piercing / Ear Locking Service">Ear Piercing / Ear Locking Service</option>
                      <option value="Doorstep Home Service Booking">Doorstep Home Service Booking</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Your Message or Preferred Dates
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your wedding date, services needed or academy batch preference..."
                      value={contactInquiry.message}
                      onChange={(e) => setContactInquiry({ ...contactInquiry, message: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: '11px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Send size={15} />
                    <span>Send Message to Parlour Desk</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Interactive Google Map Embed ── */}
          <div style={{ background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #fce7f3', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#881337' }}>
                  📍 Interactive Google Maps Location
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Naibazar, Sathwa Road, Near Jaygurudev Event & Management, Near Kashi Service, Varanasi
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=Naibazar+Sathwa+Road+Varanasi"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '12px', color: '#be123c', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <span>Full Screen</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div style={{ height: '380px', width: '100%', background: '#f1f5f9' }}>
              <iframe
                title="Golden Beauty Parlour Location Map"
                src="https://maps.google.com/maps?q=Naibazar,+Sathwa+Road,+Varanasi,+Uttar+Pradesh&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════════════ */}
      <footer style={{ background: '#4c0519', color: '#fce7f3', padding: '3.5rem 2rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>
              GOLDEN BEAUTY PARLOUR & SALON
            </div>
            <p style={{ fontSize: '0.85rem', color: '#fbcfe8', lineHeight: 1.6, margin: '0 0 1rem' }}>
              Varanasi’s luxury destination for royale bridal makeovers, keratin hair therapy, hydra facials, and certified beauty academy courses.
            </p>
            <div style={{ fontSize: '11px', color: '#fbcfe8' }}>
              Part of the <strong>Kashi Service</strong> Enterprise Ecosystem.
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Quick Navigation</div>
            <div style={{ fontSize: '0.85rem', color: '#fbcfe8', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => handleTabChange('HOME')}>Home Overview</span>
              <span style={{ cursor: 'pointer' }} onClick={() => handleTabChange('ABOUT')}>About Founder & Parlour</span>
              <span style={{ cursor: 'pointer' }} onClick={() => handleTabChange('SERVICES')}>All Services & Packages</span>
              <span style={{ cursor: 'pointer' }} onClick={() => handleTabChange('COURSES')}>Golden Master Training Course</span>
              <span style={{ cursor: 'pointer' }} onClick={() => handleTabChange('CONTACT')}>Location Map & Contact</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Sanctuary Address</div>
            <div style={{ fontSize: '0.85rem', color: '#fbcfe8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📍 Naibazar, Sathwa Road (near Sarnath), Varanasi - 221007</div>
              <div>★ Near Jaygurudev Event & Management, Near Kashi Service</div>
              <div>📞 Phone: +91 98765 43210 / +91 98111 00222</div>
              <div>✉️ Email: contact@goldenbeautyparlour.com</div>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Operational Hours</div>
            <div style={{ fontSize: '0.85rem', color: '#fbcfe8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Monday - Saturday: 09:00 AM - 09:00 PM</div>
              <div>Sunday: 10:00 AM - 08:30 PM</div>
              <div>24/7 Doorstep Bridal Dispatches on call</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '12px', color: '#fbcfe8' }}>
          © 2026 Golden Beauty Parlour & Salon • Naibazar, Sathwa Road, Varanasi • Powered by Kashi Service
        </div>
      </footer>

      {/* ═══════════════════ MODAL: APPOINTMENT BOOKING ═══════════════════ */}
      {bookingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.25rem', fontWeight: 900, color: '#881337' }}>
                  💄 Book Salon Appointment
                </h3>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Golden Beauty Parlour, Naibazar Sathwa Road</div>
              </div>
              <button onClick={() => setBookingModalOpen(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Booking Confirmed!</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  We have reserved your slot for <strong>{bookingForm.serviceName || selectedServiceForBooking}</strong>. Confirmation SMS sent to {bookingForm.phone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sharma"
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
                    Selected Service
                  </label>
                  <input
                    type="text"
                    value={bookingForm.serviceName || selectedServiceForBooking || 'Royale Airbrush Bridal HD Makeover'}
                    onChange={(e) => setBookingForm({ ...bookingForm, serviceName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                      Preferred Mode
                    </label>
                    <select
                      value={bookingForm.mode}
                      onChange={(e) => setBookingForm({ ...bookingForm, mode: e.target.value })}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      <option value="IN_SALON">In-Salon (Naibazar)</option>
                      <option value="DOORSTEP_HOME">Doorstep Home Service</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="button" onClick={() => setBookingModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#be123c', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Confirm Booking</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════ MODAL: COURSE ENROLLMENT ═══════════════════ */}
      {enrollModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.25rem', fontWeight: 900, color: '#881337' }}>
                  🎓 Apply for Academy Admission
                </h3>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>Golden Beauty Academy, Varanasi</div>
              </div>
              <button onClick={() => setEnrollModalOpen(false)} style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {enrollSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={40} color="#059669" style={{ margin: '0 auto 10px' }} />
                <h4 style={{ margin: '0 0 6px', fontWeight: 900, fontSize: '1.2rem', color: '#0f172a' }}>Application Received!</h4>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                  Thank you <strong>{enrollForm.studentName}</strong>. Our student counselor will contact you on {enrollForm.phone} with batch details and scholarship guidance.
                </p>
              </div>
            ) : (
              <form onSubmit={handleEnrollSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shalini Maurya"
                    value={enrollForm.studentName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, studentName: e.target.value })}
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
                    value={enrollForm.phone}
                    onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Selected Course
                  </label>
                  <select
                    value={enrollForm.courseName}
                    onChange={(e) => setEnrollForm({ ...enrollForm, courseName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="1. Basic Beauty & Grooming Course">1. Basic Beauty & Grooming Course (₹9,999)</option>
                    <option value="2. Advance Cosmetology & Bridal Master Course">2. Advance Cosmetology & Bridal Master Course (₹24,999)</option>
                    <option value="3. Golden Master Platinum Pro Course (All-in-One)">3. Golden Master Platinum Pro Course (All-in-One - ₹39,999)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    Preferred Batch Time
                  </label>
                  <select
                    value={enrollForm.batchPreference}
                    onChange={(e) => setEnrollForm({ ...enrollForm, batchPreference: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  >
                    <option value="Morning Batch (10 AM - 1 PM)">Morning Batch (10:00 AM - 01:00 PM)</option>
                    <option value="Afternoon Batch (03 PM - 06 PM)">Afternoon Batch (03:00 PM - 06:00 PM)</option>
                    <option value="Weekend Special Batch">Weekend Special Batch (Sat & Sun)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                  <button type="button" onClick={() => setEnrollModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ padding: '9px 20px', borderRadius: '8px', border: 'none', background: '#be123c', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Submit Application</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
