/**
 * @file PublicAcademyPage.jsx
 * @description White-Label Cosmetology Academy & Beauty Training Courses Showcase.
 * @module frontend/src/modules/public/pages/PublicAcademyPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as academyApi from '../../../services/api/public/academyFetcher.js';
import * as bizApi from '../../../services/api/public/businessFetcher.js';
import { GraduationCap, Award, BookOpen, Clock, CheckCircle2, Sparkles, Users, ArrowRight } from 'lucide-react';

export default function PublicAcademyPage() {
  const [courses, setCourses] = useState([]);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cRes, bRes] = await Promise.allSettled([
          academyApi.getAcademyCourses(),
          bizApi.getBusinessInfo(),
        ]);

        if (cRes.status === 'fulfilled') {
          const cData = cRes.value?.data?.courses || cRes.value?.data || cRes.value;
          setCourses(Array.isArray(cData) ? cData : (Array.isArray(cData?.data) ? cData.data : []));
        }

        if (bRes.status === 'fulfilled') {
          const bData = bRes.value?.data?.data || bRes.value?.data || bRes.value;
          if (bData && typeof bData === 'object') setBusiness(bData);
        }
      } catch (err) {
        console.error('Failed to load academy info', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Default curated curriculum if DB has no courses yet
  const displayCourses = courses.length > 0 ? courses : [
    {
      _id: 'c1',
      name: 'Advanced Diploma in Professional Cosmetology',
      code: 'COSM-ADV-601',
      durationMonths: 6,
      durationHours: 320,
      price: 65000,
      finalPrice: 55000,
      description: 'Comprehensive mastery of clinical skin anatomy, hair architecture, couture chemical treatments, and advanced bridal styling.',
      certificateProvided: true,
      installmentOption: true,
      numberOfInstallments: 4,
      servicesCovered: ['Skin Anatomy & Peels', 'Creative Hair Colouring', 'Bridal & Portfolio HD Makeup', 'Salon Management'],
    },
    {
      _id: 'c2',
      name: 'Masterclass in Couture Bridal Artistry & Airbrush',
      code: 'BRD-MSTR-301',
      durationMonths: 1,
      durationHours: 60,
      price: 35000,
      finalPrice: 29999,
      description: 'Ultra-HD silicone airbrush techniques, traditional Indian bridal drape styling, jewelry setting, and high-fashion editorial makeup.',
      certificateProvided: true,
      installmentOption: true,
      numberOfInstallments: 2,
      servicesCovered: ['Airbrush Makeup', 'Traditional Bridal Drapes', 'Color Theory & Lighting', 'Client Consultation'],
    },
    {
      _id: 'c3',
      name: 'Professional Hair Dressing & Chemical Design',
      code: 'HAIR-PRO-401',
      durationMonths: 3,
      durationHours: 160,
      price: 42000,
      finalPrice: 38000,
      description: 'Precision scissor ergonomics, Balayage ombré melting, Brazilian keratin protocols, and creative hair extensions.',
      certificateProvided: true,
      installmentOption: true,
      numberOfInstallments: 3,
      servicesCovered: ['Precision Scissor Cuts', 'Balayage & Foiling', 'Keratin & Nanoplastia', 'Scalp Spa Therapies'],
    },
    {
      _id: 'c4',
      name: 'Nail Extension & Luxury Nail Art Certification',
      code: 'NAIL-CERT-201',
      durationMonths: 1,
      durationHours: 45,
      price: 24000,
      finalPrice: 19999,
      description: 'Sculpted acrylics, polygel builder overlays, chrome cat-eye 3D nail art, and French ombré design.',
      certificateProvided: true,
      installmentOption: false,
      servicesCovered: ['Acrylic System Extensions', 'Gel Builder Overlays', '3D Chrome Nail Art', 'Sterilization Protocols'],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15)), #0f172a',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '20px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c084fc', fontSize: '12.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.25rem' }}>
          🎓 Internationally Accredited Academy
        </div>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em', maxWidth: '850px', margin: '0 auto', lineHeight: 1.2 }}>
          Launch Your High-Fashion Cosmetology Career
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1.05rem', maxWidth: '720px', margin: '1.25rem auto 0', lineHeight: 1.6 }}>
          Learn directly inside functioning luxury salons alongside celebrity stylists. Hands-on clinical mannequins, real client live models, professional kit provided, and 100% placement support.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.25rem', flexWrap: 'wrap' }}>
          <NavLink
            to="/contact"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14.5px',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
            }}
          >
            Request Academy Prospectus & Fee Plan
          </NavLink>
          <NavLink
            to="/student/login"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14.5px',
            }}
          >
            Enrolled Student Portal ➔
          </NavLink>
        </div>
      </section>

      {/* Courses Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>Diploma & Masterclass Curriculum</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.5rem' }}>Select a program below to review duration, certification, and flexible installment options.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {displayCourses.map((c) => {
            const price = c.finalPrice || c.price;
            const originalPrice = c.price > price ? c.price : null;

            return (
              <div
                key={c._id || c.code}
                style={{
                  background: 'rgba(15, 23, 42, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '6px', background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc', letterSpacing: '0.05em' }}>
                      {c.code || 'ACADEMY COURSE'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award className="w-3.5 h-3.5" /> Certified
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.35 }}>
                    {c.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12.5px', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock className="w-4 h-4 text-pink-400" />
                      <span>{c.durationMonths ? `${c.durationMonths} Months` : '4 Weeks'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>{c.durationHours || 120} Hours Training</span>
                    </div>
                  </div>

                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6, margin: '1rem 0' }}>
                    {c.description}
                  </p>

                  {/* Modules covered */}
                  {c.servicesCovered?.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Curriculum Highlights:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {c.servicesCovered.map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11.5px',
                              padding: '3px 9px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.04)',
                              color: '#cbd5e1',
                              border: '1px solid rgba(255, 255, 255, 0.07)',
                            }}
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Course Tuition</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {originalPrice && (
                          <span style={{ fontSize: '1rem', color: '#64748b', textDecoration: 'line-through' }}>
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {c.installmentOption && (
                      <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '4px 8px', borderRadius: '6px', fontWeight: 600 }}>
                        EMI Available
                      </span>
                    )}
                  </div>

                  <NavLink
                    to={`/contact?course=${encodeURIComponent(c.name)}`}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '13.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxSizing: 'border-box',
                    }}
                  >
                    <span>Enroll or Inquire</span>
                    <ArrowRight className="w-4 h-4" />
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

