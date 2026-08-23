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
  nombre_establecimiento?: string;
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

export interface HistoricalAdjudication {
  name: string;
  score: number;
  ranking: number;
}

export interface HistoricalYearData {
  year: number;
  period: string;
  profession: string;
  admitted: HistoricalAdjudication[];
}

export interface HistoricalStats {
  min_score: number | null;
  max_score: number | null;
  avg_score: number | null;
  median_score: number | null;
  last_admitted_ranking: number | null;
  total_admitted: number;
}

export interface HistoricalDataResponse {
  history: HistoricalYearData[];
  stats: HistoricalStats;
  confidence: string;
  difficulty: string;
}

export interface FavoriteItem {
  id: string;
  establishmentName: string;
  profesion: string;
  tipoPlaza: 'remunerada' | 'equivalente';
  codigoRenipressId: string;
  procesoAno: string;
  procesoPeriodo: string;
}

export interface AccessibilityResponse {
  available: boolean;
  message?: string;
  distance_km: number | null;
  estimated_time_minutes: number | null;
  travel_mode: string;
  accessibility_score: number | null;
  accessibility_level: string;
  provider?: string;
}

export interface ClimateResponse {
  available: boolean;
  average_temperature: number;
  minimum_temperature: number;
  maximum_temperature: number;
  rainfall_level: string;
  frost_probability: string;
  climate_type: string;
  badges: string[];
  provider?: string;
}

export interface ConnectivityResponse {
  available: boolean;
  claro_coverage: string;
  movistar_coverage: string;
  entel_coverage: string;
  bitel_coverage: string;
  internet_quality_score: number;
  provider?: string;
}

export interface UserOpportunityDetail {
  score: number;
  level: 'very_low' | 'low' | 'moderate' | 'good' | 'very_good' | string;
  level_display: string;
  source: 'historical' | 'difficulty_fallback' | 'historical_no_user_score' | string;
  user_score: number | null;
  profession: string | null;
  historical_sample_size: number;
  historical_period_count: number;
  historical_year_count: number;
  available_historical_periods: string[];
  historical_min: number | null;
  historical_max: number | null;
  historical_average: number | null;
  historical_median: number | null;
  historical_std_deviation: number | null;
  historical_coverage: {
    available_from: string | null;
    available_to: string | null;
    periods_with_data: number;
    years_with_data: number;
  };
  first_observed_period: string | null;
  last_observed_period: string | null;
  confidence: 'none' | 'very_low' | 'low' | 'moderate' | 'high' | string;
  confidence_display: string;
  explanation: string;
}

export interface RecommendationResponse {
  recommendation_score: number;
  recommendation_level: string;
  badge: string;
  weights_used: Record<string, number>;
  breakdown: {
    user_opportunity: number;
    user_opportunity_detail?: UserOpportunityDetail;
    accessibility: number | null;
    climate: number;
    connectivity: number;
  };
}


