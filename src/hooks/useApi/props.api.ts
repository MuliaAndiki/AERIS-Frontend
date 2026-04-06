import { useAuthApi } from './auth/useAuth';
import { useCacheApi } from './cache/useCache';
import { useEnvironmentApi } from './environment/useEnvironment';
import { useInsightApi } from './insight/useInsight';
import { useLocationApi } from './location/useLocation';
import { useRecommendationApi } from './recommendation/useRecommendation';
import { useScoringApi } from './scoring/useScoring';
import { useSnapshotApi } from './snapshot/useSnapshot';

export const useApi = () => ({
  auth: useAuthApi(),
  cache: useCacheApi(),
  environment: useEnvironmentApi(),
  insight: useInsightApi(),
  location: useLocationApi(),
  recommendation: useRecommendationApi(),
  scoring: useScoringApi(),
  snapshot: useSnapshotApi(),
});
