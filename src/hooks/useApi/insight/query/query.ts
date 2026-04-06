import { useQuery } from '@tanstack/react-query';

import Api from '@/services/props.service';
import { InsightQuery } from '@/types/res/insight.res';
import { cacheKey } from '@/utils/cache';

export function useInsightList(query?: InsightQuery) {
  return useQuery({
    queryKey: cacheKey.insight.list(query?.snapshotId),
    queryFn: () => Api.Insight.List(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useInsightDaily() {
  return useQuery({
    queryKey: cacheKey.insight.daily(),
    queryFn: () => Api.Insight.Daily(),
    staleTime: 1000 * 60 * 5,
  });
}
