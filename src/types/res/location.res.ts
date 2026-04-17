import { ApiResponse } from '@/types/res/base.res';

export interface DetectLocationData {
  ipAddress: string;
  userAgent: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
}

export interface ResolvedLocation {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  radius: number;
  createdAt: string;
}

export interface SearchLocation {
  name: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
}

export type DetectLocationResponse = ApiResponse<DetectLocationData>;
export type ResolveLocationResponse = ApiResponse<ResolvedLocation>;
export type LocationSearchResponse = ApiResponse<SearchLocation[]>;
