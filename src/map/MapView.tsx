import { useRef, useCallback } from 'react';
import Map, { NavigationControl } from 'react-map-gl/maplibre';
import type { MapRef } from 'react-map-gl/maplibre';
import { usePlazasMap } from '../hooks/queries';
import { useAppStore } from '../store/useAppStore';
import { MarkerLayer } from './MarkerLayer';
import type { MapMouseEvent } from 'maplibre-gl';

const INITIAL_VIEW_STATE = {
  longitude: -75.0,
  latitude: -9.1,
  zoom: 5,
  bearing: 0,
  pitch: 0,
};

export function MapView() {
  const mapRef = useRef<MapRef>(null);

  const bbox = useAppStore((state) => state.bbox);
  const setBBox = useAppStore((state) => state.setBBox);
  const filters = useAppStore((state) => state.filters);
  const setSelectedPlazaId = useAppStore((state) => state.setSelectedPlazaId);

  const { data: plazas = [], isFetching } = usePlazasMap(bbox, filters);

  const onMoveEnd = useCallback(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getMap().getBounds();
    setBBox({
      west: bounds.getWest(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      north: bounds.getNorth(),
    });
  }, [setBBox]);

  const onClick = useCallback(
    async (event: MapMouseEvent) => {
      if (!mapRef.current) return;
      const map = mapRef.current.getMap();
      const features = map.queryRenderedFeatures(event.point, {
        layers: ['unclustered-point', 'clusters'],
      });

      if (!features.length) {
        setSelectedPlazaId(undefined);
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
            // Ignore zoom error
          }
        }
      } else if (feature.layer.id === 'unclustered-point') {
        const plazaId = feature.properties?.id;
        if (plazaId) {
          setSelectedPlazaId(plazaId);
        }
      }
    },
    [setSelectedPlazaId],
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
