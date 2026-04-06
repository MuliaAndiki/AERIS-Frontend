'use client';

import RegisterSection from '@/components/section/auth/register-screen-section';
import { useApi } from '@/hooks/useApi/props.api';
import { RegisterForm } from '@/types/form/auth';
import { FormEvent, useState } from 'react';

const RegisterContainer = () => {
  const service = useApi();

  const registerMutate = service.auth.mutation.register();

  const [formRegister, setFormRegister] = useState<RegisterForm>({
    fullname: '',
    idenfier: '',
    password: '',
  });

  const [visible, setVisble] = useState<boolean>(false);

  const handleRegister = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    registerMutate.mutate({
      fullName: formRegister.fullname,
      identifikasi: formRegister.idenfier,
      password: formRegister.password,
      role: 'USER',
    } as any);
  };

  return (
    <main className="w-full min-h-screen overflow-y-hidden">
      <RegisterSection
        service={{

          mutate: {
            
            isPending: registerMutate.isPending,
            onRegister: handleRegister,
          },
        }}
        state={{
          formRegister: formRegister,
          setFormRegister: setFormRegister,
          setVisible: setVisble,
          visible: visible,
        }}
      />
    </main>
  );
};

export default RegisterContainer;
