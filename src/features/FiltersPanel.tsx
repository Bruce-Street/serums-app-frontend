import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useFilters } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export function FiltersPanel() {
  const { data: filtersOptions, isLoading } = useFilters();
  const { isFiltersOpen, toggleFilters, filters, updateFilter } = useAppStore();

  if (isLoading || !filtersOptions) return null;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleFilters}
        className={cn(
          'md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl font-medium flex items-center gap-2',
          isFiltersOpen && 'hidden',
        )}
      >
        <Filter className="w-4 h-4" />
        Filters
      </button>

      {/* Desktop Toggle Button - Positioned outside the sliding container */}
      <button
        onClick={toggleFilters}
        className={cn(
          'hidden md:flex fixed top-24 z-50 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 text-gray-700 transition-all duration-300 ease-in-out',
          isFiltersOpen ? 'left-[330px]' : 'left-4',
        )}
      >
        {isFiltersOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      <div
        className={cn(
          'fixed md:absolute z-40 h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)] md:top-4 md:left-4 md:rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-2xl overflow-visible w-80',
          isFiltersOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-[calc(100%+2rem)]',
        )}
      >
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Filter className="w-5 h-5 text-[#aa3bff]" />
              Filters
            </h2>
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700"
              onClick={toggleFilters}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Process Filter */}
          {/*<div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Proceso</h3>
            <div className="space-y-3">
              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.proceso_ano || ''}
                onChange={(e) => updateFilter('proceso_ano', e.target.value)}
              >
                <option value="">Todos los Años</option>
                {filtersOptions.anos?.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>

              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.proceso_periodo || ''}
                onChange={(e) => updateFilter('proceso_periodo', e.target.value)}
              >
                <option value="">Todos los Periodos</option>
                {filtersOptions.periodos?.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>*/}

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</h3>
            <div className="space-y-3">
              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.departamento || ''}
                onChange={(e) => updateFilter('departamento', e.target.value)}
              >
                <option value="">All Departments</option>
                {filtersOptions.departamentos.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Professional */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Professional
            </h3>
            <div className="space-y-3">
              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.profesion || ''}
                onChange={(e) => updateFilter('profesion', e.target.value)}
              >
                <option value="">All Professions</option>
                {filtersOptions.profesiones.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              {filtersOptions.tipos_plaza && filtersOptions.tipos_plaza.length > 0 && (
                <select
                  className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                  value={filters.tipo_plaza || ''}
                  onChange={(e) => updateFilter('tipo_plaza', e.target.value)}
                >
                  <option value="">All Types</option>
                  {filtersOptions.tipos_plaza.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Institution */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Institution Info
            </h3>
            <div className="space-y-3">
              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.institucion_ofertante || ''}
                onChange={(e) => updateFilter('institucion_ofertante', e.target.value)}
              >
                <option value="">All Institutions</option>
                {filtersOptions.instituciones_ofertantes?.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>

              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.categoria_establecimiento || ''}
                onChange={(e) => updateFilter('categoria_establecimiento', e.target.value)}
              >
                <option value="">All Categories</option>
                {filtersOptions.categorias_establecimiento?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conditions</h3>
            <div className="space-y-3">
              <select
                className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] block p-2.5 transition-shadow"
                value={filters.grado_dificultad || ''}
                onChange={(e) => updateFilter('grado_dificultad', e.target.value)}
              >
                <option value="">All Difficulty Grades</option>
                {filtersOptions.grados_dificultad?.map((g) => (
                  <option key={g} value={`GD-${g}`}>
                    GD-{g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
