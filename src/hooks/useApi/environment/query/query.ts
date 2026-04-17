import { useQuery } from '@tanstack/react-query';

import Api from '@/services/props.service';
import {
  EnvironmentGreenReviewFilter,
  EnvironmentGreenReviewSort,
} from '@/types/res/environment.res';
import { cacheKey } from '@/utils/cache';

export function useAirQuality() {
  return useQuery({
    queryKey: cacheKey.environment.airQuality(),
    queryFn: () => Api.Environment.AirQuality(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useWeather() {
  return useQuery({
    queryKey: cacheKey.environment.weather(),
    queryFn: () => Api.Environment.Weather(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useHeatRisk() {
  return useQuery({
    queryKey: cacheKey.environment.heatRisk(),
    queryFn: () => Api.Environment.HeatRisk(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useNoise() {
  return useQuery({
    queryKey: cacheKey.environment.noise(),
    queryFn: () => Api.Environment.Noise(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useDisasterRisk() {
  return useQuery({
    queryKey: cacheKey.environment.disasterRisk(),
    queryFn: () => Api.Environment.DisasterRisk(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGreenSpace() {
  return useQuery({
    queryKey: cacheKey.environment.greenSpace(),
    queryFn: () => Api.Environment.GreenSpace(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useGreenSpaceDetail(greenAreaId: string) {
  return useQuery({
    queryKey: cacheKey.environment.greenSpaceDetail(greenAreaId),
    queryFn: () => Api.Environment.GreenSpaceDetail(greenAreaId),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(greenAreaId),
  });
}

export function useGreenSpaceReviews(
  greenAreaId: string,
  page = 1,
  limit = 10,
  sort: EnvironmentGreenReviewSort = 'latest',
  filter: EnvironmentGreenReviewFilter = 'visible'
) {
  return useQuery({
    queryKey: cacheKey.environment.greenSpaceReviews(greenAreaId, page, limit, sort, filter),
    queryFn: () => Api.Environment.GreenSpaceReviews(greenAreaId, page, limit, sort, filter),
    staleTime: 1000 * 60 * 5,
    enabled: Boolean(greenAreaId),
  });
}

export function useRawEnvironment() {
  return useQuery({
    queryKey: cacheKey.environment.raw(),
    queryFn: () => Api.Environment.RawEnvironment(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProviders() {
  return useQuery({
    queryKey: cacheKey.environment.providers(),
    queryFn: () => Api.Environment.Provider(),
    staleTime: 1000 * 60 * 5,
  });
}

export function useProviderStatus() {
  return useQuery({
    queryKey: cacheKey.environment.providerStatus(),
    queryFn: () => Api.Environment.ProviderStatus(),
    staleTime: 1000 * 60 * 5,
  });
}
