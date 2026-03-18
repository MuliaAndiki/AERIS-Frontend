import { ApiResponse, CacheRefreshResponse } from '@/types/res/base.res';

export interface SnapshotAirQuality {
  id: string;
  snapshotId: string;
  aqi: number;
  category: string;
  dominantPollutant: string;
}

export interface SnapshotWeatherCondition {
  id: string;
  snapshotId: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  weatherStatus: string;
}

export interface SnapshotNoiseEstimation {
  id: string;
  snapshotId: string;
  roadDensityIndex: number;
  estimatedNoiseLevel: number;
}

export interface SnapshotScoreDetail {
  id: string;
  snapshotId: string;
  airQualityScore: number;
  heatRiskScore: number;
  floodRiskScore: number;
  noiseScore: number;
  greenSpaceScore: number;
}

export interface SnapshotRecommendation {
  id: string;
  snapshotId: string;
  recommendationType: string;
  message: string;
  severity: number;
}

export interface SnapshotGreenArea {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
}

export interface SnapshotGreenAccessScore {
  id: string;
  snapshotId: string;
  greenAreaId: string;
  distanceKm: number;
  accessibilityScore: number;
  greenArea?: SnapshotGreenArea;
}

export interface EnvironmentalSnapshot {
  id: string;
  locationId: string;
  snapshotTime: string;
  environmentalScore: number;
  airQuality?: SnapshotAirQuality | null;
  weatherCondition?: SnapshotWeatherCondition | null;
  noiseEstimation?: SnapshotNoiseEstimation | null;
  scoreDetail?: SnapshotScoreDetail | null;
  recommendations?: SnapshotRecommendation[];
  greenAccessScores?: SnapshotGreenAccessScore[];
}

export interface SnapshotQuery {
  locationId?: string;
  limit?: string;
}

export interface GenerateSnapshotBody {
  locationId?: string;
}

export type SnapshotCurrentResponse = ApiResponse<EnvironmentalSnapshot>;
export type SnapshotHistoryResponse = ApiResponse<EnvironmentalSnapshot[]>;
export type SnapshotDetailResponse = ApiResponse<EnvironmentalSnapshot>;
export type SnapshotGenerateResponse = ApiResponse<EnvironmentalSnapshot>;
export type SnapshotRefreshCacheResponse = CacheRefreshResponse;
