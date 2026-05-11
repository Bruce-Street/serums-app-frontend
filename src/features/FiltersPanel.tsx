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

      <div
        className={cn(
          'fixed md:relative z-40 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col shadow-xl md:shadow-none',
          isFiltersOpen ? 'w-80 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0',
        )}
      >
        {/* Toggle Handle for Desktop */}
        <button
          onClick={toggleFilters}
          className="hidden md:flex absolute -right-4 top-4 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-50"
        >
          {isFiltersOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div
          className={cn(
            'flex-1 overflow-y-auto p-6 space-y-8',
            !isFiltersOpen && 'hidden md:hidden',
          )}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </h2>
            <button className="md:hidden p-2" onClick={toggleFilters}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Location
            </h3>
            <div className="space-y-3">
              <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
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
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Professional
            </h3>
            <div className="space-y-3">
              <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
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

              <select
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5"
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
            </div>
          </div>

          {/* Add more filter sections as needed based on filtersOptions... */}
        </div>
      </div>
    </>
  );
}
