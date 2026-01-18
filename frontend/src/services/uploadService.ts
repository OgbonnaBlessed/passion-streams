import { api } from './api';

export interface UploadResponse {
  url: string;
  path: string;
  size: number;
  mimetype: string;
}

export const uploadService = {
  uploadFile: async (file: File, folder = 'uploads'): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await api.post<UploadResponse>('/api/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteFile: async (path: string): Promise<void> => {
    await api.delete(`/api/upload/file/${encodeURIComponent(path)}`);
  },
};

