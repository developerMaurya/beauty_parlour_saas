import GlobalCustomerHeaderPill from '../../../components/common/GlobalCustomerHeaderPill.jsx';
import { useCustomer } from '../../../context/CustomerContext.jsx';
/**
 * @file GoldenBeautyWebsite.jsx
 * @description Master Luxury Portal for Golden Beauty Parlour & Salon, Academy & Virtual Bridal Try-On Studio.
 * Fully Responsive for All Devices (Mobile, Tablet, Laptop, 4K Desktop) & Full-Width Fluid Architecture.
 * Features:
 *   - Dedicated Navigation Tabs: Home, About, Services, Virtual Makeover ✨, Training & Courses, Contact
 *   - Interactive AI & Virtual Bridal Look Visualizer:
 *       * Upload personal photo or select Indian beauty model faces
 *       * Occasion styles: Royale Bridal, Engagement Soft Glam, Reception Cocktail, Haldi Floral
 *       * Customizable Dupatta / Dress Color, Jewelry (Kundan, Polki, Floral, Temple), Lipstick & Glow
 *       * Real-time Before vs After comparison slider / toggle
 *       * One-click appointment booking with selected look prefilled
 *   - Golden Beauty Academy: Basic, Advance, Golden Master Platinum Course (with Ear Locking & practicals)
 *   - Contact & Real Google Map: Naibazar Sathwa Road, Varanasi (Near Jaygurudev Event & Near Kashi Service)
 *   - Mobile Drawer & Responsive Mobile Sticky Navigation
 * @module frontend/src/modules/public/pages/GoldenBeautyWebsite
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  PhoneCall,
  Smartphone,
  Camera,
  Upload,
  Eye,
  RefreshCw,
  Palette,
  Crown,
  Share2,
  Sliders,
} from 'lucide-react';

export default function GoldenBeautyWebsite() {
  const { isAuthenticated, customer, openAuthModal, submitServiceBooking } = useCustomer();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active top tab: 'HOME' | 'ABOUT' | 'SERVICES' | 'MAKEOVER' | 'COURSES' | 'CONTACT'
  const tabFromUrl = searchParams.get('tab')?.toUpperCase() || 'HOME';
  const [activeTab, setActiveTab] = useState(tabFromUrl);

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const t = searchParams.get('tab')?.toUpperCase();
    if (t && ['HOME', 'ABOUT', 'SERVICES', 'MAKEOVER', 'COURSES', 'CONTACT'].includes(t)) {
      setActiveTab(t);
    }
  }, [searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName.toLowerCase() });
    setMobileMenuOpen(false);
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
  // VIRTUAL BRIDAL & MAKEOVER TRY-ON STUDIO STATE
  // ══════════════════════════════════════════════════════════════════════════
  const sampleModels = [
    {
      id: 'm1',
      name: 'Priya (Model 1)',
      label: 'Fair Tone',
      url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 'm2',
      name: 'Ananya (Model 2)',
      label: 'Wheatish Glow',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 'm3',
      name: 'Ritu (Model 3)',
      label: 'Dusky Radiance',
      url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=80',
    },
    {
      id: 'm4',
      name: 'Kavita (Model 4)',
      label: 'Traditional Look',
      url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80',
    },
  ];

  const [currentFacePhoto, setCurrentFacePhoto] = useState(sampleModels[0].url);
  const [isCustomUploaded, setIsCustomUploaded] = useState(false);
  const [compareMode, setCompareMode] = useState(false); // false = show Makeover, true = show Original Before

  // Makeover Customization
  const [makeoverOccasion, setMakeoverOccasion] = useState('BRIDAL'); // 'BRIDAL' | 'ENGAGEMENT' | 'RECEPTION' | 'HALDI'
  const [dupattaColor, setDupattaColor] = useState('#991b1b'); // '#991b1b' (Red) | '#be185d' (Pink) | '#ea580c' (Peach) | '#581c87' (Wine) | '#ca8a04' (Yellow) | '#065f46' (Green)
  const [jewelryStyle, setJewelryStyle] = useState('KUNDAN'); // 'KUNDAN' | 'POLKI' | 'FLORAL' | 'TEMPLE'
  const [lipstickShade, setLipstickShade] = useState('RUBY'); // 'RUBY' | 'ROSE' | 'NUDE' | 'PLUM'
  const [glowFinish, setGlowFinish] = useState('GOLD'); // 'GOLD' | 'GLASS' | 'MATTE'

  const fileInputRef = useRef(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentFacePhoto(reader.result);
        setIsCustomUploaded(true);
        setCompareMode(false);
      };
      reader.readAsDataURL(file);
    }
  };

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
      tag: 'Trendy Hair',
      desc: 'Ammonia-free French Balayage technique with customized undertone blending, bond protector Plex shield & high-gloss post-color hydration.',
      img: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_05',
      name: 'Clinical Hydra-Dermabrasion Facial Therapy',
      category: 'SKIN',
      price: '₹2,799',
      originalPrice: '₹3,800',
      time: '75 mins',
      tag: 'Instant Radiance',
      desc: 'Multi-step clinical suction exfoliation, peptide and hyaluronic acid serum infusion with oxygen dome mist for deep pore cleaning and glass skin finish.',
      img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_06',
      name: 'Ear Locking & Lobe Repair (No-Stitch Technique)',
      category: 'CLINICAL',
      price: '₹1,499',
      originalPrice: '₹2,200',
      time: '40 mins',
      tag: 'Specialist Service',
      desc: 'Advanced, painless cosmetic ear hole locking and stretched earlobe restoration without surgical cuts or stitches. Safe, antiseptic, and 100% effective.',
      img: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_07',
      name: 'Painless Gun Ear & Nose Piercing',
      category: 'CLINICAL',
      price: '₹499',
      originalPrice: '₹800',
      time: '20 mins',
      tag: 'Safe & Hygienic',
      desc: 'Sterile medical-grade disposable cartridge gun piercing with 24K gold-plated hypoallergenic studs. Fast healing with post-care antiseptic solution.',
      img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_08',
      name: 'VIP Doorstep Home Bridal & Party Makeover',
      category: 'HOME',
      price: '₹9,999',
      originalPrice: '₹13,000',
      time: 'Flexible',
      tag: 'Doorstep VIP',
      desc: 'Our senior salon artists travel to your home or wedding banquet in Varanasi with complete sterilized vanity kit, vanity ring lights, and styling tools.',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_09',
      name: '24K Gold Luxury Bridal Facial & De-Tan Pack',
      category: 'SKIN',
      price: '₹2,199',
      originalPrice: '₹3,000',
      time: '60 mins',
      tag: 'Skin Glow',
      desc: 'Ayurvedic gold bhasma cream massage, deep pore ultrasonic cleanup, instant brightening de-tan mask, and rose water hydration compress.',
      img: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_10',
      name: 'Hair Smoothening / Rebonding & Keratin Shield',
      category: 'HAIR',
      price: '₹4,999',
      originalPrice: '₹7,500',
      time: '180 mins',
      tag: 'Permanent Straight',
      desc: 'Long-lasting silky smooth pin-straight hair with thermal protection and deep conditioning mask for up to 12 months.',
      img: 'https://images.unsplash.com/photo-1522337094346-29177a4a905a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_11',
      name: 'Engagement & Reception Celebrity Soft Glam Makeup',
      category: 'BRIDAL',
      price: '₹5,999',
      originalPrice: '₹8,000',
      time: '90 mins',
      tag: 'Party Glam',
      desc: 'Dewy glass skin base, smokey or shimmer eye art, voluminous soft curls or chic bun, and personalized luxury draping.',
      img: 'https://images.unsplash.com/photo-1503236466547-198126b8b80b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'srv_12',
      name: 'Full Body Waxing (Rica Italian White Chocolate)',
      category: 'SKIN',
      price: '₹1,799',
      originalPrice: '₹2,500',
      time: '60 mins',
      tag: 'Smooth Skin',
      desc: 'Gentle, pain-free Rica waxing for arms, legs, and underarms with pre-wax gel and post-wax soothing calming lotion.',
      img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
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
  // 2. ACADEMY TRAINING COURSES DATA
  // ══════════════════════════════════════════════════════════════════════════
  const academyCourses = [
    {
      id: 'course_basic',
      name: '1. Basic Beauty & Grooming Course',
      badge: 'Foundation Level',
      duration: '45 Days (1.5 Months)',
      fee: '₹9,999',
      originalFee: '₹15,000',
      color: '#0284c7',
      bgColor: '#f0f9ff',
      tagline: 'Ideal for Beginners Starting Their Beauty & Salon Career',
      highlights: [
        'Skin Anatomy, Skin Types & Professional Facial Techniques',
        'Eyebrow Threading, Waxing (Honey & Rica), Bleach & De-Tan',
        'Basic Day Makeup, Party Makeup & Saree Draping Essentials',
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
    try {
      submitServiceBooking({
        serviceType: 'parlour',
        serviceName: selectedServiceForBooking || 'Beauty Parlour Appointment',
        customerName: bookingForm.name || customer?.name,
        customerPhone: bookingForm.phone || customer?.phone,
        eventDate: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        notes: bookingForm.notes,
      });
    } catch (e) {
      console.warn('Booking sync note:', e);
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
    <div className="golden-beauty-root" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#0f172a', background: '#faf9f6', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      {/* ── Scoped Fluid & Responsive CSS ── */}
      <style>{`
        * { box-sizing: border-box; }
        .golden-fluid-container {
          width: 100%;
          max-width: 1680px;
          margin-left: auto;
          margin-right: auto;
          padding-left: clamp(1rem, 4vw, 3.5rem);
          padding-right: clamp(1rem, 4vw, 3.5rem);
        }

        .desktop-nav-tabs {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .mobile-menu-btn {
          display: none;
        }
        .desktop-nav-cta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .category-scroll-container {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
          max-width: 100%;
        }
        .category-scroll-container::-webkit-scrollbar {
          display: none;
        }

        .mobile-tabs-pillbar {
          display: none;
        }

        .mobile-bottom-bar {
          display: none;
        }

        @media (max-width: 1024px) {
          .desktop-nav-tabs {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex !important;
          }
          .mobile-tabs-pillbar {
            display: flex !important;
            overflow-x: auto;
            white-space: nowrap;
            gap: 6px;
            padding: 8px 16px;
            background: #fff;
            border-bottom: 1px solid #fce7f3;
            scrollbar-width: none;
          }
          .mobile-tabs-pillbar::-webkit-scrollbar {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .mobile-bottom-bar {
            display: flex !important;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            z-index: 999;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(12px);
            border-top: 1px solid #fce7f3;
            box-shadow: 0 -4px 16px rgba(136, 19, 55, 0.08);
            padding: 8px 12px;
            justify-content: space-around;
            align-items: center;
          }
          .footer-section {
            padding-bottom: 6rem !important;
          }
          .announcement-bar-address {
            display: none !important;
          }
        }
      `}</style>

      {/* ── Top Announcement Bar ── */}
      <header
        className="announcement-bar"
        style={{
          background: 'linear-gradient(90deg, #881337 0%, #be123c 50%, #881337 100%)',
          color: '#fdf2f8',
          padding: '8px clamp(12px, 3vw, 28px)',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: '#fecdd3', color: '#9f1239', padding: '2px 8px', borderRadius: '4px', fontSize: '10.5px', fontWeight: 900 }}>
            ACADEMY ADMISSIONS OPEN
          </span>
          <span>✨ New Batches for Golden Master Course • Call: +91 98765 43210</span>
        </div>
        <div className="announcement-bar-address" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11.5px' }}>
          <span>📍 Naibazar Sathwa Road, Near Jaygurudev Events, Varanasi</span>
          <span>🕒 09:00 AM - 09:00 PM</span>
        </div>
      </header>

      {/* ── Master Glassmorphic Navigation Bar ── */}
      <nav
        style={{
          padding: '0.9rem clamp(1rem, 3.5vw, 2.5rem)',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #fce7f3',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 4px 20px -2px rgba(159, 18, 57, 0.06)',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '1680px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Brand Logo & Name */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => handleTabChange('HOME')}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 50%, #881337 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 6px 16px rgba(190, 18, 60, 0.3)',
                flexShrink: 0,
              }}
            >
              <Scissors size={22} />
            </div>
            <div>
              <div style={{ fontSize: 'clamp(1.15rem, 2vw, 1.35rem)', fontWeight: 900, color: '#881337', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                GOLDEN BEAUTY
              </div>
              <div style={{ fontSize: '9.5px', color: '#be123c', fontWeight: 800, letterSpacing: '0.12em', marginTop: '2px' }}>
                LUXURY SALON & ACADEMY • VARANASI
              </div>
            </div>
          </div>

          {/* Desktop Master Tabs (Home, About, Services, Virtual Makeover ✨, Courses, Contact) */}
          <div className="desktop-nav-tabs" style={{ background: '#fdf2f8', padding: '5px', borderRadius: '12px', border: '1px solid #fce7f3' }}>
            {[
              { id: 'HOME', label: 'Home', icon: Home },
              { id: 'ABOUT', label: 'About Parlour', icon: Heart },
              { id: 'SERVICES', label: 'Services', icon: Sparkles },
              { id: 'MAKEOVER', label: 'Virtual Makeover ✨', icon: Camera, isSpecial: true },
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
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive
                      ? tab.isSpecial
                        ? 'linear-gradient(135deg, #9333ea 0%, #be123c 100%)'
                        : '#be123c'
                      : tab.isSpecial
                      ? '#fae8ff'
                      : 'transparent',
                    color: isActive ? '#ffffff' : tab.isSpecial ? '#7e22ce' : '#64748b',
                    fontWeight: isActive ? 800 : tab.isSpecial ? 800 : 600,
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

          {/* Right Action & Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                background: '#fdf2f8',
                border: '1.5px solid #fbcfe8',
                color: '#be123c',
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

            <div className="desktop-nav-cta">
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    openAuthModal(() => {
                      setSelectedServiceForBooking('Royale Airbrush Bridal HD Makeover');
                      setBookingModalOpen(true);
                    }, 'Sign in or register to book your beauty appointment');
                  } else {
                    setSelectedServiceForBooking('Royale Airbrush Bridal HD Makeover');
                    setBookingModalOpen(true);
                  }
                }}
                style={{
                  padding: '9px 18px',
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
                  boxShadow: '0 4px 14px rgba(244, 63, 94, 0.3)',
                }}
              >
                <Calendar size={15} />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1.5px solid #fce7f3',
                background: '#fff1f2',
                color: '#881337',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Horizontal Pill Bar ── */}
      <div className="mobile-tabs-pillbar">
        {[
          { id: 'HOME', label: 'Home' },
          { id: 'ABOUT', label: 'About' },
          { id: 'SERVICES', label: 'Services' },
          { id: 'MAKEOVER', label: '✨ Makeover Studio' },
          { id: 'COURSES', label: 'Courses' },
          { id: 'CONTACT', label: 'Contact' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: isActive ? '1px solid #be123c' : '1px solid #e2e8f0',
                background: isActive ? '#be123c' : '#f8fafc',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '12px',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Mobile Slide-Out Drawer Menu ── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 998,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '82%',
              maxWidth: '340px',
              height: '100%',
              background: '#ffffff',
              padding: '1.75rem 1.25rem',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #fce7f3', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#881337' }}>GOLDEN BEAUTY</div>
                  <div style={{ fontSize: '10px', color: '#be123c', fontWeight: 700 }}>PARLOUR, SALON & ACADEMY</div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ border: 'none', background: '#f1f5f9', borderRadius: '8px', padding: 6, cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { id: 'HOME', label: 'Home Overview', icon: Home },
                  { id: 'ABOUT', label: 'About Smt. Sneha Maurya', icon: Heart },
                  { id: 'SERVICES', label: 'All Services (24+)', icon: Sparkles },
                  { id: 'MAKEOVER', label: '✨ Virtual Makeover & Try-On', icon: Camera },
                  { id: 'COURSES', label: 'Academy Courses & Ear Locking', icon: GraduationCap },
                  { id: 'CONTACT', label: 'Contact & Google Map', icon: MapPin },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabChange(item.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: 'none',
                        background: isActive ? '#fff1f2' : 'transparent',
                        color: isActive ? '#be123c' : '#334155',
                        fontWeight: isActive ? 800 : 600,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <ItemIcon size={18} color={isActive ? '#be123c' : '#64748b'} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Contact Info inside Drawer */}
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#fdf2f8', borderRadius: '12px', border: '1px solid #fce7f3' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#881337', marginBottom: 4 }}>
                  📍 Naibazar, Sathwa Road
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.4, marginBottom: 8 }}>
                  Near Jaygurudev Event & Near Kashi Service, Varanasi
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669' }}>
                  📞 +91 98765 43210
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSelectedServiceForBooking('Royale Airbrush Bridal HD Makeover');
                  setBookingModalOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 6px 16px rgba(190, 18, 60, 0.3)',
                }}
              >
                <Calendar size={16} />
                <span>Book Appointment</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 1: HOME TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'HOME' && (
        <div style={{ width: '100%' }}>
          {/* Hero Banner */}
          <section
            style={{
              padding: 'clamp(2.5rem, 5vw, 5rem) 0',
              background: 'linear-gradient(135deg, #fff1f2 0%, #ffffff 50%, #fdf2f8 100%)',
              borderBottom: '1px solid #fce7f3',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div className="golden-fluid-container">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
                  gap: 'clamp(2rem, 4vw, 4rem)',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: '999px', background: '#ffe4e6', color: '#be123c', fontSize: '11px', fontWeight: 800, marginBottom: '1.25rem' }}>
                    <Gem size={14} />
                    <span>EASTERN UP’S PREMIER BRIDAL COUTURE & TRAINING ACADEMY</span>
                  </div>
                  <h1 style={{ fontSize: 'clamp(2.1rem, 4vw, 3.4rem)', fontWeight: 900, color: '#881337', lineHeight: 1.15, margin: '0 0 1rem', letterSpacing: '-0.025em' }}>
                    Where Timeless Bridal Beauty Meets Master Artistry
                  </h1>
                  <p style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)', color: '#475569', lineHeight: 1.65, margin: '0 0 2rem' }}>
                    Welcome to <strong>Golden Beauty Parlour & Salon</strong> in Varanasi. We specialize in Royale Airbrush HD Makeovers, Brazilian Keratin Hair Therapy, Clinical Hydra Facials, Ear Locking Treatment, and Certified Beauty Training Courses.
                  </p>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleTabChange('MAKEOVER')}
                      style={{
                        padding: '13px 26px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #9333ea 0%, #be123c 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '14px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        boxShadow: '0 8px 24px rgba(147, 51, 234, 0.4)',
                      }}
                    >
                      <Camera size={17} />
                      <span>Virtual Bridal Try-On ✨</span>
                    </button>

                    <button
                      onClick={() => handleTabChange('SERVICES')}
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
                      <span>Explore Services</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>

                  {/* 3 Quick USPs */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '1rem',
                      marginTop: '2.5rem',
                      paddingTop: '2rem',
                      borderTop: '1px solid #fecdd3',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 900, color: '#881337' }}>1,800+</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Royal Brides Styled</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 900, color: '#881337' }}>450+</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Academy Beauticians</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 900, color: '#881337' }}>100%</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Sterilized & Organic</div>
                    </div>
                  </div>
                </div>

                {/* Right Image Collage */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <img
                    src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80"
                    alt="Golden Beauty Royale Bride"
                    style={{
                      width: '100%',
                      height: 'clamp(280px, 42vw, 460px)',
                      objectFit: 'cover',
                      borderRadius: '24px',
                      boxShadow: '0 20px 40px rgba(136, 19, 55, 0.2)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      right: 16,
                      maxWidth: '360px',
                      background: 'rgba(255, 255, 255, 0.96)',
                      backdropFilter: 'blur(8px)',
                      padding: '0.85rem 1.25rem',
                      borderRadius: '16px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                      border: '1px solid #fce7f3',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ffe4e6', color: '#be123c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, fontSize: '12.5px', color: '#881337' }}>Varanasi No. 1 Salon & Academy</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Naibazar, Sathwa Road (Near Sarnath)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Services Preview Section */}
          <section style={{ padding: 'clamp(2.5rem, 4vw, 4.5rem) 0', width: '100%' }}>
            <div className="golden-fluid-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>SIGNATURE TREATMENTS</span>
                  <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 900, color: '#881337', margin: '6px 0 0' }}>Our Signature Specialties</h2>
                </div>
                <button
                  onClick={() => handleTabChange('SERVICES')}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #fecdd3',
                    background: '#fff',
                    color: '#881337',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>View Full 24+ Services Menu</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                  gap: '1.5rem',
                  width: '100%',
                }}
              >
                {servicesList.slice(0, 4).map((s) => (
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
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#be123c', color: '#fff', border: 'none', fontWeight: 800, fontSize: '12.5px', cursor: 'pointer' }}
                      >
                        Book Service
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section style={{ padding: 'clamp(2.5rem, 4vw, 4.5rem) 0', width: '100%' }}>
            <div className="golden-fluid-container">
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase' }}>REAL REVIEWS</span>
                <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.2rem)', fontWeight: 900, color: '#881337', margin: '4px 0 6px' }}>Love from Our Brides & Students</h2>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Verified customer and academy student experiences across Varanasi</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem' }}>
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
            </div>
          </section>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 2: ABOUT TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'ABOUT' && (
        <div style={{ width: '100%', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
          <div className="golden-fluid-container">
            <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto clamp(2rem, 4vw, 3.5rem)' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>HERITAGE & ARTISTRY</span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#881337', margin: '6px 0 12px' }}>
                About Golden Beauty Parlour & Salon
              </h1>
              <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                Rooted in the cultural capital of Varanasi, Golden Beauty Parlour is a sanctuary of Indian bridal heritage, clinical skin aesthetics, and certified cosmetology education.
              </p>
            </div>

            {/* Founder Showcase */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '24px',
                border: '1.5px solid #fce7f3',
                padding: 'clamp(1.5rem, 3.5vw, 3rem)',
                boxShadow: '0 10px 30px rgba(136, 19, 55, 0.05)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
                gap: 'clamp(2rem, 4vw, 3rem)',
                alignItems: 'center',
                marginBottom: '3.5rem',
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: '999px', background: '#ffe4e6', color: '#be123c', fontSize: '11px', fontWeight: 800, marginBottom: '1rem' }}>
                  <Award size={14} />
                  <span>FOUNDER & MASTER COSMETOLOGIST</span>
                </div>
                <h2 style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.2rem)', fontWeight: 900, color: '#881337', margin: '0 0 6px' }}>
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
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#881337' }}>1,800+</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Brides Personally Styled</div>
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#881337' }}>450+</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Students Mentored</div>
                  </div>
                </div>
              </div>

              <div>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=700&q=80"
                  alt="Sneha Maurya - Founder Golden Beauty Parlour"
                  style={{ width: '100%', height: 'clamp(280px, 38vw, 440px)', objectFit: 'cover', borderRadius: '20px', boxShadow: '0 16px 36px rgba(0,0,0,0.1)' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 3: SERVICES TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'SERVICES' && (
        <div style={{ width: '100%', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
          <div className="golden-fluid-container">
            <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>FULL LUXURY MENU</span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 900, color: '#881337', margin: '6px 0 10px' }}>
                Our Services & Packages
              </h1>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                Select a category or search for bridal makeovers, keratin therapy, hydra facials, or ear piercing.
              </p>
            </div>

            {/* Search & Categories Filter */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
              <div className="category-scroll-container" style={{ background: '#fdf2f8', padding: '4px', borderRadius: '10px', border: '1px solid #fce7f3' }}>
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
                      flexShrink: 0,
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px', maxWidth: '380px' }}>
                <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 11 }} />
                <input
                  type="text"
                  placeholder="Search service..."
                  value={serviceSearch}
                  onChange={(e) => setServiceSearch(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>
            </div>

            {/* Services Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.75rem', width: '100%' }}>
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
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 4: VIRTUAL MAKEOVER & TRY-ON STUDIO (NEW FEATURE)
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'MAKEOVER' && (
        <div style={{ width: '100%', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
          <div className="golden-fluid-container">
            {/* Header */}
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: '999px', background: '#fae8ff', color: '#9333ea', fontSize: '11.5px', fontWeight: 900, marginBottom: '0.75rem' }}>
                <Sparkles size={14} />
                <span>AI VIRTUAL BRIDAL & MAKEOVER STUDIO • अपना फोटो डालें और लुक देखें</span>
              </div>
              <h1 style={{ fontSize: 'clamp(2.1rem, 3.5vw, 2.8rem)', fontWeight: 900, color: '#881337', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
                Virtual Makeover & Bridal Visualizer
              </h1>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                अपना फोटो अपलोड करें और तुरंत देखें कि आप <strong>Royale Bridal</strong>, <strong>Engagement Soft Glam</strong>, <strong>Reception</strong> या <strong>Haldi Floral</strong> लुक में कैसी दिखेंगी! गहनों (Jewelry) और लहंगे के दुपट्टे का रंग भी कस्टमाइज़ करें।
              </p>
            </div>

            {/* Studio Workspace Layout */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 460px), 1fr))',
                gap: 'clamp(1.5rem, 3vw, 2.5rem)',
                alignItems: 'start',
              }}
            >
              {/* ── Left Column: Interactive Canvas & Look Preview ── */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: 'clamp(1.25rem, 3vw, 2rem)',
                  border: '1.5px solid #fce7f3',
                  boxShadow: '0 12px 36px rgba(136, 19, 55, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Canvas Top Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Crown size={18} color="#be123c" />
                    <span style={{ fontWeight: 900, fontSize: '13.5px', color: '#881337' }}>
                      {makeoverOccasion === 'BRIDAL' && '👑 Royale Rajputana Bridal Look'}
                      {makeoverOccasion === 'ENGAGEMENT' && '💍 Celebrity Engagement Soft Glam'}
                      {makeoverOccasion === 'RECEPTION' && '💃 Reception Cocktail Glam'}
                      {makeoverOccasion === 'HALDI' && '🌼 Haldi & Mehendi Sunshine Glow'}
                    </span>
                  </div>

                  {/* Compare Toggle */}
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      background: compareMode ? '#f1f5f9' : '#fff1f2',
                      color: compareMode ? '#475569' : '#be123c',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Eye size={14} />
                    <span>{compareMode ? 'Show Makeover Look' : '👁️ Show Original (Before)'}</span>
                  </button>
                </div>

                {/* ── Visualizer Frame (Photo with Overlay) ── */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 'clamp(360px, 48vw, 480px)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.15)',
                    background: '#1e1b4b',
                  }}
                >
                  {/* Base Photo */}
                  <img
                    src={currentFacePhoto}
                    alt="Makeover Canvas"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: compareMode
                        ? 'none'
                        : glowFinish === 'GOLD'
                        ? 'contrast(1.06) brightness(1.04) saturate(1.12)'
                        : glowFinish === 'GLASS'
                        ? 'contrast(1.02) brightness(1.08) saturate(1.05)'
                        : 'contrast(1.08) brightness(0.98)',
                      transition: 'all 0.3s ease',
                    }}
                  />

                  {/* Virtual Makeover Overlays (when not in compare mode) */}
                  {!compareMode && (
                    <>
                      {/* 1. Dupatta Drape Frame around head */}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          pointerEvents: 'none',
                          borderTop: `28px solid ${dupattaColor}`,
                          borderLeft: `34px solid ${dupattaColor}`,
                          borderRight: `34px solid ${dupattaColor}`,
                          borderBottom: `50px solid ${dupattaColor}`,
                          borderRadius: '20px',
                          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
                          opacity: 0.92,
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {/* Zardozi Gold Border Simulation */}
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            borderTop: '3px dashed #facc15',
                            borderLeft: '3px dashed #facc15',
                            borderRight: '3px dashed #facc15',
                            borderBottom: '4px solid #eab308',
                            opacity: 0.85,
                          }}
                        />
                      </div>

                      {/* 2. Maang Tikka on Forehead */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '28px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      >
                        <div style={{ width: 2, height: 26, background: jewelryStyle === 'POLKI' ? '#e2e8f0' : '#eab308', boxShadow: '0 0 6px rgba(234, 179, 8, 0.8)' }} />
                        <div
                          style={{
                            width: makeoverOccasion === 'BRIDAL' ? 32 : 24,
                            height: makeoverOccasion === 'BRIDAL' ? 32 : 24,
                            borderRadius: '50%',
                            background:
                              jewelryStyle === 'KUNDAN'
                                ? 'radial-gradient(circle, #fef08a 0%, #ca8a04 70%, #854d0e 100%)'
                                : jewelryStyle === 'POLKI'
                                ? 'radial-gradient(circle, #ffffff 0%, #cbd5e1 60%, #475569 100%)'
                                : jewelryStyle === 'FLORAL'
                                ? 'radial-gradient(circle, #fef08a 0%, #eab308 60%, #ca8a04 100%)'
                                : 'radial-gradient(circle, #fef08a 0%, #b45309 80%, #78350f 100%)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid #ffffff',
                          }}
                        >
                          <Sparkle size={14} color="#ffffff" />
                        </div>
                      </div>

                      {/* 3. Traditional Red Bindi for Bridal / Engagement */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '32%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: makeoverOccasion === 'BRIDAL' ? 10 : 7,
                          height: makeoverOccasion === 'BRIDAL' ? 10 : 7,
                          borderRadius: '50%',
                          background: makeoverOccasion === 'BRIDAL' ? '#991b1b' : '#be123c',
                          boxShadow: '0 0 4px rgba(0,0,0,0.4)',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      />

                      {/* 4. Traditional Bridal Nath (Nose Ring with Chain) - Visible in Bridal Look */}
                      {makeoverOccasion === 'BRIDAL' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '49%',
                            left: '46%',
                            pointerEvents: 'none',
                            zIndex: 10,
                          }}
                        >
                          {/* Round Ring */}
                          <div
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: '50%',
                              border: '2px solid #facc15',
                              boxShadow: '0 0 6px rgba(250, 204, 21, 0.8)',
                            }}
                          />
                          {/* Pearl Chain extending to ear */}
                          <div
                            style={{
                              position: 'absolute',
                              top: 2,
                              left: 18,
                              width: 48,
                              height: 1,
                              borderTop: '1.5px dotted #fef08a',
                              transform: 'rotate(24deg)',
                            }}
                          />
                        </div>
                      )}

                      {/* 5. Choker / Royal Necklace at Neckline */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '50px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '74%',
                          maxWidth: '280px',
                          height: '38px',
                          borderRadius: '0 0 100px 100px',
                          borderBottom:
                            jewelryStyle === 'POLKI'
                              ? '8px double #e2e8f0'
                              : jewelryStyle === 'FLORAL'
                              ? '9px dotted #facc15'
                              : '9px ridge #eab308',
                          boxShadow: '0 6px 14px rgba(0,0,0,0.4)',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      />

                      {/* 6. Lipstick & Cosmetic Radiance Tint */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '33%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '42px',
                          height: '16px',
                          borderRadius: '8px',
                          background:
                            lipstickShade === 'RUBY'
                              ? 'rgba(185, 28, 28, 0.28)'
                              : lipstickShade === 'ROSE'
                              ? 'rgba(219, 39, 119, 0.28)'
                              : lipstickShade === 'NUDE'
                              ? 'rgba(234, 88, 12, 0.22)'
                              : 'rgba(88, 28, 135, 0.28)',
                          filter: 'blur(3px)',
                          pointerEvents: 'none',
                        }}
                      />

                      {/* Occasion Watermark Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 12,
                          left: 14,
                          background: 'rgba(0,0,0,0.65)',
                          backdropFilter: 'blur(6px)',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 800,
                        }}
                      >
                        ✨ Styled by Sneha Maurya • Golden Beauty
                      </div>
                    </>
                  )}
                </div>

                {/* Bottom Canvas Controls: Photo Selection / Upload */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                      Step 1: Choose Model Face or Upload Your Own Photo
                    </span>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#be123c',
                        color: '#fff',
                        border: 'none',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Upload size={13} />
                      <span>Upload Your Photo</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* 4 Sample Model Thumbnails */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {sampleModels.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setCurrentFacePhoto(m.url);
                          setIsCustomUploaded(false);
                          setCompareMode(false);
                        }}
                        style={{
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: currentFacePhoto === m.url && !isCustomUploaded ? '2.5px solid #be123c' : '1px solid #e2e8f0',
                          cursor: 'pointer',
                          position: 'relative',
                          height: '70px',
                        }}
                      >
                        <img src={m.url} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: 2, left: 2, right: 2, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9.5px', fontWeight: 700, textAlign: 'center', borderRadius: '4px', padding: '1px' }}>
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right Column: Interactive Makeover Controls & Actions ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* 1. Occasion Look Selector */}
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #fce7f3' }}>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#881337', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Step 2: Choose Makeover Style (लुक चुनें)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { id: 'BRIDAL', label: '👑 Royale Bridal Look', desc: 'Heavy Kundan, Nath, Red Drape & Bindi', defaultColor: '#991b1b' },
                      { id: 'ENGAGEMENT', label: '💍 Engagement Soft Glam', desc: 'Diamond Polki, Peach Glow, Rose Eyes', defaultColor: '#ea580c' },
                      { id: 'RECEPTION', label: '💃 Reception Cocktail', desc: 'Wine Velvet, Emerald Jewelry & Sculpt', defaultColor: '#581c87' },
                      { id: 'HALDI', label: '🌼 Haldi & Mehendi Glow', desc: 'Floral Jewelry, Yellow Sunkissed Glow', defaultColor: '#ca8a04' },
                    ].map((occ) => {
                      const isSelected = makeoverOccasion === occ.id;
                      return (
                        <div
                          key={occ.id}
                          onClick={() => {
                            setMakeoverOccasion(occ.id);
                            setDupattaColor(occ.defaultColor);
                            setCompareMode(false);
                          }}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid #be123c' : '1px solid #e2e8f0',
                            background: isSelected ? '#fff1f2' : '#f8fafc',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ fontWeight: 800, fontSize: '13px', color: isSelected ? '#881337' : '#0f172a', marginBottom: 2 }}>
                            {occ.label}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.3 }}>{occ.desc}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Lehenga / Dupatta Color Customizer */}
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #fce7f3' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#881337', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Step 3: Dupatta / Outfit Color (दुपट्टे का रंग)
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { code: '#991b1b', name: 'Crimson Red' },
                      { code: '#be185d', name: 'Rani Pink' },
                      { code: '#ea580c', name: 'Pastel Peach' },
                      { code: '#581c87', name: 'Royal Wine' },
                      { code: '#ca8a04', name: 'Haldi Yellow' },
                      { code: '#065f46', name: 'Emerald Green' },
                    ].map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setDupattaColor(c.code);
                          setCompareMode(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: '999px',
                          border: dupattaColor === c.code ? '2px solid #0f172a' : '1px solid #cbd5e1',
                          background: '#ffffff',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        <span style={{ width: 14, height: 14, borderRadius: '50%', background: c.code, display: 'inline-block' }} />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Jewelry Style Customizer */}
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #fce7f3' }}>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#881337', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Step 4: Jewelry Style (गहने / ज्वेलरी)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                    {[
                      { id: 'KUNDAN', label: '24K Kundan & Pearl', icon: '👑' },
                      { id: 'POLKI', label: 'Diamond & Polki', icon: '💎' },
                      { id: 'FLORAL', label: 'Floral Gota Patti', icon: '🌸' },
                      { id: 'TEMPLE', label: 'Temple Heritage Gold', icon: '🛕' },
                    ].map((j) => {
                      const isSel = jewelryStyle === j.id;
                      return (
                        <button
                          key={j.id}
                          onClick={() => {
                            setJewelryStyle(j.id);
                            setCompareMode(false);
                          }}
                          style={{
                            padding: '9px 12px',
                            borderRadius: '10px',
                            border: isSel ? '2px solid #be123c' : '1px solid #cbd5e1',
                            background: isSel ? '#fff1f2' : '#ffffff',
                            color: isSel ? '#881337' : '#334155',
                            fontWeight: 800,
                            fontSize: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            justifyContent: 'center',
                          }}
                        >
                          <span>{j.icon}</span>
                          <span>{j.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Lipstick Shade & Glow Finish */}
                <div style={{ background: '#ffffff', borderRadius: '20px', padding: '1.5rem', border: '1.5px solid #fce7f3' }}>
                  <div style={{ fontSize: '13px', fontWeight: 900, color: '#881337', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Step 5: Lip Shade & Bridal Glow (लिपस्टिक व ग्लो)
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {[
                      { id: 'RUBY', label: 'Velvet Ruby', color: '#b91c1c' },
                      { id: 'ROSE', label: 'Rose Blossom', color: '#db2777' },
                      { id: 'NUDE', label: 'Coral Nude', color: '#ea580c' },
                      { id: 'PLUM', label: 'Rich Plum', color: '#581c87' },
                    ].map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          setLipstickShade(l.id);
                          setCompareMode(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: lipstickShade === l.id ? '2px solid #be123c' : '1px solid #e2e8f0',
                          background: lipstickShade === l.id ? '#fff1f2' : '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <span style={{ width: 12, height: 12, borderRadius: '50%', background: l.color }} />
                        <span>{l.label}</span>
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    {[
                      { id: 'GOLD', label: '✨ 24K Radiant Gold Glow' },
                      { id: 'GLASS', label: '💎 High-Shine Dewy Glass' },
                      { id: 'MATTE', label: '🛡️ Velvet HD Matte' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => {
                          setGlowFinish(g.id);
                          setCompareMode(false);
                        }}
                        style={{
                          flex: 1,
                          padding: '7px 10px',
                          borderRadius: '8px',
                          border: glowFinish === g.id ? '2px solid #7e22ce' : '1px solid #e2e8f0',
                          background: glowFinish === g.id ? '#faf5ff' : '#ffffff',
                          color: glowFinish === g.id ? '#7e22ce' : '#475569',
                          fontWeight: 800,
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Direct Action CTA Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      const occTitle =
                        makeoverOccasion === 'BRIDAL'
                          ? 'Royale Bridal Makeover'
                          : makeoverOccasion === 'ENGAGEMENT'
                          ? 'Engagement Soft Glam Makeover'
                          : makeoverOccasion === 'RECEPTION'
                          ? 'Reception Cocktail Makeover'
                          : 'Haldi Floral Sunshine Makeover';
                      setSelectedServiceForBooking(`${occTitle} (Custom Try-On Look)`);
                      setBookingForm((prev) => ({
                        ...prev,
                        serviceName: `${occTitle} (Custom Look: ${dupattaColor} Drape, ${jewelryStyle} Jewelry)`,
                      }));
                      setBookingModalOpen(true);
                    }}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 900,
                      fontSize: '14.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      boxShadow: '0 8px 24px rgba(244, 63, 94, 0.4)',
                    }}
                  >
                    <Calendar size={18} />
                    <span>Book This Exact Look with Sneha Maurya</span>
                  </button>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <a
                      href={`https://wa.me/919876543210?text=Hello%20Sneha%20Ma'am,%20I%20tried%20the%20Virtual%20Makeover%20Studio%20for%20${makeoverOccasion}%20look%20with%20${jewelryStyle}%20jewelry.%20I%20would%20like%20to%20book%20a%20bridal%20appointment!`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: '#25d366',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <MessageCircle size={15} />
                      <span>WhatsApp Look to Salon</span>
                    </a>

                    <button
                      onClick={() => alert('Look saved successfully! Take a screenshot or share on WhatsApp with Sneha Maurya at +91 98765 43210.')}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        color: '#334155',
                        fontWeight: 800,
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Share2 size={15} />
                      <span>Save / Share Look</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 5: COURSES & ACADEMY TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'COURSES' && (
        <div style={{ width: '100%', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
          <div className="golden-fluid-container">
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto clamp(2rem, 4vw, 3.5rem)' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CERTIFIED BEAUTY ACADEMY</span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#881337', margin: '6px 0 12px' }}>
                Golden Beauty Academy Courses & Admissions
              </h1>
              <p style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.05rem)', color: '#475569', lineHeight: 1.65, margin: 0 }}>
                Learn from award-winning master cosmetologists. We offer 3 structured certification courses with live model practicals, ear locking specialization, and salon management training.
              </p>
            </div>

            {/* 3 Main Course Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
              {academyCourses.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '24px',
                    border: c.id === 'course_golden' ? '2.5px solid #be123c' : '1px solid #fce7f3',
                    padding: 'clamp(1.5rem, 3vw, 2rem)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: c.id === 'course_golden' ? '0 12px 36px rgba(190, 18, 60, 0.15)' : '0 4px 14px rgba(0,0,0,0.03)',
                    position: 'relative',
                  }}
                >
                  {c.id === 'course_golden' && (
                    <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#be123c', color: '#fff', fontSize: '11px', fontWeight: 900, padding: '4px 14px', borderRadius: '999px', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                      MOST RECOMMENDED ALL-IN-ONE
                    </span>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 6 }}>
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

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' }}>
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
                padding: 'clamp(1.5rem, 4vw, 3rem)',
                boxShadow: '0 16px 40px rgba(136, 19, 55, 0.25)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: '2.5rem',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ background: 'rgba(255,255,255,0.15)', color: '#ffe4e6', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px' }}>
                  SPECIAL MASTER PRACTICALS
                </span>
                <h2 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', fontWeight: 900, margin: '10px 0', lineHeight: 1.25 }}>
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
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          VIEW 6: CONTACT & REAL GOOGLE MAP TAB
          ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CONTACT' && (
        <div style={{ width: '100%', padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
          <div className="golden-fluid-container">
            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto clamp(2rem, 4vw, 3rem)' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#be123c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>VISIT OUR SANCTUARY</span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.7rem)', fontWeight: 900, color: '#881337', margin: '6px 0 10px' }}>
                Contact & Location Map
              </h1>
              <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
                Conveniently located in Naibazar, Sarnath corridor, Varanasi. Drop by for beauty consultations, bridal bookings, or academy inquiries.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
              {/* Address Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ background: '#ffffff', padding: 'clamp(1.25rem, 3vw, 1.75rem)', borderRadius: '18px', border: '1.5px solid #fce7f3', boxShadow: '0 4px 14px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#881337', fontWeight: 900, fontSize: '1.1rem', marginBottom: 10 }}>
                    <MapPin size={22} color="#be123c" style={{ flexShrink: 0 }} />
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

                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a
                      href="https://maps.google.com/?q=Naibazar+Sathwa+Road+Varanasi"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '9px 18px',
                        borderRadius: '8px',
                        background: '#be123c',
                        color: '#fff',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <Navigation size={14} />
                      <span>Open in Google Maps</span>
                    </a>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: 'clamp(1.25rem, 3vw, 1.75rem)', borderRadius: '18px', border: '1.5px solid #fce7f3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#881337', fontWeight: 900, fontSize: '1.1rem', marginBottom: 10 }}>
                    <Phone size={20} color="#059669" style={{ flexShrink: 0 }} />
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
                      padding: '9px 18px',
                      borderRadius: '8px',
                      background: '#25d366',
                      color: '#fff',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <MessageCircle size={15} />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <div style={{ background: '#ffffff', padding: 'clamp(1.25rem, 3vw, 1.75rem)', borderRadius: '18px', border: '1.5px solid #fce7f3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#881337', fontWeight: 900, fontSize: '1.1rem', marginBottom: 8 }}>
                    <Clock size={20} color="#7e22ce" style={{ flexShrink: 0 }} />
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
              <div style={{ background: '#ffffff', padding: 'clamp(1.5rem, 3vw, 2.25rem)', borderRadius: '24px', border: '1.5px solid #fce7f3', boxShadow: '0 8px 24px rgba(136, 19, 55, 0.04)' }}>
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

            {/* Google Map Embed */}
            <div style={{ background: '#ffffff', borderRadius: '24px', overflow: 'hidden', border: '1.5px solid #fce7f3', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', width: '100%' }}>
              <div style={{ padding: '1.25rem clamp(1rem, 3vw, 1.75rem)', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
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

              <div style={{ height: 'clamp(280px, 35vw, 450px)', width: '100%', background: '#f1f5f9' }}>
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
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════════════════════════════════ */}
      <footer className="footer-section" style={{ background: '#4c0519', color: '#fce7f3', padding: 'clamp(2.5rem, 4vw, 4rem) 0 2rem', marginTop: '4rem', width: '100%' }}>
        <div className="golden-fluid-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
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
                <span style={{ cursor: 'pointer' }} onClick={() => handleTabChange('MAKEOVER')}>Virtual Makeover Studio ✨</span>
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
        </div>
      </footer>

      {/* ── Mobile Sticky Bottom Bar ── */}
      <div className="mobile-bottom-bar">
        <a
          href="tel:+919876543210"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#0f172a',
            fontSize: '10.5px',
            fontWeight: 700,
            gap: 2,
          }}
        >
          <PhoneCall size={18} color="#059669" />
          <span>Call Now</span>
        </a>

        <a
          href="https://wa.me/919876543210?text=Hello%20Golden%20Beauty%20Parlour,%20I%20would%20like%20to%20inquire%20about%20services/courses."
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            color: '#0f172a',
            fontSize: '10.5px',
            fontWeight: 700,
            gap: 2,
          }}
        >
          <MessageCircle size={18} color="#25d366" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => handleTabChange('MAKEOVER')}
          style={{
            padding: '7px 14px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #9333ea 0%, #be123c 100%)',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '11.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
            cursor: 'pointer',
          }}
        >
          <Camera size={14} />
          <span>Try-On</span>
        </button>

        <button
          onClick={() => handleTabChange('COURSES')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: activeTab === 'COURSES' ? '#be123c' : '#0f172a',
            fontSize: '10.5px',
            fontWeight: 700,
            gap: 2,
            cursor: 'pointer',
          }}
        >
          <GraduationCap size={18} color={activeTab === 'COURSES' ? '#be123c' : '#64748b'} />
          <span>Courses</span>
        </button>
      </div>

      {/* ═══════════════════ MODAL: APPOINTMENT BOOKING ═══════════════════ */}
      {bookingModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: 'clamp(1.25rem, 3vw, 2rem)', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', maxHeight: '92vh', overflowY: 'auto' }}>
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
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
          <div style={{ background: '#ffffff', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: 'clamp(1.25rem, 3vw, 2rem)', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', maxHeight: '92vh', overflowY: 'auto' }}>
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
