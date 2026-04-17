import { ResolveLocationBody } from '@/types/schema/location.schema';
import AxiosClient from '@/utils/axios.client';
import {
  DetectLocationResponse,
  ResolveLocationResponse,
  LocationSearchResponse,
} from '@/types/res/location.res';

class LocationApi {
  async Detect(): Promise<DetectLocationResponse> {
    const res = await AxiosClient.get('/api/location/detect');
    return res.data;
  }

  async Search(query: string): Promise<LocationSearchResponse> {
    const res = await AxiosClient.get('/api/location/search', {
      params: { query },
    });
    return res.data;
  }

  async Resolve(payload: ResolveLocationBody): Promise<ResolveLocationResponse> {
    console.log('[LocationApi.Resolve] Sending payload:', payload);
    const res = await AxiosClient.post('/api/location/resolve', payload);
    console.log('[LocationApi.Resolve] Response:', res.data);
    return res.data;
  }
}

export default new LocationApi();
