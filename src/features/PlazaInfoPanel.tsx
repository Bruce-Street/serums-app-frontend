import {
  X,
  MapPin,
  Building2,
  Stethoscope,
  ShieldAlert,
  History,
  ChevronLeft,
  ChevronRight,
  GitCompare,
  Heart,
  Compass,
  CloudSun,
  Wifi,
  ChevronDown,
  ChevronUp,
  Thermometer,
  Clock,
  Car,
  HelpCircle,
  Info,
  TrendingUp,
} from 'lucide-react';


import {
  usePlaza,
  usePlazasMap,
  usePlazaHistorical,
  useAccessibility,
  useClimate,
  useConnectivity,
  useRecommendation,
} from '../hooks/queries';
import { useDecisionProfile } from '../hooks/useDecisionProfile';
import { useAppStore } from '../store/useAppStore';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '../utils/cn';
import { useMemo, useState, useEffect, useRef } from 'react';
import type { Filters } from '@/types';

export function PlazaInfoPanel() {
  const selectedEstablishment = useAppStore((state) => state.selectedEstablishment);
  const setSelectedEstablishment = useAppStore((state) => state.setSelectedEstablishment);

  const filters = useAppStore((state) => state.filters);
  const { data: plazasMap, isSuccess } = usePlazasMap(filters);

  const { profile, isConfigured } = useDecisionProfile();

  // Hydrate establishment if it came from search without plazas
  const hydratedEstablishment = useMemo(() => {
    if (!selectedEstablishment) return undefined;
    if (selectedEstablishment.plazas && selectedEstablishment.plazas.length > 0)
      return selectedEstablishment;

    const found = plazasMap?.find(
      (p) => p.codigo_renipress_id === selectedEstablishment.codigo_renipress_id,
    );
    return found || selectedEstablishment;
  }, [selectedEstablishment, plazasMap]);

  const firstPlazaId = hydratedEstablishment?.plazas?.[0]?.id;
  const [activePlazaId, setActivePlazaId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (firstPlazaId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActivePlazaId(firstPlazaId);
    }
  }, [firstPlazaId]);

  const { data: plazaDetails, isLoading, isError } = usePlaza(activePlazaId);
  const { data: historicalData, isLoading: isHistLoading } = usePlazaHistorical(activePlazaId);

  // Decision Profile queries
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

  const { data: recommendationData } = useRecommendation(activePlazaId, decisionParams);
  const { data: accessibilityData } = useAccessibility(activePlazaId, decisionParams);
  const { data: climateData } = useClimate(activePlazaId);
  const { data: connectivityData } = useConnectivity(activePlazaId);

  const [openSection, setOpenSection] = useState<'accessibility' | 'climate' | 'connectivity' | null>(
    'accessibility',
  );
  const [showOpportunityHelp, setShowOpportunityHelp] = useState(false);



  const comparedPlazaIds = useAppStore((state) => state.comparedPlazaIds);
  const addPlazaToCompare = useAppStore((state) => state.addPlazaToCompare);
  const removePlazaFromCompare = useAppStore((state) => state.removePlazaFromCompare);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const currentAno = filters.proceso_ano || '';
  const currentPeriodo = filters.proceso_periodo || '';

  const isOpen = !!selectedEstablishment;

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Full Screen View State
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  // Track failed image indices to show placeholder errors
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});

  // Refs to track active filters when the establishment was selected
  const filtersAtSelectionRef = useRef<Partial<Filters>>({});

  useEffect(() => {
    if (selectedEstablishment) {
      filtersAtSelectionRef.current = filters;
    }
  }, [selectedEstablishment, filters]);

  // Close the panel if the selected establishment is filtered out after changing filters
  useEffect(() => {
    if (selectedEstablishment && plazasMap && isSuccess) {
      const filtersChanged =
        JSON.stringify(filtersAtSelectionRef.current) !== JSON.stringify(filters);
      if (filtersChanged) {
        const isStillPresent = plazasMap.some(
          (p) => p.codigo_renipress_id === selectedEstablishment.codigo_renipress_id,
        );
        if (!isStillPresent) {
          setSelectedEstablishment(undefined);
        }
      }
    }
  }, [filters, plazasMap, isSuccess, selectedEstablishment, setSelectedEstablishment]);

  // Reset states when active plaza changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentImageIndex(0);
    setFullScreenImage(null);
    setFailedImages({});
  }, [activePlazaId]);

  // Extract images
  const images = useMemo(() => {
    if (!plazaDetails) return [];
    return [plazaDetails.imagen_1, plazaDetails.imagen_2, plazaDetails.imagen_3].filter(
      Boolean,
    ) as string[];
  }, [plazaDetails]);

  // Keyboard navigation for full screen images
  useEffect(() => {
    if (!fullScreenImage) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setFullScreenImage(null);
      } else if (e.key === 'ArrowLeft' && images.length > 1) {
        setCurrentImageIndex((prev) => {
          const nextIdx = prev === 0 ? images.length - 1 : prev - 1;
          setFullScreenImage(images[nextIdx]);
          return nextIdx;
        });
      } else if (e.key === 'ArrowRight' && images.length > 1) {
        setCurrentImageIndex((prev) => {
          const nextIdx = prev === images.length - 1 ? 0 : prev + 1;
          setFullScreenImage(images[nextIdx]);
          return nextIdx;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullScreenImage, images]);

  const currentImageHasFailed = failedImages[currentImageIndex];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
          onClick={() => setSelectedEstablishment(undefined)}
        />
      )}

      <div
        className={cn(
          'fixed right-0 top-16 bottom-0 z-50 w-full md:w-[420px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <h2 className="font-semibold text-lg text-gray-900 truncate pr-4">
            Detalles de la Plaza
          </h2>
          <button
            onClick={() => setSelectedEstablishment(undefined)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!hydratedEstablishment ? null : (
            <div className="space-y-6">
              {/* Error card for lazy plaza query failure */}
              {isError && (
                <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-xl flex items-start gap-3 shadow-xs">
                  <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <h4 className="font-bold text-xs">Error al cargar detalles</h4>
                    <p className="text-[11px] text-red-650 mt-0.5 leading-relaxed">
                      No se pudo recuperar la información adicional del establecimiento. Por favor,
                      verifique el filtro de proceso seleccionado o su conexión de red.
                    </p>
                  </div>
                </div>
              )}

              {/* Image Carousel (Google Maps style) */}
              {isLoading ? (
                <div className="w-full h-48 bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-300 animate-bounce" />
                </div>
              ) : images.length > 0 ? (
                <div className="relative w-full h-48 bg-gray-100 rounded-2xl overflow-hidden group shadow-sm border border-gray-100">
                  <div
                    className="w-full h-full flex transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {images.map((imgUrl, idx) => {
                      const hasFailed = failedImages[idx];
                      return hasFailed ? (
                        <div
                          key={idx}
                          className="w-full h-full shrink-0 relative flex flex-col items-center justify-center bg-gray-50 border border-gray-100 p-4 select-none"
                        >
                          <Building2 className="w-8 h-8 text-[#aa3bff]/30 mb-2" />
                          <span className="text-xs text-gray-500 font-semibold">
                            Error al cargar la imagen
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5">
                            El archivo no se encuentra disponible
                          </span>
                        </div>
                      ) : (
                        <button
                          key={idx}
                          onClick={() => setFullScreenImage(imgUrl)}
                          className="w-full h-full shrink-0 relative block p-0 border-none cursor-pointer overflow-hidden"
                        >
                          <img
                            src={imgUrl}
                            alt={`Imagen ${idx + 1} de ${hydratedEstablishment.nombre_establecimiento}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            onError={() => {
                              setFailedImages((prev) => ({ ...prev, [idx]: true }));
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                        </button>
                      );
                    })}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1,
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 p-1.5 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer active:scale-90"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1,
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 text-gray-800 p-1.5 rounded-full shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer active:scale-90"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={cn(
                              'w-1.5 h-1.5 rounded-full transition-all cursor-pointer border-none',
                              currentImageIndex === idx ? 'bg-white w-3' : 'bg-white/50',
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // Empty placeholder - statically rendered and viewer is blocked
                <div className="w-full h-44 bg-linear-to-br from-[#aa3bff]/5 to-indigo-50/50 border border-[#aa3bff]/10 rounded-2xl flex flex-col items-center justify-center text-center p-6 select-none">
                  <Building2 className="w-8 h-8 text-[#aa3bff]/30 mb-2" />
                  <span className="text-xs text-gray-400 font-medium">
                    Sin imágenes de establecimiento
                  </span>
                </div>
              )}

              {/* Primary User Opportunity & Recommendation Card */}
              <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 p-4 rounded-2xl text-white shadow-lg relative overflow-hidden space-y-3">
                <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-purple-500/10 rounded-full blur-xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-purple-200">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <span>Tu Oportunidad</span>
                    <button
                      type="button"
                      onClick={() => setShowOpportunityHelp((prev) => !prev)}
                      className="text-purple-300 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                      title="Acerca de este indicador"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {recommendationData?.badge && (
                    <span className="px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-full bg-amber-400 text-purple-950 shadow-xs">
                      {recommendationData.badge}
                    </span>
                  )}
                </div>

                {isConfigured && recommendationData ? (
                  <>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-3xl font-black tracking-tight text-white flex items-baseline gap-1">
                          {recommendationData.breakdown?.user_opportunity_detail?.score ??
                            recommendationData.breakdown?.user_opportunity ??
                            recommendationData.recommendation_score}
                          <span className="text-xs text-purple-300 font-normal">/ 100</span>
                        </div>
                        <p className="text-xs font-semibold text-purple-200 mt-0.5">
                          {recommendationData.breakdown?.user_opportunity_detail?.level_display ??
                            recommendationData.recommendation_level}
                        </p>
                      </div>

                      <div className="text-right text-[10px] text-purple-200/90 space-y-1 bg-white/10 px-2.5 py-1.5 rounded-xl backdrop-blur-xs border border-white/10">
                        <div>
                          <span className="text-purple-300">Evidencia: </span>
                          <span className="font-semibold text-white">
                            {recommendationData.breakdown?.user_opportunity_detail
                              ?.historical_sample_size
                              ? `${recommendationData.breakdown.user_opportunity_detail.historical_sample_size} adjudicaciones`
                              : 'No disponible'}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-300">Períodos: </span>
                          <span className="font-semibold text-white">
                            {recommendationData.breakdown?.user_opportunity_detail
                              ?.historical_period_count ?? 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-purple-300">Confianza: </span>
                          <span className="font-semibold text-amber-300">
                            {recommendationData.breakdown?.user_opportunity_detail
                              ?.confidence_display ?? 'Moderada'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Source / Subtext tag */}
                    <div className="flex items-center justify-between text-[10px] text-purple-300/80 pt-1 border-t border-white/10 font-mono">
                      <span>
                        Basado en:{' '}
                        {recommendationData.breakdown?.user_opportunity_detail?.source ===
                        'difficulty_fallback'
                          ? 'Grado de Dificultad (Sin historial)'
                          : 'Datos Históricos SERUMS'}
                      </span>
                      <span>
                        Score global: {recommendationData.recommendation_score}/100
                      </span>
                    </div>

                    {/* Explanation Banner */}
                    {recommendationData.breakdown?.user_opportunity_detail?.explanation && (
                      <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-[10px] text-purple-200 flex items-start gap-1.5 leading-relaxed">
                        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          {recommendationData.breakdown.user_opportunity_detail.explanation}
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-2 text-center space-y-1">
                    <p className="text-xs text-purple-200 font-medium">
                      Complete su Perfil de Decisión para ver su oportunidad personalizada.
                    </p>
                  </div>
                )}

                {/* Educational Help Box */}
                {showOpportunityHelp && (
                  <div className="bg-purple-950/95 border border-purple-400/30 rounded-xl p-3 text-[11px] text-purple-100 space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between font-bold text-amber-300">
                      <span>¿Cómo se calcula Tu Oportunidad?</span>
                      <button
                        type="button"
                        onClick={() => setShowOpportunityHelp(false)}
                        className="text-purple-300 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="leading-relaxed">
                      <strong>Tu Oportunidad</strong> compara tu puntaje con los puntajes históricos
                      de postulantes que adjudicaron esta profesión en este establecimiento. Es un
                      indicador de favorabilidad relativa, <em>no una probabilidad estadística de adjudicación</em>.
                    </p>
                    <p className="leading-relaxed text-[10px] text-purple-300">
                      • La ausencia de registros históricos en algunos períodos no se asume como demanda cero (la plaza o profesión pudo no haber sido ofertada o los datos no están disponibles).
                    </p>
                    <p className="leading-relaxed text-[10px] text-purple-300">
                      • Si no existen registros previos para esta plaza y profesión, se utiliza una estimación conservadora basada en el grado de dificultad de la plaza.
                    </p>
                  </div>
                )}
              </div>


              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  {plazaDetails && (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-50 text-[#aa3bff] border border-[#aa3bff]/20">
                      {plazaDetails.categoria_establecimiento}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                  {hydratedEstablishment.nombre_establecimiento}
                </h3>
                <p className="text-xs font-semibold text-[#aa3bff] mt-1.5 uppercase tracking-wide">
                  RENIPRESS: {hydratedEstablishment.codigo_renipress_id}
                </p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 shadow-xs">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <MapPin className="w-4 h-4 text-[#aa3bff]" />
                  Ubicación
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div className="text-gray-500">Departamento</div>
                  <div className="font-semibold text-right text-gray-900">
                    {plazaDetails?.departamento || '-'}
                  </div>
                  <div className="text-gray-500">Provincia</div>
                  <div className="font-semibold text-right text-gray-900">
                    {plazaDetails?.provincia || '-'}
                  </div>
                  <div className="text-gray-500">Distrito</div>
                  <div className="font-semibold text-right text-gray-900">
                    {plazaDetails?.distrito || '-'}
                  </div>
                </div>
              </div>

              {/* Decision Support Cards Section (Accessibility, Climate, Connectivity) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                  <Compass className="w-4 h-4 text-[#aa3bff]" />
                  Análisis de Decisión
                </div>

                {/* 1. ACCESSIBILITY CARD */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
                  <button
                    onClick={() =>
                      setOpenSection((prev) => (prev === 'accessibility' ? null : 'accessibility'))
                    }
                    className="w-full p-3.5 bg-gray-50/70 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                        <Car className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-xs text-gray-900">Accesibilidad</h4>
                        <span className="text-[10px] text-gray-500 font-medium">Distancia y tiempo de viaje</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {accessibilityData?.accessibility_level && (
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[10px] font-bold rounded-md border',
                            accessibilityData.accessibility_level === 'Excelente' &&
                              'bg-green-50 text-green-700 border-green-200',
                            accessibilityData.accessibility_level === 'Bueno' &&
                              'bg-emerald-50 text-emerald-700 border-emerald-200',
                            accessibilityData.accessibility_level === 'Regular' &&
                              'bg-amber-50 text-amber-700 border-amber-200',
                            accessibilityData.accessibility_level === 'Pobre' &&
                              'bg-orange-50 text-orange-700 border-orange-200',
                            accessibilityData.accessibility_level === 'Muy Pobre' &&
                              'bg-red-50 text-red-700 border-red-200',
                          )}
                        >
                          {accessibilityData.accessibility_level}
                        </span>
                      )}
                      {openSection === 'accessibility' ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {openSection === 'accessibility' && (
                    <div className="p-4 border-t border-gray-100 space-y-3 bg-white text-xs">
                      {accessibilityData?.available ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-blue-50/50 p-2.5 rounded-xl border border-blue-100 flex items-center gap-2">
                              <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                              <div>
                                <div className="text-[10px] text-gray-500">Distancia</div>
                                <div className="font-bold text-gray-900">
                                  {accessibilityData.distance_km} km
                                </div>
                              </div>
                            </div>

                            <div className="bg-purple-50/50 p-2.5 rounded-xl border border-purple-100 flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#aa3bff] shrink-0" />
                              <div>
                                <div className="text-[10px] text-gray-500">Tiempo Est.</div>
                                <div className="font-bold text-gray-900">
                                  {accessibilityData.estimated_time_minutes} min
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
                            <span className="text-gray-500 text-[11px]">Puntaje Accesibilidad</span>
                            <span className="font-bold text-blue-700">
                              {accessibilityData.accessibility_score} / 100
                            </span>
                          </div>

                          <span className="text-[9px] text-gray-400 block text-right">
                            Proveedor: {accessibilityData.provider || 'OpenRouteService'}
                          </span>
                        </>
                      ) : (
                        <div className="bg-amber-50/60 border border-amber-200 text-amber-900 p-3 rounded-xl text-center space-y-1">
                          <p className="font-semibold text-xs">Configure su Perfil de Decisión</p>
                          <p className="text-[11px] text-amber-700">
                            Guarde su ubicación de origen en el panel flotante para calcular distancias y tiempos de viaje.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. CLIMATE CARD */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
                  <button
                    onClick={() => setOpenSection((prev) => (prev === 'climate' ? null : 'climate'))}
                    className="w-full p-3.5 bg-gray-50/70 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                        <CloudSun className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-xs text-gray-900">Clima</h4>
                        <span className="text-[10px] text-gray-500 font-medium">Temperatura y heladas</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {climateData?.climate_type && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-50 text-amber-800 border border-amber-200 truncate max-w-[110px]">
                          {climateData.climate_type}
                        </span>
                      )}
                      {openSection === 'climate' ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {openSection === 'climate' && (
                    <div className="p-4 border-t border-gray-100 space-y-3 bg-white text-xs">
                      {climateData?.available ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
                              <div>
                                <div className="text-[10px] text-gray-500">Temp. Promedio</div>
                                <div className="font-bold text-gray-900">
                                  {climateData.average_temperature}°C
                                </div>
                              </div>
                            </div>

                            <div className="bg-sky-50/50 p-2.5 rounded-xl border border-sky-100 flex items-center gap-2">
                              <Thermometer className="w-4 h-4 text-sky-600 shrink-0" />
                              <div>
                                <div className="text-[10px] text-gray-500">Rango (Min/Max)</div>
                                <div className="font-bold text-gray-900">
                                  {climateData.minimum_temperature}° ~ {climateData.maximum_temperature}°C
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 bg-gray-50 p-2.5 rounded-xl text-[11px]">
                            <span className="text-gray-500">Precipitaciones:</span>
                            <span className="font-semibold text-right text-gray-900">
                              {climateData.rainfall_level}
                            </span>
                            <span className="text-gray-500">Probabilidad de Heladas:</span>
                            <span className="font-semibold text-right text-gray-900">
                              {climateData.frost_probability}
                            </span>
                          </div>

                          {climateData.badges?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {climateData.badges.map((badge, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          )}

                          <span className="text-[9px] text-gray-400 block text-right">
                            Fuente: {climateData.provider || 'SENAMHI'}
                          </span>
                        </>
                      ) : (
                        <p className="text-xs text-gray-500 italic text-center p-2">
                          Información climática no disponible.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. CONNECTIVITY CARD */}
                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-2xs transition-all">
                  <button
                    onClick={() =>
                      setOpenSection((prev) => (prev === 'connectivity' ? null : 'connectivity'))
                    }
                    className="w-full p-3.5 bg-gray-50/70 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-100">
                        <Wifi className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-bold text-xs text-gray-900">Conectividad</h4>
                        <span className="text-[10px] text-gray-500 font-medium">Cobertura móvil e Internet</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {connectivityData?.internet_quality_score && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                          {connectivityData.internet_quality_score} / 100 pts
                        </span>
                      )}
                      {openSection === 'connectivity' ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {openSection === 'connectivity' && (
                    <div className="p-4 border-t border-gray-100 space-y-3 bg-white text-xs">
                      {connectivityData?.available ? (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { operator: 'Claro', coverage: connectivityData.claro_coverage, color: 'text-red-600' },
                              { operator: 'Movistar', coverage: connectivityData.movistar_coverage, color: 'text-blue-600' },
                              { operator: 'Entel', coverage: connectivityData.entel_coverage, color: 'text-amber-600' },
                              { operator: 'Bitel', coverage: connectivityData.bitel_coverage, color: 'text-yellow-600' },
                            ].map((op) => (
                              <div key={op.operator} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex flex-col justify-between">
                                <span className={cn("font-bold text-xs", op.color)}>{op.operator}</span>
                                <div className="flex items-center justify-between mt-1 text-[11px]">
                                  <span className="text-gray-500">{op.coverage}</span>
                                  <span className="text-amber-500 font-bold text-[10px]">
                                    {op.coverage === 'Excelente' ? '★★★★★' : op.coverage === 'Bueno' ? '★★★★☆' : op.coverage === 'Regular' ? '★★★☆☆' : '★★☆☆☆'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center bg-teal-50/50 border border-teal-100 p-2.5 rounded-xl">
                            <span className="text-gray-600 text-[11px] font-medium">Calidad de Internet Global</span>
                            <span className="font-black text-teal-700 text-sm">
                              {connectivityData.internet_quality_score} / 100
                            </span>
                          </div>

                          <span className="text-[9px] text-gray-400 block text-right">
                            Fuente: {connectivityData.provider || 'OSIPTEL'}
                          </span>
                        </>
                      ) : (
                        <p className="text-xs text-gray-500 italic text-center p-2">
                          Información de conectividad no disponible.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>


              {/* Professions / Plazas list */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                  <Stethoscope className="w-4 h-4 text-[#aa3bff]" />
                  Profesiones
                </div>
                {!hydratedEstablishment.plazas || hydratedEstablishment.plazas.length === 0 ? (
                  <p className="text-xs text-gray-500">Cargando profesiones...</p>
                ) : (
                  <div className="space-y-2">
                    {hydratedEstablishment.plazas.map((p) => {
                      const isCompared = comparedPlazaIds.includes(p.id);
                      const isActive = p.id === activePlazaId;
                      return (
                        <div
                          key={p.id}
                          onClick={() => setActivePlazaId(p.id)}
                          className={cn(
                            'flex items-center justify-between border p-3 rounded-xl shadow-xs cursor-pointer hover:border-[#aa3bff]/50 transition-all',
                            isActive
                              ? 'border-[#aa3bff] bg-purple-50/30'
                              : 'border-gray-100 bg-white',
                          )}
                        >
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">
                              {p.profesion}
                            </span>
                            <span
                              className={cn(
                                'mt-1 w-max px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider',
                                p.tipo_plaza === 'remunerada'
                                  ? 'bg-green-50 border border-green-200 text-green-700'
                                  : 'bg-orange-50 border border-orange-200 text-orange-700',
                              )}
                            >
                              {p.tipo_plaza}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isCompared) {
                                removePlazaFromCompare(p.id);
                              } else {
                                if (comparedPlazaIds.length >= 3) {
                                  alert('Puedes comparar hasta un máximo de 3 plazas.');
                                  return;
                                }
                                addPlazaToCompare(p.id);
                              }
                            }}
                            className={cn(
                              'p-2 rounded-lg border transition-all cursor-pointer active:scale-90',
                              isCompared
                                ? 'bg-[#aa3bff] text-white border-[#aa3bff]'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50',
                            )}
                            title={isCompared ? 'Quitar de la comparación' : 'Comparar plaza'}
                          >
                            <GitCompare className="w-3.5 h-3.5" />
                          </button>

                          {/* Favorite button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isFavorite(p.id)) {
                                removeFavorite(p.id);
                              } else {
                                addFavorite({
                                  id: p.id,
                                  establishmentName: hydratedEstablishment.nombre_establecimiento,
                                  profesion: p.profesion,
                                  tipoPlaza: p.tipo_plaza,
                                  codigoRenipressId: hydratedEstablishment.codigo_renipress_id,
                                  procesoAno: currentAno,
                                  procesoPeriodo: currentPeriodo,
                                });
                              }
                            }}
                            className={cn(
                              'p-2 rounded-lg border transition-all cursor-pointer active:scale-90',
                              isFavorite(p.id)
                                ? 'bg-red-50 text-red-600 border-red-200'
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50',
                            )}
                            title={isFavorite(p.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                          >
                            <Heart
                              className="w-3.5 h-3.5"
                              fill={isFavorite(p.id) ? 'currentColor' : 'none'}
                              strokeWidth={isFavorite(p.id) ? 0 : 2}
                            />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Institution */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                  <Building2 className="w-4 h-4 text-[#aa3bff]" />
                  Información Institucional
                </div>
                {isLoading ? (
                  <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="space-y-2.5 text-xs bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-gray-500 shrink-0">Inst. Ofertante</span>
                      <span className="font-semibold text-gray-900 text-right">
                        {hydratedEstablishment.plazas?.[0]?.institucion_ofertante || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-gray-500 shrink-0">DIRESA</span>
                      <span className="font-semibold text-gray-900 text-right">
                        {plazaDetails?.diresa || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-gray-500 shrink-0">Institución</span>
                      <span className="font-semibold text-gray-900 text-right">
                        {plazaDetails?.institucion || '-'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Conditions & Indicators */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                    <ShieldAlert className="w-4 h-4 text-[#aa3bff]" />
                    Condiciones
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {hydratedEstablishment.grado_dificultad && (
                      <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-bold border border-orange-200 flex items-center gap-1.5 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        GD-{hydratedEstablishment.grado_dificultad}
                      </span>
                    )}
                    {hydratedEstablishment.zaf && (
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 shadow-xs">
                        ZAF
                      </span>
                    )}
                    {hydratedEstablishment.ze && (
                      <span className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-xs">
                        ZE
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                    Indicadores de Adjudicación Histórica
                  </div>

                  {isHistLoading ? (
                    <div className="h-8 bg-gray-105 animate-pulse rounded-lg w-full"></div>
                  ) : historicalData ? (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {historicalData.confidence === 'Insuficiente' ? (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 font-medium border border-gray-200 shadow-xs">
                          Limited historical information
                        </span>
                      ) : (
                        <>
                          {/* Difficulty Badge */}
                          <span
                            className={cn(
                              'px-3 py-1.5 rounded-lg font-bold border shadow-xs',
                              historicalData.difficulty === 'Muy Alta' &&
                                'bg-red-50 text-red-700 border-red-200',
                              historicalData.difficulty === 'Alta' &&
                                'bg-orange-50 text-orange-700 border-orange-200',
                              historicalData.difficulty === 'Media' &&
                                'bg-amber-50 text-amber-700 border-amber-200',
                              historicalData.difficulty === 'Baja' &&
                                'bg-green-50 text-green-700 border-green-200',
                              historicalData.difficulty === 'Muy Baja' &&
                                'bg-blue-50 text-blue-700 border-blue-200',
                            )}
                          >
                            GD Histórica: {historicalData.difficulty}
                          </span>

                          {/* Demand Confidence */}
                          <span
                            className={cn(
                              'px-3 py-1.5 rounded-lg font-bold border shadow-xs',
                              historicalData.confidence === 'Very High' &&
                                'bg-emerald-50 text-emerald-700 border-emerald-200',
                              historicalData.confidence === 'High' &&
                                'bg-teal-50 text-teal-700 border-teal-200',
                              historicalData.confidence === 'Medium' &&
                                'bg-sky-50 text-sky-700 border-sky-200',
                              historicalData.confidence === 'Low' &&
                                'bg-zinc-50 text-zinc-700 border-zinc-200',
                            )}
                          >
                            Confianza: {historicalData.confidence}
                          </span>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Historical Adjudications */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-4">
                  <History className="w-4 h-4 text-[#aa3bff]" />
                  Adjudicaciones Históricas
                </div>

                {isHistLoading ? (
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                  </div>
                ) : historicalData &&
                  historicalData.history &&
                  historicalData.history.length > 0 ? (
                  <div className="space-y-4">
                    {historicalData.history.map((hist) => (
                      <div key={hist.year} className="space-y-2">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Proceso {hist.year}-{hist.period}
                        </div>
                        {hist.admitted && hist.admitted.length > 0 ? (
                          <div className="space-y-2">
                            {hist.admitted.map((adm, idx) => (
                              <div
                                key={idx}
                                className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs"
                              >
                                <div className="flex items-center gap-3 border-b border-gray-100 pb-2 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#aa3bff] font-bold text-xs">
                                    {idx + 1}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-950 text-sm">
                                      {adm.name}
                                    </div>
                                    <div className="text-[10px] text-gray-405 text-gray-400">
                                      {hist.profession}
                                    </div>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-y-1 text-xs">
                                  <span className="text-gray-500">Puntaje Final:</span>
                                  <span className="font-bold text-gray-950 text-right">
                                    {adm.score.toFixed(4)}
                                  </span>
                                  <span className="text-gray-500">Ranking:</span>
                                  <span className="font-bold text-[#aa3bff] text-right">
                                    Puesto {adm.ranking}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 italic">
                            No hubo postulantes adjudicados.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic bg-gray-50 border border-gray-100 p-4 rounded-xl text-center">
                    No hay información histórica disponible para este establecimiento, profesión y
                    proceso equivalente.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Viewer Modal */}
      {fullScreenImage && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
          onClick={() => setFullScreenImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setFullScreenImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer z-50 active:scale-95"
            aria-label="Cerrar visor"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Content Area */}
          <div
            className="relative flex items-center justify-center max-w-5xl w-full px-12"
            onClick={(e) => e.stopPropagation()} // Prevent modal close on image/controls click
          >
            {/* Image Container with details overlay */}
            <div className="relative flex flex-col items-center max-w-full">
              {currentImageHasFailed ? (
                <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-2xl border border-white/10 w-[60vw] h-[50vh] select-none">
                  <Building2 className="w-16 h-16 text-[#aa3bff]/40 mb-4 animate-pulse" />
                  <span className="text-base text-white/80 font-bold">
                    Error al cargar la imagen
                  </span>
                  <span className="text-xs text-white/40 mt-1.5">
                    No se pudo recuperar el archivo de imagen
                  </span>
                </div>
              ) : (
                <img
                  src={fullScreenImage}
                  alt="Vista ampliada"
                  className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-300"
                  onError={() => {
                    setFailedImages((prev) => ({ ...prev, [currentImageIndex]: true }));
                  }}
                />
              )}
              <div className="mt-4 text-center text-white/70 text-xs font-medium">
                {hydratedEstablishment?.nombre_establecimiento} • Imagen {currentImageIndex + 1} de{' '}
                {images.length}
              </div>
            </div>

            {/* Prev button */}
            {images.length > 1 && (
              <button
                onClick={() => {
                  setCurrentImageIndex((prev) => {
                    const nextIdx = prev === 0 ? images.length - 1 : prev - 1;
                    setFullScreenImage(images[nextIdx]);
                    return nextIdx;
                  });
                }}
                className="absolute left-4 p-3 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={() => {
                  setCurrentImageIndex((prev) => {
                    const nextIdx = prev === images.length - 1 ? 0 : prev + 1;
                    setFullScreenImage(images[nextIdx]);
                    return nextIdx;
                  });
                }}
                className="absolute right-4 p-3 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-all cursor-pointer active:scale-90"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
