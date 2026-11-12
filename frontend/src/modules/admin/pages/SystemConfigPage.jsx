/**
 * @file SystemConfigPage.jsx
 * @description Central Administration System Configuration Hub:
 *   1. 🗄️ Database Configuration (Custom MongoDB URL stored in DB with fallback to default .env)
 *   2. 📱 SMS & WhatsApp API Configuration (Meta WhatsApp Cloud API, Fast2SMS, Twilio, MSG91)
 *   3. 💳 Payment Gateway Setup (Razorpay, Stripe, Cashfree, PhonePe with Sandbox/Live modes)
 *   4. ☁️ Cloud Storage & CDN (Cloudflare Images, AWS S3, Cloudinary)
 * @module frontend/src/modules/admin/pages/SystemConfigPage
 */

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Database,
  MessageSquare,
  CreditCard,
  Cloud,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Save,
  Send,
  Eye,
  EyeOff,
  Server,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { systemConfigFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';

export const SystemConfigPage = () => {
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active tab from URL path or search query
  const getTabFromPath = () => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam && ['database', 'communication', 'payment', 'cloud'].includes(tabParam)) {
      return tabParam;
    }
    if (location.pathname.includes('database')) return 'database';
    if (location.pathname.includes('communication') || location.pathname.includes('sms') || location.pathname.includes('whatsapp')) return 'communication';
    if (location.pathname.includes('payment') || location.pathname.includes('gateway')) return 'payment';
    if (location.pathname.includes('cloud') || location.pathname.includes('storage') || location.pathname.includes('cdn')) return 'cloud';
    return 'database';
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Show/Hide password toggle states
  const [showMongoUri, setShowMongoUri] = useState(false);
  const [showWaToken, setShowWaToken] = useState(false);
  const [showSmsKey, setShowSmsKey] = useState(false);
  const [showRzpSecret, setShowRzpSecret] = useState(false);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showCloudflareToken, setShowCloudflareToken] = useState(false);
  const [showS3Secret, setShowS3Secret] = useState(false);

  // Form State
  const [config, setConfig] = useState({
    databaseConfig: {
      customMongoUri: '',
      customDbName: '',
      isUsingCustomDb: false,
      defaultMongoUri: 'mongodb+srv://••••••••:••••••••@cluster0.c4qroz0.mongodb.net/beauty_parlour_saas',
      status: 'connected',
      lastTestedAt: null,
    },
    smsWhatsappConfig: {
      provider: 'meta_whatsapp',
      whatsappPhoneNumberId: '',
      whatsappBusinessAccountId: '',
      whatsappApiToken: '',
      whatsappWebhookToken: '',
      smsProvider: 'fast2sms',
      smsApiKey: '',
      smsSenderId: '',
      isEnabled: true,
    },
    paymentGatewayConfig: {
      activeGateway: 'razorpay',
      isLive: false,
      razorpayKeyId: '',
      razorpayKeySecret: '',
      stripePublishableKey: '',
      stripeSecretKey: '',
      cashfreeAppId: '',
      cashfreeSecretKey: '',
      phonepeMerchantId: '',
      phonepeSaltKey: '',
      autoCapture: true,
    },
    cloudStorageConfig: {
      provider: 'cloudflare',
      cloudflareApiToken: '',
      cloudflareAccountId: '',
      cloudflareDeliveryUrl: '',
      s3BucketName: '',
      s3Region: 'ap-south-1',
      s3AccessKey: '',
      s3SecretKey: '',
      cloudinaryCloudName: '',
      cloudinaryApiKey: '',
      cloudinaryApiSecret: '',
      status: 'configured',
    },
  });

  // Keep tab in sync with URL
  useEffect(() => {
    setActiveTab(getTabFromPath());
    setTestResult(null);
  }, [location.pathname, location.search]);

  const switchTab = (tabKey) => {
    setActiveTab(tabKey);
    setTestResult(null);
    navigate(`/admin/system/config?tab=${tabKey}`, { replace: true });
  };

  // Load existing configuration from Database
  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const res = await systemConfigFetcher.getConfig();
      if (res.data) {
        setConfig((prev) => ({
          databaseConfig: { ...prev.databaseConfig, ...(res.data.databaseConfig || {}) },
          smsWhatsappConfig: { ...prev.smsWhatsappConfig, ...(res.data.smsWhatsappConfig || {}) },
          paymentGatewayConfig: { ...prev.paymentGatewayConfig, ...(res.data.paymentGatewayConfig || {}) },
          cloudStorageConfig: { ...prev.cloudStorageConfig, ...(res.data.cloudStorageConfig || {}) },
        }));
      }
    } catch (err) {
      console.warn('[SystemConfig] Failed to load from server, using local state:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // Handlers for Save actions
  const handleSaveDatabase = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await systemConfigFetcher.updateDatabase({
        customMongoUri: config.databaseConfig.customMongoUri,
        customDbName: config.databaseConfig.customDbName,
        isUsingCustomDb: config.databaseConfig.isUsingCustomDb,
      });
      toast.success('Database configuration saved in MongoDB successfully!');
      setTestResult({
        type: 'success',
        message: config.databaseConfig.customMongoUri
          ? 'Custom MongoDB database configuration saved & active in DB!'
          : 'Configured to use system default MongoDB connection (.env fallback).',
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save database configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestDatabase = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await systemConfigFetcher.testDatabase({
        mongoUri: config.databaseConfig.customMongoUri || undefined,
      });
      toast.success(res.message || 'MongoDB connection test succeeded!');
      setTestResult({
        type: 'success',
        message: res.message || 'Successfully connected to MongoDB cluster.',
        details: res.data,
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reach MongoDB server';
      toast.error(msg);
      setTestResult({ type: 'error', message: msg });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveCommunication = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await systemConfigFetcher.updateCommunication(config.smsWhatsappConfig);
      toast.success('SMS & WhatsApp API credentials saved in Database!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save communication credentials');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestCommunication = async () => {
    setIsTesting(true);
    try {
      const res = await systemConfigFetcher.testCommunication({
        provider: config.smsWhatsappConfig.provider,
      });
      toast.success(res.message || 'Test signal dispatched successfully!');
    } catch (err) {
      toast.error(err.message || 'Communication test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await systemConfigFetcher.updatePaymentGateways(config.paymentGatewayConfig);
      toast.success('Payment gateway credentials saved in Database!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save payment gateway credentials');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCloudStorage = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await systemConfigFetcher.updateCloudStorage(config.cloudStorageConfig);
      toast.success('Cloud Storage & CDN configuration saved in Database!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save cloud storage configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    {
      id: 'database',
      label: 'Database Configuration',
      sublabel: 'MongoDB Connection & Cluster',
      icon: Database,
      color: '#10b981',
      badge: config.databaseConfig.customMongoUri ? 'Custom URI' : 'Default DB',
    },
    {
      id: 'communication',
      label: 'SMS & WhatsApp API',
      sublabel: 'Meta Cloud API & SMS Gateways',
      icon: MessageSquare,
      color: '#22c55e',
      badge: 'Active',
    },
    {
      id: 'payment',
      label: 'Payment Gateways',
      sublabel: 'Razorpay, Stripe & Cashfree',
      icon: CreditCard,
      color: '#6366f1',
      badge: config.paymentGatewayConfig.isLive ? 'Live Mode' : 'Sandbox',
    },
    {
      id: 'cloud',
      label: 'Cloud Storage & CDN',
      sublabel: 'Cloudflare Images, S3 & Cloudinary',
      icon: Cloud,
      color: '#0ea5e9',
      badge: config.cloudStorageConfig.provider.toUpperCase(),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingBottom: '3rem' }}>
      {/* ── Top Header Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--bg-surface, #ffffff)',
          padding: '1.25rem 1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--border-color, #e2e8f0)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚙️</span>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
              Central Administration Configuration & Integrations
            </h1>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Configure MongoDB database URL, SMS/WhatsApp APIs, Payment Gateways, and Cloud Image storage stored directly in the database.
          </p>
        </div>

        <button
          onClick={loadConfig}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-color, #cbd5e1)',
            padding: '8px 14px',
            borderRadius: '9px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          <span>Reload Config</span>
        </button>
      </div>

      {/* ── Interactive Navigation Tabs ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '10px',
        }}
      >
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '13px',
                cursor: 'pointer',
                background: isActive ? 'var(--bg-surface, #ffffff)' : 'rgba(255, 255, 255, 0.6)',
                border: `2px solid ${isActive ? tab.color : 'transparent'}`,
                boxShadow: isActive ? `0 6px 20px ${tab.color}22` : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.18s ease',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: `${tab.color}18`,
                  color: tab.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <TabIcon size={20} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 800, color: isActive ? tab.color : 'var(--text-primary)' }}>
                    {tab.label}
                  </span>
                  {tab.badge && (
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '999px',
                        background: `${tab.color}18`,
                        color: tab.color,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tab.sublabel}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Test Result Banner ── */}
      {testResult && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: testResult.type === 'success' ? '#10b98115' : '#ef444415',
            border: `1px solid ${testResult.type === 'success' ? '#10b98144' : '#ef444444'}`,
            color: testResult.type === 'success' ? '#047857' : '#b91c1c',
            fontSize: '0.86rem',
            fontWeight: 700,
          }}
        >
          {testResult.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <div style={{ flex: 1 }}>
            <div>{testResult.message}</div>
            {testResult.details && (
              <div style={{ fontSize: '0.76rem', fontWeight: 500, marginTop: '2px', opacity: 0.85 }}>
                URI: {testResult.details.targetUri} | Response Latency: {testResult.details.latencyMs}ms
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: DATABASE & MONGODB CONFIGURATION                            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'database' && (
        <form onSubmit={handleSaveDatabase} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={20} color="#10b981" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  MongoDB Database Configuration (Custom URL in DB)
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                You can specify your own dedicated MongoDB connection URI here. When saved, it is stored securely in the database and takes priority over the .env configuration. If left blank, the system automatically uses the central default database.
              </p>
            </div>

            {/* Default System Database Info Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Server size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155' }}>
                    Default Central MongoDB Connection (.env fallback):
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748b', marginTop: '2px' }}>
                    {config.databaseConfig.defaultMongoUri || 'mongodb+srv://errbmaurya:••••••••@cluster0.c4qroz0.mongodb.net/beauty_parlour_saas'}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 800, background: '#10b98122', color: '#047857', padding: '3px 8px', borderRadius: '999px' }}>
                ● Active Central Cluster
              </span>
            </div>

            {/* Toggle Switch: Use Custom Database */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-color, #e2e8f0)' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', cursor: 'pointer' }}>
                  Enable Custom Dedicated MongoDB Database
                </label>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Toggle on to store and route all data to your personal dedicated MongoDB instance.
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.databaseConfig.isUsingCustomDb}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    databaseConfig: { ...prev.databaseConfig, isUsingCustomDb: e.target.checked },
                  }))
                }
                style={{ width: '20px', height: '20px', accentColor: '#10b981', cursor: 'pointer' }}
              />
            </div>

            {/* Custom Mongo URI Input */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Custom MongoDB Connection URL (Stores in DB)
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showMongoUri ? 'text' : 'password'}
                  placeholder="mongodb+srv://username:password@cluster.mongodb.net/your_db_name"
                  value={config.databaseConfig.customMongoUri}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      databaseConfig: { ...prev.databaseConfig, customMongoUri: e.target.value },
                    }))
                  }
                  className="form-input"
                  style={{ width: '100%', paddingRight: '45px', fontFamily: showMongoUri ? 'monospace' : 'inherit' }}
                />
                <button
                  type="button"
                  onClick={() => setShowMongoUri(!showMongoUri)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                  title={showMongoUri ? 'Hide URI' : 'Show URI'}
                >
                  {showMongoUri ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Supports standard MongoDB connection strings: <code>mongodb://...</code> or Atlas <code>mongodb+srv://...</code>
              </div>
            </div>

            {/* Custom Database Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, marginBottom: '6px', color: 'var(--text-primary)' }}>
                Target Database Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. kashi_master_db or beauty_parlour_saas"
                value={config.databaseConfig.customDbName}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    databaseConfig: { ...prev.databaseConfig, customDbName: e.target.value },
                  }))
                }
                className="form-input"
              />
            </div>

            {/* Actions: Test Connection & Save */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving to Database...' : 'Save Database Configuration'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestDatabase}
                disabled={isTesting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #cbd5e1',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Zap size={16} color="#059669" className={isTesting ? 'animate-bounce' : ''} />
                <span>{isTesting ? 'Testing Connection...' : '🧪 Test MongoDB Connection'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: SMS & WHATSAPP BUSINESS API CONFIGURATION                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'communication' && (
        <form onSubmit={handleSaveCommunication} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={20} color="#22c55e" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  SMS & WhatsApp Business API Configuration
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Configure WhatsApp Cloud API and transactional SMS credentials for appointment reminders, booking confirmations, and customer alerts. Saved securely in the database.
              </p>
            </div>

            {/* Meta WhatsApp Cloud API Section */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#16a34a' }}>
                  💬 Meta WhatsApp Business Cloud API
                </div>
                <span style={{ fontSize: '10px', background: '#22c55e18', color: '#16a34a', padding: '2px 8px', borderRadius: '999px', fontWeight: 800 }}>
                  Official Meta API
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                    Phone Number ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 109283746592819"
                    value={config.smsWhatsappConfig.whatsappPhoneNumberId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        smsWhatsappConfig: { ...prev.smsWhatsappConfig, whatsappPhoneNumberId: e.target.value },
                      }))
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                    WhatsApp Business Account ID (WABA ID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 982736451029384"
                    value={config.smsWhatsappConfig.whatsappBusinessAccountId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        smsWhatsappConfig: { ...prev.smsWhatsappConfig, whatsappBusinessAccountId: e.target.value },
                      }))
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                  Permanent System User Access Token
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showWaToken ? 'text' : 'password'}
                    placeholder="EAABwz..."
                    value={config.smsWhatsappConfig.whatsappApiToken}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        smsWhatsappConfig: { ...prev.smsWhatsappConfig, whatsappApiToken: e.target.value },
                      }))
                    }
                    className="form-input"
                    style={{ paddingRight: '45px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowWaToken(!showWaToken)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    {showWaToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* SMS Provider Section */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0284c7' }}>
                  📱 Transactional SMS Gateway
                </div>
                <select
                  value={config.smsWhatsappConfig.smsProvider}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      smsWhatsappConfig: { ...prev.smsWhatsappConfig, smsProvider: e.target.value },
                    }))
                  }
                  className="form-input"
                  style={{ width: 'auto', height: '32px', fontSize: '0.78rem', fontWeight: 700 }}
                >
                  <option value="fast2sms">Fast2SMS (India)</option>
                  <option value="twilio">Twilio Global</option>
                  <option value="msg91">MSG91</option>
                  <option value="gupshup">Gupshup</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                    SMS API Key / Auth Token
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showSmsKey ? 'text' : 'password'}
                      placeholder="API authorization key"
                      value={config.smsWhatsappConfig.smsApiKey}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          smsWhatsappConfig: { ...prev.smsWhatsappConfig, smsApiKey: e.target.value },
                        }))
                      }
                      className="form-input"
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSmsKey(!showSmsKey)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showSmsKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                    DLT Sender ID / Header (e.g. KASHIS)
                  </label>
                  <input
                    type="text"
                    placeholder="6-character alphanumeric sender ID"
                    value={config.smsWhatsappConfig.smsSenderId}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        smsWhatsappConfig: { ...prev.smsWhatsappConfig, smsSenderId: e.target.value.toUpperCase() },
                      }))
                    }
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.35)',
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Communication Keys'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestCommunication}
                disabled={isTesting}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  border: '1px solid #cbd5e1',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Send size={15} color="#16a34a" />
                <span>{isTesting ? 'Sending...' : '🧪 Send Test Ping'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 3: PAYMENT GATEWAY CONFIGURATION                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'payment' && (
        <form onSubmit={handleSavePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CreditCard size={20} color="#6366f1" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Online Payment Gateway Configuration
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Connect Razorpay, Stripe, Cashfree, or PhonePe for customer appointments, booking advances, plots token amounts, and online invoices.
              </p>
            </div>

            {/* Mode & Active Gateway Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#334155' }}>Active Gateway:</span>
                <select
                  value={config.paymentGatewayConfig.activeGateway}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      paymentGatewayConfig: { ...prev.paymentGatewayConfig, activeGateway: e.target.value },
                    }))
                  }
                  className="form-input"
                  style={{ width: 'auto', height: '36px', fontSize: '0.82rem', fontWeight: 800 }}
                >
                  <option value="razorpay">🇮🇳 Razorpay (UPI, Cards, NetBanking)</option>
                  <option value="stripe">🌐 Stripe (Global Cards & Wallets)</option>
                  <option value="cashfree">⚡ Cashfree Payments</option>
                  <option value="phonepe">📱 PhonePe Payment Gateway</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  {config.paymentGatewayConfig.isLive ? '🟢 Live Production Mode' : '🟡 Test / Sandbox Mode'}
                </label>
                <input
                  type="checkbox"
                  checked={config.paymentGatewayConfig.isLive}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      paymentGatewayConfig: { ...prev.paymentGatewayConfig, isLive: e.target.checked },
                    }))
                  }
                  style={{ width: '18px', height: '18px', accentColor: '#6366f1', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Razorpay Form */}
            {config.paymentGatewayConfig.activeGateway === 'razorpay' && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#4f46e5' }}>
                  Razorpay API Credentials
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Razorpay Key ID
                    </label>
                    <input
                      type="text"
                      placeholder="rzp_test_... or rzp_live_..."
                      value={config.paymentGatewayConfig.razorpayKeyId}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          paymentGatewayConfig: { ...prev.paymentGatewayConfig, razorpayKeyId: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Razorpay Key Secret
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showRzpSecret ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={config.paymentGatewayConfig.razorpayKeySecret}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            paymentGatewayConfig: { ...prev.paymentGatewayConfig, razorpayKeySecret: e.target.value },
                          }))
                        }
                        className="form-input"
                        style={{ paddingRight: '45px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRzpSecret(!showRzpSecret)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {showRzpSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stripe Form */}
            {config.paymentGatewayConfig.activeGateway === 'stripe' && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#6366f1' }}>
                  Stripe API Credentials
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      placeholder="pk_test_... or pk_live_..."
                      value={config.paymentGatewayConfig.stripePublishableKey}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          paymentGatewayConfig: { ...prev.paymentGatewayConfig, stripePublishableKey: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Secret Key
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showStripeSecret ? 'text' : 'password'}
                        placeholder="sk_test_... or sk_live_..."
                        value={config.paymentGatewayConfig.stripeSecretKey}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            paymentGatewayConfig: { ...prev.paymentGatewayConfig, stripeSecretKey: e.target.value },
                          }))
                        }
                        className="form-input"
                        style={{ paddingRight: '45px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowStripeSecret(!showStripeSecret)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {showStripeSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)',
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Payment Gateway'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* TAB 4: CLOUD STORAGE & IMAGE CDN CONFIGURATION                    */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {activeTab === 'cloud' && (
        <form onSubmit={handleSaveCloudStorage} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div
            style={{
              background: 'var(--bg-surface, #ffffff)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid var(--border-color, #e2e8f0)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cloud size={20} color="#0ea5e9" />
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Cloud Storage & Image CDN Configuration
                </h2>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Configure cloud storage for uploading customer profile pictures, service catalog transformations, real estate site layout images, and bridal portfolio photos.
              </p>
            </div>

            {/* Provider Switcher */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'cloudflare', label: 'Cloudflare Images (Recommended CDN)', badge: 'Ultra Fast' },
                { id: 's3', label: 'Amazon AWS S3 Bucket', badge: 'Enterprise' },
                { id: 'cloudinary', label: 'Cloudinary Media Hub', badge: 'Auto Transforms' },
              ].map((prov) => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      cloudStorageConfig: { ...prev.cloudStorageConfig, provider: prov.id },
                    }))
                  }
                  style={{
                    flex: '1 1 200px',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${config.cloudStorageConfig.provider === prov.id ? '#0ea5e9' : '#e2e8f0'}`,
                    background: config.cloudStorageConfig.provider === prov.id ? '#0ea5e911' : '#ffffff',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 800, color: config.cloudStorageConfig.provider === prov.id ? '#0284c7' : '#334155' }}>
                      {prov.label}
                    </span>
                    <span style={{ fontSize: '9px', fontWeight: 800, background: '#0ea5e922', color: '#0284c7', padding: '1px 6px', borderRadius: '4px' }}>
                      {prov.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Cloudflare Fields */}
            {config.cloudStorageConfig.provider === 'cloudflare' && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#f97316' }}>
                  Cloudflare Images API Credentials
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                    Cloudflare API Token
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showCloudflareToken ? 'text' : 'password'}
                      placeholder="e.g. nkUH-BBHJClf_..."
                      value={config.cloudStorageConfig.cloudflareApiToken}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          cloudStorageConfig: { ...prev.cloudStorageConfig, cloudflareApiToken: e.target.value },
                        }))
                      }
                      className="form-input"
                      style={{ paddingRight: '45px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCloudflareToken(!showCloudflareToken)}
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      {showCloudflareToken ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Cloudflare Account ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 279d08d35986fc95bef69b1bd213a33d"
                      value={config.cloudStorageConfig.cloudflareAccountId}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          cloudStorageConfig: { ...prev.cloudStorageConfig, cloudflareAccountId: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Delivery Base URL / Custom Domain
                    </label>
                    <input
                      type="text"
                      placeholder="https://imagedelivery.net/your-account-hash"
                      value={config.cloudStorageConfig.cloudflareDeliveryUrl}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          cloudStorageConfig: { ...prev.cloudStorageConfig, cloudflareDeliveryUrl: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* AWS S3 Fields */}
            {config.cloudStorageConfig.provider === 's3' && (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#eab308' }}>
                  Amazon AWS S3 Bucket Setup
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      S3 Bucket Name
                    </label>
                    <input
                      type="text"
                      placeholder="my-beauty-saas-media"
                      value={config.cloudStorageConfig.s3BucketName}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          cloudStorageConfig: { ...prev.cloudStorageConfig, s3BucketName: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      AWS Region
                    </label>
                    <input
                      type="text"
                      placeholder="ap-south-1"
                      value={config.cloudStorageConfig.s3Region}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          cloudStorageConfig: { ...prev.cloudStorageConfig, s3Region: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Access Key ID
                    </label>
                    <input
                      type="text"
                      placeholder="AKIA..."
                      value={config.cloudStorageConfig.s3AccessKey}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          cloudStorageConfig: { ...prev.cloudStorageConfig, s3AccessKey: e.target.value },
                        }))
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, marginBottom: '5px' }}>
                      Secret Access Key
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showS3Secret ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={config.cloudStorageConfig.s3SecretKey}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            cloudStorageConfig: { ...prev.cloudStorageConfig, s3SecretKey: e.target.value },
                          }))
                        }
                        className="form-input"
                        style={{ paddingRight: '45px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowS3Secret(!showS3Secret)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        {showS3Secret ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '10px' }}>
              <button
                type="submit"
                disabled={isSaving}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  fontSize: '0.86rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(14, 165, 233, 0.35)',
                }}
              >
                <Save size={16} />
                <span>{isSaving ? 'Saving...' : 'Save Cloud Storage Config'}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default SystemConfigPage;

