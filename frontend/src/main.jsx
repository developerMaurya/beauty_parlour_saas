/**
 * @file main.jsx
 * @description Frontend Application Mount Point with Google OAuth Provider.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

// Google Client ID (configurable via VITE_GOOGLE_CLIENT_ID or localStorage for instant runtime setup)
const defaultClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || localStorage.getItem('kashi_google_client_id') || '10829384756-google-oauth-demo.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={defaultClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
