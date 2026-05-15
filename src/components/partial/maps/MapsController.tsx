import {
  MapControls,
  Map,
  MapMarker,
  MapRef,
  MarkerContent,
  MarkerPopup,
  MapPopup,
} from '@/components/ui/map';
import { themeConfig } from '@/configs/theme.config';
import { GreenSpace } from '@/types/partial/maps';
import { Badge, TreePine, Info, Wind, Flame, Droplets, Volume2, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import {
  EnvironmentalBufferZone,
  GreenSpaceBufferZones,
} from '@/components/partial/maps/BufferZoneLayer';

/* ─── Legend environment definitions ─── */
interface EnvironmentLegendItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  radiusKm: number;
  description: string;
  shape?: 'dot' | 'ring';
  visible: boolean;
}



export const MapContainer: React.FC<{
  theme: typeof themeConfig.light;
  greenSpaces: GreenSpace[];
  environmentalScore?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  metrics?: any[];
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onGreenSpaceClick?: (spaceId: string) => void;
}> = ({
  theme,
  greenSpaces,
  environmentalScore = 0,
  location,
  latitude,
  longitude,
  metrics = [],
  onGreenSpaceClick,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<{
    longitude: number;
    latitude: number;
    label: string;
    description: string;
  } | null>(null);
  const [hiddenLegendIds, setHiddenLegendIds] = useState<Set<string>>(new Set());
  const [legendExpanded, setLegendExpanded] = useState(true);
  const [activeLegendPopup, setActiveLegendPopup] = useState<string | null>(null);

  // Build legend items dynamically from API metrics
  const legendItems: EnvironmentLegendItem[] = metrics.map((m) => ({
    id: m.id,
    label: m.label,
    icon: m.icon,
    color: m.color || theme.primary.background,
    radiusKm: m.radiusKm || 5,
    description: m.description || `Monitoring radius for ${m.label}.`,
    shape: m.shape as 'dot' | 'ring' || 'ring',
    visible: !hiddenLegendIds.has(m.id),
  }));

  if (greenSpaces.length > 0) {
    legendItems.push({
      id: 'green-space',
      label: 'Green Space',
      icon: <TreePine size={12} />,
      color: '#22c55e',
      radiusKm: 0.3,
      description: 'Green space influence zone. Parks and nature areas contributing to better air quality and lower noise.',
      shape: 'dot',
      visible: !hiddenLegendIds.has('green-space'),
    });
  }

  const hasUserCoordinates =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude);

  const mapLng = hasUserCoordinates ? longitude : 0;
  const mapLat = hasUserCoordinates ? latitude : 0;

  const toggleLegendVisibility = useCallback((itemId: string) => {
    setHiddenLegendIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const toggleLegendPopup = useCallback((itemId: string) => {
    setActiveLegendPopup((prev) => (prev === itemId ? null : itemId));
  }, []);

  return (
    <div className="flex-1 h-full relative flex flex-col">
      <Map
        ref={mapRef}
        center={[mapLng, mapLat]}
        zoom={13}
        bearing={0}
        pitch={0}
        className="w-full h-full"
      >
        {/* ══ BUFFER ZONES (Polygons) ══ */}
        {/* Environmental monitoring radius — colored by score */}
        {hasUserCoordinates && (
          <EnvironmentalBufferZone
            longitude={mapLng}
            latitude={mapLat}
            score={environmentalScore}
            radiusKm={5}
            onZoneClick={(zone, lngLat) => {
              setSelectedZone({
                longitude: lngLat.lng,
                latitude: lngLat.lat,
                label: 'Monitoring Radius',
                description: `This area has an environmental score of ${environmentalScore}/100. It covers a 5km radius from your current location.`,
              });
            }}
          />
        )}

        {/* Green space influence zones */}
        <GreenSpaceBufferZones
          greenSpaces={greenSpaces}
          radiusKm={0.3}
          onZoneClick={(zone, lngLat) => {
            setSelectedZone({
              longitude: lngLat.lng,
              latitude: lngLat.lat,
              label: zone.label || 'Green Space Zone',
              description: 'This area is protected/influenced by local green space presence, contributing to better air quality and lower noise.',
            });
          }}
        />

        {/* ══ POPUPS ══ */}
        {selectedZone && (
          <MapPopup
            longitude={selectedZone.longitude}
            latitude={selectedZone.latitude}
            closeButton
            onClose={() => setSelectedZone(null)}
          >
            <div className="max-w-[200px] space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="p-1 rounded-md"
                  style={{ backgroundColor: `${theme.primary.background}15` }}
                >
                  <Info size={14} style={{ color: theme.primary.background }} />
                </div>
                <h4 className="text-[12px] font-bold" style={{ color: theme.foreground }}>
                  {selectedZone.label}
                </h4>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: theme.muted.foreground }}>
                {selectedZone.description}
              </p>
            </div>
          </MapPopup>
        )}

        {/* ══ MARKERS ══ */}
        {/* Current user location marker */}
        {hasUserCoordinates && (
          <MapMarker longitude={mapLng} latitude={mapLat}>
            <MarkerContent>
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: `${theme.primary.background}30`,
                    left: '-20px',
                    top: '-20px',
                  }}
                />
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                  style={{
                    backgroundColor: theme.primary.background,
                    boxShadow: `0 2px 8px ${theme.primary.background}60`,
                  }}
                >
                  •
                </div>
              </div>
            </MarkerContent>
            <MarkerPopup closeButton>
              <div className="text-sm">
                <p className="font-bold">{location || 'Location not set'}</p>
                <p className="text-xs text-muted-foreground">Score: {environmentalScore}/100</p>
              </div>
            </MarkerPopup>
          </MapMarker>
        )}

        {/* Green space markers */}
        {greenSpaces.map((space) => {
          if (
            typeof space.longitude !== 'number' ||
            !Number.isFinite(space.longitude) ||
            typeof space.latitude !== 'number' ||
            !Number.isFinite(space.latitude)
          ) {
            return null;
          }

          return (
            <MapMarker
              key={space.id}
              longitude={space.longitude}
              latitude={space.latitude}
              onClick={() => {
                setSelectedMarker(space.id);
                onGreenSpaceClick?.(space.id);
              }}
            >
              <MarkerContent
                className={`transition-transform ${
                  selectedMarker === space.id ? 'scale-110' : 'scale-100'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
                  style={{
                    backgroundColor: theme.success.background,
                    boxShadow: `0 2px 8px ${theme.success.background}60`,
                  }}
                >
                  <TreePine size={14} />
                </div>
              </MarkerContent>
              <MarkerPopup closeButton>
                <div className="text-sm">
                  <p className="font-bold">{space.name}</p>
                  <p className="text-xs text-muted-foreground">{space.distance} km away</p>
                  <p className="text-xs font-medium mt-1">{space.status}</p>
                  {space.tags.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {space.tags.map((tag, idx) => (
                        <Badge key={idx} className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </MarkerPopup>
            </MapMarker>
          );
        })}

        {/* Map Controls */}
        <MapControls
          position="top-right"
          showZoom={true}
          showCompass={true}
          showLocate={true}
          showFullscreen={false}
          onLocate={(coords) => {
            console.log('User location:', coords);
          }}
        />
      </Map>

      {/* ══ ENVIRONMENT LEGEND ══ */}
      <div className="absolute top-6 left-6 z-10 pointer-events-auto">
        <div
          className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300"
          style={{
            border: `1px solid ${theme.border}`,
            width: legendExpanded ? 280 : 180,
          }}
        >
          {/* Legend Header */}
          <button
            onClick={() => setLegendExpanded((prev) => !prev)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${theme.primary.background}15` }}
              >
                <Info size={12} style={{ color: theme.primary.background }} />
              </div>
              <p className="text-[11px] font-bold tracking-wider uppercase" style={{ color: theme.primary.background }}>
                Environment Legend
              </p>
            </div>
            {legendExpanded ? (
              <ChevronUp size={14} style={{ color: theme.muted.foreground }} />
            ) : (
              <ChevronDown size={14} style={{ color: theme.muted.foreground }} />
            )}
          </button>

          {/* Legend Items */}
          {legendExpanded && (
            <div className="px-3 pb-3 space-y-1">
              {/* Your Location indicator */}
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: theme.primary.background }}
                />
                <p className="text-[10px] font-medium flex-1" style={{ color: theme.foreground }}>
                  Your Location
                </p>
              </div>

              {/* Divider */}
              <div className="h-px mx-2" style={{ backgroundColor: theme.border }} />

              {/* Environment layers */}
              {legendItems.map((item) => (
                <div key={item.id} className="relative">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group">
                    {/* Color indicator */}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: item.shape === 'ring' ? `${item.color}20` : item.color,
                        border: item.shape === 'ring' ? `1.5px dashed ${item.color}` : 'none',
                      }}
                    />

                    {/* Icon + Label */}
                    <button
                      onClick={() => toggleLegendPopup(item.id)}
                      className="flex items-center gap-1.5 flex-1 text-left"
                    >
                      <span style={{ color: item.color }}>{item.icon}</span>
                      <span className="text-[10px] font-medium" style={{ color: theme.foreground }}>
                        {item.label}
                      </span>
                    </button>

                    {/* Radius badge */}
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      {item.radiusKm >= 1 ? `${item.radiusKm}km` : `${item.radiusKm * 1000}m`}
                    </span>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => toggleLegendVisibility(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    >
                      {item.visible ? (
                        <Eye size={10} style={{ color: theme.muted.foreground }} />
                      ) : (
                        <EyeOff size={10} style={{ color: theme.muted.foreground }} />
                      )}
                    </button>
                  </div>

                  {/* Popup information for this environment */}
                  {activeLegendPopup === item.id && (
                    <div
                      className="mx-2 mt-1 mb-2 p-3 rounded-lg border animate-in fade-in slide-in-from-top-1 duration-200"
                      style={{
                        backgroundColor: `${item.color}08`,
                        borderColor: `${item.color}20`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: item.color }}>{item.icon}</span>
                        <h5 className="text-[10px] font-bold" style={{ color: item.color }}>
                          {item.label}
                        </h5>
                      </div>
                      <p className="text-[9px] leading-relaxed mb-2" style={{ color: theme.muted.foreground }}>
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: item.shape === 'ring' ? `${item.color}30` : item.color,
                              border: item.shape === 'ring' ? `1px dashed ${item.color}` : 'none',
                            }}
                          />
                          <span className="text-[8px] font-medium" style={{ color: theme.muted.foreground }}>
                            Radius: {item.radiusKm >= 1 ? `${item.radiusKm} km` : `${item.radiusKm * 1000} m`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.visible ? '#22c55e' : '#ef4444' }}
                          />
                          <span className="text-[8px] font-medium" style={{ color: theme.muted.foreground }}>
                            {item.visible ? 'Active' : 'Hidden'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
