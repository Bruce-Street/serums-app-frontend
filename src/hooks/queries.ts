import { useQuery } from '@tanstack/react-query';
import { getFilters, getPlaza, getPlazasMap, searchGlobal } from '../api/serums';
import type { BoundingBox, Filters } from '@/types';

export const usePlazasMap = (bbox?: BoundingBox, filters?: Partial<Filters>) => {
  return useQuery({
    queryKey: ['plazasMap', bbox, filters],
    queryFn: ({ signal }) => getPlazasMap(bbox, filters, signal),
    staleTime: 5 * 60 * 1000,
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
