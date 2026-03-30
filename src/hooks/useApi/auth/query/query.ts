import { useQuery } from '@tanstack/react-query';
import { getCookie } from 'cookies-next';

import { APP_SESSION_COOKIE_KEY } from '@/configs/cookies.config';
import { cacheKey } from '@/utils/cache';

export function useAuthSessionQuery() {
  return useQuery({
    queryKey: cacheKey.auth.session(),
    queryFn: async () => {
      const token = getCookie(APP_SESSION_COOKIE_KEY);
      return token ? String(token) : null;
    },
    staleTime: 1000 * 60 * 5,
  });
}
