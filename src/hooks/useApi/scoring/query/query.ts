import { useQuery } from '@tanstack/react-query';

import Api from '@/services/props.service';
import { ScoreQuery } from '@/types/res/scoring.res';
import { cacheKey } from '@/utils/cache';

export function useScoreSummary(query?: ScoreQuery) {
  return useQuery({
    queryKey: cacheKey.scoring.summary(query?.snapshotId),
    queryFn: () => Api.Scoring.Score(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useScoreDetail(query?: ScoreQuery) {
  return useQuery({
    queryKey: cacheKey.scoring.detail(query?.snapshotId),
    queryFn: () => Api.Scoring.Detail(query),
    staleTime: 1000 * 60 * 5,
  });
}
