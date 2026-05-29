import { create } from 'zustand';
import type { Filters, PlazaMapItem } from '@/types';

interface AppState {
  isFiltersOpen: boolean;
  filters: Partial<Filters>;
  selectedEstablishment: PlazaMapItem | undefined;
  flyToLocation: { lat: number; lng: number } | undefined;

  toggleFilters: () => void;
  updateFilter: (key: keyof Filters, value: string) => void;
  setSelectedEstablishment: (establishment: PlazaMapItem | undefined) => void;
  setFlyToLocation: (location: { lat: number; lng: number } | undefined) => void;
}

export const useAppStore = create<AppState>((set) => ({
  filters: {},
  selectedEstablishment: undefined,
  isFiltersOpen: true,
  flyToLocation: undefined,

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSelectedEstablishment: (establishment) => set({ selectedEstablishment: establishment }),
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  setFlyToLocation: (location) => set({ flyToLocation: location }),
}));
