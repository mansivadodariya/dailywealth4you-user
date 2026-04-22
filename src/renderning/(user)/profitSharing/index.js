import React from 'react';
import styles from './profitSharing.module.scss';
import ProfitSharingCard from './profitSharingCard';
import ProfitSharingHeader from './profitSharingHeader';
import ProfitSharingTable from './profitSharingTable';
import EditProfile from '@/components/modal/editProfile';
import ChangePassword from '@/components/modal/changePassword';

export default function ProfitSharing() {
  return (
    <div>
      <ProfitSharingCard />
      <ProfitSharingHeader />
      <ProfitSharingTable />
      {/* <EditProfile /> */}
      <ChangePassword />

    </div>
  );
}
