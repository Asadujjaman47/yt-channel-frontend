import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '../lib/api';
import type { Category, Channel, Tag, ChannelFilters } from '../types';

// Query keys for React Query
export const queryKeys = {
  categories: ['categories'] as const,
  tags: ['tags'] as const,
  channels: (filters?: ChannelFilters) => ['channels', filters] as const,
};

// Custom hooks for categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: apiService.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
    },
  });
};

// Custom hooks for tags
export const useTags = () => {
  return useQuery({
    queryKey: queryKeys.tags,
    queryFn: apiService.getTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tags });
    },
  });
};

// Custom hooks for channels
export const useChannels = (filters?: ChannelFilters) => {
  return useQuery({
    queryKey: queryKeys.channels(filters),
    queryFn: () => apiService.getChannels(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiService.createChannel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.channels() });
    },
  });
};
