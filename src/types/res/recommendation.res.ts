import { ApiResponse, CacheRefreshResponse } from '@/types/res/base.res';

export interface RecommendationQuery {
  snapshotId?: string;
}

export interface RecommendationItem {
  id: string;
  recommendationType: string;
  message: string;
  severity: number;
}

export interface DailyRecommendationData {
  date: string;
  total: number;
  items: RecommendationItem[];
}

export type RecommendationListResponse = ApiResponse<RecommendationItem[]>;
export type RecommendationDailyResponse = ApiResponse<DailyRecommendationData>;
export type RecommendationRefreshCacheResponse = CacheRefreshResponse;
