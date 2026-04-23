'use client';
import React, { useState } from 'react';
import styles from './profitSharingTable.module.scss';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function ProfitSharingTable() {
  const { profitSharingData, profitSharingLoading, profitSharingError } =
    useSelector((state) => state.ibUser);

  const [expandedKey, setExpandedKey] = useState(null);

  const handleToggle = (key) => {
    setExpandedKey(expandedKey === key ? null : key);
  };

  if (profitSharingLoading) {
    return (
      <div className={styles.profitSharingTable}>
        <div className={styles.emptyState}>Loading...</div>
      </div>
    );
  }

  if (profitSharingError) {
    return (
      <div className={styles.profitSharingTable}>
        <div className={styles.emptyState} style={{ color: '#ff4d4d' }}>
          Failed to load data.
        </div>
      </div>
    );
  }

  // Flatten: one row per user+broker combination
  const rows = [];
  profitSharingData?.forEach((entry) => {
    const user = entry?.user;
    entry?.brokers?.forEach((brokerEntry, bIdx) => {
      // Use the latest trade date as the row date
      const trades = brokerEntry?.trades || [];
      const latestDate = trades.reduce((latest, trade) => {
        if (!trade?.createdAt) return latest;
        return !latest || new Date(trade.createdAt) > new Date(latest)
          ? trade.createdAt
          : latest;
      }, null);

      rows.push({
        key: `${user?.id}-${bIdx}`,
        user,
        broker: brokerEntry?.broker,
        trades,
        latestDate,
        totalProfit: brokerEntry?.totalProfit,
        totalLots: brokerEntry?.totalLots,
        totalCommission: brokerEntry?.totalCommission,
      });
    });
  });

  return (
    <div className={styles.profitSharingTable}>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>

              <th>Profit</th>
              <th>Broker</th>
              <th>Total Commission</th>
              <th className={styles.textCenter}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: 'center',
                    padding: '24px',
                    color: '#8e8e8e',
                  }}
                >
                  No data available.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <React.Fragment key={row.key}>
                <tr className={expandedKey === row.key ? styles.activeRow : ''}>
                  <td>
                    {row.latestDate
                      ? moment(row.latestDate).format('DD-MM-YYYY | hh:mm A')
                      : '—'}
                  </td>
                  <td>
                    {`${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() ||
                      '—'}
                  </td>
                  <td>{row.user?.email || '—'}</td>

                  <td>${row.totalProfit ?? '—'}</td>
                  <td>{row.broker?.name || '—'}</td>
                  <td>${row.totalCommission ?? '—'}</td>
                  <td className={styles.textCenter}>
                    <button
                      className={`${styles.viewBtn} ${expandedKey === row.key ? styles.active : ''}`}
                      onClick={() => handleToggle(row.key)}
                    >
                      {expandedKey === row.key ? 'Close' : 'View'}
                    </button>
                  </td>
                </tr>

                <AnimatePresence>
                  {expandedKey === row.key && row.trades.length > 0 && (
                    <tr className={styles.detailsRow}>
                      <td colSpan="7">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className={styles.detailsWrapper}
                        >
                          <div className={styles.innerTableContainer}>
                            <div className={styles.innerHeader}>
                              <div>Order ID</div>
                              <div>Account ID</div>
                              <div>Symbol</div>
                              <div>Lots</div>
                              <div>P&L</div>
                              <div>Commission</div>
                              {/* <div>Date</div> */}
                            </div>
                            <div className={styles.innerBody}>
                              {row.trades.map((trade) => (
                                <div
                                  className={styles.innerRow}
                                  key={trade?.id}
                                >
                                  <div>{trade?.orderId || '—'}</div>
                                  <div>{trade?.accountId || '—'}</div>
                                  <div>
                                    <span className={styles.symbolBadge}>
                                      {trade?.item || '—'}
                                    </span>
                                  </div>
                                  <div>{trade?.volume ?? '—'}</div>
                                  <div>
                                    <span
                                      className={styles.pnlBadge}
                                      style={{
                                        borderColor:
                                          (trade?.profitLoss ?? 0) >= 0
                                            ? '#02df82'
                                            : '#ff4d4d',
                                        background:
                                          (trade?.profitLoss ?? 0) >= 0
                                            ? 'rgba(2,223,130,0.1)'
                                            : 'rgba(255,77,77,0.1)',
                                      }}
                                    >
                                      {(trade?.profitLoss ?? 0) >= 0 ? '+' : ''}
                                      ${trade?.profitLoss ?? '—'}
                                    </span>
                                  </div>
                                  <div>${trade?.commission ?? '—'}</div>
                                  {/* <div>
                                    {trade?.createdAt
                                      ? moment(trade.createdAt).format('DD-MM-YYYY | hh:mm A')
                                      : '—'}
                                  </div> */}
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
