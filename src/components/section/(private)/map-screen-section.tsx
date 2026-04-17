import React, { useState, useRef } from 'react';
import {
  MapPin,
  Wind,
  Flame,
  Droplets,
  Volume2,
  TreePine,
  AlertCircle,
  Bell,
  Layers,
  Search,
  ZoomIn,
  ZoomOut,
  Crosshair,
  TrendingUp,
  Clock,
  CheckCircle,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { themeConfig } from '@/configs/theme.config';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
  type MapRef,
} from '@/components/ui/map';
import GreenSpaceDetailsModal from './green-space-details-modal';
import ScoreTrendingChart from './score-trending-chart';
import type { ScoreHistoryData } from './score-trending-chart';

// ══ TYPES ══
interface EnvironmentalMetric {
  label: string;
  value: number;
  unit: string;
  level: 'good' | 'moderate' | 'poor' | 'unhealthy';
  icon: React.ReactNode;
}

interface Alert {
  id: string;
  type: 'warning' | 'info';
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Recommendation {
  id: string;
  message: string;
  severity: number; // 0-2 (low, medium, high)
  recommendationType?: string;
  icon?: string;
}

interface GreenSpace {
  id: string;
  name: string;
  distance: number;
  status: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
}

interface ScoreHistory {
  date: string;
  score: number;
  change: number;
}

interface MapScreenSectionProps {
  state?: {
    location?: string;
    latitude?: number;
    longitude?: number;
    environmentalScore?: number;
    metrics?: EnvironmentalMetric[];
    alerts?: Alert[];
    recommendations?: Recommendation[];
    greenSpaces?: GreenSpace[];
    scoreHistory?: ScoreHistory[];
    searchQuery?: string;
    loading?: boolean;
    error?: string | null;
    isCurrentLocationDetected?: boolean;
    detectedLocation?: { lat: number; lon: number; city: string } | null;
  };
  service?: {
    onLocationSearch?: (query: string) => void;
    onAlertClick?: (alertId: string) => void;
    onGreenSpaceClick?: (spaceId: string) => void;
  };
}

// ══ UTILITY: Get metric color ══
const getMetricColor = (level: string, theme: typeof themeConfig.light): string => {
  switch (level) {
    case 'good':
      return theme.success.background;
    case 'moderate':
      return theme.warning.background;
    case 'poor':
      return theme.destructive.background;
    case 'unhealthy':
      return '#7C2D12';
    default:
      return theme.primary.background;
  }
};

// ══ SUB-COMPONENTS ══

// Left Panel: Environmental Summary
const EnvironmentalSummaryPanel: React.FC<{
  theme: typeof themeConfig.light;
  location?: string;
  score?: number;
  metrics: EnvironmentalMetric[];
  alerts?: Alert[];
  greenSpaces?: GreenSpace[];
  scoreHistory?: ScoreHistory[];
  isCurrentLocation?: boolean;
  detectedLocation?: { lat: number; lon: number; city: string } | null;
}> = ({
  theme,
  location = 'Banda Aceh',
  score = 72,
  metrics,
  alerts = [],
  greenSpaces = [],
  scoreHistory = [],
  isCurrentLocation = false,
  detectedLocation,
}) => (
  <div
    className="hidden lg:flex flex-col w-80 p-6 overflow-y-auto border-r gap-6"
    style={{ backgroundColor: 'white', borderRightColor: theme.border }}
  >
    {/* Location Header */}
    <div>
      <div className="flex items-start gap-2 mb-1">
        <MapPin size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-[14px] font-bold" style={{ color: theme.primary.background }}>
              {location}
            </h3>
            {isCurrentLocation && (
              <Badge
                className="text-[10px] px-2 py-0.5"
                style={{
                  backgroundColor: `${theme.success.background}30`,
                  color: theme.success.background,
                }}
              >
                • Current Location
              </Badge>
            )}
          </div>
          <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
            {location || 'Location not set'} • Updated just now
          </p>
        </div>
      </div>
    </div>

    {/* Score Ring */}
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-24 h-24">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke={theme.border} strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={theme.primary.background}
            strokeWidth="8"
            strokeDasharray={`${score * 2.83} 283`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 0.3s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: theme.primary.background }}>
            {score}
          </span>
          <span className="text-[9px]" style={{ color: theme.muted.foreground }}>
            /100
          </span>
        </div>
      </div>
      <div className="text-center">
        <p
          className="text-[12px] font-semibold mb-1"
          style={{
            color:
              score > 70
                ? theme.success.background
                : score > 50
                  ? theme.warning.background
                  : theme.destructive.background,
          }}
        >
          {score > 70 ? '✓ Good' : score > 50 ? '⚠ Fair' : '✗ Poor'}
        </p>
        <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
          {score > 70
            ? 'Conditions are generally safe for outdoor activities.'
            : score > 50
              ? 'Conditions are moderate. Be cautious for extended outdoor activities.'
              : 'Poor conditions. Limit outdoor activities.'}
        </p>
      </div>
    </div>

