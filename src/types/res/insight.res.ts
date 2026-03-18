import { ApiResponse, CacheRefreshResponse } from '@/types/res/base.res';

export interface InsightQuery {
  snapshotId?: string;
}

export interface InsightItem {
  snapshotId?: string;
  date?: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export type InsightListResponse = ApiResponse<InsightItem[]>;
export type InsightDailyResponse = ApiResponse<InsightItem>;
export type InsightRefreshCacheResponse = CacheRefreshResponse;
