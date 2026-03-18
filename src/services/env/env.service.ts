import AxiosClient from '@/utils/axios.client';
import {
  EnvironmentAirQualityResponse,
  EnvironmentDisasterRiskResponse,
  EnvironmentGreenSpaceResponse,
  EnvironmentProviderResponse,
  EnvironmentProviderStatusResponse,
  EnvironmentRawResponse,
  EnvironmentWeatherResponse,
} from '@/types/res/environment.res';

class EnvironmentApi {
  async AirQuality(): Promise<EnvironmentAirQualityResponse> {
    const res = await AxiosClient.get('/api/environment/air-quality');
    return res.data;
  }
  async Weather(): Promise<EnvironmentWeatherResponse> {
    const res = await AxiosClient.get('/api/environment/weather');
    return res.data;
  }
  async DisasterRisk(): Promise<EnvironmentDisasterRiskResponse> {
    const res = await AxiosClient.get('/api/environment/disaster-risk');
    return res.data;
  }
  async GreenSpace(): Promise<EnvironmentGreenSpaceResponse> {
    const res = await AxiosClient.get('/api/environment/green-space');
    return res.data;
  }
  async RawEnvironment(): Promise<EnvironmentRawResponse> {
    const res = await AxiosClient.get('/api/environment/raw');
    return res.data;
  }
  async Provinder(): Promise<EnvironmentProviderResponse> {
    const res = await AxiosClient.get('/api/environment/providers');
    return res.data;
  }
  async ProvinderStatus(): Promise<EnvironmentProviderStatusResponse> {
    const res = await AxiosClient.get('/api/environment/providers/status');
    return res.data;
  }
}

export default new EnvironmentApi();
