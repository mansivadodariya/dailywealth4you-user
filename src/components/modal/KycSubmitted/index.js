import React from 'react';
import styles from './KycSubmitted.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';

export default function KycSubmitted({ onProceed, onCancel }) {
  return (
    <div className={styles.mt5AccountWrapper}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>KYC Submitted</h2>
          <p>
            We've received your KYC documents. We will <br />
            review it and get back to you soon.
          </p>
        </div>

        {/* Body */}
        <div className={styles.modalBody}>
          {/* Buttons */}
          <div className={styles.actions}>
            <AuthButton text="Submit" icon={RightIcon} onClick={onProceed} />
            <AuthButton outline text="Cancel ✕" onClick={onCancel} />
          </div>
        </div>
      </div>
    </div>
  );
}
