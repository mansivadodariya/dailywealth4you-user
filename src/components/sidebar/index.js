'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import styles from './sidebar.module.scss';
import RightIcon from '@/icons/rightIcon';
import { fetchIbUserRequest } from '@/store/slice/ibUserSlice';
import { getUserFromCookie } from '@/service/cookies';

const SidebarLogo = '/assets/logo/sidebar-logo.svg';
const DashboardIcon = '/assets/icons/dashboard.svg';
const AccountsIcon = '/assets/icons/Accounts.svg';
const IntoducingIcon = '/assets/icons/Intoducing.svg';
const Deposite = '/assets/icons/deposite.svg';
const withdrawal = '/assets/icons/withdrawal.svg';
const ContactIcon = '/assets/icons/Contact.svg';
const FaqIcon = '/assets/icons/Faq.svg';
const RecommendedBrokers = '/assets/icons/RecommendedBroker (2).svg';
const Tutorial = '/assets/icons/Tutorial.svg';
const EconomicIcon = '/assets/icons/Economic.svg';
const OctafxIcon = '/assets/icons/octafx.svg';
const ExnessIcon = '/assets/icons/exness-sidebar.svg';
const OlymptradeIcon = '/assets/icons/olymptrade.svg';
const XmIcon = '/assets/icons/xm.svg';
const IgIcon = '/assets/icons/ig.svg';
const MyClientsIcon = '/assets/icons/MyClient.svg';
const ProfitSharingIcon = '/assets/icons/ProfitSharing.svg';
const IbIncomeIcon = '/assets/icons/IBIncome.svg';
const TransactionsIcon = '/assets/icons/Transactions.svg';

const topMenuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    route: '/dashboard',
  },
  { id: 'accounts', label: 'Accounts', icon: AccountsIcon, route: '/accounts' },
];

