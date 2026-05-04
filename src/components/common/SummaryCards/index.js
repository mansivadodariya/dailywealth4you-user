'use client';

import React from 'react';
import styles from './SummaryCards.module.scss';
import Input from '@/components/input';
import { useSelector } from 'react-redux';
import config from '@/config';

const CopyIcon = '/assets/icons/copy.svg';

/**
 * Reusable summary card row.
 * Props:
 *   cards: Array<{ label: string, value: string | number }>
 *   showReferral: boolean  — show the referral link input as first card
 */
export default function SummaryCards({ cards = [], showReferral = false }) {
  const user = useSelector((state) => state.login.user);

  return (
    <div className={styles.cardRow}>
      {showReferral && (
        <div className={styles.item}>
          <Input
            label="Your Referral link"
            placeholderWhite
            leftSpacingRemove
            rightIcon={CopyIcon}
            value={`${config.API_URL_VERCEL_URL || ''}/signup/${user?.referralCode || ''}`}
            readOnly
          />
        </div>
      )}
      {cards.map((card, i) => (
        <div key={i} className={styles.item}>
          <p>{card.label}</p>
          <h3>{card.value ?? '—'}</h3>
        </div>
      ))}
    </div>
  );
}
