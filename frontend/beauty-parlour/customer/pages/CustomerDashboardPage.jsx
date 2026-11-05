/**
 * @file CustomerDashboardPage.jsx
 * @description Dynamic Customer Command Center & Salon Dashboard.
 * Answers key customer questions with live widgets, payment breakdown,
 * live tracking status ticker, and quick action accelerators.
 * @module frontend/src/modules/customer/pages/CustomerDashboardPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as dashboardApi from '../../../services/api/customer/dashboardFetcher.js';
import * as paymentApi from '../../../services/api/customer/paymentFetcher.js';
import * as offerApi from '../../../services/api/customer/offerFetcher.js';
import { useCustomer } from '../../../context/CustomerContext.jsx';

export default function CustomerDashboardPage() {
  const { customer } = useCustomer();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [payments, setPayments] = useState(null);
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [dashRes, payRes, offerRes] = await Promise.allSettled([
          dashboardApi.getDashboard(),
          paymentApi.getPaymentSummary(),
          offerApi.getOffers({ limit: 3 }),
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value?.data) {
          setData(dashRes.value.data);
        }
        if (payRes.status === 'fulfilled' && payRes.value?.data) {
          setPayments(payRes.value.data);
        }
        if (offerRes.status === 'fulfilled' && offerRes.value?.data) {
          setOffers(Array.isArray(offerRes.value.data) ? offerRes.value.data : (offerRes.value.data?.offers || []));
        }
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#94a3b8' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px', animation: 'spin 1.5s linear infinite' }}>⏳</div>
          <div style={{ fontSize: '15px', fontWeight: 600 }}>Loading your personalized salon dashboard...</div>
        </div>
      </div>
    );
  }

  const upcomingApt = data?.appointments?.upcoming?.[0] || data?.upcomingAppointment || null;
  const activeService = data?.activeService || upcomingApt;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
          border: '1px solid rgba(236, 72, 153, 0.25)',
          borderRadius: '20px',
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#ec4899', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
            VIP Member Portal
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Namaste, {customer?.name || 'Valued Customer'}! ✨
          </h1>
          <p style={{ fontSize: '14px', color: '#cbd5e1', margin: 0 }}>
            Here is your real-time appointment schedule, payment ledger, and personalized beauty recommendations.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <NavLink
            to="/customer/book"
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              padding: '12px 22px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: '0 6px 18px rgba(236, 72, 153, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📅</span>
            <span>Book Next Service</span>
          </NavLink>
        </div>
      </div>

      {/* Primary Question 1: "Mera appointment kab hai aur kaun si service hai?" */}
      <div style={{ display: 'grid', gridTemplateColumns: upcomingApt ? '2fr 1fr' : '1fr', gap: '24px' }}>
        {upcomingApt ? (
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#10b981', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  ● UPCOMING APPOINTMENT
                </span>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>
                  #{upcomingApt.appointmentNumber || 'APT'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#f8fafc', margin: '0 0 6px' }}>
                    {upcomingApt.services?.[0]?.name || upcomingApt.packages?.[0]?.name || 'Salon Treatment'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13.5px', color: '#cbd5e1' }}>
                    <span>🗓️ <strong>{upcomingApt.date}</strong></span>
                    <span>⏰ <strong>{upcomingApt.scheduledStartTime} - {upcomingApt.scheduledEndTime || '1 hour'}</strong></span>
                    <span style={{ background: 'rgba(255, 255, 255, 0.06)', padding: '2px 8px', borderRadius: '6px' }}>
                      {upcomingApt.serviceMode === 'HOME_SERVICE' || upcomingApt.serviceMode === 'HOME' ? '🏡 Home Service' : '🏢 In-Salon'}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Total Amount</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#10b981' }}>
                    ₹{(upcomingApt.totalAmount || 0).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Staff attribution: "Kaun staff/service provider hai?" */}
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                    💇‍♀️
                  </div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc' }}>
                      {upcomingApt.staffId?.name || 'Assigned Stylist'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {upcomingApt.staffId?.designation || 'Master Stylist & Aesthetician'}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>Service Status</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#38bdf8' }}>
                    {upcomingApt.status?.toUpperCase() || 'CONFIRMED'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '16px' }}>
              <button
                onClick={() => navigate(`/customer/appointments/${upcomingApt._id}/tracking`)}
                style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                📍 Track Service Status
              </button>
              <button
                onClick={() => navigate(`/customer/appointments/${upcomingApt._id}`)}
                style={{ background: 'rgba(255, 255, 255, 0.06)', color: '#cbd5e1', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '9px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                View Full Details
              </button>
              <button
                onClick={() => navigate(`/customer/chat`)}
                style={{ background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '9px 14px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
              >
                💬 Chat with Salon
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              background: 'rgba(17, 24, 39, 0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '36px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>💆‍♀️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>
              No Appointments Today
            </h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '380px', margin: '0 auto 20px' }}>
              Treat yourself to luxury hair spa, bridal glow facial, or nail couture today!
            </p>
            <NavLink
              to="/customer/book"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', textDecoration: 'none', padding: '10px 22px', borderRadius: '10px', fontSize: '13.5px', fontWeight: 700, display: 'inline-block' }}
            >
              Book an Appointment
            </NavLink>
          </div>
        )}

        {/* Live Service Tracking Quick Widget: "Staff abhi kaha hai?" */}
        <div
          style={{
            background: 'rgba(17, 24, 39, 0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#ec4899', letterSpacing: '0.06em', marginBottom: '14px' }}>
              SERVICE PROGRESS TRACKER
            </div>
            <div style={{ fontSize: '13.5px', color: '#cbd5e1', marginBottom: '16px' }}>
              <strong>Status:</strong> {upcomingApt?.status ? upcomingApt.status.toUpperCase() : 'NO ACTIVE JOURNEY'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Booking Confirmed', done: true },
                { label: 'Staff Assigned', done: !!upcomingApt?.staffId },
                { label: 'Staff On The Way / Ready', done: ['on_the_way', 'arrived', 'working', 'completed'].includes(upcomingApt?.status) },
                { label: 'Service In Progress', done: ['working', 'completed'].includes(upcomingApt?.status) },
                { label: 'Service Completed', done: upcomingApt?.status === 'completed' },
              ].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12.5px', color: step.done ? '#f8fafc' : '#64748b' }}>
                  <span style={{ color: step.done ? '#10b981' : '#475569', fontSize: '14px' }}>
                    {step.done ? '✓' : '○'}
                  </span>
                  <span style={{ fontWeight: step.done ? 600 : 400 }}>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px' }}>
            <NavLink
              to="/customer/appointments/tracking"
              style={{ color: '#38bdf8', fontSize: '13px', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View Full Live GPS Timeline</span>
              <span>→</span>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Financial Ledger Section: "Maine kitna payment online/offline kiya? Kitna pending hai?" */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Payment & Spending Overview
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>
              Granular breakdown of your salon expenditures, online UPI orders, and offline cash receipts.
            </p>
          </div>
          <NavLink to="/customer/payments" style={{ color: '#ec4899', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            View Full Ledger →
          </NavLink>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {[
            { label: 'Total Salon Spent', value: `₹${(payments?.totalPaid || payments?.totalSpent || customer?.totalSpent || 0).toLocaleString()}`, icon: '💰', color: '#ec4899' },
            { label: 'Paid Online (UPI / Card)', value: `₹${(payments?.onlinePaid || 0).toLocaleString()}`, icon: '⚡', color: '#3b82f6' },
            { label: 'Paid Offline (Cash / Terminal)', value: `₹${(payments?.offlinePaid || payments?.cashPaid || 0).toLocaleString()}`, icon: '💵', color: '#10b981' },
            { label: 'Pending Balance Due', value: `₹${(payments?.pending || 0).toLocaleString()}`, icon: '⏳', color: payments?.pending > 0 ? '#ef4444' : '#64748b' },
          ].map((card, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(17, 24, 39, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12.5px', color: '#94a3b8', fontWeight: 500 }}>{card.label}</span>
                <span style={{ fontSize: '20px' }}>{card.icon}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: card.color }}>
                {card.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Offers & Packages Showcase */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
              Exclusive Offers & Salon Packages
            </h2>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '2px 0 0' }}>
              Special discounts curated specifically for your branch and loyalty tier.
            </p>
          </div>
          <NavLink to="/customer/offers" style={{ color: '#ec4899', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
            All Deals →
          </NavLink>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {offers.length > 0 ? (
            offers.slice(0, 3).map((off) => (
              <div
                key={off._id}
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#ec4899', border: '1px solid rgba(236, 72, 153, 0.3)', borderRadius: '6px', fontSize: '11px', fontWeight: 700, padding: '2px 8px' }}>
                      {off.discountType === 'percentage' ? `${off.discountValue}% OFF` : `₹${off.discountValue} FLAT`}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Valid Till {off.validUntil ? new Date(off.validUntil).toLocaleDateString() : 'Active'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', margin: '0 0 6px' }}>
                    {off.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineClamp: 2 }}>
                    {off.description || 'Special seasonal offer available on select services.'}
                  </p>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <NavLink
                    to={`/customer/book?offerId=${off._id}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#ec4899',
                      border: '1px solid rgba(236, 72, 153, 0.2)',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'block',
                      textAlign: 'center',
                    }}
                  >
                    Claim & Book with Offer
                  </NavLink>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: '13.5px' }}>
              No promotional deals currently active. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
