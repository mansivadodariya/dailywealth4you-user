import React from 'react';
import styles from './profitSharing.module.scss';
import ProfitSharingCard from './profitSharingCard';
import ProfitSharingHeader from './profitSharingHeader';
import ProfitSharingTable from './profitSharingTable';
import Mt5Account from '@/components/modal/Mt5Account';
import UseExisting from '@/components/modal/useExisting';
import DepositModal from '@/components/modal/depositModal';
import WithdrawModal from '@/components/modal/withdrawModal';
import KycModal from '@/components/modal/KycModal';
import KycSubmitted from '@/components/modal/KycSubmitted';
import KycFinalModal from '@/components/modal/KycFinalModal';

export default function ProfitSharing() {
  return (
    <div>
      <ProfitSharingCard />
      <ProfitSharingHeader />
      <ProfitSharingTable />
      {/* <KycModal /> */}
      {/* <KycFinalModal/> */}
      {/* <KycSubmitted/> */}
      {/* <Mt5Account /> */}
      {/* <UseExisting /> */}
      {/* <DepositModal /> */}
      {/* <WithdrawModal /> */}
    </div>
  );
}
