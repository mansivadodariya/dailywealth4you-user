'use client';

import React, { useState } from 'react';
import TablePageLayout from '@/components/tablePageLayout';
import styles from './myClients.module.scss';

// Placeholder columns — wire API when ready
const PLACEHOLDER_ROWS = [];

export default function MyClients() {
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
              <th>Name</th>
              <th>Email</th>
              <th>Account ID</th>
              <th>Broker</th>
              <th>Date Joined</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_ROWS.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyRow}>
                  No clients found.
                </td>
              </tr>
            ) : (
              PLACEHOLDER_ROWS.map((row, i) => (
                <tr key={i}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.accountId}</td>
                  <td>{row.broker}</td>
                  <td>{row.dateJoined}</td>
                  <td>{row.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </TablePageLayout>
  );
}
