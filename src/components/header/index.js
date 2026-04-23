'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import styles from './header.module.scss';
import Mt5Account from '../modal/Mt5Account';
import { fetchTradingAccounts } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import AuthButton from '../authButton';

const BellIcon = '/assets/icons/bell.svg';
const UserIcon = '/assets/icons/user.svg';
const PlusIcon = '/assets/icons/plus.svg';
const DownIcon = '/assets/icons/down.svg';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/profit-sharing': 'Profit Sharing',
  '/contact-us': 'Contact Us',
  '/transactions': 'Transactions',
  '/faqs': 'FAQs',
  '/tutorials': 'Tutorials',
  '/economic-calendar': 'Economic Calendar',
  '/recommended-brokers': 'Recommended Brokers',
  '/recommended-Brokers': 'Recommended Brokers',
  '/introducing-broker': 'Introducing Broker',
};

function getTitleFromPath(pathname) {
  if (!pathname) return 'Dashboard';
  if (routeTitles[pathname]) return routeTitles[pathname];

  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return 'Dashboard';

  return parts[parts.length - 1]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function Header() {
  const [isMt5ModalOpen, setIsMt5ModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  const pathname = usePathname();
  const pageTitle = getTitleFromPath(pathname);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const { tradingAccounts } = useSelector((state) => state.account);
  const isDashboard = pathname === '/dashboard' || pathname === '/';

  useEffect(() => {
    const user = getUserFromCookie();
    if (user?.id) {
      dispatch(fetchTradingAccounts(user.id));
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  useEffect(() => {
    if (tradingAccounts && tradingAccounts.length > 0) {
      const exists = tradingAccounts.find(
        (acc) => acc?.id === selectedAccountId
      );
      if (!exists) {
        setSelectedAccountId(tradingAccounts[0]?.id);
      }
    }
  }, [tradingAccounts, selectedAccountId]);

  const activeAccount =
    tradingAccounts?.find((acc) => acc?.id === selectedAccountId) ||
    tradingAccounts?.[0];
  const accountIdStr = activeAccount?.accountId || 'No Account';
  const brokerLogo = activeAccount?.broker?.logo || '/assets/icons/user.svg';

  const handleSelectAccount = (account) => {
    setSelectedAccountId(account?.id);
    setIsDropdownOpen(false);
  };

  const handleMt5ModalClose = () => {
    setIsMt5ModalOpen(false);
    // Refetch accounts after modal closes (in case new account was added)
    const user = getUserFromCookie();
    if (user?.id) {
      dispatch(fetchTradingAccounts(user.id));
    }
  };

  return (
    <>
      <header className={styles.header}>
        <h2>{pageTitle}</h2>
        <div className={styles.rightAlignment}>
          <img src={BellIcon} alt="BellIcon" />
          <div className={styles.line}></div>

          {isDashboard && (
            <>
              {tradingAccounts?.length > 0 ? (
                <div className={styles.accountSelectorWrapper}>
                  <div className={styles.accountSelector}>
                    <span className={styles.accountLabel}>Account:</span>
                    <div className={styles.relativeContainer} ref={dropdownRef}>
                      <div
                        className={styles.accountDropdown}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        <img
                          src={brokerLogo}
                          alt="Broker"
                          className={styles.brokerIcon}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/icons/user.svg';
                          }}
                        />
                        <span className={styles.accountIdText}>
                          {accountIdStr}
                        </span>
                        <img
                          src={DownIcon}
                          alt="Down"
                          className={`${styles.dropdownIcon} ${isDropdownOpen ? styles.rotated : ''}`}
                        />
                      </div>

                      {isDropdownOpen &&
                        tradingAccounts &&
                        tradingAccounts.length > 0 && (
                          <div className={styles.dropdownMenuList}>
                            {tradingAccounts?.map((account) => (
                              <div
                                key={account?.id}
                                className={styles.dropdownMenuItem}
                                onClick={() => handleSelectAccount(account)}
                              >
                                <img
                                  src={
                                    account?.broker?.logo ||
                                    '/assets/icons/user.svg'
                                  }
                                  alt="Broker"
                                  className={styles.brokerIcon}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/icons/user.svg';
                                  }}
                                />
                                <span className={styles.accountIdText}>
                                  {account?.accountId}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Plus button next to account dropdown */}
                  {/* <button
                    className={styles.plusBtn}
                    onClick={() => setIsMt5ModalOpen(true)}
                    aria-label="Add MT5 Account"
                  >
                    <img src={PlusIcon} alt="Add"  width={200} />
                  </button> */}
                  <AuthButton
                    // text="Add MT5 Account"
                    icon={PlusIcon}
                    onClick={() => setIsMt5ModalOpen(true)}
                  />
                </div>
              ) : (
                <AuthButton
                  text="Add MT5 Account"
                  icon={PlusIcon}
                  onClick={() => setIsMt5ModalOpen(true)}
                />
              )}
            </>
          )}

          <img src={UserIcon} alt="UserIcon" />
        </div>
      </header>

      {isMt5ModalOpen && <Mt5Account onClose={handleMt5ModalClose} />}
    </>
  );
}
