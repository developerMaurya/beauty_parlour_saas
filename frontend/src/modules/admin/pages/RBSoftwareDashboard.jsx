import React from 'react';
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
  ArrowUpRight
} from 'lucide-react';

export default function RBSoftwareDashboard() {
  const projects = [
    { name: 'Kashi Service Cloud Platform', tech: 'React, Node.js, Express, Postgres/Mongo', status: 'Live & Scaled', version: 'v2.4.0', uptime: '99.98%' },
    { name: 'Salon & Spa Multi-Tenant Engine', tech: 'Multi-Tenant Architecture, JWT, RBAC', status: 'Active Production', version: 'v3.1.2', uptime: '99.95%' },
    { name: 'Plotting & GIS Colony Manager', tech: 'GIS Map Polyline, EMI Calculator', status: 'Deployment Stage', version: 'v1.8.0', uptime: '100%' },
    { name: 'Event Management QR Ticketing', tech: 'High-speed QR Ticket Scanner, Socket.io', status: 'Live Production', version: 'v2.0.4', uptime: '99.99%' },
    { name: 'Billing POS & WhatsApp Invoicing', tech: 'Webhooks, PDF Generator, UPI QR', status: 'Operational', version: 'v4.0.1', uptime: '99.92%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Top Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #31104b 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          border: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: '#6366f1', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
              TECH ENTERPRISE
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>RB Software Systems Ltd</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            RB Software & Tech Hub Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#cbd5e1', maxWidth: '650px' }}>
            Central administration cockpit for digital solutions, software suites, cloud microservices, and client SaaS applications developed by RB Software.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#38bdf8' }}>5</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Core Enterprise Suites</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#4ade80' }}>99.98%</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Cluster Uptime</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Cloud Microservices', value: '18 Active', sub: 'Zero latency failures', icon: Server, color: '#3b82f6' },
          { title: 'API Requests / Day', value: '142,500+', sub: 'Average response 42ms', icon: CloudLightning, color: '#8b5cf6' },
          { title: 'Database Health', value: 'Optimal', sub: 'Postgres & Mongo clusters', icon: Database, color: '#10b981' },
          { title: 'Code Deployments', value: '34 Deployments', sub: 'CI/CD Automated pipelines', icon: GitBranch, color: '#f59e0b' },
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
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
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
                  flexShrink: 0
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

      {/* Software Projects Table */}
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
              RB Software Product Portfolio & Live Systems
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
              Currently maintained SaaS applications, APIs, and client platforms
            </p>
          </div>
          <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: '#ecfdf5', color: '#059669', fontWeight: 700 }}>
            ● All Systems Operational
          </span>
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
              {projects.map((proj, idx) => (
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
    </div>
  );
}
