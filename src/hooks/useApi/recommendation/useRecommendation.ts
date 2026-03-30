import { useRefreshRecommendationCache } from './mutate/mutation';
import { useRecommendationDaily, useRecommendationList } from './query/query';

export function useRecommendationApi() {
  return {
    mutation: {
      refreshCache: useRefreshRecommendationCache,
    },
    query: {
      list: useRecommendationList,
      daily: useRecommendationDaily,
    },
  };
}
