import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { connectSocket, disconnectSocket, getSocket } from '../services/socketService';

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (isAuthenticated && token && !socketRef.current?.connected) {
      socketRef.current = connectSocket(token);
    }

    return () => {
      if (!isAuthenticated) {
        disconnectSocket();
      }
    };
  }, [token, isAuthenticated]);

  return socketRef.current;
};

