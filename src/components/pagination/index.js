'use client';

import React from 'react';
import styles from './pagination.module.scss';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [goToValue, setGoToValue] = React.useState('');

  const getPages = () => {
    // Always show: 1, 2, 3, ..., 8, 9, 10 style from the image
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 4) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push('...');
    pages.push(totalPages - 1);
    pages.push(totalPages);

    return pages;
  };

  const handleGoTo = (e) => {
    e.preventDefault();
    const page = parseInt(goToValue, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
      setGoToValue('');
    }
  };

  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.left}>
        {/* Prev arrow */}
        <button
          className={styles.arrow}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          ←
        </button>

        {getPages().map((page, idx) =>
          page === '...' ? (
            <span key={`dots-${idx}`} className={styles.dots}>
              ...
            </span>
          ) : (
            <button
              key={page}
              className={`${styles.page} ${currentPage === page ? styles.active : ''}`}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        {/* Next arrow */}
        <button
          className={styles.arrow}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          →
        </button>
      </div>

      <form className={styles.goTo} onSubmit={handleGoTo}>
        <span className={styles.goToLabel}>Go To</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={goToValue}
          onChange={(e) => setGoToValue(e.target.value)}
          className={styles.goToInput}
          aria-label="Go to page"
        />
      </form>
    </div>
  );
}
