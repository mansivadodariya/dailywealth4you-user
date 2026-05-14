'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchSocialPools,
  fetchPoolPurchases,
} from '@/store/slice/performanceSlice';
import JoinPoolModal from '@/components/modal/joinPoolModal';
import styles from './pollAccount.module.scss';
import Loader from '@/components/Loader';
import AuthButton from '@/components/authButton';
import { getUserFromCookie } from '@/service/cookies';
import RichTextDescription from '@/components/richTextDescription';

// ✅ Status se button ka config return karta hai
const getButtonConfig = (status) => {
  switch (status) {
    case 'pending':
      return { text: 'Requested', disabled: true };
    case 'approved':
      return { text: 'Joined', disabled: true };
    case 'rejected':
      return { text: 'Rejected', disabled: true };
    default:
      // null ya koi bhi unknown status → Join Pool
      return { text: 'Join Pool', disabled: false };
  }
};

export default function PollAccount() {
  const dispatch = useDispatch();
  const { socialPools, socialPoolsLoading, socialPoolsError, poolPurchases } =
    useSelector((state) => state.performance);

  const [selectedPool, setSelectedPool] = useState(null);
  const user = getUserFromCookie();
  const userId = user?.id || user?._id;

  useEffect(() => {
    dispatch(fetchSocialPools());
    if (userId) {
      dispatch(fetchPoolPurchases(userId));
    }
  }, [dispatch, userId]);

  const handleJoinSuccess = (poolId) => {
    dispatch(fetchSocialPools());
    if (userId) {
      dispatch(fetchPoolPurchases(userId));
    }
  };

  if (socialPoolsLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (socialPoolsError) {
    return (
      <p
        style={{
          color: '#ff4d4d',
          textAlign: 'center',
          padding: '2rem',
          fontSize: 14,
        }}
      >
        Failed to load social pools.
      </p>
    );
  }

  return (
    <div className={styles.pollAccount}>
      <div className={styles.header}>
        <h1 className={styles.title}>Social Pool Accounts</h1>
        <p className={styles.subtitle}>
          Join our social trading pools and benefit from collective trading
          strategies
        </p>
      </div>

      <div className={styles.poolsGrid}>
        {!socialPools || socialPools.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No social pools available at the moment.</p>
          </div>
        ) : (
          socialPools.map((pool) => {
            // ✅ pool.status se seedha button config lo
            const { text: btnText, disabled: btnDisabled } = getButtonConfig(pool.status);

            return (
              <div key={pool.id} className={styles.poolCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.poolTitle}>{pool.title}</h3>
                  {pool.isActive && (
                    <span className={styles.activeBadge}>Active</span>
                  )}
                </div>

                <p className={styles.shortDescription}>
                  {pool.shortDescription}
                </p>

                <div className={styles.poolStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Average Profit %</span>
                    <span className={styles.statValue}>
                      {Number(pool.profitPercentage).toFixed(0)}%
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Min Deposit</span>
                    <span className={styles.statValue}>
                      ${Number(pool.minDeposit).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className={styles.descriptionSection}>
                  <RichTextDescription
                    value={pool.description}
                    className={styles.description}
                  />

                  <button
                    className={styles.viewBtn}
                    onClick={() => setSelectedPool(pool)}
                  >
                    View
                  </button>
                </div>

                <AuthButton
                  text={btnText}
                  onClick={() => {
                    // ✅ Sirf Join Pool wala button kaam karega
                    if (!btnDisabled) setSelectedPool(pool);
                  }}
                  disabled={btnDisabled}
                />
              </div>
            );
          })
        )}
      </div>

      {selectedPool && (
        <JoinPoolModal
          pool={selectedPool}
          isJoined={selectedPool.status === 'approved'}
          onClose={() => setSelectedPool(null)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
}