import { create } from 'zustand';
import type { MediaItem } from '@/types';
import { mediaService } from '@/services/api';

interface MediaState {
  media: MediaItem[];
  isLoading: boolean;
  selectedMedia: Set<number>;
  fetchMedia: () => Promise<void>;
  deleteMedia: (id: number) => Promise<void>;
  selectMedia: (id: number, selected: boolean) => void;
  clearSelection: () => void;
}

export const useMediaStore = create<MediaState>((set) => ({
  media: [],
  isLoading: false,
  selectedMedia: new Set(),

  fetchMedia: async () => {
    set({ isLoading: true });
    try {
      const media = await mediaService.getAll();
      set({ media, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch media:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  deleteMedia: async (id: number) => {
    try {
      await mediaService.delete(id);
      set((state) => ({
        media: state.media.filter((m) => m.id !== id),
        selectedMedia: (() => {
          const newSet = new Set(state.selectedMedia);
          newSet.delete(id);
          return newSet;
        })(),
      }));
    } catch (error) {
      console.error('Failed to delete media:', error);
      throw error;
    }
  },

  selectMedia: (id: number, selected: boolean) => {
    set((state) => {
      const newSet = new Set(state.selectedMedia);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return { selectedMedia: newSet };
    });
  },

  clearSelection: () => {
    set({ selectedMedia: new Set() });
  },
}));
