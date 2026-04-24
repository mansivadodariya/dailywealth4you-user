'use client';

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// IB Income uses the same UI structure as Profit Sharing
// Wire a different API here when ready
import ProfitSharingCard from '@/renderning/(user)/profitSharing/profitSharingCard';
import ProfitSharingHeader from '@/renderning/(user)/profitSharing/profitSharingHeader';
import ProfitSharingTable from '@/renderning/(user)/profitSharing/profitSharingTable';

export default function IbIncome() {
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: dispatch fetchIbIncome() when the IB Income API is ready
    // dispatch(fetchIbIncome());
  }, [dispatch]);

  return (
    <div>
      <ProfitSharingCard />
      <ProfitSharingHeader />
      <ProfitSharingTable />
    </div>
  );
}
