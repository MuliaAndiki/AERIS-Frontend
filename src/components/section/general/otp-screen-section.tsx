import { ButtonWrapper } from '@/components/wrapper/ButtonWrapper';
import { InputWrapper } from '@/components/wrapper/InputWrapper';
import { OtpForm } from '@/types/form/auth';

interface OtpSectionProps {
  state: {
    formOtp: OtpForm;
    setFormOtp: React.Dispatch<React.SetStateAction<OtpForm>>;
    identifier: string;
    target: string;
  };
  service: {
    mutate: {
      onVerify: (event?: React.FormEvent<HTMLFormElement>) => void;
      onResend: () => void;
      isPendingVerify: boolean;
      isPendingResend: boolean;
    };
  };
}

const OtpSection: React.FC<OtpSectionProps> = ({ state, service }) => {
  return (
    <section className="w-full min-h-screen flex justify-center items-center px-4">
      <div className="w-full max-w-md rounded-lg border p-6 space-y-4">
        <h1 className="text-2xl font-bold text-primary">Verify OTP</h1>
        <p className="text-sm text-muted-foreground break-all">
          Identifier: {state.identifier || '-'}
        </p>

        <form className="space-y-3" onSubmit={service.mutate.onVerify}>
          <label htmlFor="otp" className="text-sm text-primary font-medium">
            OTP Code
          </label>
          <InputWrapper
            id="otp"
            name="otp"
            placeholder="123456"
            value={state.formOtp.otp}
            onChange={(event) =>
              state.setFormOtp((previousState) => ({
                ...previousState,
                otp: event.target.value,
              }))
            }
          />

          <ButtonWrapper type="submit" disabled={service.mutate.isPendingVerify} className="w-full">
            {service.mutate.isPendingVerify ? 'Verifying...' : 'Verify OTP'}
          </ButtonWrapper>
        </form>

        <ButtonWrapper
          type="button"
          variant="outline"
          onClick={service.mutate.onResend}
          disabled={service.mutate.isPendingResend}
          className="w-full"
        >
          {service.mutate.isPendingResend ? 'Resending...' : 'Resend OTP'}
        </ButtonWrapper>
      </div>
    </section>
  );
};

export default OtpSection;
