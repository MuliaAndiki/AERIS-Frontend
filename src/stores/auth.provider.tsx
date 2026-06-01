'use client';

import React, { useCallback, useMemo, useState } from 'react';

import { type AuthState,AuthStoreContext } from '@/stores/auth.store';
import type { userSchema } from '@/types/api';

const AUTH_STORAGE_KEY = 'aeris:auth-user';

function readPersistedUser(): userSchema | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as userSchema) : null;
  } catch {
    return null;
  }
}

function persistUser(user: userSchema | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // noop
  }
}

export function AuthStoreProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<userSchema | null>(() => readPersistedUser());

  const setCurrentUser = useCallback((user: userSchema | null) => {
    setCurrentUserState(user);
    persistUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUserState(null);
    persistUser(null);
  }, []);

  const value = useMemo(
    () => ({ currentUser, setCurrentUser, logout }),
    [currentUser, setCurrentUser, logout],
  );

  return <AuthStoreContext.Provider value={value}>{children}</AuthStoreContext.Provider>;
}
