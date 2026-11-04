/**
 * @file DataTable.jsx
 * @description Advanced Reusable Data Table with Interactive Sorting (ASC / DESC), Search, Filters, and Pagination
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

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
  defaultSortColumn = null,
  defaultSortDirection = 'asc',
  onSortChange,
  onRowClick,
}) => {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Handle header click to toggle sort: asc -> desc -> reset
  const handleHeaderClick = (col) => {
    if (col.sortable === false || !col.accessor) return;

    let nextCol = col.accessor;
    let nextDir = 'asc';

    if (sortColumn === col.accessor) {
      if (sortDirection === 'asc') {
        nextDir = 'desc';
      } else if (sortDirection === 'desc') {
        nextCol = null;
        nextDir = 'asc';
      }
    }

    setSortColumn(nextCol);
    setSortDirection(nextDir);

    if (onSortChange) {
      onSortChange(nextCol, nextDir);
    }
  };

  // Sort data array client-side if sortColumn is active
  const processedData = useMemo(() => {
    if (!sortColumn || !data || data.length === 0) return data;

    return [...data].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      // Handle null/undefined values
      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      // Date sorting
      if (valA instanceof Date || (typeof valA === 'string' && !isNaN(Date.parse(valA)) && (valA.includes('T') || valA.includes('-')))) {
        const timeA = new Date(valA).getTime();
        const timeB = new Date(valB).getTime();
        if (!isNaN(timeA) && !isNaN(timeB)) {
          return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
        }
      }

      // String sorting
      if (typeof valA === 'string' || typeof valB === 'string') {
        const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' });
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      // Number sorting
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // Boolean sorting
      if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        return sortDirection === 'asc' ? (valA === valB ? 0 : valA ? 1 : -1) : (valA === valB ? 0 : valA ? -1 : 1);
      }

      return 0;
    });
  }, [data, sortColumn, sortDirection]);

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
              {columns.map((col, idx) => {
                const isSortable = col.sortable !== false && !!col.accessor;
                const isCurrentSort = sortColumn === col.accessor;

                return (
                  <th
                    key={idx}
                    style={{
                      textAlign: col.align || 'left',
                      width: col.width || 'auto',
                      cursor: isSortable ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                    onClick={() => isSortable && handleHeaderClick(col)}
                    title={isSortable ? `Click to sort by ${col.header} (${isCurrentSort ? (sortDirection === 'asc' ? 'Descending' : 'Reset') : 'Ascending'})` : undefined}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        justifyContent: col.align === 'right' ? 'flex-end' : col.align === 'center' ? 'center' : 'flex-start',
                        width: '100%',
                      }}
                    >
                      <span>{col.header}</span>
                      {isSortable && (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            opacity: isCurrentSort ? 1 : 0.35,
                            color: isCurrentSort ? 'var(--primary)' : 'inherit',
                            transition: 'opacity 0.15s ease',
                          }}
                        >
                          {isCurrentSort ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="w-3.5 h-3.5" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
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
            ) : processedData.length === 0 ? (
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
              processedData.map((row, rowIdx) => (
                <tr
                  key={row._id || row.id || rowIdx}
                  onClick={(e) => {
                    if (onRowClick && !e.target.closest('button, a, input, select, textarea, .action-dropdown-wrap, [role="button"]')) {
                      onRowClick(row);
                    }
                  }}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background-color 0.15s ease',
                  }}
                  className={onRowClick ? 'table-clickable-row' : ''}
                >
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
            flexWrap: 'wrap',
            gap: '0.75rem',
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
            {sortColumn && (
              <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 500 }}>
                (Sorted by {sortColumn} {sortDirection.toUpperCase()})
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {pagination.onLimitChange && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Show:</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto', padding: '0.2rem 0.5rem', fontSize: '0.8rem', height: '28px' }}
                  value={pagination.limit || 10}
                  onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            )}

            <button
              className="btn btn-secondary btn-sm"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span style={{ padding: '0 0.5rem', fontWeight: 600 }}>
              Page {pagination.page} of {Math.ceil((pagination.total || 1) / (pagination.limit || 10)) || 1}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={
                pagination.page >= Math.ceil((pagination.total || 0) / (pagination.limit || 10)) || isLoading
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
