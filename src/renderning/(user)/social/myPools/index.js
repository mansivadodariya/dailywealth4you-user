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
import { getUserFromCookie } from '@/service/cookies';
import { useRouter } from 'next/navigation';
import RichTextDescription from '@/components/richTextDescription';

const PlusIcon = '/assets/icons/plus.svg';
const CloseIcon = '/assets/icons/close.svg';
const NETWORK_OPTIONS = ['TRC20', 'ERC20', 'BEP20'];

export default function MyPools() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    poolPurchases,
    poolPurchasesLoading,
    poolPurchasesError,
    deletePoolLoading,
  } = useSelector((state) => state.performance);

  const [selectedPoolPurchase, setSelectedPoolPurchase] = useState(null);
  const [deletingPoolId, setDeletingPoolId] = useState(null);
  const [poolToClose, setPoolToClose] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [network, setNetwork] = useState('');
  const [networkOpen, setNetworkOpen] = useState(false);

  const user = getUserFromCookie();
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchPoolPurchases(userId));
    }
  }, [dispatch, userId]);

  const handleAddBalance = (poolPurchase) => {
    setSelectedPoolPurchase(poolPurchase);
  };

  const handleClosePoolClick = (poolPurchase) => {
    setPoolToClose(poolPurchase);
    setWalletAddress('');
    setNetwork('');
    setNetworkOpen(false);
  };

  const handleClosePoolModal = () => {
    if (deletePoolLoading) return;
    setPoolToClose(null);
    setWalletAddress('');
    setNetwork('');
    setNetworkOpen(false);
  };

  const handleDeletePool = async (e) => {
    e.preventDefault();

    if (!poolToClose) return;

    if (walletAddress.trim().length < 10) {
      toast.error('Please enter a valid crypto wallet address.');
      return;
    }

    if (!network) {
      toast.error('Please select a network.');
      return;
    }

    setDeletingPoolId(poolToClose.id);
    try {
      await dispatch(
        deletePoolPurchase({
          id: poolToClose.id,
          address: walletAddress.trim(),
          network,
        })
      ).unwrap();
      // Refresh the list after deletion
      dispatch(fetchPoolPurchases(userId));
      handleClosePoolModal();
    } catch (error) {
      // Error already handled by toast in the thunk
    } finally {
      setDeletingPoolId(null);
    }
  };

  const handleModalSuccess = () => {
    // Refresh the pool purchases after adding balance
    dispatch(fetchPoolPurchases(userId));
  };

  if (poolPurchasesLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  const handleClick = () => {
    router.push('/social/pool-account');
  };

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
            <p className={styles.emptyHint} onClick={handleClick}>
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
                        ? moment(purchase.createdAt).format( 'DD-MM-YYYY | hh:mm A')
                        : '—'}
                    </span>
                  </div>
                </div>

                {pool.description && (
               
                  <div className={styles.descriptionWrapper}>
             
                    <RichTextDescription
                      value={pool.description}
                      className={styles.description}
                    />

                    {pool.description.length > 120 && (
                      <button
                        className={styles.viewBtn}
                        onClick={() => handleAddBalance(purchase)}
                      >
                        View
                      </button>
                    )}
                  </div>
                )}

                <div className={styles.actions}>
                  <AuthButton
                    icon={PlusIcon}
                    text="Add Balance"
                    onClick={() => handleAddBalance(purchase)}
                    disabled={isDeleting}
                  />

                  <AuthButton
                    danger={true}
                    icon={CloseIcon}
                    text={isDeleting ? 'Closing...' : 'Close Pool'}
                    onClick={() => handleClosePoolClick(purchase)}
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

      {poolToClose && (
        <div
          className={styles.closePoolOverlay}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClosePoolModal();
          }}
        >
          <div className={styles.closePoolModal}>
            <div className={styles.closePoolHeader}>
              <h2>Close Pool</h2>
              <p>
                Are you sure you want to close this pool? Once you submit the
                close request, it will be reviewed by the admin. After admin
                approval, your invested amount and profit will be credited back
                to your wallet.
              </p>
            </div>

            <form className={styles.closePoolForm} onSubmit={handleDeletePool}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>
                  Crypto Wallet Address
                </label>
                <input
                  className={styles.walletInput}
                  type="text"
                  placeholder="Enter wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel}>Network</label>
                <div className={styles.networkWrapper}>
                  <button
                    type="button"
                    className={styles.networkSelector}
                    onClick={() => setNetworkOpen((prev) => !prev)}
                  >
                    <span
                      className={
                        network
                          ? styles.networkValue
                          : `${styles.networkValue} ${styles.networkPlaceholder}`
                      }
                    >
                      {network || 'Select Network'}
                    </span>
                    <span
                      className={
                        networkOpen
                          ? `${styles.networkChevron} ${styles.open}`
                          : styles.networkChevron
                      }
                    >
                      v
                    </span>
                  </button>

                  {networkOpen && (
                    <div className={styles.networkDropdown}>
                      {NETWORK_OPTIONS.map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={
                            network === option
                              ? `${styles.networkOption} ${styles.selected}`
                              : styles.networkOption
                          }
                          onClick={() => {
                            setNetwork(option);
                            setNetworkOpen(false);
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.closePoolActions}>
                <AuthButton
                  outline
                  text="Cancel"
                  onClick={handleClosePoolModal}
                  disabled={deletePoolLoading}
                />
                <AuthButton
                  danger
                  text={deletePoolLoading ? 'Submitting...' : 'Submit Request'}
                  type="submit"
                  disabled={deletePoolLoading}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
