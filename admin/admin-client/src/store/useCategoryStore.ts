import { create } from 'zustand';
import type { Category, CategoryOrder } from '@/types';
import { categoryService } from '@/services/api';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  fetchCategories: () => Promise<void>;
  createCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'product_count'>) => Promise<Category>;
  updateCategory: (id: number, updates: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: number) => Promise<void>;
  reorderCategories: (orders: CategoryOrder[]) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true });
    try {
      const categories = await categoryService.getAll();
      set({ categories, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  createCategory: async (categoryData) => {
    try {
      const newCategory = await categoryService.create(categoryData);
      set((state) => ({
        categories: [...state.categories, newCategory].sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
      }));
      return newCategory;
    } catch (error) {
      console.error('Failed to create category:', error);
      throw error;
    }
  },

  updateCategory: async (id, updates) => {
    try {
      const updatedCategory = await categoryService.update(id, updates);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updatedCategory : c)),
      }));
      return updatedCategory;
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  },

  deleteCategory: async (id) => {
    try {
      await categoryService.delete(id);
      set((state) => ({
        categories: state.categories.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  },

  reorderCategories: async (orders) => {
    try {
      await categoryService.reorder(orders);
      const sortedCategories = [...useCategoryStore.getState().categories];
      orders.forEach((order) => {
        const category = sortedCategories.find((c) => c.id === order.id);
        if (category) {
          category.sort_order = order.sort_order;
        }
      });
      sortedCategories.sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
      set({ categories: sortedCategories });
    } catch (error) {
      console.error('Failed to reorder categories:', error);
      throw error;
    }
  },
}));
