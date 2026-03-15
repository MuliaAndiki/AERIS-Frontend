import { RoleType } from '../partial/schema.partial';

export interface Auth {
  id: string;
  email: string;
  fullName: string;
  identifikasi: string;
  password: string;
  phone: string;
  token?: string;
  role: RoleType;
  avaUrl: string;
  createdAt: Date;
  updatedAt: Date;
  otp?: string;
  expOtp?: Date;
  isVerify?: boolean;
  activateToken?: string;
  activateExp?: string;
  sessionId: string;
}

export type JwtPayload = Pick<Auth, 'id' | 'role' | 'sessionId'>;
export type PickRegister = Pick<Auth, 'fullName' | 'password' | 'role' | 'identifikasi'>;
export type PickLogin = Pick<Auth, 'password' | 'identifikasi' | 'id'>;
export type PickID = Pick<Auth, 'id'>;
export type PickForgotPassword = Pick<Auth, 'identifikasi'>;
export type PickVerify = Pick<Auth, 'email' | 'otp'>;
export type PickSendOtp = Pick<Auth, 'email'>;
export type PickResetPassword = Pick<Auth, 'email' | 'password' | 'phone'>;
export type PickUpdateProfile = Pick<Auth, 'email' | 'fullName' | 'avaUrl' | 'phone'>;
export type PickUpdatePassword = Pick<Auth, 'password'>;
export type PickActiveAccount = Pick<Auth, 'activateToken' | 'password'>;
export type PickLoginAllReady = Pick<Auth, 'token'>;
