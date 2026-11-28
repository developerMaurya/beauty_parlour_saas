/**
 * @file PlottingUsersManagement.jsx
 * @description Real Estate Plotting - Plot Buyers & Sales Agents Management.
 * Supports dedicated separate views for Plot Buyers & Sales Agents & Commission,
 * comprehensive contact details (phone, email, full address / notes, assigned township),
 * and clean corporate theme design.
 * @module frontend/src/modules/admin/pages/PlottingUsersManagement
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { customerFetcher, staffFetcher } from '../../../services/api/admin/adminApi.js';
import {
  Compass,
  Users,
  MapPin,
  CheckCircle2,
  Phone,
  DollarSign,
  Plus,
  Search,
  Trash2,
  X,
  Sparkles,
  Building,
  Clock,
  Award,
  RefreshCw,
  Edit2,
  Filter,
  FileText,
  Mail,
  Home,
  Check,
} from 'lucide-react';

const SEED_BUYERS = [
  {
    _id: 'plt_buy_01',
    name: 'Sanjay Pandey',
    phone: '+91 98222 55441',
    email: 'sanjay.pandey@gmail.com',
    businessVertical: 'PLOTTING',
    verticalRole: 'BUYER',
    status: 'ACTIVE',
    customFields: {
      plot: 'Plot A-101 (1,200 sq.ft)',
      colony: 'Kashi Green Valley City',
      price: 1850000,
      downPayment: 500000,
      emi: '₹28,500/mo (36 Months)',
      registryStatus: 'Active EMI',
      address: 'Flat 402, Shivam Enclave, Sigra, Varanasi, UP - 221002',
    },
  },
  {
    _id: 'plt_buy_02',
    name: 'Manoj Kumar Gupta',
    phone: '+91 98777 22119',
    email: 'mkgupta.varanasi@gmail.com',
    businessVertical: 'PLOTTING',
    verticalRole: 'BUYER',
    status: 'ACTIVE',
    customFields: {
      plot: 'Plot B-205 (1,800 sq.ft)',
      colony: 'Ganga View Enclave',
      price: 3100000,
      downPayment: 3100000,
      emi: 'Full Cash Paid',
      registryStatus: 'Registered',
      address: 'Shop No. 12, Chowk Main Market, Varanasi, UP - 221001',
    },
  },
  {
    _id: 'plt_buy_03',
    name: 'Smt. Rekha Devi',
    phone: '+91 98333 99881',
    email: 'rekha.devi.bhu@yahoo.com',
    businessVertical: 'PLOTTING',
    verticalRole: 'BUYER',
    status: 'ACTIVE',
    customFields: {
      plot: 'Plot C-310 (2,400 sq.ft)',
      colony: 'Royal Orchid Township',
      price: 4200000,
      downPayment: 1200000,
      emi: '₹45,000/mo (48 Months)',
      registryStatus: 'Registry In Progress',
      address: 'Opposite Gate 2, BHU Campus Road, Lanka, Varanasi, UP - 221005',
    },
  },
];

const SEED_AGENTS = [
  {
    _id: 'plt_agt_01',
    name: 'Vinod Tiwari',
    phone: '+91 98111 88772',
    email: 'vinod.tiwari@kashirealty.in',
    designation: 'Senior Real Estate Consultant',
    businessVertical: 'PLOTTING',
    verticalRole: 'AGENT',
    status: 'active',
    customFields: {
      colony: 'Kashi Green Valley City',
      plotsSold: 14,
      commissionRate: '2.5%',
      totalCommission: 485000,
      address: 'House No. 45/B, Anand Nagar Colony, Shivpur, Varanasi, UP - 221003',
    },
  },
  {
    _id: 'plt_agt_02',
    name: 'Deepak Maurya',
    phone: '+91 98444 33221',
    email: 'deepak.maurya@kashirealty.in',
    designation: 'Colony Sales Executive',
    businessVertical: 'PLOTTING',
    verticalRole: 'AGENT',
    status: 'active',
    customFields: {
      colony: 'Ganga View Enclave',
      plotsSold: 8,
      commissionRate: '2.0%',
      totalCommission: 240000,
      address: 'Ward 18, Near Ring Road Phase 2 Crossing, Sarnath, Varanasi, UP - 221007',
    },
  },
];

export default function PlottingUsersManagement({ defaultTab }) {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Evaluate initial tab from route, query param or defaultTab prop
  const getInitialTab = () => {
    const tabQ = searchParams.get('tab');
    if (tabQ) return tabQ.toUpperCase() === 'AGENTS' ? 'AGENTS' : 'BUYERS';
    if (location.pathname.includes('plotting-agents') || location.pathname.includes('agents')) {
      return 'AGENTS';
    }
    if (defaultTab) {
      return defaultTab.toUpperCase() === 'AGENTS' ? 'AGENTS' : 'BUYERS';
    }
    return 'BUYERS';
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    const tabQ = searchParams.get('tab');
    if (tabQ) {
      setActiveTab(tabQ.toUpperCase() === 'AGENTS' ? 'AGENTS' : 'BUYERS');
    } else if (location.pathname.includes('plotting-agents') || location.pathname.includes('agents')) {
      setActiveTab('AGENTS');
    } else if (location.pathname.includes('plotting-users')) {
      setActiveTab('BUYERS');
    } else if (defaultTab) {
      setActiveTab(defaultTab.toUpperCase() === 'AGENTS' ? 'AGENTS' : 'BUYERS');
    }
  }, [location.pathname, searchParams, defaultTab]);

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Buyers (Customers collection) & Agents (Staff collection)
  const [buyers, setBuyers] = useState(SEED_BUYERS);
  const [agents, setAgents] = useState(SEED_AGENTS);

  // Modals & Edit tracking
  const [buyerModalOpen, setBuyerModalOpen] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [buyerForm, setBuyerForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    plot: '',
    colony: 'Kashi Green Valley City',
    price: '',
    downPayment: '',
    emi: '',
    registryStatus: 'Active EMI',
  });

  const [agentForm, setAgentForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    designation: 'Colony Sales Executive',
    colony: 'Kashi Green Valley City',
    plotsSold: '',
    commissionRate: '2.0%',
    totalCommission: '',
  });

  // Fetch from DB using businessVertical=PLOTTING
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [custRes, staffRes] = await Promise.all([
        customerFetcher.list({ businessVertical: 'PLOTTING', verticalRole: 'BUYER', limit: 100 }).catch(() => null),
        staffFetcher.list({ businessVertical: 'PLOTTING', verticalRole: 'AGENT', limit: 100 }).catch(() => null),
      ]);

      const custData = custRes?.data?.data || custRes?.data?.items || custRes?.data || [];
      const staffData = staffRes?.data?.data || staffRes?.data?.items || staffRes?.data || [];

      if (Array.isArray(custData) && custData.length > 0) {
        setBuyers(custData);
      }
      if (Array.isArray(staffData) && staffData.length > 0) {
        setAgents(staffData);
      }
    } catch (err) {
      console.warn('Using seeded plotting records:', err?.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save Buyer (Create or Update)
  const handleSaveBuyer = async (e) => {
    e.preventDefault();
    if (!buyerForm.name || !buyerForm.phone || !buyerForm.plot) {
      alert('Please fill out Name, Phone and Plot details.');
      return;
    }

    const payload = {
      name: buyerForm.name,
      phone: buyerForm.phone,
      email: buyerForm.email,
      businessVertical: 'PLOTTING',
      verticalRole: 'BUYER',
      customFields: {
        plot: buyerForm.plot,
        colony: buyerForm.colony,
        price: Number(buyerForm.price) || 2000000,
        downPayment: Number(buyerForm.downPayment) || 500000,
        emi: buyerForm.emi || '₹25,000/mo (36 Months)',
        registryStatus: buyerForm.registryStatus,
        address: buyerForm.address || '',
      },
    };

    try {
      if (editingItem) {
        await customerFetcher.update(editingItem._id, payload).catch(() => null);
        setBuyers((prev) =>
          prev.map((b) => (b._id === editingItem._id ? { ...b, ...payload, customFields: payload.customFields } : b))
        );
      } else {
        const res = await customerFetcher.create(payload).catch(() => null);
        const saved = res?.data?.data || res?.data || { _id: `plt_buy_${Date.now()}`, ...payload };
        setBuyers((prev) => [saved, ...prev]);
      }
    } catch (err) {
      console.warn('Local state update:', err);
      const fallback = { _id: editingItem?._id || `plt_buy_${Date.now()}`, ...payload };
      setBuyers((prev) => (editingItem ? prev.map((b) => (b._id === editingItem._id ? fallback : b)) : [fallback, ...prev]));
    }

    setBuyerModalOpen(false);
    setEditingItem(null);
    setBuyerForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      plot: '',
      colony: 'Kashi Green Valley City',
      price: '',
      downPayment: '',
      emi: '',
      registryStatus: 'Active EMI',
    });
  };

  // Save Agent (Create or Update)
  const handleSaveAgent = async (e) => {
    e.preventDefault();
    if (!agentForm.name || !agentForm.phone) {
      alert('Please fill out Name and Phone Number.');
      return;
    }

    const payload = {
      name: agentForm.name,
      phone: agentForm.phone,
      email: agentForm.email,
      designation: agentForm.designation,
      branchId: '6af306ecf23b7a6c694f8b7c',
      businessVertical: 'PLOTTING',
      verticalRole: 'AGENT',
      customFields: {
        colony: agentForm.colony,
        plotsSold: Number(agentForm.plotsSold) || 1,
        commissionRate: agentForm.commissionRate,
        totalCommission: Number(agentForm.totalCommission) || 50000,
        address: agentForm.address || '',
      },
    };

    try {
      if (editingItem) {
        await staffFetcher.update(editingItem._id, payload).catch(() => null);
        setAgents((prev) =>
          prev.map((a) => (a._id === editingItem._id ? { ...a, ...payload, customFields: payload.customFields } : a))
        );
      } else {
        const res = await staffFetcher.create(payload).catch(() => null);
        const saved = res?.data?.data || res?.data || { _id: `plt_agt_${Date.now()}`, ...payload };
        setAgents((prev) => [saved, ...prev]);
      }
    } catch (err) {
      console.warn('Local state update:', err);
      const fallback = { _id: editingItem?._id || `plt_agt_${Date.now()}`, ...payload };
      setAgents((prev) => (editingItem ? prev.map((a) => (a._id === editingItem._id ? fallback : b)) : [fallback, ...prev]));
    }

    setAgentModalOpen(false);
    setEditingItem(null);
    setAgentForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      designation: 'Colony Sales Executive',
      colony: 'Kashi Green Valley City',
      plotsSold: '',
      commissionRate: '2.0%',
      totalCommission: '',
    });
  };

  // Delete Handlers
  const handleDeleteBuyer = async (id) => {
    if (!window.confirm('Delete this plot buyer record?')) return;
    try {
      await customerFetcher.delete(id).catch(() => null);
    } catch (ign) {}
    setBuyers((prev) => prev.filter((b) => b._id !== id));
  };

  const handleDeleteAgent = async (id) => {
    if (!window.confirm('Remove this sales agent record?')) return;
    try {
      await staffFetcher.delete(id).catch(() => null);
    } catch (ign) {}
    setAgents((prev) => prev.filter((a) => a._id !== id));
  };

  // Status Toggle for Buyer
  const handleToggleBuyerStatus = async (buyer) => {
    const nextStatus = buyer.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await customerFetcher.update(buyer._id, { status: nextStatus }).catch(() => null);
    } catch (ign) {}
    setBuyers((prev) => prev.map((b) => (b._id === buyer._id ? { ...b, status: nextStatus } : b)));
  };

  // Status Toggle for Agent
  const handleToggleAgentStatus = async (agent) => {
    const nextStatus = agent.status?.toLowerCase() === 'active' ? 'inactive' : 'active';
    try {
      await staffFetcher.update(agent._id, { status: nextStatus }).catch(() => null);
    } catch (ign) {}
    setAgents((prev) => prev.map((a) => (a._id === agent._id ? { ...a, status: nextStatus } : a)));
  };

  // Open Edit Modals
  const handleEditBuyer = (buyer) => {
    setEditingItem(buyer);
    setBuyerForm({
      name: buyer.name || '',
      phone: buyer.phone || '',
      email: buyer.email || '',
      address: buyer.customFields?.address || '',
      plot: buyer.customFields?.plot || '',
      colony: buyer.customFields?.colony || 'Kashi Green Valley City',
      price: buyer.customFields?.price || '',
      downPayment: buyer.customFields?.downPayment || '',
      emi: buyer.customFields?.emi || '',
      registryStatus: buyer.customFields?.registryStatus || 'Active EMI',
    });
    setBuyerModalOpen(true);
  };

  const handleEditAgent = (agent) => {
    setEditingItem(agent);
    setAgentForm({
      name: agent.name || '',
      phone: agent.phone || '',
      email: agent.email || '',
      address: agent.customFields?.address || '',
      designation: agent.designation || 'Colony Sales Executive',
      colony: agent.customFields?.colony || 'Kashi Green Valley City',
      plotsSold: agent.customFields?.plotsSold || '',
      commissionRate: agent.customFields?.commissionRate || '2.0%',
      totalCommission: agent.customFields?.totalCommission || '',
    });
    setAgentModalOpen(true);
  };

  // Filtered
  const filteredBuyers = useMemo(() => {
    return buyers.filter((b) => {
      const q = searchQuery.toLowerCase();
      const plot = b.customFields?.plot || '';
      const colony = b.customFields?.colony || '';
      const address = b.customFields?.address || '';
      return (
        b.name?.toLowerCase().includes(q) ||
        b.phone?.includes(q) ||
        plot.toLowerCase().includes(q) ||
        colony.toLowerCase().includes(q) ||
        address.toLowerCase().includes(q)
      );
    });
  }, [buyers, searchQuery]);

  const filteredAgents = useMemo(() => {
    return agents.filter((a) => {
      const q = searchQuery.toLowerCase();
      const colony = a.customFields?.colony || '';
      const des = a.designation || '';
      const address = a.customFields?.address || '';
      return (
        a.name?.toLowerCase().includes(q) ||
        a.phone?.includes(q) ||
        des.toLowerCase().includes(q) ||
        colony.toLowerCase().includes(q) ||
        address.toLowerCase().includes(q)
      );
    });
  }, [agents, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem', paddingBottom: '3rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* ── Corporate Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #065f46 100%)',
          color: '#ffffff',
          padding: '1.75rem 2rem',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 4px 20px rgba(6, 78, 59, 0.2)',
        }}
      >
        <div>
          <span style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#ecfdf5', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Compass size={13} color="#a7f3d0" />
            KASHI REAL ESTATE PLOTTING • DIRECT DIRECTORY
          </span>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
            {activeTab === 'AGENTS' ? '💼 Sales Agents & Commission Management' : '👥 Plot Buyers & Registry Clients'}
          </h1>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#a7f3d0', maxWidth: '720px' }}>
            {activeTab === 'AGENTS'
              ? 'Manage sales executives, commission rates, assigned colonies, and detailed contact addresses.'
              : 'Track registered plot buyers, down payments, active 24-month bank EMIs, and registry milestones.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {activeTab === 'BUYERS' ? (
            <button
              onClick={() => {
                setEditingItem(null);
                setBuyerForm({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  plot: '',
                  colony: 'Kashi Green Valley City',
                  price: '',
                  downPayment: '',
                  emi: '',
                  registryStatus: 'Active EMI',
                });
                setBuyerModalOpen(true);
              }}
              style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#ffffff', color: '#047857', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={16} />
              <span>+ Add Plot Buyer</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingItem(null);
                setAgentForm({
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                  designation: 'Colony Sales Executive',
                  colony: 'Kashi Green Valley City',
                  plotsSold: '',
                  commissionRate: '2.0%',
                  totalCommission: '',
                });
                setAgentModalOpen(true);
              }}
              style={{ padding: '9px 18px', borderRadius: '10px', border: 'none', background: '#ffffff', color: '#047857', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={16} />
              <span>+ Add Sales Agent</span>
            </button>
          )}
        </div>
      </div>

      {/* ── KPI Metrics Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Plot Buyers & Clients</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#047857', marginTop: 4 }}>
            {buyers.length} Registered Buyers
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
            Central Customer DB
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Sales Agents & Brokers</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
            {agents.length} Licensed Agents
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
            Staff Commission Table
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Township Portfolios</span>
          <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#2563eb', marginTop: 4 }}>
            4 Master Colonies
          </div>
          <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginTop: 4 }}>
            VDA Approved Corridors
          </div>
        </div>
      </div>

      {/* ── Navigation Tabs & Search Bar ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('BUYERS')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'BUYERS' ? '#ffffff' : 'transparent',
              color: activeTab === 'BUYERS' ? '#047857' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: activeTab === 'BUYERS' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Users size={15} />
            <span>Plot Buyers ({buyers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('AGENTS')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'AGENTS' ? '#ffffff' : 'transparent',
              color: activeTab === 'AGENTS' ? '#047857' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: activeTab === 'AGENTS' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <Award size={15} />
            <span>Sales Agents & Commission ({agents.length})</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, address or colony..."
              style={{ padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12.5px', width: '100%', outline: 'none' }}
            />
          </div>
          <button onClick={loadData} disabled={loading} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }} title="Sync with MongoDB">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── VIEW 1: PLOT BUYERS TABLE ── */}
      {activeTab === 'BUYERS' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>Buyer Name & Contact</th>
                  <th style={{ padding: '12px 16px' }}>Address & Location</th>
                  <th style={{ padding: '12px 16px' }}>Plot Number</th>
                  <th style={{ padding: '12px 16px' }}>Township Colony</th>
                  <th style={{ padding: '12px 16px' }}>Deal Price</th>
                  <th style={{ padding: '12px 16px' }}>Payment / EMI Status</th>
                  <th style={{ padding: '12px 16px' }}>Registry</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBuyers.map((b) => (
                  <tr key={b._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{b.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: 700 }}>{b.phone}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{b.email || 'No email provided'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                      <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.35 }}>
                        {b.customFields?.address || 'Varanasi Local Buyer'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#047857' }}>
                      {b.customFields?.plot || 'Plot Allocated'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155' }}>
                      {b.customFields?.colony || 'Varanasi Colony'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                      ₹{Number(b.customFields?.price || 2000000).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                        {b.customFields?.emi || 'Flexible EMI'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        Advance: ₹{Number(b.customFields?.downPayment || 500000).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: 6,
                          background: b.customFields?.registryStatus === 'Registered' ? '#ecfdf5' : '#eff6ff',
                          color: b.customFields?.registryStatus === 'Registered' ? '#047857' : '#1d4ed8',
                        }}
                      >
                        {b.customFields?.registryStatus || 'Active EMI'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditBuyer(b)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                          title="Edit Buyer"
                        >
                          <Edit2 size={13} color="#475569" />
                        </button>
                        <button
                          onClick={() => handleDeleteBuyer(b._id)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                          title="Delete Record"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── VIEW 2: SALES AGENTS & COMMISSION TABLE ── */}
      {activeTab === 'AGENTS' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '12px 16px' }}>Agent Name & Phone</th>
                  <th style={{ padding: '12px 16px' }}>Full Address & Details</th>
                  <th style={{ padding: '12px 16px' }}>Designation</th>
                  <th style={{ padding: '12px 16px' }}>Assigned Colony</th>
                  <th style={{ padding: '12px 16px' }}>Plots Sold</th>
                  <th style={{ padding: '12px 16px' }}>Commission Rate</th>
                  <th style={{ padding: '12px 16px' }}>Total Earned</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAgents.map((a) => (
                  <tr key={a._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{a.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: 700 }}>{a.phone}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{a.email || 'No email provided'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', maxWidth: '240px' }}>
                      <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.35 }}>
                        {a.customFields?.address || 'Varanasi Office Representative'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#047857' }}>
                      {a.designation || 'Colony Sales Executive'}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#334155' }}>
                      {a.customFields?.colony || 'All Townships'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>
                      {a.customFields?.plotsSold || 0} Plots
                    </td>
                    <td style={{ padding: '14px 16px', color: '#047857', fontWeight: 700 }}>
                      {a.customFields?.commissionRate || '2.0%'}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#047857' }}>
                      ₹{Number(a.customFields?.totalCommission || 240000).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggleAgentStatus(a)}
                        style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          background: a.status?.toLowerCase() === 'active' ? '#ecfdf5' : '#fef2f2',
                          color: a.status?.toLowerCase() === 'active' ? '#047857' : '#dc2626',
                        }}
                      >
                        ● {a.status}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleEditAgent(a)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                          title="Edit Agent"
                        >
                          <Edit2 size={13} color="#475569" />
                        </button>
                        <button
                          onClick={() => handleDeleteAgent(a._id)}
                          style={{ padding: '5px 8px', borderRadius: 6, border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
                          title="Delete Agent"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT BUYER ── */}
      {buyerModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '540px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                🏗️ {editingItem ? 'Edit Plot Buyer' : 'Add Plot Buyer'}
              </h3>
              <button onClick={() => setBuyerModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveBuyer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Buyer Full Name *</label>
                <input type="text" required placeholder="e.g. Ramesh Chandra Verma" value={buyerForm.name} onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input type="tel" required placeholder="+91 98765 43210" value={buyerForm.phone} onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" placeholder="ramesh@gmail.com" value={buyerForm.email} onChange={(e) => setBuyerForm({ ...buyerForm, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Full Residential / Office Address</label>
                <textarea rows={2} placeholder="House/Flat No., Colony, Landmark, City, Pincode" value={buyerForm.address} onChange={(e) => setBuyerForm({ ...buyerForm, address: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Plot Number *</label>
                  <input type="text" required placeholder="Plot A-105 (1,500 sq.ft)" value={buyerForm.plot} onChange={(e) => setBuyerForm({ ...buyerForm, plot: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Township Colony</label>
                  <select value={buyerForm.colony} onChange={(e) => setBuyerForm({ ...buyerForm, colony: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}>
                    <option value="Kashi Green Valley City">Kashi Green Valley City</option>
                    <option value="Ganga View Enclave">Ganga View Enclave</option>
                    <option value="Royal Orchid Township">Royal Orchid Township</option>
                    <option value="Kashi Expressway Heights">Kashi Expressway Heights</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Deal Price (₹)</label>
                  <input type="number" placeholder="2000000" value={buyerForm.price} onChange={(e) => setBuyerForm({ ...buyerForm, price: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>EMI / Payment Mode</label>
                  <input type="text" placeholder="e.g. ₹28,000/mo (36 Months)" value={buyerForm.emi} onChange={(e) => setBuyerForm({ ...buyerForm, emi: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setBuyerModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#047857', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Buyer Details</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD / EDIT SALES AGENT ── */}
      {agentModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                💼 {editingItem ? 'Edit Sales Agent' : 'Add Sales Agent'}
              </h3>
              <button onClick={() => setAgentModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveAgent} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Agent Full Name *</label>
                <input type="text" required placeholder="e.g. Vinod Tiwari" value={agentForm.name} onChange={(e) => setAgentForm({ ...agentForm, name: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input type="tel" required placeholder="+91 98111 88772" value={agentForm.phone} onChange={(e) => setAgentForm({ ...agentForm, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Email Address</label>
                  <input type="email" placeholder="vinod.tiwari@kashirealty.in" value={agentForm.email} onChange={(e) => setAgentForm({ ...agentForm, email: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Detailed Residential / Office Address</label>
                <textarea rows={2} placeholder="House/Flat No., Road, Landmark, Area, Varanasi, UP - 22100X" value={agentForm.address} onChange={(e) => setAgentForm({ ...agentForm, address: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Designation</label>
                  <input type="text" placeholder="Colony Sales Executive" value={agentForm.designation} onChange={(e) => setAgentForm({ ...agentForm, designation: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Assigned Township</label>
                  <select value={agentForm.colony} onChange={(e) => setAgentForm({ ...agentForm, colony: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}>
                    <option value="Kashi Green Valley City">Kashi Green Valley City</option>
                    <option value="Ganga View Enclave">Ganga View Enclave</option>
                    <option value="Royal Orchid Township">Royal Orchid Township</option>
                    <option value="All Townships">All Townships</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Commission Rate (%)</label>
                  <input type="text" placeholder="2.0%" value={agentForm.commissionRate} onChange={(e) => setAgentForm({ ...agentForm, commissionRate: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '4px' }}>Plots Sold</label>
                  <input type="number" placeholder="5" value={agentForm.plotsSold} onChange={(e) => setAgentForm({ ...agentForm, plotsSold: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 10 }}>
                <button type="button" onClick={() => setAgentModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontWeight: 700 }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#047857', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Agent Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
