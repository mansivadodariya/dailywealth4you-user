'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchIbIncome, fetchIbProfitSharing } from '@/store/slice/ibUserSlice';
import {
  fetchRecentTransactions,
  fetchDashboardCharts,
  getDateRangeForPeriod,
} from '@/store/slice/dashboardSlice';
import { getUserFromCookie } from '@/service/cookies';
import DepositModal from '@/components/modal/depositModal';
import WithdrawModal from '@/components/modal/withdrawModal';
import moment from 'moment';
import styles from './dashboard.module.scss';
import AuthButton from '@/components/authButton';


// ─── Helpers ────────────────────────────────────────────────────────────────

const PlusIcon = '/assets/icons/plus.svg';
const UpDirection = '/assets/icons/Updirection.svg';

function fmt(val) {
  if (val === null || val === undefined || val === '—') return '—';
  const n = Number(val);
  if (isNaN(n)) return val;
  return n.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

function pct(val) {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  if (isNaN(n)) return null;
  return n;
}

// ─── Stat Card ───────────────────────────────────────────────────────────────

function StatCard({ label, value, change, loading, showPeriod }) {
  const [period, setPeriod] = useState('24 Hours');
  const isPositive = change >= 0;

  return (
    <div className={styles.statCard}>
      <div className={styles.statCardTop}>
        <span className={styles.statLabel}>{label}</span>
        {showPeriod && (
          <select
            className={styles.periodSelect}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>24 Hours</option>
            <option>7 Days</option>
            <option>30 Days</option>
          </select>
        )}
      </div>
      <div className={styles.statValueRow}>
        <span className={styles.statValue}>
          {loading ? <span className={styles.skeleton} /> : `$${fmt(value)}`}
        </span>
        {change !== undefined && change !== null && (
          <span
            className={`${styles.statChange} ${isPositive ? styles.positive : styles.negative}`}
          >
            ({isPositive ? '+' : ''}
            {fmt(change)}%)
          </span>
        )}
      </div>
    </div>
  );
}

// ─── SVG Line Chart ──────────────────────────────────────────────────────────

function LineChart({ data = [], loading }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  const W = 600;
  const H = 220;
  const PAD = { top: 20, right: 20, bottom: 36, left: 10 };

  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const points = data.length > 0 ? data : [];
  const values = points.map((p) => Number(p.value) || 0);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const toX = (i) => PAD.left + (i / Math.max(points.length - 1, 1)) * chartW;
  const toY = (v) => PAD.top + chartH - ((v - minV) / range) * chartH;

  const linePath = points
    .map(
      (p, i) => `${i === 0 ? 'M' : 'L'}${toX(i)},${toY(Number(p.value) || 0)}`
    )
    .join(' ');

  const areaPath =
    points.length > 0
      ? `${linePath} L${toX(points.length - 1)},${PAD.top + chartH} L${toX(0)},${PAD.top + chartH} Z`
      : '';

  const handleMouseMove = (e) => {
    if (!svgRef.current || points.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((mx - PAD.left) / chartW) * (points.length - 1));
    const clamped = Math.max(0, Math.min(points.length - 1, idx));
    setTooltip({
      idx: clamped,
      x: toX(clamped),
      y: toY(Number(points[clamped]?.value) || 0),
    });
  };

  if (loading) {
    return <div className={styles.chartSkeleton} />;
  }

  if (points.length === 0) {
    return <div className={styles.chartEmpty}>No data available</div>;
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      className={styles.lineSvg}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#02df82" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#02df82" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <path d={areaPath} fill="url(#lineGrad)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#02df82"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* X-axis labels */}
      {points.map((p, i) => {
        if (i % Math.ceil(points.length / 8) !== 0 && i !== points.length - 1)
          return null;
        return (
          <text
            key={i}
            x={toX(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.35)"
          >
            {p.label}
          </text>
        );
      })}

      {/* Tooltip */}
      {tooltip && (
        <>
          <line
            x1={tooltip.x}
            y1={PAD.top}
            x2={tooltip.x}
            y2={PAD.top + chartH}
            stroke="rgba(255,255,255,0.15)"
            strokeDasharray="4 3"
          />
          <circle cx={tooltip.x} cy={tooltip.y} r="5" fill="#02df82" />
          <rect
            x={tooltip.x - 44}
            y={tooltip.y - 42}
            width="88"
            height="36"
            rx="6"
            fill="#0d1f1f"
            stroke="rgba(255,255,255,0.12)"
          />
          <text
            x={tooltip.x}
            y={tooltip.y - 26}
            textAnchor="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.6)"
          >
            {points[tooltip.idx]?.label}
          </text>
          <text
            x={tooltip.x}
            y={tooltip.y - 13}
            textAnchor="middle"
            fontSize="11"
            fill="#fafafa"
            fontWeight="600"
          >
            ${fmt(points[tooltip.idx]?.value)}
          </text>
        </>
      )}
    </svg>
  );
}

// ─── SVG Bar Chart ───────────────────────────────────────────────────────────

function BarChart({ data = [], loading }) {
  const [hovered, setHovered] = useState(null);

  const W = 460;
  const H = 180;
  const PAD = { top: 30, right: 10, bottom: 36, left: 10 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const values = data.map((d) => Number(d.value) || 0);
  const maxV = Math.max(...values, 1);
  const barW = Math.max(8, (chartW / Math.max(data.length, 1)) * 0.55);
  const gap = chartW / Math.max(data.length, 1);

  if (loading) return <div className={styles.chartSkeleton} />;
  if (data.length === 0)
    return <div className={styles.chartEmpty}>No data available</div>;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={styles.barSvg}
      preserveAspectRatio="none"
    >
      {data.map((d, i) => {
        const bh = Math.max(4, (Number(d.value) / maxV) * chartH);
        const bx = PAD.left + i * gap + gap / 2 - barW / 2;
        const by = PAD.top + chartH - bh;
        const isHov = hovered === i;
        return (
          <g key={i}>
            <rect
              x={bx}
              y={by}
              width={barW}
              height={bh}
              rx="4"
              fill={isHov ? '#02df82' : 'rgba(255,255,255,0.12)'}
              style={{ cursor: 'pointer', transition: 'fill 0.2s' }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
            {isHov && (
              <>
                <rect
                  x={bx + barW / 2 - 26}
                  y={by - 28}
                  width="52"
                  height="22"
                  rx="5"
                  fill="#0d1f1f"
                  stroke="rgba(255,255,255,0.12)"
                />
                <text
                  x={bx + barW / 2}
                  y={by - 13}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#fafafa"
                  fontWeight="600"
                >
                  {fmt(d.value)}
                </text>
              </>
            )}
            <text
              x={bx + barW / 2}
              y={H - 6}
              textAnchor="middle"
              fontSize="8"
              fill="rgba(255,255,255,0.35)"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ userPct = 50 }) {
  const R = 54;
  const cx = 70;
  const cy = 70;
  const circ = 2 * Math.PI * R;
  const userDash = (userPct / 100) * circ;
  const restDash = circ - userDash;

  return (
    <svg viewBox="0 0 140 140" className={styles.donutSvg}>
      {/* Track */}
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="14"
      />
      {/* User portion — green */}
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="#02df82"
        strokeWidth="14"
        strokeDasharray={`${userDash} ${restDash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      {/* Rest — dashed grey */}
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="10"
        strokeDasharray="3 5"
        strokeDashoffset={-userDash}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fontSize="10"
        fill="rgba(255,255,255,0.5)"
      >
        You
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        fontSize="16"
        fill="#fafafa"
        fontWeight="700"
      >
        {userPct}%
      </text>
    </svg>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const dispatch = useDispatch();
  const router = useRouter();


  const {
    portfolioGrowth,
    lotsTraded,
    chartsLoading,
    recentTransactions,
    recentTransactionsLoading,
  } = useSelector((state) => state.dashboard);
    const {
   
    tradingAccounts,

  } = useSelector((state) => state.account);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [chartPeriod, setChartPeriod] = useState('Last 7 Days');

  const userId = getUserFromCookie()?.id;
    // Track the active account for dashboard charts
    const [activeAccount, setActiveAccount] = useState(tradingAccounts?.[0] || null);

    // Listen for account change events from header
    useEffect(() => {
      const handler = (e) => {
        if (e.detail?.account) setActiveAccount(e.detail.account);
      };
      window.addEventListener('dashboardAccountChanged', handler);
      return () => window.removeEventListener('dashboardAccountChanged', handler);
    }, []);

    // Update local state if tradingAccounts change (initial load or account list update)
    useEffect(() => {
      if (!activeAccount && tradingAccounts?.length > 0) {
        setActiveAccount(tradingAccounts[0]);
      }
    }, [tradingAccounts]);

  // Fetch dashboard charts and transactions when account or period changes
  useEffect(() => {
    if (userId && activeAccount) {
      const { startDate, endDate } = getDateRangeForPeriod(chartPeriod);
      dispatch(
        fetchDashboardCharts({
          userId,
          startDate,
          endDate,
          accountId: activeAccount?.mt5LoginId,
        })
      );
      dispatch(fetchRecentTransactions({     accountId: activeAccount.mt5LoginId, userId, limit: 6 }));
    }
  }, [dispatch, userId, activeAccount, chartPeriod]);

  // ── Chart data from dashboardSlice (real API) ─────────────────────────────
  const portfolioPoints = (portfolioGrowth || []).map((p) => ({
    label: p.date ? moment(p.date).format('D-M') : p.label || '',
    value: p.value ?? 0,
  }));

  const lotsPoints = (lotsTraded || []).map((p) => ({
    label: p.date ? moment(p.date).format('D-M') : p.label || '',
    value: p.value ?? 0,
  }));

  // ── Recent transactions from dashboardSlice ───────────────────────────────


  return (
    <div className={styles.dashboard}>
      {/* ── Row 1: Stat Cards ─────────────────────────────────────────────── */}
      <div className={styles.statsRow}>
        <StatCard label="Investment" 
        // value={investment}
         loading={false} />
        <StatCard
         label="Current Value"
        
        // value={currentValue}
         loading={false} />
        <StatCard
          label="Gross P&L"
          // value={grossPnl}
          // change={grossChange}
          loading={false}
          showPeriod
        />
        <StatCard
          label="Net P&L"
          // value={netPnl}
          // change={netChange}
          loading={false}
          showPeriod
        />
      </div>

      {/* ── Row 2: Charts + Right Panel ───────────────────────────────────── */}
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
              <LineChart data={portfolioPoints} loading={chartsLoading} />
            </div>
          </div>

          {/* Current Sharing Model + IB Revenue boxes */}
          <div className={styles.sharingRow}>
            {/* Left: donut */}
            <div className={`${styles.card} ${styles.sharingCard}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Current Sharing Model</span>
              </div>
              <div className={styles.sharingBody}>
                <DonutChart  />
              </div>
            </div>

            {/* Right: two stacked revenue boxes */}
            <div className={styles.revenueCol}>
              {/* IB Income */}
              <div className={`${styles.card} ${styles.revenueCard}`}>
                <div className={styles.revenueLabel}>IB Income</div>
                <div className={styles.revenueValue}>
                  {/* {ibIncomeLoading ? (
                    <span className={styles.skeleton} />
                  ) : ibIncomeTotal !== null ? (
                    `$${fmt(ibIncomeTotal)}`
                  ) : (
                    '0'
                  )} */}
                 {0} 
                </div>
              </div>

              {/* Profit Sharing Revenue */}
              <div className={`${styles.card} ${styles.revenueCard}`}>
                <div className={styles.revenueLabel}>
                  Profit Sharing Revenue
                </div>
                <div className={styles.revenueValue}>
                  {/* {profitSharingLoading ? (
                    <span className={styles.skeleton} />
                  ) : profitSharingRevenue !== null ? (
                    `$${fmt(profitSharingRevenue)}`
                  ) : (
                    '0'
                  )} */}
                  {0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Wallet Balance */}
          <div className={`${styles.card} ${styles.walletCard}`}>
            <span className={styles.walletLabel}>Wallet Balance</span>
            <span className={styles.walletValue}>
              {chartsLoading ? (
                <span
                  className={styles.skeleton}
                  style={{ width: 120, height: 32, display: 'inline-block' }}
                />
              ) : (
                // `$${fmt(walletBalance)}`
                0
              )}
            </span>
            <div className={styles.walletActions}>
              <AuthButton
                text="Deposite"
                icon={PlusIcon}
                className={styles.depositBtn}
                onClick={() => setShowDeposit(true)}
              />

              <AuthButton
                outline
                icon={UpDirection}
                text="Withdraw"
                className={styles.withdrawBtn}
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
              <BarChart data={lotsPoints} loading={chartsLoading} />
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
                See All ›
              </button>
            </div>
            <div className={styles.txList}>
              {recentTransactionsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className={styles.txItem}>
                    <div className={styles.txLeft}>
                      <span
                        className={styles.skeleton}
                        style={{ width: 80, height: 13, display: 'block' }}
                      />
                      <span
                        className={styles.skeleton}
                        style={{
                          width: 120,
                          height: 11,
                          display: 'block',
                          marginTop: 4,
                        }}
                      />
                    </div>
                    <span
                      className={styles.skeleton}
                      style={{ width: 60, height: 14, display: 'block' }}
                    />
                  </div>
                ))
              ) : recentTransactions.length === 0 ? (
                <p className={styles.txEmpty}>No transactions yet.</p>
              ) : (
                recentTransactions.map((tx, i) => (
                  <div key={tx?.id} className={styles.txItem}>
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

      {/* Modals */}
      {showDeposit && (
        <DepositModal
          activeAccount={activeAccount}
          onClose={() => setShowDeposit(false)}
        />
      )}
      {showWithdraw && (
        <WithdrawModal
          activeAccount={activeAccount}
          onClose={() => setShowWithdraw(false)}
        />
      )}
    </div>
  );
}
