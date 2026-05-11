import { Source, Layer } from 'react-map-gl/maplibre';
import type { PlazaMapItem } from '../types';
import { useMemo } from 'react';
import type { FeatureCollection, Point } from 'geojson';

interface MarkerLayerProps {
  data: PlazaMapItem[];
}

export function MarkerLayer({ data }: MarkerLayerProps) {
  const geojsonData = useMemo<FeatureCollection<Point, PlazaMapItem>>(() => {
    return {
      type: 'FeatureCollection',
      features: data.map((item) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [item.lng, item.lat],
        },
        properties: item,
      })),
    };
  }, [data]);

  return (
    <Source
      id="plazas-source"
      type="geojson"
      data={geojsonData}
      cluster={true}
      clusterMaxZoom={14}
      clusterRadius={50}
    >
      {/* Cluster Circles */}
      <Layer
        id="clusters"
        type="circle"
        source="plazas-source"
        filter={['has', 'point_count']}
        paint={{
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#aa3bff', // Primary color (purple-ish as defined in index.css)
            100,
            '#8b2fcc',
            500,
            '#6a1c9e',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 500, 40],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        }}
      />

      {/* Cluster Text */}
      <Layer
        id="cluster-count"
        type="symbol"
        source="plazas-source"
        filter={['has', 'point_count']}
        layout={{
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 14,
        }}
        paint={{
          'text-color': '#ffffff',
        }}
      />

      {/* Unclustered Points */}
      <Layer
        id="unclustered-point"
        type="circle"
        source="plazas-source"
        filter={['!', ['has', 'point_count']]}
        paint={{
          'circle-color': [
            'match',
            ['get', 'tipo_plaza'],
            'remunerado',
            '#10b981', // green-500
            '#9ca3af', // gray-400
          ],
          'circle-radius': 8,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fff',
        }}
      />
    </Source>
  );
}
