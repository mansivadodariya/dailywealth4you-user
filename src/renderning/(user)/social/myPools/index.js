'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPoolPurchases,
  deletePoolPurchase,
} from '@/store/slice/performanceSlice';
import AddBalanceModal from '@/components/modal/addBalanceModal';
import styles from './myPools.module.scss';
import Loader from '@/components/Loader';
import moment from 'moment';
import toast from 'react-hot-toast';
import AuthButton from '@/components/authButton';

export default function MyPools() {
  const dispatch = useDispatch();
  const {
    poolPurchases,
    poolPurchasesLoading,
    poolPurchasesError,
    deletePoolLoading,
  } = useSelector((state) => state.performance);

  const [selectedPoolPurchase, setSelectedPoolPurchase] = useState(null);
  const [deletingPoolId, setDeletingPoolId] = useState(null);

  useEffect(() => {
    dispatch(fetchPoolPurchases());
  }, [dispatch]);

  const handleAddBalance = (poolPurchase) => {
    setSelectedPoolPurchase(poolPurchase);
  };

  const handleDeletePool = async (poolPurchase) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${poolPurchase?.socialPool?.title || 'this pool'}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    setDeletingPoolId(poolPurchase.id);
    try {
      await dispatch(deletePoolPurchase(poolPurchase.id)).unwrap();
      // Refresh the list after deletion
      dispatch(fetchPoolPurchases());
    } catch (error) {
      // Error already handled by toast in the thunk
    } finally {
      setDeletingPoolId(null);
    }
  };

  const handleModalSuccess = () => {
    // Refresh the pool purchases after adding balance
    dispatch(fetchPoolPurchases());
  };

  if (poolPurchasesLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  if (poolPurchasesError) {
    return (
      <p
        style={{
          color: '#ff4d4d',
          textAlign: 'center',
          padding: '2rem',
          fontSize: 14,
        }}
      >
        Failed to load your pools.
      </p>
    );
  }

  return (
    <div className={styles.myPools}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Pools</h1>
        <p className={styles.subtitle}>
          View and manage your joined social trading pools
        </p>
      </div>

      <div className={styles.poolsGrid}>
        {!poolPurchases || poolPurchases.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't joined any pools yet.</p>
            <p className={styles.emptyHint}>
              Visit Pool Account to join a pool and start trading!
            </p>
          </div>
        ) : (
          poolPurchases.map((purchase) => {
            const pool = purchase?.socialPool || {};
            const isDeleting = deletingPoolId === purchase.id;

            return (
              <div key={purchase.id} className={styles.poolCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.poolTitle}>{pool.title || 'Pool'}</h3>
                  <span className={styles.statusBadge}>
                    {purchase.status || 'Active'}
                  </span>
                </div>

                <p className={styles.shortDescription}>
                  {pool.shortDescription || pool.description}
                </p>

                <div className={styles.poolStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Deposit Amount</span>
                    <span className={styles.statValue}>
                      ${Number(purchase.depositAmount || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Current Balance</span>
                    <span className={styles.statValue}>
                      ${Number(purchase.currentBalance || 0).toFixed(0)}
                    </span>
                  </div>
                </div>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Joined Date</span>
                    <span className={styles.detailValue}>
                      {purchase.createdAt
                        ? moment(purchase.createdAt).format('DD MMM YYYY')
                        : '—'}
                    </span>
                  </div>
                </div>

                {pool.description && (
                  <p className={styles.description}>{pool.description}</p>
                )}

                <div className={styles.actions}>
                  <AuthButton
                  text="Add Balance"
                   
                    onClick={() => handleAddBalance(purchase)}
                    disabled={isDeleting}
                  />
                   
                                    <AuthButton
                                      danger={true}
                                    text={isDeleting ? 'Deleting...' : 'Delete Pool'}
                
                    onClick={() => handleDeletePool(purchase)}
                    disabled={isDeleting}
                  />
                   
                </div>
              </div>
            );
          })
        )}
      </div>

      {selectedPoolPurchase && (
        <AddBalanceModal
          poolPurchase={selectedPoolPurchase}
          onClose={() => setSelectedPoolPurchase(null)}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}
