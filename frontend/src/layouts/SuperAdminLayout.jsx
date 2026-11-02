/**
 * @file SuperAdminLayout.jsx
 * @description Super Admin Protected Dashboard Layout
 */

import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export const SuperAdminLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-app)',
          gap: '1rem',
        }}
      >
        <div
          style={{
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: 'var(--primary)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Verifying Super Admin session...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return (
    <div className="app-layout">
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="main-content">
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="page-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
