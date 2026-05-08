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

export default function PollAccount() {
  const dispatch = useDispatch();
  const { socialPools, socialPoolsLoading, socialPoolsError, poolPurchases } =
    useSelector((state) => state.performance);

  const [selectedPool, setSelectedPool] = useState(null);
  const [joinedPoolIds, setJoinedPoolIds] = useState(new Set());

  useEffect(() => {
    dispatch(fetchSocialPools());
    dispatch(fetchPoolPurchases());
  }, [dispatch]);

  // Update joined pool IDs when pool purchases are loaded
  useEffect(() => {
    if (poolPurchases && poolPurchases.length > 0) {
      const ids = new Set(
        poolPurchases.map((purchase) => purchase.socialPoolId)
      );
      setJoinedPoolIds(ids);
    }
  }, [poolPurchases]);

  const handleJoinSuccess = (poolId) => {
    // Add the pool ID to joined pools
    setJoinedPoolIds((prev) => new Set([...prev, poolId]));
    // Refresh pools and purchases
    dispatch(fetchSocialPools());
    dispatch(fetchPoolPurchases());
  };

  const isPoolJoined = (poolId) => {
    return joinedPoolIds.has(poolId);
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
            // const joined = isPoolJoined(pool.id);
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
                    <span className={styles.statLabel}>Profit %</span>
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

                <p className={styles.description}>{pool.description}</p>

                <AuthButton
                  text="Join Pool"
                  // className={joined ? styles.joinedBtn : styles.joinBtn}
                  className={styles.joinBtn}
                  onClick={() => setSelectedPool(pool)}
                  // disabled={joined}
                />
                {/* {joined ? 'Joined' : 'Join Pool'} */}
              </div>
            );
          })
        )}
      </div>

      {selectedPool && (
        <JoinPoolModal
          pool={selectedPool}
          onClose={() => setSelectedPool(null)}
          onSuccess={handleJoinSuccess}
        />
      )}
    </div>
  );
}
