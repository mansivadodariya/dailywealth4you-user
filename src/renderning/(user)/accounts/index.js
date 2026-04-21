'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTradingAccounts } from '@/store/reducers';
import styles from './accounts.module.scss';
import EditIcon from '@/icons/editIcon';
import moment from 'moment';
import { getUserFromCookie } from '@/service/cookies';
import UseExisting from '@/components/modal/useExisting';

export default function Accounts() {
  const dispatch = useDispatch();
  const { tradingAccounts, tradingAccountsLoading, tradingAccountsError } =
    useSelector((state) => state.account);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const user = getUserFromCookie();
  const userId = user?.id;

  useEffect(() => {
    dispatch(fetchTradingAccounts(userId));
  }, [dispatch]);

  if (tradingAccountsLoading) {
    return (
      <div className={styles.accountsWrapper}>
        <p style={{ color: '#fff', textAlign: 'center', padding: '2rem' }}>
          Loading accounts...
        </p>
      </div>
    );
  }

  if (tradingAccountsError) {
    return (
      <div className={styles.accountsWrapper}>
        <p style={{ color: '#ff4d4d', textAlign: 'center', padding: '2rem' }}>
          Error: {tradingAccountsError}
        </p>
      </div>
    );
  }

  const accountsData =
    tradingAccounts && tradingAccounts.length > 0 ? tradingAccounts : [];

  return (
    <>
      <div className={styles.accountsWrapper}>
        <div className={styles.accountsGrid}>
          {accountsData?.map((item, index) => (
            <div key={item?.id} className={styles.accountCard}>
              <div className={styles.headerAlignment}>
                <div className={styles.cardHeader}>
                  <p>Account No: {item?.accountId}</p>
                  <div
                    className={styles.editBtn}
                    onClick={() => {
                      setSelectedAccount(item);
                      setShowEditModal(true);
                    }}
                  >
                    <EditIcon />
                  </div>
                </div>
                <h3>
                  ${(item?.currentDeposit || 0).toLocaleString()}
                  <span className={styles.profitText}>
                    (+ ${(item?.currentDeposit || 0).toLocaleString()})
                  </span>
                </h3>
              </div>

              <div className={styles.cardDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Broker:</span>
                  <div className={styles.dots}></div>
                  <span className={styles.value}>
                    {typeof item?.broker === 'object'
                      ? item?.broker?.name
                      : item.broker || '-'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>Date Added:</span>
                  <div className={styles.dots}></div>
                  <span className={styles.value}>
                    {item.createdAt
                      ? moment(item?.createdAt).format('DD-MM-YYYY | hh:mm A')
                      : '-'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.label}>P&L:</span>
                  <div className={styles.dots}></div>
                  <span
                    className={styles.value}
                    style={{
                      color:
                        (item?.pnl || '0').toString().startsWith('+') ||
                        (item?.pnl || 0) >= 0
                          ? '#02DF82'
                          : '#FF4D4D',
                    }}
                  >
                    {item?.pnl || '0%'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        {accountsData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#fff' }}>
            <p>No trading accounts found</p>
          </div>
        )}
      </div>
      {showEditModal && selectedAccount && (
        <UseExisting
          isEdit
          account={selectedAccount}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
}
