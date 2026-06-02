# mapcn

mapcn is a free and open-source React component library for building interactive maps. It provides ready-to-use, customizable map components built on MapLibre GL, styled with Tailwind CSS, and designed to work seamlessly with shadcn/ui. The library offers zero-config setup with sensible defaults while allowing full customization when needed.

The library features theme-aware styling that automatically adapts to light/dark mode, a composable architecture for building complex map UIs with declarative components, and includes essential mapping features like markers, popups, routes, clusters, and arcs. It uses CARTO Basemaps by default but supports any MapLibre-compatible tile provider.

## Map Component

The core `Map` component renders an interactive MapLibre map with automatic theme detection, controlled/uncontrolled viewport support, and custom styling capabilities.

```tsx
import { useState } from 'react';
import { Map, type MapViewport, type MapRef } from '@/registry/map';
import { useRef } from 'react';

// Basic uncontrolled map
function BasicMap() {
  return (
    <div className="h-[400px] w-full">
      <Map center={[-74.006, 40.7128]} zoom={12} />
    </div>
  );
}

// Controlled map with viewport state
function ControlledMap() {
  const [viewport, setViewport] = useState<MapViewport>({
    center: [-74.006, 40.7128],
    zoom: 12,
    bearing: 0,
    pitch: 0,
  });

  return (
    <div className="h-[400px] w-full">
      <Map viewport={viewport} onViewportChange={setViewport} />
      <div>
        Lng: {viewport.center[0].toFixed(3)}, Lat: {viewport.center[1].toFixed(3)}, Zoom:{' '}
        {viewport.zoom.toFixed(1)}
      </div>
    </div>
  );
}

// Map with custom styles and ref access
function CustomStyledMap() {
  const mapRef = useRef<MapRef>(null);

  const flyToLocation = () => {
    mapRef.current?.flyTo({
      center: [-0.1276, 51.5074],
      zoom: 14,
      duration: 2000,
    });
  };

  return (
    <div className="h-[400px] w-full">
      <Map
        ref={mapRef}
        center={[-74.006, 40.7128]}
        zoom={10}
        styles={{
          light: 'https://tiles.openfreemap.org/styles/bright',
          dark: 'https://tiles.openfreemap.org/styles/liberty',
        }}
        projection={{ type: 'globe' }}
        theme="dark"
      />
      <button onClick={flyToLocation}>Fly to London</button>
    </div>
  );
}
```

## MapMarker and MarkerContent

The `MapMarker` component places interactive markers on the map with support for custom content, drag events, and click handlers. `MarkerContent` renders the visual appearance of the marker.

```tsx
import { useState } from 'react';
import { Map, MapMarker, MarkerContent } from '@/registry/map';
import { MapPin } from 'lucide-react';

function MarkersDemo() {
  const [markerPosition, setMarkerPosition] = useState({
    lng: -73.98,
    lat: 40.75,
  });

  const locations = [
    { id: 1, name: 'Empire State Building', lng: -73.9857, lat: 40.7484 },
    { id: 2, name: 'Central Park', lng: -73.9654, lat: 40.7829 },
    { id: 3, name: 'Times Square', lng: -73.9855, lat: 40.758 },
  ];

  return (
    <div className="h-[400px] w-full">
      <Map center={[-73.98, 40.76]} zoom={12}>
        {/* Static markers with custom content */}
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            longitude={location.lng}
            latitude={location.lat}
            onClick={() => console.log(`Clicked: ${location.name}`)}
            onMouseEnter={() => console.log(`Hover: ${location.name}`)}
          >
            <MarkerContent>
              <div className="size-4 rounded-full border-2 border-white bg-blue-500 shadow-lg" />
            </MarkerContent>
          </MapMarker>
        ))}

        {/* Draggable marker */}
        <MapMarker
          draggable
          longitude={markerPosition.lng}
          latitude={markerPosition.lat}
          onDragStart={(lngLat) => console.log('Drag started', lngLat)}
          onDrag={(lngLat) => setMarkerPosition({ lng: lngLat.lng, lat: lngLat.lat })}
          onDragEnd={(lngLat) => console.log('Drag ended', lngLat)}
          offset={[0, -14]}
          rotation={45}
        >
          <MarkerContent className="cursor-move">
            <MapPin className="fill-red-500 stroke-white" size={28} />
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}
```

## MarkerPopup and MarkerTooltip

`MarkerPopup` creates click-triggered popups attached to markers, while `MarkerTooltip` shows hover-triggered tooltips. Both support custom styling and positioning.

