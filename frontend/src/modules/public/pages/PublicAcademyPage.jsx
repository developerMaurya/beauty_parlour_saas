/**
 * @file PublicAcademyPage.jsx
 * @description White-Label Cosmetology Academy & Beauty Training Courses Showcase.
 * Pure Luxury White & Rose-Gold Aesthetic for Beauty Parlour Academy.
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
      servicesCovered: ['Skin Anatomy & Peels', 'Creative Hair Colouring', 'Bridal & Portfolio HD Makeup', 'Parlour Management'],
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header Banner (Clean Luminous Luxury White) */}
      <section
        style={{
          background: 'linear-gradient(135deg, #fff5f7 0%, #fffbf8 50%, #fdf2f8 100%)',
          border: '1px solid #fce7f3',
          borderRadius: '24px',
          padding: '4rem 2rem',
          textAlign: 'center',
          position: 'relative',
          boxShadow: '0 8px 24px rgba(190, 24, 93, 0.04)',
        }}
      >
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
            marginBottom: '1.25rem',
            boxShadow: '0 2px 6px rgba(190, 24, 93, 0.06)',
          }}
        >
          🎓 Internationally Accredited Cosmetology Academy
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.2rem)',
            fontWeight: 900,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            maxWidth: '850px',
            margin: '0 auto',
            lineHeight: 1.2,
          }}
        >
          Launch Your Professional Beauty & Cosmetology Career
        </h1>
        <p
          style={{
            color: '#475569',
            fontSize: '1.05rem',
            maxWidth: '720px',
            margin: '1.25rem auto 0',
            lineHeight: 1.6,
            fontWeight: 400,
          }}
        >
          Learn directly inside functioning luxury beauty parlours alongside certified master beauticians. Hands-on clinical mannequins, real live models, complete starter kit provided, and government-recognized certification.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.25rem', flexWrap: 'wrap' }}>
          <NavLink
            to="/contact"
            style={{
              background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '14.5px',
              boxShadow: '0 8px 20px rgba(190, 24, 93, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>Request Academy Prospectus & Fee Plan</span>
            <ArrowRight size={16} />
          </NavLink>
        </div>
      </section>

      {/* Courses Grid (Crisp White High-Contrast Cards) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Diploma & Masterclass Curriculum
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Select an accredited program below to review duration, certification, and flexible installment options.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
          {displayCourses.map((c) => {
            const price = c.finalPrice || c.price;
            const originalPrice = c.price > price ? c.price : null;

            return (
              <div
                key={c._id || c.code}
                style={{
                  background: '#ffffff',
                  border: '1px solid #f1e6ea',
                  borderRadius: '20px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.04)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        background: '#fff1f2',
                        color: '#be185d',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {c.code || 'ACADEMY COURSE'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Award size={15} /> Accredited Certificate
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.35 }}>
                    {c.name}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '13px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="#be185d" />
                      <span>{c.durationMonths ? `${c.durationMonths} Months` : '4 Weeks'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <BookOpen size={15} color="#be185d" />
                      <span>{c.durationHours || 120} Hours Training</span>
                    </div>
                  </div>

                  <p style={{ color: '#475569', fontSize: '0.88rem', lineHeight: 1.6, margin: '1rem 0' }}>
                    {c.description}
                  </p>

                  {/* Modules covered */}
                  {c.servicesCovered?.length > 0 && (
                    <div style={{ borderTop: '1px solid #f8e7eb', paddingTop: '1rem', marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                        Curriculum Highlights:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {c.servicesCovered.map((s, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '11.5px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: '#fff5f7',
                              color: '#881337',
                              border: '1px solid #fecdd3',
                              fontWeight: 600,
                            }}
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid #f8e7eb', paddingTop: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total Course Tuition</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {originalPrice && (
                          <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                            ₹{originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {c.installmentOption && (
                      <span style={{ fontSize: '11px', color: '#0284c7', background: '#e0f2fe', padding: '4px 8px', borderRadius: '6px', fontWeight: 700 }}>
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
                      background: 'linear-gradient(135deg, #be185d 0%, #e11d48 100%)',
                      color: '#ffffff',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '13.5px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxSizing: 'border-box',
                      boxShadow: '0 4px 12px rgba(190, 24, 93, 0.2)',
                    }}
                  >
                    <span>Enroll or Inquire</span>
                    <ArrowRight size={15} />
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
