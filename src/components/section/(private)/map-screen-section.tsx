import React, { useState } from 'react';
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

interface GreenSpace {
  id: string;
  name: string;
  distance: number;
  status: string;
  tags: string[];
}

interface ScoreHistory {
  date: string;
  score: number;
  change: number;
}

interface MapScreenSectionProps {
  state?: {
    location?: string;
    environmentalScore?: number;
    metrics?: Record<string, EnvironmentalMetric>;
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
}> = ({ theme, location = 'Banda Aceh', score = 72, metrics }) => (
  <div
    className="hidden lg:flex flex-col w-80 p-6 overflow-y-auto border-r gap-6"
    style={{ backgroundColor: 'white', borderRightColor: theme.border }}
  >
    {/* Location Header */}
    <div>
      <div className="flex items-start gap-2 mb-1">
        <MapPin size={16} style={{ color: theme.primary.background, marginTop: 2 }} />
        <div>
          <h3 className="text-[14px] font-bold" style={{ color: theme.primary.background }}>
            {location}
          </h3>
          <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
            Aceh, Indonesia • Updated 3 min ago
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
          style={{ color: theme.success.background }}
        >
          ✓ Good
        </p>
        <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
          Conditions are generally safe for outdoor activities today.
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
              <div style={{ color: getMetricColor(metric.level, theme) }}>
                {metric.icon}
              </div>
              <div>
                <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
                  {metric.label}
                </p>
                <p className="text-[13px] font-bold" style={{ color: theme.foreground }}>
                  {metric.value}
                  <span
                    className="text-[10px] ml-1"
                    style={{ color: theme.muted.foreground }}
                  >
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

// Map Container
const MapContainer: React.FC<{
  theme: typeof themeConfig.light;
  onZoomIn: () => void;
  onZoomOut: () => void;
}> = ({ theme, onZoomIn, onZoomOut }) => (
  <div className="flex-1 relative flex flex-col">
    <div
      className="flex-1 relative"
      style={{
        background: `linear-gradient(135deg, ${theme.primary.background}15 0%, ${theme.secondary.background}08 100%)`,
      }}
    >
      <div className="w-full h-full relative flex items-center justify-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(0deg, ${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />

        {/* Markers */}
        <div className="relative w-full h-full">
          {/* Current Location */}
          <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full animate-pulse"
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: `${theme.primary.background}20`,
                }}
              />
              <div
                className="absolute w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
                style={{
                  backgroundColor: theme.primary.background,
                  left: 'calc(50% - 8px)',
                  top: 'calc(50% - 8px)',
                  boxShadow: `0 2px 8px ${theme.primary.background}40`,
                }}
              >
                •
              </div>
            </div>
          </div>

