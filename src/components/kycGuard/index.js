'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import KycModal from '@/components/modal/KycModal';
import KycSubmitted from '../modal/KycSubmitted';
import KycRejected from '../modal/KycRejected';

export default function KycGuard({ children }) {
  const user = useSelector((state) => state.login.user);

  const [mounted, setMounted] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!user) {
    return <div style={{ color: '#fff' }}>Loading...</div>;
  }

  const kycStatus = user?.isKYCVerified;

  // No KYC started yet — show upload modal
  if (kycStatus === null || kycStatus === undefined) {
    return <KycModal />;
  }

  if (kycStatus === 'pending') {
    return <KycSubmitted />;
  }

  if (kycStatus === 'approved') {
    return children;
  }

  if (kycStatus === 'rejected') {
    if (showKycModal) {
      return <KycModal />;
    }
    return (
      <KycRejected
        rejectionMessage={user?.kycRejectionReason}
        onSubmitAgain={() => setShowKycModal(true)}
      />
    );
  }

  return <KycModal />;
}
