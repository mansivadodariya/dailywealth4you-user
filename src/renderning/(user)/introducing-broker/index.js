'use client';
import React from 'react';
import styles from './introducing-broker.module.scss';
import AuthButton from '@/components/authButton';
import { useDispatch, useSelector } from 'react-redux';
import { applyIbRequest } from '@/store/slice/ibUserSlice';
import { getUserFromCookie } from '@/service/cookies';
import ProfitSharing from '../profitSharing';

const RightIcon = '/assets/icons/right.svg';

export default function IntroducingBroker() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ibUser);

  const handleSubmit = () => {
    const user = getUserFromCookie();
    if (!user?.id) {
      console.error('User ID not found');
      return;
    }

    const payload = {
      userId: user.id,
      status: 'pending',
    };

    dispatch(applyIbRequest(payload));
  };

  return (
    <>
      <ProfitSharing />
      {/* <div className={styles.wrapper}>
      <div className={styles.modal}>
        
   
        <img
          src="/images/link-icon.png" //  apna icon path
          alt="broker"
          style={{ width: 80 }}
        />

        <h2 className={styles.title}>
          Please apply to start receiving commissions
        </h2>

        <AuthButton
          text={loading ? "Applying..." : "Apply"}
          icon={RightIcon}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div> */}
    </>
  );
}
