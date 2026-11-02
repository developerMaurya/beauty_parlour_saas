import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trainerFetcher } from '../../../api/student';

export default function StudentTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTrainers() {
      try {
        setLoading(true);
        const res = await trainerFetcher.getAll();
        if (res.success && res.data?.length > 0) {
          setTrainers(res.data);
        } else {
          // Default academy trainers
          setTrainers([
            {
              _id: 'tr-01',
              name: 'Master Artist Ananya Verma',
              designation: 'Head of Department & Master Educator',
              department: 'Cosmetology & High-Definition Makeup',
              skills: ['Bridal Artistry', 'HD Airbrush', 'Contouring Architecture', 'Skin Anatomy'],
              bio: '14+ years international luxury salon experience. Certified trainer for global fashion weeks.',
              schedule: 'Mon - Fri • 09:30 AM - 04:00 PM',
              rating: 4.9
            },
            {
              _id: 'tr-02',
              name: 'Dr. Rahul Malhotra',
              designation: 'Senior Clinical Trichologist & Hair Stylist',
              department: 'Hair Science & Chemical Treatments',
              skills: ['Hair Texture Correction', 'Scalp Therapy', 'Keratin & Botox', 'Precision Cutting'],
              bio: 'Specialist in trichological diagnostics and modern chemical hair treatments.',
              schedule: 'Tue, Thu, Sat • 10:00 AM - 03:00 PM',
              rating: 4.8
            }
          ]);
        }
      } catch (err) {
        setError(err.message || 'Error fetching trainer faculty');
      } finally {
        setLoading(false);
      }
    }
    loadTrainers();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Assigned Educators & Master Trainers
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Consult with your assigned faculty for lab guidance, technique reviews, and 1-on-1 portfolio feedback.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading faculty directories...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {trainers.map(tr => (
            <div
              key={tr._id}
              style={{
                background: '#1e293b',
                borderRadius: '16px',
                border: '1px solid #334155',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '22px'
                  }}>
                    {tr.name?.charAt(0) || 'T'}
                  </div>

                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', color: '#f8fafc' }}>{tr.name}</h3>
                    <div style={{ fontSize: '13px', color: '#f59e0b', marginTop: '2px' }}>{tr.designation}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{tr.department}</div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 16px' }}>
                  {tr.bio}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' }}>Expertise</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {(tr.skills || []).map((sk, idx) => (
                      <span key={idx} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', padding: '3px 8px', fontSize: '11px', color: '#cbd5e1' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#0f172a', padding: '12px', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
                  <span>Office / Lab Hours: </span>
                  <strong style={{ color: '#f8fafc' }}>{tr.schedule || 'Regular Academy Schedule'}</strong>
                </div>
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>⭐ {tr.rating || '4.9'} Instructor Rating</span>
                <Link
                  to="/student/chat"
                  style={{
                    background: '#334155',
                    color: '#f8fafc',
                    fontWeight: 600,
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                >
                  Send Message 💬
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
