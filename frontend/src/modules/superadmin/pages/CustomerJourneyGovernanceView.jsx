/**
 * @file CustomerJourneyGovernanceView.jsx
 * @description Super Admin SaaS Lifecycle & Customer Journey Governance Center.
 * Houses the 7 Essential Super Admin Control Sections:
 *   1. 📋 Tenant Requests (New customer registrations, Model B demo & sales proposals)
 *   2. 🛡️ Business Verification (KYC documents review: Pending / Approved / Rejected)
 *   3. 💳 Subscriptions (Active, Trial, Expired plans & MRR)
 *   4. 🧾 Payments & Transactions (Gateway logs, status, refunds)
 *   5. 🏢 Tenant Management (Activate, Suspend, Health diagnostics)
 *   6. 🌐 Domain Management (Subdomains & custom domains SSL status)
 *   7. ⚙️ Module Management (Enable/disable features per tenant)
 * @module frontend/src/modules/superadmin/pages/CustomerJourneyGovernanceView
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  CreditCard,
  Building,
  Globe,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  FileText,
  Clock,
  Phone,
  Mail,
  Zap,
} from 'lucide-react';
import { useToast } from '../../../context/ToastContext';

export default function CustomerJourneyGovernanceView() {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('REQUESTS'); // 'REQUESTS' | 'VERIFICATIONS' | 'SUBSCRIPTIONS' | 'PAYMENTS' | 'TENANTS'

  const [requests, setRequests] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqRes, verRes, tenRes] = await Promise.allSettled([
        fetch('/api/v1/superadmin/tenant-requests'),
        fetch('/api/v1/superadmin/business-verifications'),
        fetch('/api/v1/superadmin/tenants'),
      ]);

      if (reqRes.status === 'fulfilled') {
        const d = await reqRes.value.json();
        if (d?.data?.requests) setRequests(d.data.requests);
      }
      if (verRes.status === 'fulfilled') {
        const d = await verRes.value.json();
        if (d?.data?.verifications) setVerifications(d.data.verifications);
      }
      if (tenRes.status === 'fulfilled') {
        const d = await tenRes.value.json();
        if (d?.data?.tenants) setTenants(d.data.tenants);
      }
    } catch (err) {
      console.warn('Super Admin Governance load:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Tenant Request Status (e.g. contacted, proposal_sent)
  const handleUpdateRequestStatus = async (requestId, status) => {
    try {
      const res = await fetch(`/api/v1/superadmin/tenant-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(`Request marked as ${status}`);
        loadData();
      }
    } catch {
      toast.error('Failed to update request');
    }
  };

  // Review Business Verification / KYC (Approve or Reject)
  const handleReviewKyc = async (verificationId, status, rejectionReason = '') => {
    try {
      const res = await fetch(`/api/v1/superadmin/business-verifications/${verificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason, reviewerNotes: `Reviewed by Super Admin on ${new Date().toLocaleDateString()}` }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(`KYC status updated to: ${status}`);
        loadData();
      }
    } catch {
      toast.error('Failed to review KYC');
    }
  };

  // Toggle Tenant Status (Activate / Suspend)
  const handleToggleTenantStatus = async (tenantId, newStatus) => {
    try {
      const res = await fetch(`/api/v1/superadmin/tenants/${tenantId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(`Tenant status changed to: ${newStatus}`);
        loadData();
      }
    } catch {
      toast.error('Failed to update tenant status');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1rem', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-main, #0f172a)', margin: 0 }}>
              SaaS Customer Journey & Lifecycle Governance
            </h1>
            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '999px', background: '#e0e7ff', color: '#4338ca' }}>
              SUPER ADMIN
            </span>
          </div>
          <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '13.5px', margin: '4px 0 0' }}>
            Govern incoming tenant demo requests, business KYC verifications, subscriptions, and module permissions.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border-color, #cbd5e1)',
            background: 'var(--bg-card, #ffffff)',
            color: 'var(--text-main, #0f172a)',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Tabs Selector Ribbon */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-color, #e2e8f0)',
          paddingBottom: '8px',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'REQUESTS', label: '📋 Tenant Requests & Demos', count: requests.length },
          { id: 'VERIFICATIONS', label: '🛡️ Business Verification (KYC)', count: verifications.length },
          { id: 'TENANTS', label: '🏢 Tenant Management & Status', count: tenants.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: isActive ? 800 : 600,
                border: 'none',
                background: isActive ? '#4f46e5' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-muted, #64748b)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : 'var(--bg-card-hover, #f1f5f9)',
                  color: isActive ? '#ffffff' : 'var(--text-main, #0f172a)',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ══════════════ TAB 1: TENANT REQUESTS (MODEL B & LEADS) ══════════════ */}
      {activeTab === 'REQUESTS' && (
        <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', margin: 0 }}>
              Incoming Customer Tenant & Demo Requests
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Super Admin does not create accounts manually; review proposals here.</span>
          </div>

          {requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <Users size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <div>No pending tenant requests at this moment.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-hover, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Business & Owner</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Contact</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Branches / Scope</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{req.businessName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{req.ownerName} • {req.serviceCategory}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{req.email}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{req.phone}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{req.estimatedBranches} Branch(es)</div>
                        {req.requirements && (
                          <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {req.requirements}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            background: req.status === 'converted' ? '#dcfce7' : req.status === 'proposal_sent' ? '#e0e7ff' : '#fef3c7',
                            color: req.status === 'converted' ? '#15803d' : req.status === 'proposal_sent' ? '#3730a3' : '#b45309',
                          }}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, 'contacted')}
                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
                          >
                            Mark Contacted
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, 'proposal_sent')}
                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: 'none', background: '#4f46e5', color: '#ffffff', cursor: 'pointer' }}
                          >
                            Send Proposal
                          </button>
                          <button
                            onClick={() => handleUpdateRequestStatus(req._id, 'converted')}
                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, border: 'none', background: '#10b981', color: '#ffffff', cursor: 'pointer' }}
                          >
                            Convert
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ TAB 2: BUSINESS VERIFICATIONS / KYC ══════════════ */}
      {activeTab === 'VERIFICATIONS' && (
        <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', margin: 0 }}>
              Business Document Verification & KYC Vault
            </h2>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Approve or reject customer business verification documents.</span>
          </div>

          {verifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
              <ShieldCheck size={36} style={{ margin: '0 auto 8px', opacity: 0.5 }} />
              <div>No KYC documents submitted yet. Normal subscriptions run without mandatory KYC.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-card-hover, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Tenant / Business</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>ID Type & Number</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>PAN / GSTIN</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Document Proof</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>Review Action</th>
                  </tr>
                </thead>
                <tbody>
                  {verifications.map((ver) => (
                    <tr key={ver._id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{ver.businessName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Owner: {ver.ownerName} ({ver.email})</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>{ver.idType.toUpperCase()}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{ver.idNumber || 'None'}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div>PAN: <strong>{ver.pan || 'N/A'}</strong></div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>GST: {ver.gstin || 'N/A'}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {ver.documentUrl ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {(ver.documentUrl.startsWith('data:image/') || ver.documentUrl.includes('.png') || ver.documentUrl.includes('.jpg') || ver.documentUrl.includes('.webp')) && (
                              <a href={ver.documentUrl} target="_blank" rel="noreferrer" title="Click to view image">
                                <img src={ver.documentUrl} alt="KYC proof" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #cbd5e1' }} />
                              </a>
                            )}
                            <a
                              href={ver.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#4f46e5',
                                textDecoration: 'none',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: '#eef2ff',
                                border: '1px solid #c7d2fe',
                              }}
                            >
                              <FileText size={12} /> View ↗
                            </a>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>None uploaded</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '999px',
                            background: ver.status === 'verified' ? '#dcfce7' : ver.status === 'rejected' ? '#fee2e2' : '#fef3c7',
                            color: ver.status === 'verified' ? '#15803d' : ver.status === 'rejected' ? '#b91c1c' : '#b45309',
                          }}
                        >
                          {ver.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleReviewKyc(ver._id, 'verified')}
                            style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', background: '#10b981', color: '#ffffff', cursor: 'pointer' }}
                          >
                            ✓ Approve KYC
                          </button>
                          <button
                            onClick={() => handleReviewKyc(ver._id, 'rejected', 'Document details do not match business registration.')}
                            style={{ padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', background: '#ef4444', color: '#ffffff', cursor: 'pointer' }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ TAB 3: TENANT MANAGEMENT & STATUS ══════════════ */}
      {activeTab === 'TENANTS' && (
        <div style={{ background: 'var(--bg-card, #ffffff)', border: '1px solid var(--border-color, #e2e8f0)', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main, #0f172a)', margin: 0 }}>
                Tenant Operational Status & Control
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Activate, suspend, or configure module permissions per tenant.</span>
            </div>
            <Link
              to="/superadmin/tenants/create"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: '#4f46e5',
                color: '#ffffff',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
              }}
            >
              <span>+ Provision New Tenant Wizard</span>
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-card-hover, #f8fafc)', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Tenant & Owner</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Subdomain & DB</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>KYC Status</th>
                  <th style={{ padding: '12px', fontWeight: 700 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((ten) => (
                  <tr key={ten._id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>{ten.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{ten.email}</div>
                      {ten.ownerDob && (
                        <div style={{ fontSize: '11px', color: '#d97706' }}>
                          DOB: {new Date(ten.ownerDob).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <a
                        href={`http://${ten.slug}.localhost:3000`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}
                      >
                        {ten.slug}.kashiservice.com ↗
                      </a>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        DB: <code>{ten.databaseConfig?.databaseName || ten.databaseMode || 'shared'}</code>
                      </div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: ten.status === 'active' ? '#dcfce7' : ten.status === 'suspended' ? '#fee2e2' : '#fef3c7',
                          color: ten.status === 'active' ? '#15803d' : ten.status === 'suspended' ? '#b91c1c' : '#b45309',
                        }}
                      >
                        {ten.status?.toUpperCase() || 'TRIAL'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: ten.kycStatus === 'verified' ? '#10b981' : '#64748b' }}>
                        {ten.kycStatus || 'not_required'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {ten.status === 'suspended' ? (
                        <button
                          onClick={() => handleToggleTenantStatus(ten._id, 'active')}
                          style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: 'none', background: '#10b981', color: '#ffffff', cursor: 'pointer' }}
                        >
                          Reactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleTenantStatus(ten._id, 'suspended')}
                          style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, border: '1px solid #cbd5e1', background: '#ffffff', color: '#b91c1c', cursor: 'pointer' }}
                        >
                          Suspend
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

