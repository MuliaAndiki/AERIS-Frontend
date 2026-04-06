import { useQuery } from '@tanstack/react-query';

import Api from '@/services/props.service';
import { RecommendationQuery } from '@/types/res/recommendation.res';
import { cacheKey } from '@/utils/cache';

export function useRecommendationList(query?: RecommendationQuery) {
  return useQuery({
    queryKey: cacheKey.recommendation.list(query?.snapshotId),
    queryFn: () => Api.Recommendation.List(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecommendationDaily() {
  return useQuery({
    queryKey: cacheKey.recommendation.daily(),
    queryFn: () => Api.Recommendation.Daily(),
    staleTime: 1000 * 60 * 5,
  });
}
