/**
 * @file ParlourProductAssignments.jsx
 * @description Issue Salon Products & Material Allocation strictly for Staff Members in Golden Beauty Parlour.
 * Features:
 *   - 100% Dedicated to Staff Members (Stylists, Beauticians, Makeup Artists, Hair Specialists).
 *   - Live Inventory Stock Sync:
 *       * Product dropdown displays available stock quantity clearly.
 *       * Available Stock Card shows real-time units in inventory with status badges.
 *       * Quantity validation prevents issuing more than available stock.
 *       * Deducts stock upon assignment and restores stock on "Return to Stock".
 *   - Fast, reactive, zero-NaN rendering with full offline resilience.
 * @module frontend/src/modules/admin/components/parlour/ParlourProductAssignments
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RotateCcw,
  Trash2,
  X,
  Users,
  Sparkles,
  AlertCircle,
  Tag,
  Scissors,
  Check,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Box,
} from 'lucide-react';
import { staffFetcher, userFetcher, productFetcher, dashboardFetcher } from '../../../../services/api/admin/adminApi.js';

export function ParlourProductAssignments({ products: externalProducts = [], setProducts: externalSetProducts, showToast }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [issueModalOpen, setIssueModalOpen] = useState(false);

  // Internal fallback products if parent didn't pass or empty
  const [localProducts, setLocalProducts] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_products_inventory');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const products = externalProducts && externalProducts.length > 0 ? externalProducts : localProducts;
  const setProducts = externalSetProducts || setLocalProducts;

  // Background fetch products from MongoDB if missing
  useEffect(() => {
    let isMounted = true;
    const fetchDbProducts = async () => {
      try {
        const res = await productFetcher.list({ limit: 200, category: 'all' }).catch(() => null);
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.items)
          ? res.data.items
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (isMounted && items.length > 0) {
          const normalized = items.map((p) => ({
            id: p._id || p.id,
            _id: p._id || p.id,
            name: p.name,
            category: p.category || 'Skin Care',
            image: p.imageUrl || p.image || 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=400&q=80',
            price: Number(p.sellingPrice || p.price) || 0,
            cost: Number(p.costPrice || p.cost) || 0,
            stock: Number(p.stockQuantity ?? p.currentStock ?? p.stock ?? 0),
            minStock: Number(p.minStockAlert ?? p.minStock ?? 3),
            brand: p.brand || '',
            unit: p.unit || 'Pieces',
          }));
          if (externalSetProducts) {
            externalSetProducts(normalized);
          } else {
            setLocalProducts(normalized);
          }
          localStorage.setItem('parlour_products_inventory', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('DB product sync error:', err);
      }
    };
    fetchDbProducts();
    return () => {
      isMounted = false;
    };
  }, [externalSetProducts]);

  // Staff Roster loaded directly from DB (TenantUser where targetBusiness === 'PARLOUR' and role === 'STAFF' + Staff Collection)
  const [staffList, setStaffList] = useState(() => {
    try {
      const cached = localStorage.getItem('parlour_db_staff_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [];
  });
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadStaffRoster = async () => {
      setIsLoadingStaff(true);
      try {
        const [staffRes, userRes] = await Promise.all([
          staffFetcher.list({ limit: 200, targetBusiness: 'PARLOUR' }).catch(() => ({ data: [] })),
          userFetcher.list({ limit: 200, targetBusiness: 'PARLOUR' }).catch(() => ({ data: [] })),
        ]);

        const rawStaff = Array.isArray(staffRes?.data?.data)
          ? staffRes.data.data
          : Array.isArray(staffRes?.data?.items)
          ? staffRes.data.items
          : Array.isArray(staffRes?.data)
          ? staffRes.data
          : [];

        const rawUsers = Array.isArray(userRes?.data?.data)
          ? userRes.data.data
          : Array.isArray(userRes?.data?.items)
          ? userRes.data.items
          : Array.isArray(userRes?.data)
          ? userRes.data
          : [];

        // 1. Filter Users from TenantUser table who belong strictly to PARLOUR and have role STAFF
        // Excludes EVENTS, PLOTTING, RENT, SOFTWARE staff, and excludes Customers/Students/Admins!
        const staffFromUsers = rawUsers
          .filter((u) => {
            const role = (u.role || u.userType || '').toUpperCase();
            const business = (u.targetBusiness || '').toUpperCase();

            // Strictly exclude Customers, Students, and Super Admin
            if (role === 'CUSTOMER' || role === 'STUDENT' || role === 'SUPER_ADMIN') return false;

            // Strictly exclude other verticals (EVENTS, PLOTTING, RENT, SOFTWARE)
            if (business && business !== 'PARLOUR' && business !== 'ALL') return false;

            // Must have staff role or userType STAFF
            const isStaffRole =
              role === 'STAFF' ||
              u.userType === 'STAFF' ||
              role.includes('STYLIST') ||
              role.includes('BEAUTICIAN') ||
              role.includes('THERAPIST') ||
              role.includes('COLORIST') ||
              role.includes('ARTIST');

            return isStaffRole;
          })
          .map((u) => ({
            _id: u._id || u.id,
            id: u._id || u.id,
            name: u.name || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
            designation: u.designation || u.customRoleId?.name || (u.role === 'STAFF' ? 'Parlour Stylist' : u.role) || 'Parlour Stylist',
            phone: u.phone || '',
            role: 'STAFF',
            userType: 'STAFF',
            targetBusiness: 'PARLOUR',
            source: 'users_table',
          }));

        // 2. Staff profiles from Staff collection (Only Parlour staff)
        const staffFromProfiles = rawStaff
          .filter((s) => {
            const business = (s.businessVertical || s.department || '').toUpperCase();
            if (business && business !== 'PARLOUR' && business !== 'ALL') return false;
            return true;
          })
          .map((s) => ({
            _id: s._id || s.id,
            id: s._id || s.id,
            name: s.name || `${s.firstName || ''} ${s.lastName || ''}`.trim(),
            designation: s.designation || s.specialization || s.role || 'Senior Stylist',
            phone: s.phone || '',
            role: 'STAFF',
            source: 'staff_collection',
          }));

        // 3. Deduplicate by lowercased name & valid name
        const combined = [...staffFromUsers, ...staffFromProfiles].filter((s) => s.name && s.name.trim().length > 1);
        const uniqueStaff = [];
        const seenNames = new Set();
        for (const stf of combined) {
          const norm = stf.name.toLowerCase().trim();
          if (!seenNames.has(norm)) {
            seenNames.add(norm);
            uniqueStaff.push(stf);
          }
        }

        if (isMounted && uniqueStaff.length > 0) {
          setStaffList(uniqueStaff);
          localStorage.setItem('parlour_db_staff_cache', JSON.stringify(uniqueStaff));
        }
      } catch (e) {
        console.warn('Error loading DB staff roster:', e);
      } finally {
        if (isMounted) setIsLoadingStaff(false);
      }
    };
    loadStaffRoster();
    window.addEventListener('parlour_staff_updated', loadStaffRoster);
    return () => {
      isMounted = false;
      window.removeEventListener('parlour_staff_updated', loadStaffRoster);
    };
  }, []);

  // ════════════════════════════════════════════════════════════════════════════
  // 1. ISSUED PRODUCTS STATE (DIRECT FROM MONGODB DATABASE - ZERO HARDCODING)
  // ════════════════════════════════════════════════════════════════════════════
  const [assignments, setAssignments] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_product_assignments');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Purge legacy hardcoded mock items (ASG-101, ASG-102, ASG-103, ASG-104)
          const clean = parsed.filter((item) => !['ASG-101', 'ASG-102', 'ASG-103', 'ASG-104'].includes(item.id));
          localStorage.setItem('parlour_product_assignments', JSON.stringify(clean));
          return clean;
        }
      }
    } catch {}
    return [];
  });

  // Background DB sync for product assignments from MongoDB
  useEffect(() => {
    let isMounted = true;
    const loadDbAssignments = async () => {
      try {
        const res = await dashboardFetcher.getAssignedProducts({});
        const items = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data?.items)
          ? res.data.items
          : Array.isArray(res?.data)
          ? res.data
          : [];
        if (isMounted) {
          const normalized = items.map((a) => ({
            id: a._id || a.id,
            _id: a._id || a.id,
            recipientType: 'STAFF',
            recipientName: a.staffName,
            recipientRole: a.staffRole || 'Parlour Stylist',
            productId: a.productId,
            productName: a.productName,
            qty: Number(a.qty) || 1,
            date: a.date,
            purpose: a.purpose,
            status: a.status,
            notes: a.notes || '',
          }));
          setAssignments(normalized);
          localStorage.setItem('parlour_product_assignments', JSON.stringify(normalized));
        }
      } catch (err) {
        console.warn('Could not load DB product assignments:', err?.message);
      }
    };
    loadDbAssignments();
    return () => {
      isMounted = false;
    };
  }, []);

  // Issue Product Form State (Staff Only)
  const [issueForm, setIssueForm] = useState({
    staffId: '',
    staffName: '',
    staffRole: '',
    productId: '',
    qty: 1,
    purpose: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Derived Selected Product Object
  const selectedProduct = useMemo(() => {
    if (!issueForm.productId) return null;
    return products.find((p) => p.id === issueForm.productId || p._id === issueForm.productId) || null;
  }, [products, issueForm.productId]);

  // Handle Quantity Change with Safe Bounds
  const handleQtyChange = (newQty) => {
    const maxStock = selectedProduct ? Math.max(0, Number(selectedProduct.stock) || 0) : 999;
    const clamped = Math.max(1, Math.min(maxStock, Number(newQty) || 1));
    setIssueForm((prev) => ({ ...prev, qty: clamped }));
  };

  // Handle Issue Product Submit (Staff Only)
  const handleIssueProductSubmit = (e) => {
    e.preventDefault();
    if (!issueForm.staffName || !issueForm.productId) {
      if (showToast) showToast('Please select staff member and product.');
      return;
    }

    if (!selectedProduct) {
      if (showToast) showToast('Selected product not found in inventory.');
      return;
    }

    const availableStock = Math.max(0, Number(selectedProduct.stock) || 0);
    const reqQty = Math.max(1, Number(issueForm.qty) || 1);

    if (availableStock < reqQty) {
      if (showToast) showToast(`Insufficient stock! Available stock for ${selectedProduct.name} is only ${availableStock}.`);
      return;
    }

    // Deduct stock from Inventory (Optimistic 0ms UI update)
    const remainingStock = Math.max(0, availableStock - reqQty);
    if (setProducts) {
      const updatedProds = products.map((p) => {
        if (p.id === selectedProduct.id || p._id === selectedProduct._id) {
          return { ...p, stock: remainingStock };
        }
        return p;
      });
      setProducts(updatedProds);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProds));
    }

    // Persist stock deduction to MongoDB in background
    const prodDbId = selectedProduct._id || selectedProduct.id;
    if (prodDbId) {
      productFetcher.update(prodDbId, { stockQuantity: remainingStock }).catch((err) => {
        console.warn('Background stock deduction to DB error:', err);
      });
    }

    const tempId = 'ASG-' + Date.now().toString().slice(-4);
    const newRecord = {
      id: tempId,
      recipientType: 'STAFF',
      recipientName: issueForm.staffName,
      recipientRole: issueForm.staffRole || 'Parlour Stylist',
      productId: selectedProduct.id || selectedProduct._id,
      productName: selectedProduct.name,
      qty: reqQty,
      date: issueForm.date || new Date().toISOString().split('T')[0],
      purpose: issueForm.purpose.trim() || 'Salon Client Service / Styling Station',
      status: 'ACTIVE',
      notes: issueForm.notes.trim(),
    };

    const updatedAssignments = [newRecord, ...assignments];
    setAssignments(updatedAssignments);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updatedAssignments));

    // Save directly to MongoDB database!
    dashboardFetcher.assignProduct({
      staffId: issueForm.staffId,
      staffName: issueForm.staffName,
      staffRole: issueForm.staffRole || 'Parlour Stylist',
      productId: selectedProduct._id || selectedProduct.id,
      productName: selectedProduct.name,
      qty: reqQty,
      date: issueForm.date || new Date().toISOString().split('T')[0],
      purpose: issueForm.purpose.trim() || 'Salon Client Service / Styling Station',
      notes: issueForm.notes.trim(),
    }).then((res) => {
      const created = res?.data;
      if (created?._id) {
        setAssignments((prev) => {
          const next = prev.map((a) => (a.id === tempId ? { ...a, id: created._id, _id: created._id } : a));
          localStorage.setItem('parlour_product_assignments', JSON.stringify(next));
          return next;
        });
      }
    }).catch((err) => {
      console.warn('Background assignment save to DB error:', err);
    });

    if (showToast) {
      showToast(`✓ Assigned ${reqQty}x "${selectedProduct.name}" to ${issueForm.staffName}! Stock deducted (${remainingStock} units left in inventory).`);
    }

    setIssueModalOpen(false);
    setIssueForm({
      staffId: '',
      staffName: '',
      staffRole: '',
      productId: '',
      qty: 1,
      purpose: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Mark Product Returned or Consumed
  const handleUpdateStatus = (id, newStatus) => {
    const item = assignments.find((a) => a.id === id || a._id === id);
    if (!item) return;

    // If returning, restore stock back to inventory
    if (newStatus === 'RETURNED' && item.status !== 'RETURNED') {
      const restoredQty = Number(item.qty) || 1;
      let nextStock = 0;
      if (setProducts) {
        const updatedProds = products.map((p) => {
          if (p.id === item.productId || p._id === item.productId) {
            nextStock = (Number(p.stock) || 0) + restoredQty;
            return { ...p, stock: nextStock };
          }
          return p;
        });
        setProducts(updatedProds);
        localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProds));
      }

      // Persist stock restore to MongoDB in background
      if (item.productId) {
        productFetcher.update(item.productId, { stockQuantity: nextStock }).catch((err) => {
          console.warn('Background stock restore to DB error:', err);
        });
      }

      if (showToast) showToast(`✓ Restored ${item.qty}x "${item.productName}" back to salon inventory stock!`);
    } else if (newStatus === 'CONSUMED') {
      if (showToast) showToast(`Marked ${item.qty}x "${item.productName}" as consumed by ${item.recipientName}.`);
    }

    const updated = assignments.map((a) => (a.id === id || a._id === id ? { ...a, status: newStatus } : a));
    setAssignments(updated);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updated));

    // Persist status change to MongoDB in background
    const targetId = item._id || item.id || id;
    dashboardFetcher.updateAssignmentStatus(targetId, { status: newStatus }).catch((err) => {
      console.warn('Background assignment status update error:', err);
    });
  };

  // Delete Assignment Record Permanently from DB
  const handleDeleteAssignment = (id) => {
    if (!window.confirm('Delete this staff product assignment record permanently from database?')) return;
    const target = assignments.find((a) => a.id === id || a._id === id);
    const updated = assignments.filter((a) => a.id !== id && a._id !== id);
    setAssignments(updated);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updated));

    // Delete permanently from MongoDB database
    const targetId = target?._id || target?.id || id;
    dashboardFetcher.deleteAssignment(targetId).catch((err) => {
      console.warn('Background assignment deletion from DB error:', err);
    });

    if (showToast) showToast('Record removed permanently from Database.');
  };

  // Filtered Issued Products (All displayed together, keyword search enabled)
  const filteredAssignments = useMemo(() => {
    if (!searchTerm.trim()) return assignments;
    const q = searchTerm.toLowerCase();
    return assignments.filter((item) => {
      return (
        (item.recipientName || '').toLowerCase().includes(q) ||
        (item.productName || '').toLowerCase().includes(q) ||
        (item.purpose || '').toLowerCase().includes(q) ||
        (item.recipientRole || '').toLowerCase().includes(q) ||
        (item.status || '').toLowerCase().includes(q)
      );
    });
  }, [assignments, searchTerm]);

  // Overall KPI Statistics
  const stats = useMemo(() => {
    const total = assignments.length;
    const active = assignments.filter((a) => a.status === 'ACTIVE');
    const returned = assignments.filter((a) => a.status === 'RETURNED');
    const consumed = assignments.filter((a) => a.status === 'CONSUMED');

    const totalUnitsIssued = active.reduce((sum, a) => sum + (Number(a.qty) || 0), 0);
    const uniqueStaff = new Set(active.map((a) => a.recipientName)).size;

    return {
      total,
      activeCount: active.length,
      returnedCount: returned.length,
      consumedCount: consumed.length,
      totalUnitsIssued,
      uniqueStaff,
    };
  }, [assignments]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Top Header & Action ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🧴</span>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Staff Product & Material Allocation
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                border: '1px solid rgba(236, 72, 153, 0.3)',
              }}
            >
              Staff Only · Live Stock Sync
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Assign creams, styling kits, powders, hair colors & serums strictly to salon staff members with automatic inventory stock management.
          </p>
        </div>

        <button
          onClick={() => {
            setIssueForm({
              staffId: staffList[0]?._id || '',
              staffName: staffList[0]?.name || '',
              staffRole: staffList[0]?.designation || 'Senior Stylist',
              productId: products[0]?.id || products[0]?._id || '',
              qty: 1,
              purpose: '',
              notes: '',
              date: new Date().toISOString().split('T')[0],
            });
            setIssueModalOpen(true);
          }}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
            borderColor: 'transparent',
            fontWeight: 800,
            padding: '10px 18px',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.35)',
          }}
        >
          <Plus size={16} /> + Assign Product to Staff
        </button>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.15rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Active Floor Allocations</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ec4899', marginTop: 4 }}>
            {stats.activeCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Currently in use across salon stations
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.15rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Total Units Issued</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(56, 189, 248, 0.15)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', marginTop: 4 }}>
            {stats.totalUnitsIssued} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>units</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Total product volume on active stations
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.15rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Staff Members with Products</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#a855f7', marginTop: 4 }}>
            {stats.uniqueStaff}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Active stylists currently holding materials
          </div>
        </div>

        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: '14px',
            padding: '1.15rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700 }}>Restored to Stock</span>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RotateCcw size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: 4 }}>
            {stats.returnedCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: 2 }}>
            Items safely returned & stock restocked
          </div>
        </div>
      </div>

      {/* ── Toolbar with Search Bar & Unified Roster Counter ── */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '18px' }}>📋</span>
            <strong style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-primary)' }}>
              Assigned Products Roster
            </strong>
          </div>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: 800,
              background: 'rgba(236, 72, 153, 0.12)',
              color: '#ec4899',
              border: '1px solid rgba(236, 72, 153, 0.25)',
            }}
          >
            {filteredAssignments.length} Items Listed
          </span>
        </div>

        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search staff stylist, product, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 34px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-card, transparent)',
              color: 'var(--text-primary)',
              fontSize: '12.5px',
            }}
          />
        </div>
      </div>

      {/* ── Staff Product Assignments Table ── */}
      <div
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(0,0,0,0.03)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px' }}>#</th>
                <th style={{ padding: '12px 16px' }}>Staff Stylist</th>
                <th style={{ padding: '12px 16px' }}>Assigned Product & Quantity</th>
                <th style={{ padding: '12px 16px' }}>Station / Purpose</th>
                <th style={{ padding: '12px 16px' }}>Issue Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '32px' }}>🧴</span>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>No staff product assignments found</strong>
                      <span style={{ fontSize: '12px' }}>Click "+ Assign Product to Staff" to allocate salon creams, kits and materials to your team.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((row, idx) => {
                  const isActive = row.status === 'ACTIVE';
                  const isReturned = row.status === 'RETURNED';
                  const isConsumed = row.status === 'CONSUMED';

                  return (
                    <tr
                      key={row.id || idx}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background 0.15s ease',
                      }}
                    >
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 700 }}>
                        {idx + 1}
                      </td>

                      {/* Staff Member */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '13px',
                              flexShrink: 0,
                            }}
                          >
                            {(row.recipientName || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                              {row.recipientName}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              ✂️ {row.recipientRole || 'Staff Stylist'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Product & Qty */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                          {row.productName}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '1px 7px',
                              borderRadius: '6px',
                              background: 'rgba(236, 72, 153, 0.12)',
                              color: '#ec4899',
                              border: '1px solid rgba(236, 72, 153, 0.25)',
                            }}
                          >
                            📦 Qty: {row.qty} {row.qty > 1 ? 'Units' : 'Unit'}
                          </span>
                        </div>
                      </td>

                      {/* Purpose */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {row.purpose || 'Salon Client Service'}
                        </div>
                        {row.notes && (
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {row.notes}
                          </div>
                        )}
                      </td>

                      {/* Issue Date */}
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '12px' }}>
                        📅 {row.date}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '20px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: isActive
                              ? 'rgba(245, 158, 11, 0.15)'
                              : isReturned
                              ? 'rgba(16, 185, 129, 0.15)'
                              : 'rgba(148, 163, 184, 0.15)',
                            color: isActive ? '#f59e0b' : isReturned ? '#10b981' : '#64748b',
                            border: `1px solid ${
                              isActive
                                ? 'rgba(245, 158, 11, 0.3)'
                                : isReturned
                                ? 'rgba(16, 185, 129, 0.3)'
                                : 'rgba(148, 163, 184, 0.3)'
                            }`,
                          }}
                        >
                          <span>{isActive ? '🟡' : isReturned ? '🟢' : '⚪'}</span>
                          <span>{isActive ? 'ACTIVE (In Station)' : isReturned ? 'RESTOCKED' : 'CONSUMED'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {isActive && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(row._id || row.id, 'RETURNED')}
                                className="btn btn-secondary btn-sm"
                                title="Return remaining product to salon stock (restores inventory count)"
                                style={{
                                  fontSize: '11px',
                                  padding: '4px 9px',
                                  color: '#10b981',
                                  borderColor: 'rgba(16, 185, 129, 0.35)',
                                  background: 'rgba(16, 185, 129, 0.08)',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <RotateCcw size={12} /> Return to Stock
                              </button>

                              <button
                                onClick={() => handleUpdateStatus(row._id || row.id, 'CONSUMED')}
                                className="btn btn-secondary btn-sm"
                                title="Mark as consumed during client makeover"
                                style={{
                                  fontSize: '11px',
                                  padding: '4px 9px',
                                  color: '#a855f7',
                                  borderColor: 'rgba(168, 85, 247, 0.35)',
                                  background: 'rgba(168, 85, 247, 0.08)',
                                  fontWeight: 700,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <Check size={12} /> Consumed
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => handleDeleteAssignment(row._id || row.id)}
                            className="btn btn-secondary btn-sm"
                            title="Delete assignment record"
                            style={{
                              padding: '4px 7px',
                              color: '#ef4444',
                              borderColor: 'rgba(239, 68, 68, 0.3)',
                              background: 'rgba(239, 68, 68, 0.08)',
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MODAL: ASSIGN PRODUCT TO STAFF (WITH LIVE STOCK VISIBILITY)
          ══════════════════════════════════════════════════════════════ */}
      {issueModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1300,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              background: 'var(--bg-surface, #1e293b)',
              border: '1px solid var(--border-color, rgba(255, 255, 255, 0.12))',
              borderRadius: '18px',
              padding: '1.5rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.2rem',
              color: 'var(--text-primary, #f8fafc)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(236, 72, 153, 0.15)',
                    color: '#ec4899',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Package size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0, color: 'var(--text-primary, #f8fafc)' }}>
                    Assign Product to Staff
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted, #94a3b8)', margin: '2px 0 0 0' }}>
                    Select staff member & product with available stock verification
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted, #94a3b8)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleIssueProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* 1. Select Parlour Staff Member (Exclusively from DB) */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #cbd5e1)', marginBottom: '5px' }}>
                  Select Parlour Staff Member (Stylist / Beautician) <span style={{ color: '#ec4899' }}>*</span>
                </label>
                <select
                  value={issueForm.staffName}
                  onChange={(e) => {
                    const stf = staffList.find((s) => s.name === e.target.value);
                    setIssueForm((prev) => ({
                      ...prev,
                      staffId: stf?._id || stf?.id || '',
                      staffName: e.target.value,
                      staffRole: stf?.designation || 'Parlour Stylist',
                    }));
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-card, #0f172a)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <option value="">-- Choose Parlour Staff Member (From Database) --</option>
                  {staffList.map((s) => {
                    const label = s.name.includes('(') ? s.name : `${s.name} (${s.designation || 'Parlour Staff'})`;
                    return (
                      <option key={s._id || s.id} value={s.name}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 2. Select Salon Product */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #cbd5e1)', marginBottom: '5px' }}>
                  Select Salon Product (From Inventory) <span style={{ color: '#ec4899' }}>*</span>
                </label>
                <select
                  value={issueForm.productId}
                  onChange={(e) => {
                    const prodId = e.target.value;
                    const prod = products.find((p) => p.id === prodId || p._id === prodId);
                    setIssueForm((prev) => ({
                      ...prev,
                      productId: prodId,
                      qty: 1,
                    }));
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'var(--bg-card, #0f172a)',
                    border: '1px solid rgba(236, 72, 153, 0.4)',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: '13px',
                    fontWeight: 700,
                  }}
                >
                  <option value="">-- Select Product From Inventory --</option>
                  {products.map((p) => {
                    const currentStock = Math.max(0, Number(p.stock) || 0);
                    return (
                      <option key={p.id || p._id} value={p.id || p._id} disabled={currentStock <= 0}>
                        {p.name} · Available Stock: {currentStock} units · ₹{(Number(p.price) || 0).toLocaleString('en-IN')} {currentStock <= 0 ? '(Out of Stock)' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* 3. Real-Time Available Stock Status Card */}
              {selectedProduct && (() => {
                const available = Math.max(0, Number(selectedProduct.stock) || 0);
                const reqQty = Number(issueForm.qty) || 1;
                const isOutOfStock = available <= 0;
                const isOverStock = reqQty > available;
                const remainingAfter = Math.max(0, available - reqQty);

                return (
                  <div
                    style={{
                      borderRadius: '12px',
                      padding: '12px 14px',
                      background: isOutOfStock
                        ? 'rgba(239, 68, 68, 0.1)'
                        : isOverStock
                        ? 'rgba(245, 158, 11, 0.1)'
                        : 'rgba(16, 185, 129, 0.08)',
                      border: `1px solid ${
                        isOutOfStock
                          ? 'rgba(239, 68, 68, 0.35)'
                          : isOverStock
                          ? 'rgba(245, 158, 11, 0.35)'
                          : 'rgba(16, 185, 129, 0.3)'
                      }`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px' }}>🧴</span>
                        <div>
                          <strong style={{ fontSize: '13px', color: 'var(--text-primary, #f8fafc)' }}>
                            {selectedProduct.name}
                          </strong>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted, #94a3b8)' }}>
                            Category: {selectedProduct.category || 'Salon Supplies'} · Price: ₹{(Number(selectedProduct.price) || 0).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: isOutOfStock
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(16, 185, 129, 0.2)',
                          color: isOutOfStock ? '#ef4444' : '#10b981',
                          border: `1px solid ${isOutOfStock ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`,
                        }}
                      >
                        {isOutOfStock ? '🔴 Out of Stock' : `🟢 In Stock: ${available} Units`}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', fontWeight: 700, paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <span style={{ color: 'var(--text-muted, #cbd5e1)' }}>
                        Quantity to Allocate: <strong style={{ color: '#ec4899' }}>{reqQty}</strong>
                      </span>
                      <span style={{ color: isOverStock ? '#ef4444' : '#10b981' }}>
                        {isOverStock
                          ? `⚠️ Exceeds Available Stock (${available} max)`
                          : `Inventory Remaining After: ${remainingAfter} units`}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* 4. Quantity Stepper with Stock Limit */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #cbd5e1)', marginBottom: '5px' }}>
                  Quantity to Issue <span style={{ color: '#ec4899' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    type="button"
                    disabled={!selectedProduct || issueForm.qty <= 1}
                    onClick={() => handleQtyChange(issueForm.qty - 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: 'var(--bg-card, #0f172a)',
                      border: '1px solid var(--border-color, #334155)',
                      color: 'var(--text-primary, #f8fafc)',
                      fontSize: '18px',
                      fontWeight: 800,
                      cursor: issueForm.qty <= 1 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={selectedProduct ? Math.max(1, Number(selectedProduct.stock) || 1) : 999}
                    value={issueForm.qty}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    required
                    style={{
                      flex: 1,
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card, #0f172a)',
                      border: '1px solid var(--border-color, #334155)',
                      color: 'var(--text-primary, #f8fafc)',
                      fontSize: '14px',
                      fontWeight: 800,
                      textAlign: 'center',
                    }}
                  />

                  <button
                    type="button"
                    disabled={!selectedProduct || issueForm.qty >= (Number(selectedProduct.stock) || 1)}
                    onClick={() => handleQtyChange(issueForm.qty + 1)}
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      background: 'var(--bg-card, #0f172a)',
                      border: '1px solid var(--border-color, #334155)',
                      color: 'var(--text-primary, #f8fafc)',
                      fontSize: '18px',
                      fontWeight: 800,
                      cursor: issueForm.qty >= (Number(selectedProduct?.stock) || 1) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    +
                  </button>

                  {selectedProduct && selectedProduct.stock > 1 && (
                    <button
                      type="button"
                      onClick={() => handleQtyChange(selectedProduct.stock)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'rgba(56, 189, 248, 0.15)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#0284c7',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Max ({selectedProduct.stock})
                    </button>
                  )}
                </div>
              </div>

              {/* 5. Purpose & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #cbd5e1)', marginBottom: '5px' }}>
                    Salon Station / Purpose
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. VIP Bridal Station #1"
                    value={issueForm.purpose}
                    onChange={(e) => setIssueForm((prev) => ({ ...prev, purpose: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card, #0f172a)',
                      border: '1px solid var(--border-color, #334155)',
                      color: 'var(--text-primary, #f8fafc)',
                      fontSize: '13px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #cbd5e1)', marginBottom: '5px' }}>
                    Allocation Date
                  </label>
                  <input
                    type="date"
                    value={issueForm.date}
                    onChange={(e) => setIssueForm((prev) => ({ ...prev, date: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      background: 'var(--bg-card, #0f172a)',
                      border: '1px solid var(--border-color, #334155)',
                      color: 'var(--text-primary, #f8fafc)',
                      fontSize: '13px',
                    }}
                  />
                </div>
              </div>

              {/* 6. Notes */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: 'var(--text-primary, #cbd5e1)', marginBottom: '5px' }}>
                  Allocation Remarks / Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pre-booked client service kit allocation"
                  value={issueForm.notes}
                  onChange={(e) => setIssueForm((prev) => ({ ...prev, notes: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-card, #0f172a)',
                    border: '1px solid var(--border-color, #334155)',
                    color: 'var(--text-primary, #f8fafc)',
                    fontSize: '13px',
                  }}
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))', paddingTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: '1px solid var(--border-color, #475569)',
                    color: 'var(--text-muted, #cbd5e1)',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!selectedProduct || selectedProduct.stock < (issueForm.qty || 1)}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    background:
                      !selectedProduct || selectedProduct.stock < (issueForm.qty || 1)
                        ? 'rgba(148, 163, 184, 0.3)'
                        : 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor:
                      !selectedProduct || selectedProduct.stock < (issueForm.qty || 1)
                        ? 'not-allowed'
                        : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                  }}
                >
                  <Check size={15} /> Confirm & Assign to Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParlourProductAssignments;
