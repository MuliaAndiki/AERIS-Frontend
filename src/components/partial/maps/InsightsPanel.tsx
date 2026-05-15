import ScoreTrendingChart, {
  ScoreHistoryData,
} from '@/components/section/(private)/user/map/score-trending-chart';
import { themeConfig } from '@/configs/theme.config';
import { Alert, GreenSpace, Recommendation, ScoreHistory } from '@/types/partial/maps';
import { AlertCircle, Badge, CheckCircle, TrendingUp } from 'lucide-react';

export const InsightsPanel: React.FC<{
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
    className="flex flex-col w-full h-full p-6 overflow-y-auto border-l gap-6"
    style={{ backgroundColor: 'white', borderLeftColor: theme.border }}
  >
    {/* Active Alerts */}
    <div>
      <h4
        className="text-[11px] font-bold tracking-widest uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Active Alerts4
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
        className="text-[11px] font-bold tracking-widest uppercase mb-4"
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
        className="text-[11px] font-bold tracking-widest uppercase mb-4"
        style={{ color: theme.primary.background }}
      >
        Score Trending
      </h4>
      <ScoreTrendingChart data={scoreHistory as ScoreHistoryData[]} height={200} />
    </div>
  </div>
);
