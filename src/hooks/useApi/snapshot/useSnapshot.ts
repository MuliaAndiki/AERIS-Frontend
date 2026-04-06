import { useGenerateSnapshot, useRefreshSnapshotCache } from './mutate/mutation';
import { useSnapshotCurrent, useSnapshotDetail, useSnapshotHistory } from './query/query';

export function useSnapshotApi() {
  return {
    mutation: {
      generate: useGenerateSnapshot,
      refreshCache: useRefreshSnapshotCache,
    },
    query: {
      current: useSnapshotCurrent,
      history: useSnapshotHistory,
      detail: useSnapshotDetail,
    },
  };
}
