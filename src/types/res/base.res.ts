import { TResponse } from '@/pkg/react-query/mutation-wrapper.type';

export type ApiResponse<T> = TResponse<T>;

export interface CacheRefreshData {
  removed: number;
}

export type CacheRefreshResponse = ApiResponse<CacheRefreshData>;
