export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
}

export interface PlazaBasic {
  id: string;
  tipo_plaza: 'remunerada' | 'equivalente';
  profesion: string;
  institucion_ofertante: string;
}

export interface PlazaMapItem {
  codigo_renipress_id: string;
  nombre_establecimiento: string;
  latitud: number;
  longitud: number;
  grado_dificultad: string;
  zaf: boolean;
  ze: boolean;
  plazas: PlazaBasic[];
}

export interface GlobalSearchResult {
  type: 'place' | 'plaza';
  id?: string;
  name: string;
  location?: string;
  lat: number;
  lon: number;
}

export interface Plaza {
  id: string;
  nombre: string;
  categoria_establecimiento: string;
  codigo_renipress: string;
  departamento: string;
  provincia: string;
  distrito: string;
  institucion_ofertante: string;
  diresa: string;
  institucion: string;
  profesion: string;
  tipo_plaza: 'remunerada' | 'equivalente';
  cantidad_plazas: number;
  sede_adjudicacion: string;
  grado_dificultad: string;
  zaf: boolean;
  ze: boolean;
  presupuesto: string;
  lat: number;
  lng: number;
  imagen_1?: string;
  imagen_2?: string;
  imagen_3?: string;
}

export interface Filters {
  departamento: string;
  provincia: string;
  distrito: string;
  profesion: string;
  tipo_plaza: string;
  categoria_establecimiento: string;
  grado_dificultad: string;
  institucion_ofertante: string;
  proceso_ano: string;
  proceso_periodo: string;
  zaf: string;
  ze: string;
  search: string;
}

export interface FilterOptions {
  anos: number[];
  periodos: string[];
  departamentos: string[];
  provincias?: string[];
  distritos?: string[];
  profesiones: string[];
  tipos_plaza?: string[];
  categorias_establecimiento: string[];
  grados_dificultad: string[];
  instituciones_ofertantes: string[];
}
