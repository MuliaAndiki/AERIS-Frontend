import { ApiResponse, CacheRefreshResponse } from '@/types/res/base.res';
import { SnapshotScoreDetail } from '@/types/res/snapshot.res';

export interface ScoreQuery {
  snapshotId?: string;
}

export interface ScoreSummary {
  snapshotId: string;
  environmentalScore: number;
}

export interface ScorePreviewBody {
  airQualityScore: number;
  heatRiskScore: number;
  floodRiskScore: number;
  noiseScore: number;
  greenSpaceScore: number;
}

export interface ScorePreviewData {
  environmentalScore: number;
}

export type ScoreSummaryResponse = ApiResponse<ScoreSummary>;
export type ScoreDetailResponse = ApiResponse<SnapshotScoreDetail>;
export type ScorePreviewResponse = ApiResponse<ScorePreviewData>;
export type ScoreRefreshCacheResponse = CacheRefreshResponse;
