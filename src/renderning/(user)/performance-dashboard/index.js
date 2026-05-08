'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformanceUsers } from '@/store/slice/performanceSlice';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';
import PerformanceModal from '@/components/modal/performanceModal';
import KycModal from '@/components/modal/KycModal';
import KycSubmitted from '@/components/modal/KycSubmitted';
import KycRejected from '@/components/modal/KycRejected';
import { exportToCsv } from '@/utils/exportToCsv';
import styles from './performanceDashboard.module.scss';
import Loader from '@/components/Loader';
import Pagination from '@/components/pagination';

const LIMIT = 10;

const PERFORMANCE_FILTER_GROUPS = [
  {
    group: 'Select Investment Range',
    fields: [
      {
        key: 'minInvestment',
        label: 'Min',
        type: 'number',
        placeholder: 'Min Investment',
      },
      {
        key: 'maxInvestment',
        label: 'Max',
        type: 'number',
        placeholder: 'Max Investment',
      },
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
    group: 'Select Profit % Range',
    fields: [
      {
        key: 'minProfitPercentage',
        label: 'Min',
        type: 'number',
        placeholder: 'Min %',
      },
      {
        key: 'maxProfitPercentage',
        label: 'Max',
        type: 'number',
        placeholder: 'Max %',
      },
    ],
  },
];

export default function PerformanceDashboard() {
  const dispatch = useDispatch();
  const {
    performanceUsers,
    performanceLoading,
    performanceError,
    performanceTotalPages,
  } = useSelector((state) => state.performance);

  const { kycStatus, kycStatusLoading, kycRejectionReason } = useSelector(
    (state) => state.account
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [showKycModal, setShowKycModal] = useState(false);

  const debounceRef = useRef(null);

  const loadData = useCallback(
    (page, searchVal, filters) => {
      const params = { page, limit: LIMIT };
      if (searchVal) params.search = searchVal;
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== '' && v !== null && v !== undefined) params[k] = v;
      });
      dispatch(fetchPerformanceUsers(params));
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
      loadData(1, val, activeFilters);
    }, 400);
  };

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    loadData(1, search, filters);
  };

  const handleExport = () => {
    const rows = (performanceUsers || []).map((user) => ({
      Name: user?.firstName || '—',
      Investment: user?.investment ?? '—',
      'Total Profit': user?.totalProfit ?? '—',
      'Profit %': user?.profitPercentage ? `${user.profitPercentage}%` : '—',
    }));
    exportToCsv(
      rows,
      ['Name', 'Investment', 'Total Profit', 'Profit %'],
      {},
      'performance-dashboard'
    );
  };

  if (performanceLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (performanceError) {
    return (
      <p
        style={{
          color: '#ff4d4d',
          textAlign: 'center',
          padding: '2rem',
          fontSize: 14,
        }}
      >
        Failed to load performance data.
      </p>
    );
  }

  // Show KYC modals based on status
  if (kycStatusLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (kycStatus === null && showKycModal) {
    return <KycModal onClose={() => setShowKycModal(false)} />;
  }

  if (kycStatus === 'pending') {
    return <KycSubmitted />;
  }

  if (kycStatus === 'rejected' && showKycModal) {
    return <KycModal />;
  }

  // Show Complete KYC button if KYC is not approved
  const showCompleteKycButton = kycStatus !== 'approved';

  return (
    <>
      {showCompleteKycButton && (
        <div className={styles.kycBanner}>
          <div className={styles.kycBannerContent}>
            <div className={styles.kycBannerText}>
              <h3>Complete Your KYC Verification</h3>
              <p>
                {kycStatus === 'rejected'
                  ? `Your KYC was rejected: ${kycRejectionReason || 'Please resubmit your documents'}. Click below to submit again.`
                  : 'Please complete your KYC verification to access all features of the platform.'}
              </p>
            </div>
            <button
              className={styles.completeKycBtn}
              onClick={() => setShowKycModal(true)}
            >
              {kycStatus === 'rejected' ? 'Resubmit KYC' : 'Complete KYC'}
            </button>
          </div>
        </div>
      )}

      <DataTableHeader
        onSearch={handleSearch}
        onExport={handleExport}
        filterModal={
          <FilterModal
            onApply={handleApplyFilters}
            fieldGroups={PERFORMANCE_FILTER_GROUPS}
          />
        }
      />

      <h1 className={styles.heading}>Top 10 User Performance</h1>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Account Details</th>
              <th>Broker Name</th>
              <th>Balance</th>
              <th>Investment</th>
              <th>Total Profit</th>
              <th>Profit %</th>
              <th className={styles.actionCol}>Action</th>
            </tr>
          </thead>
          <tbody>
            {!performanceUsers || performanceUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.emptyRow}>
                  {search || Object.keys(activeFilters).length > 0
                    ? 'No performance data matches your search.'
                    : 'No performance data found.'}
                </td>
              </tr>
            ) : (
              performanceUsers.map((user, i) => {
                const rank = user?.rank;
                const name = user?.user?.firstName || '—';
                const investment = user?.investment ?? '—';
                const totalProfit = user?.totalProfit ?? '—';
                const profitPercentage = user?.profitPercentage ?? '—';
                const accountDetails = user?.mt5LoginId;
                const balance = user?.currentBalance;
                const lastName = user?.user?.lastName;
                const email = user?.user?.email;
                const brokername = user?.broker?.name;
                const logo = user?.broker?.logo;

                return (
                  <tr key={user?.id || user?._id || i}>
                    <td>{rank}</td>
                    <td>
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>
                          {name} {lastName}
                        </span>
                        <span className={styles.userEmail}>{email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.accountBadge}>
                        {accountDetails}
                      </span>
                    </td>
                    <td>
                      <div className={styles.brokerInfo}>
                        {logo && (
                          <img
                            className={styles.brokerLogo}
                            src={logo}
                            alt={brokername || 'broker-logo'}
                          />
                        )}
                        <span className={styles.brokerName}>{brokername}</span>
                      </div>
                    </td>
                    <td>
                      $
                      {balance !== '—' ? Number(balance).toLocaleString() : '—'}
                    </td>
                    <td>
                      $
                      {investment !== '—'
                        ? Number(investment).toLocaleString()
                        : '—'}
                    </td>
                    <td>
                      $
                      {totalProfit !== '—'
                        ? Number(totalProfit).toLocaleString()
                        : '—'}
                    </td>
                    <td>
                      {profitPercentage !== '—' ? (
                        <span className={styles.profitBadge}>
                          {Number(profitPercentage).toFixed(2)}%
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className={styles.actionCol}>
                      {/* <button
                        className={styles.viewBtn}
                        onClick={() => setSelectedUser(user)}
                      >
                        <img
                          src="/assets/icons/eye.svg"
                          alt="View"
                          width={18}
                          height={18}
                        />
                      </button> */}
                      <button
                        className={styles.viewBtn}
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {performanceTotalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={performanceTotalPages}
          onPageChange={(p) => setCurrentPage(p)}
        />
      )}

      {selectedUser && (
        <PerformanceModal
          data={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}

      {kycStatus === 'rejected' && !showKycModal && (
        <KycRejected
          rejectionMessage={kycRejectionReason}
          onSubmitAgain={() => setShowKycModal(true)}
        />
      )}
    </>
  );
}