const bottomMenuItems = [
  {
    id: 'recommended-brokers',
    label: 'Recommended Brokers',
    icon: RecommendedBrokers,
    route: '/recommended-brokers',
  },
  {
    id: 'contact-us',
    label: 'Contact Us',
    icon: ContactIcon,
    route: '/contact-us',
  },
  { id: 'faqs', label: 'FAQs', icon: FaqIcon, route: '/faqs' },
  {
    id: 'tutorials',
    label: 'Tutorials',
    icon: Tutorial,
    route: '/tutorials',
  },
  {
    id: 'economic-Calendar',
    label: 'Economic Calendar',
    icon: EconomicIcon,
    route: '/economic-Calendar',
  },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { ibRequestStatus } = useSelector((state) => state.ibUser);
  const isIbApproved = ibRequestStatus === 'approved';

  // Introducing Broker sub-menu open state
  const isIbRoute = pathname.startsWith('/introducing-broker');
  const isTransactionsRoute = pathname.startsWith('/transactions');
  const [ibExpanded, setIbExpanded] = useState(isIbRoute);
  const [txExpanded, setTxExpanded] = useState(isTransactionsRoute);

  useEffect(() => {
    const user = getUserFromCookie();
    if (user?.id) {
      dispatch(fetchIbUserRequest(user.id));
    }
  }, [dispatch]);

  // Auto-expand IB menu when on an IB route
  useEffect(() => {
    if (isIbRoute) setIbExpanded(true);
  }, [isIbRoute]);

  useEffect(() => {
    if (isTransactionsRoute) setTxExpanded(true);
  }, [isTransactionsRoute]);

  const navigate = (route) => router.push(route);

  const isActive = (id) => {
    if (id === 'introducing-broker') return isIbRoute;
    if (id === 'transactions') return isTransactionsRoute;
    return pathname.includes(id);
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoimage}>
          <img src={SidebarLogo} alt="SidebarLogo" />
        </div>
      </div>

      <div className={styles.scroll}>
        <div className={styles.sidebarBody}>
          {/* Top items: Dashboard, Accounts */}
          {topMenuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menu} ${isActive(item.id) ? styles.active : ''}`}
              onClick={() => navigate(item.route)}
            >
              <div className={styles.leftAlignment}>
                <img src={item.icon} alt={item.label} />
                <span>{item.label}</span>
              </div>
              <div className={styles.rightAlignment}>
                <RightIcon />
              </div>
            </div>
          ))}

          {/* Introducing Broker — expandable */}
          <div
            className={`${styles.menu} ${isActive('introducing-broker') ? styles.active : ''}`}
            onClick={() => {
              if (isIbApproved) {
                // Toggle sub-menu when approved
                setIbExpanded((prev) => !prev);
              } else {
                // Navigate to IB page when not approved
                navigate('/introducing-broker');
              }
            }}
          >
            <div className={styles.leftAlignment}>
              <img src={IntoducingIcon} alt="Introducing Broker" />
              <span>Introducing Broker</span>
            </div>
            <div className={styles.rightAlignment}>
              {isIbApproved ? (
                <span
                  className={`${styles.chevron} ${ibExpanded ? styles.chevronUp : ''}`}
                >
                  <RightIcon />
                </span>
              ) : (
                <RightIcon />
              )}
            </div>
          </div>

          {/* Sub-items — only shown when IB is approved and expanded */}
          {isIbApproved && ibExpanded && (
            <div className={styles.subMenu}>
              {/* My Clients */}
              <div
                className={`${styles.subMenuItem} ${pathname === '/introducing-broker/my-clients' ? styles.subMenuItemActive : ''}`}
                onClick={() => navigate('/introducing-broker/my-clients')}
              >
                <div className={styles.subMenuConnector} />
                <div className={styles.subMenuLeft}>
                  <img src={MyClientsIcon} alt="My Clients" />
                  <span>My Clients</span>
                </div>
                <div className={styles.rightAlignment}>
                  <RightIcon />
                </div>
              </div>

              {/* Profit Sharing */}
              <div
                className={`${styles.subMenuItem} ${pathname === '/introducing-broker/profit-sharing' ? styles.subMenuItemActive : ''}`}
                onClick={() => navigate('/introducing-broker/profit-sharing')}
              >
                <div className={styles.subMenuConnector} />
                <div className={styles.subMenuLeft}>
                  <img src={ProfitSharingIcon} alt="Profit Sharing" />
                  <span>Profit Sharing</span>
                </div>
                <div className={styles.rightAlignment}>
                  <RightIcon />
                </div>
              </div>

              {/* IB Income */}
              <div
                className={`${styles.subMenuItem} ${pathname === '/introducing-broker/ib-income' ? styles.subMenuItemActive : ''}`}
                onClick={() => navigate('/introducing-broker/ib-income')}
              >
                <div className={styles.subMenuConnector} />
                <div className={styles.subMenuLeft}>
                  <img src={IbIncomeIcon} alt="IB Income" />
                  <span>IB Income</span>
                </div>
                <div className={styles.rightAlignment}>
                  <RightIcon />
                </div>
              </div>
            </div>
          )}

          {/* Transactions — expandable */}
          <div
            className={`${styles.menu} ${isActive('transactions') ? styles.active : ''}`}
            onClick={() => setTxExpanded((prev) => !prev)}
          >
            <div className={styles.leftAlignment}>
              <img src={TransactionsIcon} alt="Transactions" />
              <span>Transactions</span>
            </div>
            <div className={styles.rightAlignment}>
              <span
                className={`${styles.chevron} ${txExpanded ? styles.chevronUp : ''}`}
              >
                <RightIcon />
              </span>
            </div>
          </div>

          {txExpanded && (
            <div className={styles.subMenu}>
              <div
                className={`${styles.subMenuItem} ${pathname === '/transactions/withdrawals' ? styles.subMenuItemActive : ''}`}
                onClick={() => navigate('/transactions/withdrawals')}
              >
                <div className={styles.subMenuConnector} />
                <div className={styles.subMenuLeft}>
                  <img src={withdrawal} alt="Withdrawals" />
                  <span>Withdrawals</span>
                </div>
                <div className={styles.rightAlignment}>
                  <RightIcon />
                </div>
              </div>

              <div
                className={`${styles.subMenuItem} ${pathname === '/transactions/deposits' ? styles.subMenuItemActive : ''}`}
                onClick={() => navigate('/transactions/deposits')}
              >
                <div className={styles.subMenuConnector} />
                <div className={styles.subMenuLeft}>
                  <img src={Deposite} alt="Deposits" />
                  <span>Deposits</span>
                </div>
                <div className={styles.rightAlignment}>
                  <RightIcon />
                </div>
              </div>
            </div>
          )}

          {/* Bottom items */}
          {bottomMenuItems.map((item) => (
            <div
              key={item.id}
              className={`${styles.menu} ${isActive(item.id) ? styles.active : ''}`}
              onClick={() => navigate(item.route)}
            >
              <div className={styles.leftAlignment}>
                <img src={item.icon} alt={item.label} />
                <span>{item.label}</span>
              </div>
              <div className={styles.rightAlignment}>
                <RightIcon />
              </div>
            </div>
          ))}

          <div className={styles.line} />
        </div>

        <div className={styles.sidebarFooter}>
          <p>Recommended Brokers</p>
          <div className={styles.allgrid}>
            <div className={styles.grid}>
              <img src={OctafxIcon} alt="OctafxIcon" />
              <img src={ExnessIcon} alt="ExnessIcon" />
            </div>
            <div className={styles.grid}>
              <img src={OlymptradeIcon} alt="OlymptradeIcon" />
            </div>
            <div className={styles.grid}>
              <img src={XmIcon} alt="XmIcon" />
              <img src={IgIcon} alt="IgIcon" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
