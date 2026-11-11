import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Building,
  MapPin,
  CheckCircle2,
  Calculator,
  ShieldCheck,
  FileText,
  DollarSign,
  ArrowRight,
  ChevronRight,
  Phone,
  Calendar,
  Layers,
  Award,
  Users,
  Sparkles,
} from 'lucide-react';

export default function RealEstatePlottingWebsite() {
  const navigate = useNavigate();
  const [selectedColony, setSelectedColony] = useState('ALL');
  
  // EMI Calculator State
  const [plotPrice, setPlotPrice] = useState(1850000);
  const [downPayment, setDownPayment] = useState(350000);
  const [tenureYears, setTenureYears] = useState(3);
  const [interestRate, setInterestRate] = useState(8.5);

  const calculateMonthlyEmi = () => {
    const principal = plotPrice - downPayment;
    if (principal <= 0) return 0;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = tenureYears * 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    return Math.round(emi);
  };

  const coloniesList = [
    {
      colony: 'Kashi Green Valley City (Phase 1)',
      location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor',
      type: 'TOWNSHIP',
      reraNo: 'UPRERAAGT2026/89412',
      plotsAvailable: '18 Plots Ready',
      startingPrice: '₹14,500 / Sq Yd',
      img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80',
      highlights: ['60-Ft Main Blacktop Road', 'Underground Drainage & Electricity', 'Park Facing Corner Plots', 'Immediate Registry & Mutation (Dakhil Kharij)'],
    },
    {
      colony: 'Ganga View Royal Enclave',
      location: 'Near Ramnagar Fort & Riverfront Bypass, Varanasi',
      type: 'LUXURY_RIVERFRONT',
      reraNo: 'UPRERAAGT2026/91104',
      plotsAvailable: '12 Plots Ready',
      startingPrice: '₹17,200 / Sq Yd',
      img: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=700&q=80',
      highlights: ['Gated Security with CCTV Guard Room', 'Ganga Riverbank Breeze & Green Belt', 'LED Street Lighting & Water Pipeline', 'Clubhouse & Jogging Track'],
    },
    {
      colony: 'Royal Orchid Smart Township',
      location: 'Airport Road, Babatpur Ring Road Junction, Varanasi',
      type: 'HIGHWAY_SMART',
      reraNo: 'UPRERAAGT2026/78231',
      plotsAvailable: '14 Plots Ready',
      startingPrice: '₹19,800 / Sq Yd',
      img: 'https://images.unsplash.com/photo-1524813686514-a57563d77d66?auto=format&fit=crop&w=700&q=80',
      highlights: ['Direct 4-Lane Ring Road Connectivity', 'Commercial Showroom & Retail Plots', 'Solar Powered Street Infrastructure', '100% Clear Legal Title Verified by Govt Bank'],
    },
  ];

  const plotInventory = [
    { plotNo: 'Plot A-101', colony: 'Kashi Green Valley', size: '1200 Sq Ft (30x40)', facing: 'East Facing', price: '₹18,50,000', status: 'Available', badge: 'Ready' },
    { plotNo: 'Plot A-102', colony: 'Kashi Green Valley', size: '1500 Sq Ft (30x50)', facing: 'North Corner', price: '₹23,20,000', status: 'Booked', badge: 'Hold' },
    { plotNo: 'Plot B-205', colony: 'Ganga View Enclave', size: '1800 Sq Ft (36x50)', facing: 'Park Facing Corner', price: '₹31,00,000', status: 'Available', badge: 'Prime' },
    { plotNo: 'Plot B-206', colony: 'Ganga View Enclave', size: '1200 Sq Ft (30x40)', facing: 'East Facing', price: '₹20,50,000', status: 'Available', badge: 'Ready' },
    { plotNo: 'Plot C-310', colony: 'Royal Orchid Township', size: '2400 Sq Ft (40x60)', facing: 'Main 60-Ft Road', price: '₹42,00,000', status: 'Available', badge: 'Commercial' },
    { plotNo: 'Plot C-311', colony: 'Royal Orchid Township', size: '1500 Sq Ft (30x50)', facing: 'North-East', price: '₹26,50,000', status: 'Available', badge: 'Ready' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top Ribbon ── */}
      <div
        style={{
          background: 'linear-gradient(90deg, #064e3b 0%, #047857 50%, #065f46 100%)',
          color: '#ffffff',
          padding: '9px 2.5rem',
          fontSize: '12px',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ background: '#a7f3d0', color: '#064e3b', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 900 }}>
            100% RERA APPROVED
          </span>
          <span>🏡 Freehold Residential & Commercial Plots with Immediate Registry & Easy 12-60 Months EMI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#d1fae5' }}>
          <span>📍 Varanasi Expressway & Ring Road Junctions</span>
          <span>📞 Land Advisory: +91 98765 22334</span>
        </div>
      </div>

      {/* ── World-Class Real Estate Nav ── */}
      <nav
        style={{
          padding: '1.25rem 2.5rem',
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/plotting')}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 18px rgba(5, 150, 105, 0.35)',
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#064e3b', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              KASHI PLOTTING & COLONIES
            </div>
            <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: 800, letterSpacing: '0.1em', marginTop: '2px' }}>
              RESIDENTIAL TOWNSHIPS & FREEHOLD LANDS
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontWeight: 700, fontSize: '13.5px' }}>
          <span style={{ color: '#047857', cursor: 'pointer' }}>Colony Masterplans</span>
          <span style={{ color: '#475569', cursor: 'pointer' }}>Available Plot Inventory</span>
          <span style={{ color: '#475569', cursor: 'pointer' }}>EMI Calculator</span>
          <span style={{ color: '#475569', cursor: 'pointer' }}>Legal & Registry</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#f0fdf4',
              color: '#064e3b',
              border: '1.5px solid #bbf7d0',
              fontWeight: 800,
              fontSize: '12.5px',
              cursor: 'pointer',
            }}
          >
            ← Kashi Hub
          </button>
        </div>
      </nav>

      {/* ── Hero Showcase Section ── */}
      <section
        style={{
          position: 'relative',
          padding: '5rem 2.5rem 4.5rem',
          background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '3.5rem', alignItems: 'center' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#047857',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(4, 120, 87, 0.08)',
              }}
            >
              <Sparkles size={15} color="#059669" />
              <span>UPRERA Registered • Clear Mutation & Immediate Registry</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                color: '#064e3b',
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
              }}
            >
              Build Your Dream Home on Highway-Connected Prime Land
            </h1>

            <p style={{ fontSize: '1.12rem', color: '#475569', lineHeight: 1.65, maxWidth: '620px', marginBottom: '2.5rem' }}>
              Gated residential colonies with 60-ft blacktop roads, underground electricity, boundary demarcation, immediate registry, and transparent bank-approved EMI financing.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  const el = document.getElementById('inventory-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 900,
                  fontSize: '15px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
                }}
              >
                <span>Browse Available Plots</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('emi-calculator');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  color: '#064e3b',
                  border: '2px solid #bbf7d0',
                  fontWeight: 800,
                  fontSize: '15px',
                  cursor: 'pointer',
                }}
              >
                📊 Calculate Monthly EMI
              </button>
            </div>

            {/* Micro Stats */}
            <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid #d1fae5' }}>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#064e3b' }}>100%</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Title Verified & Freehold</div>
              </div>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#064e3b' }}>3</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>RERA Approved Townships</div>
              </div>
              <div>
                <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#064e3b' }}>44 Plots</div>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Ready for Possession</div>
              </div>
            </div>
          </div>

          {/* Right Image Showcase */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '480px',
                borderRadius: '24px',
                backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 20px 40px rgba(5, 150, 105, 0.2)',
                border: '4px solid #ffffff',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                background: '#ffffff',
                padding: '1rem 1.25rem',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#ecfdf5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>Direct Sub-Registrar Office Registry</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Zero Brokerage • 100% Legal Transparency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Townships Master Showcase ── */}
      <section style={{ padding: '4.5rem 2.5rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#064e3b', margin: '0 0 8px' }}>
            Featured Residential & Commercial Townships
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#64748b' }}>
            Explore our highway-connected smart colony projects in Varanasi and expressway corridors.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {coloniesList.map((col, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  height: '220px',
                  backgroundImage: `url("${col.img}")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    background: '#047857',
                    color: '#ffffff',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                  }}
                >
                  {col.plotsAvailable}
                </span>

                <span
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: '#f8fafc',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 900,
                  }}
                >
                  {col.startingPrice}
                </span>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', marginBottom: '4px' }}>
                    RERA: {col.reraNo}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
                    {col.colony}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '1.25rem' }}>
                    <MapPin size={14} color="#059669" />
                    <span>{col.location}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                    {col.highlights.map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155' }}>
                        <CheckCircle2 size={15} color="#059669" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    const el = document.getElementById('inventory-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    background: '#047857',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <span>View Plots in this Colony</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Available Plots Inventory Table Section ── */}
      <section id="inventory-section" style={{ padding: '4.5rem 2.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#064e3b', margin: '0 0 6px' }}>
              Immediate Possession Plot Inventory
            </h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>
              Live availability with dimensions, road facing, and transparent fixed pricing.
            </p>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '18px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.04)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#ecfdf5', borderBottom: '2px solid #bbf7d0', color: '#064e3b', fontWeight: 800 }}>
                    <th style={{ padding: '14px 18px' }}>Plot Number</th>
                    <th style={{ padding: '14px 18px' }}>Colony Township</th>
                    <th style={{ padding: '14px 18px' }}>Dimension & Area</th>
                    <th style={{ padding: '14px 18px' }}>Road Facing</th>
                    <th style={{ padding: '14px 18px' }}>Total Price</th>
                    <th style={{ padding: '14px 18px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {plotInventory.map((p, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 800, color: '#0f172a' }}>{p.plotNo}</td>
                      <td style={{ padding: '14px 18px', color: '#047857', fontWeight: 700 }}>{p.colony}</td>
                      <td style={{ padding: '14px 18px' }}>{p.size}</td>
                      <td style={{ padding: '14px 18px', color: '#64748b' }}>{p.facing}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 900, color: '#064e3b' }}>{p.price}</td>
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: 800,
                            background: p.status === 'Available' ? '#ecfdf5' : '#fef3c7',
                            color: p.status === 'Available' ? '#047857' : '#d97706',
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── Interactive EMI Calculator Section ── */}
      <section id="emi-calculator" style={{ padding: '4.5rem 2.5rem', maxWidth: '1000px', margin: '0 auto' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)',
            color: '#ffffff',
            borderRadius: '24px',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 40px rgba(6, 78, 59, 0.25)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
              Instant Plot EMI Calculator
            </h2>
            <p style={{ margin: 0, fontSize: '0.95rem', color: '#a7f3d0' }}>
              Estimate your monthly instalment for 12 to 60 months with zero penalty prepayment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#d1fae5', marginBottom: '6px' }}>
                Total Plot Price (₹)
              </label>
              <input
                type="number"
                value={plotPrice}
                onChange={(e) => setPlotPrice(Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', fontWeight: 800, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#d1fae5', marginBottom: '6px' }}>
                Down Payment (₹)
              </label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '1rem', fontWeight: 800, outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#d1fae5', marginBottom: '6px' }}>
                Tenure (Years: 1 to 5)
              </label>
              <select
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', background: '#064e3b', color: '#fff', fontSize: '1rem', fontWeight: 800, outline: 'none' }}
              >
                <option value={1}>1 Year (12 Months)</option>
                <option value={2}>2 Years (24 Months)</option>
                <option value={3}>3 Years (36 Months)</option>
                <option value={5}>5 Years (60 Months)</option>
              </select>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.9rem', color: '#a7f3d0', fontWeight: 700 }}>Estimated Monthly Instalment</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fef08a', margin: '6px 0' }}>
              ₹{calculateMonthlyEmi().toLocaleString()} / month
            </div>
            <div style={{ fontSize: '0.8rem', color: '#d1fae5' }}>
              Loan Amount: ₹{(plotPrice - downPayment).toLocaleString()} • Rate: {interestRate}% P.A. • No Hidden Charges
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#022c22', color: '#d1fae5', padding: '3.5rem 2.5rem 2rem' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem', marginBottom: '2.5rem' }}>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#ffffff', marginBottom: '8px' }}>KASHI REAL ESTATE PLOTTING</div>
            <p style={{ fontSize: '0.85rem', color: '#a7f3d0', lineHeight: 1.6, margin: 0 }}>
              Leading developer of RERA-approved gated townships, residential plots, and highway commercial spaces in Varanasi with direct sub-registrar office registration.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Site Office Address</div>
            <div style={{ fontSize: '0.85rem', color: '#a7f3d0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>📍 Green Valley Complex, Varanasi-Prayagraj 6-Lane Expressway</div>
              <div>📞 Phone: +91 98765 22334 / 0542-221199</div>
              <div>✉️ Email: sales@kashiplotting.com</div>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', marginBottom: '12px' }}>Office Hours</div>
            <div style={{ fontSize: '0.85rem', color: '#a7f3d0', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Monday - Sunday: 09:00 AM - 07:00 PM</div>
              <div>Site Visits: Daily free cab pick-and-drop from Varanasi Cantt</div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '12px', color: '#a7f3d0' }}>
          © 2026 Kashi Real Estate Plotting & Colonies. Real Estate Division of Kashi Service Enterprise Ecosystem.
        </div>
      </footer>
    </div>
  );
}
