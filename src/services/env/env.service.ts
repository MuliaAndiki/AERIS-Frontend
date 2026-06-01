import {
  EnvironmentAirQualityResponse,
  EnvironmentCreateReviewPayload,
  EnvironmentDisasterRiskResponse,
  EnvironmentGreenAreaDetailResponse,
  EnvironmentGreenReviewCreateResponse,
  EnvironmentGreenReviewDeleteResponse,
  EnvironmentGreenReviewFilter,
  EnvironmentGreenReviewListResponse,
  EnvironmentGreenReviewModerateResponse,
  EnvironmentGreenReviewSort,
  EnvironmentGreenReviewUpdateResponse,
  EnvironmentGreenSpaceResponse,
  EnvironmentHeatRiskResponse,
  EnvironmentModerateReviewPayload,
  EnvironmentNoiseResponse,
  EnvironmentProviderResponse,
  EnvironmentProviderStatusResponse,
  EnvironmentRawResponse,
  EnvironmentUpdateReviewPayload,
  EnvironmentWeatherResponse,
} from '@/types/res/environment.res';
import AxiosClient from '@/utils/axios.client';

class EnvironmentApi {
  async AirQuality(): Promise<EnvironmentAirQualityResponse> {
    const res = await AxiosClient.get('/api/environment/air-quality');
    return res.data;
  }
  async Weather(): Promise<EnvironmentWeatherResponse> {
    const res = await AxiosClient.get('/api/environment/weather');
    return res.data;
  }
  async HeatRisk(): Promise<EnvironmentHeatRiskResponse> {
    const res = await AxiosClient.get('/api/environment/heat-risk');
    return res.data;
  }
  async Noise(): Promise<EnvironmentNoiseResponse> {
    const res = await AxiosClient.get('/api/environment/noise');
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
  async GreenSpaceDetail(greenAreaId: string): Promise<EnvironmentGreenAreaDetailResponse> {
    const res = await AxiosClient.get(`/api/environment/green-space/${greenAreaId}`);
    return res.data;
  }
  async GreenSpaceReviews(
    greenAreaId: string,
    page = 1,
    limit = 10,
    sort: EnvironmentGreenReviewSort = 'latest',
    filter: EnvironmentGreenReviewFilter = 'visible'
  ): Promise<EnvironmentGreenReviewListResponse> {
    const res = await AxiosClient.get('/api/environment/green-space/reviews', {
      params: { greenAreaId, page, limit, sort, filter },
    });
    return res.data;
  }
  async CreateGreenSpaceReview(
    payload: EnvironmentCreateReviewPayload
  ): Promise<EnvironmentGreenReviewCreateResponse> {
    const res = await AxiosClient.post('/api/environment/green-space/reviews', payload);
    return res.data;
  }
  async UpdateGreenSpaceReview(
    reviewId: string,
    payload: EnvironmentUpdateReviewPayload
  ): Promise<EnvironmentGreenReviewUpdateResponse> {
    const res = await AxiosClient.put(`/api/environment/green-space/reviews/${reviewId}`, payload);
    return res.data;
  }
  async DeleteGreenSpaceReview(reviewId: string): Promise<EnvironmentGreenReviewDeleteResponse> {
    const res = await AxiosClient.delete(`/api/environment/green-space/reviews/${reviewId}`);
    return res.data;
  }
  async ModerateGreenSpaceReview(
    reviewId: string,
    payload: EnvironmentModerateReviewPayload
  ): Promise<EnvironmentGreenReviewModerateResponse> {
    const res = await AxiosClient.patch(
      `/api/environment/green-space/reviews/${reviewId}/moderate`,
      payload
    );
    return res.data;
  }
  async RawEnvironment(): Promise<EnvironmentRawResponse> {
    const res = await AxiosClient.get('/api/environment/raw');
    return res.data;
  }
  async Provider(): Promise<EnvironmentProviderResponse> {
    const res = await AxiosClient.get('/api/environment/providers');
    return res.data;
  }
  async ProviderStatus(): Promise<EnvironmentProviderStatusResponse> {
    const res = await AxiosClient.get('/api/environment/providers/status');
    return res.data;
  }
}

export default new EnvironmentApi();
