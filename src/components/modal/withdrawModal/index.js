'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTransaction } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import styles from './withdrawModal.module.scss';
import AuthButton from '@/components/authButton';
import Input from '@/components/input';

const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

const NETWORK_OPTIONS = ['TRC20', 'ERC20', 'BEP20', 'Bitcoin'];

export default function WithdrawModal({ onClose, activeAccount }) {
  const dispatch = useDispatch();
  const { transactionLoading } = useSelector((state) => state.account);

  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [networkOpen, setNetworkOpen] = useState(false);

  // Resolve account info
  const { tradingAccounts } = useSelector((state) => state.account);
  const account = activeAccount || tradingAccounts?.[0];
  const tradingAccountId = account?.id || '';
  const mt5Account = account?.mt5LoginId || '';
  const broker =
    typeof account?.broker === 'object'
      ? account?.broker?.name
      : account?.broker || account?.brokerName || '';

  const handleWithdraw = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    const user = getUserFromCookie();
    const payload = {
      tradingAccountId,
      userId: user?.id || '',
      mt5Account,
      broker,
      amount: String(amount),
      type: 'withdrawal',
      address,
      network,
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
          <h2>Withdraw</h2>
          <p>Submit a withdrawal request</p>
        </div>
        <div className={styles.modalbody}>
          <div className={styles.amountRow}>
            <span className={styles.currencySymbol}>$</span>
            <input
              type="text"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                setAmount(value);
              }}
            />
          </div>
          <p>Enter Withdrawal Amount</p>

          <div className={styles.inputAlignment}>
            <Input
              label="Crypto Wallet Address"
              leftSpacingRemove
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter wallet address"
            />
          </div>

          {/* Network selector */}
          <div className={styles.networkWrapper}>
            <div
              className={styles.networkSelector}
              onClick={() => setNetworkOpen((p) => !p)}
            >
              <span className={styles.networkValue}>
                {network || 'Select Network'}
              </span>
              <span
                className={`${styles.networkChevron} ${networkOpen ? styles.open : ''}`}
              >
                ▾
              </span>
            </div>
            {networkOpen && (
              <div className={styles.networkDropdown}>
                {NETWORK_OPTIONS.map((opt) => (
                  <div
                    key={opt}
                    className={`${styles.networkOption} ${network === opt ? styles.selected : ''}`}
                    onClick={() => {
                      setNetwork(opt);
                      setNetworkOpen(false);
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.buttonTop}>
            <AuthButton
              text={
                transactionLoading ? 'Processing...' : 'Submit Withdraw Request'
              }
              icon={RightIcon}
              onClick={handleWithdraw}
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
