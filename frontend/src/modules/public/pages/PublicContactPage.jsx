/**
 * @file PublicContactPage.jsx
 * @description White-Label Luxury Beauty Parlour Contact & Concierge Inquiry (Clean White Aesthetic).
 * @module frontend/src/modules/public/pages/PublicContactPage
 */

import React, { useState, useEffect } from 'react';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import * as contactApi from '../../../services/api/public/contactFetcher.js';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';

export default function PublicContactPage() {
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceInterest: 'Bridal & Party Makeup',
    preferredBranch: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const res = await bizApi.getBusinessInfo();
        const data = res?.data?.data || res?.data || res;
        if (data && typeof data === 'object') {
          setBusiness(data);
          if (data.branches?.length > 0) {
            setFormData((p) => ({ ...p, preferredBranch: data.branches[0].name }));
          }
        }
      } catch (err) {
        console.error('Failed to load contact info', err);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setErrorMsg('Please provide your name and phone number');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    try {
      await contactApi.submitContactInquiry(formData);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try calling directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const phone = business?.websiteConfig?.contactPhone || business?.branches?.[0]?.phone || '+91 98765 43210';
  const email = business?.websiteConfig?.contactEmail || business?.branches?.[0]?.email || 'concierge@blossombeauty.in';
  const address =
    business?.websiteConfig?.address ||
    business?.branches?.[0]?.address?.street ||
    'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049';
  const hours = business?.websiteConfig?.openingHoursText || 'Mon - Sun: 9:00 AM - 9:00 PM';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '20px',
            background: '#ffffff',
            border: '1px solid #fecdd3',
            color: '#be185d',
            fontSize: '12.5px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '1rem',
            boxShadow: '0 2px 6px rgba(190, 24, 93, 0.06)',
          }}
        >
          📞 Concierge & Reservations
        </div>
        <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', margin: 0 }}>
          Connect With Our Specialists
        </h1>
        <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
          Whether booking a bridal styling suite, enrolling in our academy, or requesting doorstep parlour counsel, our concierge team is at your service.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
        {/* Contact Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Parlour Sanctuary Concierge
            </h2>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#be185d', flexShrink: 0, border: '1px solid #fecdd3' }}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Direct Telephone</div>
                <a href={`tel:${phone}`} style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {phone}
                </a>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '3px' }}>● Available Now (9 AM - 9 PM)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', flexShrink: 0, border: '1px solid #ddd6fe' }}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>VIP Email Inquiries</div>
                <a href={`mailto:${email}`} style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {email}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', flexShrink: 0, border: '1px solid #bae6fd' }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Flagship Sanctuary</div>
                <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.5, marginTop: '2px' }}>
                  {address}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', flexShrink: 0, border: '1px solid #a7f3d0' }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Opening Hours</div>
                <div style={{ fontSize: '0.95rem', color: '#334155', marginTop: '2px' }}>{hours}</div>
              </div>
            </div>

            {/* Quick WhatsApp Action */}
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%20Blossom%20Beauty%20Parlour%2C%20I%20would%20like%20to%20inquire%20about%20a%20service`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.25)',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with Concierge on WhatsApp</span>
            </a>

            {/* Embedded Google Maps Location */}
            <div
              style={{
                marginTop: '0.75rem',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                height: '220px',
                background: '#f8fafc',
              }}
            >
              <iframe
                title="Salon Location Map"
                src={
                  business?.websiteConfig?.mapEmbedUrl ||
                  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14015.654884218903!2d77.2182!3d28.5708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce26d830b80ef%3A0x6b45a0b777a83d3e!2sSouth%20Extension%20II%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000'
                }
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Interactive Inquiry Form */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '20px',
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.03)',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, marginBottom: '0.5rem' }}>
            Send An Inquiry or Request
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', margin: 0, marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Fill in your preferred dates and interests. A dedicated coordinator will reach out within 30 minutes.
          </p>

          {submitted ? (
            <div
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Inquiry Successfully Dispatched!
              </h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', maxWidth: '380px', margin: 0, lineHeight: 1.6 }}>
                Thank you for reaching out. Our parlour manager has received your note and will confirm your request via phone or WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: '0.5rem',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMsg && (
                <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Interest / Service</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData((p) => ({ ...p, serviceInterest: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="Bridal & Party Makeup">Bridal & Party Makeup</option>
                    <option value="Hair Cut, Color & Spa">Hair Cut, Color & Spa</option>
                    <option value="Clinical Skin & Facials">Clinical Skin & Facials</option>
                    <option value="Nail Art & Extensions">Nail Art & Extensions</option>
                    <option value="Cosmetology Academy Course">Cosmetology Academy Course</option>
                    <option value="Home Service Booking">Home Service Visit</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Preferred Branch</label>
                  <select
                    value={formData.preferredBranch}
                    onChange={(e) => setFormData((p) => ({ ...p, preferredBranch: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  >
                    {business?.branches?.map((b) => (
                      <option key={b._id || b.code || b.name} value={b.name}>
                        {b.name}
                      </option>
                    )) || <option value="Main Flagship">Main Flagship</option>}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Special Requests / Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your preferred timing, group size, or skin/hair requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                  color: '#fff',
                  border: 'none',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '15px',
                  cursor: submitting ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(190, 24, 93, 0.25)',
                }}
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Dispatching Inquiry...' : 'Submit Inquiry Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
