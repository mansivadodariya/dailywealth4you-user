'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket } from '@/service/socket';
import { addNotification, fetchNotifications } from '@/store/slice/loginSlice';
import { getTokenFromCookie } from '@/service/cookies';
import toast from 'react-hot-toast';

/**
 * Mounts once in the user layout.
 * Connects the socket, listens for check-notification on every page,
 * and cleans up on unmount (logout / session end).
 */
export default function SocketProvider() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (!token) return;

    // Fetch existing notifications on mount
    dispatch(fetchNotifications());

    // Connect socket with auth token
    const socket = connectSocket(token);

    // Listen for real-time notifications from backend
    socket.on('check-notification', (data) => {
      dispatch(addNotification(data));
      toast(data?.message || data?.title || 'New notification', {
        icon: '🔔',
        style: {
          background: '#0a1a1a',
          color: '#fafafa',
          border: '1px solid rgba(255,255,255,0.1)',
          fontFamily: 'var(--font-manrope)',
          fontSize: '14px',
        },
      });
    });

    return () => {
      // Remove only this listener — don't disconnect the socket
      // (disconnectSocket is called on logout in the Header)
      socket.off('check-notification');
    };
  }, [dispatch]);

  // Renders nothing — purely side-effect
  return null;
}
