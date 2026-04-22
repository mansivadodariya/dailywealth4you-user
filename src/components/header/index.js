'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './header.module.scss';
import AuthButton from '../authButton';
import Mt5Account from '../modal/Mt5Account';

const BellIcon = '/assets/icons/bell.svg';
const UserIcon = '/assets/icons/user.svg';
const PlusIcon = '/assets/icons/plus.svg';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/accounts': 'Accounts',
  '/profit-sharing': 'Profit Sharing',
  '/contact-us': 'Contact Us',
  '/transactions': 'Transactions',
  '/faqs': 'FAQs',
  '/tutorials': 'Tutorials',
  '/economic-calendar': 'Economic Calendar',
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
  const pathname = usePathname();
  const pageTitle = getTitleFromPath(pathname);

  return (
    <>
      <header className={styles.header}>
        <h2>{pageTitle}</h2>
        <div className={styles.rightAlignment}>
          <img src={BellIcon} alt="BellIcon" />
          <div className={styles.line}></div>
          <AuthButton
            text="Add MT5 Account"
            icon={PlusIcon}
            onClick={() => setIsMt5ModalOpen(true)}
          />
          <img src={UserIcon} alt="UserIcon" />
        </div>
      </header>

      {/* Render Modal conditionally */}
      {isMt5ModalOpen && (
        <Mt5Account onClose={() => setIsMt5ModalOpen(false)} />
      )}
    </>
  );
}
