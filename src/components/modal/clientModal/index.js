'use client';

import React, { useState } from 'react';
import styles from './clientModal.module.scss';
import moment from 'moment';

const DownIcon = '/assets/icons/down.svg';

export default function ClientModal({ client, onClose }) {
  const [expandedAccount, setExpandedAccount] = useState(null);

  if (!client) return null;

  const user = client?.user || client;
  const name = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || '—';
  const email = user?.email || '—';
  const dateReferred = client?.createdAt
    ? moment(client.createdAt).format('DD-MM-YYYY | hh:mm A')
    : '—';

  const accounts = client?.tradingAccount || [];

  const totalDeposit = accounts?.[0]?.totalDeposit ?? '—';

  const totalProfit = client?.totalProfit ?? '—';

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.modalTop}>
          <div className={styles.userInfo}>
            <h2 className={styles.name}>{name}</h2>
            <p className={styles.email}>{email}</p>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className={styles.divider} />

        {/* Details */}
        <div className={styles.body}>
          <div className={styles.detailBlock}>
            <span className={styles.detailLabel}>Date Reffred</span>
            <span className={styles.detailValue}>{dateReferred}</span>
          </div>

          <div className={styles.twoCol}>
            <div className={styles.detailBlock}>
              <span className={styles.detailLabel}>Total Deposit</span>
              <span className={styles.detailValueLarge}>
                {totalDeposit !== '—'
                  ? `$${Number(totalDeposit).toLocaleString()}`
                  : '—'}
              </span>
            </div>
            <div className={styles.detailBlock}>
              <span className={styles.detailLabel}>Profit</span>
              <span className={styles.detailValueLarge}>
                $
                {totalProfit !== '—'
                  ? Number(totalProfit).toLocaleString()
                  : '—'}
              </span>
            </div>
          </div>

          {/* MT5 Accounts */}
          {accounts.length > 0 && (
            <>
              <p className={styles.sectionTitle}>MT5 Accounts</p>
              <div className={styles.accountsList}>
                {accounts.map((account, idx) => {
                  const isExpanded = expandedAccount === idx;
                  const mt5LoginId =
                    account?.mt5LoginId;
                  const balance =
                    account?.currentDeposit ?? account?.balance ?? '—';
                  const broker =
                    typeof account?.broker === 'object'
                      ? account?.broker?.name
                      : account?.broker || account?.brokerName || '—';
                  const dateAdded = account?.createdAt
                    ? moment(account.createdAt).format('DD-MM-YYYY | hh:mm A')
                    : '—';
                  const pnl = account?.pnl ?? account?.totalProfit ?? '—';

                  return (
                    <div key={idx} className={styles.accountCard}>
                      {/* Account header row */}
                      <div
                        className={styles.accountHeader}
                        onClick={() =>
                          setExpandedAccount(isExpanded ? null : idx)
                        }
                      >
                        <div>
                          <p className={styles.accountNo}>
                            Account No: {mt5LoginId}
                          </p>
                          <h3 className={styles.accountBalance}>
                            $
                            {balance !== '—'
                              ? Number(balance).toLocaleString()
                              : '—'}
                          </h3>
                        </div>
                        <img
                          src={DownIcon}
                          alt="Toggle"
                          className={`${styles.chevron} ${isExpanded ? styles.chevronUp : ''}`}
                        />
                      </div>

                      {/* Expanded details */}
                      {isExpanded && (
                        <div className={styles.accountDetails}>
                          <div className={styles.detailRow}>
                            <span className={styles.rowLabel}>Broker:</span>
                            <div className={styles.dots} />
                            <span className={styles.rowValue}>{broker}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.rowLabel}>Date Added</span>
                            <div className={styles.dots} />
                            <span className={styles.rowValue}>{dateAdded}</span>
                          </div>
                          <div className={styles.detailRow}>
                            <span className={styles.rowLabel}>P&L</span>
                            <div className={styles.dots} />
                            <span
                              className={styles.rowValue}
                              style={{
                                color:
                                  String(pnl).startsWith('+') ||
                                  Number(pnl) >= 0
                                    ? '#02df82'
                                    : '#ff4d4d',
                              }}
                            >
                              {String(pnl).startsWith('+') ||
                              String(pnl).startsWith('-')
                                ? pnl
                                : `+${pnl}%`}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
