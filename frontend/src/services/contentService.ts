import { api } from './api';
import type { Content, ContentType, ModuleAccess } from '@/shared/types';

export const contentService = {
  getContent: async (module?: ModuleAccess, type?: ContentType, category?: string): Promise<Content[]> => {
    const params = new URLSearchParams();
    if (module) params.append('module', module);
    if (type) params.append('type', type);
    if (category) params.append('category', category);

    const response = await api.get<Content[]>(`/api/content?${params.toString()}`);
    return response.data;
  },

  getContentById: async (id: string): Promise<Content> => {
    const response = await api.get<Content>(`/api/content/${id}`);
    return response.data;
  },

  searchContent: async (query: string, module?: ModuleAccess): Promise<Content[]> => {
    const params = new URLSearchParams({ q: query });
    if (module) params.append('module', module);

    const response = await api.get<Content[]>(`/api/content/search?${params.toString()}`);
    return response.data;
  },
};

