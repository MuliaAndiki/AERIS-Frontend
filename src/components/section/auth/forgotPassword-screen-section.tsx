import { ButtonWrapper } from '@/components/wrapper/ButtonWrapper';
import { InputWrapper } from '@/components/wrapper/InputWrapper';
import { ForgotPasswordForm } from '@/types/form/auth';
import Link from 'next/link';

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

const ForgotPasswordSection: React.FC<ForgotPasswordSectionProps> = ({ state, service }) => {
  return (
    <section className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 space-y-4">
        <h1 className="text-2xl font-bold text-primary">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Masukkan email atau nomor telepon akun kamu.
        </p>

        <form className="space-y-3" onSubmit={service.mutate.onForgot}>
          <label htmlFor="identifier" className="text-sm text-primary font-medium">
            Email / Phone
          </label>
          <InputWrapper
            id="identifier"
            name="identifier"
            placeholder="aeris@gmail.com"
            value={state.formForgot.idenfier}
            onChange={(event) =>
              state.setFormForgot((previousState) => ({
                ...previousState,
                idenfier: event.target.value,
              }))
            }
          />

          <ButtonWrapper type="submit" disabled={service.mutate.isPending} className="w-full">
            {service.mutate.isPending ? 'Submitting...' : 'Send Reset Flow'}
          </ButtonWrapper>
        </form>

        <Link href="/login" className="text-sm underline underline-offset-4">
          Back to Login
        </Link>
      </div>
    </section>
  );
};

export default ForgotPasswordSection;
