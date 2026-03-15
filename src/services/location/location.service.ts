import { TResponse } from '@/pkg/react-query/mutation-wrapper.type';
import { ResolveLocationBody } from '@/types/schema/location.schema';
import AxiosClient from '@/utils/axios.client';

class LocationApi {
  async Detect(): Promise<TResponse<any>> {
    const res = await AxiosClient.get('/api/location/detect');
    return res.data;
  }
  async Resolve(payload: ResolveLocationBody): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/location/resolve', payload);
    return res.data;
  }
}

export default new LocationApi();
