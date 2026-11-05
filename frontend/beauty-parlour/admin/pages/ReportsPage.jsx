/**
 * @file ReportsPage.jsx
 * @description 20+ Business Intelligence Reports with CSV Data Export.
 * Conforms to Section 61.
 * @module frontend/src/modules/admin/pages/ReportsPage
 */

import React, { useState, useEffect } from 'react';
import { Download, BarChart3, TrendingUp, Calendar, DollarSign, RefreshCw } from 'lucide-react';
import DataTable from '../../../components/DataTable.jsx';
import { reportFetcher } from '../../../services/api/admin/adminApi.js';
import { useToast } from '../../../context/ToastContext.jsx';
import { useTenantAdmin } from '../../../context/TenantAdminContext.jsx';

export const ReportsPage = () => {
  const { selectedBranchId } = useTenantAdmin();
  const toast = useToast();

  const [selectedReportType, setSelectedReportType] = useState('revenue');
  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const reportOptions = [
    { label: 'Revenue Report', value: 'revenue', fetcher: reportFetcher.getRevenue },
    { label: 'Sales & Invoices', value: 'sales', fetcher: reportFetcher.getSales },
    { label: 'Appointments Summary', value: 'appointments', fetcher: reportFetcher.getAppointments },
    { label: 'Client Growth & Retention', value: 'customers', fetcher: reportFetcher.getCustomers },
    { label: 'Staff Performance', value: 'staff', fetcher: reportFetcher.getStaff },
    { label: 'Academy Student Progress', value: 'students', fetcher: reportFetcher.getStudents },
    { label: 'Services Popularity', value: 'services', fetcher: reportFetcher.getServices },
    { label: 'Package Sales', value: 'packages', fetcher: reportFetcher.getPackages },
    { label: 'Inventory Valuation', value: 'inventory', fetcher: reportFetcher.getInventory },
    { label: 'Expenses Audit', value: 'expenses', fetcher: reportFetcher.getExpenses },
    { label: 'Profit & Loss Statement', value: 'profit-loss', fetcher: reportFetcher.getProfitLoss },
    { label: 'Staff Attendance & Hours', value: 'attendance', fetcher: reportFetcher.getAttendance },
    { label: 'Staff Commissions', value: 'commission', fetcher: reportFetcher.getCommission },
    { label: 'Payroll Report', value: 'payroll', fetcher: reportFetcher.getPayroll },
    { label: 'Electricity Consumption', value: 'electricity', fetcher: reportFetcher.getElectricity },
    { label: 'Rent Ledger', value: 'rent', fetcher: reportFetcher.getRent },
    { label: 'Maintenance & Repairs', value: 'maintenance', fetcher: reportFetcher.getMaintenance },
    { label: 'Scrap & Waste Disposals', value: 'scrap', fetcher: reportFetcher.getScrap },
    { label: 'Home Services Transit', value: 'home-services', fetcher: reportFetcher.getHomeServices },
    { label: 'Late Work & Delays', value: 'late-work', fetcher: reportFetcher.getLateWork },
  ];

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const activeOption = reportOptions.find((o) => o.value === selectedReportType);
      if (activeOption?.fetcher) {
        const res = await activeOption.fetcher({
          branchId: selectedBranchId || undefined,
          fromDate: fromDate || undefined,
          toDate: toDate || undefined,
        });
        setReportData(res.data || []);
      }
    } catch (err) {
      toast.error('Failed to load report data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedReportType, selectedBranchId]);

  const handleExportCsv = async () => {
    try {
      const response = await reportFetcher.exportCsv({
        type: selectedReportType,
        branchId: selectedBranchId || undefined,
        fromDate,
        toDate,
      });

      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${selectedReportType}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported to CSV');
    } catch (err) {
      toast.error('Failed to export CSV report');
    }
  };

  const getColumns = () => {
    if (!reportData || reportData.length === 0) {
      return [{ header: 'Report Metric', accessor: 'metric' }];
    }
    const sample = reportData[0];
    return Object.keys(sample)
      .filter((k) => !['_id', '__v', 'branch'].includes(k))
      .map((key) => ({
        header: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()),
        accessor: key,
        render: (row) => {
          const val = row[key];
          if (typeof val === 'number') {
            return (
              <span style={{ fontWeight: 600 }}>
                {key.toLowerCase().includes('amount') || key.toLowerCase().includes('revenue') || key.toLowerCase().includes('price') || key.toLowerCase().includes('cost') || key.toLowerCase().includes('profit')
                  ? `₹${val.toLocaleString()}`
                  : val.toLocaleString()}
              </span>
            );
          }
          if (typeof val === 'object' && val !== null) {
            return val.name || JSON.stringify(val);
          }
          return String(val ?? '—');
        },
      }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Business Intelligence & Reports
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Export comprehensive analytics on revenue, staff commissions, payroll, utilities, and salon efficiency
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Report Type Selector Toolbar */}
      <div
        className="card"
        style={{
          padding: '1.25rem',
          borderRadius: '12px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: '240px', flex: 1 }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            Select Business Report
          </label>
          <select
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
            className="form-input"
            style={{ marginTop: '4px' }}
          >
            {reportOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="form-input"
            style={{ marginTop: '4px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="form-input"
            style={{ marginTop: '4px' }}
          />
        </div>

        <button
          onClick={loadReport}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-end', height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} /> Run Report
        </button>
      </div>

      <DataTable
        columns={getColumns()}
        data={reportData}
        isLoading={isLoading}
        searchPlaceholder="Filter report records..."
      />
    </div>
  );
};

export default ReportsPage;
