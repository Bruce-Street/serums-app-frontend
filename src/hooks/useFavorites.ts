import { useCallback } from 'react';
import type { FavoriteItem } from '@/types';
import { MAX_FAVORITES, STORAGE_KEY } from '@/utils/favoritePlazas.ts';
import { useAppStore } from '@/store/useAppStore.ts';

function writeFavorites(favorites: FavoriteItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // ignore quota errors
  }
}

export function useFavorites() {
  const favoritePlazas = useAppStore((store) => store.favoritePlazas);
  const addFavoritePlaza = useAppStore((state) => state.addFavoritePlaza);
  const removeFavoritePlaza = useAppStore((state) => state.removeFavoritePlaza);

  const addFavorite = useCallback((item: FavoriteItem) => {
    if (favoritePlazas.some((f) => f.id === item.id)) return;
    if (favoritePlazas.length >= MAX_FAVORITES) return;
    const updated = [...favoritePlazas, item];
    writeFavorites(updated);
    addFavoritePlaza(item);
    return updated;
  }, []);

  const removeFavorite = useCallback((id: string) => {
    const updated = favoritePlazas.filter((f) => f.id !== id);
    writeFavorites(updated);
    removeFavoritePlaza(id);
    return updated;
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoritePlazas.some((f) => f.id === id),
    [favoritePlazas],
  );

  const favoritePlazasCount = favoritePlazas.length;

  return {
    favorites: favoritePlazas,
    addFavorite,
    removeFavorite,
    isFavorite,
    count: favoritePlazasCount,
  };
}
