import type { Plaza } from '@/types';

function generateMockData(): Plaza[] {
  const data: Plaza[] = [];
  const TOTAL_ITEMS = 8500;

  // Peru approximate bounding box
  const minLng = -81.3;
  const maxLng = -68.6;
  const minLat = -18.3;
  const maxLat = -0.03;

  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const isRemunerado = Math.random() > 0.3;
    const lat = minLat + Math.random() * (maxLat - minLat);
    const lng = minLng + Math.random() * (maxLng - minLng);

    data.push({
      id: `plaza-${i}`,
      nombre: `Establecimiento de Salud ${i}`,
      codigo_renipress: `REN-${Math.floor(10000 + Math.random() * 90000)}`,
      categoria: Math.random() > 0.5 ? 'I-1' : 'I-2',
      departamento: 'LIMA',
      provincia: 'LIMA',
      distrito: 'LIMA',
      institucion_ofertante: 'MINSA',
      diresa: 'DIRIS LIMA CENTRO',
      institucion: 'MINSA',
      profesion: 'MEDICINA',
      tipo_plaza: isRemunerado ? 'remunerado' : 'equivalente',
      cantidad_plazas: Math.floor(1 + Math.random() * 5),
      sede_adjudicacion: 'Sede Central',
      grado_dificultad: Math.random() > 0.5 ? '1' : '2',
      zaf: Math.random() > 0.8,
      ze: Math.random() > 0.9,
      presupuesto: 'Nacional',
      lat,
      lng,
    });
  }
  return data;
}

export const MOCK_PLAZAS = generateMockData();
