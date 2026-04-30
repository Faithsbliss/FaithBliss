import { create } from 'zustand';
import type { StoryGroup } from '../types/app-stories';
import { fetchActiveStories, createStory, markStoryAsViewed } from '../api/storyApi';

interface StoryState {
  storyGroups: StoryGroup[];
  isLoading: boolean;
  isUploading: boolean;
  error: string | null;
  fetchStories: () => Promise<void>;
  addStory: (mediaUrl: string, mediaType?: 'image' | 'video') => Promise<void>;
  markAsViewed: (storyId: string, userId: string) => Promise<void>;
}

export const useStoryStore = create<StoryState>((set, get) => ({
  storyGroups: [],
  isLoading: false,
  isUploading: false,
  error: null,

  fetchStories: async () => {
    set({ isLoading: true, error: null });
    try {
      const groups = await fetchActiveStories();
      set({ storyGroups: groups, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch stories';
      set({ error: message, isLoading: false });
    }
  },

  addStory: async (mediaUrl, mediaType = 'image') => {
    set({ isUploading: true, error: null });
    try {
      await createStory(mediaUrl, mediaType);
      // Refresh stories to get the updated list (simplest way to sync)
      await get().fetchStories();
      set({ isUploading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload story';
      set({ error: message, isUploading: false });
      throw error;
    }
  },

  markAsViewed: async (storyId, _userId) => {
    try {
      await markStoryAsViewed(storyId);
      // We could refetch or update local state deeply here.
    } catch (error) {
      console.error('Failed to mark story as viewed', error);
    }
  },
}));
