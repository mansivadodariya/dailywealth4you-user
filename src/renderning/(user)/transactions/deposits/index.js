'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions } from '@/store/slice/accountSlice';
import DataTableHeader from '@/components/common/DataTableHeader';
import Pagination from '@/components/pagination';
import Loader from '@/components/Loader';
import styles from '../transactions.module.scss';
import moment from 'moment';

const ITEMS_PER_PAGE = 10;

export default function Deposits() {
  const dispatch = useDispatch();
  const { deposits, transactionsLoading, transactionsError } = useSelector(
    (state) => state.account
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions('deposit'));
  }, [dispatch]);

  // Client-side search
  const filtered = (deposits || []).filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (row?.mt5Account || '').toLowerCase().includes(q) ||
      (row?.broker || '').toLowerCase().includes(q)
    );
  });

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
      />

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>MT5 Account</th>
              <th>Broker</th>
              <th>Deposit Amount</th>
              {/* <th>Status</th> */}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="5" className={styles.emptyRow}>
                  {search
                    ? 'No deposits match your search.'
                    : 'No deposit records found.'}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row?.id || row?._id || i}>
                  <td>
                    {row?.createdAt
                      ? moment(row.createdAt).format('DD-MM-YYYY | hh:mm A')
                      : '—'}
                  </td>
                  <td>{row?.mt5Account || '—'}</td>
                  <td>{row?.broker || '—'}</td>
                  <td>${row?.amount ?? '—'}</td>
                  {/* <td>
                    <span className={`${styles.badge} ${getStatusClass(row?.status)}`}>
                      {row?.status || 'pending'}
                    </span>
                  </td> */}
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
