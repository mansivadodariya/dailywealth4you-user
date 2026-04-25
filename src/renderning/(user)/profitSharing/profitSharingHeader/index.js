import React from 'react';
import DataTableHeader from '@/components/common/DataTableHeader';
import FilterModal from '@/components/modal/filterModal';

export default function ProfitSharingHeader({ onSearch }) {
  return <DataTableHeader onSearch={onSearch} filterModal={<FilterModal />} />;
}
