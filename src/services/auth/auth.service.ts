import AxiosClient from '@/utils/axios.client';
import { TResponse } from '@/pkg/react-query/mutation-wrapper.type';
import {
  PickForgotPassword,
  PickLogin,
  PickRegister,
  PickResetPassword,
  PickSendOtp,
  PickVerify,
} from '@/types/schema/auth.schema';

class AuthApi {
  async Login(payload: PickLogin): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/login', payload);
    return res.data;
  }
  async Register(payload: PickRegister): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/register', payload);
    return res.data;
  }
  async Logout(): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/logout');
    return res.data;
  }
  async Forgot(payload: PickForgotPassword): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/forgot', payload);
    return res.data;
  }
  async Verify(payload: PickVerify): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/verifyOtp', payload);
    return res.data;
  }
  async Resend(payload: PickSendOtp): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/resend', payload);
    return res.data;
  }
  async Reset(payload: PickResetPassword): Promise<TResponse<any>> {
    const res = await AxiosClient.post('/api/auth/reset-password', payload);
    return res.data;
  }
}

export default new AuthApi();
