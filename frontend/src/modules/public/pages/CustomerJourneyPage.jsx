/**
 * @file CustomerJourneyPage.jsx
 * @description Standalone 01-07 Customer SaaS Journey & Onboarding Page.
 * Routes: /onboarding, /get-started, /start
 * @module frontend/src/modules/public/pages/CustomerJourneyPage
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerJourneyWizardModal from '../components/CustomerJourneyWizardModal.jsx';

export default function CustomerJourneyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <CustomerJourneyWizardModal
        isOpen={true}
        onClose={() => navigate('/')}
        initialService={{ id: 'beauty-parlour', name: 'Beauty Parlour & Salon ERP' }}
      />
    </div>
  );
}

