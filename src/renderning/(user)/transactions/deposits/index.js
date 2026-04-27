'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/slice/accountSlice';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import Pagination from '@/components/pagination';
import Loader from '@/components/Loader';
import styles from '../transactions.module.scss';
import moment from 'moment';

const ITEMS_PER_PAGE = 10;

// Deposit filter fields
const DEPOSIT_FILTER_GROUPS = [
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

export default function Deposits() {
  const dispatch = useDispatch();
  const { deposits, transactionsLoading, transactionsError } = useSelector(
    (state) => state.account
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    dispatch(fetchTransactions('deposit'));
  }, [dispatch]);

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  // Client-side filter + search
  const filtered = useMemo(() => {
    return (deposits || []).filter((row) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        if (
          !(row?.mt5Account || '').toLowerCase().includes(q) &&
          !(row?.broker || '').toLowerCase().includes(q)
        )
          return false;
      }
      // Date
      if (activeFilters.startDate && row?.createdAt) {
        if (new Date(row.createdAt) < new Date(activeFilters.startDate))
          return false;
      }
      if (activeFilters.endDate && row?.createdAt) {
        if (
          new Date(row.createdAt) >
          new Date(activeFilters.endDate + 'T23:59:59')
        )
          return false;
      }
      // Amount
      const amt = Number(row?.amount) || 0;
      if (activeFilters.minAmount && amt < Number(activeFilters.minAmount))
        return false;
      if (activeFilters.maxAmount && amt > Number(activeFilters.maxAmount))
        return false;
      // MT5 Account
      if (activeFilters.mt5Account && row?.mt5Account) {
        if (
          !row.mt5Account
            .toLowerCase()
            .includes(activeFilters.mt5Account.toLowerCase())
        )
          return false;
      }
      return true;
    });
  }, [deposits, search, activeFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getStatusClass = (status) => {
    if (!status) return styles.neutral;
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'approved') return styles.success;
    if (s === 'failed' || s === 'rejected') return styles.danger;
    return styles.neutral;
  };

  if (transactionsLoading) {
    return (
      <Loader
        variant="dots"
        size="large"
        color="success"
        text="Loading deposits..."
      />
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
        Failed to load deposits.
      </p>
    );
  }

  return (
    <>
      <DataTableHeader
        onSearch={(val) => {
          setSearch(val);
          setCurrentPage(1);
        }}
        filterModal={
          <FilterModal
            onApply={handleApplyFilters}
            fieldGroups={DEPOSIT_FILTER_GROUPS}
          />
        }
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>MT5 Account</th>
              <th>Broker</th>
              <th>Deposit Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyRow}>
                  {search || Object.keys(activeFilters).length > 0
                    ? 'No deposits match your filters.'
                    : 'No deposit records found.'}
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row?.id || row?._id}>
                  <td>
                    {row?.createdAt
                      ? moment(row.createdAt).format('DD-MM-YYYY | hh:mm A')
                      : '—'}
                  </td>
                  <td>{row?.mt5Account || '—'}</td>
                  <td>{row?.broker || '—'}</td>
                  <td>${row?.amount ?? '—'}</td>
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

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
