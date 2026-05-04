'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Header from '@/components/header';
import KycGuard from '@/components/kycGuard';
import Sidebar from '@/components/sidebar';
import { getTokenFromCookie, getUserFromCookie, clearAuthCookies } from '@/service/cookies';
import { connectSocket, disconnectSocket, getSocket } from '@/service/socket';
import { fetchNotifications } from '@/store/slice/loginSlice';
import toast from 'react-hot-toast';

export default function layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getTokenFromCookie();
    const user = getUserFromCookie();

    if (!token || !user) {
      clearAuthCookies();
      toast.error('Please login to access this page');
      router.replace('/');
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [pathname, router]);

  useEffect(() => {
    const handlePopState = () => {
      const token = getTokenFromCookie();
      const user = getUserFromCookie();

      if (!token || !user) {
        disconnectSocket();
        clearAuthCookies();
        router.replace('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchNotifications());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const socket = connectSocket();
    if (!socket) return;

    const refreshNotifications = () => {
      dispatch(fetchNotifications());
    };

    const handleConnect = () => {
      socket.emit('check-notification', {});
    };

    socket.on('connect', handleConnect);
    socket.on('check-notification', refreshNotifications);
    socket.on('notification-count', refreshNotifications);
    socket.on('get-count', refreshNotifications);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('check-notification', refreshNotifications);
      socket.off('notification-count', refreshNotifications);
      socket.off('get-count', refreshNotifications);
    };
  }, [isAuthenticated, dispatch]);

  if (isLoading) {
    return (
      <div className="user-layout-loading">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <KycGuard>
      <div className="user-layout">
        <div className="user-layout-sidebar">
          <Sidebar />
        </div>
        <div className="user-layout-children">
          <Header />
          <div className="user-layout-children-content">{children}</div>
        </div>
      </div>
    </KycGuard>
  );
}
