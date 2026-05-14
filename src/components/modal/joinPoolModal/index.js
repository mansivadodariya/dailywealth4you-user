'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinSocialPool } from '@/store/slice/performanceSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './joinPoolModal.module.scss';
import toast from 'react-hot-toast';
import AuthButton from '@/components/authButton';
import RichTextDescription from '@/components/richTextDescription';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { fetchUserById } from '@/store/reducers';

export default function JoinPoolModal({
  pool,
  isJoined = false,
  onClose,
  onSuccess,
}) {
  const dispatch = useDispatch();
  const { joinPoolLoading } = useSelector((state) => state.performance);
  const { walletBalance } = useSelector((state) => state.login);
  const numericWalletBalance = Number(walletBalance) || 0;

  // const [selectedAccountId, setSelectedAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // const [selectedAccount, setSelectedAccount] = useState(null);

  const user = getUserFromCookie();

  const userId = user?.id || user?._id;

   useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(userId));
 
     }
  }, [dispatch, userId]);

  // Fetch trading accounts and pool purchases on mount
  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchTradingAccounts(userId));
  //     dispatch(fetchPoolPurchases());
  //   }
  // }, [dispatch, userId]);

  // Update selected account when dropdown changes
  // useEffect(() => {
  //   if (selectedAccountId) {
  //     const account = tradingAccounts?.find(
  //       (acc) => acc.id === selectedAccountId
  //     );
  //     setSelectedAccount(account || null);
  //   } else {
  //     setSelectedAccount(null);
  //   }
  // }, [selectedAccountId, tradingAccounts]);

  // const walletBalance = Number(user?.walletBalance || 0);
  const requestedAmount = Number(depositAmount || 0);
  const minDeposit = Number(pool?.minDeposit || 0);
  const hasInsufficientBalance =
    requestedAmount > 0
      ? requestedAmount > numericWalletBalance
      : numericWalletBalance < minDeposit;
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!userId) {
  //     toast.error('User not found. Please login again.');
  //     return;
  //   }

  //   if (isJoined) {
  //     toast.error('You have already joined this pool.');
  //     return;
  //   }

  //   // if (!selectedAccountId) {
  //   //   toast.error('Please select a trading account.');
  //   //   return;
  //   // }

  //   // Check if account is already used for another pool
  //   // if (isAccountUsedForAnotherPool(selectedAccountId)) {
  //   //   toast.error(
  //   //     'This trading account is already used for another pool. Please select a different account.'
  //   //   );
  //   //   return;
  //   // }

  //   if (!depositAmount || Number(depositAmount) < Number(pool.minDeposit)) {
  //     toast.error(
  //       `Minimum deposit is ${Number(pool.minDeposit).toLocaleString()}`
  //     );
  //     return;
  //   }

  //   // Validate balance
  //   // const accountBalance = Number(
  //   //   selectedAccount?.currentBalance || selectedAccount?.balance || 0
  //   // );
  //   const requestedAmount = Number(depositAmount);

  //   if (requestedAmount > walletBalance) {
  //     toast.error(
  //       `Insufficient wallet balance. Available: $${walletBalance.toLocaleString()}`
  //     );
  //     return;
  //   }

  //   // if (requestedAmount > accountBalance) {
  //   //   toast.error(
  //   //     `Insufficient balance. Available: ${accountBalance.toLocaleString()}`
  //   //   );
  //   //   return;
  //   // }

  //   const payload = {
  //     userId,
  //     socialPoolId: pool.id,
  //     depositAmount: requestedAmount,

  //     // tradingAccountId: selectedAccountId,
  //   };

  //   try {
  //     await dispatch(joinSocialPool(payload)).unwrap();
  //     if (onSuccess) onSuccess(pool.id);
  //     onClose();
  //   } catch (error) {
  //     // Error already handled by toast in the thunk
  //   }
  // };
  const formik = useFormik({
    initialValues: {
      depositAmount: '',
    },

    validationSchema: Yup.object({
      depositAmount: Yup.number()
        .typeError('Please enter deposit amount')
        .required('Please enter deposit amount')
        .min(
          Number(pool?.minDeposit || 0),
          `Minimum deposit is $${Number(
            pool?.minDeposit || 0
          ).toLocaleString()}`
        )
        .test(
          'wallet-balance',
          'Insufficient wallet balance',
          function (value) {
            return Number(value || 0) <= numericWalletBalance;
          }
        ),
    }),

    onSubmit: async (values) => {
      if (!userId) {
        toast.error('User not found. Please login again.');
        return;
      }

      if (isJoined) {
        toast.error('You have already joined this pool.');
        return;
      }

      const payload = {
        userId,
        socialPoolId: pool.id,
        depositAmount: Number(values.depositAmount),
      };

      try {
        await dispatch(joinSocialPool(payload)).unwrap();

        if (onSuccess) onSuccess(pool.id);

        onClose();
      } catch (error) {
        // handled in thunk
      }
    },
  });
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

            <RichTextDescription
              value={pool.description}
              className={styles.fullDescription}
            />
          </div>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Avarage Profit %</span>
              <span className={styles.statValue}>
                {Number(pool.profitPercentage).toFixed(0)}%
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Min Deposit</span>
              <span className={styles.statValue}>
                ${Number(pool.minDeposit).toLocaleString()}
              </span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statLabel}>Current Wallet Balance</span>
              <span className={styles.statValue}>
                ${numericWalletBalance.toLocaleString()}
              </span>
              {/* <input
                type="text"
                className={styles.input}
                value={`$${walletBalance.toLocaleString()}`}
                readOnly
              /> */}
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className={styles.form}>
            {/* Trading Account Dropdown */}
            {/* <div className={styles.inputGroup}>
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
                        Balance: $
                        {Number(
                          account.currentBalance || account.balance || 0
                        ).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  {selectedAccount && (
                    <div className={styles.balanceInfo}>
                      Available Balance: $
                      {Number(
                        selectedAccount.currentBalance ||
                          selectedAccount.balance ||
                          0
                      ).toLocaleString()}
                    </div>
                  )}
                  {tradingAccounts &&
                    tradingAccounts.length > availableAccounts.length && (
                      <div className={styles.infoText}>
                        Note: Some accounts are already used for other pools and
                        are not shown.
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
            </div> */}

            {/* Deposit Amount Input */}

            <div className={styles.inputGroup}>
              <label htmlFor="depositAmount" className={styles.label}>
                Deposit Amount ($)
              </label>

              <input
                id="depositAmount"
                name="depositAmount"
                type="number"
                className={`${styles.input} ${
                  formik.touched.depositAmount && formik.errors.depositAmount
                    ? styles.inputError
                    : ''
                }`}
                placeholder={`Min: ${Number(pool.minDeposit).toLocaleString()}`}
                value={formik.values.depositAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={pool.minDeposit}
                step="0.01"
                disabled={isJoined || joinPoolLoading}
              />

              {formik.touched.depositAmount && formik.errors.depositAmount && (
                <span className={styles.errorText}>
                  {formik.errors.depositAmount}
                </span>
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
                text={
                  isJoined
                    ? 'Joined'
                    : joinPoolLoading
                      ? 'Joining...'
                      : 'Join Pool'
                }
                type="submit"
                disabled={isJoined || joinPoolLoading}
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
