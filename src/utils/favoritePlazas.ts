import type { FavoriteItem } from '@/types';

export const STORAGE_KEY = 'serums-favorites';
export const MAX_FAVORITES = 20;

export function getFavoritePlazas() {
  const favoritePlazas = localStorage.getItem(STORAGE_KEY);
  if (favoritePlazas) {
    const parsed = JSON.parse(favoritePlazas);
    return Array.isArray(parsed) ? parsed : [];
  }
  return null;
}

export function getFavoritePlazaIds() {
  const favorites = getFavoritePlazas();
  return favorites ? favorites.map((f: FavoriteItem) => f.id) : [];
}
