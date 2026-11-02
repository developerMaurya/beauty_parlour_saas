/**
 * @file StudentCoursesPage.jsx
 * @description Course Catalog & Academic Modules Explorer.
 * Conforms to Phase 06 Section 6.
 * @module frontend/src/modules/student/pages/StudentCoursesPage
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import * as courseApi from '../../../services/api/student/courseFetcher.js';

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await courseApi.getCourses({ search, category });
      if (res.success && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      console.warn('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadCourses();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px 28px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>📖</span>
            <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: '#fff' }}>
              Academy Course Catalog
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '6px 0 0' }}>
            Browse accredited certifications, theory curricula, and practical masterclass modules
          </p>
        </div>

        {/* Filter / Search Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by course name or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '9px 14px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none',
              minWidth: '240px',
            }}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>Loading courses...</div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>No courses found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {courses.map((course) => (
            <div
              key={course._id}
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
                  <span style={codeBadgeStyle}>{course.code || 'COURSE'}</span>
                  <span style={catBadgeStyle}>{course.category || 'Beauty'}</span>
                </div>

                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: '12px 0 6px' }}>
                  {course.name}
                </h2>
                <p style={{ fontSize: '12.5px', color: '#94a3b8', margin: '0 0 16px', minHeight: '36px' }}>
                  {course.description || 'Professional hands-on hair, skin and makeup training'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', marginBottom: '18px' }}>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#94a3b8' }}>Duration:</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>
                      {course.duration} {course.durationUnit || 'Months'} ({course.totalClasses || 48} Classes)
                    </span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#94a3b8' }}>Theory / Practical:</span>
                    <span style={{ color: '#fff', fontWeight: '600' }}>
                      {course.theoryHours || 30}h / {course.practicalHours || 66}h
                    </span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#94a3b8' }}>Faculty:</span>
                    <span style={{ color: '#38bdf8', fontWeight: '600' }}>{course.trainerId?.name || 'Senior Specialist'}</span>
                  </div>
                  <div style={infoRowStyle}>
                    <span style={{ color: '#94a3b8' }}>Course Fee:</span>
                    <span style={{ color: '#10b981', fontWeight: '800', fontSize: '15px' }}>
                      ₹{course.fee?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <NavLink
                  to={`/student/courses/${course._id}`}
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
                  View Details & Content
                </NavLink>
                <NavLink
                  to={`/student/purchase?courseId=${course._id}`}
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
                  Enroll Course
                </NavLink>
              </div>
            </div>
          ))}
        </div>
      )}
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

const catBadgeStyle = {
  background: 'rgba(255, 255, 255, 0.08)',
  color: '#cbd5e1',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
};

const infoRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '12.5px',
};
