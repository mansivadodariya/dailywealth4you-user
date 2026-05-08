'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinSocialPool, fetchPoolPurchases } from '@/store/slice/performanceSlice';
import { fetchTradingAccounts } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './joinPoolModal.module.scss';
import toast from 'react-hot-toast';
import AuthButton from '@/components/authButton';

export default function JoinPoolModal({ pool, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { joinPoolLoading, poolPurchases } = useSelector((state) => state.performance);
  const { tradingAccounts, tradingAccountsLoading } = useSelector(
    (state) => state.account
  );

  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(null);

  const user = getUserFromCookie();
  const userId = user?.id || user?._id;

  // Fetch trading accounts and pool purchases on mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchTradingAccounts(userId));
      dispatch(fetchPoolPurchases());
    }
  }, [dispatch, userId]);

  // Update selected account when dropdown changes
  useEffect(() => {
    if (selectedAccountId) {
      const account = tradingAccounts?.find((acc) => acc.id === selectedAccountId);
      setSelectedAccount(account || null);
    } else {
      setSelectedAccount(null);
    }
  }, [selectedAccountId, tradingAccounts]);

  // Check if a trading account is already used for another pool
  const isAccountUsedForAnotherPool = (accountId) => {
    if (!poolPurchases || !accountId) return false;
    return poolPurchases.some(
      (purchase) => purchase.tradingAccountId === accountId && purchase.socialPoolId !== pool.id
    );
  };

  // Get available trading accounts (not used for other pools)
  const availableAccounts = tradingAccounts?.filter(
    (account) => !isAccountUsedForAnotherPool(account.id)
  ) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error('User not found. Please login again.');
      return;
    }

    if (!selectedAccountId) {
      toast.error('Please select a trading account.');
      return;
    }

    // Check if account is already used for another pool
    if (isAccountUsedForAnotherPool(selectedAccountId)) {
      toast.error('This trading account is already used for another pool. Please select a different account.');
      return;
    }

    if (!depositAmount || Number(depositAmount) < Number(pool.minDeposit)) {
      toast.error(`Minimum deposit is ${Number(pool.minDeposit).toLocaleString()}`);
      return;
    }

    // Validate balance
    const accountBalance = Number(selectedAccount?.currentBalance || selectedAccount?.balance || 0);
    const requestedAmount = Number(depositAmount);

    if (requestedAmount > accountBalance) {
      toast.error(`Insufficient balance. Available: ${accountBalance.toLocaleString()}`);
      return;
    }

    const payload = {
      userId,
      socialPoolId: pool.id,
      depositAmount: requestedAmount,
      tradingAccountId: selectedAccountId,
    };

    try {
      await dispatch(joinSocialPool(payload)).unwrap();
      if (onSuccess) onSuccess(pool.id);
      onClose();
    } catch (error) {
      // Error already handled by toast in the thunk
    }
  };

  if (!pool) return null;

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Join Pool</h2>
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
            <h3 className={styles.poolName}>{pool.title}</h3>
            <p className={styles.poolDescription}>{pool.shortDescription}</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Profit %</span>
              <span className={styles.statValue}>
                {Number(pool.profitPercentage).toFixed(2)}%
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Min Deposit</span>
              <span className={styles.statValue}>
                ${Number(pool.minDeposit).toLocaleString()}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Trading Account Dropdown */}
            <div className={styles.inputGroup}>
              <label htmlFor="tradingAccount" className={styles.label}>
                Select Trading Account
              </label>
              {tradingAccountsLoading ? (
                <div className={styles.loadingText}>Loading accounts...</div>
              ) : availableAccounts && availableAccounts.length > 0 ? (
                <>
                  <select
                    id="tradingAccount"
                    className={styles.select}
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    required
                  >
                    <option value="">Select an account</option>
                    {availableAccounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.mt5LoginId || account.accountId || 'Account'} - 
                        Balance: ${Number(account.currentBalance || account.balance || 0).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {selectedAccount && (
                    <div className={styles.balanceInfo}>
                      Available Balance: ${Number(selectedAccount.currentBalance || selectedAccount.balance || 0).toLocaleString()}
                    </div>
                  )}
                  {tradingAccounts && tradingAccounts.length > availableAccounts.length && (
                    <div className={styles.infoText}>
                      Note: Some accounts are already used for other pools and are not shown.
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.noAccounts}>
                  {tradingAccounts && tradingAccounts.length > 0
                    ? 'All your trading accounts are already used for other pools. Please create a new account or delete an existing pool.'
                    : 'No trading accounts found. Please create an account first.'}
                </div>
              )}
            </div>

            {/* Deposit Amount Input */}
            <div className={styles.inputGroup}>
              <label htmlFor="depositAmount" className={styles.label}>
                Deposit Amount ($)
              </label>
              <input
                id="depositAmount"
                type="number"
                className={styles.input}
                placeholder={`Min: ${Number(pool.minDeposit).toLocaleString()}`}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min={pool.minDeposit}
                step="0.01"
                required
                disabled={!selectedAccountId}
              />
              {depositAmount && selectedAccount && (
                <div className={styles.amountValidation}>
                  {Number(depositAmount) > Number(selectedAccount.currentBalance || selectedAccount.balance || 0) ? (
                    <span className={styles.errorText}>
                      ⚠ Insufficient balance
                    </span>
                  ) : (
                    <span className={styles.successText}>
                      ✓ Amount available
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.actions}>
              {/* <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={joinPoolLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={joinPoolLoading || !availableAccounts || availableAccounts.length === 0}
              >
                {joinPoolLoading ? 'Joining...' : 'Join Pool'}
              </button> */}
                <AuthButton
              text= {joinPoolLoading ? 'Joining...' : 'Join Pool'}
              onClick={handleSubmit}
                disabled={joinPoolLoading || !availableAccounts || availableAccounts.length === 0}
              />
              <AuthButton
              outline={true}
              text="Cancel"
              onClick={onClose}
              disabled={joinPoolLoading}
              />
            
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
