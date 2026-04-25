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

export default function Withdrawals() {
  const dispatch = useDispatch();
  const { withdrawals, transactionsLoading, transactionsError } = useSelector(
    (state) => state.account
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchTransactions('withdrawal')); // matches API spelling
  }, [dispatch]);

  // Client-side search
  const filtered = (withdrawals || []).filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (row?.mt5Account || '').toLowerCase().includes(q) ||
      (row?.address || '').toLowerCase().includes(q)
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
    if (s === 'pending') return styles.warning;
    return styles.neutral;
  };

  if (transactionsLoading) {
    return (
      <Loader
        variant="dots"
        size="large"
        color="success"
        text="Loading withdrawals..."
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
        Failed to load withdrawals.
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
              <th>Withdrawal Amount</th>
              <th>Wallet Address</th>
              <th>Proof of Transfer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyRow}>
                  {search
                    ? 'No withdrawals match your search.'
                    : 'No withdrawal records found.'}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row?.id}>
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
                      {row?.status}
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
