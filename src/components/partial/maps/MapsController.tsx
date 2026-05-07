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
import { Badge, TreePine, Info } from 'lucide-react';
import { useRef, useState } from 'react';
import {
  EnvironmentalBufferZone,
  GreenSpaceBufferZones,
} from '@/components/partial/maps/BufferZoneLayer';

export const MapContainer: React.FC<{
  theme: typeof themeConfig.light;
  greenSpaces: GreenSpace[];
  environmentalScore?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
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

  const hasUserCoordinates =
    typeof latitude === 'number' &&
    Number.isFinite(latitude) &&
    typeof longitude === 'number' &&
    Number.isFinite(longitude);

  const mapLng = hasUserCoordinates ? longitude : 0;
  const mapLat = hasUserCoordinates ? latitude : 0;

  return (
    <div className="flex-1 relative flex flex-col">
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

      {/* Layer Legend */}
      <div className="absolute top-6 left-6 z-10 pointer-events-auto">
        <div
          className="bg-white rounded-lg p-4 shadow-lg space-y-2"
          style={{ border: `1px solid ${theme.border}` }}
        >
          <p className="text-[11px] font-bold" style={{ color: theme.primary.background }}>
            LAYER LEGEND
          </p>
          <div className="space-y-2">
            {[
              { color: theme.primary.background, label: 'Your location' },
              { color: '#3b82f660', label: 'Monitoring radius', shape: 'ring' as const },
              { color: theme.success.background, label: 'Green space' },
              { color: '#22c55e40', label: 'Green space zone', shape: 'ring' as const },
              { color: theme.warning.background, label: 'Heat risk zone' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      (item as any).shape === 'ring' ? `${item.color}30` : item.color,
                    border:
                      (item as any).shape === 'ring' ? `1.5px dashed ${item.color}` : 'none',
                  }}
                />
                <p className="text-[10px]" style={{ color: theme.foreground }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
