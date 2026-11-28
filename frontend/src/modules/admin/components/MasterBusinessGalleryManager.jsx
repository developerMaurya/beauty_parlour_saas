/**
 * @file MasterBusinessGalleryManager.jsx
 * @description Unified, high-performance media gallery manager supporting Photos (File Upload & URL)
 * and Videos (YouTube Embed & Live Player) with Categories, Tags, Lightbox, and CRUD operations.
 * Reused seamlessly across:
 *  1. Jaygurudev Event & Management (Aadiyogi Stage, Cold Pyro, Bridal Entry, Drone Shoots)
 *  2. Golden Beauty Parlour (Bridal Makeups, Hair Styling, Academy Demos, Nail Art)
 *  3. Plotting & Real Estate (Drone Land Surveys, 40ft Roads, Site Layouts, Customer Reviews)
 * @module frontend/src/modules/admin/components/MasterBusinessGalleryManager
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  Play,
  ExternalLink,
  Search,
  Filter,
  X,
  Upload,
  Sparkles,
  Layers,
  Eye,
  CheckCircle2,
  Film,
  Camera,
  Maximize2,
} from 'lucide-react';

/**
 * Extracts a YouTube Video ID from any standard or shortened YouTube URL.
 */
export function extractYouTubeId(url) {
  if (!url) return '';
  const clean = url.trim();
  const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : '';
}

