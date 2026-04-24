'use client';

import React, { useState } from 'react';
import styles from './tablePageLayout.module.scss';
import FilterIcon from '@/icons/filterIcon';
import FileIcon from '@/icons/fileIcon';
import Pagination from '@/components/pagination';

const SearchIcon = '/assets/icons/search.svg';

export default function TablePageLayout({
  children,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onSearch,
  onFilter,
  onExport,
  showPagination = true,
}) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
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
          <button className={styles.actionBtn} onClick={onFilter}>
            Filter
            <FilterIcon />
          </button>
          <button className={styles.actionBtn} onClick={onExport}>
            Export
            <FileIcon />
          </button>
        </div>
      </div>

      {/* Table content */}
      <div className={styles.tableArea}>{children}</div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
