'use client';

import { FormEvent, useState } from 'react';

import RegisterSection from '@/components/section/auth/register-screen-section';
import { useApi } from '@/hooks/useApi/props.api';
import { RegisterForm } from '@/types/form/auth';

const RegisterContainer = () => {
  const service = useApi();

  const registerMutate = service.auth.mutation.register();

  const [formRegister, setFormRegister] = useState<RegisterForm>({
    fullname: '',
    idenfier: '',
    password: '',
    role: 'USER',
  });

  const [visible, setVisble] = useState<boolean>(false);

  const handleRegister = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const payload: any = {
      fullName: formRegister.fullname,
      password: formRegister.password,
      role: formRegister.role,
    };
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formRegister.idenfier);

    if (isEmail) {
      payload.email = formRegister.idenfier;
    } else {
      payload.phone = formRegister.idenfier;
    }
    registerMutate.mutate(payload);
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
