/**
 * @file EventDecorationDashboard.jsx
 * @description Admin Panel for "Jay Gurudev Event & Management"
 * Tagline: "Har Pal Ko Banayein Khaas..."
 * Signature Setup: Aadiyogi Theme Stage + Royal Bridal Entry
 * Contact: 76519 72973 | Bhaisodi, Sarnath, Varanasi
 * @module frontend/src/modules/admin/pages/EventDecorationDashboard
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PartyPopper, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Music, 
  Camera, 
  Utensils, 
  QrCode,
  Flame,
  CloudRain,
  Phone,
  ExternalLink,
  Plus,
  Eye,
  Layers,
  Crown
} from 'lucide-react';

export function EventDecorationDashboard() {
  const navigate = useNavigate();

  const upcomingEvents = [
    {
      id: 'EVT-101',
      client: 'Rahul Sharma & Sneha Wedding',
      type: 'Aadiyogi Theme Stage (20ft) + Royal Bridal Entry Arch',
      date: '18 Nov 2026',
      venue: 'Sarnath Heritage Lawn, Varanasi',
      status: 'In Production',
      budget: '₹2,75,000',
      specs: 'Cold Pyro (8 Guns) + Dry Ice Cloud Fog',
    },
    {
      id: 'EVT-102',
      client: 'Priya & Amit Wedding Gala',
      type: 'Aadiyogi Grand Theme + 15ft Flower Tunnel + Jaimala Platform',
      date: '22 Nov 2026',
      venue: 'Taj Nadesar Convention Grounds',
      status: 'Confirmed',
      budget: '₹3,40,000',
      specs: 'Imported Orchids + LED Sun Rays Aura',
    },
    {
      id: 'EVT-103',
      client: 'Verma Sangeet & Cocktail',
      type: 'Theme Lighting, 30ft Curved LED Stage & Cold Fireworks',
      date: '25 Nov 2026',
      venue: 'Riviera Riverfront Lawns, Sigra',
      status: 'Planning',
      budget: '₹2,20,000',
      specs: 'Sound Line-Array + 4 Pyro Guns',
    },
    {
      id: 'EVT-104',
      client: 'Mishra 25th Silver Jubilee',
      type: 'Golden Floral Arch Mandap & Banquet Theme',
      date: '30 Nov 2026',
      venue: 'Grand Regal Palace, Cantt',
      status: 'Booked',
      budget: '₹1,50,000',
      specs: 'Artificial & Fresh Luxury Florals',
    },
  ];

  const inventorySummary = [
    { name: 'Aadiyogi Sculptures (Mahadev Bust + Nandi)', total: 2, inUse: 1, available: 1 },
    { name: '20ft Stage Steel Truss & Platform Units', total: 4, inUse: 2, available: 2 },
    { name: 'Circular Glowing Flower Arches (Bridal Entry)', total: 12, inUse: 6, available: 6 },
    { name: 'Cold Pyro Sparkular Machines (Safe Indoor/Outdoor)', total: 16, inUse: 8, available: 8 },
    { name: 'Heavy Dry Ice Fog Machines (Dual Cloud Nozzle)', total: 6, inUse: 2, available: 4 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem 2rem 3rem', background: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      
      {/* ── Banner ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #3b0764 0%, #7e22ce 50%, #b91c1c 100%)',
          color: '#ffffff',
          padding: '2.25rem',
          borderRadius: '20px',
          boxShadow: '0 12px 30px rgba(126, 34, 206, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ background: '#fef08a', color: '#854d0e', fontSize: '11px', fontWeight: 900, padding: '3px 10px', borderRadius: '20px' }}>
              🔱 GRAND PRODUCTION
            </span>
            <span style={{ fontSize: '12px', color: '#f5d0fe', fontWeight: 600 }}>
              Jay Gurudev Event & Management • Sarnath, Varanasi
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Jay Gurudev Event & Management Admin Dashboard
          </h1>

          <p style={{ margin: 0, fontSize: '0.95rem', color: '#f5d0fe', maxWidth: '680px', lineHeight: 1.5 }}>
            Central administration for <strong>Aadiyogi Theme Stages</strong>, 15ft Flower Arch Bridal Entries, safe Cold Pyro Sparkulars, Heavy Dry Ice Cloud Fog, and wedding decor contracts across Varanasi.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', fontSize: '0.85rem', color: '#fef08a', fontWeight: 700 }}>
            <span>📞 Direct Line: +91 76519 72973</span>
            <span>📍 Base: Bhaisodi, Sarnath, Varanasi</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.open('/events', '_blank')}
            style={{
              background: '#facc15',
              color: '#0f172a',
              border: 'none',
              padding: '11px 20px',
              borderRadius: '12px',
              fontWeight: 900,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(250, 204, 21, 0.35)',
            }}
          >
            <span>View Public Website</span>
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
        {[
          { title: 'Upcoming Wedding Bookings', value: '14 Events', sub: '8 Aadiyogi Theme Setups', icon: Calendar, color: '#8b5cf6' },
          { title: 'Active Stage Sculptures', value: '2 Units', sub: '20ft Shiva + Nandi + Trishul', icon: Crown, color: '#f59e0b' },
          { title: 'Cold Pyro & Fog Machines', value: '22 Units', sub: '100% Smoke-Free Safe', icon: Sparkles, color: '#ec4899' },
          { title: 'Monthly Booking Volume', value: '₹14.85 Lakh', sub: 'Wedding Season Peak', icon: DollarSign, color: '#10b981' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.35rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${card.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  flexShrink: 0,
                }}
              >
                <Icon size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{card.title}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>{card.value}</div>
                <div style={{ fontSize: '0.74rem', color: card.color, fontWeight: 700 }}>{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main Table: Active Stage Decor & Wedding Contracts ── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
              Active Stage Decor & Wedding Contracts
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Live production schedule for Aadiyogi Mahadev stages and royal bridal walkways.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
                <th style={{ padding: '10px 14px' }}>Client & Wedding</th>
                <th style={{ padding: '10px 14px' }}>Theme Setup</th>
                <th style={{ padding: '10px 14px' }}>Special Effects</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Venue Location</th>
                <th style={{ padding: '10px 14px' }}>Budget</th>
                <th style={{ padding: '10px 14px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((evt) => (
                <tr key={evt.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px', fontWeight: 800, color: '#0f172a' }}>{evt.client}</td>
                  <td style={{ padding: '14px', color: '#334155', fontWeight: 600 }}>{evt.type}</td>
                  <td style={{ padding: '14px', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 600 }}>{evt.specs}</td>
                  <td style={{ padding: '14px', color: '#64748b' }}>{evt.date}</td>
                  <td style={{ padding: '14px', color: '#475569' }}>{evt.venue}</td>
                  <td style={{ padding: '14px', fontWeight: 900, color: '#16a34a' }}>{evt.budget}</td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: evt.status === 'Confirmed' ? '#dcfce7' : evt.status === 'In Production' ? '#fef3c7' : '#f3e8ff',
                        color: evt.status === 'Confirmed' ? '#15803d' : evt.status === 'In Production' ? '#b45309' : '#7c3aed',
                      }}
                    >
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Inventory Ledger: Stage & Special Effects Assets ── */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '18px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
          Production Assets & Hardware Inventory
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {inventorySummary.map((item, idx) => (
            <div
              key={idx}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem',
                background: '#f8fafc',
              }}
            >
              <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem', marginBottom: '8px' }}>
                {item.name}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                <span>Total Units: <strong>{item.total}</strong></span>
                <span>Active on Ground: <strong style={{ color: '#ea580c' }}>{item.inUse}</strong></span>
                <span>Ready at Base: <strong style={{ color: '#16a34a' }}>{item.available}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default EventDecorationDashboard;
