/**
 * @file GlobalCustomerHeaderPill.jsx
 * @description Universal Header Pill for Customer Auth & Account Controls (Amazon/Flipkart Style).
 * Drop this component into ANY header across the platform to provide:
 *   - "Sign In / Register" button when logged out (opens GlobalCustomerAuthModal)
 *   - "Hi, <Name>" avatar pill with profile & bookings drawer when logged in
 *   - Seamlessly mounts both modals.
 * @module frontend/src/components/common/GlobalCustomerHeaderPill
 */

import React from 'react';
import { useCustomer } from '../../context/CustomerContext.jsx';
import GlobalCustomerAuthModal from './GlobalCustomerAuthModal.jsx';
import GlobalCustomerProfileModal from './GlobalCustomerProfileModal.jsx';
import { LogIn, User, Calendar, LogOut, ChevronDown } from 'lucide-react';

export default function GlobalCustomerHeaderPill({ theme = 'dark' }) {
  const { customer, isAuthenticated, openAuthModal, openProfileModal, logout, myBookings } = useCustomer();

  const isLight = theme === 'light';

  return (
    <>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        {isAuthenticated && customer ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            {/* Logged-In Customer Pill */}
            <div
              onClick={() => openProfileModal('profile')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px 4px 6px',
                borderRadius: '999px',
                background: isLight ? '#fef2f2' : 'rgba(239, 68, 68, 0.15)',
                border: isLight ? '1.5px solid #fecaca' : '1.5px solid rgba(239, 68, 68, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Click to view Profile & Bookings"
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '13px',
                  boxShadow: '0 2px 6px rgba(239, 68, 68, 0.35)',
                }}
              >
                {customer?.name ? customer.name.charAt(0).toUpperCase() : 'C'}
              </div>

              <div style={{ textAlign: 'left' }}>
                <div
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 800,
                    color: isLight ? '#991b1b' : '#fca5a5',
                    lineHeight: 1.1,
                  }}
                >
                  Hi, {customer?.name ? customer.name.split(' ')[0] : 'Customer'}
                </div>
                <div style={{ fontSize: '10px', color: isLight ? '#dc2626' : '#ef4444', fontWeight: 600 }}>
                  Account & Bookings
                </div>
              </div>
            </div>

            {/* My Bookings Button */}
            <button
              onClick={() => openProfileModal('bookings')}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                border: isLight ? '1px solid #cbd5e1' : '1px solid rgba(255, 255, 255, 0.12)',
                background: isLight ? '#f8fafc' : 'rgba(255, 255, 255, 0.05)',
                color: isLight ? '#1e293b' : '#e2e8f0',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
              title="View my service requests"
            >
              <Calendar size={13} color="#38bdf8" />
              <span>Bookings</span>
              {myBookings?.length > 0 && (
                <span
                  style={{
                    background: '#38bdf8',
                    color: '#0f172a',
                    fontSize: '10px',
                    fontWeight: 900,
                    padding: '1px 5px',
                    borderRadius: '8px',
                  }}
                >
                  {myBookings.length}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 700,
                border: isLight ? '1px solid #fecaca' : '1px solid rgba(239, 68, 68, 0.25)',
                background: isLight ? '#fff1f2' : 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
              title="Log out"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal(null, 'Sign in or create an account to book and manage services')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 800,
              border: 'none',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <LogIn size={15} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>

      {/* Global Modals Mounted Automatically */}
      <GlobalCustomerAuthModal />
      <GlobalCustomerProfileModal />
    </>
  );
}
