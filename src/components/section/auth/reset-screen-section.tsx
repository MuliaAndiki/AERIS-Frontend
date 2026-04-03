import { ButtonWrapper } from '@/components/wrapper/ButtonWrapper';
import { InputWrapper } from '@/components/wrapper/InputWrapper';
import { ResetPasswordForm } from '@/types/form/auth';
import Link from 'next/link';

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
    <section className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 space-y-4">
        <h1 className="text-2xl font-bold text-primary">Reset Password</h1>
        <p className="text-sm text-muted-foreground break-all">
          Identifier: {state.identifier || '-'}
        </p>

        <form className="space-y-3" onSubmit={service.mutate.onReset}>
          <label htmlFor="password" className="text-sm text-primary font-medium">
            New Password
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

          <label htmlFor="confirmPassword" className="text-sm text-primary font-medium">
            Confirm Password
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

        <Link href="/login" className="text-sm underline underline-offset-4">
          Back to Login
        </Link>
      </div>
    </section>
  );
};

export default ResetSection;
