/**
 * @file SoftwareServicesView.jsx
 * @description Multi-Tenant SaaS Software Verticals (Beauty Parlour, Grocery, Institute, Electronics, Boutique).
 * @module frontend/src/modules/kashi-service/software-services/SoftwareServicesView
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Layers,
  Shield,
  Server,
  Zap,
} from 'lucide-react';
import { getKashiSoftwareVerticals } from '@/services/api/kashi/kashiPlatformApi.js';

export default function SoftwareServicesView({ onStartTrial }) {
  const navigate = useNavigate();
  const [verticals, setVerticals] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getKashiSoftwareVerticals();
        if (res?.data?.verticals) {
          setVerticals(res.data.verticals);
        }
      } catch (err) {
        console.warn('Software verticals load:', err);
      }
    }
    load();
  }, []);

  const items = verticals.length > 0 ? verticals : [
    { id: 'beauty-parlour', title: 'Beauty Parlour & Luxury Salon SaaS', icon: '💄', badge: 'Production Ready', demoSlug: 'blossom-salon', description: 'Enterprise beauty & wellness management platform with multi-branch support, live GPS tracking, and academy certifications.', modulesIncluded: ['Admin Dashboard', 'Live GPS Staff Radar', 'Biometric Punch Clock', 'Academy LMS', 'POS Billing & GST', 'Doorstep Home Service'] },
    { id: 'grocery-shop', title: 'Grocery & Supermarket Cloud POS', icon: '🛒', badge: 'Module Available', demoSlug: 'kashi-fresh', description: 'Cloud point-of-sale for retail supermarkets with fast billing, purchase orders, and supplier accounting.', modulesIncluded: ['Barcode Scanner API', 'Batch Expiry Alerts', 'Weighing Scale Integration', 'Doorstep Grocery App'] },
    { id: 'computer-institute', title: 'Computer Institute & Academy Management', icon: '🎓', badge: 'Production Ready', demoSlug: 'glamour-academy', description: 'Complete training center operating system with student portals, fee receipts, digital certificate generator, and grade reports.', modulesIncluded: ['Student Admissions & KYC', 'Batch Timetable Scheduler', 'Online Exam & Grading', 'Auto PDF Certificates'] },
    { id: 'electronic-shop', title: 'Electronic & Mobile Repair Shop ERP', icon: '📱', badge: 'Module Available', demoSlug: 'tech-zone', description: 'Service center and retail electronic store management with job card dispatch and warranty management.', modulesIncluded: ['IMEI & Serial Number Tracker', 'Repair Job Sheets & Status SMS', 'Technician Commission Matrix'] },
    { id: 'boutique-studio', title: 'Boutique & Designer Studio Management', icon: '✂️', badge: 'Module Available', demoSlug: 'couture-studio', description: 'Fashion designer ERP managing custom stitching orders, fitting appointments, and artisan payouts.', modulesIncluded: ['Custom Client Measurements', 'Fabric & Tailor Stage Tracking', 'Trial Fitting Appointments'] },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>💻</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              Multi-Tenant SaaS Software Verticals Hub
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
            White-label ERP suites with dedicated public storefront, private admin dashboard, and custom domains
          </p>
        </div>

        <button
          onClick={() => onStartTrial({ id: 'software-saas', name: 'Software Services (Multi-Tenant SaaS)' })}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Start 14-Day Free Trial</span>
        </button>
      </div>

      {/* Verticals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {items.map((v) => (
          <div
            key={v.id}
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '28px' }}>{v.icon}</span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: v.badge?.includes('Ready') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: v.badge?.includes('Ready') ? '#34d399' : '#a5b4fc',
                  }}
                >
                  ● {v.badge}
                </span>
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {v.title}
              </h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                {v.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(v.modulesIncluded || []).map((m, mi) => (
                  <span
                    key={mi}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: '#f1f5f9',
                      color: '#1e293b',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
              {v.demoSlug && (
                <button
                  onClick={() => {
                    sessionStorage.setItem('current_tenant_slug', v.demoSlug);
                    navigate(`/site/${v.demoSlug}`);
                  }}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '8px' }}
                >
                  View Live Store
                </button>
              )}
              <button
                onClick={() => onStartTrial({ id: v.id, name: v.title })}
                className="btn btn-primary"
                style={{ fontSize: '0.8rem', padding: '8px' }}
              >
                Start Trial
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

