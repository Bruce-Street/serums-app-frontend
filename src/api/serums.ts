import type { BoundingBox, FilterOptions, Filters, Plaza, PlazaMapItem } from '../types';
import { MOCK_PLAZAS } from './mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPlazasMap(
  bbox?: BoundingBox,
  filters?: Partial<Filters>,
): Promise<PlazaMapItem[]> {
  await delay(300); // Simulate network latency

  let result = MOCK_PLAZAS;

  if (bbox) {
    result = result.filter(
      (p) => p.lat >= bbox.south && p.lat <= bbox.north && p.lng >= bbox.west && p.lng <= bbox.east,
    );
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search) ||
        p.distrito.toLowerCase().includes(search) ||
        p.provincia.toLowerCase().includes(search) ||
        p.codigo_renipress.toLowerCase().includes(search),
    );
  }

  if (filters?.departamento) result = result.filter((p) => p.departamento === filters.departamento);
  if (filters?.tipo_plaza) result = result.filter((p) => p.tipo_plaza === filters.tipo_plaza);

  return result.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    tipo_plaza: p.tipo_plaza,
    grado_dificultad: p.grado_dificultad,
    zaf: p.zaf,
    ze: p.ze,
    lat: p.lat,
    lng: p.lng,
  }));
}

export async function getPlaza(id: string): Promise<Plaza> {
  await delay(200);
  const plaza = MOCK_PLAZAS.find((p) => p.id === id);
  if (!plaza) throw new Error('Plaza not found');
  return plaza;
}

export async function getFilters(): Promise<FilterOptions> {
  await delay(200);
  return {
    departamentos: ['LIMA', 'CUSCO', 'AREQUIPA'],
    provincias: ['LIMA', 'CUSCO', 'AREQUIPA'],
    distritos: ['LIMA', 'CUSCO', 'AREQUIPA'],
    profesiones: ['MEDICINA', 'ENFERMERIA', 'ODONTOLOGIA'],
    tipos_plaza: ['remunerado', 'equivalente'],
    categorias_establecimiento: ['I-1', 'I-2', 'I-3', 'I-4', 'II-1', 'II-2'],
    grados_dificultad: ['1', '2', '3', '4', '5'],
  };
}
