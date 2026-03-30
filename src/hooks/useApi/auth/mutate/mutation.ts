import { useMutation } from '@tanstack/react-query';
import { deleteCookie, setCookie } from 'cookies-next';

import {
  APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
  APP_SESSION_COOKIE_KEY,
} from '@/configs/cookies.config';
import { useAppNameSpace } from '@/hooks/useAppNameSpace';
import Api from '@/services/props.service';
import { logout, setCurrentUser } from '@/stores/authSlice/authSlice';
import {
  PickForgotPassword,
  PickLogin,
  PickRegister,
  PickResetPassword,
  PickSendOtp,
  PickVerify,
} from '@/types/schema/auth.schema';
import { cacheKey } from '@/utils/cache';

export function useLogin() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickLogin) => Api.Auth.Login(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());
      return { previousSession };
    },
    onSuccess: (res) => {
      const token = res.data?.token;
      const role = res.data?.role;

      if (token) {
        setCookie(APP_SESSION_COOKIE_KEY, token, {
          maxAge: APP_REFRESH_TOKEN_COOKIE_EXPIRES_IN,
          path: '/',
        });
      }

      if (role) {
        setCookie('user_role', role, {
          maxAge: 60 * 60 * 24 * 7,
          path: '/',
        });
      }

      ns.dispatch(
        setCurrentUser({
          user: {
            token: token ?? '',
            role: role ?? 'USER',
          },
        } as any)
      );

      ns.queryClient.setQueryData(cacheKey.auth.session(), res);

      ns.alert.toast({
        title: ns.t('alerts.title.success'),
        message: ns.t('alerts.auth.login.success'),
        icon: 'success',
      });
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.login.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}

export function useRegister() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickRegister) => Api.Auth.Register(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());
      return { previousSession };
    },
    onSuccess: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.success'),
        message: ns.t('alerts.auth.register.success'),
        icon: 'success',
      });
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.register.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}

export function useLogout() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: () => Api.Auth.Logout(),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());

      ns.dispatch(logout());
      deleteCookie(APP_SESSION_COOKIE_KEY, { path: '/' });
      deleteCookie('user_role', { path: '/' });

      ns.queryClient.setQueryData(cacheKey.auth.session(), null);
      return { previousSession };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.logout.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}

export function useForgotPassword() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickForgotPassword) => Api.Auth.Forgot(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());
      return { previousSession };
    },
    onSuccess: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.success'),
        message: ns.t('alerts.auth.forgot.success'),
        icon: 'success',
      });
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.forgot.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}

export function useVerifyOtp() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickVerify) => Api.Auth.Verify(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());
      return { previousSession };
    },
    onSuccess: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.success'),
        message: ns.t('alerts.auth.verify.success'),
        icon: 'success',
      });
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.verify.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}

export function useResendOtp() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickSendOtp) => Api.Auth.Resend(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());
      return { previousSession };
    },
    onSuccess: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.success'),
        message: ns.t('alerts.auth.resend.success'),
        icon: 'success',
      });
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.resend.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}

export function useResetPassword() {
  const ns = useAppNameSpace();

  return useMutation({
    mutationFn: (payload: PickResetPassword) => Api.Auth.Reset(payload),
    onMutate: async () => {
      await ns.queryClient.cancelQueries({ queryKey: cacheKey.auth.session() });
      const previousSession = ns.queryClient.getQueryData(cacheKey.auth.session());
      return { previousSession };
    },
    onSuccess: () => {
      ns.alert.toast({
        title: ns.t('alerts.title.success'),
        message: ns.t('alerts.auth.reset.success'),
        icon: 'success',
      });
    },
    onError: (_err, _newData, context) => {
      if (context?.previousSession) {
        ns.queryClient.setQueryData(cacheKey.auth.session(), context.previousSession);
      }

      ns.alert.toast({
        title: ns.t('alerts.title.failed'),
        message: ns.t('alerts.auth.reset.failed'),
        icon: 'error',
      });
    },
    onSettled: () => {
      ns.queryClient.invalidateQueries({ queryKey: cacheKey.auth.session() });
    },
  });
}
