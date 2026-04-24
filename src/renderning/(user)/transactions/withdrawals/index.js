'use client';

import React, { useState } from 'react';
import TablePageLayout from '@/components/tablePageLayout';
import styles from '../transactions.module.scss';
import moment from 'moment';

// Wire API when ready — placeholder for now
const PLACEHOLDER_ROWS = [];

export default function Withdrawals() {
  const [currentPage, setCurrentPage] = useState(1);
  const TOTAL_PAGES = 1;

  return (
    <TablePageLayout
      currentPage={currentPage}
      totalPages={TOTAL_PAGES}
      onPageChange={setCurrentPage}
      showPagination={TOTAL_PAGES > 1}
    >
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>MT5 Account</th>
              <th>withdrawal Amount</th>
              <th>Wallet Address</th>
              <th>Proof Of Transfer</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_ROWS.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyRow}>
                  No withdrawal records found.
                </td>
              </tr>
            ) : (
              PLACEHOLDER_ROWS.map((row) => (
                <tr key={row.id}>
                  <td>
                    {row.createdAt
                      ? moment(row.createdAt).format('DD-MM-YYYY | hh:mm A')
                      : '—'}
                  </td>
                  <td>{row.transactionId || '—'}</td>
                  <td>{row.accountId || '—'}</td>
                  <td>${row.amount ?? '—'}</td>
                  <td>{row.method || '—'}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${row.status === 'completed' ? styles.success : row.status === 'failed' ? styles.danger : styles.neutral}`}
                    >
                      {row.status || '—'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TablePageLayout>
  );
}
