'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import KycModal from '@/components/modal/KycModal';
import KycSubmitted from '../modal/KycSubmitted';
import KycRejected from '../modal/KycRejected';
import { fetchAllDocument } from '@/store/slice/accountSlice';
import { getUserFromCookie } from '@/service/cookies';
import Loader from '../Loader';

export default function KycGuard({ children }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const { kycStatus, kycStatusLoading, kycRejectionReason } = useSelector(
    (state) => state.account
  );

  const [mounted, setMounted] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // If kycStatus hasn't been fetched yet (e.g. page refresh), fetch it now
  useEffect(() => {
    if (!mounted) return;
    if (kycStatus === undefined && !kycStatusLoading) {
      const cookieUser = getUserFromCookie();
      const userId = user?.id || cookieUser?.id;
      if (userId) {
        dispatch(fetchAllDocument(userId));
      }
    }
  }, [mounted, kycStatus, kycStatusLoading, user, dispatch]);

  if (!mounted) return null;

  if (!user) {
    return (
      <Loader
        fullScreen
        variant="dots"
        size="large"
        color="success"
        text="Loading ..."
      />
    );
  }

  // Still loading the document status — show nothing (or a spinner)
  if (kycStatus === undefined || kycStatusLoading) {
    return (
      <Loader
        fullScreen
        variant="dots"
        size="large"
        color="success"
        // text="Loading ..."
      />
    );
  }

  // No document submitted yet
  if (kycStatus === null) {
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
        rejectionMessage={kycRejectionReason}
        onSubmitAgain={() => setShowKycModal(true)}
      />
    );
  }

  // Fallback — unknown status, show upload modal
  return <KycModal />;
}
