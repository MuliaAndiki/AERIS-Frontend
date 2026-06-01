'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';

import ResetSection from '@/components/section/auth/reset-screen-section';
import { useApi } from '@/hooks/useApi/props.api';
import { ResetPasswordForm } from '@/types/form/auth';

const ResetContainer = () => {
  const service = useApi();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetMutate = service.auth.mutation.reset();

  const identifier = searchParams.get('identifier') ?? '';
  const isEmailIdentifier = useMemo(
    () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier),
    [identifier]
  );

  const [formReset, setFormReset] = useState<ResetPasswordForm>({
    password: '',
    confirmPassword: '',
  });

  const [visible, setVisible] = useState<boolean>(false);

  const handleReset = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!identifier || !formReset.password || formReset.password !== formReset.confirmPassword) {
      return;
    }

    const payload: any = {
      password: formReset.password,
    };

    if (isEmailIdentifier) {
      payload.email = identifier;
    } else {
      payload.phone = identifier;
    }

    resetMutate.mutate(payload, {
      onSuccess: () => {
        router.push('/login');
      },
    });
  };

  return (
    <main className="w-full min-h-screen">
      <ResetSection
        service={{
          mutate: {
            isPending: resetMutate.isPending,
            onReset: handleReset,
          },
        }}
        state={{
          formReset,
          setFormReset,
          visible,
          setVisible,
          identifier,
        }}
      />
    </main>
  );
};

export default ResetContainer;
