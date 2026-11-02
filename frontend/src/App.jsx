/**
 * @file App.jsx
 * @description Main Frontend Application Shell with Context Providers, Super Admin and Tenant Admin Routes
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TenantAdminProvider } from './context/TenantAdminContext';
import { ToastProvider } from './context/ToastContext';
import SuperAdminRoutes from './routes/superadmin.routes';
import AdminRoutes from './routes/admin.routes';
import './styles/index.css';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TenantAdminProvider>
          <ToastProvider>
            <Routes>
              {SuperAdminRoutes}
              {AdminRoutes}
              <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </ToastProvider>
        </TenantAdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
