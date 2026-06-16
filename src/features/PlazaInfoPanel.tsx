import {
  X,
  MapPin,
  Building2,
  Stethoscope,
  ShieldAlert,
  History,
  User,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePlaza, usePlazasMap } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';
import { useMemo, useState, useEffect } from 'react';

export function PlazaInfoPanel() {
  const selectedEstablishment = useAppStore((state) => state.selectedEstablishment);
  const setSelectedEstablishment = useAppStore((state) => state.setSelectedEstablishment);

  const filters = useAppStore((state) => state.filters);
  const { data: plazasMap } = usePlazasMap(filters);

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
  const { data: plazaDetails, isLoading } = usePlaza(firstPlazaId);

  const isOpen = !!selectedEstablishment;

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Reset carousel index when active plaza changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [firstPlazaId]);

  // Extract images
  const images = useMemo(() => {
    if (!plazaDetails) return [];
    return [plazaDetails.imagen_1, plazaDetails.imagen_2, plazaDetails.imagen_3].filter(
      Boolean,
    ) as string[];
  }, [plazaDetails]);

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
                    {images.map((imgUrl, idx) => (
                      <a
                        key={idx}
                        href={imgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full shrink-0 relative block"
                      >
                        <img
                          src={imgUrl}
                          alt={`Imagen ${idx + 1} de ${hydratedEstablishment.nombre_establecimiento}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />
                      </a>
                    ))}
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
                <div className="w-full h-44 bg-linear-to-br from-[#aa3bff]/5 to-indigo-50/50 border border-[#aa3bff]/10 rounded-2xl flex flex-col items-center justify-center text-center p-6">
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
                    {hydratedEstablishment.plazas.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-xl shadow-xs"
                      >
                        <span className="font-semibold text-gray-900 text-sm">{p.profesion}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[9px] font-bold rounded-full uppercase tracking-wider',
                            p.tipo_plaza === 'remunerada'
                              ? 'bg-green-55 bg-green-50 border border-green-200 text-green-700'
                              : 'bg-orange-50 border border-orange-200 text-orange-700',
                          )}
                        >
                          {p.tipo_plaza}
                        </span>
                      </div>
                    ))}
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

              {/* Conditions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm border-b border-gray-100 pb-2">
                  <ShieldAlert className="w-4 h-4 text-[#aa3bff]" />
                  Condiciones
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {hydratedEstablishment.grado_dificultad && (
                    <span className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-700 font-bold border border-orange-200 flex items-center gap-1.5 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-55 bg-orange-500"></span>
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

              {/* Coming Soon Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 bg-[#aa3bff] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wide">
                  Próximamente
                </div>
                <div className="flex items-center gap-2 text-gray-900 font-bold text-sm mb-4">
                  <History className="w-4 h-4 text-gray-400" />
                  Adjudicaciones Históricas
                </div>

                <div className="opacity-60 pointer-events-none">
                  <div className="mb-2 text-xs font-bold text-gray-500">Proceso 2025-I</div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Juan Pérez Silva</div>
                        <div className="text-xs text-gray-500">Medicina Humana</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <div className="text-gray-500">Puntaje Final</div>
                      <div className="font-bold text-gray-900">82.15 pts</div>
                    </div>
                    <div className="flex justify-between items-center text-xs mt-1">
                      <div className="text-gray-500">Percentil Requerido</div>
                      <div className="font-bold text-[#aa3bff]">Top 12%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
