'use client';

import { useState } from 'react';
import styles from './filterDropdown.module.scss';
import FilterIcon from '@/icons/filterIcon';
import FilterModal from '@/components/modal/filterModal';

export default function FilterDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={styles.filterdropdown}>
        <button
          className={isOpen ? styles.active : ''}
          onClick={() => setIsOpen(true)}
        >
          Filter
          <FilterIcon />
        </button>
      </div>

      {isOpen && <FilterModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
