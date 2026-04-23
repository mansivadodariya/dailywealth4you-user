'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import KycModal from '@/components/modal/KycModal';
import KycFinalModal from '@/components/modal/KycFinalModal';

export default function KycGuard({ children }) {
  const user = useSelector((state) => state.login.user);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return <div style={{ color: '#fff' }}>Loading...</div>;
  }

  const kycStatus = user?.isKYCVerified;

  if (kycStatus === null || kycStatus === undefined) {
    return <KycModal />;
  }

  if (kycStatus === 'pending') {
    return <KycFinalModal />;
  }

  if (kycStatus === 'approved') {
    return children;
  }

  return <KycModal />;
}
