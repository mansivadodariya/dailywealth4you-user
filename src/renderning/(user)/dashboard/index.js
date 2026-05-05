'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {
  fetchRecentTransactions,
  fetchDashboardCharts,
  fetchDashboardInvestment,
  fetchDashboardCommission,
  getDateRangeForPeriod,
} from '@/store/slice/dashboardSlice';
import { getUserFromCookie } from '@/service/cookies';
import DepositModal from '@/components/modal/depositModal';
import WithdrawModal from '@/components/modal/withdrawModal';
import moment from 'moment';
import styles from './dashboard.module.scss';
import AuthButton from '@/components/authButton';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

const PlusIcon = '/assets/icons/plus.svg';
const UpDirection = '/assets/icons/Updirection.svg';

function fmt(val) {
  if (val === null || val === undefined || val === '—') return '—';
  const n = Number(val);
  if (isNaN(n)) return String(val);
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  change,
  loading,
  showPeriod,
  onPeriodChange,
}) {
  const [period, setPeriod] = useState('24 Hours');
  const isPositive = (change ?? 0) >= 0;

  const handlePeriod = (e) => {
    setPeriod(e.target.value);
    if (onPeriodChange) onPeriodChange(e.target.value);
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.statCardTop}>
        <span className={styles.statLabel}>{label}</span>
        {showPeriod && (
          <select
            className={styles.periodSelect}
            value={period}
            onChange={handlePeriod}
          >
            <option>24 Hours</option>
            <option>7 Days</option>
            <option>30 Days</option>
          </select>
        )}
      </div>
      <div className={styles.statValueRow}>
        {loading ? (
          <span className={styles.skeletonStatValue} />
        ) : (
          <>
            <span className={styles.statValue}>${fmt(value ?? 0)}</span>
            {change !== undefined && change !== null && (
              <span
                className={`${styles.statChange} ${isPositive ? styles.positive : styles.negative}`}
              >
                ({isPositive ? '+' : ''}
                {fmt(change)}%)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Custom Tooltip for Line Chart ───────────────────────────────────────────
const CustomLineTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipDate}>{payload[0].payload.label}</p>
        <p className={styles.tooltipAmount}>${fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// ─── Custom Tooltip for Bar Chart ────────────────────────────────────────────
const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.customTooltip}>
        <p className={styles.tooltipAmount}>{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

// ─── Line Chart using Recharts ────────────────────────────────────────────────
function LineChart({ data = [] }) {
  if (data.length === 0) {
    return <div className={styles.chartEmpty}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={360}>
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
      >
        <XAxis
          dataKey="label"
          stroke="transparent"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis hide />
        <Tooltip
          content={<CustomLineTooltip />}
          cursor={false}
          position={{ y: 15 }}
          offset={20}
        />
        <Line
          type="linear"
          dataKey="value"
          stroke="#02df82"
          strokeWidth={2.5}
          dot={false}
          activeDot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

// ─── Bar Chart using Recharts ─────────────────────────────────────────────────
function BarChart({ data = [] }) {
  if (data.length === 0) {
    return <div className={styles.chartEmpty}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={210}>
      <RechartsBarChart
        data={data}
        margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
      >
        <XAxis
          dataKey="label"
          stroke="transparent"
          tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          dy={10}
        />
        <YAxis hide />
        <Tooltip
          content={<CustomBarTooltip />}
          cursor={false}
          position={{ y: 0 }}
        />
        <Bar
          dataKey="value"
          fill="rgba(255,255,255,0.08)"
          radius={[8, 8, 0, 0]}
          activeBar={{ fill: '#02df82' }}
          barSize={40}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    portfolioGrowth,
    lotsTraded,
    chartsLoading,
    investmentAmount,
    currentValue,
    grossPL,
    investmentLoading,
    totalProfitSharing,
    totalIbIncome,
    commissionLoading,
    recentTransactions,
    recentTransactionsLoading,
    totalCommission,
  } = useSelector((state) => state.dashboard);

  const { tradingAccounts, selectedAccountId: selectedAccId } = useSelector(
    (state) => state.account
  );
  const isIbUser = useSelector((state) => !!state.login.user?.isIbUser);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('Last 7 Days');
  const [donutLabel, setDonutLabel] = useState({ name: 'Investor', value: 50 });

  const userId = getUserFromCookie()?.id;

  const donutData = [
    { name: 'Investor', value: 50 },
    { name: 'IB', value: 10 },
    { name: 'Company', value: 40 },
  ];
  const DONUT_COLORS = ['#02DF82', '#2B3535', '#1A2B2B'];

  // Resolve active account from Redux-synced header selection
  const activeAccount =
    tradingAccounts?.find((acc) => acc?.id === selectedAccId) ||
    tradingAccounts?.[0] ||
    null;
  const mt5LoginId = activeAccount?.mt5LoginId || null;

  // Refresh recent transactions
  const refreshTransactions = () => {
    if (userId)
      dispatch(
        fetchRecentTransactions({ accountId: mt5LoginId, userId, limit: 6 })
      );
  };

  // Initial load — transactions only (commission needs mt5LoginId, handled below)
  useEffect(() => {
    refreshTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId]);

  // Re-fetch charts + investment + commission when account or period changes
  useEffect(() => {
    if (userId && mt5LoginId) {
      const { startDate, endDate } = getDateRangeForPeriod(chartPeriod);
      dispatch(
        fetchDashboardCharts({
          userId,
          accountId: mt5LoginId,
          startDate,
          endDate,
        })
      );
      dispatch(
        fetchDashboardInvestment({ accountId: mt5LoginId, startDate, endDate })
      );
      dispatch(fetchDashboardCommission(mt5LoginId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, userId, mt5LoginId, chartPeriod]);

  // Re-fetch recent transactions when account changes
  useEffect(() => {
    if (userId && mt5LoginId) {
      refreshTransactions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mt5LoginId]);

  const portfolioPoints = (portfolioGrowth || []).map((p) => ({
    label: p.date ? moment(p.date).format('D-M') : p.label || '',
    value: p.value ?? 0,
  }));

  const lotsPoints = (lotsTraded || []).map((p) => ({
    label: p.date ? moment(p.date).format('D-M') : p.label || '',
    value: p.value ?? 0,
  }));

  return (
    <div className={styles.dashboard}>
      {/* Stat Cards */}
      <div className={styles.statsRow}>
        <StatCard
          label="Investment"
          value={investmentAmount}
          loading={investmentLoading}
        />
        <StatCard
          label="Current Value"
          value={currentValue}
          loading={investmentLoading}
        />
        <StatCard
          label="Gross P&L"
          value={grossPL}
          loading={investmentLoading}
          showPeriod
          onPeriodChange={setChartPeriod}
        />
        <StatCard
          label="Net P&L"
          value={totalCommission}
          loading={investmentLoading}
          showPeriod
          onPeriodChange={setChartPeriod}
        />
      </div>

      {/* Main 2-column layout */}
      <div className={styles.mainRow}>
        {/* Left column */}
        <div className={styles.leftCol}>
          {/* Portfolio Growth */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Portfolio Growth</span>
              <select
                className={styles.periodSelect}
                value={chartPeriod}
                onChange={(e) => setChartPeriod(e.target.value)}
              >
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
              </select>
            </div>
            <div className={styles.chartWrap}>
              {chartsLoading ? (
                <div className={styles.lineChartSkeleton} />
              ) : (
                <LineChart data={portfolioPoints} />
              )}
            </div>
          </div>

          {/* Current Sharing Model + IB Revenue */}
          <div className={styles.sharingRow}>
            <div className={`${styles.card} ${styles.sharingCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Current Sharing Model</span>
              </div>
              <div className={styles.donutWrap}>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <defs>
                      <pattern
                        id="patternHatch"
                        width="6"
                        height="4"
                        patternUnits="userSpaceOnUse"
                        patternTransform="rotate(90)"
                      >
                        <rect width="6" height="4" fill="transparent" />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="4"
                          stroke="#848A8A"
                          strokeWidth="2"
                        />
                      </pattern>
                    </defs>
                    <Pie
                      data={donutData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      startAngle={270}
                      endAngle={-90}
                      cornerRadius={12}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {donutData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={
                            i === 2 ? 'url(#patternHatch)' : DONUT_COLORS[i]
                          }
                          stroke="none"
                          onClick={() => setDonutLabel(d)}
                          cursor="pointer"
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutCenter}>
                  <span className={styles.donutLabel}>{donutLabel.name}</span>
                  <span className={styles.donutPct}>{donutLabel.value}%</span>
                </div>
              </div>
            </div>
            {isIbUser && (
              <div className={styles.revenueCol}>
                <div className={`${styles.card} ${styles.revenueCard}`}>
                  <div className={styles.revenueLabel}>IB Income</div>
                  <div className={styles.revenueValue}>
                    {commissionLoading ? (
                      <span className={styles.skeletonStatValue} />
                    ) : (
                      `$${fmt(totalIbIncome ?? 0)}`
                    )}
                  </div>
                </div>
                <div className={`${styles.card} ${styles.revenueCard}`}>
                  <div className={styles.revenueLabel}>
                    Profit Sharing Revenue
                  </div>
                  <div className={styles.revenueValue}>
                    {commissionLoading ? (
                      <span className={styles.skeletonStatValue} />
                    ) : (
                      `$${fmt(totalProfitSharing ?? 0)}`
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Wallet Balance */}
          <div className={`${styles.card} ${styles.walletCard}`}>
            <span className={styles.walletLabel}>Wallet Balance</span>
            <span className={styles.walletValue}>
              {investmentLoading ? (
                <span
                  className={styles.skeletonStatValue}
                  style={{ width: 140, height: 36, display: 'inline-block' }}
                />
              ) : (
                `$${fmt(currentValue ?? 0)}`
              )}
            </span>
            <div className={styles.walletActions}>
              <AuthButton
                text="Deposit"
                icon={PlusIcon}
                onClick={() => setShowDeposit(true)}
              />
              <AuthButton
                outline
                icon={UpDirection}
                text="Withdraw"
                onClick={() => setShowWithdraw(true)}
              />
            </div>
          </div>

          {/* Lots Traded */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Lots Traded</span>
            </div>
            <div className={styles.chartWrap}>
              {chartsLoading ? (
                <div className={styles.barChartSkeleton} />
              ) : (
                <BarChart data={lotsPoints} />
              )}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.cardTitle}>Recent Transactions</span>
              <button
                className={styles.seeAllBtn}
                onClick={() => router.push('/transactions')}
              >
                See All &rsaquo;
              </button>
            </div>
            <div className={styles.txList}>
              {recentTransactionsLoading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className={styles.txItem}>
                    <div className={styles.txLeft}>
                      <span
                        className={`${styles.skeleton} ${styles.skeletonTxType}`}
                      />
                      <span
                        className={`${styles.skeleton} ${styles.skeletonTxDate}`}
                      />
                    </div>
                    <span
                      className={`${styles.skeleton} ${styles.skeletonTxAmount}`}
                    />
                  </div>
                ))
              ) : recentTransactions.length === 0 ? (
                <p className={styles.txEmpty}>No transactions yet.</p>
              ) : (
                recentTransactions.map((tx, idx) => (
                  <div key={tx?.id || idx} className={styles.txItem}>
                    <div className={styles.txLeft}>
                      <span className={styles.txType}>
                        {tx?.type
                          ? tx.type.charAt(0).toUpperCase() + tx.type.slice(1)
                          : 'Transaction'}
                      </span>
                      <span className={styles.txDate}>
                        {tx?.createdAt
                          ? moment(tx.createdAt).format('DD-MM-YYYY | hh:mm A')
                          : '—'}
                      </span>
                    </div>
                    <span className={styles.txAmount}>${fmt(tx?.amount)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals — refresh transactions on close */}
      {showDeposit && (
        <DepositModal
          activeAccount={activeAccount}
          onClose={() => {
            setShowDeposit(false);
            refreshTransactions();
          }}
        />
      )}
      {showWithdraw && (
        <WithdrawModal
          activeAccount={activeAccount}
          onClose={() => {
            setShowWithdraw(false);
            refreshTransactions();
          }}
        />
      )}
    </div>
  );
}
