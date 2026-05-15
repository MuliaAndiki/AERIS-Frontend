'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { usePathname, useRouter } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { APP_SESSION_COOKIE_KEY } from '@/configs/cookies.config';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, setCurrentUser } = useAuthStore();

  React.useEffect(() => {
    if (!currentUser?.user?.token) {
      const token = getCookie(APP_SESSION_COOKIE_KEY);
      if (token) {
        setCurrentUser({ user: { token } } as any);
      }
    }
  }, [currentUser, setCurrentUser]);

  React.useEffect(() => {
    const isAuthPage =
      pathname?.startsWith('/login') ||
      pathname?.startsWith('/register') ||
      pathname?.startsWith('/home') ||
      pathname?.startsWith('/forgotPassword') ||
      pathname?.startsWith('/reset') || pathname?.startsWith('/otp');


    const isAuthenticated = Boolean(currentUser?.user?.token);

    if (!isAuthenticated && !isAuthPage) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isAuthPage) {
      // setUp
      // router.replace('/home');
      return;
    }
  }, [pathname, currentUser, router]);

  return <>{children}</>;
}
