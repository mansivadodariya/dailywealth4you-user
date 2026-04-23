'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBrokers } from '@/store/slice/accountSlice';
import styles from './recommendedBrokers.module.scss';
import Pagination from '@/components/pagination';
import Mt5Account from '@/components/modal/Mt5Account';

const LIMIT = 12;

export default function RecommendedBrokers() {
  const dispatch = useDispatch();
  const { brokers, loading } = useSelector((state) => state.account);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBroker, setSelectedBroker] = useState(null);
  const [showMt5Modal, setShowMt5Modal] = useState(false);

  useEffect(() => {
    dispatch(fetchBrokers({ page: currentPage, limit: LIMIT })).then((res) => {
      const payload = res?.payload?.payload || res?.payload;
      const pages = payload?.totalPages || payload?.pagination?.totalPages || 1;
      setTotalPages(pages);
    });
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBrokerClick = (broker) => {
    setSelectedBroker(broker);
    setShowMt5Modal(true);
  };

  if (loading) {
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

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          {brokers?.map((broker) => (
            <div
              key={broker?.id || broker?._id}
              className={styles.item}
              onClick={() => handleBrokerClick(broker)}
            >
              {/* Bordered box — logo only */}
              <div className={styles.card}>
                <img
                  src={broker?.logo}
                  alt={broker?.name}
                  className={styles.brokerLogo}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                <span className={styles.logoFallback}>{broker?.name}</span>
              </div>

              {/* Text outside the card */}
              <p className={styles.description}>
                {broker?.description || broker?.name}
              </p>
            </div>
          ))}
        </div>

        {!loading && brokers?.length === 0 && (
          <p className={styles.emptyText}>No brokers available.</p>
        )}

        {brokers?.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {showMt5Modal && (
        <Mt5Account
          preSelectedBroker={selectedBroker}
          onClose={() => {
            setShowMt5Modal(false);
            setSelectedBroker(null);
          }}
        />
      )}
    </>
  );
}
