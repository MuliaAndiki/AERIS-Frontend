import { ButtonWrapper } from '@/components/wrapper/ButtonWrapper';
import { InputWrapper } from '@/components/wrapper/InputWrapper';
import { ResetPasswordForm } from '@/types/form/auth';
import Link from 'next/link';
import Image from 'next/image';
import { FieldDescription } from '@/components/ui/field';

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
  const isConfirmMismatch =
    state.formReset.confirmPassword.length > 0 &&
    state.formReset.password !== state.formReset.confirmPassword;

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
            <h1 className="text-5xl font-extrabold text-primary">RESET PASSWORD</h1>
            <Image alt="icon" src={'/images/logo.png'} width={40} height={40} />
          </div>
          <form
            className="w-full flex justify-center flex-col  space-y-3 z-2 "
            onSubmit={service.mutate.onReset}
          >
            <label htmlFor="password" className="text-lg text-primary font-light">
              New Password:
            </label>
            <InputWrapper
              id="password"
              name="password"
              type={state.visible ? 'text' : 'password'}
              value={state.formReset.password}
              onChange={(event) =>
                state.setFormReset((previousState) => ({
                  ...previousState,
                  password: event.target.value,
                }))
              }
            />
            <label htmlFor="confirmPassword" className="text-lg text-primary font-light">
              Confirm Password:
            </label>
            <InputWrapper
              id="confirmPassword"
              name="confirmPassword"
              type={state.visible ? 'text' : 'password'}
              value={state.formReset.confirmPassword}
              onChange={(event) =>
                state.setFormReset((previousState) => ({
                  ...previousState,
                  confirmPassword: event.target.value,
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

            {isConfirmMismatch && (
              <p className="text-sm text-destructive">Password confirmation does not match.</p>
            )}

            <ButtonWrapper
              type="submit"
              disabled={service.mutate.isPending || !state.identifier || isConfirmMismatch}
              className="w-full"
            >
              {service.mutate.isPending ? 'Saving...' : 'Reset Password'}
            </ButtonWrapper>
          </form>
          <div className="w-full flex flex-col items-center">
            <FieldDescription className="text-center">
              Remember your password?{' '}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </FieldDescription>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetSection;
