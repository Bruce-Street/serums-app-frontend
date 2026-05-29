import type { FilterOptions, Filters, Plaza, PlazaMapItem, GlobalSearchResult } from '@/types';

export const getPlazasMap = async (
  filters?: Partial<Filters>,
  signal?: AbortSignal,
): Promise<PlazaMapItem[]> => {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
  }

  const response = await fetch(`${base}plazas/map/?${params.toString()}`, { signal });
  if (!response.ok) throw new Error('Network response was not ok');
  return response.json();
};

export async function getPlaza(id: string, signal?: AbortSignal): Promise<Plaza> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}plazas/${id}/`, { signal });
  if (!response.ok) throw new Error('Plaza not found');
  return response.json();
}

export async function getFilters(signal?: AbortSignal): Promise<FilterOptions> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}filters/`, { signal });
  if (!response.ok) throw new Error('Failed to fetch filters');
  return response.json();
}

export async function searchGlobal(
  query: string,
  signal?: AbortSignal,
): Promise<GlobalSearchResult[]> {
  if (!query || query.length < 2) return [];
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}search/?q=${encodeURIComponent(query)}`, { signal });
  if (!response.ok) throw new Error('Search failed');
  return response.json();
}
