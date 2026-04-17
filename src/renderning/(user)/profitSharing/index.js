import React from 'react'
import styles from './profitSharing.module.scss';
import ProfitSharingCard from './profitSharingCard';
import ProfitSharingHeader from './profitSharingHeader';
import ProfitSharingTable from './profitSharingTable';
import Mt5Account from '@/components/modal/Mt5Account';
import UseExisting from '@/components/modal/useExisting';
import DepositModal from '@/components/modal/depositModal';
import WithdrawModal from '@/components/modal/withdrawModal';
export default function ProfitSharing() {
    return (
        <div>
            <ProfitSharingCard />
            <ProfitSharingHeader />
            <ProfitSharingTable />
            {/* <Mt5Account /> */}
            {/* <UseExisting /> */}
            {/* <DepositModal /> */}
            <WithdrawModal />
        </div>
    )
}
