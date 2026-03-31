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

export interface EnvironmentHeatRiskData {
  state: string;
  city: string;
  country: string;
  feelsLike: number;
  heatScore: number;
  level: string;
  snapshotId: string;
}

export interface EnvironmentNoiseData {
  state: string;
  city: string;
  country: string;
  roadDensityIndex: number;
  estimatedNoiseLevel: number;
  majorRoadCount: number;
  noiseScore: number;
  snapshotId: string;
}

export interface EnvironmentGreenPark {
  id?: string;
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
  averageRating?: number;
  totalReviews?: number;
}

export interface EnvironmentGreenSpaceData {
  greenAreas?: EnvironmentGreenPark[];
  greenSpace: {
    parkData: EnvironmentGreenPark[];
  };
}

export interface EnvironmentGreenReviewUser {
  id: string;
  fullName: string;
  avaUrl: string | null;
}

export interface EnvironmentGreenReview {
  id: string;
  rating: number;
  greenAreaId: string;
  userId: string;
  comment: string;
  isFlagged?: boolean;
  isHidden?: boolean;
  flagReason?: string | null;
  createdAt: string;
  updatedAt?: string;
  user?: EnvironmentGreenReviewUser;
}

export type EnvironmentGreenReviewSort = 'latest' | 'top-rated';
export type EnvironmentGreenReviewFilter = 'visible' | 'all' | 'flagged';

export interface EnvironmentGreenReviewPagination {
  items: EnvironmentGreenReview[];
  page: number;
  limit: number;
  sort: EnvironmentGreenReviewSort;
  filter: EnvironmentGreenReviewFilter;
  totalData: number;
  totalPages: number;
}

export interface EnvironmentGreenAreaDetail {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
  averageRating: number;
  totalReviews: number;
}

export interface EnvironmentCreateReviewPayload {
  greenAreaId: string;
  rating: number;
  comment: string;
}

export interface EnvironmentUpdateReviewPayload {
  rating?: number;
  comment?: string;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface EnvironmentModerateReviewPayload {
  isHidden?: boolean;
  isFlagged?: boolean;
  flagReason?: string;
}

export interface EnvironmentAirQualityData {
  airQuality: Record<string, unknown>;
}

export type EnvironmentAirQualityResponse = ApiResponse<EnvironmentAirQualityData>;
export type EnvironmentWeatherResponse = ApiResponse<EnvironmentWeatherData>;
export type EnvironmentDisasterRiskResponse = ApiResponse<EnvironmentDisasterRiskData>;
export type EnvironmentHeatRiskResponse = ApiResponse<EnvironmentHeatRiskData>;
export type EnvironmentNoiseResponse = ApiResponse<EnvironmentNoiseData>;
export type EnvironmentGreenSpaceResponse = ApiResponse<EnvironmentGreenSpaceData>;
export type EnvironmentGreenAreaDetailResponse = ApiResponse<EnvironmentGreenAreaDetail>;
export type EnvironmentGreenReviewListResponse = ApiResponse<EnvironmentGreenReviewPagination>;
export type EnvironmentGreenReviewCreateResponse = ApiResponse<EnvironmentGreenReview>;
export type EnvironmentGreenReviewUpdateResponse = ApiResponse<EnvironmentGreenReview>;
export type EnvironmentGreenReviewModerateResponse = ApiResponse<EnvironmentGreenReview>;
export type EnvironmentGreenReviewDeleteResponse = ApiResponse<null>;
export type EnvironmentRawResponse = ApiResponse<EnvironmentalSnapshot>;
export type EnvironmentProviderResponse = ApiResponse<EnvironmentProvider[]>;
export type EnvironmentProviderStatusResponse = ApiResponse<EnvironmentProviderStatus[]>;
