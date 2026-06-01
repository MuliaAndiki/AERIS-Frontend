import { ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { themeConfig } from '@/configs/theme.config';
import { OtpForm } from '@/types/form/auth';

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

interface OtpSectionProps {
  state: {
    formOtp: OtpForm;
    setFormOtp: React.Dispatch<React.SetStateAction<OtpForm>>;
    identifier: string;
    target: string;
  };
  service: {
    mutate: {
      onVerify: (event?: React.FormEvent<HTMLFormElement>) => void;
      onResend: () => void;
      isPendingVerify: boolean;
      isPendingResend: boolean;
    };
  };
}

const OTP_LENGTH = 6;

const OtpSection: React.FC<OtpSectionProps> = ({ state, service }) => {
  const theme = themeConfig.light;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const digits = state.formOtp.otp.split('').slice(0, OTP_LENGTH);
  while (digits.length < OTP_LENGTH) digits.push('');

  const handleDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[index] = cleaned;
    state.setFormOtp((prev) => ({ ...prev, otp: next.join('') }));
    if (cleaned && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    state.setFormOtp((prev) => ({ ...prev, otp: pasted }));
    const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  const filledCount = digits.filter(Boolean).length;
  const progressPct = (filledCount / OTP_LENGTH) * 100;

  // Mask identifier: show first 3 chars + *** + last 3 chars
  const maskedIdentifier = (() => {
    const id = state.identifier || '';
    if (id.length <= 6) return id;
    return `${id.slice(0, 3)}***${id.slice(-3)}`;
  })();

  return (
    <section
      className={`
        ${outfit.variable} ${cormorant.variable}
        font-[family-name:var(--font-outfit)]
        min-h-screen flex items-center justify-center
        px-4 py-10 relative overflow-hidden
      `}
      style={{ backgroundColor: theme.background }}
    >
      {/* Background blobs */}
      <div
        className="absolute -top-48 -left-48 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(4,102,103,0.08) 0%,transparent 70%)' }}
      />
      <div
        className="absolute -bottom-48 -right-48 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(42,147,136,0.07) 0%,transparent 70%)' }}
      />

      {/* Decorative dashed ring */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none opacity-[0.04]"
        style={{ border: `1.5px dashed ${theme.primary.background}` }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full pointer-events-none opacity-[0.025]"
        style={{ border: `1px dashed ${theme.primary.background}` }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[440px] bg-white/70 backdrop-blur-sm rounded-2xl border px-8 py-10 shadow-[0_20px_60px_rgba(4,102,103,0.09)]"
        style={{ borderColor: `${theme.primary.background}1a` }}
      >
        {/* Top brand strip */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-5 h-px" style={{ backgroundColor: theme.primary.background }} />
            <span
              className="text-[9px] tracking-[0.22em] uppercase"
              style={{ color: theme.primary.background }}
            >
              AERIS
            </span>
          </div>
          {/* Shield icon badge */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${theme.primary.background}14` }}
          >
            <ShieldCheck size={18} style={{ color: theme.primary.background }} />
          </div>
        </div>

        {/* Heading */}
        <h1
          className="
            font-[family-name:var(--font-cormorant)]
            text-[48px] font-bold
            tracking-[0.08em] leading-none mb-2
          "
          style={{ color: theme.primary.background }}
        >
          Verify
        </h1>
        <p
          className="text-[12.5px] tracking-[0.04em] mb-1"
          style={{ color: theme.muted.foreground }}
        >
          Enter the 6-digit code sent to
        </p>
        <p
          className="text-[13px] font-semibold tracking-[0.06em] mb-8"
          style={{ color: `${theme.primary.background}cc` }}
        >
          {maskedIdentifier || '—'}
        </p>

        <form noValidate onSubmit={service.mutate.onVerify}>
          {/* OTP digit inputs */}
          <div className="flex items-center justify-between gap-2 mb-3">
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="w-[52px] h-[58px] text-center text-[22px] font-bold rounded-xl border-[1.5px] outline-none transition-all duration-200"
                style={{
                  backgroundColor: digit ? 'white' : theme.background,
                  color: theme.primary.background,
                  caretColor: theme.primary.background,
                  borderColor: digit ? `${theme.primary.background}99` : theme.border,
                  boxShadow: digit ? `0_2px_8px_${theme.primary.background}1a` : 'none',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = theme.primary.background;
                  e.currentTarget.style.boxShadow = `0_0_0_3px_${theme.primary.background}1f`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.backgroundColor = digit ? 'white' : theme.background;
                  e.currentTarget.style.borderColor = digit
                    ? `${theme.primary.background}99`
                    : theme.border;
                  e.currentTarget.style.boxShadow = digit
                    ? `0_2px_8px_${theme.primary.background}1a`
                    : 'none';
                }}
              />
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="h-[2px] rounded-full mb-7 overflow-hidden"
            style={{ backgroundColor: `${theme.primary.background}14` }}
          >
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ backgroundColor: theme.primary.background, width: `${progressPct}%` }}
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={service.mutate.isPendingVerify || filledCount < OTP_LENGTH}
            className="w-full flex items-center justify-center gap-[9px] rounded-full py-[14px] text-[13px] font-bold tracking-[0.13em] uppercase transition-all duration-200 hover:-translate-y-0.5"
            style={{
              backgroundColor: theme.primary.background,
              color: theme.primary.foreground,
              opacity: service.mutate.isPendingVerify || filledCount < OTP_LENGTH ? 0.5 : 1,
              cursor:
                service.mutate.isPendingVerify || filledCount < OTP_LENGTH
                  ? 'not-allowed'
                  : 'pointer',
              boxShadow: `0_10px_28px_${theme.primary.background}40`,
            }}
          >
            {service.mutate.isPendingVerify ? (
              <>
                <span className="w-[14px] h-[14px] rounded-full border-2 border-white/35 border-t-white animate-spin shrink-0" />
                Verifying...
              </>
            ) : (
              <>
                Verify Code <ArrowRight size={14} />
              </>
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: `${theme.primary.background}14` }}
          />
          <span
            className="text-[10px] tracking-[0.1em] uppercase"
            style={{ color: theme.muted.foreground }}
          >
            or
          </span>
          <div
            className="flex-1 h-px"
            style={{ backgroundColor: `${theme.primary.background}14` }}
          />
        </div>

        {/* Resend */}
        <button
          type="button"
          onClick={service.mutate.onResend}
          disabled={service.mutate.isPendingResend}
          className="w-full flex items-center justify-center gap-[8px] border-[1.5px] rounded-full py-[11px] px-5 text-[12px] font-semibold tracking-[0.07em] uppercase transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: `${theme.primary.background}28`,
            color: theme.muted.foreground,
          }}
        >
          {service.mutate.isPendingResend ? (
            <>
              <span
                className="w-[13px] h-[13px] rounded-full border-2 animate-spin shrink-0"
                style={{
                  borderColor: `${theme.primary.background}4d`,
                  borderTopColor: theme.primary.background,
                }}
              />
              Resending...
            </>
          ) : (
            <>
              <RefreshCw size={13} />
              Resend Code
            </>
          )}
        </button>

        {/* Footer note */}
        <p
          className="text-center text-[11px] tracking-[0.04em] mt-6 leading-relaxed"
          style={{ color: theme.muted.foreground }}
        >
          Code expires in{' '}
          <span className="font-semibold" style={{ color: theme.primary.background }}>
            5 minutes
          </span>
          .
          <br />
          Check your spam folder if you don&apos;t see it.
        </p>

        {/* Bottom brand line */}
        <div className="flex items-center justify-center gap-[6px] mt-7 opacity-20">
          <div className="w-[18px] h-px" style={{ backgroundColor: theme.primary.background }} />
          <span
            className="text-[9px] tracking-[0.2em] uppercase"
            style={{ color: theme.primary.background }}
          >
            AERIS &copy; 2025
          </span>
          <div className="w-[18px] h-px" style={{ backgroundColor: theme.primary.background }} />
        </div>
      </div>
    </section>
  );
};

export default OtpSection;
