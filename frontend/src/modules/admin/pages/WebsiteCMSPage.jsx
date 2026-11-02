/**
 * @file WebsiteCMSPage.jsx
 * @description Dynamic Public Website Content Management: Pages, Sections, FAQs, and Testimonials.
 * Conforms to Sections 56, 57, 58.
 * @module frontend/src/modules/admin/pages/WebsiteCMSPage
 */

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Globe, Sparkles, HelpCircle, MessageSquare, ExternalLink, Save } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import { websiteFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const WebsiteCMSPage = () => {
  const { tenant } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'pages' | 'sections'

  const [websiteConfig, setWebsiteConfig] = useState({
    title: '',
    tagline: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    heroHeading: '',
    heroSubheading: '',
    instagram: '',
    facebook: '',
  });

  const [pages, setPages] = useState([]);
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [pageModalOpen, setPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);

  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [wRes, pRes, sRes] = await Promise.all([
        websiteFetcher.getWebsite(),
        websiteFetcher.getPages(),
        websiteFetcher.getSections(),
      ]);
      if (wRes?.data) setWebsiteConfig(wRes.data);
      setPages(pRes.data || []);
      setSections(sRes.data || []);
    } catch (err) {
      toast.error('Failed to load website CMS config');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await websiteFetcher.updateWebsite(websiteConfig);
      toast.success('Website profile updated successfully');
    } catch (err) {
      toast.error('Failed to update website profile');
    }
  };

  const handleSavePage = async (data) => {
    try {
      if (editingPage) {
        await websiteFetcher.updatePage(editingPage._id, data);
        toast.success('Page updated');
      } else {
        await websiteFetcher.createPage(data);
        toast.success('Page published');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save page');
    }
  };

  const handleSaveSection = async (data) => {
    try {
      if (editingSection) {
        await websiteFetcher.updateSection(editingSection._id, data);
        toast.success('Section updated');
      } else {
        await websiteFetcher.createSection(data);
        toast.success('Section added to homepage');
      }
      loadData();
    } catch (err) {
      toast.error('Failed to save section');
    }
  };

  const pageFields = [
    { name: 'title', label: 'Page Title', required: true, placeholder: 'e.g. Bridal Services, About Our Academy' },
    { name: 'slug', label: 'URL Slug', required: true, placeholder: 'e.g. bridal-services' },
    { name: 'content', label: 'Page Content (Markdown / HTML)', type: 'textarea', rows: 6, required: true },
  ];

  const sectionFields = [
    { name: 'title', label: 'Section Title', required: true, placeholder: 'e.g. Our Signature Treatments, Testimonials' },
    {
      name: 'type',
      label: 'Section Template Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Feature Hero Banner', value: 'hero' },
        { label: 'Services Showcase', value: 'services' },
        { label: 'Photo Gallery', value: 'gallery' },
        { label: 'Client Testimonials', value: 'testimonials' },
        { label: 'Frequently Asked Questions (FAQ)', value: 'faqs' },
      ],
    },
    { name: 'description', label: 'Section Subtitle / Description', type: 'textarea' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Public Website & Brand CMS
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Configure your client-facing salon portal, landing pages, testimonials, and SEO branding
          </p>
        </div>
        <div>
          {activeTab === 'pages' && (
            <button
              onClick={() => {
                setEditingPage(null);
                setPageModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Create Custom Page
            </button>
          )}
          {activeTab === 'sections' && (
            <button
              onClick={() => {
                setEditingSection(null);
                setSectionModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus className="w-4 h-4" /> Add Section
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('profile')}
          className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Globe className="w-4 h-4" /> Business Profile & Hero
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`btn ${activeTab === 'pages' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles className="w-4 h-4" /> Custom Web Pages
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`btn ${activeTab === 'sections' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <HelpCircle className="w-4 h-4" /> Homepage Sections & FAQs
        </button>
      </div>

      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="card"
          style={{
            padding: '1.5rem',
            borderRadius: '12px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Website Portal Title
              </label>
              <input
                type="text"
                value={websiteConfig.title || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, title: e.target.value })}
                className="form-input"
                placeholder="e.g. Blossom Luxury Salon & Spa"
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Tagline / Slogan
              </label>
              <input
                type="text"
                value={websiteConfig.tagline || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, tagline: e.target.value })}
                className="form-input"
                placeholder="e.g. Redefining Glamour & Elegance"
                style={{ marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Hero Main Heading
              </label>
              <input
                type="text"
                value={websiteConfig.heroHeading || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, heroHeading: e.target.value })}
                className="form-input"
                placeholder="e.g. Experience World-Class Beauty"
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Hero Subheading
              </label>
              <input
                type="text"
                value={websiteConfig.heroSubheading || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, heroSubheading: e.target.value })}
                className="form-input"
                placeholder="e.g. Book luxury parlour and salon treatments at your fingertips"
                style={{ marginTop: '4px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Instagram Handle
              </label>
              <input
                type="text"
                value={websiteConfig.instagram || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, instagram: e.target.value })}
                className="form-input"
                placeholder="@blossomsalon"
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Facebook Page
              </label>
              <input
                type="text"
                value={websiteConfig.facebook || ''}
                onChange={(e) => setWebsiteConfig({ ...websiteConfig, facebook: e.target.value })}
                className="form-input"
                placeholder="fb.com/blossomsalon"
                style={{ marginTop: '4px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              About Business Story
            </label>
            <textarea
              value={websiteConfig.description || ''}
              onChange={(e) => setWebsiteConfig({ ...websiteConfig, description: e.target.value })}
              className="form-input"
              rows={4}
              placeholder="Tell your clients about your stylists, products, and story..."
              style={{ marginTop: '4px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Save className="w-4 h-4" /> Save Website Changes
            </button>
          </div>
        </form>
      )}

      {activeTab === 'pages' && (
        <DataTable
          columns={[
            { header: 'Page Title', accessor: 'title' },
            { header: 'Slug', accessor: 'slug', render: (row) => `/${row.slug}` },
            {
              header: 'Actions',
              render: (row) => (
                <button
                  onClick={() => {
                    setEditingPage(row);
                    setPageModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              ),
            },
          ]}
          data={pages}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'sections' && (
        <DataTable
          columns={[
            { header: 'Section Title', accessor: 'title' },
            { header: 'Type', accessor: 'type' },
            {
              header: 'Actions',
              render: (row) => (
                <button
                  onClick={() => {
                    setEditingSection(row);
                    setSectionModalOpen(true);
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              ),
            },
          ]}
          data={sections}
          isLoading={isLoading}
        />
      )}

      <FormModal
        isOpen={pageModalOpen}
        onClose={() => setPageModalOpen(false)}
        title={editingPage ? 'Edit Page' : 'Create Custom Web Page'}
        fields={pageFields}
        initialData={editingPage || {}}
        onSubmit={handleSavePage}
      />

      <FormModal
        isOpen={sectionModalOpen}
        onClose={() => setSectionModalOpen(false)}
        title={editingSection ? 'Edit Section' : 'Add Homepage Section'}
        fields={sectionFields}
        initialData={editingSection || {}}
        onSubmit={handleSaveSection}
      />
    </div>
  );
};

export default WebsiteCMSPage;
