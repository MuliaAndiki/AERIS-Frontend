import type { AuthUser } from '@/types/res/auth.res';
import type { ApiResponse } from '@/types/res/base.res';
import AxiosClient from '@/utils/axios.client';

export interface UserProfile extends AuthUser {
  latestLocation: {
    id: string;
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
    radius: number;
    createdAt: string;
  } | null;
}

export interface EditProfilePayload {
  fullName?: string;
  email?: string;
  phone?: string;
  avaUrl?: string;
}

export type UserProfileResponse = ApiResponse<UserProfile>;
export type EditProfileResponse = ApiResponse<AuthUser>;

class UserApi {
  async GetMe(): Promise<UserProfileResponse> {
    const res = await AxiosClient.get('/api/user/me');
    return res.data;
  }

  async EditProfile(payload: EditProfilePayload): Promise<EditProfileResponse> {
    const res = await AxiosClient.put('/api/user/edit-profile', payload);
    return res.data;
  }
}

export default new UserApi();
