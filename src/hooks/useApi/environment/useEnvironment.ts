import {
  useAirQuality,
  useDisasterRisk,
  useGreenSpace,
  useHeatRisk,
  useNoise,
  useProviders,
  useProviderStatus,
  useRawEnvironment,
  useWeather,
} from './query/query';

export function useEnvironmentApi() {
  return {
    mutation: {},
    query: {
      airQuality: useAirQuality,
      weather: useWeather,
      heatRisk: useHeatRisk,
      noise: useNoise,
      disasterRisk: useDisasterRisk,
      greenSpace: useGreenSpace,
      rawEnvironment: useRawEnvironment,
      providers: useProviders,
      providersStatus: useProviderStatus,
    },
  };
}
