'use client';

import OtpSection from '@/components/section/general/otp-screen-section';
import { useApi } from '@/hooks/useApi/props.api';
import { OtpForm } from '@/types/form/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

const OtpContainer = () => {
  const service = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();

  const verifyMutate = service.auth.mutation.verify();
  const resendMutate = service.auth.mutation.resend();

  const identifier = searchParams.get('identifier') ?? '';
  const target = searchParams.get('target') ?? '/login';
  const isEmailIdentifier = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier),
    [identifier]
  );

  const [formOtp, setFormOtp] = useState<OtpForm>({ otp: '' });

  const handleVerify = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!identifier || !isEmailIdentifier || !formOtp.otp) {
      return;
    }

    verifyMutate.mutate(
      {
        email: identifier,
        otp: formOtp.otp,
      },
      {
        onSuccess: () => {
          if (target.includes('reset')) {
            router.push(`${target}?identifier=${encodeURIComponent(identifier)}`);
            return;
          }
          router.push(target);
        },
      }
    );
  };

  const handleResend = () => {
    if (!identifier || !isEmailIdentifier) {
      return;
    }

    resendMutate.mutate({
      email: identifier,
    });
  };

  return (
    <main className="w-full min-h-screen">
      <OtpSection
        service={{
          mutate: {
            onVerify: handleVerify,
            onResend: handleResend,
            isPendingVerify: verifyMutate.isPending,
            isPendingResend: resendMutate.isPending,
          },
        }}
        state={{
          formOtp,
          setFormOtp,
          identifier,
          target,
        }}
      />
    </main>
  );
};

export default OtpContainer;
