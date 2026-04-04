'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DM_Sans } from 'next/font/google';
import { ChevronDown, Eye, EyeOff, Mail, Phone, User } from 'lucide-react';
import { useState } from 'react';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

const RegisterSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('USER');

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
              <h2 className="text-center text-[38px] font-bold tracking-[0.14em] text-[#046667] sm:text-[50px]">
                REGISTER
              </h2>
            </div>

            <form className="space-y-7 lg:space-y-8" noValidate>
              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">FullName</span>
                <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                  <User className="h-[18px] w-[18px] text-[#97a3a5]" />
                  <input
                    type="text"
                    placeholder="Ambayan"
                    className="w-full bg-transparent text-[15px] text-[#7c7c7c] outline-none placeholder:text-[#7c7c7c]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Password</span>
                <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Ambayan123"
                    className="w-full bg-transparent text-[15px] text-[#7c7c7c] outline-none placeholder:text-[#7c7c7c]"
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

              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Email</span>
                <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                  <Mail className="h-[18px] w-[18px] text-[#97a3a5]" />
                  <input
                    type="email"
                    placeholder="AERIS@email.com"
                    className="w-full bg-transparent text-[15px] text-[#7c7c7c] outline-none placeholder:text-[#7c7c7c]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Phone</span>
                <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                  <Phone className="h-[18px] w-[18px] text-[#97a3a5]" />
                  <input
                    type="tel"
                    placeholder="+62 81 - 2345 - 6789"
                    className="w-full bg-transparent text-[15px] text-[#7c7c7c] outline-none placeholder:text-[#7c7c7c]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[15px] font-medium text-[#59aab0]">Role</span>
                <div className="flex items-center gap-3 border-b border-[#c9c9c9] pb-3">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full appearance-none bg-transparent text-[28px] font-bold text-[#2a9388] outline-none"
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                  <ChevronDown className="h-5 w-5 text-[#8c8c8c]" />
                </div>
              </label>

              <div className="flex justify-center pt-5 lg:pt-7">
                <button
                  type="submit"
                  className="min-w-[170px] rounded-full bg-[#2a9388] px-10 py-[14px] text-[20px] font-bold text-white shadow-[0_24px_54px_rgba(155,169,255,0.3)] transition hover:translate-y-[-1px] hover:bg-[#247d74]"
                >
                  SIGN UP
                </button>
              </div>
            </form>

            <div className="mt-10 text-center text-[16px] text-[#6d6d6d]">
              <span>Already have an account? </span>
              <Link
                href="/login"
                className="font-bold uppercase tracking-[0.04em] text-[#2a9388] transition hover:text-[#046667]"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
