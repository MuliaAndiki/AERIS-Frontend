import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import UserApi, { type EditProfilePayload } from '@/services/user/user.service';
import { cacheKey } from '@/utils/cache';

export function useGetMe() {
  return useQuery({
    queryKey: cacheKey.user.me(),
    queryFn: () => UserApi.GetMe(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
}

export function useEditProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EditProfilePayload) => UserApi.EditProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cacheKey.user.me() });
    },
  });
}
