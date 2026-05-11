export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface PlazaMapItem {
  id: string;
  nombre: string;
  tipo_plaza: 'remunerado' | 'equivalente'; // remunerado=green, equivalente=gray
  grado_dificultad: string;
  zaf: boolean;
  ze: boolean;
  lat: number;
  lng: number;
}

export interface Plaza {
  id: string;
  nombre: string;
  codigo_renipress: string;
  categoria: string;
  departamento: string;
  provincia: string;
  distrito: string;
  institucion_ofertante: string;
  diresa: string;
  institucion: string;
  profesion: string;
  tipo_plaza: 'remunerado' | 'equivalente';
  cantidad_plazas: number;
  sede_adjudicacion: string;
  grado_dificultad: string;
  zaf: boolean;
  ze: boolean;
  presupuesto: string;
  lat: number;
  lng: number;
}

export interface Filters {
  departamento: string;
  provincia: string;
  distrito: string;
  profesion: string;
  tipo_plaza: string;
  categoria_establecimiento: string;
  grado_dificultad: string;
  zaf: string;
  ze: string;
  search: string;
}

export interface FilterOptions {
  departamentos: string[];
  provincias: string[];
  distritos: string[];
  profesiones: string[];
  tipos_plaza: string[];
  categorias_establecimiento: string[];
  grados_dificultad: string[];
}
