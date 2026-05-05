import { io } from 'socket.io-client';
import { getTokenFromCookie } from '@/service/cookies';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
let socket = null;

const createSocket = () => {
  if (typeof window === 'undefined') return null;

  const token = getTokenFromCookie();
  if (!token || !SOCKET_URL) return null;

  if (socket && socket.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    extraHeaders: {
      authorization: token,
      'ngrok-skip-browser-warning': '1234',
    },
  });

  return socket;
};

export const connectSocket = () => {
  if (socket && socket.connected) {
    return socket;
  }
  return createSocket();
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
