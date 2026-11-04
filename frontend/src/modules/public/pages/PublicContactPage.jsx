/**
 * @file PublicContactPage.jsx
 * @description White-Label Contact Us & Appointment Inquiry Portal.
 * @module frontend/src/modules/public/pages/PublicContactPage
 */

import React, { useState, useEffect } from 'react';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import * as contactApi from '../../../services/api/public/contactFetcher.js';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';

export default function PublicContactPage() {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inquiry Form
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
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      setErrorMsg('Please enter your name and either phone or email address.');
      return;
    }

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
  const email = business?.websiteConfig?.contactEmail || business?.branches?.[0]?.email || 'concierge@glamouracademy.in';
  const address = business?.websiteConfig?.address || business?.branches?.[0]?.address?.street || 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049';
  const hours = business?.websiteConfig?.openingHoursText || 'Mon - Sun: 9:00 AM - 9:00 PM';
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(236, 72, 153, 0.15)', border: '1px solid rgba(236, 72, 153, 0.3)', color: '#f472b6', fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
          📞 Concierge & Reservations
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', margin: 0 }}>
          Connect With Our Specialists
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginTop: '0.75rem', lineHeight: 1.6 }}>
          Whether booking a bridal styling suite, enrolling in our academy, or requesting customized hair and skincare counsel, our concierge team is at your service.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
        {/* Contact Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.75rem',
            }}
          >
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Salon Sanctuary Concierge
            </h2>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(236, 72, 153, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ec4899', flexShrink: 0 }}>
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Direct Telephone</div>
                <a href={`tel:${phone}`} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {phone}
                </a>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '3px' }}>● Available Now (9 AM - 9 PM)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', flexShrink: 0 }}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>VIP Email Inquiries</div>
                <a href={`mailto:${email}`} style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', textDecoration: 'none', display: 'block', marginTop: '2px' }}>
                  {email}
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0 }}>
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Flagship Sanctuary</div>
                <div style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: '2px' }}>
                  {address}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24', flexShrink: 0 }}>
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Hospitality Hours</div>
                <div style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '2px' }}>
                  {hours}
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Action */}
            <a
              href={`https://wa.me/${cleanPhone}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20salon%20appointments%20and%20academy%20courses.`}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                marginTop: '0.5rem',
              }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat Directly on WhatsApp</span>
            </a>

            {/* Embedded Google Maps Location */}
            <div
              style={{
                marginTop: '1.25rem',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '240px',
                background: '#0f172a',
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
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '2.25rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#f8fafc', margin: 0, marginBottom: '0.5rem' }}>
            Send An Inquiry or Request
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0, marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Fill in your preferred dates and interests. A dedicated coordinator will reach out within 30 minutes.
          </p>

          {submitted ? (
            <div
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Inquiry Successfully Dispatched!
              </h3>
              <p style={{ color: '#cbd5e1', fontSize: '0.9rem', maxWidth: '380px', margin: 0, lineHeight: 1.6 }}>
                Thank you for reaching out. Our salon manager has received your note and will confirm your request via phone or WhatsApp.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                style={{
                  marginTop: '0.5rem',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {errorMsg && (
                <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayesha Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Interest / Service</label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData((p) => ({ ...p, serviceInterest: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
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
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Preferred Branch</label>
                  <select
                    value={formData.preferredBranch}
                    onChange={(e) => setFormData((p) => ({ ...p, preferredBranch: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
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
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Special Requests / Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your preferred timing, group size, or skin/hair requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.12)', color: '#fff', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
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
                  boxShadow: '0 6px 20px rgba(236, 72, 153, 0.35)',
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

