// import { io } from 'socket.io-client';
// import { getTokenFromCookie } from '@/service/cookies';

// const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
// let socket = null;

// const createSocket = () => {
//   if (typeof window === 'undefined') return null;

//   const token = getTokenFromCookie();
//    console.log(token)
//   if (!token || !SOCKET_URL) return null;

//   if (socket && socket.connected) {
//     return socket;
//   }

//   socket = io(SOCKET_URL, {
//     transports: ['websocket'],
//     extraHeaders: {
//       authorization: token,
//       'ngrok-skip-browser-warning': '1234',
//     },
//   });

//   return socket;
// };

// export const connectSocket = () => {
//   if (socket && socket.connected) {
//     return socket;
//   }
//   return createSocket();
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };

import socketIOClient from 'socket.io-client';
import config from '@/config';
import { getTokenFromCookie } from './cookies';

const localdata = getTokenFromCookie();

const SOCKET_URL = config?.APP_SOCKET_URL;

let socket = null;

if (localdata) {
  socket = socketIOClient(SOCKET_URL, {
    extraHeaders: {
      authorization: localdata,
      'ngrok-skip-browser-warning': '1234',
    },
  });
}

export const connectSocket = () => {
  if (localdata) {
    socket = socketIOClient(SOCKET_URL, {
      extraHeaders: {
        ['authorization']: localdata,
        'ngrok-skip-browser-warning': '1234',
      },
    });
  }
};

export const getSocket = () => {
  // return socket;
};
