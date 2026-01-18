import { api } from './api';
import type { PassionConnectProfile, Connection } from '@/shared/types';

export const connectService = {
  getProfile: async (): Promise<PassionConnectProfile | null> => {
    const response = await api.get<PassionConnectProfile | null>('/api/connect/profile');
    return response.data;
  },

  createOrUpdateProfile: async (profile: Partial<PassionConnectProfile>): Promise<PassionConnectProfile> => {
    const response = await api.post<PassionConnectProfile>('/api/connect/profile', profile);
    return response.data;
  },

  discover: async (): Promise<PassionConnectProfile[]> => {
    const response = await api.get<PassionConnectProfile[]>('/api/connect/discover');
    return response.data;
  },

  swipe: async (profileId: string, action: 'like' | 'pass'): Promise<{ connected: boolean; message: string }> => {
    const response = await api.post<{ connected: boolean; message: string }>('/api/connect/swipe', {
      profileId,
      action,
    });
    return response.data;
  },

  getConnections: async (): Promise<Connection[]> => {
    const response = await api.get<Connection[]>('/api/connect/connections');
    return response.data;
  },
};

