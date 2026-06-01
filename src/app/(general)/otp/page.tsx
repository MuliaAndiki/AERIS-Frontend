import { Suspense } from 'react';

import OtpContainer from './_container/otp';

function OtpPageFallback() {
  return <main className="min-h-screen w-full bg-background" aria-busy aria-label="Memuat halaman OTP" />;
}

export default function OtpPage() {
  return (
    <Suspense fallback={<OtpPageFallback />}>
      <OtpContainer />
    </Suspense>
  );
}
