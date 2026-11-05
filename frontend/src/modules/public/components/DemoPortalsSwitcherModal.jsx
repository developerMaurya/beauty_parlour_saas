/**
 * @file DemoPortalsSwitcherModal.jsx
 * @description Interactive Multi-Portal & Dashboard Test Switcher Modal.
 * Allows users and testers to inspect and 1-Click launch all 6 ecosystem portals:
 *   1. 🌐 Public Website & Luxury Storefront (/site/blossom-salon)
 *   2. 🏢 Salon Owner Admin Dashboard (/admin/login)
 *   3. ✂️ Staff Stylist & Employee Portal (/staff/login)
 *   4. 🎓 Cosmetology Academy Student Portal (/student/login)
 *   5. 💄 Customer Online Booking & Wallet Portal (/customer/login)
 *   6. 👑 Super Admin Platform Control Plane (/superadmin/login)
 * @module frontend/src/modules/public/components/DemoPortalsSwitcherModal
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ExternalLink,
  Zap,
  Globe,
  Building2,
  Scissors,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/context/ToastContext.jsx';
import { useTenantAdmin } from '@/context/TenantAdminContext.jsx';

export default function DemoPortalsSwitcherModal({ isOpen, onClose, defaultTenant = 'blossom-salon' }) {
  const navigate = useNavigate();
  const toast = useToast();
  const { login: adminLogin } = useTenantAdmin();

  const [copiedId, setCopiedId] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'BUSINESS' | 'STAFF' | 'LEARN' | 'PLATFORM'
  const [launchingPortal, setLaunchingPortal] = useState(null);

  if (!isOpen) return null;

  const handleCopy = (text, id) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Credentials copied to clipboard!');
  };

  const portals = [
    {
      id: 'website',
      category: 'BUSINESS',
      name: 'Public Website & Luxury Storefront',
      icon: Globe,
      color: '#ec4899',
      bgColor: '#fdf2f8',
      borderColor: '#fbcfe8',
      badge: 'Public Storefront',
      badgeBg: '#fce7f3',
      badgeColor: '#be185d',
      description:
        'Client-facing luxury beauty salon website. Displays services catalog, promotional discount packages, branch locator, and real-time online appointment booking cart.',
      url: `/site/${defaultTenant}`,
      externalUrl: `http://${defaultTenant}.localhost:3000`,
      credentials: null,
      launchText: '🌐 Open Storefront Website',
      onLaunch: () => {
        sessionStorage.setItem('current_tenant_slug', defaultTenant);
        localStorage.setItem('active_tenant_slug', defaultTenant);
        onClose();
        navigate(`/site/${defaultTenant}`);
      },
    },
    {
      id: 'admin',
      category: 'BUSINESS',
      name: 'Salon Owner & Manager Admin Dashboard',
      icon: Building2,
      color: '#4f46e5',
      bgColor: '#eef2ff',
      borderColor: '#c7d2fe',
      badge: 'Admin ERP',
      badgeBg: '#e0e7ff',
      badgeColor: '#3730a3',
      description:
        'Complete operational control plane: Cloud POS billing with GST, live staff GPS satellite tracking radar, booking calendar, service catalog management, and revenue analytics.',
      url: `/admin/login?tenant=${defaultTenant}`,
      credentials: {
        email: 'admin@parlour.local',
        password: 'Password@123',
        salonSlug: defaultTenant,
      },
      launchText: '⚡ 1-Click Launch Admin Dashboard',
      onLaunch: async () => {
        setLaunchingPortal('admin');
        try {
          await adminLogin({
            tenantSlugOrId: defaultTenant,
            email: 'admin@parlour.local',
            password: 'Password@123',
          });
          toast.success('Auto-logged in as Salon Admin!');
          onClose();
          navigate('/admin/dashboard');
        } catch {
          onClose();
          navigate(`/admin/login?tenant=${defaultTenant}&email=admin@parlour.local&pass=Password@123&autologin=true`);
        } finally {
          setLaunchingPortal(null);
        }
      },
    },
    {
      id: 'staff',
      category: 'STAFF',
      name: 'Staff Stylist & Employee Portal',
      icon: Scissors,
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      badge: 'Stylist Portal',
      badgeBg: '#d1fae5',
      badgeColor: '#065f46',
      description:
        'Stylist mobile job view, shift roster check-in/out, doorstep home service GPS tracking, commissions summary, and service delivery completion checklist.',
      url: `/staff/login`,
      credentials: {
        email: 'staff@blossom.com',
        phone: '9876543211',
        password: 'Staff@123',
        salonSlug: defaultTenant,
      },
      launchText: '⚡ 1-Click Launch Staff Portal',
      onLaunch: () => {
        sessionStorage.setItem('current_tenant_slug', defaultTenant);
        onClose();
        navigate(`/staff/login?tenant=${defaultTenant}&email=staff@blossom.com&pass=Staff@123&autologin=true`);
      },
    },
    {
      id: 'student',
      category: 'LEARN',
      name: 'Cosmetology Academy Student Portal',
      icon: GraduationCap,
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      badge: 'LMS Academy',
      badgeBg: '#ede9fe',
      badgeColor: '#5b21b6',
      description:
        'Beauty academy student LMS: Batch timetable, online theory exams & grading, practical submission assignments, and automated verifiable digital PDF certificates.',
      url: `/student/login`,
      credentials: {
        email: 'student@blossom.com',
        password: 'Student@123',
        salonSlug: defaultTenant,
      },
      launchText: '⚡ 1-Click Launch Student Portal',
      onLaunch: () => {
        sessionStorage.setItem('current_tenant_slug', defaultTenant);
        onClose();
        navigate(`/student/login?tenant=${defaultTenant}&email=student@blossom.com&pass=Student@123&autologin=true`);
      },
    },
    {
      id: 'customer',
      category: 'BUSINESS',
      name: 'Customer Booking & Loyalty Portal',
      icon: Sparkles,
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      badge: 'Customer Portal',
      badgeBg: '#fef3c7',
      badgeColor: '#92400e',
      description:
        'Customer appointment management: View upcoming salon treatments, re-schedule visits, track doorstep stylist on live GPS map, and redeem loyalty reward points.',
      url: `/customer/login`,
      credentials: {
        email: 'customer@blossom.com',
        phone: '9876543210',
        password: 'Customer@123',
      },
      launchText: '⚡ 1-Click Launch Customer Portal',
      onLaunch: () => {
        sessionStorage.setItem('current_tenant_slug', defaultTenant);
        onClose();
        navigate(`/customer/login?tenant=${defaultTenant}&email=customer@blossom.com&pass=Customer@123&autologin=true`);
      },
    },
    {
      id: 'superadmin',
      category: 'PLATFORM',
      name: 'Super Admin Platform Control Plane',
      icon: ShieldCheck,
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      badge: 'Master Platform',
      badgeBg: '#dbeafe',
      badgeColor: '#1e40af',
      description:
        'Master SaaS management plane: Tenant governance, pending trial & custom domain approvals, Shared vs Dedicated database provisioning, billing subscriptions, and audit logs.',
      url: `/superadmin/login`,
      credentials: {
        email: 'superadmin@beautysaas.local',
        password: 'SuperAdmin@Secure2026!',
      },
      launchText: '⚡ 1-Click Launch Super Admin',
      onLaunch: () => {
        onClose();
        navigate(`/superadmin/login?email=superadmin@beautysaas.local&pass=SuperAdmin@Secure2026!&autologin=true`);
      },
    },
  ];

  const filteredPortals =
    activeTab === 'ALL' ? portals : portals.filter((p) => p.category === activeTab);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          maxWidth: '860px',
          width: '100%',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.3)',
          border: '1px solid #e2e8f0',
          position: 'relative',
          color: '#0f172a',
          fontFamily: 'Inter, system-ui, sans-serif',
          overflow: 'hidden',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              }}
            >
              <Eye size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#ffffff' }}>
                  Explore Live Demo Portals & Dashboards
                </h2>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: '#10b981',
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                  }}
                >
                  TEST SANDBOX
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                Active environment for <strong>Blossom Luxury Salon & Spa</strong> • 1-Click Launch any portal
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#ffffff',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Tabs */}
        <div
          style={{
            padding: '0.75rem 1.75rem',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
          }}
        >
          {[
            { id: 'ALL', label: 'All 6 Portals' },
            { id: 'BUSINESS', label: 'Salon Business & Admin' },
            { id: 'STAFF', label: 'Staff & Stylists' },
            { id: 'LEARN', label: 'Academy LMS' },
            { id: 'PLATFORM', label: 'Super Admin Control' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: activeTab === tab.id ? 800 : 600,
                border: activeTab === tab.id ? '1.5px solid #4f46e5' : '1px solid #cbd5e1',
                background: activeTab === tab.id ? '#eef2ff' : '#ffffff',
                color: activeTab === tab.id ? '#3730a3' : '#475569',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Portals Grid */}
        <div style={{ padding: '1.25rem 1.75rem', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            {filteredPortals.map((portal) => {
              const IconComp = portal.icon;
              return (
                <div
                  key={portal.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = portal.color;
                    e.currentTarget.style.boxShadow = `0 6px 18px ${portal.color}18`;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: portal.bgColor,
                          border: `1px solid ${portal.borderColor}`,
                          color: portal.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconComp size={22} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                            {portal.name}
                          </h3>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: portal.badgeBg,
                              color: portal.badgeColor,
                            }}
                          >
                            {portal.badge}
                          </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b', lineHeight: 1.45 }}>
                          {portal.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Credentials / URL Strip */}
                  <div
                    style={{
                      background: '#f8fafc',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      border: '1px solid #f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '12px' }}>
                      {portal.credentials ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: '#64748b', fontWeight: 600 }}>Login:</span>
                            <code style={{ fontWeight: 700, color: '#0f172a' }}>{portal.credentials.email}</code>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span style={{ color: '#64748b', fontWeight: 600 }}>Password:</span>
                            <code style={{ fontWeight: 700, color: '#0f172a' }}>{portal.credentials.password}</code>
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: '#64748b', fontWeight: 600 }}>Storefront Domain:</span>
                          <code style={{ fontWeight: 700, color: '#ec4899' }}>blossom-salon.kashiservice.com</code>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {portal.credentials && (
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `Email: ${portal.credentials.email}\nPassword: ${portal.credentials.password}\nSalon: ${defaultTenant}`,
                              portal.id
                            )
                          }
                          style={{
                            padding: '6px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#475569',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {copiedId === portal.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          <span>{copiedId === portal.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={portal.onLaunch}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 800,
                          border: 'none',
                          background: portal.color,
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: `0 3px 10px ${portal.color}35`,
                        }}
                      >
                        <Zap size={13} />
                        <span>{portal.launchText}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

