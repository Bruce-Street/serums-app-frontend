import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getFilters,
  getPlaza,
  getPlazasMap,
  searchGlobal,
  getPlazaHistorical,
  getAccessibility,
  getClimate,
  getConnectivity,
  getRecommendation,
  getUserOpportunity,
} from '../api/serums';

import type { Filters } from '@/types';

export const usePlazasMap = (filters?: Partial<Filters>) => {
  return useQuery({
    queryKey: ['plazasMap', filters],
    queryFn: ({ signal }) => getPlazasMap(filters, signal),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
};

export const usePlaza = (id?: string) => {
  return useQuery({
    queryKey: ['plaza', id],
    queryFn: ({ signal }) => getPlaza(id!, signal),
    enabled: !!id,
  });
};

export const useFilters = () => {
  return useQuery({
    queryKey: ['filters'],
    queryFn: ({ signal }) => getFilters(signal),
    staleTime: 60 * 60 * 1000, // Filters rarely change
  });
};

export const useGlobalSearch = (query: string) => {
  return useQuery({
    queryKey: ['search', query],
    queryFn: ({ signal }) => searchGlobal(query, signal),
    enabled: query.length >= 2,
    staleTime: 60 * 1000,
  });
};

export const usePlazaHistorical = (id?: string) => {
  return useQuery({
    queryKey: ['plazaHistorical', id],
    queryFn: ({ signal }) => getPlazaHistorical(id!, signal),
    enabled: !!id,
  });
};

export const useAccessibility = (id?: string, params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['accessibility', id, params],
    queryFn: ({ signal }) => getAccessibility(id!, params, signal),
    enabled: !!id,
  });
};

export const useClimate = (id?: string) => {
  return useQuery({
    queryKey: ['climate', id],
    queryFn: ({ signal }) => getClimate(id!, signal),
    enabled: !!id,
  });
};

export const useConnectivity = (id?: string) => {
  return useQuery({
    queryKey: ['connectivity', id],
    queryFn: ({ signal }) => getConnectivity(id!, signal),
    enabled: !!id,
  });
};

export const useRecommendation = (id?: string, params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['recommendation', id, params],
    queryFn: ({ signal }) => getRecommendation(id!, params, signal),
    enabled: !!id,
  });
};

export const useUserOpportunity = (id?: string, params?: Record<string, string>) => {
  return useQuery({
    queryKey: ['userOpportunity', id, params],
    queryFn: ({ signal }) => getUserOpportunity(id!, params, signal),
    enabled: !!id,
  });
};


