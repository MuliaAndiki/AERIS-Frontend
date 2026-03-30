import { useRefreshAllCache } from './mutate/mutation';
import { useCacheRoots } from './query/query';

export function useCacheApi() {
  return {
    mutation: {
      refreshAll: useRefreshAllCache,
    },
    query: {
      roots: useCacheRoots,
    },
  };
}
