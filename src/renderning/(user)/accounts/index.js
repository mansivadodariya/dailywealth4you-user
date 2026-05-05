'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './accounts.module.scss';
import EditIcon from '@/icons/editIcon';
import DeleteIcon from '@/icons/deleteIcon';
import moment from 'moment';
import { getUserFromCookie } from '@/service/cookies';
import UseExisting from '@/components/modal/useExisting';
import {
  deleteTradingAccount,
  fetchTradingAccounts,
  fetchAccountHistory,
} from '@/store/slice/accountSlice';
import AuthButton from '@/components/authButton';
import Loader from '@/components/Loader';

export default function Accounts() {
  const dispatch = useDispatch();
  const {
    tradingAccounts,
    tradingAccountsLoading,
    tradingAccountsError,
    accountHistory,
    accountHistoryLoading,
  } = useSelector((state) => state.account);

  // null = card view, object = history view for that account
  const [activeAccount, setActiveAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);

  const user = getUserFromCookie();
  const userId = user?.id;

  useEffect(() => {
    dispatch(fetchTradingAccounts(userId));
  }, [dispatch]);

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

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      dispatch(deleteTradingAccount(accountToDelete.id));
      setShowDeleteModal(false);
      setAccountToDelete(null);
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

  const accountsData = tradingAccounts?.length > 0 ? tradingAccounts : [];

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
          {accountsData.map((item) => (
            <div
              key={item?.id}
              className={styles.accountCard}
              onClick={() => handleCardClick(item)}
            >
              <div className={styles.headerAlignment}>
                <div className={styles.cardHeader}>
                  <p>Account No: {item?.mt5LoginId}</p>
                  <div className={styles.buttonContainer}>
                    <div
                      className={styles.editBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccount(item);
                        setShowEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </div>
                    <div
                      className={styles.deleteBtn}
                      onClick={(e) => handleDeleteClick(e, item)}
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
          ))}
        </div>

        {accountsData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            <p>No trading accounts found</p>
          </div>
        )}
      </div>

      {showEditModal && selectedAccount && (
        <UseExisting
          isEdit
          account={selectedAccount}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAccount(null);
            dispatch(fetchTradingAccounts(userId));
          }}
        />
      )}

      {showDeleteModal && accountToDelete && (
        <div className={styles.mt5AccountWrapper}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Delete Account</h2>
              <p>Are you sure you want to delete this account?</p>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.actions}>
                <AuthButton
                  outline
                  text="Cancel"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setAccountToDelete(null);
                  }}
                />
                <button
                  className={styles.confirmDeleteBtn}
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
