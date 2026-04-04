'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

type LoginMethod = 'email' | 'phone';

const LoginSection = () => {
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className={`${dmSans.className} min-h-screen overflow-hidden bg-[#f8f7f3] text-[#046667]`}>
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.96fr_1.14fr]">
        <div className="relative hidden min-h-screen overflow-hidden lg:block">
          <Image
            src="/images/auth/login-leaves.png"
            alt="Green leaves background"
            fill
            priority
            className="object-cover object-left"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.58)_0%,rgba(0,0,0,0.28)_55%,rgba(0,0,0,0.04)_100%)]" />
          <div className="absolute inset-y-0 right-0 w-[36px] bg-[#f8f7f3] shadow-[18px_0_35px_rgba(255,255,255,0.75)]" />
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
          <div className="absolute left-8 top-1/2 z-10 w-full max-w-[430px] -translate-y-1/2">
            <h1 className="text-[68px] font-bold tracking-[0.22em] text-white">WELCOME</h1>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center bg-[#f8f7f3] px-6 py-10 sm:px-10 lg:px-20 lg:py-12">
          <div className="absolute inset-y-0 left-0 w-10 bg-[#f8f7f3]" />
          <div className="absolute right-5 top-5 sm:right-8 sm:top-8 lg:right-10 lg:top-5">
            <Image
              src="/images/logo.png"
              alt="AERIS logo"
              width={84}
              height={84}
              priority
              className="h-14 w-14 object-contain sm:h-[74px] sm:w-[74px] lg:h-[86px] lg:w-[86px]"
            />
          </div>

          <div className="w-full max-w-[560px] pt-14 sm:pt-12 lg:max-w-[470px] lg:pt-0">
            <div className="mb-10 lg:mb-12">
              <h2 className="text-center text-[42px] font-bold tracking-[0.14em] text-[#046667] sm:text-[56px]">
                LOGIN
              </h2>
            </div>

            <div className="mb-8 flex justify-center gap-3 lg:mb-10">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`rounded-full px-5 py-2 text-sm font-bold tracking-[0.08em] transition ${
                  loginMethod === 'email'
                    ? 'bg-[#2a9388] text-white shadow-[0_14px_35px_rgba(42,147,136,0.24)]'
                    : 'border border-[#d8d8d8] bg-white/85 text-[#046667]'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`rounded-full px-5 py-2 text-sm font-bold tracking-[0.08em] transition ${
                  loginMethod === 'phone'
                    ? 'bg-[#2a9388] text-white shadow-[0_14px_35px_rgba(42,147,136,0.24)]'
                    : 'border border-[#d8d8d8] bg-white/85 text-[#046667]'
                }`}
              >
                Phone
              </button>
            </div>

            <form className="space-y-8 lg:space-y-9" noValidate>
              {loginMethod === 'email' ? (
                <label className="block">
                  <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Email</span>
                  <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                    <Mail className="h-[18px] w-[18px] text-[#97a3a5]" />
                    <input
                      type="email"
                      placeholder="AERIS@email.com"
                      className="w-full bg-transparent text-[15px] text-[#7c7c7c] outline-none placeholder:text-[#9e9e9e]"
                    />
                  </div>
                </label>
              ) : (
                <label className="block">
                  <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Phone</span>
                  <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                    <Phone className="h-[18px] w-[18px] text-[#97a3a5]" />
                    <input
                      type="tel"
                      placeholder="+62 81 - 2345 - 6789"
                      className="w-full bg-transparent text-[15px] text-[#7c7c7c] outline-none placeholder:text-[#9e9e9e]"
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Password</span>
                <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="*************"
                    className="w-full bg-transparent text-[15px] tracking-[0.18em] text-[#7c7c7c] outline-none placeholder:text-[#9e9e9e]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-[#8c8c8c] transition hover:text-[#046667]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <div className="pt-1 text-right">
                <Link
                  href="/forgotPassword"
                  className="text-sm font-medium text-[#7a7a7a] transition hover:text-[#046667]"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="flex justify-center pt-6 lg:pt-8">
                <button
                  type="submit"
                  className="min-w-[180px] rounded-full bg-[#2a9388] px-11 py-[15px] text-[26px] font-bold text-white shadow-[0_24px_54px_rgba(155,169,255,0.3)] transition hover:translate-y-[-1px] hover:bg-[#247d74]"
                >
                  LOGIN
                </button>
              </div>
            </form>

            <div className="mt-16 flex flex-col items-center justify-center gap-2 text-center text-[18px] text-[#6d6d6d] sm:flex-row sm:gap-3 lg:mt-18 lg:justify-between lg:px-1">
              <span>Don&apos;t have an Account?</span>
              <Link
                href="/register"
                className="font-bold uppercase tracking-[0.04em] text-[#2a9388] transition hover:text-[#046667]"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;