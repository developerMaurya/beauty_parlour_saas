/**
 * @file StaffEventDashboardPage.jsx
 * @description Dedicated Staff Dashboard for Jaygurudev Event & Management.
 * Tailored for Event Operations Leads, Decorators, Sound/Lighting Crew, and Stage Hands.
 * @module frontend/src/modules/staff/pages/StaffEventDashboardPage
 */

import React, { useState } from 'react';
import {
  PartyPopper,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Users,
  Flame,
  Calendar,
  Volume2,
  Sparkles,
  Phone,
  Layers,
  ChevronRight,
  ClipboardList,
} from 'lucide-react';
import { useStaff } from '../../../context/StaffContext.jsx';

export default function StaffEventDashboardPage() {
  const { staffUser } = useStaff();

  const [activeShift, setActiveShift] = useState('ON_SITE'); // 'ON_SITE', 'TRANSIT', 'COMPLETED'
  const [equipmentChecked, setEquipmentChecked] = useState({
    truss: true,
    lights: true,
    pyro: false,
    smoke: true,
    flowers: true,
    sound: true,
  });

  const toggleEquipment = (key) => {
    setEquipmentChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const todayEvents = [
    {
      id: 'EVT-2026-001',
      title: 'Grand Royal Wedding Mandap & Floral Tunnel',
      client: 'Sunil Singhania & Family',
      phone: '+91 98234 11223',
      venue: 'Shri Ram Lawn & Banquets, Varanasi',
      timeSlot: '04:00 PM – 11:30 PM',
      stageType: 'Aadiyogi 40ft LED + Hydro Floral Arch',
      status: 'IN_SETUP',
      crewAssigned: 8,
      leadNotes: 'Cold pyro machine test required at 07:00 PM before bride entry.',
    },
    {
      id: 'EVT-2026-002',
      title: 'Corporate Annual Tech Gala Stage & Audio',
      client: 'Kashi Tech Innovators Ltd',
      phone: '+91 98765 44332',
      venue: 'Hotel Taj Ganges, Nadesar',
      timeSlot: '07:00 PM – 10:00 PM',
      stageType: 'P3 LED Video Wall & Line Array Audio',
      status: 'DISPATCH_READY',
      crewAssigned: 4,
      leadNotes: 'Wireless lapel mics check with key speakers.',
    },
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ── Top Event Hero Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '18px',
          padding: '24px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}>🔱</span>
            <span style={{ fontSize: '11px', fontWeight: 900, background: '#f59e0b', color: '#0f172a', padding: '2px 8px', borderRadius: '999px', letterSpacing: '0.08em' }}>
              EVENT OPERATIONS LEAD
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', margin: '8px 0 4px', letterSpacing: '-0.3px' }}>
            Jaygurudev Event & Management — Crew Dashboard
          </h1>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0 }}>
            Welcome back, <strong>{staffUser?.name || 'Event Operations Lead'}</strong>. You have 2 live event setups scheduled today across Varanasi venues.
          </p>
        </div>

        {/* Shift Badge & Check-in */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#f59e0b' }}>
              Shift Status: {activeShift.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick KPI Stat Tiles ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Today's Live Setups</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
              <PartyPopper size={18} />
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '8px' }}>2 Venues</div>
          <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, marginTop: '4px' }}>● 100% On-time schedule</div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Stage Crew on Duty</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Users size={18} />
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '8px' }}>12 Techs</div>
          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700, marginTop: '4px' }}>All Geo-Attendance Logged</div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Transport & Vehicles</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e' }}>
              <Truck size={18} />
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '8px' }}>2 Trucks</div>
          <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, marginTop: '4px' }}>Loaded & En-route</div>
        </div>

        <div style={{ background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>Special FX Status</span>
            <span style={{ padding: '6px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
              <Flame size={18} />
            </span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginTop: '8px' }}>Cold Pyro OK</div>
          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginTop: '4px' }}>4 Guns Prepped</div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Live Event Setup Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={18} color="#f59e0b" />
            <span>Today's Event Lineup & Venue Assignments</span>
          </div>

          {todayEvents.map((evt) => (
            <div
              key={evt.id}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                  {evt.id}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: evt.status === 'IN_SETUP' ? '#f59e0b22' : '#38bdf822',
                    color: evt.status === 'IN_SETUP' ? '#f59e0b' : '#38bdf8',
                    border: `1px solid ${evt.status === 'IN_SETUP' ? '#f59e0b44' : '#38bdf844'}`,
                  }}
                >
                  {evt.status === 'IN_SETUP' ? '🔨 Setup in Progress' : '📦 Dispatch Ready'}
                </span>
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', margin: '0 0 4px' }}>{evt.title}</h3>
                <div style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={14} color="#f59e0b" />
                  <span>{evt.venue}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(15, 23, 42, 0.5)', padding: '12px', borderRadius: '10px', fontSize: '12px' }}>
                <div>
                  <div style={{ color: '#94a3b8' }}>Client Contact:</div>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{evt.client}</div>
                  <div style={{ color: '#38bdf8', fontSize: '11px', marginTop: '2px' }}>{evt.phone}</div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8' }}>Setup Window:</div>
                  <div style={{ fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>{evt.timeSlot}</div>
                  <div style={{ color: '#22c55e', fontSize: '11px', marginTop: '2px' }}>Crew: {evt.crewAssigned} Assigned</div>
                </div>
              </div>

              <div style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#fbbf24', borderLeft: '3px solid #f59e0b' }}>
                <strong>Lead Instruction:</strong> {evt.leadNotes}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Props & Gear Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ClipboardList size={18} color="#f59e0b" />
            <span>Hardware & Decor Props Checklist</span>
          </div>

          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Verify all stage fabrications, light rigs, and SFX equipment before departing the central warehouse:
            </p>

            {[
              { id: 'truss', label: '40x20ft Aluminum Box Trussing & Base Plates' },
              { id: 'lights', label: '24 Beam 230W Sharpie Moving Heads & DMX Console' },
              { id: 'pyro', label: '4 Cold Pyro Electronic Spark Machines (Special Entry)' },
              { id: 'smoke', label: 'Heavy Dry Ice Low Fog Machine & Fluid Canisters' },
              { id: 'flowers', label: 'Imported Orchids & Artificial Royal Floral Arches' },
              { id: 'sound', label: 'JBL VRX Line Array Audio & Wireless Shure Microphones' },
            ].map((item) => {
              const isDone = equipmentChecked[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleEquipment(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: isDone ? 'rgba(34, 197, 94, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                    border: `1px solid ${isDone ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 600, color: isDone ? '#ffffff' : '#cbd5e1' }}>
                    {item.label}
                  </span>
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '6px',
                      background: isDone ? '#22c55e' : 'transparent',
                      border: `2px solid ${isDone ? '#22c55e' : '#64748b'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                    }}
                  >
                    {isDone && <CheckCircle2 size={16} />}
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: '8px', padding: '12px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Checklist Completion:</span>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#22c55e' }}>5 of 6 Loaded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

