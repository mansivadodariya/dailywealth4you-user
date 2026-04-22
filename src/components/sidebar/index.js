'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './sidebar.module.scss';
import RightIcon from '@/icons/rightIcon';
const SidebarLogo = '/assets/logo/sidebar-logo.svg';
const DashboardIcon = '/assets/icons/dashboard.svg';
const AccountsIcon = '/assets/icons/Accounts.svg';
const IntoducingIcon = '/assets/icons/Intoducing.svg';
const TransactionsIcon = '/assets/icons/Transactions.svg';
const ContactIcon = '/assets/icons/Contact.svg';
const FaqIcon = '/assets/icons/Faq.svg';
const TutorialsIcon = '/assets/icons/Tutorials.svg';
const EconomicIcon = '/assets/icons/Economic.svg';
const OctafxIcon = '/assets/icons/octafx.svg';
const ExnessIcon = '/assets/icons/exness-sidebar.svg';
const OlymptradeIcon = '/assets/icons/olymptrade.svg';
const XmIcon = '/assets/icons/xm.svg';
const IgIcon = '/assets/icons/ig.svg';
const sidebarData = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: DashboardIcon,
    route: '/dashboard',
  },
  { id: 'accounts', label: 'Accounts', icon: AccountsIcon, route: '/accounts' },
  {
    id: 'introducing-broker',
    label: 'Introducing Broker',
    icon: IntoducingIcon,
    route: '/profit-sharing',
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: TransactionsIcon,
    route: '/transactions',
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
    icon: TutorialsIcon,
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
  const [activeTab, setActiveTab] = React.useState('dashboard');

  // Set active tab based on current route
  useEffect(() => {
    const activeItem =
      sidebarData.find((item) => pathname.includes(item.id)) || sidebarData[0];
    setActiveTab(activeItem.id);
  }, [pathname]);

  const handleNavigation = (route) => {
    router.push(route);
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
          {sidebarData.map((item) => (
            <div
              key={item?.id}
              className={`${styles.menu} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => handleNavigation(item?.route)}
            >
              <div className={styles.leftAlignment}>
                <img src={item?.icon} alt={item?.label} />
                <span>{item?.label}</span>
              </div>
              <div className={styles.rightAlignment}>
                <RightIcon />
              </div>
            </div>
          ))}
          <div className={styles.line}></div>
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
