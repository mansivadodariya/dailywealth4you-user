import React from 'react';
import styles from './profitSharingCard.module.scss';
import Input from '@/components/input';
const CopyIcon = '/assets/icons/copy.svg';
export default function ProfitSharingCard() {
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
        <h3>12</h3>
      </div>
      <div className={styles.items}>
        <p>Client’s Profit</p>
        <h3>$20,000</h3>
      </div>
      <div className={styles.items}>
        <p>Commission (10%)</p>
        <h3>$2,000</h3>
      </div>
    </div>
  );
}
