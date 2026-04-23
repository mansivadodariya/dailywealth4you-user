'use client';

import React from 'react';
import styles from './profitSharingCard.module.scss';
import Input from '@/components/input';
import { useSelector } from 'react-redux';

const CopyIcon = '/assets/icons/copy.svg';

export default function ProfitSharingCard() {
  const { profitSharingSummary, profitSharingLoading } = useSelector(
    (state) => state.ibUser
  );

  const totalClients = profitSharingSummary?.totalClients ?? '—';
  const totalLots = profitSharingSummary?.totalLots ?? '—';
  const totalCommission =
    profitSharingSummary?.totalCommission != null
      ? `$${profitSharingSummary.totalCommission}`
      : '—';

  return (
    <div className={styles.profitSharingCard}>
      <div className={styles.items}>
        <Input
          label="Your Referral link"
          placeholderWhite
          leftSpacingRemove
          rightIcon={CopyIcon}
          placeholder="https://domain.com/123abc"
        />
      </div>
      <div className={styles.items}>
        <p>Total Clients</p>
        <h3>{profitSharingLoading ? '...' : totalClients}</h3>
      </div>
      <div className={styles.items}>
        <p>Client's Profit</p>
        <h3>${profitSharingLoading ? '...' : totalLots}</h3>
      </div>
      <div className={styles.items}>
        <p> Commission (10%)</p>
        <h3>{profitSharingLoading ? '...' : totalCommission}</h3>
      </div>
    </div>
  );
}
