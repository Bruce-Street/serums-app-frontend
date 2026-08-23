import type {
  FilterOptions,
  Filters,
  Plaza,
  PlazaMapItem,
  GlobalSearchResult,
  HistoricalDataResponse,
  AccessibilityResponse,
  ClimateResponse,
  ConnectivityResponse,
  RecommendationResponse,
  UserOpportunityDetail,
} from '@/types';


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
  if (!response.ok) throw new Error('La búsqueda falló');
  return response.json();
}

export async function getPlazaHistorical(
  id: string,
  signal?: AbortSignal,
): Promise<HistoricalDataResponse> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}plazas/${id}/historical/`, { signal });
  if (!response.ok) throw new Error('Historical data not found');
  return response.json();
}

export async function getAccessibility(
  id: string,
  params?: Record<string, string>,
  signal?: AbortSignal,
): Promise<AccessibilityResponse> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const searchParams = new URLSearchParams(params || {});
  const response = await fetch(`${base}plazas/${id}/accessibility/?${searchParams.toString()}`, {
    signal,
  });
  if (!response.ok) throw new Error('Accessibility data not found');
  return response.json();
}

export async function getClimate(id: string, signal?: AbortSignal): Promise<ClimateResponse> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}plazas/${id}/climate/`, { signal });
  if (!response.ok) throw new Error('Climate data not found');
  return response.json();
}

export async function getConnectivity(
  id: string,
  signal?: AbortSignal,
): Promise<ConnectivityResponse> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const response = await fetch(`${base}plazas/${id}/connectivity/`, { signal });
  if (!response.ok) throw new Error('Connectivity data not found');
  return response.json();
}

export async function getRecommendation(
  id: string,
  params?: Record<string, string>,
  signal?: AbortSignal,
): Promise<RecommendationResponse> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const searchParams = new URLSearchParams(params || {});
  const response = await fetch(`${base}plazas/${id}/recommendation/?${searchParams.toString()}`, {
    signal,
  });
  if (!response.ok) throw new Error('Recommendation data not found');
  return response.json();
}

export async function getUserOpportunity(
  id: string,
  params?: Record<string, string>,
  signal?: AbortSignal,
): Promise<UserOpportunityDetail> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/';
  const base = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  const searchParams = new URLSearchParams(params || {});
  const response = await fetch(`${base}plazas/${id}/user_opportunity/?${searchParams.toString()}`, {
    signal,
  });
  if (!response.ok) throw new Error('User Opportunity data not found');
  return response.json();
}

