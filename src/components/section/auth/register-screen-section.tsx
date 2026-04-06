'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { ArrowRight, Eye, EyeOff, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/classname';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

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
      <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#59aab0]">
        {label}
      </span>
      <div
        className={cn(
          'flex items-center gap-2.5 border-b border-[#d6d0c8] pb-2.5 transition-colors',
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

const RegisterSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('USER');
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
            <h1 className="mb-1 text-[58px] font-bold leading-none tracking-[0.1em] text-[#046667]">Register</h1>
            <p className="mb-8 text-[13px] tracking-[0.06em] text-[#8ea4a5]">Create your AERIS account</p>

            <div className="mb-7 flex items-center gap-1.5">
              <span className="h-1.5 w-[22px] rounded-sm bg-[#046667]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#046667]/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-[#046667]/20" />
            </div>

            <form noValidate>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <AuthField label="Full Name" icon={<User className="h-3.5 w-3.5" />} focused={focusedField === 'name'}>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full min-w-0 bg-transparent text-sm text-[#3a4a4b] outline-none placeholder:text-[#b5c4c5]"
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </AuthField>
                </div>

                <AuthField label="Email" icon={<Mail className="h-3.5 w-3.5" />} focused={focusedField === 'email'}>
                  <input
                    type="email"
                    placeholder="name@email.com"
                    className="w-full min-w-0 bg-transparent text-sm text-[#3a4a4b] outline-none placeholder:text-[#b5c4c5]"
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </AuthField>

                <AuthField label="Phone" icon={<Phone className="h-3.5 w-3.5" />} focused={focusedField === 'phone'}>
                  <input
                    type="tel"
                    placeholder="+62 81 ..."
                    className="w-full min-w-0 bg-transparent text-sm text-[#3a4a4b] outline-none placeholder:text-[#b5c4c5]"
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                  />
                </AuthField>

                <div className="sm:col-span-2">
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
                        {showPassword ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
                      </button>
                    }
                  >
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      className={cn(
                        'w-full min-w-0 bg-transparent text-sm text-[#3a4a4b] outline-none placeholder:text-[#b5c4c5]',
                        !showPassword && 'tracking-[0.12em]'
                      )}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </AuthField>
                </div>

                <div className="sm:col-span-2">
                  <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.15em] text-[#59aab0]">
                    Role
                  </span>
                  <div className="flex gap-2">
                    {['USER', 'ADMIN'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setRole(item)}
                        className={cn(
                          'rounded-full border px-4 py-1.5 text-[11px] font-semibold tracking-[0.1em] transition-all',
                          role === item
                            ? 'border-[#046667] bg-[#04666714] text-[#046667]'
                            : 'border-[#0466672e] text-[#7a9a9b]'
                        )}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-[#046667] px-9 py-3 text-[13px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_10px_28px_rgba(4,102,103,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#035657] hover:shadow-[0_16px_38px_rgba(4,102,103,0.34)]"
                >
                  Create Account
                  <ArrowRight className="h-[14px] w-[14px]" />
                </button>
              </div>

              <p className="mt-4 text-[11px] leading-6 text-[#a0b0b1]">
                By registering, you agree to AERIS&apos;s{' '}
                <a href="#" className="font-semibold text-[#046667]">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-semibold text-[#046667]">
                  Privacy Policy
                </a>
                .
              </p>
            </form>

            <div className="mt-6 flex items-center justify-between border-t border-[#0466671a] pt-5">
              <span className="text-[13px] text-[#90a2a3]">Already have an account?</span>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#046667] transition-all hover:gap-2.5 hover:text-[#2a9388]"
              >
                Sign in
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <div className="absolute bottom-6 left-10 flex items-center gap-2 opacity-25">
            <div className="h-px w-6 bg-[#046667]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-[#046667]">AERIS 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
