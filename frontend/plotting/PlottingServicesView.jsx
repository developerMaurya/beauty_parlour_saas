/**
 * @file PlottingServicesView.jsx
 * @description Interactive Real Estate Colony Masterplan, Plot Color Status & EMI Calculator.
 * @module frontend/src/modules/kashi-service/plotting-services/PlottingServicesView
 */

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Building,
  CheckCircle2,
  DollarSign,
  Calculator,
  Compass,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react';
import {
  getKashiPlottingColonies,
  calculatePlotEmi,
  bookPlot,
} from '@/services/api/kashi/kashiPlatformApi.js';
import { useToast } from '@/context/ToastContext.jsx';

export default function PlottingServicesView({ onStartTrial }) {
  const toast = useToast();
  const [colonies, setColonies] = useState([]);
  const [selectedColonyId, setSelectedColonyId] = useState('colony_1');
  const [selectedPlot, setSelectedPlot] = useState(null);

  // EMI Calculator State
  const [downPayment, setDownPayment] = useState(500000);
  const [tenureMonths, setTenureMonths] = useState(36);
  const [emiResult, setEmiResult] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await getKashiPlottingColonies();
        if (res?.data?.colonies) {
          setColonies(res.data.colonies);
          if (res.data.colonies[0]?.plots?.[0]) {
            setSelectedPlot(res.data.colonies[0].plots[0]);
          }
        }
      } catch (err) {
        console.warn('Plotting colonies load:', err);
      }
    }
    load();
  }, []);

  const currentColony = colonies.find((c) => c.id === selectedColonyId) || colonies[0] || {
    name: 'Kashi Green Valley City (Phase 1)',
    location: 'Varanasi-Prayagraj 6-Lane Expressway Corridor, UP',
    pricePerSqYd: 14500,
    reraRegistration: 'UPRERAAGT2026/89412',
    plots: [],
  };

  const activePlot = selectedPlot || currentColony.plots?.[0] || {
    number: '101',
    sizeSqYd: 150,
    dimensions: '30x45 ft',
    price: 2175000,
    status: 'AVAILABLE',
    tokenAmount: 51000,
  };

  // Recalculate EMI whenever selected plot, downPayment, or tenure changes
  useEffect(() => {
    async function compute() {
      try {
        const res = await calculatePlotEmi({
          totalAmount: activePlot.price,
          downPayment,
          tenureMonths,
          annualInterestRate: 9.5,
        });
        if (res?.data) {
          setEmiResult(res.data);
        }
      } catch {}
    }
    compute();
  }, [activePlot.price, downPayment, tenureMonths]);

  const handleBookPlot = async () => {
    try {
      const res = await bookPlot({
        colonyId: currentColony.id,
        plotNumber: activePlot.number,
        buyerName: 'Demo Client',
        buyerPhone: '+91 98765 00112',
        tokenPaid: activePlot.tokenAmount,
      });
      toast.success(res?.message || `Plot ${activePlot.number} booked successfully!`);
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
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🏗️</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, color: '#0f172a' }}>
              Real Estate Colony Masterplans & Plot Booking Hub
            </h2>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
            Interactive plot layout status (Available 🟢, Booked 🟡, Sold 🔴), RERA registry vault & EMI calculator
          </p>
        </div>

        <button
          onClick={() => onStartTrial({ id: 'plotting-service', name: 'Plotting Services (Real Estate & Colonies)' })}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Real Estate SaaS</span>
        </button>
      </div>

      {/* Colony Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {colonies.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setSelectedColonyId(c.id);
              if (c.plots?.[0]) setSelectedPlot(c.plots[0]);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: selectedColonyId === c.id ? 'none' : '1px solid #cbd5e1',
              background: selectedColonyId === c.id ? 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' : '#ffffff',
              color: selectedColonyId === c.id ? '#fff' : '#334155',
              fontWeight: selectedColonyId === c.id ? 800 : 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Interactive Masterplan Layout + Plot Details & EMI */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Interactive Plot Map Layout */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                Interactive Colony Layout Masterplan
              </h3>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                📍 {currentColony.location} • RERA: {currentColony.reraRegistration}
              </div>
            </div>

            {/* Color Legend */}
            <div style={{ display: 'flex', gap: '10px', fontSize: '11px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} /> Booked
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ef4444' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> Sold
              </span>
            </div>
          </div>

          {/* Interactive Plots Grid Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '10px',
              padding: '14px',
              borderRadius: '14px',
              background: '#090f1d',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {(currentColony.plots || []).map((p) => {
              const isSelected = activePlot.number === p.number;
              const isAvailable = p.status === 'AVAILABLE';
              const isBooked = p.status === 'BOOKED';
              const isSold = p.status === 'SOLD';
              const color = isAvailable ? '#10b981' : isBooked ? '#f59e0b' : '#ef4444';

              return (
                <div
                  key={p.number}
                  onClick={() => setSelectedPlot(p)}
                  style={{
                    padding: '12px 8px',
                    borderRadius: '10px',
                    background: isSelected ? `${color}33` : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? `2px solid ${color}` : `1px solid ${color}44`,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                  }}
                >
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff' }}>
                    Plot {p.number}
                  </span>
                  <span style={{ fontSize: '10px', color: '#cbd5e1' }}>
                    {p.sizeSqYd} sq.yd
                  </span>
                  <span
                    style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: `${color}22`,
                      color: color,
                    }}
                  >
                    {p.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Plot Details & EMI Calculator */}
        <div
          style={{
            padding: '20px',
            borderRadius: '18px',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Plot Details Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                Plot #{activePlot.number} ({activePlot.sizeSqYd} Sq. Yards)
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                Dimensions: {activePlot.dimensions} • Facing: {activePlot.facing || 'East'}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#10b981' }}>
                ₹{activePlot.price.toLocaleString()}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Token: ₹{(activePlot.tokenAmount || 51000).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Real Estate EMI Calculator Widget */}
          <div
            style={{
              padding: '16px',
              borderRadius: '14px',
              background: 'rgba(5, 150, 105, 0.08)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: 800, fontSize: '0.88rem' }}>
              <Calculator className="w-4 h-4" />
              <span>Interactive Buyer EMI Installment Calculator</span>
            </div>

            {/* Down Payment Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#1e293b', marginBottom: '4px', fontWeight: 600 }}>
                <span>Down Payment Token:</span>
                <strong style={{ color: '#059669' }}>₹{downPayment.toLocaleString()}</strong>
              </div>
              <input
                type="range"
                min={51000}
                max={activePlot.price}
                step={50000}
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#10b981' }}
              />
            </div>

            {/* Tenure Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#1e293b', marginBottom: '4px', fontWeight: 600 }}>
                <span>Installment Tenure:</span>
                <strong style={{ color: '#0284c7' }}>{tenureMonths} Months ({Math.round(tenureMonths / 12)} Yrs)</strong>
              </div>
              <input
                type="range"
                min={12}
                max={60}
                step={12}
                value={tenureMonths}
                onChange={(e) => setTenureMonths(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* EMI Computation Box */}
            {emiResult && (
              <div
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Estimated Monthly EMI</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#10b981' }}>
                    ₹{emiResult.monthlyEmi.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>
                  Interest: 9.5% p.a.<br />
                  Principal: ₹{(emiResult.loanPrincipal || 0).toLocaleString()}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={handleBookPlot}
            className="btn btn-primary"
            style={{
              padding: '12px',
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
            }}
          >
            <span>Book Plot #{activePlot.number} (Token: ₹{(activePlot.tokenAmount || 51000).toLocaleString()})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

