import AxiosClient from '@/utils/axios.client';
import {
  InsightDailyResponse,
  InsightListResponse,
  InsightQuery,
  InsightRefreshCacheResponse,
} from '@/types/res/insight.res';

class InsightApi {
  async List(query?: InsightQuery): Promise<InsightListResponse> {
    const res = await AxiosClient.get('/api/insights', {
      params: query,
    });
    return res.data;
  }

  async Daily(): Promise<InsightDailyResponse> {
    const res = await AxiosClient.get('/api/insights/daily');
    return res.data;
  }

  async RefreshCache(): Promise<InsightRefreshCacheResponse> {
    const res = await AxiosClient.post('/api/insights/cache/refresh', {});
    return res.data;
  }
}

export default new InsightApi();