    {/* Metrics Grid */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Environmental Metrics
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex items-center gap-2 mb-2">
              <div style={{ color: getMetricColor(metric.level, theme) }}>{metric.icon}</div>
              <div>
                <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
                  {metric.label}
                </p>
                <p className="text-[13px] font-bold" style={{ color: theme.foreground }}>
                  {metric.value}
                  <span className="text-[10px] ml-1" style={{ color: theme.muted.foreground }}>
                    {metric.unit}
                  </span>
                </p>
              </div>
            </div>
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ backgroundColor: theme.border }}
            >
              <div
                className="h-full transition-all"
                style={{
                  backgroundColor: getMetricColor(metric.level, theme),
                  width: `${metric.value}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recommendations */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Daily Recommendations
      </h4>
      <div className="space-y-3">
        <div className="flex gap-2">
          <span style={{ color: theme.warning.background }}>☀️</span>
          <p className="text-[12px]" style={{ color: theme.foreground }}>
            Avoid direct sun between 11am-3pm. UV index is high today.
          </p>
        </div>
        <div className="flex gap-2">
          <span>😷</span>
          <p className="text-[12px]" style={{ color: theme.foreground }}>
            Wear a mask if sensitive to air pollution. AQI is borderline moderate.
          </p>
        </div>
        <div className="flex gap-2">
          <span>💧</span>
          <p className="text-[12px]" style={{ color: theme.foreground }}>
            Stay hydrated. Heat stress is elevated at 34°C.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Map Container - Using MapLibre GL
const MapContainer: React.FC<{
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
  environmentalScore = 72,
  location = 'Banda Aceh',
  latitude,
  longitude,
  onGreenSpaceClick,
}) => {
  const mapRef = useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Use real coordinates from Redux, fallback to Banda Aceh
  const mapLng = longitude ?? 95.3167;
  const mapLat = latitude ?? 5.5577;

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
              <p className="font-bold">{location}</p>
              <p className="text-xs text-muted-foreground">Score: {environmentalScore}/100</p>
            </div>
          </MarkerPopup>
        </MapMarker>

        {/* Green space markers */}
        {greenSpaces.map((space) => {
          // Use coordinates if available, otherwise generate approximate ones based on distance
          const lng = space.longitude || mapLng + (Math.random() - 0.5) * 0.1;
          const lat = space.latitude || mapLat + (Math.random() - 0.5) * 0.1;

          return (
            <MapMarker
              key={space.id}
              longitude={lng}
              latitude={lat}
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
                        <Badge key={idx} variant="secondary" className="text-xs">
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
          position="bottom-right"
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
      <div className="absolute bottom-6 left-6 z-10 pointer-events-auto">
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

// Right Panel: Insights & Alerts
const InsightsPanel: React.FC<{
  theme: typeof themeConfig.light;
  alerts: Alert[];
  recommendations: Recommendation[];
  greenSpaces: GreenSpace[];
  scoreHistory: ScoreHistory[];
  onAlertClick?: (alertId: string) => void;
  onGreenSpaceClick?: (spaceId: string) => void;
}> = ({
  theme,
  alerts,
  recommendations,
  greenSpaces,
  scoreHistory,
  onAlertClick,
  onGreenSpaceClick,
}) => (
  <div
    className="hidden lg:flex flex-col w-80 p-6 overflow-y-auto border-l gap-6"
    style={{ backgroundColor: 'white', borderLeftColor: theme.border }}
  >
    {/* Active Alerts */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Active Alerts
      </h4>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => onAlertClick?.(alert.id)}
            className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            style={{
              borderColor:
                alert.type === 'warning'
                  ? `${theme.warning.background}4d`
                  : `${theme.accent.background}4d`,
              backgroundColor:
                alert.type === 'warning'
                  ? `${theme.warning.background}0f`
                  : `${theme.accent.background}0f`,
            }}
          >
            <div className="flex gap-2">
              <div
                style={{
                  color:
                    alert.type === 'warning' ? theme.warning.background : theme.accent.background,
                }}
              >
                {alert.icon}
              </div>
              <div>
                <p className="text-[12px] font-semibold" style={{ color: theme.foreground }}>
                  {alert.title}
                </p>
                <p className="text-[11px] mt-1" style={{ color: theme.muted.foreground }}>
                  {alert.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Green Spaces */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Nearby Green Spaces
      </h4>
      <div className="space-y-3">
        {greenSpaces.map((space) => (
          <div
            key={space.id}
            onClick={() => onGreenSpaceClick?.(space.id)}
            className="p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md"
            style={{ borderColor: theme.border, backgroundColor: theme.background }}
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-[12px] font-bold" style={{ color: theme.foreground }}>
                {space.name}
              </p>
              <p className="text-[10px]" style={{ color: theme.muted.foreground }}>
                {space.distance} km
              </p>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={12} style={{ color: theme.success.background }} />
              <p className="text-[10px]" style={{ color: theme.success.background }}>
                {space.status}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {space.tags.map((tag, idx) => (
                <Badge
                  key={idx}
                  className="text-[9px] px-2 py-1"
                  style={{
                    backgroundColor: `${theme.secondary.background}20`,
                    color: theme.secondary.foreground,
                    border: 'none',
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Score History - Trending Chart */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Score Trending
      </h4>
      <ScoreTrendingChart data={scoreHistory as ScoreHistoryData[]} height={200} />
    </div>

    {/* Daily Recommendations */}
    {recommendations && recommendations.length > 0 && (
      <div>
        <h4
          className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
          style={{ color: theme.primary.background }}
        >
          Daily Recommendations
        </h4>
        <div className="space-y-3">
          {recommendations.map((rec) => {
            const severityColor =
              rec.severity === 2
                ? theme.destructive.background
                : rec.severity === 1
                  ? theme.warning.background
                  : theme.success.background;
            const backgroundColor =
              rec.severity === 2
                ? `${theme.destructive.background}10`
                : rec.severity === 1
                  ? `${theme.warning.background}10`
                  : `${theme.success.background}10`;

            return (
              <div
                key={rec.id}
                className="p-3 rounded-lg border-l-4 flex gap-3"
                style={{
                  borderColor: severityColor,
                  backgroundColor: backgroundColor,
                }}
              >
                <div className="flex-shrink-0 mt-1">
                  {rec.severity === 2 ? (
                    <AlertCircle size={16} style={{ color: severityColor }} />
                  ) : rec.severity === 1 ? (
                    <TrendingUp size={16} style={{ color: severityColor }} />
                  ) : (
                    <CheckCircle size={16} style={{ color: severityColor }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold mb-1" style={{ color: severityColor }}>
                    {rec.severity === 2
                      ? 'Action Required'
                      : rec.severity === 1
                        ? 'Warning'
                        : 'Good News'}
                  </p>
                  <p className="text-[10px]" style={{ color: theme.muted.foreground }}>
                    {rec.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

// ══ MAIN COMPONENT ══
const MapScreenSection: React.FC<MapScreenSectionProps> = ({ state = {}, service = {} }) => {
  const theme = themeConfig.light;

  // Destructure state with defaults
  const {
    location = 'Banda Aceh, Aceh',
    latitude,
    longitude,
    environmentalScore = 72,
    metrics = [],
    alerts = [],
    recommendations = [],
    greenSpaces = [],
    scoreHistory = [],
    searchQuery = '',
    loading = false,
    error = null,
    isCurrentLocationDetected = true,
    detectedLocation = null,
  } = state;

  // Destructure service handlers
  const {
    onLocationSearch = () => {},
    onAlertClick = () => {},
    onGreenSpaceClick = () => {},
  } = service;

  // ══ LOCAL STATE FOR MODAL ══
  const [selectedGreenSpaceId, setSelectedGreenSpaceId] = useState<string | null>(null);
  const [isGreenSpaceModalOpen, setIsGreenSpaceModalOpen] = useState(false);

  // Handle green space click
  const handleGreenSpaceClick = (spaceId: string) => {
    const space = greenSpaces.find((s) => s.id === spaceId);
    if (space) {
      setSelectedGreenSpaceId(spaceId);
      setIsGreenSpaceModalOpen(true);
      onGreenSpaceClick?.(spaceId);
    }
  };

  // Handle search query locally
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Show loading state
  if (loading) {
    return (
      <section
        className="w-full h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.background }}
      >
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-4 border-opacity-30 border-t-opacity-100 animate-spin mx-auto mb-4"
            style={{
              borderColor: `${theme.primary.background}30`,
              borderTopColor: theme.primary.background,
            }}
          />
          <p style={{ color: theme.muted.foreground }}>Loading map data...</p>
        </div>
      </section>
    );
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && localSearchQuery.trim()) {
      onLocationSearch?.(localSearchQuery);
    }
  };

  return (
    <section
      className="w-full h-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: theme.background }}
    >
      {/* ══ TOPBAR ══ */}
      <div
        className="flex items-center justify-between px-6 py-4 border-b gap-4"
        style={{ backgroundColor: 'white', borderBottomColor: theme.border }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: theme.primary.background }}
          >
            A
          </div>
          <span
            className="text-[13px] font-bold tracking-[0.1em]"
            style={{ color: theme.primary.background }}
          >
            AERIS
          </span>
        </div>

        {/* Search Bar */}
        <div
          className="flex-1 max-w-md flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{ backgroundColor: theme.background, borderColor: theme.border }}
        >
          <Search size={16} style={{ color: theme.muted.foreground }} />
          <input
            type="text"
            placeholder="Search location (press Enter)..."
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="flex-1 bg-transparent outline-none text-[13px]"
            style={{ color: theme.foreground }}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.background }}
          >
            <Bell size={18} style={{ color: theme.primary.background }} />
            {alerts.length > 0 && (
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: theme.destructive.background }}
              />
            )}
          </button>
          <button
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: theme.background }}
          >
            <Layers size={18} style={{ color: theme.primary.background }} />
          </button>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: theme.secondary.background }}
          >
            MA
          </div>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══ */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <EnvironmentalSummaryPanel
          theme={theme}
          location={location}
          score={environmentalScore}
          metrics={metrics}
          alerts={alerts}
          greenSpaces={greenSpaces}
          scoreHistory={scoreHistory}
          isCurrentLocation={isCurrentLocationDetected}
          detectedLocation={detectedLocation}
        />

        {/* Map Container */}
        <MapContainer
          theme={theme}
          greenSpaces={greenSpaces}
          environmentalScore={environmentalScore}
          location={location}
          latitude={latitude}
          longitude={longitude}
          onGreenSpaceClick={handleGreenSpaceClick}
        />

        {/* Right Panel */}
        <InsightsPanel
          theme={theme}
          alerts={alerts}
          recommendations={recommendations}
          greenSpaces={greenSpaces}
          scoreHistory={scoreHistory}
          onAlertClick={onAlertClick}
          onGreenSpaceClick={handleGreenSpaceClick}
        />

        {/* Mobile FAB */}
        <div className="lg:hidden absolute bottom-6 right-6 z-20">
          <Button
            className="w-12 h-12 p-0 rounded-full"
            style={{
              backgroundColor: theme.primary.background,
              color: theme.primary.foreground,
            }}
          >
            <Menu size={20} />
          </Button>
        </div>

        {/* Green Space Details Modal */}
        {selectedGreenSpaceId && (
          <GreenSpaceDetailsModal
            isOpen={isGreenSpaceModalOpen}
            onClose={() => {
              setIsGreenSpaceModalOpen(false);
              setSelectedGreenSpaceId(null);
            }}
            spaceId={selectedGreenSpaceId}
            spaceName={
              greenSpaces.find((s) => s.id === selectedGreenSpaceId)?.name || 'Green Space'
            }
            latitude={greenSpaces.find((s) => s.id === selectedGreenSpaceId)?.latitude}
            longitude={greenSpaces.find((s) => s.id === selectedGreenSpaceId)?.longitude}
          />
        )}
      </div>
    </section>
  );
};

export default MapScreenSection;
