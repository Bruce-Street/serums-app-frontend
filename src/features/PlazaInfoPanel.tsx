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
} from 'lucide-react';
import { usePlaza, usePlazasMap, usePlazaHistorical } from '../hooks/queries';
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
                    Indicadores de Competitividad
                  </div>
                  {isHistLoading ? (
                    <div className="h-8 bg-gray-105 animate-pulse rounded-lg w-full"></div>
                  ) : historicalData ? (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {historicalData.confidence === 'Insufficient' ? (
                        <span className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 font-medium border border-gray-200 shadow-xs">
                          Limited historical information
                        </span>
                      ) : (
                        <>
                          {/* Difficulty Badge */}
                          <span
                            className={cn(
                              'px-3 py-1.5 rounded-lg font-bold border shadow-xs',
                              historicalData.difficulty === 'Very High' &&
                                'bg-red-50 text-red-700 border-red-200',
                              historicalData.difficulty === 'High' &&
                                'bg-orange-50 text-orange-700 border-orange-200',
                              historicalData.difficulty === 'Medium' &&
                                'bg-amber-50 text-amber-700 border-amber-200',
                              historicalData.difficulty === 'Low' &&
                                'bg-green-50 text-green-700 border-green-200',
                              historicalData.difficulty === 'Very Low' &&
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
