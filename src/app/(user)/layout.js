'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Header from '@/components/header';
import KycGuard from '@/components/kycGuard';
import Sidebar from '@/components/sidebar';
import {
  getTokenFromCookie,
  getUserFromCookie,
  clearAuthCookies,
  getCookie,
} from '@/service/cookies';
import { connectSocket, disconnectSocket, getSocket } from '@/service/socket';
import { fetchNotifications } from '@/store/slice/loginSlice';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function layout({ children }) {
      const [toogle, setToogle] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  // Check authentication on mount and route changes
  useEffect(() => {
    const checkAuth = () => {
      const userToken = getCookie('auth_token');
      const user = getCookie('auth_user');

      if (!userToken || !user) {
        toast.error('Please login to access this page');
        window.location.href = '/';
        return;
      }
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
    // clearSearch();
  }, [pathname, router]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const userToken = getCookie('userToken');
      const user = getCookie('user');

      if (!userToken || !user) {
        window.location.href = '/';
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [router]);

  // Fetch notifications on auth
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchNotifications());
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!isAuthenticated) return;

    connectSocket();
    const socket = getSocket();

    const handleCheckNotification = (data) => {
      // Re-fetch notifications to keep Redux store in sync
      dispatch(fetchNotifications());
    };

    if (socket) {
      const handleConnect = () => {
        socket.emit("check-notification", {});
      };

      socket.on("connect", handleConnect);
      socket.on("check-notification", handleCheckNotification);

      // Also listen to the other events for compatibility
      socket.on('notification-count', handleCheckNotification);
      socket.on('get-count', handleCheckNotification);

      if (socket.connected) {
        handleConnect();
      }

      return () => {
        socket.off("connect", handleConnect);
        socket.off("check-notification", handleCheckNotification);
        socket.off('notification-count', handleCheckNotification);
        socket.off('get-count', handleCheckNotification);
      };
    }
  }, [isAuthenticated, dispatch]);

  // Show loading or redirect if not authenticated
  if (isLoading || !isAuthenticated) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030f0f',
        zIndex: 9999
      }}>
        <Loader/>
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
