'use client';

import React from 'react';
import styles from './KycFinalModal.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';

export default function KycFinalModal({ onClose }) {
  return (
    <div className={styles.mt5AccountWrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>KYC Under Review</h2>
          <p>
            Your KYC is currently under review. You will be able to access the
            platform once it has been approved.
          </p>
        </div>

        <div className={styles.modalBody}>
          {/* <div className={styles.actions}>
            <AuthButton text="Close" icon={RightIcon}  />
          </div> */}
        </div>
      </div>
    </div>
  );
}
