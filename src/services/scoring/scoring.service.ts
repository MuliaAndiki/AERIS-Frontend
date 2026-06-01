import {
  ScoreDetailResponse,
  ScorePreviewBody,
  ScorePreviewResponse,
  ScoreQuery,
  ScoreRefreshCacheResponse,
  ScoreSummaryResponse,
} from '@/types/res/scoring.res';
import AxiosClient from '@/utils/axios.client';

class ScoringApi {
  async Score(query?: ScoreQuery): Promise<ScoreSummaryResponse> {
    const res = await AxiosClient.get('/api/environment/score', {
      params: query,
    });
    return res.data;
  }

  async Detail(query?: ScoreQuery): Promise<ScoreDetailResponse> {
    const res = await AxiosClient.get('/api/environment/score/details', {
      params: query,
    });
    return res.data;
  }

  async Preview(payload: ScorePreviewBody): Promise<ScorePreviewResponse> {
    const res = await AxiosClient.post('/api/environment/score/preview', payload);
    return res.data;
  }

  async RefreshCache(): Promise<ScoreRefreshCacheResponse> {
    const res = await AxiosClient.post('/api/environment/score/cache/refresh', {});
    return res.data;
  }
}

export default new ScoringApi();
