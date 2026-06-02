import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { theme } from '@/configs/theme.config';
import { ResetPasswordForm } from '@/types/form/auth';

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

interface ResetSectionProps {
  state: {
    formReset: ResetPasswordForm;
    setFormReset: React.Dispatch<React.SetStateAction<ResetPasswordForm>>;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
    identifier: string;
  };
  service: {
    mutate: {
      onReset: (event?: React.FormEvent<HTMLFormElement>) => void;
      isPending: boolean;
    };
  };
}

const ResetSection: React.FC<ResetSectionProps> = ({ state, service }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isConfirmMismatch =
    state.formReset.confirmPassword.length > 0 &&
    state.formReset.password !== state.formReset.confirmPassword;

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
          Secure Access
        </div>

        {/* Divider */}
        <div
          className="absolute bottom-[calc(15%+8px)] left-12 w-11 h-[1.5px] z-[4]"
          style={{ backgroundColor: `${theme.primary.background}80` }}
        />

        {/* Tagline */}
        <p className="absolute bottom-[calc(15%-50px)] left-[50px] z-[4] text-white/35 text-[12.5px] tracking-[0.14em] font-light">
          Protect your account with a strong password.
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

        {/* Back button */}
        <div className="absolute top-6 left-8 z-10">
          <Link
            href="/login"
            className="flex items-center gap-2 transition-colors duration-200"
            style={{ color: theme.primary.background }}
          >
            <ArrowLeft size={16} />
            <span className="text-[12px] font-medium tracking-[0.05em]">Back</span>
          </Link>
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
            Reset
          </h1>
          <p
            className="text-[12.5px] tracking-[0.06em] mb-7"
            style={{ color: theme.muted.foreground }}
          >
            Create a new password for your account
          </p>

          <form noValidate onSubmit={service.mutate.onReset} className="space-y-6">
            {/* ── New Password ── */}
            <div>
              <Label
                className="block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
                style={{ color: theme.primary.background }}
              >
                New Password
              </Label>
              <div
                className="flex items-center gap-[11px] border-b-[1.5px] pb-[9px] transition-colors duration-200"
                style={{
                  borderBottomColor:
                    focusedField === 'password' ? theme.primary.background : theme.border,
                }}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-[15px] h-[15px] shrink-0 transition-colors duration-200"
                  style={{
                    color:
                      focusedField === 'password'
                        ? theme.primary.background
                        : theme.muted.foreground,
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
                  id="password"
                  name="password"
                  type={state.visible ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={state.formReset.password}
                  onChange={(e) =>
                    state.setFormReset((prev) => ({ ...prev, password: e.target.value }))
                  }
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-gray-400 placeholder:opacity-100"
                  style={{ color: theme.foreground }}
                />
              </div>
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <Label
                className="block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
                style={{ color: theme.primary.background }}
              >
                Confirm Password
              </Label>
              <div
                className="flex items-center gap-[11px] border-b-[1.5px] pb-[9px] transition-colors duration-200"
                style={{
                  borderBottomColor:
                    focusedField === 'confirmPassword' ? theme.primary.background : theme.border,
                }}
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="w-[15px] h-[15px] shrink-0 transition-colors duration-200"
                  style={{
                    color:
                      focusedField === 'confirmPassword'
                        ? theme.primary.background
                        : theme.muted.foreground,
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
                  placeholder="Confirm your password"
                  value={state.formReset.confirmPassword}
                  onChange={(e) =>
                    state.setFormReset((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent border-none outline-none text-[14px] placeholder:text-gray-400 placeholder:opacity-100"
                  style={{ color: theme.foreground }}
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

            {/* Error Message */}
            {isConfirmMismatch && (
              <p
                className="text-sm text-center rounded-md py-2"
                style={{
                  color: theme.destructive.background,
                  backgroundColor: `${theme.destructive.background}10`,
                }}
              >
                Passwords do not match
              </p>
            )}

            {/* Identifier Info */}
            <div
              className="text-[12px] rounded-md p-3 border-l-2"
              style={{
                backgroundColor: `${theme.info.background}10`,
                borderLeftColor: theme.info.background,
                color: theme.info.background,
              }}
            >
              Resetting password for:{' '}
              <span className="font-semibold break-all">{state.identifier || 'N/A'}</span>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={service.mutate.isPending || !state.identifier || isConfirmMismatch}
              className="flex items-center gap-[9px] rounded-full px-9 py-[13px] text-[13px] font-bold tracking-[0.13em] uppercase transition-all duration-200 hover:-translate-y-0.5 w-full"
              style={{
                backgroundColor: theme.primary.background,
                color: theme.primary.foreground,
                opacity:
                  service.mutate.isPending || !state.identifier || isConfirmMismatch ? 0.65 : 1,
                cursor:
                  service.mutate.isPending || !state.identifier || isConfirmMismatch
                    ? 'not-allowed'
                    : 'pointer',
                boxShadow: `0_10px_28px_${theme.primary.background}48`,
              }}
            >
              {service.mutate.isPending ? (
                <>
                  <span className="w-[14px] h-[14px] rounded-full border-2 border-white/35 border-t-white animate-spin shrink-0" />
                  Saving...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>

          {/* Register strip */}
          <div
            className="mt-[22px] pt-5 border-t flex items-center justify-between"
            style={{ borderTopColor: `${theme.primary.background}1a` }}
          >
            <span className="text-[13px]" style={{ color: theme.muted.foreground }}>
              Remember your password?
            </span>
            <Link
              href="/login"
              className="flex items-center gap-[5px] text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-200"
              style={{ color: theme.primary.background }}
            >
              Login <ArrowLeft size={12} />
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

export default ResetSection;
