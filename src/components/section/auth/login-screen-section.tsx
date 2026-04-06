import { Button } from '@/components/ui/button';
import { Field, FieldDescription } from '@/components/ui/field';
import { ButtonWrapper } from '@/components/wrapper/ButtonWrapper';
import { InputWrapper } from '@/components/wrapper/InputWrapper';
import { LoginForm } from '@/types/form/auth';
import Link from 'next/link';
import Image from 'next/image';

interface LoginSectionProps {
  state: {
    formLogin: LoginForm;
    setFormLogin: React.Dispatch<React.SetStateAction<LoginForm>>;
    visible: boolean;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  };
  service: {
    mutate: {
      onLogin: () => void;
      isPending: boolean;
    };
  };
}

const LoginSection: React.FC<LoginSectionProps> = ({ state, service }) => {
  return (
    <section className="w-full h-screen flex justify-center items-center relative ">
      <div className="absolute left-5 top-0 z-1 ">
        <Image alt="helay" src={'/req/helay.png'} width={1050} height={1050} />
      </div>
      <div className="absolute left-40 bottom-[-40] translate-y-10 z-1 ">
        <Image alt="helay" src={'/req/helay1.png'} width={850} height={850} />
      </div>
      <div className="w-full h-full grid lg:grid-cols-[1fr_2fr]">
        <div className="w-full h-full relative border">
          <Image
            alt="daun"
            placeholder="empty"
            src={'/req/daun.png'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover"
          />
        </div>

        <div className="w-full flex justify-center items-center flex-col p-10  lg:p-30 space-y-5">
          <div className="w-full flex items-center  justify-between">
            <h1 className="text-5xl font-extrabold text-primary">LOGIN</h1>
            <Image alt="icon" src={'/images/logo.png'} width={40} height={40} />
          </div>
          <form
            className="w-full flex justify-center flex-col  space-y-3 z-2 "
            onSubmit={service.mutate.onLogin}
          >
            <label htmlFor="email" className="text-lg text-primary font-light">
              Email/Phone:
            </label>
            <InputWrapper
              id="email"
              name="idenfier"
              placeholder="Aeris@gmail.com"
              value={state.formLogin.idenfier}
              onChange={(event) =>
                state.setFormLogin((previousState) => ({
                  ...previousState,
                  idenfier: event.target.value,
                }))
              }
            />
            <label htmlFor="email" className="text-lg text-primary font-light">
              Password:
            </label>
            <InputWrapper
              id="password"
              name="password"
              type={state.visible ? 'text' : 'password'}
              value={state.formLogin.password}
              onChange={(event) =>
                state.setFormLogin((previousState) => ({
                  ...previousState,
                  password: event.target.value,
                }))
              }
              rightIcon={
                <button
                  type="button"
                  onClick={() => state.setVisible((previousState) => !previousState)}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {state.visible ? 'Hide' : 'Show'}
                </button>
              }
            />

            <ButtonWrapper type="submit" disabled={service.mutate.isPending}>
              {service.mutate.isPending ? 'Signing in...' : 'Login'}
            </ButtonWrapper>
          </form>
          <div className="w-full flex flex-col items-center">
            <Field>
              <Button variant="outline" type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                    fill="currentColor"
                  />
                </svg>
                Login with GitHub
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </FieldDescription>
            </Field>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginSection;
