/**
 * @file EventServicesView.jsx
 * @description Interactive Event Planning, Stage Staging, Vendor Ledger & QR Gate Scanner.
 * @module frontend/src/modules/kashi-service/event-services/EventServicesView
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Users,
  QrCode,
  Music,
  Camera,
  Utensils,
  MapPin,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getKashiEvents, scanKashiEventQr } from '@/services/api/kashi/kashiPlatformApi.js';
import { useToast } from '@/context/ToastContext.jsx';

export default function EventServicesView({ onStartTrial }) {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState('evt_101');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getKashiEvents();
        if (res?.data?.events) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.warn('Events load:', err);
      }
    }
    load();
  }, []);

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0] || {
    name: 'Royale Heritage Destination Wedding',
    venue: 'The Grand Palace Heritage Resort, Varanasi',
    eventDate: '2026-11-28',
    status: 'LIVE_PRODUCTION',
    guestCount: 650,
    budget: 1850000,
    paidAmount: 1200000,
    milestones: [],
    vendorLedger: [],
    qrCheckIns: { totalPassesIssued: 650, scannedAtGate: 482, pendingArrivals: 168 },
  };

  const handleScanTicket = async () => {
    setIsScanning(true);
    try {
      const res = await scanKashiEventQr({ eventId: currentEvent.id, ticketCode: 'QR-PASS-2026-VVIP' });
      toast.success(res?.message || 'QR Ticket Verified! Entry Granted.');
      setEvents((prev) =>
        prev.map((e) =>
          e.id === currentEvent.id
            ? {
                ...e,
                qrCheckIns: {
                  ...e.qrCheckIns,
                  scannedAtGate: Math.min(e.qrCheckIns.totalPassesIssued, e.qrCheckIns.scannedAtGate + 1),
                  pendingArrivals: Math.max(0, e.qrCheckIns.pendingArrivals - 1),
                },
              }
            : e
        )
      );
    } catch {
      toast.error('Scan failed');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(219, 39, 119, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
          border: '1px solid rgba(219, 39, 119, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🎉</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              Event Production & Banquet Operations Hub
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
            Milestone Gantt tracking, vendor payout ledgers, live QR gate access, and floorplan staging
          </p>
        </div>

        <button
          onClick={() => onStartTrial({ id: 'event-service', name: 'Event Services & Production' })}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Event Agency SaaS</span>
        </button>
      </div>

      {/* Event Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {events.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEventId(e.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: selectedEventId === e.id ? 'none' : '1px solid #cbd5e1',
              background: selectedEventId === e.id ? 'linear-gradient(135deg, #db2777 0%, #9333ea 100%)' : '#ffffff',
              color: selectedEventId === e.id ? '#fff' : '#334155',
              fontWeight: selectedEventId === e.id ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {e.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Milestones & QR Scanner + Vendor Ledger */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Card 1: Live Staging Milestones */}
        <div
          style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Production Milestone Checklist
            </h3>
            <span style={{ fontSize: '11px', background: 'rgba(219, 39, 119, 0.2)', color: '#f472b6', padding: '3px 8px', borderRadius: '6px', fontWeight: 800 }}>
              {currentEvent.status}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(currentEvent.milestones || []).map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: m.status === 'COMPLETED' ? '#10b981' : m.status === 'IN_PROGRESS' ? '#38bdf8' : '#e2e8f0',
                      color: m.status === 'COMPLETED' || m.status === 'IN_PROGRESS' ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {m.status === 'COMPLETED' ? '✓' : idx + 1}
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>{m.step}</span>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 700, color: m.status === 'COMPLETED' ? '#059669' : '#0284c7' }}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          {/* QR Entry Gate Scanner Widget */}
          <div
            style={{
              marginTop: '10px',
              padding: '16px',
              borderRadius: '14px',
              background: 'rgba(147, 51, 234, 0.1)',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#c084fc', textTransform: 'uppercase' }}>
                LIVE QR GATE ENTRY SCANNER
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>
                {currentEvent.qrCheckIns?.scannedAtGate || 0} / {currentEvent.qrCheckIns?.totalPassesIssued || 0} Guests Arrived
              </div>
            </div>

            <button
              onClick={handleScanTicket}
              disabled={isScanning}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 14px' }}
            >
              <QrCode className="w-4 h-4" />
              <span>{isScanning ? 'Verifying...' : 'Simulate QR Scan'}</span>
            </button>
          </div>
        </div>

        {/* Card 2: Vendor Payout Ledger */}
        <div
          style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
              Subcontractor & Vendor Ledger
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 800 }}>
              Total Budget: ₹{(currentEvent.budget || 0).toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(currentEvent.vendorLedger || []).map((v, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{v.vendor}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{v.service}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                    ₹{v.amount.toLocaleString()}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: v.status === 'PAID' ? '#059669' : '#d97706',
                    }}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

