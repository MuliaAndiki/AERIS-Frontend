import { useQuery } from '@tanstack/react-query';

import Api from '@/services/props.service';
import { SnapshotQuery } from '@/types/res/snapshot.res';
import { cacheKey } from '@/utils/cache';

export function useSnapshotCurrent(locationId?: string) {
  return useQuery({
    queryKey: cacheKey.snapshot.current(locationId),
    queryFn: () => Api.Snapshot.Current(locationId ? { locationId } : undefined),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSnapshotHistory(query?: SnapshotQuery) {
  return useQuery({
    queryKey: cacheKey.snapshot.history(query?.locationId, query?.limit),
    queryFn: () => Api.Snapshot.History(query),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSnapshotDetail(snapshotId: string) {
  return useQuery({
    queryKey: cacheKey.snapshot.detail(snapshotId),
    queryFn: () => Api.Snapshot.Detail(snapshotId),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(snapshotId),
  });
}
