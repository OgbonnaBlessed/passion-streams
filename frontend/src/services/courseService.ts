import { api } from './api';
import type { Course, CourseProgress } from '@/shared/types';

export const courseService = {
  getCourses: async (): Promise<Course[]> => {
    const response = await api.get<Course[]>('/api/courses');
    return response.data;
  },

  getCourseById: async (id: string): Promise<Course> => {
    const response = await api.get<Course>(`/api/courses/${id}`);
    return response.data;
  },

  getProgress: async (courseId: string): Promise<CourseProgress> => {
    const response = await api.get<CourseProgress>(`/api/courses/${courseId}/progress`);
    return response.data;
  },

  updateProgress: async (courseId: string, progress: Partial<CourseProgress>): Promise<CourseProgress> => {
    const response = await api.put<CourseProgress>(`/api/courses/${courseId}/progress`, progress);
    return response.data;
  },
};

