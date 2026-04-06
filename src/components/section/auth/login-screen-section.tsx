'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { ArrowRight, Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/classname';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

type LoginMethod = 'email' | 'phone';

type FieldProps = {
  label: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  focused?: boolean;
  children: React.ReactNode;
};

function AuthField({ label, icon, trailing, focused, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#59aab0]">
        {label}
      </span>
      <div
        className={cn(
          'flex items-center gap-3 border-b border-[#d6d0c8] pb-3 transition-colors',
          focused && 'border-[#046667]'
        )}
      >
        {icon ? <span className={cn('text-[#a8b8b9]', focused && 'text-[#046667]')}>{icon}</span> : null}
        {children}
        {trailing}
      </div>
    </label>
  );
}

function AuthHero() {
  return (
    <div className="relative hidden min-h-screen overflow-hidden bg-[#071a1a] lg:block">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_30%_40%,rgba(4,102,103,0.45)_0%,transparent_60%),radial-gradient(ellipse_60%_80%_at_80%_80%,rgba(42,147,136,0.18)_0%,transparent_55%)]" />
      <Image src="/images/auth/login-leaves.png" alt="Leaves background" fill priority className="object-cover opacity-70" />

      <Image
        src="/images/auth/leaves3.png"
        alt=""
        width={260}
        height={220}
        className="pointer-events-none absolute right-[-22px] top-[-30px] z-20 h-auto w-[235px] drop-shadow-[0_16px_14px_rgba(0,0,0,0.34)]"
      />
      <Image
        src="/images/auth/leaves2.png"
        alt=""
        width={270}
        height={240}
        className="pointer-events-none absolute right-[-18px] top-[48px] z-20 h-auto w-[250px] rotate-[2deg] drop-shadow-[0_16px_14px_rgba(0,0,0,0.3)]"
      />
      <Image
        src="/images/auth/leaves1.png"
        alt=""
        width={320}
        height={220}
        className="pointer-events-none absolute bottom-[-18px] right-[-46px] z-20 h-auto w-[325px] rotate-[-7deg] drop-shadow-[0_18px_14px_rgba(0,0,0,0.28)]"
      />

      <div className="absolute inset-y-0 right-0 w-9 bg-[#f5f3ee] shadow-[18px_0_35px_rgba(255,255,255,0.75)]" />
      <div className="absolute bottom-[15%] left-12 z-10">
        <div className="mb-3 h-[1.5px] w-12 bg-[#59aab080]" />
        <p className="mb-2 text-[13px] font-light tracking-[0.12em] text-white/40">Your environment. Your control.</p>
        <h2 className="text-[clamp(52px,6vw,88px)] font-light uppercase leading-none tracking-[0.3em] text-white/92">
          <span className="mb-2 block text-[0.42em] font-bold tracking-[0.55em] text-[#59aab0]">AERIS</span>
          Welcome
        </h2>
      </div>
    </div>
  );
}

const LoginSection = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  return (
    <section className={cn(dmSans.className, 'min-h-screen overflow-hidden bg-[#0b2626]')}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <AuthHero />

        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f3ee] px-6 py-12 sm:px-10 lg:px-14">
          <div className="pointer-events-none absolute -right-44 -top-44 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(4,102,103,0.07)_0%,transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(42,147,136,0.06)_0%,transparent_70%)]" />

          <div className="absolute right-9 top-7">
            <Image
              src="/images/logo.png"
              alt="AERIS"
              width={72}
              height={72}
              priority
              className="h-16 w-16 object-contain"
            />
          </div>

          <div className="w-full max-w-[400px]">
            <h1 className="mb-1 text-[62px] font-bold leading-none tracking-[0.1em] text-[#046667]">Login</h1>
            <p className="mb-9 text-[13px] tracking-[0.06em] text-[#8ea4a5]">Sign in to your AERIS account</p>

            <div className="mb-9 inline-flex rounded-full bg-[#04666712] p-1">
              {[
                { key: 'email' as const, label: 'Email', icon: <Mail className="h-[13px] w-[13px]" /> },
                { key: 'phone' as const, label: 'Phone', icon: <Phone className="h-[13px] w-[13px]" /> },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLoginMethod(item.key)}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-6 py-2 text-[13px] font-semibold tracking-[0.07em] transition-all',
                    loginMethod === item.key
                      ? 'bg-[#046667] text-white shadow-[0_6px_20px_rgba(4,102,103,0.3)]'
                      : 'text-[#6b8e8f]'
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>

            <form noValidate>
              <div className="space-y-6">
                <AuthField
                  label={loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
                  icon={
                    loginMethod === 'email' ? (
                      <Mail className="h-4 w-4" />
                    ) : (
                      <Phone className="h-4 w-4" />
                    )
                  }
                  focused={focusedField === 'identity'}
                >
                  <input
                    type={loginMethod === 'email' ? 'email' : 'tel'}
                    placeholder={loginMethod === 'email' ? 'name@email.com' : '+62 81 - 2345 - 6789'}
                    className="w-full bg-transparent text-[15px] text-[#3a4a4b] outline-none placeholder:text-[#b0babb]"
                    onFocus={() => setFocusedField('identity')}
                    onBlur={() => setFocusedField(null)}
                  />
                </AuthField>

                <div>
                  <AuthField
                    label="Password"
                    focused={focusedField === 'password'}
                    trailing={
                      <button
                        type="button"
                        className="text-[#a8b8b9] transition-colors hover:text-[#046667]"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-[17px] w-[17px]" /> : <Eye className="h-[17px] w-[17px]" />}
                      </button>
                    }
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={cn(
                        'w-full bg-transparent text-[15px] text-[#3a4a4b] outline-none placeholder:text-[#b0babb]',
                        !showPassword && 'tracking-[0.14em]'
                      )}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </AuthField>

                  <Link
                    href="/forgotPassword"
                    className="mt-2 block text-right text-xs tracking-[0.04em] text-[#94a7a8] transition-colors hover:text-[#046667]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="mt-10 flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#046667] px-10 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_32px_rgba(4,102,103,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#035657] hover:shadow-[0_18px_40px_rgba(4,102,103,0.36)]"
                >
                  Sign In
                  <ArrowRight className="h-[15px] w-[15px]" />
                </button>
              </div>
            </form>

            <div className="mt-12 flex items-center justify-between border-t border-[#0466671a] pt-7">
              <span className="text-sm text-[#90a2a3]">Don&apos;t have an account?</span>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-[0.1em] text-[#046667] transition-all hover:gap-2.5 hover:text-[#2a9388]"
              >
                Register
                <ArrowRight className="h-[13px] w-[13px]" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-8 left-10 flex items-center gap-2 opacity-30">
            <div className="h-px w-7 bg-[#046667]" />
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#046667]">AERIS 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
