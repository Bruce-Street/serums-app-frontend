import { X, MapPin, Building2, Stethoscope, ShieldAlert, History, User } from 'lucide-react';
import { usePlaza, usePlazasMap } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';
import { useMemo } from 'react';

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
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {!hydratedEstablishment ? null : (
            <div className="space-y-8">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  {plazaDetails && (
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {plazaDetails.categoria_establecimiento}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                  {hydratedEstablishment.nombre_establecimiento}
                </h3>
                <p className="text-sm font-medium text-[#aa3bff] mt-1">
                  RENIPRESS: {hydratedEstablishment.codigo_renipress_id}
                </p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3 shadow-sm">
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-1">
                  <MapPin className="w-4 h-4 text-[#aa3bff]" />
                  Ubicación
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500">Departamento</div>
                  <div className="font-medium text-right text-gray-900">
                    {plazaDetails?.departamento || '-'}
                  </div>
                  <div className="text-gray-500">Provincia</div>
                  <div className="font-medium text-right text-gray-900">
                    {plazaDetails?.provincia || '-'}
                  </div>
                  <div className="text-gray-500">Distrito</div>
                  <div className="font-medium text-right text-gray-900">
                    {plazaDetails?.distrito || '-'}
                  </div>
                </div>
              </div>

              {/* Professions / Plazas list */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-2">
                  <Stethoscope className="w-4 h-4 text-[#aa3bff]" />
                  Profesiones
                </div>
                {!hydratedEstablishment.plazas || hydratedEstablishment.plazas.length === 0 ? (
                  <p className="text-sm text-gray-500">Loading professions...</p>
                ) : (
                  <div className="space-y-2">
                    {hydratedEstablishment.plazas.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between bg-white border border-gray-100 p-3 rounded-lg shadow-sm"
                      >
                        <span className="font-medium text-gray-900">{p.profesion}</span>
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider',
                            p.tipo_plaza === 'remunerado'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800',
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
                <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-2">
                  <Building2 className="w-4 h-4 text-[#aa3bff]" />
                  Información Institucional
                </div>
                {isLoading ? (
                  <div className="animate-pulse flex flex-col gap-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Inst. Ofertante</span>
                      <span className="font-medium text-gray-900 text-right">
                        {hydratedEstablishment.plazas?.[0]?.institucion_ofertante || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">DIRESA</span>
                      <span className="font-medium text-gray-900 text-right">
                        {plazaDetails?.diresa || '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Institución</span>
                      <span className="font-medium text-gray-900 text-right">
                        {plazaDetails?.institucion || '-'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Conditions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-bold border-b border-gray-100 pb-2">
                  <ShieldAlert className="w-4 h-4 text-[#aa3bff]" />
                  Condiciones
                </div>
                <div className="flex flex-wrap gap-2 text-sm">
                  {hydratedEstablishment.grado_dificultad && (
                    <span className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 font-bold border border-orange-200 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
                      GD-{hydratedEstablishment.grado_dificultad}
                    </span>
                  )}
                  {hydratedEstablishment.zaf && (
                    <span className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold border border-emerald-200 shadow-sm">
                      ZAF
                    </span>
                  )}
                  {hydratedEstablishment.ze && (
                    <span className="px-3 py-1.5 rounded-lg bg-sky-100 text-sky-800 font-bold border border-sky-200 shadow-sm">
                      ZE
                    </span>
                  )}
                </div>
              </div>

              {/* Coming Soon Section */}
              <div className="mt-10 pt-8 border-t border-gray-200 relative">
                <div className="absolute top-0 right-0 -translate-y-1/2 bg-[#aa3bff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md uppercase tracking-wide">
                  Próximamente
                </div>
                <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
                  <History className="w-5 h-5 text-gray-400" />
                  Adjudicaciones Históricas
                </div>

                <div className="opacity-60 pointer-events-none">
                  <div className="mb-2 text-sm font-bold text-gray-500">Proceso 2025-I</div>
                  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Juan Pérez Silva</div>
                        <div className="text-xs text-gray-500">Medicina Humana</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-gray-500">Puntaje Final</div>
                      <div className="font-bold text-gray-900">82.15 pts</div>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-1">
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
