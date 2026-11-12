/**
 * @file StaffPlottingDashboardPage.jsx
 * @description Dedicated Staff Dashboard for Plotting & Real Estate Field Officers & Sales Executives.
 * Features site visit schedules, plot availability matrix, token booking pipeline, and commission tracking.
 * @module frontend/src/modules/staff/pages/StaffPlottingDashboardPage
 */

import React, { useState } from 'react';
import {
  Home,
  MapPin,
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Search,
  Filter,
  DollarSign,
  Car,
  Compass,
  FileCheck,
} from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffPlottingDashboardPage() {
  const { staffUser } = useStaff();

  const [activeTab, setActiveTab] = useState('TODAY_VISITS');
  const [selectedColony, setSelectedColony] = useState('ALL');

  // Today's Scheduled Site Visits
  const todayVisits = [
    {
      id: 'VISIT-101',
      client: 'Dr. Ramesh Chandra Gupta',
      phone: '+91 94152 77889',
      colony: 'Kashi Smart Enclave, Phase 2',
      plotInterested: 'Plot #B-14 (Corner, 1800 sq.ft)',
      timeSlot: '11:00 AM – 12:30 PM',
      pickupNeeded: true,
      pickupLocation: 'Cantt Railway Station, Varanasi',
      status: 'CONFIRMED',
      leadStage: 'Ready for Token Advance',
      budget: '₹42,00,000',
    },
    {
      id: 'VISIT-102',
      client: 'Ananya & Rohit Srivastava',
      phone: '+91 98390 12345',
      colony: 'Ganga Vihar Residency, Chunar Rd',
      plotInterested: 'Plot #A-07 (East-facing, 1200 sq.ft)',
      timeSlot: '03:30 PM – 05:00 PM',
      pickupNeeded: false,
      pickupLocation: 'Direct Site Arrival',
      status: 'IN_TRANSIT',
      leadStage: 'First Time Visit',
      budget: '₹26,50,000',
    },
    {
      id: 'VISIT-103',
      client: 'Sunil Kumar Maurya',
      phone: '+91 88401 99221',
      colony: 'Anand Green Valley, Ring Road Ph-1',
      plotInterested: 'Commercial Plot #C-02 (2400 sq.ft)',
      timeSlot: '05:30 PM – 06:30 PM',
      pickupNeeded: true,
      pickupLocation: 'Babatpur Airport Road Roundabout',
      status: 'UPCOMING',
      leadStage: 'Commercial Investment',
      budget: '₹68,00,000',
    },
  ];

  // Plot Matrix Stats
  const plotStats = [
    { label: 'Total Enclave Plots', value: '148', color: '#38bdf8' },
    { label: 'Available for Sale', value: '42', color: '#4ade80' },
    { label: 'Token Advance Held', value: '18', color: '#facc15' },
    { label: 'Registry Closed (This Mo)', value: '12', color: '#c084fc' },
  ];

  // Hot Available Inventory
  const hotInventory = [
    {
      colony: 'Kashi Smart Enclave',
      plotNo: 'Plot #B-12',
      facing: 'North-East Corner',
      size: '1500 sq.ft',
      dimension: '30 x 50 ft',
      rate: '₹2,400 / sq.ft',
      total: '₹36,00,000',
      status: 'READY_TO_BOOK',
    },
    {
      colony: 'Ganga Vihar Residency',
      plotNo: 'Plot #C-04',
      facing: 'East Facing (Park View)',
      size: '1200 sq.ft',
      dimension: '25 x 48 ft',
      rate: '₹2,150 / sq.ft',
      total: '₹25,80,000',
      status: 'HOT_DEAL',
    },
    {
      colony: 'Anand Green Valley',
      plotNo: 'Commercial #C-01',
      facing: 'Main 60ft Wide Highway',
      size: '3000 sq.ft',
      dimension: '40 x 75 ft',
      rate: '₹3,200 / sq.ft',
      total: '₹96,00,000',
      status: 'HIGH_DEMAND',
    },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── Top Plotting Hero Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '18px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.35)',
            }}
          >
            🏡
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
                Plotting & Real Estate Field Desk
              </h1>
              <span
                style={{
                  background: 'rgba(16, 185, 129, 0.25)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.5px',
                }}
              >
                LIVE AGENT
              </span>
            </div>
            <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '14px' }}>
              Logged in as <strong style={{ color: '#fff' }}>{staffUser?.name || 'Real Estate Sales Officer'}</strong> • Assigned Vertical: <strong>Plotting & Real Estate</strong>
            </p>
          </div>
        </div>

        {/* Quick Commission Stats Pill */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              Plots Closed (Month)
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#4ade80' }}>
              4 Units
            </div>
          </div>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '12px 18px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>
              Earned Commission
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#facc15' }}>
              ₹1,45,000
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {plotStats.map((st, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {st.label}
            </span>
            <span style={{ fontSize: '28px', fontWeight: '900', color: st.color }}>
              {st.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Main Two Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Left Column: Scheduled Site Visits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Calendar className="w-5 h-5 text-emerald-400" />
              Today's Colony Site Visits ({todayVisits.length})
            </h2>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {todayVisits.map((visit) => (
              <div
                key={visit.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>{visit.client}</span>
                      <span
                        style={{
                          background:
                            visit.status === 'CONFIRMED'
                              ? 'rgba(52, 211, 153, 0.2)'
                              : visit.status === 'IN_TRANSIT'
                              ? 'rgba(245, 158, 11, 0.2)'
                              : 'rgba(148, 163, 184, 0.2)',
                          color:
                            visit.status === 'CONFIRMED'
                              ? '#34d399'
                              : visit.status === 'IN_TRANSIT'
                              ? '#fbbf24'
                              : '#94a3b8',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}
                      >
                        {visit.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '13px', color: '#94a3b8' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {visit.timeSlot}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {visit.phone}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Target Budget</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#4ade80' }}>{visit.budget}</div>
                  </div>
                </div>

                {/* Colony & Interested Plot Info */}
                <div
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>{visit.colony}</div>
                      <div style={{ fontSize: '12px', color: '#38bdf8' }}>{visit.plotInterested}</div>
                    </div>
                  </div>

                  {visit.pickupNeeded && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: '#fbbf24',
                        background: 'rgba(245, 158, 11, 0.1)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                      }}
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Cab Pick-up: {visit.pickupLocation}</span>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <a
                    href={`tel:${visit.phone.replace(/[^0-9]/g, '')}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#e2e8f0',
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Buyer
                  </a>
                  <button
                    type="button"
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: '#fff',
                      border: 'none',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <FileCheck className="w-3.5 h-3.5" /> Site Visit Check-in
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Hot Inventory & Token Booking Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Actions Panel */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Real Estate Sales Actions
            </h3>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              + Create Token Booking (₹51K)
            </button>
            <button
              type="button"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#e2e8f0',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              Download Master Layout Map PDF
            </button>
          </div>

          {/* Hot Fast-Selling Plot Inventory */}
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers className="w-4 h-4 text-emerald-400" />
              Hot Plot Inventory (Fast Deal)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {hotInventory.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    borderRadius: '10px',
                    padding: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#4ade80' }}>{item.plotNo}</span>
                    <span style={{ fontSize: '11px', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                      {item.facing}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>{item.colony}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', color: '#94a3b8' }}>
                    <span>{item.size} • {item.rate}</span>
                    <strong style={{ color: '#fff' }}>{item.total}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

