'use client';
import React, { useEffect } from 'react';
import styles from './introducing-broker.module.scss';
import AuthButton from '@/components/authButton';
import { useDispatch, useSelector } from 'react-redux';
import { applyIbRequest, fetchIbUserRequest } from '@/store/slice/ibUserSlice';
import { getUserFromCookie } from '@/service/cookies';
import Loader from '@/components/Loader';

const RightIcon = '/assets/icons/right.svg';

export default function IntroducingBroker() {
  const dispatch = useDispatch();
  const { loading, ibRequestStatus, ibRequestLoading } = useSelector(
    (state) => state.ibUser
  );

  useEffect(() => {
    const user = getUserFromCookie();
    if (user?.id) {
      dispatch(fetchIbUserRequest(user.id));
    }
  }, [dispatch]);

  const handleSubmit = () => {
    const user = getUserFromCookie();
    if (!user?.id) return;
    dispatch(applyIbRequest({ userId: user.id }));
  };

  // Still loading IB status
  if (ibRequestLoading) {
    return (
      <Loader fullScreen={true} variant="dots" size="large" color="success" />
    );
  }

  // Pending — show waiting state
  if (ibRequestStatus === 'pending') {
    return (
      <div className={styles.wrapper}>
        <div className={styles.modal}>
          <img
            src="/assets/icons/Ibuser.svg"
            alt="broker"
            style={{ width: 200, height: 210 }}
          />
          <h2 className={styles.title}>Your IB request is under review</h2>
          <p className={styles.subtitle}>
            We will notify you once your request is approved.
          </p>
        </div>
      </div>
    );
  }

  // Not applied yet — show apply form
  return (
    <div className={styles.wrapper}>
      <div className={styles.modal}>
        <img
          src="/assets/icons/Ibuser.svg"
          alt="broker"
          style={{ width: 180, height: 180, marginRight: 50 }}
        />
        <h2 className={styles.title}>
          Please apply to start receiving commissions
        </h2>
        <div className={styles.buttonWrapper}>
          <AuthButton
            text={loading ? 'Applying...' : 'Apply'}
            icon={RightIcon}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}
