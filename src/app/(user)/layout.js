'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import {
  getCookie,
} from '@/service/cookies';
import { connectSocket, getSocket } from '@/service/socket';
import { fetchNotifications } from '@/store/slice/loginSlice';
import { fetchAllDocument } from '@/store/slice/accountSlice';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { kycStatus, kycStatusLoading } = useSelector((state) => state.account);
  const user = useSelector((state) => state.login.user);

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

  // Fetch KYC status on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (kycStatus === undefined && !kycStatusLoading) {
      const cookieUser = getCookie('auth_user');
      const userId = user?.id || user?._id || cookieUser?.id || cookieUser?._id;
      if (userId) {
        dispatch(fetchAllDocument(userId));
      }
    }
  }, [isAuthenticated, kycStatus, kycStatusLoading, user, dispatch]);

  // Fetch notifications on auth
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(fetchNotifications());
  }, [isAuthenticated, dispatch]);

  // Socket connection for notifications
  useEffect(() => {
    if (!isAuthenticated) return;

    connectSocket();
    const socket = getSocket();

    const handleCheckNotification = () => {
      dispatch(fetchNotifications());
    };

    if (socket) {
      const handleConnect = () => {
        socket.emit("check-notification", {});
      };

      socket.on("connect", handleConnect);
      socket.on("check-notification", handleCheckNotification);
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

  // KYC-based route restriction
  useEffect(() => {
    if (!isAuthenticated || kycStatusLoading || kycStatus === undefined) return;

    // Allow performance-dashboard for all authenticated users
    if (pathname === '/performance-dashboard') return;

    // If KYC is not approved, silently redirect to performance dashboard
    if (kycStatus !== 'approved') {
      router.push('/performance-dashboard');
    }
  }, [isAuthenticated, kycStatus, kycStatusLoading, pathname, router]);

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
    <div className="user-layout">
      <div className="user-layout-sidebar">
        <Sidebar />
      </div>
      <div className="user-layout-children">
        <Header />
        <div className="user-layout-children-content">{children}</div>
      </div>
    </div>
  );
}
