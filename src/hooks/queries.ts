import { useQuery } from '@tanstack/react-query';
import { getFilters, getPlaza, getPlazasMap } from '../api/serums';
import type { BoundingBox, Filters } from '../types';

export const usePlazasMap = (bbox?: BoundingBox, filters?: Partial<Filters>) => {
  return useQuery({
    queryKey: ['plazasMap', bbox, filters],
    queryFn: () => getPlazasMap(bbox, filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlaza = (id?: string) => {
  return useQuery({
    queryKey: ['plaza', id],
    queryFn: () => getPlaza(id!),
    enabled: !!id,
  });
};

export const useFilters = () => {
  return useQuery({
    queryKey: ['filters'],
    queryFn: getFilters,
    staleTime: 60 * 60 * 1000, // Filters rarely change
  });
};