export function MasterBusinessGalleryManager({
  businessKey = 'events', // 'events' | 'parlour' | 'plotting'
  title = 'Media & Video Gallery',
  subtitle = 'Manage high-definition photos and YouTube video showcases',
  storageKey = 'business_media_gallery',
  categories = [
    { id: 'ALL', label: 'All Media' },
    { id: 'STAGE', label: 'Stage & Setups' },
    { id: 'BRIDAL', label: 'Bridal & Entry' },
    { id: 'VIDEO', label: 'Videos & Tours' },
  ],
  initialItems = [],
  themeColor = '#ca8a04',
  themeBg = '#fefce8',
}) {
  const [gallery, setGallery] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn(`[MasterGallery] Error reading ${storageKey}:`, e);
    }
    return initialItems;
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(gallery));
    } catch (e) {
      console.warn(`[MasterGallery] Error saving ${storageKey}:`, e);
    }
  }, [gallery, storageKey]);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('ALL'); // 'ALL' | 'IMAGE' | 'YOUTUBE'
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fileInputRef = useRef(null);

  // Form State
  const [mediaForm, setMediaForm] = useState({
    type: 'IMAGE', // 'IMAGE' | 'YOUTUBE'
    title: '',
    category: categories[1]?.id || 'GENERAL',
    imageUrl: '',
    youtubeUrl: '',
    caption: '',
    tags: '',
  });

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2800);
  };

  // Handle local image file upload and convert to base64 DataURL
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Selected image exceeds 8MB limit. Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setMediaForm((prev) => ({
        ...prev,
        imageUrl: event.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenAddModal = (defaultType = 'IMAGE') => {
    setMediaForm({
      type: defaultType,
      title: '',
      category: categories[1]?.id || 'GENERAL',
      imageUrl: '',
      youtubeUrl: '',
      caption: '',
      tags: '',
    });
    setModalOpen(true);
  };

  const handleSubmitMedia = (e) => {
    e.preventDefault();
    if (!mediaForm.title.trim()) {
      alert('Please enter a media title.');
      return;
    }

    if (mediaForm.type === 'YOUTUBE') {
      const yId = extractYouTubeId(mediaForm.youtubeUrl);
      if (!yId) {
        alert('Please enter a valid YouTube video link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...)');
        return;
      }
      const newItem = {
        id: `media_${Date.now()}`,
        type: 'YOUTUBE',
        title: mediaForm.title.trim(),
        category: mediaForm.category,
        youtubeUrl: mediaForm.youtubeUrl.trim(),
        youtubeId: yId,
        thumbnail: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`,
        caption: mediaForm.caption.trim(),
        tags: mediaForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      setGallery((prev) => [newItem, ...prev]);
      showToast('YouTube video added to gallery successfully!');
    } else {
      if (!mediaForm.imageUrl.trim()) {
        alert('Please select an image file or enter an image URL.');
        return;
      }
      const newItem = {
        id: `media_${Date.now()}`,
        type: 'IMAGE',
        title: mediaForm.title.trim(),
        category: mediaForm.category,
        imageUrl: mediaForm.imageUrl.trim(),
        caption: mediaForm.caption.trim(),
        tags: mediaForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      };
      setGallery((prev) => [newItem, ...prev]);
      showToast('Photo added to gallery successfully!');
    }

    setModalOpen(false);
  };

  const handleDeleteItem = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title || 'this media'}" from gallery?`)) {
      setGallery((prev) => prev.filter((item) => item.id !== id));
      showToast('Media removed from gallery.');
      if (lightboxItem?.id === id) setLightboxItem(null);
    }
  };

  // Filtered Media List
  const filteredMedia = useMemo(() => {
    return gallery.filter((item) => {
      if (activeCategory !== 'ALL' && item.category !== activeCategory) {
        return false;
      }
      if (mediaTypeFilter !== 'ALL' && item.type !== mediaTypeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesCaption = item.caption?.toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCaption && !matchesTags) return false;
      }
      return true;
    });
  }, [gallery, activeCategory, mediaTypeFilter, searchQuery]);

  const photoCount = gallery.filter((i) => i.type === 'IMAGE').length;
  const videoCount = gallery.filter((i) => i.type === 'YOUTUBE').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 99999,
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 800,
            border: `1.5px solid ${themeColor}`,
          }}
        >
          <CheckCircle2 size={18} color={themeColor} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── Top Header Strip ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '1.35rem 1.6rem',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: themeBg,
                color: themeColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Film size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                {title}
              </h2>
              <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '3px' }}>
                {subtitle}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleOpenAddModal('IMAGE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '10px',
              border: `1.5px solid ${themeColor}`,
              background: '#ffffff',
              color: themeColor,
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Camera size={16} />
            <span>+ Upload Photo</span>
          </button>

          <button
            onClick={() => handleOpenAddModal('YOUTUBE')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              background: `linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%)`,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            }}
          >
            <Video size={16} />
            <span>+ Embed YouTube Video</span>
          </button>
        </div>
      </div>

      {/* ── Summary Metrics Strip ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
        <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Gallery Items</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginTop: 2 }}>{gallery.length}</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f1f5f9', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers size={18} />
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>High-Res Photos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803d', marginTop: 2 }}>{photoCount}</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={18} />
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>YouTube Videos</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#b91c1c', marginTop: 2 }}>{videoCount}</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Video size={18} />
          </div>
        </div>
      </div>

      {/* ── Filter Bar & Search ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '14px',
          padding: '12px 16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: activeCategory === cat.id ? 800 : 600,
                border: `1.5px solid ${activeCategory === cat.id ? themeColor : '#e2e8f0'}`,
                background: activeCategory === cat.id ? themeBg : '#ffffff',
                color: activeCategory === cat.id ? themeColor : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Media Type & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
            {[
              { id: 'ALL', label: 'All' },
              { id: 'IMAGE', label: 'Photos' },
              { id: 'YOUTUBE', label: 'Videos' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setMediaTypeFilter(t.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: mediaTypeFilter === t.id ? 800 : 600,
                  border: 'none',
                  background: mediaTypeFilter === t.id ? '#ffffff' : 'transparent',
                  color: mediaTypeFilter === t.id ? '#0f172a' : '#64748b',
                  cursor: 'pointer',
                  boxShadow: mediaTypeFilter === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '5px 10px',
            }}
          >
            <Search size={14} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search title, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '12px',
                background: 'transparent',
                width: '160px',
                color: '#0f172a',
              }}
            />
            {searchQuery && (
              <X
                size={14}
                color="#94a3b8"
                style={{ cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Media Grid ── */}
      {filteredMedia.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            border: '2px dashed #e2e8f0',
          }}
        >
          <Camera size={44} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', margin: '0 0 6px' }}>
            No Media Items Found
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 1.25rem' }}>
            No photos or videos match your selected filter criteria. Upload new media now!
          </p>
          <button
            onClick={() => handleOpenAddModal('IMAGE')}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: themeColor,
              color: '#fff',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            + Add First Media Item
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredMedia.map((m) => {
            const isVideo = m.type === 'YOUTUBE';
            const catObj = categories.find((c) => c.id === m.category);

            return (
              <div
                key={m.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
                }}
              >
                {/* Media Preview Box */}
                <div style={{ position: 'relative', width: '100%', height: '200px', background: '#000000' }}>
                  {isVideo && m.youtubeId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${m.youtubeId}`}
                      title={m.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  ) : (
                    <img
                      src={m.imageUrl || m.thumbnail}
                      alt={m.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                      }}
                      onClick={() => setLightboxItem(m)}
                    />
                  )}

                  {/* Top Badges */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      display: 'flex',
                      gap: '6px',
                      pointerEvents: 'none',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '10.5px',
                        fontWeight: 800,
                        background: isVideo ? '#dc2626' : 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {isVideo ? <Video size={12} /> : <Camera size={12} />}
                      {isVideo ? 'YouTube' : 'Photo'}
                    </span>

                    {catObj && (
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '10.5px',
                          fontWeight: 700,
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#0f172a',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {catObj.label}
                      </span>
                    )}
                  </div>

                  {/* Top-Right Lightbox / Preview button for images */}
                  {!isVideo && (
                    <button
                      onClick={() => setLightboxItem(m)}
                      title="View Fullscreen"
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'rgba(0,0,0,0.6)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Maximize2 size={14} />
                    </button>
                  )}
                </div>

                {/* Content Details */}
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <div>
                    <h4
                      style={{
                        fontSize: '13.5px',
                        fontWeight: 800,
                        color: '#0f172a',
                        margin: '0 0 6px',
                        lineHeight: 1.35,
                      }}
                    >
                      {m.title}
                    </h4>

                    {m.caption && (
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#64748b',
                          margin: '0 0 8px',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {m.caption}
                      </p>
                    )}

                    {m.tags && m.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {m.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              fontSize: '10px',
                              background: '#f1f5f9',
                              color: '#475569',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Controls */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '8px',
                      borderTop: '1px solid #f1f5f9',
                      marginTop: '8px',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Active'}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isVideo && (
                        <a
                          href={m.youtubeUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open on YouTube"
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            textDecoration: 'none',
                            fontSize: '11px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                          }}
                        >
                          <ExternalLink size={12} />
                          <span>Link</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleDeleteItem(m.id, m.title)}
                        title="Delete Media"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Modal: Add New Media (Photo Upload or YouTube Video) ── */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '18px',
              width: '100%',
              maxWidth: '560px',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>{mediaForm.type === 'YOUTUBE' ? '🎥' : '📷'}</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  Add Media to {title}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Media Type Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
              <button
                type="button"
                onClick={() => setMediaForm((prev) => ({ ...prev, type: 'IMAGE' }))}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: `2px solid ${mediaForm.type === 'IMAGE' ? themeColor : '#e2e8f0'}`,
                  background: mediaForm.type === 'IMAGE' ? themeBg : '#ffffff',
                  color: mediaForm.type === 'IMAGE' ? themeColor : '#475569',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Camera size={16} />
                <span>Photo (File or URL)</span>
              </button>

              <button
                type="button"
                onClick={() => setMediaForm((prev) => ({ ...prev, type: 'YOUTUBE' }))}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: '10px',
                  border: `2px solid ${mediaForm.type === 'YOUTUBE' ? '#dc2626' : '#e2e8f0'}`,
                  background: mediaForm.type === 'YOUTUBE' ? '#fef2f2' : '#ffffff',
                  color: mediaForm.type === 'YOUTUBE' ? '#dc2626' : '#475569',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Video size={16} />
                <span>YouTube Video Link</span>
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmitMedia} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '5px' }}>
                  Media Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20ft Aadiyogi Mahadev Stage & Cold Pyro Fireworks"
                  value={mediaForm.title}
                  onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '5px' }}>
                  Category *
                </label>
                <select
                  value={mediaForm.category}
                  onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    background: '#ffffff',
                  }}
                >
                  {categories.filter((c) => c.id !== 'ALL').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type = IMAGE */}
              {mediaForm.type === 'IMAGE' ? (
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '5px' }}>
                    Photo Selection *
                  </label>

                  {/* Clean, Simple Image Picker Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '1.5px dashed #cbd5e1',
                      borderRadius: '10px',
                      padding: '14px',
                      textAlign: 'center',
                      background: '#f8fafc',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                      e.currentTarget.style.background = themeBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.background = '#f8fafc';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Upload size={18} color={themeColor} />
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>
                        Click to choose photo from device
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: 2 }}>
                      Auto-resizes & fits smoothly (PNG, JPG, WebP up to 8MB)
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="url"
                      placeholder="Or enter image URL: https://images.unsplash.com/..."
                      value={mediaForm.imageUrl.startsWith('data:image') ? 'Uploaded from device (Image Ready)' : mediaForm.imageUrl}
                      onChange={(e) => {
                        if (!e.target.value.startsWith('Uploaded')) {
                          setMediaForm({ ...mediaForm, imageUrl: e.target.value });
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '12.5px',
                        boxSizing: 'border-box',
                        color: mediaForm.imageUrl.startsWith('data:image') ? '#16a34a' : '#0f172a',
                        fontWeight: mediaForm.imageUrl.startsWith('data:image') ? 700 : 500,
                      }}
                    />
                    {mediaForm.imageUrl && (
                      <button
                        type="button"
                        onClick={() => setMediaForm({ ...mediaForm, imageUrl: '' })}
                        style={{
                          padding: '7px 10px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          color: '#ef4444',
                          fontWeight: 700,
                        }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Clean responsive preview */}
                  {mediaForm.imageUrl && (
                    <div
                      style={{
                        marginTop: '8px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        height: '110px',
                        border: '1px solid #e2e8f0',
                        background: '#000000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={mediaForm.imageUrl}
                        alt="Preview"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                /* Type = YOUTUBE */
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#dc2626', display: 'block', marginBottom: '5px' }}>
                    YouTube Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    value={mediaForm.youtubeUrl}
                    onChange={(e) => setMediaForm({ ...mediaForm, youtubeUrl: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #fca5a5',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                    Paste YouTube link. It will automatically play directly inside the dashboard gallery!
                  </div>

                  {extractYouTubeId(mediaForm.youtubeUrl) && (
                    <div style={{ marginTop: '10px', borderRadius: '10px', overflow: 'hidden', height: '150px' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(mediaForm.youtubeUrl)}`}
                        title="Preview"
                        style={{ width: '100%', height: '100%', border: 'none' }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Caption & Description */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '5px' }}>
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short note about this setup, client review, or event specs..."
                  value={mediaForm.caption}
                  onChange={(e) => setMediaForm({ ...mediaForm, caption: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Tags */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '5px' }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="aadiyogi, royal-entry, 2026-season, cold-pyro"
                  value={mediaForm.tags}
                  onChange={(e) => setMediaForm({ ...mediaForm, tags: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '9px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    background: mediaForm.type === 'YOUTUBE' ? '#dc2626' : themeColor,
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  + Save to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Lightbox: Fullscreen Preview ── */}
      {lightboxItem && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setLightboxItem(null)}
        >
          <div
            style={{
              maxWidth: '900px',
              width: '100%',
              background: '#0f172a',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', borderBottom: '1px solid #1e293b' }}>
              <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '14px' }}>
                {lightboxItem.title}
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '70vh', background: '#000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={lightboxItem.imageUrl || lightboxItem.thumbnail}
                alt={lightboxItem.title}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            </div>

            {lightboxItem.caption && (
              <div style={{ padding: '12px 18px', color: '#cbd5e1', fontSize: '12.5px', borderTop: '1px solid #1e293b' }}>
                {lightboxItem.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
