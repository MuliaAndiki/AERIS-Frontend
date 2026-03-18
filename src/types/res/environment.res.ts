import { ApiResponse } from '@/types/res/base.res';
import { EnvironmentalSnapshot } from '@/types/res/snapshot.res';

export interface EnvironmentProvider {
  id: string;
  name: string;
  providerType: string;
  baseUrl: string;
}

export interface EnvironmentProviderStatus extends EnvironmentProvider {
  status: string;
  lastFetchTime: string | null;
}

export interface EnvironmentWeatherData {
  state: string;
  city: string;
  country: string;
  [key: string]: unknown;
}

export interface EnvironmentDisasterRiskData {
  floodScore: number;
  heatScore: number;
}

export interface EnvironmentGreenPark {
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
}

export interface EnvironmentGreenSpaceData {
  greenSpace: {
    parkData: EnvironmentGreenPark[];
  };
}

export interface EnvironmentAirQualityData {
  airQuality: Record<string, unknown>;
}

export type EnvironmentAirQualityResponse = ApiResponse<EnvironmentAirQualityData>;
export type EnvironmentWeatherResponse = ApiResponse<EnvironmentWeatherData>;
export type EnvironmentDisasterRiskResponse = ApiResponse<EnvironmentDisasterRiskData>;
export type EnvironmentGreenSpaceResponse = ApiResponse<EnvironmentGreenSpaceData>;
export type EnvironmentRawResponse = ApiResponse<EnvironmentalSnapshot>;
export type EnvironmentProviderResponse = ApiResponse<EnvironmentProvider[]>;
export type EnvironmentProviderStatusResponse = ApiResponse<EnvironmentProviderStatus[]>;
