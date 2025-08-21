export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Channel {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  category: string;
  tags: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Query parameters for filtering
export interface ChannelFilters {
  q?: string;
  tags?: string[];
  category?: string;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
