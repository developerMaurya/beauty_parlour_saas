/**
 * @file PublicContactPage.jsx
 * @description Dedicated Multi-Vertical Contact & Customer Inquiry Portal for Kashi Service.
 * @module frontend/src/modules/public/pages/PublicContactPage
 */

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Scissors,
  PartyPopper,
  Compass,
  Key,
  Code2,
  Building,
} from 'lucide-react';

export default function PublicContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vertical: 'Golden Beauty Parlour',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out your name and phone number.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', padding: '1rem 0 5rem', maxWidth: '1280px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* ── Top Header ── */}
      <section style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: '#eff6ff', border: '1px solid #bfdbfe', fontSize: '12px', fontWeight: 800, color: '#1d4ed8', marginBottom: '1rem' }}>
          <Sparkles size={14} />
          <span>CENTRAL HELPLINE & CONSULTATION DESK</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 12px' }}>
          Connect with Kashi Service
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
          Have an inquiry for bridal makeovers, wedding stage decor, residential land plots, commercial office leasing, or custom software? Our dedicated team is here to assist you.
        </p>
      </section>

      {/* ── Main Contact Grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Side: Contact Information Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Phone & WhatsApp Support</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Mon-Sun 8:00 AM - 9:00 PM</div>
              </div>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#059669', marginBottom: 4 }}>
              +91 98765 43210 / +91 98111 00222
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              Direct line to booking coordinators across all 5 business enterprises.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Email Correspondence</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Response within 2 hours</div>
              </div>
            </div>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#2563eb', marginBottom: 4 }}>
              contact@kashiservice.com • support@kashiservice.com
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
              For institutional tenders, corporate event RFPs, and land plot bookings.
            </p>
          </div>

          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '18px', padding: '1.75rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: '#faf5ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>Central Corporate Office</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Varanasi Central Commercial Complex</div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.5, margin: '0 0 8px' }}>
              Plot 42, Ring Road Commercial Expressway, Cantt / Nadesar Corridor, Varanasi, Uttar Pradesh - 221002
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11.5px', color: '#059669', fontWeight: 700 }}>
              <Clock size={13} />
              <span>Visitor Hours: 9:30 AM to 7:30 PM (All 7 Days)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Inquiry Form */}
        <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '24px', padding: '2.25rem', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>
                Inquiry Dispatched Successfully!
              </h3>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 1.5rem' }}>
                Thank you, <strong>{formData.name}</strong>. Our designated vertical manager for <strong>{formData.vertical}</strong> has received your details and will call you on <strong>{formData.phone}</strong> shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', vertical: 'Golden Beauty Parlour', message: '' });
                }}
                style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>
                  Send an Instant Inquiry
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>
                  Choose your required enterprise vertical and our specialists will reach out promptly.
                </p>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 5 }}>
                  Select Service Vertical *
                </label>
                <select
                  value={formData.vertical}
                  onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13.5px', fontWeight: 600, color: '#0f172a', background: '#f8fafc' }}
                >
                  <option value="Golden Beauty Parlour">💄 Golden Beauty Parlour & Salon</option>
                  <option value="Jay Gurudev Event & Decoration">🎉 Jay Gurudev Event & Stage Decor</option>
                  <option value="Real Estate Plotting & Colonies">🏗️ Real Estate Plotting & Colonies</option>
                  <option value="Office & Commercial Rent">🔑 Office & Commercial Rent</option>
                  <option value="RB Software & Tech Hub">💻 RB Software & Cloud SaaS</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 5 }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 5 }}>
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 5 }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: 5 }}>
                  Details of Requirement / Preferred Dates
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details such as event dates, plot size preference, bridal makeover requirements, or software consultation..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)',
                }}
              >
                <Send size={15} />
                <span>Submit Inquiry to Kashi Service Desk</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
