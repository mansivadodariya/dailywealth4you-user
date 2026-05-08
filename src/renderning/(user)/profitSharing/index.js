'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIbProfitSharing } from '@/store/slice/ibUserSlice';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';
import Loader from '@/components/Loader';
import Pagination from '@/components/pagination';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import ProfitSharingCard from './profitSharingCard';
import { exportToCsv } from '@/utils/exportToCsv';
import styles from './profitSharingTable/profitSharingTable.module.scss';

const LIMIT = 10;

const PROFIT_SHARING_FILTER_GROUPS = [
  {
    group: 'Select Date Range',
    fields: [
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'endDate', label: 'End Date', type: 'date' },
    ],
  },
  {
    group: 'Select Profit Range',
    fields: [
      {
        key: 'minProfit',
        label: 'Min',
        type: 'number',
        placeholder: 'Min Profit',
      },
      {
        key: 'maxProfit',
        label: 'Max',
        type: 'number',
        placeholder: 'Max Profit',
      },
    ],
  },
  {
    group: 'Select Commission Range',
    fields: [
      {
        key: 'minCommission',
        label: 'Min',
        type: 'number',
        placeholder: 'Min Commission',
      },
      {
        key: 'maxCommission',
        label: 'Max',
        type: 'number',
        placeholder: 'Max Commission',
      },
    ],
  },
];

export default function ProfitSharing() {
  const dispatch = useDispatch();
  const {
    profitSharingData,
    profitSharingLoading,
    profitSharingError,
    profitSharingTotalPages,
  } = useSelector((state) => state.ibUser);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [expandedKey, setExpandedKey] = useState(null);

  const debounceRef = useRef(null);

  const loadData = useCallback(
    (page, searchVal, filters) => {
      const params = { page, limit: LIMIT };
      if (searchVal) params.search = searchVal;
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });
      dispatch(fetchIbProfitSharing(params));
    },
    [dispatch]
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
      setExpandedKey(null);
      loadData(1, val, activeFilters);
    }, 400);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    setExpandedKey(null);
    loadData(1, search, filters);
  };

  // Export all flattened rows to CSV
  const handleExport = () => {
    const exportRows = allRows.map((row) => ({
      Date: row.latestDate
        ? moment(row.latestDate).format('DD-MM-YYYY | hh:mm A')
        : '—',
      Name:
        `${row.user?.firstName ?? ''} ${row.user?.lastName ?? ''}`.trim() ||
        '—',
      Email: row.user?.email || '—',
      Profit: row.totalProfit ?? '—',
      Broker: row.broker?.name || '—',
      'Total Commission': row.totalCommission ?? '—',
    }));
    exportToCsv(
      exportRows,
      ['Date', 'Name', 'Email', 'Profit', 'Broker', 'Total Commission'],
      {},
      'profit-sharing'
    );
  };

  // Flatten: one row per user+broker combination
  const allRows = [];
  (profitSharingData || []).forEach((entry) => {
    const user = entry?.user;
    (entry?.brokers || []).forEach((brokerEntry, bIdx) => {
      const trades = brokerEntry?.trades || [];
      const latestDate = trades.reduce((latest, trade) => {
        if (!trade?.createdAt) return latest;
        return !latest || new Date(trade.createdAt) > new Date(latest)
          ? trade.createdAt
          : latest;
      }, null);
      allRows.push({
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
    <div>
      {/* Summary cards */}
      <ProfitSharingCard />

      {/* Search + Filter toolbar */}
      <DataTableHeader
        onSearch={handleSearch}
        onExport={handleExport}
        filterModal={
          <FilterModal
            onApply={handleApplyFilters}
            fieldGroups={PROFIT_SHARING_FILTER_GROUPS}
          />
        }
      />

      {/* Table */}
      {profitSharingLoading ? (
        <Loader fullScreen={true} variant="dots" size="large" color="success" />
      ) : profitSharingError ? (
        <p
          style={{
            color: '#ff4d4d',
            textAlign: 'center',
            padding: '24px',
            fontSize: 14,
          }}
        >
          Failed to load profit sharing data.
        </p>
      ) : (
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
                {allRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{
                        textAlign: 'center',
                        padding: '24px',
                        color: '#8e8e8e',
                      }}
                    >
                      {search || Object.keys(activeFilters).length > 0
                        ? 'No results match your search or filters.'
                        : 'No data available.'}
                    </td>
                  </tr>
                ) : (
                  allRows.map((row) => (
                    <React.Fragment key={row.key}>
                      <tr
                        className={
                          expandedKey === row.key ? styles.activeRow : ''
                        }
                      >
                        <td>
                          {row.latestDate
                            ? moment(row.latestDate).format(
                                'DD-MM-YYYY | hh:mm A'
                              )
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
                            onClick={() =>
                              setExpandedKey(
                                expandedKey === row.key ? null : row.key
                              )
                            }
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
                                transition={{
                                  duration: 0.3,
                                  ease: 'easeInOut',
                                }}
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
                                            {(trade?.profitLoss ?? 0) >= 0
                                              ? '+'
                                              : ''}
                                            ${trade?.profitLoss ?? '—'}
                                          </span>
                                        </div>
                                        <div>${trade?.commission ?? '—'}</div>
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
                  ))
                )}
              </tbody>
            </table>
          </div>

          {profitSharingTotalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={profitSharingTotalPages}
              onPageChange={(p) => {
                setCurrentPage(p);
                setExpandedKey(null);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
