/**
 * @file RentServicesView.jsx
 * @description Rental Properties, Heavy Machinery, Monthly Invoicing & WhatsApp Reminders.
 * @module frontend/src/modules/kashi-service/rent-services/RentServicesView
 */

import React, { useState, useEffect } from 'react';
import {
  Key,
  Building,
  CheckCircle2,
  DollarSign,
  FileText,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Clock,
} from 'lucide-react';
import {
  getKashiRentalAssets,
  generateRentInvoice,
  bookRentalAsset,
} from '@/services/api/kashi/kashiPlatformApi.js';
import { useToast } from '@/context/ToastContext.jsx';

export default function RentServicesView({ onStartTrial }) {
  const toast = useToast();
  const [assets, setAssets] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('rent_prop_1');
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await getKashiRentalAssets();
        if (res?.data?.assets) {
          setAssets(res.data.assets);
        }
      } catch (err) {
        console.warn('Rent assets load:', err);
      }
    }
    load();
  }, []);

  const currentAsset = assets.find((a) => a.id === selectedAssetId) || assets[0] || {
    name: 'Prime Commercial Corner Shop (Ground Floor)',
    category: 'COMMERCIAL_PROPERTY',
    location: 'Bhadohi Road, Lahartara Junction, Varanasi',
    monthlyRent: 35000,
    securityDeposit: 105000,
    status: 'ACTIVE_LEASE',
    currentTenant: {
      name: 'Vikas Agarwal (M/s Agarwal Medical Store)',
      phone: '+91 98765 22114',
      leaseStart: '2025-04-01',
      leaseEnd: '2028-03-31',
      currentMonthStatus: 'PAID',
    },
    features: ['3-Phase Commercial Power', 'Rolling Shutter'],
  };

  const handleGenerateInvoice = async () => {
    setIsGenerating(true);
    try {
      const res = await generateRentInvoice({ assetId: currentAsset.id, monthYear: 'November 2026' });
      if (res?.data) {
        setGeneratedInvoice(res.data);
        toast.success('Rent invoice with UPI QR & WhatsApp reminder generated!');
      }
    } catch {
      toast.error('Invoice generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBookAsset = async () => {
    try {
      const res = await bookRentalAsset({
        assetId: currentAsset.id,
        tenantName: 'Demo Lessee',
        tenantPhone: '+91 98765 33445',
      });
      toast.success(res?.message || 'Rental booking created!');
    } catch {
      toast.error('Booking failed');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner */}
      <div
        style={{
          padding: '1.5rem 2rem',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.15) 0%, rgba(180, 83, 9, 0.15) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🔑</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              Rental Properties, Machinery & Equipment Leasing Hub
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
            Commercial leases, residential flats, heavy machinery, automated UPI invoicing & WhatsApp reminders
          </p>
        </div>

        <button
          onClick={() => onStartTrial({ id: 'rent-service', name: 'Rent Services (Properties & Assets)' })}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Rental Agency SaaS</span>
        </button>
      </div>

      {/* Asset Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {assets.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              setSelectedAssetId(a.id);
              setGeneratedInvoice(null);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: selectedAssetId === a.id ? 'none' : '1px solid #cbd5e1',
              background: selectedAssetId === a.id ? 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' : '#ffffff',
              color: selectedAssetId === a.id ? '#fff' : '#334155',
              fontWeight: selectedAssetId === a.id ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {a.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Asset Details + Invoicing Widget */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Card 1: Asset Details & Lease Agreement */}
        <div
          style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase' }}>
                {currentAsset.category?.replace(/_/g, ' ')}
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                {currentAsset.name}
              </h3>
              {currentAsset.location && (
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                  📍 {currentAsset.location}
                </div>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                ₹{(currentAsset.monthlyRent || currentAsset.rentalFee || 25000).toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Deposit: ₹{(currentAsset.securityDeposit || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {(currentAsset.features || []).map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>

          {/* Current Lessee / Tenant Info */}
          {currentAsset.currentTenant && (
            <div
              style={{
                padding: '14px',
                borderRadius: '12px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                ACTIVE LEASE AGREEMENT & TENANT KYC
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Lessee Name:</span>
                <strong style={{ color: '#0f172a' }}>{currentAsset.currentTenant.name}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Contact:</span>
                <span style={{ color: '#334155', fontWeight: 600 }}>{currentAsset.currentTenant.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Payment Status:</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>
                  ● {currentAsset.currentTenant.currentMonthStatus}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleBookAsset}
            className="btn btn-secondary"
            style={{ width: '100%', fontSize: '0.85rem', padding: '10px' }}
          >
            Initiate New Lease Agreement
          </button>
        </div>

        {/* Card 2: Automated Monthly Invoicing & WhatsApp Reminders */}
        <div
          style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '14px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Monthly Rent Generation & Bot
              </h3>
              <button
                onClick={handleGenerateInvoice}
                disabled={isGenerating}
                className="btn btn-primary btn-sm"
                style={{ fontSize: '0.78rem', background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }}
              >
                {isGenerating ? 'Generating...' : 'Generate Nov Invoice'}
              </button>
            </div>

            {generatedInvoice ? (
              <div
                style={{
                  marginTop: '14px',
                  padding: '16px',
                  borderRadius: '14px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Invoice Number:</span>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b' }}>{generatedInvoice.invoiceNumber}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Base Rent:</span>
                  <span style={{ color: '#0f172a' }}>₹{generatedInvoice.rentAmount.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#94a3b8' }}>Maintenance + GST:</span>
                  <span style={{ color: '#0f172a' }}>₹{(generatedInvoice.maintenanceCharges + generatedInvoice.gst18Percent).toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px', fontSize: '13px' }}>
                  <strong style={{ color: '#cbd5e1' }}>Total Due:</strong>
                  <strong style={{ color: '#10b981' }}>₹{generatedInvoice.totalPayable.toLocaleString()}</strong>
                </div>

                {/* WhatsApp Alert Simulation */}
                <div
                  style={{
                    marginTop: '8px',
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(34, 197, 94, 0.1)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    fontSize: '11px',
                    color: '#86efac',
                  }}
                >
                  <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Reminder Dispatch:
                  </div>
                  <div>"{generatedInvoice.whatsappReminderText}"</div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  padding: '30px 20px',
                  borderRadius: '14px',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px dashed rgba(255,255,255,0.1)',
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  color: '#94a3b8',
                }}
              >
                Click "Generate Nov Invoice" above to automatically generate rent invoice, UPI payment QR link, and WhatsApp reminder alert.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

