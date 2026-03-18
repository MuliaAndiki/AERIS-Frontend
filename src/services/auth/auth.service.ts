import AxiosClient from '@/utils/axios.client';
import {
  PickForgotPassword,
  PickLogin,
  PickRegister,
  PickResetPassword,
  PickSendOtp,
  PickVerify,
} from '@/types/schema/auth.schema';
import {
  ForgotResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResendOtpResponse,
  ResetPasswordResponse,
  VerifyOtpResponse,
} from '@/types/res/auth.res';

class AuthApi {
  async Login(payload: PickLogin): Promise<LoginResponse> {
    const res = await AxiosClient.post('/api/auth/login', payload);
    return res.data;
  }
  async Register(payload: PickRegister): Promise<RegisterResponse> {
    const res = await AxiosClient.post('/api/auth/register', payload);
    return res.data;
  }
  async Logout(): Promise<LogoutResponse> {
    const res = await AxiosClient.post('/api/auth/logout');
    return res.data;
  }
  async Forgot(payload: PickForgotPassword): Promise<ForgotResponse> {
    const res = await AxiosClient.post('/api/auth/forgot', payload);
    return res.data;
  }
  async Verify(payload: PickVerify): Promise<VerifyOtpResponse> {
    const res = await AxiosClient.post('/api/auth/verifyOtp', payload);
    return res.data;
  }
  async Resend(payload: PickSendOtp): Promise<ResendOtpResponse> {
    const res = await AxiosClient.post('/api/auth/resend', payload);
    return res.data;
  }
  async Reset(payload: PickResetPassword): Promise<ResetPasswordResponse> {
    const res = await AxiosClient.post('/api/auth/reset-password', payload);
    return res.data;
  }
}

export default new AuthApi();
