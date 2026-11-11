import React, { useState, useEffect } from 'react';
import { materialFetcher } from '../../../services/api/student';

export default function StudentMaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMaterials() {
      try {
        setLoading(true);
        const res = await materialFetcher.getAll();
        if (res.success) {
          setMaterials(res.data || []);
        } else {
          setError(res.message || 'Failed to load study materials');
        }
      } catch (err) {
        setError(err.message || 'Error fetching course repository');
      } finally {
        setLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const filtered = materials.filter(m => {
    const matchesSearch = (m.title || '').toLowerCase().includes(search.toLowerCase()) ||
                          (m.courseId?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 700, margin: '0 0 6px', color: '#f8fafc' }}>
          Course Learning Materials & Digital Assets
        </h1>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>
          Download syllabus guides, step-by-step facial & makeup charts, video tutorials, and exam review notes.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '14px', color: '#fca5a5', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search materials by title or course..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: '260px', padding: '10px 16px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '14px' }}
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '10px 16px', borderRadius: '8px', background: '#1e293b', border: '1px solid #334155', color: '#f8fafc', fontSize: '14px' }}
        >
          <option value="ALL">All File Formats</option>
          <option value="PDF">PDF Handbooks</option>
          <option value="VIDEO">Video Masterclasses</option>
          <option value="DOCUMENT">Doc / Word Worksheets</option>
          <option value="IMAGE">Face & Skin Reference Charts</option>
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          <div style={{ fontSize: '28px', marginBottom: '12px' }}>⏳</div>
          <div>Loading authorized learning materials...</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>📂</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#f8fafc' }}>No Materials Found</div>
          <div style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search criteria or check back once new modules unlock.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {filtered.map((mat, idx) => {
            const icon = mat.type === 'VIDEO' ? '🎥' : mat.type === 'IMAGE' ? '🖼️' : '📕';
            return (
              <div
                key={mat._id || idx}
                style={{
                  background: '#1e293b',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{ fontSize: '28px' }}>{icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                      {mat.type || 'PDF'}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#f8fafc' }}>{mat.title}</h3>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                    Course: <strong style={{ color: '#cbd5e1' }}>{mat.courseId?.name || 'General Beauty Curriculum'}</strong>
                  </div>

                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                    {mat.description || 'Authorized Academy teaching material for student practice and revision.'}
                  </p>
                </div>

                <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{mat.fileSize || '3.2 MB'}</span>
                  <a
                    href={mat.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: '#334155',
                      color: '#f8fafc',
                      fontSize: '13px',
                      fontWeight: 600,
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    View / Download ↓
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
