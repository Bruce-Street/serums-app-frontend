import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { useFilters } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useEffect } from 'react';

export function FiltersPanel() {
  const { data: filtersOptions, isLoading } = useFilters();
  const { isFiltersOpen, toggleFilters, filters, updateFilter } = useAppStore();

  useEffect(() => {
    if (!isLoading && filtersOptions) {
      const defaultAno = filtersOptions.anos?.[0] || '';
      const defaultPeriodo = filtersOptions.periodos?.[0] || '';
      if (defaultAno) updateFilter('proceso_ano', String(defaultAno));
      if (defaultPeriodo) updateFilter('proceso_periodo', defaultPeriodo);
    }
  }, [isLoading, filtersOptions, updateFilter]);

  if (isLoading || !filtersOptions) return null;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleFilters}
        className={cn(
          'md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl font-medium flex items-center gap-2 transition-all active:scale-95',
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
          'hidden md:flex fixed top-24 z-50 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 text-gray-700 transition-all duration-300 ease-in-out cursor-pointer',
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Filter className="w-5 h-5 text-[#aa3bff]" />
              Filters
            </h2>
            <button
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={toggleFilters}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Process Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Proceso</h3>
            <div className="space-y-2.5">
              <Select
                value={filters.proceso_ano || 'all'}
                onValueChange={(val) => updateFilter('proceso_ano', val === 'all' ? '' : val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="Todos los Años" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">Todos los Años</SelectItem>
                  {filtersOptions.anos?.map((a) => (
                    <SelectItem key={a} value={String(a)}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.proceso_periodo || 'all'}
                onValueChange={(val) => updateFilter('proceso_periodo', val === 'all' ? '' : val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="Todos los Periodos" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">Todos los Periodos</SelectItem>
                  {filtersOptions.periodos?.map((p) => (
                    <SelectItem key={p} value={p}>
                      Periodo {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</h3>
            <div className="space-y-2.5">
              <Select
                value={filters.departamento || 'all'}
                onValueChange={(val) => updateFilter('departamento', val === 'all' ? '' : val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">All Departments</SelectItem>
                  {filtersOptions.departamentos.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Professional */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Professional
            </h3>
            <div className="space-y-2.5">
              <Select
                value={filters.profesion || 'all'}
                onValueChange={(val) => updateFilter('profesion', val === 'all' ? '' : val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="All Professions" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">All Professions</SelectItem>
                  {filtersOptions.profesiones.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {filtersOptions.tipos_plaza && filtersOptions.tipos_plaza.length > 0 && (
                <Select
                  value={filters.tipo_plaza || 'all'}
                  onValueChange={(val) => updateFilter('tipo_plaza', val === 'all' ? '' : val)}
                >
                  <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                    <SelectItem value="all">All Types</SelectItem>
                    {filtersOptions.tipos_plaza.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

          {/* Institution */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Institution Info
            </h3>
            <div className="space-y-2.5">
              <Select
                value={filters.institucion_ofertante || 'all'}
                onValueChange={(val) =>
                  updateFilter('institucion_ofertante', val === 'all' ? '' : val)
                }
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="All Institutions" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">All Institutions</SelectItem>
                  {filtersOptions.instituciones_ofertantes?.map((i) => (
                    <SelectItem key={i} value={i}>
                      {i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.categoria_establecimiento || 'all'}
                onValueChange={(val) =>
                  updateFilter('categoria_establecimiento', val === 'all' ? '' : val)
                }
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">All Categories</SelectItem>
                  {filtersOptions.categorias_establecimiento?.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Conditions</h3>
            <div className="space-y-2.5">
              <Select
                value={filters.grado_dificultad || 'all'}
                onValueChange={(val) => updateFilter('grado_dificultad', val === 'all' ? '' : val)}
              >
                <SelectTrigger className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-2 focus:ring-[#aa3bff]/50 focus:border-[#aa3bff] h-10 px-3 cursor-pointer">
                  <SelectValue placeholder="All Difficulty Grades" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 rounded-xl shadow-lg">
                  <SelectItem value="all">All Difficulty Grades</SelectItem>
                  {filtersOptions.grados_dificultad?.map((g) => (
                    <SelectItem key={g} value={String(g)}>
                      GD-{g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* ZAF / ZE Toggle Pills */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => updateFilter('zaf', filters.zaf === 'true' ? '' : 'true')}
                  className={cn(
                    'flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]',
                    filters.zaf === 'true'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-emerald-100/50'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
                  )}
                >
                  ZAF
                </button>
                <button
                  onClick={() => updateFilter('ze', filters.ze === 'true' ? '' : 'true')}
                  className={cn(
                    'flex-1 py-2 px-3 text-xs font-bold rounded-xl border transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.98]',
                    filters.ze === 'true'
                      ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sky-100/50'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50',
                  )}
                >
                  ZE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
