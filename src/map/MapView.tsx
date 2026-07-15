import { useRef, useCallback, useEffect } from 'react';
import Map, { NavigationControl, Popup } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { usePlazasMap } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { MarkerLayer } from './MarkerLayer';
import type { MapMouseEvent } from 'maplibre-gl';
import type { PlazaMapItem } from '@/types';
import { GitCompare } from 'lucide-react';
import { cn } from '../utils/cn';

const INITIAL_VIEW_STATE = {
  longitude: -75.0,
  latitude: -9.1,
  zoom: 5,
  bearing: 0,
  pitch: 0,
};

export function MapView() {
  const mapRef = useRef<MapRef>(null);

  const filters = useAppStore((state) => state.filters);
  const selectedEstablishment = useAppStore((state) => state.selectedEstablishment);
  const setSelectedEstablishment = useAppStore((state) => state.setSelectedEstablishment);
  const flyToLocation = useAppStore((state) => state.flyToLocation);
  const setFlyToLocation = useAppStore((state) => state.setFlyToLocation);

  const comparedPlazaIds = useAppStore((state) => state.comparedPlazaIds);
  const addPlazaToCompare = useAppStore((state) => state.addPlazaToCompare);
  const removePlazaFromCompare = useAppStore((state) => state.removePlazaFromCompare);

  const { data: plazas = [], isFetching } = usePlazasMap(filters);

  useEffect(() => {
    if (flyToLocation && mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [flyToLocation.lng, flyToLocation.lat],
        zoom: 14,
        essential: true,
      });
      setFlyToLocation(undefined);
    }
  }, [flyToLocation, setFlyToLocation]);

  const onClick = useCallback(
    async (event: MapMouseEvent) => {
      if (!mapRef.current) return;
      const map = mapRef.current.getMap();
      const features = map.queryRenderedFeatures(event.point, {
        layers: ['unclustered-point', 'clusters'],
      });

      if (!features.length) {
        setSelectedEstablishment(undefined);
        return;
      }

      const feature = features[0];

      if (feature.layer.id === 'clusters') {
        const clusterId = feature.properties?.cluster_id;
        const clusterSource = map.getSource('plazas-source') as maplibregl.GeoJSONSource;

        if (clusterSource && clusterId) {
          try {
            const zoom = await clusterSource.getClusterExpansionZoom(clusterId);
            map.easeTo({
              center: (feature.geometry as GeoJSON.Point).coordinates as [number, number],
              zoom: zoom + 1,
              duration: 500,
            });
          } catch (err) {
            console.error(err);
            // Ignore zoom error
          }
        }
      } else if (feature.layer.id === 'unclustered-point') {
        const props = feature.properties;
        if (props) {
          try {
            const establishment: PlazaMapItem = {
              codigo_renipress_id: props.codigo_renipress_id,
              nombre_establecimiento: props.nombre_establecimiento,
              latitud: Number(props.latitud),
              longitud: Number(props.longitud),
              grado_dificultad: props.grado_dificultad,
              zaf: props.zaf === true || props.zaf === 'true',
              ze: props.ze === true || props.ze === 'true',
              plazas:
                typeof props.plazas === 'string' ? JSON.parse(props.plazas) : props.plazas || [],
            };
            setSelectedEstablishment(establishment);
          } catch (e) {
            console.error('Error parsing establishment properties:', e);
          }
        }
      }
    },
    [setSelectedEstablishment],
  );

  return (
    <div className="w-full h-full relative">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        onClick={onClick}
        interactiveLayerIds={['unclustered-point', 'clusters']}
        cursor="pointer"
      >
        <NavigationControl position="bottom-right" />
        <MarkerLayer data={plazas} />

        {selectedEstablishment && (
          <Popup
            longitude={selectedEstablishment.longitud}
            latitude={selectedEstablishment.latitud}
            anchor="bottom"
            onClose={() => setSelectedEstablishment(undefined)}
            closeOnClick={false}
            className="z-50 animate-fade-in"
          >
            <div className="p-2 space-y-2 min-w-[220px] text-gray-900">
              <h4 className="font-bold text-sm leading-tight text-gray-955 text-gray-950">
                {selectedEstablishment.nombre_establecimiento}
              </h4>
              <p className="text-[10px] text-gray-500 font-semibold uppercase">
                RENIPRESS: {selectedEstablishment.codigo_renipress_id}
              </p>

              <div className="border-t border-gray-100 pt-2 space-y-1.5">
                <span className="text-[11px] font-bold text-gray-705 text-gray-700 block">
                  Profesiones Disponibles
                </span>
                {selectedEstablishment.plazas && selectedEstablishment.plazas.length > 0 ? (
                  selectedEstablishment.plazas.map((p) => {
                    const isCompared = comparedPlazaIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-3 text-xs bg-gray-50 p-1.5 rounded-lg border border-gray-100"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{p.profesion}</span>
                          <span className="text-[9px] text-gray-400 capitalize">
                            {p.tipo_plaza}
                          </span>
                        </div>
                        <button
                          onClick={() => {
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
                            'p-1.5 rounded border transition-all cursor-pointer active:scale-95',
                            isCompared
                              ? 'bg-[#aa3bff] text-white border-[#aa3bff]'
                              : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50',
                          )}
                          title={isCompared ? 'Quitar de la comparación' : 'Comparar'}
                        >
                          <GitCompare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-[11px] text-gray-500 italic">No hay plazas registradas.</p>
                )}
              </div>
            </div>
          </Popup>
        )}
      </Map>

      {isFetching && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md text-sm font-medium text-gray-700 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          Updating map...
        </div>
      )}
    </div>
  );
}
