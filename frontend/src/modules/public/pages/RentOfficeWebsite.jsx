/**
 * @file RentOfficeWebsite.jsx
 * @description Dedicated Premium Commercial Leasing Website for Office & Commercial Rent.
 * Corporate office suites, retail showrooms, warehouse logistics, lease agreements & rent collection.
 * @module frontend/src/modules/public/pages/RentOfficeWebsite
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Key,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  MapPin,
  Phone,
  ArrowRight,
  Calculator,
  Compass,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Zap,
  Clock,
  Wifi,
  Car,
  Lock,
} from 'lucide-react';

export default function RentOfficeWebsite() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [calcSqft, setCalcSqft] = useState(1200);
  const [ratePerSqft, setRatePerSqft] = useState(45);

  const estimatedMonthlyRent = calcSqft * ratePerSqft;
  const maintenanceCost = Math.round(calcSqft * 3.5);
  const totalMonthlyOutlay = estimatedMonthlyRent + maintenanceCost;

  const listings = [
    {
      id: 'OFF-101',
      title: 'Executive IT Corporate Suite',
      type: 'IT Office',
      location: 'Cyber Heights Tower B, Ring Road',
      area: '1,850 sq.ft',
      rent: '₹85,000 / month',
      seats: '25-35 Workstations + 2 Director Cabins',
      features: ['Furnished with Central AC', 'High-Speed Optical Fiber', 'Conference Hall', 'Reserved Parking for 4 Cars'],
      available: true,
      tag: 'Ready to Move',
    },
    {
      id: 'RET-204',
      title: 'Ground Floor High-Street Retail Showroom',
      type: 'Retail Showroom',
      location: 'Central Plaza Boulevard, Main Market',
      area: '2,400 sq.ft',
      rent: '₹1,50,000 / month',
      seats: '40 ft Glass Frontage Double Height',
      features: ['Prime Road Facing Footfall', '3-Phase High Voltage Power', 'Private Washrooms & Storage', 'Heavy Foot Traffic Zone'],
      available: true,
      tag: 'High Footfall',
    },
    {
      id: 'COW-302',
      title: 'Plug & Play Startup Co-Working Bay',
      type: 'Co-Working',
      location: 'Varanasi Tech Park, Sector 4',
      area: '900 sq.ft',
      rent: '₹42,000 / month',
      seats: '14 Dedicated Desks + Meeting Room',
      features: ['100% DG Power Backup', 'Receptionist & Mail Handling', 'Cafeteria & Lounge', 'Biometric Access Control'],
      available: true,
      tag: 'Instant Setup',
    },
    {
      id: 'LOG-405',
      title: 'Grade-A Logistics & E-Commerce Hub',
      type: 'Warehouse',
      location: 'NH-19 Cargo Corridor, Transport Nagar',
      area: '5,000 sq.ft',
      rent: '₹1,15,000 / month',
      seats: '3 Loading Docks + Trailer Parking',
      features: ['28 Ft Clear Ceiling Height', 'Fire Hydrant & NOC Cleared', '24/7 Heavy Vehicle Access', 'CCTV & Armed Security'],
      available: true,
      tag: 'Heavy Vehicle NOC',
    },
  ];

  const filteredListings =
    selectedCategory === 'ALL'
      ? listings
      : listings.filter((l) => l.type.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ── Top Navigation Bar ── */}
      <nav
        style={{
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(11, 17, 32, 0.85)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)',
              }}
            >
              <Building2 size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Office & Commercial <span style={{ color: '#38bdf8' }}>Rent</span>
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 500 }}>
                Corporate Leasing & Premium Real Estate Asset Management
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Back to Hub
            </button>
            <a
              href="tel:+919876543210"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(2, 132, 199, 0.35)',
              }}
            >
              <Phone size={14} />
              <span>Inquire Site Visit</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 1.5rem 4rem',
          maxWidth: '1240px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 18px',
            borderRadius: '999px',
            background: 'rgba(2, 132, 199, 0.15)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            fontSize: '12px',
            fontWeight: 700,
            color: '#38bdf8',
            marginBottom: '1.5rem',
          }}
        >
          <Building2 size={14} />
          <span>Verified Commercial Premises & Transparent Legal Leases</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            maxWidth: '900px',
            margin: '0 auto 1.25rem',
          }}
        >
          Prime Furnished{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Office Suites & Retail Spaces
          </span>{' '}
          for Growing Businesses
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            maxWidth: '750px',
            margin: '0 auto 2.5rem',
          }}
        >
          Direct lease agreements, 100% DG power backup, high-speed fiber internet, dedicated car parking, and immediate key handover.
        </p>

        {/* Value Highlights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            maxWidth: '1000px',
            margin: '0 auto 3.5rem',
          }}
        >
          {[
            { icon: Wifi, title: 'High-Speed Optical Fiber', desc: 'Redundant dual-ISP connections' },
            { icon: Lock, title: '24/7 Biometric Access', desc: 'Secure CCTV & guarded gates' },
            { icon: Car, title: 'Ample Car Parking', desc: 'Reserved basement & guest slots' },
            { icon: FileCheck2, title: 'Digital Lease Registration', desc: 'Clear legal titles & GST bills' },
          ].map((pill, idx) => {
            const Picon = pill.icon;
            return (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.25rem 1rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(2, 132, 199, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8',
                    margin: '0 auto 10px',
                  }}
                >
                  <Picon size={18} />
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#f1f5f9', marginBottom: '4px' }}>
                  {pill.title}
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748b' }}>{pill.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Commercial Inventory ── */}
      <section style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
              Available Spaces
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>Featured Commercial Properties</h2>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.05)', padding: '4px', borderRadius: '10px' }}>
            {['ALL', 'Office', 'Retail', 'Co-Working', 'Warehouse'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '7px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === cat ? '#0284c7' : 'transparent',
                  color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredListings.map((p) => (
            <div
              key={p.id}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                    }}
                  >
                    {p.type}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                    }}
                  >
                    {p.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', margin: '0 0 6px' }}>{p.title}</h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8', marginBottom: '1rem' }}>
                  <MapPin size={14} color="#38bdf8" />
                  <span>{p.location}</span>
                </div>

                <div
                  style={{
                    background: 'rgba(0, 0, 0, 0.25)',
                    padding: '12px',
                    borderRadius: '10px',
                    marginBottom: '1.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>Carpet Area:</span>
                    <strong style={{ color: '#f8fafc' }}>{p.area}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                    <span style={{ color: '#64748b' }}>Capacity / Frontage:</span>
                    <strong style={{ color: '#f8fafc' }}>{p.seats}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '6px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ color: '#94a3b8' }}>Monthly Rent:</span>
                    <strong style={{ color: '#38bdf8', fontSize: '14px' }}>{p.rent}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '1.5rem' }}>
                  {p.features.map((f, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                      <CheckCircle2 size={14} color="#38bdf8" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="tel:+919876543210"
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '9px',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  textAlign: 'center',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Book Site Tour for this Property</span>
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive Rent & Maintenance Calculator ── */}
      <section
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '4.5rem 1.5rem',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.1)',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '1rem',
            }}
          >
            <Calculator size={14} />
            <span>Instant Commercial Budget Estimator</span>
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>
            Estimate Your Monthly Operational Outlay
          </h2>

          <div
            style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '18px',
              padding: '2.5rem',
              textAlign: 'left',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
            }}
          >
            <div>
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>Required Carpet Area:</span>
                  <strong style={{ color: '#38bdf8' }}>{calcSqft.toLocaleString()} sq.ft</strong>
                </div>
                <input
                  type="range"
                  min="300"
                  max="10000"
                  step="100"
                  value={calcSqft}
                  onChange={(e) => setCalcSqft(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                  <span style={{ color: '#94a3b8', fontWeight: 600 }}>Expected Rate per sq.ft:</span>
                  <strong style={{ color: '#38bdf8' }}>₹{ratePerSqft} / sq.ft</strong>
                </div>
                <input
                  type="range"
                  min="25"
                  max="150"
                  step="5"
                  value={ratePerSqft}
                  onChange={(e) => setRatePerSqft(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#0284c7' }}
                />
              </div>
            </div>

            <div
              style={{
                background: 'rgba(2, 132, 199, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '14px',
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Base Monthly Lease Rent:</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc', marginBottom: '12px' }}>
                ₹{estimatedMonthlyRent.toLocaleString('en-IN')}
              </div>

              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Est. Maintenance (CAM):</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '16px' }}>
                ₹{maintenanceCost.toLocaleString('en-IN')}
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '12px' }}>
                <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
                  Total Estimated Monthly Outlay:
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#38bdf8' }}>
                  ₹{totalMonthlyOutlay.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '2.5rem 1.5rem', textAlign: 'center', color: '#64748b', fontSize: '12.5px' }}>
        <p>© 2026 Office & Commercial Rent • Kashi Service Ecosystem. All Commercial Contracts RERA & Sub-Registrar Compliant.</p>
      </footer>
    </div>
  );
}

