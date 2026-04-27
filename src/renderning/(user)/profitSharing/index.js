'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchIbProfitSharing } from '@/store/slice/ibUserSlice';
import ProfitSharingCard from './profitSharingCard';
import ProfitSharingHeader from './profitSharingHeader';
import ProfitSharingTable from './profitSharingTable';
import EditProfile from '@/components/modal/editProfile';
import ChangePassword from '@/components/modal/changePassword';
import WithdrawModal from '@/components/modal/withdrawModal';

export default function ProfitSharing() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIbProfitSharing());
  }, [dispatch]);

  return (
    <div>
      <ProfitSharingCard />
      <ProfitSharingHeader />
      <ProfitSharingTable />
      {/* <EditProfile /> */}
      {/* <ChangePassword /> */}
      {/* <WithdrawModal /> */}
    </div>
  );
}
