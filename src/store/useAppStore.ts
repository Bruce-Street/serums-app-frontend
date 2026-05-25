import { create } from 'zustand';
import type { BoundingBox, Filters, PlazaMapItem } from '@/types';

interface AppState {
  bbox: BoundingBox | undefined;
  filters: Partial<Filters>;
  selectedEstablishment: PlazaMapItem | undefined;
  isFiltersOpen: boolean;
  flyToLocation: { lat: number; lng: number } | undefined;

  setBBox: (bbox: BoundingBox) => void;
  setFilters: (filters: Partial<Filters>) => void;
  updateFilter: (key: keyof Filters, value: string) => void;
  setSelectedEstablishment: (establishment: PlazaMapItem | undefined) => void;
  toggleFilters: () => void;
  setFlyToLocation: (location: { lat: number; lng: number } | undefined) => void;
}

export const useAppStore = create<AppState>((set) => ({
  bbox: undefined,
  filters: {},
  selectedEstablishment: undefined,
  isFiltersOpen: true,
  flyToLocation: undefined,

  setBBox: (bbox) => set({ bbox }),
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSelectedEstablishment: (establishment) => set({ selectedEstablishment: establishment }),
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  setFlyToLocation: (location) => set({ flyToLocation: location }),
}));
