import { api } from './api';
import type { CommunityPost, Comment, ModuleAccess } from '@/shared/types';

export const communityService = {
  getPosts: async (module?: ModuleAccess): Promise<CommunityPost[]> => {
    const params = module ? `?module=${module}` : '';
    const response = await api.get<CommunityPost[]>(`/api/community/posts${params}`);
    return response.data;
  },

  createPost: async (content: string, module: ModuleAccess): Promise<CommunityPost> => {
    const response = await api.post<CommunityPost>('/api/community/posts', { content, module });
    return response.data;
  },

  likePost: async (postId: string): Promise<void> => {
    await api.post(`/api/community/posts/${postId}/like`);
  },

  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/api/community/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const response = await api.post<Comment>(`/api/community/posts/${postId}/comments`, { content });
    return response.data;
  },
};

