'use client';

import React, { useState } from 'react';
import styles from './DataTableHeader.module.scss';
import FilterIcon from '@/icons/filterIcon';
import FileIcon from '@/icons/fileIcon';

const SearchIcon = '/assets/icons/search.svg';

export default function DataTableHeader({
  onSearch,
  onFilter,
  onExport,
  filterModal, // optional: pass a filter modal component to render
}) {
  const [searchValue, setSearchValue] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <img
            src={SearchIcon}
            alt="Search"
            className={styles.searchIcon}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search"
            value={searchValue}
            onChange={handleSearch}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={() => {
              setShowFilter(true);
              if (onFilter) onFilter();
            }}
          >
            Filter
            <FilterIcon />
          </button>
          <button className={styles.actionBtn} onClick={onExport}>
            Export
            <FileIcon />
          </button>
        </div>
      </div>

      {/* Render filter modal if provided */}
      {filterModal &&
        showFilter &&
        React.cloneElement(filterModal, {
          onClose: () => setShowFilter(false),
        })}
    </>
  );
}
