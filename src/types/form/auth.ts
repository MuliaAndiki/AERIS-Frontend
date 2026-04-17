interface AuthForm {
  idenfier: string;
  password: string;
  fullname: string;
  otp: string;
  confirmPassword: string;
  role: string;
}

export type LoginForm = Pick<AuthForm, 'idenfier' | 'password'>;
export type RegisterForm = Pick<AuthForm, 'idenfier' | 'password' | 'fullname' | 'role'>;
export type ForgotPasswordForm = Pick<AuthForm, 'idenfier'>;
export type OtpForm = Pick<AuthForm, 'otp'>;
export type ResetPasswordForm = Pick<AuthForm, 'password' | 'confirmPassword'>;
