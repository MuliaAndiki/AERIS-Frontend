import {
  useForgotPassword,
  useLogin,
  useLogout,
  useRegister,
  useResendOtp,
  useResetPassword,
  useVerifyOtp,
} from './mutate/mutation';
import { useAuthSessionQuery } from './query/query';

export function useAuthApi() {
  return {
    mutation: {
      login: useLogin,
      register: useRegister,
      logout: useLogout,
      forgot: useForgotPassword,
      verify: useVerifyOtp,
      resend: useResendOtp,
      reset: useResetPassword,
    },
    query: {
      session: useAuthSessionQuery,
    },
  };
}
