/**
 * @file RBSoftwareDashboard.jsx
 * @description Master Administration Cockpit for RB Software & Media Tech Hub.
 * Dual-division control panel:
 *   1. Software & Cloud Microservices (SaaS tenants, API gateways, database health, uptime)
 *   2. Camera, Photography & 4K Drone Media (Shoot pipeline, gear inventory, proposals ledger)
 * @module frontend/src/modules/admin/pages/RBSoftwareDashboard
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Terminal,
  Cpu,
  Database,
  Server,
  Code2,
  GitBranch,
  ShieldCheck,
  CloudLightning,
  Activity,
  Layers,
  ArrowUpRight,
  Camera,
  Video,
  Film,
  Box,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Phone,
  Send,
  Zap,
  Globe,
  Radio,
} from 'lucide-react';

export default function RBSoftwareDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab') || 'overview';

  const [proposals, setProposals] = useState([]);

  // Load proposals from localStorage
  const loadProposals = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('rb_tech_media_proposals') || '[]');
      if (stored.length === 0) {
        // Pre-seed with mock client proposals if empty
        const initialProposals = [
          {
            id: 'RBM-84021',
            clientName: 'Dr. Vivek Upadhyay',
            phone: '9839124500',
            eventDate: '2026-12-14',
            software: 'omnipos',
            photo: 'wedding_candid',
            video: 'cinema_4k',
            addons: { album: true, reels: true, drone: true },
            totalAmount: 121500,
            timestamp: new Date().toISOString(),
            status: 'Confirmed & Crew Assigned',
          },
          {
            id: 'RBM-84019',
            clientName: 'Sunrise Builders Varanasi',
            phone: '9415201190',
            eventDate: '2026-11-28',
            software: 'saas',
            photo: 'commercial',
            video: 'drone_aerial',
            addons: { album: false, reels: true, drone: true },
            totalAmount: 103000,
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            status: 'Proposal Sent',
          },
        ];
        localStorage.setItem('rb_tech_media_proposals', JSON.stringify(initialProposals));
        setProposals(initialProposals);
      } else {
        setProposals(stored);
      }
    } catch (err) {
      console.warn('Proposal load error:', err);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  const softwareProjects = [
    { name: 'Kashi Multi-Tenant Cloud Platform', tech: 'React, Node.js, Express, Postgres/Mongo', status: 'Live & Scaled', version: 'v2.4.0', uptime: '99.98%' },
    { name: 'OmniPOS Thermal Billing & QR POS', tech: 'WebUSB ESC/POS, SQLite, Dynamic UPI QR', status: 'Active Production', version: 'v4.1.0', uptime: '99.96%' },
    { name: 'Meta WhatsApp Business Cloud API', tech: 'Cloud Webhooks, BullMQ Queue, Redis', status: 'Operational', version: 'v2.2.1', uptime: '99.99%' },
    { name: 'Plotting Colony GIS Polyline Engine', tech: 'GIS Map Polygons, EMI Ledger, React', status: 'Active Production', version: 'v1.9.0', uptime: '100%' },
    { name: 'Golden Beauty Parlour Tenant Engine', tech: 'Multi-Tenant Architecture, JWT, RBAC', status: 'Active Production', version: 'v3.2.0', uptime: '99.95%' },
  ];

  const cameraInventory = [
    { name: 'Sony FX3 Cinema Line Full-Frame', serial: 'SN-FX3-8821', battery: '98% (NP-FZ100)', status: 'Assigned (Taj Ganges Shoot)', condition: 'Pristine' },
    { name: 'Sony Alpha A7 IV 33MP Hybrid', serial: 'SN-A74-1049', battery: '100% Fully Charged', status: 'Available in Studio', condition: 'Optimal' },
    { name: 'DJI Mavic 3 Pro Cine Drone (5.1K)', serial: 'SN-M3P-4902', battery: '95% (3 Packs Ready)', status: 'DGCA Certified / Standby', condition: 'Calibrated' },
    { name: 'Sony FE 24-70mm f/2.8 GM II Lens', serial: 'SN-GM2470-33', battery: 'Optical Master', status: 'Mounted on FX3', condition: 'Pristine' },
    { name: 'Sony FE 70-200mm f/2.8 GM OSS II', serial: 'SN-GM70200-12', battery: 'Optical Master', status: 'In Pelican Storm Case', condition: 'Optimal' },
    { name: 'DJI Ronin RS3 Pro Gimbal + LiDAR', serial: 'SN-RS3P-5520', battery: '100% Grip Charged', status: 'Paired with FX3 Rig', condition: 'Tuned' },
    { name: 'Godox AD600 Pro TTL Strobe Kit', serial: 'SN-AD600-01', battery: '2x 28.8V Li-ion Full', status: 'Available in Studio', condition: 'Inspected' },
    { name: 'Rode Wireless PRO 32-bit Kit', serial: 'SN-RWP-7711', battery: 'Charging Case 100%', status: 'Sound Bag Ready', condition: 'Optimal' },
  ];

  const shootSchedule = [
    { date: '18 Nov 2026', client: 'Aman & Sneha Wedding', venue: 'Brijrama Palace, Varanasi', lead: 'Sony FX3 + DJI Mavic 3 Pro', crew: '4 Cinematographers', status: 'Crew Prepped' },
    { date: '22 Nov 2026', client: 'Rohit Pre-Wedding Shoot', venue: 'Assi Ghat & Heritage Haveli', lead: 'Sony A7 IV + 50mm f/1.2 GM', crew: '2 Photographers', status: 'Location Permit Done' },
    { date: '28 Nov 2026', client: 'Sunrise Builders Aerial Survey', venue: 'Sarnath Commercial Plot', lead: 'DJI Mavic 3 Pro Cine', crew: 'Drone Pilot + Director', status: 'Flight Plan Approved' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0c4a6e 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: '#6366f1', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
              TECH & CINEMA COCKPIT
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>RB Software & Media Hub</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            RB Software & Media Hub Admin Console
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '680px' }}>
            Unified command radar overseeing cloud microservices, retail POS systems, camera gear arsenal, and wedding cinema production schedules.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.open('/software', '_blank')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Globe size={15} /> Open Public Site ↗
          </button>
        </div>
      </div>

      {/* Tab Selector Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          background: 'var(--bg-surface, #ffffff)',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid var(--border-color, #e2e8f0)',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'overview', label: '📊 Master Overview' },
          { id: 'software', label: '💻 Cloud & POS Software' },
          { id: 'media', label: '📸 Photography & Shoots' },
          { id: 'gear', label: '⚙️ Camera & Drone Gear' },
          { id: 'proposals', label: `📄 Client Estimates (${proposals.length})` },
        ].map((t) => {
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#6366f1' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary, #475569)',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ── TAB: OVERVIEW ── */}
      {currentTab === 'overview' && (
        <>
          {/* KPI Radar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem' }}>
            {[
              { title: 'Cloud Microservices', value: '18 Active', sub: 'Zero latency failures', icon: Server, color: '#3b82f6' },
              { title: 'Cinema Cameras', value: '3 Rigs Ready', sub: 'Sony FX3 & A7 IV', icon: Camera, color: '#0284c7' },
              { title: 'Aerial Drones', value: 'Hasselblad 5.1K', sub: 'DJI Mavic 3 Pro Cine', icon: Film, color: '#f59e0b' },
              { title: 'Incoming Proposals', value: `${proposals.length} In Pipeline`, sub: 'Real-time client leads', icon: FileText, color: '#10b981' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: 'var(--bg-surface, #ffffff)',
                    border: '1px solid var(--border-color, #e2e8f0)',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  }}
                >
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${card.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted, #64748b)' }}>{card.title}</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>{card.value}</div>
                    <div style={{ fontSize: '0.75rem', color: card.color, fontWeight: 600 }}>{card.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Dual Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {/* Left: Software status */}
            <div
              style={{
                background: 'var(--bg-surface, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                  Software & Cloud Microservices
                </h3>
                <span style={{ fontSize: '11px', background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  99.98% Uptime
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {softwareProjects.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: '8px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{p.tech}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>{p.version}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Shoot Schedule */}
            <div
              style={{
                background: 'var(--bg-surface, #ffffff)',
                border: '1px solid var(--border-color, #e2e8f0)',
                borderRadius: '16px',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                  Upcoming Video & Photography Shoots
                </h3>
                <span style={{ fontSize: '11px', background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  3 In Pipeline
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shootSchedule.map((s, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: '8px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{s.client}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{s.date} • {s.venue}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700 }}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── TAB: SOFTWARE & CLOUD ── */}
      {currentTab === 'software' && (
        <div
          style={{
            background: 'var(--bg-surface, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                Production Software Projects & Cloud Clusters
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                Active SaaS instances, OmniPOS billing terminals, and Meta WhatsApp webhooks
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                  <th style={{ padding: '10px 14px' }}>System Name</th>
                  <th style={{ padding: '10px 14px' }}>Technology Stack</th>
                  <th style={{ padding: '10px 14px' }}>Version</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px' }}>Uptime</th>
                </tr>
              </thead>
              <tbody>
                {softwareProjects.map((proj, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Code2 size={16} color="#6366f1" />
                        <span>{proj.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary, #475569)' }}>{proj.tech}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                        {proj.version}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#059669', background: '#ecfdf5', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                        {proj.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0284c7' }}>{proj.uptime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: GEAR ARSENAL ── */}
      {currentTab === 'gear' && (
        <div
          style={{
            background: 'var(--bg-surface, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                Camera, Drone & Studio Hardware Inventory
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                Live operational status, battery levels, and equipment field assignments
              </p>
            </div>
            <span style={{ fontSize: '12px', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              8/8 Assets Operational
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                  <th style={{ padding: '10px 14px' }}>Equipment Model</th>
                  <th style={{ padding: '10px 14px' }}>Serial Identifier</th>
                  <th style={{ padding: '10px 14px' }}>Power / Battery Status</th>
                  <th style={{ padding: '10px 14px' }}>Current Assignment</th>
                  <th style={{ padding: '10px 14px' }}>Hardware Health</th>
                </tr>
              </thead>
              <tbody>
                {cameraInventory.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Camera size={16} color="#0284c7" />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: '#64748b', fontFamily: 'monospace' }}>{item.serial}</td>
                    <td style={{ padding: '12px 14px', color: '#059669', fontWeight: 600 }}>{item.battery}</td>
                    <td style={{ padding: '12px 14px', color: '#0f172a', fontWeight: 600 }}>{item.status}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                        {item.condition}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: PROPOSALS LEDGER ── */}
      {currentTab === 'proposals' && (
        <div
          style={{
            background: 'var(--bg-surface, #ffffff)',
            border: '1px solid var(--border-color, #e2e8f0)',
            borderRadius: '16px',
            padding: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
                Client Quotations & Calculator Inquiries
              </h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted, #64748b)' }}>
                Real-time proposals submitted via public website calculator
              </p>
            </div>
            <button
              onClick={loadProposals}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {proposals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
              No proposals received yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                    <th style={{ padding: '10px 14px' }}>Ref #</th>
                    <th style={{ padding: '10px 14px' }}>Client & Phone</th>
                    <th style={{ padding: '10px 14px' }}>Target Date</th>
                    <th style={{ padding: '10px 14px' }}>Package Specs</th>
                    <th style={{ padding: '10px 14px' }}>Total Amount</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proposals.map((prop, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#6366f1' }}>{prop.id}</td>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                        <div>{prop.clientName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{prop.phone}</div>
                      </td>
                      <td style={{ padding: '12px 14px', color: '#475569' }}>{prop.eventDate}</td>
                      <td style={{ padding: '12px 14px', fontSize: '12px', color: '#334155' }}>
                        <div><strong>Tech:</strong> {prop.software}</div>
                        <div><strong>Photo:</strong> {prop.photo} • <strong>Video:</strong> {prop.video}</div>
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: 900, color: '#059669' }}>
                        ₹{prop.totalAmount?.toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <span style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                          {prop.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <a
                          href={`https://wa.me/91${prop.phone}?text=Hello%20${encodeURIComponent(prop.clientName)},%20thank%20you%20for%20your%20inquiry%20regarding%20RB%20Software%20%26%20Media.`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            background: '#22c55e',
                            color: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Send size={11} /> WhatsApp
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
