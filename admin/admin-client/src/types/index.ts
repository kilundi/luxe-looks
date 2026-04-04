export interface User {
  id: number;
  username: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  description?: string;
  image?: string;
  rating: number;
  reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  product_count: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  averageRating: number;
  totalReviews: number;
  recentProducts: Product[];
  productsByCategory: { name: string; count: number }[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type ProductStatus = 'draft' | 'published' | 'archived';
