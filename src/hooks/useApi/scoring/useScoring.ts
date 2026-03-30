import { usePreviewScore, useRefreshScoreCache } from './mutate/mutation';
import { useScoreDetail, useScoreSummary } from './query/query';

export function useScoringApi() {
  return {
    mutation: {
      preview: usePreviewScore,
      refreshCache: useRefreshScoreCache,
    },
    query: {
      summary: useScoreSummary,
      detail: useScoreDetail,
    },
  };
}
