'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import DataTableHeader from '@/components/common/DataTableHeader';
import Loader from '@/components/Loader';
import { fetchPoolTradesHistory } from '@/store/slice/performanceSlice';
import { exportToCsv } from '@/utils/exportToCsv';
import styles from './tradeHistory.module.scss';
import tableStyles from '@/scss/dataTable.module.scss';

export default function TradeHistory() {
  const dispatch = useDispatch();
  const {
    poolTradesHistory,
    poolTradesHistoryLoading,
    poolTradesHistoryError,
  } = useSelector((state) => state.performance);

  const [search, setSearch] = useState('');
  const [selectedPool, setSelectedPool] = useState('');

  useEffect(() => {
    dispatch(fetchPoolTradesHistory());
  }, [dispatch]);

  const poolOptions = useMemo(() => {
    const pools = new Map();

    (poolTradesHistory || []).forEach((trade) => {
      const pool = trade?.socialPool || {};
      const value = pool?.id || trade?.socialPoolId || pool?.title;

      if (value && !pools.has(value)) {
        pools.set(value, pool?.title || 'Untitled Pool');
      }
    });

    return Array.from(pools, ([value, label]) => ({ value, label }));
  }, [poolTradesHistory]);

  const filteredTrades = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return (poolTradesHistory || []).filter((trade) => {
      const pool = trade?.socialPool || {};
      const poolValue = pool?.id || trade?.socialPoolId || pool?.title;
      const matchesPool = !selectedPool || String(poolValue) === selectedPool;

      if (!matchesPool) return false;
      if (!searchValue) return true;

      return [
        trade?.tradingDate,
        trade?.profitLoss,
        pool?.title,
        pool?.profitPercentage,
        pool?.minDeposit,
        trade?.isActive ? 'active' : 'inactive',
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchValue));
    });
  }, [poolTradesHistory, search, selectedPool]);

  const handleExport = () => {
    const rows = filteredTrades.map((trade) => {
      const pool = trade?.socialPool || {};

      return {
        'Trading Date': trade?.tradingDate
          ? moment(trade.tradingDate).format('DD MMM YYYY')
          : '-',
        'Profit/Loss': trade?.profitLoss ?? '-',
        Title: pool?.title || '-',
        'Profit %': pool?.profitPercentage ?? '-',
        'Min Deposit': pool?.minDeposit ?? '-',
        Status: trade?.isActive ? 'Active' : 'Inactive',
      };
    });

    exportToCsv(
      rows,
      [
        'Trading Date',
        'Profit/Loss',
        'Title',
        'Profit %',
        'Min Deposit',
        'Status',
      ],
      {},
      'pool-trades-history'
    );
  };

  if (poolTradesHistoryLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (poolTradesHistoryError) {
    return (
      <p className={styles.errorText}>Failed to load pool trades history.</p>
    );
  }

  return (
    <>
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <p>Investment</p>
          <h3>
            $0
            {/* {(withdrawals || [])
                  .filter((r) => (r?.status || '').toLowerCase() === 'pending')
                  .reduce((sum, r) => sum + (Number(r?.amount) || 0), 0)
                  .toLocaleString() || '0'} */}
          </h3>
        </div>
        <div className={styles.summaryCard}>
          <p>Current Value </p>
          <h3>
            $0
            {/* {(withdrawals || [])
                  .reduce((sum, r) => sum + (Number(r?.amount) || 0), 0)
                  .toLocaleString() || '0'} */}
          </h3>
        </div>
        <div className={styles.summaryCard}>
          <p>Total Profit %</p>
          <h3>
            $0
            {/* {(withdrawals || [])
                  .reduce((sum, r) => sum + (Number(r?.amount) || 0), 0)
                  .toLocaleString() || '0'} */}
          </h3>
        </div>
      </div>
      <DataTableHeader onSearch={setSearch} onExport={handleExport} />

      {/* <h1 className={styles.heading}>Pool Trades History</h1> */}

      <div className={styles.filtersRow}>
        <label className={styles.filterLabel} htmlFor="poolNameFilter">
          Filter By Pool Name :
        </label>
        <select
          id="poolNameFilter"
          className={styles.poolSelect}
          value={selectedPool}
          onChange={(e) => setSelectedPool(e.target.value)}
        >
          <option value="">All Pools</option>
          {poolOptions.map((pool) => (
            <option key={pool.value} value={pool.value}>
              {pool.label}
            </option>
          ))}
        </select>
      </div>

      <div className={tableStyles.tableContainer}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Trading Date</th>
              <th>Pool Name</th>
              <th>Investment</th>
              <th> Profit %</th>
              <th>Profit/Loss</th>
              {/* <th>Profit %</th> */}
              <th>Min Deposit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan="7" className={tableStyles.emptyRow}>
                  {search || selectedPool
                    ? 'No pool trade history matches your filters.'
                    : 'No pool trade history found.'}
                </td>
              </tr>
            ) : (
              filteredTrades.map((trade) => {
                const pool = trade?.socialPool || {};

                return (
                  <tr key={trade?.id}>
                    <td>
                      {trade?.tradingDate
                        ? moment(trade.tradingDate).format(
                            'DD-MM-YYYY | hh:mm A'
                          )
                        : '-'}
                    </td>
                    <td>{pool?.title || '-'}</td>
                    <td>{pool?.investmentValue || '-'}</td>
                    <td>{pool?.totalProfitPercentage || '-'}</td>
                    {/* <td>{trade?.profitLoss ?? '-'}</td> */}
                    <td>
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
                        {(trade?.profitLoss ?? 0) >= 0 ? '+' : ''}$
                        {trade?.profitLoss ?? '—'}
                      </span>
                    </td>

                    {/* <td>
                      {pool?.profitPercentage
                        ? `${Number(pool.profitPercentage).toFixed(0)}%`
                        : '-'}
                    </td> */}
                    <td>
                      {pool?.minDeposit
                        ? `$${Number(pool.minDeposit).toLocaleString()}`
                        : '-'}
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          trade?.isActive ? styles.active : styles.inactive
                        }`}
                      >
                        {trade?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
