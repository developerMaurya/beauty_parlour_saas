/**
 * @file main.jsx
 * @description Frontend Application Mount Point with Google OAuth Provider.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';

// Google Client ID (Official Kashi Service Google Cloud OAuth)
const defaultClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  localStorage.getItem('kashi_google_client_id') ||
  '901658045362-7sct3vvcrgkradmpr2sm7ku89tavvdhe.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={defaultClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
