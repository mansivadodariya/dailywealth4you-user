'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePoolPurchase } from '@/store/slice/performanceSlice';
import { fetchTradingAccounts } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './addBalanceModal.module.scss';
import toast from 'react-hot-toast';
import AuthButton from '@/components/authButton';
import RichTextDescription from '@/components/richTextDescription';

const PlusIcon = '/assets/icons/plus.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function AddBalanceModal({ poolPurchase, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { updatePoolLoading } = useSelector((state) => state.performance);
  const { walletBalance } = useSelector((state) => state.login);

  // const { tradingAccounts, tradingAccountsLoading } = useSelector(
  //   (state) => state.account
  // );

  const [addAmount, setAddAmount] = useState('');
  const balance = Number(walletBalance) || 0;
  // const [selectedAccount, setSelectedAccount] = useState(null);

  // const user = getUserFromCookie();
  // const userId = user?.id || user?._id;

  

  // Fetch trading accounts on mount
  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchTradingAccounts(userId));
  //   }
  // }, [dispatch, userId]);

  // Find the trading account used for this pool purchase
  // useEffect(() => {
  //   if (poolPurchase?.tradingAccountId && tradingAccounts?.length > 0) {
  //     const account = tradingAccounts.find(
  //       (acc) => acc.id === poolPurchase.tradingAccountId
  //     );
  //     setSelectedAccount(account || null);
  //   }
  // }, [poolPurchase, tradingAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!addAmount || Number(addAmount) <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    const requestedAmount = Number(addAmount);

    if (requestedAmount > balance) {
      toast.error(
        `Insufficient wallet balance. Available: ${balance.toLocaleString()}`
      );
      return;
    }

    // Calculate new deposit amount
    const currentDeposit = Number(poolPurchase.depositAmount || 0);
    const newDepositAmount = currentDeposit + requestedAmount;

    try {
      await dispatch(
        updatePoolPurchase({
          id: poolPurchase.id,
          depositAmount: newDepositAmount,
        })
      ).unwrap();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      // Error already handled by toast in the thunk
    }
  };

  if (!poolPurchase) return null;

  const pool = poolPurchase?.socialPool || {};

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Add Balance</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.divider} />

        <div className={styles.content}>
          <div className={styles.poolInfo}>
            <h3 className={styles.poolName}>{pool.title || 'Pool'}</h3>
            <p className={styles.poolDescription}>
              Add more balance to your pool investment
            </p>
            <RichTextDescription
              value={pool.description}
              className={styles.fullDescription}
            />
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Current Deposit</span>
              <span className={styles.statValue}>
                ${Number(poolPurchase.depositAmount || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Current Wallet Balance</span>
              <span className={styles.statValue}>
                ${Number(poolPurchase.currentBalance || 0).toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Trading Account Info */}
            {/* <div className={styles.inputGroup}>
              <label className={styles.label}>Trading Account</label>
              {tradingAccountsLoading ? (
                <div className={styles.loadingText}>Loading account...</div>
              ) : selectedAccount ? (
                <div className={styles.accountInfo}>
                  <div className={styles.accountDetail}>
                    <span className={styles.accountLabel}>Account ID:</span>
                    <span className={styles.accountValue}>
                      {selectedAccount.mt5LoginId ||
                        selectedAccount.accountId ||
                        'N/A'}
                    </span>
                  </div>
                  <div className={styles.accountDetail}>
                    <span className={styles.accountLabel}>
                      Available Balance:
                    </span>
                    <span className={styles.accountValue}>
                      $
                      {Number(
                        selectedAccount.currentBalance ||
                          selectedAccount.balance ||
                          0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className={styles.noAccount}>
                  Trading account not found. Please ensure the account still
                  exists.
                </div>
              )}
            </div> */}

            {/* Add Amount Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="addAmount" className={styles.label}>
                Amount to Add ($)
              </label>
              <input
                id="addAmount"
                type="number"
                className={styles.input}
                placeholder="Enter amount"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                min="0.01"
                step="0.01"
                required
              />
              {addAmount && (
                <div className={styles.amountValidation}>
                  {Number(addAmount) > Number(balance) ? (
                    <span className={styles.errorText}>
                      ⚠ Insufficient balance
                    </span>
                  ) : (
                    <>
                      <span className={styles.successText}>
                        ✓ Amount available
                      </span>
                      <span className={styles.newTotal}>
                        New Total: $
                        {(
                          Number(poolPurchase.depositAmount || 0) +
                          Number(addAmount)
                        ).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              <AuthButton
                text={updatePoolLoading ? 'Adding...' : 'Add Balance'}
                onClick={handleSubmit}
                // disabled={updatePoolLoading || !selectedAccount}
                icon={PlusIcon}
              />

              <AuthButton
                outline={true}
                text=" Cancel"
                onClick={onClose}
                disabled={updatePoolLoading}
                icon={CloseIcon}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
