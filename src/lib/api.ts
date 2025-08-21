import axios from 'axios';
import type { Category, Channel, Tag, ChannelFilters, PaginatedResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  createCategory: async (category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },

  // Tags
  getTags: async (): Promise<Tag[]> => {
    const response = await api.get<Tag[]>('/tags');
    return response.data;
  },

  createTag: async (tag: Omit<Tag, '_id' | 'createdAt' | 'updatedAt'>): Promise<Tag> => {
    const response = await api.post<Tag>('/tags', tag);
    return response.data;
  },

  // Channels
  getChannels: async (filters?: ChannelFilters): Promise<PaginatedResult<Channel>> => {
    const params = new URLSearchParams();
    if (filters?.q) params.append('q', filters.q);
    if (filters?.tags && filters.tags.length > 0) {
      filters.tags.forEach(tag => params.append('tags', tag));
    }
    if (filters?.category) params.append('category', filters.category);
    if (typeof filters?.page === 'number') params.append('page', String(filters.page));
    if (typeof filters?.limit === 'number') params.append('limit', String(filters.limit));

    const response = await api.get<PaginatedResult<Channel>>(`/channels?${params.toString()}`);
    return response.data;
  },

  createChannel: async (channel: Omit<Channel, '_id' | 'createdAt' | 'updatedAt'>): Promise<Channel> => {
    const response = await api.post<Channel>('/channels', channel);
    return response.data;
  },
};

export default api;
