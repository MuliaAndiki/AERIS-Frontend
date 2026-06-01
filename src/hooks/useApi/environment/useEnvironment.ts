import {
  useCreateGreenSpaceReview,
  useDeleteGreenSpaceReview,
  useUpdateGreenSpaceReview,
} from './mutate/mutation';
import {
  useAirQuality,
  useDisasterRisk,
  useGreenSpace,
  useGreenSpaceDetail,
  useGreenSpaceReviews,
  useHeatRisk,
  useNoise,
  useProviders,
  useProviderStatus,
  useRawEnvironment,
  useWeather,
} from './query/query';

export function useEnvironmentApi() {
  return {
    mutation: {
      createReview: useCreateGreenSpaceReview,
      updateReview: useUpdateGreenSpaceReview,
      deleteReview: useDeleteGreenSpaceReview,
    },
    query: {
      airQuality: useAirQuality,
      weather: useWeather,
      heatRisk: useHeatRisk,
      noise: useNoise,
      disasterRisk: useDisasterRisk,
      greenSpace: useGreenSpace,
      greenSpaceDetail: useGreenSpaceDetail,
      greenSpaceReviews: useGreenSpaceReviews,
      rawEnvironment: useRawEnvironment,
      providers: useProviders,
      providersStatus: useProviderStatus,
    },
  };
}
