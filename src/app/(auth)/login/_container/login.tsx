'use client';
import LoginSection from '@/components/section/auth/login-screen-section';
import { useApi } from '@/hooks/useApi/props.api';
import { LoginForm } from '@/types/form/auth';
import { FormEvent, useState } from 'react';

const LoginContainer = () => {
  const service = useApi();

  //mutate
  const loginMutate = service.auth.mutation.login();

  //state
  const [formLogin, setFormLogin] = useState<LoginForm>({
    idenfier: '',
    password: '',
  });

  const [visible, setVisble] = useState<boolean>(false);

  //handler
  const handleLogin = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const payload: any = {
      password: formLogin.password,
    };
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formLogin.idenfier);

    if (isEmail) {
      payload.email = formLogin.idenfier;
    } else {
      payload.phone = formLogin.idenfier;
    }

    loginMutate.mutate(payload);
  };

  return (
    <main className="w-full min-h-screen overflow-y-hidden">
      <LoginSection
        service={{
          mutate: {
            isPending: loginMutate.isPending,
            onLogin: handleLogin,
          },
        }}
        state={{
          formLogin: formLogin,
          setFormLogin: setFormLogin,
          setVisible: setVisble,
          visible: visible,
        }}
      />
    </main>
  );
};

export default LoginContainer;
