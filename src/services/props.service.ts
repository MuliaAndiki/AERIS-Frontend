import AuhtApi from '@/services/auth/auth.service';
import EnvironmentApi from '@/services/env/env.service';
import InsightApi from '@/services/insight/insight.service';
import LocationApi from '@/services/location/location.service';
import RecommendationApi from '@/services/recommendation/recommendation.service';
import ScoringApi from '@/services/scoring/scoring.service';
import SnapshotApi from '@/services/snapshot/snapshot.service';

class Api {
  static Auth = AuhtApi;
  static Location = LocationApi;
  static Environment = EnvironmentApi;
  static Snapshot = SnapshotApi;
  static Scoring = ScoringApi;
  static Recommendation = RecommendationApi;
  static Insight = InsightApi;
}

export default Api;
