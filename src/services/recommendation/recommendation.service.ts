import {
  RecommendationDailyResponse,
  RecommendationListResponse,
  RecommendationQuery,
  RecommendationRefreshCacheResponse,
} from '@/types/res/recommendation.res';
import AxiosClient from '@/utils/axios.client';

class RecommendationApi {
  async List(query?: RecommendationQuery): Promise<RecommendationListResponse> {
    const res = await AxiosClient.get('/api/recommendations', {
      params: query,
    });
    return res.data;
  }

  async Daily(): Promise<RecommendationDailyResponse> {
    const res = await AxiosClient.get('/api/recommendations/daily');
    return res.data;
  }

  async RefreshCache(): Promise<RecommendationRefreshCacheResponse> {
    const res = await AxiosClient.post('/api/recommendations/cache/refresh', {});
    return res.data;
  }
}

export default new RecommendationApi();
