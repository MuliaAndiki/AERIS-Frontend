import { RoleType } from '@/types/partial/schema.partial';
import { ApiResponse } from '@/types/res/base.res';

export interface AuthUser {
  id: string;
  email: string | null;
  phone: string | null;
  fullName: string;
  role: RoleType;
  isVerify: boolean;
  avaUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData extends AuthUser {
  token: string;
}

export type LoginResponse = ApiResponse<LoginData>;
export type RegisterResponse = ApiResponse<AuthUser>;
export type ForgotResponse = ApiResponse<AuthUser | null>;
export type VerifyOtpResponse = ApiResponse<AuthUser>;
export type ResendOtpResponse = ApiResponse<AuthUser>;
export type ResetPasswordResponse = ApiResponse<AuthUser>;
export type LogoutResponse = ApiResponse<null>;
