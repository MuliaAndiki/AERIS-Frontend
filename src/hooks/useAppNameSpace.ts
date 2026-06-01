import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/auth.store';

import { useAlert } from './useAlert/costum-alert';
import { useTranslate } from './useTranslate';

export function useAppNameSpace() {
  const alert = useAlert();
  const queryClient = useQueryClient();
  const { t } = useTranslate();
  const router = useRouter();
  const authStore = useAuthStore();
  const pathname = usePathname();
  return { alert, queryClient, t, authStore, router, pathname };
}
