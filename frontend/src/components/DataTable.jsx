/**
 * @file DataTable.jsx
 * @description Reusable Data Table with Search, Filter Slots, Sorting, and Pagination
 */

import React from 'react';
import { Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  isLoading = false,
  searchPlaceholder = 'Search records...',
  searchValue = '',
  onSearchChange,
  filters,
  actions,
  pagination,
  emptyMessage = 'No records found.',
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Table Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
          {onSearchChange && (
            <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
              <Search
                className="w-4 h-4"
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          {filters}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
      </div>

      {/* Table Container */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ textAlign: col.align || 'left', width: col.width || 'auto' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Loading data, please wait...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '3.5rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Inbox className="w-10 h-10" style={{ opacity: 0.4 }} />
                    <span style={{ fontSize: '0.95rem' }}>{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row._id || row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={{ textAlign: col.align || 'left' }}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.5rem 0.25rem',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            Showing{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total || 0)}
            </span>{' '}
            to{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {Math.min(pagination.page * pagination.limit, pagination.total || 0)}
            </span>{' '}
            of{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
              {pagination.total || 0}
            </span>{' '}
            entries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
              Page {pagination.page} of {Math.ceil((pagination.total || 1) / pagination.limit) || 1}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={
                pagination.page >= Math.ceil((pagination.total || 0) / pagination.limit) || isLoading
              }
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
