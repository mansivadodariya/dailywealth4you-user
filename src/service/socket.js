// import config from '@/config';
// import { io } from 'socket.io-client';

// let socket = null;

// export function getSocket() {
//   return socket;
// }

// export function connectSocket(token) {
//   if (socket) return socket; // ← instance check, not connected check

//   const baseUrl = config?.APP_SOCKET_URL;

//   socket = io(baseUrl, {
//     auth: { token },
//     transports: ['websocket', 'polling'], // ← fallback added
//     reconnectionAttempts: 5,
//     reconnectionDelay: 2000,
//   });

//   socket.on('connect', () => {
//     console.log('[Socket] Connected:', socket.id);
//   });

//   socket.on('disconnect', (reason) => {
//     console.log('[Socket] Disconnected:', reason);
//     // Auto reconnect nahi kar raha toh manually handle karo
//     if (reason === 'io server disconnect') {
//       socket.connect(); // server ne disconnect kiya toh reconnect karo
//     }
//   });

//   socket.on('connect_error', (err) => {
//     console.warn('[Socket] Connection error:', err.message);
//   });

//   return socket;
// }

// export function disconnectSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }
