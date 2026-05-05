'use client';

import React from 'react';
import styles from './profitSharingCard.module.scss';
import Input from '@/components/input';
import { useSelector } from 'react-redux';
import config from '@/config';
import toast from 'react-hot-toast';
import { clearAuthCookies } from '@/service/cookies';

const CopyIcon = '/assets/icons/copy.svg';

export default function ProfitSharingCard() {
  const { profitSharingSummary, profitSharingLoading } = useSelector(
    (state) => state.ibUser
  );
  const user = useSelector((state) => state.login.user);

  const totalClients = profitSharingSummary?.totalClients ?? '—';
  const totalProfit = profitSharingSummary?.totalProfit ?? '—';
  const totalCommission =
    profitSharingSummary?.totalCommission != null
      ? `${profitSharingSummary.totalCommission}`
      : '—';

  const referralBaseUrl = config?.APP_FRONTEND_VERCEL_URL;
  const referralUrl = `${referralBaseUrl}/signup/${user?.referralCode || ''}`;
  // console.log(referralUrl)

  const handleCopyReferral = () => {
    if (!referralUrl) return;
    navigator.clipboard
      .writeText(referralUrl)
      .then(() => {
        toast.success('Referral link copied!');
      })
      .catch(() => {
        toast.error('Failed to copy link.');
      });
  };

  return (
    <div className={styles.profitSharingCard}>
      <div
        className={styles.items}
        style={{ cursor: 'pointer' }}
        onClick={handleCopyReferral}
      >
        <Input
          label="Your Referral link"
          placeholderWhite
          leftSpacingRemove
          rightIcon={CopyIcon}
          value={referralUrl}
          readOnly
        />
      </div>
      <div className={styles.items}>
        <p>Total Clients</p>
        <h3>{profitSharingLoading ? '...' : totalClients}</h3>
      </div>
      <div className={styles.items}>
        <p>Client's Profit</p>
        <h3>${profitSharingLoading ? '...' : totalProfit}</h3>
      </div>
      <div className={styles.items}>
        <p>Commission (10%)</p>
        <h3>{profitSharingLoading ? '...' : totalCommission}</h3>
      </div>
    </div>
  );
}
