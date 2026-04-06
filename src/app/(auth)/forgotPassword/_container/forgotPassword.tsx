'use client';

import ForgotPasswordSection from '@/components/section/auth/forgotPassword-screen-section';
import { useApi } from '@/hooks/useApi/props.api';
import { ForgotPasswordForm } from '@/types/form/auth';
import { FormEvent, useState } from 'react';

const ForgotPasswordContainer = () => {
  const service = useApi();
  const forgotMutate = service.auth.mutation.forgot();

  const [formForgot, setFormForgot] = useState<ForgotPasswordForm>({
    idenfier: '',
  });

  const handleForgot = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    forgotMutate.mutate({
      identifikasi: formForgot.idenfier,
    } as any);
  };

  return (
    <main className="w-full min-h-screen">
      <ForgotPasswordSection
        service={{
          mutate: {
            isPending: forgotMutate.isPending,
            onForgot: handleForgot,
          },
        }}
        state={{
          formForgot,
          setFormForgot,
        }}
      />
    </main>
  );
};

export default ForgotPasswordContainer;
