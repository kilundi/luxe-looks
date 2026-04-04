import { create } from 'zustand';
import type { Product, ProductFilters } from '@/types';
import { productService } from '@/services/api';

interface ProductState {
  products: Product[];
  isLoading: boolean;
  selectedIds: Set<number>;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  searchQuery: string;
  filters: ProductFilters;
  fetchProducts: () => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (updatedProduct: Product) => void;
  selectProduct: (id: number, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  clearSelection: () => void;
  setSorting: (by: string, order: 'asc' | 'desc') => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  selectedIds: new Set(),
  sortBy: 'created_at',
  sortOrder: 'desc',
  searchQuery: '',
  filters: {},

  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      // Get current state
      const state = useProductStore.getState();
      const apiFilters: ProductFilters = { ...state.filters };
      if (state.searchQuery) {
        apiFilters.search = state.searchQuery;
      }
      const products = await productService.getAll(apiFilters);
      set({ products, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await productService.delete(id);
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        selectedIds: (() => {
          const newSet = new Set(state.selectedIds);
          newSet.delete(id);
          return newSet;
        })(),
      }));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  addProduct: (product: Product) => {
    set((state) => ({
      products: [product, ...state.products],
    }));
  },

  updateProduct: (updatedProduct: Product) => {
    set((state) => ({
      products: state.products.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      ),
    }));
  },

  selectProduct: (id: number, selected: boolean) => {
    set((state) => {
      const newSet = new Set(state.selectedIds);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return { selectedIds: newSet };
    });
  },

  selectAll: (selected: boolean) => {
    set((state) => {
      if (selected) {
        const allIds = new Set(state.products.map((p) => p.id));
        return { selectedIds: allIds };
      } else {
        return { selectedIds: new Set() };
      }
    });
  },

  clearSelection: () => {
    set({ selectedIds: new Set() });
  },

  setSorting: (by: string, order: 'asc' | 'desc') => {
    set({ sortBy: by, sortOrder: order });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setFilters: (newFilters: Partial<ProductFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },
}));
