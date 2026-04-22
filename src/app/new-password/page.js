import NewPassword from '@/renderning/newPassword';
import React, { Suspense } from 'react';

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPassword />
    </Suspense>
  );
}
