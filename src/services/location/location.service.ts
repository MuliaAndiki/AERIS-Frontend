import { ResolveLocationBody } from '@/types/schema/location.schema';
import AxiosClient from '@/utils/axios.client';
import { DetectLocationResponse, ResolveLocationResponse } from '@/types/res/location.res';

class LocationApi {
  async Detect(): Promise<DetectLocationResponse> {
    const res = await AxiosClient.get('/api/location/detect');
    return res.data;
  }
  async Resolve(payload: ResolveLocationBody): Promise<ResolveLocationResponse> {
    const res = await AxiosClient.post('/api/location/resolve', payload);
    return res.data;
  }
}

export default new LocationApi();
