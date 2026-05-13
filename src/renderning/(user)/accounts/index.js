'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './accounts.module.scss';
import EditIcon from '@/icons/editIcon';
import DeleteIcon from '@/icons/deleteIcon';
import moment from 'moment';
import { getUserFromCookie } from '@/service/cookies';
import UseExisting from '@/components/modal/useExisting';
import CloseWalletRequestModal from '@/components/modal/closeWalletRequestModal';
import {
  createAccountCloseRequest,
  fetchAccountCloseRequests,
  fetchTradingAccounts,
  fetchAccountHistory,
} from '@/store/slice/accountSlice';
import Loader from '@/components/Loader';
import Pagination from '@/components/pagination';

export default function Accounts() {
  const dispatch = useDispatch();
  const {
    tradingAccounts,
    tradingAccountsLoading,
    tradingAccountsError,
    accountHistory,
    accountHistoryLoading,
    accountCloseRequests,
    createAccountCloseLoading,
  } = useSelector((state) => state.account);

  // null = card view, object = history view for that account
  const [activeAccount, setActiveAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [networkOpen, setNetworkOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const user = getUserFromCookie();
  const userId = user?.id || user?._id;

  // Fetch all accounts once (no pagination on API)
  useEffect(() => {
    if (userId) {
      dispatch(fetchTradingAccounts({ userId }));
      dispatch(fetchAccountCloseRequests());
    }
  }, [dispatch, userId]);

  // Notify header of selected account for breadcrumb
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__activeAccountId = activeAccount?.accountId || null;
      window.dispatchEvent(
        new CustomEvent('accountSelected', {
          detail: { accountId: activeAccount?.accountId || null },
        })
      );
    }
  }, [activeAccount]);

  const handleCardClick = (item) => {
    setActiveAccount(item);
    const brokerId = item?.broker?.id || item?.brokerId;
    dispatch(fetchAccountHistory({ userId, brokerId }));
  };

  const handleBack = () => {
    setActiveAccount(null);
  };

  const handleDeleteClick = (e, account) => {
    e.stopPropagation();
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleteSubmitting || createAccountCloseLoading) return;
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  const handleAccountCloseSubmit = async ({ address, network }) => {
    if (!accountToDelete) return;

    setDeleteSubmitting(true);
    try {
      const broker =
        typeof accountToDelete?.broker === 'object'
          ? accountToDelete?.broker?.name
          : accountToDelete?.broker || accountToDelete?.brokerName || '';
      const amount = String(
        accountToDelete?.currentBalance ||
          accountToDelete?.sizeOfAccount ||
          accountToDelete?.currentBalance ||
          0
      );

      await dispatch(
        createAccountCloseRequest({
          userId,
          tradingAccountId: accountToDelete.id,
          socialPoolId: '',
          broker,
          mt5Account: String(accountToDelete?.mt5LoginId || ''),
          amount,
          address,
          proofUrl: '',
          network,
          status: 'pending',
          type: 'trading_account',
        })
      ).unwrap();
      setShowDeleteModal(false);
      setAccountToDelete(null);
      dispatch(fetchAccountCloseRequests());
    } catch {
      // Error toast is handled by the thunk.
    } finally {
      setDeleteSubmitting(false);
    }
  };

  const handlePageChange = (newPage) => {
    const totalPages = Math.ceil((tradingAccounts?.length || 0) / itemsPerPage);
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top of accounts grid
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (tradingAccountsLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (tradingAccountsError) {
    return (
      <div className={styles.accountsWrapper}>
        <p style={{ color: '#ff4d4d', textAlign: 'center', padding: '2rem' }}>
          Error: {tradingAccountsError}
        </p>
      </div>
    );
  }

  // Client-side pagination
  const allAccounts = tradingAccounts || [];
  const totalPages = Math.ceil(allAccounts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const accountsData = allAccounts.slice(startIndex, endIndex);
  const closeRequestsByAccountId = new Map(
    (accountCloseRequests || [])
      .filter((request) => request?.type === 'trading_account')
      .map((request) => [
        String(request?.tradingAccountId || request?.tradingAccount?.id || ''),
        request,
      ])
  );

  const getAccountCloseRequest = (accountId) => {
    return closeRequestsByAccountId.get(String(accountId));
  };

  const getAccountCloseBadge = (request) => {
    const status = String(request?.status || '').toLowerCase();

    if (status === 'approved' || status === 'approve') {
      return {
        text: 'Disconnected',
        className: styles.disconnectedBadge,
      };
    }

    if (status === 'pending') {
      return {
        text: 'Close Pending',
        className: styles.pendingCloseBadge,
      };
    }

    return null;
  };

  

  // ── History View ──────────────────────────────────────────────────────────
  if (activeAccount) {
    return (
      <>
        {/* Back button */}
        <button className={styles.backBtn} onClick={handleBack}>
          <span className={styles.backArrow}>←</span>
          Back to Accounts
        </button>

        <div className={styles.historyWrapper}>
          {accountHistoryLoading ? (
            <Loader
              fullScreen={true}
              variant="dots"
              size="large"
              color="success"
            />
          ) : (
            <div className={styles.historyTableContainer}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Order ID</th>
                    <th>Symbol</th>
                    <th>Lots</th>
                    <th>P&L</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(!accountHistory || accountHistory.length === 0) && (
                    <tr>
                      <td colSpan="6" className={styles.emptyRow}>
                        No history found for this account.
                      </td>
                    </tr>
                  )}
                  {accountHistory?.map((trade) => (
                    <tr key={trade?.id}>
                      <td>
                        {trade?.createdAt
                          ? moment(trade.tradingDate).format(
                              'DD-MM-YYYY | hh:mm A'
                            )
                          : '—'}
                      </td>
                      <td>{trade?.orderId || '—'}</td>
                      <td>
                        <span className={styles.symbolBadge}>
                          {trade?.item || '—'}
                        </span>
                      </td>
                      <td>{trade?.volume ?? trade?.lot ?? '—'}</td>
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
                      <td>${trade?.amount ?? trade?.commission ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showEditModal && activeAccount && (
          <UseExisting
            isEdit
            account={activeAccount}
            onClose={() => {
              setShowEditModal(false);
              dispatch(fetchTradingAccounts(userId));
            }}
          />
        )}
      </>
    );
  }

  // ── Card View ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className={styles.accountsWrapper}>
        <div className={styles.accountsGrid}>
          {accountsData.map((item) => {
            const closeRequest = getAccountCloseRequest(item?.id);
            const closeBadge = getAccountCloseBadge(closeRequest);
const isActionDisabled =
  closeRequest &&
  ['pending', 'approved', 'approve'].includes(
    String(closeRequest?.status || '').toLowerCase()
  );
            return (
              <div
                key={item?.id}
                className={styles.accountCard}
                onClick={() => handleCardClick(item)}
              >
                <div className={styles.headerAlignment}>
                  <div className={styles.cardHeader}>
                 <div className={styles.accountTitle}>
  <p>Account No: {item?.mt5LoginId}</p>

  {closeBadge && (
    <span className={closeBadge.className}>
      {closeBadge.text}
    </span>
  )}
</div>
                    <div className={styles.buttonContainer}>
<div
  className={`${styles.editBtn} ${
    isActionDisabled ? styles.disabledAction : ''
  }`}
  onClick={(e) => {
    e.stopPropagation();

    if (isActionDisabled) return;

    setSelectedAccount(item);
    setShowEditModal(true);
  }}
>
  <EditIcon />
</div>
             <div
  className={`${styles.deleteBtn} ${
    isActionDisabled ? styles.disabledAction : ''
  }`}
  onClick={(e) => {
    if (isActionDisabled) return;
    handleDeleteClick(e, item);
  }}
>
  <DeleteIcon />
</div>
                    </div>
                  </div>
                  <h3>
                    ${(item?.sizeOfAccount || 0).toLocaleString()}
                    <span className={styles.profitText}>
                      (+ ${(item?.currentDeposit || 0).toLocaleString()})
                    </span>
                  </h3>
                </div>

                <div className={styles.cardDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Broker:</span>
                    <div className={styles.dots} />
                    <span className={styles.value}>
                      {typeof item?.broker === 'object'
                        ? item?.broker?.name
                        : item?.broker || '-'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>Date Added:</span>
                    <div className={styles.dots} />
                    <span className={styles.value}>
                      {item?.createdAt
                        ? moment(item.createdAt).format('DD-MM-YYYY | hh:mm A')
                        : '-'}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.label}>P&L:</span>
                    <div className={styles.dots} />
                    <span
                      className={styles.value}
                      style={{
                        color: (item?.pnl || 0) >= 0 ? '#02DF82' : '#FF4D4D',
                      }}
                    >
                      {item?.pnl || '0%'}
                    </span>
                  </div>
                </div>

                {/* Arrow hint */}
                <div className={styles.cardArrow}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8H13M13 8L9 4M13 8L9 12"
                      stroke="#02df82"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>View History</span>
                </div>
              </div>
            );
          })}
        </div>

        {accountsData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            <p>No trading accounts found</p>
          </div>
        )}

        {/* Pagination - only show if there are multiple pages */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {showEditModal && selectedAccount && (
        <UseExisting
          isEdit
          account={selectedAccount}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
            dispatch(fetchTradingAccounts({ userId }));
          }}
        />
      )}

      <CloseWalletRequestModal
        open={showDeleteModal && Boolean(accountToDelete)}
        onClose={handleCloseDeleteModal}
        title="Close Account"
        description="Are you sure you want to close this account? Once you submit the close request, it will be reviewed by the admin. After admin approval, your invested amount and profit will be credited back to your wallet."
        onSubmit={handleAccountCloseSubmit}
        isSubmitting={deleteSubmitting || createAccountCloseLoading}
      />
    </>
  );
}
