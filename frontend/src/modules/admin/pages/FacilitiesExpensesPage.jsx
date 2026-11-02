/**
 * @file FacilitiesExpensesPage.jsx
 * @description Salon Facilities: Electricity with Meter Readings, Utilities, Rent, Assets, Maintenance, Scrap, and Additional Event Work.
 * Conforms to Sections 43, 44, 45, 46, 47, 48, 49, 50.
 * @module frontend/src/modules/admin/pages/FacilitiesExpensesPage
 */

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Zap,
  Home,
  Wrench,
  Trash,
  DollarSign,
  Sparkles,
  Building,
  CheckCircle,
} from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import FormModal from '../../../components/FormEngine/FormModal.jsx';
import {
  utilityFetcher,
  rentFetcher,
  assetFetcher,
  maintenanceFetcher,
  scrapFetcher,
  expenseFetcher,
  additionalWorkFetcher,
  branchFetcher,
} from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const FacilitiesExpensesPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('electricity'); // 'electricity' | 'rent' | 'assets' | 'maintenance' | 'scrap' | 'expenses' | 'events'

  const [electricityRecords, setElectricityRecords] = useState([]);
  const [rentRecords, setRentRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [scrapList, setScrapList] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [eventWorkList, setEventWorkList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const bRes = await branchFetcher.list();
      setBranches(bRes.data || []);

      if (activeTab === 'electricity') {
        const res = await utilityFetcher.getElectricity({ branchId: selectedBranchId || undefined });
        setElectricityRecords(res.data || []);
      } else if (activeTab === 'rent') {
        const res = await rentFetcher.list({ branchId: selectedBranchId || undefined });
        setRentRecords(res.data || []);
      } else if (activeTab === 'assets') {
        const res = await assetFetcher.list({ branchId: selectedBranchId || undefined });
        setAssets(res.data || []);
      } else if (activeTab === 'maintenance') {
        const res = await maintenanceFetcher.list({ branchId: selectedBranchId || undefined });
        setMaintenanceList(res.data || []);
      } else if (activeTab === 'scrap') {
        const res = await scrapFetcher.list({ branchId: selectedBranchId || undefined });
        setScrapList(res.data || []);
      } else if (activeTab === 'expenses') {
        const res = await expenseFetcher.list({ branchId: selectedBranchId || undefined });
        setExpenses(res.data || []);
      } else if (activeTab === 'events') {
        const res = await additionalWorkFetcher.list({ branchId: selectedBranchId || undefined });
        setEventWorkList(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load facility data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab, selectedBranchId]);

  const handleSave = async (data) => {
    try {
      const branch = data.branchId || selectedBranchId || branches[0]?._id;

      if (activeTab === 'electricity') {
        const prev = Number(data.previousMeterReading) || 0;
        const curr = Number(data.currentMeterReading) || 0;
        const units = Math.max(0, curr - prev);
        const rate = Number(data.ratePerUnit) || 10;
        const total = units * rate + (Number(data.fixedCharge) || 0);

        await utilityFetcher.createElectricity({
          ...data,
          branch,
          unitsConsumed: units,
          totalAmount: total,
        });
        toast.success('Electricity bill logged');
      } else if (activeTab === 'rent') {
        await rentFetcher.create({ ...data, branch });
        toast.success('Rent entry created');
      } else if (activeTab === 'assets') {
        await assetFetcher.create({ ...data, branch });
        toast.success('Asset logged');
      } else if (activeTab === 'maintenance') {
        await maintenanceFetcher.create({ ...data, branch });
        toast.success('Maintenance ticket logged');
      } else if (activeTab === 'scrap') {
        await scrapFetcher.create({ ...data, branch });
        toast.success('Scrap disposal recorded');
      } else if (activeTab === 'expenses') {
        await expenseFetcher.create({ ...data, branch });
        toast.success('Business expense recorded');
      } else if (activeTab === 'events') {
        await additionalWorkFetcher.create({ ...data, branch });
        toast.success('Special event work created');
      }
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  // Dynamic field definitions
  const electricityFields = [
    { name: 'month', label: 'Billing Month / Year', required: true, placeholder: 'e.g. October 2026' },
    { name: 'previousMeterReading', label: 'Previous Meter Reading (Units)', type: 'number', required: true },
    { name: 'currentMeterReading', label: 'Current Meter Reading (Units)', type: 'number', required: true },
    { name: 'ratePerUnit', label: 'Rate Per Unit (₹)', type: 'number', defaultValue: 9.5 },
    { name: 'fixedCharge', label: 'Fixed / Meter Charges (₹)', type: 'currency', defaultValue: 250 },
    { name: 'dueDate', label: 'Due Date', type: 'date' },
  ];

  const rentFields = [
    { name: 'month', label: 'Rent Month', required: true, placeholder: 'e.g. November 2026' },
    { name: 'rentAmount', label: 'Monthly Rent Amount (₹)', type: 'currency', required: true },
    { name: 'dueDate', label: 'Rent Due Date', type: 'date', required: true },
    { name: 'paidDate', label: 'Date Paid', type: 'date' },
  ];

  const assetFields = [
    { name: 'name', label: 'Asset Name', required: true, placeholder: 'e.g. Dyson Hair Dryer, Hydraulic Salon Chair' },
    { name: 'category', label: 'Asset Category', placeholder: 'e.g. Furniture, Electrical, Machine' },
    { name: 'purchaseCost', label: 'Purchase Cost (₹)', type: 'currency' },
    { name: 'serialNumber', label: 'Serial / Model Number', placeholder: 'SN-9821' },
  ];

  const maintenanceFields = [
    { name: 'item', label: 'Equipment / Asset Under Repair', required: true, placeholder: 'e.g. AC Unit 2, Straightener' },
    { name: 'problem', label: 'Issue Description', type: 'textarea', required: true },
    { name: 'vendor', label: 'Technician / Repair Vendor', placeholder: 'e.g. CoolCare Services' },
    { name: 'cost', label: 'Repair Cost (₹)', type: 'currency' },
  ];

  const scrapFields = [
    { name: 'item', label: 'Scrapped Item Name', required: true, placeholder: 'e.g. Expired Keratin Bottle, Broken Mirror' },
    { name: 'quantity', label: 'Quantity Scrapped', type: 'number', defaultValue: 1 },
    { name: 'reason', label: 'Reason for Disposal', required: true, placeholder: 'Expired / Broken' },
  ];

  const expenseFields = [
    { name: 'title', label: 'Expense Title', required: true, placeholder: 'e.g. Tea & Snacks for Staff, Office Stationery' },
    { name: 'category', label: 'Category', placeholder: 'e.g. Marketing, Refreshments, Transport' },
    { name: 'amount', label: 'Amount (₹)', type: 'currency', required: true },
    { name: 'date', label: 'Date Incurred', type: 'date' },
  ];

  const eventFields = [
    { name: 'title', label: 'Event / Party Name', required: true, placeholder: 'e.g. Kapoor Destination Wedding Styling' },
    { name: 'clientName', label: 'Client / Organizer', required: true, placeholder: 'Mrs. Kapoor' },
    { name: 'location', label: 'Event Venue / Address', placeholder: 'Grand Hyatt Lawn' },
    { name: 'income', label: 'Agreed Revenue (₹)', type: 'currency', required: true },
    { name: 'expenses', label: 'Estimated Expenses (₹)', type: 'currency' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Facilities, Utilities & Salon Expenses
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Track electricity bills with meter reading comparisons, rent, assets, repairs, scrap, and event work
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" /> Add Record
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('electricity')}
          className={`btn ${activeTab === 'electricity' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Zap className="w-4 h-4" /> Electricity & Meters
        </button>
        <button
          onClick={() => setActiveTab('rent')}
          className={`btn ${activeTab === 'rent' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Home className="w-4 h-4" /> Salon Rent
        </button>
        <button
          onClick={() => setActiveTab('assets')}
          className={`btn ${activeTab === 'assets' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Building className="w-4 h-4" /> Physical Assets
        </button>
        <button
          onClick={() => setActiveTab('maintenance')}
          className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Wrench className="w-4 h-4" /> Maintenance
        </button>
        <button
          onClick={() => setActiveTab('scrap')}
          className={`btn ${activeTab === 'scrap' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Trash className="w-4 h-4" /> Scrap & Waste
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <DollarSign className="w-4 h-4" /> Miscellaneous Expenses
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`btn ${activeTab === 'events' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Sparkles className="w-4 h-4" /> Wedding & Event Work
        </button>
      </div>

      {activeTab === 'electricity' && (
        <DataTable
          columns={[
            { header: 'Month', accessor: 'month' },
            {
              header: 'Meter Readings (Prev → Curr)',
              render: (row) => `${row.previousMeterReading} → ${row.currentMeterReading} units`,
            },
            {
              header: 'Consumed Units',
              render: (row) => (
                <span style={{ fontWeight: 700, color: '#3b82f6' }}>{row.unitsConsumed} Units</span>
              ),
            },
            {
              header: 'Total Bill Amount',
              render: (row) => (
                <span style={{ fontWeight: 800, color: '#10b981' }}>
                  ₹{(row.totalAmount || 0).toLocaleString()}
                </span>
              ),
            },
            {
              header: 'Status',
              render: (row) => (
                <span style={{ fontSize: '0.8rem', color: row.paymentStatus === 'paid' ? '#10b981' : '#f59e0b', fontWeight: 600 }}>
                  {row.paymentStatus || 'Pending'}
                </span>
              ),
            },
          ]}
          data={electricityRecords}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'rent' && (
        <DataTable
          columns={[
            { header: 'Month', accessor: 'month' },
            {
              header: 'Rent Amount',
              render: (row) => <span style={{ fontWeight: 700, color: '#10b981' }}>₹{(row.rentAmount || 0).toLocaleString()}</span>,
            },
            { header: 'Due Date', render: (row) => new Date(row.dueDate).toLocaleDateString() },
            { header: 'Status', render: (row) => row.status || 'Pending' },
          ]}
          data={rentRecords}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'assets' && (
        <DataTable
          columns={[
            { header: 'Asset Name', accessor: 'name' },
            { header: 'Category', accessor: 'category' },
            { header: 'Purchase Cost', render: (row) => `₹${(row.purchaseCost || 0).toLocaleString()}` },
            { header: 'Status', render: (row) => row.status || 'Active' },
          ]}
          data={assets}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'maintenance' && (
        <DataTable
          columns={[
            { header: 'Item / Machine', accessor: 'item' },
            { header: 'Problem Description', accessor: 'problem' },
            { header: 'Vendor', accessor: 'vendor' },
            { header: 'Cost', render: (row) => `₹${(row.cost || 0).toLocaleString()}` },
          ]}
          data={maintenanceList}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'scrap' && (
        <DataTable
          columns={[
            { header: 'Item', accessor: 'item' },
            { header: 'Quantity', accessor: 'quantity' },
            { header: 'Disposal Reason', accessor: 'reason' },
          ]}
          data={scrapList}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'expenses' && (
        <DataTable
          columns={[
            { header: 'Expense Title', accessor: 'title' },
            { header: 'Category', accessor: 'category' },
            { header: 'Amount', render: (row) => `₹${(row.amount || 0).toLocaleString()}` },
          ]}
          data={expenses}
          isLoading={isLoading}
        />
      )}

      {activeTab === 'events' && (
        <DataTable
          columns={[
            { header: 'Event Title', accessor: 'title' },
            { header: 'Client', accessor: 'clientName' },
            { header: 'Revenue', render: (row) => `₹${(row.income || 0).toLocaleString()}` },
          ]}
          data={eventWorkList}
          isLoading={isLoading}
        />
      )}

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Add ${activeTab.toUpperCase()} Record`}
        fields={
          activeTab === 'electricity'
            ? electricityFields
            : activeTab === 'rent'
            ? rentFields
            : activeTab === 'assets'
            ? assetFields
            : activeTab === 'maintenance'
            ? maintenanceFields
            : activeTab === 'scrap'
            ? scrapFields
            : activeTab === 'expenses'
            ? expenseFields
            : eventFields
        }
        onSubmit={handleSave}
      />
    </div>
  );
};

export default FacilitiesExpensesPage;
