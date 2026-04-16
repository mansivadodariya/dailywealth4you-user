import React from 'react'
import styles from './profitSharing.module.scss';
import ProfitSharingCard from './profitSharingCard';
import ProfitSharingHeader from './profitSharingHeader';
import ProfitSharingTable from './profitSharingTable';
export default function ProfitSharing() {
    return (
        <div>
            <ProfitSharingCard />
            <ProfitSharingHeader />
            <ProfitSharingTable />
        </div>
    )
}
