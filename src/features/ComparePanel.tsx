import {
  X,
  GitCompare,
  Trash2,
  ShieldAlert,
  Building2,
  Award,
  TrendingUp,
  Car,
  CloudSun,
  Wifi,
  Sparkles,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import {
  usePlaza,
  usePlazaHistorical,
  useAccessibility,
  useClimate,
  useConnectivity,
  useRecommendation,
} from '../hooks/queries';
import { useDecisionProfile } from '../hooks/useDecisionProfile';
import { cn } from '../utils/cn';
import { useMemo } from 'react';

function PlazaCompareCard({ plazaId, onRemove }: { plazaId: string; onRemove: () => void }) {
  const { data: plaza, isLoading: isPlazaLoading, isError: isPlazaError } = usePlaza(plazaId);
  const { data: historical, isLoading: isHistLoading } = usePlazaHistorical(plazaId);

  const { profile, isConfigured } = useDecisionProfile();

  const decisionParams = useMemo(() => {
    if (!profile) return undefined;
    const params: Record<string, string> = {};
    if (profile.profession) params.user_profession = profile.profession;
    if (profile.finalScore !== null && profile.finalScore !== undefined)
      params.user_score = String(profile.finalScore);
    if (profile.origin) {
      if (
        profile.origin.type === 'coordinates' &&
        profile.origin.latitude &&
        profile.origin.longitude
      ) {
        params.origin_lat = String(profile.origin.latitude);
        params.origin_lon = String(profile.origin.longitude);
      } else if (profile.origin.type === 'manual') {
        if (profile.origin.district) params.origin_district = profile.origin.district;
        if (profile.origin.province) params.origin_province = profile.origin.province;
        if (profile.origin.department) params.origin_department = profile.origin.department;
      }
    }
    return params;
  }, [profile]);

  const { data: recommendation } = useRecommendation(plazaId, decisionParams);
  const { data: accessibility } = useAccessibility(plazaId, decisionParams);
  const { data: climate } = useClimate(plazaId);
  const { data: connectivity } = useConnectivity(plazaId);

  if (isPlazaLoading) {
    return (
      <div className="flex-1 min-w-[280px] bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-pulse flex flex-col justify-center items-center h-96">
        <div className="w-8 h-8 rounded-full border-2 border-[#aa3bff] border-t-transparent animate-spin mb-3" />
        <span className="text-xs text-gray-500 font-medium">Cargando plaza...</span>
      </div>
    );
  }

  if (isPlazaError || !plaza) {
    return (
      <div className="flex-1 min-w-[280px] bg-red-50/50 border border-red-200 rounded-2xl p-6 flex flex-col items-center text-center">
        <ShieldAlert className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-xs font-bold text-red-800">Error al cargar la plaza</p>
        <button
          onClick={onRemove}
          className="mt-4 px-3 py-1.5 bg-red-100 text-red-700 text-xs font-semibold rounded-lg hover:bg-red-200 transition-colors"
        >
          Quitar de comparación
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[290px] max-w-[340px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden">
      {/* Card Header */}
      <div className="p-5 bg-gradient-to-br from-purple-50/50 via-white to-gray-50/50 border-b border-gray-100 relative">
        <button
          onClick={onRemove}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
          title="Quitar"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-purple-100 text-[#aa3bff]">
            {plaza.categoria_establecimiento || 'IPRESS'}
          </span>
          <span
            className={cn(
              'px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider',
              plaza.tipo_plaza === 'remunerada'
                ? 'bg-green-100 text-green-700'
                : 'bg-orange-100 text-orange-700',
            )}
          >
            {plaza.tipo_plaza}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2 pr-6">
          {plaza.nombre_establecimiento || plaza.codigo_renipress}
        </h3>

        <p className="text-xs font-bold text-[#aa3bff] mt-1 uppercase">{plaza.profesion}</p>
      </div>

      {/* Card Content - Sections */}
      <div className="p-5 flex-1 space-y-6 overflow-y-auto custom-scrollbar text-xs">
        {/* Global Recommendation & Scores Summary */}
        <div className="space-y-3">
          {/* Global Score Banner */}
          <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 p-3.5 rounded-xl text-white shadow-sm space-y-1.5 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Puntaje Global</span>
              </div>
              {recommendation?.badge && (
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-amber-400 text-purple-950">
                  {recommendation.badge}
                </span>
              )}
            </div>

            {recommendation ? (
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black text-white flex items-baseline gap-1">
                  {recommendation.recommendation_score}
                  <span className="text-[10px] text-purple-300 font-normal">/ 100</span>
                </div>
                <span className="text-[11px] font-semibold text-purple-200 truncate max-w-[140px]">
                  {recommendation.recommendation_level}
                </span>
              </div>
            ) : (
              <div className="text-[10px] text-purple-300 italic">Calculando recomendación...</div>
            )}
          </div>

          {/* Decision Scores Grid (4 categories) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* 1. Tu Oportunidad */}
            <div className="p-2.5 bg-purple-50/70 rounded-xl border border-purple-100 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-purple-900 mb-1">
                <TrendingUp className="w-3 h-3 text-[#aa3bff]" />
                <span className="truncate">Oportunidad</span>
              </div>
              <div>
                <div className="font-black text-sm text-purple-950">
                  {recommendation?.breakdown?.user_opportunity ?? '-'}
                  <span className="text-[10px] text-purple-700 font-normal">/100</span>
                </div>
                <span className="text-[9px] text-purple-700 font-medium block truncate">
                  {recommendation?.breakdown?.user_opportunity_detail?.level_display ??
                    (isConfigured ? 'Calculado' : 'Sin perfil')}
                </span>
              </div>
            </div>

            {/* 2. Accesibilidad */}
            <div className="p-2.5 bg-blue-50/70 rounded-xl border border-blue-100 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-blue-900 mb-1">
                <Car className="w-3 h-3 text-blue-600" />
                <span className="truncate">Accesibilidad</span>
              </div>
              <div>
                <div className="font-black text-sm text-blue-950">
                  {accessibility?.accessibility_score ?? '-'}
                  <span className="text-[10px] text-blue-700 font-normal">/100</span>
                </div>
                <span className="text-[9px] text-blue-700 font-medium block truncate">
                  {accessibility?.distance_km
                    ? `${accessibility.distance_km} km (${accessibility.estimated_time_minutes} min)`
                    : 'Sin origen'}
                </span>
              </div>
            </div>

            {/* 3. Clima */}
            <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-100 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-900 mb-1">
                <CloudSun className="w-3 h-3 text-amber-600" />
                <span className="truncate">Clima</span>
              </div>
              <div>
                <div className="font-black text-sm text-amber-950">
                  {recommendation?.breakdown?.climate ?? '-'}
                  <span className="text-[10px] text-amber-700 font-normal">/100</span>
                </div>
                <span className="text-[9px] text-amber-700 font-medium block truncate">
                  {climate?.average_temperature
                    ? `${climate.average_temperature}°C (${climate.climate_type})`
                    : '-'}
                </span>
              </div>
            </div>

            {/* 4. Conectividad */}
            <div className="p-2.5 bg-teal-50/70 rounded-xl border border-teal-100 flex flex-col justify-between">
              <div className="flex items-center gap-1 text-[10px] font-bold text-teal-900 mb-1">
                <Wifi className="w-3 h-3 text-teal-600" />
                <span className="truncate">Conectividad</span>
              </div>
              <div>
                <div className="font-black text-sm text-teal-950">
                  {connectivity?.internet_quality_score ?? '-'}
                  <span className="text-[10px] text-teal-700 font-normal">/100</span>
                </div>
                <span className="text-[9px] text-teal-700 font-medium block truncate">
                  {connectivity?.claro_coverage ? `Claro: ${connectivity.claro_coverage}` : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-2.5">
          <div className="font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#aa3bff]" />
            Ubicación e Institución
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 text-gray-600">
            <span>Ubicación:</span>
            <span
              className="font-semibold text-gray-900 text-right truncate"
              title={`${plaza.distrito}, ${plaza.provincia}`}
            >
              {plaza.distrito}, {plaza.departamento}
            </span>

            <span>Inst. Ofertante:</span>
            <span
              className="font-semibold text-gray-900 text-right truncate"
              title={plaza.institucion_ofertante}
            >
              {plaza.institucion_ofertante || '-'}
            </span>

            <span>DIRESA:</span>
            <span className="font-semibold text-gray-900 text-right truncate" title={plaza.diresa}>
              {plaza.diresa || '-'}
            </span>

            <span>RENIPRESS:</span>
            <span className="font-semibold text-gray-900 text-right">{plaza.codigo_renipress}</span>
          </div>
        </div>

        {/* Conditions */}
        <div className="space-y-2.5">
          <div className="font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#aa3bff]" />
            Condiciones de la Plaza
          </div>
          <div className="flex flex-wrap gap-1.5">
            {plaza.grado_dificultad && (
              <span className="px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 font-bold border border-orange-200">
                GD-{plaza.grado_dificultad}
              </span>
            )}
            {plaza.zaf && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                ZAF
              </span>
            )}
            {plaza.ze && (
              <span className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 font-bold border border-sky-200">
                ZE
              </span>
            )}
          </div>
        </div>

        {/* Historical Indicators */}
        <div className="space-y-2.5">
          <div className="font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-[#aa3bff]" />
            Indicadores de Adjudicación Histórica
          </div>
          {isHistLoading ? (
            <div className="h-6 bg-gray-100 animate-pulse rounded" />
          ) : historical ? (
            <div className="space-y-2">
              {historical.confidence === 'Insuficiente' ? (
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 font-medium text-[11px] text-center">
                  Información histórica limitada
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 block">Dificultad Hist.</span>
                    <span
                      className={cn(
                        'font-bold text-xs block mt-0.5',
                        historical.difficulty === 'Muy Alta' && 'text-red-600',
                        historical.difficulty === 'Alta' && 'text-orange-600',
                        historical.difficulty === 'Media' && 'text-amber-600',
                        historical.difficulty === 'Baja' && 'text-green-600',
                        historical.difficulty === 'Muy Baja' && 'text-blue-600',
                      )}
                    >
                      {historical.difficulty}
                    </span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-[10px] text-gray-500 block">Confianza</span>
                    <span
                      className={cn(
                        'font-bold text-xs block mt-0.5',
                        historical.confidence === 'Muy Alta' && 'text-emerald-600',
                        historical.confidence === 'Alta' && 'text-teal-600',
                        historical.confidence === 'Media' && 'text-sky-600',
                        historical.confidence === 'Baja' && 'text-zinc-600',
                      )}
                    >
                      {historical.confidence}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400 italic">Sin datos</span>
          )}
        </div>

        {/* Historical Stats */}
        <div className="space-y-2.5">
          <div className="font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
            <Award className="w-3.5 h-3.5 text-[#aa3bff]" />
            Estadísticas Históricas
          </div>
          {isHistLoading ? (
            <div className="h-16 bg-gray-100 animate-pulse rounded" />
          ) : historical && historical.stats && historical.stats.total_admitted > 0 ? (
            <div className="bg-purple-50/40 p-3 rounded-xl border border-purple-100/60 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Puntaje Mínimo:</span>
                <span className="font-bold text-gray-900">
                  {historical.stats.min_score ? historical.stats.min_score.toFixed(4) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Puntaje Promedio:</span>
                <span className="font-bold text-gray-900">
                  {historical.stats.avg_score ? historical.stats.avg_score.toFixed(4) : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-purple-100/60 pt-1.5">
                <span className="text-gray-600">Último Ranking:</span>
                <span className="font-bold text-[#aa3bff]">
                  {historical.stats.last_admitted_ranking
                    ? `Puesto ${historical.stats.last_admitted_ranking}`
                    : '-'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Adjudicados:</span>
                <span className="font-bold text-gray-900">
                  {historical.stats.total_admitted} postulantes
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-xl text-center text-gray-400 italic">
              No hay adjudicaciones históricas registradas.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ComparePanel() {
  const isCompareOpen = useAppStore((state) => state.isCompareOpen);
  const toggleCompareView = useAppStore((state) => state.toggleCompareView);
  const comparedPlazaIds = useAppStore((state) => state.comparedPlazaIds);
  const removePlazaFromCompare = useAppStore((state) => state.removePlazaFromCompare);
  const clearCompare = useAppStore((state) => state.clearCompare);

  if (!isCompareOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={() => toggleCompareView(false)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-50 text-[#aa3bff] rounded-xl border border-purple-100">
              <GitCompare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
                Comparativa de Plazas SERUMS
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Comparación lado a lado de características, condiciones e indicadores históricos (
                {comparedPlazaIds.length}/3 plazas)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedPlazaIds.length > 0 && (
              <button
                onClick={clearCompare}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                Limpiar todo
              </button>
            )}
            <button
              onClick={() => toggleCompareView(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-6 overflow-x-auto overflow-y-auto bg-gray-50/50 custom-scrollbar">
          {comparedPlazaIds.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-[#aa3bff] mb-4">
                <GitCompare className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-gray-900">No hay plazas seleccionadas</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1">
                Puedes agregar hasta 3 plazas para compararlas haciendo clic en el botón de
                comparación desde el panel de detalles o desde los marcadores del mapa.
              </p>
            </div>
          ) : (
            <div className="flex gap-6 justify-center min-w-max pb-2">
              {comparedPlazaIds.map((id) => (
                <PlazaCompareCard
                  key={id}
                  plazaId={id}
                  onRemove={() => removePlazaFromCompare(id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
