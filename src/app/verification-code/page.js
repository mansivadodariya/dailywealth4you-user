import { Suspense } from 'react';
import VerificationCode from '@/renderning/verificationCode';
import React from 'react';

export default function page() {
  return (
    <div>
      <Suspense fallback={null}>
        <VerificationCode />
      </Suspense>
    </div>
  );
}
