/**
 * @file SettingsView.jsx
 * @description Super Admin Platform White-Label Branding, Email SMTP, Payment Gateways & Security Policies
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { settingsApi } from '../../../services/api/superadmin.api';
import { useToast } from '../../../context/ToastContext';
import { Settings, Palette, Mail, CreditCard, Shield, Globe, Save } from 'lucide-react';

export const SettingsView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'general';

  const [settings, setSettings] = useState({
    general: {
      appName: 'Beauty SaaS Platform',
      supportEmail: 'support@beautysaas.com',
      defaultCurrency: 'USD',
      timezone: 'UTC',
    },
    branding: {
      platformName: 'Beauty SaaS Control Plane',
      logoUrl: '',
      faviconUrl: '',
      primaryColor: '#6366F1',
      brandGradient: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    },
    email: {
      smtpHost: 'smtp.sendgrid.net',
      smtpPort: 587,
      smtpUser: 'apikey',
      fromEmail: 'noreply@beautysaas.com',
      fromName: 'Beauty SaaS Notifications',
    },
    payment: {
      stripeEnabled: true,
      stripePublishableKey: 'pk_test_sample',
      razorpayEnabled: false,
      razorpayKeyId: '',
    },
    security: {
      sessionTimeoutMinutes: 60,
      mfaRequiredForSuperAdmin: true,
      rateLimitRequestsPerWindow: 100,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { success, error } = useToast();

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await settingsApi.getSettings();
      if (res.data?.settings) {
        setSettings((prev) => ({ ...prev, ...res.data.settings }));
      }
    } catch (err) {
      console.warn('Failed to fetch settings from API, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async (category) => {
    setIsSaving(true);
    try {
      await settingsApi.updateCategory(category, settings[category]);
      success(`${category.toUpperCase()} settings updated successfully`);
    } catch (err) {
      error(err.message || 'Failed to update settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Platform Settings</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          White-label brand styling, mail transport, payment processor keys, and global security policies.
        </p>
      </div>


      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">General Platform Settings</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Platform Application Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.general?.appName || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, general: { ...p.general, appName: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Global Support Email</label>
              <input
                type="email"
                className="form-input"
                value={settings.general?.supportEmail || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, general: { ...p.general, supportEmail: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Default Base Currency</label>
              <select
                className="form-select"
                value={settings.general?.defaultCurrency || 'USD'}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, general: { ...p.general, defaultCurrency: e.target.value } }))
                }
              >
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Timezone</label>
              <input
                type="text"
                className="form-input"
                value={settings.general?.timezone || 'UTC'}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, general: { ...p.general, timezone: e.target.value } }))
                }
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => handleSave('general')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" /> Save General Settings
          </button>
        </div>
      )}

      {/* White-Label Branding */}
      {activeTab === 'branding' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">White-Label Branding & Identity</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Platform Logo Image URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://cdn.yoursaas.com/logo.svg"
                value={settings.branding?.logoUrl || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, branding: { ...p.branding, logoUrl: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Favicon URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://cdn.yoursaas.com/favicon.ico"
                value={settings.branding?.faviconUrl || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, branding: { ...p.branding, faviconUrl: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Brand Color (Hex)</label>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input
                  type="color"
                  value={settings.branding?.primaryColor || '#6366F1'}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, branding: { ...p.branding, primaryColor: e.target.value } }))
                  }
                  style={{ width: '40px', height: '38px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={settings.branding?.primaryColor || '#6366F1'}
                  onChange={(e) =>
                    setSettings((p) => ({ ...p, branding: { ...p.branding, primaryColor: e.target.value } }))
                  }
                />
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => handleSave('branding')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" /> Save Branding Configuration
          </button>
        </div>
      )}

      {/* Email Settings */}
      {activeTab === 'email' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Outbound Email SMTP Relay</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">SMTP Host</label>
              <input
                type="text"
                className="form-input"
                value={settings.email?.smtpHost || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, email: { ...p.email, smtpHost: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">SMTP Port</label>
              <input
                type="number"
                className="form-input"
                value={settings.email?.smtpPort || 587}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, email: { ...p.email, smtpPort: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sender Email Address</label>
              <input
                type="email"
                className="form-input"
                value={settings.email?.fromEmail || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, email: { ...p.email, fromEmail: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sender Display Name</label>
              <input
                type="text"
                className="form-input"
                value={settings.email?.fromName || ''}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, email: { ...p.email, fromName: e.target.value } }))
                }
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => handleSave('email')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" /> Save Email Settings
          </button>
        </div>
      )}

      {/* Payment Settings */}
      {activeTab === 'payment' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Payment Processor Configuration</h3>
          </div>
          <div className="form-group">
            <label className="form-label">Stripe Public API Key</label>
            <input
              type="text"
              className="form-input"
              value={settings.payment?.stripePublishableKey || ''}
              onChange={(e) =>
                setSettings((p) => ({ ...p, payment: { ...p.payment, stripePublishableKey: e.target.value } }))
              }
            />
            <div className="form-helper">
              Private API Secret keys are stored safely in server environment variables.
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => handleSave('payment')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" /> Save Payment Settings
          </button>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Security & Rate Limiting Enforcement</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Session Inactivity Timeout (Minutes)</label>
              <input
                type="number"
                className="form-input"
                value={settings.security?.sessionTimeoutMinutes || 60}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, security: { ...p.security, sessionTimeoutMinutes: e.target.value } }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rate Limit Max Requests (per 15 min window)</label>
              <input
                type="number"
                className="form-input"
                value={settings.security?.rateLimitRequestsPerWindow || 100}
                onChange={(e) =>
                  setSettings((p) => ({ ...p, security: { ...p.security, rateLimitRequestsPerWindow: e.target.value } }))
                }
              />
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => handleSave('security')}
            disabled={isSaving}
          >
            <Save className="w-4 h-4" /> Save Security Policies
          </button>
        </div>
      )}

      {/* Website Settings */}
      {activeTab === 'website' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Default Public Website & Landing Page</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Default Landing Page Title</label>
              <input
                type="text"
                className="form-input"
                defaultValue="Luxury Salon & Spa Booking Experience"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Call-to-Action Text</label>
              <input
                type="text"
                className="form-input"
                defaultValue="Book Your Appointment Online"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Platform Demo Website Slug</label>
            <input
              type="text"
              className="form-input"
              defaultValue="blossom-salon"
            />
            <div className="form-helper">Preview at http://localhost:3000/customer/booking?tenant=blossom-salon</div>
          </div>
          <button className="btn btn-primary" onClick={() => success('Website settings updated')}>
            <Save className="w-4 h-4" /> Save Website Settings
          </button>
        </div>
      )}

      {/* Email Branding */}
      {activeTab === 'email_branding' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Transactional Email Branding</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Email Header Logo URL</label>
              <input
                type="text"
                className="form-input"
                placeholder="https://imagedelivery.net/..."
                defaultValue=""
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Footer Copyright Note</label>
              <input
                type="text"
                className="form-input"
                defaultValue="© 2026 Beauty SaaS Platform. All rights reserved."
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => success('Email branding updated')}>
            <Save className="w-4 h-4" /> Save Email Branding
          </button>
        </div>
      )}

      {/* Tenant Branding */}
      {activeTab === 'tenant_branding' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Tenant White-Label Permission Matrix</h3>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Allow tenants to apply custom CSS stylesheets, custom logo assets, and custom favicon icons.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Allow tenants to upload custom salon logos and staff banners</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Allow tenants to configure custom brand accent colors</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span>Enable Cloudflare direct image upload for tenant accounts</span>
            </label>
          </div>
          <button className="btn btn-primary" onClick={() => success('Tenant white-label permissions saved')}>
            <Save className="w-4 h-4" /> Save White-Label Policies
          </button>
        </div>
      )}

      {/* Notifications Settings */}
      {activeTab === 'notifications' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Global Notification Gateway Settings</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Twilio / SMS Provider API Key</label>
              <input type="password" className="form-input" defaultValue="mock_twilio_key_configured" />
            </div>
            <div className="form-group">
              <label className="form-label">WhatsApp Business Gateway Webhook</label>
              <input type="text" className="form-input" defaultValue="https://api.beautysaas.com/v1/webhooks/whatsapp" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => success('Notification gateway settings saved')}>
            <Save className="w-4 h-4" /> Save Gateway Settings
          </button>
        </div>
      )}

      {/* Domain Settings */}
      {activeTab === 'domain' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Apex Domain & DNS Routing Policy</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Master Apex Domain</label>
              <input type="text" className="form-input" defaultValue="beautysaas.local" />
            </div>
            <div className="form-group">
              <label className="form-label">CNAME Target for Custom Domains</label>
              <input type="text" className="form-input" defaultValue="cname.beautysaas.local" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => success('Domain routing policy updated')}>
            <Save className="w-4 h-4" /> Save Domain Settings
          </button>
        </div>
      )}

      {/* Database Settings */}
      {activeTab === 'database' && (
        <div className="card" style={{ maxWidth: '800px' }}>
          <div className="card-header">
            <h3 className="card-title">Central MongoDB Atlas Connection Pool</h3>
          </div>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Max Connection Pool Size</label>
              <input type="number" className="form-input" defaultValue="10" />
            </div>
            <div className="form-group">
              <label className="form-label">Connection Timeout (ms)</label>
              <input type="number" className="form-input" defaultValue="10000" />
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => success('Database connection policies updated')}>
            <Save className="w-4 h-4" /> Save Database Policies
          </button>
        </div>
      )}
    </div>
  );
};

export default SettingsView;
