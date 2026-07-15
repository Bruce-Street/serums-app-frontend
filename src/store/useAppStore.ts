import { create } from 'zustand';
import type { FavoriteItem, Filters, PlazaMapItem } from '@/types';
import { getFavoritePlazas } from '@/utils/favoritePlazas.ts';

interface AppState {
  isFiltersOpen: boolean;
  filters: Partial<Filters>;
  selectedEstablishment: PlazaMapItem | undefined;
  flyToLocation: { lat: number; lng: number } | undefined;

  // Comparison States
  comparedPlazaIds: string[];
  isCompareOpen: boolean;

  // Favorites Panel
  isFavoritesOpen: boolean;

  toggleFilters: () => void;
  updateFilter: (key: keyof Filters, value: string) => void;
  setSelectedEstablishment: (establishment: PlazaMapItem | undefined) => void;
  setFlyToLocation: (location: { lat: number; lng: number } | undefined) => void;

  // Comparison Actions
  addPlazaToCompare: (id: string) => void;
  removePlazaFromCompare: (id: string) => void;
  toggleCompareView: (open?: boolean) => void;
  clearCompare: () => void;

  // Favorites Actions
  favoritePlazas: FavoriteItem[];
  addFavoritePlaza: (plaza: FavoriteItem) => void;
  removeFavoritePlaza: (id: string) => void;
  toggleFavorites: (open?: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  filters: {},
  selectedEstablishment: undefined,
  isFiltersOpen: true,
  flyToLocation: undefined,

  // Initial Comparison State
  comparedPlazaIds: [],
  isCompareOpen: false,

  // Initial Favorites State
  favoritePlazas: getFavoritePlazas() || [],
  isFavoritesOpen: false,

  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSelectedEstablishment: (establishment) => set({ selectedEstablishment: establishment }),
  toggleFilters: () => set((state) => ({ isFiltersOpen: !state.isFiltersOpen })),
  setFlyToLocation: (location) => set({ flyToLocation: location }),

  // Comparison Actions Implementation
  addPlazaToCompare: (id) =>
    set((state) => {
      if (state.comparedPlazaIds.includes(id)) return {};
      if (state.comparedPlazaIds.length >= 3) return {};
      return { comparedPlazaIds: [...state.comparedPlazaIds, id] };
    }),
  removePlazaFromCompare: (id) =>
    set((state) => ({
      comparedPlazaIds: state.comparedPlazaIds.filter((pId) => pId !== id),
    })),
  toggleCompareView: (open) =>
    set((state) => ({
      isCompareOpen: open !== undefined ? open : !state.isCompareOpen,
    })),
  clearCompare: () => set({ comparedPlazaIds: [] }),

  // Favorites Actions Implementation
  addFavoritePlaza: (plaza) =>
    set((state) => {
      if (state.favoritePlazas.some((f) => f.id === plaza.id)) return {};
      return { favoritePlazas: [...state.favoritePlazas, plaza] };
    }),
  removeFavoritePlaza: (id: string) =>
    set((state) => ({
      favoritePlazas: state.favoritePlazas.filter((f) => f.id !== id),
    })),
  toggleFavorites: (open) =>
    set((state) => ({
      isFavoritesOpen: open !== undefined ? open : !state.isFavoritesOpen,
    })),
}));
