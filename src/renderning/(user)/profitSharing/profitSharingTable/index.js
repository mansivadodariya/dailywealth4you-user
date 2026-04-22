'use client';
import React, { useState } from 'react';
import styles from './profitSharingTable.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

const tableData = [
  {
    id: 1,
    date: '24-12-2026 | 10:12 PM',
    name: 'Virat Kohli',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Exness',
    commission: '$10',
    details: Array(10).fill({
      orderId: '123456',
      mt5Account: '123456789',
      symbol: 'XAUUSD',
      lots: '0.20',
      pnl: '+$14.50',
      commission: '$1',
    }),
  },
  {
    id: 2,
    date: '24-12-2026 | 10:12 PM',
    name: 'Virat Kohli',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'IG Markets',
    commission: '$10',
  },
  {
    id: 3,
    date: '24-12-2026 | 10:12 PM',
    name: 'Devdutt Paddikal',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Exness',
    commission: '$10',
  },
  {
    id: 4,
    date: '24-12-2026 | 10:12 PM',
    name: 'Rajat Patidar',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Paperboat',
    commission: '$10',
  },
  {
    id: 5,
    date: '24-12-2026 | 10:12 PM',
    name: 'Tim David',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Paperboat',
    commission: '$10',
  },
  {
    id: 6,
    date: '24-12-2026 | 10:12 PM',
    name: 'Romario Shepherd',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Exness',
    commission: '$10',
  },
  {
    id: 7,
    date: '24-12-2026 | 10:12 PM',
    name: 'Krunal Pandya',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Paperboat',
    commission: '$10',
  },
  {
    id: 8,
    date: '24-12-2026 | 10:12 PM',
    name: 'Josh Hazelwood',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Exness',
    commission: '$10',
  },
  {
    id: 9,
    date: '24-12-2026 | 10:12 PM',
    name: 'Suyash Sharma',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'IG Markets',
    commission: '$10',
  },
  {
    id: 10,
    date: '24-12-2026 | 10:12 PM',
    name: 'Bhuvneshwar Kumar',
    email: 'mail@mail.com',
    lots: 120,
    broker: 'Paperboat',
    commission: '$10',
  },
];

export default function ProfitSharingTable() {
  const [expandedId, setExpandedId] = useState(1);

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className={styles.profitSharingTable}>
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Email</th>
              <th>Lots</th>
              <th>Broker</th>
              <th>Commission</th>
              <th className={styles.textCenter}>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <React.Fragment key={row.id}>
                <tr className={expandedId === row.id ? styles.activeRow : ''}>
                  <td>{row.date}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.lots}</td>
                  <td>{row.broker}</td>
                  <td>{row.commission}</td>
                  <td className={styles.textCenter}>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleToggle(row.id)}
                    >
                      {expandedId === row.id ? 'Close' : 'View'}
                    </button>
                  </td>
                </tr>
                <AnimatePresence>
                  {expandedId === row.id && row.details && (
                    <tr className={styles.detailsRow}>
                      <td colSpan="7">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                          className={styles.detailsWrapper}
                        >
                          <div className={styles.innerTableContainer}>
                            <div className={styles.innerHeader}>
                              <div>Order ID</div>
                              <div>MT5 Account</div>
                              <div>Symbol</div>
                              <div>Lots</div>
                              <div>P&L</div>
                              <div>Commission</div>
                            </div>
                            <div className={styles.innerBody}>
                              {row.details.map((detail, index) => (
                                <div className={styles.innerRow} key={index}>
                                  <div>{detail.orderId}</div>
                                  <div>{detail.mt5Account}</div>
                                  <div>
                                    <span className={styles.symbolBadge}>
                                      {detail.symbol}
                                    </span>
                                  </div>
                                  <div>{detail.lots}</div>
                                  <div>
                                    <span className={styles.pnlBadge}>
                                      {detail.pnl}
                                    </span>
                                  </div>
                                  <div>{detail.commission}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
