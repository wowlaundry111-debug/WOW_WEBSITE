import { io } from 'socket.io-client';
import { BASE_URL } from './api';

const socketUrl = BASE_URL.replace('/api', '');

export const socket = io(socketUrl, {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
