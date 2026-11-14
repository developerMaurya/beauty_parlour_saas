/**
 * @file GoldenBeautyAdminDashboard.jsx
 * @description Master Executive Dashboard for Golden Beauty Parlour.
 * Complete with:
 *   1. 👑 Executive Overview: KPIs, Welcome Bridal Showcase, Sales Analytics, Quick Actions
 *   2. 📋 Customer Inquiries & Booking Requests: Approve/Confirm, Instant WhatsApp, Direct Phone Call, Real-time Status Sync
 *   3. 🧴 Products & Stock Inventory: Product catalog with Images, Pricing, Stock Count, Low-Stock Warning Badges, Add/Edit/Delete & Quick Counters
 *   4. 🎓 Academy Certificate Generator: Live Royal Gold Certificate Designer, Custom Candidate & Course details, Print/PDF Download, and Issued History
 * @module frontend/src/modules/admin/pages/GoldenBeautyAdminDashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Scissors,
  Sparkles,
  Crown,
  Calendar,
  Users,
  UserCheck,
  GraduationCap,
  Package,
  CreditCard,
  HeartHandshake,
  Tag,
  BarChart3,
  Download,
  Bell,
  Headphones,
  Settings,
  Search,
  MessageSquare,
  Globe,
  ArrowRight,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  Box,
  FileText,
  Send,
  MoreVertical,
  X,
  ExternalLink,
  Phone,
  MessageCircle,
  AlertTriangle,
  Award,
  Printer,
  Trash2,
  Edit,
  Eye,
  Check,
  RefreshCw,
  Filter,
} from 'lucide-react';

export function GoldenBeautyAdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const switchTab = (tabName) => {
    setSearchParams({ tab: tabName });
  };

  // State for Sales Chart filter
  const [salesRange, setSalesRange] = useState('30_DAYS');
  const [activeTooltip, setActiveTooltip] = useState({ date: 'Oct 28', revenue: '₹1,25,000', visible: true });

  // Quick Action Modals
  const [quickModal, setQuickModal] = useState(null);
  const [modalSuccessMsg, setModalSuccessMsg] = useState('');

  // ════════════════════════════════════════════════════════════════════════════
  // 1. INQUIRIES & CUSTOMER REQUESTS STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [inquiries, setInquiries] = useState(() => {
    try {
      const stored = localStorage.getItem('all_customer_service_requests');
      const all = stored ? JSON.parse(stored) : [];
      const parlourRequests = all.filter((r) => r.serviceType === 'parlour' || !r.serviceType);
      if (parlourRequests.length > 0) return parlourRequests;
      
      // Default seeded realistic inquiries
      const seed = [
        {
          id: 'REQ-17316001',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
          customerName: 'Pooja Maurya',
          customerEmail: 'pooja.maurya@gmail.com',
          customerPhone: '9876543210',
          serviceType: 'parlour',
          serviceName: 'Bridal HD Airbrush Makeup & Hair Artistry',
          eventDate: '2026-11-28',
          timeSlot: '10:00 AM - 01:30 PM',
          budget: '₹18,500',
          notes: 'Urgent booking for wedding reception. Require pre-bridal glow facial 2 days prior.',
          status: 'Pending',
        },
        {
          id: 'REQ-17316002',
          createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
          customerName: 'Sneha Kapoor',
          customerEmail: 'sneha.k@outlook.com',
          customerPhone: '9811223344',
          serviceType: 'parlour',
          serviceName: 'O3+ Bridal D-Tan Facial & Organic Bleach',
          eventDate: '2026-11-20',
          timeSlot: '03:00 PM',
          budget: '₹4,500',
          notes: 'Sensitive skin, please assign senior esthetician.',
          status: 'Confirmed',
        },
        {
          id: 'REQ-17316003',
          createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
          customerName: 'Priya Mishra',
          customerEmail: 'priya.mishra99@gmail.com',
          customerPhone: '9933445566',
          serviceType: 'parlour',
          serviceName: 'Keratin Hair Smoothing & Deep Conditioning Spa',
          eventDate: '2026-11-18',
          timeSlot: '11:30 AM',
          budget: '₹6,800',
          notes: 'Medium waist-length hair. Requested quotation for sister too.',
          status: 'In-Progress',
        },
      ];
      localStorage.setItem('all_customer_service_requests', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  const [inquiryFilter, setInquiryFilter] = useState('ALL');
  const [inquirySearch, setInquirySearch] = useState('');

  // Update inquiry status
  const updateInquiryStatus = (id, newStatus) => {
    const updated = inquiries.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
    setInquiries(updated);
    try {
      const stored = JSON.parse(localStorage.getItem('all_customer_service_requests') || '[]');
      const allUpdated = stored.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
      localStorage.setItem('all_customer_service_requests', JSON.stringify(allUpdated));
    } catch (e) {
      console.warn(e);
    }
    setModalSuccessMsg(`Booking #${id} status changed to ${newStatus}`);
    setTimeout(() => setModalSuccessMsg(''), 2500);
  };

  // Delete inquiry
  const deleteInquiry = (id) => {
    if (!window.confirm('Are you sure you want to delete this customer inquiry?')) return;
    const filtered = inquiries.filter((item) => item.id !== id);
    setInquiries(filtered);
    try {
      const stored = JSON.parse(localStorage.getItem('all_customer_service_requests') || '[]');
      const allFiltered = stored.filter((item) => item.id !== id);
      localStorage.setItem('all_customer_service_requests', JSON.stringify(allFiltered));
    } catch (e) {
      console.warn(e);
    }
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 2. PRODUCTS & STOCK INVENTORY STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_products_inventory');
      if (stored) return JSON.parse(stored);
      const seedProducts = [
        {
          id: 'PROD-01',
          name: 'O3+ Bridal Glow & Whitening Facial Kit',
          category: 'Skin Care',
          image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
          price: 3850,
          cost: 2400,
          stock: 8,
          minStock: 3,
          brand: 'O3+ Professional',
          unit: 'Kit',
        },
        {
          id: 'PROD-02',
          name: 'L\'Oreal Mythic Hair Serum with Argan Oil 100ml',
          category: 'Hair Care',
          image: 'https://images.unsplash.com/photo-1608248597359-59800d388656?auto=format&fit=crop&w=400&q=80',
          price: 1250,
          cost: 850,
          stock: 3, // LOW STOCK
          minStock: 5,
          brand: 'L\'Oreal Paris',
          unit: 'Bottle',
        },
        {
          id: 'PROD-03',
          name: 'Kryolan HD Micro Foundation Palette (18 Shades)',
          category: 'Bridal Makeup',
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
          price: 6500,
          cost: 4800,
          stock: 1, // CRITICAL LOW STOCK
          minStock: 3,
          brand: 'Kryolan Germany',
          unit: 'Palette',
        },
        {
          id: 'PROD-04',
          name: 'Streax Canvoline Hair Straightening & Neutralizer Kit',
          category: 'Hair Care',
          image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=400&q=80',
          price: 1850,
          cost: 1200,
          stock: 14,
          minStock: 4,
          brand: 'Streax Professional',
          unit: 'Kit',
        },
        {
          id: 'PROD-05',
          name: 'Rica Brazilian White Chocolate Liposoluble Wax 800ml',
          category: 'Waxing & Spa',
          image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80',
          price: 1450,
          cost: 950,
          stock: 0, // OUT OF STOCK
          minStock: 2,
          brand: 'Rica Italy',
          unit: 'Can',
        },
        {
          id: 'PROD-06',
          name: 'Lotus Professional Phyto-Rx Anti-Ageing Serum 50ml',
          category: 'Skin Care',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80',
          price: 990,
          cost: 620,
          stock: 6,
          minStock: 2,
          brand: 'Lotus Herbals',
          unit: 'Bottle',
        },
      ];
      localStorage.setItem('parlour_products_inventory', JSON.stringify(seedProducts));
      return seedProducts;
    } catch {
      return [];
    }
  });

  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFilter, setProductFilter] = useState('ALL'); // 'ALL' | 'LOW' | 'OUT' | 'IN_STOCK'
  const [productSearch, setProductSearch] = useState('');

  // Product Form fields
  const [prodForm, setProdForm] = useState({
    name: '',
    category: 'Skin Care',
    image: '',
    price: '',
    cost: '',
    stock: '',
    minStock: 3,
    brand: '',
    unit: 'Pieces',
  });

  const saveProduct = (e) => {
    e.preventDefault();
    if (!prodForm.name.trim()) return;

    const fallbackImg =
      prodForm.image.trim() ||
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80';

    if (editingProduct) {
      // Update
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: prodForm.name,
              category: prodForm.category,
              image: fallbackImg,
              price: Number(prodForm.price) || 0,
              cost: Number(prodForm.cost) || 0,
              stock: Number(prodForm.stock) || 0,
              minStock: Number(prodForm.minStock) || 3,
              brand: prodForm.brand || 'Golden Beauty',
              unit: prodForm.unit || 'Unit',
            }
          : p
      );
      setProducts(updated);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
      setModalSuccessMsg(`Product "${prodForm.name}" updated successfully!`);
    } else {
      // Add New
      const newProd = {
        id: 'PROD-' + Date.now().toString().slice(-4),
        name: prodForm.name,
        category: prodForm.category,
        image: fallbackImg,
        price: Number(prodForm.price) || 0,
        cost: Number(prodForm.cost) || 0,
        stock: Number(prodForm.stock) || 0,
        minStock: Number(prodForm.minStock) || 3,
        brand: prodForm.brand || 'Golden Beauty',
        unit: prodForm.unit || 'Unit',
      };
      const updated = [newProd, ...products];
      setProducts(updated);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
      setModalSuccessMsg(`Product "${prodForm.name}" added to inventory!`);
    }

    setProductModalOpen(false);
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'Skin Care',
      image: '',
      price: '',
      cost: '',
      stock: '',
      minStock: 3,
      brand: '',
      unit: 'Pieces',
    });
    setTimeout(() => setModalSuccessMsg(''), 2500);
  };

  const adjustStock = (id, delta) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const next = Math.max(0, p.stock + delta);
        return { ...p, stock: next };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
  };

  const deleteProduct = (id) => {
    if (!window.confirm('Delete this product from salon inventory?')) return;
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('parlour_products_inventory', JSON.stringify(updated));
  };

  // ════════════════════════════════════════════════════════════════════════════
  // 3. CERTIFICATE GENERATOR STATE
  // ════════════════════════════════════════════════════════════════════════════
  const [certificates, setCertificates] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_academy_certificates');
      if (stored) return JSON.parse(stored);
      const seedCert = [
        {
          id: 'CERT-GBP-2026-0104',
          studentName: 'Pooja Sharma',
          course: 'Advanced Bridal HD Makeup & Hair Styling Diploma',
          issueDate: '2026-10-15',
          grade: 'Distinction (Grade A+)',
          duration: '3 Months Intensive',
          instructor: 'Rekha Maurya - Master Stylist & Director',
        },
        {
          id: 'CERT-GBP-2026-0098',
          studentName: 'Ritu Verma',
          course: 'Professional Cosmetology & Skin Esthetics',
          issueDate: '2026-09-28',
          grade: 'First Class Honours',
          duration: '6 Months Professional',
          instructor: 'Rekha Maurya - Master Stylist & Director',
        },
      ];
      localStorage.setItem('parlour_academy_certificates', JSON.stringify(seedCert));
      return seedCert;
    } catch {
      return [];
    }
  });

  const [certForm, setCertForm] = useState({
    studentName: 'Priyanka Kumari',
    course: 'Master Bridal Makeup & Hair Styling Artistry',
    certId: `CERT-GBP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    issueDate: new Date().toISOString().split('T')[0],
    grade: 'Distinction (Grade A+)',
    duration: '3 Months Comprehensive',
    instructor: 'Rekha Maurya - Founder & Master Stylist, Golden Beauty Parlour',
  });

  const [certViewMode, setCertViewMode] = useState('DESIGNER'); // 'DESIGNER' | 'ARCHIVE'

  const handleIssueCertificate = (e) => {
    e.preventDefault();
    if (!certForm.studentName.trim() || !certForm.course.trim()) return;

    const newRecord = {
      id: certForm.certId,
      studentName: certForm.studentName,
      course: certForm.course,
      issueDate: certForm.issueDate,
      grade: certForm.grade,
      duration: certForm.duration,
      instructor: certForm.instructor,
    };

    const updated = [newRecord, ...certificates];
    setCertificates(updated);
    localStorage.setItem('parlour_academy_certificates', JSON.stringify(updated));
    setModalSuccessMsg(`Official Certificate issued for ${certForm.studentName}!`);
    setTimeout(() => setModalSuccessMsg(''), 3000);
  };

  const printCertificate = () => {
    window.print();
  };

  // Simple modal submit handler
  const handleModalSubmit = (e, title) => {
    e.preventDefault();
    setModalSuccessMsg(`${title} processed successfully!`);
    setTimeout(() => {
      setQuickModal(null);
      setModalSuccessMsg('');
    }, 1800);
  };

  // Filter inquiries
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesFilter =
      inquiryFilter === 'ALL' ||
      inq.status?.toUpperCase() === inquiryFilter ||
      (inquiryFilter === 'PENDING' && (!inq.status || inq.status === 'Pending'));
    const matchesSearch =
      (inq.customerName || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.serviceName || '').toLowerCase().includes(inquirySearch.toLowerCase()) ||
      (inq.customerPhone || '').includes(inquirySearch);
    return matchesFilter && matchesSearch;
  });

  // Filter products
  const filteredProducts = products.filter((p) => {
    const isOut = p.stock === 0;
    const isLow = p.stock > 0 && p.stock <= p.minStock;
    const isIn = p.stock > p.minStock;

    if (productFilter === 'OUT' && !isOut) return false;
    if (productFilter === 'LOW' && !isLow) return false;
    if (productFilter === 'IN_STOCK' && !isIn) return false;

    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(productSearch.toLowerCase());
    return matchesSearch;
  });

  const lowStockCount = products.filter((p) => p.stock <= p.minStock).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const pendingInquiriesCount = inquiries.filter((i) => !i.status || i.status === 'Pending').length;

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#1e293b', background: '#f8fafc', minHeight: '100vh', width: '100%' }}>
      {/* ── Top Header Bar ── */}
      <header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          position: 'sticky',
          top: 0,
          zIndex: 30,
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '180px', maxWidth: '340px' }}>
          <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            placeholder="Search salon services, clients..."
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '999px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
          />
        </div>

        {/* Right Nav Icons & Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Notification with Badge */}
          <div
            onClick={() => switchTab('requests')}
            style={{ position: 'relative', cursor: 'pointer', padding: 6, borderRadius: '50%', background: '#f8fafc' }}
            title="Customer Booking Requests"
          >
            <Bell size={19} color="#64748b" />
            {pendingInquiriesCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 900,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {pendingInquiriesCount}
              </span>
            )}
          </div>

          {/* Admin Avatar & Role */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/profile')}
          >
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
              alt="Admin Profile"
              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fce7f3' }}
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a', lineHeight: 1.2 }}>
                Admin
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Super Admin</div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Global Parlour Feature Tabs Navigation Bar ── */}
      <div
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 1.25rem',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          position: 'sticky',
          top: '57px',
          zIndex: 25,
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <button
          onClick={() => switchTab('overview')}
          style={{
            padding: '12px 14px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'overview' ? '3px solid #7e22ce' : '3px solid transparent',
            color: activeTab === 'overview' ? '#7e22ce' : '#64748b',
            fontWeight: activeTab === 'overview' ? 800 : 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
          }}
        >
          <Crown size={16} color={activeTab === 'overview' ? '#7e22ce' : '#94a3b8'} />
          <span>Salon Overview</span>
        </button>

        <button
          onClick={() => switchTab('requests')}
          style={{
            padding: '12px 14px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'requests' ? '3px solid #7e22ce' : '3px solid transparent',
            color: activeTab === 'requests' ? '#7e22ce' : '#64748b',
            fontWeight: activeTab === 'requests' ? 800 : 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
          }}
        >
          <MessageSquare size={16} color={activeTab === 'requests' ? '#7e22ce' : '#94a3b8'} />
          <span>Inquiries & Requests</span>
          {pendingInquiriesCount > 0 && (
            <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '1px 6px', borderRadius: '10px' }}>
              {pendingInquiriesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => switchTab('products')}
          style={{
            padding: '12px 14px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'products' ? '3px solid #7e22ce' : '3px solid transparent',
            color: activeTab === 'products' ? '#7e22ce' : '#64748b',
            fontWeight: activeTab === 'products' ? 800 : 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
          }}
        >
          <Box size={16} color={activeTab === 'products' ? '#7e22ce' : '#94a3b8'} />
          <span>Products & Stock</span>
          {lowStockCount > 0 && (
            <span style={{ background: '#f59e0b', color: '#fff', fontSize: '10px', fontWeight: 900, padding: '1px 6px', borderRadius: '10px' }}>
              {lowStockCount} Alert
            </span>
          )}
        </button>

        <button
          onClick={() => switchTab('certificates')}
          style={{
            padding: '12px 14px',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'certificates' ? '3px solid #7e22ce' : '3px solid transparent',
            color: activeTab === 'certificates' ? '#7e22ce' : '#64748b',
            fontWeight: activeTab === 'certificates' ? 800 : 600,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            whiteSpace: 'nowrap',
          }}
        >
          <Award size={16} color={activeTab === 'certificates' ? '#7e22ce' : '#94a3b8'} />
          <span>Certificate Generator</span>
          <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '10px', fontWeight: 900, padding: '1px 6px', borderRadius: '10px' }}>
            {certificates.length} Issued
          </span>
        </button>
      </div>

      {/* Global Success Notification Pill */}
      {modalSuccessMsg && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '20px',
            zIndex: 99999,
            background: '#15803d',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 800,
            fontSize: '13.5px',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{modalSuccessMsg}</span>
        </div>
      )}

      {/* ── Main Dashboard Body Content ── */}
      <main style={{ padding: '1.25rem 1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1: SALON OVERVIEW (The Master Parlour Executive KPI Dashboard)
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'overview' && (
          <>
            {/* 1. Welcome Banner Card with Bridal Model */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #fae8ff 100%)',
                borderRadius: '20px',
                border: '1px solid #fbcfe8',
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(244, 114, 182, 0.1)',
                flexWrap: 'wrap',
                gap: '1.25rem',
              }}
            >
              <div style={{ maxWidth: '560px', zIndex: 2, flex: 1, minWidth: '240px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', fontWeight: 900, color: '#1e1b4b', margin: '0 0 6px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Welcome Back, Admin!
                </h1>
                <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                  Manage your beauty parlour business easily and grow more customers.
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate('/storefront')}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '10px',
                      background: '#7e22ce',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
                    }}
                  >
                    <span>View Website</span>
                    <ArrowRight size={14} />
                  </button>
                  <button
                    onClick={() => switchTab('requests')}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '10px',
                      background: '#ffffff',
                      color: '#7e22ce',
                      border: '1.5px solid #d8b4fe',
                      fontWeight: 800,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span>Check Inquiries ({pendingInquiriesCount})</span>
                  </button>
                </div>
              </div>

              {/* Right Bridal Banner Image & Tagline */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 2 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.6rem', color: '#4a044e', fontWeight: 700, lineHeight: 1.1 }}>
                    Look Beautiful
                  </div>
                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.4rem', color: '#701a75', fontWeight: 600 }}>
                    Feel Beautiful...
                  </div>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80"
                  alt="Bridal Model"
                  style={{
                    width: '120px',
                    height: '110px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                    border: '2px solid #ffffff',
                  }}
                />
              </div>
            </div>

            {/* 2. Top 4 KPI Metric Cards with Sparklines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
              {/* Card 1: Total Appointments */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Appointments</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>248</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +12% from last month
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={24} />
                </div>
              </div>

              {/* Card 2: Total Customers */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Customers</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>1,245</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +18% active clients
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} />
                </div>
              </div>

              {/* Card 3: Total Revenue */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Total Revenue</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>₹2,48,750</div>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={14} /> +22% profit margin
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={24} />
                </div>
              </div>

              {/* Card 4: Reviews & Rating */}
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.25rem 1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>Reviews & Rating</div>
                  <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.1 }}>4.8 / 5</div>
                  <div style={{ fontSize: '12px', color: '#eab308', fontWeight: 800, marginTop: '6px' }}>
                    ★★★★★ (380+ Reviews)
                  </div>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={24} />
                </div>
              </div>
            </div>

            {/* 3. Sales Overview Area Chart with Last 30 Days Filter */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '1.5rem 1.75rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Sales Overview</h3>
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>Daily parlour revenues & bookings progression</div>
                </div>

                <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '10px' }}>
                  {['7_DAYS', '30_DAYS', '90_DAYS'].map((r) => (
                    <button
                      key={r}
                      onClick={() => setSalesRange(r)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: salesRange === r ? '#ffffff' : 'transparent',
                        color: salesRange === r ? '#7e22ce' : '#64748b',
                        fontWeight: salesRange === r ? 800 : 600,
                        fontSize: '12px',
                        cursor: 'pointer',
                        boxShadow: salesRange === r ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {r.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: '1rem' }}>
                <svg width="100%" height="100%" viewBox="0 0 800 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c084fc" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#9333ea" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="40" x2="800" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="90" x2="800" y2="90" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="140" x2="800" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />
                  <line x1="0" y1="190" x2="800" y2="190" stroke="#f1f5f9" strokeDasharray="4 4" />

                  {/* Gradient Area Path */}
                  <path
                    d="M 0,180 Q 120,130 200,140 T 400,90 T 600,60 T 800,45 L 800,220 L 0,220 Z"
                    fill="url(#purpleGrad)"
                  />
                  {/* Stroke Line */}
                  <path
                    d="M 0,180 Q 120,130 200,140 T 400,90 T 600,60 T 800,45"
                    fill="none"
                    stroke="#9333ea"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Active Tooltip Anchor */}
                  <circle cx="600" cy="60" r="6" fill="#9333ea" stroke="#ffffff" strokeWidth="3" />
                </svg>

                {/* Floating tooltip */}
                <div
                  style={{
                    position: 'absolute',
                    left: '70%',
                    top: '20px',
                    transform: 'translateX(-50%)',
                    background: '#1e1b4b',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                  }}
                >
                  <div>Revenue: ₹1,25,000</div>
                  <div style={{ fontSize: '10px', color: '#c084fc' }}>Oct 28 (Peak Weekend)</div>
                </div>
              </div>
            </div>

            {/* 4. Quick Action Tiles */}
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem' }}>Salon Quick Actions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
                <div
                  onClick={() => switchTab('requests')}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <MessageSquare size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>Check Inquiries</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{pendingInquiriesCount} new requests</div>
                </div>

                <div
                  onClick={() => switchTab('products')}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Box size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>Manage Products</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{products.length} products & stock</div>
                </div>

                <div
                  onClick={() => switchTab('certificates')}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Award size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>Issue Certificate</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Student course diploma</div>
                </div>

                <div
                  onClick={() => setQuickModal('BOOK_APPT')}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #f1f5f9',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Calendar size={20} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '13.5px', color: '#0f172a' }}>Book Appointment</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Walk-in client schedule</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2: INQUIRIES & CUSTOMER REQUESTS MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Strip with Controls */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Customer Inquiries & Requests</span>
                  <span style={{ fontSize: '11.5px', background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    Golden Beauty Parlour
                  </span>
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Review incoming parlour bookings, approve appointments, and call/WhatsApp customers directly.
                </div>
              </div>

              {/* Status Filter Badges */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['ALL', 'PENDING', 'CONFIRMED', 'IN-PROGRESS', 'COMPLETED'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setInquiryFilter(f)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      background: inquiryFilter === f ? '#7e22ce' : '#f1f5f9',
                      color: inquiryFilter === f ? '#ffffff' : '#64748b',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ fontSize: '42px', marginBottom: '8px' }}>📋✨</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>No customer inquiries found</h3>
                <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '380px', margin: '6px auto 0' }}>
                  Customer requests from the website or mobile app will appear here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredInquiries.map((inq) => {
                  const cleanPhone = (inq.customerPhone || '').replace(/\D/g, '');
                  const isPending = !inq.status || inq.status === 'Pending';
                  const isConfirmed = inq.status === 'Confirmed';
                  const isInProgress = inq.status === 'In-Progress';

                  return (
                    <div
                      key={inq.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: isPending ? '1.5px solid #facc15' : '1px solid #e2e8f0',
                        padding: '1.25rem 1.5rem',
                        boxShadow: isPending ? '0 4px 16px rgba(250, 204, 21, 0.12)' : '0 2px 8px rgba(0,0,0,0.02)',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                              {inq.customerName}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '6px',
                                background: isConfirmed ? '#ecfdf5' : isInProgress ? '#eff6ff' : '#fefce8',
                                color: isConfirmed ? '#15803d' : isInProgress ? '#1d4ed8' : '#a16207',
                                border: isConfirmed ? '1px solid #bbf7d0' : isInProgress ? '1px solid #bfdbfe' : '1px solid #fef08a',
                              }}
                            >
                              {inq.status || 'Pending Review'}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                            <span>📞 {inq.customerPhone || 'No Phone'}</span>
                            {inq.customerEmail && <span>✉️ {inq.customerEmail}</span>}
                            <span>🆔 {inq.id}</span>
                          </div>
                        </div>

                        {/* Status Change Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Status:</span>
                          <select
                            value={inq.status || 'Pending'}
                            onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                            style={{
                              padding: '6px 10px',
                              borderRadius: '8px',
                              border: '1.5px solid #cbd5e1',
                              background: '#ffffff',
                              fontSize: '12px',
                              fontWeight: 800,
                              color: '#0f172a',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Service Details Card */}
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: '12px',
                          padding: '12px 14px',
                          border: '1px solid #f1f5f9',
                          marginBottom: '12px',
                        }}
                      >
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#7e22ce', marginBottom: '4px' }}>
                          💄 {inq.serviceName}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
                          {inq.eventDate && <span>📅 Requested Date: <strong>{inq.eventDate}</strong></span>}
                          {inq.timeSlot && <span>⏰ Time Slot: <strong>{inq.timeSlot}</strong></span>}
                          {inq.budget && <span>💰 Estimate / Budget: <strong>{inq.budget}</strong></span>}
                        </div>

                        {inq.notes && (
                          <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic', marginTop: '6px', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            "{inq.notes}"
                          </div>
                        )}
                      </div>

                      {/* Direct Action Toolbar */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {isPending && (
                            <button
                              onClick={() => updateInquiryStatus(inq.id, 'Confirmed')}
                              style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#16a34a',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.3)',
                              }}
                            >
                              <CheckCircle2 size={14} /> Approve & Confirm
                            </button>
                          )}

                          {/* WhatsApp Customer */}
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                `Hello ${inq.customerName}, this is Golden Beauty Parlour! We have received your booking request for ${inq.serviceName} on ${inq.eventDate || 'scheduled date'}. Please confirm if this time suits you.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                padding: '7px 12px',
                                borderRadius: '8px',
                                border: '1px solid #22c55e',
                                background: '#f0fdf4',
                                color: '#15803d',
                                fontSize: '12px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <MessageCircle size={14} /> WhatsApp Client
                            </a>
                          )}

                          {/* Call Customer */}
                          {cleanPhone && (
                            <a
                              href={`tel:${cleanPhone}`}
                              style={{
                                padding: '7px 12px',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '12px',
                                fontWeight: 800,
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Phone size={14} /> Call Client
                            </a>
                          )}
                        </div>

                        <button
                          onClick={() => deleteInquiry(inq.id)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#fee2e2',
                            color: '#b91c1c',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3: PRODUCTS & STOCK INVENTORY MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Top Toolbar */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Parlour Products & Stock Inventory</span>
                  <span style={{ fontSize: '11.5px', background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    {products.length} Items
                  </span>
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Add products with images, track salon usage, and monitor real-time stock alert levels.
                </div>
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProdForm({
                    name: '',
                    category: 'Skin Care',
                    image: '',
                    price: '',
                    cost: '',
                    stock: '',
                    minStock: 3,
                    brand: '',
                    unit: 'Pieces',
                  });
                  setProductModalOpen(true);
                }}
                style={{
                  padding: '9px 18px',
                  borderRadius: '10px',
                  background: '#7e22ce',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(126, 34, 206, 0.3)',
                }}
              >
                <Plus size={16} /> Add New Product
              </button>
            </div>

            {/* Inventory Status Bar (Alerts & Filters) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div
                onClick={() => setProductFilter('ALL')}
                style={{
                  background: productFilter === 'ALL' ? '#f5f3ff' : '#ffffff',
                  border: productFilter === 'ALL' ? '2px solid #7e22ce' : '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>ALL PRODUCTS</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{products.length}</div>
              </div>

              <div
                onClick={() => setProductFilter('LOW')}
                style={{
                  background: productFilter === 'LOW' ? '#fffbeb' : '#ffffff',
                  border: productFilter === 'LOW' ? '2px solid #f59e0b' : '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b45309' }}>LOW STOCK WARNING</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#d97706' }}>{lowStockCount} Products</div>
              </div>

              <div
                onClick={() => setProductFilter('OUT')}
                style={{
                  background: productFilter === 'OUT' ? '#fef2f2' : '#ffffff',
                  border: productFilter === 'OUT' ? '2px solid #ef4444' : '1px solid #f1f5f9',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#b91c1c' }}>OUT OF STOCK</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#dc2626' }}>{outOfStockCount} Products</div>
              </div>

              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#047857' }}>EST. INVENTORY VALUE</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>
                  ₹{products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Critical Low Stock Alert Banner */}
            {lowStockCount > 0 && (
              <div
                style={{
                  background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                  border: '1px solid #fde68a',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={20} color="#d97706" />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#92400e' }}>
                      Attention: {lowStockCount} Products are running low or out of stock!
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#b45309' }}>
                      Reorder salon supplies immediately to avoid interruption in treatments.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setProductFilter('LOW')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: '#d97706',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  View Low Stock List
                </button>
              </div>
            )}

            {/* Product Cards Grid with Images */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock === 0;
                const isLowStock = p.stock > 0 && p.stock <= p.minStock;

                return (
                  <div
                    key={p.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      border: isOutOfStock ? '1.5px solid #fca5a5' : isLowStock ? '1.5px solid #fde68a' : '1px solid #f1f5f9',
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    {/* Product Image & Badges */}
                    <div style={{ position: 'relative', height: '170px', background: '#f8fafc' }}>
                      <img
                        src={p.image}
                        alt={p.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          left: 10,
                          background: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(4px)',
                          color: '#ffffff',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {p.category}
                      </span>

                      {/* Stock Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          background: isOutOfStock ? '#ef4444' : isLowStock ? '#f59e0b' : '#22c55e',
                          color: '#ffffff',
                          fontSize: '10.5px',
                          fontWeight: 900,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                        }}
                      >
                        {isOutOfStock ? 'OUT OF STOCK' : isLowStock ? `LOW STOCK (${p.stock})` : `IN STOCK (${p.stock})`}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div style={{ padding: '14px' }}>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{p.brand || 'Golden Beauty'}</div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: '2px 0 8px', lineHeight: 1.3 }}>
                        {p.name}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Price / Client</div>
                          <div style={{ fontSize: '16px', fontWeight: 900, color: '#7e22ce' }}>₹{p.price.toLocaleString('en-IN')}</div>
                        </div>
                        {p.cost > 0 && (
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '11px', color: '#64748b' }}>Purchase Cost</div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b' }}>₹{p.cost}</div>
                          </div>
                        )}
                      </div>

                      {/* Stock Adjuster Toolbar */}
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: '10px',
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '10px',
                        }}
                      >
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                          Available: <strong>{p.stock} {p.unit || 'Units'}</strong>
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => adjustStock(p.id, -1)}
                            disabled={p.stock <= 0}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              fontWeight: 900,
                              cursor: p.stock <= 0 ? 'not-allowed' : 'pointer',
                              color: '#dc2626',
                            }}
                            title="Used 1 in treatment"
                          >
                            -
                          </button>

                          <span style={{ fontSize: '13px', fontWeight: 900, minWidth: '22px', textAlign: 'center' }}>
                            {p.stock}
                          </span>

                          <button
                            onClick={() => adjustStock(p.id, 1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              background: '#ffffff',
                              fontWeight: 900,
                              cursor: 'pointer',
                              color: '#16a34a',
                            }}
                            title="Added 1 to stock"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Card Bottom Actions */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                        <button
                          onClick={() => {
                            setEditingProduct(p);
                            setProdForm({
                              name: p.name,
                              category: p.category,
                              image: p.image,
                              price: p.price,
                              cost: p.cost,
                              stock: p.stock,
                              minStock: p.minStock,
                              brand: p.brand,
                              unit: p.unit || 'Pieces',
                            });
                            setProductModalOpen(true);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#7e22ce',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Edit size={13} /> Edit
                        </button>

                        <button
                          onClick={() => deleteProduct(p.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4: STUDENT CERTIFICATE GENERATOR & ARCHIVE
            ══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'certificates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Header Switcher */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '18px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Golden Beauty Academy - Certificate Generator</span>
                  <span style={{ fontSize: '11.5px', background: '#7e22ce', color: '#fff', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                    Official Accreditation
                  </span>
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Design professional diplomas, generate certificate IDs, print high-resolution copies, and maintain student records.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setCertViewMode('DESIGNER')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: certViewMode === 'DESIGNER' ? '#7e22ce' : '#f1f5f9',
                    color: certViewMode === 'DESIGNER' ? '#ffffff' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Certificate Designer
                </button>
                <button
                  onClick={() => setCertViewMode('ARCHIVE')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: certViewMode === 'ARCHIVE' ? '#7e22ce' : '#f1f5f9',
                    color: certViewMode === 'ARCHIVE' ? '#ffffff' : '#64748b',
                    fontSize: '12.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  Issued History ({certificates.length})
                </button>
              </div>
            </div>

            {certViewMode === 'DESIGNER' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                {/* 1. Certificate Creation Form */}
                <div
                  style={{
                    background: '#ffffff',
                    borderRadius: '18px',
                    padding: '1.5rem',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
                >
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem' }}>
                    Student & Course Details
                  </h3>

                  <form onSubmit={handleIssueCertificate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Student Full Name (As printed on Certificate)
                      </label>
                      <input
                        type="text"
                        required
                        value={certForm.studentName}
                        onChange={(e) => setCertForm({ ...certForm, studentName: e.target.value })}
                        placeholder="e.g. Pooja Sharma"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Course / Specialization Title
                      </label>
                      <select
                        value={certForm.course}
                        onChange={(e) => setCertForm({ ...certForm, course: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      >
                        <option value="Advanced Bridal HD Makeup & Hair Styling Diploma">Advanced Bridal HD Makeup & Hair Styling Diploma</option>
                        <option value="Professional Cosmetology & Skin Esthetics">Professional Cosmetology & Skin Esthetics</option>
                        <option value="Certified Salon Management & Hair Artistry">Certified Salon Management & Hair Artistry</option>
                        <option value="Master Aesthetician & Pre-Bridal Care">Master Aesthetician & Pre-Bridal Care</option>
                        <option value="Nail Extension & Gel Art Professional Course">Nail Extension & Gel Art Professional Course</option>
                      </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Performance / Grade
                        </label>
                        <input
                          type="text"
                          value={certForm.grade}
                          onChange={(e) => setCertForm({ ...certForm, grade: e.target.value })}
                          placeholder="e.g. Grade A+ / Distinction"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Course Duration
                        </label>
                        <input
                          type="text"
                          value={certForm.duration}
                          onChange={(e) => setCertForm({ ...certForm, duration: e.target.value })}
                          placeholder="e.g. 3 Months"
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '13px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Certificate Serial ID
                        </label>
                        <input
                          type="text"
                          value={certForm.certId}
                          onChange={(e) => setCertForm({ ...certForm, certId: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                            background: '#f8fafc',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                          Issue Date
                        </label>
                        <input
                          type="date"
                          value={certForm.issueDate}
                          onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '12px',
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Director / Authorized Signatory
                      </label>
                      <input
                        type="text"
                        value={certForm.instructor}
                        onChange={(e) => setCertForm({ ...certForm, instructor: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    {/* Submit & Action Buttons */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1,
                          padding: '11px',
                          borderRadius: '10px',
                          background: '#7e22ce',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(126, 34, 206, 0.3)',
                        }}
                      >
                        <Award size={16} /> Issue Certificate
                      </button>

                      <button
                        type="button"
                        onClick={printCertificate}
                        style={{
                          padding: '11px 18px',
                          borderRadius: '10px',
                          background: '#ffffff',
                          color: '#0f172a',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '13.5px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Printer size={16} /> Print / PDF
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Live Royal Certificate Canvas Preview */}
                <div
                  id="printable-certificate-area"
                  style={{
                    background: '#fdfbf7',
                    border: '8px double #c084fc',
                    borderRadius: '14px',
                    padding: '2rem 1.75rem',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    textAlign: 'center',
                    position: 'relative',
                    color: '#1e1b4b',
                    overflow: 'hidden',
                  }}
                >
                  {/* Watermark Logo */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      opacity: 0.04,
                      pointerEvents: 'none',
                    }}
                  >
                    <Crown size={280} color="#7e22ce" />
                  </div>

                  {/* Certificate Crown Header */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #facc15 0%, #ca8a04 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 14px rgba(202, 138, 4, 0.4)' }}>
                      <Crown size={28} />
                    </div>
                  </div>

                  <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '1.65rem', fontWeight: 900, color: '#4a044e', letterSpacing: '0.04em' }}>
                    Golden Beauty Parlour
                  </div>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, letterSpacing: '0.2em', color: '#7e22ce', textTransform: 'uppercase', marginBottom: '14px' }}>
                    Academy of Cosmetology & Aesthetics
                  </div>

                  <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: '#b45309', textTransform: 'uppercase', marginBottom: '8px' }}>
                    Certificate of Excellence
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', margin: '0 0 10px' }}>
                    This is proudly presented to certify that
                  </p>

                  {/* Candidate Name in Calligraphy Display */}
                  <div
                    style={{
                      fontFamily: 'Georgia, serif',
                      fontSize: '1.85rem',
                      fontWeight: 900,
                      color: '#1e1b4b',
                      borderBottom: '2px solid #e9d5ff',
                      display: 'inline-block',
                      padding: '0 20px 4px',
                      marginBottom: '10px',
                    }}
                  >
                    {certForm.studentName || 'Student Name'}
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#475569', margin: '0 auto 12px', maxWidth: '420px', lineHeight: 1.5 }}>
                    has successfully demonstrated professional expertise and satisfactorily completed the prescribed course in
                  </p>

                  <div
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 900,
                      color: '#6b21a8',
                      marginBottom: '12px',
                    }}
                  >
                    {certForm.course}
                  </div>

                  <div style={{ display: 'inline-flex', gap: '14px', background: '#faf5ff', border: '1px solid #f3e8ff', padding: '6px 16px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, color: '#581c87', marginBottom: '24px' }}>
                    <span>Grade: {certForm.grade}</span>
                    <span>•</span>
                    <span>Duration: {certForm.duration}</span>
                  </div>

                  {/* Bottom Signatures & Seal */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #f3e8ff', paddingTop: '16px', marginTop: '10px' }}>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Date of Issue: <strong>{certForm.issueDate}</strong></div>
                      <div style={{ fontSize: '10.5px', color: '#64748b' }}>Certificate ID: <strong>{certForm.certId}</strong></div>
                    </div>

                    {/* Gold Verified Seal */}
                    <div
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '2px dashed #ca8a04',
                        background: '#fefce8',
                        color: '#ca8a04',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        lineHeight: 1.1,
                      }}
                    >
                      <Award size={18} />
                      VERIFIED
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: '13.5px', fontWeight: 800, color: '#4a044e' }}>
                        {certForm.instructor.split('-')[0]}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', borderTop: '1px solid #94a3b8', paddingTop: '2px', marginTop: '2px' }}>
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Archive Table View of Issued Certificates */
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #f1f5f9',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Issued Certificates Archive ({certificates.length})
                  </h3>

                  <button
                    onClick={() => setCertViewMode('DESIGNER')}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: '#7e22ce',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    + Issue New Certificate
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px' }}>
                        <th style={{ padding: '10px 8px' }}>Cert ID</th>
                        <th style={{ padding: '10px 8px' }}>Candidate Name</th>
                        <th style={{ padding: '10px 8px' }}>Course Title</th>
                        <th style={{ padding: '10px 8px' }}>Grade</th>
                        <th style={{ padding: '10px 8px' }}>Issue Date</th>
                        <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((cert) => (
                        <tr key={cert.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                          <td style={{ padding: '12px 8px', fontWeight: 800, color: '#7e22ce' }}>{cert.id}</td>
                          <td style={{ padding: '12px 8px', fontWeight: 800, color: '#0f172a' }}>{cert.studentName}</td>
                          <td style={{ padding: '12px 8px', color: '#475569' }}>{cert.course}</td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{ background: '#ecfdf5', color: '#15803d', padding: '2px 8px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 800 }}>
                              {cert.grade}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', color: '#64748b' }}>{cert.issueDate}</td>
                          <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                            <button
                              onClick={() => {
                                setCertForm({
                                  studentName: cert.studentName,
                                  course: cert.course,
                                  certId: cert.id,
                                  issueDate: cert.issueDate,
                                  grade: cert.grade,
                                  duration: cert.duration || '3 Months',
                                  instructor: cert.instructor || 'Rekha Maurya - Director',
                                });
                                setCertViewMode('DESIGNER');
                              }}
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid #cbd5e1',
                                background: '#ffffff',
                                color: '#0f172a',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              View / Reprint
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Add / Edit Product Modal (with Image Upload & Stock) ── */}
      {productModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setProductModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {editingProduct ? 'Edit Salon Product' : 'Add New Salon Product'}
              </h3>
              <button
                onClick={() => setProductModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  placeholder="e.g. O3+ Bridal Glow Facial Kit"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="Skin Care">Skin Care</option>
                    <option value="Hair Care">Hair Care</option>
                    <option value="Bridal Makeup">Bridal Makeup</option>
                    <option value="Waxing & Spa">Waxing & Spa</option>
                    <option value="Nails">Nails</option>
                    <option value="Salon Equipment">Salon Equipment</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Brand / Manufacturer
                  </label>
                  <input
                    type="text"
                    value={prodForm.brand}
                    onChange={(e) => setProdForm({ ...prodForm, brand: e.target.value })}
                    placeholder="e.g. L'Oreal / O3+"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Product Image URL with Live Preview */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Product Image URL (Live Preview below)
                </label>
                <input
                  type="url"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/... or paste image URL"
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />

                {/* Preset image suggestions for quick 1-click photo */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setProdForm({ ...prodForm, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80' })}
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                  >
                    Facial Kit Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdForm({ ...prodForm, image: 'https://images.unsplash.com/photo-1608248597359-59800d388656?auto=format&fit=crop&w=400&q=80' })}
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                  >
                    Hair Serum Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setProdForm({ ...prodForm, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80' })}
                    style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' }}
                  >
                    Makeup Kit Photo
                  </button>
                </div>

                {prodForm.image && (
                  <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <img
                      src={prodForm.image}
                      alt="Preview"
                      style={{ height: '90px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                  </div>
                )}
              </div>

              {/* Price, Cost & Stock Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Sale / Service Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: e.target.value })}
                    placeholder="e.g. 1500"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Purchase Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={prodForm.cost}
                    onChange={(e) => setProdForm({ ...prodForm, cost: e.target.value })}
                    placeholder="e.g. 950"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Current Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: e.target.value })}
                    placeholder="e.g. 12"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Low-Stock Alert Level
                  </label>
                  <input
                    type="number"
                    value={prodForm.minStock}
                    onChange={(e) => setProdForm({ ...prodForm, minStock: e.target.value })}
                    placeholder="e.g. 3"
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#7e22ce',
                    color: '#fff',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {editingProduct ? 'Save Changes' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Quick Action Modals ── */}
      {quickModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setQuickModal(null);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '1.75rem',
              width: '100%',
              maxWidth: '460px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                {quickModal === 'BOOK_APPT' && 'Book Salon Appointment'}
                {quickModal === 'ADD_CUST' && 'Register New Customer'}
                {quickModal === 'ADD_SERV' && 'Add New Beauty Service'}
                {quickModal === 'INVOICE' && 'Generate POS Invoice'}
                {quickModal === 'NOTIF' && 'Broadcast Client Notification'}
              </h3>
              <button
                onClick={() => setQuickModal(null)}
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={(e) => handleModalSubmit(e, 'Salon Action')} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="text" required placeholder="Client Full Name" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              <input type="tel" required placeholder="Mobile Number (WhatsApp)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              <input type="text" placeholder="Service (e.g. Bridal HD Makeup)" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }} />
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setQuickModal(null)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GoldenBeautyAdminDashboard;