```tsx
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
  MarkerLabel,
} from '@/registry/map';

function PopupsAndTooltipsDemo() {
  const places = [
    {
      id: 1,
      name: 'The Met',
      category: 'Museum',
      rating: 4.8,
      hours: '10:00 AM - 5:00 PM',
      lng: -73.9632,
      lat: 40.7794,
    },
    {
      id: 2,
      name: 'Brooklyn Bridge',
      category: 'Landmark',
      rating: 4.9,
      hours: 'Open 24 hours',
      lng: -73.9969,
      lat: 40.7061,
    },
  ];

  return (
    <div className="h-[500px] w-full">
      <Map center={[-73.98, 40.74]} zoom={11}>
        {places.map((place) => (
          <MapMarker key={place.id} longitude={place.lng} latitude={place.lat}>
            <MarkerContent>
              <div className="size-5 rounded-full border-2 border-white bg-rose-500 shadow-lg hover:scale-110 transition-transform" />
              {/* Label below marker */}
              <MarkerLabel position="bottom">{place.category}</MarkerLabel>
            </MarkerContent>

            {/* Hover tooltip */}
            <MarkerTooltip offset={20} anchor="top">
              {place.name}
            </MarkerTooltip>

            {/* Click popup with custom styling */}
            <MarkerPopup className="w-64 p-0" closeButton offset={16}>
              <div className="p-4 space-y-2">
                <p className="text-xs text-muted-foreground uppercase">{place.category}</p>
                <h3 className="font-semibold">{place.name}</h3>
                <div className="flex items-center gap-2 text-sm">
                  <span>Rating: {place.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">{place.hours}</p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
```

## MapPopup (Standalone)

`MapPopup` renders a popup at any coordinates, independent of markers. Useful for showing information on map click or programmatically.

```tsx
import { useState } from 'react';
import { Map, MapPopup } from '@/registry/map';

function StandalonePopupDemo() {
  const [popup, setPopup] = useState<{
    lng: number;
    lat: number;
    content: string;
  } | null>({
    lng: -74.006,
    lat: 40.7128,
    content: 'New York City - Population: 8.3 million',
  });

  return (
    <div className="h-[400px] w-full">
      <Map center={[-74.006, 40.7128]} zoom={13}>
        {popup && (
          <MapPopup
            longitude={popup.lng}
            latitude={popup.lat}
            onClose={() => setPopup(null)}
            closeButton
            closeOnClick={false}
            focusAfterOpen={false}
            anchor="bottom"
            offset={16}
          >
            <div className="space-y-2">
              <h3 className="font-semibold">Location Info</h3>
              <p className="text-sm text-muted-foreground">{popup.content}</p>
              <button
                className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm"
                onClick={() => setPopup(null)}
              >
                Close
              </button>
            </div>
          </MapPopup>
        )}
      </Map>

      {!popup && (
        <button
          className="absolute bottom-4 left-4 z-10 px-4 py-2 bg-primary text-white rounded"
          onClick={() =>
            setPopup({
              lng: -74.006,
              lat: 40.7128,
              content: 'New York City - Population: 8.3 million',
            })
          }
        >
          Show Popup
        </button>
      )}
    </div>
  );
}
```

## MapRoute

The `MapRoute` component draws lines and paths on the map, perfect for displaying routes, boundaries, or connections between points.

```tsx
import { Map, MapRoute, MapMarker, MarkerContent, MarkerTooltip } from '@/registry/map';

function RouteDemo() {
  const route: [number, number][] = [
    [-74.006, 40.7128], // NYC City Hall
    [-73.9857, 40.7484], // Empire State Building
    [-73.9772, 40.7527], // Grand Central
    [-73.9654, 40.7829], // Central Park
  ];

  const stops = [
    { name: 'City Hall', lng: -74.006, lat: 40.7128 },
    { name: 'Empire State Building', lng: -73.9857, lat: 40.7484 },
    { name: 'Grand Central Terminal', lng: -73.9772, lat: 40.7527 },
    { name: 'Central Park', lng: -73.9654, lat: 40.7829 },
  ];

  return (
    <div className="h-[400px] w-full">
      <Map center={[-73.98, 40.75]} zoom={11.2}>
        {/* Main route */}
        <MapRoute
          coordinates={route}
          color="#3b82f6"
          width={4}
          opacity={0.8}
          onClick={() => console.log('Route clicked')}
          onMouseEnter={() => console.log('Route hover')}
          onMouseLeave={() => console.log('Route leave')}
        />

        {/* Dashed alternate route */}
        <MapRoute
          id="alternate-route"
          coordinates={[
            [-74.006, 40.7128],
            [-73.95, 40.77],
            [-73.9654, 40.7829],
          ]}
          color="#ef4444"
          width={3}
          opacity={0.6}
          dashArray={[4, 4]}
          interactive={false}
        />

        {/* Stop markers */}
        {stops.map((stop, index) => (
          <MapMarker key={stop.name} longitude={stop.lng} latitude={stop.lat}>
            <MarkerContent>
              <div className="flex size-5 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white shadow-lg">
                {index + 1}
              </div>
            </MarkerContent>
            <MarkerTooltip>{stop.name}</MarkerTooltip>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}
```

