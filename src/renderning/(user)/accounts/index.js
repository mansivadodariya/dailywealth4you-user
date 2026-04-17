import React from 'react'
import styles from './accounts.module.scss';
import EditIcon from '@/icons/editIcon';


const accountsData = [
    {
        accountNo: '123456789',
        balance: 12894,
        profit: 12452,
        broker: 'Skyriss',
        dateAdded: '14-05-2026 | 10:22 PM',
        pnl: '+36%'
    },
    {
        accountNo: '123456789',
        balance: 12894,
        profit: 12452,
        broker: 'Skyriss',
        dateAdded: '14-05-2026 | 10:22 PM',
        pnl: '+36%'
    },
    {
        accountNo: '123456789',
        balance: 12894,
        profit: 12452,
        broker: 'Skyriss',
        dateAdded: '14-05-2026 | 10:22 PM',
        pnl: '+36%'
    },
];

export default function Accounts() {
    return (
        <div className={styles.accountsWrapper}>
            <div className={styles.accountsGrid}>
                {accountsData.map((item, index) => (
                    <div key={index} className={styles.accountCard}>
                        <div className={styles.headerAlignment}>
                            <div className={styles.cardHeader}>
                                <p>
                                    Account No: {item.accountNo}
                                </p>
                                <div className={styles.editBtn}>
                                    <EditIcon />
                                </div>
                            </div>
                            <h3>
                                ${item.balance.toLocaleString()}
                                <span className={styles.profitText}>(+ ${item.profit.toLocaleString()})</span>
                            </h3>
                        </div>

                        <div className={styles.cardDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Broker:</span>
                                <div className={styles.dots}></div>
                                <span className={styles.value}>{item.broker}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Date Added:</span>
                                <div className={styles.dots}></div>
                                <span className={styles.value}>{item.dateAdded}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>P&L:</span>
                                <div className={styles.dots}></div>
                                <span className={styles.value} style={{ color: item.pnl.startsWith('+') ? '#02DF82' : '#FF4D4D' }}>
                                    {item.pnl}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

