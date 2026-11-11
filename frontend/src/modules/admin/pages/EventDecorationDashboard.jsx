import React from 'react';
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
  QrCode 
} from 'lucide-react';

export default function EventDecorationDashboard() {
  const upcomingEvents = [
    { id: 'EVT-01', client: 'Sharma Family Wedding', type: 'Luxury Floral Mandap & Stage Decoration', date: '18 Nov 2026', venue: 'Grand Regal Palace, Varanasi', status: 'In Production', budget: '₹4,50,000' },
    { id: 'EVT-02', client: 'TechCorp Annual Summit', type: 'Corporate Stage, AV & LED Wall Setup', date: '22 Nov 2026', venue: 'Taj Nadesar Convention Hall', status: 'Confirmed', budget: '₹2,80,000' },
    { id: 'EVT-03', client: 'Verma Sangeet & Cocktail', type: 'Theme Lighting, DJ Stage & Floral Entry', date: '25 Nov 2026', venue: 'Riviera Riverfront Lawns', status: 'Planning', budget: '₹3,20,000' },
    { id: 'EVT-04', client: 'Mishra 25th Anniversary', type: 'Golden Royale Balloon & Banquet Theme', date: '30 Nov 2026', venue: 'Heritage Heritage Hotel', status: 'Booked', budget: '₹1,50,000' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '2rem' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4c1d95 0%, #7e22ce 50%, #db2777 100%)',
          color: '#ffffff',
          padding: '2rem',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(126, 34, 206, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: '#fdf2f8', color: '#db2777', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '20px' }}>
              EVENT MANAGEMENT
            </span>
            <span style={{ fontSize: '12px', color: '#fbcfe8' }}>Kashi Service Events Wing</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 900, margin: '0 0 6px', color: '#ffffff' }}>
            Event & Decoration Admin Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#f5d0fe', maxWidth: '650px' }}>
            Manage stage decorations, floral themes, sound & AV setups, catering coordination, and guest QR check-in gates for weddings, banquets, and corporate events.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fef08a' }}>12</div>
            <div style={{ fontSize: '11px', color: '#f5d0fe' }}>Active Bookings</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 18px', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#6ee7b7' }}>₹12.0L</div>
            <div style={{ fontSize: '11px', color: '#f5d0fe' }}>Monthly Volume</div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        {[
          { title: 'Upcoming Events (This Month)', value: '8 Events', sub: '3 Destination Weddings', icon: Calendar, color: '#8b5cf6' },
          { title: 'Confirmed Stage Designs', value: '14 Themes', sub: 'Mandap, Sangeet & LED', icon: Sparkles, color: '#ec4899' },
          { title: 'Vendors & Decorators', value: '28 Assigned', sub: 'Florists, AV & Lights', icon: Users, color: '#06b6d4' },
          { title: 'QR Gate Guest Check-ins', value: '1,450 Passes', sub: 'Fast Entry System', icon: QrCode, color: '#10b981' },
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

      {/* Events Table */}
      <div
        style={{
          background: 'var(--bg-surface, #ffffff)',
          border: '1px solid var(--border-color, #e2e8f0)',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}
      >
        <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary, #0f172a)' }}>
          Active Stage Decor & Wedding Contracts
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color, #e2e8f0)', color: 'var(--text-muted, #64748b)' }}>
                <th style={{ padding: '10px 14px' }}>Client & Event</th>
                <th style={{ padding: '10px 14px' }}>Theme Type</th>
                <th style={{ padding: '10px 14px' }}>Date</th>
                <th style={{ padding: '10px 14px' }}>Venue</th>
                <th style={{ padding: '10px 14px' }}>Budget</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((evt) => (
                <tr key={evt.id} style={{ borderBottom: '1px solid var(--border-color, #f1f5f9)' }}>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--text-primary, #0f172a)' }}>{evt.client}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary, #475569)' }}>{evt.type}</td>
                  <td style={{ padding: '12px 14px' }}>{evt.date}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-secondary, #475569)' }}>{evt.venue}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#10b981' }}>{evt.budget}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: '#7c3aed', background: '#f5f3ff', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>
                      {evt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
