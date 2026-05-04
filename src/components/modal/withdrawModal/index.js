'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createTransaction } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './withdrawModal.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

const NETWORK_OPTIONS = ['TRC20', 'ERC20', 'BEP20', 'Bitcoin'];

const withdrawSchema = Yup.object({
  amount: Yup.number()
    .typeError('Please enter a valid amount')
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .min(1, 'Minimum withdrawal amount is $1'),
  address: Yup.string()
    .required('Wallet address is required')
    .min(10, 'Please enter a valid wallet address'),
  network: Yup.string().required('Please select a network'),
});

export default function WithdrawModal({ onClose, activeAccount }) {
  const dispatch = useDispatch();
  const { transactionLoading } = useSelector((state) => state.account);
  const { tradingAccounts } = useSelector((state) => state.account);

  const [networkOpen, setNetworkOpen] = useState(false);

  const account = activeAccount || tradingAccounts?.[0];
  const tradingAccountId = account?.id || '';
  const mt5Account = account?.mt5LoginId || '';
  const broker =
    typeof account?.broker === 'object'
      ? account?.broker?.name
      : account?.broker || account?.brokerName || '';

  const formik = useFormik({
    initialValues: { amount: '', address: '', network: '' },
    validationSchema: withdrawSchema,
    onSubmit: async (values) => {
      const user = getUserFromCookie();
      const payload = {
        tradingAccountId,
        userId: user?.id || '',
        mt5Account,
        broker,
        amount: String(values.amount),
        type: 'withdrawal',
        address: values.address,
        network: values.network,
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
    const raw = e.target.value.replace(/^\$/, '').replace(/[^0-9.]/g, '');
    const parts = raw.split('.');
    const sanitized = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : raw;
    formik.setFieldValue('amount', sanitized);
  };

  const amountError = formik.touched.amount && formik.errors.amount;
  const addressError = formik.touched.address && formik.errors.address;
  const networkError = formik.touched.network && formik.errors.network;

  return (
    <div
      className={styles.depositModalWrapper}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Withdraw</h2>
          <p>Submit a withdrawal request</p>
        </div>

        <form className={styles.modalbody} onSubmit={formik.handleSubmit}>

          {/* ── Amount ─────────────────────────────────────────────────── */}
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
            {amountError
              ? <p className={styles.errorText}>{formik.errors.amount}</p>
              : <p className={styles.hintText}>Enter Withdrawal Amount</p>
            }
          </div>

          {/* ── Wallet Address ──────────────────────────────────────────── */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Crypto Wallet Address</label>
            <input
              className={`${styles.walletInput} ${addressError ? styles.walletInputError : ''}`}
              type="text"
              name="address"
              placeholder="Enter wallet address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              autoComplete="off"
              spellCheck={false}
            />
            {addressError && (
              <span className={styles.fieldError}>{formik.errors.address}</span>
            )}
          </div>

          {/* ── Network selector ────────────────────────────────────────── */}
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Network</label>
            <div className={styles.networkWrapper}>
              <div
                className={`${styles.networkSelector} ${networkError ? styles.networkSelectorError : ''}`}
                onClick={() => setNetworkOpen((p) => !p)}
              >
                <span className={`${styles.networkValue} ${!formik.values.network ? styles.networkPlaceholder : ''}`}>
                  {formik.values.network || 'Select Network'}
                </span>
                <span className={`${styles.networkChevron} ${networkOpen ? styles.open : ''}`}>
                  ▾
                </span>
              </div>
              {networkOpen && (
                <div className={styles.networkDropdown}>
                  {NETWORK_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      className={`${styles.networkOption} ${formik.values.network === opt ? styles.selected : ''}`}
                      onClick={() => {
                        formik.setFieldValue('network', opt);
                        formik.setFieldTouched('network', true);
                        setNetworkOpen(false);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {networkError && (
              <span className={styles.fieldError}>{formik.errors.network}</span>
            )}
          </div>

          <div className={styles.buttonTop}>
            <AuthButton
              text={transactionLoading ? 'Processing...' : 'Submit Withdraw Request'}
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
