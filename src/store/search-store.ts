/**
 * Search state management with Zustand
 * Manages search filters and preferences with persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SearchParams } from '@/types/search.types';

interface SearchStore {
  filters: Partial<SearchParams>;
  recentSearches: string[];

  // Actions
  setFilters: (filters: Partial<SearchParams>) => void;
  updateFilter: <K extends keyof SearchParams>(
    key: K,
    value: SearchParams[K]
  ) => void;
  clearFilters: () => void;
  addRecentSearch: (location: string) => void;
  clearRecentSearches: () => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      filters: {},
      recentSearches: [],

      setFilters: (filters) =>
        set({
          filters,
        }),

      updateFilter: (key, value) =>
        set((state) => ({
          filters: {
            ...state.filters,
            [key]: value,
          },
        })),

      clearFilters: () =>
        set({
          filters: {},
        }),

      addRecentSearch: (location) =>
        set((state) => {
          const searches = [
            location,
            ...state.recentSearches.filter((s) => s !== location),
          ].slice(0, 5); // Keep only last 5 searches
          return { recentSearches: searches };
        }),

      clearRecentSearches: () =>
        set({
          recentSearches: [],
        }),
    }),
    {
      name: 'search-storage',
    }
  )
);
