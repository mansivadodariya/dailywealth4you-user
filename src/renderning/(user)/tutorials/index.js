'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTutorials } from '@/store/slice/accountSlice';
import styles from './tutorials.module.scss';
import Pagination from '@/components/pagination';

export default function Tutorials() {
  const dispatch = useDispatch();
  const { tutorials, tutorialsLoading, tutorialsError, tutorialsTotalPages } =
    useSelector((state) => state?.account);

  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 12;

  useEffect(() => {
    dispatch(fetchTutorials({ page: currentPage, limit: LIMIT }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (tutorialsLoading) {
    return (
      <div className={styles.loadingState}>
        {Array.from({ length: LIMIT }).map((_, i) => (
          <div key={i} className={styles.skeletonItem}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonText} />
          </div>
        ))}
      </div>
    );
  }

  if (tutorialsError) {
    return (
      <p className={styles.errorText}>
        Failed to load tutorials. Please try again.
      </p>
    );
  }
  const handleClick = (tutorial) => {
    if (tutorial?.videoUrl) {
      window.open(tutorial.videoUrl, '_blank');
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {tutorials?.map((tutorial) => (
          <div key={tutorial?.id} className={styles.item}>
            {/* Bordered box — thumbnail only */}
            <div className={styles.card}>
              <img
                src={tutorial?.thumbnail}
                alt={tutorial?.title || 'Tutorial'}
                className={styles.thumbnail}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
                onClick={() => handleClick(tutorial)}
              />
              {/* <div className={styles.playOverlay}>
                <div className={styles.playIcon}>▶</div>
              </div> */}
            </div>

            {/* Text outside the card */}
            <p className={styles.title}>
              {tutorial?.description || 'Untitled'}
            </p>
          </div>
        ))}
      </div>

      {tutorials?.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={tutorialsTotalPages}
          onPageChange={handlePageChange}
        />
      )}

      {!tutorialsLoading && tutorials?.length === 0 && (
        <p className={styles.emptyText}>No tutorials available.</p>
      )}
    </div>
  );
}
