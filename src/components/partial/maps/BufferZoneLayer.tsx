'use client';

import { useCallback, useEffect, useRef } from 'react';

import { useMap } from '@/components/ui/map';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface BufferZoneConfig {
  /** Unique identifier for this buffer zone */
  id: string;
  /** Center longitude */
  longitude: number;
  /** Center latitude */
  latitude: number;
  /** Radius in kilometers */
  radiusKm: number;
  /** Fill color (hex or rgba) */
  fillColor?: string;
  /** Fill opacity (0-1) */
  fillOpacity?: number;
  /** Border/stroke color */
  strokeColor?: string;
  /** Border width in pixels */
  strokeWidth?: number;
  /** Border opacity (0-1) */
  strokeOpacity?: number;
  /** Label text */
  label?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Generate a GeoJSON circle polygon from center + radius.
 * Uses the Haversine-based point-at-distance formula for accuracy.
 */
function createCirclePolygon(
  centerLng: number,
  centerLat: number,
  radiusKm: number,
  segments: number = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
  const coords: [number, number][] = [];
  const earthRadiusKm = 6371;

  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * 2 * Math.PI;

    const latRad = (centerLat * Math.PI) / 180;
    const lngRad = (centerLng * Math.PI) / 180;
    const d = radiusKm / earthRadiusKm;

    const newLatRad = Math.asin(
      Math.sin(latRad) * Math.cos(d) + Math.cos(latRad) * Math.sin(d) * Math.cos(angle)
    );

    const newLngRad =
      lngRad +
      Math.atan2(
        Math.sin(angle) * Math.sin(d) * Math.cos(latRad),
        Math.cos(d) - Math.sin(latRad) * Math.sin(newLatRad)
      );

    coords.push([(newLngRad * 180) / Math.PI, (newLatRad * 180) / Math.PI]);
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coords],
    },
  };
}

/**
 * Get buffer zone color based on environmental score.
 * Green (good) → Yellow (moderate) → Red (poor)
 */
export function getBufferZoneColor(score: number): string {
  if (score >= 70) return '#22c55e'; // green-500
  if (score >= 50) return '#eab308'; // yellow-500
  if (score >= 30) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

/**
 * Get the opacity for the buffer zone based on the score.
 */
export function getBufferZoneOpacity(score: number): number {
  if (score >= 70) return 0.12;
  if (score >= 50) return 0.18;
  return 0.25;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface BufferZoneLayerProps {
  /** Array of buffer zone configs to render */
  zones: BufferZoneConfig[];
  /** Callback when any zone is clicked */
  onZoneClick?: (zone: BufferZoneConfig, lngLat: { lng: number; lat: number }) => void;
}

/**
 * BufferZoneLayer renders circular polygon "buffer zones" on the map.
 * Each zone is a filled circle with a border, representing an area of interest
 * (e.g., the user's environmental monitoring radius).
 *
 * Uses MapLibre GL's native source/layer system via useMap() hook.
 */
export function BufferZoneLayer({ zones, onZoneClick }: BufferZoneLayerProps) {
  const { map, isLoaded } = useMap();

  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clean up old layers first

    // Add each zone
    zones.forEach((zone) => {
      if (
        !Number.isFinite(zone.longitude) ||
        !Number.isFinite(zone.latitude) ||
        zone.radiusKm <= 0
      ) {
        return;
      }

      const sourceId = `buffer-source-${zone.id}`;
      const fillLayerId = `buffer-fill-${zone.id}`;
      const strokeLayerId = `buffer-stroke-${zone.id}`;

      const circleGeoJson = createCirclePolygon(zone.longitude, zone.latitude, zone.radiusKm);

      try {
        // Add GeoJSON source
        map.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [circleGeoJson],
          },
        });

        // Add fill layer (transparent colored area)
        map.addLayer({
          id: fillLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': zone.fillColor ?? '#3b82f6',
            'fill-opacity': zone.fillOpacity ?? 0.15,
          },
        });

        // Add stroke layer (border ring)
        map.addLayer({
          id: strokeLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': zone.strokeColor ?? zone.fillColor ?? '#3b82f6',
            'line-width': zone.strokeWidth ?? 2,
            'line-opacity': zone.strokeOpacity ?? 0.6,
            'line-dasharray': [4, 2],
          },
        });

        // Add interactivity
        map.on('click', fillLayerId, (e) => {
          onZoneClick?.(zone, e.lngLat);
        });

        map.on('mouseenter', fillLayerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', fillLayerId, () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (err) {
        console.error(`[BufferZoneLayer] Failed to add zone ${zone.id}:`, err);
      }
    });
  }, [map, isLoaded, zones, onZoneClick]);

  return null;
}

// ─── Preset: Environmental Score Buffer Zone ─────────────────────────────────

interface EnvironmentalBufferZoneProps {
  /** Center longitude */
  longitude: number;
  /** Center latitude */
  latitude: number;
  /** Environmental score (0-100) drives color */
  score: number;
  /** Radius in km (default: 5) */
  radiusKm?: number;
  /** Callback when zone is clicked */
  onZoneClick?: (zone: BufferZoneConfig, lngLat: { lng: number; lat: number }) => void;
}

/**
 * Pre-configured buffer zone that auto-colors based on environmental score.
 * Perfect for the main user location monitoring radius.
 */
export function EnvironmentalBufferZone({
  longitude,
  latitude,
  score,
  radiusKm = 5,
  onZoneClick,
}: EnvironmentalBufferZoneProps) {
  const color = getBufferZoneColor(score);
  const opacity = getBufferZoneOpacity(score);

  const zones: BufferZoneConfig[] = [
    {
      id: 'env-score-zone',
      longitude,
      latitude,
      radiusKm,
      fillColor: color,
      fillOpacity: opacity,
      strokeColor: color,
      strokeWidth: 2.5,
      strokeOpacity: 0.7,
      label: 'Environmental Monitoring Radius',
    },
  ];

  return <BufferZoneLayer zones={zones} onZoneClick={onZoneClick} />;
}

// ─── Preset: Green Space Buffer Zones ────────────────────────────────────────

interface GreenSpaceBufferZonesProps {
  greenSpaces: Array<{
    id: string;
    name: string;
    latitude?: number;
    longitude?: number;
  }>;
  /** Radius in km for each green space zone (default: 0.5) */
  radiusKm?: number;
  /** Callback when any zone is clicked */
  onZoneClick?: (zone: BufferZoneConfig, lngLat: { lng: number; lat: number }) => void;
}

/**
 * Renders small buffer zones around each green space.
 */
export function GreenSpaceBufferZones({
  greenSpaces,
  radiusKm = 0.5,
  onZoneClick,
}: GreenSpaceBufferZonesProps) {
  const zones: BufferZoneConfig[] = greenSpaces
    .filter(
      (gs) =>
        typeof gs.latitude === 'number' &&
        Number.isFinite(gs.latitude) &&
        typeof gs.longitude === 'number' &&
        Number.isFinite(gs.longitude)
    )
    .map((gs) => ({
      id: `green-${gs.id}`,
      longitude: gs.longitude!,
      latitude: gs.latitude!,
      radiusKm,
      fillColor: '#22c55e',
      fillOpacity: 0.1,
      strokeColor: '#16a34a',
      strokeWidth: 1.5,
      strokeOpacity: 0.5,
      label: `Green Space: ${gs.name}`,
    }));

  return <BufferZoneLayer zones={zones} onZoneClick={onZoneClick} />;
}
