'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTransaction } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './depositModal.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

const depositSchema = Yup.object({
  amount: Yup.number()
    .typeError('Please enter a valid amount')
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .min(1, 'Minimum deposit amount is $1'),
});

export default function DepositModal({ onClose, activeAccount }) {
  const dispatch = useDispatch();
  const { transactionLoading } = useSelector((state) => state.account);
  const { tradingAccounts } = useSelector((state) => state.account);

  const account = activeAccount || tradingAccounts?.[0];
  const tradingAccountId = account?.id || '';
  const mt5Account = account?.mt5LoginId || '';
  const broker =
    typeof account?.broker === 'object'
      ? account?.broker?.name
      : account?.broker || account?.brokerName || '';

  const formik = useFormik({
    initialValues: { amount: '' },
    validationSchema: depositSchema,
    onSubmit: async (values) => {
      const user = getUserFromCookie();
      const payload = {
        userId: user?.id || '',
        tradingAccountId,
        mt5Account,
        broker,
        amount: String(values.amount),
        type: 'deposit',
      };
      try {
        await dispatch(createTransaction(payload)).unwrap();
        if (onClose) onClose();
      } catch {
        // toast already shown by thunk
      }
    },
  });

  const handleAmountChange = (e) => {
    // Strip the leading $ then allow only digits and one decimal point
    const raw = e.target.value.replace(/^\$/, '').replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const sanitized =
      parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw;
    formik.setFieldValue('amount', sanitized);
  };

  const hasError = formik.touched.amount && formik.errors.amount;

  return (
    <div
      className={styles.depositModalWrapper}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Deposit</h2>
          <p>
            {mt5Account
              ? `Deposit to MT5 account ${mt5Account}`
              : 'Deposit to MT5 account'}
          </p>
        </div>

        <form className={styles.modalbody} onSubmit={formik.handleSubmit}>
          {/* ── Amount input ─────────────────────────────────────────── */}
          <div className={styles.amountSection}>
            <div className={styles.amountRow}>
              <input
                className={styles.amountInput}
                type="text"
                inputMode="decimal"
                placeholder="$0"
                name="amount"
                value={formik.values.amount ? `$${formik.values.amount}` : ''}
                onChange={handleAmountChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
              />
            </div>
            {hasError ? (
              <p className={styles.errorText}>{formik.errors.amount}</p>
            ) : (
              <p className={styles.hintText}>Enter Deposit Amount</p>
            )}
          </div>

          <div className={styles.buttonTop}>
            <AuthButton
              text={transactionLoading ? 'Processing...' : 'Deposit'}
              icon={RightIcon}
              type="submit"
              disabled={transactionLoading}
            />
          </div>
          <AuthButton
            text="Cancel"
            outline
            icon={CloseIcon}
            onClick={onClose}
          />
        </form>
      </div>
    </div>
  );
}
