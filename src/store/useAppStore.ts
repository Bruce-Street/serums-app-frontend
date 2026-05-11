import { create } from 'zustand';
import type { BoundingBox, Filters } from '@/types';

interface AppState {
  bbox: BoundingBox | undefined;
  filters: Partial<Filters>;
  selectedPlazaId: string | undefined;
  isFiltersOpen: boolean;

  setBBox: (bbox: BoundingBox) => void;
  setFilters: (filters: Partial<Filters>) => void;
  updateFilter: (key: keyof Filters, value: string) => void;
  setSelectedPlazaId: (id: string | undefined) => void;
  toggleFilters: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  bbox: undefined,
  filters: {},
  selectedPlazaId: undefined,
  isFiltersOpen: true,

  setBBox: (bbox) => set({ bbox }),
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSelectedPlazaId: (id) => set({ selectedPlazaId: id }),
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
}));
