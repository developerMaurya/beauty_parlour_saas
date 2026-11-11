import GlobalCustomerHeaderPill from '../../../components/common/GlobalCustomerHeaderPill.jsx';
import { useCustomer } from '../../../context/CustomerContext.jsx';
/**
 * @file RBSoftwareWebsite.jsx
 * @description Dedicated Full-Width High-Tech Futuristic Software Agency, Cinema & Photography Studio Website.
 * Covers:
 *   1. RB Software Engineering: Enterprise Cloud SaaS, OmniPOS GST ERP, Mobile Apps, Meta WhatsApp API.
 *   2. Creative Media Studio: Sony FX3 & A7IV Cinema Cameras, DJI Mavic 3 Pro Aerial Drones, Royal Wedding & Candid Photography, 4K Cinematic Films, Multi-Cam Live Streaming.
 *   3. Dedicated Tab Page Views via useSearchParams (?tab=...) with breadcrumbs and full-width responsive UX.
 *   4. Interactive Tech & Media Quotation Builder with real-time WhatsApp dispatch and localStorage sync.
 * @module frontend/src/modules/public/pages/RBSoftwareWebsite
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Code2,
  Cpu,
  Layers,
  Terminal,
  Server,
  Database,
  Cloud,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Smartphone,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Phone,
  MonitorCheck,
  Workflow,
  Lock,
  Camera,
  Video,
  Film,
  Aperture,
  Sliders,
  Radio,
  Tv,
  Check,
  Clock,
  MapPin,
  Calendar,
  Send,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Star,
  Award,
  Flame,
  FileText,
  Eye,
  RefreshCw,
  HardDrive,
  BookOpen,
  Heart,
  Mic,
  Maximize2,
  Home,
} from 'lucide-react';

export default function RBSoftwareWebsite() {
  const { isAuthenticated, customer, openAuthModal, submitServiceBooking } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Auto-detect default tab from URL pathname (e.g. /photography -> photography)
  const defaultTab = location.pathname.includes('photography') || location.pathname.includes('camera')
    ? 'photography'
    : location.pathname.includes('videography') || location.pathname.includes('media')
    ? 'videography'
    : 'home';

  const activeTab = searchParams.get('tab') || defaultTab;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [softwareCategory, setSoftwareCategory] = useState('ALL');
  const [mediaCategory, setMediaCategory] = useState('ALL');
  const [selectedPortfolioItem, setSelectedPortfolioItem] = useState(null);

  // Proposal Calculator State
  const [calcSoftware, setCalcSoftware] = useState('omnipos'); // 'none' | 'omnipos' | 'saas' | 'website' | 'ecommerce' | 'mobile' | 'enterprise_erp' | 'whatsapp'
  const [calcPhoto, setCalcPhoto] = useState('wedding_candid'); // 'none' | 'prewedding' | 'wedding_candid' | 'commercial'
  const [calcVideo, setCalcVideo] = useState('cinema_4k'); // 'none' | 'video_teaser' | 'video_full' | 'cinema_4k' | 'drone_aerial' | 'multicam_live'
  const [calcAlbumTier, setCalcAlbumTier] = useState('leatherette'); // 'none' | 'silk' | 'leatherette' | 'acrylic'
  const [calcDroneTier, setCalcDroneTier] = useState('none'); // 'none' | 'barat_drone' | 'fullday_drone' | 'fpv_combo'
  const [calcAddonAlbum, setCalcAddonAlbum] = useState(true);
  const [calcAddonReels, setCalcAddonReels] = useState(true);
  const [calcAddonDrone, setCalcAddonDrone] = useState(false);
  const [calcClientName, setCalcClientName] = useState('');
  const [calcClientPhone, setCalcClientPhone] = useState('');
  const [calcEventDate, setCalcEventDate] = useState('');
  const [calcSubmitted, setCalcSubmitted] = useState(false);

  // Set page tab helper
  const handleTabChange = (tab) => {
    setSearchParams({ tab });
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Pricing calculations
  const calculateTotal = () => {
    let total = 0;
    if (calcSoftware === 'omnipos') total += 18500;
    if (calcSoftware === 'saas') total += 45000;
    if (calcSoftware === 'website') total += 14999;
    if (calcSoftware === 'ecommerce') total += 28000;
    if (calcSoftware === 'mobile') total += 38000;
    if (calcSoftware === 'enterprise_erp') total += 55000;
    if (calcSoftware === 'whatsapp') total += 12000;

    if (calcPhoto === 'prewedding') total += 22000;
    if (calcPhoto === 'wedding_candid') total += 48000;
    if (calcPhoto === 'commercial') total += 18000;

    if (calcVideo === 'video_teaser') total += 18000;
    if (calcVideo === 'video_full') total += 28000;
    if (calcVideo === 'cinema_4k') total += 42000;
    if (calcVideo === 'drone_aerial') total += 22000;
    if (calcVideo === 'multicam_live') total += 35000;

    if (calcAlbumTier === 'silk') total += 9500;
    if (calcAlbumTier === 'leatherette') total += 14500;
    if (calcAlbumTier === 'acrylic') total += 21000;

    if (calcDroneTier === 'barat_drone') total += 12000;
    if (calcDroneTier === 'fullday_drone') total += 22000;
    if (calcDroneTier === 'fpv_combo') total += 32000;

    if (calcAddonReels) total += 12000;

    return total;
  };

  // Reusable High-Visibility Sub-Navigation for every Tab View
  const renderTabTopNav = (currentTabTitle) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        padding: '10px 18px',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '10px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.4)',
          }}
          title="Return to Master Platform Hub"
        >
          <Home size={15} /> 🏠 Main Page (All Services)
        </button>
        <button
          onClick={() => handleTabChange('home')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#e2e8f0',
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← Back to Overview
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Quick Jump:</span>
        {[
          { id: 'software', label: '💻 Software' },
          { id: 'photography', label: '📸 Photography' },
          { id: 'videography', label: '🎥 4K Video' },
          { id: 'gear', label: '⚙️ Gear' },
          { id: 'portfolio', label: '🎨 Portfolio' },
          { id: 'calculator', label: '🧮 Estimator' },
          { id: 'contact', label: '📍 Contact' },
        ]
          .filter((t) => t.id !== activeTab)
          .slice(0, 4)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '5px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          ))}
      </div>
    </div>
  );

  const renderTabBottomNav = () => (
    <div
      style={{
        marginTop: '3.5rem',
        padding: '1.5rem',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13.5px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
          }}
        >
          <Home size={16} /> 🏠 Return to Master Main Page
        </button>
        <button
          onClick={() => handleTabChange('home')}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ← Back to Overview
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => handleTabChange('calculator')}
          style={{
            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
            color: '#0f172a',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.35)',
          }}
        >
          <Sparkles size={15} /> Open Instant Proposal Calculator →
        </button>
      </div>
    </div>
  );

  const handleDispatchProposal = (e) => {
    e.preventDefault();
    const total = calculateTotal();
    const proposalData = {
      id: `RBM-${Date.now().toString().slice(-5)}`,
      clientName: calcClientName || 'Valued Client',
      phone: calcClientPhone || 'Not provided',
      eventDate: calcEventDate || 'Flexible',
      software: calcSoftware,
      photo: calcPhoto,
      video: calcVideo,
      addons: {
        album: calcAddonAlbum,
        reels: calcAddonReels,
        drone: calcAddonDrone,
      },
      totalAmount: total,
      timestamp: new Date().toISOString(),
      status: 'Pending',
    };

    // Save to localStorage for Admin dashboard sync
    try {
      const existing = JSON.parse(localStorage.getItem('rb_tech_media_proposals') || '[]');
      existing.unshift(proposalData);
      localStorage.setItem('rb_tech_media_proposals', JSON.stringify(existing));
      if (typeof submitServiceBooking === 'function') {
        submitServiceBooking({
          serviceType: calcSoftware !== 'none' ? 'software' : 'photography',
          serviceName: `Tech: ${calcSoftware.toUpperCase()} | 4K Cinema: ${calcVideo.toUpperCase()} | Album: ${calcAlbumTier.toUpperCase()}`,
          customerName: calcClientName || customer?.name || 'Client',
          customerPhone: calcClientPhone || customer?.phone || '',
          eventDate: calcEventDate || 'Target Launch',
          budget: `₹${total.toLocaleString('en-IN')}`,
          notes: `Drone: ${calcDroneTier} | Reels: ${calcAddonReels ? 'YES' : 'NO'}`,
        });
      }
    } catch (err) {
      console.warn('Storage sync error:', err);
    }

    setCalcSubmitted(true);

    // Format WhatsApp message
    const msg = `*🚀 RB SOFTWARE & MEDIA HUB - CUSTOM ESTIMATE*
---------------------------------
*Client:* ${calcClientName || 'Valued Client'}
*Contact:* ${calcClientPhone || 'N/A'}
*Event / Target Date:* ${calcEventDate || 'Immediate'}

*Selected Requirements:*
• Tech/Software: ${calcSoftware.toUpperCase()}
• Photography: ${calcPhoto.toUpperCase()}
• 4K Videography: ${calcVideo.toUpperCase()}
• Wedding Photobook Album: ${calcAlbumTier.toUpperCase()}
• Aerial Drone Package: ${calcDroneTier.toUpperCase()}
• 24h Viral Instagram Reels: ${calcAddonReels ? 'YES' : 'NO'}

*Estimated Budget:* ₹${total.toLocaleString('en-IN')}
---------------------------------
Please connect with me to confirm availability and schedule our consultation / booking.`;

    window.open(`https://wa.me/917651972973?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ══════════════════════════════════════════════════════════════════════════
  // DATA COLLECTIONS
  // ══════════════════════════════════════════════════════════════════════════
  const softwareProducts = [
    {
      id: 'SFT-1',
      name: 'OmniPOS Cloud Billing & Inventory ERP',
      category: 'Billing POS',
      tagline: 'Lightning-fast thermal invoice printing, barcode scanning, multi-counter split billing & GST e-way bills.',
      techStack: ['React', 'Node.js', 'PostgreSQL', 'WebUSB ESC/POS'],
      badge: 'Flagship POS',
      latency: '120ms Latency',
      price: '₹18,500 One-time',
      forWhom: 'Retail Stores, Supermarkets, Salons, Garment Showrooms & Restaurants',
      deliveryTime: '3 - 5 Days',
      features: [
        'Multi-counter synchronized billing with offline fallback',
        'Direct UPI Dynamic QR printed automatically on thermal slip (GPay, PhonePe, Paytm)',
        'Real-time low stock radar & automated purchase PO generation',
        'One-click GST R1/3B instant JSON generation for direct CA filing',
        'Thermal printer USB & Bluetooth support (80mm & 58mm roll sizes)',
        'Barcode scanner gun & weighing scale integration',
      ],
    },
    {
      id: 'SFT-2',
      name: 'Multi-Tenant Micro-SaaS Cloud Platform',
      category: 'Cloud SaaS',
      tagline: 'Launch isolated white-label customer SaaS applications with auto-provisioned subdomains, SSL & multi-tenancy.',
      techStack: ['Docker', 'Nginx', 'MongoDB Sharding', 'Redis Cache', 'Node.js'],
      badge: 'Enterprise SaaS',
      latency: '99.98% SLA',
      price: '₹45,000 Setup',
      forWhom: 'SaaS Startups, Beauty Chains, Clinic Networks, Real Estate Portals',
      deliveryTime: '14 - 21 Days',
      features: [
        'Zero-trust isolated database schema per client tenant',
        'Custom CNAME domain mapping with automatic Let’s Encrypt SSL certificates',
        'Granular RBAC privileges (SuperAdmin, Salon Owner, Branch Manager, Cashier)',
        'Built-in Razorpay, Cashfree & Stripe recurring subscription billing',
        'Automated daily cloud backups with point-in-time recovery',
        'Centralized admin dashboard to monitor all active tenants & revenues',
      ],
    },
    {
      id: 'SFT-3',
      name: 'High-Converting Next.js Corporate Websites & Portals',
      category: 'Websites',
      tagline: 'Ultra-modern responsive corporate websites, high-speed lead funnels and interactive company showcases.',
      techStack: ['Next.js 14', 'React', 'Tailwind CSS', 'Framer Motion', 'Vercel CDN'],
      badge: 'High Conversion',
      latency: '99+ PageSpeed',
      price: '₹14,999 Starting',
      forWhom: 'Corporate Businesses, Doctors, Builders, Event Planners, Agencies',
      deliveryTime: '5 - 7 Days',
      features: [
        '100% Mobile, Tablet & Desktop responsive with ultra-smooth animations',
        '99+ Google Lighthouse performance score & Core Web Vitals optimization',
        'Dynamic SEO meta tags, OpenGraph sharing cards & sitemap generator',
        'Instant WhatsApp chat lead dispatch & contact form email alerts',
        'Custom interactive calculators, booking forms & Google Maps integration',
        'Easy-to-use CMS / Admin panel to update content, images & banners',
      ],
    },
    {
      id: 'SFT-4',
      name: 'E-Commerce Online Stores & Multi-Vendor Marketplaces',
      category: 'E-Commerce',
      tagline: 'Feature-packed digital storefronts with shopping cart, payment gateways, automated logistics and coupons.',
      techStack: ['Node.js', 'React', 'PostgreSQL / Mongo', 'Razorpay', 'Shiprocket API'],
      badge: 'Direct-to-Consumer',
      latency: 'Sub-second Loads',
      price: '₹28,000 Setup',
      forWhom: 'D2C Brands, Boutiques, Jewellery Shops, Cosmetic Sellers, Grocers',
      deliveryTime: '10 - 14 Days',
      features: [
        'Full product catalog with size/color variants, high-res zoom & stock alerts',
        'Instant checkout with UPI, Credit/Debit Cards, NetBanking & Cash on Delivery (COD)',
        'Automated shipping calculation & Shiprocket courier pickup tracking',
        'Promotional coupon codes, bulk discounts & customer loyalty wallet',
        'Instant WhatsApp order notification to both customer and merchant',
        'Dedicated Merchant Vendor Dashboard for product uploads & sales reports',
      ],
    },
    {
      id: 'SFT-5',
      name: 'Native Android & iOS Mobile Client Applications',
      category: 'Mobile Apps',
      tagline: 'High-conversion booking, live order tracking, and field technician GPS attendance applications.',
      techStack: ['React Native', 'Flutter', 'Firebase Cloud', 'Mapbox SDK'],
      badge: 'App Store Ready',
      latency: '60 FPS Native UI',
      price: '₹38,000 Starting',
      forWhom: 'Service Booking Apps, Food Delivery, Driver Tracking, Field Staff',
      deliveryTime: '14 - 25 Days',
      features: [
        'Biometric FaceID / Fingerprint instant customer sign-in',
        'Live technician & field staff live location tracking radar with Mapbox',
        'FCM Push notifications with deep links to personalized offers',
        'Full offline cache SQLite support for uninterrupted field operation',
        'In-app razorpay checkout & customer service chat integration',
        'Google Play Store & Apple App Store submission & approval assistance',
      ],
    },
    {
      id: 'SFT-6',
      name: 'Custom Enterprise Business Management ERP & CRM',
      category: 'Enterprise ERP',
      tagline: 'End-to-end operational software connecting sales CRM, staff payroll, procurement, and multi-branch ledger.',
      techStack: ['Node.js Microservices', 'React', 'PostgreSQL', 'Docker', 'Redis'],
      badge: 'Full Automation',
      latency: 'Real-time Sync',
      price: '₹55,000 Custom',
      forWhom: 'Manufacturing Units, Real Estate Firms, Wholesalers, Educational Institutes',
      deliveryTime: '20 - 30 Days',
      features: [
        'Complete HRMS with biometric attendance sync, leave tracker & automated salary slips',
        'Sales CRM with lead assignment, pipeline Kanban board & follow-up reminders',
        'Purchase orders, vendor invoicing & multi-warehouse inventory transfer',
        'Multi-branch financial balance sheets, P&L statements & audit trails',
        'Role-based permissions with audit log tracking every user action',
        'Automated daily Excel/PDF export dispatched to Director email & WhatsApp',
      ],
    },
    {
      id: 'SFT-7',
      name: 'Meta WhatsApp Business Cloud API Engine & Chatbots',
      category: 'Automations',
      tagline: 'Official Meta Cloud API integration for automated transactional receipts, OTPs & interactive chatbots.',
      techStack: ['Meta Cloud API', 'Node Webhooks', 'BullMQ Queue', 'Redis'],
      badge: 'Meta Certified',
      latency: '98% Delivery Rate',
      price: '₹12,000 Setup',
      forWhom: 'All Business Owners seeking automated billing, support and marketing on WhatsApp',
      deliveryTime: '3 - 5 Days',
      features: [
        'Instant PDF receipt & invoice delivery on bill generation with payment links',
        '2-Way interactive button chatbot with AI reply triage and live agent handoff',
        'Automated appointment reminders, booking confirmations & review feedback loops',
        'Verified Meta Green Tick sender ID application compliance assistance',
        'Broadcast promotional marketing campaigns to thousands of opt-in customers safely',
        'Real-time delivery status webhooks (Sent, Delivered, Read timestamps)',
      ],
    },
  ];

  const photographyServices = [
    {
      id: 'PHT-1',
      title: 'Royal Wedding & Candid Photography',
      tagline: 'Capturing unscripted emotions, sacred rituals, and royal grandeur with full-frame cinematic vision.',
      cameras: 'Sony Alpha FX3 + Sony A7 IV (Dual Full-Frame)',
      lenses: 'Sony 24-70mm f/2.8 GM II, 70-200mm f/2.8 GM II, 50mm f/1.2 GM',
      badge: 'Most Popular',
      price: '₹48,000 / Day',
      highlights: [
        '2 Senior Candid Photographers + 1 Traditional Coverage Lead',
        'High-resolution raw capture with customized color grading',
        'Covering Haldi, Mehendi, Sangeet, Jaimala & Vidai',
        'Complete digital delivery within 7 working days via cloud link',
      ],
    },
    {
      id: 'PHT-2',
      title: 'Cinematic Pre-Wedding Couple Shoots',
      tagline: 'Story-driven outdoor & destination shoots with artistic concept lighting and styled attire direction.',
      cameras: 'Sony A7 IV + Prime GM Lenses (85mm f/1.4 & 35mm f/1.4)',
      lenses: 'Italian Leatherette Concept Lookbook included',
      badge: 'Romantic Vision',
      price: '₹22,000 / Session',
      highlights: [
        'Choice of 2 scenic outdoor or historical heritage locations in Varanasi',
        'Up to 3 outfit changes with artistic posing choreography',
        '50 Signature color-graded master portraits + raw catalog',
        'Complimentary 1-minute 4K cinematic motion portrait teaser',
      ],
    },
    {
      id: 'PHT-3',
      title: 'Fashion, Studio & Glamour Portfolios',
      tagline: 'Editorial magazine-grade studio photography with professional lighting strobes, softboxes and cyclorama.',
      cameras: 'Sony A7 IV 33MP + Godox AD600 Pro TTL Strobes',
      lenses: 'Beauty Dishes, Parabolic Softboxes & Honeycomb Grids',
      badge: 'Studio Editorial',
      price: '₹15,000 / Session',
      highlights: [
        'High-end skin retouching and high-frequency separation',
        'Multiple lighting setups (Rembrandt, Split, Butterfly, Rim)',
        'Full portfolio lookbook formatted for casting agencies & Instagram',
        'Instant tethered iPad monitor preview for real-time review',
      ],
    },
    {
      id: 'PHT-4',
      title: 'Commercial, Product & E-Commerce Shoots',
      tagline: 'Crisp, crystal-clear product visuals tailored for Amazon, Flipkart, Shopify & luxury catalogs.',
      cameras: 'Sony 90mm f/2.8 Macro G OSS + 360 Turntable',
      lenses: 'Pure White (255,255,255) & Creative Shadow Setups',
      badge: 'High Conversion',
      price: '₹18,000 / Catalog',
      highlights: [
        'Jewelry, cosmetics, apparel & tech gadget specialized macro focus',
        '360-Degree interactive rotating product gif & mp4 output',
        'Strict compliance with Amazon & international marketplace guidelines',
        'High-speed batch shooting with next-day turnaround',
      ],
    },
  ];

  // Real Weddings Portfolio: Kiski Shadi Kahan Hui
  const realWeddingsCovered = [
    {
      id: 'WED-1',
      couples: 'Aman & Sneha',
      venue: 'Taj Ganges (Nadesar Palace Grounds), Varanasi',
      eventType: '3-Day Grand Royal Vivah & Reception',
      date: 'Nov 2025',
      tag: 'Royal Heritage',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      rituals: [
        'Grand Barat Entry with Heavy Cold Pyro Sparkler Corridor',
        'Heavy Dry Ice Low Fog Cloud Bridal Entry on Red Carpet',
        'Sacred Jaimala Ceremony on Floral Elevated Stage',
        'Late-Night Vedic Agni Pheras with live Shehnai accompaniment',
      ],
      gearUsed: 'Sony FX3 (Dual Cinema) + Sony A7 IV + 70-200mm f/2.8 GM II + DJI Ronin RS3 Pro',
      deliverables: '4K Cinematic Teaser + 90-Min Master Movie + 50-Page Platinum Acrylic Photobook + 1200+ Color-Graded Photos',
      testimonial: '"RB Studio made our wedding at Taj Ganges look like a Bollywood dream film! Every family member was stunned by the picture quality and prompt album delivery."',
    },
    {
      id: 'WED-2',
      couples: 'Rohan & Priya',
      venue: 'Brijrama Palace & Darbhanga Ghat, Varanasi',
      eventType: 'Sacred Riverside Heritage Wedding',
      date: 'Dec 2025',
      tag: 'Ghats Romance',
      img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      rituals: [
        'Sacred Ganga Aarti Blessing Ceremony at Darbhanga Ghat',
        'Riverside Mandap with fresh marigold & tuberose floral canopy',
        'Sunset Couple Portraits on decorated heritage Bajra boat',
        'Candid Moments inside the 210-year-old stone carved palace corridors',
      ],
      gearUsed: 'Sony A7 IV 33MP + Sony 50mm f/1.2 GM + 85mm f/1.4 GM + DJI Mavic 3 Pro Cine Drone',
      deliverables: '3-Minute 4K Teaser + Italian Velvet Photobook + 800 Curated Master Portraits',
      testimonial: '"Getting married beside mother Ganga at Brijrama Palace was magical. RB Studio captured the reflections of the deepas and mandap flames with unbelievable beauty."',
    },
    {
      id: 'WED-3',
      couples: 'Aditya & Ritu',
      venue: 'Assi Ghat, Chet Singh Fort & Ramnagar, Varanasi',
      eventType: 'Concept Pre-Wedding & Vivah Celebration',
      date: 'Jan 2026',
      tag: 'Pre-Wedding & Film',
      img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      rituals: [
        'Early Morning Golden Hour Sunrise Boat Ride from Assi Ghat',
        'Royal Medieval Architecture Concept Shoot at Chet Singh Fort arches',
        'Floating Diyas Night Romance Sequence at twilight',
        'High-Energy Jaimala celebration with cold pyros and rose petal shower',
      ],
      gearUsed: 'Sony A7 IV + 24-70mm f/2.8 GM II + Godox AD600 Pro Strobes + DJI Ronin RS3 Pro',
      deliverables: '1-Minute 4K Instagram Viral Reel + 60 Framed Master Portraits + Custom Leather Lookbook',
      testimonial: '"Our pre-wedding video at Chet Singh Fort got over 150,000 views on Instagram! The cinematic slow motion and color grading are unmatched in Varanasi."',
    },
    {
      id: 'WED-4',
      couples: 'Vikram & Neha',
      venue: 'Ramada Plaza by Wyndham, Varanasi',
      eventType: 'Vibrant Haldi & Sangeet Carnival',
      date: 'Feb 2026',
      tag: 'Haldi & Sangeet',
      img: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      rituals: [
        'Phoolon Ki Holi with organic yellow marigold petals',
        'High-Energy Sangeet choreography with synchronized stage lighting',
        'Candid laughter, emotional hugs with parents, and unposed joy',
        'Evening cocktail celebration with cinematic low-light portraits',
      ],
      gearUsed: 'Sony FX3 120fps Cinema + High-Speed Strobes + Rode Wireless PRO 32-bit float audio',
      deliverables: '5 Same-Night Vertical 9:16 Reels + 400 Color-Graded Candid Photos',
      testimonial: '"The energy of our Haldi carnival was captured so dynamically! We got the edited Instagram Reels within 12 hours of the event."',
    },
    {
      id: 'WED-5',
      couples: 'Dr. Vivek & Shweta',
      venue: 'Hotel Clarks Cantt, Varanasi',
      eventType: 'Traditional Vedic Vivah & Reception',
      date: 'Feb 2026',
      tag: 'Traditional Vedic',
      img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      rituals: [
        'Vintage Open-Top Royal Car Barat Procession with traditional Shehnai',
        'Vedic Agni Pheras with sacred Vedic mantra chant audio recordings',
        'Emotional Vidai ceremony capturing raw tears and blessings',
        'Grand Reception with 800+ distinguished doctor and executive guests',
      ],
      gearUsed: 'Dual Sony FX3 Full-Frame Cinema Line + Atomos Ninja V+ HDR Monitor',
      deliverables: '90-Minute Complete Ceremony Film + 40-Page Italian Leatherette Photobook',
      testimonial: '"As doctors, we wanted complete professionalism and zero stress. RB Studio handled everything smoothly, and the audio clarity of the mantras is pristine."',
    },
    {
      id: 'WED-6',
      couples: 'Deepak & Pooja',
      venue: 'Aadiyogi Theme Stage & Resort, Sarnath, Varanasi',
      eventType: 'Mahadev Theme Grand Destination Vivah',
      date: 'Mar 2026',
      tag: 'Grand Theme Wedding',
      img: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      rituals: [
        '20-Foot Aadiyogi Mahadev Floral Stage with Nandi & Trishul installation',
        '15-Foot Illuminated Flower Archway Bridal Entry with Cold Fireworks',
        'Aerial Drone 360-degree sweep during divine Jaimala garland exchange',
        'Family Blessings under grand crystal chandeliers and floral drops',
      ],
      gearUsed: 'DJI Mavic 3 Pro Cine (5.1K Hasselblad) + Dual Sony FX3 Cinema Cameras',
      deliverables: 'Full Cinema Film + 50-Page Platinum Acrylic Album + 2 Free Parent Pocket Albums + 5.1K Drone Master Reel',
      testimonial: '"The aerial drone shots of our 20ft Aadiyogi stage and flower tunnel looked magnificent. Every guest is still talking about our wedding video!"',
    },
  ];

  const videographyServices = [
    {
      id: 'VID-1',
      title: '4K Cinematic Wedding Teaser & Master Film',
      tagline: 'Hollywood-style emotional storytelling with cinematic S-Cinetone color grading and orchestral sound design.',
      gear: 'Sony FX3 Cinema Line + DJI Ronin RS3 Pro Gimbal',
      deliverables: '3-5 Min 4K Teaser + 60-90 Min Full Master Film',
      badge: 'Blockbuster Film',
      price: '₹42,000 / Event',
      highlights: [
        'Filmed in 4K 10-bit 4:2:2 at 60fps & 120fps ultra slow-motion',
        'LiDAR autofocus tracking ensuring razor-sharp bride & groom shots',
        'Custom color grading on DaVinci Resolve Studio with film grain',
        'Delivered on engraved luxury USB crystal drive + 4K streaming link',
      ],
    },
    {
      id: 'VID-2',
      title: 'Aerial 4K Drone Cinematography',
      tagline: 'Epic bird’s-eye perspectives, majestic venue architecture reveals, and exhilarating procession sweeps.',
      gear: 'DJI Mavic 3 Pro Cine (Hasselblad 4/3 CMOS Triple-Camera)',
      deliverables: '5.1K Apple ProRes & 4K 60fps Aerial Master Cuts',
      badge: 'Licensed Pilots',
      price: '₹22,000 / Session',
      highlights: [
        'Triple optical zoom lenses (24mm, 70mm, 166mm telephoto)',
        'Dramatic top-down venue angles, barat entries & fireworks capture',
        'Safe, DGCA-compliant certified drone operation with obstacle avoidance',
        'Wind-resistant rock steady flight in up to 12 m/s winds',
      ],
    },
    {
      id: 'VID-3',
      title: 'Multi-Camera YouTube & FB Live Broadcast',
      tagline: 'Real-time multi-angle live streaming in 1080p/4K with TV-style lower-third titles, graphics and instant replay.',
      gear: '3-Camera ATEM Mini Pro ISO Switcher + Wireless HDMI Transmitters',
      deliverables: 'Uninterrupted High-Bitrate Live Stream + ISO Recordings',
      badge: 'Zero Buffer',
      price: '₹35,000 / Broadcast',
      highlights: [
        'Dedicated multi-camera live video mixing console on site',
        'Customized digital borders, bride & groom names, countdown timers',
        'Dual bonded cellular Wi-Fi internet uplink ensuring 0 packet drop',
        'Individual ISO camera feeds recorded in Full HD for post-event edits',
      ],
    },
    {
      id: 'VID-4',
      title: 'Same-Day 24H Viral Instagram Reels & Shorts',
      tagline: 'Vertical 9:16 high-energy mobile video edits delivered the same night for instant social media virality.',
      gear: 'Vertical Rigged Sony FX3 + Wireless Rode Audio',
      deliverables: '3 to 5 Polished High-Energy 9:16 Reels',
      badge: '24H Delivery',
      price: '₹12,000 / Pack',
      highlights: [
        'Synced to trending audio, beats, and viral Instagram transitions',
        'Captured and edited on location with instant mobile delivery',
        'Optimized for Instagram Reels, YouTube Shorts & WhatsApp Stories',
        'Includes bride aesthetic portraits, dramatic entries & emotional hugs',
      ],
    },
  ];

  // Detailed Transparent Pricing Packages
  const videoPricingPackages = [
    {
      id: 'VP-1',
      title: '4K Cinematic Highlight Teaser',
      duration: '3 - 5 Minutes',
      price: '₹18,000',
      badge: 'Social Media Hit',
      cameras: '1x Sony FX3 Cinema Line + DJI RS3 Pro Gimbal',
      highlights: [
        'Filmed in 4K 10-bit 4:2:2 S-Cinetone profile',
        'Cinematic slow-motion 60fps & 120fps shots of couple & rituals',
        'DaVinci Resolve Hollywood color grading with film grain',
        'Custom orchestral sound design synced with speech & shlokas',
        'Delivered in 4K resolution within 7 days via private cloud link',
      ],
    },
    {
      id: 'VP-2',
      title: 'Full Traditional Ceremony Film',
      duration: '60 - 90 Minutes',
      price: '₹28,000',
      badge: 'Family Favorite',
      cameras: '1x Senior Videographer + Wireless Audio Mics',
      highlights: [
        'Complete end-to-end coverage: Barat, Welcome, Jaimala, Mandap, Vidai',
        'Crystal clear audio recording with Rode 32-bit float wireless lavs',
        'Chapter markers: easily jump to Jaimala, Kanyadaan or Pheras',
        'Delivered on luxury custom engraved crystal USB drive',
        '100% uncut master backup preserved on our cloud servers',
      ],
    },
    {
      id: 'VP-3',
      title: 'Master Cinema Suite (Teaser + Full Movie)',
      duration: 'Teaser + 90-Min Movie',
      price: '₹42,000',
      badge: 'Most Popular',
      cameras: '2x Sony FX3 Cinema Line (Dual Camera Setup)',
      highlights: [
        'Two dedicated cinema cinematographers for seamless multi-angle coverage',
        'One camera focused exclusively on Bride, second camera on Groom',
        'Both 3-5 Min 4K Teaser AND 60-90 Min Full Ceremony Film included',
        'Delivered in luxury leather box with engraved crystal USB drive',
        'Complimentary 2 vertical 9:16 Instagram Reels for same-night posting',
      ],
    },
    {
      id: 'VP-4',
      title: 'Same-Day 24H Viral Instagram Reels',
      duration: '3 to 5 Reels (30-60s)',
      price: '₹12,000',
      badge: 'Instant Delivery',
      cameras: '1x Dedicated Mobile & Vertical FX3 Rig Editor',
      highlights: [
        'Captured vertically in 9:16 4K resolution on location',
        'Edited on-site and delivered within 12-24 hours for instant viral posting',
        'Synced to trending viral audio tracks, beats and romantic shlokas',
        'Includes bride look reveal, couple slow walk, and barat dance energy',
        'Ready for Instagram Reels, YouTube Shorts and WhatsApp Status',
      ],
    },
  ];

  const albumPricingPackages = [
    {
      id: 'ALB-1',
      title: 'Royal Silk Embossed Album',
      tier: 'Standard Luxury',
      price: '₹9,500',
      specs: '30 Sheets / 60 Pages (12x36" Open Spread)',
      capacity: 'Holds 200 - 250 Curated Photos',
      badge: 'Silk Matte',
      features: [
        'Non-tearable, waterproof photographic silk paper',
        'Gold / Silver hot foil embossed names on hardcover',
        'Seamless 180° lay-flat binding with zero gutter loss',
        'Handcrafted hardbound matching slipcase box included',
        'Full digital PDF soft-copy proofing before final printing',
      ],
    },
    {
      id: 'ALB-2',
      title: 'Luxury Italian Leatherette Photobook',
      tier: 'Premium Heirloom',
      price: '₹14,500',
      specs: '40 Sheets / 80 Pages (12x36" Open Spread)',
      capacity: 'Holds 300 - 350 Curated Photos',
      badge: 'Top Seller',
      features: [
        'Imported Italian leatherette cover with acrylic cameo window',
        'Anti-scratch, anti-glare velvet touch paper with 100-year anti-fade inks',
        'Sturdy reinforced corner protectors in antique brass or gold',
        'Plush velvet-lined matching carrying suitcase with handle',
        'Includes complimentary 1 Mini Pocket Album for bride’s parents',
      ],
    },
    {
      id: 'ALB-3',
      title: 'Platinum Acrylic Glass Hardcover Album Suite',
      tier: 'Ultra-Luxury Diamond',
      price: '₹21,000',
      specs: '50 Sheets / 100 Pages (12x36" Master Size)',
      capacity: 'Holds 400+ Curated Photos',
      badge: 'Ultra Luxury',
      features: [
        'Full 6mm beveled diamond acrylic glass photo front cover',
        'Ultra-HD metallic luster photo paper with vivid high-dynamic range',
        '2 FREE Matching Parent Pocket Albums included (one for each family)',
        'Deluxe leather-bound lockable briefcase with custom monogram',
        'VIP priority retouching by our senior graphic design director',
      ],
    },
  ];

  const dronePricingPackages = [
    {
      id: 'DRN-1',
      title: 'Barat Entry & Jaimala Aerial Flight',
      duration: '2 - 3 Hours Window',
      price: '₹12,000',
      badge: 'Barat Special',
      pilot: '1 DGCA Certified Drone Pilot',
      drone: 'DJI 4K Ultra-Steady Quadcopter',
      features: [
        'Spectacular top-down aerial sweeps of the groom’s barat procession',
        'Illuminated venue architecture reveals from 200 feet altitude',
        'Overhead slow-motion capture of Jaimala cold pyros & flower shower',
        'Raw 4K footage delivered on cloud drive within 24 hours',
      ],
    },
    {
      id: 'DRN-2',
      title: 'Full-Day 5.1K Hasselblad Aerial Package',
      duration: 'Full Day (Haldi to Vidai)',
      price: '₹22,000',
      badge: 'Cinematic 5.1K',
      pilot: '1 Senior Commercial Pilot + Spotter',
      drone: 'DJI Mavic 3 Pro Cine (Hasselblad Triple-Camera)',
      features: [
        'Triple optical zoom lenses (24mm wide, 70mm medium, 166mm telephoto)',
        'Apple ProRes & 5.1K D-Log 10-bit cinema-grade color profile',
        'Unlimited battery swaps ensuring zero missed aerial moments',
        'Covers Day Haldi, Sunset Venue, Grand Barat, Jaimala & Morning Vidai',
        'Includes 2-minute standalone 4K aerial master showcase cut',
      ],
    },
    {
      id: 'DRN-3',
      title: 'Drone Cinema + Indoor FPV Fly-Through Combo',
      duration: 'Outdoor Aerial + Indoor FPV',
      price: '₹32,000',
      badge: 'Hollywood FPV',
      pilot: '2 Specialized Drone Pilots (Aerial + FPV)',
      drone: 'DJI Mavic 3 Pro + Protected FPV Cinewhoop Drone',
      features: [
        'Breathtaking high-speed FPV flight swooping through floral arches & stage',
        'Smooth transitions from outer venue skies straight into the banquet hall',
        'Duct-protected props safe for indoor flight near guests and decor',
        'Dynamic acrobatic camera angles impossible with regular cameras or gimbals',
      ],
    },
  ];

  const weddingComboPackages = [
    {
      id: 'CMB-1',
      title: 'Silver Vivah Essential Combo',
      price: '₹55,000',
      originalPrice: '₹68,000',
      savings: 'Save ₹13,000',
      badge: 'Budget Friendly',
      includes: [
        '1 Traditional Photographer (Full Day Coverage)',
        '1 Traditional 4K Videographer (Barat to Vidai)',
        'Royal Silk Embossed 30-Page Wedding Photobook (₹9,500 value)',
        'Full Ceremony 60-90 Min Edited Film on Crystal USB Drive',
        'All High-Resolution Photos on Cloud Storage',
      ],
    },
    {
      id: 'CMB-2',
      title: 'Gold Cinematic Vivah Combo',
      price: '₹95,000',
      originalPrice: '₹1,24,000',
      savings: 'Save ₹29,000',
      badge: 'Most Popular ⭐',
      recommended: true,
      includes: [
        '1 Senior Candid Photographer + 1 Traditional Photographer',
        '1 Sony FX3 Cinema Cinematographer with RS3 Pro Gimbal',
        'Barat & Jaimala Aerial 4K Drone Flight Included (₹12,000 value)',
        '4K Cinematic Teaser (3-5 min) + Full 90-Min Ceremony Movie',
        'Luxury Italian Leatherette 40-Page Photobook with Case (₹14,500 value)',
        '2 Same-Day Vertical 9:16 Instagram Reels for instant posting',
      ],
    },
    {
      id: 'CMB-3',
      title: 'Diamond Royal Heritage Vivah Combo',
      price: '₹1,45,000',
      originalPrice: '₹1,95,000',
      savings: 'Save ₹50,000',
      badge: 'Royal Grandeur 👑',
      includes: [
        '2 Senior Candid Photographers + 1 Traditional Lead Photographer',
        '2 Sony FX3 Cinema Cinematographers (Dual Camera Multi-Angle)',
        'Full-Day 5.1K Hasselblad Mavic 3 Pro Drone Flight (₹22,000 value)',
        '50-Page Platinum Acrylic Glass Hardcover Photobook (₹21,000 value)',
        '2 Matching Mini Parent Pocket Albums (1 for Bride, 1 for Groom family)',
        '5 Same-Day 24-Hour Viral Instagram Reels & Shorts',
        'Deluxe engraved crystal USB drive in custom monogrammed leather briefcase',
      ],
    },
  ];
  const cameraGearArsenal = [
    {
      category: 'Cinema & Still Cameras',
      items: [
        { name: 'Sony FX3 Cinema Line', specs: 'Full-Frame, 4K 120fps, 10-bit 4:2:2, S-Cinetone, Dual Base ISO 800/12800, Active Cooling Fan', tag: 'A-Cam Cinema' },
        { name: 'Sony Alpha A7 IV', specs: '33MP BSI CMOS Sensor, 4K 60p, 10-bit 4:2:2, 759 AF Points, Real-Time Eye AF Tracking', tag: 'B-Cam & Stills' },
        { name: 'Sony Alpha A7 III (Backup)', specs: '24.2MP Full-Frame, Dual Card Slots, 5-axis IBIS, Reliable Field Workhorse', tag: 'Backup Rig' },
      ],
    },
    {
      category: 'Sony G-Master Optical Arsenal',
      items: [
        { name: 'Sony FE 24-70mm f/2.8 GM II', specs: 'Industry standard fast zoom, edge-to-edge sharpness, constant f/2.8 aperture', tag: 'Primary Zoom' },
        { name: 'Sony FE 70-200mm f/2.8 GM OSS II', specs: 'Lightweight telephoto zoom, optical steady shot, breathtaking background compression', tag: 'Candid & Jaimala' },
        { name: 'Sony FE 50mm f/1.2 GM', specs: 'Ultra-fast prime, dreamlike creamy bokeh, exceptional low-light night wedding capability', tag: 'Bridal Portrait' },
        { name: 'Sony FE 16-35mm f/2.8 GM', specs: 'Ultra-wide angle zoom for grand stage vistas, Aadiyogi themes & majestic floral arches', tag: 'Grand Stage' },
      ],
    },
    {
      category: 'Gimbals, Drones & Stabilization',
      items: [
        { name: 'DJI Mavic 3 Pro Cine Drone', specs: 'Hasselblad 4/3 CMOS triple camera system, Apple ProRes 422 HQ, 43 min flight time', tag: 'Aerial 5.1K' },
        { name: 'DJI Ronin RS3 Pro Gimbal', specs: 'Carbon fiber motorized axis locks, 4.5kg payload, automated calibration, SuperSmooth mode', tag: 'Steady Rig' },
        { name: 'DJI LiDAR Range Finder', specs: '43,200 ranging points, automated cinema lens focus tracking even in pitch darkness', tag: 'Precision AF' },
      ],
    },
    {
      category: 'Studio Lighting & Pro Broadcast Audio',
      items: [
        { name: 'Godox AD600 Pro TTL Strobes', specs: '600Ws portable battery strobe, 0.01-0.9s recycling time, 38W LED modeling lamp', tag: 'Key Light' },
        { name: 'Aputure 300d II & Amaran 200x', specs: 'Bi-color continuous video lights with 120cm parabolic softboxes & honeycomb grids', tag: 'Stage Video' },
        { name: 'Rode Wireless PRO Audio Kit', specs: 'Dual transmitter 32-bit float internal onboard recording (impossible to clip audio)', tag: 'Studio Sound' },
        { name: 'Atomos Ninja V+ 4K Recorder', specs: '1000nit HDR daylight viewable 5.2" monitor with ProRes RAW internal recording', tag: 'Field Monitor' },
      ],
    },
  ];

  const portfolioItems = [
    {
      id: 'PF-1',
      title: 'Royal Heritage Wedding at Taj Ganges',
      type: 'Photography & Cinema',
      tag: 'Wedding',
      img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      description: 'Full 3-day royal wedding coverage with Sony FX3 cinema cameras, candid portraits, and 4K highlight teaser.',
    },
    {
      id: 'PF-2',
      title: 'OmniPOS Multi-Counter Retail Suite',
      type: 'Software Engineering',
      tag: 'Software',
      img: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
      description: 'Touch-optimized thermal POS billing system processing 4,000+ daily invoices with dynamic UPI QR code generator.',
    },
    {
      id: 'PF-3',
      title: 'Pre-Wedding Sunset Romance on Ghats',
      type: 'Photography & Drone',
      tag: 'Pre-Wedding',
      img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      description: 'Cinematic boat shoot along the heritage ghats of Varanasi featuring DJI Mavic 3 Pro aerial perspectives and Sony 50mm f/1.2 portraits.',
    },
    {
      id: 'PF-4',
      title: 'Kashi Multi-Tenant SaaS Engine',
      type: 'Software Engineering',
      tag: 'Software',
      img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      description: 'Microservices architecture powering Beauty Parlour, Real Estate Plotting, Commercial Rent, and Event Management portals.',
    },
    {
      id: 'PF-5',
      title: 'Grand Jaimala Fireworks 4K Film',
      type: 'Cinematography',
      tag: 'Videography',
      img: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      description: 'Slow-motion 120fps cold pyrotechnic fireworks jaimala sequence captured on Sony FX3 with Hollywood color treatment.',
    },
    {
      id: 'PF-6',
      title: 'Meta WhatsApp Cloud API Automation',
      type: 'Software Engineering',
      tag: 'Software',
      img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      description: 'Automated appointment reminders, digital PDF receipt dispatch, and 2-way interactive button chatbot for enterprise clients.',
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        maxWidth: '100%',
        background: '#030712',
        color: '#f9fafb',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflowX: 'hidden',
      }}
    >
      {/* ── Top Cyber Glow Accents ── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: '20%',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '20%',
          right: '10%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* ── Top Quick Info Bar ── */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '6px clamp(1rem, 3.5vw, 4rem)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#94a3b8',
          position: 'relative',
          zIndex: 60,
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <strong style={{ color: '#38bdf8' }}>RB Software & Media Hub</strong> • Digital Tech & Cinema Studio
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={13} color="#f59e0b" /> Bhaisodi, Sarnath, Varanasi, UP
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="tel:+917651972973"
            style={{ color: '#e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}
          >
            <Phone size={13} color="#38bdf8" /> +91 76519 72973
          </a>
          <button
            onClick={() => navigate('/admin/rb-software')}
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              color: '#a5b4fc',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Admin Panel →
          </button>
        </div>
      </div>

      {/* ── Master Full-Width Header Navigation ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 55,
          background: 'rgba(3, 7, 18, 0.88)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          width: '100%',
        }}
      >
        <div
          style={{
            width: '100%',
            padding: '0.85rem clamp(1rem, 3.5vw, 4rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Logo & Identity */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => handleTabChange('home')}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                flexShrink: 0,
              }}
            >
              <Code2 size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.1 }}>
                RB Software <span style={{ color: '#38bdf8' }}>& Tech Hub</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', marginTop: '2px' }}>
                ENTERPRISE SAAS • 4K CINEMA • DRONE PHOTOGRAPHY
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '4px',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            className="desktop-nav"
          >
            {[
              { id: 'home', label: 'Home' },
              { id: 'software', label: 'Software & Cloud' },
              { id: 'photography', label: 'Photography' },
              { id: 'videography', label: '4K Videography' },
              { id: 'gear', label: 'Camera Gear' },
              { id: 'portfolio', label: 'Portfolio' },
              { id: 'calculator', label: 'Estimator' },
              { id: 'contact', label: 'Contact' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  style={{
                    background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    border: 'none',
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.4)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Direct Return to Master Main Portal Hub */}
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              title="Return to Master Platform Hub"
            >
              <Home size={15} />
              <span>🏠 Main Page</span>
            </button>

            {/* Global Universal Customer Pill */}
            <GlobalCustomerHeaderPill theme="dark" />

            <button
              onClick={() => handleTabChange('calculator')}
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(56, 189, 248, 0.35)',
              }}
            >
              <Sparkles size={15} /> Instant Quote
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div
            style={{
              padding: '1rem clamp(1rem, 3.5vw, 4rem)',
              background: '#090d16',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {/* Master Main Page Button inside Mobile Drawer */}
            <button
              onClick={() => navigate('/')}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.3) 0%, rgba(99, 102, 241, 0.3) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.5)',
                color: '#38bdf8',
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '6px',
              }}
            >
              <Home size={18} /> 🏠 Return to Main Page (All Services Hub)
            </button>
            {[
              { id: 'home', label: '🏠 Home Overview' },
              { id: 'software', label: '💻 Software & Cloud SaaS' },
              { id: 'photography', label: '📸 Photography Studio' },
              { id: 'videography', label: '🎥 4K Cinematic Videography' },
              { id: 'gear', label: '⚙️ Camera & Drone Gear Arsenal' },
              { id: 'portfolio', label: '🎨 Master Portfolio & Demos' },
              { id: 'calculator', label: '🧮 Project Price Estimator' },
              { id: 'contact', label: '📍 Contact & Office Details' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'transparent',
                  color: activeTab === tab.id ? '#38bdf8' : '#e2e8f0',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── Breadcrumb Bar (Visible when not on Home) ── */}
      {activeTab !== 'home' && (
        <div
          style={{
            width: '100%',
            padding: '0.85rem clamp(1rem, 3.5vw, 4rem)',
            background: 'rgba(15, 23, 42, 0.95)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '13px',
            color: '#94a3b8',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38bdf8',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Home size={13} /> 🏠 Main Page (Hub)
            </button>
            <ChevronRight size={14} color="#64748b" />
            <span
              onClick={() => handleTabChange('home')}
              style={{ color: '#cbd5e1', cursor: 'pointer', textDecoration: 'underline', fontWeight: 600 }}
            >
              Overview
            </span>
            <ChevronRight size={14} color="#64748b" />
            <span style={{ color: '#38bdf8', fontWeight: 800, textTransform: 'capitalize' }}>
              {activeTab.replace('-', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => handleTabChange('home')}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              ← Back to Overview
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 800,
                padding: '5px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
              }}
            >
              <Home size={13} /> 🏠 Go to Main Page
            </button>
          </div>
        </div>
      )}

      {/* ── Responsive CSS Injector ── */}
      <style>{`
        @media (min-width: 900px) {
          .desktop-nav { display: flex !important; }
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 899px) {
          .desktop-nav { display: none !important; }
          .mobile-hamburger { display: flex !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 1: HOME PAGE OVERVIEW
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'home' && (
        <main style={{ width: '100%', padding: '0 clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {/* Hero Banner */}
          <section
            style={{
              padding: 'clamp(2.5rem, 6vw, 5.5rem) 0 clamp(2rem, 4vw, 3.5rem)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Top Badges */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span
                style={{
                  background: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid rgba(99, 102, 241, 0.5)',
                  color: '#a5b4fc',
                  padding: '5px 16px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Code2 size={14} color="#818cf8" /> NEXT-GEN SOFTWARE & SAAS
              </span>
              <span
                style={{
                  background: 'rgba(56, 189, 248, 0.2)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  color: '#38bdf8',
                  padding: '5px 16px',
                  borderRadius: '999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Camera size={14} color="#38bdf8" /> 4K CINEMATIC & DRONE MEDIA
              </span>
            </div>

            {/* Ultra-Crisp High-Contrast Hero Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 auto 1.25rem',
                maxWidth: '1100px',
                color: '#ffffff',
                textShadow: '0 4px 30px rgba(0, 0, 0, 0.95), 0 0 20px rgba(99, 102, 241, 0.3)',
              }}
            >
              Empowering Businesses with{' '}
              <span
                style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #60a5fa 35%, #c084fc 70%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 2px 16px rgba(56, 189, 248, 0.5))',
                }}
              >
                Intelligent Tech & Cinematic Media
              </span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
                color: '#e2e8f0',
                maxWidth: '850px',
                lineHeight: 1.6,
                margin: '0 auto 2rem',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              From scalable cloud multi-tenant SaaS architectures and POS billing ERPs to high-end Sony FX3 4K cinema
              production, royal wedding photography, and Hasselblad aerial drone films. We engineer digital excellence and capture immortal moments.
            </p>

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => handleTabChange('software')}
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Code2 size={18} /> Explore Tech Solutions
              </button>
              <button
                onClick={() => handleTabChange('photography')}
                style={{
                  background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: '#0f172a',
                  border: 'none',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(56, 189, 248, 0.35)',
                }}
              >
                <Camera size={18} color="#0f172a" /> Camera & Video Studio
              </button>
              <button
                onClick={() => navigate('/')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '13px 20px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Home size={18} color="#38bdf8" /> 🏠 Main Page (Hub)
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                width: '100%',
                maxWidth: '1050px',
                margin: '3.5rem auto 0',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[
                { title: 'Cluster Uptime', val: '99.98%', sub: 'Zero-downtime architecture', icon: Server, col: '#4ade80' },
                { title: 'Shoots Completed', val: '180+', sub: 'Royal weddings & events', icon: Camera, col: '#38bdf8' },
                { title: 'Cinema Resolution', val: '4K / 120fps', sub: 'Sony FX3 & A7 IV rigs', icon: Film, col: '#f59e0b' },
                { title: 'Daily API Calls', val: '50,000+', sub: 'WhatsApp & POS transactions', icon: Zap, col: '#a855f7' },
              ].map((m, idx) => {
                const Icon = m.icon;
                return (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                      <Icon size={24} color={m.col} />
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff' }}>{m.val}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0', marginTop: '2px' }}>{m.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{m.sub}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Dual Divisions Section */}
          <section style={{ margin: '3rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
                DUAL CAPABILITY EXCELLENCE
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, margin: '8px 0' }}>
                Two World-Class Divisions. One Trusted Partner.
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '650px', margin: '0 auto' }}>
                We blend technical software craftsmanship with state-of-the-art cinematic storytelling under one roof.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Division 1: Tech */}
              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Code2 size={26} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#818cf8', letterSpacing: '0.05em' }}>
                    DIVISION 01
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '6px 0 12px', color: '#ffffff' }}>
                    Software & Digital Systems
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Architecting high-concurrency cloud microservices, retail POS billing software, native mobile apps,
                    and WhatsApp Business conversational engines that automate workflows and drive bottom-line profits.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                    {[
                      'OmniPOS Cloud Billing with Thermal USB & Dynamic UPI QR',
                      'Multi-Tenant SaaS Infrastructure with Tenant Isolation',
                      'Custom Android & iOS Native Mobile Applications',
                      'Official Meta WhatsApp Cloud API Chatbots & Automated Receipts',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                        <CheckCircle2 size={16} color="#4ade80" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleTabChange('software')}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  View Software Solutions <ArrowRight size={16} />
                </button>
              </div>

              {/* Division 2: Media */}
              <div
                style={{
                  background: 'linear-gradient(180deg, rgba(8, 47, 73, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <Camera size={26} color="#ffffff" />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.05em' }}>
                    DIVISION 02
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '6px 0 12px', color: '#ffffff' }}>
                    Camera, Photography & 4K Cinema
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Equipped with cinema-grade Sony FX3 full-frame cameras, prime G-Master optics, DJI Ronin gimbals,
                    and Hasselblad Mavic 3 Pro drones to capture grand weddings, pre-weddings, fashion portfolios & live broadcasts.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                    {[
                      'Sony FX3 Cinema 4K/120fps Slow-Mo & S-Cinetone Color',
                      'Hasselblad DJI Mavic 3 Pro 5.1K Aerial Drone Cinematography',
                      'Royal Wedding Candids, Pre-Wedding Shoots & Silk Photobooks',
                      'Multi-Camera ATEM Mini YouTube/Facebook Live Streaming',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#cbd5e1' }}>
                        <CheckCircle2 size={16} color="#38bdf8" /> {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleTabChange('photography')}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                    color: '#0f172a',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  Explore Photography & Cinema <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* Quick Equipment Teaser Section */}
          <section
            style={{
              margin: '3.5rem 0',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.75rem' }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em' }}>
                  OUR PRODUCTION GEAR
                </span>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0' }}>Cinema & Technology Arsenal</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
                  We invest in elite industry-standard equipment to guarantee unmatched quality.
                </p>
              </div>
              <button
                onClick={() => handleTabChange('gear')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                View Full Gear Arsenal →
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                { name: 'Sony FX3 Cinema Line', role: 'Hollywood Grade 4K 120p', tag: 'A-Camera' },
                { name: 'Sony Alpha A7 IV', role: '33MP BSI Stills & 4K 60p', tag: 'Stills & B-Cam' },
                { name: 'DJI Mavic 3 Pro Drone', role: 'Hasselblad Triple Camera 5.1K', tag: 'Aerial Drone' },
                { name: 'Sony GM 24-70 & 70-200 II', role: 'f/2.8 Constant Fast Zoom', tag: 'Prime Optics' },
              ].map((g, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <span style={{ fontSize: '10px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                    {g.tag}
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginTop: '8px' }}>{g.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{g.role}</div>
                </div>
              ))}
            </div>
          </section>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 2: SOFTWARE & CLOUD SOLUTIONS
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'software' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('Software & Cloud')}
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              TECH ARSENAL & SOFTWARE CATALOG
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              Software Engineering & Cloud Platforms
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              From high-concurrency cloud micro-SaaS engines and thermal POS billing to native mobile apps,
              high-converting Next.js portals and official Meta WhatsApp Cloud API chatbots.
            </p>

            {/* Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              {['ALL', 'Cloud SaaS', 'Billing POS', 'Websites', 'E-Commerce', 'Mobile Apps', 'Enterprise ERP', 'Automations'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSoftwareCategory(cat)}
                  style={{
                    background: softwareCategory === cat ? '#6366f1' : 'rgba(255, 255, 255, 0.06)',
                    color: softwareCategory === cat ? '#ffffff' : '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '7px 18px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {softwareProducts
              .filter((p) => softwareCategory === 'ALL' || p.category.toLowerCase().includes(softwareCategory.toLowerCase()))
              .map((prod) => (
                <div
                  key={prod.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    borderRadius: '18px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                        {prod.badge}
                      </span>
                      <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 700 }}>{prod.latency}</span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
                      {prod.name}
                    </h3>
                    <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                      {prod.tagline}
                    </p>

                    {/* Target and Delivery Badges */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '10px 12px', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                        🎯 Best For: <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{prod.forWhom}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700 }}>
                        ⏱️ Delivery: <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{prod.deliveryTime}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                      {prod.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '11px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#cbd5e1',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 600,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                      {prod.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                          <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>Starting at</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff' }}>{prod.price}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          const mapping = {
                            'SFT-1': 'omnipos',
                            'SFT-2': 'saas',
                            'SFT-3': 'website',
                            'SFT-4': 'ecommerce',
                            'SFT-5': 'mobile',
                            'SFT-6': 'enterprise_erp',
                            'SFT-7': 'whatsapp',
                          };
                          setCalcSoftware(mapping[prod.id] || 'omnipos');
                          handleTabChange('calculator');
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '9px 16px',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Configure Quote →
                      </button>
                      <a
                        href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Software, I want to discuss developing: ' + prod.name)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Development Lifecycle & Guarantees */}
          <section
            style={{
              marginTop: '3.5rem',
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#818cf8', letterSpacing: '0.08em' }}>
                RB CLIENT ASSURANCE & SLA
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '6px 0' }}>
                Why Leading Enterprises Choose RB Software
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '650px', margin: '0 auto' }}>
                We believe in complete transparency, clean architecture, and giving clients total ownership of their digital IP.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                { title: '100% Code Ownership', desc: 'Full Git repository transfer with complete documented source code upon completion.' },
                { title: '1-Year Bug-Free Warranty', desc: 'Complimentary technical maintenance, security patches, and issue resolution for 12 months.' },
                { title: 'Free Cloud Setup & SSL', desc: 'Turnkey deployment to AWS, DigitalOcean or Hostinger with automated Let’s Encrypt SSL.' },
                { title: 'Official Meta WhatsApp API', desc: 'Direct verification support with Meta Business Manager and Green Tick compliance.' },
              ].map((g, gI) => (
                <div
                  key={gI}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginBottom: '6px' }}>{g.title}</div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>{g.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Tech Architecture Radar */}
          <section
            style={{
              marginTop: '2.5rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em' }}>
                INFRASTRUCTURE BLUEPRINT
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '6px 0' }}>
                High-Availability Cloud Microservices Architecture
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '650px', margin: '0 auto' }}>
                Engineered for zero data loss, sub-100ms API response latency, and automatic database failover.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                { title: 'Edge CDN & Reverse Proxy', tech: 'Nginx + Cloudflare SSL', desc: 'DDoS mitigation and global edge asset caching.' },
                { title: 'Stateless Node API Clusters', tech: 'Express / Fastify + PM2', desc: 'Auto-scaled backend workers handling parallel transactions.' },
                { title: 'Isolated Database Shards', tech: 'PostgreSQL & MongoDB', desc: 'Tenant-level schema isolation and daily automated off-site backups.' },
                { title: 'In-Memory Cache & Queues', tech: 'Redis + BullMQ', desc: 'Asynchronous WhatsApp queue processing and instant session lookups.' },
              ].map((arch, aIdx) => (
                <div
                  key={aIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', marginBottom: '4px' }}>{arch.tech}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{arch.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{arch.desc}</div>
                </div>
              ))}
            </div>
          </section>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 3: PHOTOGRAPHY SERVICES & PACKAGES
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'photography' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('Photography Studio')}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              PHOTO STUDIO & VISION
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              Camera & Photography Services
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              Armed with Sony A7 IV & FX3 full-frame sensors and G-Master prime glass, we turn fleeting human emotions
              into timeless master portraits and handcrafted Italian photobooks.
            </p>
          </div>

          {/* Photography Services Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem' }}>
            {photographyServices.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(56, 189, 248, 0.25)',
                  borderRadius: '18px',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                      {p.badge}
                    </span>
                    <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>{p.price}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', margin: '0 0 8px' }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                    {p.tagline}
                  </p>

                  <div
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>CAMERAS DEPLOYED</div>
                    <div style={{ fontSize: '12.5px', color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>{p.cameras}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                    {p.highlights.map((h, hIdx) => (
                      <div key={hIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                        <CheckCircle2 size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setCalcPhoto(p.id === 'PHT-1' ? 'wedding_candid' : p.id === 'PHT-2' ? 'prewedding' : 'commercial');
                      handleTabChange('calculator');
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                      color: '#0f172a',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    Select Package →
                  </button>
                  <a
                    href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Studio, I am interested in Photography: ' + p.title)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              REAL WEDDINGS PORTFOLIO: KISKI SHADI KAHAN HUI
              ══════════════════════════════════════════════════════════════════════════ */}
          <section style={{ marginTop: '4rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ color: '#ec4899', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
                REAL WEDDINGS COVERED • VARANASI & BEYOND
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, margin: '8px 0', color: '#ffffff' }}>
                Kiski Shadi Kahan Hui — Real Couples & Heritage Venues
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
                Explore the sacred vows, grand barat entries, and emotional candid moments captured by RB Studio across Varanasi’s most iconic heritage palaces, luxury hotels, and riverside ghats.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
              {realWeddingsCovered.map((wed) => (
                <div
                  key={wed.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(236, 72, 153, 0.3)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  {/* Photo Header */}
                  <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                    <img
                      src={wed.img}
                      alt={wed.couples}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15, 23, 42, 0.95) 100%)',
                      }}
                    />
                    <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#ec4899', color: '#ffffff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
                        {wed.tag}
                      </span>
                      <span style={{ background: 'rgba(0,0,0,0.6)', color: '#facc15', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
                        {wed.date}
                      </span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
                      <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        {wed.couples}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '13px', fontWeight: 700, marginTop: '4px' }}>
                        <MapPin size={15} style={{ flexShrink: 0 }} />
                        <span>{wed.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        {wed.eventType}
                      </div>

                      {/* Rituals List */}
                      <div style={{ marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
                          MOMENTS & RITUALS COVERED:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {wed.rituals.map((r, rI) => (
                            <div key={rI} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', color: '#cbd5e1' }}>
                              <span style={{ color: '#ec4899', fontWeight: 900 }}>•</span>
                              <span>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Gear & Deliverable */}
                      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '10px', padding: '10px 12px', marginBottom: '1.25rem' }}>
                        <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginBottom: '2px' }}>
                          🎥 Gear: <span style={{ color: '#cbd5e1', fontWeight: 400 }}>{wed.gearUsed}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#facc15', fontWeight: 700, marginTop: '4px' }}>
                          📖 Album & Film: <span style={{ color: '#cbd5e1', fontWeight: 400 }}>{wed.deliverables}</span>
                        </div>
                      </div>

                      {/* Testimonial Quote */}
                      <div style={{ fontStyle: 'italic', fontSize: '12.5px', color: '#e2e8f0', lineHeight: 1.5, borderLeft: '3px solid #ec4899', paddingLeft: '10px', marginBottom: '1.25rem' }}>
                        {wed.testimonial}
                        <div style={{ display: 'flex', gap: '2px', marginTop: '6px', color: '#facc15' }}>
                          {'★★★★★'}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => {
                          setCalcPhoto('wedding_candid');
                          setCalcVideo('cinema_4k');
                          handleTabChange('calculator');
                        }}
                        style={{
                          flex: 1,
                          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        Plan Similar Wedding →
                      </button>
                      <a
                        href={`https://wa.me/917651972973?text=${encodeURIComponent(`Hello RB Studio, I saw ${wed.couples}'s wedding at ${wed.venue} and want to discuss similar coverage.`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#ffffff',
                          padding: '9px 14px',
                          borderRadius: '8px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════════════
              LUXURY PHOTOBOOK ALBUM 3-TIER PRICING SHOWCASE
              ══════════════════════════════════════════════════════════════════════════ */}
          <section
            style={{
              marginTop: '4rem',
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#c084fc', letterSpacing: '0.08em' }}>
                HEIRLOOM WEDDING ALBUMS • BANANE KA KITNA PRICE HAI
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
                Handcrafted Wedding Photobook Album Packages & Pricing
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14.5px', maxWidth: '750px', margin: '0 auto' }}>
                Printed on 100% non-tearable, waterproof photographic silk paper with 100-year anti-fade inks. Seamless 180° lay-flat panoramic binding enclosed in luxury velvet suitcases.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.75rem' }}>
              {albumPricingPackages.map((alb) => (
                <div
                  key={alb.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '3px 10px', borderRadius: '6px', fontWeight: 800 }}>
                        {alb.badge}
                      </span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#facc15' }}>{alb.price}</span>
                    </div>

                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>
                      {alb.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, marginBottom: '6px' }}>
                      {alb.specs}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '1.25rem' }}>
                      📷 {alb.capacity}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                      {alb.features.map((f, fI) => (
                        <div key={fI} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                          <CheckCircle2 size={16} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1rem', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const tier = alb.id === 'ALB-1' ? 'silk' : alb.id === 'ALB-2' ? 'leatherette' : 'acrylic';
                        setCalcAlbumTier(tier);
                        handleTabChange('calculator');
                      }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Select This Album →
                    </button>
                    <a
                      href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Studio, I want to print wedding album: ' + alb.title + ' (' + alb.price + ')')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 4: 4K CINEMATIC VIDEOGRAPHY & DRONE
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'videography' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('4K Cinematic Videography')}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              CINEMATIC FILMMAKING & TRANSPARENT PRICING
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              4K Wedding Videography, Album & Drone Packages
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              Shot with Hollywood cinema line Sony FX3 cameras, 10-bit 4:2:2 S-Cinetone profiles, motorized DJI Ronin RS3 Pro gimbals,
              and triple-camera Hasselblad Mavic 3 Pro drones. Detailed pricing below with zero hidden charges.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              SECTION 1: 4K WEDDING VIDEOGRAPHY PACKAGES & PRICING
              ══════════════════════════════════════════════════════════════════════════ */}
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Film size={20} color="#fbbf24" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  🎥 Wedding Video Banane Ka Price (4K Cinema Packages)
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  Individual 4K video packages filmed on Sony FX3 Cinema Line with Hollywood color grading.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {videoPricingPackages.map((vp) => (
                <div
                  key={vp.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        {vp.badge}
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff' }}>{vp.price}</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>
                      {vp.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, marginBottom: '6px' }}>
                      ⏱️ Duration: {vp.duration}
                    </div>
                    <div style={{ fontSize: '11px', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 10px', borderRadius: '6px' }}>
                      🎥 {vp.cameras}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '1.25rem' }}>
                      {vp.highlights.map((h, hI) => (
                        <div key={hI} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', color: '#e2e8f0' }}>
                          <CheckCircle2 size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const vMap = { 'VP-1': 'video_teaser', 'VP-2': 'video_full', 'VP-3': 'cinema_4k', 'VP-4': 'cinema_4k' };
                        setCalcVideo(vMap[vp.id] || 'cinema_4k');
                        if (vp.id === 'VP-4') setCalcAddonReels(true);
                        handleTabChange('calculator');
                      }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#0f172a',
                        border: 'none',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Select Video →
                    </button>
                    <a
                      href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Studio, I am interested in: ' + vp.title + ' (' + vp.price + ')')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════════════
              SECTION 2: WEDDING ALBUM BANANE KA PRICE (PHOTOBOOK PRICING)
              ══════════════════════════════════════════════════════════════════════════ */}
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={20} color="#c084fc" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  📖 Wedding Album Banane Ka Price (Heirloom Photobooks)
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  Handcrafted Italian leatherette, silk matte, and acrylic diamond covers with 100-year anti-fade pigment inks.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {albumPricingPackages.map((alb) => (
                <div
                  key={alb.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(168, 85, 247, 0.2)', color: '#d8b4fe', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        {alb.badge}
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#facc15' }}>{alb.price}</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>
                      {alb.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 700, marginBottom: '4px' }}>
                      {alb.specs}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#94a3b8', marginBottom: '1rem' }}>
                      📷 {alb.capacity}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '1.25rem' }}>
                      {alb.features.map((f, fI) => (
                        <div key={fI} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', color: '#e2e8f0' }}>
                          <CheckCircle2 size={15} color="#c084fc" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const tier = alb.id === 'ALB-1' ? 'silk' : alb.id === 'ALB-2' ? 'leatherette' : 'acrylic';
                        setCalcAlbumTier(tier);
                        handleTabChange('calculator');
                      }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Select Album →
                    </button>
                    <a
                      href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Studio, I want to print: ' + alb.title + ' (' + alb.price + ')')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════════════
              SECTION 3: DRONE LENE PAR KYA PACKAGE HAI (AERIAL CINEMA)
              ══════════════════════════════════════════════════════════════════════════ */}
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Radio size={20} color="#38bdf8" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                  🚁 Drone Lene Par Kya Package Hai (Aerial Drone Cinematography)
                </h2>
                <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
                  DGCA certified commercial drone pilots equipped with DJI Mavic 3 Pro Cine Hasselblad 5.1K cameras.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {dronePricingPackages.map((dp) => (
                <div
                  key={dp.id}
                  style={{
                    background: 'rgba(15, 23, 42, 0.85)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
                        {dp.badge}
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#38bdf8' }}>{dp.price}</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>
                      {dp.title}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#fbbf24', fontWeight: 700, marginBottom: '4px' }}>
                      ⏱️ Flight Window: {dp.duration}
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#cbd5e1', marginBottom: '1rem', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 10px', borderRadius: '6px' }}>
                      🚁 {dp.drone} • {dp.pilot}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '1.25rem' }}>
                      {dp.features.map((f, fI) => (
                        <div key={fI} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12.5px', color: '#e2e8f0' }}>
                          <CheckCircle2 size={15} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const dMap = { 'DRN-1': 'barat_drone', 'DRN-2': 'fullday_drone', 'DRN-3': 'fpv_combo' };
                        setCalcDroneTier(dMap[dp.id] || 'barat_drone');
                        handleTabChange('calculator');
                      }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Select Drone →
                    </button>
                    <a
                      href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Studio, I want to book drone: ' + dp.title + ' (' + dp.price + ')')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════════════════
              SECTION 4: ALL-IN-ONE COMPLETE WEDDING COMBOS (PHOTO + VIDEO + ALBUM + DRONE)
              ══════════════════════════════════════════════════════════════════════════ */}
          <section
            style={{
              marginBottom: '3.5rem',
              background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.5) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.08em' }}>
                ALL-IN-ONE COMPLETE VALUE COMBOS
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
                Complete Wedding Packages (Photo + Video + Album + Drone)
              </h2>
              <p style={{ color: '#cbd5e1', fontSize: '14.5px', maxWidth: '750px', margin: '0 auto' }}>
                Save up to ₹50,000 by booking comprehensive multi-crew packages. Complete ritual coverage from Barat welcome to Vidai tears.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem' }}>
              {weddingComboPackages.map((cmb) => (
                <div
                  key={cmb.id}
                  style={{
                    background: cmb.recommended ? 'rgba(30, 27, 75, 0.85)' : 'rgba(15, 23, 42, 0.85)',
                    border: cmb.recommended ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '18px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    boxShadow: cmb.recommended ? '0 10px 30px rgba(245, 158, 11, 0.25)' : '0 8px 24px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {cmb.recommended && (
                    <div style={{ position: 'absolute', top: '-13px', right: '20px', background: '#f59e0b', color: '#0f172a', fontSize: '11px', fontWeight: 900, padding: '3px 12px', borderRadius: '12px' }}>
                      POPULAR CHOICE
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11.5px', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', padding: '3px 10px', borderRadius: '6px', fontWeight: 700 }}>
                        {cmb.badge}
                      </span>
                      <span style={{ fontSize: '12px', color: '#4ade80', fontWeight: 800 }}>{cmb.savings}</span>
                    </div>

                    <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0 0 10px' }}>
                      {cmb.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '1.5rem' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 900, color: '#facc15' }}>{cmb.price}</span>
                      <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>{cmb.originalPrice}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
                      {cmb.includes.map((inc, iIdx) => (
                        <div key={iIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#e2e8f0' }}>
                          <CheckCircle2 size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        if (cmb.id === 'CMB-1') {
                          setCalcPhoto('wedding_candid');
                          setCalcVideo('video_full');
                          setCalcAlbumTier('silk');
                          setCalcDroneTier('none');
                        } else if (cmb.id === 'CMB-2') {
                          setCalcPhoto('wedding_candid');
                          setCalcVideo('video_teaser');
                          setCalcAlbumTier('leatherette');
                          setCalcDroneTier('barat_drone');
                          setCalcAddonReels(true);
                        } else {
                          setCalcPhoto('wedding_candid');
                          setCalcVideo('cinema_4k');
                          setCalcAlbumTier('acrylic');
                          setCalcDroneTier('fullday_drone');
                          setCalcAddonReels(true);
                        }
                        handleTabChange('calculator');
                      }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#0f172a',
                        border: 'none',
                        padding: '11px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      Book This Combo →
                    </button>
                    <a
                      href={`https://wa.me/917651972973?text=${encodeURIComponent('Hello RB Studio, I want to book: ' + cmb.title + ' (' + cmb.price + ')')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#ffffff',
                        padding: '11px 14px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Multi-Camera Live Broadcast Breakdown */}
          <section
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '20px',
              padding: '2.5rem',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.08em' }}>
                LIVE STREAM BROADCAST SETUP
              </span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '6px 0' }}>
                Multi-Cam YouTube & Facebook Live Streaming (₹35,000)
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', maxWidth: '650px', margin: '0 auto' }}>
                Broadcast your sacred Jaimala, wedding ceremonies, or corporate keynote to loved ones across the globe in zero-buffer 1080p/4K.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {[
                { title: '3-Camera Switcher', tech: 'Blackmagic ATEM Mini Pro ISO', desc: 'Real-time camera switching, PIP, and digital graphics insertion.' },
                { title: 'Wireless Video Link', tech: 'Hollyland Mars 4K Transmitters', desc: 'Cable-free wireless camera mobility up to 450 feet line-of-sight.' },
                { title: 'Bonded 4G/5G Internet', tech: 'Dual SIM Internet Bonding', desc: 'Zero dropouts even during peak network congestion in wedding halls.' },
                { title: 'Custom TV Overlays', tech: 'Personalized Title Graphics', desc: 'Bride & Groom names, auspicious shlokas, and interactive family chat.' },
              ].map((b, bIdx) => (
                <div
                  key={bIdx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#ef4444', marginBottom: '4px' }}>{b.tech}</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>{b.title}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>{b.desc}</div>
                </div>
              ))}
            </div>
          </section>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 5: CAMERA & DRONE GEAR ARSENAL
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'gear' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('Camera & Drone Gear')}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              PRO ARSENAL SPECIFICATIONS
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              Cinema Camera & Production Equipment Arsenal
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              We do not compromise on gear. All cameras, lenses, drones, and lighting fixtures are owned, maintained,
              and operated by certified in-house cinematographers.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {cameraGearArsenal.map((category, catIdx) => (
              <div
                key={catIdx}
                style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '18px',
                  padding: '1.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    {category.category}
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
                            {item.tag}
                          </span>
                        </div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5 }}>
                          {item.specs}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Equipment Rental & Crew Dispatch Banner */}
          <section
            style={{
              marginTop: '3.5rem',
              background: 'linear-gradient(135deg, rgba(8, 47, 73, 0.5) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em' }}>
                CREW WITH GEAR DISPATCH
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, margin: '4px 0' }}>
                Need Camera Rigs & Certified Crew for Your Production?
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, maxWidth: '600px' }}>
                We provide complete production crew packages (Director of Photography, Drone Pilot, Gimbal Operator, Sound Recordist) across Uttar Pradesh & Bihar.
              </p>
            </div>
            <a
              href="tel:+917651972973"
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                color: '#0f172a',
                padding: '12px 24px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Call for Crew Booking: +91 76519 72973
            </a>
          </section>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 6: PORTFOLIO SHOWCASE
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'portfolio' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('Master Portfolio')}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#a855f7', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              OUR DELIVERED WORK
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              Tech Deployments & Cinematic Portfolio
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              A curated showcase of royal wedding films, commercial photography, and enterprise software systems delivered by RB Software & Media Hub.
            </p>
          </div>

          {/* Portfolio Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedPortfolioItem(item)}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(3, 7, 18, 0.75)',
                      backdropFilter: 'blur(8px)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800,
                    }}
                  >
                    {item.tag}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: 'rgba(3, 7, 18, 0.75)',
                      color: '#38bdf8',
                      padding: '6px',
                      borderRadius: '50%',
                    }}
                  >
                    <Maximize2 size={14} />
                  </div>
                </div>

                <div style={{ padding: '1.25rem' }}>
                  <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase' }}>
                    {item.type}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: '4px 0 8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Portfolio Modal Preview */}
          {selectedPortfolioItem && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(3, 7, 18, 0.92)',
                backdropFilter: 'blur(10px)',
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
              }}
              onClick={() => setSelectedPortfolioItem(null)}
            >
              <div
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  maxWidth: '750px',
                  width: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ position: 'relative', height: '340px' }}>
                  <img
                    src={selectedPortfolioItem.img}
                    alt={selectedPortfolioItem.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => setSelectedPortfolioItem(null)}
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      background: 'rgba(0,0,0,0.7)',
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
                    <X size={18} />
                  </button>
                </div>
                <div style={{ padding: '1.75rem' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '3px 10px', borderRadius: '4px', fontWeight: 800 }}>
                    {selectedPortfolioItem.type}
                  </span>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', margin: '10px 0 8px' }}>
                    {selectedPortfolioItem.title}
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {selectedPortfolioItem.description}
                  </p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => {
                        setSelectedPortfolioItem(null);
                        handleTabChange('calculator');
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Book a Similar Project
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 7: PROJECT & PROPOSAL CALCULATOR
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'calculator' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('Proposal Calculator')}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              TRANSPARENT ESTIMATOR & INSTANT QUOTE
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              Interactive Tech & Media Proposal Calculator
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              Select your required software applications, photography crew, 4K wedding video, photobook album, and aerial drone options.
              Get a transparent itemized estimate with direct WhatsApp proposal dispatch to +91 76519 72973.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            {/* Left Options Form */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.75rem',
              }}
            >
              {/* Step 1: Software Solution */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#818cf8', display: 'block', marginBottom: '8px' }}>
                  STEP 1: SELECT SOFTWARE / WEBSITE PLATFORM
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {[
                    { id: 'none', label: 'No Software Required (Media Only)', price: '₹0' },
                    { id: 'omnipos', label: 'OmniPOS Cloud Billing ERP + Dynamic QR', price: '₹18,500' },
                    { id: 'saas', label: 'Multi-Tenant Micro-SaaS Cloud Platform', price: '₹45,000' },
                    { id: 'website', label: 'Next.js Corporate Website & SEO Lead Funnel', price: '₹14,999' },
                    { id: 'ecommerce', label: 'E-Commerce Store & Multi-Vendor Marketplace', price: '₹28,000' },
                    { id: 'mobile', label: 'Native Android & iOS Mobile Client App', price: '₹38,000' },
                    { id: 'enterprise_erp', label: 'Custom Enterprise ERP & Staff CRM', price: '₹55,000' },
                    { id: 'whatsapp', label: 'Meta WhatsApp Business Cloud API Engine', price: '₹12,000' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCalcSoftware(opt.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: calcSoftware === opt.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: calcSoftware === opt.id ? '1px solid #6366f1' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '12.5px', color: '#818cf8', fontWeight: 800 }}>{opt.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Photography Package */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', display: 'block', marginBottom: '8px' }}>
                  STEP 2: SELECT PHOTOGRAPHY CREW
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {[
                    { id: 'none', label: 'No Photography Required', price: '₹0' },
                    { id: 'wedding_candid', label: 'Royal Wedding & Candid Photography (Full Day)', price: '₹48,000' },
                    { id: 'prewedding', label: 'Cinematic Pre-Wedding Couple Shoot', price: '₹22,000' },
                    { id: 'commercial', label: 'Commercial, Model Portfolio or Product Shoot', price: '₹18,000' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCalcPhoto(opt.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: calcPhoto === opt.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: calcPhoto === opt.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '12.5px', color: '#38bdf8', fontWeight: 800 }}>{opt.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: 4K Videography */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', display: 'block', marginBottom: '8px' }}>
                  STEP 3: SELECT 4K CINEMATIC VIDEOGRAPHY
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {[
                    { id: 'none', label: 'No Videography Required', price: '₹0' },
                    { id: 'video_teaser', label: '4K Cinematic Highlight Teaser (3-5 min)', price: '₹18,000' },
                    { id: 'video_full', label: 'Full Traditional Ceremony Film (60-90 min)', price: '₹28,000' },
                    { id: 'cinema_4k', label: 'Master Cinema Suite (Dual Sony FX3 + Teaser + Film)', price: '₹42,000' },
                    { id: 'multicam_live', label: 'Multi-Camera ATEM Mini Live YouTube/FB Stream', price: '₹35,000' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCalcVideo(opt.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: calcVideo === opt.id ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: calcVideo === opt.id ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '12.5px', color: '#f59e0b', fontWeight: 800 }}>{opt.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Wedding Photobook Album */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#c084fc', display: 'block', marginBottom: '8px' }}>
                  STEP 4: SELECT WEDDING PHOTOBOOK ALBUM (ALBUM KA PRICE)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {[
                    { id: 'none', label: 'No Physical Album (Digital Copies Only)', price: '₹0' },
                    { id: 'silk', label: 'Royal Silk Embossed Album (30 Sheets / 60 Pages)', price: '₹9,500' },
                    { id: 'leatherette', label: 'Luxury Italian Leatherette Photobook (40 Sheets / 80 Pages)', price: '₹14,500' },
                    { id: 'acrylic', label: 'Platinum Acrylic Glass Hardcover Suite (50 Sheets + 2 Parent Albums)', price: '₹21,000' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCalcAlbumTier(opt.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: calcAlbumTier === opt.id ? 'rgba(168, 85, 247, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: calcAlbumTier === opt.id ? '1px solid #a855f7' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '12.5px', color: '#c084fc', fontWeight: 800 }}>{opt.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 5: Aerial Drone Package */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8', display: 'block', marginBottom: '8px' }}>
                  STEP 5: SELECT AERIAL DRONE CINEMATOGRAPHY (DRONE KA PACKAGE)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                  {[
                    { id: 'none', label: 'No Drone Required', price: '₹0' },
                    { id: 'barat_drone', label: 'Barat Entry & Jaimala 4K Drone Flight (2-3h)', price: '₹12,000' },
                    { id: 'fullday_drone', label: 'Full-Day 5.1K Hasselblad Mavic 3 Pro Cine Package', price: '₹22,000' },
                    { id: 'fpv_combo', label: 'Drone Cinema + Indoor FPV Cinewhoop Fly-Through Combo', price: '₹32,000' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setCalcDroneTier(opt.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: calcDroneTier === opt.id ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                        border: calcDroneTier === opt.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '13px', color: '#ffffff', fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: '12.5px', color: '#38bdf8', fontWeight: 800 }}>{opt.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 6: Value Add-ons */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 800, color: '#ec4899', display: 'block', marginBottom: '8px' }}>
                  STEP 6: SOCIAL MEDIA SPECIAL ADD-ON
                </label>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: calcAddonReels ? 'rgba(236, 72, 153, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                    border: calcAddonReels ? '1px solid #ec4899' : '1px solid rgba(255, 255, 255, 0.08)',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={calcAddonReels}
                    onChange={(e) => setCalcAddonReels(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#ec4899' }}
                  />
                  <span style={{ fontSize: '13.5px', color: '#ffffff', flex: 1 }}>
                    Same-Night 24H Viral Instagram Reels Pack (+₹12,000)
                  </span>
                </label>
              </div>
            </div>

            {/* Right Summary & Dispatch Card */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(3, 7, 18, 0.95) 100%)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '20px',
                padding: '2rem',
                position: 'sticky',
                top: '90px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ background: '#38bdf8', color: '#0f172a', fontSize: '11px', fontWeight: 900, padding: '2px 8px', borderRadius: '4px' }}>
                  LIVE ESTIMATE
                </span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Real-time Total</span>
              </div>

              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#38bdf8', marginBottom: '1.5rem' }}>
                ₹{calculateTotal().toLocaleString('en-IN')}
                <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 400, marginLeft: '8px' }}>
                  (Est. Total)
                </span>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#e2e8f0', marginBottom: '10px' }}>
                  ITEMIZED BREAKDOWN:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Software:</span>
                    <strong style={{ color: '#ffffff' }}>{calcSoftware.toUpperCase()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Photography:</span>
                    <strong style={{ color: '#ffffff' }}>{calcPhoto.toUpperCase()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>4K Videography:</span>
                    <strong style={{ color: '#ffffff' }}>{calcVideo.toUpperCase()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Wedding Photobook:</span>
                    <strong style={{ color: calcAlbumTier !== 'none' ? '#c084fc' : '#64748b' }}>
                      {calcAlbumTier.toUpperCase()}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Aerial Drone:</span>
                    <strong style={{ color: calcDroneTier !== 'none' ? '#38bdf8' : '#64748b' }}>
                      {calcDroneTier.toUpperCase()}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Same-Night Reels:</span>
                    <strong style={{ color: calcAddonReels ? '#4ade80' : '#64748b' }}>
                      {calcAddonReels ? 'Included (+₹12,000)' : 'None'}
                    </strong>
                  </div>
                </div>
              </div>

              <form onSubmit={handleDispatchProposal} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Your Name / Organization
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar / Tech Corp"
                    value={calcClientName}
                    onChange={(e) => setCalcClientName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={calcClientPhone}
                    onChange={(e) => setCalcClientPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Event Date / Target Launch
                  </label>
                  <input
                    type="date"
                    value={calcEventDate}
                    onChange={(e) => setCalcEventDate(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '10px',
                    fontWeight: 900,
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.4)',
                    marginTop: '8px',
                  }}
                >
                  <Send size={16} /> Send Proposal to WhatsApp
                </button>
              </form>

              {calcSubmitted && (
                <div
                  style={{
                    marginTop: '1rem',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.4)',
                    color: '#86efac',
                    padding: '10px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    textAlign: 'center',
                  }}
                >
                  ✓ Proposal generated & synced with RB Software Admin Portal!
                </div>
              )}
            </div>
          </div>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ══════════════════════════════════════════════════════════════════════════
          TAB 8: CONTACT & STUDIO DETAILS
          ══════════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'contact' && (
        <main style={{ width: '100%', padding: '2rem clamp(1rem, 3.5vw, 4rem) 4rem' }}>
          {renderTabTopNav('Contact & Studio')}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: 800, letterSpacing: '0.1em' }}>
              GET IN TOUCH
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, margin: '8px 0' }}>
              Contact RB Software & Media Studio
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', maxWidth: '750px', margin: '0 auto' }}>
              Ready to build your next-gen software platform or book our cinema camera crew for your royal wedding?
              Connect directly with our senior leads.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Contact Details Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(56, 189, 248, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                  }}
                >
                  <Phone size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>DIRECT CALL & WHATSAPP</div>
                  <a
                    href="tel:+917651972973"
                    style={{ fontSize: '1.2rem', fontWeight: 900, color: '#ffffff', textDecoration: 'none' }}
                  >
                    +91 76519 72973
                  </a>
                  <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '2px' }}>Available 24/7 for Production Emergencies</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#818cf8',
                  }}
                >
                  <MapPin size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>HEADQUARTERS & STUDIO</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    Bhaisodi, Sarnath, Varanasi, UP
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>Pin Code: 221007</div>
                </div>
              </div>

              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b',
                  }}
                >
                  <Clock size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>STUDIO & TECH CONSULTATION HOURS</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    Monday - Sunday: 9:00 AM - 9:00 PM
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Shoots covered nationwide on demand</div>
                </div>
              </div>
            </div>

            {/* Quick Message Form */}
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
              }}
            >
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#ffffff', margin: '0 0 1rem' }}>
                Send Instant Inquiry
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thank you! Our technical & media team will reach out to you within 30 minutes.');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Project Requirements
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your software project, wedding dates, or drone shoot requirements..."
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  Submit Inquiry →
                </button>
              </form>
            </div>
          </div>
          {renderTabBottomNav()}
        </main>
      )}

      {/* ── Master Full-Width Footer ── */}
      <footer
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'rgba(3, 7, 18, 0.95)',
          padding: '3rem clamp(1rem, 3.5vw, 4rem) 2rem',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Code2 size={20} color="#ffffff" />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff' }}>RB Software & Media</span>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>
              Pioneering custom enterprise software, cloud multi-tenancy, POS billing systems, alongside elite Sony FX3 4K cinema and Hasselblad drone productions.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginBottom: '14px', letterSpacing: '0.04em' }}>
              TECH SOLUTIONS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span onClick={() => handleTabChange('software')} style={{ color: '#94a3b8', cursor: 'pointer' }}>OmniPOS GST Billing</span>
              <span onClick={() => handleTabChange('software')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Multi-Tenant Micro-SaaS</span>
              <span onClick={() => handleTabChange('software')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Android & iOS Mobile Apps</span>
              <span onClick={() => handleTabChange('software')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Meta WhatsApp Business API</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginBottom: '14px', letterSpacing: '0.04em' }}>
              CAMERA & VIDEO
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span onClick={() => handleTabChange('photography')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Royal Wedding & Candids</span>
              <span onClick={() => handleTabChange('videography')} style={{ color: '#94a3b8', cursor: 'pointer' }}>4K Cinematic Wedding Films</span>
              <span onClick={() => handleTabChange('videography')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Aerial Drone 5.1K Cinematography</span>
              <span onClick={() => handleTabChange('videography')} style={{ color: '#94a3b8', cursor: 'pointer' }}>Multi-Cam Live Streaming</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginBottom: '14px', letterSpacing: '0.04em' }}>
              OFFICE & INQUIRIES
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
              Bhaisodi, Sarnath, Varanasi, UP - 221007<br />
              Direct Phone: <a href="tel:+917651972973" style={{ color: '#38bdf8', textDecoration: 'none' }}>+91 76519 72973</a><br />
              Mon - Sun: 9:00 AM - 9:00 PM
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <div>© {new Date().getFullYear()} RB Software & Media Tech Hub. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#94a3b8' }}>Platform Hub</span>
            <span onClick={() => navigate('/storefront')} style={{ cursor: 'pointer', color: '#94a3b8' }}>Golden Beauty</span>
            <span onClick={() => navigate('/events')} style={{ cursor: 'pointer', color: '#94a3b8' }}>Jay Gurudev Events</span>
            <span onClick={() => navigate('/plotting')} style={{ cursor: 'pointer', color: '#94a3b8' }}>Kashi Plotting</span>
            <span onClick={() => navigate('/rent')} style={{ cursor: 'pointer', color: '#94a3b8' }}>Office Rent</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
