import {
  MapControls,
  Map,
  MapMarker,
  MapRef,
  MarkerContent,
  MarkerPopup,
} from '@/components/ui/map';
import { themeConfig } from '@/configs/theme.config';
import { GreenSpace } from '@/types/partial/maps';
import { Badge, TreePine } from 'lucide-react';
import { useRef, useState } from 'react';

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
            // Could dispatch action to update user location in Redux if needed
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
              { color: theme.success.background, label: 'Green space' },
              { color: theme.warning.background, label: 'Heat risk zone' },
              { color: theme.accent.background, label: 'Info point' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
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
