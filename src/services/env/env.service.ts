import { TResponse } from '@/pkg/react-query/mutation-wrapper.type';
import AxiosClient from '@/utils/axios.client';

class EnvironmentApi {
  async RawEnvironment(): Promise<TResponse<any>> {
    const res = await AxiosClient.get('/api/environment/raw');
    return res.data;
  }
  //provinder
  //status
}

export default new EnvironmentApi();