## MapArc

`MapArc` renders curved lines (arcs) between points, ideal for visualizing flight paths, connections, or data flows. Supports hover effects and click events.

```tsx
import { useState } from 'react';
import {
  Map,
  MapArc,
  MapMarker,
  MarkerContent,
  MarkerLabel,
  MapPopup,
  type MapArcDatum,
  type MapArcEvent,
} from '@/registry/map';

interface FlightArc extends MapArcDatum {
  airline: string;
  duration: string;
}

function ArcDemo() {
  const [hoveredArc, setHoveredArc] = useState<MapArcEvent<FlightArc> | null>(null);

  const hub = { name: 'London', lng: -0.1276, lat: 51.5074 };

  const destinations = [
    { name: 'New York', lng: -74.006, lat: 40.7128 },
    { name: 'Tokyo', lng: 139.6917, lat: 35.6895 },
    { name: 'Sydney', lng: 151.2093, lat: -33.8688 },
    { name: 'Dubai', lng: 55.2708, lat: 25.2048 },
  ];

  const arcs: FlightArc[] = destinations.map((dest) => ({
    id: dest.name,
    from: [hub.lng, hub.lat],
    to: [dest.lng, dest.lat],
    airline: 'British Airways',
    duration: '8h 30m',
  }));

  return (
    <div className="h-[400px] w-full">
      <Map center={[hub.lng, hub.lat]} zoom={1} projection={{ type: 'globe' }}>
        <MapArc<FlightArc>
          data={arcs}
          curvature={0.3}
          samples={64}
          paint={{
            'line-color': '#3b82f6',
            'line-width': 2,
            'line-opacity': 0.85,
          }}
          hoverPaint={{
            'line-color': '#ef4444',
            'line-width': 4,
          }}
          onClick={(e) => console.log(`Clicked: ${e.arc.id}`, e.arc)}
          onHover={(e) => setHoveredArc(e)}
          interactive
        />

        {/* Hub marker */}
        <MapMarker longitude={hub.lng} latitude={hub.lat}>
          <MarkerContent>
            <div className="size-4 rounded-full border-2 border-white bg-blue-500 shadow-md" />
            <MarkerLabel
              position="top"
              className="bg-background/80 px-2 py-0.5 rounded font-semibold"
            >
              {hub.name}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {/* Destination markers */}
        {destinations.map((dest) => (
          <MapMarker key={dest.name} longitude={dest.lng} latitude={dest.lat}>
            <MarkerContent>
              <div className="size-3 rounded-full border-2 border-white bg-emerald-500 shadow" />
              <MarkerLabel position="top">{dest.name}</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        ))}

        {/* Hover popup */}
        {hoveredArc && (
          <MapPopup
            longitude={hoveredArc.longitude}
            latitude={hoveredArc.latitude}
            closeOnClick={false}
          >
            <div className="text-sm">
              <p className="font-semibold">Flight to {hoveredArc.arc.id}</p>
              <p className="text-muted-foreground">{hoveredArc.arc.airline}</p>
              <p className="text-muted-foreground">{hoveredArc.arc.duration}</p>
            </div>
          </MapPopup>
        )}
      </Map>
    </div>
  );
}
```

## MapClusterLayer

`MapClusterLayer` renders clustered point data that automatically groups nearby points and expands on click. Supports GeoJSON data or remote URLs.

