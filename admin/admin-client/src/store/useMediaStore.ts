import { create } from 'zustand';
import type { MediaItem } from '@/types';
import { mediaService } from '@/services/api';

interface MediaState {
  media: MediaItem[];
  isLoading: boolean;
  selectedMedia: Set<string>;
  fetchMedia: () => Promise<void>;
  deleteMedia: (filename: string) => Promise<void>;
  selectMedia: (filename: string, selected: boolean) => void;
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

  deleteMedia: async (filename: string) => {
    try {
      await mediaService.delete(filename);
      set((state) => ({
        media: state.media.filter((m) => m.filename !== filename),
        selectedMedia: (() => {
          const newSet = new Set(state.selectedMedia);
          newSet.delete(filename);
          return newSet;
        })(),
      }));
    } catch (error) {
      console.error('Failed to delete media:', error);
      throw error;
    }
  },

  selectMedia: (filename: string, selected: boolean) => {
    set((state) => {
      const newSet = new Set(state.selectedMedia);
      if (selected) {
        newSet.add(filename);
      } else {
        newSet.delete(filename);
      }
      return { selectedMedia: newSet };
    });
  },

  clearSelection: () => {
    set({ selectedMedia: new Set() });
  },
}));
