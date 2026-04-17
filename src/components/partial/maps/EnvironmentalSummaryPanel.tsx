import { themeConfig } from '@/configs/theme.config';
import {
  Alert,
  EnvironmentalMetric,
  GreenSpace,
  Recommendation,
  ScoreHistory,
} from '@/types/partial/maps';
import { getMetricColor } from '@/utils/metricColors';
import { Badge, MapPin } from 'lucide-react';

export const EnvironmentalSummaryPanel: React.FC<{
  theme: typeof themeConfig.light;
  location?: string;
  score?: number;
  metrics: EnvironmentalMetric[];
  recommendations?: Recommendation[];
  alerts?: Alert[];
  greenSpaces?: GreenSpace[];
  scoreHistory?: ScoreHistory[];
  isCurrentLocation?: boolean;
  detectedLocation?: { lat: number; lon: number; city: string } | null;
}> = ({
  theme,
  location,
  score = 0,
  metrics,
  recommendations = [],
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
              {location || 'Location not set'}
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
            {score > 0 ? score : '--'}
          </span>
          {score > 0 && (
            <span className="text-[9px]" style={{ color: theme.muted.foreground }}>
              /100
            </span>
          )}
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
          {score > 0 ? (score > 70 ? '✓ Good' : score > 50 ? '⚠ Fair' : '✗ Poor') : 'No score yet'}
        </p>
        <p className="text-[11px]" style={{ color: theme.muted.foreground }}>
          {score > 0
            ? score > 70
              ? 'Conditions are generally safe for outdoor activities.'
              : score > 50
                ? 'Conditions are moderate. Be cautious for extended outdoor activities.'
                : 'Poor conditions. Limit outdoor activities.'
            : 'Enable location access to start environmental scoring.'}
        </p>
      </div>
    </div>

    {/* Metrics Grid */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-widest uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Environmental Metrics
      </h4>
      <div className="grid grid-cols-2 gap-4">
        {/* nanti fix */}
        {metrics.map((metric: any, idx: number) => (
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
        className="text-[11px] font-bold tracking-widest uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Daily Recommendations
      </h4>
      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((recommendation) => (
            <div key={recommendation.id} className="flex gap-2">
              <span style={{ color: theme.warning.background }}>
                {recommendation.severity >= 2 ? '⚠️' : recommendation.severity === 1 ? 'ℹ️' : '✅'}
              </span>
              <p className="text-[12px]" style={{ color: theme.foreground }}>
                {recommendation.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[12px]" style={{ color: theme.muted.foreground }}>
          No recommendation available yet.
        </p>
      )}
    </div>
  </div>
);
