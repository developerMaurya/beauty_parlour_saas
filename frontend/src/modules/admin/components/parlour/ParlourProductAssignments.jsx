/**
 * @file ParlourProductAssignments.jsx
 * @description Product & Kit Assignment System for Salon Staff and Academy Students.
 * Features:
 *   - Issues products/styling kits to Staff (Stylists) & Students (Trainees)
 *   - Automatically deducts assigned quantity from Inventory stock
 *   - Restores stock back to inventory upon Return or Revocation
 *   - Full status tracking (Active / Returned) with condition notes
 * @module frontend/src/modules/admin/components/parlour/ParlourProductAssignments
 */

import React, { useState } from 'react';
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
  GraduationCap,
  Sparkles,
  AlertCircle,
  Tag,
} from 'lucide-react';

export default function ParlourProductAssignments({ products = [], setProducts, showToast }) {
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'STAFF' | 'STUDENT' | 'ACTIVE' | 'RETURNED'
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Assignments State
  const [assignments, setAssignments] = useState(() => {
    try {
      const stored = localStorage.getItem('parlour_product_assignments');
      if (stored) return JSON.parse(stored);

      const seed = [
        {
          id: 'ASG-101',
          recipientType: 'STAFF',
          recipientName: 'Suman Sharma',
          recipientRole: 'Senior Bridal Stylist',
          productId: 'PROD-01',
          productName: 'O3+ Bridal Glow Facial Kit',
          qty: 1,
          date: '2026-11-12',
          purpose: 'VIP Bridal Station Makeover',
          status: 'ACTIVE', // 'ACTIVE' | 'RETURNED'
          notes: 'Issued for Mrs. Gupta wedding booking',
        },
        {
          id: 'ASG-102',
          recipientType: 'STUDENT',
          recipientName: 'Neha Verma',
          recipientRole: 'Master Diploma Batch A',
          productId: 'PROD-03',
          productName: 'Kryolan HD Micro Foundation Palette (18 Shades)',
          qty: 1,
          date: '2026-11-10',
          purpose: 'Academy Practical Exam Training',
          status: 'ACTIVE',
          notes: 'Student Kit Allocation',
        },
        {
          id: 'ASG-103',
          recipientType: 'STAFF',
          recipientName: 'Priya Patel',
          recipientRole: 'Cosmetologist',
          productId: 'PROD-04',
          productName: 'Streax Canvoline Hair Straightening & Neutralizer Kit',
          qty: 2,
          date: '2026-11-08',
          purpose: 'Hair Chemical Smoothening Booth',
          status: 'RETURNED',
          notes: 'Empty containers returned for recycling',
        },
      ];
      localStorage.setItem('parlour_product_assignments', JSON.stringify(seed));
      return seed;
    } catch {
      return [];
    }
  });

  // Assign Form State
  const [assignForm, setAssignForm] = useState({
    recipientType: 'STAFF', // 'STAFF' | 'STUDENT'
    recipientName: '',
    recipientRole: '',
    productId: '',
    qty: 1,
    purpose: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
  });

  const selectedProduct = products.find((p) => p.id === assignForm.productId || p.name === assignForm.productId);

  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!assignForm.recipientName.trim() || !assignForm.productId) {
      alert('Please fill recipient name and select a product.');
      return;
    }

    const prodToAssign = selectedProduct;
    if (!prodToAssign) {
      alert('Please select a valid inventory product.');
      return;
    }

    const assignQty = Math.max(1, parseInt(assignForm.qty) || 1);
    if (prodToAssign.stock < assignQty) {
      alert(`Insufficient stock! Available in stock: ${prodToAssign.stock}. You requested: ${assignQty}`);
      return;
    }

    // 1. Decrement Stock from Live Inventory
    if (setProducts && Array.isArray(products)) {
      const updatedProducts = products.map((p) => {
        if (p.id === prodToAssign.id) {
          return { ...p, stock: Math.max(0, p.stock - assignQty) };
        }
        return p;
      });
      setProducts(updatedProducts);
      localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProducts));
    }

    // 2. Create Assignment Record
    const newAsg = {
      id: `ASG-${Date.now().toString().slice(-4)}`,
      recipientType: assignForm.recipientType,
      recipientName: assignForm.recipientName.trim(),
      recipientRole: assignForm.recipientRole.trim() || (assignForm.recipientType === 'STAFF' ? 'Salon Staff' : 'Academy Trainee'),
      productId: prodToAssign.id,
      productName: prodToAssign.name,
      qty: assignQty,
      date: assignForm.date,
      purpose: assignForm.purpose || (assignForm.recipientType === 'STAFF' ? 'In-Salon Service Usage' : 'Student Practical Kit'),
      status: 'ACTIVE',
      notes: assignForm.notes,
    };

    const updatedAsg = [newAsg, ...assignments];
    setAssignments(updatedAsg);
    localStorage.setItem('parlour_product_assignments', JSON.stringify(updatedAsg));

    showToast?.(`Assigned ${assignQty}x ${prodToAssign.name} to ${newAsg.recipientName}. Stock updated!`);
    setModalOpen(false);

    // Reset Form
    setAssignForm({
      recipientType: 'STAFF',
      recipientName: '',
      recipientRole: '',
      productId: '',
      qty: 1,
      purpose: '',
      notes: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  // Mark product returned (Restores stock!)
  const handleMarkReturned = (asg) => {
    if (asg.status === 'RETURNED') return;

    if (window.confirm(`Mark ${asg.qty}x ${asg.productName} as returned by ${asg.recipientName}? This will restore ${asg.qty} item(s) back into inventory stock.`)) {
      // 1. Restore Stock in Inventory
      if (setProducts && Array.isArray(products)) {
        const updatedProducts = products.map((p) => {
          if (p.id === asg.productId || p.name.toLowerCase() === asg.productName.toLowerCase()) {
            return { ...p, stock: (p.stock || 0) + Number(asg.qty) };
          }
          return p;
        });
        setProducts(updatedProducts);
        localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProducts));
      }

      // 2. Update Status to RETURNED
      const updatedAsg = assignments.map((a) => {
        if (a.id === asg.id) {
          return { ...a, status: 'RETURNED' };
        }
        return a;
      });
      setAssignments(updatedAsg);
      localStorage.setItem('parlour_product_assignments', JSON.stringify(updatedAsg));
      showToast?.(`${asg.productName} returned. ${asg.qty} item(s) restored back into stock!`);
    }
  };

  // Delete Assignment (Restores stock if was active)
  const handleDeleteAssignment = (asg) => {
    if (window.confirm(`Delete assignment record ${asg.id}?`)) {
      if (asg.status === 'ACTIVE' && setProducts && Array.isArray(products)) {
        // Restore stock
        const updatedProducts = products.map((p) => {
          if (p.id === asg.productId || p.name.toLowerCase() === asg.productName.toLowerCase()) {
            return { ...p, stock: (p.stock || 0) + Number(asg.qty) };
          }
          return p;
        });
        setProducts(updatedProducts);
        localStorage.setItem('parlour_products_inventory', JSON.stringify(updatedProducts));
      }

      const filtered = assignments.filter((a) => a.id !== asg.id);
      setAssignments(filtered);
      localStorage.setItem('parlour_product_assignments', JSON.stringify(filtered));
      showToast?.(`Assignment ${asg.id} removed.`);
    }
  };

  // Filtered List
  const filteredAssignments = assignments.filter((a) => {
    if (filterType === 'STAFF' && a.recipientType !== 'STAFF') return false;
    if (filterType === 'STUDENT' && a.recipientType !== 'STUDENT') return false;
    if (filterType === 'ACTIVE' && a.status !== 'ACTIVE') return false;
    if (filterType === 'RETURNED' && a.status !== 'RETURNED') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        a.recipientName.toLowerCase().includes(q) ||
        a.productName.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q) ||
        a.purpose?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeStaffCount = assignments.filter((a) => a.recipientType === 'STAFF' && a.status === 'ACTIVE').length;
  const activeStudentCount = assignments.filter((a) => a.recipientType === 'STUDENT' && a.status === 'ACTIVE').length;
  const totalActiveQty = assignments.filter((a) => a.status === 'ACTIVE').reduce((acc, a) => acc + (a.qty || 1), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── Top Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Package size={24} color="#7e22ce" />
            <span>Staff & Student Product Allocation</span>
          </h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
            Assign makeup kits, salon products, and styling gear to staff and academy students with live stock sync.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7e22ce 0%, #9333ea 100%)',
            color: '#fff',
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
          <Plus size={16} />
          <span>+ Assign Product / Kit</span>
        </button>
      </div>

      {/* ── 3 Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '1.25rem' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Active with Staff</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{activeStaffCount}</div>
            <div style={{ fontSize: '11px', color: '#7e22ce', fontWeight: 700, marginTop: 4 }}>Stylists & Makeover Artists</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f5f3ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Active with Students</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{activeStudentCount}</div>
            <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>Academy Practical Kits</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} />
          </div>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total Items Issued</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>{totalActiveQty} Items</div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: 4 }}>Synchronized with Inventory</div>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={22} />
          </div>
        </div>
      </div>

      {/* ── Filters & Search ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px', gap: '4px' }}>
          {[
            { id: 'ALL', label: 'All Items' },
            { id: 'STAFF', label: 'Staff Gear' },
            { id: 'STUDENT', label: 'Student Kits' },
            { id: 'ACTIVE', label: 'Currently In-Use' },
            { id: 'RETURNED', label: 'Returned' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: 'none',
                background: filterType === tab.id ? '#ffffff' : 'transparent',
                color: filterType === tab.id ? '#0f172a' : '#64748b',
                fontWeight: filterType === tab.id ? 800 : 600,
                fontSize: '12.5px',
                cursor: 'pointer',
                boxShadow: filterType === tab.id ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ background: '#ffffff', borderRadius: '10px', padding: '6px 12px', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '280px' }}>
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search recipient, product, station..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent' }}
          />
        </div>
      </div>

      {/* ── Assignments Table ── */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 800, textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.04em' }}>
                <th style={{ padding: '12px 16px' }}>Recipient Type & Name</th>
                <th style={{ padding: '12px 16px' }}>Assigned Product</th>
                <th style={{ padding: '12px 16px' }}>Qty</th>
                <th style={{ padding: '12px 16px' }}>Date Issued</th>
                <th style={{ padding: '12px 16px' }}>Station / Purpose</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    <Package size={40} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                    <p style={{ margin: 0, fontWeight: 700 }}>No product assignments found for this filter.</p>
                  </td>
                </tr>
              ) : (
                filteredAssignments.map((asg) => (
                  <tr key={asg.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: asg.recipientType === 'STAFF' ? '#f5f3ff' : '#f0f9ff',
                            color: asg.recipientType === 'STAFF' ? '#7e22ce' : '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '12px',
                          }}
                        >
                          {asg.recipientType === 'STAFF' ? 'S' : 'A'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{asg.recipientName}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            {asg.recipientType === 'STAFF' ? 'Staff • ' : 'Student • '}
                            {asg.recipientRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>
                      {asg.productName}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 900, color: '#7e22ce' }}>
                      {asg.qty}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {asg.date}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>
                      {asg.purpose}
                      {asg.notes && <div style={{ fontSize: '11px', color: '#94a3b8' }}>{asg.notes}</div>}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <span
                        style={{
                          background: asg.status === 'ACTIVE' ? '#fef3c7' : '#ecfdf5',
                          color: asg.status === 'ACTIVE' ? '#b45309' : '#15803d',
                          padding: '3px 9px',
                          borderRadius: '999px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        {asg.status === 'ACTIVE' ? <Clock size={11} /> : <CheckCircle2 size={11} />}
                        <span>{asg.status === 'ACTIVE' ? 'In Use' : 'Returned'}</span>
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {asg.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleMarkReturned(asg)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #bbf7d0',
                              background: '#f0fdf4',
                              color: '#15803d',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                            }}
                            title="Mark Product as Returned (Restores Inventory Stock)"
                          >
                            <RotateCcw size={12} />
                            <span>Mark Returned</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteAssignment(asg)}
                          style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fff1f2', color: '#dc2626', cursor: 'pointer' }}
                          title="Revoke / Delete Assignment"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Assign Product Modal ── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            padding: '1rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              padding: '1.75rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Package size={20} color="#7e22ce" />
                <span>Issue Salon Product / Kit</span>
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Recipient Type */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Assign To</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recipientType"
                      checked={assignForm.recipientType === 'STAFF'}
                      onChange={() => setAssignForm({ ...assignForm, recipientType: 'STAFF' })}
                    />
                    <span>Salon Staff Member</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recipientType"
                      checked={assignForm.recipientType === 'STUDENT'}
                      onChange={() => setAssignForm({ ...assignForm, recipientType: 'STUDENT' })}
                    />
                    <span>Academy Student Trainee</span>
                  </label>
                </div>
              </div>

              {/* Recipient Name & Role */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>
                    {assignForm.recipientType === 'STAFF' ? 'Staff Full Name *' : 'Student Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={assignForm.recipientType === 'STAFF' ? 'e.g. Suman Sharma' : 'e.g. Neha Verma'}
                    value={assignForm.recipientName}
                    onChange={(e) => setAssignForm({ ...assignForm, recipientName: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Role / Batch</label>
                  <input
                    type="text"
                    placeholder={assignForm.recipientType === 'STAFF' ? 'e.g. Hair Stylist' : 'e.g. Batch A (Bridal)'}
                    value={assignForm.recipientRole}
                    onChange={(e) => setAssignForm({ ...assignForm, recipientRole: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Product Select with Live Stock Badge */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Select Inventory Product *</label>
                <select
                  required
                  value={assignForm.productId}
                  onChange={(e) => setAssignForm({ ...assignForm, productId: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="">-- Choose Product from Salon Inventory --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                      {p.name} (Stock: {p.stock} {p.unit || 'units'} {p.stock <= 0 ? '• OUT OF STOCK' : ''})
                    </option>
                  ))}
                </select>
                {selectedProduct && (
                  <div style={{ marginTop: 4, fontSize: '11.5px', color: selectedProduct.stock > 0 ? '#16a34a' : '#ef4444', fontWeight: 700 }}>
                    Available in salon stock: {selectedProduct.stock} {selectedProduct.unit || 'units'}
                  </div>
                )}
              </div>

              {/* Quantity & Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Quantity to Assign *</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.stock || 999}
                    required
                    value={assignForm.qty}
                    onChange={(e) => setAssignForm({ ...assignForm, qty: Math.max(1, parseInt(e.target.value) || 1) })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Issue Date</label>
                  <input
                    type="date"
                    required
                    value={assignForm.date}
                    onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Purpose / Station */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 4 }}>Purpose / Workstation Station</label>
                <input
                  type="text"
                  placeholder="e.g. Bridal Station 1 / Daily Academy Practice / Hair Coloring Booth"
                  value={assignForm.purpose}
                  onChange={(e) => setAssignForm({ ...assignForm, purpose: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#7e22ce', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Assign & Deduct Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
