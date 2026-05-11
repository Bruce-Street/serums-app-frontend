import { X, MapPin, Building2, Stethoscope, ShieldAlert } from 'lucide-react';
import { usePlaza } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../utils/cn';

export function PlazaInfoPanel() {
  const selectedPlazaId = useAppStore((state) => state.selectedPlazaId);
  const setSelectedPlazaId = useAppStore((state) => state.setSelectedPlazaId);

  const { data: plaza, isLoading } = usePlaza(selectedPlazaId);

  const isOpen = !!selectedPlazaId;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setSelectedPlazaId(undefined)}
        />
      )}

      <div
        className={cn(
          'fixed right-0 top-16 bottom-0 z-50 w-full md:w-96 bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-900 truncate pr-4">Plaza Details</h2>
          <button
            onClick={() => setSelectedPlazaId(undefined)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : plaza ? (
            <div className="space-y-8">
              {/* Header Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={cn(
                      'px-2.5 py-1 text-xs font-semibold rounded-full',
                      plaza.tipo_plaza === 'remunerado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    )}
                  >
                    {plaza.tipo_plaza.toUpperCase()}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Cat {plaza.categoria}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{plaza.nombre}</h3>
                <p className="text-sm text-gray-500 mt-1">RENIPRESS: {plaza.codigo_renipress}</p>
              </div>

              {/* Location */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-medium mb-1">
                  <MapPin className="w-4 h-4 text-primary" />
                  Location
                </div>
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="text-gray-500">Department</div>
                  <div className="font-medium text-right text-gray-900">{plaza.departamento}</div>
                  <div className="text-gray-500">Province</div>
                  <div className="font-medium text-right text-gray-900">{plaza.provincia}</div>
                  <div className="text-gray-500">District</div>
                  <div className="font-medium text-right text-gray-900">{plaza.distrito}</div>
                </div>
              </div>

              {/* Institution */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-medium border-b border-gray-100 pb-2">
                  <Building2 className="w-4 h-4 text-primary" />
                  Institutional Info
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Institution</span>
                    <span className="font-medium text-gray-900">{plaza.institucion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">DIRESA</span>
                    <span className="font-medium text-gray-900">{plaza.diresa}</span>
                  </div>
                </div>
              </div>

              {/* Position */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-medium border-b border-gray-100 pb-2">
                  <Stethoscope className="w-4 h-4 text-primary" />
                  Position details
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Profession</span>
                    <span className="font-medium text-gray-900">{plaza.profesion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Available Positions</span>
                    <span className="font-medium text-gray-900">{plaza.cantidad_plazas}</span>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-900 font-medium border-b border-gray-100 pb-2">
                  <ShieldAlert className="w-4 h-4 text-primary" />
                  Conditions
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Difficulty Grade</span>
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xs">
                      {plaza.grado_dificultad}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">ZAF Bonus</span>
                    <span className={plaza.zaf ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      {plaza.zaf ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">ZE Bonus</span>
                    <span className={plaza.ze ? 'text-green-600 font-medium' : 'text-gray-400'}>
                      {plaza.ze ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 pb-8">
                <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95">
                  View full requirements
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-10">No details available</div>
          )}
        </div>
      </div>
    </>
  );
}
