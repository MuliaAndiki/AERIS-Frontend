import { useQuery } from '@tanstack/react-query';

import Api from '@/services/props.service';
import { cacheKey } from '@/utils/cache';

export function useDetectLocation() {
  return useQuery({
    queryKey: cacheKey.location.detect(),
    queryFn: () => Api.Location.Detect(),
    staleTime: 1000 * 60 * 5,
  });
}
