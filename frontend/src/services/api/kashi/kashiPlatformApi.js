/**
 * @file kashiPlatformApi.js
 * @description Frontend API Client for Kashi Service Master Platform & Sub-Verticals.
 * @module frontend/src/services/api/kashi/kashiPlatformApi
 */

import { axiosClient } from '../axiosClient.js';

// ── Master Platform & Catalog ──
export const getKashiServices = async () => {
  const res = await axiosClient.get('/kashi/services');
  return res.data;
};

export const getKashiServiceDetails = async (serviceId) => {
  const res = await axiosClient.get(`/kashi/services/${serviceId}`);
  return res.data;
};

export const registerKashiTenant = async (formData) => {
  const res = await axiosClient.post('/kashi/onboarding/register', formData);
  return res.data;
};

export const getKashiDemoTenants = async () => {
  const res = await axiosClient.get('/kashi/demo-tenants');
  return res.data;
};

// ── Event Services API ──
export const getKashiEvents = async () => {
  const res = await axiosClient.get('/kashi/events');
  return res.data;
};

export const createKashiEventBooking = async (data) => {
  const res = await axiosClient.post('/kashi/events/book', data);
  return res.data;
};

export const scanKashiEventQr = async (data) => {
  const res = await axiosClient.post('/kashi/events/scan-qr', data);
  return res.data;
};

// ── Plotting Services API ──
export const getKashiPlottingColonies = async () => {
  const res = await axiosClient.get('/kashi/plotting/colonies');
  return res.data;
};

export const calculatePlotEmi = async (data) => {
  const res = await axiosClient.post('/kashi/plotting/calculate-emi', data);
  return res.data;
};

export const bookPlot = async (data) => {
  const res = await axiosClient.post('/kashi/plotting/book-plot', data);
  return res.data;
};

// ── Rent Services API ──
export const getKashiRentalAssets = async () => {
  const res = await axiosClient.get('/kashi/rent/assets');
  return res.data;
};

export const generateRentInvoice = async (data) => {
  const res = await axiosClient.post('/kashi/rent/generate-invoice', data);
  return res.data;
};

export const bookRentalAsset = async (data) => {
  const res = await axiosClient.post('/kashi/rent/book', data);
  return res.data;
};

// ── Software Services API ──
export const getKashiSoftwareVerticals = async () => {
  const res = await axiosClient.get('/kashi/software/verticals');
  return res.data;
};

// ── Beauty Parlour Dedicated API ──
export const getBeautyParlourOverview = async () => {
  const res = await axiosClient.get('/kashi/beauty-parlour/overview');
  return res.data;
};
