import React from 'react';
import styles from './depositModal.module.scss';
import AuthButton from '@/components/authButton';
const RightIcon = '/assets/icons/right.svg';
const CloseIcon = '/assets/icons/close.svg';

export default function DepositModal() {
  return (
    <div className={styles.depositModalWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Deposit</h2>
          <p>Deposit to MT5 account number 123456</p>
        </div>
        <div className={styles.modalbody}>
          <input type="text" placeholder="$0" />
          <p>Enter Deposit Amount</p>
          <div className={styles.buttonTop}>
            <AuthButton text="Deposit" icon={RightIcon} />
          </div>
          <AuthButton text="Cancel" outline icon={CloseIcon} />
        </div>
      </div>
    </div>
  );
}
