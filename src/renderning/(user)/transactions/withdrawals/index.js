'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import Pagination from '@/components/pagination';
import Loader from '@/components/Loader';
import styles from '../transactions.module.scss';
import moment from 'moment';

const LIMIT = 10;

const WITHDRAWAL_FILTER_GROUPS = [
  {
    group: 'Select Date Range',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
    ],
  },
  {
    group: 'Select Amount Range',
    fields: [
      {
        key: 'minAmount',
        label: 'Min',
        type: 'number',
        placeholder: 'Min Amount',
      },
      {
        key: 'maxAmount',
        label: 'Max',
        type: 'number',
        placeholder: 'Max Amount',
      },
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
  {
    group: 'MT5 Account',
    fields: [
      {
        key: 'mt5Account',
        label: 'MT5 Account',
        type: 'text',
        placeholder: 'Account ID',
      },
    ],
  },
];

export default function Withdrawals() {
  const dispatch = useDispatch();
  const {
    withdrawals,
    transactionsLoading,
    transactionsError,
    withdrawalsTotalPages,
  } = useSelector((state) => state.account);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  const debounceRef = useRef(null);
  const userId = getUserFromCookie()?.id;

  const loadData = useCallback(
    (page, searchVal, filters) => {
      dispatch(
        fetchTransactions({
          type: 'withdrawal',
          userId,
          search: searchVal || undefined,
          page,
          limit: LIMIT,
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

  const getStatusClass = (status) => {
    if (!status) return styles.neutral;
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'approved') return styles.success;
    if (s === 'failed' || s === 'rejected') return styles.danger;
    if (s === 'pending') return styles.warning;
    return styles.neutral;
  };

  if (transactionsLoading) {
    return (
      <Loader variant="dots" size="large" color="success" text="Loading..." />
    );
  }

  if (transactionsError) {
    return (
      <p
        style={{
          color: '#ff4d4d',
          textAlign: 'center',
          padding: '24px',
          fontSize: 14,
        }}
      >
        Failed to load withdrawals.
      </p>
    );
  }

  return (
    <>
      {/* Summary cards */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <p>Requested Withdrawal</p>
          <h3>
            $
            {(withdrawals || [])
              .filter((r) => (r?.status || '').toLowerCase() === 'pending')
              .reduce((sum, r) => sum + (Number(r?.amount) || 0), 0)
              .toLocaleString() || '0'}
          </h3>
        </div>
        <div className={styles.summaryCard}>
          <p>Total Withdrawal</p>
          <h3>
            $
            {(withdrawals || [])
              .reduce((sum, r) => sum + (Number(r?.amount) || 0), 0)
              .toLocaleString() || '0'}
          </h3>
        </div>
      </div>

      <DataTableHeader
        onSearch={handleSearch}
        filterModal={
          <FilterModal
            onApply={handleApplyFilters}
            fieldGroups={WITHDRAWAL_FILTER_GROUPS}
          />
        }
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>MT5 Account</th>
              <th>Withdrawal Amount</th>
              <th>Wallet Address</th>
              <th>Proof of Transfer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!withdrawals || withdrawals.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyRow}>
                  {search || Object.keys(activeFilters).length > 0
                    ? 'No withdrawals match your filters.'
                    : 'No withdrawal records found.'}
                </td>
              </tr>
            ) : (
              withdrawals.map((row) => (
                <tr key={row?.id || row?._id}>
                  <td>
                    {row?.createdAt
                      ? moment(row.createdAt).format('DD-MM-YYYY | hh:mm A')
                      : '—'}
                  </td>
                  <td>{row?.mt5Account || '—'}</td>
                  <td>${row?.amount ?? '—'}</td>
                  <td>
                    {row?.address ? (
                      <span className={styles.addressText} title={row.address}>
                        {row.address.length > 16
                          ? `${row.address.slice(0, 8)}...${row.address.slice(-6)}`
                          : row.address}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {row?.proofUrl ? (
                      <a
                        href={row.proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.proofLink}
                      >
                        View
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${getStatusClass(row?.status)}`}
                    >
                      {row?.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {withdrawalsTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={withdrawalsTotalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}
    </>
  );
}
