import { X, Trash2, MapPin } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '../utils/cn';
import { useEffect } from 'react';
import type { PlazaMapItem } from '../types';

export function FavoritesPanel() {
  const isFavoritesOpen = useAppStore((state) => state.isFavoritesOpen);
  const toggleFavorites = useAppStore((state) => state.toggleFavorites);
  const { favorites, removeFavorite } = useFavorites();
  const { updateFilter, setSelectedEstablishment, filters } = useAppStore();

  const currentAno = filters.proceso_ano || '';
  const currentPeriodo = filters.proceso_periodo || '';

  useEffect(() => {
    if (isFavoritesOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFavoritesOpen]);

  const handleFavoriteClick = (favorite: {
    id: string;
    codigoRenipressId: string;
    establishmentName: string;
  }) => {
    updateFilter('proceso_ano', currentAno);
    updateFilter('proceso_periodo', currentPeriodo);
    toggleFavorites(false);

    const mockEstablishment: PlazaMapItem = {
      codigo_renipress_id: favorite.codigoRenipressId,
      nombre_establecimiento: favorite.establishmentName,
      latitud: 0,
      longitud: 0,
      grado_dificultad: '',
      zaf: false,
      ze: false,
      plazas: [],
    };

    setSelectedEstablishment(mockEstablishment);
  };

  return (
    <>
      {isFavoritesOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm md:hidden"
          onClick={() => toggleFavorites(false)}
        />
      )}

      <div
        className={cn(
          'fixed right-0 top-16 bottom-0 z-50 w-full md:w-[420px] bg-white border-l border-gray-200 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          isFavoritesOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white z-10">
          <h2 className="font-semibold text-lg text-gray-900 truncate pr-4">Favoritos</h2>
          <button
            onClick={() => toggleFavorites(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center select-none">
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No tienes favoritos guardados
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Agrega plazas a favoritos desde el panel de detalles para verlos aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite) => (
                <div
                  key={favorite.id}
                  className="bg-white border border-gray-100 rounded-xl p-4 shadow-xs hover:shadow-sm transition-shadow cursor-pointer group"
                  onClick={() => handleFavoriteClick(favorite)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">
                        {favorite.establishmentName}
                      </h3>
                      <p className="text-xs text-gray-600 truncate mb-2">{favorite.profesion}</p>
                      <span
                        className={cn(
                          'inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider',
                          favorite.tipoPlaza === 'remunerada'
                            ? 'bg-green-50 border border-green-200 text-green-700'
                            : 'bg-orange-50 border border-orange-200 text-orange-700',
                        )}
                      >
                        {favorite.tipoPlaza}
                      </span>
                      {currentAno && currentPeriodo && (
                        <span className="ml-2 inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full bg-purple-50 border border-purple-200 text-purple-700">
                          Proceso {currentAno}-{currentPeriodo}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFavorite(favorite.id);
                      }}
                      className="p-2 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all cursor-pointer active:scale-90 shrink-0"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
