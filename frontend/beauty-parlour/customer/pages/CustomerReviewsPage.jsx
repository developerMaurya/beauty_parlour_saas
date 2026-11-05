/**
 * @file CustomerReviewsPage.jsx
 * @description Customer Reviews, Star Ratings & Service Feedback.
 * Conforms to Sections 28, 29, 30, 51. Verifies completed appointments
 * before review submission to prevent fake or duplicate feedback.
 * @module frontend/src/modules/customer/pages/CustomerReviewsPage
 */

import React, { useState, useEffect } from 'react';
import * as reviewApi from '../../../services/api/customer/reviewFetcher.js';
import * as historyApi from '../../../services/api/customer/serviceHistoryFetcher.js';

export default function CustomerReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [eligibleAppointments, setEligibleAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Review Form
  const [selectedAptId, setSelectedAptId] = useState('');
  const [overallRating, setOverallRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [staffRating, setStaffRating] = useState(5);
  const [branchRating, setBranchRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      setLoading(true);
      const [revRes, histRes] = await Promise.allSettled([
        reviewApi.getReviews(),
        historyApi.getServiceHistory(),
      ]);

      if (revRes.status === 'fulfilled' && revRes.value?.data) {
        const list = Array.isArray(revRes.value.data) ? revRes.value.data : (revRes.value.data?.reviews || []);
        setReviews(list);
      }

      if (histRes.status === 'fulfilled' && histRes.value?.data) {
        const histList = Array.isArray(histRes.value.data) ? histRes.value.data : (histRes.value.data?.history || []);
        // Only completed appointments not yet reviewed
        const unreviewed = histList.filter((h) => !h.hasReviewed);
        setEligibleAppointments(unreviewed);
        if (unreviewed.length > 0 && !selectedAptId) {
          setSelectedAptId(unreviewed[0]._id);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedAptId) {
      setMsg({ type: 'error', text: 'Please select an eligible completed appointment to review.' });
      return;
    }

    setSubmitting(true);
    setMsg({ type: '', text: '' });

    try {
      await reviewApi.createReview({
        appointmentId: selectedAptId,
        overallRating,
        serviceRating,
        staffRating,
        branchRating,
        comment,
      });

      setMsg({ type: 'success', text: 'Thank you! Your verified review has been submitted for moderation.' });
      setComment('');
      await loadData();
    } catch (err) {
      setMsg({ type: 'error', text: err?.message || 'Failed to submit review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
          Customer Reviews & Star Ratings
        </h1>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: 0 }}>
          Rate your stylist, service quality, and salon ambiance. Only verified appointments can submit feedback.
        </p>
      </div>

      {msg.text && (
        <div style={{ padding: '12px 18px', borderRadius: '12px', fontSize: '13.5px', background: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, color: msg.type === 'success' ? '#34d399' : '#f87171' }}>
          {msg.text}
        </div>
      )}

      {/* Review Submission Form per Section 51 */}
      {eligibleAppointments.length > 0 && (
        <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)', border: '1px solid rgba(236, 72, 153, 0.25)', borderRadius: '20px', padding: '28px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>
            Rate Your Recent Service Experience
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', margin: '0 0 20px' }}>
            How was your treatment? Your honest feedback helps us reward our master stylists and improve care.
          </p>

          <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Select Completed Appointment *
              </label>
              <select
                value={selectedAptId}
                onChange={(e) => setSelectedAptId(e.target.value)}
                required
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13.5px' }}
              >
                {eligibleAppointments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.services?.[0]?.name || 'Treatment'} on {a.date} (#{a.appointmentNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Granular Ratings */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Overall Quality</label>
                <select value={overallRating} onChange={(e) => setOverallRating(Number(e.target.value))} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff' }}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} ({r} Stars)</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Treatment / Service</label>
                <select value={serviceRating} onChange={(e) => setServiceRating(Number(e.target.value))} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff' }}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} ({r} Stars)</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Stylist Skill</label>
                <select value={staffRating} onChange={(e) => setStaffRating(Number(e.target.value))} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff' }}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} ({r} Stars)</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#cbd5e1', marginBottom: '6px' }}>Salon Ambiance</label>
                <select value={branchRating} onChange={(e) => setBranchRating(Number(e.target.value))} style={{ width: '100%', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '8px 10px', color: '#fff' }}>
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} ({r} Stars)</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12.5px', color: '#cbd5e1', marginBottom: '6px' }}>Write Your Detailed Review *</label>
              <textarea
                rows="3"
                required
                placeholder="Share your thoughts about your hair, skin or bridal service..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 24px', fontSize: '13.5px', fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Submitting Review...' : 'Publish Verified Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Published / Submitted Reviews Feed */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>
          My Verified Reviews History
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(17, 24, 39, 0.5)', borderRadius: '16px', color: '#94a3b8' }}>
            You haven't reviewed any services yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map((rev) => (
              <div
                key={rev._id}
                style={{
                  background: 'rgba(17, 24, 39, 0.75)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#fbbf24', fontSize: '16px' }}>{'★'.repeat(rev.overallRating || 5)}</span>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      ✓ Verified Customer
                    </span>
                  </div>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ fontSize: '13.5px', color: '#e2e8f0', margin: '0 0 10px' }}>
                  "{rev.comment}"
                </p>

                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: '#94a3b8' }}>
                  <span>Service: {rev.serviceRating || 5}★</span>
                  <span>Stylist: {rev.staffRating || 5}★</span>
                  <span>Branch: {rev.branchRating || 5}★</span>
                  <span style={{ marginLeft: 'auto', textTransform: 'uppercase', color: rev.status === 'PUBLISHED' ? '#10b981' : '#f59e0b' }}>
                    Status: {rev.status || 'PUBLISHED'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