          {/* Green Space POI */}
          <div className="absolute top-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{
                backgroundColor: theme.success.background,
                boxShadow: `0 2px 8px ${theme.success.background}40`,
              }}
            >
              <TreePine size={14} />
            </div>
          </div>

          {/* Heat Risk POI */}
          <div className="absolute top-2/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{
                backgroundColor: theme.warning.background,
                boxShadow: `0 2px 8px ${theme.warning.background}40`,
              }}
            >
              <Flame size={14} />
            </div>
          </div>

          {/* Tooltip */}
          <div
            className="absolute top-1/4 left-1/3 transform translate-x-8 -translate-y-16 bg-white rounded-lg p-3 shadow-lg z-20"
            style={{ border: `1px solid ${theme.border}` }}
          >
            <p className="text-[11px] font-bold" style={{ color: theme.primary.background }}>
              Current Location
            </p>
            <p className="text-[10px] mt-1" style={{ color: theme.muted.foreground }}>
              Score 72 • Good
            </p>
          </div>
        </div>

        {/* Center Crosshair */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div
            className="w-6 h-6 border-2 rounded-full"
            style={{ borderColor: `${theme.primary.background}40` }}
          />
        </div>
      </div>

      {/* Layer Legend */}
      <div className="absolute bottom-6 left-6 z-10">
        <div
          className="bg-white rounded-lg p-4 shadow-lg space-y-2"
          style={{ border: `1px solid ${theme.border}` }}
        >
          <p className="text-[11px] font-bold" style={{ color: theme.primary.background }}>
            LAYER LEGEND
          </p>
          <div className="space-y-2">
            {[
              { color: theme.primary.background, label: 'Good air quality' },
              { color: theme.warning.background, label: 'Heat risk zone' },
              { color: theme.success.background, label: 'Green space' },
              { color: theme.accent.background, label: 'Location' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <p className="text-[10px]" style={{ color: theme.foreground }}>
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <Button
          onClick={onZoomIn}
          className="w-10 h-10 p-0 rounded-lg"
          style={{
            backgroundColor: 'white',
            color: theme.primary.background,
            border: `1px solid ${theme.border}`,
          }}
        >
          <ZoomIn size={18} />
        </Button>
        <Button
          onClick={onZoomOut}
          className="w-10 h-10 p-0 rounded-lg"
          style={{
            backgroundColor: 'white',
            color: theme.primary.background,
            border: `1px solid ${theme.border}`,
          }}
        >
          <ZoomOut size={18} />
        </Button>
        <Button
          className="w-10 h-10 p-0 rounded-lg"
          style={{
            backgroundColor: theme.primary.background,
            color: theme.primary.foreground,
          }}
        >
          <Crosshair size={18} />
        </Button>
      </div>
    </div>
  </div>
);

// Right Panel: Insights & Alerts
const InsightsPanel: React.FC<{
  theme: typeof themeConfig.light;
  alerts: Alert[];
  greenSpaces: GreenSpace[];
  scoreHistory: ScoreHistory[];
}> = ({ theme, alerts, greenSpaces, scoreHistory }) => (
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

    {/* Score History */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-[0.1em] uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Score History
      </h4>
      <div className="space-y-2">
        {scoreHistory.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <Clock size={12} style={{ color: theme.muted.foreground }} />
              <p className="text-[10px]" style={{ color: theme.muted.foreground }}>
                {item.date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-bold" style={{ color: theme.foreground }}>
                {item.score}
              </p>
              <p
                className="text-[10px] font-semibold"
                style={{
                  color: item.change > 0 ? theme.success.background : theme.destructive.background,
                }}
              >
                {item.change > 0 ? '+' : ''}
                {item.change}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ══ MAIN COMPONENT ══
const MapScreenSection: React.FC<MapScreenSectionProps> = ({
  state = {
    location: 'Banda Aceh, Aceh',
    environmentalScore: 72,
  },
  service = {},
}) => {
  const theme = themeConfig.light;
  const [searchQuery, setSearchQuery] = useState('');
  const [mapZoom, setMapZoom] = useState(14);

  // Default metrics data
  const defaultMetrics: EnvironmentalMetric[] = [
    {
      label: 'Air Quality',
      value: 58,
      unit: 'AQI',
      level: 'moderate',
      icon: <Wind size={20} />,
    },
    {
      label: 'Heat Risk',
      value: 34,
      unit: '°C',
      level: 'poor',
      icon: <Flame size={20} />,
    },
    {
      label: 'Flood Risk',
      value: 12,
      unit: '%',
      level: 'good',
      icon: <Droplets size={20} />,
    },
    {
      label: 'Noise',
      value: 62,
      unit: 'dB',
      level: 'moderate',
      icon: <Volume2 size={20} />,
    },
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'High Heat Index',
      description: 'Heat index expected until 5 PM. Feels like 38°C.',
      icon: <AlertCircle size={20} />,
    },
    {
      id: '2',
      type: 'info',
      title: 'Air Quality Improved',
      description: 'Air quality improved by 12% compared to yesterday.',
      icon: <TrendingUp size={20} />,
    },
  ];

  const greenSpaces: GreenSpace[] = [
    {
      id: '1',
      name: 'Taman Sari Park',
      distance: 0.8,
      status: 'Open now',
      tags: ['Low noise'],
    },
    {
      id: '2',
      name: 'Blang Padang Field',
      distance: 1.4,
      status: 'Open now',
      tags: ['Good air'],
    },
    {
      id: '3',
      name: 'Ulee Lheue Beach',
      distance: 3.2,
      status: 'Open',
      tags: ['Breezy'],
    },
  ];

  const scoreHistory: ScoreHistory[] = [
    { date: 'Today, 10:00 AM', score: 72, change: 5 },
    { date: 'Yesterday', score: 67, change: -10 },
    { date: '2 days ago', score: 67, change: -3 },
    { date: '3 days ago', score: 70, change: 8 },
  ];

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
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.destructive.background }}
            />
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
          location={state.location}
          score={state.environmentalScore}
          metrics={defaultMetrics}
        />

        {/* Map Container */}
        <MapContainer
          theme={theme}
          onZoomIn={() => setMapZoom(Math.min(mapZoom + 1, 20))}
          onZoomOut={() => setMapZoom(Math.max(mapZoom - 1, 5))}
        />

        {/* Right Panel */}
        <InsightsPanel
          theme={theme}
          alerts={alerts}
          greenSpaces={greenSpaces}
          scoreHistory={scoreHistory}
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
      </div>
    </section>
  );
};

export default MapScreenSection;