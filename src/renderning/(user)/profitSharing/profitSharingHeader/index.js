import React from 'react';
import styles from './profitSharingHeader.module.scss';
import Input from '@/components/input';
import FilterDropdown from '../filterDropdown';
import ExportButton from '../exportButton';
const SearchIcon = '/assets/icons/search.svg';
export default function ProfitSharingHeader() {
  return (
    <div className={styles.profitSharingHeader}>
      <div className={styles.leftpanel}>
        <Input
          leftSpacingRemove
          rightIcon={SearchIcon}
          placeholder="Search"
          placeholderWhite
        />
      </div>
      <div className={styles.rightAlignment}>
        <FilterDropdown />
        <ExportButton />
      </div>
    </div>
  );
}
