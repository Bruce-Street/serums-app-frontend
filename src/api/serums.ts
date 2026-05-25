import type {
  BoundingBox,
  FilterOptions,
  Filters,
  Plaza,
  PlazaMapItem,
  GlobalSearchResult,
} from '@/types';

export async function getPlazasMap(
  bbox?: BoundingBox,
  filters?: Partial<Filters>,
  signal?: AbortSignal,
): Promise<PlazaMapItem[]> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const url = new URL('plazas/map/', base);

  if (bbox) {
    url.searchParams.append('bbox', `${bbox.west},${bbox.south},${bbox.east},${bbox.north}`);
  }

  if (filters?.search) url.searchParams.append('search', filters.search);
  if (filters?.departamento) url.searchParams.append('departamento', filters.departamento);
  if (filters?.tipo_plaza) url.searchParams.append('tipo_plaza', filters.tipo_plaza);

  const response = await fetch(url.toString(), { signal });
  if (!response.ok) {
    throw new Error('Failed to fetch plazas map data');
  }

  return response.json();
}

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
