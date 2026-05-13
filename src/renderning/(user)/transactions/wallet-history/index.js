'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import Loader from '@/components/Loader';
import Pagination from '@/components/pagination';
import { exportToCsv } from '@/utils/exportToCsv';
import { getUserFromCookie } from '@/service/cookies';
import styles from '../transactions.module.scss';
import { fetchWalletHistory } from '@/store/slice/accountSlice';

export default function WalletHistory() {
  const dispatch = useDispatch();
  const {
    walletHistory,
    walletHistoryLoading,
    walletHistoryError,
    walletHistoryTotalPages,
  } = useSelector((state) => state.account);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const debounceRef = useRef(null);
  const userId = getUserFromCookie()?.id;

  const loadData = useCallback(
    (page, searchVal, filters) => {
      dispatch(
        fetchWalletHistory({
          userId,
          search: searchVal || undefined,
          page,
          limit: 10,
          ...filters,
        })
      );
    },
    [dispatch, userId]
  );

  // Initial load
  useEffect(() => {
    loadData(1, '', {});
  }, [loadData]);

  // Re-fetch when page changes
  useEffect(() => {
    loadData(currentPage, search, activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
      loadData(1, val, activeFilters);
    }, 400);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadData(1, search, filters);
  };

  const getSourceType = (row) =>
    row?.sourceType || row?.source_type || row?.accountType || row?.type || '—';

  const getStatusClass = (status) => {
    if (!status) return styles.neutral;
    const s = String(status).toLowerCase();
    if (s === 'completed' || s === 'approved') return styles.success;
    if (s === 'failed' || s === 'rejected') return styles.danger;
    if (s === 'pending') return styles.warning;
    return styles.neutral;
  };

  const handleExport = () => {
    const rows = (walletHistory || []).map((row) => ({
      Date: row?.createdAt
        ? moment(row.createdAt).format('DD-MM-YYYY | hh:mm A')
        : '—',
      'Source type': getSourceType(row),
      Status: row?.status || 'pending',
      Amount: row?.amount ?? '—',
    }));
    exportToCsv(
      rows,
      ['Date', 'Source type', 'Status', 'Amount'],
      {},
      'wallet-history'
    );
  };

  const FILTER_GROUPS = [
    {
      group: 'Select Date Range',
      fields: [
        { key: 'startDate', label: 'Start Date', type: 'date' },
        { key: 'endDate', label: 'End Date', type: 'date' },
      ],
    },
    {
      group: 'Status',
      fields: [
        {
          key: 'status',
          label: 'Status',
          type: 'text',
          placeholder: 'e.g. pending, completed',
        },
      ],
    },
  ];

  if (walletHistoryLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (walletHistoryError) {
    return (
      <p
        style={{
          color: '#ff4d4d',
          textAlign: 'center',
          padding: '24px',
          fontSize: 14,
        }}
      >
        Failed to load wallet history.
      </p>
    );
  }

  return (
    <>
      <DataTableHeader
        onSearch={handleSearch}
        onExport={handleExport}
        filterModal={
          <FilterModal
            onApply={handleApplyFilters}
            fieldGroups={FILTER_GROUPS}
          />
        }
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Source type</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {!walletHistory || walletHistory.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.emptyRow}>
                  {search || Object.keys(activeFilters).length > 0
                    ? 'No records match your filters.'
                    : 'No wallet history found.'}
                </td>
              </tr>
            ) : (
              walletHistory.map((row) => (
                <tr key={row?.id || row?._id}>
                  <td>
                    {row?.createdAt
                      ? moment(row.createdAt).format('DD-MM-YYYY | hh:mm A')
                      : '—'}
                  </td>
                  <td>{getSourceType(row)}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${getStatusClass(row?.status)}`}
                    >
                      {row?.status || 'pending'}
                    </span>
                  </td>
                  <td>${row?.amount ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {walletHistoryTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={walletHistoryTotalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </>
  );
}
