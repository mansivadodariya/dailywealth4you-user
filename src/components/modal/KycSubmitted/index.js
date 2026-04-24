'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slice/loginSlice';
import { clearAuthCookies } from '@/service/cookies';
import styles from './KycSubmitted.module.scss';

const kycSubmit = '/assets/icons/KycSubmit.svg';

export default function KycSubmitted() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleBack = () => {
    dispatch(logout());
    clearAuthCookies();
    router.push('/');
  };

  return (
    <div className={styles.mt5AccountWrapper}>
      <div className={styles.modal}>
        <div className={styles.iconWrapper}>
          <img
            src={kycSubmit}
            alt="KYC Submitted"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>

        <div className={styles.modalHeader}>
          <h2>KYC Submitted</h2>
          <p>
            We've received your KYC documents. We will
            <br />
            review it and get back to you soon.
          </p>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.backBtn} onClick={handleBack}>
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