```tsx
import { useState } from 'react';
import { Map, MapClusterLayer, MapPopup, MapControls } from '@/registry/map';

interface EarthquakeProperties {
  mag: number;
  place: string;
  tsunami: number;
}

function ClusterDemo() {
  const [selectedPoint, setSelectedPoint] = useState<{
    coordinates: [number, number];
    properties: EarthquakeProperties;
  } | null>(null);

  // Local GeoJSON data
  const localData: GeoJSON.FeatureCollection<GeoJSON.Point, { name: string; value: number }> = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: { name: 'Point 1', value: 100 },
        geometry: { type: 'Point', coordinates: [-74.006, 40.7128] },
      },
      {
        type: 'Feature',
        properties: { name: 'Point 2', value: 200 },
        geometry: { type: 'Point', coordinates: [-73.98, 40.75] },
      },
      // ... more features
    ],
  };

  return (
    <div className="h-[400px] w-full">
      <Map center={[-103.59, 40.66]} zoom={3.4} fadeDuration={0}>
        {/* Remote GeoJSON URL */}
        <MapClusterLayer<EarthquakeProperties>
          data="https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson"
          clusterRadius={50}
          clusterMaxZoom={14}
          clusterColors={['#22c55e', '#eab308', '#ef4444']}
          clusterThresholds={[100, 750]}
          pointColor="#3b82f6"
          onPointClick={(feature, coordinates) => {
            setSelectedPoint({
              coordinates,
              properties: feature.properties,
            });
          }}
          onClusterClick={(clusterId, coordinates, pointCount) => {
            console.log(`Cluster ${clusterId} clicked with ${pointCount} points`);
            // Default behavior: zooms to cluster expansion zoom
          }}
        />

        {selectedPoint && (
          <MapPopup
            longitude={selectedPoint.coordinates[0]}
            latitude={selectedPoint.coordinates[1]}
            onClose={() => setSelectedPoint(null)}
            closeButton
            closeOnClick={false}
          >
            <div className="text-sm space-y-1">
              <p>
                <strong>Magnitude:</strong> {selectedPoint.properties.mag}
              </p>
              <p>
                <strong>Location:</strong> {selectedPoint.properties.place}
              </p>
              <p>
                <strong>Tsunami:</strong> {selectedPoint.properties.tsunami === 1 ? 'Yes' : 'No'}
              </p>
            </div>
          </MapPopup>
        )}

        <MapControls />
      </Map>
    </div>
  );
}
```

## MapControls

`MapControls` adds interactive UI controls for zoom, compass, geolocation, and fullscreen toggle with customizable positioning.

```tsx
import { Map, MapControls } from '@/registry/map';

function ControlsDemo() {
  return (
    <div className="h-[400px] w-full">
      <Map center={[2.3522, 48.8566]} zoom={10}>
        <MapControls
          position="top-right" // "top-left" | "top-right" | "bottom-left" | "bottom-right"
          showZoom // Zoom in/out buttons (default: true)
          showCompass // Compass to reset bearing (default: false)
          showLocate // Geolocation button (default: false)
          showFullscreen // Fullscreen toggle (default: false)
          className="custom-controls"
          onLocate={(coords) => {
            console.log(`User located at: ${coords.longitude}, ${coords.latitude}`);
          }}
        />
      </Map>
    </div>
  );
}

// Multiple control groups at different positions
function MultipleControlsDemo() {
  return (
    <div className="h-[400px] w-full">
      <Map center={[0, 0]} zoom={2}>
        <MapControls position="top-right" showZoom />
        <MapControls position="top-left" showCompass showLocate />
        <MapControls position="bottom-right" showFullscreen />
      </Map>
    </div>
  );
}
```

## useMap Hook

The `useMap` hook provides access to the MapLibre map instance and load state from within child components of `Map`.

```tsx
import { useEffect } from 'react';
import { Map, useMap, MapMarker, MarkerContent } from '@/registry/map';

function CustomMapLayer() {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!isLoaded || !map) return;

    // Add custom GeoJSON source
    map.addSource('custom-source', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [-74.02, 40.7],
                  [-73.98, 40.7],
                  [-73.98, 40.74],
                  [-74.02, 40.74],
                  [-74.02, 40.7],
                ],
              ],
            },
          },
        ],
      },
    });

    // Add fill layer
    map.addLayer({
      id: 'custom-layer',
      type: 'fill',
      source: 'custom-source',
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.3,
      },
    });

    return () => {
      if (map.getLayer('custom-layer')) map.removeLayer('custom-layer');
      if (map.getSource('custom-source')) map.removeSource('custom-source');
    };
  }, [map, isLoaded]);

  return null;
}

function CustomLayerDemo() {
  return (
    <div className="h-[400px] w-full">
      <Map center={[-74.0, 40.72]} zoom={12}>
        <CustomMapLayer />
        <MapMarker longitude={-74.0} latitude={40.72}>
          <MarkerContent>
            <div className="size-4 rounded-full bg-red-500 border-2 border-white shadow-lg" />
          </MarkerContent>
        </MapMarker>
      </Map>
    </div>
  );
}
```

## Summary

mapcn provides a comprehensive solution for adding interactive maps to React applications with minimal configuration. The library covers common mapping use cases including displaying markers with popups and tooltips, drawing routes and paths, visualizing arc connections between locations, clustering large datasets, and providing standard map controls. All components follow shadcn/ui patterns for consistent styling and theming.

The library integrates seamlessly with existing React state management patterns through controlled viewport mode and event callbacks. For advanced use cases, the `useMap` hook exposes the underlying MapLibre GL instance for direct access to the full mapping API. Whether building a simple location picker or a complex logistics dashboard, mapcn provides the building blocks needed while maintaining a clean, composable component architecture.
