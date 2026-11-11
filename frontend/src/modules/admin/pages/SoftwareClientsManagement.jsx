/**
 * @file SoftwareClientsManagement.jsx
 * @description RB Software Hub - Enterprise Tech Clients, Cloud Microservices & Developer Team Management.
 * @module frontend/src/modules/admin/pages/SoftwareClientsManagement
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Users,
  Server,
  Zap,
  DollarSign,
  Plus,
  Search,
  Trash2,
  X,
  ShieldCheck,
  Layers,
  Clock,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

const INITIAL_CLIENTS = [
  {
    id: 'sft_cli_01',
    companyName: 'Kashi Supermarket Chain',
    contactPerson: 'Sunil Gupta',
    product: 'OmniPOS Cloud Billing Engine',
    contractValue: 180000,
    billingCycle: 'Annual Enterprise',
    apiQuota: '250,000 req/mo',
    uptime: '99.99%',
    status: 'ACTIVE',
  },
  {
    id: 'sft_cli_02',
    companyName: 'Varanasi Diagnostic Network',
    contactPerson: 'Dr. R. K. Singhal',
    product: 'Patient Portal & Lab Micro-SaaS',
    contractValue: 240000,
    billingCycle: 'Annual Enterprise',
    apiQuota: '500,000 req/mo',
    uptime: '99.98%',
    status: 'ACTIVE',
  },
  {
    id: 'sft_cli_03',
    companyName: 'Ganga Cruise & Ferry Booking',
    contactPerson: 'Anand Jha',
    product: 'Live QR Gate Ticket API Engine',
    contractValue: 120000,
    billingCycle: 'Monthly (₹10,000/mo)',
    apiQuota: '100,000 req/mo',
    uptime: '100%',
    status: 'ACTIVE',
  },
  {
    id: 'sft_cli_04',
    companyName: 'Brijrama Heritage Boutique Hotel',
    contactPerson: 'Megha Sen',
    product: 'Multi-Tenant Concierge & ERP',
    contractValue: 320000,
    billingCycle: 'Annual Enterprise',
    apiQuota: '1,000,000 req/mo',
    uptime: '99.95%',
    status: 'ACTIVE',
  },
];

const INITIAL_DEVS = [
  {
    id: 'sft_dev_01',
    name: 'Gaurav Maurya',
    role: 'Lead Cloud Architect',
    stack: 'Node.js, Docker, MongoDB Cluster',
    activeSprint: 'OmniPOS v3.2 High-Throughput Engine',
    status: 'ACTIVE',
  },
  {
    id: 'sft_dev_02',
    name: 'Priyanka Sharma',
    role: 'Senior React / Frontend Engineer',
    stack: 'React, Tailwind, WebSockets',
    activeSprint: 'Live GPS Delivery Radar Component',
    status: 'ACTIVE',
  },
  {
    id: 'sft_dev_03',
    name: 'Aman Verma',
    role: 'Mobile Apps Developer',
    stack: 'React Native, Flutter, Kotlin',
    activeSprint: 'Doorstep Specialist Android/iOS Builds',
    status: 'ACTIVE',
  },
];

export default function SoftwareClientsManagement() {
  const [activeTab, setActiveTab] = useState('CLIENTS');
  const [clients, setClients] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_software_clients');
      return stored ? JSON.parse(stored) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [devs, setDevs] = useState(() => {
    try {
      const stored = localStorage.getItem('kashi_software_devs');
      return stored ? JSON.parse(stored) : INITIAL_DEVS;
    } catch {
      return INITIAL_DEVS;
    }
  });

  useEffect(() => {
    localStorage.setItem('kashi_software_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('kashi_software_devs', JSON.stringify(devs));
  }, [devs]);

  const [searchQuery, setSearchQuery] = useState('');
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);

  const [clientForm, setClientForm] = useState({
    companyName: '',
    contactPerson: '',
    product: 'OmniPOS Cloud Billing Engine',
    contractValue: '',
    billingCycle: 'Annual Enterprise',
    apiQuota: '250,000 req/mo',
  });

  const [devForm, setDevForm] = useState({
    name: '',
    role: 'Full Stack Engineer',
    stack: 'React, Node.js, Cloud APIs',
    activeSprint: 'Core Microservices',
  });

  const handleAddClient = (e) => {
    e.preventDefault();
    if (!clientForm.companyName || !clientForm.contractValue) {
      alert('Please fill out required fields.');
      return;
    }
    const newClient = {
      id: `sft_cli_${Date.now()}`,
      companyName: clientForm.companyName,
      contactPerson: clientForm.contactPerson || 'Enterprise Lead',
      product: clientForm.product,
      contractValue: Number(clientForm.contractValue) || 150000,
      billingCycle: clientForm.billingCycle,
      apiQuota: clientForm.apiQuota,
      uptime: '99.99%',
      status: 'ACTIVE',
    };
    setClients([newClient, ...clients]);
    setClientModalOpen(false);
    setClientForm({
      companyName: '',
      contactPerson: '',
      product: 'OmniPOS Cloud Billing Engine',
      contractValue: '',
      billingCycle: 'Annual Enterprise',
      apiQuota: '250,000 req/mo',
    });
  };

  const handleAddDev = (e) => {
    e.preventDefault();
    if (!devForm.name || !devForm.role) {
      alert('Please fill out required fields.');
      return;
    }
    const newDev = {
      id: `sft_dev_${Date.now()}`,
      name: devForm.name,
      role: devForm.role,
      stack: devForm.stack,
      activeSprint: devForm.activeSprint,
      status: 'ACTIVE',
    };
    setDevs([newDev, ...devs]);
    setDevModalOpen(false);
    setDevForm({
      name: '',
      role: 'Full Stack Engineer',
      stack: 'React, Node.js, Cloud APIs',
      activeSprint: 'Core Microservices',
    });
  };

  const handleDeleteClient = (id) => {
    if (window.confirm('Delete tech client record?')) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  const handleDeleteDev = (id) => {
    if (window.confirm('Remove developer record?')) {
      setDevs(devs.filter((d) => d.id !== id));
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      return (
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [clients, searchQuery]);

  const filteredDevs = useMemo(() => {
    return devs.filter((d) => {
      return (
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.stack.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [devs, searchQuery]);

  const totalARR = clients.reduce((s, c) => s + (c.contractValue || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem', maxWidth: '1440px', margin: '0 auto' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4f46e5 50%, #4338ca 100%)',
          color: '#ffffff',
          padding: '2rem 2.25rem',
          borderRadius: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 8px 30px rgba(79, 70, 229, 0.25)',
        }}
      >
        <div>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: '#e0e7ff', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Code2 size={13} color="#a5b4fc" />
            RB SOFTWARE & TECH HUB CLUSTER
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '6px 0', color: '#ffffff' }}>
            💻 Tech Clients, Developers & Cloud Microservices
          </h1>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#c7d2fe', maxWidth: '720px' }}>
            Enterprise POS integrations, micro-SaaS subscriptions, active developer sprints, and high-availability API cluster monitoring.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => {
              setActiveTab('CLIENTS');
              setClientModalOpen(true);
            }}
            style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: '#ffffff', color: '#4338ca', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>+ Add Tech Client</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('DEVS');
              setDevModalOpen(true);
            }}
            style={{ padding: '10px 18px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={16} />
            <span>+ Add Developer</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Annual Recurring Software Value (ARR)</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#4f46e5', marginTop: 4 }}>
            ₹{(totalARR / 100000).toFixed(2)} Lakh
          </div>
          <div style={{ fontSize: '11px', color: '#4f46e5', fontWeight: 700, marginTop: 4 }}>
            {clients.length} Active Enterprise SaaS Contracts
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Cloud API Latency</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669', marginTop: 4 }}>
            142 ms Average
          </div>
          <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: 4 }}>
            ● Zero Outages Reported in 90 Days
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>Active Developers & Engineers</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginTop: 4 }}>
            {devs.length} Tech Engineers
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginTop: 4 }}>
            Full-Stack, Cloud & Mobile Apps
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.35rem' }}>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748b' }}>API Quota Throughput</span>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0284c7', marginTop: 4 }}>
            1.85 Million
          </div>
          <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700, marginTop: 4 }}>
            Cloud API Requests Handled / Month
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('CLIENTS')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'CLIENTS' ? '#ffffff' : 'transparent',
              color: activeTab === 'CLIENTS' ? '#4f46e5' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Users size={15} />
            <span>Tech Clients ({clients.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DEVS')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'DEVS' ? '#ffffff' : 'transparent',
              color: activeTab === 'DEVS' ? '#4f46e5' : '#64748b',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Code2 size={15} />
            <span>Software Engineers ({devs.length})</span>
          </button>
        </div>

        <div style={{ position: 'relative', minWidth: '240px' }}>
          <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: 10 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients or developers..."
            style={{ padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%', outline: 'none' }}
          />
        </div>
      </div>

      {/* CLIENTS TABLE */}
      {activeTab === 'CLIENTS' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Enterprise Client</th>
                  <th style={{ padding: '12px 16px' }}>Integrated Product</th>
                  <th style={{ padding: '12px 16px' }}>Billing Cycle</th>
                  <th style={{ padding: '12px 16px' }}>Contract Value</th>
                  <th style={{ padding: '12px 16px' }}>API Quota</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a' }}>{c.companyName}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>Contact: {c.contactPerson}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4f46e5' }}>{c.product}</td>
                    <td style={{ padding: '14px 16px', color: '#334155' }}>{c.billingCycle}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#059669' }}>
                      ₹{c.contractValue.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{c.apiQuota}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 800, background: '#ecfdf5', color: '#059669' }}>
                        ● {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteClient(c.id)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DEVS TABLE */}
      {activeTab === 'DEVS' && (
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '11.5px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Software Engineer</th>
                  <th style={{ padding: '12px 16px' }}>Role</th>
                  <th style={{ padding: '12px 16px' }}>Tech Stack</th>
                  <th style={{ padding: '12px 16px' }}>Active Sprint Milestone</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevs.map((d) => (
                  <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#0f172a' }}>{d.name}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#4f46e5' }}>{d.role}</td>
                    <td style={{ padding: '14px 16px', color: '#334155' }}>{d.stack}</td>
                    <td style={{ padding: '14px 16px', color: '#64748b' }}>{d.activeSprint}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button onClick={() => handleDeleteDev(d.id)} style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Modal */}
      {clientModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>💻 Add Enterprise Tech Client</h3>
            <form onSubmit={handleAddClient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" required placeholder="Company Name" value={clientForm.companyName} onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Contact Person" value={clientForm.contactPerson} onChange={(e) => setClientForm({ ...clientForm, contactPerson: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <select value={clientForm.product} onChange={(e) => setClientForm({ ...clientForm, product: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <option value="OmniPOS Cloud Billing Engine">OmniPOS Cloud Billing Engine</option>
                <option value="Patient Portal & Lab Micro-SaaS">Patient Portal & Lab Micro-SaaS</option>
                <option value="Live QR Gate Ticket API Engine">Live QR Gate Ticket API Engine</option>
                <option value="Multi-Tenant Concierge & ERP">Multi-Tenant Concierge & ERP</option>
              </select>
              <input type="number" required placeholder="Contract Value (₹)" value={clientForm.contractValue} onChange={(e) => setClientForm({ ...clientForm, contractValue: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setClientModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dev Modal */}
      {devModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '18px', width: '100%', maxWidth: '480px', padding: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>🛠️ Add Software Developer</h3>
            <form onSubmit={handleAddDev} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" required placeholder="Developer Full Name" value={devForm.name} onChange={(e) => setDevForm({ ...devForm, name: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" required placeholder="Designation (e.g. Senior Backend Engineer)" value={devForm.role} onChange={(e) => setDevForm({ ...devForm, role: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Tech Stack (e.g. Node, React, Cloudflare)" value={devForm.stack} onChange={(e) => setDevForm({ ...devForm, stack: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Current Sprint / Milestone" value={devForm.activeSprint} onChange={(e) => setDevForm({ ...devForm, activeSprint: e.target.value })} style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setDevModalOpen(false)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#4f46e5', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Add Developer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

