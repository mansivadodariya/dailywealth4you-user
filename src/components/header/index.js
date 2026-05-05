'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import styles from './header.module.scss';
import Mt5Account from '../modal/Mt5Account';
import EditProfile from '../modal/editProfile';
import ChangePassword from '../modal/changePassword';
import NotificationDropdown from '../notificationDropdown';
import DepositModal from '../modal/depositModal';
import WithdrawModal from '../modal/withdrawModal';
import {
  fetchTradingAccounts,
  setSelectedAccountId as setSelectedAccountIdAction,
} from '@/store/slice/accountSlice';
import { logout, fetchNotifications } from '@/store/slice/loginSlice';
import { getUserFromCookie, clearAuthCookies } from '@/service/cookies';

import AuthButton from '../authButton';

const BellIcon = '/assets/icons/bell.svg';
const UserIcon = '/assets/icons/userIcon.svg';
const moneyIcon = '/assets/icons/money.svg';
const PlusIcon = '/assets/icons/plus.svg';
const DownIcon = '/assets/icons/down.svg';
const EditIcon = '/assets/icons/editFile.svg';
const LockIcon = '/assets/icons/LookIcon.svg';
const LogoutIcon = '/assets/icons/logout.svg';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/profit-sharing': 'Profit Sharing',
  '/contact-us': 'Contact Us',
  '/transactions': 'Transactions',
  '/faqs': 'FAQs',
  '/tutorials': 'Tutorials',
  '/economic-calendar': 'Economic Calendar',
  '/recommended-broker': 'Recommended Brokers',
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
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [activeAccountBreadcrumb, setActiveAccountBreadcrumb] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const accountDropdownRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notifRef = useRef(null);

  const dispatch = useDispatch();
  const {
    tradingAccounts,
    tradingAccountsLoading,
    kycStatus,
    kycStatusLoading,
  } = useSelector((state) => state.account);
  const {  unreadCount } = useSelector((state) => state.login);
  const isDashboard = pathname === '/dashboard' || pathname === '/';
  const isAccountsPage = pathname === '/accounts';

  const cookieUser = getUserFromCookie();
 
    // console.log("cookieUser",cookieUser)
  const currentUser = cookieUser;

  const fullName =
    `${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() ||
    'User';
  const email = currentUser?.email || '';
  const isKycVerified = kycStatus === 'approved';

  // Resolve profile image — check all common field names the API might return
  const profileUrl =
  currentUser?.profileUrl && currentUser.profileUrl.trim() !== ''
    ? currentUser.profileUrl
    : null;
  

  // ── Account breadcrumb ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) =>
      setActiveAccountBreadcrumb(e.detail?.accountId || null);
    window.addEventListener('accountSelected', handler);
    return () => window.removeEventListener('accountSelected', handler);
  }, []);

  useEffect(() => {
    if (!isAccountsPage) setActiveAccountBreadcrumb(null);
  }, [isAccountsPage]);

  // ── Trading accounts ──────────────────────────────────────────────────────
  useEffect(() => {
    const u = getUserFromCookie();
    if (u?.id) dispatch(fetchTradingAccounts(u.id));
  }, [dispatch]);

  // ── Fetch initial notifications on mount ──────────────────────────────────
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // ── Outside click handler ─────────────────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        accountDropdownRef.current &&
        !accountDropdownRef.current.contains(e.target)
      ) {
        setIsAccountDropdownOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setIsProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (tradingAccounts?.length > 0) {
      const exists = tradingAccounts.find(
        (acc) => acc?.id === selectedAccountId
      );
      if (!exists) {
        const defaultId = tradingAccounts[0]?.id;
        setSelectedAccountId(defaultId);
        dispatch(setSelectedAccountIdAction(defaultId));
      }
    }
  }, [tradingAccounts, selectedAccountId]);

  const activeAccount =
    tradingAccounts?.find((acc) => acc?.id === selectedAccountId) ||
    tradingAccounts?.[0];
  const accountIdStr = activeAccount?.mt5LoginId || 'No Account';
  const brokerLogo = activeAccount?.broker?.logo || moneyIcon;

  const handleSelectAccount = (account) => {
    setSelectedAccountId(account?.id);
    dispatch(setSelectedAccountIdAction(account?.id));
    setIsAccountDropdownOpen(false);
  };

  const handleMt5ModalClose = () => {
    setIsMt5ModalOpen(false);
    const u = getUserFromCookie();
    if (u?.id) dispatch(fetchTradingAccounts(u.id));
  };

  const handleBellClick = () => {
    setIsNotifOpen((prev) => !prev);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    clearAuthCookies();
    router.push('/');
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          {isAccountsPage && activeAccountBreadcrumb ? (
            <h2>
              <span className={styles.breadcrumbBase}>Accounts</span>
              <span className={styles.breadcrumbSep}> › </span>
              <span className={styles.breadcrumbActive}>
                {activeAccountBreadcrumb}
              </span>
            </h2>
          ) : (
            <h2>{getTitleFromPath(pathname)}</h2>
          )}
        </div>

        <div className={styles.rightAlignment}>
          {/* Bell icon with badge + dropdown */}
          <div className={styles.bellContainer} ref={notifRef}>
            <div className={styles.bellWrapper} onClick={handleBellClick}>
              <img src={BellIcon} alt="Notifications" />
              {unreadCount > 0 && (
                <span className={styles.bellBadge}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            {isNotifOpen && (
              <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
            )}
          </div>

          <div className={styles.line} />

          {isDashboard && (
            <>
              {kycStatusLoading || tradingAccountsLoading ? (
                <div className={styles.accountBtnLoader}>
                  <span className={styles.accountBtnSpinner} />
                  <span className={styles.accountBtnLoaderText}>
                    Loading...
                  </span>
                </div>
              ) : tradingAccounts?.length > 0 ? (
                <div className={styles.accountSelectorWrapper}>
                  <div className={styles.accountSelector}>
                    <span className={styles.accountLabel}>Account:</span>
                    <div
                      className={styles.relativeContainer}
                      ref={accountDropdownRef}
                    >
                      <div
                        className={styles.accountDropdown}
                        onClick={() =>
                          setIsAccountDropdownOpen(!isAccountDropdownOpen)
                        }
                      >
                        <img
                          src={brokerLogo}
                          alt="Broker"
                          className={styles.brokerIcon}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = UserIcon;
                          }}
                        />
                        <span className={styles.accountIdText}>
                          {accountIdStr}
                        </span>
                        <img
                          src={DownIcon}
                          alt="Down"
                          className={`${styles.dropdownIcon} ${isAccountDropdownOpen ? styles.rotated : ''}`}
                        />
                      </div>

                      {isAccountDropdownOpen && tradingAccounts?.length > 0 && (
                        <div className={styles.dropdownMenuList}>
                          {tradingAccounts.map((account) => (
                            <div
                              key={account?.id}
                              className={styles.dropdownMenuItem}
                              onClick={() => handleSelectAccount(account)}
                            >
                              <img
                                src={account?.broker?.logo || UserIcon}
                                alt="Broker"
                                className={styles.brokerIcon}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = UserIcon;
                                }}
                              />
                              <span className={styles.accountIdText}>
                                {account?.mt5LoginId}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <AuthButton
                    icon={PlusIcon}
                    onClick={() => setIsMt5ModalOpen(true)}
                  />

                  {/* Deposit & Withdraw buttons */}
                  {/* <button
                    className={styles.txBtn}
                    onClick={() => setShowDepositModal(true)}
                  >
                    Deposit
                  </button>
                  <button
                    className={`${styles.txBtn} ${styles.txBtnOutline}`}
                    onClick={() => setShowWithdrawModal(true)}
                  >
                    Withdraw
                  </button> */}
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

          {/* Profile icon + dropdown */}
          <div className={styles.profileContainer} ref={profileMenuRef}>
            <div
              className={styles.profileTrigger}
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotifOpen(false);
              }}
            >
             
              <img
  src={profileUrl || UserIcon}
  alt={fullName}
  className={styles.profileImage}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = UserIcon;
  }}
/>
            </div>

            {isProfileMenuOpen && (
              <div className={styles.profileMenu}>
                <div className={styles.profileMenuHeader}>
                  <div className={styles.profileMenuInfo}>
                    <span className={styles.profileMenuName}>{fullName}</span>
                    <span className={styles.profileMenuEmail}>{email}</span>
                  </div>
                  {isKycVerified && (
                    <span className={styles.kycBadge}>KYC Verified</span>
                  )}
                </div>

                <div className={styles.profileMenuDivider} />

                <div
                  className={styles.profileMenuItem}
                  onClick={() => {
                    setShowEditProfile(true);
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <img
                    src={EditIcon}
                    alt=""
                    className={styles.menuItemIcon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span>Edit Profile</span>
                  <img
                    src={DownIcon}
                    alt=""
                    className={styles.menuItemArrow}
                    style={{ transform: 'rotate(-90deg)' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                <div
                  className={styles.profileMenuItem}
                  onClick={() => {
                    setShowChangePassword(true);
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <img
                    src={LockIcon}
                    alt=""
                    className={styles.menuItemIcon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span>Change Password</span>
                  <img
                    src={DownIcon}
                    alt=""
                    className={styles.menuItemArrow}
                    style={{ transform: 'rotate(-90deg)' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                <div className={styles.profileMenuItem} onClick={handleLogout}>
                  <img
                    src={LogoutIcon}
                    alt=""
                    className={styles.menuItemIcon}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span>Logout</span>
                  <img
                    src={DownIcon}
                    alt=""
                    className={styles.menuItemArrow}
                    style={{ transform: 'rotate(-90deg)' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {isMt5ModalOpen && <Mt5Account onClose={handleMt5ModalClose} />}
      {showEditProfile && (
        <EditProfile onClose={() => setShowEditProfile(false)} />
      )}
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
      {showDepositModal && (
        <DepositModal
          activeAccount={activeAccount}
          onClose={() => setShowDepositModal(false)}
        />
      )}
      {showWithdrawModal && (
        <WithdrawModal
          activeAccount={activeAccount}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  );
}
