'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './depositModal.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function DepositModal({ onClose, activeAccount }) {
  const dispatch = useDispatch();
  const { transactionLoading } = useSelector((state) => state.account);

  const [amount, setAmount] = useState('');

  // Resolve account info — prefer prop, fall back to first trading account
  const { tradingAccounts } = useSelector((state) => state.account);
  const account = activeAccount || tradingAccounts?.[0];
  const mt5Account = account?.accountId || '';
  const broker =
    typeof account?.broker === 'object'
      ? account?.broker?.name
      : account?.broker || account?.brokerName || '';

  const handleDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    const user = getUserFromCookie();
    const payload = {
      userId: user?.id || '',
      mt5Account,
      broker,
      amount: String(amount),
      type: 'deposit',
    };

    try {
      await dispatch(createTransaction(payload)).unwrap();
      if (onClose) onClose();
    } catch {
      // toast already shown by thunk
    }
  };

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
        <div className={styles.modalbody}>
          <input
            type="number"
            placeholder="$0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
          />
          <p>Enter Deposit Amount</p>
          <div className={styles.buttonTop}>
            <AuthButton
              text={transactionLoading ? 'Processing...' : 'Deposit'}
              icon={RightIcon}
              onClick={handleDeposit}
              disabled={transactionLoading || !amount}
            />
          </div>
          <AuthButton
            text="Cancel"
            outline
            icon={CloseIcon}
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
