'use client';

import React from 'react';
import styles from './KycRejected.module.scss';
import AuthButton from '@/components/authButton';

const RightIcon = '/assets/icons/right.svg';

export default function KycRejected({ rejectionMessage, onSubmitAgain }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>KYC Rejected</h2>
          <p>
            {rejectionMessage ||
              'Your KYC documents were not approved. Please review the reason below and resubmit.'}
          </p>
        </div>

        <div className={styles.modalBody}>
          <AuthButton
            text="Submit Again"
            icon={RightIcon}
            onClick={onSubmitAgain}
          />
        </div>
      </div>
    </div>
  );
}
