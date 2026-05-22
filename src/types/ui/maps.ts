import {
  Alert,
  EnvironmentalMetric,
  GreenSpace,
  Recommendation,
  ScoreHistory,
} from '../partial/maps';

export interface MapScreenSectionProps {
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
    onAlertClick?: (alertId: string) => void;
    onGreenSpaceClick?: (spaceId: string) => void;
    onMetricClick?: (metricId: string) => void;
  };
}
