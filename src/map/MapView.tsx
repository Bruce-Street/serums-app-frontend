import { useRef, useCallback, useEffect } from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { usePlazasMap } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { MarkerLayer } from './MarkerLayer';
import type { MapMouseEvent } from 'maplibre-gl';
import type { PlazaMapItem } from '@/types';

const INITIAL_VIEW_STATE = {
  longitude: -75.0,
  latitude: -9.1,
  zoom: 5,
  bearing: 0,
  pitch: 0,
};

export function MapView() {
  const mapRef = useRef<MapRef>(null);
  const debounceRef = useRef<number | undefined>(undefined);

  const bbox = useAppStore((state) => state.bbox);
  const setBBox = useAppStore((state) => state.setBBox);
  const filters = useAppStore((state) => state.filters);
  const setSelectedEstablishment = useAppStore((state) => state.setSelectedEstablishment);
  const flyToLocation = useAppStore((state) => state.flyToLocation);
  const setFlyToLocation = useAppStore((state) => state.setFlyToLocation);

  const { data: plazas = [], isFetching } = usePlazasMap(bbox, filters);

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

  const onMoveEnd = useCallback(() => {
    if (!mapRef.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (!mapRef.current) return;
      const bounds = mapRef.current.getMap().getBounds();
      setBBox({
        west: bounds.getWest(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        north: bounds.getNorth(),
      });
    }, 300);
  }, [setBBox]);

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
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        onMoveEnd={onMoveEnd}
        onClick={onClick}
        interactiveLayerIds={['unclustered-point', 'clusters']}
        cursor="pointer"
      >
        <NavigationControl position="bottom-right" />
        <MarkerLayer data={plazas} />
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
