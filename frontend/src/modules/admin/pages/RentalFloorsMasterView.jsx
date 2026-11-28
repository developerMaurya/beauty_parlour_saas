/**
 * @file RentalFloorsMasterView.jsx
 * @description Master Administration Cockpit for Commercial Floors, Halls (Length x Width x Height), Physical Specs & Residential Brokerage.
 * Fully integrates dynamic backend REST endpoints from /api/v1/rent/*
 * Features:
 *   1. 🏢 Building Floors Master (Ground Floor, 1st, 2nd, Basement, Rooftop Terrace)
 *   2. 🏛️ Commercial Halls (Length × Width × Height physical dimensions calculator, Sadak/Highway specs, Amenities, Contact, Photos)
 *   3. 🏡 Residential Rental Range & Brokerage Commission Tracking (Tenant details, rent, brokerage amount)
 * @module frontend/src/modules/admin/pages/RentalFloorsMasterView
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building,
  Layers,
  Home,
  Plus,
  Trash2,
  Phone,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  DollarSign,
  Maximize2,
  Camera,
  ExternalLink,
  ShieldCheck,
  FileText,
  Zap,
  Eye,
  Receipt,
  X,
  Check,
} from 'lucide-react';
import { rentalFloorsFetcher } from '../../../services/api/admin/adminApi.js';

export default function RentalFloorsMasterView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'halls';

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const [floors, setFloors] = useState([]);
  const [halls, setHalls] = useState([]);
  const [rentals, setRentals] = useState([]);

  // Modals State
  const [hallModalOpen, setHallModalOpen] = useState(false);
  const [hallForm, setHallForm] = useState({
    title: '',
    floorId: 'flr_ground',
    floorName: 'Ground Floor',
    lengthFt: '60',
    widthFt: '40',
    heightFt: '14',
    monthlyRent: '85000',
    securityDeposit: '255000',
    locationSpecs: 'Main 60ft Wide Commercial Highway Frontage',
    landmark: 'Near Cantt Junction, Varanasi',
    amenitiesStr: '3-Phase Heavy Electric Power, Capsule Lift, Fire Sprinklers, Covered Parking',
    contactPerson: 'Rajesh Kumar (Leasing Manager)',
    contactPhone: '9839014567',
    contactEmail: 'rentals@kashiservice.com',
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  });

  const [floorModalOpen, setFloorModalOpen] = useState(false);
  const [floorName, setFloorName] = useState('');
  const [floorArea, setFloorArea] = useState('5000');

  const [resModalOpen, setResModalOpen] = useState(false);
  const [resForm, setResForm] = useState({
    houseName: '',
    propertyType: 'HOUSE', // 'HOUSE' | 'OFFICE' | 'GODAM'
    location: 'Ravindrapuri, Varanasi',
    tenantName: '',
    tenantPhone: '',
    tenantEmail: '',
    bookingDate: new Date().toISOString().split('T')[0],
    checkInDate: new Date().toISOString().split('T')[0],
    bookingMonth: 'November 2026',
    monthlyRent: '25000',
    securityDeposit: '50000',
    advancePaid: '25000',
    meterUnitRate: '10',
    initialMeterReading: '1200',
    brokerageCommissionType: '1 Month Rent',
    brokerageAmount: '25000',
  });

  // Monthly Payment & Meter Reading Modal State
  const [payModalProperty, setPayModalProperty] = useState(null);
  const [payForm, setPayForm] = useState({
    month: 'Current Month',
    rentAmount: '25000',
    rentPaid: '25000',
    prevMeterReading: '1200',
    newMeterReading: '1450',
    meterRatePerUnit: '10',
    electricityPaid: '2500',
    advanceAdjusted: '0',
    paymentMode: 'UPI (PhonePe / GPay)',
  });

  // Selected Property for Full Ledger Drawer
  const [selectedLedgerProperty, setSelectedLedgerProperty] = useState(null);

  const loadData = async () => {
    try {
      const [flrsRes, hlsRes, resRes] = await Promise.all([
        rentalFloorsFetcher.listFloors().catch(() => ({ data: { floors: [] } })),
        rentalFloorsFetcher.listHalls().catch(() => ({ data: { halls: [] } })),
        rentalFloorsFetcher.listResidentialRentals().catch(() => ({ data: { rentals: [] } })),
      ]);
      if (flrsRes?.data?.floors) setFloors(flrsRes.data.floors);
      if (hlsRes?.data?.halls) setHalls(hlsRes.data.halls);
      if (resRes?.data?.rentals) setRentals(resRes.data.rentals);
    } catch (e) {
      console.warn('Rental load fallback:', e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddFloor = async (e) => {
    e.preventDefault();
    if (!floorName) return;
    try {
      const res = await rentalFloorsFetcher.createFloor({ name: floorName, totalAreaSqFt: floorArea });
      if (res?.data) {
        setFloors((prev) => [...prev, res.data]);
        setFloorModalOpen(false);
        setFloorName('');
        showToast('New floor added successfully!');
      }
    } catch (err) {
      showToast('Error adding floor');
    }
  };

  const handleAddHall = async (e) => {
    e.preventDefault();
    try {
      const amens = hallForm.amenitiesStr.split(',').map((a) => a.trim()).filter(Boolean);
      const res = await rentalFloorsFetcher.createHall({
        ...hallForm,
        amenities: amens,
        photos: [hallForm.photoUrl],
      });
      if (res?.data) {
        setHalls((prev) => [res.data, ...prev]);
        setHallModalOpen(false);
        showToast('Commercial Hall created with dimensions!');
      }
    } catch (err) {
      showToast('Error creating hall');
    }
  };

  const handleDeleteHall = async (id) => {
    if (window.confirm('Delete this commercial hall?')) {
      await rentalFloorsFetcher.deleteHall(id);
      setHalls((prev) => prev.filter((h) => h.id !== id));
      showToast('Hall removed');
    }
  };

  const handleAddResidential = async (e) => {
    e.preventDefault();
    try {
      const res = await rentalFloorsFetcher.createResidentialRental(resForm);
      if (res?.data) {
        setRentals((prev) => [res.data, ...prev]);
        setResModalOpen(false);
        showToast('Property booked with advance payment and check-in date recorded!');
      }
    } catch (err) {
      showToast('Error recording rental');
    }
  };

  const handleOpenPayModal = (property) => {
    setPayModalProperty(property);
    const prevReading = property.electricityBillingCycle?.currentReading || 1200;
    const estNew = prevReading + 200;
    const rate = property.meterUnitRate || 10;
    const estBill = (estNew - prevReading) * rate;

    setPayForm({
      month: `${new Date().toLocaleString('en-US', { month: 'long' })} 2026`,
      rentAmount: String(property.monthlyRent || 25000),
      rentPaid: String(property.monthlyRent || 25000),
      prevMeterReading: String(prevReading),
      newMeterReading: String(estNew),
      meterRatePerUnit: String(rate),
      electricityPaid: String(estBill),
      advanceAdjusted: '0',
      paymentMode: 'UPI (PhonePe / GPay)',
    });
  };

  const handleRecordMonthlyPayment = async (e) => {
    e.preventDefault();
    if (!payModalProperty) return;
    try {
      const res = await rentalFloorsFetcher.recordMonthlyRentalPayment(payModalProperty.id, payForm);
      if (res?.data?.property) {
        setRentals((prev) => prev.map((r) => (r.id === payModalProperty.id ? res.data.property : r)));
        showToast('Monthly rent & electricity calculation recorded in ledger!');
        setPayModalProperty(null);
      }
    } catch (err) {
      showToast('Error recording monthly payment');
    }
  };

  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif', color: '#0f172a', background: '#f8fafc', minHeight: '100vh', padding: '1.5rem', width: '100%' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', zIndex: 99999 }}>
          ✅ {toastMessage}
        </div>
      )}

      {/* Header */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.25rem 1.5rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                Kashi Commercial Floors, Halls & Rental Master
              </h1>
              <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                Commercial Leases & Brokerage
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
              Physical Dimensions (Length × Width × Clearance Height), Road Frontage specs, and Residential Brokerage.
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '6px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {[
          { id: 'halls', label: '🏛️ Commercial Halls (L × W × H)', count: halls.length },
          { id: 'floors', label: '🏢 Building Floors Master', count: floors.length },
          { id: 'residential', label: '🏡 Residential House & Brokerage', count: rentals.length },
        ].map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setSearchParams({ tab: t.id })}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? '#0284c7' : 'transparent',
                color: isActive ? '#ffffff' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <span>{t.label}</span>
              <span style={{ fontSize: '10px', background: isActive ? 'rgba(255,255,255,0.25)' : '#f1f5f9', color: isActive ? '#fff' : '#0f172a', padding: '1px 6px', borderRadius: '10px', fontWeight: 800 }}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: COMMERCIAL HALLS ── */}
      {activeTab === 'halls' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Commercial Exhibition Halls & Office Suites</h2>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                Accurate physical measurements: Length (ft) × Width (ft) × Ceiling Height (ft), total carpet area, and road specifications.
              </p>
            </div>
            <button
              onClick={() => setHallModalOpen(true)}
              style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Plus size={16} />
              <span>+ Add Commercial Hall</span>
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
            {halls.map((h) => (
              <div key={h.id} style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {h.photos && h.photos[0] && (
                  <div style={{ height: '170px', width: '100%', overflow: 'hidden', position: 'relative' }}>
                    <img src={h.photos[0]} alt={h.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      {h.floorName}
                    </span>
                  </div>
                )}
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{h.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '10px' }}>
                    <MapPin size={13} color="#0284c7" />
                    <span>{h.locationSpecs}</span>
                  </div>

                  {/* Physical Dimensions Pill */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '12px', textAlign: 'center' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Length</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>{h.lengthFt} Ft</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Width</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>{h.widthFt} Ft</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Height</div>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#0284c7' }}>{h.heightFt} Ft</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#0f172a', fontWeight: 800, marginBottom: '6px' }}>
                    Total Carpet Area: <span style={{ color: '#059669' }}>{h.totalCarpetSqFt?.toLocaleString()} Sq.Ft</span>
                  </div>

                  {/* Amenities */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px' }}>
                    {h.amenities && h.amenities.map((am, i) => (
                      <div key={i} style={{ fontSize: '11.5px', color: '#334155', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={12} color="#059669" />
                        <span>{am}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <div>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>₹{h.monthlyRent?.toLocaleString()}</span>
                      <span style={{ fontSize: '11.5px', color: '#64748b' }}> / month</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Security: ₹{h.securityDeposit?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ padding: '10px 1.25rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '11.5px', color: '#334155', fontWeight: 600 }}>
                    👤 {h.contactPerson} ({h.contactPhone})
                  </div>
                  <button onClick={() => handleDeleteHall(h.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: BUILDING FLOORS MASTER ── */}
      {activeTab === 'floors' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Building Floors Master (Ground, 1st, 2nd, Rooftop)</h2>
            <button
              onClick={() => setFloorModalOpen(true)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
            >
              + Add Floor
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {floors.map((flr) => (
              <div key={flr.id} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.25rem' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>
                  {flr.code}
                </span>
                <h4 style={{ margin: '8px 0 4px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{flr.name}</h4>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Total Floor Area: <strong>{flr.totalAreaSqFt} Sq.Ft</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: RESIDENTIAL HOUSE, OFFICE, GODAM & ELECTRICITY BILLING ── */}
      {activeTab === 'residential' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Rental Tenancy, Advance Booking & Electricity Meter Billing Engine</h2>
                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  Units & Diff Auto-Calculated
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#64748b' }}>
                Track House, Office & Godam rentals: Advance paid, Check-in date, Purana & Naya digital meter readings, unit rate (₹10/₹12), and complete monthly ledger history.
              </p>
            </div>
            <button
              onClick={() => setResModalOpen(true)}
              style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 700, fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Book House / Office / Godam
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Property & Type</th>
                  <th style={{ padding: '12px 16px' }}>Tenant & Contact</th>
                  <th style={{ padding: '12px 16px' }}>Booking & Check-in Date</th>
                  <th style={{ padding: '12px 16px' }}>Rent & Advance Status</th>
                  <th style={{ padding: '12px 16px' }}>Digital Electricity Meter</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rentals.map((r) => {
                  const bill = r.electricityBillingCycle || {};
                  const typeColors = {
                    House: { bg: '#e0f2fe', text: '#0369a1' },
                    Office: { bg: '#fef3c7', text: '#92400e' },
                    Godam: { bg: '#f3e8ff', text: '#7e22ce' },
                  };
                  const color = typeColors[r.propertyType] || typeColors.House;

                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', background: color.bg, color: color.text, padding: '2px 6px', borderRadius: '4px' }}>
                            {r.propertyType || 'House'}
                          </span>
                          <span style={{ fontWeight: 800, color: '#0f172a' }}>{r.houseName}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>📍 {r.location}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{r.tenantName}</div>
                        <div style={{ fontSize: '11px', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Phone size={11} /> {r.tenantPhone}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '11.5px', color: '#475569' }}>
                          <span style={{ fontWeight: 600 }}>Booked:</span> {r.bookingDate || '2026-11-20'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>
                          <span>Check-in:</span> {r.checkInDate || '2026-12-01'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 900, color: '#059669', fontSize: '13px' }}>
                          ₹{r.monthlyRent?.toLocaleString()} <span style={{ fontSize: '10.5px', fontWeight: 500, color: '#64748b' }}>/ month</span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#0284c7', fontWeight: 700 }}>
                          Advance Paid: ₹{r.advancePaid?.toLocaleString() || 0}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>
                          Sec. Deposit: ₹{r.securityDeposit?.toLocaleString()}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Zap size={13} color="#f59e0b" />
                          <span style={{ fontWeight: 800, fontSize: '12px', color: '#0f172a' }}>
                            {bill.currentReading ?? 1400} Units
                          </span>
                          <span style={{ fontSize: '10.5px', background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                            @₹{r.meterUnitRate || 10}/u
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                          Prev: {bill.previousReading ?? 1200} | Bill: <span style={{ fontWeight: 700, color: '#dc2626' }}>₹{bill.billAmount?.toLocaleString() ?? 2000}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenPayModal(r)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#15803d', fontWeight: 700, fontSize: '11.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Receipt size={12} /> + Record Rent & Meter Bill
                          </button>
                          <button
                            onClick={() => setSelectedLedgerProperty(r)}
                            style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#ffffff', color: '#0284c7', fontWeight: 700, fontSize: '11.5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} /> Ledger
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD COMMERCIAL HALL ── */}
      {hallModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 800 }}>+ Add Commercial Hall with Dimensions</h3>
            <form onSubmit={handleAddHall} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Hall Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ground Floor Mega Exhibition Hall"
                  value={hallForm.title}
                  onChange={(e) => setHallForm({ ...hallForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Floor Assignment</label>
                  <select
                    value={hallForm.floorId}
                    onChange={(e) => {
                      const sel = floors.find((f) => f.id === e.target.value);
                      setHallForm({ ...hallForm, floorId: e.target.value, floorName: sel?.name || 'Custom' });
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  >
                    {floors.map((flr) => (
                      <option key={flr.id} value={flr.id}>{flr.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={hallForm.monthlyRent}
                    onChange={(e) => setHallForm({ ...hallForm, monthlyRent: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* Physical Dimensions: Length, Width, Height */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Length (Ft) *</label>
                  <input
                    type="number"
                    required
                    placeholder="60"
                    value={hallForm.lengthFt}
                    onChange={(e) => setHallForm({ ...hallForm, lengthFt: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Width (Ft) *</label>
                  <input
                    type="number"
                    required
                    placeholder="40"
                    value={hallForm.widthFt}
                    onChange={(e) => setHallForm({ ...hallForm, widthFt: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Height / Clearance (Ft)</label>
                  <input
                    type="number"
                    placeholder="14"
                    value={hallForm.heightFt}
                    onChange={(e) => setHallForm({ ...hallForm, heightFt: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Sadak / Road Location & Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. 60ft Main Highway Road, 200m from Station"
                  value={hallForm.locationSpecs}
                  onChange={(e) => setHallForm({ ...hallForm, locationSpecs: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Features & Amenities (Comma separated)</label>
                <input
                  type="text"
                  value={hallForm.amenitiesStr}
                  onChange={(e) => setHallForm({ ...hallForm, amenitiesStr: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Contact Person</label>
                  <input
                    type="text"
                    value={hallForm.contactPerson}
                    onChange={(e) => setHallForm({ ...hallForm, contactPerson: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                  <input
                    type="tel"
                    value={hallForm.contactPhone}
                    onChange={(e) => setHallForm({ ...hallForm, contactPhone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Interior / Layout Photo URL</label>
                <input
                  type="url"
                  value={hallForm.photoUrl}
                  onChange={(e) => setHallForm({ ...hallForm, photoUrl: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setHallModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Commercial Hall
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD FLOOR ── */}
      {floorModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '420px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.2rem', fontWeight: 800 }}>+ Add Floor Master</h3>
            <form onSubmit={handleAddFloor} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Floor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3rd Floor Penthouse"
                  value={floorName}
                  onChange={(e) => setFloorName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Total Floor Area (Sq.Ft)</label>
                <input
                  type="number"
                  value={floorArea}
                  onChange={(e) => setFloorArea(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setFloorModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Save Floor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD RESIDENTIAL / OFFICE / GODAM RENTAL ── */}
      {resModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '580px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>+ Book House / Office / Godam</h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>Record advance booking, check-in date and electricity meter baseline.</p>
              </div>
              <button onClick={() => setResModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddResidential} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Property Type *</label>
                  <select
                    value={resForm.propertyType}
                    onChange={(e) => setResForm({ ...resForm, propertyType: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                  >
                    <option value="House">Residential House / Flat</option>
                    <option value="Office">Commercial Office Space</option>
                    <option value="Godam">Logistics Godam / Warehouse</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Property Name / Unit # *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ganga View House #102 / Godam-A"
                    value={resForm.houseName}
                    onChange={(e) => setResForm({ ...resForm, houseName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Property Location / Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ring Road Bypass, Near Sarnath"
                  value={resForm.location}
                  onChange={(e) => setResForm({ ...resForm, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tenant Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Maurya"
                    value={resForm.tenantName}
                    onChange={(e) => setResForm({ ...resForm, tenantName: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Tenant Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9839123456"
                    value={resForm.tenantPhone}
                    onChange={(e) => setResForm({ ...resForm, tenantPhone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              {/* Dates & Advance */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#475569' }}>Booking Date</label>
                  <input
                    type="date"
                    value={resForm.bookingDate}
                    onChange={(e) => setResForm({ ...resForm, bookingDate: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#059669' }}>Check-in Date *</label>
                  <input
                    type="date"
                    required
                    value={resForm.checkInDate}
                    onChange={(e) => setResForm({ ...resForm, checkInDate: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#0284c7' }}>Advance Paid (₹)</label>
                  <input
                    type="number"
                    value={resForm.advancePaid}
                    onChange={(e) => setResForm({ ...resForm, advancePaid: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', fontWeight: 700 }}
                  />
                </div>
              </div>

              {/* Financials & Electricity Meter */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Monthly Rent (₹) *</label>
                  <input
                    type="number"
                    required
                    value={resForm.monthlyRent}
                    onChange={(e) => setResForm({ ...resForm, monthlyRent: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 800, color: '#059669' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={resForm.securityDeposit}
                    onChange={(e) => setResForm({ ...resForm, securityDeposit: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                  />
                </div>
              </div>

              <div style={{ background: '#fffbeb', padding: '12px', borderRadius: '10px', border: '1px solid #fde68a', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#92400e' }}>Initial Meter Reading (Old)</label>
                  <input
                    type="number"
                    value={resForm.initialMeterReading}
                    onChange={(e) => setResForm({ ...resForm, initialMeterReading: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fcd34d', fontSize: '12px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '4px', color: '#92400e' }}>Meter Rate per Unit (₹/Unit)</label>
                  <input
                    type="number"
                    value={resForm.meterUnitRate}
                    onChange={(e) => setResForm({ ...resForm, meterUnitRate: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fcd34d', fontSize: '12px', fontWeight: 700 }}
                  />
                  <span style={{ fontSize: '10.5px', color: '#b45309' }}>Standard ₹10/unit or ₹12/commercial</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setResModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#059669', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                >
                  Confirm Booking & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: RECORD MONTHLY RENT & ELECTRICITY METER BILL ── */}
      {payModalProperty && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '620px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Record Rent & Digital Electricity Meter Bill</h3>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Tenant: <span style={{ fontWeight: 700, color: '#0f172a' }}>{payModalProperty.tenantName}</span> | Property: {payModalProperty.houseName}
                </div>
              </div>
              <button onClick={() => setPayModalProperty(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {(() => {
              const oldReading = parseFloat(payForm.prevMeterReading) || 0;
              const newReading = parseFloat(payForm.newMeterReading) || 0;
              const rate = parseFloat(payForm.meterRatePerUnit) || 10;
              const unitsConsumed = Math.max(0, newReading - oldReading);
              const calculatedElecBill = unitsConsumed * rate;
              const rentDue = parseFloat(payForm.rentAmount) || 0;
              const rentPaid = parseFloat(payForm.rentPaid) || 0;
              const elecPaid = parseFloat(payForm.electricityPaid) || 0;
              const advAdjust = parseFloat(payForm.advanceAdjusted) || 0;
              const totalDue = rentDue + calculatedElecBill;
              const totalPaid = rentPaid + elecPaid + advAdjust;
              const balanceDue = totalDue - totalPaid;

              return (
                <form onSubmit={handleRecordMonthlyPayment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Billing Month *</label>
                      <input
                        type="text"
                        required
                        value={payForm.month}
                        onChange={(e) => setPayForm({ ...payForm, month: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Payment Mode</label>
                      <select
                        value={payForm.paymentMode}
                        onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="UPI (PhonePe / GPay)">UPI (PhonePe / GPay)</option>
                        <option value="Direct Bank Transfer NEFT/IMPS">Direct Bank Transfer NEFT/IMPS</option>
                        <option value="Cash Payment">Cash Payment</option>
                        <option value="Bank Cheque">Bank Cheque</option>
                      </select>
                    </div>
                  </div>

                  {/* Electricity Meter Calculator Box */}
                  <div style={{ background: '#fffbeb', borderRadius: '12px', border: '1px solid #fde68a', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <Zap size={16} color="#d97706" />
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#92400e' }}>
                        Digital Electricity Meter Calculation Engine
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '4px' }}>
                          Old Meter Reading
                        </label>
                        <input
                          type="number"
                          value={payForm.prevMeterReading}
                          onChange={(e) => setPayForm({ ...payForm, prevMeterReading: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fcd34d', fontWeight: 700 }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '4px' }}>
                          New Digital Reading *
                        </label>
                        <input
                          type="number"
                          required
                          value={payForm.newMeterReading}
                          onChange={(e) => {
                            const val = e.target.value;
                            const newR = parseFloat(val) || 0;
                            const oldR = parseFloat(payForm.prevMeterReading) || 0;
                            const r = parseFloat(payForm.meterRatePerUnit) || 10;
                            const cUnits = Math.max(0, newR - oldR);
                            setPayForm({
                              ...payForm,
                              newMeterReading: val,
                              electricityPaid: String(cUnits * r),
                            });
                          }}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '2px solid #f59e0b', fontWeight: 800, background: '#fff' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#78350f', display: 'block', marginBottom: '4px' }}>
                          Rate per Unit (₹)
                        </label>
                        <input
                          type="number"
                          value={payForm.meterRatePerUnit}
                          onChange={(e) => setPayForm({ ...payForm, meterRatePerUnit: e.target.value })}
                          style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #fcd34d', fontWeight: 700 }}
                        />
                      </div>
                    </div>

                    {/* Auto Calculation formula banner */}
                    <div style={{ marginTop: '10px', background: '#ffffff', borderRadius: '8px', padding: '8px 12px', border: '1px dashed #f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#78350f' }}>
                        <strong>Formula:</strong> ({newReading} - {oldReading}) = <strong>{unitsConsumed} Units</strong> × ₹{rate}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#b45309' }}>
                        Electricity Bill = ₹{calculatedElecBill.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Rent and Payment amounts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Monthly Rent Due (₹)</label>
                      <input
                        type="number"
                        value={payForm.rentAmount}
                        onChange={(e) => setPayForm({ ...payForm, rentAmount: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700 }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Rent Amount Paid (₹)</label>
                      <input
                        type="number"
                        value={payForm.rentPaid}
                        onChange={(e) => setPayForm({ ...payForm, rentPaid: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#059669' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Electricity Bill Paid (₹)</label>
                      <input
                        type="number"
                        value={payForm.electricityPaid}
                        onChange={(e) => setPayForm({ ...payForm, electricityPaid: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 700, color: '#b45309' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Adjust from Advance (₹)</label>
                      <input
                        type="number"
                        value={payForm.advanceAdjusted}
                        onChange={(e) => setPayForm({ ...payForm, advanceAdjusted: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                      />
                    </div>
                  </div>

                  {/* Summary Totals */}
                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Total Due (Rent + Electricity)</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#0f172a' }}>₹{totalDue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Total Paid Now</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#059669' }}>₹{totalPaid.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Pending Balance</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: balanceDue > 0 ? '#dc2626' : '#059669' }}>
                        {balanceDue > 0 ? `₹${balanceDue.toLocaleString()} Pending` : '✅ Fully Cleared'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setPayModalProperty(null)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Post Payment & Update Ledger
                    </button>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* ── MODAL: TENANT PAYMENT & METER LEDGER DRAWER ── */}
      {selectedLedgerProperty && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '780px', padding: '1.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Complete Tenant Payment & Meter Ledger</h3>
                  <span style={{ fontSize: '11px', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                    {selectedLedgerProperty.propertyType || 'House'}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                  Tenant: <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedLedgerProperty.tenantName}</span> ({selectedLedgerProperty.tenantPhone}) | Check-in: <span style={{ fontWeight: 700, color: '#059669' }}>{selectedLedgerProperty.checkInDate || '2026-12-01'}</span>
                </div>
              </div>
              <button onClick={() => setSelectedLedgerProperty(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}>
                <X size={22} />
              </button>
            </div>

            {/* Quick stats banner */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '1rem' }}>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Monthly Rent</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#059669' }}>₹{selectedLedgerProperty.monthlyRent?.toLocaleString()}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Advance Paid</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#0284c7' }}>₹{selectedLedgerProperty.advancePaid?.toLocaleString() || 0}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Current Meter</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#b45309' }}>{selectedLedgerProperty.electricityBillingCycle?.currentReading || 1400} Units</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Unit Rate</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#78350f' }}>₹{selectedLedgerProperty.meterUnitRate || 10} / unit</div>
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px 12px' }}>Month</th>
                    <th style={{ padding: '10px 12px' }}>Rent Paid</th>
                    <th style={{ padding: '10px 12px' }}>Meter Reading</th>
                    <th style={{ padding: '10px 12px' }}>Units (New - Old)</th>
                    <th style={{ padding: '10px 12px' }}>Electricity Paid</th>
                    <th style={{ padding: '10px 12px' }}>Adv Adjusted</th>
                    <th style={{ padding: '10px 12px' }}>Balance</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedLedgerProperty.ledgerHistory || []).map((entry, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{entry.month}</td>
                      <td style={{ padding: '10px 12px', color: '#059669', fontWeight: 800 }}>₹{entry.rentPaid?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b' }}>
                        {entry.prevReading} ➔ <strong style={{ color: '#0f172a' }}>{entry.newReading}</strong>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#b45309' }}>{entry.unitsConsumed} units</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: '#b45309' }}>₹{entry.electricityPaid?.toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', color: '#0284c7' }}>₹{entry.advanceAdjusted?.toLocaleString() || 0}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: entry.pendingBalance > 0 ? '#dc2626' : '#059669' }}>
                        ₹{entry.pendingBalance?.toLocaleString() || 0}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '10.5px', background: entry.status === 'Fully Paid' ? '#dcfce7' : '#fef3c7', color: entry.status === 'Fully Paid' ? '#15803d' : '#92400e', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                onClick={() => setSelectedLedgerProperty(null)}
                style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
