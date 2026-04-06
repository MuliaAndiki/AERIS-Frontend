import { useRefreshInsightCache } from './mutate/mutation';
import { useInsightDaily, useInsightList } from './query/query';

export function useInsightApi() {
  return {
    mutation: {
      refreshCache: useRefreshInsightCache,
    },
    query: {
      list: useInsightList,
      daily: useInsightDaily,
    },
  };
}
