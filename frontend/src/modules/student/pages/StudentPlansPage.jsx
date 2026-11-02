/**
 * @file StudentPlansPage.jsx
 * @description Dynamic Academy Plans Catalog & Package Enrollment Screen.
 * Conforms to Phase 06 Section 5 & 43.
 * @module frontend/src/modules/student/pages/StudentPlansPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as planApi from '../../../services/api/student/planFetcher.js';

export default function StudentPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        setLoading(true);
        const res = await planApi.getPlans();
        if (res.success && res.data) {
          setPlans(res.data);
        }
      } catch (err) {
        console.warn('Failed to load plans:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPlans();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading academy plans...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🎓</span>
          <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
            Academy Plans & Certification Diplomas
          </h1>
        </div>
        <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '6px 0 0' }}>
          Select from our industry-accredited diploma packages with flexible installment options
        </p>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {plans.map((plan) => {
          const finalPrice = Math.max(0, plan.price - (plan.discount || 0));
          return (
            <div
              key={plan._id}
              style={{
                background: 'rgba(30, 41, 59, 0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={codeBadgeStyle}>{plan.code || 'PLAN'}</span>
                  {plan.installmentOption && <span style={tagStyle}>Installments Available</span>}
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '12px 0 6px' }}>
                  {plan.name}
                </h2>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px', minHeight: '36px' }}>
                  {plan.description || 'Hands-on practical training with certified diploma'}
                </p>

                <div style={{ margin: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '12px 0' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
                      ₹{finalPrice.toLocaleString('en-IN')}
                    </span>
                    {plan.discount > 0 && (
                      <span style={{ fontSize: '14px', color: '#64748b', textDecoration: 'line-through' }}>
                        ₹{plan.price.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                    Duration: {plan.durationMonths || 3} Months ({plan.durationHours || 120} Hours)
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  <div style={featureItemStyle}>
                    <span>✓</span>
                    <span>Theory Hours: {plan.theoryHours || 40} hrs</span>
                  </div>
                  <div style={featureItemStyle}>
                    <span>✓</span>
                    <span>Practical Training: {plan.practicalHours || 80} hrs</span>
                  </div>
                  <div style={featureItemStyle}>
                    <span>✓</span>
                    <span>Certificate Provided: {plan.certificateProvided ? 'Yes' : 'No'}</span>
                  </div>
                  <div style={featureItemStyle}>
                    <span>✓</span>
                    <span>Materials Included: {plan.materialsIncluded ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <NavLink
                  to={`/student/plans/${plan._id}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    fontWeight: '600',
                  }}
                >
                  View Curriculum
                </NavLink>
                <NavLink
                  to={`/student/purchase?planId=${plan._id}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '12.5px',
                    fontWeight: '700',
                  }}
                >
                  Enroll Now
                </NavLink>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const codeBadgeStyle = {
  background: 'rgba(99, 102, 241, 0.2)',
  color: '#818cf8',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '700',
};

const tagStyle = {
  background: 'rgba(16, 185, 129, 0.15)',
  color: '#10b981',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '600',
};

const featureItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12.5px',
  color: '#cbd5e1',
};
