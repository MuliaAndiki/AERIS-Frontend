'use client';

import { createContext, useContext } from 'react';

import type { userSchema } from '@/types/api';

/* ─── Auth Store (React Context-based, no Redux) ─── */

export interface AuthState {
  currentUser: userSchema | null;
}

export interface AuthActions {
  setCurrentUser: (user: userSchema | null) => void;
  logout: () => void;
}

export type AuthStore = AuthState & AuthActions;

export const AuthStoreContext = createContext<AuthStore | null>(null);

export function useAuthStore(): AuthStore {
  const ctx = useContext(AuthStoreContext);
  if (!ctx) {
    throw new Error('useAuthStore must be used within an AuthStoreProvider');
  }
  return ctx;
}
