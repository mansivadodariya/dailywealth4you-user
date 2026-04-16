import React from 'react'
import styles from './header.module.scss';
import AuthButton from '../authButton';
const BellIcon = '/assets/icons/bell.svg';
const UserIcon = '/assets/icons/user.svg';
export default function Header() {
    return (
        <header className={styles.header}>
            <h2>
                Dashboard
            </h2>
            <div className={styles.rightAlignment}>
                <img src={BellIcon} alt='BellIcon' />
                <div className={styles.line}></div>
                <AuthButton text='Add MT5 Account' />
                <img src={UserIcon} alt='UserIcon' />
            </div>
        </header>
    )
}
