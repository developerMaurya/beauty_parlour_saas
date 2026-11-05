/**
 * @file WebsiteCMSPage.jsx
 * @description Master Dynamic Website CMS & Brand Control Center.
 * Controls: Brand Logos, Multi-Banner Hero Slider, Dynamic Navigation Menus, About Heritage & Stats,
 * Contact Details & Embedded Google Maps, Service Showcase Highlights, and Client Inquiries.
 * @module frontend/src/modules/admin/pages/WebsiteCMSPage
 */

import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Save,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Layers,
  Award,
  CheckCircle2,
  Eye,
  Megaphone,
  BookOpen,
  Image,
  Sliders,
  Menu,
  Check,
  X,
  Share2,
  Tag,
  Star,
  Compass,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { websiteFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';
import { buildTenantUrl } from '../../../utils/tenantDomain.js';

export const WebsiteCMSPage = () => {
  const { tenant } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('branding'); // 'branding' | 'hero' | 'about' | 'menu' | 'contact' | 'services' | 'inquiries'

  const [websiteConfig, setWebsiteConfig] = useState({
    businessName: '',
    tagline: '',
    logoUrl: '',
    faviconUrl: '',
    primaryColor: '#ec4899',
    heroHeading: '',
    heroSubheading: '',
    banners: [
      {
        title: 'Haute Couture Bridal & Luxury Grooming',
        subtitle: 'Experience international aesthetics with certified cosmetology artists.',
        imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Book VIP Appointment',
        buttonUrl: '/book',
        isActive: true,
      },
      {
        title: 'Accredited Cosmetology Academy Training',
        subtitle: 'Government-recognized diplomas in hair, dermal aesthetics, and bridal airbrush.',
        imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Explore Academy Courses',
        buttonUrl: '/academy',
        isActive: true,
      },
      {
        title: 'Luxury Doorstep Home Salon Services',
        subtitle: 'Doorstep beauty rituals delivered by master specialists with sterilized travel kits.',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80',
        buttonText: 'Order Home Visit',
        buttonUrl: '/book',
        isActive: true,
      },
    ],
    navMenu: [
      { label: 'Home', path: '/', isVisible: true, order: 1 },
      { label: 'Services', path: '/services', isVisible: true, order: 2 },
      { label: 'Packages', path: '/packages', isVisible: true, order: 3 },
      { label: 'Offers', path: '/offers', isVisible: true, order: 4 },
      { label: 'Branches', path: '/branches', isVisible: true, order: 5 },
      { label: 'Academy', path: '/academy', isVisible: true, order: 6 },
      { label: 'About Us', path: '/about', isVisible: true, order: 7 },
      { label: 'Contact', path: '/contact', isVisible: true, order: 8 },
    ],
    aboutStory: '',
    aboutStats: [
      { label: 'Happy Salon Guests', value: '15,000+', icon: '👥' },
      { label: 'Certified Artists', value: '45+', icon: '✂️' },
      { label: 'Years of Excellence', value: '12+', icon: '🏆' },
      { label: 'Awards & Honors', value: '8', icon: '⭐' },
    ],
    aboutFounder: {
      name: 'Aditi Singhania',
      role: 'Founder & Artistic Director',
      quote: 'Beauty is not just appearance—it is an authentic ritual of wellness, self-revelation, and artistic excellence.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
      experienceYears: 14,
    },
    contactPhone: '+91 98765 43210',
    whatsappPhone: '+91 98765 43210',
    contactEmail: 'concierge@yourbrand.com',
    address: 'Plot 42, Ring Road, South Extension Part 2, New Delhi - 110049',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14015.654884218903!2d77.2182!3d28.5708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce26d830b80ef%3A0x6b45a0b777a83d3e!2sSouth%20Extension%20II%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1700000000000',
    openingHoursText: 'Mon - Sun: 9:00 AM - 9:00 PM',
    socialLinks: {
      instagram: 'https://instagram.com/',
      whatsapp: 'https://wa.me/919876543210',
      facebook: 'https://facebook.com/',
      youtube: 'https://youtube.com/',
    },
    announcementBar: {
      text: '✨ Special Privilege: 20% OFF on First Online Appointment Booking! Code: GLAM20',
      isVisible: true,
      linkUrl: '/book',
    },
    dynamicCategories: [
      { name: 'Hair Care & Styling', slug: 'hair', icon: '✂️' },
      { name: 'Skin & Facials', slug: 'skin', icon: '💆' },
      { name: 'Bridal Artistry', slug: 'bridal', icon: '💄' },
      { name: 'Nails & Pedicure', slug: 'nails', icon: '💅' },
      { name: 'Academy Training', slug: 'academy', icon: '🎓' },
      { name: 'Luxury Spa', slug: 'spa', icon: '🌿' },
      { name: 'Instant Booking', slug: 'booking', icon: '📅' },
    ],
    inquiries: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New Menu Item State
  const [newMenuLabel, setNewMenuLabel] = useState('');
  const [newMenuPath, setNewMenuPath] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const res = await websiteFetcher.getWebsite();
      const cfg = res?.data?.data || res?.data || res;
      if (cfg && typeof cfg === 'object') {
        setWebsiteConfig((p) => ({
          ...p,
          ...cfg,
          banners: cfg.banners?.length > 0 ? cfg.banners : p.banners,
          navMenu: cfg.navMenu?.length > 0 ? cfg.navMenu : p.navMenu,
          aboutStats: cfg.aboutStats?.length > 0 ? cfg.aboutStats : p.aboutStats,
          aboutFounder: { ...p.aboutFounder, ...(cfg.aboutFounder || {}) },
          announcementBar: cfg.announcementBar || p.announcementBar,
          dynamicCategories: cfg.dynamicCategories?.length > 0 ? cfg.dynamicCategories : p.dynamicCategories,
          socialLinks: { ...p.socialLinks, ...(cfg.socialLinks || {}) },
          inquiries: cfg.inquiries || [],
        }));
      }
    } catch (err) {
      toast.error('Failed to load website CMS configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveConfig = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    try {
      await websiteFetcher.updateWebsite(websiteConfig);
      toast.success('Website configuration saved! All changes are now live on your customer website.');
    } catch (err) {
      toast.error(err.message || 'Failed to update website configuration');
    } finally {
      setIsSaving(false);
    }
  };

  // Banner Operations
  const handleAddBannerSlide = () => {
    const newSlide = {
      title: 'New Featured Beauty Ritual',
      subtitle: 'Custom headline for your seasonal campaign or festive package.',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
      buttonText: 'Book Now',
      buttonUrl: '/book',
      isActive: true,
    };
    setWebsiteConfig((p) => ({
      ...p,
      banners: [...p.banners, newSlide],
    }));
    toast.success('New banner slide added. Fill in details and click "Save Live Changes"!');
  };

  const handleRemoveBannerSlide = (idx) => {
    if (websiteConfig.banners.length <= 1) {
      toast.error('At least one banner slide is required');
      return;
    }
    setWebsiteConfig((p) => ({
      ...p,
      banners: p.banners.filter((_, i) => i !== idx),
    }));
  };

  // Nav Menu Operations
  const handleAddCustomMenuItem = (e) => {
    e?.preventDefault();
    if (!newMenuLabel.trim() || !newMenuPath.trim()) {
      toast.error('Menu Label and Link Path are required');
      return;
    }
    const newItem = {
      label: newMenuLabel.trim(),
      path: newMenuPath.trim(),
      isVisible: true,
      order: websiteConfig.navMenu.length + 1,
    };
    setWebsiteConfig((p) => ({
      ...p,
      navMenu: [...p.navMenu, newItem],
    }));
    setNewMenuLabel('');
    setNewMenuPath('');
    toast.success(`Menu item "${newItem.label}" added!`);
  };

  const handleToggleNavVisibility = (idx) => {
    setWebsiteConfig((p) => {
      const updated = [...p.navMenu];
      updated[idx].isVisible = !updated[idx].isVisible;
      return { ...p, navMenu: updated };
    });
  };

  const handleRemoveMenuItem = (idx) => {
    setWebsiteConfig((p) => ({
      ...p,
      navMenu: p.navMenu.filter((_, i) => i !== idx),
    }));
  };

  const liveWebsiteUrl = buildTenantUrl(tenant, 'public');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '3rem' }}>
      {/* ── Top Header with Live Website Launcher ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-surface)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(236, 72, 153, 0.15)',
                color: '#ec4899',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              <Sparkles className="w-3 h-3" /> Full Website Control Suite
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              • Dynamic Menus, Multi-Sliders, About Heritage & Maps
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            Website Content & Brand Experience CMS
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Everything modified here dynamically publishes to your white-label customer storefront:
            <code style={{ marginLeft: '6px', color: 'var(--primary)', background: 'rgba(99, 102, 241, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
              {liveWebsiteUrl}
            </code>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <a
            href={liveWebsiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', textDecoration: 'none' }}
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Open Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700 }}
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing Live...' : 'Save & Publish Live Website'}</span>
          </button>
        </div>
      </div>

      {/* ── Navigation Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '0.5rem',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'branding', label: 'Brand Logo & Theme', icon: Globe },
          { id: 'hero', label: 'Multi-Banner Hero Slider', icon: Image, count: websiteConfig.banners?.length },
          { id: 'menu', label: 'Dynamic Navigation Menu', icon: Menu, count: websiteConfig.navMenu?.length },
          { id: 'about', label: 'About Us Heritage & Founder', icon: Award },
          { id: 'contact', label: 'Contact, Embedded Map & Hours', icon: Phone },
          { id: 'services', label: 'Services Showcase & Ribbons', icon: Sliders },
          { id: 'inquiries', label: 'Customer Inquiries Inbox', icon: MessageSquare, count: websiteConfig.inquiries?.length || 0 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap',
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.06)',
                    color: isActive ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          TAB 1: BRAND LOGO & THEME PALETTE
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveConfig} className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Salon Identity, Logo & Theme Styling
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Configure your brand logo, tagline, favicon, and primary color palette.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Salon / Academy Business Name *</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.businessName || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, businessName: e.target.value })}
                placeholder="e.g. Glamour Cosmetology Academy & Luxury Salon"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Brand Subtitle / Tagline</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.tagline || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, tagline: e.target.value })}
                placeholder="e.g. Haute Couture Grooming & Certified Academy"
              />
            </div>
          </div>

          {/* Logo & Favicon with Live Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Brand Logo Image URL</label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.logoUrl || ''}
                  onChange={(e) => setWebsiteConfig({ ...websiteConfig, logoUrl: e.target.value })}
                  placeholder="https://yourdomain.com/logo.png"
                />
                {websiteConfig.logoUrl && (
                  <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#0f172a', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <img src={websiteConfig.logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                )}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Leave empty to display stylish brand gradient monogram icon.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">Browser Favicon URL</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.faviconUrl || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, faviconUrl: e.target.value })}
                placeholder="https://yourdomain.com/favicon.ico"
              />
            </div>
          </div>

          {/* Color Palette Switcher */}
          <div>
            <label className="form-label">Primary Brand Accent Palette</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <input
                type="color"
                value={websiteConfig.primaryColor || '#ec4899'}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, primaryColor: e.target.value })}
                style={{ width: '48px', height: '40px', padding: '0', border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'transparent' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{websiteConfig.primaryColor}</span>
              <div style={{ display: 'flex', gap: '8px', marginLeft: '12px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Rose Gold Glamour', color: '#ec4899' },
                  { label: 'Royal Amethyst', color: '#8b5cf6' },
                  { label: 'Amber Bronze Luxe', color: '#f59e0b' },
                  { label: 'Emerald Ayurvedic Spa', color: '#10b981' },
                  { label: 'Sapphire Modern Blue', color: '#38bdf8' },
                  { label: 'Crimson Couture', color: '#f43f5e' },
                ].map((preset) => (
                  <button
                    key={preset.color}
                    type="button"
                    onClick={() => setWebsiteConfig({ ...websiteConfig, primaryColor: preset.color })}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', background: preset.color, border: websiteConfig.primaryColor === preset.color ? '3px solid #fff' : 'none', cursor: 'pointer' }}
                    title={preset.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save & Publish Branding'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 2: MULTI-BANNER HERO SLIDER & ANNOUNCEMENTS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'hero' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Announcement Bar */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>Top Announcement Bar Ticker</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={websiteConfig.announcementBar?.isVisible !== false}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    announcementBar: { ...websiteConfig.announcementBar, isVisible: e.target.checked }
                  })}
                />
                <span style={{ fontWeight: 600 }}>Show Ticker on Website</span>
              </label>
            </div>
            <input
              type="text"
              className="form-input"
              value={websiteConfig.announcementBar?.text || ''}
              onChange={(e) => setWebsiteConfig({
                ...websiteConfig,
                announcementBar: { ...websiteConfig.announcementBar, text: e.target.value }
              })}
              placeholder="e.g. ✨ Special Privilege: 20% OFF on First Online Appointment Booking! Code: GLAM20"
            />
          </div>

          {/* Multiple Hero Banner Slides */}
          <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Hero Banner Slider & Visual Showcase
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Add multiple hero banners with background imagery, headlines, and call-to-action buttons.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBannerSlide}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus className="w-4 h-4" /> Add Banner Slide
              </button>
            </div>

            {/* Slides List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {(websiteConfig.banners || []).map((slide, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)' }}>
                      SLIDE #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveBannerSlide(idx)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove Slide
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Banner Image URL *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={slide.imageUrl || ''}
                        onChange={(e) => {
                          const updated = [...websiteConfig.banners];
                          updated[idx].imageUrl = e.target.value;
                          setWebsiteConfig({ ...websiteConfig, banners: updated });
                        }}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Slide Headline Title *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const updated = [...websiteConfig.banners];
                          updated[idx].title = e.target.value;
                          setWebsiteConfig({ ...websiteConfig, banners: updated });
                        }}
                        placeholder="e.g. Haute Couture Bridal Styling"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Slide Subheading / Descriptive Pitch</label>
                    <input
                      type="text"
                      className="form-input"
                      value={slide.subtitle || ''}
                      onChange={(e) => {
                        const updated = [...websiteConfig.banners];
                        updated[idx].subtitle = e.target.value;
                        setWebsiteConfig({ ...websiteConfig, banners: updated });
                      }}
                      placeholder="e.g. Experience bespoke bridal makeovers and certified artists."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Button Text</label>
                      <input
                        type="text"
                        className="form-input"
                        value={slide.buttonText || 'Book Appointment'}
                        onChange={(e) => {
                          const updated = [...websiteConfig.banners];
                          updated[idx].buttonText = e.target.value;
                          setWebsiteConfig({ ...websiteConfig, banners: updated });
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Button Action Link</label>
                      <input
                        type="text"
                        className="form-input"
                        value={slide.buttonUrl || '/book'}
                        onChange={(e) => {
                          const updated = [...websiteConfig.banners];
                          updated[idx].buttonUrl = e.target.value;
                          setWebsiteConfig({ ...websiteConfig, banners: updated });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Save className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save & Publish Banners'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 3: DYNAMIC NAVIGATION MENU MANAGER
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'menu' && (
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Header Navigation Menu Manager
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Control which menu links show up in the top header on your live website, toggle visibility, and add custom pages.
            </p>
          </div>

          {/* Add Custom Item */}
          <form onSubmit={handleAddCustomMenuItem} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Menu Item Label *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bridal Gallery, VIP Club"
                value={newMenuLabel}
                onChange={(e) => setNewMenuLabel(e.target.value)}
              />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Link Path / URL *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. /services, /about, or https://..."
                value={newMenuPath}
                onChange={(e) => setNewMenuPath(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '40px' }}>
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </form>

          {/* Nav Menu Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Menu Label</th>
                  <th>Destination Path</th>
                  <th>Live Visibility</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(websiteConfig.navMenu || []).map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--primary)' }}>#{idx + 1}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...websiteConfig.navMenu];
                          updated[idx].label = e.target.value;
                          setWebsiteConfig({ ...websiteConfig, navMenu: updated });
                        }}
                        style={{ height: '34px', fontSize: '0.85rem' }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-input"
                        value={item.path}
                        onChange={(e) => {
                          const updated = [...websiteConfig.navMenu];
                          updated[idx].path = e.target.value;
                          setWebsiteConfig({ ...websiteConfig, navMenu: updated });
                        }}
                        style={{ height: '34px', fontSize: '0.85rem', fontFamily: 'monospace' }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleToggleNavVisibility(idx)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          background: item.isVisible ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: item.isVisible ? '#10b981' : '#ef4444',
                        }}
                      >
                        {item.isVisible ? '● Visible on Header' : '✕ Hidden'}
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleRemoveMenuItem(idx)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Delete Menu Link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save & Publish Menu'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 4: ABOUT US HERITAGE & FOUNDER STORY
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveConfig} className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              About Us Heritage, Philosophy & Founder Profile
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Appears on the dedicated <code>/about</code> page and homepage brand showcase.
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Brand Story & Heritage Narrative *</label>
            <textarea
              rows={5}
              className="form-input"
              value={websiteConfig.aboutStory || ''}
              onChange={(e) => setWebsiteConfig({ ...websiteConfig, aboutStory: e.target.value })}
              placeholder="Founded with a passion for aesthetic perfection, our salon brings international standards..."
            />
          </div>

          {/* Key Brand Stats */}
          <div>
            <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>
              Key Milestones & Numbers
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {(websiteConfig.aboutStats || []).map((stat, i) => (
                <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...websiteConfig.aboutStats];
                      updated[i].value = e.target.value;
                      setWebsiteConfig({ ...websiteConfig, aboutStats: updated });
                    }}
                    style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '4px' }}
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...websiteConfig.aboutStats];
                      updated[i].label = e.target.value;
                      setWebsiteConfig({ ...websiteConfig, aboutStats: updated });
                    }}
                    style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Founder Profile */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
              Founder & Master Director Spotlight
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Founder Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.aboutFounder?.name || ''}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    aboutFounder: { ...websiteConfig.aboutFounder, name: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Founder Role / Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.aboutFounder?.role || ''}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    aboutFounder: { ...websiteConfig.aboutFounder, role: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Founder Photo Image URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.aboutFounder?.photoUrl || ''}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    aboutFounder: { ...websiteConfig.aboutFounder, photoUrl: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.75rem' }}>
              <label className="form-label">Founder Quote / Inspirational Philosophy</label>
              <textarea
                rows={2}
                className="form-input"
                value={websiteConfig.aboutFounder?.quote || ''}
                onChange={(e) => setWebsiteConfig({
                  ...websiteConfig,
                  aboutFounder: { ...websiteConfig.aboutFounder, quote: e.target.value }
                })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save & Publish About Page'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 5: CONTACT, EMBEDDED MAP & SOCIAL HANDLES
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveConfig} className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Concierge Contact Information, Operating Hours & Google Maps
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Appears on website footer, contact card, and dedicated <code>/contact</code> page.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Concierge Telephone *</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.contactPhone || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, contactPhone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">WhatsApp Quick Booking Number</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.whatsappPhone || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, whatsappPhone: e.target.value })}
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Support Email Address</label>
              <input
                type="email"
                className="form-input"
                value={websiteConfig.contactEmail || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, contactEmail: e.target.value })}
                placeholder="concierge@yourbrand.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Salon Street Address</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.address || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, address: e.target.value })}
                placeholder="Plot 42, Ring Road, South Extension Part 2, New Delhi"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Operating Hours Display Text</label>
              <input
                type="text"
                className="form-input"
                value={websiteConfig.openingHoursText || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, openingHoursText: e.target.value })}
                placeholder="Mon - Sun: 9:00 AM - 9:00 PM"
              />
            </div>
          </div>

          {/* Embedded Google Map URL */}
          <div className="form-group">
            <label className="form-label">Google Maps Embedded Location (Embed URL / Iframe src) *</label>
            <input
              type="text"
              className="form-input"
              value={websiteConfig.mapEmbedUrl || ''}
              onChange={(e) => setWebsiteConfig({ ...websiteConfig, mapEmbedUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Copy the embed link from Google Maps &gt; Share &gt; Embed a map.
            </span>
          </div>

          {/* Social Links */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>
              Social Media Channels & Handles
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
              <div className="form-group">
                <label className="form-label">Instagram Profile URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.socialLinks?.instagram || ''}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    socialLinks: { ...websiteConfig.socialLinks, instagram: e.target.value }
                  })}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Facebook Page URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.socialLinks?.facebook || ''}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    socialLinks: { ...websiteConfig.socialLinks, facebook: e.target.value }
                  })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="form-group">
                <label className="form-label">YouTube Channel URL</label>
                <input
                  type="text"
                  className="form-input"
                  value={websiteConfig.socialLinks?.youtube || ''}
                  onChange={(e) => setWebsiteConfig({
                    ...websiteConfig,
                    socialLinks: { ...websiteConfig.socialLinks, youtube: e.target.value }
                  })}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Save className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save & Publish Contact & Map'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 6: SERVICES SHOWCASE & RIBBONS
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'services' && (
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Dynamic Secondary Category Ribbon & Filter Bar
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              These category chips render right underneath the top header on your live website for instant 1-click filtering.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(websiteConfig.dynamicCategories || []).map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(236, 72, 153, 0.15)',
                  border: '1px solid rgba(236, 72, 153, 0.3)',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                <span>{item.icon || '✨'}</span>
                <span>{item.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setWebsiteConfig((p) => ({
                      ...p,
                      dynamicCategories: p.dynamicCategories.filter((_, i) => i !== idx),
                    }));
                  }}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0 2px', fontSize: '14px' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save className="w-4 h-4" /> <span>{isSaving ? 'Saving...' : 'Save Ribbon Changes'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          TAB 7: CUSTOMER INQUIRIES & LEADS INBOX
          ══════════════════════════════════════════════════════════════ */}
      {activeTab === 'inquiries' && (
        <div className="card" style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Website Inquiries & Booking Requests
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Messages submitted by customers through your public <code>/contact</code> form.
            </p>
          </div>

          {(websiteConfig.inquiries || []).length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '1px dashed var(--border-color)', borderRadius: '10px' }}>
              No inquiries received yet. Submit a test inquiry on your website at <code>/contact</code>!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {websiteConfig.inquiries.map((inq, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {inq.name}
                    </div>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                      {inq.serviceInterest || 'General Inquiry'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '16px', fontSize: '12.5px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                    {inq.phone && <span>📞 {inq.phone}</span>}
                    {inq.email && <span>✉️ {inq.email}</span>}
                    {inq.preferredBranch && <span>🏢 {inq.preferredBranch}</span>}
                    {inq.createdAt && <span>⏱️ {new Date(inq.createdAt).toLocaleDateString('en-IN')}</span>}
                  </div>

                  {inq.message && (
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: '6px', marginTop: '4px' }}>
                      "{inq.message}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebsiteCMSPage;
