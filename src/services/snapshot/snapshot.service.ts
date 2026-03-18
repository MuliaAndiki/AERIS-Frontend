import AxiosClient from '@/utils/axios.client';
import {
  GenerateSnapshotBody,
  SnapshotCurrentResponse,
  SnapshotDetailResponse,
  SnapshotHistoryResponse,
  SnapshotQuery,
  SnapshotRefreshCacheResponse,
  SnapshotGenerateResponse,
} from '@/types/res/snapshot.res';

class SnapshotApi {
  async Current(query?: Pick<SnapshotQuery, 'locationId'>): Promise<SnapshotCurrentResponse> {
    const res = await AxiosClient.get('/api/environment/snapshot/current', {
      params: query,
    });
    return res.data;
  }

  async History(query?: SnapshotQuery): Promise<SnapshotHistoryResponse> {
    const res = await AxiosClient.get('/api/environment/snapshot/history', {
      params: query,
    });
    return res.data;
  }

  async Detail(snapshotId: string): Promise<SnapshotDetailResponse> {
    const res = await AxiosClient.get(`/api/environment/snapshot/${snapshotId}`);
    return res.data;
  }

  async Generate(payload?: GenerateSnapshotBody): Promise<SnapshotGenerateResponse> {
    const res = await AxiosClient.post('/api/environment/snapshot/generate', payload ?? {});
    return res.data;
  }

  async RefreshCache(): Promise<SnapshotRefreshCacheResponse> {
    const res = await AxiosClient.post('/api/environment/snapshot/cache/refresh', {});
    return res.data;
  }
}

export default new SnapshotApi();
