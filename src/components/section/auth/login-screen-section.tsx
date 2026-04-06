import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Phone, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { LoginForm } from '@/types/form/auth';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { themeConfig } from '@/configs/theme.config';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
});

interface LoginSectionProps {
  state: {
    formLogin: LoginForm;
    setFormLogin: React.Dispatch<React.SetStateAction<LoginForm>>;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
  service: {
    mutate: {
      onLogin: (event?: FormEvent<HTMLFormElement>) => void;
      isPending: boolean;
    };
  };
}

type LoginMethod = 'email' | 'phone';

const LoginSection: React.FC<LoginSectionProps> = ({ state, service }) => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const theme = themeConfig.light;

  return (
    <section
      className={`
        ${outfit.variable} ${cormorant.variable}
        font-[family-name:var(--font-outfit)]
        min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]
        overflow-hidden
      `}
      style={{ backgroundColor: theme.background }}
    >
      {/* ══ LEFT: daun panel ══ */}
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          alt="daun"
          src="/req/daun.png"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center"
        />

        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              'linear-gradient(105deg,rgba(4,28,28,0.70) 0%,rgba(4,40,40,0.40) 50%,rgba(4,40,40,0.06) 100%)',
          }}
        />

        {/* Soft right-edge bleed */}
        <div
          className="absolute inset-y-0 right-0 w-14 z-[2]"
          style={{ background: `linear-gradient(to right, transparent, ${theme.background})` }}
        />

        {/* Vertical dashed accent */}
        <div
          className="absolute top-[14%] right-[68px] w-px h-[66%] z-[3]"
          style={{
            background:
              'repeating-linear-gradient(to bottom,rgba(89,170,176,0.28) 0px,rgba(89,170,176,0.28) 4px,transparent 4px,transparent 12px)',
          }}
        />

        {/* Welcome text */}
        <div
          className="
            absolute bottom-[15%] left-12 z-[4]
            font-[family-name:var(--font-cormorant)]
            text-[clamp(52px,5.5vw,82px)] font-light
            text-white/90 tracking-[0.3em] uppercase leading-none
          "
        >
          <span
            className="
              block font-bold text-[0.41em] tracking-[0.58em]
              mb-2
              font-[family-name:var(--font-outfit)]
            "
            style={{ color: `${theme.primary.background}99` }}
          >
            AERIS
          </span>
          Welcome
        </div>

        {/* Divider */}
        <div
          className="absolute bottom-[calc(15%+8px)] left-12 w-11 h-[1.5px] z-[4]"
          style={{ backgroundColor: `${theme.primary.background}80` }}
        />

        {/* Tagline */}
        <p className="absolute bottom-[calc(15%-50px)] left-[50px] z-[4] text-white/35 text-[12.5px] tracking-[0.14em] font-light">
          Your environment. Your control.
        </p>
      </div>

      {/* ══ RIGHT: form panel ══ */}
      <div
        className="relative flex items-center justify-center px-6 py-10 sm:px-10 lg:px-14 overflow-hidden"
        style={{ backgroundColor: theme.background }}
      >
        {/* Decorative radial blobs */}
        <div
          className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(4,102,103,0.07) 0%,transparent 70%)' }}
        />
        <div
          className="absolute -bottom-36 -left-20 w-[360px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(42,147,136,0.05) 0%,transparent 70%)' }}
        />

        {/* Logo */}
        <div className="absolute top-6 right-8 z-10">
          <Image
            src="/images/logo.png"
            alt="AERIS"
            width={60}
            height={60}
            priority
            className="object-contain"
          />
        </div>

        {/* ── Form container ── */}
        <div className="relative w-full max-w-[400px] pt-14 lg:pt-0">
          {/* Heading */}
          <h1
            className="
              font-[family-name:var(--font-cormorant)]
              text-[60px] font-bold
              tracking-[0.1em] leading-none mb-1
            "
            style={{ color: theme.primary.background }}
          >
            Login
          </h1>
          <p
            className="text-[12.5px] tracking-[0.06em] mb-7"
            style={{ color: theme.muted.foreground }}
          >
            Sign in to your AERIS account
          </p>

          {/* Email / Phone toggle */}
          <div
            className="flex rounded-full p-[3px] mb-7 w-fit"
            style={{ backgroundColor: `${theme.primary.background}14` }}
          >
            {(['email', 'phone'] as LoginMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setLoginMethod(m)}
                className="flex items-center gap-[7px] rounded-full px-[22px] py-2 text-[12.5px] font-semibold tracking-[0.07em] capitalize transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: loginMethod === m ? theme.primary.background : 'transparent',
                  color: loginMethod === m ? theme.primary.foreground : theme.secondary.foreground,
                  boxShadow:
                    loginMethod === m ? `0_5px_18px_${theme.primary.background}48` : 'none',
                }}
              >
                {m === 'email' ? <Mail size={12} /> : <Phone size={12} />}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <form noValidate onSubmit={service.mutate.onLogin}>
            {/* ── Identifier ── */}
            <div className="mb-[22px]">
              <Label
                className="block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
                style={{ color: theme.primary.background }}
              >
                {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </Label>
              <div
                className="flex items-center gap-[11px] border-b-[1.5px] pb-[9px] transition-colors duration-200"
                style={{
                  borderBottomColor:
                    focusedField === 'id' ? theme.primary.background : theme.border,
                }}
              >
                {loginMethod === 'email' ? (
                  <Mail
                    size={15}
                    className="shrink-0 transition-colors duration-200"
                    style={{
                      color:
                        focusedField === 'id' ? theme.primary.background : theme.muted.foreground,
                    }}
                  />
                ) : (
                  <Phone
                    size={15}
                    className="shrink-0 transition-colors duration-200"
                    style={{
                      color:
                        focusedField === 'id' ? theme.primary.background : theme.muted.foreground,
                    }}
                  />
                )}
                <Input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  placeholder={loginMethod === 'email' ? 'name@email.com' : '+62 81 - 2345 - 6789'}
                  value={state.formLogin.idenfier}
                  onChange={(e) =>
                    state.setFormLogin((prev) => ({ ...prev, idenfier: e.target.value }))
                  }
                  onFocus={() => setFocusedField('id')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-gray-400 placeholder:opacity-100"
                  style={
                    {
                      color: theme.foreground,
                
                    } as any
                  }
                />
              </div>
            </div>

            {/* ── Password ── */}
            <div className="mb-[6px]">
              <Label
                className="block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
                style={{ color: theme.primary.background }}
              >
                Password
              </Label>
              <div
                className="flex items-center gap-[11px] border-b-[1.5px] pb-[9px] transition-colors duration-200"
                style={{
                  borderBottomColor:
                    focusedField === 'pw' ? theme.primary.background : theme.border,
                }}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-[15px] h-[15px] shrink-0 transition-colors duration-200"
                  style={{
                    color:
                      focusedField === 'pw' ? theme.primary.background : theme.muted.foreground,
                  }}
                >
                  <rect
                    x="2"
                    y="7"
                    width="12"
                    height="8"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M5 7V5a3 3 0 016 0v2"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <circle cx="8" cy="11" r="1.2" fill="currentColor" />
                </svg>
                <Input
                  type={state.visible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={state.formLogin.password}
                  onChange={(e) =>
                    state.setFormLogin((prev) => ({ ...prev, password: e.target.value }))
                  }
                  onFocus={() => setFocusedField('pw')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-gray-400 placeholder:opacity-100"
                  style={{
                    color: theme.foreground,
                    letterSpacing: state.visible ? '0' : '0.14em',
                  }}
                />
                <button
                  type="button"
                  onClick={() => state.setVisible((prev) => !prev)}
                  aria-label={state.visible ? 'Hide password' : 'Show password'}
                  className="transition-colors duration-200 flex items-center"
                  style={{
                    color: theme.muted.foreground,
                  }}
                >
                  {state.visible ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mb-7">
              <Link
                href="/forgotPassword"
                className="text-[11.5px] transition-colors duration-200 tracking-[0.04em]"
                style={{
                  color: theme.muted.foreground,
                }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={service.mutate.isPending}
              className="flex items-center gap-[9px] rounded-full px-9 py-[13px] text-[13px] font-bold tracking-[0.13em] uppercase transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: theme.primary.background,
                color: theme.primary.foreground,
                boxShadow: `0_10px_28px_${theme.primary.background}48`,
              }}
            >
              {service.mutate.isPending ? (
                <>
                  <span className="w-[14px] h-[14px] rounded-full border-2 border-white/35 border-t-white animate-spin shrink-0" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </Button>
          </form>

          {/* OR divider */}
          <div className="flex items-center gap-3 my-[18px]">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: `${theme.primary.background}1a` }}
            />
            <span
              className="text-[10px] tracking-[0.1em] uppercase"
              style={{ color: theme.muted.foreground }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: `${theme.primary.background}1a` }}
            />
          </div>

          {/* GitHub OAuth */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-[9px] border-[1.5px] rounded-full py-[10px] px-5 text-[12px] font-medium tracking-[0.05em] transition-all duration-200"
            style={{
              borderColor: `${theme.primary.background}28`,
              color: theme.muted.foreground,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[14px] h-[14px] shrink-0">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            Continue with GitHub
          </button>

          {/* Register strip */}
          <div
            className="mt-[22px] pt-5 border-t flex items-center justify-between"
            style={{ borderTopColor: `${theme.primary.background}1a` }}
          >
            <span className="text-[13px]" style={{ color: theme.muted.foreground }}>
              Don&apos;t have an account?
            </span>
            <Link
              href="/register"
              className="flex items-center gap-[5px] hover:gap-[9px] text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-200"
              style={{ color: theme.primary.background }}
            >
              Register <ArrowRight size={12} />
            </Link>
          </div>

          {/* Footer mark */}
          <div className="absolute bottom-5 left-0 flex items-center gap-[7px] opacity-20">
            <div className="w-[22px] h-px" style={{ backgroundColor: theme.primary.background }} />
            <span
              className="text-[9px] tracking-[0.2em] uppercase"
              style={{ color: theme.primary.background }}
            >
              AERIS &copy; 2025
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
