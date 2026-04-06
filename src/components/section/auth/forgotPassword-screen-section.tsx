import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import { ForgotPasswordForm } from '@/types/form/auth';
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

interface ForgotPasswordSectionProps {
  state: {
    formForgot: ForgotPasswordForm;
    setFormForgot: React.Dispatch<React.SetStateAction<ForgotPasswordForm>>;
  };
  service: {
    mutate: {
      onForgot: (event?: React.FormEvent<HTMLFormElement>) => void;
      isPending: boolean;
    };
  };
}

type ForgotMethod = 'email' | 'phone';

const ForgotPasswordSection: React.FC<ForgotPasswordSectionProps> = ({ state, service }) => {
  const [forgotMethod, setForgotMethod] = useState<ForgotMethod>('email');
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
          Recovery
        </div>

        {/* Divider */}
        <div
          className="absolute bottom-[calc(15%+8px)] left-12 w-11 h-[1.5px] z-[4]"
          style={{ backgroundColor: `${theme.primary.background}80` }}
        />

        {/* Tagline */}
        <p className="absolute bottom-[calc(15%-50px)] left-[50px] z-[4] text-white/35 text-[12.5px] tracking-[0.14em] font-light">
          Regain access to your account securely.
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
            Forgot?
          </h1>
          <p
            className="text-[12.5px] tracking-[0.06em] mb-7"
            style={{ color: theme.muted.foreground }}
          >
            We'll help you recover your account
          </p>

          {/* Email / Phone toggle */}
          <div
            className="flex rounded-full p-[3px] mb-7 w-fit"
            style={{ backgroundColor: `${theme.primary.background}14` }}
          >
            {(['email', 'phone'] as ForgotMethod[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setForgotMethod(m)}
                className="flex items-center gap-[7px] rounded-full px-[22px] py-2 text-[12.5px] font-semibold tracking-[0.07em] capitalize transition-all duration-200 cursor-pointer"
                style={{
                  backgroundColor: forgotMethod === m ? theme.primary.background : 'transparent',
                  color: forgotMethod === m ? theme.primary.foreground : theme.secondary.foreground,
                  boxShadow:
                    forgotMethod === m ? `0_5px_18px_${theme.primary.background}48` : 'none',
                }}
              >
                {m === 'email' ? <Mail size={12} /> : <Phone size={12} />}
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          <form noValidate onSubmit={service.mutate.onForgot}>
            {/* ── Identifier ── */}
            <div className="mb-[22px]">
              <Label
                className="block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2"
                style={{ color: theme.primary.background }}
              >
                {forgotMethod === 'email' ? 'Email Address' : 'Phone Number'}
              </Label>
              <div
                className="flex items-center gap-[11px] border-b-[1.5px] pb-[9px] transition-colors duration-200"
                style={{
                  borderBottomColor:
                    focusedField === 'identifier' ? theme.primary.background : theme.border,
                }}
              >
                {forgotMethod === 'email' ? (
                  <Mail
                    size={15}
                    className="shrink-0 transition-colors duration-200"
                    style={{
                      color:
                        focusedField === 'identifier'
                          ? theme.primary.background
                          : theme.muted.foreground,
                    }}
                  />
                ) : (
                  <Phone
                    size={15}
                    className="shrink-0 transition-colors duration-200"
                    style={{
                      color:
                        focusedField === 'identifier'
                          ? theme.primary.background
                          : theme.muted.foreground,
                    }}
                  />
                )}
                <Input
                  type={forgotMethod === 'email' ? 'email' : 'tel'}
                  placeholder={forgotMethod === 'email' ? 'name@email.com' : '+62 81 - 2345 - 6789'}
                  value={state.formForgot.idenfier}
                  onChange={(e) =>
                    state.setFormForgot((prev) => ({ ...prev, idenfier: e.target.value }))
                  }
                  onFocus={() => setFocusedField('identifier')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent border-none outline-none text-[14px]"
                  style={{ color: theme.foreground }}
                />
              </div>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={service.mutate.isPending}
              className="flex items-center justify-center gap-[9px] rounded-full px-9 py-[13px] text-[13px] font-bold tracking-[0.13em] uppercase transition-all duration-200 hover:-translate-y-0.5 w-full"
              style={{
                backgroundColor: theme.primary.background,
                color: theme.primary.foreground,
                boxShadow: `0_10px_28px_${theme.primary.background}48`,
              }}
            >
              {service.mutate.isPending ? (
                <>
                  <span className="w-[14px] h-[14px] rounded-full border-2 border-white/35 border-t-white animate-spin shrink-0" />
                  Submitting...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>

          {/* Back to login */}
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

export default ForgotPasswordSection;
