import { useQuery } from '@tanstack/react-query';

import { cacheKey } from '@/utils/cache';

export function useCacheRoots() {
  return useQuery({
    queryKey: cacheKey.cache.roots(),
    queryFn: async () => cacheKey,
    staleTime: Infinity,
  });
}
